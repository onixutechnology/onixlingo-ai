import difflib
import re

class SpeechAnalysisService:
    def __init__(self):
        # Aquí podrías inicializar tu cliente de OpenAI si usas Whisper
        # self.client = OpenAI(api_key="TU_API_KEY")
        pass

    def clean_text(self, text: str) -> str:
        """Limpia el texto de puntuación y lo pasa a minúsculas para compararlo."""
        text = text.lower()
        return re.sub(r'[^\w\s]', '', text)

    def calculate_fluency_score(self, original_text: str, transcribed_text: str) -> dict:
        """Compara el texto que el usuario debía leer vs lo que la IA escuchó."""
        clean_original = self.clean_text(original_text)
        clean_transcribed = self.clean_text(transcribed_text)

        # Usamos difflib para calcular la similitud (Precisión)
        sequence = difflib.SequenceMatcher(None, clean_original, clean_transcribed)
        accuracy_ratio = sequence.ratio()
        
        # Convertimos a puntaje del 0 al 100
        score = int(accuracy_ratio * 100)
        
        # Feedback detallado
        if score >= 90:
            feedback = "¡Excelente pronunciación! Suenas casi como un nativo."
        elif score >= 70:
            feedback = "Muy bien. Tuviste algunos errores menores, pero se entiende perfectamente."
        elif score >= 50:
            feedback = "Buen intento. Intenta leer un poco más despacio y articular las palabras clave."
        else:
            feedback = "Hay mucha diferencia. Escucha el audio de ejemplo e inténtalo de nuevo."

        return {
            "score": score,
            "transcription": transcribed_text,
            "feedback": feedback
        }

    async def process_audio(self, audio_bytes: bytes, target_text: str) -> dict:
        """
        Punto de entrada principal.
        En producción, aquí envías 'audio_bytes' a OpenAI Whisper o Google Speech-to-Text.
        """
        try:
            # ==========================================
            # 🚀 AQUÍ IRÍA LA LLAMADA A TU IA REAL
            # Ejemplo con OpenAI Whisper:
            # transcript = await self.client.audio.transcriptions.create(
            #     model="whisper-1", 
            #     file=("audio.webm", audio_bytes)
            # )
            # transcribed_text = transcript.text
            # ==========================================

            # MOCK TEMPORAL PARA QUE PRUEBES EL FRONTEND ANTES DE PAGAR APIS
            transcribed_text = target_text # Simulamos que leyó perfecto
            
            # Calculamos la métrica
            result = self.calculate_fluency_score(target_text, transcribed_text)
            return result

        except Exception as e:
            print(f"Error procesando audio: {e}")
            raise Exception("No se pudo procesar el análisis de voz.")
