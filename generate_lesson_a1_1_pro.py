import json
import random
import os
import uuid

# ==========================================
# 1. TITANIUM LINGUISTIC DATABASE (A1-1)
# ==========================================

DB = {
    # Contextos para iniciar frases con naturalidad ejecutiva
    "contexts": [
        "Honestly,", "Basically,", "In reality,", "Currently,", 
        "As you know,", "For this project,", "Generally,", "Speaking of which,",
        "To be honest,", "From my perspective,", "Looking at the data,", 
        "Regarding the plan,", "In terms of strategy,", "Moving forward,", 
        "As a result,"
    ],
    # Sujetos orientados a negocios
    "subjects": [
        {"p": "I", "v": "am", "c": "I'm", "n": "am not", "nc": "I'm not", "es": "Yo"},
        {"p": "You", "v": "are", "c": "You're", "n": "are not", "nc": "aren't", "es": "Tú"},
        {"p": "He", "v": "is", "c": "He's", "n": "is not", "nc": "isn't", "es": "Él"},
        {"p": "She", "v": "is", "c": "She's", "n": "is not", "nc": "isn't", "es": "Ella"},
        {"p": "We", "v": "are", "c": "We're", "n": "are not", "nc": "aren't", "es": "Nosotros"},
        {"p": "They", "v": "are", "c": "They're", "n": "are not", "nc": "aren't", "es": "Ellos"},
        {"p": "The CEO", "v": "is", "c": "The CEO's", "n": "is not", "nc": "isn't", "es": "El CEO"},
        {"p": "The client", "v": "is", "c": "The client's", "n": "is not", "nc": "isn't", "es": "El cliente"},
        {"p": "The team", "v": "is", "c": "The team's", "n": "is not", "nc": "isn't", "es": "El equipo"},
        {"p": "The project", "v": "is", "c": "The project's", "n": "is not", "nc": "isn't", "es": "El proyecto"}
    ],
    # Adjetivos de alto valor (High-Value Adjectives)
    "adjectives": [
        "efficient", "proactive", "strategic", "committed", "qualified",
        "responsible", "available", "busy", "prepared", "optimistic",
        "innovative", "reliable", "focused", "dynamic", "experienced",
        "flexible", "motivated", "productive", "punctual", "successful"
    ],
    # Ubicaciones corporativas
    "locations": [
        "in the boardroom", "at the conference", "on a call", 
        "at the headquarters", "in a meeting", "unavailable",
        "in the office", "at a seminar", "on a business trip", "in a workshop",
        "at the reception", "in the lobby", "remote", "offline"
    ],
    # Vocabulario Clave para Flashcards
    "vocabulary_list": [
        {"word": "Efficient", "meaning": "Achieving maximum productivity.", "ipa": "/ɪˈfɪʃənt/"},
        {"word": "Proactive", "meaning": "Creating or controlling a situation.", "ipa": "/proʊˈæktɪv/"},
        {"word": "Boardroom", "meaning": "A room where a board of directors meets.", "ipa": "/ˈbɔːrdruːm/"},
        {"word": "Headquarters", "meaning": "The main offices of an organization.", "ipa": "/ˈhɛdkwɔːrtərz/"}
    ]
}

# ==========================================
# 2. UTILIDADES DEL MOTOR
# ==========================================

def get_subject_variant(subj_data):
    """Devuelve variaciones para evitar repetición monótona."""
    if subj_data['p'] in ["The CEO", "The client", "The team", "The project"]:
        return subj_data['p']
    # Variación de pronombres a nombres propios para realismo
    if subj_data['p'] == "He": return random.choice(["He", "Mr. Smith", "The manager", "John"])
    if subj_data['p'] == "She": return random.choice(["She", "Ms. Davis", "The director", "Sarah"])
    return subj_data['p']

def generate_unique_id(prefix):
    """Genera un ID único global."""
    return f"{prefix}_{uuid.uuid4().hex[:8]}"

# ==========================================
# 3. GENERADORES DE EJERCICIOS (DRILLS)
# ==========================================

def gen_scramble_sentence(idx):
    """Ordena la oración (Syntax Drill)."""
    subj = random.choice(DB["subjects"])
    s_text = get_subject_variant(subj)
    adj = random.choice(DB["adjectives"])
    
    # Sentence: "The manager is strategic."
    correct_order = [s_text, subj['v'], adj]
    
    # Hacemos una copia para mezclar
    sentence_parts = correct_order.copy()
    random.shuffle(sentence_parts)
    
    return {
        "id": generate_unique_id("scr"),
        "type": "order_sentence",
        "difficulty": "medium",
        "question": "Reorganiza para dar un reporte coherente:",
        "parts": sentence_parts,
        "correct_order": correct_order,
        "audio_ref": f"{s_text} {subj['v']} {adj}.",
        "hint": "Sujeto + Verbo To Be + Adjetivo.",
        "tags": ["syntax", "grammar", "sentence_structure"]
    }

