import json
import random
import os
import uuid

# ==========================================
# 1. BASE DE DATOS DE REUNIONES (B1-6)
# ==========================================

DB = {
    "phrasal_verbs": [
        {"verb": "bring up", "def": "Start talking about a subject.", "context": "I'd like to ___ the budget issue."},
        {"verb": "call off", "def": "Cancel an event.", "context": "They had to ___ the meeting."},
        {"verb": "wrap up", "def": "Finish or conclude.", "context": "Let's ___ this discussion by 5 PM."},
        {"verb": "go over", "def": "Examine or review in detail.", "context": "Let's ___ the sales figures."},
        {"verb": "fill in", "def": "Give someone missing information.", "context": "Can you ___ me ___ on what I missed?"},
        {"verb": "move on", "def": "Start doing or discussing something new.", "context": "If there are no questions, let's ___."},
        {"verb": "look into", "def": "Investigate.", "context": "I will ___ that problem immediately."}
    ],
    "meeting_stages": [
        {"stage": "Opening", "phrases": ["Let's get started", "Thanks for coming", "The aim of this meeting is"]},
        {"stage": "Main Body", "phrases": ["First on the agenda", "Moving on to the next point", "I'd like to hand over to"]},
        {"stage": "Closing", "phrases": ["To sum up", "Let's call it a day", "Thank you for your time"]}
    ],
    "roles": [
        {"role": "Chairperson", "task": "Lead and moderate the discussion."},
        {"role": "Note-taker", "task": "Write down the minutes."},
        {"role": "Participant", "task": "Share ideas and listen."}
    ],
    "vocabulary_list": [
        {"word": "Agenda", "meaning": "A list of items to be discussed at a formal meeting.", "ipa": "/əˈdʒɛndə/"},
        {"word": "Minutes", "meaning": "The written record of what was said at a meeting.", "ipa": "/ˈmɪnɪts/"},
        {"word": "Consensus", "meaning": "A general agreement.", "ipa": "/kənˈsɛnsəs/"},
        {"word": "AOB", "meaning": "Any Other Business (items discussed at the end).", "ipa": "/ˌeɪ oʊ ˈbiː/"}
    ]
}

# ==========================================
# 2. UTILIDADES
# ==========================================

def generate_unique_id(prefix):
    return f"{prefix}_{uuid.uuid4().hex[:8]}"

# ==========================================
# 3. GENERADORES DE EJERCICIOS (DRILLS)
# ==========================================

def gen_phrasal_definition(idx):
    """(VOCAB) Definiciones de Phrasal Verbs."""
    item = random.choice(DB["phrasal_verbs"])
    
    # Distractores
    others = [pv["verb"] for pv in DB["phrasal_verbs"] if pv["verb"] != item["verb"]]
    options = [item["verb"]] + random.sample(others, 2)
    random.shuffle(options)
    
    return {
        "id": generate_unique_id("vocab"),
        "type": "quiz_choice",
        "difficulty": "medium",
        "tags": ["vocabulary", "phrasal_verbs"],
        "question": f"Which phrasal verb means: **'{item['def']}'**?",
        "options": options,
        "correct_answer": item["verb"],
        "explanation": f"'{item['verb']}' se usa en este contexto: {item['context']}"
    }

def gen_meeting_stage_logic(idx):
    """(LOGIC) Identificar la etapa de la reunión."""
    stage = random.choice(DB["meeting_stages"])
    phrase = random.choice(stage["phrases"])
    
    # Distractores
    other_stages = [s["stage"] for s in DB["meeting_stages"] if s["stage"] != stage["stage"]]
    options = [stage["stage"]] + other_stages
    random.shuffle(options)
    
    return {
        "id": generate_unique_id("logic"),
        "type": "quiz_choice",
        "difficulty": "easy",
        "tags": ["business_skills", "meetings"],
        "question": f"When would you say: **'{phrase}'**?",
        "options": options,
        "correct_answer": stage["stage"],
        "explanation": f"Esta frase se usa típicamente en la etapa de {stage['stage']}."
    }

def gen_phrasal_context_fill(idx):
    """(GRAMMAR) Completar oración con phrasal verb."""
    item = random.choice(DB["phrasal_verbs"])
    q = item["context"].replace(item["verb"], "______")
    
    # Extraer preposición correcta e incorrecta
    parts = item["verb"].split(" ")
    verb_base = parts[0]
    
    # Distractores: mismo verbo, distinta preposición
    distractor1 = f"{verb_base} out"
    distractor2 = f"{verb_base} down"
    if distractor1 == item["verb"]: distractor1 = f"{verb_base} up"
    
    options = [item["verb"], distractor1, distractor2]
    random.shuffle(options)
    
    return {
        "id": generate_unique_id("gram"),
        "type": "quiz_choice",
        "difficulty": "medium",
        "tags": ["grammar", "phrasal_verbs"],
        "question": f"Complete: \"{q}\"",
        "options": options,
        "correct_answer": item["verb"],
        "explanation": f"El phrasal verb correcto es '{item['verb']}'."
    }

