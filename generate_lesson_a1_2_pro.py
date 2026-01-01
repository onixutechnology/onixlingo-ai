import json
import random
import os

# --- BASE DE DATOS DE CONTEXTO ---
time_markers_past = ["Last year", "In 1999", "When I was a child", "A decade ago", "Yesterday"]
time_markers_future = ["Next month", "In two years", "When she grows up", "By 2030", "Tomorrow"]
time_markers_present = ["Currently", "Nowadays", "At this moment", "Today", "Right now"]

subjects = [
    {"en": "my younger brother", "pronoun": "he", "be_past": "was", "be_pres": "is", "be_fut": "will be"},
    {"en": "my parents", "pronoun": "they", "be_past": "were", "be_pres": "are", "be_fut": "will be"},
    {"en": "the old building", "pronoun": "it", "be_past": "was", "be_pres": "is", "be_fut": "will be"},
    {"en": "I", "pronoun": "I", "be_past": "was", "be_pres": "am", "be_fut": "will be"},
    {"en": "we", "pronoun": "we", "be_past": "were", "be_pres": "are", "be_fut": "will be"}
]

# --- GENERADORES DE EJERCICIOS ---

def gen_past_tense(idx):
    """Pasado: Contexto de edad/números"""
    subj = random.choice(subjects)
    marker = random.choice(time_markers_past)
    age = random.randint(5, 90)
    sentence_base = f"{marker}, {subj['en']} ___ {age} years old."
    correct = subj['be_past']
    options = [correct, subj['be_pres'], "had", "did"]
    random.shuffle(options)
    
    return {
        "id": f"q_past_{idx}",
        "type": "quiz_choice",
        "question": f"Historia pasada: '{sentence_base}'",
        "options": options,
        "correct_answer": correct,
        "explanation": f"El marcador '{marker}' indica pasado. Usamos '{correct}'."
    }

def gen_present_tense(idx):
    """Presente: Regla de 'To Be' vs 'Have'"""
    subj = random.choice(subjects)
    marker = random.choice(time_markers_present)
    age = random.randint(1, 99)
    sentence_base = f"{marker}, it is a fact that {subj['en']} ___ {age}."
    correct = subj['be_pres']
    options = [correct, "has", "have", "is having"]
    random.shuffle(options)
    
    return {
        "id": f"q_pres_{idx}",
        "type": "quiz_choice",
        "question": f"Hecho actual: '{sentence_base}'",
        "options": options,
        "correct_answer": correct,
        "explanation": f"Para la edad usamos '{correct}', nunca 'have/has'."
    }

def gen_future_tense(idx):
    """Futuro: Predicciones"""
    subj = random.choice(subjects)
    marker = random.choice(time_markers_future)
    age = random.randint(18, 100)
    sentence_base = f"{marker}, I believe {subj['en']} ___ {age} years old."
    correct = "will be"
    options = ["will be", "is going to have", "will has", "are"]
    random.shuffle(options)
    
    return {
        "id": f"q_fut_{idx}",
        "type": "quiz_choice",
        "question": f"Predicción: '{sentence_base}'",
        "options": options,
        "correct_answer": correct,
        "explanation": f"Edad futura siempre es 'will be'."
    }

def gen_negative_complex(idx):
    """Negaciones Lógicas"""
    subj = random.choice(subjects)
    tense = random.choice(["past", "present"])
    
    if tense == "past":
        verb = "was not" if subj['be_past'] == "was" else "were not"
        distractor = "didn't be"
        context = "back then"
    else:
        verb = "is not" if subj['be_pres'] == "is" else ("am not" if subj['be_pres'] == "am" else "are not")
        distractor = "no is"
        context = "right now"
        
    sentence = f"Even though it looks new, {subj['en']} ___ {random.randint(10,50)} years old {context}."
    options = [verb, distractor, "not has", "don't have"]
    random.shuffle(options)
    
    return {
        "id": f"q_neg_{idx}",
        "type": "quiz_choice",
        "question": f"Niega la frase: '{sentence}'",
        "options": options,
        "correct_answer": verb,
        "explanation": f"La negación correcta es '{verb}'."
    }

def gen_positive_complex(idx):
    """Matemáticas y Lógica"""
    num1 = random.randint(100, 900)
    num2 = random.randint(10, 99)
    total = num1 + num2
    sentence = f"If you calculate carefully, {num1} plus {num2} ___ exactly {total}."
    correct = "equals"
    options = ["equals", "equal", "is equal to", "are"]
    random.shuffle(options)
    
    return {
        "id": f"q_pos_{idx}",
        "type": "quiz_choice",
        "question": f"Matemáticas: '{sentence}'",
        "options": options,
        "correct_answer": correct,
        "explanation": "En operaciones matemáticas usamos singular ('equals' o 'is')."
    }

