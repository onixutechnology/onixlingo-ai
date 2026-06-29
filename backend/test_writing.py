import asyncio
import os
import sys
from dotenv import load_dotenv

load_dotenv()
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.services.gemini_service import GeminiService

async def main():
    service = GeminiService()
    
    prompt = "Write a brief email to your team announcing a delay in the Q3 product launch."
    student_text = "Hi team, we are late for the Q3 product launch because the bugs are too many. We will launch in next month. Please work hard."
    
    print("Enviando texto a evaluar...")
    result = await service.evaluate_writing(student_text, prompt)
    
    print("\n=== RESULTADO DEL ANÁLISIS DE WRITING ===")
    print(f"Gramática: {result.get('grammar_score')}/100")
    print(f"Vocabulario: {result.get('vocab_score')}/100")
    print(f"Coherencia: {result.get('coherence_score')}/100")
    print("\nErrores detectados:")
    for m in result.get('mistakes', []):
        print(f"- {m}")
    print(f"\nSugerencia C-Level:\n{result.get('rewrite_suggestion')}")

if __name__ == "__main__":
    asyncio.run(main())
