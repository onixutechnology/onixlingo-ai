import json
import random
import os

# --- BASE DE DATOS GASTRONÓMICA ---
countables = [
    {"name": "apple", "pl": "apples", "a": "an"},
    {"name": "burger", "pl": "burgers", "a": "a"},
    {"name": "sandwich", "pl": "sandwiches", "a": "a"},
    {"name": "fry", "pl": "fries", "a": "a"},
    {"name": "egg", "pl": "eggs", "a": "an"},
    {"name": "pancake", "pl": "pancakes", "a": "a"},
    {"name": "table", "pl": "tables", "a": "a"}
]

uncountables = [
    {"name": "water", "unit": "glass of"},
    {"name": "coffee", "unit": "cup of"},
    {"name": "rice", "unit": "bowl of"},
    {"name": "soup", "unit": "bowl of"},
    {"name": "bread", "unit": "slice of"},
    {"name": "cheese", "unit": "piece of"},
    {"name": "meat", "unit": "piece of"}
]

adjectives = ["delicious", "spicy", "fresh", "salty", "sweet", "cold", "hot"]
polite_starters = ["I would like", "I'd like", "Can I have", "Could I get"]
rude_starters = ["I want", "Give me", "Bring me", "I need"]

# --- GENERADORES DE EJERCICIOS ---

def gen_countable_uncountable(idx):
    is_countable = random.choice([True, False])
    if is_countable:
        item = random.choice(countables)
        question = f"Completa: 'How ___ {item['pl']} would you like?'"
        correct = "many"
        distractor = "much"
        expl = f"'{item['pl'].capitalize()}' son contables (1, 2, 3) ➔ MANY."
    else:
        item = random.choice(uncountables)
        question = f"Completa: 'How ___ {item['name']} is left?'"
        correct = "much"
        distractor = "many"
        expl = f"'{item['name'].capitalize()}' es incontable (líquido/masa) ➔ MUCH."
    options = [correct, distractor, "a lot"]
    random.shuffle(options)
    return {
        "id": f"q_count_{idx}", "type": "quiz_choice", "question": question, "options": options, "correct_answer": correct, "explanation": expl
    }

def gen_polite_ordering(idx):
    item = random.choice(countables)
    polite = random.choice(polite_starters)
    rude = random.choice(rude_starters)
    target = f"{item['a']} {item['name']}"
    sentence = f"In a restaurant, ask politely: '___ {target}, please.'"
    options = [polite, rude, "I am"]
    random.shuffle(options)
    return {
        "id": f"q_polite_{idx}", "type": "quiz_choice", "question": sentence, "options": options, "correct_answer": polite, "explanation": f"'{polite}' es educado. '{rude}' es grosero."
    }

def gen_article_logic(idx):
    if random.random() > 0.5:
        item = random.choice(countables)
        question = f"Waiter: 'Would you like ___ {item['name']}?'"
        correct = item['a']
        wrong = "some" if correct == "a" else "a"
        expl = "Singular contable usa A/AN."
    else:
        item = random.choice(uncountables)
        question = f"Waiter: 'Would you like ___ {item['name']}?'"
        correct = "some"
        wrong = "a"
        expl = "Incontables usan SOME, nunca A/AN."
    options = [correct, wrong, "two"]
    random.shuffle(options)
    return {
        "id": f"q_art_{idx}", "type": "quiz_choice", "question": question, "options": options, "correct_answer": correct, "explanation": expl
    }

def gen_restaurant_dialogue(idx):
    scenarios = [
        {"q": "Are you ready to order?", "a": "Yes, I'd like the steak."},
        {"q": "Anything to drink?", "a": "Just water, please."},
        {"q": "Can I get you the check?", "a": "Yes, please."},
        {"q": "How was everything?", "a": "It was delicious, thanks."},
        {"q": "Table for two?", "a": "Yes, we have a reservation."}
    ]
    scene = random.choice(scenarios)
    question = f"Waiter: **'{scene['q']}'**\nYou say:"
    distractors = [s['a'] for s in scenarios if s['a'] != scene['a']]
    random.shuffle(distractors)
    options = [scene['a']] + distractors[:2]
    random.shuffle(options)
    return {
        "id": f"q_dial_{idx}", "type": "quiz_choice", "question": question, "options": options, "correct_answer": scene['a'], "explanation": "Respuesta lógica al contexto."
    }

def gen_complex_order(idx):
    item = random.choice(countables)
    side = random.choice(uncountables)
    adj = random.choice(adjectives)
    sentence = f"I'd like {item['a']} {adj} {item['name']} ___ some {side['name']}."
    correct = "with"
    options = ["with", "on", "at", "in"]
    random.shuffle(options)
    return {
        "id": f"q_comp_{idx}", "type": "quiz_choice", "question": f"Completa: '{sentence}'", "options": options, "correct_answer": correct, "explanation": "'With' indica acompañamiento."
    }