def gen_listening_match(idx):
    """Discriminación auditiva (Listening Drill)."""
    subj = random.choice(DB["subjects"])
    adj = random.choice(DB["adjectives"])
    
    # 1. Definir la respuesta correcta
    correct_sentence = f"{subj['p']} {subj['v']} {adj}"
    
    # 2. Generar distractores lógicos pero incorrectos
    distractor_1 = f"{subj['p']} {subj['v']} not {adj}" # Negativo
    
    # Distractor 2: Error de conjugación (Si es 'are', ponemos 'is', y viceversa)
    if subj['v'] == "are":
        distractor_2 = f"{subj['p']} is {adj}"
    elif subj['v'] == "am":
        distractor_2 = f"{subj['p']} are {adj}"
    else: # is
        distractor_2 = f"{subj['p']} are {adj}"
        
    # 3. Crear lista y mezclar
    options = [correct_sentence, distractor_1, distractor_2]
    random.shuffle(options)
    
    return {
        "id": generate_unique_id("lst"),
        "type": "listening_match",
        "difficulty": "hard",
        "question": "Selecciona exactamente lo que escuchas:",
        "tts_text": correct_sentence, 
        "audio_url": "", 
        "options": options,
        "correct_answer": correct_sentence,
        "tags": ["listening", "comprehension"]
    }

def gen_translation_challenge(idx):
    """Traducción Inversa (Bridge Drill)."""
    subj = random.choice(DB["subjects"])
    adj = random.choice(DB["adjectives"])
    
    # Generar frase en español
    es_sentence = f"{subj['es']} está {adj} (en contexto laboral)"
    if subj['es'] in ["Yo", "Tú", "Nosotros"]: 
        es_sentence = f"{subj['es']} soy/estoy {adj}"

    # Respuesta correcta en inglés
    en_correct = f"{subj['p']} {subj['v']} {adj}"
    
    # Distractores
    distractor_1 = f"{subj['p']} have {adj}" # Error típico hispano (Tener vs Ser)
    
    # Distractor 2: Conjugación incorrecta
    if subj['v'] == "is":
        distractor_2 = f"{subj['p']} are {adj}"
    else:
        distractor_2 = f"{subj['p']} is {adj}"
        
    options = [en_correct, distractor_1, distractor_2]
    random.shuffle(options)
    
    return {
        "id": generate_unique_id("tra"),
        "type": "quiz_choice",
        "difficulty": "medium",
        "question": f"¿Cómo dirías esto en una reunión?: '{es_sentence}'",
        "options": options,
        "correct_answer": en_correct,
        "tags": ["translation", "vocabulary"]
    }

def gen_fill_blank_context(idx):
    """Rellenar huecos con contexto (Grammar Drill)."""
    subj = random.choice(DB["subjects"])
    ctx = random.choice(DB["contexts"])
    loc = random.choice(DB["locations"])
    
    # "Honestly, the CEO is in the boardroom."
    sentence = f"{ctx} {subj['p']} ___ {loc}."
    
    return {
        "id": generate_unique_id("fib"),
        "type": "fill_input",
        "difficulty": "hard",
        "question": f"Completa el correo: '{sentence}'",
        "correct_answers": [subj['v'], subj['c']], # Acepta "is" o "he's" (si aplicara, aqui solo verbo)
        "hint": f"Verbo To Be para '{subj['p']}'",
        "explanation": f"Para '{subj['p']}' usamos '{subj['v']}'.",
        "error_type": "grammar_tense",
        "tags": ["grammar", "writing"]
    }

def gen_odd_one_out(idx):
    """Lógica (Logic Drill)."""
    category = random.choice(["pronouns", "verbs"])
    
    if category == "verbs":
        # El intruso es un adjetivo, los otros son verbos
        distractors = ["am", "is", "are"]
        correct = "efficient"
        reason = "'Efficient' es un adjetivo. Los otros son conjugaciones del verbo To Be."
    else:
        # El intruso es un verbo, los otros son pronombres
        distractors = ["He", "She", "We"]
        correct = "Am"
        reason = "'Am' es un verbo. Los otros son pronombres personales."
    
    options = distractors + [correct]
    random.shuffle(options)
    
    return {
        "id": generate_unique_id("odd"),
        "type": "quiz_choice",
        "difficulty": "easy",
        "question": "Selecciona el intruso (Odd one out):",
        "options": options,
        "correct_answer": correct,
        "explanation": reason,
        "tags": ["logic", "vocabulary"]
    }

# ==========================================
# 4. BUILDER (ENSAMBLADOR DE LA LECCIÓN)
# ==========================================

