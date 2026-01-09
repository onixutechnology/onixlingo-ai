import json
import random
import os
import uuid

# ==========================================
# 1. BASE DE DATOS FINANCIERA (A1-3)
# ==========================================

DB = {
    # Items de oficina con precios base aproximados y plurales
    "items": [
        {"s": "laptop", "p": "laptops", "price": 1000, "type": "tech"},
        {"s": "ergonomic chair", "p": "ergonomic chairs", "price": 300, "type": "furniture"},
        {"s": "printer", "p": "printers", "price": 250, "type": "tech"},
        {"s": "software license", "p": "software licenses", "price": 50, "type": "software"},
        {"s": "desk", "p": "desks", "price": 500, "type": "furniture"},
        {"s": "projector", "p": "projectors", "price": 800, "type": "tech"},
        {"s": "coffee machine", "p": "coffee machines", "price": 150, "type": "kitchen"}
    ],
    # Monedas globales
    "currencies": [
        {"code": "USD", "symbol": "$", "name": "Dollars"},
        {"code": "EUR", "symbol": "€", "name": "Euros"},
        {"code": "GBP", "symbol": "£", "name": "Pounds"},
        {"code": "JPY", "symbol": "¥", "name": "Yen"}
    ],
    # Números escritos para práctica de lectura
    "numbers_text": [
        {"n": 100, "t": "one hundred"},
        {"n": 1000, "t": "one thousand"},
        {"n": 1500, "t": "one thousand five hundred"},
        {"n": 50000, "t": "fifty thousand"},
        {"n": 1000000, "t": "one million"},
        {"n": 250, "t": "two hundred and fifty"}
    ],
    # Vocabulario Clave (Mejora 3)
    "vocabulary_list": [
        {"word": "Budget", "meaning": "An estimate of income and expenditure for a set period.", "ipa": "/ˈbʌdʒɪt/"},
        {"word": "Currency", "meaning": "A system of money in general use in a particular country.", "ipa": "/ˈkɜːrənsi/"},
        {"word": "Invoice", "meaning": "A list of goods sent or services provided, with a statement of the sum due.", "ipa": "/ˈɪnvɔɪs/"},
        {"word": "Affordable", "meaning": "Inexpensive; reasonably priced.", "ipa": "/əˈfɔːrdəbl/"}
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

def gen_price_grammar(idx):
    """Gramática: How much IS (singular) vs ARE (plural)."""
    item = random.choice(DB["items"])
    is_plural = random.choice([True, False])
    
    if is_plural:
        obj = item["p"]
        verb = "are"
        distractor = "is"
    else:
        obj = item["s"]
        verb = "is"
        distractor = "are"
        
    sentence = f"How much ___ the {obj}?"
    
    return {
        "id": generate_unique_id("gram"),
        "type": "quiz_choice",
        "difficulty": "medium",
        "tags": ["grammar", "singular_plural", "prices"],
        "question": f"Completa la pregunta: '{sentence}'",
        "options": [verb, distractor, "am", "be"],
        "correct_answer": verb,
        "explanation": f"'{obj}' es {'plural' if is_plural else 'singular'}, así que usamos '{verb}'."
    }

def gen_number_reading(idx):
    """Lectura de números grandes."""
    num_data = random.choice(DB["numbers_text"])
    currency = random.choice(DB["currencies"])
    
    display = f"{currency['symbol']}{num_data['n']:,}" # Ejemplo: $1,000
    
    # Generar distractores lógicos
    options = [
        f"{num_data['t']} {currency['name'].lower()}", # Correcto
        f"{num_data['t']} {currency['code']}",
        f"{num_data['n']} {currency['name'].lower()}" 
    ]
    # Distractor extra confuso
    if num_data['n'] == 1000:
        options.append(f"one hundred {currency['name'].lower()}")
    else:
        options.append(f"ten thousand {currency['name'].lower()}")
        
    random.shuffle(options)
    
    return {
        "id": generate_unique_id("num"),
        "type": "quiz_choice",
        "difficulty": "hard",
        "tags": ["vocabulary", "numbers"],
        "question": f"¿Cómo se lee este precio en un contrato?: **{display}**",
        "options": options,
        "correct_answer": f"{num_data['t']} {currency['name'].lower()}",
        "explanation": "En inglés de negocios, debemos escribir los números completos en documentos formales."
    }

def gen_total_calculation(idx):
    """Matemáticas simples de negocios."""
    item = random.choice(DB["items"])
    qty = random.choice([2, 3, 4, 5, 10])
    currency = random.choice(DB["currencies"])
    
    total = item["price"] * qty
    
    prompt = f"We need {qty} {item['p']}. Each one costs {currency['symbol']}{item['price']}."
    question = f"What is the total budget?"
    
    correct_str = f"{currency['symbol']}{total:,}"
    distractor1 = f"{currency['symbol']}{item['price']:,}"
    distractor2 = f"{currency['symbol']}{total + 100:,}"
    
    return {
        "id": generate_unique_id("math"),
        "type": "quiz_choice",
        "difficulty": "medium",
        "tags": ["logic", "math", "budgeting"],
        "question": f"{prompt} {question}",
        "options": [correct_str, distractor1, distractor2],
        "correct_answer": correct_str,
        "explanation": f"{qty} veces {item['price']} es igual a {total}."
    }

def gen_currency_symbol_match(idx):
    """Identificación de símbolos de moneda."""
    curr = random.choice(DB["currencies"])
    
    return {
        "id": generate_unique_id("sym"),
        "type": "fill_input",
        "difficulty": "easy",
        "tags": ["vocabulary", "symbols"],
        "question": f"¿Qué moneda representa el símbolo **{curr['symbol']}**? (Escribe el nombre en inglés, plural)",
        "correct_answers": [curr["name"], curr["name"].lower()],
        "hint": f"Código ISO: {curr['code']}",
        "explanation": f"{curr['symbol']} es el símbolo para {curr['name']}."
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
        "id": "pro-a1-3",
        "title": "Budget & Numbers",
        "level": "A1",
        "cefr_code": "A1.2",
        "description": "Aprende a preguntar precios, manejar monedas internacionales y calcular presupuestos básicos.",
        "tags": ["money", "numbers", "business", "math"],
        "duration_min": 50,
        "learning_objectives": ["Can ask for prices using 'How much'", "Can read large numbers and currencies", "Can calculate simple totals"],
        "prerequisites": ["pro-a1-2"],
        "vocabulary_list": DB["vocabulary_list"],
        "theme_color": "#F59E0B", # Amber (Gold/Money)
        "cultural_notes": "In the US, prices displayed often do not include sales tax, which is added at the register.",
        "stages": []
    }

    # --- STAGE 1: LECTURE ---
    lesson["stages"].append({
        "id": "stage_intro",
        "type": "lecture",
        "title": "Money Talks",
        "parts": [
            {
                "visual": "## The Price Formula 💰\n\nSingular: How much **IS** the laptop?\nPlural: How much **ARE** the printers?\n\nSymbols: $ (Dollars), € (Euros), £ (Pounds).",
                "audio_script": "In business, numbers must be precise. Remember: use IS for one item, and ARE for many. Let's talk about money.",
                "duration": 15,
                "image_prompt": "A clean infographic showing currencies USD, EUR, GBP and a price tag."
            }
        ]
    })

    # --- BLOQUES DE EJERCICIOS (100 TOTAL) ---
    all_questions = []

    # Generamos 100 ejercicios mezclados
    for i in range(30): all_questions.append(gen_price_grammar(i))      # Gramática (Is/Are)
    for i in range(30): all_questions.append(gen_number_reading(i+30))  # Lectura de números
    for i in range(20): all_questions.append(gen_total_calculation(i+60)) # Matemáticas
    for i in range(20): all_questions.append(gen_currency_symbol_match(i+80)) # Símbolos
    
    random.shuffle(all_questions)

    # Chunking en bloques de 20
    chunk_size = 20
    for i in range(0, len(all_questions), chunk_size):
        chunk = all_questions[i:i + chunk_size]
        block_num = (i // chunk_size) + 1
        
        lesson["stages"].append({
            "id": f"stage_practice_block_{block_num}",
            "type": "gamified_quiz",
            "title": f"Financial Drill {block_num}",
            "description": f"Auditoría de conocimientos {block_num}/5.",
            "xp_reward": 100 + (block_num * 10),
            "questions": chunk,
            "recommended_streak": 2
        })

    # --- BOSS STAGE: THE NEGOTIATION ---
    lesson["stages"].append({
        "id": "stage_boss",
        "type": "practice_chat",
        "title": "The Vendor Negotiation",
        "scenario": "Estás comprando equipo para tu nueva oficina. Pregunta precios al vendedor.",
        "ai_system_prompt": """
        ROLE: Office Supplies Vendor.
        GOAL: Answer questions about prices of laptops, desks, and chairs.
        BEHAVIOR:
        1. When user asks "How much is the [item]?", give a price in Dollars.
        2. If user asks about plural "How much are the [items]?", give a price per unit.
        3. Be polite but professional.
        4. Sometimes offer a small discount if they buy many.
        """,
        "initial_message": "Welcome to OfficeDepot Pro. How can I help you with your budget today?",
        "next_lesson_id": "pro-a1-4",
        "confidence_score_enabled": True,
        "badge_reward": "Finance Rookie"
    })

    return lesson

# --- EXEC ---
if __name__ == "__main__":
    data = build_lesson()
    out_path = "backend/app/data/lessons/pro-a1-3.json"
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        
    print(f"✅ LECCIÓN A1-3 (TITANIUM) GENERADA CON ÉXITO.")
    print(f"📂 Ubicación: {out_path}")
    print(f"🔢 Total de Ejercicios: {sum(len(s.get('questions', [])) for s in data['stages'])}")