import json
import random
import os
import uuid

# ==========================================
# 1. BASE DE DATOS DE CONTEXTO EXPANDIDA (A1-2)
# ==========================================

DB = {
    # Sujetos enriquecidos con formas verbales para distintos tiempos
    "subjects": [
        {"p": "I", "v_past": "was", "v_pres": "am", "v_fut": "will be", "en": "I", "es": "Yo"},
        {"p": "He", "v_past": "was", "v_pres": "is", "v_fut": "will be", "en": "my brother", "es": "Mi hermano"},
        {"p": "She", "v_past": "was", "v_pres": "is", "v_fut": "will be", "en": "Sarah", "es": "Sarah"},
        {"p": "It", "v_past": "was", "v_pres": "is", "v_fut": "will be", "en": "the building", "es": "El edificio"},
        {"p": "We", "v_past": "were", "v_pres": "are", "v_fut": "will be", "en": "we", "es": "Nosotros"},
        {"p": "They", "v_past": "were", "v_pres": "are", "v_fut": "will be", "en": "my parents", "es": "Mis padres"},
        {"p": "The manager", "v_past": "was", "v_pres": "is", "v_fut": "will be", "en": "the manager", "es": "El gerente"},
        {"p": "The team", "v_past": "was", "v_pres": "is", "v_fut": "will be", "en": "the team", "es": "El equipo"}
    ],
    # Marcadores temporales clasificados para lógica de tiempos
    "markers": {
        "past": ["In 1999", "Last century", "When I was a child", "A decade ago", "Yesterday", "Last year", "In the past"],
        "present": ["Currently", "Nowadays", "At this moment", "Today", "In reality", "Right now", "These days"],
        "future": ["In the future", "By 2050", "Next year", "Someday", "When robots rule", "Tomorrow", "In a few years"]
    },
    # Operaciones matemáticas para práctica de números y verbo 'is'
    "math_ops": ["plus", "minus", "times"],
    # Vocabulario Clave para Flashcards (Mejora 3)
    "vocabulary_list": [
        {"word": "Timeline", "meaning": "A graphic representation of the passage of time as a line.", "ipa": "/ˈtaɪmˌlaɪn/"},
        {"word": "Century", "meaning": "A period of one hundred years.", "ipa": "/ˈsɛntʃəri/"},
        {"word": "Decade", "meaning": "A period of ten years.", "ipa": "/ˈdɛkeɪd/"},
        {"word": "Generation", "meaning": "All of the people born and living at about the same time.", "ipa": "/ˌdʒɛnəˈreɪʃən/"}
    ]
}

# ==========================================
# 2. UTILIDADES DEL MOTOR
# ==========================================

def generate_unique_id(prefix):
    """Genera un ID único global (Mejora 11)."""
    return f"{prefix}_{uuid.uuid4().hex[:8]}"

# ==========================================
# 3. GENERADORES DE EJERCICIOS AVANZADOS
# ==========================================

def gen_timeline_logic(idx):
    """(NUEVO) Ordena cronológicamente eventos."""
    subj = random.choice(DB["subjects"])
    age_base = random.randint(10, 30)
    
    # Creamos eventos lógicos con años específicos
    events = [
        {"txt": f"In 2010, {subj['en'].lower()} {subj['v_past']} {age_base} years old.", "year": 2010},
        {"txt": f"Now, {subj['en'].lower()} {subj['v_pres']} {age_base + 13}.", "year": 2023},
        {"txt": f"In 2030, {subj['en'].lower()} {subj['v_fut']} {age_base + 20}.", "year": 2030}
    ]
    
    # La respuesta correcta es la lista ordenada por año
    sorted_events = sorted(events, key=lambda x: x["year"])
    correct_order_txt = [e["txt"] for e in sorted_events]
    
    # Mezclamos para la presentación
    display_parts = [e["txt"] for e in events]
    random.shuffle(display_parts)
    
    return {
        "id": generate_unique_id("time"),
        "type": "order_sentence",
        "difficulty": "hard",
        "tags": ["logic", "tenses", "sequencing"],
        "question": "Ordena estos eventos del pasado al futuro:",
        "parts": display_parts,
        "correct_order": correct_order_txt,
        "explanation": "El orden lógico es: Pasado (was) -> Presente (is) -> Futuro (will be).",
        "audio_ref": ""
    }

