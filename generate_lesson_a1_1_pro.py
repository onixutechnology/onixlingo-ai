import json
import random
import os

# --- BASE DE DATOS DE CONTEXTO ---
contexts = [
    "Even though it's late,", "Despite the rain,", "Honestly,", "In my opinion,",
    "Generally speaking,", "At this moment,", "Unfortunately,", "Luckily,"
]

subjects = [
    {"pronoun": "I", "verb": "am", "contract": "I'm", "neg": "am not", "neg_contract": "I'm not", "en": "I"},
    {"pronoun": "My best friend", "verb": "is", "contract": "He's", "neg": "is not", "neg_contract": "isn't", "en": "he"},
    {"pronoun": "Sarah and I", "verb": "are", "contract": "We're", "neg": "are not", "neg_contract": "aren't", "en": "we"},
    {"pronoun": "The new students", "verb": "are", "contract": "They're", "neg": "are not", "neg_contract": "aren't", "en": "they"},
    {"pronoun": "This situation", "verb": "is", "contract": "It's", "neg": "is not", "neg_contract": "isn't", "en": "it"}
]

adjectives_complex = [
    "absolutely exhausted", "incredibly intelligent", "somewhat confused", 
    "really excited about the trip", "not ready for the exam", "a bit hungry"
]

# --- GENERADORES DE EJERCICIOS (Mecánica Pro) ---

def gen_affirmative_complex(idx):
    subj = random.choice(subjects)
    ctx = random.choice(contexts)
    adj = random.choice(adjectives_complex)
    sentence = f"{ctx} {subj['pronoun']} ___ {adj}."
    correct = subj['verb']
    options = ["am", "is", "are", "be"]
    final_options = list(set([correct] + random.sample(options, 3)))[:3] 
    random.shuffle(final_options)
    return {
        "id": f"q_aff_{idx}",
        "type": "quiz_choice",
        "question": f"Completa: '{sentence}'",
        "options": final_options,
        "correct_answer": correct,
        "explanation": f"El sujeto '{subj['pronoun']}' requiere el verbo '{correct}'."
    }

def gen_negative_complex(idx):
    subj = random.choice(subjects)
    ctx = random.choice(contexts)
    adj = random.choice(adjectives_complex)
    use_contraction = random.choice([True, False])
    if use_contraction:
        sentence = f"{ctx} {subj['pronoun']} ___ {adj}."
        correct = subj['neg_contract']
        distractor = "amn't" if subj['verb'] == "am" else ("aren't" if subj['verb'] == "is" else "isn't")
    else:
        sentence = f"{ctx} {subj['pronoun']} ___ {adj}."
        correct = subj['neg']
        distractor = "not is"
    options = [correct, distractor, "not be", "no are"]
    random.shuffle(options)
    return {
        "id": f"q_neg_{idx}",
        "type": "quiz_choice",
        "question": f"Niega: '{sentence}'",
        "options": options,
        "correct_answer": correct,
        "explanation": f"Negativo correcto: '{correct}'."
    }

def gen_question_complex(idx):
    subj = random.choice(subjects)
    adj = random.choice(adjectives_complex)
    wh_word = random.choice(["Why", "Where", "How", ""])
    prefix = f"{wh_word} " if wh_word else ""
    sentence = f"{prefix}___ {subj['pronoun'].lower()} {adj}?"
    correct = subj['verb'].capitalize() if not wh_word else subj['verb']
    options = ["Am", "Is", "Are"] if not wh_word else ["am", "is", "are"]
    random.shuffle(options)
    return {
        "id": f"q_ques_{idx}",
        "type": "quiz_choice",
        "question": f"Pregunta: '{sentence}'",
        "options": options,
        "correct_answer": correct,
        "explanation": "En preguntas, el verbo To Be va antes del sujeto."
    }

def gen_contraction_mastery(idx):
    subj = random.choice(subjects)
    if " " in subj['pronoun']: subj = subjects[0]
    sentence = f"If you ask me, {subj['pronoun']} ___ the best candidate."
    correct = subj['contract']
    options = [correct, f"{subj['pronoun']}'s", f"{subj['pronoun']}re"]
    random.shuffle(options)
    return {
        "id": f"q_cont_{idx}",
        "type": "quiz_choice",
        "question": f"Contracción: '{sentence}'",
        "options": options,
        "correct_answer": correct,
        "explanation": f"Contracción nativa: {correct}."
    }

