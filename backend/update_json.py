import json
import os

files_to_update = [
    'app/data/lessons/en/toeic_mock_v1.json'
]

for filepath in files_to_update:
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)

    new_stages = []
    for stage in data.get('stages', []):
        stage_id = stage.get('id', '')
        stage_type = stage.get('type', '')
        
        # Only process listening type
        if stage_type != 'listening':
            new_stages.append(stage)
            continue
            
        # Check if this is the giant part 2 section
        if stage_id == 'part2_main':
            for i, q in enumerate(stage.get('questions', [])):
                q_id = q.get('id') # e.g. q7
                new_stage_id = f"part2_{q_id}"
                
                new_stage = {
                    "id": new_stage_id,
                    "type": "listening",
                    "title": f"Part 2: Question-Response (Question {q_id[1:]})",
                    "instructions": "You will hear a question or statement and three responses spoken in English. Select the best response to the question or statement.",
                    "audioUrl": f"/media/exams/toeic_listening_v1/audios/{new_stage_id}.mp3",
                    "questions": [q]
                }
                new_stages.append(new_stage)
        else:
            # For part 1, part 3, part 4
            stage['audioUrl'] = f"/media/exams/toeic_listening_v1/audios/{stage_id}.mp3"
            new_stages.append(stage)

    data['stages'] = new_stages

    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"Updated {filepath} successfully.")
