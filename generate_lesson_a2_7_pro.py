import json
import random
import os
import uuid

# ==========================================
# 1. BASE DE DATOS DE AGENDA (A2-7)
# ==========================================

DB = {
    "fixed_plans": [
        {"verb": "meet", "ing": "meeting", "obj": "the client", "time": "tomorrow morning"},
        {"verb": "fly", "ing": "flying", "obj": "to London", "time": "next Friday"},
        {"verb": "have", "ing": "having", "obj": "lunch with the CEO", "time": "at 1 PM"},
        {"verb": "present", "ing": "presenting", "obj": "the quarterly report", "time": "on Tuesday"},
        {"verb": "visit", "ing": "visiting", "obj": "the factory", "time": "next week"},
        {"verb": "attend", "ing": "attending", "obj": "the conference", "time": "in July"}
    ],
    "reschedule_vocab": [
        {"word": "postpone", "def": "Move to a later time/date.", "context": "We need to ___ the meeting to Friday."},
        {"word": "move up", "def": "Move to an earlier time/date.", "context": "Can we ___ the call to 9 AM?"},
        {"word": "cancel", "def": "Decide that an event will not happen.", "context": "The flight was ___, so I am staying home."},
        {"word": "confirm", "def": "State that a plan is definite.", "context": "Please ___ your attendance by email."}
    ],
    "conflicts": [
        {"excuse": "I have a dentist appointment", "status": "busy"},
        {"excuse": "I am free all day", "status": "free"},
        {"excuse": "I am meeting the boss", "status": "busy"},
        {"excuse": "My schedule is open", "status": "free"},
        {"excuse": "Something came up", "status": "busy"}
    ],
    "subjects": [
        {"pron": "I", "be": "am"},
        {"pron": "She", "be": "is"},
        {"pron": "We", "be": "are"},
        {"pron": "They", "be": "are"},
        {"pron": "The Manager", "be": "is"}
    ],
    "vocabulary_list": [
        {"word": "Schedule", "meaning": "A plan for carrying out a process or procedure.", "ipa": "/ˈʃɛdjuːl/"},
        {"word": "Arrangement", "meaning": "A plan or preparation for a future event.", "ipa": "/əˈreɪndʒmənt/"},
        {"word": "Appointment", "meaning": "A meeting set at a specific time.", "ipa": "/əˈpɔɪntmənt/"},
        {"word": "Deadline", "meaning": "The latest time or date by which something should be completed.", "ipa": "/ˈdɛdlaɪn/"}
    ]
}

# ==========================================
# 2. UTILIDADES
# ==========================================

def generate_unique_id(prefix):
    return f"{prefix}_{uuid.uuid4().hex[:8]}"

# ==========================================
# 3. GENERADORES DE EJERCICIOS AVANZADOS
# ==========================================

def gen_present_continuous_future(idx):
    """(GRAMMAR) Present Continuous para planes fijos."""
    plan = random.choice(DB["fixed_plans"])
    subj = random.choice(DB["subjects"])
    
    # "I am meeting the client tomorrow."
    sentence = f"{subj['pron']} ___ {plan['ing']} {plan['obj']} {plan['time']}."
    
    # Distractores: "will meet" (less definite), "meet" (habitual)
    distractors = [f"will {plan['verb']}", plan['verb']]
    correct = f"{subj['be']} {plan['ing']}" # am meeting / is meeting
    
    options = [correct] + distractors
    random.shuffle(options)
    
    return {
        "id": generate_unique_id("gram"),
        "type": "quiz_choice",
        "difficulty": "medium",
        "tags": ["grammar", "future_arrangements", "tenses"],
        "question": f"Completa el plan fijo (Fixed Plan): '{sentence}'",
        "options": options,
        "correct_answer": correct,
        "explanation": "Para planes confirmados en agenda, usamos el Presente Continuo (Be + Ing)."
    }

def gen_reschedule_vocab(idx):
    """(VOCAB) Postpone vs Move up vs Cancel."""
    item = random.choice(DB["reschedule_vocab"])
    
    # Distractores
    others = [i["word"] for i in DB["reschedule_vocab"] if i["word"] != item["word"]]
    options = [item["word"]] + random.sample(others, 2)
    random.shuffle(options)
    
    return {
        "id": generate_unique_id("vocab"),
        "type": "quiz_choice",
        "difficulty": "medium",
        "tags": ["vocabulary", "meetings"],
        "question": f"Complete: \"{item['context']}\"",
        "options": options,
        "correct_answer": item["word"],
        "explanation": f"Definition: {item['def']}"
    }

def gen_calendar_conflict_logic(idx):
    """(LOGIC) Analizar si hay conflicto de horario."""
    scenario = random.choice(DB["conflicts"])
    
    request = "Can we meet tomorrow at 2 PM?"
    response = f"Sorry, {scenario['excuse']}." if scenario['status'] == "busy" else f"Sure, {scenario['excuse']}."
    
    question = f"Request: '{request}'\nResponse: '{response}'\n\nIs there a conflict?"
    
    return {
        "id": generate_unique_id("logic"),
        "type": "quiz_choice",
        "difficulty": "easy",
        "tags": ["logic", "scheduling"],
        "question": question,
        "options": ["Yes, they cannot meet.", "No, they can meet."],
        "correct_answer": "Yes, they cannot meet." if scenario['status'] == "busy" else "No, they can meet.",
        "explanation": "Si la persona está ocupada ('busy'), hay un conflicto."
    }

