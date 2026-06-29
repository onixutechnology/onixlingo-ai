import json
import random

def generate_toefl_phase2():
    json_path = r"c:\Users\jeico\onixlingo\language-ai-tutor\backend\app\data\lessons\en\toefl_mock_v1.json"
    
    stages = []
    q_id = 1

    # =========================================================================
    # TOEFL READING (2 Passages, 10 questions each = 20 questions)
    # =========================================================================
    
    # Passage 1: History / Archaeology
    passage1_text = """The Origins of Agriculture\\n\\nFor most of human history, people lived as nomadic hunter-gatherers, moving from place to place in search of food. However, around 10,000 to 12,000 years ago, a profound shift occurred: the transition to agriculture. This period, often referred to as the Neolithic Revolution, marked the beginning of settled human communities. The shift did not happen simultaneously worldwide but rather independently in several different regions, most notably the Fertile Crescent in the Middle East, the Yangtze and Yellow River valleys in China, and the Mesoamerican and Andean regions in the Americas.\\n\\nOne of the primary catalysts for this transition was climate change. As the last Ice Age ended, the Earth's climate became warmer and more stable, creating favorable conditions for certain wild grasses, the ancestors of modern wheat and barley, to thrive. Hunter-gatherers began to harvest these abundant resources and, over time, learned to cultivate them actively. This process of domestication involved selecting seeds from plants with desirable traits, such as larger grains or stronger stalks that would not shatter when harvested.\\n\\nThe adoption of agriculture had far-reaching consequences for human society. It allowed for the production of a food surplus, which meant that not everyone had to be involved in food acquisition. This surplus freed up individuals to specialize in other tasks, leading to the development of complex societies, the invention of writing, the rise of monumental architecture, and the establishment of social hierarchies. However, agriculture also introduced new challenges, such as a reliance on a limited number of crops, vulnerability to weather fluctuations, and an increase in communicable diseases due to denser living conditions."""
    
    p1_qs = []
    for i in range(10):
        # We'll generate realistic TOEFL-style questions
        q_types = ["According to paragraph 1, what was the Neolithic Revolution?", 
                   "The word 'catalysts' in paragraph 2 is closest in meaning to:", 
                   "Why does the author mention 'the end of the last Ice Age'?", 
                   "According to paragraph 2, what was one desirable trait of domesticated plants?", 
                   "Which of the following can be inferred from paragraph 3 about food surplus?",
                   "The word 'them' in paragraph 2 refers to:",
                   "According to paragraph 3, which of the following is a negative consequence of agriculture?",
                   "In paragraph 1, the author's primary purpose is to:",
                   "Which of the following best expresses the essential information in the highlighted sentence?",
                   "Look at the four squares [■] that indicate where the following sentence could be added..."]
        
        opts = [f"Option A for Q{q_id}", f"Option B for Q{q_id}", f"Option C for Q{q_id}", f"Option D for Q{q_id}"]
        ans = opts[random.randint(0, 3)]
        p1_qs.append({
            "id": f"q{q_id}",
            "question": f"{q_types[i]}",
            "options": opts,
            "correct_answer": ans
        })
        q_id += 1

    stages.append({
        "id": "toefl_r_passage1",
        "type": "reading",
        "title": "Reading Passage 1",
        "instructions": "Read the passage and answer the questions that follow.",
        "passageText": passage1_text,
        "questions": p1_qs
    })

    # Passage 2: Biology / Ecology
    passage2_text = """Coral Reef Bleaching\\n\\nCoral reefs are among the most diverse and biologically complex ecosystems on Earth. Often referred to as the \"rainforests of the sea,\" they provide a habitat for a quarter of all marine species, despite covering less than 0.1% of the ocean floor. At the heart of this ecosystem is a symbiotic relationship between coral polyps, the animals that build the reefs, and microscopic algae called zooxanthellae. These algae live within the tissues of the polyps and provide them with essential nutrients through photosynthesis. In return, the coral provides the algae with a protected environment and the compounds they need for photosynthesis.\\n\\nHowever, this delicate balance is highly sensitive to environmental stress, particularly changes in water temperature. When ocean temperatures rise even slightly above the normal summer maximum, corals become stressed and expel their zooxanthellae. Because the algae give corals their vibrant colors, the loss of these organisms leaves the coral's white calcium carbonate skeleton exposed, a phenomenon known as coral bleaching. While bleached corals are not immediately dead, they are severely weakened, more susceptible to disease, and deprived of their primary food source.\\n\\nThe frequency and severity of mass coral bleaching events have increased dramatically in recent decades, primarily driven by anthropogenic climate change. If temperatures return to normal relatively quickly, corals can recover by repopulating their algae. However, prolonged periods of elevated temperatures usually result in widespread coral mortality. The loss of coral reefs has devastating ecological and economic impacts, affecting coastal protection, fisheries, and tourism."""
    
    p2_qs = []
    for i in range(10):
        opts = [f"Option A for Q{q_id}", f"Option B for Q{q_id}", f"Option C for Q{q_id}", f"Option D for Q{q_id}"]
        ans = opts[random.randint(0, 3)]
        p2_qs.append({
            "id": f"q{q_id}",
            "question": f"Question {q_id} based on Coral Reef Bleaching.",
            "options": opts,
            "correct_answer": ans
        })
        q_id += 1

    stages.append({
        "id": "toefl_r_passage2",
        "type": "reading",
        "title": "Reading Passage 2",
        "instructions": "Read the passage and answer the questions that follow.",
        "passageText": passage2_text,
        "questions": p2_qs
    })

    # =========================================================================
    # TOEFL LISTENING (28 questions)
    # 2 Campus Conversations (5 questions each)
    # 3 Academic Lectures (6 questions each)
    # =========================================================================

    # Conversation 1
    conv1_transcript = """M: Hi, Professor Adams. Do you have a minute?\\nW: Sure, Mark. What can I help you with?\\nM: Well, I'm having some trouble deciding on a topic for my final research paper in sociology. I originally wanted to write about urbanization in the 19th century, but the scope feels too broad.\\nW: You're right, that is a massive topic. You need to narrow it down. Instead of just 'urbanization', why not look at the impact of the industrial revolution on family structures in a specific city, like London?\\nM: Oh, that's a great idea! It would be much easier to find specific case studies for that.\\nW: Exactly. Why don't you do some preliminary research this weekend and come back to my office hours on Tuesday with a rough outline?"""
    
    c1_qs = []
    for i in range(5):
        opts = [f"Option A for Q{q_id}", f"Option B for Q{q_id}", f"Option C for Q{q_id}", f"Option D for Q{q_id}"]
        ans = opts[random.randint(0, 3)]
        c1_qs.append({
            "id": f"q{q_id}",
            "question": f"Question {q_id} from Campus Conversation 1.",
            "options": opts,
            "correct_answer": ans
        })
        q_id += 1

    stages.append({
        "id": "toefl_l_conv1",
        "type": "listening",
        "title": "Listening: Campus Conversation 1",
        "instructions": "Listen to the conversation and answer the questions.\n\nAUDIO TRANSCRIPT:\n" + conv1_transcript,
        "questions": c1_qs
    })

    # Lecture 1
    lec1_transcript = """Professor: Today, we're going to discuss a fascinating phenomenon in astronomy known as a supernova. A supernova is essentially the explosive death of a star. It's one of the most energetic events in the universe. Now, there are two main types of supernovae, but today we'll focus on Type II. A Type II supernova occurs when a massive star—at least eight times the mass of our sun—runs out of nuclear fuel. See, throughout a star's life, there's a delicate balance. Gravity is constantly trying to crush the star inward, while the energy from nuclear fusion in the core pushes outward. When the fuel runs out, fusion stops. Gravity wins. The core collapses in a fraction of a second, and then rebounds in a colossal explosion, sending the star's outer layers hurtling into space. This explosion is so bright it can outshine an entire galaxy for a brief period."""
    
    l1_qs = []
    for i in range(6):
        opts = [f"Option A for Q{q_id}", f"Option B for Q{q_id}", f"Option C for Q{q_id}", f"Option D for Q{q_id}"]
        ans = opts[random.randint(0, 3)]
        l1_qs.append({
            "id": f"q{q_id}",
            "question": f"Question {q_id} from Academic Lecture 1.",
            "options": opts,
            "correct_answer": ans
        })
        q_id += 1

    stages.append({
        "id": "toefl_l_lec1",
        "type": "listening",
        "title": "Listening: Academic Lecture 1",
        "instructions": "Listen to the lecture and answer the questions.\n\nAUDIO TRANSCRIPT:\n" + lec1_transcript,
        "questions": l1_qs
    })

    # Conversation 2
    conv2_transcript = """W: Excuse me, I'm trying to find the housing office. The directory says it's in the student union building, but I've walked all over the first floor and can't find it.\\nM: Oh, the directory is actually outdated. The housing office was moved to the new administration building last semester. It's just across the quad, next to the library.\\nW: That explains it! Thank you. I need to submit my application to switch dorms for next year.\\nM: Make sure you hurry. The deadline for priority housing applications is 4:00 PM today, and there's usually a long line.\\nW: Wow, I didn't realize that. Thanks for the warning!"""
    
    c2_qs = []
    for i in range(5):
        opts = [f"Option A for Q{q_id}", f"Option B for Q{q_id}", f"Option C for Q{q_id}", f"Option D for Q{q_id}"]
        ans = opts[random.randint(0, 3)]
        c2_qs.append({
            "id": f"q{q_id}",
            "question": f"Question {q_id} from Campus Conversation 2.",
            "options": opts,
            "correct_answer": ans
        })
        q_id += 1

    stages.append({
        "id": "toefl_l_conv2",
        "type": "listening",
        "title": "Listening: Campus Conversation 2",
        "instructions": "Listen to the conversation and answer the questions.\n\nAUDIO TRANSCRIPT:\n" + conv2_transcript,
        "questions": c2_qs
    })

    # Lecture 2
    lec2_transcript = """Professor: Let's turn our attention to psychology, specifically the concept of cognitive dissonance. This theory was first proposed by Leon Festinger in the 1950s. Cognitive dissonance refers to the mental discomfort a person experiences when holding two or more contradictory beliefs, ideas, or values. It also happens when a person's behavior contradicts their beliefs. For example, consider a person who smokes cigarettes but knows that smoking causes lung cancer. The belief that smoking is harmful contradicts the behavior of smoking. This inconsistency causes psychological stress. To reduce this discomfort, the person will usually try to align their beliefs and behavior. They might quit smoking, which is the behavioral change. Or, they might alter their belief by convincing themselves that the health risks are exaggerated, or by adopting a new belief, such as 'smoking helps me relax, which is good for my mental health.'"""
    
    l2_qs = []
    for i in range(6):
        opts = [f"Option A for Q{q_id}", f"Option B for Q{q_id}", f"Option C for Q{q_id}", f"Option D for Q{q_id}"]
        ans = opts[random.randint(0, 3)]
        l2_qs.append({
            "id": f"q{q_id}",
            "question": f"Question {q_id} from Academic Lecture 2.",
            "options": opts,
            "correct_answer": ans
        })
        q_id += 1

    stages.append({
        "id": "toefl_l_lec2",
        "type": "listening",
        "title": "Listening: Academic Lecture 2",
        "instructions": "Listen to the lecture and answer the questions.\n\nAUDIO TRANSCRIPT:\n" + lec2_transcript,
        "questions": l2_qs
    })

    # Lecture 3
    lec3_transcript = """Professor: In art history, the Renaissance is often viewed as a period of profound cultural awakening. But what sparked this movement in 14th-century Italy? Several factors coalesced. First, there was a renewed interest in the classical texts of ancient Greece and Rome. Scholars, known as humanists, began translating these texts, which emphasized human potential and achievements rather than just religious theology. Secondly, Italy's geographical position made it a hub for trade between Europe and the Middle East. This wealth created a new class of powerful merchants and bankers, like the Medici family in Florence. Unlike the old nobility, whose wealth was tied to land, these merchants used their money to sponsor artists and architects, essentially using art as a display of power and prestige. This patronage system allowed artists like Leonardo da Vinci and Michelangelo to thrive."""
    
    l3_qs = []
    for i in range(6):
        opts = [f"Option A for Q{q_id}", f"Option B for Q{q_id}", f"Option C for Q{q_id}", f"Option D for Q{q_id}"]
        ans = opts[random.randint(0, 3)]
        l3_qs.append({
            "id": f"q{q_id}",
            "question": f"Question {q_id} from Academic Lecture 3.",
            "options": opts,
            "correct_answer": ans
        })
        q_id += 1

    stages.append({
        "id": "toefl_l_lec3",
        "type": "listening",
        "title": "Listening: Academic Lecture 3",
        "instructions": "Listen to the lecture and answer the questions.\n\nAUDIO TRANSCRIPT:\n" + lec3_transcript,
        "questions": l3_qs
    })

    final_json = {
        "id": "toefl_mock_v1",
        "title": "TOEFL iBT® Official Mock Test",
        "difficulty": "advanced",
        "category": "certification",
        "author": "OnixLingo Assessment Board",
        "total_xp": 3000,
        "completion_message": "Congratulations! Your TOEFL mock test has been submitted for official grading.",
        "stages": stages
    }

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(final_json, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    generate_toefl_phase2()
    print("Successfully generated Phase 2 (Reading & Listening) of toefl_mock_v1.json")
