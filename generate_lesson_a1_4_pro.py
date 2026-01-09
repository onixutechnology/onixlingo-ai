import json
import random
import os
import uuid

# ==========================================
# 1. BASE DE DATOS GASTRONÓMICA EXPANDIDA
# ==========================================

DB = {
    "food": [
        # Countable (singular, plural, article, category)
        {"name": "burger", "type": "count", "pl": "burgers", "art": "a", "cat": "main"},
        {"name": "apple", "type": "count", "pl": "apples", "art": "an", "cat": "fruit"},
        {"name": "egg", "type": "count", "pl": "eggs", "art": "an", "cat": "breakfast"},
        {"name": "sandwich", "type": "count", "pl": "sandwiches", "art": "a", "cat": "main"},
        {"name": "pancake", "type": "count", "pl": "pancakes", "art": "a", "cat": "breakfast"},
        {"name": "steak", "type": "count", "pl": "steaks", "art": "a", "cat": "main"},
        {"name": "salad", "type": "count", "pl": "salads", "art": "a", "cat": "side"},
        {"name": "cookie", "type": "count", "pl": "cookies", "art": "a", "cat": "dessert"},
        # Uncountable (unit)
        {"name": "water", "type": "uncount", "unit": "glass", "cat": "drink"},
        {"name": "coffee", "type": "uncount", "unit": "cup", "cat": "drink"},
        {"name": "rice", "type": "uncount", "unit": "bowl", "cat": "side"},
        {"name": "soup", "type": "uncount", "unit": "bowl", "cat": "starter"},
        {"name": "bread", "type": "uncount", "unit": "slice", "cat": "side"},
        {"name": "cheese", "type": "uncount", "unit": "piece", "cat": "ingredient"},
        {"name": "pasta", "type": "uncount", "unit": "plate", "cat": "main"},
        {"name": "milk", "type": "uncount", "unit": "glass", "cat": "drink"}
    ],
    "adjectives": ["delicious", "spicy", "fresh", "salty", "sweet", "cold", "hot", "raw", "vegan", "tasty"],
    "phrases": {
        "polite": ["I would like", "I'd like", "Could I have", "Can I get", "May I have"],
        "rude": ["I want", "Give me", "Bring me", "I need", "Get me"]
    },
    "menu_prices": {
        "burger": 10, "steak": 25, "soup": 8, "salad": 12, "water": 2, "coffee": 4, "cake": 6, "pasta": 15, "sandwich": 9
    },
    # Vocabulario Clave (Mejora 3)
    "vocabulary_list": [
        {"word": "Menu", "meaning": "A list of dishes available in a restaurant.", "ipa": "/ˈmɛnjuː/"},
        {"word": "Appetizer", "meaning": "A small dish of food taken before a meal.", "ipa": "/ˈæpɪtaɪzər/"},
        {"word": "Bill", "meaning": "A statement of money owed for goods or services.", "ipa": "/bɪl/"},
        {"word": "Waiter", "meaning": "A man whose job is to serve customers at their tables.", "ipa": "/ˈweɪtər/"}
    ]
}

# ==========================================
# 2. UTILIDADES
# ==========================================

def generate_unique_id(prefix):
    return f"{prefix}_{uuid.uuid4().hex[:8]}"

# ==========================================
# 3. GENERADORES DE EJERCICIOS AVANZADOS
# ==========================================

def gen_countable_bucket_sort(idx):
    """(BUCKET SORT) Clasifica comida en Countable vs Uncountable."""
    items = random.sample(DB["food"], 4)
    
    # Preparamos la respuesta correcta
    buckets = {
        "Countable (How many)": [i["name"] for i in items if i["type"] == "count"],
        "Uncountable (How much)": [i["name"] for i in items if i["type"] == "uncount"]
    }
    
    return {
        "id": generate_unique_id("sort"),
        "type": "bucket_sort", 
        "difficulty": "medium",
        "tags": ["grammar", "vocabulary", "food"],
        "question": "Clasifica los alimentos según si se pueden contar (1, 2, 3) o no:",
        "items": [i["name"] for i in items],
        "buckets": buckets,
        "explanation": "Los líquidos y masas (Water, Rice) son incontables. Objetos individuales (Burger, Apple) son contables."
    }

