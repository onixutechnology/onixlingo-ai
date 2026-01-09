import json
import random
import os
import uuid

# ==========================================
# 1. BASE DE DATOS DE NEGOCIACIÓN (B1-3)
# ==========================================

DB = {
    "conditional_pairs": [
        {"cond": "If you buy 50 units", "result": "we will give you a discount", "context": "Volume Discount"},
        {"cond": "If you sign today", "result": "I will include free shipping", "context": "Urgency"},
        {"cond": "If we lower the price", "result": "we will lose money", "context": "Risk"},
        {"cond": "If the quality is good", "result": "we will order more", "context": "Quality Assurance"},
        {"cond": "If you pay in cash", "result": "we will waive the fee", "context": "Payment Terms"}
    ],
    "negotiation_vocab": [
        {"word": "bulk", "def": "in large quantities", "context": "If you buy in ___, it's cheaper."},
        {"word": "compromise", "def": "an agreement where both sides give up something", "context": "Let's reach a ___."},
        {"word": "counter-offer", "def": "an offer made in response to another", "context": "Their price was too high, so we made a ___."},
        {"word": "deal", "def": "an agreement entered into by two or more parties", "context": "We closed the ___ yesterday."},
        {"word": "bottom line", "def": "the final offer or price", "context": "My ___ is $500, take it or leave it."}
    ],
    "offer_structures": [
        {"part1": "If you increase the order,", "part2": "we will reduce the price."},
        {"part1": "Unless you sign now,", "part2": "we cannot guarantee delivery."},
        {"part1": "Provided that you pay upfront,", "part2": "we will start immediately."}
    ],
    "vocabulary_list": [
        {"word": "Negotiation", "meaning": "Discussion aimed at reaching an agreement.", "ipa": "/nɪˌɡoʊʃiˈeɪʃən/"},
        {"word": "Proposal", "meaning": "A plan or suggestion put forward for consideration.", "ipa": "/prəˈpoʊzəl/"},
        {"word": "Leverage", "meaning": "The power to influence a person or situation.", "ipa": "/ˈlɛvərɪdʒ/"},
        {"word": "Terms", "meaning": "Conditions under which an action may be undertaken.", "ipa": "/tɜːrmz/"}
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

def gen_first_conditional_logic(idx):
    """(GRAMMAR) Estructura If + Present -> Will."""
    item = random.choice(DB["conditional_pairs"])
    
    # "If you buy 50 units, we ___ you a discount."
    # Distractores: gave (past), give (present), would give (2nd cond)
    sentence = f"{item['cond']}, {item['result'].replace('will', '___')}."
    
    # Extraer el verbo base para los distractores
    verb_part = item['result'].split("will ")[1] # "give you a discount"
    verb = verb_part.split(" ")[0] # "give"
    
    options = [f"will {verb}", verb, f"would {verb}", f"have {verb}ed"]
    random.shuffle(options)
    
    return {
        "id": generate_unique_id("gram"),
        "type": "quiz_choice",
        "difficulty": "medium",
        "tags": ["grammar", "first_conditional", "negotiation"],
        "question": f"Complete the negotiation: '{sentence}'",
        "options": options,
        "correct_answer": f"will {verb}",
        "explanation": "Primer Condicional: Si [Presente], entonces [Will + Verbo]."
    }

def gen_vocab_context_match(idx):
    """(VOCAB) Completar frases de negociación."""
    item = random.choice(DB["negotiation_vocab"])
    
    # "If you buy in ___, it's cheaper."
    q = item["context"]
    
    # Distractores
    others = [w["word"] for w in DB["negotiation_vocab"] if w["word"] != item["word"]]
    options = [item["word"]] + random.sample(others, 2)
    random.shuffle(options)
    
    return {
        "id": generate_unique_id("vocab"),
        "type": "quiz_choice",
        "difficulty": "medium",
        "tags": ["vocabulary", "business_context"],
        "question": f"Fill in the blank: '{q}'",
        "options": options,
        "correct_answer": item["word"],
        "explanation": f"Definition: {item['def']}."
    }

def gen_offer_scramble(idx):
    """(SYNTAX) Ordenar una oferta condicional."""
    struct = random.choice(DB["offer_structures"])
    full_sentence = f"{struct['part1']} {struct['part2']}"
    
    parts = full_sentence.split(" ")
    scrambled = parts.copy()
    random.shuffle(scrambled)
    
    return {
        "id": generate_unique_id("ord"),
        "type": "order_sentence",
        "difficulty": "hard",
        "tags": ["syntax", "conditionals"],
        "question": "Ordena la oferta:",
        "parts": scrambled,
        "correct_order": parts,
        "explanation": "Estructura lógica: Condición (If/Unless) + Resultado."
    }

def gen_negotiation_strategy(idx):
    """(LOGIC) Elegir la mejor respuesta en una negociación."""
    scenarios = [
        {"offer": "The price is too high.", "response": "If you buy more, we can lower it.", "bad": "Okay bye."},
        {"offer": "Can you deliver by Monday?", "response": "If you pay for express shipping, yes.", "bad": "Maybe."},
        {"offer": "I want a 20% discount.", "response": "We can't do 20%, but we can offer 10%.", "bad": "No way."}
    ]
    scen = random.choice(scenarios)
    
    return {
        "id": generate_unique_id("logic"),
        "type": "quiz_choice",
        "difficulty": "easy",
        "tags": ["soft_skills", "negotiation"],
        "question": f"Client says: **'{scen['offer']}'**\nBest response?",
        "options": [scen["response"], scen["bad"], "I don't know."],
        "correct_answer": scen["response"],
        "explanation": "En negociación, siempre ofrecemos una alternativa o condición (Trade-off)."
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
        "id": "pro-b1-3",
        "title": "Negotiation Tactics",
        "level": "B1",
        "cefr_code": "B1.2",
        "description": "Domina el arte de la negociación usando condicionales y vocabulario estratégico.",
        "tags": ["negotiation", "conditionals", "business_skills", "sales"],
        "duration_min": 50,
        "learning_objectives": ["Can use the First Conditional to make offers", "Can understand negotiation vocabulary", "Can make compromises and counter-offers"],
        "prerequisites": ["pro-b1-2"],
        "vocabulary_list": DB["vocabulary_list"],
        "theme_color": "#16A34A", # Green (Money/Deal)
        "cultural_notes": "In some cultures, saying 'No' directly is rude. Instead, say 'That might be difficult' or 'We would need to consider that'.",
        "stages": []
    }

    # --- STAGE 1: LECTURE ---
    lesson["stages"].append({
        "id": "stage_intro",
        "type": "lecture",
        "title": "The Power of 'IF'",
        "parts": [
            {
                "visual": "## The Deal Formula 🤝\n\n**IF** [Condition], **WILL** [Result]\n\n* 'If you sign, we will start.'\n* 'If you pay cash, we will give a discount.'",
                "audio_script": "Negotiation is about trading. Never give something for nothing. Use the First Conditional: 'If you do this, I will do that'. It protects your interests.",
                "duration": 20
            },
            {
                "visual": "\n## Key Terms 🔑\n\n* **Counter-offer**: Una contraoferta.\n* **Compromise**: Un punto medio.\n* **Deal**: Trato hecho.",
                "audio_script": "Learn to compromise. If the price is too high, make a counter-offer. Find the middle ground to close the deal.",
                "duration": 15
            }
        ]
    })

    # --- BLOQUES DE EJERCICIOS (100 TOTAL) ---
    all_questions = []

    # Generamos 100 ejercicios mezclados
    for i in range(30): all_questions.append(gen_first_conditional_logic(i)) # Gramática
    for i in range(30): all_questions.append(gen_vocab_context_match(i+30))  # Vocabulario
    for i in range(20): all_questions.append(gen_offer_scramble(i+60))       # Sintaxis
    for i in range(20): all_questions.append(gen_negotiation_strategy(i+80)) # Lógica
    
    random.shuffle(all_questions)

    # Chunking en bloques de 20
    chunk_size = 20
    for i in range(0, len(all_questions), chunk_size):
        chunk = all_questions[i:i + chunk_size]
        block_num = (i // chunk_size) + 1
        
        lesson["stages"].append({
            "id": f"stage_practice_block_{block_num}",
            "type": "gamified_quiz",
            "title": f"Deal Maker {block_num}",
            "description": f"Simulación de tratos {block_num}/5.",
            "xp_reward": 100 + (block_num * 10),
            "questions": chunk,
            "recommended_streak": 2
        })

    # --- BOSS STAGE: THE HARD BARGAIN ---
    lesson["stages"].append({
        "id": "stage_boss",
        "type": "practice_chat",
        "title": "Closing the Deal",
        "scenario": "Estás vendiendo software. El cliente quiere un precio más bajo. Negocia.",
        "ai_system_prompt": """
        ROLE: Tough Client.
        GOAL: Get a discount.
        BEHAVIOR:
        1. Say: "Your price is too high. I can only pay $5,000."
        2. Wait for user to make a conditional offer (e.g., "If you buy 2 years...").
        3. If user just says "Okay", say "Wait, really? You gave up fast." (Fail).
        4. If user uses "If... will...", accept the deal.
        """,
        "initial_message": "I like your product, but $6,000 is too expensive. Can you do $5,000?",
        "next_lesson_id": "pro-b1-4",
        "confidence_score_enabled": True,
        "badge_reward": "Negotiator"
    })

    return lesson

# --- EXEC ---
if __name__ == "__main__":
    data = build_lesson()
    out_path = "backend/app/data/lessons/pro-b1-3.json"
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        
    print(f"✅ LECCIÓN B1-3 (TITANIUM) GENERADA CON ÉXITO.")
    print(f"📂 Ubicación: {out_path}")
    print(f"🔢 Total de Ejercicios: {sum(len(s.get('questions', [])) for s in data['stages'])}")