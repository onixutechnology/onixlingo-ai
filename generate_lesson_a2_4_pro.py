import json
import random
import os
import uuid

# ==========================================
# 1. BASE DE DATOS TELEFÓNICA (A2-4)
# ==========================================

DB = {
    "phrasal_verbs": [
        {"verb": "pick up", "def": "Answer the phone", "context": "The phone is ringing. Please ___ it ___."},
        {"verb": "hang up", "def": "End the call", "context": "The conversation is over. You can ___ now."},
        {"verb": "hold on", "def": "Wait a moment", "context": "Please ___, I need to check the file."},
        {"verb": "put through", "def": "Connect someone", "context": "I will ___ you ___ to the manager."},
        {"verb": "call back", "def": "Return a phone call", "context": "He is busy. Can he ___ you ___ later?"},
        {"verb": "speak up", "def": "Talk louder", "context": "I can't hear you. Could you ___ please?"},
        {"verb": "cut off", "def": "Lose connection", "context": "The signal was bad and we were ___."}
    ],
    "etiquette_pairs": [
        {"rude": "I want to speak to John.", "polite": "Could I speak to John, please?"},
        {"rude": "Who are you?", "polite": "May I ask who is calling?"},
        {"rude": "Wait.", "polite": "Could you hold on a moment?"},
        {"rude": "He is busy.", "polite": "I'm afraid he is unavailable at the moment."},
        {"rude": "Speak louder.", "polite": "Could you speak up, please?"},
        {"rude": "What?", "polite": "Could you repeat that?"}
    ],
    "spelling_names": [
        {"name": "Smith", "spelling": "S-M-I-T-H"},
        {"name": "Jones", "spelling": "J-O-N-E-S"},
        {"name": "Miller", "spelling": "M-I-L-L-E-R"},
        {"name": "Davies", "spelling": "D-A-V-I-E-S"},
        {"name": "Taylor", "spelling": "T-A-Y-L-O-R"}
    ],
    "situations": [
        {"ctx": "You answer the phone.", "phrase": "Hello, this is [Name] speaking."},
        {"ctx": "The caller wants someone who is not there.", "phrase": "I'm afraid he is in a meeting."},
        {"ctx": "You want to take a message.", "phrase": "Would you like to leave a message?"},
        {"ctx": "You didn't understand the name.", "phrase": "Could you spell that for me?"}
    ],
    "vocabulary_list": [
        {"word": "Voicemail", "meaning": "A centralized electronic system which can store messages from telephone callers.", "ipa": "/ˈvɔɪsmeɪl/"},
        {"word": "Extension", "meaning": "An additional telephone connected to the same line.", "ipa": "/ɪkˈstɛnʃən/"},
        {"word": "Unavailable", "meaning": "Not able to be used or reached.", "ipa": "/ˌʌnəˈveɪləbəl/"},
        {"word": "Receiver", "meaning": "The part of a telephone apparatus that converts electrical signals into sound.", "ipa": "/rɪˈsiːvər/"}
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

def gen_phrasal_context(idx):
    """(GRAMMAR) Completar Phrasal Verbs en contexto."""
    item = random.choice(DB["phrasal_verbs"])
    parts = item["verb"].split(" ") # [put, through]
    base = parts[0]
    particle = parts[1]
    
    # "Please ___ you ___ to the manager" -> put / through
    question = item["context"].replace("___", "______")
    
    return {
        "id": generate_unique_id("phrasal"),
        "type": "quiz_choice",
        "difficulty": "medium",
        "tags": ["grammar", "phrasal_verbs"],
        "question": f"Completa la frase: '{question}'",
        "options": [item["verb"], f"{base} in", f"{base} out", "close up"],
        "correct_answer": item["verb"],
        "explanation": f"'{item['verb']}' significa: {item['def']}."
    }

def gen_politeness_filter(idx):
    """(SOFT SKILLS) Transformar Rude -> Polite."""
    pair = random.choice(DB["etiquette_pairs"])
    
    return {
        "id": generate_unique_id("polite"),
        "type": "quiz_choice",
        "difficulty": "easy",
        "tags": ["soft_skills", "etiquette"],
        "question": f"Make this polite: **'{pair['rude']}'**",
        "options": [pair["polite"], pair["rude"] + " please", "I said " + pair["rude"]],
        "correct_answer": pair["polite"],
        "explanation": "En inglés de negocios, usamos estructuras indirectas ('Could I...', 'I'm afraid...') para ser educados."
    }

def gen_spelling_simulation(idx):
    """(LISTENING/LOGIC) Simulación de deletreo de nombres."""
    item = random.choice(DB["spelling_names"])
    
    # Generar opciones con errores sutiles
    wrong1 = item["name"][:-1] # Smit
    wrong2 = item["name"].replace("i", "e").replace("a", "o") # Smeth
    
    return {
        "id": generate_unique_id("spell"),
        "type": "quiz_choice",
        "difficulty": "hard",
        "tags": ["listening", "spelling", "alphabet"],
        "question": f"The client says: **'My name is {item['spelling']}'**. What do you write?",
        "options": [item["name"], wrong1, wrong2],
        "correct_answer": item["name"],
        "explanation": f"Las letras {item['spelling']} forman el nombre {item['name']}."
    }

def gen_call_flow_syntax(idx):
    """(SYNTAX) Ordenar frases clave de llamadas."""
    situation = random.choice(DB["situations"])
    
    parts = situation["phrase"].split(" ")
    scrambled = parts.copy()
    random.shuffle(scrambled)
    
    return {
        "id": generate_unique_id("ord"),
        "type": "order_sentence",
        "difficulty": "medium",
        "tags": ["syntax", "speaking"],
        "question": f"Situation: **{situation['ctx']}**",
        "parts": scrambled,
        "correct_order": parts,
        "explanation": f"Frase correcta: '{situation['phrase']}'"
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
        "id": "pro-a2-4",
        "title": "Client Call",
        "level": "A2",
        "cefr_code": "A2.2",
        "description": "Domina la etiqueta telefónica: contestar, transferir, tomar mensajes y deletrear nombres.",
        "tags": ["phone", "communication", "soft_skills", "phrasal_verbs"],
        "duration_min": 45,
        "learning_objectives": ["Can identify self on the phone ('This is...')", "Can use phone phrasal verbs (hold on, put through)", "Can take simple messages"],
        "prerequisites": ["pro-a2-3"],
        "vocabulary_list": DB["vocabulary_list"],
        "theme_color": "#0D9488", # Teal (Communication/Clear lines)
        "cultural_notes": "In English, we never say 'I am [Name]' on the phone. We say 'This is [Name]'. Also, 'Good bye' is too formal; 'Bye' is fine.",
        "stages": []
    }

    # --- STAGE 1: LECTURE ---
    lesson["stages"].append({
        "id": "stage_intro",
        "type": "lecture",
        "title": "Phone Etiquette 101",
        "parts": [
            {
                "visual": "## Identity Rule 🆔\n\n❌ Hello, I am Alex.\n✅ Hello, **this is** Alex.",
                "audio_script": "Speaking on the phone is different from face-to-face. First rule: Identify yourself with 'This is', not 'I am'.",
                "duration": 10
            },
            {
                "visual": "## Key Phrasal Verbs 📞\n\n* **Pick up** (Answer)\n* **Hang up** (End)\n* **Hold on** (Wait)\n* **Put through** (Connect)",
                "audio_script": "We use phrasal verbs constantly. If I say 'Hold on, I'll put you through', it means 'Wait, I will connect you'.",
                "duration": 15,
                "image_prompt": "A receptionist wearing a headset transferring a call on a modern switchboard."
            }
        ]
    })

    # --- BLOQUES DE EJERCICIOS (100 TOTAL) ---
    all_questions = []

    # Generamos 100 ejercicios mezclados
    for i in range(30): all_questions.append(gen_phrasal_context(i))        # Phrasal Verbs
    for i in range(30): all_questions.append(gen_politeness_filter(i+30))   # Etiqueta
    for i in range(20): all_questions.append(gen_spelling_simulation(i+60)) # Deletreo
    for i in range(20): all_questions.append(gen_call_flow_syntax(i+80))    # Sintaxis
    
    random.shuffle(all_questions)

    # Chunking en bloques de 20
    chunk_size = 20
    for i in range(0, len(all_questions), chunk_size):
        chunk = all_questions[i:i + chunk_size]
        block_num = (i // chunk_size) + 1
        
        lesson["stages"].append({
            "id": f"stage_practice_block_{block_num}",
            "type": "gamified_quiz",
            "title": f"Call Center Drill {block_num}",
            "description": f"Simulación de llamadas {block_num}/5.",
            "xp_reward": 100 + (block_num * 10),
            "questions": chunk,
            "recommended_streak": 2
        })

    # --- BOSS STAGE: TAKING A MESSAGE ---
    lesson["stages"].append({
        "id": "stage_boss",
        "type": "practice_chat",
        "title": "The Gatekeeper",
        "scenario": "Eres recepcionista. Un cliente importante llama preguntando por tu jefe, que está ocupado.",
        "ai_system_prompt": """
        ROLE: Mr. Carter (Important Client).
        GOAL: Speak to the Boss (Sarah).
        BEHAVIOR:
        1. Say: "Hello, this is Mr. Carter. Is Sarah available?"
        2. Wait for user to say she is unavailable/busy politely.
        3. If user is rude ("She can't talk"), get angry.
        4. Say: "Can I leave a message? Tell her the deal is signed."
        5. Wait for confirmation.
        """,
        "initial_message": "Ring ring... (You pick up the phone)",
        "next_lesson_id": "pro-a2-5",
        "confidence_score_enabled": True,
        "badge_reward": "Receptionist Pro"
    })

    return lesson

# --- EXEC ---
if __name__ == "__main__":
    data = build_lesson()
    out_path = "backend/app/data/lessons/pro-a2-4.json"
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        
    print(f"✅ LECCIÓN A2-4 (TITANIUM) GENERADA CON ÉXITO.")
    print(f"📂 Ubicación: {out_path}")
    print(f"🔢 Total de Ejercicios: {sum(len(s.get('questions', [])) for s in data['stages'])}")