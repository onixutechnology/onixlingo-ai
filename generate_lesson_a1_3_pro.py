import json
import random
import os

# --- BASE DE DATOS LINGÜÍSTICA ---
subjects = [
    {"p": "I", "3rd": False, "aux": "do", "neg": "don't", "poss": "my"},
    {"p": "You", "3rd": False, "aux": "do", "neg": "don't", "poss": "your"},
    {"p": "He", "3rd": True, "aux": "does", "neg": "doesn't", "poss": "his"},
    {"p": "She", "3rd": True, "aux": "does", "neg": "doesn't", "poss": "her"},
    {"p": "We", "3rd": False, "aux": "do", "neg": "don't", "poss": "our"},
    {"p": "They", "3rd": False, "aux": "do", "neg": "don't", "poss": "their"},
    {"p": "My brother", "3rd": True, "aux": "does", "neg": "doesn't", "poss": "his"},
    {"p": "The students", "3rd": False, "aux": "do", "neg": "don't", "poss": "their"}
]

verbs = [
    {"base": "wake up", "3rd": "wakes up", "gerund": "waking up"},
    {"base": "have breakfast", "3rd": "has breakfast", "gerund": "having breakfast"},
    {"base": "brush teeth", "3rd": "brushes teeth", "gerund": "brushing teeth"},
    {"base": "go to work", "3rd": "goes to work", "gerund": "going to work"},
    {"base": "watch TV", "3rd": "watches TV", "gerund": "watching TV"},
    {"base": "study English", "3rd": "studies English", "gerund": "studying English"},
    {"base": "take a shower", "3rd": "takes a shower", "gerund": "taking a shower"}
]

adverbs = ["always", "usually", "often", "sometimes", "never", "rarely"]
contexts = ["Believe it or not,", "Generally,", "On typical days,", "Actually,", "To be honest,"]

# --- GENERADORES DE EJERCICIOS ---

def gen_third_person_habit(idx):
    subj = random.choice(subjects)
    verb = random.choice(verbs)
    ctx = random.choice(contexts)
    sentence = f"{ctx} {subj['p']} ___ {verb['base'].split(' ', 1)[1] if ' ' in verb['base'] else ''} every day."
    correct_verb = verb['3rd'].split(' ')[0] if subj['3rd'] else verb['base'].split(' ')[0]
    wrong1 = verb['base'].split(' ')[0] if subj['3rd'] else verb['3rd'].split(' ')[0]
    wrong2 = verb['gerund'].split(' ')[0]
    options = [correct_verb, wrong1, wrong2]
    random.shuffle(options)
    
    explanation = "3ra persona (He/She/It) necesita 'S'." if subj['3rd'] else "I/You/We/They usan el verbo base."

    return {
        "id": f"q_habit_{idx}",
        "type": "quiz_choice",
        "question": f"Rutina: '{sentence}'",
        "options": options,
        "correct_answer": correct_verb,
        "explanation": explanation
    }

def gen_adverb_placement(idx):
    subj = random.choice(subjects)
    verb = random.choice(verbs)
    adv = random.choice(adverbs)
    v_form = verb['3rd'] if subj['3rd'] else verb['base']
    correct = f"{adv} {v_form}"
    wrong1 = f"{v_form} {adv}"
    wrong2 = f"{adv} {verb['gerund']}"
    sentence = f"{subj['p']} ___ late."
    options = [correct, wrong1, wrong2]
    random.shuffle(options)
    return {
        "id": f"q_adv_{idx}",
        "type": "quiz_choice",
        "question": f"Ordena: '{sentence}'",
        "options": options,
        "correct_answer": correct,
        "explanation": "El adverbio (always, never) va ANTES del verbo."
    }

def gen_negative_question(idx):
    subj = random.choice(subjects)
    verb = random.choice(verbs)
    is_question = random.choice([True, False])
    if is_question:
        sentence = f"___ {subj['p'].lower()} {verb['base']} early?"
        correct = subj['aux'].capitalize()
        wrong = "Do" if correct == "Does" else "Does"
        options = [correct, wrong, "Is", "Are"]
        expl = f"Auxiliar para preguntas: '{correct}'."
    else:
        sentence = f"No, {subj['p']} ___ {verb['base']} early."
        correct = subj['neg']
        wrong = "don't" if correct == "doesn't" else "doesn't"
        options = [correct, wrong, "isn't", "not"]
        expl = f"Negación correcta: '{correct}'."
    random.shuffle(options)
    return {
        "id": f"q_aux_{idx}",
        "type": "quiz_choice",
        "question": f"Completa: '{sentence}'",
        "options": options,
        "correct_answer": correct,
        "explanation": expl
    }

def gen_time_prepositions(idx):
    scenarios = [
        {"text": "7:00 AM", "prep": "at"}, {"text": "noon", "prep": "at"},
        {"text": "night", "prep": "at"}, {"text": "the morning", "prep": "in"},
        {"text": "the afternoon", "prep": "in"}, {"text": "Mondays", "prep": "on"},
        {"text": "weekends", "prep": "on"}
    ]
    scene = random.choice(scenarios)
    subj = random.choice(subjects)
    verb = random.choice(verbs)
    v_form = verb['3rd'] if subj['3rd'] else verb['base']
    sentence = f"{subj['p']} {v_form} ___ {scene['text']}."
    options = ["at", "in", "on"]
    return {
        "id": f"q_prep_{idx}",
        "type": "quiz_choice",
        "question": f"Preposición: '{sentence}'",
        "options": options,
        "correct_answer": scene['prep'],
        "explanation": f"Con '{scene['text']}' usamos '{scene['prep']}'."
    }

