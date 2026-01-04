import json
import random
import os
import uuid

# --- 1. BASE DE DATOS LINGÜÍSTICA EXPANDIDA ---

DB = {
    "contexts": [
        "Honestly,", "Look,", "Listen,", "In reality,", "Basically,", 
        "Believe it or not,", "Generally,"
    ],
    "times": ["this morning", "tonight", "right now", "these days"],
    "subjects": [
        {"p": "I", "v": "am", "c": "I'm", "n": "am not", "nc": "I'm not", "es": "Yo"},
        {"p": "You", "v": "are", "c": "You're", "n": "are not", "nc": "aren't", "es": "Tú"},
        {"p": "He", "v": "is", "c": "He's", "n": "is not", "nc": "isn't", "es": "Él"},
        {"p": "She", "v": "is", "c": "She's", "n": "is not", "nc": "isn't", "es": "Ella"},
        {"p": "We", "v": "are", "c": "We're", "n": "are not", "nc": "aren't", "es": "Nosotros"},
        {"p": "They", "v": "are", "c": "They're", "n": "are not", "nc": "aren't", "es": "Ellos"}
    ],
    "names": ["Emma", "Liam", "Sofia", "Noah", "The CEO", "My doctor"],
    "adjectives": [
        "exhausted", "thrilled", "overwhelmed", "skeptical", "brilliant", 
        "lost", "hired", "fired", "late", "early"
    ],
    "locations": [
        "at the airport", "in the meeting", "on the bus", "at Google HQ", "in the lobby"
    ]
}

# --- 2. UTILIDADES DEL MOTOR ---

def get_smart_distractors(correct_verb):
    """Genera errores comunes en lugar de opciones aleatorias."""
    distractors = []
    if correct_verb == "am": distractors = ["is", "are", "be"]
    elif correct_verb == "is": distractors = ["are", "am", "be"]
    elif correct_verb == "are": distractors = ["is", "am", "be"]
    return distractors

def get_subject_variant(subj_data):
    """Devuelve 'She' o 'Emma' aleatoriamente para variedad."""
    if subj_data['p'] in ["He", "She"]:
        return random.choice([subj_data['p'], random.choice(DB["names"])])
    return subj_data['p']

# --- 3. GENERADORES DE EJERCICIOS AVANZADOS ---

def gen_scramble_sentence(idx):
    """(IMPL 3) Crea ejercicios de ordenar oraciones."""
    subj = random.choice(DB["subjects"])
    s_text = get_subject_variant(subj)
    adj = random.choice(DB["adjectives"])
    
    # Oración base: She is exhausted
    sentence_parts = [s_text, subj['v'], adj]
    random.shuffle(sentence_parts)
    
    return {
        "id": f"scr_{idx}",
        "type": "order_sentence",
        "difficulty": "medium",
        "tags": ["grammar", "syntax"],
        "question": "Ordena las palabras para formar una oración correcta:",
        "parts": sentence_parts,
        "correct_order": [s_text, subj['v'], adj],
        "audio_ref": f"{s_text} {subj['v']} {adj}.",
        "hint": "El sujeto va primero, luego el verbo To Be."
    }

def gen_listening_match(idx):
    """(IMPL 5) Simulación de ejercicio de escucha."""
    subj = random.choice(DB["subjects"])
    adj = random.choice(DB["adjectives"])
    sentence = f"{subj['p']} {subj['v']} {adj}"
    
    # Generamos opciones que suenan parecido o confunden
    distractor_1 = f"{subj['p']} {subj['v']} not {adj}"
    distractor_2 = f"{subj['p']} is {adj}" if subj['v'] == "are" else f"{subj['p']} are {adj}"
    
    options = [sentence, distractor_1, distractor_2]
    random.shuffle(options)
    
    return {
        "id": f"lst_{idx}",
        "type": "listening_match",
        "difficulty": "hard",
        "tags": ["listening", "comprehension"],
        "question": "Escucha el audio y selecciona la frase exacta.",
        "tts_text": sentence, # El frontend usará esto para generar voz
        "options": options,
        "correct_answer": sentence
    }

def gen_translation_challenge(idx):
    """(IMPL 13) Traducción inversa."""
    subj = random.choice(DB["subjects"])
    adj = random.choice(DB["adjectives"])
    
    es_sentence = f"{subj['es']} está {adj} (en inglés)"
    en_correct = f"{subj['p']} {subj['v']} {adj}"
    
    return {
        "id": f"tra_{idx}",
        "type": "quiz_choice",
        "difficulty": "medium",
        "tags": ["translation", "vocabulary"],
        "question": f"¿Cómo se dice: '{es_sentence}'?",
        "options": [
            f"{subj['p']} {subj['v']} {adj}",
            f"{subj['p']} is {adj}",
            f"{subj['p']} have {adj}"
        ],
        "correct_answer": en_correct
    }

