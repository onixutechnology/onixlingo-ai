import os
import sys
import json
import random

# Ensure backend imports work
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from app.services.curriculum_factory import CATALOG

# ----------------------------------------------------------------------
# Dictionaries for procedural generation to ensure variety
# ----------------------------------------------------------------------

SUBJECTS = {
    "A1": ["The manager", "Our team", "I", "He", "She", "The company", "My boss", "The client"],
    "A2": ["The project leader", "The entire department", "A new employee", "Our main competitor", "The CEO", "The investor"],
    "B1": ["The executive board", "The regional director", "A majority of shareholders", "The auditing firm", "Our legal counsel"],
    "B2": ["The strategic committee", "The corporate headquarters", "International stakeholders", "The financial regulator"],
    "C1": ["The overarching governing body", "A consortium of investors", "The compliance oversight team", "Pioneering industry leaders"],
    "C2": ["The global conglomerate", "Activist shareholders", "The macroeconomic forecasting unit", "Multinational regulators"]
}

VERBS = {
    "A1": ["is", "works", "needs", "wants", "has", "makes", "does", "calls"],
    "A2": ["manages", "organizes", "reviews", "develops", "improves", "discusses"],
    "B1": ["evaluates", "implements", "coordinates", "facilitates", "negotiates"],
    "B2": ["optimizes", "streamlines", "leverages", "spearheads", "allocates"],
    "C1": ["mitigates", "consolidates", "orchestrates", "pioneers", "oversees"],
    "C2": ["revolutionizes", "reconceptualizes", "synergizes", "catalyzes"]
}

OBJECTS = {
    "A1": ["the report", "a meeting", "the email", "some help", "a new desk", "the files"],
    "A2": ["the monthly budget", "the new strategy", "the client presentation", "the sales figures"],
    "B1": ["the financial performance", "the supply chain logistics", "the marketing campaign", "the corporate merger"],
    "B2": ["the cross-functional workflow", "the geopolitical risks", "the stakeholder engagement matrix"],
    "C1": ["the macroeconomic volatility", "the disruptive innovation paradigms", "the regulatory compliance framework"],
    "C2": ["the synergistic paradigm shifts", "the quantum leap in algorithmic trading", "the holistic governance structure"]
}

ADVERBS = ["quickly", "efficiently", "carefully", "successfully", "proactively", "strategically", "consistently"]

TRANSLATIONS_ES = {
    "good": "bueno", "company": "empresa", "report": "reporte", "meeting": "reunión", "email": "correo",
    "budget": "presupuesto", "strategy": "estrategia", "client": "cliente", "manager": "gerente",
    "team": "equipo", "project": "proyecto", "financial": "financiero", "risk": "riesgo", "market": "mercado",
    "sales": "ventas", "revenue": "ingresos", "profit": "ganancia", "loss": "pérdida", "investment": "inversión",
    "growth": "crecimiento", "data": "datos", "analysis": "análisis", "goal": "meta", "objective": "objetivo",
    "performance": "rendimiento", "quality": "calidad", "service": "servicio", "product": "producto"
}

def generate_random_sentence(level, vocab):
    lvl = level if level in SUBJECTS else "B1"
    sub = random.choice(SUBJECTS[lvl])
    verb = random.choice(VERBS[lvl])
    obj = random.choice(OBJECTS[lvl])
    adv = random.choice(ADVERBS)
    
    structures = [
        f"{sub} {verb} {obj} very {adv} regarding the {vocab}.",
        f"Because of the {vocab}, {sub} {verb} {obj}.",
        f"The {vocab} is why {sub} {verb} {obj}.",
        f"We noticed that {sub} {verb} {obj} to improve the {vocab}.",
        f"Regarding the {vocab}, {sub} {verb} {obj} {adv}."
    ]
    return random.choice(structures)

def generate_distractors(correct_answer):
    # Generates realistic-looking wrong grammatical choices
    base_words = correct_answer.split()
    distractors = []
    
    for _ in range(3):
        # Create a distractor by messing up the grammar slightly
        wrong = list(base_words)
        if len(wrong) > 2:
            idx = random.randint(1, len(wrong)-1)
            wrong[idx] = wrong[idx] + "ed" if not wrong[idx].endswith("ed") else wrong[idx][:-2]
        distractors.append(" ".join(wrong))
        
    # Ensure they are unique
    return list(set(distractors + ["None of the above", "All of the above"]))[:3]