def build_lesson():
    # --- Estructura de Datos Enriquecida ---
    lesson = {
        "meta": {
            "version": "Titanium 2.1",
            "created_at": "2024-01-01", 
            "author": "Titanium Engine"
        },
        "id": "pro-a1-1",
        "title": "The Networking Event",
        "level": "A1",
        "cefr_code": "A1.1",
        "description": "Domina las presentaciones formales y el verbo To Be en contextos profesionales.",
        "tags": ["networking", "introductions", "grammar", "business"],
        "duration_min": 45,
        "learning_objectives": ["Can introduce self using 'I am'", "Can identify colleagues using 'He/She is'", "Can describe professional status"],
        "prerequisites": [],
        "vocabulary_list": DB["vocabulary_list"],
        "theme_color": "#4F46E5",
        "cultural_notes": "In Western business culture, a firm handshake and direct eye contact are standard during introductions.",
        "stages": []
    }

    # --- STAGE 1: BRIEFING (Teoría Ejecutiva con Imágenes) ---
    lesson["stages"].append({
        "id": "stage_1",
        "type": "lecture",
        "title": "Executive Briefing",
        "parts": [
            {
                "visual": "## Identity Protocol\n\nI **am** (I'm) -> Self\nYou **are** (You're) -> Partner\nHe/She **is** (He's) -> Third Party",
                "audio_script": "In business, clarity is power. Using the verb 'To Be' correctly establishes your identity immediately.", 
                "duration": 15,
                # Imagen estratégica para visual learners
                "image_prompt": "A clean, modern infographic showing pronouns I, You, He, She connected to Am, Are, Is."
            },
            {
                "visual": "## Professional Context\n\nWhen meeting someone new:\n1. Smile\n2. Eye Contact\n3. 'Hi, I am [Name].'",
                "audio_script": "Remember, your introduction sets the tone. Be confident.",
                "duration": 10,
                # Segunda imagen de apoyo
                "image_prompt": ""
            }
        ]
    })

    # --- BLOQUES DE EJERCICIOS (100 TOTAL) ---
    all_questions = []

    # Generamos 100 ejercicios mezclados
    for i in range(25): all_questions.append(gen_fill_blank_context(i))
    for i in range(25): all_questions.append(gen_odd_one_out(i+25))
    for i in range(25): all_questions.append(gen_scramble_sentence(i+50))
    for i in range(25): all_questions.append(gen_listening_match(i+75))
    
    random.shuffle(all_questions)

    # Dividir en bloques de 20 (Bloques pre-guardados)
    chunk_size = 20
    for i in range(0, len(all_questions), chunk_size):
        chunk = all_questions[i:i + chunk_size]
        block_num = (i // chunk_size) + 1
        
        lesson["stages"].append({
            "id": f"stage_practice_block_{block_num}",
            "type": "gamified_quiz",
            "title": f"Training Block {block_num}",
            "description": f"Bloque de intensidad {block_num}/5. Mantén el enfoque.",
            "xp_reward": 100 + (block_num * 10),
            "questions": chunk,
            "recommended_streak": 1 if block_num == 1 else 0
        })

    # --- STAGE FINAL: BRIDGE (Translation Challenge) ---
    translation_block = [gen_translation_challenge(i) for i in range(10)]
    lesson["stages"].append({
        "id": "stage_bridge",
        "type": "gamified_quiz",
        "title": "Mental Bridge (Final Exam)",
        "description": "Traducción de intención a inglés. Alta dificultad.",
        "xp_reward": 300,
        "questions": translation_block,
        "badge_reward": "Translator Novice"
    })

    # --- STAGE BOSS: AI ROLEPLAY ---
    lesson["stages"].append({
        "id": "stage_boss",
        "type": "practice_chat",
        "title": "The Networking Event",
        "scenario": "Estás en un cóctel de negocios en Nueva York. Un posible socio se acerca.",
        "ai_system_prompt": """
        ACT AS: Mr. Sterling, a potential business partner at a Networking Event.
        TONE: Professional, polite, but slightly busy.
        GOAL: Ask the user who they are and what they do.
        SUCCESS CRITERIA: User must correctly use 'I am' + [Name/Role/Adjective].
        BEHAVIOR:
        1. Start by introducing yourself briefly.
        2. Wait for the user to introduce themselves.
        3. If they make a grammar mistake with 'To Be', politely ask for clarification.
        4. Keep responses short (under 2 sentences).
        """,
        "initial_message": "Good evening. I don't think we've met. I am James Sterling.",
        "next_lesson_id": "pro-a1-2",
        "confidence_score_enabled": True
    })

    return lesson

# ==========================================
# 5. EJECUCIÓN
# ==========================================

if __name__ == "__main__":
    generated_lesson = build_lesson()
    
    output_path = "backend/app/data/lessons/pro-a1-1.json"
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(generated_lesson, f, indent=2, ensure_ascii=False)

    print(f"✨ LECCIÓN A1-1 (TITANIUM 2.1) PERFECCIONADA.")
    print(f"📂 Ubicación: {output_path}")
    print(f"📊 Etapas Totales: {len(generated_lesson['stages'])}")
    
    total_q = 0
    for stage in generated_lesson["stages"]:
        if "questions" in stage:
            total_q += len(stage["questions"])
    print(f"🔢 Total de Ejercicios Generados: {total_q}")