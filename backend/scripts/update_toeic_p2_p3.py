import json
import random

def update_parts_2_and_3():
    json_path = r"c:\Users\jeico\onixlingo\language-ai-tutor\backend\app\data\lessons\en\toeic_mock_v1.json"
    
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    # -------------------------------------------------------------------------
    # PART 2: QUESTION-RESPONSE (25 QUESTIONS)
    # -------------------------------------------------------------------------
    # In a real TOEIC, the prompt is audio only. The options are audio only. 
    # But for a digital simulator, we show "Mark your answer" and options A, B, C.
    # To make it feel real, we'll give realistic transcripts in the 'question' field 
    # (or assume the audio has it, but since we don't have audio yet, we'll write the transcript 
    # in the question text so the user can read it for now to test).
    
    part2_content = [
        {"q": "When is the project proposal due?", "opts": ["(A) By Friday afternoon.", "(B) Yes, it's a great project.", "(C) I proposed it yesterday."], "ans": "(A) By Friday afternoon."},
        {"q": "Who is going to the conference in Berlin?", "opts": ["(A) A new marketing strategy.", "(B) The manager and two assistants.", "(C) About three days."], "ans": "(B) The manager and two assistants."},
        {"q": "Where did you put the revised budget report?", "opts": ["(A) In the top drawer of my desk.", "(B) The budget is too low.", "(C) I'll report it to him."], "ans": "(A) In the top drawer of my desk."},
        {"q": "Why hasn't the supplier called us back?", "opts": ["(A) We need more office supplies.", "(B) Because it's a public holiday there.", "(C) Call me back later."], "ans": "(B) Because it's a public holiday there."},
        {"q": "Would you like me to book the flight for you?", "opts": ["(A) No thanks, I've already done it.", "(B) The flight departs at 9 AM.", "(C) It's a very good book."], "ans": "(A) No thanks, I've already done it."},
        {"q": "How many computers need to be repaired?", "opts": ["(A) The IT department is upstairs.", "(B) Only three of them.", "(C) A pair of new ones."], "ans": "(B) Only three of them."},
        {"q": "Are you going to eat at the cafeteria or go out?", "opts": ["(A) I brought my own lunch today.", "(B) The food is delicious.", "(C) He went out for a walk."], "ans": "(A) I brought my own lunch today."},
        {"q": "Has the marketing team seen these designs yet?", "opts": ["(A) It's a nice sign.", "(B) Not yet, I'll send them over now.", "(C) They team up well."], "ans": "(B) Not yet, I'll send them over now."},
        {"q": "Whose briefcase is left in the meeting room?", "opts": ["(A) Let's meet at noon.", "(B) It belongs to Mr. Peterson.", "(C) A brief summary."], "ans": "(B) It belongs to Mr. Peterson."},
        {"q": "Can we postpone the interview until tomorrow?", "opts": ["(A) Sure, I'll update the schedule.", "(B) The interview went well.", "(C) We need a post office."], "ans": "(A) Sure, I'll update the schedule."},
        {"q": "What's the best way to get to the convention center?", "opts": ["(A) It's the center of attention.", "(B) Take the express train on line 4.", "(C) A convention of engineers."], "ans": "(B) Take the express train on line 4."},
        {"q": "You sent the invoice to the client, didn't you?", "opts": ["(A) Yes, right after the meeting.", "(B) The client's voice.", "(C) I didn't see the voice."], "ans": "(A) Yes, right after the meeting."},
        {"q": "Which floor is the human resources department on?", "opts": ["(A) On the seventh floor.", "(B) They are very resourceful.", "(C) Watch your step on the floor."], "ans": "(A) On the seventh floor."},
        {"q": "How long will the renovation of the lobby take?", "opts": ["(A) It looks very modern.", "(B) About three weeks.", "(C) He took it yesterday."], "ans": "(B) About three weeks."},
        {"q": "Why is the road closed to traffic?", "opts": ["(A) There's a heavy traffic jam.", "(B) Because of the construction work.", "(C) Please close the door."], "ans": "(B) Because of the construction work."},
        {"q": "When does the morning shift usually start?", "opts": ["(A) Shift the boxes carefully.", "(B) At 6:00 AM sharp.", "(C) It was a very long morning."], "ans": "(B) At 6:00 AM sharp."},
        {"q": "Is there a pharmacy near the hotel?", "opts": ["(A) Yes, just around the corner.", "(B) The hotel is fully booked.", "(C) A prescription from the doctor."], "ans": "(A) Yes, just around the corner."},
        {"q": "Who's taking the minutes for today's meeting?", "opts": ["(A) The meeting lasted sixty minutes.", "(B) Sarah volunteered to do it.", "(C) Wait a minute, please."], "ans": "(B) Sarah volunteered to do it."},
        {"q": "Let's review the quarterly sales figures.", "opts": ["(A) Yes, I have the spreadsheets ready.", "(B) A quarter past two.", "(C) They figure it out."], "ans": "(A) Yes, I have the spreadsheets ready."},
        {"q": "Did the package arrive this morning or yesterday?", "opts": ["(A) Pack your bags quickly.", "(B) It came yesterday afternoon.", "(C) Yes, it's a large package."], "ans": "(B) It came yesterday afternoon."},
        {"q": "Have you met the new regional director?", "opts": ["(A) The directions are clear.", "(B) Not formally, just in passing.", "(C) It's a direct flight."], "ans": "(B) Not formally, just in passing."},
        {"q": "Why don't we use the larger conference room?", "opts": ["(A) It's already booked for a seminar.", "(B) The room is very bright.", "(C) Use the side door."], "ans": "(A) It's already booked for a seminar."},
        {"q": "How much does it cost to park here?", "opts": ["(A) The park is very beautiful.", "(B) It's five dollars an hour.", "(C) It costs a lot of money."], "ans": "(B) It's five dollars an hour."},
        {"q": "Could you help me install this software?", "opts": ["(A) The installation took a while.", "(B) I'm sorry, but I'm busy right now.", "(C) Soft materials only."], "ans": "(B) I'm sorry, but I'm busy right now."},
        {"q": "Where should I store these empty boxes?", "opts": ["(A) Please leave them in the supply closet.", "(B) I bought them at the store.", "(C) They are very heavy."], "ans": "(A) Please leave them in the supply closet."}
    ]

    for stage in data["stages"]:
        if stage["id"] == "part2_main":
            q_idx = 7 # Part 2 starts at question 7
            new_qs = []
            for item in part2_content:
                new_qs.append({
                    "id": f"q{q_idx}",
                    "question": f"Listen to the audio: \"{item['q']}\"",
                    "options": item["opts"],
                    "correct_answer": item["ans"]
                })
                q_idx += 1
            stage["questions"] = new_qs

    # -------------------------------------------------------------------------
    # PART 3: CONVERSATIONS (13 CONVERSATIONS, 39 QUESTIONS)
    # -------------------------------------------------------------------------
    # We create 13 short corporate conversations as transcripts for the audio
    part3_convs = [
        {
            "transcript": "M: Hi, I'd like to check out these books, please.\\nW: Certainly. Can I have your library card?\\nM: Oh, I think I left it at home. Can I still borrow them if I show my driver's license?\\nW: I can look up your account with your license, but you'll need the physical card next time.",
            "qs": [
                {"q": "Where does the conversation most likely take place?", "opts": ["(A) At a bookstore", "(B) At a public library", "(C) At a driver's licensing office", "(D) At a post office"], "ans": "(B) At a public library"},
                {"q": "What did the man forget to bring?", "opts": ["(A) His wallet", "(B) Some books", "(C) His library card", "(D) A driving license"], "ans": "(C) His library card"},
                {"q": "What will the woman probably do next?", "opts": ["(A) Issue a new card", "(B) Check his identification", "(C) Collect a late fee", "(D) Recommend a book"], "ans": "(B) Check his identification"}
            ]
        },
        {
            "transcript": "W: Mark, the printer in the main office is jammed again. I need to print the agendas for the 10 o'clock board meeting.\\nM: That old machine has been breaking down all week. I've already called the technician, but he won't be here until tomorrow.\\nW: That's a problem. The meeting is in 30 minutes.\\nM: Why don't you use the small printer in the HR department? It's slower, but it works.",
            "qs": [
                {"q": "What is the woman's problem?", "opts": ["(A) She is late for a meeting.", "(B) She cannot print some documents.", "(C) She cannot find the HR department.", "(D) The technician has not arrived."], "ans": "(B) She cannot print some documents."},
                {"q": "When is the technician expected to arrive?", "opts": ["(A) In 30 minutes", "(B) At 10 o'clock", "(C) Sometime today", "(D) Tomorrow"], "ans": "(D) Tomorrow"},
                {"q": "What does the man suggest the woman do?", "opts": ["(A) Delay the board meeting", "(B) Call the technician again", "(C) Use a different printer", "(D) Email the agendas instead"], "ans": "(C) Use a different printer"}
            ]
        },
        {
            "transcript": "M: Excuse me, I ordered a vegetarian pasta about 40 minutes ago, and it still hasn't arrived. My friends have already finished their meals.\\nW: I'm so sorry, sir. The kitchen is extremely busy tonight because of the festival downtown. Let me go check on your order right away.\\nM: Thank you. I have theater tickets for 8 PM, so I'm in a bit of a hurry.\\nW: I understand. I'll make sure they prioritize your dish. I'll also bring you a complimentary salad while you wait.",
            "qs": [
                {"q": "Where are the speakers?", "opts": ["(A) At a theater", "(B) At a food festival", "(C) At a restaurant", "(D) In a kitchen"], "ans": "(C) At a restaurant"},
                {"q": "Why is the woman apologizing?", "opts": ["(A) The food was undercooked.", "(B) An order is taking too long.", "(C) A table is not ready.", "(D) The wrong dish was served."], "ans": "(B) An order is taking too long."},
                {"q": "What does the woman offer the man?", "opts": ["(A) Free theater tickets", "(B) A discount on his meal", "(C) A different pasta dish", "(D) A free appetizer"], "ans": "(D) A free appetizer"}
            ]
        },
        {
            "transcript": "W: Hello, this is Clara from Horizon Marketing. I'm calling about the office space you have listed for rent on 5th Avenue.\\nM: Oh, yes. The entire third floor is still available. It's about 2,000 square feet and comes with reserved parking.\\nW: That sounds perfect. Our current lease expires at the end of next month, and we need a bigger space. When can I come see it?\\nM: I can show it to you this Thursday at 2:00 PM or Friday morning. Which works best for you?",
            "qs": [
                {"q": "Why is the woman calling?", "opts": ["(A) To cancel a contract", "(B) To inquire about a rental property", "(C) To discuss a marketing strategy", "(D) To apply for a parking permit"], "ans": "(B) To inquire about a rental property"},
                {"q": "What is mentioned about the property?", "opts": ["(A) It is currently being renovated.", "(B) It is located on the first floor.", "(C) It includes parking spaces.", "(D) It is furnished."], "ans": "(C) It includes parking spaces."},
                {"q": "When does the woman's current lease expire?", "opts": ["(A) On Thursday", "(B) On Friday morning", "(C) At the end of this month", "(D) At the end of next month"], "ans": "(D) At the end of next month"}
            ]
        },
        {
            "transcript": "M: Have you finished reviewing the candidates for the graphic designer position?\\nW: Yes, I've narrowed it down to three people. I think Sarah Jenkins is the strongest applicant. Her portfolio is outstanding.\\nM: I agree, but her salary expectations are a bit higher than our budget allows.\\nW: That's true. Let's invite her in for a second interview on Monday to see if we can negotiate the compensation package.",
            "qs": [
                {"q": "What position are the speakers discussing?", "opts": ["(A) Sales Manager", "(B) Graphic Designer", "(C) Financial Analyst", "(D) Human Resources Director"], "ans": "(B) Graphic Designer"},
                {"q": "What concern does the man raise about a candidate?", "opts": ["(A) Her lack of experience", "(B) Her weak portfolio", "(C) Her salary expectations", "(D) Her interview skills"], "ans": "(C) Her salary expectations"},
                {"q": "What will the speakers do on Monday?", "opts": ["(A) Adjust the department budget", "(B) Post a new job advertisement", "(C) Make a final hiring decision", "(D) Conduct another interview"], "ans": "(D) Conduct another interview"}
            ]
        },
        {
            "transcript": "W: Excuse me, does this train go to Central Station?\\nM: No, this is the express train to the airport. It doesn't stop at Central Station.\\nW: Oh no, I must have boarded the wrong one. I need to get to the city center for a conference.\\nM: Don't worry. Get off at the next stop, Elm Street, and switch to the blue line train. It will take you straight to Central Station in 15 minutes.",
            "qs": [
                {"q": "Where is the woman trying to go?", "opts": ["(A) To the airport", "(B) To Elm Street", "(C) To Central Station", "(D) To a train depot"], "ans": "(C) To Central Station"},
                {"q": "What mistake did the woman make?", "opts": ["(A) She bought the wrong ticket.", "(B) She boarded the wrong train.", "(C) She missed her flight.", "(D) She lost her conference badge."], "ans": "(B) She boarded the wrong train."},
                {"q": "What does the man advise her to do?", "opts": ["(A) Pay an extra fare", "(B) Take a taxi from the airport", "(C) Transfer at the next stop", "(D) Stay on the train until the end"], "ans": "(C) Transfer at the next stop"}
            ]
        },
        {
            "transcript": "M: Hi, Susan. We just received a large order from a new client in Japan. They want 500 units of our new software by Friday.\\nW: Wow, that's great news! But 500 units by Friday? Our production team is already stretched thin with the domestic orders.\\nM: I know. That's why I'm authorizing overtime pay for the rest of the week. Can you inform the warehouse staff?\\nW: Absolutely. I'll send out a memo right now and hold a brief meeting at noon to organize the shifts.",
            "qs": [
                {"q": "What is the main topic of the conversation?", "opts": ["(A) A new software feature", "(B) A large international order", "(C) A trip to Japan", "(D) A change in management"], "ans": "(B) A large international order"},
                {"q": "Why is the woman concerned?", "opts": ["(A) The software has a bug.", "(B) The domestic market is failing.", "(C) The production team is busy.", "(D) The shipping costs are high."], "ans": "(C) The production team is busy."},
                {"q": "How will the company meet the deadline?", "opts": ["(A) By hiring new employees", "(B) By delaying other shipments", "(C) By outsourcing the work", "(D) By offering overtime pay"], "ans": "(D) By offering overtime pay"}
            ]
        },
        {
            "transcript": "W: Thank you for calling TechSupport. How can I help you today?\\nM: Hi, my laptop screen keeps freezing whenever I try to open the video editing software. I've restarted it three times.\\nW: I see. Are you using the latest version of the operating system? There was an update released yesterday that fixes compatibility issues.\\nM: I haven't updated it yet. I'll do that right now. Do I need to restart my computer again after the update?\\nW: Yes, please restart it once the installation is complete. If the issue persists, call us back.",
            "qs": [
                {"q": "What problem is the man experiencing?", "opts": ["(A) His internet connection is slow.", "(B) His computer screen is freezing.", "(C) He forgot his password.", "(D) His video files were deleted."], "ans": "(B) His computer screen is freezing."},
                {"q": "What does the woman ask the man?", "opts": ["(A) If he bought a new laptop", "(B) If he has updated his operating system", "(C) If he has a warranty", "(D) If he wants a refund"], "ans": "(B) If he has updated his operating system"},
                {"q": "What will the man probably do next?", "opts": ["(A) Purchase new software", "(B) Call a technician", "(C) Install an update", "(D) Edit a video"], "ans": "(C) Install an update"}
            ]
        },
        {
            "transcript": "M: Welcome to Green Leaf Landscaping. How can I assist you?\\nW: Hi, I'm looking for some drought-resistant plants for my front yard. I don't have much time to water them during the week.\\nM: We have a great selection of succulents and native desert plants right over here. They require very little maintenance.\\nW: These look lovely. Do you offer delivery and planting services? My car is too small to transport them.\\nM: Yes, we do. Delivery is free for purchases over $100, and planting is a flat fee of $50.",
            "qs": [
                {"q": "What is the woman looking for?", "opts": ["(A) Gardening tools", "(B) Lawn furniture", "(C) Low-maintenance plants", "(D) A water sprinkler system"], "ans": "(C) Low-maintenance plants"},
                {"q": "Why does the woman ask about delivery?", "opts": ["(A) Her car is too small.", "(B) She lives far away.", "(C) She has a back injury.", "(D) The plants are too heavy."], "ans": "(A) Her car is too small."},
                {"q": "What is required to get free delivery?", "opts": ["(A) Buying native desert plants", "(B) Paying a $50 flat fee", "(C) Spending more than $100", "(D) Joining a membership program"], "ans": "(C) Spending more than $100"}
            ]
        },
        {
            "transcript": "W: Jason, the air conditioning in the west wing seems to be broken. It's incredibly hot in the accounting office.\\nM: Really? The maintenance crew just serviced the HVAC system last weekend. I'll call them to come back and take a look.\\nW: Please tell them to hurry. The staff is complaining, and it's affecting our productivity.\\nM: I'll mark it as an emergency. In the meantime, I can bring up some portable fans from the basement storage.",
            "qs": [
                {"q": "What is the problem in the accounting office?", "opts": ["(A) The lights are flickering.", "(B) The air conditioning is broken.", "(C) There is a water leak.", "(D) The computers are overheating."], "ans": "(B) The air conditioning is broken."},
                {"q": "When was the system last serviced?", "opts": ["(A) Yesterday", "(B) Last weekend", "(C) A month ago", "(D) This morning"], "ans": "(B) Last weekend"},
                {"q": "What does the man offer to do immediately?", "opts": ["(A) Send the staff home", "(B) Call the fire department", "(C) Bring portable fans", "(D) Buy a new air conditioner"], "ans": "(C) Bring portable fans"}
            ]
        },
        {
            "transcript": "M: Good afternoon. I have a reservation under the name Arthur Jenkins for three nights.\\nW: Welcome, Mr. Jenkins. Yes, I see your reservation for a standard room with a city view. Unfortunately, that room type is currently being cleaned and won't be ready for another hour.\\nM: Oh, that's inconvenient. I have a Zoom meeting in 20 minutes, and I really need a quiet place.\\nW: I apologize for the delay. Tell you what, I can upgrade you to an executive suite on the top floor at no extra charge. It's ready right now.",
            "qs": [
                {"q": "Where does this conversation take place?", "opts": ["(A) At a restaurant", "(B) At an airport check-in", "(C) At a hotel reception", "(D) At an apartment complex"], "ans": "(C) At a hotel reception"},
                {"q": "Why is the man's reserved room unavailable?", "opts": ["(A) It is occupied by another guest.", "(B) It is currently being cleaned.", "(C) It is undergoing repairs.", "(D) It was double-booked."], "ans": "(B) It is currently being cleaned."},
                {"q": "How does the woman solve the problem?", "opts": ["(A) She gives him a discount.", "(B) She provides a free meal.", "(C) She books him a meeting room.", "(D) She upgrades his room."], "ans": "(D) She upgrades his room."}
            ]
        },
        {
            "transcript": "W: Did you see the memo about the new mandatory security training?\\nM: Yes, I read it this morning. We have to complete a series of online modules by next Friday, right?\\nW: Exactly. But I can't seem to log into the training portal. It keeps saying my credentials are invalid.\\nM: I had the same issue. You have to email the IT helpdesk to reset your password specifically for that portal. The standard network password doesn't work.",
            "qs": [
                {"q": "What do the employees have to do by next Friday?", "opts": ["(A) Attend a security seminar", "(B) Complete online training", "(C) Change their passwords", "(D) Submit a security report"], "ans": "(B) Complete online training"},
                {"q": "What problem is the woman facing?", "opts": ["(A) She cannot log into a portal.", "(B) She lost the memo.", "(C) She does not have a computer.", "(D) She missed a deadline."], "ans": "(A) She cannot log into a portal."},
                {"q": "What does the man suggest the woman do?", "opts": ["(A) Use his computer", "(B) Reset her network password", "(C) Email the IT helpdesk", "(D) Ignore the training"], "ans": "(C) Email the IT helpdesk"}
            ]
        },
        {
            "transcript": "M: The feedback from our latest customer survey is in. Overall, clients love the durability of our backpacks, but they are unhappy with the limited color options.\\nW: That makes sense. We only offer black, navy, and gray. We should introduce some brighter colors for the summer collection.\\nM: I agree. I'll ask the design team to come up with some proposals using red, yellow, and green fabrics.\\nW: Good idea. We should also run a poll on social media to ask our followers which colors they would prefer.",
            "qs": [
                {"q": "What do customers like about the company's backpacks?", "opts": ["(A) The price", "(B) The durability", "(C) The size", "(D) The colorful designs"], "ans": "(B) The durability"},
                {"q": "What complaint did customers have?", "opts": ["(A) Shipping is too slow.", "(B) The zippers break easily.", "(C) Limited color options.", "(D) Customer service is poor."], "ans": "(C) Limited color options."},
                {"q": "What will the woman likely do?", "opts": ["(A) Change the fabric supplier", "(B) Fire the design team", "(C) Reduce the price of the backpacks", "(D) Start a social media poll"], "ans": "(D) Start a social media poll"}
            ]
        }
    ]

    q_idx = 32 # Part 3 starts at Q32
    part3_stage_idx = 0
    for stage in data["stages"]:
        if stage["id"].startswith("part3_conv_"):
            conv = part3_convs[part3_stage_idx]
            # Replace placeholder audio with a transcript
            # (To simulate the real test context where you can read the dialog for now)
            stage["instructions"] = f"AUDIO TRANSCRIPT:\\n{conv['transcript']}\\n\\n" + stage["instructions"]
            
            new_qs = []
            for q_data in conv["qs"]:
                new_qs.append({
                    "id": f"q{q_idx}",
                    "question": q_data["q"],
                    "options": q_data["opts"],
                    "correct_answer": q_data["ans"]
                })
                q_idx += 1
            stage["questions"] = new_qs
            part3_stage_idx += 1


    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    update_parts_2_and_3()
    print("Successfully updated Part 2 and Part 3 with realistic TOEIC content.")