def build_procedural_lesson(lesson_id, meta, lang="es"):
    title = meta.get("title", "Lesson")
    desc = meta.get("description", "")
    vocab = meta.get("vocab", "business")
    level = meta.get("level", "B1")
    
    stages = []
    
    # 1. Theory Stage
    stages.append({
        "id": "stg_theory",
        "type": "lecture",
        "title": f"Theoretical Concept: {vocab.upper()}",
        "parts": [
            { "visual": f"Bienvenidos a esta lección sobre '{vocab}'. Tema: {title}.", "audio": f"Welcome to the lesson about {vocab}." },
            { "visual": f"Recuerda que en el nivel {level}, usamos '{vocab}' en contextos corporativos: {desc}", "audio": f"Please note how we use {vocab} in corporate environments." }
        ]
    })
    
    # 2. Quiz Choice (20 questions)
    quiz_questions = []
    for i in range(20):
        sentence = generate_random_sentence(level, vocab)
        # Create a fill-in-the-blank
        words = sentence.split()
        blank_idx = random.randint(0, len(words)-1)
        correct_word = words[blank_idx]
        words[blank_idx] = "____"
        question_text = " ".join(words)
        
        quiz_questions.append({
            "id": f"{lesson_id}-q-choice-{i+1}",
            "type": "quiz_choice",
            "question": f"Complete the sentence: {question_text}",
            "options": [correct_word] + generate_distractors(correct_word),
            "correct_answer": correct_word,
            "explanation": f"La respuesta correcta es '{correct_word}' porque completa el sentido lógico de la oración sobre '{vocab}'."
        })
        
    stages.append({
        "id": "stg_quiz_choice",
        "type": "quiz_choice",
        "title": "Interactive Quiz",
        "description": "Select the correct response",
        "questions": quiz_questions
    })
    
    # 3. Fill Input (10 questions)
    fill_questions = []
    for i in range(10):
        sentence = generate_random_sentence(level, vocab)
        # We blank out the vocab word itself or the verb
        if vocab in sentence:
            question_text = sentence.replace(vocab, "____")
            correct_word = vocab
        else:
            words = sentence.split()
            correct_word = words[2]
            words[2] = "____"
            question_text = " ".join(words)
            
        fill_questions.append({
            "id": f"{lesson_id}-q-fill-{i+1}",
            "type": "fill_input",
            "question": f"Type the missing word: {question_text}",
            "correct_answer": correct_word,
            "explanation": f"Debes escribir '{correct_word}' para que la frase tenga sentido."
        })
        
    stages.append({
        "id": "stg_fill",
        "type": "fill_input", # Depending on frontend, might be inside a quiz stage. We'll use quiz_choice structure but type fill_input if frontend supports it, otherwise order_sentence
        "title": "Written Expression",
        "description": "Type the exact word to complete the sentence.",
        "questions": fill_questions
    })
    
    # 4. Pairing Drill (10 pairs -> 1 stage usually has all pairs)
    pairs = []
    # Mix the vocab word with random words from the translation dict
    pool = list(TRANSLATIONS_ES.keys())
    random.shuffle(pool)
    selected_words = pool[:9]
    selected_words.append(vocab if vocab not in selected_words else random.choice(pool))
    
    for idx, w in enumerate(selected_words):
        es_trans = TRANSLATIONS_ES.get(w, f"{w} (traducido)")
        pairs.append({
            "id": f"{lesson_id}-p{idx+1}",
            "source": w.capitalize(),
            "target": es_trans.capitalize()
        })
        
    stages.append({
        "id": "stg_pairing",
        "type": "pairing_drill",
        "title": "Vocabulary Match",
        "pairs": pairs
    })
    
    # 5. Listening Match (10 questions)
    listen_questions = []
    for i in range(10):
        sentence = generate_random_sentence(level, vocab)
        listen_questions.append({
            "id": f"{lesson_id}-q-listen-{i+1}",
            "type": "listening_match",
            "question": "Listen carefully and select the exact phrase.",
            "tts_text": sentence,
            "options": [sentence, sentence.replace("very", "not"), sentence.replace("The", "A"), sentence + " today"],
            "correct_answer": sentence,
            "explanation": f"El audio pronuncia exactamente esta frase enfocada en '{vocab}'."
        })
        
    stages.append({
        "id": "stg_listening",
        "type": "listening_match",
        "title": "Listening Comprehension",
        "description": "Select the exact phrase you hear.",
        "questions": listen_questions
    })

    return {
        "id": lesson_id,
        "title": title,
        "version": "4.0-PROCEDURAL",
        "level": level,
        "total_xp": 500,
        "tags": [level, "Procedural", "No-AI"],
        "completion_message": f"¡Excelente trabajo! Has completado 50 ejercicios enfocados en el tema: {title}. Tu dominio del nivel {level} sigue creciendo.",
        "stages": stages
    }

def run_procedural_generation():
    langs = ["en"]
    base = r"c:\Users\jeico\onixlingo\language-ai-tutor\backend\app"
    
    print(f"Starting PROCEDURAL generation for {len(CATALOG)} lessons...")
    count = 0
    for lesson_id, meta in CATALOG.items():
        for lang in langs:
            target_path = os.path.join(base, "data", "lessons", lang, f"{lesson_id}.json")
            os.makedirs(os.path.dirname(target_path), exist_ok=True)
            
            lesson_data = build_procedural_lesson(lesson_id, meta, lang)
            
            with open(target_path, 'w', encoding='utf-8') as f:
                json.dump(lesson_data, f, ensure_ascii=False, indent=2)
                
            count += 1
            if count % 100 == 0:
                print(f"Generated {count} lessons so far...")
                
    print(f"✅ Successfully generated {count} lessons deterministically in ~2 seconds.")

if __name__ == "__main__":
    run_procedural_generation()
