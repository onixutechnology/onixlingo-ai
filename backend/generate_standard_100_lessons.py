import json
import os
import shutil

# --- CONFIGURACIÓN DE RUTA ---
OUTPUT_DIR = "app/data/lessons"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# --- DEFINICIÓN DE TEMAS REALES PARA CADA NIVEL ---
TEMAS_A = [
    # Nivel A (Foundations & Survival) - 34 lecciones
    ("First Impressions", "Presentaciones básicas y saludos ejecutivos.", ["hello", "name", "nice to meet you"]),
    ("The Office Desk", "Objetos de oficina y vocabulario de trabajo elemental.", ["desk", "computer", "chair", "notebook"]),
    ("Daily Routines", "Hábitos de productividad diarios.", ["work", "start", "finish", "lunch"]),
    ("Telling Time", "Programación de horarios simples.", ["o'clock", "half past", "quarter to", "meeting"]),
    ("Numbers & Prices", "Cálculos básicos de costos y dinero.", ["dollars", "price", "cost", "total"]),
    ("Simple Directions", "Ubicación física en las oficinas.", ["left", "right", "straight", "second floor"]),
    ("Meeting the Team", "Estructura jerárquica básica del equipo.", ["manager", "colleague", "boss", "team"]),
    ("Food & Drink", "Ordenar alimentos en almuerzos de negocios rápidos.", ["coffee", "water", "menu", "bill"]),
    ("Business Travel Basics", "Logística elemental de aeropuertos.", ["ticket", "passport", "flight", "gate"]),
    ("Hotel Check-in", "Registrarse en recepciones de hotel.", ["room", "key", "check-in", "reservation"]),
    ("Writing Simple Emails", "Saludos y firmas de correo ejecutivo.", ["dear", "regards", "best", "attached"]),
    ("Describing a Product", "Adjetivos simples de productos.", ["good", "new", "fast", "cheap"]),
    ("Office Supplies", "Inventario y existencias básicas de papelería.", ["paper", "pen", "stapler", "folder"]),
    ("Calendars & Dates", "Días de la semana y meses de negocios.", ["monday", "friday", "month", "year"]),
    ("Basic Phone Skills", "Atender llamadas y tomar notas elementales.", ["hello", "speak", "message", "please"]),
    ("Weekly Review", "Revisión rápida de tareas realizadas.", ["done", "today", "yesterday", "pending"]),
    ("Personal Strengths", "Habilidades básicas de presentación personal.", ["organized", "focused", "creative", "punctual"]),
    ("The Working Week", "Diferenciar entre días laborales y fin de semana.", ["weekdays", "weekend", "workload", "free time"]),
    ("Making Appointments", "Agendar reuniones de uno a uno.", ["meet", "time", "date", "calendar"]),
    ("Client Introductions", "Presentar a un colega con un cliente.", ["this is", "partner", "client", "welcome"]),
    ("Talking about Weather", "Romper el hielo de manera elemental.", ["cold", "hot", "rainy", "sunny"]),
    ("Company Profile", "Describir el sector y tamaño básico de la empresa.", ["sell", "service", "employees", "office"]),
    ("At the Bank", "Transacciones y pagos simples.", ["account", "cash", "card", "deposit"]),
    ("Emergency Basics", "Reportar incidentes sencillos de oficina.", ["help", "lost", "broken", "leak"]),
    ("Job Titles", "Nombres de puestos en el organigrama corporativo.", ["director", "assistant", "engineer", "specialist"]),
    ("Socializing at Work", "Conversar con compañeros en la cafetería.", ["family", "hobby", "sport", "music"]),
    ("IT Support Basics", "Describir problemas simples de computadora.", ["slow", "password", "login", "restart"]),
    ("Office Layout", "Zonas comunes de la oficina.", ["kitchen", "restroom", "lobby", "conference room"]),
    ("Simple Orders", "Solicitudes directas a proveedores.", ["buy", "need", "delivery", "invoice"]),
    ("Commuting to Work", "Medios de transporte diarios.", ["subway", "train", "bus", "drive"]),
    ("Company History", "Hablar de la fundación en pasado simple elemental.", ["founded", "started", "opened", "years ago"]),
    ("Basic Agreements", "Aceptar y rechazar propuestas sencillas.", ["agree", "disagree", "yes", "no"]),
    ("Office Rules", "Políticas elementales de vestimenta y conducta.", ["dress code", "hours", "punctual", "breaks"]),
    ("Review Milestone A", "Consolidación de todo el vocabulario del Nivel A.", ["summary", "completed", "skills", "fluent"])
]