def gen_age_error_correction(idx):
    """(CRÍTICO) Detecta el error común 'I have 20 years'."""
    subj = random.choice(DB["subjects"])
    age = random.randint(15, 60)
    
    # 1. Generar la respuesta correcta
    correct = f"{subj['p']} {subj['v_pres']} {age} years old."
    
    # 2. Generar distractores (Errores típicos)
    distractor_1 = f"{subj['p']} has {age} years old." # Error común 'tener'
    if subj['p'] in ["I", "We", "They"]:
        distractor_1 = f"{subj['p']} have {age} years old."
        
    distractor_2 = f"{subj['p']} {subj['v_pres']} have {age} years." # Mezcla rara
    
    # 3. Crear lista de opciones garantizando que la correcta esté ahí
    options = [correct, distractor_1, distractor_2]
    random.shuffle(options)
    
    return {
        "id": generate_unique_id("err"),
        "type": "quiz_choice",
        "difficulty": "medium",
        "tags": ["common_errors", "grammar", "to_be"],
        "question": f"¿Cuál es la forma CORRECTA de decir la edad?",
        "options": options,
        "correct_answer": correct,
        "explanation": "En inglés NUNCA usamos 'have' para la edad. Usamos el verbo To Be (am/is/are).",
        "error_type": "grammar_verb_choice"
    }

def gen_tense_context_match(idx):
    """Rellenar huecos basado en el marcador temporal."""
    tense = random.choice(["past", "present", "future"])
    subj = random.choice(DB["subjects"])
    marker = random.choice(DB["markers"][tense])
    age = random.randint(5, 80)
    
    # Determinar el verbo correcto según el tiempo
    if tense == "past":
        verb = subj['v_past']
        hint = "Pasado"
    elif tense == "present":
        verb = subj['v_pres']
        hint = "Presente"
    else:
        verb = subj['v_fut']
        hint = "Futuro"
        
    sentence = f"{marker}, {subj['en']} ___ {age} years old."
    
    return {
        "id": generate_unique_id("ctx"),
        "type": "fill_input",
        "difficulty": "medium",
        "tags": ["grammar", "tenses", "context_clues"],
        "question": f"Completa según el contexto temporal: '{sentence}'",
        "correct_answers": [verb],
        "hint": f"Marcador de tiempo: {hint}",
        "explanation": f"'{marker}' nos indica que debemos usar {hint} ({verb}).",
        "error_type": "grammar_tense"
    }

def gen_math_logic(idx):
    """Matemáticas en inglés."""
    a = random.randint(5, 20)
    b = random.randint(1, 10)
    op = random.choice(DB["math_ops"])
    
    if op == "plus": res = a + b
    elif op == "minus": res = a - b
    elif op == "times": res = a * b
    
    sentence = f"{a} {op} {b} ___ {res}."
    correct = "is"
    
    # Distractores
    options = ["is", "are", "am", "be"]
    random.shuffle(options) # Mezclamos aunque sean fijos para variar el orden visual
    
    return {
        "id": generate_unique_id("math"),
        "type": "quiz_choice",
        "difficulty": "easy",
        "tags": ["vocabulary", "logic", "numbers"],
        "question": f"Completa la operación: '{sentence}'",
        "options": options,
        "correct_answer": correct,
        "explanation": "El resultado de una operación matemática se trata como singular (is/equals)."
    }

# ==========================================
# 4. ENSAMBLAJE DE LECCIÓN (TITANIUM STRUCTURE)
# ==========================================