def gen_article_logic(idx):
    """(QUIZ) Lógica de A / An / Some."""
    item = random.choice(DB["food"])
    
    question_text = f"I'd like ___ {item['name']}, please."
    
    if item["type"] == "uncount":
        correct = "some"
        expl = f"'{item['name'].capitalize()}' es incontable, usamos SOME."
    else:
        correct = item["art"] # a o an
        expl = f"'{item['name'].capitalize()}' es singular contable y empieza por {'vocal' if correct=='an' else 'consonante'}."
        
    options = ["a", "an", "some"]
    random.shuffle(options)
    
    return {
        "id": generate_unique_id("art"),
        "type": "quiz_choice",
        "difficulty": "easy",
        "tags": ["grammar", "articles"],
        "question": f"Completa la frase: '{question_text}'",
        "options": options,
        "correct_answer": correct,
        "explanation": expl,
        "error_type": "grammar_article"
    }

def gen_polite_scramble(idx):
    """(ORDER) Ordenar una petición educada."""
    phrase = random.choice(DB["phrases"]["polite"])
    item = random.choice(DB["food"])
    
    # "I would like a burger please"
    obj = f"{item['art']} {item['name']}" if item['type'] == 'count' else f"some {item['name']}"
    full_sentence = f"{phrase} {obj} please"
    
    parts = full_sentence.split(" ")
    scrambled = parts.copy()
    random.shuffle(scrambled)
    
    return {
        "id": generate_unique_id("ord"),
        "type": "order_sentence",
        "difficulty": "medium",
        "tags": ["politeness", "syntax"],
        "question": "Ordena las palabras para pedir educadamente:",
        "parts": scrambled,
        "correct_order": parts,
        "explanation": "Estructura: Frase de cortesía + Objeto + Please."
    }

def gen_quantifier_logic(idx):
    """(FILL INPUT) How much vs How many."""
    item = random.choice(DB["food"])
    
    if item["type"] == "count":
        noun = item["pl"]
        correct = "many"
    else:
        noun = item["name"]
        correct = "much"
        
    question = f"How ___ {noun} do we need?"
    
    return {
        "id": generate_unique_id("quant"),
        "type": "quiz_choice",
        "difficulty": "medium",
        "tags": ["grammar", "quantifiers"],
        "question": f"Completa la pregunta: '{question}'",
        "options": ["much", "many", "a lot"],
        "correct_answer": correct,
        "explanation": f"Usamos '{correct}' porque '{noun}' es {'contable' if correct=='many' else 'incontable'}."
    }