TEMAS_B = [
    # Nivel B (Operations & Professional) - 33 lecciones
    ("Leading a Team Sync", "Cómo estructurar juntas operativas semanales.", ["agenda", "updates", "tasks", "deadlines"]),
    ("Negotiation Skills 101", "Conceptos básicos para cerrar acuerdos.", ["offer", "counteroffer", "deal", "win-win"]),
    ("Formal Email Writing", "Uso de conectores lógicos profesionales.", ["therefore", "however", "furthermore", "regarding"]),
    ("Strategic Scheduling", "Negociar horarios de juntas globales.", ["time zone", "availability", "postpone", "confirm"]),
    ("Project Milestones", "Definición y seguimiento de entregables.", ["milestone", "kick-off", "launch", "pipeline"]),
    ("Giving Feedback", "Metodologías de feedback constructivo.", ["constructive", "improve", "strengths", "areas"]),
    ("Describing Data Trends", "Comparación de gráficos y estadísticas.", ["increase", "decrease", "stable", "fluctuate"]),
    ("Handling Client Objections", "Fórmulas de diplomacia ejecutiva.", ["understand", "however", "alternative", "solution"]),
    ("Job Interviews", "Responder preguntas de comportamiento laboral.", ["experience", "challenge", "resolution", "background"]),
    ("Business Trip Logistics", "Coordinación avanzada de itinerarios.", ["flight", "layover", "shuttle", "expense report"]),
    ("Marketing Strategy", "Estudio de las 4Ps del marketing.", ["price", "product", "promotion", "place"]),
    ("Budget Planning", "Estructuración de presupuestos anuales.", ["allocation", "expenditure", "revenue", "fiscal year"]),
    ("Tech Support Mastery", "Solución guiada de incidentes de IT.", ["reboot", "server", "connectivity", "troubleshoot"]),
    ("Corporate Values", "Definición de visión, misión y ética corporativa.", ["integrity", "innovation", "diversity", "commitment"]),
    ("Phone Etiquette", "Manejar transferencias y llamadas complejas.", ["hold", "transfer", "extension", "voicemail"]),
    ("Apologizing Professionally", "Redacción de disculpas formales ante fallos.", ["apologize", "inconvenience", "rectify", "assure"]),
    ("Conflict Resolution", "Herramientas de mediación y empatía corporativa.", ["disagreement", "perspective", "common ground", "resolve"]),
    ("Strategic Outsourcing", "Evaluación de proveedores externos.", ["vendor", "contract", "outsource", "cost-benefit"]),
    ("Product Launch", "Estrategia Go-to-Market.", ["target audience", "campaign", "awareness", "conversion"]),
    ("Supply Chain Basics", "Logística y flujo de mercancías.", ["inventory", "shipping", "supplier", "warehouse"]),
    ("Customer Satisfaction", "Métricas NPS y análisis de reseñas.", ["feedback", "retention", "loyalty", "score"]),
    ("Time Management", "Priorización de tareas urgentes vs importantes.", ["prioritize", "delegate", "efficient", "urgency"]),
    ("Strategic Benchmarking", "Comparar rendimientos contra competidores.", ["benchmark", "competitors", "market share", "leader"]),
    ("Contract Negotiations", "Revisión de términos clave en contratos.", ["terms", "termination", "liability", "clause"]),
    ("Risk Assessment", "Identificar amenazas de operación básicas.", ["risk", "mitigate", "exposure", "contingency"]),
    ("Equity & Shares", "Introducción al financiamiento corporativo.", ["shares", "stocks", "investors", "capital"]),
    ("Virtual Meetings", "Comandos verbales para Zoom/Teams.", ["mute", "share screen", "unmute", "breakout room"]),
    ("Professional Networking", "Discursos de elevador y conexiones en LinkedIn.", ["elevator pitch", "connection", "collaboration", "follow up"]),
    ("Market Research", "Análisis DAFO/SWOT en inglés.", ["strengths", "weaknesses", "opportunities", "threats"]),
    ("Talent Acquisition", "Políticas de reclutamiento y onboarding.", ["hiring", "onboarding", "candidate", "recruitment"]),
    ("Sales Pitch Mastery", "Técnicas de venta directa y persuasión.", ["benefits", "closing", "prospect", "commission"]),
    ("Office Ergonomics", "Salud ocupacional y productividad.", ["posture", "wellness", "break", "environment"]),
    ("Review Milestone B", "Evaluación de competencias gerenciales del Nivel B.", ["progress", "certified", "management", "competence"])
]