def gen_phrase_ordering(idx):
    """(SYNTAX) Ordenar frases de disculpa/reagendamiento."""
    phrases = [
        "Something came up suddenly",
        "I can't make it tomorrow",
        "Let's move it to Friday",
        "Can we reschedule the call"
    ]
    phrase = random.choice(phrases)
    parts = phrase.split(" ")
    scrambled = parts.copy()
    random.shuffle(scrambled)
    
    return {
        "id": generate_unique_id("ord"),
        "type": "order_sentence",
        "difficulty": "medium",
        "tags": ["syntax", "expressions"],
        "question": "Ordena la frase:",
        "parts": scrambled,
        "correct_order": parts,
        "explanation": "Expresiones comunes de negocios."
    }

# ==========================================
# 4. BUILDER
# ==========================================

def build_lesson():
    lesson = {
        "meta": {
            "version": "Titanium 2.1",
            "created_at": "2024-01-01",
            "author": "Titanium Engine"
        },
        "id": "pro-a2-7",
        "title": "Scheduling Conflicts",
        "level": "A2",
        "cefr_code": "A2.2",
        "description": "Final del Nivel A2. Aprende a gestionar tu agenda, usar el Presente Continuo para el futuro y reagendar reuniones.",
        "tags": ["scheduling", "future_continuous", "meetings", "time_management"],
        "duration_min": 50,
        "learning_objectives": ["Can talk about fixed future plans", "Can reschedule appointments politely", "Can explain why they can't attend"],
        "prerequisites": ["pro-a2-6"],
        "vocabulary_list": DB["vocabulary_list"],
        "theme_color": "#7E22CE", # Purple (Royal/Executive Time)
        "cultural_notes": "In Western business culture, 'Something came up' is a polite, vague excuse to cancel a meeting without giving too many personal details.",
        "stages": []
    }

    # --- STAGE 1: LECTURE ---
    lesson["stages"].append({
        "id": "stage_intro",
        "type": "lecture",
        "title": "Mastering Your Calendar",
        "parts": [
            {
                "visual": "## The Calendar Rule 📅\nIf it's in your diary -> **Present Continuous**\n\n* 'I **am flying** to Paris tomorrow.'\n* (NOT 'I will fly')",
                "audio_script": "Congratulations on reaching the end of Level A2. Today we master time. Remember: for fixed arrangements, we use the Present Continuous, not Will.",
                "duration": 15,
                "image_prompt": "A digital calendar showing 'Meeting with Client' at 10 AM tomorrow."
            },
            {
                "visual": "## Conflict Phrases ⚠️\n\n* **I can't make it**: No puedo ir.\n* **Something came up**: Surgió algo.\n* **Postpone**: Mover para después.",
                "audio_script": "Sometimes plans change. If you can't attend, say 'I can't make it'. It's professional and polite.",
                "duration": 15
            }
        ]
    })

    # --- BLOQUES DE EJERCICIOS (100 TOTAL) ---
    all_questions = []

    # Generamos 100 ejercicios mezclados
    for i in range(30): all_questions.append(gen_present_continuous_future(i)) # Gramática Clave
    for i in range(25): all_questions.append(gen_reschedule_vocab(i+30))       # Vocabulario
    for i in range(25): all_questions.append(gen_calendar_conflict_logic(i+55))# Lógica
    for i in range(20): all_questions.append(gen_phrase_ordering(i+80))        # Sintaxis
    
    random.shuffle(all_questions)

    # Chunking en bloques de 20
    chunk_size = 20
    for i in range(0, len(all_questions), chunk_size):
        chunk = all_questions[i:i + chunk_size]
        block_num = (i // chunk_size) + 1
        
        lesson["stages"].append({
            "id": f"stage_practice_block_{block_num}",
            "type": "gamified_quiz",
            "title": f"Agenda Audit {block_num}",
            "description": f"Gestión de tiempo {block_num}/5.",
            "xp_reward": 100 + (block_num * 10),
            "questions": chunk,
            "recommended_streak": 2
        })

    # --- BOSS STAGE: THE BUSY MANAGER ---
    lesson["stages"].append({
        "id": "stage_boss",
        "type": "practice_chat",
        "title": "Rescheduling with the Boss",
        "scenario": "Tienes una reunión con tu jefe mañana a las 9 AM, pero tienes un conflicto médico. Reagenda.",
        "ai_system_prompt": """
        ROLE: Busy Boss.
        GOAL: Reschedule a meeting.
        BEHAVIOR:
        1. Say: "I'll see you tomorrow at 9 AM for the review."
        2. Wait for user to say they can't make it (using "I am doing X" or "I have an appointment").
        3. If they propose a new time, accept.
        4. If they just say "No", ask "Why? Is something wrong?".
        """,
        "initial_message": "Hi. Just confirming our meeting tomorrow at 9 AM. You'll be there, right?",
        "next_lesson_id": "pro-b1-1", # Salto al Nivel B1
        "confidence_score_enabled": True,
        "badge_reward": "Time Master (A2 Completed)"
    })

    return lesson

# --- EXEC ---
if __name__ == "__main__":
    data = build_lesson()
    out_path = "backend/app/data/lessons/pro-a2-7.json"
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        
    print(f"✅ LECCIÓN A2-7 (TITANIUM) GENERADA CON ÉXITO.")
    print(f"📂 Ubicación: {out_path}")
    print(f"🔢 Total de Ejercicios: {sum(len(s.get('questions', [])) for s in data['stages'])}")