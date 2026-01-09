import json
import random
import os
import uuid

# ==========================================
# 1. BASE DE DATOS DE PROYECTOS (A2-1)
# ==========================================

DB = {
    "regular_verbs": [
        {"base": "start", "past": "started", "context": "the project"},
        {"base": "finish", "past": "finished", "context": "the report"},
        {"base": "call", "past": "called", "context": "the client"},
        {"base": "organize", "past": "organized", "context": "the meeting"},
        {"base": "develop", "past": "developed", "context": "the strategy"},
        {"base": "check", "past": "checked", "context": "the emails"},
        {"base": "wait", "past": "waited", "context": "for the boss"}
    ],
    "irregular_verbs": [
        {"base": "go", "past": "went", "context": "to the headquarters"},
        {"base": "send", "past": "sent", "context": "the invoice"},
        {"base": "meet", "past": "met", "context": "the partners"},
        {"base": "have", "past": "had", "context": "a problem"},
        {"base": "write", "past": "wrote", "context": "the proposal"},
        {"base": "buy", "past": "bought", "context": "new software"},
        {"base": "do", "past": "did", "context": "a great job"},
        {"base": "speak", "past": "spoke", "context": "to the manager"}
    ],
    "time_markers": [
        {"marker": "yesterday", "pos": "end", "sentence": "I sent the email ___."},
        {"marker": "last week", "pos": "end", "sentence": "We met the client ___."},
        {"marker": "two days ago", "pos": "end", "sentence": "The project started ___."},
        {"marker": "in 2023", "pos": "end", "sentence": "We launched the product ___."}
    ],
    "vocabulary_list": [
        {"word": "Deadline", "meaning": "The latest time or date by which something should be completed.", "ipa": "/ˈdɛdlaɪn/"},
        {"word": "Milestone", "meaning": "A significant stage or event in the development of something.", "ipa": "/ˈmaɪlstoʊn/"},
        {"word": "Update", "meaning": "Make something more modern or give the latest news.", "ipa": "/ʌpˈdeɪt/"},
        {"word": "Task", "meaning": "A piece of work to be done or undertaken.", "ipa": "/tæsk/"}
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

def gen_regular_irregular_sort(idx):
    """(BUCKET SORT) Clasificar verbos en Regulares vs Irregulares."""
    regs = random.sample(DB["regular_verbs"], 2)
    irregs = random.sample(DB["irregular_verbs"], 2)
    items = regs + irregs
    random.shuffle(items)
    
    buckets = {
        "Regular (+ed)": [v["base"] for v in regs],
        "Irregular (Change)": [v["base"] for v in irregs]
    }
    
    return {
        "id": generate_unique_id("sort"),
        "type": "bucket_sort",
        "difficulty": "medium",
        "tags": ["grammar", "verbs"],
        "question": "Clasifica los verbos según su tipo en pasado:",
        "items": [v["base"] for v in items],
        "buckets": buckets,
        "explanation": "Los regulares terminan en -ed (Start -> Started). Los irregulares cambian (Go -> Went)."
    }

def gen_past_conjugation(idx):
    """(QUIZ) Conjugación correcta en contexto."""
    is_reg = random.choice([True, False])
    if is_reg:
        verb = random.choice(DB["regular_verbs"])
        distractor = verb["base"] + "ed" if verb["base"][-1] == "e" else verb["base"] # Trampa simple
        if distractor == verb["past"]: distractor = verb["base"] + "ing"
    else:
        verb = random.choice(DB["irregular_verbs"])
        distractor = verb["base"] + "ed" # Error común (goed, sended)
        
    options = [verb["past"], distractor, verb["base"]]
    random.shuffle(options)
    
    return {
        "id": generate_unique_id("conj"),
        "type": "quiz_choice",
        "difficulty": "medium",
        "tags": ["grammar", "past_simple"],
        "question": f"Yesterday, I ___ {verb['context']}.",
        "options": options,
        "correct_answer": verb["past"],
        "explanation": f"El pasado de '{verb['base']}' es '{verb['past']}'."
    }

def gen_sentence_ordering(idx):
    """(SYNTAX) Ordenar frase en pasado."""
    verb = random.choice(DB["irregular_verbs"] + DB["regular_verbs"])
    time = random.choice(DB["time_markers"])
    
    # "We sent the email yesterday"
    sentence = f"We {verb['past']} {verb['context']} {time['marker']}"
    parts = sentence.split(" ")
    scrambled = parts.copy()
    random.shuffle(scrambled)
    
    return {
        "id": generate_unique_id("ord"),
        "type": "order_sentence",
        "difficulty": "hard",
        "tags": ["syntax", "sentence_structure"],
        "question": "Ordena el reporte de progreso:",
        "parts": scrambled,
        "correct_order": parts,
        "explanation": "Estructura: Sujeto + Verbo Pasado + Objeto + Tiempo."
    }

def gen_time_marker_logic(idx):
    """(LOGIC) Uso de Ago vs Last."""
    # Logic: "ago" va al final despues de una cantidad de tiempo. "Last" va antes del periodo.
    case = random.choice(["ago", "last"])
    
    if case == "ago":
        q = "I finished it two days ___."
        correct = "ago"
        distractor = "last"
    else:
        q = "I finished it ___ week."
        correct = "last"
        distractor = "ago"
        
    return {
        "id": generate_unique_id("time"),
        "type": "quiz_choice",
        "difficulty": "easy",
        "tags": ["grammar", "time_markers"],
        "question": f"Completa: '{q}'",
        "options": [correct, distractor, "yesterday"],
        "correct_answer": correct,
        "explanation": "Usamos 'ago' después de un periodo (2 days ago). Usamos 'last' antes del periodo (last week)."
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
        "id": "pro-a2-1",
        "title": "Project Update",
        "level": "A2",
        "cefr_code": "A2.1",
        "description": "Aprende a reportar progresos pasados usando verbos regulares e irregulares.",
        "tags": ["past_simple", "reporting", "verbs", "business"],
        "duration_min": 45,
        "learning_objectives": ["Can report completed tasks", "Can use regular and irregular verbs correctly", "Can use time markers (ago, last, yesterday)"],
        "prerequisites": ["pro-a1-7"],
        "vocabulary_list": DB["vocabulary_list"],
        "theme_color": "#4338CA", # Indigo (Professional/Deep)
        "cultural_notes": "In agile meetings (stand-ups), updates should be brief: What I did yesterday, what I am doing today, and any blockers.",
        "stages": []
    }

    # --- STAGE 1: LECTURE ---
    lesson["stages"].append({
        "id": "stage_intro",
        "type": "lecture",
        "title": "Reporting Progress",
        "parts": [
            {
                "visual": "## Regular (+ED)\nStart -> Start**ed**\nFinish -> Finish**ed**\n\n## Irregular (Memory)\nGo -> **Went**\nSend -> **Sent**",
                "audio_script": "Welcome to Level A2. In business, we constantly report what we did. Remember: Regular verbs end in E-D, but Irregular verbs change completely. You must memorize them.",
                "duration": 15,
                "image_prompt": "A Kanban board showing 'To Do', 'Doing', and 'Done' columns."
            }
        ]
    })

    # --- BLOQUES DE EJERCICIOS (100 TOTAL) ---
    all_questions = []

    # Generamos 100 ejercicios mezclados
    for i in range(30): all_questions.append(gen_past_conjugation(i))       # Gramática pura
    for i in range(20): all_questions.append(gen_regular_irregular_sort(i+30)) # Clasificación
    for i in range(30): all_questions.append(gen_sentence_ordering(i+50))   # Sintaxis
    for i in range(20): all_questions.append(gen_time_marker_logic(i+80))   # Lógica temporal
    
    random.shuffle(all_questions)

    # Chunking en bloques de 20
    chunk_size = 20
    for i in range(0, len(all_questions), chunk_size):
        chunk = all_questions[i:i + chunk_size]
        block_num = (i // chunk_size) + 1
        
        lesson["stages"].append({
            "id": f"stage_practice_block_{block_num}",
            "type": "gamified_quiz",
            "title": f"Sprint Review {block_num}",
            "description": f"Reporte de actividades {block_num}/5.",
            "xp_reward": 100 + (block_num * 10),
            "questions": chunk,
            "recommended_streak": 2
        })

    # --- BOSS STAGE: MONDAY MORNING MEETING ---
    lesson["stages"].append({
        "id": "stage_boss",
        "type": "practice_chat",
        "title": "The Stand-up Meeting",
        "scenario": "Es lunes por la mañana. Tu jefe te pregunta qué hiciste la semana pasada.",
        "ai_system_prompt": """
        ROLE: Project Manager.
        GOAL: Ask for a progress report.
        BEHAVIOR:
        1. Ask "What did you work on last week?".
        2. Ask a follow up: "Did you finish the report?" or "Who did you meet?".
        3. Correct Present Tense usage (e.g., if user says "I send the email", correct to "You SENT the email").
        """,
        "initial_message": "Good morning team. Let's do a quick update. What did you accomplish last week?",
        "next_lesson_id": "pro-a2-2",
        "confidence_score_enabled": True,
        "badge_reward": "Reporter"
    })

    return lesson

# --- EXEC ---
if __name__ == "__main__":
    data = build_lesson()
    out_path = "backend/app/data/lessons/pro-a2-1.json"
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        
    print(f"✅ LECCIÓN A2-1 (TITANIUM) GENERADA CON ÉXITO.")
    print(f"📂 Ubicación: {out_path}")
    print(f"🔢 Total de Ejercicios: {sum(len(s.get('questions', [])) for s in data['stages'])}")