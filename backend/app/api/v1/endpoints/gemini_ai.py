import json
import re
import logging
import google.generativeai as genai
from typing import Dict, Any
from app.core.config import settings  # Ajusta si tu archivo se llama settings.py

# Configuración de Logging
logger = logging.getLogger("OnixLingo.AI")

class GeminiAI:
    """
    Clase encargada de la comunicación con Google Gemini.
    """

    def __init__(self):
        try:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self.model = genai.GenerativeModel('gemini-pro')
        except Exception as e:
            logger.error(f"❌ Error al inicializar Gemini AI: {e}")
            self.model = None

    def _extract_json(self, text: str) -> Dict[str, Any]:
        """
        Limpia y extrae JSON válido de la respuesta de la IA.
        """
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            match = re.search(r"\{.*\}", text, re.DOTALL)
            if match:
                try:
                    return json.loads(match.group())
                except json.JSONDecodeError:
                    pass
            logger.warning(f"⚠️ No se pudo parsear JSON. Texto recibido: {text[:50]}...")
            return {}

    async def get_response(self, message: str, context: str, mode: str) -> Dict[str, Any]:
        if not self.model:
            return {"text": "AI Core unavailable.", "gesture": "sad"}

        system_instruction = f"""
        ACT AS: {context} (Business English Tutor).
        MODE: {mode}
        USER INPUT: "{message}"
        
        INSTRUCTIONS:
        1. Respond naturally and professionally.
        2. Analyze tone, grammar, and vocabulary.
        3. Suggest executive synonyms.
        4. CRITICAL: Output ONLY valid JSON.
        
        JSON STRUCTURE:
        {{
            "text": "Response text",
            "gesture": "talking|happy|thinking|surprise|stern|listening",
            "analysis": {{
                "correction": "...",
                "vocabulary_upgrade": "...",
                "tone_check": "...",
                "score": 0-100
            }}
        }}
        """

        try:
            chat = self.model.start_chat(history=[])
            response = await chat.send_message_async(system_instruction)
            clean_data = self._extract_json(response.text)
            
            if "text" not in clean_data:
                clean_data["text"] = "Processing error."
                clean_data["gesture"] = "thinking"
                
            return clean_data

        except Exception as e:
            logger.error(f"🔥 Gemini Failure: {str(e)}")
            return {"text": "Connection interrupted.", "gesture": "confused", "analysis": None}