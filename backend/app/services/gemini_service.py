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
        self.model_name = 'gemini-2.5-flash' 

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

    async def get_response(self, message: str, context: str, mode: str = "practice", ai_config: dict = None) -> Dict[str, Any]:
        """
        Genera la respuesta del tutor evaluando gramática, vocabulario y tono.
        Adaptador inteligente y profesional para el endpoint /chat.
        """
        try:
            model_version = ai_config.get("model_version", self.model_name) if ai_config else self.model_name
            temperature = float(ai_config.get("temperature", 0.7)) if ai_config else 0.7
            sys_prompt = ai_config.get("system_prompt", context) if ai_config else context

            generation_config = {**self.generation_config, "temperature": temperature}

            # Creamos el modelo dinámicamente inyectando el rol e instrucciones de sistema
            model = genai.GenerativeModel(
                model_name=model_version,
                system_instruction=sys_prompt,
                generation_config=generation_config,
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
            model = genai.GenerativeModel('gemini-2.5-flash')
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

    async def generate_chess_lesson_content(self, theme: str) -> Dict[str, str]:
        """
        Genera la instrucción y explicación pedagógica para un puzzle de ajedrez usando IA.
        """
        try:
            model = genai.GenerativeModel(
                model_name=self.model_name,
                generation_config=self.generation_config
            )
            
            prompt = f"""
            Actúa como un Gran Maestro de ajedrez y entrenador de alto rendimiento.
            Estoy enseñando la lección sobre: "{theme}".
            Genera un JSON con tres campos para acompañar un puzzle táctico sobre este tema:
            
            {{
                "title": "String (Un título impactante y motivador de 3 a 5 palabras, ej: 'El Ataque Doble Letal')",
                "instruction": "String (La instrucción para el alumno antes de hacer la jugada. Sé directo y profesional. Máx 15 palabras. Ej: 'Encuentra la bifurcación de caballo que destruye las defensas.')",
                "explanation": "String (La explicación que aparece cuando el alumno ACERTA la jugada. Explica por qué ese concepto táctico fue brillante o clave posicionalmente en 2 oraciones, usando lenguaje avanzado pero pedagógico. Ej: '¡Brillante! El salto a f7 no solo rompe la cadena, sino que colapsa la estructura material del rival.')"
            }}
            """
            response = await model.generate_content_async(prompt)
            response_text = response.text.strip()
            
            if response_text.startswith("```json"):
                response_text = response_text.replace("```json", "").replace("```", "").strip()
            elif response_text.startswith("```"):
                response_text = response_text.replace("```", "").strip()
                
            return json.loads(response_text)
        except Exception as e:
            logger.error(f"Error generando contenido de ajedrez: {e}")
            # Fallback robusto en caso de fallo
            return {
                "title": "Táctica Avanzada",
                "instruction": "Analiza la posición y encuentra el mejor movimiento crítico.",
                "explanation": "¡Excelente jugada! Has encontrado la táctica ganadora en la posición."
            }

    async def evaluate_writing(self, student_text: str, task_prompt: str) -> Dict[str, Any]:
        """
        Evalúa de forma estricta y profesional un texto escrito (ensayo, correo corporativo).
        Diseñado para consumir mínimos tokens exigiendo respuestas muy breves.
        """
        try:
            model = genai.GenerativeModel(
                model_name=self.model_name,
                generation_config=self.generation_config,
                safety_settings=self.safety_settings
            )
            
            prompt = f"""
            Task: Executive/Academic Writing Evaluation.
            Prompt given to student: "{task_prompt}"
            Student's text: "{student_text}"
            
            Analyze grammar, vocabulary, and coherence strictly. Keep it ultra-concise to save tokens.
            
            Return JSON ONLY:
            {{
                "grammar_score": Int (0-100),
                "vocab_score": Int (0-100),
                "coherence_score": Int (0-100),
                "mistakes": ["Brief array of grammar/spelling errors found (max 3 items)"],
                "rewrite_suggestion": "String. Provide ONE highly professional, native C-Level version of the text. Keep it brief."
            }}
            """
            
            response = await model.generate_content_async(prompt)
            result = json.loads(response.text)
            
            # Sanitización rápida
            return {
                "grammar_score": result.get("grammar_score", 0),
                "vocab_score": result.get("vocab_score", 0),
                "coherence_score": result.get("coherence_score", 0),
                "mistakes": result.get("mistakes", []),
                "rewrite_suggestion": result.get("rewrite_suggestion", "N/A")
            }
        except Exception as e:
            logger.error(f"Error in evaluate_writing: {e}")
            return {
                "grammar_score": 0, "vocab_score": 0, "coherence_score": 0,
                "mistakes": ["Error processing evaluation."],
                "rewrite_suggestion": "Please try submitting your text again."
            }

    async def generate_cfo_report(self, stats: dict) -> str:
        """
        Genera un reporte ejecutivo como un CFO de Silicon Valley basado en las analíticas de OnixLingo.
        """
        try:
            model = genai.GenerativeModel(
                model_name=self.model_name,
                generation_config={**self.generation_config, "response_mime_type": "text/plain"},
                safety_settings=self.safety_settings
            )
            
            prompt = f"""
            Actúa como el Chief Financial Officer (CFO) y experto en crecimiento de startups (Silicon Valley).
            Acabo de solicitarte un análisis de nuestra plataforma SaaS educativa (OnixLingo).
            
            Aquí están las métricas de la última proyección:
            - MRR Actual: ${stats.get('current_mrr', 0)}
            - MRR Proyectado (30 días): ${stats.get('projected_mrr', 0)}
            - Crecimiento Esperado: {stats.get('expected_growth_percentage', 0)}%
            - Usuarios en Riesgo Inminente de Churn: {stats.get('churn_risk_count', 0)}
            - Usuarios con Alta Probabilidad de Upgrade (PRO): {stats.get('upgrade_candidates_count', 0)}
            
            Tu tarea: Redacta un Resumen Ejecutivo en español de máximo 2 párrafos cortos. 
            El primer párrafo debe dar un diagnóstico directo, filoso e inteligente de la situación financiera.
            El segundo párrafo debe dar 2 recomendaciones accionables exactas para intervenir y mejorar estos números esta semana.
            
            Sé profesional, conciso y utiliza jerga de startups/finanzas (ej. LTV, Churn, Conversión). No uses saludos largos ni despedidas. Ve directo al grano.
            """
            
            response = await model.generate_content_async(prompt)
            return response.text.strip()
            
        except Exception as e:
            logger.error(f"Error in generate_cfo_report: {e}")
            return "Error de conexión con el modelo predictivo. Por favor, recalcule más tarde."