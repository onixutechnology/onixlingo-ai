import json
import logging
import re
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any

# Importamos el servicio (Asumimos que ya tienes la lógica de llamada a la API ahí)
from app.services.gemini_service import GeminiService

# 1. Configuración de Logging
logger = logging.getLogger("OnixLingo.AI")

router = APIRouter()
ai_service = GeminiService()

# --- MODELOS DE DATOS (Strict Typing) ---

class ChatRequest(BaseModel):
    message: str
    context: str = Field(
        ..., 
        description="El System Prompt que define la personalidad (Examinador, Tutor, etc.)"
    )
    # Opcional: Para saber si estamos en modo examen
    mode: Optional[str] = "practice" 

class ChatResponse(BaseModel):
    text: str
    gesture: str
    audio_url: Optional[str] = None # Preparado para futuro TTS
    analysis: Optional[Dict[str, Any]] = None # Para feedback de gramática/score

# --- UTILIDADES ---

def clean_json_string(raw_str: str) -> str:
    """
    Limpia la respuesta de la IA si incluye bloques de código Markdown.
    Ej: ```json {data} ``` -> {data}
    """
    cleaned = raw_str.strip()
    # Eliminar bloques de código markdown
    if cleaned.startswith("```"):
        # Buscar el primer '{' y el último '}'
        start = cleaned.find("{")
        end = cleaned.rfind("}")
        if start != -1 and end != -1:
            cleaned = cleaned[start : end + 1]
    return cleaned

# --- ENDPOINT ---

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    Motor de IA Conversacional OnixLingo.
    Fuerza una salida JSON estructurada para controlar el Avatar y el Feedback.
    """
    try:
        # 1. CONSTRUCCIÓN DEL META-PROMPT (Ingeniería de Prompts)
        # Forzamos a Gemini a responder SIEMPRE en JSON, sin importar la personalidad.
        system_instruction = f"""
        {request.context}
        
        [SYSTEM COMMAND - OVERRIDE]
        You MUST respond in strict JSON format using this schema:
        {{
            "text": "Your spoken response here (keep it natural)",
            "gesture": "one of: [talking, happy, thinking, surprise, listening, explaining]",
            "analysis": {{
                "correction": "Optional grammar correction if user made a mistake, else null",
                "score": 0-100 (only if evaluating)
            }}
        }}
        Do NOT output markdown. Do NOT output plain text outside the JSON.
        """

        logger.info(f"🤖 Procesando mensaje: '{request.message[:50]}...' | Modo: {request.context[:30]}...")

        # 2. LLAMADA AL SERVICIO
        # Pasamos el prompt "envenenado" con la estructura JSON forzada
        raw_response = await ai_service.get_chat_response(request.message, system_instruction)

        # 3. PROCESAMIENTO ROBUSTO DE RESPUESTA
        final_data = {}
        
        # Caso A: El servicio ya devolvió un dict (ideal)
        if isinstance(raw_response, dict):
            final_data = raw_response
            
        # Caso B: El servicio devolvió un string (común en LLMs)
        elif isinstance(raw_response, str):
            clean_str = clean_json_string(raw_response)
            try:
                final_data = json.loads(clean_str)
            except json.JSONDecodeError:
                logger.warning(f"⚠️ Falló el parsing JSON. Respuesta cruda: {raw_response}")
                # Fallback de emergencia: convertir texto plano a estructura válida
                final_data = {
                    "text": raw_response, # Usamos todo el texto como respuesta hablada
                    "gesture": "talking",
                    "analysis": None
                }

        # 4. NORMALIZACIÓN DE SALIDA
        # Aseguramos que los campos existan aunque la IA los haya omitido
        return ChatResponse(
            text=final_data.get("text", "I'm having trouble processing that."),
            gesture=final_data.get("gesture", "thinking"),
            analysis=final_data.get("analysis", None)
        )

    except Exception as e:
        logger.error(f"❌ Error crítico en AI Engine: {e}")
        # Respuesta de error elegante para el frontend (no un 500 feo)
        return ChatResponse(
            text="Connection to neural core unstable. Please try again.",
            gesture="sad",
            analysis={"error": str(e)}
        )