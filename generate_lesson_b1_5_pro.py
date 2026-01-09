import json
import random
import os
import uuid

# ==========================================
# 1. BASE DE DATOS DE TENDENCIAS (B1-5)
# ==========================================

DB = {
    "trend_verbs": [
        {"word": "soar", "type": "up", "intensity": "high", "def": "Increase rapidly above the usual level."},
        {"word": "plummet", "type": "down", "intensity": "high", "def": "Fall or drop straight down at high speed."},
        {"word": "stabilize", "type": "flat", "intensity": "neutral", "def": "Become unlikely to change, fail, or decline."},
        {"word": "fluctuate", "type": "wave", "intensity": "variable", "def": "Rise and fall irregularly in number or amount."},
        {"word": "peak", "type": "top", "intensity": "high", "def": "Reach a highest point."},
        {"word": "recover", "type": "up", "intensity": "medium", "def": "Return to a normal state of health, mind, or strength."},
        {"word": "dip", "type": "down", "intensity": "low", "def": "Put or let something down quickly or briefly."}
    ],
    "adverbs": [
        {"word": "dramatically", "meaning": "suddenly and surprisingly"},
        {"word": "steadily", "meaning": "in a regular and even manner"},
        {"word": "slightly", "meaning": "to a small degree; not considerably"},
        {"word": "gradually", "meaning": "in a gradual way; slowly; by degrees"},
        {"word": "sharply", "meaning": "with a sudden and marked change"}
    ],
    "prepositions": [
        {"prep": "by", "usage": "difference (rose BY 10%)"},
        {"prep": "to", "usage": "destination (rose TO $100)"},
        {"prep": "at", "usage": "static point (stood AT 50%)"},
        {"prep": "in", "usage": "area of change (increase IN sales)"}
    ],
    "chart_data": [
        {"start": 100, "end": 150, "verb": "increased", "prep": "to", "val": "150"},
        {"start": 100, "end": 150, "verb": "increased", "prep": "by", "val": "50"},
        {"start": 200, "end": 100, "verb": "fell", "prep": "to", "val": "100"},
        {"start": 200, "end": 100, "verb": "fell", "prep": "by", "val": "100"}
    ],
    "vocabulary_list": [
        {"word": "Trend", "meaning": "A general direction in which something is developing or changing.", "ipa": "/trɛnd/"},
        {"word": "Graph", "meaning": "A diagram showing the relation between variable quantities.", "ipa": "/ɡræf/"},
        {"word": "Forecast", "meaning": "A prediction or estimate of future events.", "ipa": "/ˈfɔːrkæst/"},
        {"word": "Quarter", "meaning": "Each of four equal periods into which a year is divided.", "ipa": "/ˈkwɔːrtər/"}
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

def gen_trend_vocab_quiz(idx):
    """(VOCAB) Definiciones de verbos de tendencia."""
    item = random.choice(DB["trend_verbs"])
    
    # Distractores
    others = [v["word"] for v in DB["trend_verbs"] if v["word"] != item["word"]]
    options = [item["word"]] + random.sample(others, 2)
    random.shuffle(options)
    
    return {
        "id": generate_unique_id("vocab"),
        "type": "quiz_choice",
        "difficulty": "medium",
        "tags": ["vocabulary", "business_english", "trends"],
        "question": f"Which word means: **'{item['def']}'**?",
        "options": options,
        "correct_answer": item["word"],
        "explanation": f"'{item['word']}' se ajusta a la definición dada."
    }

def gen_preposition_logic(idx):
    """(LOGIC) Matemáticas de By vs To."""
    data = random.choice(DB["chart_data"])
    
    # "Sales started at {start} and {verb} ___ {val}."
    sentence = f"Sales started at {data['start']} and {data['verb']} ___ {data['val']}."
    
    # Distractores
    options = ["by", "to", "at", "of"]
    
    return {
        "id": generate_unique_id("logic"),
        "type": "quiz_choice",
        "difficulty": "hard",
        "tags": ["grammar", "prepositions", "math"],
        "question": f"Complete the report: '{sentence}'",
        "options": options,
        "correct_answer": data["prep"],
        "explanation": f"De {data['start']} a {data['end']} es un cambio {'de' if data['prep']=='by' else 'hasta'} {data['val']}."
    }

def gen_adverb_intensity(idx):
    """(VOCAB) Intensidad de adverbios."""
    adv = random.choice(DB["adverbs"])
    
    # Clasificar intensidad para la explicación
    intensity = "fast/strong" if adv["word"] in ["dramatically", "sharply"] else "slow/small" if adv["word"] in ["steadily", "slightly", "gradually"] else "regular"
    
    return {
        "id": generate_unique_id("adv"),
        "type": "quiz_choice",
        "difficulty": "easy",
        "tags": ["vocabulary", "adverbs"],
        "question": f"Sales rose **{adv['word']}**. This means the change was...",
        "options": [adv["meaning"], "impossible to measure", "negative"],
        "correct_answer": adv["meaning"],
        "explanation": f"'{adv['word']}' indica un cambio de tipo {intensity}."
    }

def gen_chart_description_order(idx):
    """(SYNTAX) Ordenar descripción de gráfica."""
    # "Sales peaked at 500 in March"
    parts = ["Sales", "peaked", "at", "$500", "in", "March"]
    scrambled = parts.copy()
    random.shuffle(scrambled)
    
    return {
        "id": generate_unique_id("ord"),
        "type": "order_sentence",
        "difficulty": "medium",
        "tags": ["syntax", "reporting"],
        "question": "Ordena el reporte:",
        "parts": scrambled,
        "correct_order": parts,
        "explanation": "Estructura: Sujeto + Verbo + Preposición + Cantidad + Tiempo."
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
        "id": "pro-b1-5",
        "title": "Market Trends",
        "level": "B1",
        "cefr_code": "B1.2",
        "description": "Aprende a describir gráficas, tendencias de mercado y cambios financieros con precisión.",
        "tags": ["data_analysis", "graphs", "vocabulary", "business"],
        "duration_min": 50,
        "learning_objectives": ["Can describe upward and downward trends", "Can use prepositions 'by' and 'to' with figures", "Can use adverbs to describe speed of change"],
        "prerequisites": ["pro-b1-4"],
        "vocabulary_list": DB["vocabulary_list"],
        "theme_color": "#22C55E", # Green (Growth/Money)
        "cultural_notes": "When presenting bad news (falling sales), it is common to use passive voice or softer verbs ('dipped') to minimize panic.",
        "stages": []
    }

    # --- STAGE 1: LECTURE ---
    lesson["stages"].append({
        "id": "stage_intro",
        "type": "lecture",
        "title": "Describing Data 📊",
        "parts": [
            {
                "visual": "\n## Trend Verbs\n* 🚀 **Soar/Skyrocket**: Go up fast\n* 📉 **Plummet/Crash**: Go down fast\n* 〰️ **Fluctuate**: Up and down",
                "audio_script": "To sound professional, avoid 'go up' and 'go down'. Use precise verbs. If sales go up fast, they 'soar'. If they drop suddenly, they 'plummet'.",
                "duration": 20
            },
            {
                "visual": "## Prepositions 📐\n* Rose **TO** $100 (Final Price)\n* Rose **BY** $10 (Difference)\n* Standing **AT** $50 (Current state)",
                "audio_script": "Prepositions change the meaning completely. Rising TO 100 is good. Rising BY 100 is amazing. Pay attention to the difference.",
                "duration": 15
            }
        ]
    })

    # --- BLOQUES DE EJERCICIOS (100 TOTAL) ---
    all_questions = []

    # Generamos 100 ejercicios mezclados
    for i in range(30): all_questions.append(gen_trend_vocab_quiz(i))       # Vocabulario
    for i in range(30): all_questions.append(gen_preposition_logic(i+30))   # Lógica/Gramática
    for i in range(20): all_questions.append(gen_adverb_intensity(i+60))    # Matices
    for i in range(20): all_questions.append(gen_chart_description_order(i+80)) # Sintaxis
    
    random.shuffle(all_questions)

    # Chunking en bloques de 20
    chunk_size = 20
    for i in range(0, len(all_questions), chunk_size):
        chunk = all_questions[i:i + chunk_size]
        block_num = (i // chunk_size) + 1
        
        lesson["stages"].append({
            "id": f"stage_practice_block_{block_num}",
            "type": "gamified_quiz",
            "title": f"Data Analyst {block_num}",
            "description": f"Análisis de gráficas {block_num}/5.",
            "xp_reward": 100 + (block_num * 10),
            "questions": chunk,
            "recommended_streak": 2
        })

    # --- BOSS STAGE: THE BOARD PRESENTATION ---
    lesson["stages"].append({
        "id": "stage_boss",
        "type": "practice_chat",
        "title": "Quarterly Review",
        "scenario": "Presenta los resultados del trimestre a la Junta Directiva. Las ventas subieron, pero los costos también.",
        "ai_system_prompt": """
        ROLE: Board Director.
        GOAL: Ask about company performance.
        BEHAVIOR:
        1. Ask "How did sales perform in Q3?".
        2. Expect strong verbs ("increased", "soared"). If user says "went up", say "Can you be more specific?".
        3. Ask about costs ("And what about expenses?").
        4. Ask for numbers ("By how much did they rise?").
        """,
        "initial_message": "The meeting is open. Please give us the summary of the Q3 performance.",
        "next_lesson_id": "pro-b1-6",
        "confidence_score_enabled": True,
        "badge_reward": "Analyst"
    })

    return lesson

# --- EXEC ---
if __name__ == "__main__":
    data = build_lesson()
    out_path = "backend/app/data/lessons/pro-b1-5.json"
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        
    print(f"✅ LECCIÓN B1-5 (TITANIUM) GENERADA CON ÉXITO.")
    print(f"📂 Ubicación: {out_path}")
    print(f"🔢 Total de Ejercicios: {sum(len(s.get('questions', [])) for s in data['stages'])}")