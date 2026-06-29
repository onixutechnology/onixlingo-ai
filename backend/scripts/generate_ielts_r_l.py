import json
import random

def generate_ielts_r_l():
    json_path = r"c:\Users\jeico\onixlingo\language-ai-tutor\backend\app\data\lessons\en\ielts_mock_v1.json"
    
    stages = []
    q_id = 1

    # =========================================================================
    # IELTS LISTENING (40 questions, 4 sections)
    # =========================================================================
    
    # Section 1: Social Conversation (10 questions)
    sec1_text = """AUDIO TRANSCRIPT:\\nM: Hello, City Travel Agency. How can I help you?\\nW: Hi, I'm calling to inquire about a weekend trip to Edinburgh.\\nM: Certainly. Are you looking to travel by train or by plane?\\nW: By train, please. I prefer the scenery.\\nM: Right. And what dates were you thinking of?\\nW: Next weekend, leaving on Friday the 14th and returning on Sunday the 16th.\\nM: Okay, let me check the schedules. There's a train leaving London King's Cross at 9:30 AM on Friday.\\nW: That sounds perfect. How much is a return ticket?\\nM: For a standard class return, it's £85. If you want a first-class ticket, it'll be £130.\\nW: Standard class is fine. Can I also book a hotel through you?\\nM: Yes, we have a partnership with the Royal Mile Hotel. It's £120 per night, including breakfast.\\nW: Excellent, I'll take that as well."""
    
    s1_qs = []
    for i in range(10):
        opts = [f"Option A for Section 1 Q{i+1}", f"Option B for Section 1 Q{i+1}", f"Option C for Section 1 Q{i+1}", f"Option D for Section 1 Q{i+1}"]
        s1_qs.append({
            "id": f"q{q_id}",
            "question": f"Question {q_id} (IELTS Listening Section 1)",
            "options": opts,
            "correct_answer": opts[random.randint(0, 3)]
        })
        q_id += 1

    stages.append({
        "id": "ielts_l_sec1",
        "type": "listening",
        "title": "Listening Section 1",
        "instructions": "Listen to the conversation and answer questions 1-10.",
        "audioUrl": "placeholder_ielts_sec1.mp3",
        "passageText": sec1_text,
        "questions": s1_qs
    })

    # Section 2: Social Monologue (10 questions)
    sec2_text = """AUDIO TRANSCRIPT:\\nW: Welcome, everyone, to the annual community volunteer fair here at the Riverside Community Center. My name is Sarah, and I'm the volunteer coordinator. Today, we have over 20 different organizations looking for enthusiastic people like you. Let me briefly highlight a few. First, the City Library is desperately looking for reading tutors for their children's after-school program. You don't need teaching experience, just a love for books and patience. They meet on Tuesdays and Thursdays from 4 to 6 PM.\\n\\nSecondly, the Green Spaces Initiative needs volunteers for their weekend park clean-up crews. They provide all the equipment, including gloves and trash bags. It's a great way to get some exercise while helping the environment. Finally, the local animal shelter is looking for dog walkers. This is very popular, so if you're interested, please sign up at their booth as soon as possible."""
    
    s2_qs = []
    for i in range(10):
        opts = [f"Option A for Section 2 Q{i+1}", f"Option B for Section 2 Q{i+1}", f"Option C for Section 2 Q{i+1}", f"Option D for Section 2 Q{i+1}"]
        s2_qs.append({
            "id": f"q{q_id}",
            "question": f"Question {q_id} (IELTS Listening Section 2)",
            "options": opts,
            "correct_answer": opts[random.randint(0, 3)]
        })
        q_id += 1

    stages.append({
        "id": "ielts_l_sec2",
        "type": "listening",
        "title": "Listening Section 2",
        "instructions": "Listen to the monologue and answer questions 11-20.",
        "audioUrl": "placeholder_ielts_sec2.mp3",
        "passageText": sec2_text,
        "questions": s2_qs
    })

    # Section 3: Academic Conversation (10 questions)
    sec3_text = """AUDIO TRANSCRIPT:\\nM (Tutor): Come in. Ah, Emma and Jack. Take a seat. So, we're here to discuss your joint presentation on urban agriculture. How is the research going?\\nW (Emma): It's going well, Dr. Harris. We've decided to focus specifically on vertical farming.\\nM (Jack): Yes, we found some fascinating data on crop yields. Vertical farms can produce up to 10 times more food per square meter compared to traditional farming.\\nM (Tutor): Excellent. That's a strong angle. But remember, a good presentation needs to look at both sides. What are the drawbacks?\\nW (Emma): Well, the initial set-up costs are massive. You need specialized LED lighting, climate control systems, and hydroponic equipment.\\nM (Jack): And the energy consumption is very high, which kind of defeats the purpose of being 'sustainable' if the electricity comes from fossil fuels.\\nM (Tutor): Good points. Make sure you highlight those challenges prominently in your slides."""
    
    s3_qs = []
    for i in range(10):
        opts = [f"Option A for Section 3 Q{i+1}", f"Option B for Section 3 Q{i+1}", f"Option C for Section 3 Q{i+1}", f"Option D for Section 3 Q{i+1}"]
        s3_qs.append({
            "id": f"q{q_id}",
            "question": f"Question {q_id} (IELTS Listening Section 3)",
            "options": opts,
            "correct_answer": opts[random.randint(0, 3)]
        })
        q_id += 1

    stages.append({
        "id": "ielts_l_sec3",
        "type": "listening",
        "title": "Listening Section 3",
        "instructions": "Listen to the conversation and answer questions 21-30.",
        "audioUrl": "placeholder_ielts_sec3.mp3",
        "passageText": sec3_text,
        "questions": s3_qs
    })

    # Section 4: Academic Monologue (10 questions)
    sec4_text = """AUDIO TRANSCRIPT:\\nProfessor: Good morning. Today's lecture will focus on the fascinating world of bioluminescence—the production and emission of light by a living organism. It occurs widely in marine vertebrates and invertebrates, as well as in some fungi and insects, such as fireflies. The chemical reaction that results in bioluminescence requires two unique chemicals: luciferin and either luciferase or photoprotein. Luciferin is the compound that actually produces the light.\\n\\nNow, why do organisms bioluminesce? In the deep ocean, where sunlight cannot penetrate, bioluminescence serves several critical functions. Firstly, it is used for camouflage. This might sound counterintuitive, but some fish emit light from their bellies to match the faint sunlight coming from the surface, making them invisible to predators swimming below them—a strategy known as counter-illumination. Secondly, it is used to attract prey. The anglerfish, for example, dangles a glowing lure in front of its mouth to attract smaller fish. Finally, it is used for communication and attracting mates."""
    
    s4_qs = []
    for i in range(10):
        opts = [f"Option A for Section 4 Q{i+1}", f"Option B for Section 4 Q{i+1}", f"Option C for Section 4 Q{i+1}", f"Option D for Section 4 Q{i+1}"]
        s4_qs.append({
            "id": f"q{q_id}",
            "question": f"Question {q_id} (IELTS Listening Section 4)",
            "options": opts,
            "correct_answer": opts[random.randint(0, 3)]
        })
        q_id += 1

    stages.append({
        "id": "ielts_l_sec4",
        "type": "listening",
        "title": "Listening Section 4",
        "instructions": "Listen to the lecture and answer questions 31-40.",
        "audioUrl": "placeholder_ielts_sec4.mp3",
        "passageText": sec4_text,
        "questions": s4_qs
    })

    # =========================================================================
    # IELTS READING (40 questions, 3 passages)
    # =========================================================================

    # Passage 1 (13 questions)
    p1_text = """The History of the Bicycle\\n\\nThe bicycle is one of the most ubiquitous forms of transportation in the modern world, but its development was a slow and iterative process. The first verifiable claim for a practically used bicycle belongs to the German Baron Karl von Drais, a civil servant to the Grand Duke of Baden in Germany. Drais invented his 'Laufmaschine' (German for \"running machine\") in 1817. This early device, also known as the draisine or dandy horse, had two wheels and a steering mechanism but lacked pedals; the rider simply pushed their feet against the ground to glide forward.\\n\\nIt wasn't until the 1860s in France that pedals were added to the front wheel, creating the 'velocipede', which quickly earned the nickname 'boneshaker' due to its stiff wooden wheels and iron frame. Riding a boneshaker on the cobbled streets of the 19th century was an incredibly uncomfortable experience. To achieve higher speeds, inventors soon realized that increasing the size of the front wheel (which was directly driven by the pedals) would cover more distance per pedal stroke. This led to the creation of the 'penny-farthing' in the 1870s, characterized by a massive front wheel and a tiny rear wheel.\\n\\nWhile fast, penny-farthings were inherently dangerous. The rider sat high above the ground, and any sudden stop could easily send them pitching forward over the handlebars. The true revolution in cycling came in the late 1880s with the invention of the 'safety bicycle'. This design featured two wheels of identical size and a chain drive connecting the pedals to the rear wheel. Coupled with the invention of the pneumatic (air-filled) rubber tire by John Boyd Dunlop in 1888, the safety bicycle offered a smooth, relatively safe, and highly efficient mode of transport. This triggered the great bicycle boom of the 1890s, profoundly changing society by giving ordinary people unprecedented mobility."""

    r1_qs = []
    for i in range(13):
        opts = ["True", "False", "Not Given", "Option D (Placeholder)"] if i < 5 else [f"Option A for Q{q_id}", f"Option B for Q{q_id}", f"Option C for Q{q_id}", f"Option D for Q{q_id}"]
        r1_qs.append({
            "id": f"q{q_id}",
            "question": f"Question {q_id}: Based on Reading Passage 1",
            "options": opts,
            "correct_answer": opts[random.randint(0, 3)]
        })
        q_id += 1

    stages.append({
        "id": "ielts_r_pass1",
        "type": "reading",
        "title": "Reading Passage 1",
        "instructions": "Read the passage and answer questions 41-53. Pay attention to True/False/Not Given questions.",
        "passageText": p1_text,
        "questions": r1_qs
    })

    # Passage 2 (13 questions)
    p2_text = """The Psychology of Decision Making\\n\\nEvery day, humans make thousands of decisions, ranging from the trivial (what to wear) to the life-altering (whether to change careers). For a long time, classical economic theory posited that humans were 'rational actors' who always weighed the costs and benefits of every option to maximize their utility. However, modern psychology and behavioral economics have completely dismantled this assumption, revealing that human decision-making is deeply flawed and heavily influenced by cognitive biases.\\n\\nOne of the most profound discoveries in this field was made by psychologists Daniel Kahneman and Amos Tversky, who introduced the concept of heuristics. Heuristics are mental shortcuts that our brains use to process information quickly. While often useful—allowing us to avoid paralysis by analysis—these shortcuts can lead to systemic errors. For example, the 'availability heuristic' is the tendency to overestimate the likelihood of an event based on how easily an example comes to mind. People are often more afraid of flying than driving, despite statistically higher risks in driving, simply because plane crashes are dramatic, heavily reported in the news, and therefore highly 'available' in memory.\\n\\nAnother powerful force is 'loss aversion'. Kahneman and Tversky demonstrated that the psychological pain of losing $100 is significantly greater than the psychological pleasure of gaining $100. This asymmetry explains why people often stick with poor investments or dead-end jobs; the fear of losing what they have already invested (the 'sunk cost fallacy') outweighs the potential benefits of changing course. Understanding these biases is crucial for improving everything from personal finance to public policy."""

    r2_qs = []
    for i in range(13):
        opts = [f"Option A for Q{q_id}", f"Option B for Q{q_id}", f"Option C for Q{q_id}", f"Option D for Q{q_id}"]
        r2_qs.append({
            "id": f"q{q_id}",
            "question": f"Question {q_id}: Based on Reading Passage 2",
            "options": opts,
            "correct_answer": opts[random.randint(0, 3)]
        })
        q_id += 1

    stages.append({
        "id": "ielts_r_pass2",
        "type": "reading",
        "title": "Reading Passage 2",
        "instructions": "Read the passage and answer questions 54-66.",
        "passageText": p2_text,
        "questions": r2_qs
    })

    # Passage 3 (14 questions)
    p3_text = """The Architecture of Termite Mounds\\n\\nTo the untrained eye, a termite mound might look like nothing more than a haphazard pile of dirt. In reality, it is a marvel of animal engineering, a highly complex structure designed to maintain a stable internal environment despite wildly fluctuating external temperatures. In the savannas of Africa, where temperatures can swing from freezing at night to over 40 degrees Celsius during the day, the internal temperature of a termite mound remains remarkably constant at around 30 degrees Celsius.\\n\\nThe key to this thermal regulation lies in the mound's intricate network of tunnels and flues. The termites themselves do not live in the upper, tower-like section of the mound; rather, they live in a subterranean nest below ground. The tower acts as a massive 'lung' for the colony. As the termites metabolize their food, they generate heat. This warm air naturally rises up through the central chimney of the mound. As it hits the porous, outer walls of the upper mound, the heat is exchanged with the cooler outside air, and the stale air diffuses out of the mound.\\n\\nSimultaneously, cooler, fresh air is drawn into the mound through a series of smaller tunnels located near the base. This process of passive ventilation is incredibly efficient. In fact, human architects have begun to study termite mounds in an emerging field known as biomimicry. The Eastgate Centre, an office building in Harare, Zimbabwe, was explicitly designed to mimic the passive cooling system of a termite mound. It uses significantly less energy than conventional buildings of its size, proving that ancient biological solutions can solve modern engineering problems."""

    r3_qs = []
    for i in range(14):
        opts = [f"Option A for Q{q_id}", f"Option B for Q{q_id}", f"Option C for Q{q_id}", f"Option D for Q{q_id}"]
        r3_qs.append({
            "id": f"q{q_id}",
            "question": f"Question {q_id}: Based on Reading Passage 3",
            "options": opts,
            "correct_answer": opts[random.randint(0, 3)]
        })
        q_id += 1

    stages.append({
        "id": "ielts_r_pass3",
        "type": "reading",
        "title": "Reading Passage 3",
        "instructions": "Read the passage and answer questions 67-80.",
        "passageText": p3_text,
        "questions": r3_qs
    })

    final_json = {
        "id": "ielts_mock_v1",
        "title": "IELTS® Academic Official Mock Test",
        "difficulty": "advanced",
        "category": "certification",
        "author": "OnixLingo Assessment Board",
        "total_xp": 3500,
        "completion_message": "Congratulations! Your IELTS mock test has been submitted for official banding.",
        "stages": stages
    }

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(final_json, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    generate_ielts_r_l()
    print("Successfully generated Phase 1 & 2 (Listening & Reading) of ielts_mock_v1.json")
