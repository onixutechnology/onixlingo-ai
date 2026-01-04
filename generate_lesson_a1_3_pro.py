import json
import random
import os
import uuid

# --- 1. BASE DE DATOS LINGÜÍSTICA EXPANDIDA ---

DB = {
    "subjects": [
        {"p": "I", "3rd": False, "v_be": "am", "aux": "do", "es": "Yo"},
        {"p": "You", "3rd": False, "v_be": "are", "aux": "do", "es": "Tú"},
        {"p": "He", "3rd": True, "v_be": "is", "aux": "does", "es": "Él"},
        {"p": "She", "3rd": True, "v_be": "is", "aux": "does", "es": "Ella"},
        {"p": "My dad", "3rd": True, "v_be": "is", "aux": "does", "es": "Mi papá"},
        {"p": "We", "3rd": False, "v_be": "are", "aux": "do", "es": "Nosotros"},
        {"p": "They", "3rd": False, "v_be": "are", "aux": "do", "es": "Ellos"}
    ],
    "verbs": [
        {"base": "wake up", "3rd": "wakes up", "obj": "at 7 AM"},
        {"base": "brush", "3rd": "brushes", "obj": "my teeth"}, # -es ending
        {"base": "study", "3rd": "studies", "obj": "English"},  # -ies ending
        {"base": "go", "3rd": "goes", "obj": "to work"},        # -es ending
        {"base": "have", "3rd": "has", "obj": "breakfast"},     # irregular
        {"base": "watch", "3rd": "watches", "obj": "TV"},
        {"base": "do", "3rd": "does", "obj": "exercise"}
    ],
    "adverbs": [
        {"word": "always", "pct": "100%"},
        {"word": "usually", "pct": "80%"},
        {"word": "sometimes", "pct": "50%"},
        {"word": "never", "pct": "0%"}
    ],
    "prepositions": [
        {"prep": "at", "items": ["7:00 PM", "noon", "midnight", "night", "the weekend"]},
        {"prep": "in", "items": ["the morning", "the afternoon", "the evening", "December"]},
        {"prep": "on", "items": ["Mondays", "Sunday morning", "my birthday", "weekdays"]}
    ]
}

# --- 2. GENERADORES DE EJERCICIOS AVANZADOS ---

def gen_conjugation_logic(idx):
    """
    (QUIZ) Reglas de 3ra persona (s, es, ies, irregular).
    """
    subj = random.choice(DB["subjects"])
    verb = random.choice(DB["verbs"])
    
    correct = verb['3rd'] if subj['3rd'] else verb['base']
    
    # Generar distractores inteligentes
    if subj['3rd']:
        # Si es 3ra persona, distractores son: base, gerundio, o error tipo "haves"
        distractors = [verb['base'], f"{verb['base']}ing"]
        if verb['base'] == "have": distractors.append("haves")
        elif verb['base'] == "go": distractors.append("gos")
    else:
        # Si no es 3ra persona, distractores son: forma 3ra, gerundio
        distractors = [verb['3rd'], f"{verb['base']}ing"]

    # Completar opciones
    while len(distractors) < 3:
        distractors.append("to " + verb['base'])
    
    options = [correct] + distractors[:3]
    random.shuffle(options)
    
    return {
        "id": f"conj_{idx}",
        "type": "quiz_choice",
        "difficulty": "medium",
        "tags": ["grammar", "present_simple"],
        "question": f"Completa la rutina: '{subj['p']} ___ {verb['obj']} every day.'",
        "options": options,
        "correct_answer": correct,
        "explanation": f"Sujeto '{subj['p']}' {( 'es 3ra persona, requiere S/ES' if subj['3rd'] else 'no es 3ra persona, usa verbo base' )}."
    }

def gen_adverb_order_scramble(idx):
    """
    (ORDER) Orden de adverbios: Sujeto + Adverbio + Verbo.
    """
    subj = random.choice(DB["subjects"])
    verb = random.choice(DB["verbs"])
    adv = random.choice(DB["adverbs"])
    
    # Caso 1: Verbo de acción (Adverbio ANTES)
    # Ej: She always eats.
    v_form = verb['3rd'] if subj['3rd'] else verb['base']
    parts = [subj['p'], adv['word'], v_form, verb['obj']]
    scrambled = parts.copy()
    random.shuffle(scrambled)
    
    return {
        "id": f"ord_{idx}",
        "type": "order_sentence",
        "difficulty": "hard",
        "tags": ["syntax", "adverbs"],
        "question": f"Ordena la frase ({adv['pct']} frequency):",
        "parts": scrambled,
        "correct_order": parts,
        "explanation": "Regla: Sujeto + Adverbio de Frecuencia + Verbo de Acción."
    }

def gen_preposition_fill(idx):
    """
    (TYPE) Escribir At/In/On según contexto.
    """
    group = random.choice(DB["prepositions"])
    item = random.choice(group["items"])
    subj = random.choice(DB["subjects"])
    
    sentence = f"{subj['p']} sleeps ___ {item}."
    
    return {
        "id": f"prep_{idx}",
        "type": "fill_input",
        "difficulty": "medium",
        "tags": ["grammar", "prepositions"],
        "question": f"Escribe la preposición correcta (at/in/on): '{sentence}'",
        "correct_answers": [group["prep"]],
        "hint": f"Usamos esta preposición para '{item}'.",
        "explanation": f"Regla: {group['prep'].upper()} se usa con '{item}'."
    }

