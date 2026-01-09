import json
import random
import os
import uuid

# ==========================================
# 1. BASE DE DATOS DE VIAJES (A1-7)
# ==========================================

DB = {
    "destinations": ["New York", "London", "Tokyo", "Paris", "Berlin", "Dubai", "Sydney"],
    "airport_vocab": [
        {"word": "Check-in Desk", "def": "Where you drop off your bags and get your ticket."},
        {"word": "Gate", "def": "The door you go through to enter the plane."},
        {"word": "Customs", "def": "Where officers check your passport and luggage."},
        {"word": "Baggage Claim", "def": "Where you pick up your suitcase after the flight."},
        {"word": "Boarding Pass", "def": "The paper/ticket you need to get on the plane."},
        {"word": "Security", "def": "Where they scan your body and bags."},
        {"word": "Lounge", "def": "A comfortable waiting area for business travelers."}
    ],
    "prepositions": [
        {"sent": "I am flying ___ London.", "correct": "to", "opts": ["at", "in"]},
        {"sent": "I am arriving ___ the airport.", "correct": "at", "opts": ["to", "on"]},
        {"sent": "The pilot is ___ the plane.", "correct": "on", "opts": ["at", "to"]},
        {"sent": "My passport is ___ my bag.", "correct": "in", "opts": ["on", "at"]},
        {"sent": "We are going ___ the Gate.", "correct": "to", "opts": ["at", "on"]}
    ],
    "dialogue_fragments": [
        "Here is my passport",
        "I have one suitcase",
        "I would like an aisle seat",
        "Where is Gate 5",
        "Is the flight on time"
    ],
    # Vocabulario Clave (Mejora 3)
    "vocabulary_list": [
        {"word": "Itinerary", "meaning": "A planned route or journey.", "ipa": "/faɪˈtɪnərəri/"},
        {"word": "Delay", "meaning": "A period of time by which something is late.", "ipa": "/dɪˈleɪ/"},
        {"word": "Departure", "meaning": "The action of leaving, typically to start a journey.", "ipa": "/dɪˈpɑːrtʃər/"},
        {"word": "Aisle Seat", "meaning": "A seat situated at the end of a row, next to the aisle.", "ipa": "/aɪl siːt/"}
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

def gen_flight_logic(idx):
    """(LOGIC) Cálculo de horas de abordaje."""
    hour = random.randint(13, 22)
    minute = random.choice([0, 15, 30, 45])
    
    flight_time_str = f"{hour}:{minute:02d}"
    
    # Boarding es 30 mins antes
    b_minute = minute - 30
    b_hour = hour
    if b_minute < 0:
        b_minute += 60
        b_hour -= 1
        
    board_time_str = f"{b_hour}:{b_minute:02d}"
    
    return {
        "id": generate_unique_id("logic"),
        "type": "quiz_choice",
        "difficulty": "hard",
        "tags": ["logic", "time", "travel"],
        "question": f"Flight AF404 departs at **{flight_time_str}**. Boarding starts 30 minutes before. When is boarding?",
        "options": [board_time_str, flight_time_str, f"{hour+1}:{minute:02d}", f"{hour}:{minute+10:02d}"],
        "correct_answer": board_time_str,
        "explanation": "Debes restar 30 minutos a la hora de salida."
    }

def gen_prep_fly(idx):
    """(GRAMMAR) Preposiciones de movimiento."""
    data = random.choice(DB["prepositions"])
    
    options = data["opts"] + [data["correct"]]
    random.shuffle(options)
    
    return {
        "id": generate_unique_id("prep"),
        "type": "quiz_choice",
        "difficulty": "medium",
        "tags": ["grammar", "prepositions"],
        "question": f"Completa: '{data['sent']}'",
        "options": options,
        "correct_answer": data["correct"],
        "explanation": f"Recuerda: Fly TO (destino), Arrive AT (lugar específico), On (transporte)."
    }

def gen_vocab_airport(idx):
    """(VOCAB) Definiciones de aeropuerto."""
    item = random.choice(DB["airport_vocab"])
    
    return {
        "id": generate_unique_id("voc"),
        "type": "quiz_choice",
        "difficulty": "easy",
        "tags": ["vocabulary", "airport"],
        "question": f"Definition: '{item['def']}'",
        "options": [item["word"], "Hotel", "Taxi", "Ticket"],
        "correct_answer": item["word"],
        "explanation": f"{item['word']} es el lugar o documento descrito."
    }

def gen_dialogue_order(idx):
    """(SYNTAX) Ordenar frases típicas de check-in."""
    sentence = random.choice(DB["dialogue_fragments"])
    
    parts = sentence.split(" ")
    scrambled = parts.copy()
    random.shuffle(scrambled)
    
    return {
        "id": generate_unique_id("ord"),
        "type": "order_sentence",
        "difficulty": "medium",
        "tags": ["syntax", "speaking"],
        "question": "Ordena la frase para el agente:",
        "parts": scrambled,
        "correct_order": parts,
        "explanation": "Orden lógico SVO (Sujeto + Verbo + Objeto)."
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
        "id": "pro-a1-7",
        "title": "Business Trip: The Airport",
        "level": "A1",
        "cefr_code": "A1.2",
        "description": "Examen final del Nivel A1. Domina el vocabulario de aeropuerto, check-in y horarios.",
        "tags": ["travel", "airport", "logistics", "final_exam"],
        "duration_min": 50,
        "learning_objectives": ["Can check in for a flight", "Can understand boarding announcements", "Can ask about gate and time"],
        "prerequisites": ["pro-a1-6"],
        "vocabulary_list": DB["vocabulary_list"],
        "theme_color": "#7C3AED", # Violet (Luxury Travel)
        "cultural_notes": "Arriving 2 hours before an international flight is standard. Have your passport and boarding pass ready at security.",
        "stages": []
    }

    # --- STAGE 1: LECTURE ---
    lesson["stages"].append({
        "id": "stage_intro",
        "type": "lecture",
        "title": "Airport Survival Guide",
        "parts": [
            {
                "visual": "## The Flow ✈️\n\n1. **Check-in** (Drop bags)\n2. **Security** (Check body)\n3. **Gate** (Wait for plane)\n4. **Boarding** (Enter plane)",
                "audio_script": "Traveling is easy if you know the steps. First, go to the Check-in Desk. Then, pass Security. Finally, find your Gate to board the plane.",
                "duration": 15,
                "image_prompt": "An illustration of the 4 steps at an airport: Check-in, Security, Gate, Boarding."
            }
        ]
    })

    # --- BLOQUES DE EJERCICIOS (100 TOTAL) ---
    all_questions = []

    # Generamos 100 ejercicios mezclados
    for i in range(30): all_questions.append(gen_vocab_airport(i))      # Vocabulario
    for i in range(30): all_questions.append(gen_prep_fly(i+30))        # Gramática
    for i in range(20): all_questions.append(gen_flight_logic(i+60))    # Lógica
    for i in range(20): all_questions.append(gen_dialogue_order(i+80))  # Sintaxis
    
    random.shuffle(all_questions)

    # Chunking en bloques de 20
    chunk_size = 20
    for i in range(0, len(all_questions), chunk_size):
        chunk = all_questions[i:i + chunk_size]
        block_num = (i // chunk_size) + 1
        
        lesson["stages"].append({
            "id": f"stage_practice_block_{block_num}",
            "type": "gamified_quiz",
            "title": f"Departure Gate {block_num}",
            "description": f"Preparación de vuelo {block_num}/5.",
            "xp_reward": 100 + (block_num * 10),
            "questions": chunk,
            "recommended_streak": 2
        })

    # --- BOSS STAGE: FINAL EXAM (CHECK-IN AGENT) ---
    lesson["stages"].append({
        "id": "stage_boss",
        "type": "practice_chat",
        "title": "Check-in Counter",
        "scenario": "Es tu prueba final. Haz el check-in para tu vuelo a Nueva York.",
        "ai_system_prompt": """
        ROLE: Airline Agent.
        GOAL: Complete the check-in process.
        BEHAVIOR:
        1. Ask "Where are you flying today?".
        2. Ask for Passport.
        3. Ask "Are you checking any bags?".
        4. Give them Gate 12 and Boarding Time 10:30.
        5. Say "Have a safe flight".
        """,
        "initial_message": "Good morning. Welcome to Onix Airlines. Next please!",
        "next_lesson_id": "pro-a2-1", # Conexión al Nivel A2
        "confidence_score_enabled": True,
        "badge_reward": "Globetrotter (A1 Completed)"
    })

    return lesson

# --- EXEC ---
if __name__ == "__main__":
    data = build_lesson()
    out_path = "backend/app/data/lessons/pro-a1-7.json"
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        
    print(f"✅ LECCIÓN A1-7 (TITANIUM) GENERADA CON ÉXITO.")
    print(f"📂 Ubicación: {out_path}")
    print(f"🔢 Total de Ejercicios: {sum(len(s.get('questions', [])) for s in data['stages'])}")