def gen_menu_math(idx):
    """(LOGIC) Leer un menú y calcular."""
    # Generar mini menú aleatorio
    items = random.sample(list(DB["menu_prices"].keys()), 3)
    menu_text = " | ".join([f"{i.capitalize()}: ${DB['menu_prices'][i]}" for i in items])
    
    # Elegir 2 items para comprar
    buy = random.sample(items, 2)
    total = DB['menu_prices'][buy[0]] + DB['menu_prices'][buy[1]]
    
    question = f"MENU: [ {menu_text} ]\n\nYou order 1 {buy[0]} and 1 {buy[1]}. How much is it?"
    
    # Distractores matemáticos
    options = [f"${total}", f"${total-2}", f"${total+5}", f"${total+2}"]
    random.shuffle(options)

    return {
        "id": generate_unique_id("math"),
        "type": "quiz_choice",
        "difficulty": "hard",
        "tags": ["vocabulary", "numbers", "logic"],
        "question": question,
        "options": options,
        "correct_answer": f"${total}",
        "explanation": f"{buy[0].capitalize()} (${DB['menu_prices'][buy[0]]}) + {buy[1].capitalize()} (${DB['menu_prices'][buy[1]]}) = ${total}."
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
        "id": "pro-a1-4",
        "title": "Restaurant Master: Ordering Food",
        "level": "A1",
        "cefr_code": "A1.2",
        "description": "Domina el vocabulario de restaurantes, contables vs incontables y cómo pedir con educación.",
        "tags": ["vocabulary", "food", "travel", "grammar"],
        "duration_min": 45,
        "learning_objectives": ["Can order food politely", "Can distinguish countable/uncountable nouns", "Can understand a menu"],
        "prerequisites": ["pro-a1-3"],
        "vocabulary_list": DB["vocabulary_list"],
        "theme_color": "#EF4444", # Red (Appetite/Food)
        "cultural_notes": "In the US, tipping 15-20% is standard. In Japan, tipping is often considered rude.",
        "stages": []
    }
    
    # ETAPA 1: CONCEPTOS (Lecture)
    lesson["stages"].append({
        "id": "stage_intro",
        "type": "lecture",
        "title": "Dining Etiquette",
        "parts": [
            {
                "visual": "## Countable vs Uncountable 📏\n\n🍎 1 Apple, 2 Apples -> **Countable**\n💧 Water, 🍚 Rice -> **Uncountable**",
                "audio_script": "Welcome to the restaurant. Before we order, we need to know what we can count. You can count burgers, but you cannot count soup. For soup, we use units, like a 'bowl' of soup.",
                "duration": 12,
                "image_prompt": "A split image showing countable items (apples) on one side and uncountable items (water, rice) on the other."
            },
            {
                "visual": "## Politeness Magic ✨\n\n❌ I want...\n✅ **I would like...** / **I'd like...**",
                "audio_script": "In English, politeness is key. Never say 'I want'. It sounds like a demanding child. Always say 'I would like' or 'Could I have'.",
                "duration": 10
            }
        ]
    })
    
    # --- BLOQUES DE EJERCICIOS (100 TOTAL) ---
    all_questions = []

    # Generamos 100 ejercicios mezclados
    for i in range(25): all_questions.append(gen_article_logic(i))
    for i in range(25): all_questions.append(gen_quantifier_logic(i+25))
    for i in range(25): all_questions.append(gen_polite_scramble(i+50))
    for i in range(15): all_questions.append(gen_countable_bucket_sort(i+75))
    for i in range(10): all_questions.append(gen_menu_math(i+90))
    
    random.shuffle(all_questions)

    # Chunking en bloques de 20
    chunk_size = 20
    for i in range(0, len(all_questions), chunk_size):
        chunk = all_questions[i:i + chunk_size]
        block_num = (i // chunk_size) + 1
        
        lesson["stages"].append({
            "id": f"stage_practice_block_{block_num}",
            "type": "gamified_quiz",
            "title": f"Kitchen Drill {block_num}",
            "description": f"Entrenamiento intensivo {block_num}/5.",
            "xp_reward": 100 + (block_num * 10),
            "questions": chunk,
            "recommended_streak": 2
        })
    
    # BOSS: WAITER ROLEPLAY
    lesson["stages"].append({
        "id": "stage_boss",
        "type": "practice_chat",
        "title": "Dinner at Luigi's",
        "scenario": "Estás en un restaurante italiano elegante. Pide entrada, plato fuerte y bebida.",
        "ai_system_prompt": """
        ROLE: Italian Waiter 'Luigi'.
        GOAL: Take a 3-course order (Starter, Main, Drink).
        BEHAVIOR:
        1. Speak with a welcoming tone.
        2. Reject rude phrases like 'I want' (say 'So rude! Try again please').
        3. Praise polite phrases like 'I would like'.
        4. Ask 'Still or sparkling water?' if they order water.
        """,
        "initial_message": "Buonasera! Welcome to Luigi's. Are you ready to order, or are you waiting for someone?",
        "next_lesson_id": "pro-a1-5",
        "confidence_score_enabled": True,
        "badge_reward": "Gourmet Speaker"
    })
    
    return lesson

# --- EXEC ---
if __name__ == "__main__":
    data = build_lesson()
    out_path = "backend/app/data/lessons/pro-a1-4.json"
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        
    print(f"✅ LECCIÓN A1-4 (TITANIUM) GENERADA CON ÉXITO.")
    print(f"📂 Ubicación: {out_path}")
    print(f"🔢 Total de Ejercicios: {sum(len(s.get('questions', [])) for s in data['stages'])}")