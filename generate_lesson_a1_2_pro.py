import json
import random
import os
import uuid

# --- 1. BASE DE DATOS DE CONTEXTO EXPANDIDA ---

DB = {
    "subjects": [
        {"p": "I", "v_past": "was", "v_pres": "am", "v_fut": "will be", "en": "I", "es": "Yo"},
        {"p": "He", "v_past": "was", "v_pres": "is", "v_fut": "will be", "en": "my brother", "es": "Mi hermano"},
        {"p": "She", "v_past": "was", "v_pres": "is", "v_fut": "will be", "en": "Sarah", "es": "Sarah"},
        {"p": "It", "v_past": "was", "v_pres": "is", "v_fut": "will be", "en": "the building", "es": "El edificio"},
        {"p": "We", "v_past": "were", "v_pres": "are", "v_fut": "will be", "en": "we", "es": "Nosotros"},
        {"p": "They", "v_past": "were", "v_pres": "are", "v_fut": "will be", "en": "my parents", "es": "Mis padres"}
    ],
    "markers": {
        "past": ["In 1999", "Last century", "When I was a child", "A decade ago", "Yesterday"],
        "present": ["Currently", "Nowadays", "At this moment", "Today", "In reality"],
        "future": ["In the future", "By 2050", "Next year", "Someday", "When robots rule"]
    },
    "math_ops": ["plus", "minus", "times"]
}

# --- 2. GENERADORES DE EJERCICIOS AVANZADOS ---

def gen_timeline_logic(idx):
    """(NUEVO) Ordena cronológicamente."""
    subj = random.choice(DB["subjects"])
    age_base = random.randint(10, 30)
    
    events = [
        {"txt": f"In 2010, {subj['p'].lower()} {subj['v_past']} {age_base}.", "year": 2010},
        {"txt": f"Now, {subj['p'].lower()} {subj['v_pres']} {age_base + 13}.", "year": 2023},
        {"txt": f"In 2030, {subj['p'].lower()} {subj['v_fut']} {age_base + 20}.", "year": 2030}
    ]
    random.shuffle(events)
    
    return {
        "id": f"time_{idx}",
        "type": "order_sentence",
        "difficulty": "hard",
        "tags": ["logic", "tenses"],
        "question": "Ordena estos eventos del pasado al futuro:",
        "parts": [e["txt"] for e in events],
        "correct_order": sorted([e["txt"] for e in events], key=lambda x: [ev["year"] for ev in events if ev["txt"] == x][0]),
        "explanation": "El orden lógico es: Pasado (was) -> Presente (is) -> Futuro (will be)."
    }

def gen_age_error_correction(idx):
    """(CRÍTICO) Detecta el error común 'I have 20 years'."""
    subj = random.choice(DB["subjects"])
    age = random.randint(15, 60)
    
    # Generamos una frase incorrecta típica de hispanohablantes
    incorrect = f"{subj['p']} has {age} years old."
    if subj['p'] in ["I", "We", "They"]:
        incorrect = f"{subj['p']} have {age} years old."
        
    correct = f"{subj['p']} {subj['v_pres']} {age} years old."
    
    return {
        "id": f"err_{idx}",
        "type": "quiz_choice",
        "difficulty": "medium",
        "tags": ["common_errors", "grammar"],
        "question": f"¿Cuál es la forma CORRECTA de decir la edad?",
        "options": [incorrect, correct, f"{subj['p']} haves {age}."],
        "correct_answer": correct,
        "explanation": "En inglés NUNCA usamos 'have' para la edad. Usamos el verbo To Be (am/is/are)."
    }

