import json
import random
import os
import uuid

# ==========================================
# 1. BASE DE DATOS DE INVENTARIO (A2-6)
# ==========================================

DB = {
    "supplies": [
        # Countable
        {"name": "laptop", "type": "count", "pl": "laptops", "unit": None},
        {"name": "chair", "type": "count", "pl": "chairs", "unit": None},
        {"name": "pen", "type": "count", "pl": "pens", "unit": "box"},
        {"name": "monitor", "type": "count", "pl": "monitors", "unit": None},
        {"name": "printer", "type": "count", "pl": "printers", "unit": None},
        {"name": "stapler", "type": "count", "pl": "staplers", "unit": None},
        # Uncountable (Mass/Abstract) - Common business errors
        {"name": "paper", "type": "uncount", "unit": "ream"},   # Ream = Resma
        {"name": "ink", "type": "uncount", "unit": "cartridge"},
        {"name": "furniture", "type": "uncount", "unit": "piece"},
        {"name": "information", "type": "uncount", "unit": "piece"},
        {"name": "software", "type": "uncount", "unit": "license"},
        {"name": "water", "type": "uncount", "unit": "bottle"},
        {"name": "tape", "type": "uncount", "unit": "roll"},
        {"name": "money", "type": "uncount", "unit": "amount"},
        {"name": "time", "type": "uncount", "unit": "hour"}
    ],
    "quantifiers": [
        {"word": "many", "type": "count", "context": "How ___ chairs do we need?"},
        {"word": "much", "type": "uncount", "context": "How ___ paper is left?"},
        {"word": "a few", "type": "count", "context": "We have ___ pens (small number)."},
        {"word": "a little", "type": "uncount", "context": "We have ___ time (small amount)."},
        {"word": "a lot of", "type": "both", "context": "We have ___ stock (large amount)."}
    ],
    "units": [
        {"u": "ream", "item": "paper"},
        {"u": "bottle", "item": "water"},
        {"u": "roll", "item": "tape"},
        {"u": "piece", "item": "furniture"},
        {"u": "box", "item": "pens"}
    ],
    "vocabulary_list": [
        {"word": "Inventory", "meaning": "A complete list of items such as property, goods in stock.", "ipa": "/ˈɪnvəntɔːri/"},
        {"word": "Supply", "meaning": "A stock of a resource from which a person or place can be provided.", "ipa": "/səˈplaɪ/"},
        {"word": "Shortage", "meaning": "A state or situation in which something cannot be obtained in sufficient amounts.", "ipa": "/ˈʃɔːrtɪdʒ/"},
        {"word": "Warehouse", "meaning": "A large building where raw materials or manufactured goods may be stored.", "ipa": "/ˈwɛrhaʊs/"}
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

def gen_count_uncount_sort(idx):
    """(BUCKET SORT) Clasificar Contable vs Incontable."""
    items = random.sample(DB["supplies"], 4)
    
    buckets = {
        "Countable (1, 2, 3...)": [i["name"] for i in items if i["type"] == "count"],
        "Uncountable (Mass/Abstract)": [i["name"] for i in items if i["type"] == "uncount"]
    }
    
    return {
        "id": generate_unique_id("sort"),
        "type": "bucket_sort",
        "difficulty": "medium",
        "tags": ["grammar", "nouns", "logistics"],
        "question": "Clasifica los ítems del inventario:",
        "items": [i["name"] for i in items],
        "buckets": buckets,
        "explanation": "Los incontables (Paper, Furniture, Ink) no tienen plural y no se pueden contar con números directamente."
    }

def gen_quantifier_quiz(idx):
    """(GRAMMAR) Much vs Many."""
    item = random.choice(DB["supplies"])
    
    if item["type"] == "count":
        noun = item["pl"]
        correct = "many"
        distractor = "much"
    else:
        noun = item["name"]
        correct = "much"
        distractor = "many"
        
    return {
        "id": generate_unique_id("quant"),
        "type": "quiz_choice",
        "difficulty": "medium",
        "tags": ["grammar", "quantifiers"],
        "question": f"How _____ **{noun}** did you order?",
        "options": [correct, distractor, "a lot"],
        "correct_answer": correct,
        "explanation": f"'{noun.capitalize()}' es {'contable' if correct=='many' else 'incontable'}, usamos '{correct}'."
    }

def gen_unit_matching(idx):
    """(VOCAB) Unidades de medida (Ream of paper, etc.)."""
    pair = random.choice(DB["units"])
    
    # "We need a ___ of paper."
    q = f"We need to order a new **___** of {pair['item']}."
    
    # Distractores
    others = [u["u"] for u in DB["units"] if u["u"] != pair["u"]]
    options = [pair["u"]] + random.sample(others, 2)
    random.shuffle(options)
    
    return {
        "id": generate_unique_id("unit"),
        "type": "quiz_choice",
        "difficulty": "hard",
        "tags": ["vocabulary", "collocations"],
        "question": q,
        "options": options,
        "correct_answer": pair["u"],
        "explanation": f"La unidad de medida correcta para '{pair['item']}' es '{pair['u']}'."
    }

def gen_order_syntax(idx):
    """(SYNTAX) Ordenar pedido de suministros."""
    item = random.choice(DB["supplies"])
    qty = random.randint(2, 20)
    
    # "We need five new laptops" vs "We need some paper"
    if item["type"] == "count":
        sentence = f"We need {qty} new {item['pl']}"
    else:
        unit = item["unit"] if item["unit"] else "units"
        sentence = f"We need {qty} {unit}s of {item['name']}"
        
    parts = sentence.split(" ")
    scrambled = parts.copy()
    random.shuffle(scrambled)
    
    return {
        "id": generate_unique_id("ord"),
        "type": "order_sentence",
        "difficulty": "medium",
        "tags": ["syntax", "ordering"],
        "question": "Ordena la solicitud de compra:",
        "parts": scrambled,
        "correct_order": parts,
        "explanation": "Estructura: Sujeto + Verbo + Cantidad + (Unidad) + Objeto."
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
        "id": "pro-a2-6",
        "title": "Inventory Check",
        "level": "A2",
        "cefr_code": "A2.2",
        "description": "Domina el control de inventario diferenciando entre contables e incontables y sus unidades.",
        "tags": ["logistics", "grammar", "inventory", "nouns"],
        "duration_min": 45,
        "learning_objectives": ["Can distinguish countable and uncountable nouns", "Can use quantifiers (much/many) correctly", "Can use partitives (ream of, bottle of)"],
        "prerequisites": ["pro-a2-5"],
        "vocabulary_list": DB["vocabulary_list"],
        "theme_color": "#EA580C", # Orange (Logistics/Boxes)
        "cultural_notes": "In English, 'Furniture' and 'Equipment' are strictly uncountable. We never say 'a furniture'. We say 'a piece of furniture'.",
        "stages": []
    }

    # --- STAGE 1: LECTURE ---
    lesson["stages"].append({
        "id": "stage_intro",
        "type": "lecture",
        "title": "Stock Control",
        "parts": [
            {
                "visual": "## Countable (1, 2, 3) 🔢\n* Pen -> Pens\n* Laptop -> Laptops\n* Use: **How Many**\n\n## Uncountable (Mass) 🌊\n* Paper (Not papers)\n* Information (Not informations)\n* Use: **How Much**",
                "audio_script": "Accuracy is vital in logistics. You can count pens, but you can't count 'paper' directly; you count 'reams of paper'. Remember: Uncountable nouns never have a plural 'S'.",
                "duration": 20,
                "image_prompt": "A warehouse shelf with labelled boxes of 'Pens (Countable)' and a stack of 'Paper (Uncountable)'."
            }
        ]
    })

    # --- BLOQUES DE EJERCICIOS (100 TOTAL) ---
    all_questions = []

    # Generamos 100 ejercicios mezclados
    for i in range(30): all_questions.append(gen_count_uncount_sort(i))     # Categorización
    for i in range(30): all_questions.append(gen_quantifier_quiz(i+30))     # Gramática
    for i in range(20): all_questions.append(gen_unit_matching(i+60))       # Vocabulario/Lógica
    for i in range(20): all_questions.append(gen_order_syntax(i+80))        # Sintaxis
    
    random.shuffle(all_questions)

    # Chunking en bloques de 20
    chunk_size = 20
    for i in range(0, len(all_questions), chunk_size):
        chunk = all_questions[i:i + chunk_size]
        block_num = (i // chunk_size) + 1
        
        lesson["stages"].append({
            "id": f"stage_practice_block_{block_num}",
            "type": "gamified_quiz",
            "title": f"Warehouse Drill {block_num}",
            "description": f"Control de stock {block_num}/5.",
            "xp_reward": 100 + (block_num * 10),
            "questions": chunk,
            "recommended_streak": 2
        })

    # --- BOSS STAGE: SUPPLY ORDER ---
    lesson["stages"].append({
        "id": "stage_boss",
        "type": "practice_chat",
        "title": "The Supply Manager",
        "scenario": "Necesitas pedir material de oficina. El Gerente de Suministros te pregunta qué necesitas.",
        "ai_system_prompt": """
        ROLE: Supply Manager.
        GOAL: Take an order for office supplies.
        BEHAVIOR:
        1. Ask "What do you need for your department?".
        2. If user asks for "Papers" or "Informations", correct them ("You mean paper/information?").
        3. Ask for specific quantities ("How many?").
        4. Confirm the order.
        """,
        "initial_message": "Inventory check! What supplies are you running low on?",
        "next_lesson_id": "pro-a2-7",
        "confidence_score_enabled": True,
        "badge_reward": "Logistician"
    })

    return lesson

# --- EXEC ---
if __name__ == "__main__":
    data = build_lesson()
    out_path = "backend/app/data/lessons/pro-a2-6.json"
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        
    print(f"✅ LECCIÓN A2-6 (TITANIUM) GENERADA CON ÉXITO.")
    print(f"📂 Ubicación: {out_path}")
    print(f"🔢 Total de Ejercicios: {sum(len(s.get('questions', [])) for s in data['stages'])}")