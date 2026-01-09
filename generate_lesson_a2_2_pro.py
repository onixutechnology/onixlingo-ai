import json
import random
import os
import uuid

# ==========================================
# 1. BASE DE DATOS ESTRATÉGICA (A2-2)
# ==========================================

DB = {
    "actions": [
        {"verb": "launch", "obj": "the new website", "dept": "Marketing"},
        {"verb": "hire", "obj": "three developers", "dept": "HR"},
        {"verb": "open", "obj": "a branch in London", "dept": "Strategy"},
        {"verb": "cut", "obj": "the budget", "dept": "Finance"},
        {"verb": "train", "obj": "the sales team", "dept": "Sales"},
        {"verb": "upgrade", "obj": "the servers", "dept": "IT"},
        {"verb": "audit", "obj": "the accounts", "dept": "Legal"}
    ],
    "timeframes": [
        {"term": "next quarter", "meaning": "in the next 3 months"},
        {"term": "tomorrow morning", "meaning": "very soon"},
        {"term": "in Q4", "meaning": "at the end of the year"},
        {"term": "next fiscal year", "meaning": "long term plan"}
    ],
    "subjects": [
        {"pron": "We", "be": "are"},
        {"pron": "I", "be": "am"},
        {"pron": "The CEO", "be": "is"},
        {"pron": "They", "be": "are"},
        {"pron": "She", "be": "is"}
    ],
    "vocabulary_list": [
        {"word": "Forecast", "meaning": "A prediction or estimate of future events.", "ipa": "/ˈfɔːrkæst/"},
        {"word": "Quarter", "meaning": "A period of three months (Q1, Q2, Q3, Q4).", "ipa": "/ˈkwɔːrtər/"},
        {"word": "Strategy", "meaning": "A plan of action designed to achieve a long-term aim.", "ipa": "/ˈstrætədʒi/"},
        {"word": "Launch", "meaning": "Start or set in motion an activity or enterprise.", "ipa": "/lɔːntʃ/"}
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

def gen_future_structure(idx):
    """(GRAMMAR) Estructura 'Be Going To'."""
    subj = random.choice(DB["subjects"])
    action = random.choice(DB["actions"])
    
    # "We are going to launch..."
    sentence = f"{subj['pron']} ___ going to {action['verb']} {action['obj']}."
    
    # Distractores: wrong verb to be, or missing 'going'
    distractor_be = "is" if subj['be'] == "are" else "are"
    if subj['pron'] == "I": distractor_be = "is"
    
    return {
        "id": generate_unique_id("struct"),
        "type": "quiz_choice",
        "difficulty": "medium",
        "tags": ["grammar", "future_plans"],
        "question": f"Completa el plan: '{sentence}'",
        "options": [subj["be"], distractor_be, "will", "do"],
        "correct_answer": subj["be"],
        "explanation": f"Sujeto '{subj['pron']}' usa '{subj['be']}' + going to."
    }

def gen_scrambled_plan(idx):
    """(SYNTAX) Ordenar una frase de futuro."""
    subj = random.choice(DB["subjects"])
    action = random.choice(DB["actions"])
    time = random.choice(DB["timeframes"])
    
    # "The CEO is going to cut the budget next quarter"
    full_sentence = f"{subj['pron']} {subj['be']} going to {action['verb']} {action['obj']} {time['term']}"
    
    parts = full_sentence.split(" ")
    scrambled = parts.copy()
    random.shuffle(scrambled)
    
    return {
        "id": generate_unique_id("ord"),
        "type": "order_sentence",
        "difficulty": "hard",
        "tags": ["syntax", "future_plans"],
        "question": "Ordena la estrategia:",
        "parts": scrambled,
        "correct_order": parts,
        "explanation": "Estructura: Sujeto + Be + Going To + Verbo + Objeto + Tiempo."
    }

def gen_dept_logic(idx):
    """(LOGIC) Asociar acción con departamento."""
    action = random.choice(DB["actions"])
    
    # Generar opciones de departamentos incorrectos
    all_depts = list(set(a["dept"] for a in DB["actions"]))
    options = [d for d in all_depts if d != action["dept"]]
    random.shuffle(options)
    final_options = options[:2] + [action["dept"]]
    random.shuffle(final_options)
    
    return {
        "id": generate_unique_id("logic"),
        "type": "quiz_choice",
        "difficulty": "medium",
        "tags": ["vocabulary", "business_context"],
        "question": f"Who is going to **{action['verb']} {action['obj']}**?",
        "options": final_options,
        "correct_answer": action["dept"],
        "explanation": f"Tareas como '{action['verb']} {action['obj']}' corresponden a {action['dept']}."
    }

def gen_negative_form(idx):
    """(GRAMMAR) Negación de planes."""
    subj = random.choice(DB["subjects"])
    
    q = f"Make it negative: '{subj['pron']} {subj['be']} going to sign.'"
    
    correct = f"{subj['pron']} {subj['be']} not going to sign"
    if subj['pron'] == "I":
        short = "I'm not going to sign"
    else:
        short = f"{subj['pron']}'t going to sign" # Artificial but recognizable distractor structure
        
    return {
        "id": generate_unique_id("neg"),
        "type": "quiz_choice",
        "difficulty": "medium",
        "tags": ["grammar", "negation"],
        "question": q,
        "options": [f"{subj['pron']} {subj['be']} not going to sign", f"{subj['pron']} not {subj['be']} going to sign", f"{subj['pron']} don't going to sign"],
        "correct_answer": f"{subj['pron']} {subj['be']} not going to sign",
        "explanation": "La negación va después del verbo To Be: 'is not' / 'are not'."
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
        "id": "pro-a2-2",
        "title": "Future Forecast",
        "level": "A2",
        "cefr_code": "A2.1",
        "description": "Aprende a hablar de planes y estrategias futuras usando 'Going To'.",
        "tags": ["future_plans", "strategy", "grammar", "business"],
        "duration_min": 45,
        "learning_objectives": ["Can describe future plans with 'going to'", "Can associate tasks with departments", "Can understand business timeframes (Quarters)"],
        "prerequisites": ["pro-a2-1"],
        "vocabulary_list": DB["vocabulary_list"],
        "theme_color": "#059669", # Emerald (Growth/Future)
        "cultural_notes": "In business, 'Going to' implies a strong intention or plan. Use 'Will' for spontaneous decisions or promises.",
        "stages": []
    }

    # --- STAGE 1: LECTURE ---
    lesson["stages"].append({
        "id": "stage_intro",
        "type": "lecture",
        "title": "Planning Ahead",
        "parts": [
            {
                "visual": "## The Strategy Formula 📈\n\nSubject + **BE** + **GOING TO** + Verb\n\n* We **are going to** launch.\n* She **is going to** hire.",
                "audio_script": "When we have a solid plan, we use 'Going to'. It's not a guess; it's a strategy. For example: 'We are going to open a new office next quarter'.",
                "duration": 15,
                "image_prompt": "A business calendar highlighting Q1, Q2, Q3, Q4 with 'Launch' written on a date."
            }
        ]
    })

    # --- BLOQUES DE EJERCICIOS (100 TOTAL) ---
    all_questions = []

    # Generamos 100 ejercicios mezclados
    for i in range(30): all_questions.append(gen_future_structure(i))       # Estructura básica
    for i in range(25): all_questions.append(gen_dept_logic(i+30))          # Lógica de negocios
    for i in range(25): all_questions.append(gen_scrambled_plan(i+55))      # Sintaxis compleja
    for i in range(20): all_questions.append(gen_negative_form(i+80))       # Negaciones
    
    random.shuffle(all_questions)

    # Chunking en bloques de 20
    chunk_size = 20
    for i in range(0, len(all_questions), chunk_size):
        chunk = all_questions[i:i + chunk_size]
        block_num = (i // chunk_size) + 1
        
        lesson["stages"].append({
            "id": f"stage_practice_block_{block_num}",
            "type": "gamified_quiz",
            "title": f"Strategy Session {block_num}",
            "description": f"Planificación estratégica {block_num}/5.",
            "xp_reward": 100 + (block_num * 10),
            "questions": chunk,
            "recommended_streak": 2
        })

    # --- BOSS STAGE: Q4 STRATEGY MEETING ---
    lesson["stages"].append({
        "id": "stage_boss",
        "type": "practice_chat",
        "title": "The Board Meeting",
        "scenario": "Presenta el plan para el próximo año (Q4) a la Junta Directiva.",
        "ai_system_prompt": """
        ROLE: Chairman of the Board.
        GOAL: Ask about the company's future plans.
        BEHAVIOR:
        1. Ask "What are we going to do about the falling sales?".
        2. Ask "Who is going to lead the new project?".
        3. Expect answers with "We are going to..." or "I am going to...".
        4. If user says "We will...", say "Is that a plan or a guess? Use 'going to' for plans."
        """,
        "initial_message": "The meeting is in session. Tell us, what is the strategy for the next quarter?",
        "next_lesson_id": "pro-a2-3",
        "confidence_score_enabled": True,
        "badge_reward": "Strategist"
    })

    return lesson

# --- EXEC ---
if __name__ == "__main__":
    data = build_lesson()
    out_path = "backend/app/data/lessons/pro-a2-2.json"
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        
    print(f"✅ LECCIÓN A2-2 (TITANIUM) GENERADA CON ÉXITO.")
    print(f"📂 Ubicación: {out_path}")
    print(f"🔢 Total de Ejercicios: {sum(len(s.get('questions', [])) for s in data['stages'])}")