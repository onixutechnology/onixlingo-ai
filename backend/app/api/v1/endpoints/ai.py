from fastapi import APIRouter, HTTPException, status, Depends, Response
from pydantic import BaseModel, Field
from typing import Optional
from app.services.gemini_service import GeminiService
from app.services.gcp_tts_service import GcpTtsService

# 🔥 Importamos el Candado VIP
from app.api.deps import get_current_executive_user

# Instanciamos el Router y el Servicio
router = APIRouter()
gemini_service = GeminiService()
tts_service = GcpTtsService()

# --- MODELOS DE DATOS (DTOs) ---
class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, description="El mensaje del usuario")
    context: str = Field(..., description="Rol del Tutor (Ej: 'CEO de Tech Company')")
    mode: Optional[str] = Field("practice", description="Modo de la sesión: practice, exam, negotiation")

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

# --- ENDPOINT ---

@router.post("/chat", response_model=ChatResponse, summary="Interactuar con el Tutor IA")
async def chat_endpoint(
    request: ChatRequest,
    # 🔥 SEGURIDAD VIP: Si el usuario es Free o Pro, la petición rebota con un Error 403 aquí mismo
    current_user = Depends(get_current_executive_user) 
):
    """
    Endpoint principal para el chat con IA.
    Delega la lógica compleja al GeminiService y valida la respuesta con Pydantic.
    """
    
    # 1. Llamada al Servicio (Lógica de Negocio)
    service_response = await gemini_service.get_response(
        message=request.message,
        context=request.context,
        mode=request.mode
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

    return ChatResponse(
        text=service_response.get("text", "Error processing response"),
        gesture=service_response.get("gesture", "neutral"),
        analysis=analysis_model
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