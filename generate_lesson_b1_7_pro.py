import json
import random
import os
import uuid

# ==========================================
# 1. BASE DE DATOS ESTRATÉGICA (B1-7)
# ==========================================

DB = {
    "milestones": [
        {"action": "finish the project", "time": "by Friday", "perfect": "will have finished"},
        {"action": "double the revenue", "time": "by 2030", "perfect": "will have doubled"},
        {"action": "hire 50 people", "time": "by next year", "perfect": "will have hired"},
        {"action": "pay off the debt", "time": "by Q4", "perfect": "will have paid off"},
        {"action": "launch the app", "time": "by June", "perfect": "will have launched"},
        {"action": "expand to Asia", "time": "by then", "perfect": "will have expanded"}
    ],
    "time_markers": [
        {"marker": "By the time you arrive", "context": "I ___ (leave).", "ans": "will have left"},
        {"marker": "By next week", "context": "We ___ (sign) the contract.", "ans": "will have signed"},
        {"marker": "In two years", "context": "She ___ (complete) her MBA.", "ans": "will have completed"}
    ],
    "verbs_participle": [
        {"base": "do", "part": "done"},
        {"base": "write", "part": "written"},
        {"base": "see", "part": "seen"},
        {"base": "take", "part": "taken"},
        {"base": "speak", "part": "spoken"},
        {"base": "become", "part": "become"}
    ],
    "vocabulary_list": [
        {"word": "Milestone", "meaning": "A significant stage or event in the development of something.", "ipa": "/ˈmaɪlstoʊn/"},
        {"word": "Deadline", "meaning": "The latest time or date by which something should be completed.", "ipa": "/ˈdɛdlaɪn/"},
        {"word": "Roadmap", "meaning": "A plan or strategy intended to achieve a particular goal.", "ipa": "/ˈroʊdmæp/"},
        {"word": "Objective", "meaning": "A thing aimed at or sought; a goal.", "ipa": "/əbˈdʒɛktɪv/"}
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

def gen_future_perfect_grammar(idx):
    """(GRAMMAR) Estructura Will + Have + Participle."""
    item = random.choice(DB["milestones"])
    
    # "By Friday, we ___ the project."
    sentence = f"{item['time']}, we ___ {item['action'].replace('the ', 'the ')}." # Hack to keep object
    # Simplificamos: "By Friday, we ___ the project." -> "will have finished"
    
    # Extraer verbo base para distractores
    verb_base = item['action'].split(" ")[0]
    
    # Distractores
    options = [item["perfect"], f"will {verb_base}", f"have {verb_base}ed"]
    random.shuffle(options)
    
    return {
        "id": generate_unique_id("gram"),
        "type": "quiz_choice",
        "difficulty": "hard",
        "tags": ["grammar", "future_perfect"],
        "question": f"Complete the goal: \"{item['time']}, we ______.\"",
        "options": options,
        "correct_answer": item["perfect"],
        "explanation": f"Para metas completadas antes de una fecha futura, usamos Futuro Perfecto: {item['perfect']}."
    }

def gen_participle_match(idx):
    """(VOCAB) Participios irregulares."""
    verb = random.choice(DB["verbs_participle"])
    
    return {
        "id": generate_unique_id("part"),
        "type": "quiz_choice",
        "difficulty": "medium",
        "tags": ["grammar", "verbs"],
        "question": f"What is the Past Participle of **'{verb['base']}'**?",
        "options": [verb["part"], verb["base"] + "ed", verb["base"] + "en"],
        "correct_answer": verb["part"],
        "explanation": f"El participio de '{verb['base']}' es '{verb['part']}'."
    }

def gen_timeline_logic(idx):
    """(LOGIC) Entender la secuencia temporal."""
    # Logic: If I finish at 5PM, and it's now 3PM...
    scenarios = [
        {"txt": "I will finish at 5 PM. You arrive at 6 PM.", "q": "When you arrive, I...", "ans": "will have finished."},
        {"txt": "The meeting starts at 9 AM. I arrive at 9:30 AM.", "q": "When I arrive, the meeting...", "ans": "will have started."},
        {"txt": "We launch in June. It is now July.", "q": "By now, we...", "ans": "have launched."} # Present Perfect contrast
    ]
    s = random.choice(scenarios)
    
    return {
        "id": generate_unique_id("logic"),
        "type": "quiz_choice",
        "difficulty": "hard",
        "tags": ["logic", "tenses"],
        "question": f"Scenario: {s['txt']}\nConclusion: {s['q']}",
        "options": [s["ans"], "will finish", "starts"],
        "correct_answer": s["ans"],
        "explanation": "La acción se completa ANTES del tiempo de referencia."
    }

def gen_strategy_scramble(idx):
    """(SYNTAX) Ordenar una visión estratégica."""
    # "By 2030 we will have doubled our sales"
    parts = ["By 2030", "we", "will have", "doubled", "our sales"]
    scrambled = parts.copy()
    random.shuffle(scrambled)
    
    return {
        "id": generate_unique_id("ord"),
        "type": "order_sentence",
        "difficulty": "medium",
        "tags": ["syntax", "strategy"],
        "question": "Ordena la visión a largo plazo:",
        "parts": scrambled,
        "correct_order": parts,
        "explanation": "Estructura: Tiempo + Sujeto + Will Have + Participio + Objeto."
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
        "id": "pro-b1-7",
        "title": "Strategic Planning",
        "level": "B1",
        "cefr_code": "B1.2",
        "description": "Final del Nivel B1. Aprende a crear visiones a largo plazo usando el Futuro Perfecto.",
        "tags": ["strategy", "future_perfect", "business_planning", "milestones"],
        "duration_min": 50,
        "learning_objectives": ["Can use Future Perfect to describe completed future actions", "Can set long-term milestones", "Can explain a strategic roadmap"],
        "prerequisites": ["pro-b1-6"],
        "vocabulary_list": DB["vocabulary_list"],
        "theme_color": "#4F46E5", # Indigo (Vision/Future)
        "cultural_notes": "In strategic planning, clarity is key. Using 'will have done' shows confidence and commitment to a specific deadline.",
        "stages": []
    }

    # --- STAGE 1: LECTURE ---
    lesson["stages"].append({
        "id": "stage_intro",
        "type": "lecture",
        "title": "The Visionary Tense 🔮",
        "parts": [
            {
                "visual": "## Future Perfect\nSubject + **WILL HAVE** + **PARTICIPLE**\n\n* 'By 2030, we **will have grown**.'\n* 'By Friday, I **will have finished**.'",
                "audio_script": "Congratulations on reaching the end of Level B1. To be a visionary leader, you need the Future Perfect. It describes achievements that will be complete by a specific future date.",
                "duration": 20,
                "image_prompt": "A timeline chart showing the present and a flag in the future labeled 'Goal Achieved'."
            }
        ]
    })

    # --- BLOQUES DE EJERCICIOS (100 TOTAL) ---
    all_questions = []

    # Generamos 100 ejercicios mezclados
    for i in range(30): all_questions.append(gen_future_perfect_grammar(i)) # Gramática Clave
    for i in range(30): all_questions.append(gen_participle_match(i+30))    # Verbos
    for i in range(20): all_questions.append(gen_timeline_logic(i+60))      # Lógica
    for i in range(20): all_questions.append(gen_strategy_scramble(i+80))   # Sintaxis
    
    random.shuffle(all_questions)

    # Chunking en bloques de 20
    chunk_size = 20
    for i in range(0, len(all_questions), chunk_size):
        chunk = all_questions[i:i + chunk_size]
        block_num = (i // chunk_size) + 1
        
        lesson["stages"].append({
            "id": f"stage_practice_block_{block_num}",
            "type": "gamified_quiz",
            "title": f"Strategic Roadmap {block_num}",
            "description": f"Planificación estratégica {block_num}/5.",
            "xp_reward": 100 + (block_num * 10),
            "questions": chunk,
            "recommended_streak": 2
        })

    # --- BOSS STAGE: THE INVESTOR PITCH ---
    lesson["stages"].append({
        "id": "stage_boss",
        "type": "practice_chat",
        "title": "The 5-Year Plan",
        "scenario": "Un inversor te pregunta dónde estará la empresa en 5 años. Convéncelo.",
        "ai_system_prompt": """
        ROLE: Skeptical Investor.
        GOAL: Ask about the future.
        BEHAVIOR:
        1. Ask "Where will this company be in 5 years?".
        2. Expect answers with "We will have..." (e.g., "We will have opened 10 stores").
        3. If user uses simple future ("We will open"), say "Will you be finished by then?".
        4. Ask about revenue ("And what about profits?").
        """,
        "initial_message": "I'm interested in investing. But tell me, what will you have achieved by the year 2030?",
        "next_lesson_id": "pro-b2-1", # Salto al Nivel B2
        "confidence_score_enabled": True,
        "badge_reward": "Visionary Leader (B1 Completed)"
    })

    return lesson

# --- EXEC ---
if __name__ == "__main__":
    data = build_lesson()
    out_path = "backend/app/data/lessons/pro-b1-7.json"
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        
    print(f"✅ LECCIÓN B1-7 (TITANIUM) GENERADA CON ÉXITO.")
    print(f"📂 Ubicación: {out_path}")
    print(f"🔢 Total de Ejercicios: {sum(len(s.get('questions', [])) for s in data['stages'])}")