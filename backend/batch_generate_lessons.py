import os
import sys
import json
import asyncio
import time
from dotenv import load_dotenv

# Ensure backend imports work
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env"))

from app.services.curriculum_factory import CATALOG, generate_dynamic_lesson
from google.api_core.exceptions import ResourceExhausted

# Determine target directories for different types of lessons
def get_target_path(lesson_id: str, lang: str = "en") -> str:
    base = r"c:\Users\jeico\onixlingo\language-ai-tutor\backend\app"
    lid = lesson_id.lower()
    
    if "pro" in lid or lid.startswith("exec_") or lid.startswith("bus_"):
        # Put pro lessons here (heuristic)
        # Note: adjust this logic if CATALOG has a property for 'type'
        # Actually, let's just dump all into their respective mapped folders if known, 
        # or default to standard lessons.
        pass
        
    # By default, the system looks for standard lessons in app/data/lessons/{lang}/
    return os.path.join(base, "data", "lessons", lang, f"{lid}.json")

async def generate_all():
    print(f"Starting batch generation of {len(CATALOG)} lessons...")
    
    # We will only generate English ('en') lessons as requested, but can loop langs
    langs = ["en"]
    
    success_count = 0
    fail_count = 0
    skip_count = 0
    
    for lesson_id, meta in CATALOG.items():
        for lang in langs:
            target_path = get_target_path(lesson_id, lang)
            os.makedirs(os.path.dirname(target_path), exist_ok=True)
            
            # Skip if already exists and has exactly 50 exercises (or we can just force overwrite)
            # For this run, we FORCE OVERWRITE to ensure they get the 50 exercises structure
            
            print(f"Generating [{lesson_id}] ({lang})... ", end="", flush=True)
            
            max_retries = 3
            for attempt in range(max_retries):
                try:
                    # Introduce a small pause to avoid instant rate limiting
                    await asyncio.sleep(4) 
                    
                    lesson_data = await generate_dynamic_lesson(lesson_id, lang)
                    
                    # Verify it didn't return the fallback error
                    if not lesson_data.get("stages"):
                        print(f"FAILED (Empty stages returned by Gemini)")
                        fail_count += 1
                        break
                        
                    with open(target_path, 'w', encoding='utf-8') as f:
                        json.dump(lesson_data, f, ensure_ascii=False, indent=2)
                        
                    print("SUCCESS!")
                    success_count += 1
                    break
                    
                except ResourceExhausted:
                    print(f"Rate limited. Waiting 60 seconds... (Attempt {attempt+1}/{max_retries})")
                    await asyncio.sleep(60)
                except Exception as e:
                    print(f"ERROR: {e}")
                    fail_count += 1
                    break
            else:
                print("FAILED after max retries.")
                fail_count += 1

    print("\n" + "="*50)
    print("BATCH GENERATION COMPLETE")
    print(f"Success: {success_count}")
    print(f"Failed:  {fail_count}")
    print(f"Skipped: {skip_count}")
    print("="*50)

if __name__ == "__main__":
    asyncio.run(generate_all())