def gen_agenda_scramble(idx):
    """(SYNTAX) Ordenar puntos de agenda/frases."""
    phrases = [
        "Let's get down to business",
        "Does anyone have any questions",
        "I would like to wrap up now",
        "Moving on to the next item"
    ]
    phrase = random.choice(phrases)
    parts = phrase.split(" ")
    scrambled = parts.copy()
    random.shuffle(scrambled)
    
    return {
        "id": generate_unique_id("ord"),
        "type": "order_sentence",
        "difficulty": "medium",
        "tags": ["syntax", "speaking"],
        "question": "Ordena la frase:",
        "parts": scrambled,
        "correct_order": parts,
        "explanation": "Frase común en reuniones."
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
        "id": "pro-b1-6",
        "title": "Leading a Meeting",
        "level": "B1",
        "cefr_code": "B1.2",
        "description": "Aprende a moderar reuniones usando Phrasal Verbs clave y estructuras de apertura/cierre.",
        "tags": ["meetings", "phrasal_verbs", "leadership", "communication"],
        "duration_min": 50,
        "learning_objectives": ["Can lead a meeting opening and closing", "Can use phrasal verbs like 'bring up' and 'wrap up'", "Can manage the agenda"],
        "prerequisites": ["pro-b1-5"],
        "vocabulary_list": DB["vocabulary_list"],
        "theme_color": "#0891B2", # Cyan (Clarity/Communication)
        "cultural_notes": "Punctuality is critical. Starting a meeting late is disrespectful. 'Let's get started' is the standard phrase to stop small talk and begin.",
        "stages": []
    }

    # --- STAGE 1: LECTURE ---
    lesson["stages"].append({
        "id": "stage_intro",
        "type": "lecture",
        "title": "Meeting Masterclass",
        "parts": [
            {
                "visual": "## Key Phrasal Verbs 🗣️\n\n* **Bring up**: Mention a topic.\n* **Go over**: Review details.\n* **Call off**: Cancel.\n* **Wrap up**: Finish.",
                "audio_script": "Native speakers love phrasal verbs in meetings. Instead of 'cancel', we say 'call off'. Instead of 'finish', we say 'wrap up'. Master these to sound natural.",
                "duration": 20,
                "image_prompt": "A diverse group of professionals sitting around a meeting table with a leader standing."
            },
            {
                "visual": "## Structure 🏗️\n\n1. **Open**: 'Let's get started.'\n2. **Body**: 'Moving on to...'\n3. **Close**: 'To sum up...'",
                "audio_script": "A good leader guides the team through stages. Use signposting language like 'Moving on' or 'Let's turn to' to change topics smoothly.",
                "duration": 15
            }
        ]
    })

    # --- BLOQUES DE EJERCICIOS (100 TOTAL) ---
    all_questions = []

    # Generamos 100 ejercicios mezclados
    for i in range(30): all_questions.append(gen_phrasal_context_fill(i))   # Gramática
    for i in range(30): all_questions.append(gen_phrasal_definition(i+30))  # Vocabulario
    for i in range(20): all_questions.append(gen_meeting_stage_logic(i+60)) # Lógica
    for i in range(20): all_questions.append(gen_agenda_scramble(i+80))     # Sintaxis
    
    random.shuffle(all_questions)

    # Chunking en bloques de 20
    chunk_size = 20
    for i in range(0, len(all_questions), chunk_size):
        chunk = all_questions[i:i + chunk_size]
        block_num = (i // chunk_size) + 1
        
        lesson["stages"].append({
            "id": f"stage_practice_block_{block_num}",
            "type": "gamified_quiz",
            "title": f"Leadership Drill {block_num}",
            "description": f"Dirección de reuniones {block_num}/5.",
            "xp_reward": 100 + (block_num * 10),
            "questions": chunk,
            "recommended_streak": 2
        })

    # --- BOSS STAGE: THE CHAIRPERSON ---
    lesson["stages"].append({
        "id": "stage_boss",
        "type": "practice_chat",
        "title": "You are the Leader",
        "scenario": "Eres el líder de la reunión. Abre la sesión, revisa los números y cierra a tiempo.",
        "ai_system_prompt": """
        ROLE: Meeting Participant (Sarah).
        GOAL: Participate in the meeting led by the user.
        BEHAVIOR:
        1. Wait for user to open ("Let's start").
        2. Wait for user to say "Let's go over the numbers". Then say: "Here is the report."
        3. Ask: "Can I bring up a new topic?".
        4. Wait for user to either accept or say "Let's wrap up".
        """,
        "initial_message": "(Everyone is seated and looking at you). Ready when you are, boss.",
        "next_lesson_id": "pro-b1-7",
        "confidence_score_enabled": True,
        "badge_reward": "Chairperson"
    })

    return lesson

# --- EXEC ---
if __name__ == "__main__":
    data = build_lesson()
    out_path = "backend/app/data/lessons/pro-b1-6.json"
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        
    print(f"✅ LECCIÓN B1-6 (TITANIUM) GENERADA CON ÉXITO.")
    print(f"📂 Ubicación: {out_path}")
    print(f"🔢 Total de Ejercicios: {sum(len(s.get('questions', [])) for s in data['stages'])}")