def gen_tense_context_match(idx):
    """Rellenar huecos basado en el marcador temporal."""
    tense = random.choice(["past", "present", "future"])
    subj = random.choice(DB["subjects"])
    marker = random.choice(DB["markers"][tense])
    age = random.randint(5, 80)
    
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
        "id": f"ctx_{idx}",
        "type": "fill_input",
        "difficulty": "medium",
        "tags": ["grammar", "tenses"],
        "question": f"Completa según el contexto temporal: '{sentence}'",
        "correct_answers": [verb],
        "hint": f"Marcador de tiempo: {hint}",
        "explanation": f"'{marker}' nos indica que debemos usar {hint} ({verb})."
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
    
    return {
        "id": f"math_{idx}",
        "type": "quiz_choice",
        "difficulty": "easy",
        "tags": ["vocabulary", "logic"],
        "question": f"Completa la operación: '{sentence}'",
        "options": ["is", "are", "am", "be"],
        "correct_answer": "is",
        "explanation": "El resultado de una operación matemática se trata como singular (is/equals)."
    }

# --- 3. ENSAMBLAJE DE LECCIÓN (TITANIUM STRUCTURE) ---

def build_lesson():
    lesson = {
        "id": "pro-a1-2",
        "version": "Titanium 2.0",
        "title": "Time Mastery: Ages & Eras",
        "level": "A1+",
        "tags": ["tenses", "grammar", "foundations"],
        "stages": []
    }
    
    # ETAPA 1: CONCEPTOS (Lecture)
    lesson["stages"].append({
        "id": "stage_intro",
        "type": "lecture",
        "title": "The Timeline",
        "parts": [
            {
                "visual": "## The Golden Rule 🌟\n\n**Have** = Posesión (I have a car).\n**Be** = Edad/Estado (I am 20).\n\nNever mix them!",
                "audio": "Welcome back. Today we fix the most common mistake. In English, you do not 'have' years. You ARE your years. Let's master the timeline.",
                "animation": "teacher_pointing",
                "duration": 12
            }
        ]
    })
    
    # ETAPA 2: AGE ERROR CORRECTION (Drill específico)
    lesson["stages"].append({
        "id": "stage_drill_age",
        "type": "gamified_quiz",
        "title": "The 'Have' Trap",
        "description": "Evita el error más común del inglés.",
        "xp_reward": 100,
        "questions": [gen_age_error_correction(i) for i in range(10)]
    })
    
    # ETAPA 3: CONTEXT MATCHING (Fill Input)
    lesson["stages"].append({
        "id": "stage_context",
        "type": "gamified_quiz",
        "title": "Chrono-Logic",
        "description": "Deduce el tiempo gramatical por el contexto.",
        "xp_reward": 150,
        "questions": [gen_tense_context_match(i) for i in range(10)]
    })
    
    # ETAPA 4: LOGIC & MATH
    lesson["stages"].append({
        "id": "stage_math",
        "type": "gamified_quiz",
        "title": "Math & Logic",
        "questions": [gen_math_logic(i) for i in range(5)]
    })
    
    # ETAPA 5: TIMELINE SORTING (Advanced)
    lesson["stages"].append({
        "id": "stage_sort",
        "type": "gamified_quiz",
        "title": "Timeline Architect",
        "description": "Ordena los eventos cronológicamente.",
        "xp_reward": 200,
        "questions": [gen_timeline_logic(i) for i in range(5)]
    })
    
    # BOSS: TIME TRAVELER CHAT
    lesson["stages"].append({
        "id": "stage_boss",
        "type": "practice_chat",
        "title": "The Time Traveler",
        "scenario": "Estás en el año 3000. Explícale a un robot cuántos años tenías en el pasado y cuántos tendrás en el futuro.",
        "ai_system_prompt": "ROLE: Future Robot. GOAL: Ask user 'How old were you in 2020?' and 'How old will you be in 2050?'. Correct usage of 'was/will be'.",
        "initial_message": "Bleep Blop. I am Unit 734. Accessing history files... How old were you in the year 2020?",
        "success_criteria": ["uses_was_correctly", "uses_will_be_correctly"]
    })
    
    return lesson

# --- EXEC ---
if __name__ == "__main__":
    data = build_lesson()
    out_path = "backend/app/data/lessons/pro-a1-2.json"
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"✅ LECCIÓN GENERADA: {out_path}")