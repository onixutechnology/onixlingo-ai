# test_toeic.py
import sys
from pathlib import Path

# Add backend folder to sys.path so we can import app modules
backend_path = Path("c:/Users/jeico/onixlingo/language-ai-tutor/backend").resolve()
sys.path.insert(0, str(backend_path))

from app.services.curriculum_factory import generate_dynamic_lesson

def test_lesson(lesson_id):
    try:
        print(f"\n==========================================")
        print(f"TESTING DYNAMIC LESSON GENERATION FOR: {lesson_id}")
        print(f"==========================================")
        lesson = generate_dynamic_lesson(lesson_id)
        
        print(f"ID: {lesson.get('id')}")
        print(f"Title: {lesson.get('title')}")
        print(f"Level: {lesson.get('level')}")
        print(f"Total XP: {lesson.get('total_xp')}")
        print(f"Version: {lesson.get('version')}")
        print(f"Tags: {lesson.get('tags')}")
        
        stages = lesson.get("stages", [])
        print(f"Total Stages: {len(stages)}")
        
        for stage in stages:
            print(f"\n  Stage ID: {stage.get('id')} - Type: {stage.get('type')} - Title: {stage.get('title')}")
            
            if stage.get("type") == "lecture":
                parts = stage.get("parts", [])
                print(f"    Lecture parts count: {len(parts)}")
                for i, p in enumerate(parts):
                    print(f"      Part {i+1} Audio snippet: {p.get('audio')}")
                    visual_clean = p.get('visual')[:100].replace('★', '*').replace('☞', '->')
                    print(f"      Part {i+1} Visual snippet (first 100 chars):\n{visual_clean}...")
            
            elif stage.get("type") in ["quiz_choice", "order_sentence", "listening_match", "fill_input"]:
                questions = stage.get("questions", [])
                print(f"    Questions count: {len(questions)}")
                if questions:
                    q = questions[0]
                    print(f"      Sample question: {q.get('question')}")
                    print(f"      Sample answer: {q.get('correct_answer') or q.get('correct_answers')}")
                    print(f"      Sample explanation: {q.get('explanation')}")
                    
        print("\n[SUCCESS] Lesson generated perfectly!")
    except Exception as e:
        print(f"\n[ERROR] Failed to generate lesson {lesson_id}: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_lesson("toeic-1")
    test_lesson("toeic-105")
    test_lesson("toeic-200")