TEMAS_C = [
    # Nivel C (Management & Strategic Fluency) - 33 lecciones
    ("Global Market Analysis", "Evaluación macroeconómica y geopolítica de mercados.", ["macroeconomic", "tariffs", "geopolitical", "volatility"]),
    ("Crisis Management", "Comunicación ante desastres de marca y relaciones públicas.", ["crisis", "PR damage", "transparency", "containment"]),
    ("Financial Results Reporting", "EBITDA, balances generales y reportes de dividendos.", ["EBITDA", "dividend", "revenue", "margin"]),
    ("Mergers & Acquisitions", "Fusiones de corporativos y debida diligencia.", ["due diligence", "merger", "acquisition", "integration"]),
    ("Public Speaking Mastery", "Tácticas de retórica y persuasión ante audiencias masivas.", ["rhetoric", "engagement", "audience", "storytelling"]),
    ("Nuanced Negotiation", "Negociar concesiones difíciles bajo presión.", ["concession", "leveraged", "deadlock", "compromise"]),
    ("Legal Contracts Drafting", "Comprensión fina de cláusulas penales e indemnizaciones.", ["indemnity", "breach", "jurisdiction", "clause"]),
    ("ESG & Corporate Sustainability", "Gobernanza corporativa, huella de carbono y RSE.", ["sustainability", "governance", "ESG", "carbon footprint"]),
    ("Corporate Strategy & Pivot", "Reestructuración estratégica e innovación abierta.", ["strategic pivot", "disruption", "framework", "agile"]),
    ("IPO & Exit Strategies", "Salir a bolsa o estructurar adquisiciones hostiles.", ["IPO", "underwriter", "valuation", "exit strategy"]),
    ("Leadership Philosophy", "Modelos de liderazgo exponencial y mentoría.", ["exponential", "empowerment", "coaching", "visionary"]),
    ("Change Management", "Gestionar transiciones organizacionales globales.", ["change curve", "adoption", "resistance", "alignment"]),
    ("Investor Relations", "Cómo dar discursos convincentes ante accionistas VIP.", ["shareholders", "earnings call", "guidance", "dividend"]),
    ("Corporate Governance", "Políticas anticorrupción y cumplimiento normativo.", ["compliance", "ethical", "anti-corruption", "regulation"]),
    ("Succession Planning", "Elegir líderes sucesores en mesas directivas.", ["successor", "leadership pipeline", "executive search", "transition"]),
    ("AI & Tech Disruption", "Impacto de IA generativa en la cadena de valor.", ["generative AI", "disruption", "automation", "efficiency"]),
    ("Fintech & Blockchain", "Descentralización financiera y criptoactivos en tesorería.", ["fintech", "blockchain", "decentralization", "ledger"]),
    ("Biotech Innovations", "Desarrollo farmacéutico y patentes científicas.", ["patents", "biotech", "clinical trials", "FDA approval"]),
    ("Green Energy Transition", "Migrar operaciones corporativas a fuentes limpias.", ["renewable", "decarbonization", "wind power", "solar grid"]),
    ("Supply Chain Resilience", "Asegurar la cadena logística contra eventos de fuerza mayor.", ["resilience", "force majeure", "bottleneck", "logistics"]),
    ("Luxury Brand Management", "Mercadotecnia de alta gama y valor percibido.", ["high-end", "exclusivity", "prestige", "perceived value"]),
    ("Real Estate Investment", "Fideicomisos y portafolios de bienes raíces.", ["REIT", "yield", "appreciation", "portfolio"]),
    ("Venture Capital Pitching", "Levantar rondas de inversión Serie A/B.", ["Series A", "equity", "valuation", "term sheet"]),
    ("Cybersecurity Protocols", "Políticas corporativas contra ataques de ransomware.", ["ransomware", "phishing", "protocol", "encryption"]),
    ("Strategic Alliances", "Crear joint ventures estratégicos.", ["joint venture", "partnership", "synergy", "alliance"]),
    ("Intellectual Property", "Litigios marcarios y registros de derechos de autor.", ["trademark", "copyright", "litigation", "infringement"]),
    ("Executive Ghostwriting", "Redactar discursos para directores ejecutivos.", ["ghostwriting", "tone", "message", "keynote"]),
    ("Diplomatic Communication", "Mitigar hostilidades y manejar preguntas incómodas.", ["diplomatic", "tactful", "de-escalate", "neutral"]),
    ("The Power of Silence", "Uso estratégico de pausas en alta negociación.", ["strategic pause", "silence", "tension", "leverage"]),
    ("Diversity & Inclusion Strategy", "Políticas corporativas de equidad y pertenencia.", ["inclusion", "equity", "diversity", "belonging"]),
    ("E-commerce Scaling", "Logística transfronteriza y marketing automatizado.", ["cross-border", "scaling", "conversion rate", "omnichannel"]),
    ("Behavioral Economics", "Cómo influyen los sesgos cognitivos en el consumo.", ["cognitive bias", "choice architecture", "nudging", "irrationality"]),
    ("Milestone Capstone C", "Evaluación de competencias directivas globales.", ["capstone", "executive vision", "board of directors", "mastery"])
]

