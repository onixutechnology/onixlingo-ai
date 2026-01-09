import json
import random
import os
import uuid

# ==========================================
# 1. BASE DE DATOS DE FEEDBACK (B1-4)
# ==========================================

DB = {
    "feedback_adjectives": [
        {"word": "diligent", "type": "positive", "context": "You are very ___ with your tasks."},
        {"word": "reliable", "type": "positive", "context": "You are a ___ member of the team."},
        {"word": "proactive", "type": "positive", "context": "I like that you are so ___."},
        {"word": "inconsistent", "type": "negative", "context": "Your results have been a bit ___."},
        {"word": "disorganized", "type": "negative", "context": "Your desk seems a little ___."},
        {"word": "punctual", "type": "positive", "context": "Thank you for being ___."}
    ],
    "softeners": [
        {"rude": "You are lazy.", "soft": "You tend to lack motivation sometimes."},
        {"rude": "Your work is bad.", "soft": "Your work could be improved."},
        {"rude": "You are late.", "soft": "You seem to have trouble with punctuality."},
        {"rude": "It is wrong.", "soft": "It is not quite right."},
        {"rude": "You talk too much.", "soft": "You tend to dominate the conversation."}
    ],
    "sandwich_parts": [
        {"part": "Top Bun (Praise)", "phrase": "I really appreciate your dedication."},
        {"part": "Meat (Critique)", "phrase": "However, you missed a few deadlines."},
        {"part": "Bottom Bun (Positive)", "phrase": "Overall, keep up the good work."}
    ],
    "vocabulary_list": [
        {"word": "Feedback", "meaning": "Information about reactions to a product, a person's performance of a task, etc.", "ipa": "/ˈfiːdbæk/"},
        {"word": "Constructive", "meaning": "Serving a useful purpose; tending to build up.", "ipa": "/kənˈstrʌktɪv/"},
        {"word": "Evaluation", "meaning": "The making of a judgment about the amount, number, or value of something.", "ipa": "/ɪˌvæljuˈeɪʃən/"},
        {"word": "Improvement", "meaning": "A thing that makes something better or is better than something else.", "ipa": "/ɪmˈpruːvmənt/"}
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

def gen_softener_match(idx):
    """(GRAMMAR) Transformar rudo a suave."""
    item = random.choice(DB["softeners"])
    
    return {
        "id": generate_unique_id("soft"),
        "type": "quiz_choice",
        "difficulty": "medium",
        "tags": ["grammar", "soft_skills", "politeness"],
        "question": f"Make it professional: **'{item['rude']}'**",
        "options": [item["soft"], item["rude"] + " please", "You are very " + item["rude"].split()[-1]],
        "correct_answer": item["soft"],
        "explanation": "Usamos 'tend to', 'seem to' o 'could be' para suavizar la crítica."
    }

def gen_sandwich_structure(idx):
    """(LOGIC) Identificar la parte del Sándwich."""
    item = random.choice(DB["sandwich_parts"])
    
    # Distractores
    others = [p["part"] for p in DB["sandwich_parts"] if p["part"] != item["part"]]
    options = [item["part"]] + others
    random.shuffle(options)
    
    return {
        "id": generate_unique_id("logic"),
        "type": "quiz_choice",
        "difficulty": "easy",
        "tags": ["soft_skills", "feedback"],
        "question": f"In the Sandwich Method, what is this phrase?\n**'{item['phrase']}'**",
        "options": options,
        "correct_answer": item["part"],
        "explanation": "El método es: Elogio (Top) -> Crítica (Meat) -> Elogio (Bottom)."
    }

def gen_adjective_context(idx):
    """(VOCAB) Adjetivos de desempeño."""
    item = random.choice(DB["feedback_adjectives"])
    
    # Distractores del mismo tipo (positivo/negativo) para hacerlo difícil, o opuesto para fácil
    others = [a["word"] for a in DB["feedback_adjectives"] if a["word"] != item["word"]]
    options = [item["word"]] + random.sample(others, 2)
    random.shuffle(options)
    
    return {
        "id": generate_unique_id("vocab"),
        "type": "quiz_choice",
        "difficulty": "medium",
        "tags": ["vocabulary", "adjectives"],
        "question": f"Complete the feedback: \"{item['context']}\"",
        "options": options,
        "correct_answer": item["word"],
        "explanation": f"'{item['word']}' encaja mejor en este contexto {'positivo' if item['type']=='positive' else 'constructivo'}."
    }

def gen_feedback_scramble(idx):
    """(SYNTAX) Ordenar una frase de feedback."""
    sentences = [
        "You need to improve your punctuality",
        "I am very happy with your progress",
        "Please try to be more careful",
        "You tend to rush your work"
    ]
    sent = random.choice(sentences)
    parts = sent.split(" ")
    scrambled = parts.copy()
    random.shuffle(scrambled)
    
    return {
        "id": generate_unique_id("ord"),
        "type": "order_sentence",
        "difficulty": "hard",
        "tags": ["syntax", "writing"],
        "question": "Ordena la frase de evaluación:",
        "parts": scrambled,
        "correct_order": parts,
        "explanation": "Estructura estándar de oraciones en inglés."
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
        "id": "pro-b1-4",
        "title": "Performance Review",
        "level": "B1",
        "cefr_code": "B1.2",
        "description": "Aprende a dar y recibir feedback constructivo usando la técnica del sándwich y lenguaje diplomático.",
        "tags": ["management", "soft_skills", "feedback", "vocabulary"],
        "duration_min": 50,
        "learning_objectives": ["Can use the Sandwich Technique for feedback", "Can use softening language ('tend to', 'a bit')", "Can describe work performance with precise adjectives"],
        "prerequisites": ["pro-b1-3"],
        "vocabulary_list": DB["vocabulary_list"],
        "theme_color": "#CA8A04", # Yellow/Gold (Review/Stars)
        "cultural_notes": "In Anglo-Saxon culture, direct criticism can be seen as aggressive. Using 'softeners' is not optional; it is expected professionalism.",
        "stages": []
    }

    # --- STAGE 1: LECTURE ---
    lesson["stages"].append({
        "id": "stage_intro",
        "type": "lecture",
        "title": "The Feedback Sandwich 🍔",
        "parts": [
            {
                "visual": "[Diagram of a sandwich]\n1. **Bun (Start)**: Positive praise.\n2. **Meat (Middle)**: Constructive criticism.\n3. **Bun (End)**: Encouragement.",
                "audio_script": "Nobody likes to be criticized. To make it easier, we use the Sandwich Method. You start positive, give the correction gently, and end positive.",
                "duration": 20,
                "image_prompt": "A graphical representation of the Sandwich Feedback Method."
            },
            {
                "visual": "## Softeners ☁️\n\n* **Tend to**: You tend to be late.\n* **A bit**: It's a bit messy.\n* **Seem to**: You seem to be distracted.",
                "audio_script": "Never say 'You are lazy'. Say 'You tend to be a bit slow'. These small words protect the relationship.",
                "duration": 15
            }
        ]
    })

    # --- BLOQUES DE EJERCICIOS (100 TOTAL) ---
    all_questions = []

    # Generamos 100 ejercicios mezclados
    for i in range(30): all_questions.append(gen_softener_match(i))        # Gramática/Tono
    for i in range(20): all_questions.append(gen_sandwich_structure(i+30)) # Lógica
    for i in range(30): all_questions.append(gen_adjective_context(i+50))  # Vocabulario
    for i in range(20): all_questions.append(gen_feedback_scramble(i+80))  # Sintaxis
    
    random.shuffle(all_questions)

    # Chunking en bloques de 20
    chunk_size = 20
    for i in range(0, len(all_questions), chunk_size):
        chunk = all_questions[i:i + chunk_size]
        block_num = (i // chunk_size) + 1
        
        lesson["stages"].append({
            "id": f"stage_practice_block_{block_num}",
            "type": "gamified_quiz",
            "title": f"Manager Training {block_num}",
            "description": f"Simulación de evaluación {block_num}/5.",
            "xp_reward": 100 + (block_num * 10),
            "questions": chunk,
            "recommended_streak": 2
        })

    # --- BOSS STAGE: THE REVIEW ---
    lesson["stages"].append({
        "id": "stage_boss",
        "type": "practice_chat",
        "title": "Giving Feedback",
        "scenario": "Eres el Gerente. Tu empleado Alex es muy talentoso pero llega tarde a menudo. Dale feedback.",
        "ai_system_prompt": """
        ROLE: Employee (Alex).
        GOAL: Receive feedback.
        BEHAVIOR:
        1. Ask "So, how am I doing?".
        2. If user starts with criticism ("You are late"), get defensive ("Wow, that's harsh").
        3. If user uses Sandwich Method (Praise -> Critique -> Praise), accept it ("I understand, I'll improve").
        4. Look for softeners ("tend to", "a bit").
        """,
        "initial_message": "Hi boss. Ready for my review. Be honest, how is my performance?",
        "next_lesson_id": "pro-b1-5",
        "confidence_score_enabled": True,
        "badge_reward": "Team Leader"
    })

    return lesson

# --- EXEC ---
if __name__ == "__main__":
    data = build_lesson()
    out_path = "backend/app/data/lessons/pro-b1-4.json"
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        
    print(f"✅ LECCIÓN B1-4 (TITANIUM) GENERADA CON ÉXITO.")
    print(f"📂 Ubicación: {out_path}")
    print(f"🔢 Total de Ejercicios: {sum(len(s.get('questions', [])) for s in data['stages'])}")