def gen_fill_blank_context(idx):
    """(IMPL 4 & 10) Rellenar espacio con contexto rico."""
    subj = random.choice(DB["subjects"])
    ctx = random.choice(DB["contexts"])
    loc = random.choice(DB["locations"])
    
    sentence = f"{ctx} {subj['p']} ___ {loc}."
    
    return {
        "id": f"fib_{idx}",
        "type": "fill_input", # Usuario debe escribir
        "difficulty": "hard",
        "tags": ["grammar", "writing"],
        "question": f"Completa la frase: '{sentence}'",
        "correct_answers": [subj['v'], subj['c']], # Acepta "are" o "We're" (si aplica)
        "hint": f"Verbo To Be para '{subj['p']}'",
        "explanation": f"Con '{subj['p']}' siempre usamos '{subj['v']}'."
    }

def gen_odd_one_out(idx):
    """(IMPL 14) Encuentra el intruso."""
    category = random.choice(["pronouns", "verbs"])
    
    if category == "verbs":
        options = ["am", "is", "are", "happy"]
        correct = "happy"
        reason = "'Happy' es un adjetivo, los demás son formas del verbo To Be."
    else:
        options = ["He", "She", "It", "Am"]
        correct = "Am"
        reason = "'Am' es un verbo, los demás son pronombres."
        
    random.shuffle(options)
    return {
        "id": f"odd_{idx}",
        "type": "quiz_choice",
        "difficulty": "easy",
        "tags": ["vocabulary", "logic"],
        "question": "Selecciona la palabra que NO pertenece al grupo:",
        "options": options,
        "correct_answer": correct,
        "explanation": reason
    }

# --- 4. ENSAMBLAJE DE LA LECCIÓN (ESTRUCTURA MODULAR) ---

def build_lesson():
    lesson = {
        "id": "pro-a1-1",
        "version": "Titanium 2.0",
        "title": "Executive Basics: To Be",
        "level": "A1",
        "tags": ["grammar", "business", "foundations"],
        "stages": []
    }

    # ETAPA 1: CONCEPTOS (Lecture)
    lesson["stages"].append({
        "id": "stage_1",
        "type": "lecture",
        "title": "Core Concepts",
        "parts": [
            {
                "visual": "## The Logic\n\nI -> **am**\nYou -> **are**\nHe/She -> **is**",
                "audio": "Welcome back. Let's synchronize our grammar. The verb To Be connects the subject to a description.",
                "animation": "explaining",
                "duration": 10
            }
        ]
    })

    # ETAPA 2: GRAMMAR DRILLS (Variedad de tipos)
    questions_mix = []
    for i in range(5): questions_mix.append(gen_fill_blank_context(i))
    for i in range(5): questions_mix.append(gen_odd_one_out(i+5))
    random.shuffle(questions_mix)
    
    lesson["stages"].append({
        "id": "stage_2",
        "type": "gamified_quiz",
        "title": "Grammar Calibration",
        "description": "Ajuste de precisión gramatical.",
        "xp_reward": 100,
        "questions": questions_mix
    })

    # ETAPA 3: LISTENING & SYNTAX (Habilidades activas)
    active_mix = []
    for i in range(5): active_mix.append(gen_scramble_sentence(i+10))
    for i in range(5): active_mix.append(gen_listening_match(i+15))
    
    lesson["stages"].append({
        "id": "stage_3",
        "type": "gamified_quiz",
        "title": "Active Listening & Syntax",
        "description": "Entrenamiento auditivo y orden mental.",
        "xp_reward": 150,
        "questions": active_mix
    })

    # ETAPA 4: TRADUCCIÓN (Puente mental)
    lesson["stages"].append({
        "id": "stage_4",
        "type": "gamified_quiz",
        "title": "Translation Bridge",
        "questions": [gen_translation_challenge(i) for i in range(5)]
    })

    # ETAPA FINAL: BOSS BATTLE (Roleplay Estructurado)
    lesson["stages"].append({
        "id": "stage_boss",
        "type": "practice_chat",
        "title": "The Interview",
        "scenario": "Estás en el lobby de una empresa internacional. Preséntate.",
        "ai_system_prompt": "ROLE: Receptionist at Stark Industries. GOAL: Verify user can use 'I am', 'It is' correctly.",
        "initial_message": "Good morning. I am the receptionist. Who are you?",
        "success_criteria": ["uses_i_am", "uses_nice_to_meet_you"]
    })

    return lesson

# --- 5. EJECUCIÓN Y GUARDADO ---

if __name__ == "__main__":
    generated_lesson = build_lesson()
    
    # Ruta segura para backend
    output_path = "backend/app/data/lessons/pro-a1-1.json"
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(generated_lesson, f, indent=2, ensure_ascii=False)

    print(f"✨ LECCIÓN TITANIUM GENERADA: {len(generated_lesson['stages'])} etapas creadas.")
    print(f"📂 Archivo guardado en: {output_path}")