def build_lesson():
    # --- Estructura de Datos Enriquecida ---
    lesson = {
        "meta": {
            "version": "Titanium 2.1",
            "created_at": "2024-01-01", 
            "author": "Titanium Engine"
        },
        "id": "pro-a1-2",
        "title": "Time Mastery: Ages & Eras",
        "level": "A1+",
        "cefr_code": "A1.2",
        "description": "Domina el uso de 'To Be' para edades y aprende a moverte entre pasado, presente y futuro.",
        "tags": ["tenses", "grammar", "foundations", "time"],
        "duration_min": 45,
        "learning_objectives": ["Can state age correctly using 'To Be'", "Can distinguish between past, present, and future markers", "Can perform basic math in English"],
        "prerequisites": ["pro-a1-1"],
        "vocabulary_list": DB["vocabulary_list"],
        "theme_color": "#10B981", # Emerald
        "cultural_notes": "In English-speaking cultures, asking someone's age directly can be considered impolite, especially with older adults.",
        "stages": []
    }
    
    # ETAPA 1: CONCEPTOS (Lecture con Diagrama)
    lesson["stages"].append({
        "id": "stage_intro",
        "type": "lecture",
        "title": "The Timeline",
        "parts": [
            {
                "visual": "\n## The Timeline ⏳\n\n* **Past**: 'I was' (Yesterday)\n* **Present**: 'I am' (Today)\n* **Future**: 'I will be' (Tomorrow)",
                "audio_script": "Time is linear. We move from 'was', to 'is', to 'will be'. Mastering these three forms of the verb To Be allows you to tell your life story.",
                "duration": 15
            },
            {
                "visual": "## The Golden Rule 🌟\n\n**Have** = Possession (I have a car).\n**Be** = Age/State (I am 20).\n\nNever say 'I have 20 years'.",
                "audio_script": "Welcome back. Today we fix the most common mistake. In English, you do not 'have' years. You ARE your years. Let's master the timeline.",
                "duration": 12,
                "image_prompt": "A visual comparison showing a birthday cake with 'I am 20' vs a person holding a car key 'I have a car'."
            }
        ]
    })
    
    # --- BLOQUES DE EJERCICIOS (100 TOTAL) ---
    all_questions = []

    # Generamos 100 ejercicios mezclados para asegurar variedad
    for i in range(30): all_questions.append(gen_age_error_correction(i))
    for i in range(30): all_questions.append(gen_tense_context_match(i+30))
    for i in range(20): all_questions.append(gen_timeline_logic(i+60))
    for i in range(20): all_questions.append(gen_math_logic(i+80))
    
    random.shuffle(all_questions) # Mezclar todo el pool de preguntas

    # Dividir en bloques de 20 (Chunking)
    chunk_size = 20
    for i in range(0, len(all_questions), chunk_size):
        chunk = all_questions[i:i + chunk_size]
        block_num = (i // chunk_size) + 1
        
        lesson["stages"].append({
            "id": f"stage_practice_block_{block_num}",
            "type": "gamified_quiz",
            "title": f"Chrono-Block {block_num}",
            "description": f"Bloque de intensidad {block_num}/5. Sincroniza tu reloj interno.",
            "xp_reward": 100 + (block_num * 10),
            "questions": chunk,
            "recommended_streak": 2 if block_num > 2 else 0
        })

    # BOSS: TIME TRAVELER CHAT
    lesson["stages"].append({
        "id": "stage_boss",
        "type": "practice_chat",
        "title": "The Time Traveler",
        "scenario": "Estás en el año 3000. Explícale a un robot cuántos años tenías en el pasado y cuántos tendrás en el futuro.",
        "ai_system_prompt": """
        ROLE: Future Robot Unit 734.
        GOAL: Ask user 'How old were you in [Past Year]?' and 'How old will you be in [Future Year]?'.
        SUCCESS CRITERIA: User must correctly use 'was' for past and 'will be' for future.
        BEHAVIOR:
        1. Speak in a robotic but polite tone.
        2. Verify logical consistency (if user says they were 20 in 2000, they can't be 10 in 2010).
        3. Correct 'I have' errors immediately.
        """,
        "initial_message": "Bleep Blop. I am Unit 734. Accessing history files... How old were you in the year 2020?",
        "next_lesson_id": "pro-a1-3",
        "confidence_score_enabled": True,
        "badge_reward": "Time Lord"
    })
    
    return lesson

# --- EXEC ---
if __name__ == "__main__":
    data = build_lesson()
    out_path = "backend/app/data/lessons/pro-a1-2.json"
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        
    print(f"✅ LECCIÓN A1-2 (TITANIUM) GENERADA CON ÉXITO.")
    print(f"📂 Ubicación: {out_path}")
    print(f"📊 Etapas Totales: {len(data['stages'])}")
    
    # Verificación rápida
    total_q = 0
    for stage in data["stages"]:
        if "questions" in stage:
            total_q += len(stage["questions"])
    print(f"🔢 Total de Ejercicios Generados: {total_q}")