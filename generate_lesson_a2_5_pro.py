import json
import random
import os
import uuid

# ==========================================
# 1. BASE DE DATOS DE REGLAS (A2-5)
# ==========================================

DB = {
    "obligations": [
        {"rule": "wear a helmet", "context": "construction site", "modal": "must"},
        {"rule": "show your ID", "context": "security gate", "modal": "must"},
        {"rule": "finish the report", "context": "before the deadline", "modal": "have to"},
        {"rule": "attend the meeting", "context": "it's mandatory", "modal": "have to"},
        {"rule": "turn off the lights", "context": "when leaving", "modal": "must"}
    ],
    "prohibitions": [
        {"rule": "smoke", "context": "inside the office", "modal": "must not"},
        {"rule": "park here", "context": "reserved spot", "modal": "can't"},
        {"rule": "share passwords", "context": "security policy", "modal": "must not"},
        {"rule": "use mobile phones", "context": "during the meeting", "modal": "should not"},
        {"rule": "enter", "context": "authorized personnel only", "modal": "must not"}
    ],
    "optional": [
        {"rule": "wear a tie", "context": "on Fridays", "modal": "don't have to"},
        {"rule": "work late", "context": "today is a holiday", "modal": "don't have to"},
        {"rule": "print the email", "context": "digital is fine", "modal": "don't have to"},
        {"rule": "bring lunch", "context": "there is a cafeteria", "modal": "don't have to"}
    ],
    "safety_signs": [
        {"sign": "Fire Exit", "meaning": "Leave here in case of fire."},
        {"sign": "High Voltage", "meaning": "Danger: Electricity."},
        {"sign": "Wet Floor", "meaning": "Caution: Slippery surface."},
        {"sign": "No Entry", "meaning": "Do not go inside."},
        {"sign": "Hard Hat Area", "meaning": "Wear protection on your head."}
    ],
    "vocabulary_list": [
        {"word": "Forbidden", "meaning": "Not allowed; banned.", "ipa": "/fərˈbɪdən/"},
        {"word": "Mandatory", "meaning": "Required by law or rules; compulsory.", "ipa": "/ˈmændətɔːri/"},
        {"word": "Hazard", "meaning": "A danger or risk.", "ipa": "/ˈhæzərd/"},
        {"word": "Procedure", "meaning": "An established or official way of doing something.", "ipa": "/prəˈsiːdʒər/"}
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

def gen_modal_logic(idx):
    """(LOGIC) Elegir el modal correcto según contexto (Obligación vs Opción)."""
    category = random.choice(["obligations", "prohibitions", "optional"])
    item = random.choice(DB[category])
    
    if category == "obligations":
        correct = "must" if item["modal"] == "must" else "have to"
        distractor = "must not"
        expl = "Es una obligación necesaria."
    elif category == "prohibitions":
        correct = "must not"
        distractor = "must"
        expl = "Es algo prohibido/peligroso."
    else:
        correct = "don't have to"
        distractor = "must"
        expl = "No es necesario (es opcional)."
        
    return {
        "id": generate_unique_id("modal"),
        "type": "quiz_choice",
        "difficulty": "medium",
        "tags": ["grammar", "modals", "rules"],
        "question": f"Context: {item['context']}. You ___ {item['rule']}.",
        "options": [correct, distractor, "can"],
        "correct_answer": correct,
        "explanation": expl
    }

def gen_sign_meaning(idx):
    """(VOCAB) Identificar señales de seguridad."""
    sign = random.choice(DB["safety_signs"])
    
    # Distractores de otras señales
    others = [s["meaning"] for s in DB["safety_signs"] if s["sign"] != sign["sign"]]
    options = [sign["meaning"]] + random.sample(others, 2)
    random.shuffle(options)
    
    return {
        "id": generate_unique_id("sign"),
        "type": "quiz_choice",
        "difficulty": "easy",
        "tags": ["vocabulary", "safety"],
        "question": f"What does the sign **'{sign['sign']}'** mean?",
        "options": options,
        "correct_answer": sign["meaning"],
        "explanation": f"'{sign['sign']}' indica: {sign['meaning']}"
    }

def gen_rule_scramble(idx):
    """(SYNTAX) Ordenar una regla de oficina."""
    item = random.choice(DB["obligations"] + DB["prohibitions"])
    # "Employees must wash their hands"
    sentence = f"Employees {item['modal']} {item['rule']}"
    
    parts = sentence.split(" ")
    scrambled = parts.copy()
    random.shuffle(scrambled)
    
    return {
        "id": generate_unique_id("ord"),
        "type": "order_sentence",
        "difficulty": "hard",
        "tags": ["syntax", "rules"],
        "question": "Ordena la regla de seguridad:",
        "parts": scrambled,
        "correct_order": parts,
        "explanation": "Estructura: Sujeto + Modal + Verbo + Complemento."
    }

def gen_safety_context(idx):
    """(CONTEXT) Situaciones de seguridad."""
    # Logic: Fire -> Exit, Head -> Helmet, Eyes -> Glasses
    scenarios = [
        {"sit": "There is a fire alarm.", "action": "Leave by the emergency exit.", "wrong": "Take the elevator."},
        {"sit": "You are entering a construction zone.", "action": "Wear a hard hat.", "wrong": "Wear sandals."},
        {"sit": "You are handling chemicals.", "action": "Wear safety gloves.", "wrong": "Wash hands later."}
    ]
    scen = random.choice(scenarios)
    
    return {
        "id": generate_unique_id("ctx"),
        "type": "quiz_choice",
        "difficulty": "medium",
        "tags": ["logic", "safety"],
        "question": f"Situation: **{scen['sit']}** What must you do?",
        "options": [scen["action"], scen["wrong"], "Nothing"],
        "correct_answer": scen["action"],
        "explanation": "La seguridad es primero."
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
        "id": "pro-a2-5",
        "title": "Office Safety & Rules",
        "level": "A2",
        "cefr_code": "A2.2",
        "description": "Aprende a expresar obligaciones, prohibiciones y normas de seguridad en el trabajo.",
        "tags": ["rules", "modals", "safety", "grammar"],
        "duration_min": 45,
        "learning_objectives": ["Can explain office rules using 'must' and 'have to'", "Can understand safety signs", "Can distinguish between obligation and lack of necessity"],
        "prerequisites": ["pro-a2-4"],
        "vocabulary_list": DB["vocabulary_list"],
        "theme_color": "#DC2626", # Red (Safety/Warning)
        "cultural_notes": "In many Western companies, 'Casual Friday' means you don't have to wear formal business attire, but you still must look professional.",
        "stages": []
    }

    # --- STAGE 1: LECTURE ---
    lesson["stages"].append({
        "id": "stage_intro",
        "type": "lecture",
        "title": "The Rulebook 📜",
        "parts": [
            {
                "visual": "## Obligation 🟢\n**Must / Have to**\n'You must wear a badge.'\n\n## Prohibition 🔴\n**Must NOT**\n'You must not smoke.'\n\n## Optional ⚪\n**Don't have to**\n'You don't have to wear a tie.'",
                "audio_script": "Rules keep us safe. Use MUST for strong rules. Use MUST NOT for forbidden things. But be careful: DON'T HAVE TO means it is optional, not forbidden.",
                "duration": 20,
                "image_prompt": "A safety sign board showing 'Hard Hat Area', 'No Smoking', and 'Fire Exit'."
            }
        ]
    })

    # --- BLOQUES DE EJERCICIOS (100 TOTAL) ---
    all_questions = []

    # Generamos 100 ejercicios mezclados
    for i in range(40): all_questions.append(gen_modal_logic(i))        # El núcleo de la lección (Gramática)
    for i in range(20): all_questions.append(gen_sign_meaning(i+40))    # Vocabulario visual
    for i in range(20): all_questions.append(gen_rule_scramble(i+60))   # Sintaxis
    for i in range(20): all_questions.append(gen_safety_context(i+80))  # Lógica
    
    random.shuffle(all_questions)

    # Chunking en bloques de 20
    chunk_size = 20
    for i in range(0, len(all_questions), chunk_size):
        chunk = all_questions[i:i + chunk_size]
        block_num = (i // chunk_size) + 1
        
        lesson["stages"].append({
            "id": f"stage_practice_block_{block_num}",
            "type": "gamified_quiz",
            "title": f"Safety Drill {block_num}",
            "description": f"Entrenamiento de normas {block_num}/5.",
            "xp_reward": 100 + (block_num * 10),
            "questions": chunk,
            "recommended_streak": 2
        })

    # --- BOSS STAGE: HR ORIENTATION ---
    lesson["stages"].append({
        "id": "stage_boss",
        "type": "practice_chat",
        "title": "New Employee Orientation",
        "scenario": "Eres el Gerente de RRHH explicando las reglas a un nuevo empleado.",
        "ai_system_prompt": """
        ROLE: New Employee (Junior).
        GOAL: Ask about office rules.
        BEHAVIOR:
        1. Ask "Do I have to wear a suit?".
        2. Ask "Can I smoke in the office?".
        3. Expect user to use modals correctly ("You don't have to wear a suit", "You must not smoke").
        4. If user gets it right, say "Thanks for clarifying".
        """,
        "initial_message": "Hi boss. I have a few questions about the rules. First, what time do I have to start?",
        "next_lesson_id": "pro-a2-6",
        "confidence_score_enabled": True,
        "badge_reward": "Safety Officer"
    })

    return lesson

# --- EXEC ---
if __name__ == "__main__":
    data = build_lesson()
    out_path = "backend/app/data/lessons/pro-a2-5.json"
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        
    print(f"✅ LECCIÓN A2-5 (TITANIUM) GENERADA CON ÉXITO.")
    print(f"📂 Ubicación: {out_path}")
    print(f"🔢 Total de Ejercicios: {sum(len(s.get('questions', [])) for s in data['stages'])}")