import google.generativeai as genai
from app.core.settings import settings
import json
import re
from typing import Dict, Any, Optional

class GeminiService:
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        
        # Usamos el modelo especificado.
        # Nota: Si en el futuro necesitas cambiar, 'gemini-1.5-flash' es la alternativa
        # estándar con alto rate limit (15 RPM / 1,500 RPD).
        self.model = genai.GenerativeModel(
            model_name='gemma-3-27b-it' 
        )

    async def _clean_and_parse_json(self, raw_text: str) -> Dict[str, Any]:
        """
        Método auxiliar para limpiar la respuesta de la IA y extraer JSON puro.
        Maneja bloques de markdown y texto extra.
        """
        try:
            # 1. Debug log
            print(f"\n🤖 RAW AI RESPONSE:\n{raw_text[:200]}...\n") # Solo imprimimos el inicio para no ensuciar

            # 2. Regex para encontrar el primer objeto JSON válido { ... }
            # re.DOTALL permite que el punto (.) coincida con saltos de línea
            json_match = re.search(r'\{.*\}', raw_text, re.DOTALL)
            
            if json_match:
                clean_json_str = json_match.group(0)
                return json.loads(clean_json_str)
            else:
                raise ValueError("No JSON found in response")
                
        except json.JSONDecodeError as e:
            print(f"❌ JSON PARSE ERROR: {e}")
            return None
        except Exception as e:
            print(f"❌ GENERAL ERROR: {e}")
            return None

    # --- 1. CHAT CONTEXTUAL (Para el Avatar) ---
    async def get_chat_response(self, message: str, context_instruction: str = "") -> Dict[str, Any]:
        try:
            # Si viene contexto del JSON de la lección (ej: "Eres un mesero..."), lo inyectamos.
            system_role = context_instruction if context_instruction else "You are a helpful Language Tutor."

            prompt = f"""
            ROLE: {system_role}
            USER MESSAGE: "{message}"

            TASK:
            1. Respond naturally to the user in the target language.
            2. If the user makes a grammar mistake, correct it gently in the 'correction' field.
            3. Choose an emotion/gesture.

            CRITICAL: Output ONLY valid JSON.
            {{
                "text": "Your spoken response...",
                "correction": "Correction or null",
                "gesture": "nod" | "shake" | "happy" | "thinking",
                "emotion": "neutral" | "joy" | "surprise"
            }}
            """
            
            response = await self.model.generate_content_async(prompt)
            result = await self._clean_and_parse_json(response.text)
            
            if result: return result
            
            # Fallback
            raise ValueError("Empty result")

        except Exception as e:
            return {
                "text": "Sorry, I lost my train of thought. Can you say that again?",
                "correction": None,
                "gesture": "thinking",
                "emotion": "neutral"
            }

    # --- 2. GENERADOR DE LECCIONES (Para contenido dinámico) ---
    async def generate_structured_lesson(self, topic: str, level: str) -> Dict[str, Any]:
        try:
            prompt = f"""
            Create a structured English lesson for a {level} student.
            Topic: "{topic}"

            Generate STRICT JSON with:
            1. "theory_content": Markdown text explaining the grammar/topic clearly.
            2. "quiz_questions": Array of 3 objects {{ "question", "options": [], "correct_index": int, "explanation" }}.
            3. "avatar_scenario": A short string describing a roleplay scenario for the final practice.

            JSON format only.
            """
            
            response = await self.model.generate_content_async(prompt)
            result = await self._clean_and_parse_json(response.text)
            return result

        except Exception as e:
            print(f"Error generating lesson: {e}")
            return None

    # --- 3. ANALISTA DE ERRORES (Para el Quiz) ---
    async def analyze_mistake(self, question: str, user_answer: str, correct_answer: str) -> Dict[str, Any]:
        try:
            prompt = f"""
            The student made a mistake in a quiz.
            Question: "{question}"
            Correct Answer: "{correct_answer}"
            Student's Answer: "{user_answer}"
            
            Task: Explain briefly WHY the student is wrong (grammar rule). Keep it short (1-2 sentences).
            Output JSON: {{ "feedback": "Explanation here..." }}
            """
            
            response = await self.model.generate_content_async(prompt)
            return await self._clean_and_parse_json(response.text)
            
        except Exception:
            return {"feedback": f"The correct answer was: {correct_answer}"}

    # --- 4. ANALISTA DE PRONUNCIACIÓN (Para lectura) ---
    async def analyze_speech(self, target_text: str, user_transcript: str) -> Dict[str, Any]:
        try:
            prompt = f"""
            Compare these texts for reading accuracy.
            Target: "{target_text}"
            User said: "{user_transcript}"
            
            Task:
            1. Score accuracy (0-100).
            2. Identify mispronounced words.
            
            Output JSON: {{ "score": 85, "feedback": "Good, but watch the word 'X'." }}
            """
            
            response = await self.model.generate_content_async(prompt)
            return await self._clean_and_parse_json(response.text)
            
        except Exception:
            return {"score": 0, "feedback": "Could not analyze audio."}