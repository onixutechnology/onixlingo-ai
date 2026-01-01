from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.gemini_service import GeminiService
import json

router = APIRouter()
ai_service = GeminiService()

class ChatRequest(BaseModel):
    message: str
    context: str = "You are a helpful language tutor."

@router.post("/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        # 1. CORRECCIÓN DE NOMBRE: Usamos 'get_chat_response' (no get_response)
        raw_response = await ai_service.get_chat_response(request.message, request.context)
        
        # 2. MANEJO DE RESPUESTA COMPLEJA (JSON vs TEXTO)
        # Si la IA devuelve un diccionario (objeto), extraemos lo necesario.
        if isinstance(raw_response, dict):
            return {
                "text": raw_response.get("text", "Sorry, I didn't catch that."),
                "gesture": raw_response.get("gesture", "talking"),
                # Puedes enviar 'correction' si quieres mostrarlo en el futuro
                "correction": raw_response.get("correction", None) 
            }
        
        # Si la IA devuelve un string simple (o JSON stringificado), lo manejamos
        if isinstance(raw_response, str):
            # Intentamos ver si es un JSON oculto en un string
            try:
                parsed = json.loads(raw_response)
                if isinstance(parsed, dict):
                     return {
                        "text": parsed.get("text", raw_response),
                        "gesture": parsed.get("gesture", "talking")
                    }
            except:
                pass # No era JSON, es texto plano
                
            return {
                "text": raw_response,
                "gesture": "talking"
            }

        # Fallback por si acaso
        return {"text": str(raw_response), "gesture": "confused"}

    except Exception as e:
        print(f"❌ Error en Gemini Endpoint: {e}")
        # En vez de romper todo con un 500, devolvemos un mensaje de error amigable
        return {
            "text": "My brain is disconnected right now. Please check the python console.",
            "gesture": "sad"
        }