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

    async def get_response(self, message: str, context: str, mode: str = "practice") -> Dict[str, Any]:
        """
        Genera la respuesta del tutor evaluando gramática, vocabulario y tono.
        Adaptador inteligente y profesional para el endpoint /chat.
        """
        try:
            # Creamos el modelo dinámicamente inyectando el rol e instrucciones de sistema
            model = genai.GenerativeModel(
                model_name=self.model_name,
                system_instruction=context,
                generation_config=self.generation_config,
                safety_settings=self.safety_settings
            )

            prompt = f"""
            User input: "{message}"
            Mode: "{mode}"

            Based on your executive persona, reply to the user.
            Evaluate their grammar, vocabulary (C-Level corporate terminology), and executive tone.
            
            Return a JSON object with the exact keys:
            {{
                "text": "Your natural spoken response to the user in their practice language (English). Be demanding, realistic and professional.",
                "gesture": "talking",
                "analysis": {{
                    "correction": "Explain any grammar mistakes briefly in Spanish, or null if perfect.",
                    "score": 85,
                    "vocabulary_upgrade": "A concrete tip or C-Level vocabulary upgrade (e.g. 'Use leveraged instead of used')",
                    "tone_check": "Brief feedback about their corporate tone (e.g. 'Authoritative and strategic' or 'A bit informal for CFO negotiations')"
                }}
            }}
            
            Choose a fitting executive gesture from: [talking, listening, happy, thinking, explaining, surprise].
            """
            
            response = await model.generate_content_async(prompt)
            response_text = response.text.strip()
            
            # Limpieza en caso de bloques de código markdown
            if response_text.startswith("```json"):
                response_text = response_text.replace("```json", "").replace("```", "").strip()
            elif response_text.startswith("```"):
                response_text = response_text.replace("```", "").strip()
                
            result = json.loads(response_text)
            
            # Sanitización y fallback
            if "text" not in result:
                result["text"] = "I received your proposal, CEO. Let's analyze the synergistic projections."
            if "gesture" not in result:
                result["gesture"] = "explaining"
            if "analysis" not in result or result["analysis"] is None:
                result["analysis"] = {}
                
            analysis = result["analysis"]
            if "score" not in analysis:
                analysis["score"] = 80
            if "correction" not in analysis:
                analysis["correction"] = None
            if "vocabulary_upgrade" not in analysis:
                analysis["vocabulary_upgrade"] = "Structure your pitch using 'synergistic returns' to align with board expectations."
            if "tone_check" not in analysis:
                analysis["tone_check"] = "Strategic and poised."
                
            return result
            
        except Exception as e:
            logger.error(f"Error in Gemini get_response: {e}")
            return {
                "text": "CEO, the strategic direction is clear, but I want to see the specific ROI timeline projections before casting my vote.",
                "gesture": "thinking",
                "analysis": {
                    "correction": None,
                    "score": 82,
                    "vocabulary_upgrade": "Use 'hedging risk' instead of 'mitigating errors'.",
                    "tone_check": "Professional and strategic under pressure."
                }
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

    async def translate_text(self, text: str, target_lang: str = "español") -> str:
        """
        Traduce y adapta un texto técnico/corporativo en inglés a un discurso hablado profesional en el idioma objetivo.
        """
        try:
            model = genai.GenerativeModel('gemini-1.5-flash')
            prompt = f"""
            Translate and adapt the following English business/corporate training slide text into a highly professional, natural spoken explanation in {target_lang}.
            
            Guidelines:
            - It must sound like a C-Level executive or professional business coach speaking naturally, clear and authoritative.
            - Ensure it explains the key concepts fluidly.
            - Avoid literal or robotic translations. Adapt terms correctly.
            - Clean up header text (like "ONIXLINGO EXECUTIVE COMMAND SYSTEM", "Level B1", etc.) and present it as a cohesive spoken paragraph.
            - Do NOT include any markdown, introductory phrases, or structural symbols. Output ONLY the raw translated text to be spoken.
            
            Text:
            "{text}"
            """
            response = await model.generate_content_async(prompt)
            translated_text = response.text.strip()
            if translated_text.startswith("```"):
                translated_text = translated_text.split("\n", 1)[-1].rsplit("\n", 1)[0].strip()
            return translated_text
        except Exception as e:
            logger.error(f"Error in Gemini translation: {e}")
            return text