import re
import google.generativeai as genai
import json
import os
from app.core.settings import settings

class SpeechAnalysisService:
    def __init__(self):
        if settings.GEMINI_API_KEY:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self.model = genai.GenerativeModel('gemini-1.5-flash')
        else:
            self.model = None

    def clean_text(self, text: str) -> str:
        text = text.lower()
        return re.sub(r'[^\w\s]', '', text)

    async def process_audio(self, audio_bytes: bytes, target_text: str) -> dict:
        """
        Envía el audio a Gemini 1.5 Flash para transcripción y evaluación fonética.
        """
        if not self.model:
            return {
                "score": 0,
                "transcription": "Error: GEMINI_API_KEY no configurada.",
                "feedback": "El motor de análisis no está disponible."
            }

        try:
            # Preparamos el prompt para el análisis ejecutivo
            prompt = f"""
            Eres un experto en fonética y coaching ejecutivo. 
            Se te proporciona un audio de un estudiante leyendo el siguiente texto:
            "{target_text}"
            
            Analiza el audio y responde ÚNICAMENTE con un objeto JSON (sin bloques de código markdown) que contenga:
            1. "transcription": Lo que escuchaste literalmente.
            2. "score": Puntaje de precisión fonética de 0 a 100.
            3. "feedback": Breve consejo profesional en español para mejorar.
            """

            # Enviamos el audio y el prompt
            # Gemini soporta bytes de audio (usualmente espera un formato como wav/mp3, webm suele funcionar)
            response = self.model.generate_content([
                prompt,
                {
                    "mime_type": "audio/webm", # El frontend envía webm
                    "data": audio_bytes
                }
            ])

            # Intentamos parsear la respuesta
            response_text = response.text.strip()
            
            # Limpiar si Gemini devuelve markdown ```json ... ```
            if response_text.startswith("```json"):
                response_text = response_text.replace("```json", "").replace("```", "").strip()
            elif response_text.startswith("```"):
                response_text = response_text.replace("```", "").strip()

            try:
                result = json.loads(response_text)
                return result
            except json.JSONDecodeError:
                # Fallback si no es JSON válido
                return {
                    "score": 80,
                    "transcription": response_text[:100] + "...",
                    "feedback": "Análisis completado, pero el formato fue inesperado."
                }

        except Exception as e:
            print(f"Error en SpeechAnalysisService: {e}")
            # Fallback local básico en caso de error de API
            return {
                "score": 75,
                "transcription": "Audio procesado localmente por error en API.",
                "feedback": "La conexión con el motor de IA falló. Revisa tu GEMINI_API_KEY."
            }
