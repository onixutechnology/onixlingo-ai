import json
import logging
import re
import asyncio
from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List

# --- CONFIGURACIÓN ---
logger = logging.getLogger("OnixLingo.AI")
router = APIRouter()

# Aquí importarías tu servicio real cuando tengas la API Key
# from app.services.gemini_service import GeminiService
# ai_service = GeminiService()

# --- MODELOS DE DATOS (Executive Analysis Schema) ---

class ChatRequest(BaseModel):
    message: str
    context: str = Field(..., description="Rol del Tutor (Ej: 'CEO de Tech Company')")
    mode: Optional[str] = "practice" # 'practice', 'exam', 'negotiation'

class AnalysisData(BaseModel):
    correction: Optional[str] = None
    score: Optional[int] = None
    
    # --- CAMPOS NUEVOS (Nivel Directivo) ---
    vocabulary_upgrade: Optional[str] = Field(None, description="Sugerencia de palabra más profesional")
    tone_check: Optional[str] = Field(None, description="Evaluación: professional, aggressive, passive, too_casual")

class ChatResponse(BaseModel):
    text: str
    gesture: str # 'talking', 'happy', 'thinking', 'surprise', 'listening', 'stern'
    audio_url: Optional[str] = None
    analysis: Optional[AnalysisData] = None

# --- UTILS: LIMPIEZA DE LLM ---
def extract_json_from_text(text: str) -> Dict[str, Any]:
    """
    Extrae JSON válido de respuestas sucias de LLMs.
    Soporta bloques Markdown y texto explicativo extra.
    """
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # Regex para encontrar el primer objeto JSON {...}
    # DOTALL permite que el punto capture saltos de línea
    match = re.search(r"\{.*\}", text, re.DOTALL)
    
    if match:
        json_str = match.group()
        try:
            return json.loads(json_str)
        except json.JSONDecodeError:
            logger.error(f"JSON Regex falló: {json_str[:50]}...")
    
    # Fallback de emergencia
    return {
        "text": text, 
        "gesture": "confused", 
        "analysis": {"correction": "Error processing AI response.", "score": 0}
    }

# --- ENDPOINT ---
@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    Motor de IA Conversacional OnixLingo Titanium.
    Genera respuestas habladas y analiza Tono, Vocabulario y Gramática en tiempo real.
    """
    
    # 1. Prompt Engineering (Executive Level)
    # Instrucción diseñada para obligar a Gemini a actuar como evaluador C-Level
    system_instruction = f"""
    ROLE: {request.context}
    TARGET AUDIENCE: C-Level Executives / High-End Professionals.
    
    INSTRUCTION:
    You are the backend for a 3D Avatar Tutor. 
    Analyze the user's input for Business English proficiency.
    
    OUTPUT REQUIREMENTS:
    1. Respond naturally to the conversation.
    2. Analyze the user's tone (is it professional?).
    3. Suggest a "Vocabulary Upgrade" if they use basic words (e.g., 'buy' -> 'acquire').
    4. Provide JSON ONLY. No Markdown.
    
    JSON SCHEMA:
    {{
        "text": "Your spoken response.",
        "gesture": "talking|happy|thinking|surprise|stern",
        "analysis": {{
            "correction": "Grammar fix or null",
            "vocabulary_upgrade": "Better synonym or null",
            "tone_check": "professional|casual|aggressive|passive",
            "score": 0-100
        }}
    }}
    """
    
    logger.info(f"🧠 AI Request: '{request.message[:40]}...' | Context: {request.context}")

    try:
        # 2. LLAMADA AL SERVICIO (Simulación)
        # response_text = await ai_service.generate(request.message, system_instruction)
        
        # --- MOCK PARA PRUEBAS (Simula un análisis real) ---
        await asyncio.sleep(0.6) # Latencia de red
        
        # Simulación: Si el usuario dice algo básico
        mock_response = {
            "text": f"I understand your point about '{request.message}'. However, in a boardroom setting, we should be more precise.",
            "gesture": "thinking",
            "analysis": {
                "correction": None,
                "vocabulary_upgrade": "Consider using 'leverage' instead of 'use'.",
                "tone_check": "too_casual",
                "score": 75
            }
        }
        
        # Si el mensaje es muy corto, simular respuesta rápida
        if len(request.message) < 5:
             mock_response["text"] = "Could you elaborate on that?"
             mock_response["gesture"] = "listening"
        
        response_text = json.dumps(mock_response)
        # ---------------------------------------------------

        # 3. Limpieza y Parsing
        data = extract_json_from_text(response_text)

        # 4. Construcción de Respuesta Tipada
        return ChatResponse(
            text=data.get("text", "I am analyzing your data..."),
            gesture=data.get("gesture", "talking"),
            analysis=AnalysisData(**(data.get("analysis") or {}))
        )

    except Exception as e:
        logger.error(f"🔥 Error Crítico AI: {str(e)}")
        return ChatResponse(
            text="Connection to Neural Core interrupted.",
            gesture="sad",
            analysis=None
        )