# --- ENSAMBLAJE DE LA LECCIÓN (LECTURE MODE) ---

lesson = {
    "id": "a1-4",
    "title": "Food & Ordering 🍔",
    "level": "A1",
    "description": "Domina el arte de pedir comida con tu Tutor IA.",
    "stages": []
}

# --- INTRODUCCIÓN ---
lesson["stages"].append({
    "type": "lecture",
    "title": "Welcome to the Restaurant",
    "parts": [
        {
            "visual": "## Bon Appétit! 🍽️\nHoy aprenderemos a sobrevivir en un restaurante.\n\n* Pedir comida\n* Ser educado\n* Pagar la cuenta",
            "audio": "Welcome to my kitchen! Today we are going to learn essential vocabulary for restaurants. Ordering food can be scary, but I will help you sound like a local.",
            "animation": "happy"
        }
    ]
})

# 1. MUCH vs MANY (20)
lesson["stages"].append({
    "type": "lecture",
    "title": "Módulo 1: Cantidades",
    "parts": [{
        "visual": "## ¿Se puede contar? 📏\n\n* **MANY:** 🍎🍎🍎 (1, 2, 3)\n* **MUCH:** 💧💧💧 (Agua, Arroz)",
        "audio": "First rule: Quantities. If you can count it with your fingers like apples, use MANY. If it is a liquid or powder like water or sugar, use MUCH.",
        "animation": "teacher_pointing"
    }]
})
lesson["stages"].append({"type": "quiz", "questions": [gen_countable_uncountable(i) for i in range(20)]})

# 2. CORTESÍA (20)
lesson["stages"].append({
    "type": "lecture",
    "title": "Módulo 2: Modales",
    "parts": [{
        "visual": "## Don't be rude! 🎩\n\n❌ I want pizza.\n✅ I **would like** pizza.",
        "audio": "Please, never say 'I want'. It sounds very aggressive. Always use 'I would like' or 'Can I have'. Manners are very important.",
        "animation": "talking"
    }]
})
lesson["stages"].append({"type": "quiz", "questions": [gen_polite_ordering(i) for i in range(20)]})

# 3. ARTÍCULOS (20)
lesson["stages"].append({
    "type": "lecture",
    "title": "Módulo 3: Artículos",
    "parts": [{
        "visual": "## A, An, Some 🍎\n\n* **A/An:** Uno solo (A burger).\n* **Some:** Incontables (Some water).",
        "audio": "Be careful with articles. Use 'A' or 'An' only for single items. For liquids or plural things, use 'Some'. I would like some water, please.",
        "animation": "curious"
    }]
})
lesson["stages"].append({"type": "quiz", "questions": [gen_article_logic(i) for i in range(20)]})

# 4. DIÁLOGO (20)
lesson["stages"].append({
    "type": "lecture",
    "title": "Módulo 4: El Mesero",
    "parts": [{
        "visual": "## Frases Clave 🗣️\n\n* Ready to order?\n* Anything to drink?\n* The check, please.",
        "audio": "Listen to the waiter. He will ask if you are ready to order. At the end, don't forget to ask for 'the check'.",
        "animation": "talking"
    }]
})
lesson["stages"].append({"type": "quiz", "questions": [gen_restaurant_dialogue(i) for i in range(20)]})

# 5. MIX (20)
lesson["stages"].append({
    "type": "lecture",
    "title": "Módulo 5: Pedido Maestro",
    "parts": [{
        "visual": "## El Combo Completo 🌟\n\n* I'd like a **spicy** burger **with** fries.",
        "audio": "Let's put it all together. Adjectives, prepositions, and polite requests. Make me proud!",
        "animation": "happy"
    }]
})
lesson["stages"].append({"type": "quiz", "questions": [gen_complex_order(i) for i in range(20)]})

# CHAT FINAL
lesson["stages"].append({
    "type": "practice_chat",
    "scenario": "Estás en 'Bella Italia'. El mesero Luigi espera tu orden.",
    "ai_system_prompt": "ROLE: Italian Waiter 'Luigi'. GOAL: Take order. Correct rude phrases ('I want') to polite ones ('I would like')."
})

# GUARDAR
output_path = "backend/app/data/lessons/a1-4.json"
os.makedirs(os.path.dirname(output_path), exist_ok=True)
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(lesson, f, indent=2, ensure_ascii=False)

print(f"✅ LECCIÓN A1-4 (LECTURE MODE) GENERADA: {output_path}")