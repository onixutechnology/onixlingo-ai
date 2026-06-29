from fastapi import APIRouter, HTTPException, status, Depends, Response
from pydantic import BaseModel, Field
from typing import Optional
from sqlalchemy.orm import Session
from datetime import datetime, time

from app.services.gemini_service import GeminiService
from app.services.gcp_tts_service import GcpTtsService
from app.database import get_db
from app.db.models import AIPracticeLog, AIConfiguration

# 🔥 Importamos los Cadeneros
from app.api.deps import get_current_active_user, get_current_executive_user

# Instanciamos el Router y el Servicio
router = APIRouter()
gemini_service = GeminiService()
tts_service = GcpTtsService()

# --- MODELOS DE DATOS (DTOs) ---
class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, description="El mensaje del usuario")
    context: str = Field(..., description="Rol del Tutor (Ej: 'CEO de Tech Company')")
    mode: Optional[str] = Field("practice", description="Modo de la sesión: practice, exam, negotiation")
    lang: Optional[str] = Field("en", description="Idioma de la sesión: en, fr, zh")

class AnalysisData(BaseModel):
    correction: Optional[str] = None
    score: Optional[int] = Field(None, ge=0, le=100)
    vocabulary_upgrade: Optional[str] = Field(None, description="Sugerencia de vocabulario C-Level")
    tone_check: Optional[str] = Field(None, description="Evaluación del tono")

class ChatResponse(BaseModel):
    text: str
    gesture: str
    audio_url: Optional[str] = None
    analysis: Optional[AnalysisData] = None

class WritingRequest(BaseModel):
    prompt: str = Field(..., description="The prompt or question given to the student")
    text: str = Field(..., min_length=10, description="The student's written response")

class WritingEvaluation(BaseModel):
    grammar_score: int
    vocab_score: int
    coherence_score: int
    mistakes: list[str]
    rewrite_suggestion: str

# --- ENDPOINT ---

@router.post("/chat", response_model=ChatResponse, summary="Interactuar con el Tutor IA")
async def chat_endpoint(
    request: ChatRequest,
    current_user = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Endpoint principal para el chat con IA.
    Permite acceso Free (con límite de 3) y uso ilimitado para PRO/Executive.
    """
    user_tier = current_user.tier or "free"
    is_admin = getattr(current_user, "role", "student") == "admin"
    
    if not is_admin and user_tier == "free":
        today_start = datetime.combine(datetime.utcnow().date(), time.min)
        practice_count = db.query(AIPracticeLog).filter(
            AIPracticeLog.user_id == current_user.id,
            AIPracticeLog.created_at >= today_start
        ).count()
        
        if practice_count >= 3:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Has consumido tus 3 interacciones de IA gratuitas de hoy. Sube a PRO o EXECUTIVE para chat ilimitado."
            )
            
    # 0. Configuración Dinámica de IA desde DB
    engine_name_map = {"en": "english_tutor", "fr": "french_tutor", "zh": "chinese_tutor"}
    engine_key = engine_name_map.get(request.lang, "english_tutor")
    ai_conf = db.query(AIConfiguration).filter(AIConfiguration.engine_name == engine_key).first()
    
    conf_dict = None
    if ai_conf:
        conf_dict = {
            "model_version": ai_conf.model_version,
            "temperature": float(ai_conf.temperature) if ai_conf.temperature else 0.7,
            "system_prompt": f"{ai_conf.system_prompt}\nRol adicional asignado al tutor: {request.context}"
        }

    # 1. Llamada al Servicio (Lógica de Negocio)
    service_response = await gemini_service.get_response(
        message=request.message,
        context=request.context,
        mode=request.mode,
        ai_config=conf_dict
    )

    # 2. Mapeo y Validación de Respuesta
    analysis_content = service_response.get("analysis")
    
    analysis_model = None
    if analysis_content:
        analysis_model = AnalysisData(
            correction=analysis_content.get("correction"),
            score=analysis_content.get("score"),
            vocabulary_upgrade=analysis_content.get("vocabulary_upgrade"),
            tone_check=analysis_content.get("tone_check")
        )

    if not is_admin:
        log_entry = AIPracticeLog(user_id=current_user.id, action_type="chat")
        db.add(log_entry)
        db.commit()

    return ChatResponse(
        text=service_response.get("text", "Error processing response"),
        gesture=service_response.get("gesture", "neutral"),
        analysis=analysis_model
    )

# --- NUEVO ENDPOINT DE EVALUACIÓN DE WRITING ---
@router.post("/evaluate-writing", response_model=WritingEvaluation, summary="Evaluar un ensayo o texto escrito (Writing)")
async def evaluate_writing_endpoint(
    request: WritingRequest,
    current_user = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Evalúa un texto escrito por el usuario (ej: un correo corporativo, ensayo IELTS).
    Permite acceso Free limitado (3 usos compartidos de IA).
    """
    user_tier = current_user.tier or "free"
    is_admin = getattr(current_user, "role", "student") == "admin"
    
    if not is_admin and user_tier == "free":
        today_start = datetime.combine(datetime.utcnow().date(), time.min)
        practice_count = db.query(AIPracticeLog).filter(
            AIPracticeLog.user_id == current_user.id,
            AIPracticeLog.created_at >= today_start
        ).count()
        
        if practice_count >= 3:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Has consumido tus 3 interacciones de IA gratuitas de hoy. Sube a PRO o EXECUTIVE para evaluación ilimitada."
            )

    evaluation = await gemini_service.evaluate_writing(
        student_text=request.text,
        task_prompt=request.prompt
    )
    
    if not is_admin:
        log_entry = AIPracticeLog(user_id=current_user.id, action_type="writing")
        db.add(log_entry)
        db.commit()
    
    return WritingEvaluation(
        grammar_score=evaluation.get("grammar_score", 0),
        vocab_score=evaluation.get("vocab_score", 0),
        coherence_score=evaluation.get("coherence_score", 0),
        mistakes=evaluation.get("mistakes", []),
        rewrite_suggestion=evaluation.get("rewrite_suggestion", "")
    )

# --- NUEVO ENDPOINT DE TEXT-TO-SPEECH ---
@router.get("/tts", summary="Generar audio de alta fidelidad con Google Cloud TTS")
async def tts_endpoint(text: str, lang: str = "en", translate_to: Optional[str] = None):
    """
    Sintetiza texto a voz ultra-realista utilizando Google Cloud TTS.
    Opcionalmente traduce el texto de entrada al idioma 'translate_to' mediante Gemini antes de la síntesis.
    Retorna directamente el archivo de audio MP3 para reproducción nativa.
    """
    if not text:
        raise HTTPException(status_code=400, detail="El parámetro 'text' es requerido.")
    
    text_to_speak = text
    synthesis_lang = lang

    if translate_to:
        target_name = "español" if translate_to.lower() == "es" else "francés" if translate_to.lower() == "fr" else translate_to
        text_to_speak = await gemini_service.translate_text(text, target_name)
        synthesis_lang = translate_to
        
    audio_bytes = await tts_service.synthesize_speech(text_to_speak, synthesis_lang)
    
    if not audio_bytes:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al sintetizar el audio con Google Cloud. Verifica la GOOGLE_CLOUD_API_KEY."
        )
        
    return Response(content=audio_bytes, media_type="audio/mpeg")