# --- ENSAMBLAJE DE LA LECCIÓN (MODE LECTURE) ---
lesson = {
    "id": "a1-2",
    "title": "Advanced Ages & Timelines ⏳",
    "level": "A1+",
    "description": "Domina el tiempo: Pasado, Presente y Futuro con tu Tutor IA.",
    "stages": []
}

# --- INTRO ---
lesson["stages"].append({
    "type": "lecture",
    "title": "Time Traveler 🚀",
    "parts": [
        {
            "visual": "## Cronología del Verbo\nVamos a aprender a movernos en el tiempo.\n\n* **Past:** Was / Were\n* **Present:** Am / Is / Are\n* **Future:** Will be",
            "audio": "Hello time traveler! Today we are going to master the timelines. It is not just about numbers, it is about when things happen. Past, Present, and Future.",
            "animation": "happy"
        }
    ]
})

# 1. PASADO (20)
lesson["stages"].append({
    "type": "lecture",
    "title": "Módulo 1: El Pasado",
    "parts": [{
        "visual": "## Memorias (Past Tense)\n\n* I/He/She/It ➔ **WAS**\n* We/You/They ➔ **WERE**\n\n❌ I were happy.\n✅ I **was** happy.",
        "audio": "Let's go back in time. Remember: Singular uses WAS. Plural uses WERE. It is that simple. Don't say 'I were', please.",
        "animation": "teacher_pointing"
    }]
})
lesson["stages"].append({"type": "quiz", "questions": [gen_past_tense(i) for i in range(20)]})

# 2. PRESENTE (20)
lesson["stages"].append({
    "type": "lecture",
    "title": "Módulo 2: El Presente",
    "parts": [{
        "visual": "## La Regla de Oro ✨\n\nNunca digas 'I have 20 years'.\n\nEn inglés, tú **ERES** tu edad.\n✅ I **am** 20.",
        "audio": "Back to the present. Listen carefully: Never use 'Have' for age. In English, you ARE your age. I am twenty, she is thirty.",
        "animation": "talking"
    }]
})
lesson["stages"].append({"type": "quiz", "questions": [gen_present_tense(i) for i in range(20)]})

# 3. FUTURO (20)
lesson["stages"].append({
    "type": "lecture",
    "title": "Módulo 3: El Futuro",
    "parts": [{
        "visual": "## Predicciones 🔮\n\nEl futuro es fácil. Para todos es igual:\n\n👉 **Will be**\n\n* Next year, I **will be** older.",
        "audio": "Now, let's look at the crystal ball. The future is very easy. It is always 'will be' for everyone. I will be, you will be, everybody will be.",
        "animation": "curious"
    }]
})
lesson["stages"].append({"type": "quiz", "questions": [gen_future_tense(i) for i in range(20)]})

# 4. NEGATIVO (20)
lesson["stages"].append({
    "type": "lecture",
    "title": "Módulo 4: Negaciones",
    "parts": [{
        "visual": "## Diciendo NO ⛔\n\nSolo agrega **NOT** después del verbo.\n\n* I was **not** ready.\n* It will **not** be easy.",
        "audio": "To deny facts in any timeline, just add the word NOT after the verb. Simple logic.",
        "animation": "talking"
    }]
})
lesson["stages"].append({"type": "quiz", "questions": [gen_negative_complex(i) for i in range(20)]})

# 5. POSITIVO/COMPLEJO (20)
lesson["stages"].append({
    "type": "lecture",
    "title": "Módulo 5: Desafío Final",
    "parts": [{
        "visual": "## Matemáticas y Lógica 🧠\n\n* 10 plus 10 **is** 20.\n* 5 and 5 **equals** 10.\n\n¡Concéntrate!",
        "audio": "Final challenge. Let's mix everything with some math. Stay focused and analyze the context.",
        "animation": "happy"
    }]
})
lesson["stages"].append({"type": "quiz", "questions": [gen_positive_complex(i) for i in range(20)]})

# CHAT FINAL
lesson["stages"].append({
    "type": "practice_chat",
    "scenario": "Eres un viajero del tiempo. Habla con la IA sobre tus distintas edades.",
    "ai_system_prompt": "ROLE: Time Traveler Assistant. GOAL: Ask user about ages in 1990, 2020, and 2050. Check 'was/is/will be'."
})

# GUARDAR
output_path = "backend/app/data/lessons/a1-2.json"
os.makedirs(os.path.dirname(output_path), exist_ok=True)
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(lesson, f, indent=2, ensure_ascii=False)

print(f"✅ LECCIÓN A1-2 (LECTURE MODE) GENERADA: {output_path}")