import json

def generate_ielts_phase3():
    json_path = r"c:\Users\jeico\onixlingo\language-ai-tutor\backend\app\data\lessons\en\ielts_mock_v1.json"
    
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    stages = data.get("stages", [])

    # =========================================================================
    # IELTS WRITING (2 Tasks)
    # =========================================================================
    
    # Task 1: Describe a chart (150 words)
    stages.append({
        "id": "ielts_w_task1",
        "type": "writing",
        "title": "Writing Task 1",
        "instructions": "You should spend about 20 minutes on this task. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
        "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Pie_chart_of_world_population.svg/640px-Pie_chart_of_world_population.svg.png", # Placeholder graph
        "passageText": "The pie chart above shows the distribution of the world's population by continent in 2023.",
        "questions": [{
            "id": "w_q1",
            "question": "Summarise the information shown in the pie chart.",
            "options": [],
            "correct_answer": ""
        }]
    })

    # Task 2: Discursive Essay (250 words)
    stages.append({
        "id": "ielts_w_task2",
        "type": "writing",
        "title": "Writing Task 2",
        "instructions": "You should spend about 40 minutes on this task. Write at least 250 words.",
        "passageText": "In many countries today, people in cities either live alone or in small family units, rather than in large, extended family groups. Is this a positive or negative trend?",
        "questions": [{
            "id": "w_q2",
            "question": "Write an essay addressing the topic. Give reasons for your answer and include any relevant examples from your own knowledge or experience.",
            "options": [],
            "correct_answer": ""
        }]
    })

    # =========================================================================
    # IELTS SPEAKING (3 Parts)
    # =========================================================================
    
    # Part 1: Introduction and Interview
    stages.append({
        "id": "ielts_s_part1",
        "type": "speaking",
        "title": "Speaking Part 1: Interview",
        "instructions": "The examiner will ask you general questions about yourself. You have 60 seconds to answer.",
        "passageText": "AUDIO TRANSCRIPT:\\nExaminer: Let's talk about where you live. Do you live in a house or an apartment? What is your favorite room in your home? Would you like to move to a different home in the future?",
        "questions": [{
            "id": "s_q1",
            "question": "Record your answers to the examiner's questions about your home.",
            "options": [],
            "correct_answer": ""
        }]
    })

    # Part 2: Long Turn (Cue Card)
    cue_card = """CUE CARD: Describe a beautiful place you have visited in your country.
    
You should say:
- Where this place is
- How you got there
- What there is to do when you are there
And explain why you recommend this place."""

    stages.append({
        "id": "ielts_s_part2",
        "type": "speaking",
        "title": "Speaking Part 2: Long Turn",
        "instructions": "You will have 1 minute to prepare and up to 2 minutes to speak. Read the cue card and record your response.",
        "passageText": cue_card,
        "questions": [{
            "id": "s_q2",
            "question": "Record your 2-minute monologue based on the cue card.",
            "options": [],
            "correct_answer": ""
        }]
    })

    # Part 3: Discussion
    stages.append({
        "id": "ielts_s_part3",
        "type": "speaking",
        "title": "Speaking Part 3: Discussion",
        "instructions": "The examiner will ask you further questions connected to the topic in Part 2. You have 60 seconds to answer.",
        "passageText": "AUDIO TRANSCRIPT:\\nExaminer: We've been talking about beautiful places. Let's discuss tourism. Do you think tourism has more positive or negative effects on local communities? How can we ensure that tourism is sustainable?",
        "questions": [{
            "id": "s_q3",
            "question": "Record your answers to the examiner's discussion questions.",
            "options": [],
            "correct_answer": ""
        }]
    })

    data["stages"] = stages

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    generate_ielts_phase3()
    print("Successfully generated Phase 3 (Speaking & Writing) of ielts_mock_v1.json")
