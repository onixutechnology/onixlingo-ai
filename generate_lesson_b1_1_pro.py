import json
import random
import os
import uuid

# ==========================================
# 1. BASE DE DATOS PROFESIONAL (B1-1)
# ==========================================

DB = {
    "weak_vs_strong_verbs": [
        {"weak": "made", "strong": "developed", "context": "I ___ a new software solution."},
        {"weak": "changed", "strong": "transformed", "context": "I ___ the sales strategy."},
        {"weak": "looked at", "strong": "analyzed", "context": "We ___ the market trends."},
        {"weak": "talked to", "strong": "negotiated with", "context": "I ___ the key clients."},
        {"weak": "helped", "strong": "facilitated", "context": "I ___ the team building event."},
        {"weak": "started", "strong": "launched", "context": "We ___ the product in 2022."},
        {"weak": "ran", "strong": "managed", "context": "I ___ a team of 10 people."}
    ],
    "experience_sentences": [
        {"sent": "I ___ in sales for 10 years (and I still do).", "marker": "for 10 years", "tense": "have worked", "wrong": "worked"},
        {"sent": "I ___ the project last year.", "marker": "last year", "tense": "finished", "wrong": "have finished"},
        {"sent": "She ___ three awards so far.", "marker": "so far", "tense": "has won", "wrong": "won"},
        {"sent": "We ___ the deadline yesterday.", "marker": "yesterday", "tense": "missed", "wrong": "have missed"},
        {"sent": "I ___ to Japan many times.", "marker": "many times", "tense": "have been", "wrong": "was"}
    ],
    "pitch_structures": [
        ["Hi, I am [Name].", "I am a [Role].", "I help companies [Benefit].", "I have [Number] years of experience."],
        ["My name is [Name].", "I specialize in [Field].", "I have developed [Solution].", "Let's connect."],
        ["I am a [Role].", "I have led [Project].", "My expertise is [Skill].", "I am looking for [Opportunity]."]
    ],
    "professional_adjectives": [
        {"adj": "Reliable", "def": "Trustworthy, consistent."},
        {"adj": "Innovative", "def": "Using new methods or ideas."},
        {"adj": "Experienced", "def": "Having knowledge from doing things."},
        {"adj": "Proactive", "def": "Creating or controlling a situation."},
        {"adj": "Diligent", "def": "Having or showing care in one's work."}
    ],
    "vocabulary_list": [
        {"word": "Pitch", "meaning": "A short, persuasive speech.", "ipa": "/pɪtʃ/"},
        {"word": "Background", "meaning": "Your past experience and education.", "ipa": "/ˈbækˌɡraʊnd/"},
        {"word": "Expertise", "meaning": "Expert skill or knowledge in a particular field.", "ipa": "/ˌɛkspərˈtiːz/"},
        {"word": "Accomplishment", "meaning": "Something that has been achieved successfully.", "ipa": "/əˈkʌmplɪʃmənt/"}
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

def gen_power_verb_match(idx):
    """(VOCAB) Transformar verbos débiles en fuertes."""
    item = random.choice(DB["weak_vs_strong_verbs"])
    
    return {
        "id": generate_unique_id("vocab"),
        "type": "quiz_choice",
        "difficulty": "medium",
        "tags": ["vocabulary", "business_english", "impact"],
        "question": f"Make it professional: '{item['context']}'\n(Replace '{item['weak']}')",
        "options": [item["strong"], item["weak"], "doing", "making"],
        "correct_answer": item["strong"],
        "explanation": f"En un Elevator Pitch, '{item['strong']}' suena mucho más impactante y profesional que '{item['weak']}'."
    }

def gen_tense_discrimination(idx):
    """(GRAMMAR) Present Perfect (Experience) vs Past Simple (History)."""
    item = random.choice(DB["experience_sentences"])
    
    return {
        "id": generate_unique_id("gram"),
        "type": "quiz_choice",
        "difficulty": "hard",
        "tags": ["grammar", "present_perfect", "tenses"],
        "question": f"Completa la frase: '{item['sent']}'",
        "options": [item["tense"], item["wrong"], "having"],
        "correct_answer": item["tense"],
        "explanation": f"El marcador temporal '{item['marker']}' nos indica si la acción continúa/es relevante (Present Perfect) o terminó (Past Simple)."
    }

def gen_pitch_scramble(idx):
    """(SYNTAX) Ordenar un Elevator Pitch lógico."""
    pitch = random.choice(DB["pitch_structures"])
    scrambled = pitch.copy()
    random.shuffle(scrambled)
    
    return {
        "id": generate_unique_id("ord"),
        "type": "order_sentence",
        "difficulty": "medium",
        "tags": ["syntax", "pitching", "structure"],
        "question": "Ordena las partes del Elevator Pitch:",
        "parts": scrambled,
        "correct_order": pitch,
        "explanation": "Estructura lógica: Introducción -> Rol Actual -> Logros/Valor -> Cierre."
    }

def gen_adjective_definition(idx):
    """(VOCAB) Adjetivos de alto nivel."""
    item = random.choice(DB["professional_adjectives"])
    
    # Distractores
    others = [a["adj"] for a in DB["professional_adjectives"] if a["adj"] != item["adj"]]
    options = [item["adj"]] + random.sample(others, 2)
    random.shuffle(options)
    
    return {
        "id": generate_unique_id("def"),
        "type": "quiz_choice",
        "difficulty": "easy",
        "tags": ["vocabulary", "adjectives"],
        "question": f"Which word means: '**{item['def']}**'?",
        "options": options,
        "correct_answer": item["adj"],
        "explanation": f"Definición exacta de {item['adj']}."
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
        "id": "pro-b1-1",
        "title": "The Elevator Pitch",
        "level": "B1",
        "cefr_code": "B1.1",
        "description": "Aprende a venderte profesionalmente en 30 segundos usando verbos de impacto y el Present Perfect.",
        "tags": ["pitching", "business_skills", "present_perfect", "vocabulary"],
        "duration_min": 50,
        "learning_objectives": ["Can introduce oneself professionally", "Can use Present Perfect for experience", "Can use 'Power Verbs' instead of basic verbs"],
        "prerequisites": ["pro-a2-7"],
        "vocabulary_list": DB["vocabulary_list"],
        "theme_color": "#F97316", # Orange (Energy/Sales)
        "cultural_notes": "In Western business culture, confidence is key. Use 'I have achieved' instead of 'We achieved' when talking about your personal contribution.",
        "stages": []
    }

    # --- STAGE 1: LECTURE ---
    lesson["stages"].append({
        "id": "stage_intro",
        "type": "lecture",
        "title": "The 30-Second Rule",
        "parts": [
            {
                "visual": "## The Formula 🧪\n\n1. **Who** (Current Role)\n2. **What** (Experience - Present Perfect)\n3. **Value** (Power Verbs)\n\n* 'I **have led** teams for 5 years.'",
                "audio_script": "Welcome to B1. An Elevator Pitch is a summary of your value. Don't say 'I worked'. Say 'I have worked'. Don't say 'I changed'. Say 'I transformed'.",
                "duration": 20,
                "image_prompt": "A professional presenting a chart with the words 'Who', 'What', 'Value' highlighted."
            }
        ]
    })

    # --- BLOQUES DE EJERCICIOS (100 TOTAL) ---
    all_questions = []

    # Generamos 100 ejercicios mezclados
    for i in range(30): all_questions.append(gen_tense_discrimination(i))   # Gramática Clave (Present Perfect)
    for i in range(30): all_questions.append(gen_power_verb_match(i+30))    # Vocabulario de Impacto
    for i in range(20): all_questions.append(gen_pitch_scramble(i+60))      # Estructura
    for i in range(20): all_questions.append(gen_adjective_definition(i+80))# Vocabulario Adjetivos
    
    random.shuffle(all_questions)

    # Chunking en bloques de 20
    chunk_size = 20
    for i in range(0, len(all_questions), chunk_size):
        chunk = all_questions[i:i + chunk_size]
        block_num = (i // chunk_size) + 1
        
        lesson["stages"].append({
            "id": f"stage_practice_block_{block_num}",
            "type": "gamified_quiz",
            "title": f"Pitch Training {block_num}",
            "description": f"Refinamiento de discurso {block_num}/5.",
            "xp_reward": 100 + (block_num * 10),
            "questions": chunk,
            "recommended_streak": 2
        })

    # --- BOSS STAGE: NETWORKING EVENT ---
    lesson["stages"].append({
        "id": "stage_boss",
        "type": "practice_chat",
        "title": "The Networking Event",
        "scenario": "Estás en un evento de networking. Preséntate ante un CEO importante.",
        "ai_system_prompt": """
        ROLE: CEO of a Tech Giant.
        GOAL: Ask the user about their background.
        BEHAVIOR:
        1. Say: "Hi, I don't think we've met. What do you do?"
        2. Listen to their pitch.
        3. If they use Past Simple ("I worked"), ask: "And are you still doing that?" (Prompting Present Perfect).
        4. Look for Power Verbs. If they sound weak, say "That sounds... okay."
        5. If they are confident, say "Impressive. Here is my card."
        """,
        "initial_message": "Hello there. I'm the CEO of FutureTech. Nice to meet you. What do you do?",
        "next_lesson_id": "pro-b1-2",
        "confidence_score_enabled": True,
        "badge_reward": "Pitch Perfect"
    })

    return lesson

# --- EXEC ---
if __name__ == "__main__":
    data = build_lesson()
    out_path = "backend/app/data/lessons/pro-b1-1.json"
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        
    print(f"✅ LECCIÓN B1-1 (TITANIUM) GENERADA CON ÉXITO.")
    print(f"📂 Ubicación: {out_path}")
    print(f"🔢 Total de Ejercicios: {sum(len(s.get('questions', [])) for s in data['stages'])}")