def gen_negative_transformation(idx):
    """
    (QUIZ) Transformar afirmativo a negativo (Don't vs Doesn't).
    """
    subj = random.choice(DB["subjects"])
    verb = random.choice(DB["verbs"])
    
    # Frase original: She plays
    v_form = verb['3rd'] if subj['3rd'] else verb['base']
    original = f"{subj['p']} {v_form} {verb['obj']}."
    
    # Correcto: She doesn't play
    aux_neg = "doesn't" if subj['3rd'] else "don't"
    correct = f"{subj['p']} {aux_neg} {verb['base']} {verb['obj']}."
    
    # Trampas
    wrong1 = f"{subj['p']} not {v_form} {verb['obj']}." # She not plays
    wrong2 = f"{subj['p']} {aux_neg} {v_form} {verb['obj']}." # She doesn't plays (ERROR COMÚN)
    wrong3 = f"{subj['p']} no {verb['base']} {verb['obj']}." # She no play
    
    options = [correct, wrong1, wrong2, wrong3]
    random.shuffle(options)
    
    return {
        "id": f"neg_{idx}",
        "type": "quiz_choice",
        "difficulty": "hard",
        "tags": ["grammar", "negation"],
        "question": f"Selecciona la forma NEGATIVA correcta de:\n'{original}'",
        "options": options,
        "correct_answer": correct,
        "explanation": f"Usamos '{aux_neg}' y el verbo vuelve a su forma BASE (sin S)."
    }

# --- 3. ENSAMBLAJE DE LECCIÓN (TITANIUM) ---

def build_lesson():
    lesson = {
        "id": "pro-a1-3",
        "version": "Titanium 2.0",
        "title": "Routine & Habits Mastery",
        "level": "A1",
        "tags": ["present_simple", "daily_life", "grammar"],
        "total_xp": 200,
        "stages": []
    }
    
    # ETAPA 1: CONCEPTOS (Lecture)
    lesson["stages"].append({
        "id": "stage_intro",
        "type": "lecture",
        "title": "The Daily Grind",
        "parts": [
            {
                "visual": "## The Super 'S' 🦸\n\nHe/She/It needs an **S**.\n\n* Work ➔ Works\n* Watch ➔ Watches\n* Study ➔ Studies\n* Have ➔ **Has** (Irregular!)",
                "audio": "Welcome. To talk about daily life, you need to master the third person. Remember the spelling rules. It's not always just adding an S. Watch out for 'Has'!",
                "animation": "teacher_pointing",
                "duration": 15
            },
            {
                "visual": "## Frequency 📊\n\n**Always** (100%)\n**Usually** (80%)\n**Sometimes** (50%)\n**Never** (0%)\n\nPosition: Before the verb!",
                "audio": "Where do you put 'always'? Before the action. I ALWAYS eat breakfast. I NEVER wake up late.",
                "animation": "explaining"
            }
        ]
    })
    
    # ETAPA 2: 3RD PERSON DRILL (Quiz)
    lesson["stages"].append({
        "id": "stage_conjugation",
        "type": "gamified_quiz",
        "title": "Conjugation Challenge",
        "description": "Elige la forma correcta del verbo.",
        "xp_reward": 100,
        "questions": [gen_conjugation_logic(i) for i in range(8)]
    })
    
    # ETAPA 3: NEGATION LOGIC (Transform)
    lesson["stages"].append({
        "id": "stage_negation",
        "type": "gamified_quiz",
        "title": "The Power of NO",
        "description": "Transforma oraciones a negativo correctamente.",
        "xp_reward": 150,
        "questions": [gen_negative_transformation(i) for i in range(8)]
    })
    
    # ETAPA 4: ADVERB SCRAMBLE (Order)
    lesson["stages"].append({
        "id": "stage_order",
        "type": "gamified_quiz",
        "title": "Frequency Architect",
        "description": "Ordena las palabras en la posición correcta.",
        "xp_reward": 150,
        "questions": [gen_adverb_order_scramble(i) for i in range(6)]
    })
    
    # ETAPA 5: PREPOSITION TYPING (Fill Input)
    lesson["stages"].append({
        "id": "stage_prep",
        "type": "gamified_quiz",
        "title": "Time Lords",
        "description": "Escribe AT, IN u ON.",
        "xp_reward": 150,
        "questions": [gen_preposition_fill(i) for i in range(8)]
    })
    
    # BOSS: ROUTINE CHAT
    lesson["stages"].append({
        "id": "stage_boss",
        "type": "practice_chat",
        "title": "The Interview",
        "scenario": "Estás en una entrevista de trabajo. El reclutador quiere saber si eres organizado.",
        "ai_system_prompt": "ROLE: Strict HR Manager. GOAL: Ask 'What time do you wake up?' and 'Do you work on weekends?'. Verify Prepositions and Present Simple.",
        "initial_message": "Have a seat. I need productive people. Tell me, what time do you usually wake up?",
        "success_criteria": ["uses_at_time", "uses_present_simple"]
    })
    
    return lesson

# --- EXEC ---
if __name__ == "__main__":
    data = build_lesson()
    out_path = "backend/app/data/lessons/pro-a1-3.json"
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"✅ LECCIÓN GENERADA: {out_path}")