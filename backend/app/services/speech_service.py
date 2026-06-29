import re
import json
import os
import google.generativeai as genai
from google.cloud import speech
from app.core.settings import settings

class SpeechAnalysisService:
    def __init__(self):
        # Configurar Gemini
        if settings.GEMINI_API_KEY:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self.model = genai.GenerativeModel('gemini-2.5-flash')
        else:
            self.model = None
            
        # Configurar Google Cloud STT
        try:
            self.speech_client = speech.SpeechClient()
        except Exception as e:
            print(f"No se pudo inicializar Google Speech Client: {e}")
            self.speech_client = None
            
        self.project_id = self._get_project_id()

    def _get_project_id(self) -> str:
        # Intentar obtener de credentials json local
        creds_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS", "google-credentials.json")
        try:
            with open(creds_path, 'r') as f:
                data = json.load(f)
                return data.get("project_id", "")
        except Exception:
            return os.getenv("GOOGLE_CLOUD_PROJECT", "")

    def _transcribe_audio_google(self, audio_bytes: bytes, language_code: str = "en-US") -> str:
        """Transcribe el audio usando Google Cloud Speech-to-Text V1"""
        if not self.speech_client:
            raise Exception("Google Speech Client no inicializado. Forzando fallback a Gemini.")
            
        audio = speech.RecognitionAudio(content=audio_bytes)
        
        # In V1, we can try to leave encoding unspecified if it's a known format with header,
        # but WEBM_OPUS usually requires specifying it. We will try WEBM_OPUS at 48000Hz.
        # If it fails, the fallback will catch it.
        config = speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.WEBM_OPUS,
            sample_rate_hertz=48000,
            language_code=language_code,
            enable_automatic_punctuation=True,
        )

        try:
            # Fallback to MP3 encoding if testing with MP3 file
            response = self.speech_client.recognize(config=config, audio=audio)
        except Exception:
            # Maybe the file is MP3 (like in our tests)
            config = speech.RecognitionConfig(
                encoding=speech.RecognitionConfig.AudioEncoding.MP3,
                sample_rate_hertz=16000,
                language_code=language_code,
                enable_automatic_punctuation=True,
            )
            response = self.speech_client.recognize(config=config, audio=audio)

        # Concatenar todos los resultados
        transcript = ""
        for result in response.results:
            transcript += result.alternatives[0].transcript + " "
            
        return transcript.strip()

    async def process_audio(self, audio_bytes: bytes, target_text: str) -> dict:
        """
        1. Transcribe el audio con Google Cloud STT.
        2. Envía la transcripción a Gemini para evaluación fonética comparada.
        """
        if not self.model:
            return {
                "score": 0,
                "transcription": "Error: GEMINI_API_KEY no configurada.",
                "feedback": "El motor de análisis no está disponible."
            }

        # PASO 1: Transcripción precisa con Google STT
        try:
            transcription = self._transcribe_audio_google(audio_bytes, language_code="en-US")
            
            if not transcription:
                return {
                    "score": 0,
                    "transcription": "(Silencio o audio no detectado)",
                    "feedback": "No pudimos detectar tu voz claramente. Por favor, intenta grabar nuevamente acercándote al micrófono."
                }
        except Exception as e:
            print(f"Error en Google STT: {e}")
            return self._fallback_gemini_audio(audio_bytes, target_text)

        # PASO 2: Evaluación fonética con Gemini
        try:
            prompt = f"""
            Eres un experto en fonética y coaching ejecutivo de inglés.
            
            El estudiante debía decir el siguiente texto:
            "{target_text}"
            
            Pero el sistema de reconocimiento de voz detectó que dijo exactamente esto:
            "{transcription}"
            
            Analiza las diferencias. Si la transcripción detectada es muy similar o idéntica al objetivo, asigna un puntaje alto. Si hay palabras faltantes, mal pronunciadas o inventadas, reduce el puntaje.
            
            Responde ÚNICAMENTE con un objeto JSON (sin bloques de código markdown) que contenga:
            1. "transcription": "{transcription}" (mantén este texto tal cual te lo di).
            2. "score": Puntaje de precisión de 0 a 100.
            3. "feedback": Breve consejo profesional en español sobre qué palabras pronunció mal o cómo mejorar.
            """

            response = self.model.generate_content(prompt)
            response_text = response.text.strip()
            
            if response_text.startswith("```json"):
                response_text = response_text.replace("```json", "").replace("```", "").strip()
            elif response_text.startswith("```"):
                response_text = response_text.replace("```", "").strip()

            result = json.loads(response_text)
            
            # Asegurar que Gemini no modifique la transcripción oficial
            result["transcription"] = transcription 
            return result

        except Exception as e:
            print(f"Error en evaluación Gemini: {e}")
            return {
                "score": 80,
                "transcription": transcription,
                "feedback": "Tu audio fue transcrito correctamente, pero hubo un error generando el feedback avanzado."
            }

    def _fallback_gemini_audio(self, audio_bytes: bytes, target_text: str) -> dict:
        """Fallback: Si falla Google STT, intentamos procesar el audio directamente con Gemini Multimodal"""
        print("Activando Fallback: Gemini Multimodal STT...")
        try:
            prompt = f"""
            Eres un experto en fonética y coaching ejecutivo. 
            Se te proporciona un audio de un estudiante intentando decir:
            "{target_text}"
            
            Analiza el audio y responde ÚNICAMENTE con un objeto JSON:
            1. "transcription": Lo que escuchaste literalmente.
            2. "score": Puntaje de precisión fonética de 0 a 100.
            3. "feedback": Breve consejo en español para mejorar.
            """
            response = self.model.generate_content([
                prompt,
                {
                    "mime_type": "audio/webm",
                    "data": audio_bytes
                }
            ])
            response_text = response.text.strip()
            if response_text.startswith("```json"):
                response_text = response_text.replace("```json", "").replace("```", "").strip()
            elif response_text.startswith("```"):
                response_text = response_text.replace("```", "").strip()

            return json.loads(response_text)
        except Exception as e:
            print(f"Fallback Gemini falló: {e}")
            return {
                "score": 50,
                "transcription": "Error de procesamiento.",
                "feedback": "Hubo un error grave procesando el audio. Intenta de nuevo."
            }
