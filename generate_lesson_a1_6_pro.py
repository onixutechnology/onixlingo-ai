import json
import random
import os
import uuid

# ==========================================
# 1. BASE DE DATOS DE RESTAURANTE (A1-6)
# ==========================================

DB = {
    "menu_items": [
        {"name": "Tomato Soup", "course": "Starter", "price": 8},
        {"name": "Caesar Salad", "course": "Starter", "price": 10},
        {"name": "Grilled Salmon", "course": "Main Course", "price": 25},
        {"name": "Ribeye Steak", "course": "Main Course", "price": 30},
        {"name": "Pasta Carbonara", "course": "Main Course", "price": 18},
        {"name": "Cheesecake", "course": "Dessert", "price": 9},
        {"name": "Chocolate Cake", "course": "Dessert", "price": 8},
        {"name": "Espresso", "course": "Drink", "price": 3},
        {"name": "Sparkling Water", "course": "Drink", "price": 4},
        {"name": "Red Wine", "course": "Drink", "price": 12}
    ],
    "phrases": {
        "rude": ["I want", "Give me", "Bring me", "Pass the salt", "I need"],
        "polite": ["I would like", "I'd like", "Could I have", "Could you pass", "May I have"]
    },
    "vocab_context": [
        {"ctx": "You finished eating and want to pay.", "answer": "The Bill", "options": ["The Menu", "The Order", "The Tip"]},
        {"ctx": "You want to book a table for tomorrow.", "answer": "Reservation", "options": ["Invitation", "Reception", "Registration"]},
        {"ctx": "Extra money you leave for the waiter.", "answer": "Tip", "options": ["Tax", "Bill", "Fine"]},
        {"ctx": "Water with gas/bubbles.", "answer": "Sparkling Water", "options": ["Still Water", "Tap Water", "Dirty Water"]},
        {"ctx": "Water without gas.", "answer": "Still Water", "options": ["Sparkling Water", "Soft Drink", "Soda"]}
    ],
    # Vocabulario Clave (Mejora 3)
    "vocabulary_list": [
        {"word": "Starter", "meaning": "The first course of a meal (Appetizer).", "ipa": "/ˈstɑːrtər/"},
        {"word": "Main Course", "meaning": "The primary dish of a meal.", "ipa": "/meɪn kɔːrs/"},
        {"word": "Sparkling", "meaning": "Drinks containing bubbles of gas (carbonated).", "ipa": "/ˈspɑːrkliŋ/"},
        {"word": "Reservation", "meaning": "An arrangement to have a table kept for you.", "ipa": "/ˌrɛzərˈveɪʃən/"}
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

def gen_politeness_filter(idx):
    """(LOGIC) Distinguir entre Rude vs Polite."""
    is_polite = random.choice([True, False])
    
    if is_polite:
        phrase = random.choice(DB["phrases"]["polite"])
        sentence = f"{phrase} the steak, please."
        correct = "Professional"
        distractor = "Rude"
    else:
        phrase = random.choice(DB["phrases"]["rude"])
        sentence = f"{phrase} the steak."
        correct = "Rude"
        distractor = "Professional"
        
    return {
        "id": generate_unique_id("polite"),
        "type": "quiz_choice",
        "difficulty": "easy",
        "tags": ["soft_skills", "politeness"],
        "question": f"How does this sound?: **'{sentence}'**",
        "options": ["Professional", "Rude", "Grammatically Incorrect"],
        "correct_answer": correct,
        "explanation": f"'{phrase}' se considera {'educado' if is_polite else 'descortés'} en un contexto de negocios."
    }

def gen_menu_classification(idx):
    """(CATEGORIZATION) Identificar si es Entrada, Plato Fuerte o Postre."""
    item = random.choice(DB["menu_items"])
    
    options = ["Starter", "Main Course", "Dessert", "Drink"]
    # Remover la correcta y volverla a agregar para mezclar después
    options = [o for o in options if o != item["course"]]
    final_options = options[:2] + [item["course"]]
    random.shuffle(final_options)
    
    return {
        "id": generate_unique_id("menu"),
        "type": "quiz_choice",
        "difficulty": "medium",
        "tags": ["vocabulary", "food"],
        "question": f"Where would you find **{item['name']}** on a menu?",
        "options": final_options,
        "correct_answer": item["course"],
        "explanation": f"{item['name']} es un tipo de {item['course']}."
    }

def gen_ordering_syntax(idx):
    """(SYNTAX) Ordenar una frase compleja de pedido."""
    # "I would like the salmon please"
    item = random.choice(DB["menu_items"])
    structure = random.choice([
        f"I would like the {item['name']} please",
        f"Could I have the {item['name']} please",
        f"I'll have the {item['name']}"
    ])
    
    parts = structure.split(" ")
    scrambled = parts.copy()
    random.shuffle(scrambled)
    
    return {
        "id": generate_unique_id("ord"),
        "type": "order_sentence",
        "difficulty": "medium",
        "tags": ["grammar", "syntax", "ordering"],
        "question": "Ordena las palabras para pedir:",
        "parts": scrambled,
        "correct_order": parts,
        "explanation": "Estructura: Frase de cortesía + Plato + Please."
    }

def gen_restaurant_context(idx):
    """(CONTEXT) Vocabulario de restaurante (Bill, Tip, Water)."""
    data = random.choice(DB["vocab_context"])
    
    return {
        "id": generate_unique_id("ctx"),
        "type": "quiz_choice",
        "difficulty": "medium",
        "tags": ["vocabulary", "context"],
        "question": f"Situation: {data['ctx']}",
        "options": data["options"] + [data["answer"]], # Asegurar que esté la respuesta
        "correct_answer": data["answer"],
        "explanation": f"{data['answer']} es el término correcto para esta situación."
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
        "id": "pro-a1-6",
        "title": "The Business Lunch",
        "level": "A1",
        "cefr_code": "A1.2",
        "description": "Aprende el protocolo de una comida de negocios: pedir ordenadamente, pagar la cuenta y modales.",
        "tags": ["socializing", "food", "politeness", "business"],
        "duration_min": 45,
        "learning_objectives": ["Can distinguish between starter, main, and dessert", "Can make polite requests using 'I would like'", "Can ask for the bill"],
        "prerequisites": ["pro-a1-5"],
        "vocabulary_list": DB["vocabulary_list"],
        "theme_color": "#D97706", # Amber (Hospitality/Warmth)
        "cultural_notes": "In a business lunch, the person who invites usually pays the bill. Discussing business often happens after the main course is ordered.",
        "stages": []
    }

    # --- STAGE 1: LECTURE ---
    lesson["stages"].append({
        "id": "stage_intro",
        "type": "lecture",
        "title": "Table Manners",
        "parts": [
            {
                "visual": "## The Menu 🍽️\n\n1. **Starter** (Soup/Salad)\n2. **Main Course** (Steak/Fish)\n3. **Dessert** (Cake/Fruit)",
                "audio_script": "Welcome to the business lunch. We usually order three courses. First the starter, then the main course, and finally dessert.",
                "duration": 12,
                "image_prompt": "A fancy restaurant menu divided into Starters, Mains, and Desserts."
            },
            {
                "visual": "## The Golden Rule ✨\n\n❌ I want...\n✅ **I would like...** (I'd like...)",
                "audio_script": "Never say 'I want'. It sounds rude. Always say 'I would like'. And remember: Sparkling water has gas, Still water has no gas.",
                "duration": 12
            }
        ]
    })

    # --- BLOQUES DE EJERCICIOS (100 TOTAL) ---
    all_questions = []

    # Generamos 100 ejercicios mezclados
    for i in range(30): all_questions.append(gen_politeness_filter(i))      # Soft Skills
    for i in range(20): all_questions.append(gen_menu_classification(i+30)) # Vocabulario
    for i in range(30): all_questions.append(gen_ordering_syntax(i+50))     # Gramática
    for i in range(20): all_questions.append(gen_restaurant_context(i+80))  # Contexto
    
    random.shuffle(all_questions)

    # Chunking en bloques de 20
    chunk_size = 20
    for i in range(0, len(all_questions), chunk_size):
        chunk = all_questions[i:i + chunk_size]
        block_num = (i // chunk_size) + 1
        
        lesson["stages"].append({
            "id": f"stage_practice_block_{block_num}",
            "type": "gamified_quiz",
            "title": f"Etiquette Drill {block_num}",
            "description": f"Entrenamiento de protocolo {block_num}/5.",
            "xp_reward": 100 + (block_num * 10),
            "questions": chunk,
            "recommended_streak": 2
        })

    # --- BOSS STAGE: ORDERING WITH THE BOSS ---
    lesson["stages"].append({
        "id": "stage_boss",
        "type": "practice_chat",
        "title": "Lunch with the CEO",
        "scenario": "Estás almorzando con el CEO y el mesero toma tu orden. Debes sonar profesional.",
        "ai_system_prompt": """
        ROLE: High-end Waiter.
        CONTEXT: User is with their Boss (The CEO).
        GOAL: Take the user's order.
        BEHAVIOR:
        1. Ask "Are you ready to order?".
        2. If user says "I want", correct them gently: "Perhaps you mean 'I would like'?".
        3. Ask about drinks (Still or Sparkling).
        4. End with "Excellent choice".
        """,
        "initial_message": "Good afternoon. The special today is Grilled Salmon. Are you ready to order?",
        "next_lesson_id": "pro-a1-7",
        "confidence_score_enabled": True,
        "badge_reward": "Diplomat Diner"
    })

    return lesson

# --- EXEC ---
if __name__ == "__main__":
    data = build_lesson()
    out_path = "backend/app/data/lessons/pro-a1-6.json"
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        
    print(f"✅ LECCIÓN A1-6 (TITANIUM) GENERADA CON ÉXITO.")
    print(f"📂 Ubicación: {out_path}")
    print(f"🔢 Total de Ejercicios: {sum(len(s.get('questions', [])) for s in data['stages'])}")