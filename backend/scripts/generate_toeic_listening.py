import json
import random

def generate_toeic():
    stages = []
    q_id = 1

    # =========================================================================
    # PART 1: PHOTOGRAPHS (6 questions)
    # =========================================================================
    part1_images = [
        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1000&auto=format&fit=crop", # Meeting
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1000&auto=format&fit=crop", # Lab/Factory
        "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1000&auto=format&fit=crop", # Airport
        "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1000&auto=format&fit=crop", # Office desk
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1000&auto=format&fit=crop", # Handshake
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1000&auto=format&fit=crop"  # Laptop working
    ]

    part1_data = [
        {"ans": "(A) They are attending a meeting.", "opts": ["(A) They are attending a meeting.", "(B) The office is completely empty.", "(C) The man is repairing a computer.", "(D) They are walking outside."]},
        {"ans": "(C) A worker is inspecting the equipment.", "opts": ["(A) The boxes are being loaded onto a truck.", "(B) The woman is sweeping the floor.", "(C) A worker is inspecting the equipment.", "(D) The lights are being turned off."]},
        {"ans": "(B) Passengers are waiting to board.", "opts": ["(A) The airplane is landing on the runway.", "(B) Passengers are waiting to board.", "(C) Luggage is being unloaded from the plane.", "(D) The pilot is walking through the terminal."]},
        {"ans": "(D) Some documents are scattered on the desk.", "opts": ["(A) The monitors have been turned off.", "(B) A person is printing a document.", "(C) The chairs are stacked in the corner.", "(D) Some documents are scattered on the desk."]},
        {"ans": "(A) Two people are shaking hands.", "opts": ["(A) Two people are shaking hands.", "(B) They are exchanging business cards.", "(C) They are putting on their jackets.", "(D) A contract is being signed."]},
        {"ans": "(C) She is typing on a keyboard.", "opts": ["(A) She is drinking a cup of coffee.", "(B) She is looking out the window.", "(C) She is typing on a keyboard.", "(D) She is putting away her glasses."]}
    ]

    for i in range(6):
        stages.append({
            "id": f"part1_q{q_id}",
            "type": "listening",
            "title": f"Part 1: Photographs (Question {q_id})",
            "instructions": "You will see a photograph. You will hear four statements. Choose the statement that best describes what you see in the picture.",
            "imageUrl": part1_images[i],
            "audioUrl": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
            "questions": [{
                "id": f"q{q_id}",
                "question": "Listen to the audio and select the best description.",
                "options": part1_data[i]["opts"],
                "correct_answer": part1_data[i]["ans"]
            }]
        })
        q_id += 1

    # =========================================================================
    # PART 2: QUESTION-RESPONSE (25 questions)
    # =========================================================================
    part2_questions = []
    for i in range(25):
        # We will generate generic corporate questions for Part 2
        topics = ["When is the deadline?", "Who is leading the meeting?", "Where did you put the file?", "Why is the flight delayed?", "How do I fix the printer?"]
        topic = topics[i % len(topics)]
        opts = ["(A) Yes, I did.", "(B) In the conference room.", "(C) By tomorrow afternoon."]
        part2_questions.append({
            "id": f"q{q_id}",
            "question": f"Mark your answer for question {q_id}.",
            "options": ["(A)", "(B)", "(C)"],
            "correct_answer": "(C)" if "When" in topic else "(B)"
        })
        q_id += 1
    
    stages.append({
        "id": "part2_main",
        "type": "listening",
        "title": "Part 2: Question-Response",
        "instructions": "You will hear a question or statement and three responses spoken in English. They will not be printed in your test book and will be spoken only one time. Select the best response to the question or statement.",
        "audioUrl": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        "questions": part2_questions
    })

    # =========================================================================
    # PART 3: CONVERSATIONS (13 conversations x 3 questions = 39 questions)
    # =========================================================================
    for conv_idx in range(13):
        conv_qs = []
        for i in range(3):
            opts = [f"Option A for Q{q_id}", f"Option B for Q{q_id}", f"Option C for Q{q_id}", f"Option D for Q{q_id}"]
            ans = opts[random.randint(0, 3)]
            conv_qs.append({
                "id": f"q{q_id}",
                "question": f"What is discussed in this conversation? (Question {q_id})",
                "options": opts,
                "correct_answer": ans
            })
            q_id += 1
        
        stages.append({
            "id": f"part3_conv_{conv_idx+1}",
            "type": "listening",
            "title": f"Part 3: Conversations (Questions {q_id-3}-{q_id-1})",
            "instructions": "You will hear some conversations between two or more people. You will be asked to answer three questions about what the speakers say in each conversation.",
            "audioUrl": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
            "questions": conv_qs
        })

    # =========================================================================
    # PART 4: TALKS (10 talks x 3 questions = 30 questions)
    # =========================================================================
    for talk_idx in range(10):
        talk_qs = []
        for i in range(3):
            opts = [f"Option A for Q{q_id}", f"Option B for Q{q_id}", f"Option C for Q{q_id}", f"Option D for Q{q_id}"]
            ans = opts[random.randint(0, 3)]
            talk_qs.append({
                "id": f"q{q_id}",
                "question": f"What is the main topic of the talk? (Question {q_id})",
                "options": opts,
                "correct_answer": ans
            })
            q_id += 1
        
        stages.append({
            "id": f"part4_talk_{talk_idx+1}",
            "type": "listening",
            "title": f"Part 4: Talks (Questions {q_id-3}-{q_id-1})",
            "instructions": "You will hear some short talks given by a single speaker. You will be asked to answer three questions about what the speaker says in each short talk.",
            "audioUrl": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
            "questions": talk_qs
        })

    # =========================================================================
    # PART 5: INCOMPLETE SENTENCES (30 questions)
    # =========================================================================
    part5_qs = []
    for i in range(30):
        opts = [f"Word A", f"Word B", f"Word C", f"Word D"]
        part5_qs.append({
            "id": f"q{q_id}",
            "question": f"The new software update will be installed ------- the end of the week.",
            "options": ["by", "until", "in", "at"],
            "correct_answer": "by"
        })
        q_id += 1
    
    stages.append({
        "id": "part5_main",
        "type": "reading",
        "title": "Part 5: Incomplete Sentences",
        "instructions": "A word or phrase is missing in each of the sentences below. Four answer choices are given below each sentence. Select the best answer to complete the sentence.",
        "questions": part5_qs
    })

    # =========================================================================
    # PART 6: TEXT COMPLETION (4 texts x 4 questions = 16 questions)
    # =========================================================================
    for text_idx in range(4):
        txt_qs = []
        for i in range(4):
            txt_qs.append({
                "id": f"q{q_id}",
                "question": f"Select the best option for blank {i+1}.",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correct_answer": "Option A"
            })
            q_id += 1
        
        stages.append({
            "id": f"part6_text_{text_idx+1}",
            "type": "reading",
            "title": f"Part 6: Text Completion (Questions {q_id-4}-{q_id-1})",
            "instructions": "Read the text that follows. A word, phrase, or sentence is missing in parts of each text. Four answer choices for each blank are given below the text.",
            "passageText": "To: All Employees\\nFrom: Management\\nSubject: Annual Leave\\n\\nThis is a reminder that all requests for annual leave must be submitted ----(1)---- the end of November. We ----(2)---- your cooperation in this matter. Please note that ----(3)----. Thank you for your ----(4)----.",
            "questions": txt_qs
        })

    # =========================================================================
    # PART 7: READING COMPREHENSION (54 questions total)
    # =========================================================================
    # We will generate 18 reading passages with 3 questions each = 54 questions
    for pass_idx in range(18):
        pass_qs = []
        for i in range(3):
            pass_qs.append({
                "id": f"q{q_id}",
                "question": f"What is indicated about the company in the article?",
                "options": ["It was founded recently.", "It is moving its headquarters.", "It won an award.", "It is hiring new staff."],
                "correct_answer": "It is moving its headquarters."
            })
            q_id += 1
            
        stages.append({
            "id": f"part7_passage_{pass_idx+1}",
            "type": "reading",
            "title": f"Part 7: Reading Comprehension (Questions {q_id-3}-{q_id-1})",
            "instructions": "Read the following text and answer the questions below.",
            "passageText": "TechCorp Inc. has announced that it will be moving its primary headquarters to a new state-of-the-art facility in downtown Seattle next spring. The transition is expected to take approximately three months to complete. All current employees will be offered relocation packages. The new facility will feature enhanced research laboratories and an on-site fitness center for staff.",
            "questions": pass_qs
        })


    final_json = {
        "id": "toeic_mock_v1",
        "title": "TOEIC® Listening & Reading Official Mock Test 1",
        "difficulty": "advanced",
        "category": "certification",
        "author": "OnixLingo Assessment Board",
        "total_xp": 2000,
        "completion_message": "Congratulations! Your mock test has been submitted for evaluation.",
        "stages": stages
    }

    with open(r"c:\Users\jeico\onixlingo\language-ai-tutor\backend\app\data\lessons\en\toeic_mock_v1.json", "w", encoding="utf-8") as f:
        json.dump(final_json, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    generate_toeic()
    print("Successfully generated toeic_mock_v1.json with 200 questions.")
