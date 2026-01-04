import json
import random
import os
import uuid

# --- 1. BASE DE DATOS GASTRONÓMICA EXPANDIDA ---

DB = {
    "food": [
        # Countable (sing, plural, a/an)
        {"name": "burger", "type": "count", "pl": "burgers", "art": "a", "cat": "main"},
        {"name": "apple", "type": "count", "pl": "apples", "art": "an", "cat": "fruit"},
        {"name": "egg", "type": "count", "pl": "eggs", "art": "an", "cat": "breakfast"},
        {"name": "sandwich", "type": "count", "pl": "sandwiches", "art": "a", "cat": "main"},
        {"name": "pancake", "type": "count", "pl": "pancakes", "art": "a", "cat": "breakfast"},
        {"name": "steak", "type": "count", "pl": "steaks", "art": "a", "cat": "main"},
        # Uncountable (unit)
        {"name": "water", "type": "uncount", "unit": "glass", "cat": "drink"},
        {"name": "coffee", "type": "uncount", "unit": "cup", "cat": "drink"},
        {"name": "rice", "type": "uncount", "unit": "bowl", "cat": "side"},
        {"name": "soup", "type": "uncount", "unit": "bowl", "cat": "starter"},
        {"name": "bread", "type": "uncount", "unit": "slice", "cat": "side"},
        {"name": "cheese", "type": "uncount", "unit": "piece", "cat": "ingredient"},
        {"name": "pasta", "type": "uncount", "unit": "plate", "cat": "main"}
    ],
    "adjectives": ["delicious", "spicy", "fresh", "salty", "sweet", "cold", "hot", "raw", "vegan"],
    "phrases": {
        "polite": ["I would like", "I'd like", "Could I have", "Can I get", "May I have"],
        "rude": ["I want", "Give me", "Bring me", "I need", "Get me"]
    },
    "menu_prices": {
        "burger": 10, "steak": 25, "soup": 8, "salad": 12, "water": 2, "coffee": 4, "cake": 6
    }
}

# --- 2. GENERADORES DE EJERCICIOS AVANZADOS ---

def gen_countable_bucket_sort(idx):
    """
    (BUCKET SORT) Clasifica comida en Countable vs Uncountable.
    """
    # Seleccionamos 4 items variados
    items = random.sample(DB["food"], 4)
    
    # Preparamos la respuesta correcta
    buckets = {
        "Countable (How many)": [i["name"] for i in items if i["type"] == "count"],
        "Uncountable (How much)": [i["name"] for i in items if i["type"] == "uncount"]
    }
    
    return {
        "id": f"sort_{idx}",
        "type": "bucket_sort", # Nuevo tipo de ejercicio
        "difficulty": "medium",
        "tags": ["grammar", "vocabulary"],
        "question": "Clasifica los alimentos según si se pueden contar (1, 2, 3) o no:",
        "items": [i["name"] for i in items],
        "buckets": buckets,
        "explanation": "Los líquidos y masas (Water, Rice) son incontables. Objetos individuales (Burger, Apple) son contables."
    }

def gen_article_logic(idx):
    """
    (QUIZ) Lógica de A / An / Some.
    """
    item = random.choice(DB["food"])
    
    question_text = f"I'd like ___ {item['name']}, please."
    
    if item["type"] == "uncount":
        correct = "some"
        expl = f"'{item['name'].capitalize()}' es incontable, usamos SOME."
    else:
        correct = item["art"] # a o an
        expl = f"'{item['name'].capitalize()}' es singular contable y empieza por {'vocal' if correct=='an' else 'consonante'}."
        
    options = ["a", "an", "some"]
    # Asegurar que la opción correcta esté y mezclar
    random.shuffle(options)
    
    return {
        "id": f"art_{idx}",
        "type": "quiz_choice",
        "difficulty": "easy",
        "tags": ["grammar", "articles"],
        "question": f"Completa la frase: '{question_text}'",
        "options": options,
        "correct_answer": correct,
        "explanation": expl
    }

def gen_polite_scramble(idx):
    """
    (ORDER) Ordenar una petición educada.
    """
    phrase = random.choice(DB["phrases"]["polite"])
    item = random.choice(DB["food"])
    
    # Construir frase: "I would like a burger please"
    obj = f"{item['art']} {item['name']}" if item['type'] == 'count' else f"some {item['name']}"
    full_sentence = f"{phrase} {obj} please"
    
    parts = full_sentence.split(" ")
    scrambled = parts.copy()
    random.shuffle(scrambled)
    
    return {
        "id": f"ord_{idx}",
        "type": "order_sentence",
        "difficulty": "medium",
        "tags": ["politeness", "syntax"],
        "question": "Ordena las palabras para pedir educadamente:",
        "parts": scrambled,
        "correct_order": parts,
        "explanation": "Estructura: Frase de cortesía + Objeto + Please."
    }

