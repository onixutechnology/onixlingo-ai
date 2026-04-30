from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, Field
from typing import Optional
from app.services.gemini_service import GeminiService

# 🔥 Importamos el Candado VIP
from app.api.deps import get_current_pro_user

# Instanciamos el Router y el Servicio
router = APIRouter()
gemini_service = GeminiService()

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
    # 🔥 SEGURIDAD VIP: Si el usuario es Free, la petición rebota con un Error 403 aquí mismo
    current_user = Depends(get_current_pro_user) 
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