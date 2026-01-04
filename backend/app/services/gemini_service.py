import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold
from app.core.settings import settings
import json
import logging
from typing import Dict, Any, Optional

# Configuración de Logging
logger = logging.getLogger("OnixLingo.GeminiService")

class GeminiService:
    def __init__(self):
        # 1. Configuración Global
        if not settings.GEMINI_API_KEY:
            logger.critical("❌ FALTA GEMINI_API_KEY. La IA no funcionará.")
        
        genai.configure(api_key=settings.GEMINI_API_KEY)
        
        # 2. Configuración de Seguridad (Permisiva para contexto educativo)
        # Evita que bloquee discusiones inocuas sobre cultura o errores gramaticales.
        self.safety_settings = {
            HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_ONLY_HIGH,
            HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_ONLY_HIGH,
            HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_ONLY_HIGH,
            HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        }

        # 3. Configuración de Generación (JSON MODE ACTIVO)
        # Esto es clave: Forzamos a la API a devolver siempre JSON.
        self.generation_config = {
            "temperature": 0.7, # Creativo pero controlado
            "top_p": 0.95,
            "top_k": 64,
            "max_output_tokens": 1024,
            "response_mime_type": "application/json", # <--- LA MAGIA ENTERPRISE
        }
        
        # Modelo base (Usamos Flash por velocidad y bajo costo)
        self.model_name = 'gemini-1.5-flash' 

    async def get_chat_response(self, message: str, context_instruction: str) -> Dict[str, Any]:
        """
        Genera una respuesta de chat actuando bajo un rol específico.
        """
        try:
            # 1. Instanciación Dinámica del Modelo
            # Creamos el modelo "on the fly" para inyectarle la personalidad (System Instruction)
            # específica de ESTA lección (ej: Examinador TOEIC vs Tutor Amable).
            model = genai.GenerativeModel(
                model_name=self.model_name,
                system_instruction=context_instruction, # Inyección directa al sistema
                generation_config=self.generation_config,
                safety_settings=self.safety_settings
            )

            # 2. Generación de Contenido
            # Nota: Al usar response_mime_type="application/json", no necesitamos pedirle JSON en el prompt,
            # pero ayuda reforzar la estructura de campos que queremos.
            prompt = f"""
            User Input: "{message}"
            
            Based on your role, reply to the user.
            Ensure your JSON response adheres to this schema:
            {{
                "text": "String. The spoken response in the target language.",
                "correction": "String or Null. If the user made a grammar mistake, explain it here briefly.",
                "gesture": "String. One of: [talking, listening, happy, thinking, explaining, surprise]",
                "analysis": {{
                    "score": Integer (0-100, optional estimation of user input quality),
                    "grammar_check": "String (Short feedback)"
                }}
            }}
            """
            
            response = await model.generate_content_async(prompt)
            
            # 3. Parsing Directo (Sin Regex)
            # Gracias al modo JSON, response.text SIEMPRE es un JSON válido.
            return json.loads(response.text)

        except json.JSONDecodeError:
            logger.error("❌ Gemini devolvió un JSON malformado (raro en modo JSON).")
            return {
                "text": "I encountered a system error processing your response.",
                "gesture": "confused",
                "analysis": None
            }
        except Exception as e:
            logger.error(f"❌ Error en Gemini API: {e}")
            return {
                "text": "Connection to AI server interrupted.",
                "gesture": "sad",
                "analysis": None
            }

    # --- GENERADORES AUXILIARES (Legacy support) ---
    
    async def analyze_speech(self, target: str, transcript: str) -> Dict[str, Any]:
        """
        Evalúa pronunciación comparando texto esperado vs transcripción.
        """
        try:
            model = genai.GenerativeModel(
                model_name=self.model_name,
                generation_config=self.generation_config
            )
            
            prompt = f"""
            Compare target text vs user transcript.
            Target: "{target}"
            User: "{transcript}"
            
            Output JSON:
            {{
                "score": Int (0-100 accuracy),
                "feedback": "String (Specific words mispronounced)",
                "missed_words": ["Array", "of", "words"]
            }}
            """
            response = await model.generate_content_async(prompt)
            return json.loads(response.text)
        except Exception as e:
            logger.error(f"Speech Analysis Error: {e}")
            return {"score": 0, "feedback": "Error analyzing speech."}