def gen_quantifier_logic(idx):
    """
    (FILL INPUT) How much vs How many.
    """
    item = random.choice(DB["food"])
    
    if item["type"] == "count":
        noun = item["pl"]
        correct = "many"
    else:
        noun = item["name"]
        correct = "much"
        
    question = f"How ___ {noun} do we need?"
    
    return {
        "id": f"quant_{idx}",
        "type": "quiz_choice", # O fill_input restringido
        "difficulty": "medium",
        "tags": ["grammar", "quantifiers"],
        "question": f"Completa la pregunta: '{question}'",
        "options": ["much", "many", "a lot"],
        "correct_answer": correct,
        "explanation": f"Usamos '{correct}' porque '{noun}' es {'contable' if correct=='many' else 'incontable'}."
    }

def gen_menu_math(idx):
    """
    (LOGIC) Leer un menú y calcular.
    """
    # Generar mini menú aleatorio
    items = random.sample(list(DB["menu_prices"].keys()), 3)
    menu_text = " | ".join([f"{i.capitalize()}: ${DB['menu_prices'][i]}" for i in items])
    
    # Elegir 2 items para comprar
    buy = random.sample(items, 2)
    total = DB['menu_prices'][buy[0]] + DB['menu_prices'][buy[1]]
    
    question = f"MENU: [ {menu_text} ]\n\nYou order 1 {buy[0]} and 1 {buy[1]}. How much is it?"
    
    return {
        "id": f"math_{idx}",
        "type": "quiz_choice",
        "difficulty": "hard",
        "tags": ["vocabulary", "numbers"],
        "question": question,
        "options": [f"${total}", f"${total-2}", f"${total+5}", f"${total+2}"],
        "correct_answer": f"${total}",
        "explanation": f"{buy[0].capitalize()} (${DB['menu_prices'][buy[0]]}) + {buy[1].capitalize()} (${DB['menu_prices'][buy[1]]}) = ${total}."
    }

# --- 3. ENSAMBLAJE (TITANIUM STRUCTURE) ---

def build_lesson():
    lesson = {
        "id": "pro-a1-4",
        "version": "Titanium 2.0",
        "title": "Restaurant Master: Ordering Food",
        "level": "A1",
        "tags": ["vocabulary", "food", "travel"],
        "total_xp": 250,
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
                "audio": "Welcome to the restaurant. Before we order, we need to know what we can count. You can count burgers, but you cannot count soup. For soup, we use units, like a 'bowl' of soup.",
                "animation": "teacher_pointing",
                "duration": 12
            },
            {
                "visual": "## Politeness Magic ✨\n\n❌ I want...\n✅ **I would like...** / **I'd like...**",
                "audio": "In English, politeness is key. Never say 'I want'. It sounds like a demanding child. Always say 'I would like' or 'Could I have'.",
                "animation": "explaining"
            }
        ]
    })
    
    # ETAPA 2: BUCKET SORT (Categorización)
    lesson["stages"].append({
        "id": "stage_sort",
        "type": "gamified_quiz",
        "title": "The Pantry",
        "description": "Separa la comida: ¿Se cuenta o no?",
        "xp_reward": 100,
        "questions": [gen_countable_bucket_sort(i) for i in range(6)]
    })
    
    # ETAPA 3: ARTICLES & QUANTIFIERS (Gramática)
    mix_grammar = [gen_article_logic(i) for i in range(5)] + [gen_quantifier_logic(i) for i in range(5)]
    random.shuffle(mix_grammar)
    lesson["stages"].append({
        "id": "stage_grammar",
        "type": "gamified_quiz",
        "title": "Grammar Chef",
        "description": "Usa A, An, Some, Much y Many correctamente.",
        "xp_reward": 150,
        "questions": mix_grammar
    })
    
    # ETAPA 4: POLITE ORDERING (Sintaxis)
    lesson["stages"].append({
        "id": "stage_order",
        "type": "gamified_quiz",
        "title": "The Perfect Order",
        "description": "Construye frases educadas.",
        "xp_reward": 150,
        "questions": [gen_polite_scramble(i) for i in range(6)]
    })
    
    # ETAPA 5: MENU MATH (Real Life Context)
    lesson["stages"].append({
        "id": "stage_menu",
        "type": "gamified_quiz",
        "title": "Check, please!",
        "description": "Calcula la cuenta del menú.",
        "xp_reward": 200,
        "questions": [gen_menu_math(i) for i in range(5)]
    })
    
    # BOSS: WAITER ROLEPLAY
    lesson["stages"].append({
        "id": "stage_boss",
        "type": "practice_chat",
        "title": "Dinner at Luigi's",
        "scenario": "Estás en un restaurante italiano elegante. Pide entrada, plato fuerte y bebida.",
        "ai_system_prompt": "ROLE: Italian Waiter 'Luigi'. GOAL: Take a 3-course order. Reject 'I want' (say 'So rude!'). Praise 'I would like'. Ask 'Still or sparkling water?'.",
        "initial_message": "Buonasera! Welcome to Luigi's. Are you ready to order, or are you waiting for someone?",
        "success_criteria": ["uses_polite_phrases", "orders_drink", "understands_menu"]
    })
    
    return lesson

# --- EXEC ---
if __name__ == "__main__":
    data = build_lesson()
    out_path = "backend/app/data/lessons/pro-a1-4.json"
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"✅ LECCIÓN GENERADA: {out_path}")