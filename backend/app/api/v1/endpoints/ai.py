from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.gemini_service import GeminiService

router = APIRouter()
gemini_service = GeminiService()

class ChatRequest(BaseModel):
    message: str

@router.post("/chat")
async def chat(request: ChatRequest):
    # Aquí llamamos a tu servicio de Gemini perfeccionado
    response = await gemini_service.get_response(request.message)
    return response