import json
import random
import os
import uuid

# ==========================================
# 1. BASE DE DATOS TÉCNICA (A2-3)
# ==========================================

DB = {
    "problems": [
        {"issue": "The screen is frozen", "fix": "Restart the computer", "tool": "PC"},
        {"issue": "I can't log in", "fix": "Check your password", "tool": "Account"},
        {"issue": "The Wi-Fi is down", "fix": "Reset the router", "tool": "Internet"},
        {"issue": "The printer is jammed", "fix": "Remove the paper", "tool": "Printer"},
        {"issue": "No sound", "fix": "Check the volume", "tool": "Speakers"},
        {"issue": "Battery is low", "fix": "Plug in the charger", "tool": "Laptop"},
        {"issue": "The app crashed", "fix": "Update the software", "tool": "App"}
    ],
    "imperatives": [
        {"verb": "Click", "obj": "on the icon"},
        {"verb": "Open", "obj": "the settings menu"},
        {"verb": "Type", "obj": "your username"},
        {"verb": "Press", "obj": "the power button"},
        {"verb": "Select", "obj": "the correct network"},
        {"verb": "Unplug", "obj": "the cable"}
    ],
    "vocab_definitions": [
        {"word": "Browser", "def": "A program to surf the internet (e.g., Chrome)."},
        {"word": "Bug", "def": "A small error in a software program."},
        {"word": "Crash", "def": "When a computer or program stops working suddenly."},
        {"word": "Backup", "def": "A copy of a file in case the original is lost."}
    ],
    "vocabulary_list": [
        {"word": "Troubleshoot", "meaning": "Analyze and solve serious problems for a company or organization.", "ipa": "/ˈtrʌbəlˌʃuːt/"},
        {"word": "Reboot", "meaning": "Restart (a computer or system).", "ipa": "/riːˈbuːt/"},
        {"word": "Glitch", "meaning": "A sudden, usually temporary malfunction or irregularity of equipment.", "ipa": "/ɡlɪtʃ/"},
        {"word": "Update", "meaning": "Make (something) more modern or up to date.", "ipa": "/ʌpˈdeɪt/"}
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

def gen_fix_it_logic(idx):
    """(LOGIC) Asociar problema con solución."""
    prob = random.choice(DB["problems"])
    
    # Generar soluciones incorrectas de otros problemas
    other_fixes = [p["fix"] for p in DB["problems"] if p["issue"] != prob["issue"]]
    distractors = random.sample(other_fixes, 2)
    
    options = [prob["fix"]] + distractors
    random.shuffle(options)
    
    return {
        "id": generate_unique_id("logic"),
        "type": "quiz_choice",
        "difficulty": "medium",
        "tags": ["logic", "problem_solving", "tech"],
        "question": f"Problem: **{prob['issue']}**.\nSolution?",
        "options": options,
        "correct_answer": prob["fix"],
        "explanation": f"Si {prob['issue'].lower()}, la solución lógica es: {prob['fix']}."
    }

def gen_imperative_grammar(idx):
    """(GRAMMAR) Uso de imperativos."""
    data = random.choice(DB["imperatives"])
    
    # "Click on the icon"
    # Distractores: Clicking, To click
    verb_base = data["verb"]
    distractor_ing = verb_base + "ing"
    distractor_inf = "To " + verb_base.lower()
    
    options = [verb_base, distractor_ing, distractor_inf]
    random.shuffle(options)
    
    return {
        "id": generate_unique_id("gram"),
        "type": "quiz_choice",
        "difficulty": "easy",
        "tags": ["grammar", "imperatives"],
        "question": f"Instruction: ___ {data['obj']}.",
        "options": options,
        "correct_answer": verb_base,
        "explanation": "Las instrucciones técnicas usan el Imperativo (verbo base): 'Click', 'Open', etc."
    }

def gen_tech_vocab_match(idx):
    """(VOCAB) Definiciones técnicas."""
    item = random.choice(DB["vocab_definitions"])
    
    return {
        "id": generate_unique_id("voc"),
        "type": "quiz_choice",
        "difficulty": "medium",
        "tags": ["vocabulary", "tech"],
        "question": f"What is a **{item['word']}**?",
        "options": [item["def"], "A type of virus", "A hardware part", "An office chair"],
        "correct_answer": item["def"],
        "explanation": f"{item['word']} se define como: {item['def']}"
    }

def gen_instruction_order(idx):
    """(SYNTAX) Ordenar pasos técnicos."""
    # "First click settings then select wifi"
    step1 = random.choice(DB["imperatives"])
    step2 = random.choice(DB["imperatives"])
    
    sentence = f"First {step1['verb'].lower()} {step1['obj']} then {step2['verb'].lower()} {step2['obj']}"
    parts = sentence.split(" ")
    scrambled = parts.copy()
    random.shuffle(scrambled)
    
    return {
        "id": generate_unique_id("ord"),
        "type": "order_sentence",
        "difficulty": "hard",
        "tags": ["syntax", "instructions"],
        "question": "Ordena la secuencia de pasos:",
        "parts": scrambled,
        "correct_order": parts,
        "explanation": "Secuencia lógica: First [Action 1] then [Action 2]."
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
        "id": "pro-a2-3",
        "title": "Tech Support",
        "level": "A2",
        "cefr_code": "A2.1",
        "description": "Aprende a describir problemas técnicos y a dar/seguir instrucciones para solucionarlos.",
        "tags": ["tech", "problem_solving", "imperatives", "vocabulary"],
        "duration_min": 45,
        "learning_objectives": ["Can describe common computer problems", "Can give instructions using imperatives", "Can understand tech support advice"],
        "prerequisites": ["pro-a2-2"],
        "vocabulary_list": DB["vocabulary_list"],
        "theme_color": "#2563EB", # Blue (Technology/Trust)
        "cultural_notes": "When calling tech support, be ready to describe 'what happened' before the problem started. Patience is key!",
        "stages": []
    }

    # --- STAGE 1: LECTURE ---
    lesson["stages"].append({
        "id": "stage_intro",
        "type": "lecture",
        "title": "The Help Desk",
        "parts": [
            {
                "visual": "## Common Issues ⚠️\n\n* **Frozen Screen**: Doesn't move.\n* **Bug**: Software error.\n* **Crash**: Program closes suddenly.",
                "audio_script": "Technology is great until it breaks. Today we learn how to survive IT problems. Key words: Frozen, Crash, and Bug.",
                "duration": 15,
                "image_prompt": "A computer screen with a 'System Error' popup and a frustrated user."
            },
            {
                "visual": "## The Imperative 📢\n\nUse the base verb for instructions:\n* ✅ **Restart** the PC.\n* ✅ **Click** the button.\n* ❌ You restart...",
                "audio_script": "To solve problems, we give direct orders called Imperatives. Just use the verb: Restart, Open, Click. Simple and effective.",
                "duration": 12
            }
        ]
    })

    # --- BLOQUES DE EJERCICIOS (100 TOTAL) ---
    all_questions = []

    # Generamos 100 ejercicios mezclados
    for i in range(30): all_questions.append(gen_fix_it_logic(i))           # Solución de problemas
    for i in range(30): all_questions.append(gen_imperative_grammar(i+30))  # Gramática
    for i in range(20): all_questions.append(gen_tech_vocab_match(i+60))    # Vocabulario
    for i in range(20): all_questions.append(gen_instruction_order(i+80))   # Sintaxis
    
    random.shuffle(all_questions)

    # Chunking en bloques de 20
    chunk_size = 20
    for i in range(0, len(all_questions), chunk_size):
        chunk = all_questions[i:i + chunk_size]
        block_num = (i // chunk_size) + 1
        
        lesson["stages"].append({
            "id": f"stage_practice_block_{block_num}",
            "type": "gamified_quiz",
            "title": f"Troubleshooting {block_num}",
            "description": f"Resolución de fallos {block_num}/5.",
            "xp_reward": 100 + (block_num * 10),
            "questions": chunk,
            "recommended_streak": 2
        })

    # --- BOSS STAGE: CALLING IT SUPPORT ---
    lesson["stages"].append({
        "id": "stage_boss",
        "type": "practice_chat",
        "title": "IT Help Desk",
        "scenario": "Tu computadora no enciende. Llama a soporte técnico y sigue sus instrucciones.",
        "ai_system_prompt": """
        ROLE: IT Support Agent (Kevin).
        GOAL: Help the user fix a computer problem.
        BEHAVIOR:
        1. Ask "IT Support, what is the problem?".
        2. Listen to the user (e.g., "My PC won't turn on").
        3. Give an instruction: "Please check the power cable".
        4. If user says "It works", say "Great, have a nice day".
        """,
        "initial_message": "IT Help Desk, Kevin speaking. How can I help you today?",
        "next_lesson_id": "pro-a2-4",
        "confidence_score_enabled": True,
        "badge_reward": "Tech Savvy"
    })

    return lesson

# --- EXEC ---
if __name__ == "__main__":
    data = build_lesson()
    out_path = "backend/app/data/lessons/pro-a2-3.json"
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        
    print(f"✅ LECCIÓN A2-3 (TITANIUM) GENERADA CON ÉXITO.")
    print(f"📂 Ubicación: {out_path}")
    print(f"🔢 Total de Ejercicios: {sum(len(s.get('questions', [])) for s in data['stages'])}")