def gen_error_hunt_pro(idx):
    subj = random.choice(subjects)
    wrong_verb = "is" if subj['verb'] == "are" else "are"
    if subj['pronoun'] == "I": wrong_verb = "are"
    text = f"Hello! My name is John. {subj['pronoun']} {wrong_verb} very happy to be here."
    return {
        "id": f"q_err_{idx}",
        "type": "quiz_choice",
        "question": f"Encuentra el error: \n\n*\"{text}\"*",
        "options": [f"Error: {wrong_verb}", "Error: John", "No hay error"],
        "correct_answer": f"Error: {wrong_verb}",
        "explanation": f"Sujeto y verbo no coinciden."
    }

# --- ENSAMBLAJE DE LA LECCIÓN (CON AVATAR LECTURE) ---

lesson = {
    "id": "a1-1",
    "title": "Mastery: To Be & Introductions",
    "level": "A1",
    "description": "Curso completo con Tutor Virtual.",
    "stages": []
}

# --- INTRODUCCIÓN PROFUNDA (Lecture Mode) ---
lesson["stages"].append({
    "type": "lecture",
    "title": "Bienvenida al Nivel A1",
    "parts": [
        {
            "visual": "## The Engine of English 🚀\nEl verbo **To Be** (Ser/Estar) es el motor del idioma.\n\nSin él, no podemos decir quiénes somos ni cómo estamos.",
            "audio": "Hello friend! Welcome to your first step. I am your AI Tutor. Today we are going to master the most important verb in the English language: To Be. It is the engine of everything. Without it, you cannot say who you are, or how you feel.",
            "animation": "talking"
        },
        {
            "visual": "## La Estructura\n\n* **I am** (Yo soy)\n* **You are** (Tú eres)\n* **She is** (Ella es)",
            "audio": "It looks simple, but be careful. Remember: 'I' always goes with 'am'. 'He', 'She', and 'It' use 'is'. And for everyone else, we use 'are'. Let's practice this logic now.",
            "animation": "teacher_pointing"
        }
    ]
})

# 1. AFIRMATIVO (20)
lesson["stages"].append({
    "type": "lecture",
    "title": "Módulo 1: Afirmaciones",
    "parts": [{
        "visual": "## Contexto Real\nYa no somos robots.\n\n❌ I am happy.\n✅ **Honestly, I am happy.**",
        "audio": "Let's stop talking like robots. In real life, we use connectors. Pay attention to the context in the following exercises.",
        "animation": "happy"
    }]
})
lesson["stages"].append({"type": "quiz", "questions": [gen_affirmative_complex(i) for i in range(20)]})

# 2. NEGATIVO (20)
lesson["stages"].append({
    "type": "lecture",
    "title": "Módulo 2: Negaciones",
    "parts": [{
        "visual": "## El Poder del NO\n\nEl **NOT** siempre va después del verbo.\n\n* She **is not** ready.",
        "audio": "Now, let's learn to say NO. It is easy. Just put the word 'not' immediately after the verb. She is NOT ready.",
        "animation": "talking"
    }]
})
lesson["stages"].append({"type": "quiz", "questions": [gen_negative_complex(i) for i in range(20)]})

# 3. PREGUNTAS (20)
lesson["stages"].append({
    "type": "lecture",
    "title": "Módulo 3: Preguntas",
    "parts": [{
        "visual": "## Modo Detective 🕵️\n\nInvierte el orden:\n\n* You are happy -> **Are you** happy?",
        "audio": "To ask questions, we flip the order. The verb jumps to the front. Imagine you are a detective.",
        "animation": "curious"
    }]
})
lesson["stages"].append({"type": "quiz", "questions": [gen_question_complex(i) for i in range(20)]})

# 4. CONTRACCIONES (20)
lesson["stages"].append({
    "type": "lecture",
    "title": "Módulo 4: Fluidez",
    "parts": [{
        "visual": "## Contracciones 🇺🇸\n\n* You are -> **You're**\n* It is -> **It's**",
        "audio": "Native speakers love contractions. They make you sound faster and more natural. Let's practice them.",
        "animation": "talking"
    }]
})
lesson["stages"].append({"type": "quiz", "questions": [gen_contraction_mastery(i) for i in range(20)]})

# 5. CAZADOR DE ERRORES (20)
lesson["stages"].append({"type": "quiz", "questions": [gen_error_hunt_pro(i) for i in range(20)]})

# FINAL BOSS
lesson["stages"].append({
    "type": "practice_chat",
    "scenario": "Entrevista en Google.",
    "ai_system_prompt": "ROLE: Google Recruiter. GOAL: Assess basic 'To Be' usage."
})

# GUARDAR
output_path = "backend/app/data/lessons/a1-1.json"
os.makedirs(os.path.dirname(output_path), exist_ok=True)
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(lesson, f, indent=2, ensure_ascii=False)

print(f"✅ LECCIÓN A1-1 (LECTURE MODE) GENERADA: {output_path}")