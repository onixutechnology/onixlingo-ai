import json
import random
import os
import uuid

# ==========================================
# 1. BASE DE DATOS DE OFICINA (A1-5)
# ==========================================

DB = {
    "locations": [
        {"name": "Reception", "def": "Where guests arrive."},
        {"name": "Meeting Room", "def": "A room for team discussions."},
        {"name": "Cafeteria", "def": "Where employees eat lunch."},
        {"name": "Restroom", "def": "The bathroom or toilet."},
        {"name": "Elevator", "def": "A machine to go up and down floors."},
        {"name": "Stairs", "def": "Steps to go up and down walking."},
        {"name": "CEO's Office", "def": "The boss's room."},
        {"name": "IT Department", "def": "Where computers are fixed."},
        {"name": "Warehouse", "def": "Where products are stored."}
    ],
    "prepositions": [
        {"word": "next to", "opp": "far from", "context": "The printer is ___ the computer."},
        {"word": "opposite", "opp": "next to", "context": "The kitchen is ___ the meeting room (face to face)."},
        {"word": "between", "opp": "next to", "context": "My desk is ___ John and Sarah."},
        {"word": "behind", "opp": "in front of", "context": "The cable is hidden ___ the desk."},
        {"word": "on", "opp": "under", "context": "The laptop is ___ the table."}
    ],
    "directions": [
        "Go straight", "Turn left", "Turn right", "Go past the elevator", 
        "Take the stairs", "Go up to the 2nd floor", "It is on your right"
    ],
    "floors": [
        "Ground Floor", "1st Floor", "2nd Floor", "3rd Floor", "4th Floor", "Top Floor"
    ],
    # Vocabulario Clave (Mejora 3)
    "vocabulary_list": [
        {"word": "Corridor", "meaning": "A long passage in a building from which doors lead into rooms.", "ipa": "/ˈkɒrɪdɔːr/"},
        {"word": "Elevator", "meaning": "A platform or compartment housed in a shaft for raising and lowering people or things.", "ipa": "/ˈɛlɪveɪtər/"},
        {"word": "Lobby", "meaning": "A room providing a space out of which one or more other rooms or corridors lead.", "ipa": "/ˈlɒbi/"},
        {"word": "Basement", "meaning": "The floor of a building which is partly or entirely below ground level.", "ipa": "/ˈbeɪsmənt/"}
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

def gen_preposition_match(idx):
    """(GRAMMAR) Selección de preposición correcta por contexto."""
    prep = random.choice(DB["prepositions"])
    
    return {
        "id": generate_unique_id("prep"),
        "type": "quiz_choice",
        "difficulty": "medium",
        "tags": ["grammar", "prepositions", "location"],
        "question": f"Completa la frase: '{prep['context']}'",
        "options": [prep["word"], prep["opp"], "at", "to"],
        "correct_answer": prep["word"],
        "explanation": f"En este contexto espacial, usamos '{prep['word']}'."
    }

def gen_direction_order(idx):
    """(SYNTAX) Ordenar instrucciones de navegación."""
    # Generar una instrucción compuesta
    part1 = random.choice(["Go straight", "Go down the hall"])
    part2 = random.choice(["and turn left", "and turn right", "and stop"])
    part3 = random.choice(["at the reception", "at the end", "past the kitchen"])
    
    full_sentence = f"{part1} {part2} {part3}"
    parts = full_sentence.split(" ")
    scrambled = parts.copy()
    random.shuffle(scrambled)
    
    return {
        "id": generate_unique_id("ord"),
        "type": "order_sentence",
        "difficulty": "medium",
        "tags": ["syntax", "imperatives", "directions"],
        "question": "Ordena las instrucciones para llegar:",
        "parts": scrambled,
        "correct_order": parts,
        "explanation": "Estructura: Verbo de movimiento (Go/Turn) + Dirección + Referencia."
    }

def gen_floor_logic(idx):
    """(LOGIC) Matemáticas de elevador (Spatial Awareness)."""
    start_floor = random.randint(1, 3)
    move = random.randint(1, 2)
    direction = random.choice(["up", "down"])
    
    if direction == "up":
        final_floor = start_floor + move
        phrase = f"You are on the {start_floor}st floor. You go **UP** {move} floors."
    else:
        # Asegurar que no bajemos al sótano para simplificar A1
        if start_floor <= move: 
            start_floor = move + 1 # Ajuste
        final_floor = start_floor - move
        phrase = f"You are on the {start_floor}th floor. You go **DOWN** {move} floors."
        
    final_floor_str = f"{final_floor}th Floor" if final_floor > 3 else f"{final_floor}nd Floor" if final_floor == 2 else f"{final_floor}st Floor"
    if final_floor == 1: final_floor_str = "1st Floor"
    if final_floor == 0: final_floor_str = "Ground Floor"

    return {
        "id": generate_unique_id("logic"),
        "type": "quiz_choice",
        "difficulty": "hard",
        "tags": ["logic", "numbers", "vocabulary"],
        "question": f"{phrase} Where are you now?",
        "options": [final_floor_str, "Roof", "Basement", f"{final_floor + 2}th Floor"],
        "correct_answer": final_floor_str,
        "explanation": "Simplemente suma o resta los pisos según la dirección (Up/Down)."
    }

def gen_vocab_definition(idx):
    """(VOCAB) Definición de lugares."""
    loc = random.choice(DB["locations"])
    
    return {
        "id": generate_unique_id("voc"),
        "type": "quiz_choice",
        "difficulty": "easy",
        "tags": ["vocabulary", "office"],
        "question": f"Definition: '{loc['def']}'",
        "options": [loc["name"], "Parking Lot", "Street", "Home"],
        "correct_answer": loc["name"],
        "explanation": f"{loc['name']} es el lugar descrito."
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
        "id": "pro-a1-5",
        "title": "Office Navigation",
        "level": "A1",
        "cefr_code": "A1.2",
        "description": "Aprende a dar y recibir instrucciones para moverte dentro de un edificio corporativo.",
        "tags": ["directions", "office", "prepositions", "spatial"],
        "duration_min": 40,
        "learning_objectives": ["Can use prepositions of place", "Can give simple directions", "Can identify office rooms"],
        "prerequisites": ["pro-a1-4"],
        "vocabulary_list": DB["vocabulary_list"],
        "theme_color": "#3B82F6", # Blue (Corporate/Blueprint)
        "cultural_notes": "In huge corporate buildings, the 'Ground Floor' is often '0' or 'Lobby'. The 1st floor is the one above it.",
        "stages": []
    }

    # --- STAGE 1: LECTURE ---
    lesson["stages"].append({
        "id": "stage_intro",
        "type": "lecture",
        "title": "The Office Map",
        "parts": [
            {
                "visual": "## Prepositions 📍\n\nNext to = Al lado\nOpposite = Enfrente\nBetween = En medio\n\n## Directions 🧭\nGo Straight ⬆️ | Turn Left ⬅️ | Turn Right ➡️",
                "audio_script": "Getting lost in a new office is normal. Today we learn how to ask 'Where is the meeting room?' and understand the answer. Pay attention to prepositions.",
                "duration": 15,
                "image_prompt": "An isometric map of an office floor showing a reception, elevator, and meeting rooms with arrows indicating directions."
            }
        ]
    })

    # --- BLOQUES DE EJERCICIOS (100 TOTAL) ---
    all_questions = []

    # Generamos 100 ejercicios mezclados
    for i in range(30): all_questions.append(gen_preposition_match(i))      # Gramática
    for i in range(30): all_questions.append(gen_direction_order(i+30))     # Sintaxis
    for i in range(20): all_questions.append(gen_floor_logic(i+60))         # Lógica Espacial
    for i in range(20): all_questions.append(gen_vocab_definition(i+80))    # Vocabulario
    
    random.shuffle(all_questions)

    # Chunking en bloques de 20
    chunk_size = 20
    for i in range(0, len(all_questions), chunk_size):
        chunk = all_questions[i:i + chunk_size]
        block_num = (i // chunk_size) + 1
        
        lesson["stages"].append({
            "id": f"stage_practice_block_{block_num}",
            "type": "gamified_quiz",
            "title": f"Navigation Drill {block_num}",
            "description": f"Entrenamiento espacial {block_num}/5.",
            "xp_reward": 100 + (block_num * 10),
            "questions": chunk,
            "recommended_streak": 2
        })

    # --- BOSS STAGE: THE LOST VISITOR ---
    lesson["stages"].append({
        "id": "stage_boss",
        "type": "practice_chat",
        "title": "Help the Visitor",
        "scenario": "Eres recepcionista. Un visitante está perdido y busca la Sala de Conferencias.",
        "ai_system_prompt": """
        ROLE: Confused Visitor.
        GOAL: Ask "Where is the Conference Room?" and "Is there a bathroom nearby?".
        BEHAVIOR:
        1. Ask for directions politely.
        2. If user says "Go straight", ask "And then?".
        3. If user gives good directions using prepositions (next to, opposite), say "Thank you" and end chat.
        """,
        "initial_message": "Excuse me, I am a bit lost. I am looking for the Main Conference Room.",
        "next_lesson_id": "pro-a1-6",
        "confidence_score_enabled": True,
        "badge_reward": "Office Guide"
    })

    return lesson

# --- EXEC ---
if __name__ == "__main__":
    data = build_lesson()
    out_path = "backend/app/data/lessons/pro-a1-5.json"
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        
    print(f"✅ LECCIÓN A1-5 (TITANIUM) GENERADA CON ÉXITO.")
    print(f"📂 Ubicación: {out_path}")
    print(f"🔢 Total de Ejercicios: {sum(len(s.get('questions', [])) for s in data['stages'])}")