def gen_error_finding_pro(idx):
    subj = random.choice(subjects)
    error_type = random.randint(1, 3)
    if error_type == 1: 
        wrong_verb = "have" if subj['3rd'] else "has"
        text = f"{subj['p']} {wrong_verb} breakfast at 8."
        ans = wrong_verb
        expl = f"Verbo incorrecto para '{subj['p']}'."
    elif error_type == 2:
        wrong_aux = "don't" if subj['3rd'] else "doesn't"
        text = f"{subj['p']} {wrong_aux} like coffee."
        ans = wrong_aux
        expl = f"Auxiliar incorrecto."
    else:
        text = f"I shower at the morning."
        ans = "at"
        expl = "Decimos 'IN the morning'."
    return {
        "id": f"q_err_{idx}",
        "type": "quiz_choice",
        "question": f"Encuentra el error: '{text}'",
        "options": [f"Error: {ans}", "No hay error", "Error: breakfast"],
        "correct_answer": f"Error: {ans}",
        "explanation": expl
    }

# --- ENSAMBLAJE DE LA LECCIÓN (LECTURE MODE) ---

lesson = {
    "id": "a1-3",
    "title": "Daily Routine & Habits 📅",
    "level": "A1",
    "description": "Aprende a hablar de tu día a día con tu Tutor Virtual.",
    "stages": []
}

# --- INTRODUCCIÓN ---
lesson["stages"].append({
    "type": "lecture",
    "title": "Bienvenido a la Rutina",
    "parts": [
        {
            "visual": "## My Day, Your Day\nVamos a aprender a describir lo que hacemos todos los días.\n\n* **I wake up**\n* **She wakes up**",
            "audio": "Hello! Ready to talk about your life? Today we will learn to describe our daily routine. It is very useful for conversations. But watch out for the third person!",
            "animation": "happy"
        }
    ]
})

# 1. HÁBITOS (20)
lesson["stages"].append({
    "type": "lecture",
    "title": "Módulo 1: La Regla de Oro",
    "parts": [{
        "visual": "## La 'S' Superpoderosa 🦸\n\nSi hablas de **He, She, It**, el verbo necesita una **S**.\n\n* I eat.\n* She eat**s**.\n* He sleep**s**.",
        "audio": "This is the Golden Rule of English. If you talk about 'He', 'She', or 'It', you must add an 'S' to the verb. She eats, He runs. Never forget the S!",
        "animation": "teacher_pointing"
    }]
})
lesson["stages"].append({"type": "quiz", "questions": [gen_third_person_habit(i) for i in range(20)]})

# 2. ADVERBIOS (20)
lesson["stages"].append({
    "type": "lecture",
    "title": "Módulo 2: Frecuencia",
    "parts": [{
        "visual": "## ¿Siempre o Nunca? 📊\n\nEl orden es clave:\n\n✅ Sujeto + **Always** + Verbo\n❌ I go **always**...",
        "audio": "How often do you study? Always? Never? The frequency adverb goes BEFORE the action verb. I always study. I never sleep late.",
        "animation": "talking"
    }]
})
lesson["stages"].append({"type": "quiz", "questions": [gen_adverb_placement(i) for i in range(20)]})

# 3. DO / DOES (20)
lesson["stages"].append({
    "type": "lecture",
    "title": "Módulo 3: Auxiliares",
    "parts": [{
        "visual": "## Do vs Does 🛠️\n\nPara preguntar y negar:\n\n* **I/You/We/They** ➔ **Do / Don't**\n* **He/She/It** ➔ **Does / Doesn't**",
        "audio": "We need helpers to ask questions. 'Do' is for I, You, We, They. 'Does' is for the special third person. Do you understand? Does she understand?",
        "animation": "curious"
    }]
})
lesson["stages"].append({"type": "quiz", "questions": [gen_negative_question(i) for i in range(20)]})

# 4. PREPOSICIONES (20)
lesson["stages"].append({
    "type": "lecture",
    "title": "Módulo 4: El Reloj",
    "parts": [{
        "visual": "## Preposiciones de Tiempo ⏰\n\n* **AT** 7:00 / night\n* **IN** the morning\n* **ON** Mondays",
        "audio": "Time is tricky. We say AT seven o'clock, but IN the morning. And for days of the week, always use ON. On Monday, on Sunday.",
        "animation": "talking"
    }]
})
lesson["stages"].append({"type": "quiz", "questions": [gen_time_prepositions(i) for i in range(20)]})

# 5. ERRORES COMUNES (20)
lesson["stages"].append({
    "type": "lecture",
    "title": "Módulo 5: Auditoría",
    "parts": [{
        "visual": "## Detective de Errores 🕵️\n\nEncuentra los fallos típicos.\n\n* She have... ❌\n* She has... ✅",
        "audio": "Now, become a detective. Find the mistakes in these sentences. Pay attention to the S and the auxiliaries.",
        "animation": "curious"
    }]
})
lesson["stages"].append({"type": "quiz", "questions": [gen_error_finding_pro(i) for i in range(20)]})

# CHAT FINAL
lesson["stages"].append({
    "type": "practice_chat",
    "scenario": "Un amigo curioso quiere saber tu rutina diaria.",
    "ai_system_prompt": "ROLE: Curious Friend 'Alex'. GOAL: Ask user about routine. Check 3rd person S and Do/Does."
})

# GUARDAR
output_path = "backend/app/data/lessons/a1-3.json"
os.makedirs(os.path.dirname(output_path), exist_ok=True)
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(lesson, f, indent=2, ensure_ascii=False)

print(f"✅ LECCIÓN A1-3 (LECTURE MODE) GENERADA: {output_path}")