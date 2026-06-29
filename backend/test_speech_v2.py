import asyncio
import os
import sys
from dotenv import load_dotenv

load_dotenv()

# Ensure the backend app module is accessible
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.services.speech_service import SpeechAnalysisService

async def main():
    service = SpeechAnalysisService()
    
    # Let's pick a pre-generated MP3 file to test the STT
    audio_path = os.path.abspath(os.path.join(
        os.path.dirname(__file__), 
        "..", "frontend", "public", "media", "exams", "toeic_listening_v1", "audios", "part2_q7.mp3"
    ))
    
    if not os.path.exists(audio_path):
        print(f"Error: No se encontró el archivo de prueba en {audio_path}")
        return

    print(f"Leyendo audio de prueba: {audio_path}")
    with open(audio_path, "rb") as f:
        audio_bytes = f.read()

    # The original text was something like: "When is the project proposal due? A. By Friday afternoon..."
    target_text = "When is the project proposal due? A. By Friday afternoon. B. Yes, it's a great project. C. I proposed it yesterday."
    
    print("Enviando audio a Google STT + Gemini para análisis...")
    result = await service.process_audio(audio_bytes, target_text)
    
    print("\n=== RESULTADO DEL ANÁLISIS ===")
    print(f"Transcripción detectada: {result.get('transcription')}")
    print(f"Puntaje: {result.get('score')}/100")
    print(f"Feedback: {result.get('feedback')}")

if __name__ == "__main__":
    asyncio.run(main())