# --- MOTOR DE GENERACIÓN ---
def create_questions_for_lesson(lesson_id, title, vocabulary):
    # Genera 30 preguntas adaptadas al nivel
    # 10 quiz_choice
    # 10 order_sentence
    # 5 listening_match
    # 5 fill_input
    
    questions = []
    
    # 1. 10 QUIZ CHOICE
    for idx in range(1, 11):
        if idx == 1:
            q = f"What is the main purpose of '{title}'?"
            opts = ["To improve professional communication.", "To complete tasks without planning.", "To communicate casually with family.", "To bypass standard regulations."]
            ans = "To improve professional communication."
        elif idx == 2:
            q = f"Which key term is directly related to '{title}'?"
            opts = [f"The term '{vocabulary[0]}'.", "An informal slang word.", "A generic sports term.", "None of the above."]
            ans = f"The term '{vocabulary[0]}'."
        elif idx == 3:
            q = f"Complete: A professional always prioritizes clarity when managing ____."
            opts = ["responsibilities", "games", "sleep", "hobbies"]
            ans = "responsibilities"
        elif idx == 4:
            q = f"How should you introduce the topic of '{title}' in a meeting?"
            opts = ["Present key metrics and objective data.", "Use aggressive tones.", "Avoid discussing details.", "Speak as fast as possible."]
            ans = "Present key metrics and objective data."
        elif idx == 5:
            q = f"Translate the core business concept of '{vocabulary[-1]}' to Spanish context:"
            opts = [f"Contexto clave de '{vocabulary[-1]}'", "Algo no relacionado", "Jerga informal", "Una traducción literal errónea"]
            ans = f"Contexto clave de '{vocabulary[-1]}'"
        else:
            q = f"Which choice represents a best practice in '{title}'? [Question {idx}]"
            opts = ["Plan ahead and collaborate.", "Work in absolute isolation.", "Ignore stakeholder feedback.", "Deliver reports with delay."]
            ans = "Plan ahead and collaborate."
            
        questions.append({
            "id": f"{lesson_id}-q-choice-{idx}",
            "type": "quiz_choice",
            "question": q,
            "options": opts,
            "correct_answer": ans,
            "explanation": f"This question evaluates active corporate comprehension of '{title}'."
        })
        
    # 2. 10 ORDER SENTENCE
    for idx in range(1, 11):
        if idx == 1:
            parts = ["We", "must", "prioritize", "our", "main", "goals."]
        elif idx == 2:
            parts = ["Please", "review", "the", "latest", "project", "report."]
        elif idx == 3:
            parts = ["Our", "team", "delivers", "excellent", "business", "results."]
        elif idx == 4:
            parts = ["Let's", "schedule", "a", "follow", "up", "meeting."]
        elif idx == 5:
            parts = ["Can", "you", "confirm", "your", "current", "availability?"]
        else:
            parts = ["This", "strategy", "aligns", "with", "our", f"targets-{idx}."]
            
        questions.append({
            "id": f"{lesson_id}-q-order-{idx}",
            "type": "order_sentence",
            "question": f"Arrange the words to make a professional sentence: [Drill {idx}]",
            "parts": sorted(parts, key=lambda x: hash(x)),
            "correct_order": parts,
            "explanation": "Sentence structure precision is vital for professional communication."
        })
        
    # 3. 5 LISTENING MATCH
    for idx in range(1, 6):
        if idx == 1:
            tts = f"We are ready to launch {title} next week."
        elif idx == 2:
            tts = f"Please share the document with all team members."
        elif idx == 3:
            tts = f"Our main focus remains on customer success."
        elif idx == 4:
            tts = f"I look forward to our strategic partnership."
        else:
            tts = f"Let us analyze the final data metrics carefully."
            
        questions.append({
            "id": f"{lesson_id}-q-listening-{idx}",
            "type": "listening_match",
            "question": "Select exactly what you hear in the audio feed:",
            "tts_text": tts,
            "options": [tts, "An alternative incorrect audio simulation.", "A generic business phrase."],
            "correct_answer": tts,
            "explanation": "Listening accuracy tests your professional audio processing speed."
        })
        
    # 4. 5 FILL INPUT
    for idx in range(1, 6):
        if idx == 1:
            q = f"Complete the spelling of the corporate vocabulary: '{vocabulary[0][:3]}____' (Tip: refers to key concept)"
            ans = [vocabulary[0].lower(), vocabulary[0].capitalize()]
            hint = f"Starts with '{vocabulary[0][:3]}'"
        elif idx == 2:
            q = "Write the contraction of 'we are' in lower case:"
            ans = ["we're"]
            hint = "w_'_ _"
        elif idx == 3:
            q = "Complete: 'I look forward ____ hearing from you soon' (preposition)"
            ans = ["to"]
            hint = "t_"
        elif idx == 4:
            q = "Write the opposite of 'increase' in lower case:"
            ans = ["decrease"]
            hint = "d______e"
        else:
            q = f"Complete: 'The cost of this operation is too ____' (high / tall)"
            ans = ["high"]
            hint = "opposite of low"
            
        questions.append({
            "id": f"{lesson_id}-q-fill-{idx}",
            "type": "fill_input",
            "question": q,
            "correct_answers": ans,
            "hints": [hint],
            "explanation": "This exercise strengthens orthographic spelling and prepositional mastery."
        })
        
    return questions

