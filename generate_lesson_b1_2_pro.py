import json
import random
import os
import uuid

# ==========================================
# 1. BASE DE DATOS DE CRISIS (B1-2)
# ==========================================

DB = {
    "vocabulary_pairs": [
        {"formal": "rectify", "informal": "fix", "def": "To put right; correct."},
        {"formal": "oversight", "informal": "mistake", "def": "An unintentional failure to notice or do something."},
        {"formal": "inconvenience", "informal": "trouble", "def": "Trouble or difficulty caused to one's personal requirements."},
        {"formal": "compensation", "informal": "pay back", "def": "Something, typically money, awarded to someone for loss."},
        {"formal": "inform", "informal": "tell", "def": "To give information."},
        {"formal": "apologize", "informal": "say sorry", "def": "Express regret for something that one has done wrong."},
        {"formal": "ensure", "informal": "make sure", "def": "Make certain that (something) shall occur or be the case."}
    ],
    "apology_structures": [
        {"part": "Opening", "phrase": "Thank you for bringing this to our attention."},
        {"part": "Apology", "phrase": "We sincerely apologize for the error."},
        {"part": "Explanation", "phrase": "Unfortunately, due to a technical glitch..."},
        {"part": "Solution", "phrase": "To rectify this, we have issued a refund."},
        {"part": "Closing", "phrase": "We appreciate your patience."}
    ],
    "softeners": [
        {"hard": "We can't do that.", "soft": "Unfortunately, we are unable to do that."},
        {"hard": "You are wrong.", "soft": "There seems to be a misunderstanding."},
        {"hard": "It's late.", "soft": "I am afraid there will be a delay."},
        {"hard": "No.", "soft": "I am afraid that is not possible."},
        {"hard": "Send it again.", "soft": "Could you please resend it?"}
    ],
    "scenarios": [
        {"situation": "Shipping Delay", "action": "Offer free shipping on next order."},
        {"situation": "Wrong Item Sent", "action": "Send correct item immediately."},
        {"situation": "Billing Error", "action": "Issue a full refund."},
        {"situation": "Server Crash", "action": "Extend subscription by one month."}
    ],
    "vocabulary_list": [
        {"word": "Rectify", "meaning": "Put (something) right; correct.", "ipa": "/ˈrɛktɪfaɪ/"},
        {"word": "Oversight", "meaning": "An unintentional failure to notice or do something.", "ipa": "/ˈoʊvərˌsaɪt/"},
        {"word": "Inconvenience", "meaning": "Trouble or difficulty caused to one's personal requirements.", "ipa": "/ˌɪnkənˈviːniəns/"},
        {"word": "Sincere", "meaning": "Free from pretense or deceit; proceeding from genuine feelings.", "ipa": "/sɪnˈsɪər/"}
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

def gen_formal_informal_match(idx):
    """(VOCAB) Emparejar formal con informal."""
    item = random.choice(DB["vocabulary_pairs"])
    
    return {
        "id": generate_unique_id("vocab"),
        "type": "quiz_choice",
        "difficulty": "medium",
        "tags": ["vocabulary", "formal_english"],
        "question": f"What is the FORMAL equivalent of **'{item['informal']}'**?",
        "options": [item["formal"], "fix", "bad", "happy"],
        "correct_answer": item["formal"],
        "explanation": f"'{item['formal']}' es la versión profesional de '{item['informal']}'."
    }

def gen_email_structure_order(idx):
    """(SYNTAX) Ordenar los pasos de un email de disculpa."""
    # Seleccionamos 3 partes aleatorias para ordenar
    parts = random.sample(DB["apology_structures"], 3)
    # Ordenamos basado en el orden lógico original (Opening -> Apology -> Explanation -> Solution -> Closing)
    # Simplemente usamos la lista original como referencia de orden
    ordered_parts = sorted(parts, key=lambda x: DB["apology_structures"].index(x))
    
    question_parts = [p["phrase"] for p in ordered_parts]
    scrambled = question_parts.copy()
    random.shuffle(scrambled)
    
    return {
        "id": generate_unique_id("ord"),
        "type": "order_sentence",
        "difficulty": "hard",
        "tags": ["syntax", "writing", "email"],
        "question": "Ordena las frases para crear un email lógico:",
        "parts": scrambled,
        "correct_order": question_parts,
        "explanation": "Orden lógico: Acknowledge -> Apologize -> Explain -> Solve -> Close."
    }

def gen_softening_quiz(idx):
    """(GRAMMAR/TONE) Suavizar noticias malas."""
    item = random.choice(DB["softeners"])
    
    return {
        "id": generate_unique_id("tone"),
        "type": "quiz_choice",
        "difficulty": "medium",
        "tags": ["soft_skills", "tone", "grammar"],
        "question": f"Make it polite: **'{item['hard']}'**",
        "options": [item["soft"], item["hard"] + " please", "I say " + item["hard"]],
        "correct_answer": item["soft"],
        "explanation": "En gestión de crisis, usamos 'Unfortunately' o 'I am afraid' para suavizar el impacto."
    }

def gen_crisis_solution_logic(idx):
    """(LOGIC) Elegir la solución correcta para el problema."""
    scenario = random.choice(DB["scenarios"])
    
    # Distractores
    others = [s["action"] for s in DB["scenarios"] if s["action"] != scenario["action"]]
    options = [scenario["action"]] + random.sample(others, 2)
    random.shuffle(options)
    
    return {
        "id": generate_unique_id("logic"),
        "type": "quiz_choice",
        "difficulty": "easy",
        "tags": ["logic", "problem_solving"],
        "question": f"Crisis: **{scenario['situation']}**. Best solution?",
        "options": options,
        "correct_answer": scenario["action"],
        "explanation": f"Para '{scenario['situation']}', lo lógico es: {scenario['action']}."
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
        "id": "pro-b1-2",
        "title": "Crisis Management",
        "level": "B1",
        "cefr_code": "B1.1",
        "description": "Aprende a escribir emails de disculpa profesional, gestionar quejas y ofrecer soluciones.",
        "tags": ["writing", "email", "crisis", "customer_service"],
        "duration_min": 50,
        "learning_objectives": ["Can write a formal apology email", "Can use softening language for bad news", "Can use vocabulary like 'rectify' and 'oversight'"],
        "prerequisites": ["pro-b1-1"],
        "vocabulary_list": DB["vocabulary_list"],
        "theme_color": "#EF4444", # Red (Crisis/Urgency)
        "cultural_notes": "In business, admitting a mistake ('We apologize') is often better than making excuses. Clients value honesty and a quick solution.",
        "stages": []
    }

    # --- STAGE 1: LECTURE ---
    lesson["stages"].append({
        "id": "stage_intro",
        "type": "lecture",
        "title": "The Art of Apology",
        "parts": [
            {
                "visual": "\n## Email Structure 📧\n\n1. **Acknowledge**: 'Thank you for your email.'\n2. **Apologize**: 'We sincerely apologize.'\n3. **Solve**: 'To rectify this...'\n4. **Close**: 'Sincerely...'",
                "audio_script": "When handling a crisis, structure is everything. Don't just say sorry. Acknowledge the issue, apologize sincerely, and most importantly, offer a solution to rectify it.",
                "duration": 20
            },
            {
                "visual": "## Power Vocabulary 🛡️\n\n* **Rectify** (Fix)\n* **Oversight** (Mistake)\n* **Inconvenience** (Problem)",
                "audio_script": "Upgrade your vocabulary. Instead of saying 'fix the mistake', say 'rectify the oversight'. It sounds professional and controlled.",
                "duration": 15
            }
        ]
    })

    # --- BLOQUES DE EJERCICIOS (100 TOTAL) ---
    all_questions = []

    # Generamos 100 ejercicios mezclados
    for i in range(30): all_questions.append(gen_formal_informal_match(i))  # Vocabulario
    for i in range(30): all_questions.append(gen_softening_quiz(i+30))      # Tono/Gramática
    for i in range(20): all_questions.append(gen_email_structure_order(i+60)) # Sintaxis
    for i in range(20): all_questions.append(gen_crisis_solution_logic(i+80)) # Lógica
    
    random.shuffle(all_questions)

    # Chunking en bloques de 20
    chunk_size = 20
    for i in range(0, len(all_questions), chunk_size):
        chunk = all_questions[i:i + chunk_size]
        block_num = (i // chunk_size) + 1
        
        lesson["stages"].append({
            "id": f"stage_practice_block_{block_num}",
            "type": "gamified_quiz",
            "title": f"Damage Control {block_num}",
            "description": f"Gestión de conflictos {block_num}/5.",
            "xp_reward": 100 + (block_num * 10),
            "questions": chunk,
            "recommended_streak": 2
        })

    # --- BOSS STAGE: THE ANGRY CLIENT ---
    lesson["stages"].append({
        "id": "stage_boss",
        "type": "practice_chat",
        "title": "Handling Mr. Smith",
        "scenario": "El Sr. Smith está furioso porque su pedido llegó tarde. Cálmalo y ofrece una solución.",
        "ai_system_prompt": """
        ROLE: Mr. Smith (Angry Client).
        GOAL: Complain about a late delivery.
        BEHAVIOR:
        1. Start angry: "Where is my order? It was due yesterday!".
        2. If user says "Sorry", be annoyed ("Just sorry?").
        3. If user says "Sincerely apologize" and "Oversight", calm down slightly.
        4. Accept the solution only if they offer a refund or discount ("To rectify this...").
        """,
        "initial_message": "This is unacceptable! I haven't received the quarterly report yet. What is going on?",
        "next_lesson_id": "pro-b1-3",
        "confidence_score_enabled": True,
        "badge_reward": "Crisis Manager"
    })

    return lesson

# --- EXEC ---
if __name__ == "__main__":
    data = build_lesson()
    out_path = "backend/app/data/lessons/pro-b1-2.json"
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        
    print(f"✅ LECCIÓN B1-2 (TITANIUM) GENERADA CON ÉXITO.")
    print(f"📂 Ubicación: {out_path}")
    print(f"🔢 Total de Ejercicios: {sum(len(s.get('questions', [])) for s in data['stages'])}")