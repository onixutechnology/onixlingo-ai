import os
import json

def fix_lesson_types(directory):
    for filename in os.listdir(directory):
        if filename.endswith(".json") and ("toeic" in filename or "ielts" in filename or "toefl" in filename):
            filepath = os.path.join(directory, filename)
            
            with open(filepath, 'r', encoding='utf-8') as f:
                try:
                    data = json.load(f)
                except json.JSONDecodeError:
                    continue
            
            modified = False
            
            # Recorrer todos los stages y arreglar solo el campo 'type' y agregar el ai_system_prompt si es necesario
            if 'stages' in data:
                for stage in data['stages']:
                    current_type = stage.get('type')
                    
                    if current_type in ['listening', 'reading']:
                        stage['type'] = 'quiz'
                        modified = True
                    
                    elif current_type == 'writing':
                        stage['type'] = 'practice_writing'
                        if 'ai_system_prompt' not in stage:
                            stage['ai_system_prompt'] = "ROLE: IELTS/TOEFL Examiner. Assess Task Achievement, Coherence, Lexical Resource, and Grammatical Range. Provide strict, professional academic feedback."
                        modified = True
                    
                    elif current_type == 'speaking':
                        stage['type'] = 'practice_speaking'
                        modified = True

            if modified:
                with open(filepath, 'w', encoding='utf-8') as f:
                    json.dump(data, f, ensure_ascii=False, indent=2)
                print(f"Fixed types in: {filename}")

if __name__ == "__main__":
    lessons_dir = os.path.join(os.path.dirname(__file__), 'app', 'data', 'lessons', 'en')
    fix_lesson_types(lessons_dir)