def create_lesson(lesson_id, title, description, level, vocabulary):
    # Dificultad del nivel
    diff = "easy" if level == "A" else "medium" if level == "B" else "hard"
    
    stages = [
        # Etapa 1: Lecture (Teoría)
        {
            "id": "stg_theory",
            "type": "lecture",
            "title": f"Theory Core: {title}",
            "parts": [
                {
                    "visual": f"ONIXLINGO PROFESSIONAL ENGLISH SYSTEM\n\nNivel {level} • Lesson {lesson_id.upper()}\nTopic: {title}\n\nKey Concepts:\n- {vocabulary[0].capitalize()}\n- {vocabulary[1].capitalize()}\n- {vocabulary[2].capitalize()}\n\nStudy Principle:\nAlways frame your business message with a clear Subject, an Action Verb, and a precise Complement.",
                    "audio": f"Welcome to Lesson {lesson_id.upper()}. Let's explore the theory and key concepts of {title}."
                },
                {
                    "visual": f"VOCABULARY DEEP DIVE:\n\n1. {vocabulary[0].upper()}: Crucial concept for professional operations.\n2. {vocabulary[1].upper()}: Important parameter in executive planning.\n3. {vocabulary[2].upper()}: Key term for strategic coordination.",
                    "audio": f"Please repeat the key terms: {vocabulary[0]}, {vocabulary[1]}, and {vocabulary[2]}."
                },
                {
                    "visual": "BUSINESS ENGLISH GOLDEN FORMULA:\n\nSubject (Who) + Verb (What) + Professional Complement (Detail)\n\nExample:\n'Our team' (Subject) + 'prioritizes' (Verb) + 'efficient deadlines' (Complement).\n\nUse this formula in the upcoming exercises.",
                    "audio": "Remember the Golden Formula. It creates clear corporate communications."
                }
            ]
        },
        # Etapa 2: Drill 1 (Quiz Choice)
        {
            "id": "stg_drill_choice",
            "type": "gamified_quiz",
            "title": "Drill 1: Executive Vocabulary",
            "questions": [] # Se llena abajo
        },
        # Etapa 3: Drill 2 (Order Sentence)
        {
            "id": "stg_drill_order",
            "type": "gamified_quiz",
            "title": "Drill 2: Syntax Construction",
            "questions": [] # Se llena abajo
        },
        # Etapa 4: Drill 3 (Listening Match)
        {
            "id": "stg_drill_listening",
            "type": "gamified_quiz",
            "title": "Drill 3: Auditory Processing",
            "questions": [] # Se llena abajo
        },
        # Etapa 5: Drill 4 (Written Precision)
        {
            "id": "stg_drill_writing",
            "type": "gamified_quiz",
            "title": "Drill 4: Written Precision",
            "questions": [] # Se llena abajo
        }
    ]
    
    # Rellenar los drills con las preguntas correspondientes
    all_questions = create_questions_for_lesson(lesson_id, title, vocabulary)
    
    stages[1]["questions"] = all_questions[0:10]   # 10 choice
    stages[2]["questions"] = all_questions[10:20]  # 10 order
    stages[3]["questions"] = all_questions[20:25]  # 5 listening
    stages[4]["questions"] = all_questions[25:30]  # 5 writing
    
    return {
        "id": lesson_id,
        "version": "3.0-PRO",
        "title": title,
        "level": level,
        "description": description,
        "total_xp": 300,
        "difficulty": diff,
        "tags": [level.lower(), "standard", "english", "didactic", "grammar", "vocabulary"],
        "stages": stages
    }

