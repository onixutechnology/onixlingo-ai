import json

def generate_toefl_phase3():
    json_path = r"c:\Users\jeico\onixlingo\language-ai-tutor\backend\app\data\lessons\en\toefl_mock_v1.json"
    
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    stages = data.get("stages", [])

    # =========================================================================
    # TOEFL SPEAKING (4 Tasks)
    # =========================================================================
    
    # Task 1: Independent Speaking
    stages.append({
        "id": "toefl_s_task1",
        "type": "speaking",
        "title": "Speaking Task 1: Independent",
        "instructions": "You will have 15 seconds to prepare your response and 45 seconds to speak.",
        "questions": [{
            "id": "s_q1",
            "question": "Some people believe that university education should be free for everyone. Others think that students should pay for their higher education. Which view do you agree with and why? Include details and examples to support your explanation.",
            "options": [],
            "correct_answer": ""
        }]
    })

    # Task 2: Integrated Speaking (Reading + Listening + Speaking)
    # For a simulator, we present the reading and transcript together for now.
    task2_text = """READING PASSAGE:\\nUniversity to Eliminate Free Parking\\nStarting next semester, the university will no longer offer free parking for students. Instead, a new permit system will be introduced, requiring students to pay $50 per semester to park on campus. The university states that the funds raised will be used to improve the campus bus system, making it more frequent and reliable.\\n\\nAUDIO TRANSCRIPT:\\nM: I can't believe they are getting rid of free parking.\\nW: Actually, I think it's a good idea. The parking lots are always overcrowded anyway. Maybe this will encourage more people to take the bus.\\nM: But the bus system is terrible. It's always late.\\nW: That's exactly why they're doing it! The announcement said the money from the permits will go directly into buying more buses and hiring more drivers."""

    stages.append({
        "id": "toefl_s_task2",
        "type": "speaking",
        "title": "Speaking Task 2: Campus Situation",
        "instructions": "Read the passage and listen to the conversation. Then, record your response. You have 30 seconds to prepare and 60 seconds to speak.",
        "passageText": task2_text,
        "questions": [{
            "id": "s_q2",
            "question": "The woman expresses her opinion about the university's new parking policy. State her opinion and explain the reasons she gives for holding that opinion.",
            "options": [],
            "correct_answer": ""
        }]
    })

    # Task 3: Integrated Speaking (Academic Reading + Listening)
    task3_text = """READING PASSAGE:\\nAposematism\\nAposematism is a biological concept referring to the use of warning coloration by prey species to signal to predators that they are toxic, dangerous, or unpalatable. Instead of using camouflage to hide, these animals display bright, highly contrasting colors—such as red, yellow, and black—making them highly visible.\\n\\nAUDIO TRANSCRIPT:\\nProfessor: So, a classic example of aposematism is the poison dart frog, found in the rainforests of Central and South America. These frogs are tiny, but their skin secretes a highly toxic poison that can easily kill a predator. To keep predators from even trying to eat them, the frogs are colored in brilliant, neon shades of blue, red, or yellow. A bird flying overhead might spot the bright frog and think it's an easy meal. However, if the bird actually attacks and tastes the poison, it will get extremely sick. If the bird survives, it will forever associate those bright, neon colors with that terrible sickness. So, the next time it sees a brightly colored frog, it will completely ignore it."""
    
    stages.append({
        "id": "toefl_s_task3",
        "type": "speaking",
        "title": "Speaking Task 3: Academic Concept",
        "instructions": "Read the passage and listen to the lecture. Then, record your response. You have 30 seconds to prepare and 60 seconds to speak.",
        "passageText": task3_text,
        "questions": [{
            "id": "s_q3",
            "question": "Using the example of the poison dart frog from the lecture, explain the concept of aposematism.",
            "options": [],
            "correct_answer": ""
        }]
    })

    # Task 4: Integrated Speaking (Academic Listening only)
    task4_text = """AUDIO TRANSCRIPT:\\nProfessor: In business management, there are generally two types of pricing strategies companies use when launching a brand new product: skimming and penetration. Let's look at skimming first. Skimming is when a company sets a very high initial price for a product. They do this to maximize short-term profits before competitors enter the market. For example, a tech company releases a cutting-edge video game console. At first, only the most dedicated gamers will buy it at the high price. Once sales slow down, the company lowers the price to attract the next layer of customers.\\n\\nNow, the opposite strategy is penetration pricing. This is when a company sets a very low initial price to quickly attract a large number of buyers and gain market share. Think of a new streaming service. They might offer subscriptions for just two dollars a month. Because it's so cheap, millions of people sign up right away. The company loses money at first, but once people are hooked on the service, they slowly raise the price."""

    stages.append({
        "id": "toefl_s_task4",
        "type": "speaking",
        "title": "Speaking Task 4: Academic Lecture",
        "instructions": "Listen to the lecture. Then, record your response. You have 20 seconds to prepare and 60 seconds to speak.",
        "passageText": task4_text,
        "questions": [{
            "id": "s_q4",
            "question": "Using the examples of the video game console and the streaming service, explain the two pricing strategies discussed by the professor.",
            "options": [],
            "correct_answer": ""
        }]
    })

    # =========================================================================
    # TOEFL WRITING (2 Tasks)
    # =========================================================================

    # Task 1: Integrated Writing
    w_task1_text = """READING PASSAGE:\\nWind power is rapidly becoming a major source of renewable energy worldwide. However, despite its environmental benefits, the widespread installation of wind turbines has several significant drawbacks. First, wind turbines pose a severe threat to bird populations. Thousands of birds, including endangered species of eagles and hawks, are killed each year when they fly into the massive spinning blades. Second, wind farms require vast amounts of open land. This land could otherwise be used for agriculture or left as untouched natural habitats. Finally, wind energy is unreliable. Wind speeds fluctuate constantly, meaning that turbines cannot provide a consistent, steady supply of electricity to the power grid.\\n\\nAUDIO TRANSCRIPT:\\nProfessor: The criticisms you just read about wind power are common, but they are largely outdated or exaggerated. First, regarding the danger to birds... well, modern wind turbines have been completely redesigned. The new models are much taller and have blades that spin much more slowly than older models. This slower rotation makes them far more visible to birds, significantly reducing bird fatalities. In fact, communication towers and tall glass buildings kill millions more birds than wind turbines do.\\n\\nSecond, the claim that wind farms ruin agricultural land is simply not true. The footprint of the actual turbine base is very small. Farmers can, and do, plant their crops right up to the base of the turbines. So the land is actually serving a dual purpose: generating energy and growing food.\\n\\nThird, it's true that wind speeds fluctuate, but power grids have adapted. Energy companies now build wind farms in widely dispersed geographical areas. If the wind isn't blowing in one state, it's usually blowing in another. Furthermore, advances in battery storage technology allow us to store excess energy generated on very windy days and release it into the grid when the wind is calm."""

    stages.append({
        "id": "toefl_w_task1",
        "type": "writing",
        "title": "Writing Task 1: Integrated Essay",
        "instructions": "Read the passage and listen to the lecture. Then, write an essay summarizing the points made in the lecture and explaining how they cast doubt on the points made in the reading passage. Minimum 150 words.",
        "passageText": w_task1_text,
        "questions": [{
            "id": "w_q1",
            "question": "Summarize the points made in the lecture, being sure to explain how they cast doubt on specific points made in the reading passage.",
            "options": [],
            "correct_answer": ""
        }]
    })

    # Task 2: Writing for an Academic Discussion
    w_task2_text = """INSTRUCTIONS:\\nYour professor is teaching a class on sociology. Write a post responding to the professor's question. In your response, you should express and support your personal opinion and make a contribution to the discussion.\\n\\nProfessor: Today we are discussing the impact of remote work on society. Some argue that allowing employees to work from home increases productivity and improves work-life balance. Others argue that it destroys company culture and leads to social isolation. What is your opinion? Does remote work have a more positive or negative impact on society?\\n\\nStudent 1 (Alex): I strongly believe remote work is positive. Before my company allowed remote work, I spent two hours commuting every day. Now, I use that time to exercise and cook healthy meals. I'm actually much more focused when I work from my home office because there are fewer interruptions than in an open-plan office.\\n\\nStudent 2 (Maria): I have to disagree. While skipping the commute is nice, I think remote work is negative for society. It's incredibly isolating. Humans are social creatures, and we need face-to-face interaction. Also, it's much harder to collaborate on creative projects over video calls. Company culture disappears when you never see your colleagues in person."""

    stages.append({
        "id": "toefl_w_task2",
        "type": "writing",
        "title": "Writing Task 2: Academic Discussion",
        "instructions": "Write a response to the professor's question. Express your opinion and contribute to the discussion. Minimum 100 words.",
        "passageText": w_task2_text,
        "questions": [{
            "id": "w_q2",
            "question": "Does remote work have a more positive or negative impact on society? Explain your reasoning.",
            "options": [],
            "correct_answer": ""
        }]
    })

    data["stages"] = stages

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    generate_toefl_phase3()
    print("Successfully generated Phase 3 (Speaking & Writing) of toefl_mock_v1.json")
