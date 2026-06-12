import os
import glob
import json

paths = [
    r'c:\Users\jeico\onixlingo\language-ai-tutor\backend\app\data\lessons\en',
    r'c:\Users\jeico\onixlingo\language-ai-tutor\backend\app\datapro\lessonspro\en',
    r'c:\Users\jeico\onixlingo\language-ai-tutor\backend\app\voclessons\lessons\en'
]

results = {
    "missing": 0,
    "perfect_30": [],
    "many_exercises": [],
    "few_exercises": []
}

for path in paths:
    files = glob.glob(os.path.join(path, '*.json'))
    print(f"{path}: {len(files)} files")
    
    for fpath in files:
        filename = os.path.basename(fpath)
        # Skip mock exams
        if "mock" in filename or "ielts" in filename or "toefl" in filename or "toeic" in filename:
            continue
            
        try:
            with open(fpath, 'r', encoding='utf-8') as f:
                data = json.load(f)
                
            stages = data.get("stages", [])
            total_questions = 0
            
            for stage in stages:
                # Count questions in stage
                questions = stage.get("questions", [])
                total_questions += len(questions)
                # Some stages might use parts instead of questions
                parts = stage.get("parts", [])
                total_questions += len(parts)
                
            if total_questions == 30:
                results["perfect_30"].append(filename)
            elif total_questions > 30:
                results["many_exercises"].append(filename)
            elif total_questions <= 5:
                results["few_exercises"].append(filename)
                
        except Exception as e:
            print(f"Error reading {filename}: {e}")

print(f"\nLessons with exactly 30 exercises: {len(results['perfect_30'])}")
print(f"Lessons with > 30 exercises: {len(results['many_exercises'])}")
print(f"Lessons with <= 5 exercises: {len(results['few_exercises'])}")
if len(results['few_exercises']) > 0:
    print("Examples of <= 5:", results['few_exercises'][:10])