def main():
    print("🧹 Borrando archivos estáticos redundantes en el backend...")
    
    # 1. Borrar JSONs antiguos
    archivos_borrar = [
        "a1-1.json", "a1-2.json", "a1-3.json", "a1-4.json", "a1-5.json", "a1-6.json", "a1-7.json",
        "a2-1.json", "a2-2.json", "a2-3.json", "a2-4.json", "a2-5.json", "a2-6.json", "a2-7.json",
        "b1-1.json", "b1-2.json", "b1-3.json", "b1-4.json", "b1-5.json", "b1-6.json", "b1-7.json"
    ]
    for fn in archivos_borrar:
        path = os.path.join(OUTPUT_DIR, fn)
        if os.path.exists(path):
            os.remove(path)
            print(f"  - Borrado: {path}")

    print("🚀 Generando 100 lecciones reales profesionales...")
    generados = 0
    
    # 2. Generar Nivel A (34 lecciones)
    for idx, (title, desc, vocab) in enumerate(TEMAS_A):
        num = idx + 1
        lesson_id = f"a-{num}"
        lesson_data = create_lesson(lesson_id, title, desc, "A", vocab)
        
        filename = os.path.join(OUTPUT_DIR, f"{lesson_id}.json")
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(lesson_data, f, indent=2, ensure_ascii=False)
        generados += 1
        
    # 3. Generar Nivel B (33 lecciones)
    for idx, (title, desc, vocab) in enumerate(TEMAS_B):
        num = idx + 1
        lesson_id = f"b-{num}"
        lesson_data = create_lesson(lesson_id, title, desc, "B", vocab)
        
        filename = os.path.join(OUTPUT_DIR, f"{lesson_id}.json")
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(lesson_data, f, indent=2, ensure_ascii=False)
        generados += 1
        
    # 4. Generar Nivel C (33 lecciones)
    for idx, (title, desc, vocab) in enumerate(TEMAS_C):
        num = idx + 1
        lesson_id = f"c-{num}"
        lesson_data = create_lesson(lesson_id, title, desc, "C", vocab)
        
        filename = os.path.join(OUTPUT_DIR, f"{lesson_id}.json")
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(lesson_data, f, indent=2, ensure_ascii=False)
        generados += 1

    print(f"\n✨ ¡ÉXITO! Se han generado {generados} lecciones profesionales en {OUTPUT_DIR}")

if __name__ == "__main__":
    main()
