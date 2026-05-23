import os
import json

# Master curriculum data
TEMAS_A = [
  ["First Impressions", "Presentaciones básicas y saludos ejecutivos.", "hello"],
  ["The Office Desk", "Objetos de oficina y vocabulario de trabajo elemental.", "desk"],
  ["Daily Routines", "Hábitos de productividad diarios.", "work"],
  ["Telling Time", "Programación de horarios simples.", "clock"],
  ["Numbers & Prices", "Cálculos básicos de costos y dinero.", "dollars"],
  ["Simple Directions", "Ubicación física en las oficinas.", "left"],
  ["Meeting the Team", "Estructura jerárquica básica del equipo.", "manager"],
  ["Food & Drink", "Ordenar alimentos en almuerzos de negocios rápidos.", "coffee"],
  ["Business Travel Basics", "Logística elemental de aeropuertos.", "ticket"],
  ["Hotel Check-in", "Registrarse en recepciones de hotel.", "room"],
  ["Writing Simple Emails", "Saludos y firmas de correo ejecutivo.", "email"],
  ["Describing a Product", "Adjetivos simples de productos.", "good"],
  ["Office Supplies", "Inventario y existencias básicas de papelería.", "paper"],
  ["Calendars & Dates", "Días de la semana y meses de negocios.", "monday"],
  ["Basic Phone Skills", "Atender llamadas y tomar notas elementales.", "phone"],
  ["Weekly Review", "Revisión rápida de tareas realizadas.", "done"],
  ["Personal Strengths", "Habilidades básicas de presentación personal.", "organized"],
  ["The Working Week", "Diferenciar entre días laborales y fin de semana.", "week"],
  ["Making Appointments", "Agendar reuniones de uno a uno.", "meet"],
  ["Client Introductions", "Presentar a un colega con un cliente.", "intro"],
  ["Talking about Weather", "Romper el hielo de manera elemental.", "weather"],
  ["Company Profile", "Describir el sector y tamaño básico de la empresa.", "company"],
  ["At the Bank", "Transacciones y pagos simples.", "bank"],
  ["Emergency Basics", "Reportar incidentes sencillos de oficina.", "help"],
  ["Job Titles", "Nombres de puestos en el organigrama corporativo.", "director"],
  ["Socializing at Work", "Conversar con compañeros en la cafetería.", "family"],
  ["IT Support Basics", "Describir problemas simples de computadora.", "computer"],
  ["Office Layout", "Zonas comunes de la oficina.", "layout"],
  ["Simple Orders", "Solicitudes directas a proveedores.", "order"],
  ["Commuting to Work", "Medios de transporte diarios.", "subway"],
  ["Company History", "Hablar de la fundación en pasado simple elemental.", "history"],
  ["Basic Agreements", "Aceptar y rechazar propuestas sencillas.", "agree"],
  ["Office Rules", "Políticas elementales de vestimenta y conducta.", "rules"],
  ["Review Milestone A", "Consolidación de todo el vocabulario del Nivel A.", "summary"]
]

TEMAS_B = [
  ["Leading a Team Sync", "Cómo estructurar juntas operativas semanales.", "agenda"],
  ["Negotiation Skills 101", "Conceptos básicos para cerrar acuerdos.", "offer"],
  ["Formal Email Writing", "Uso de conectores lógicos profesionales.", "formal"],
  ["Strategic Scheduling", "Negociar horarios de juntas globales.", "timezone"],
  ["Project Milestones", "Definición y seguimiento de entregables.", "milestone"],
  ["Giving Feedback", "Metodologías de feedback constructivo.", "feedback"],
  ["Describing Data Trends", "Comparación de gráficos y estadísticas.", "increase"],
  ["Handling Client Objections", "Fórmulas de diplomacia ejecutiva.", "client"],
  ["Job Interviews", "Responder preguntas de comportamiento laboral.", "experience"],
  ["Business Trip Logistics", "Coordinación avanzada de itinerarios.", "flight"],
  ["Marketing Strategy", "Estudio de las 4Ps del marketing.", "strategy"],
  ["Budget Planning", "Estructuración de presupuestos anuales.", "budget"],
  ["Tech Support Mastery", "Solución guiada de incidentes de IT.", "reboot"],
  ["Corporate Values", "Definición de visión, misión y ética corporativa.", "integrity"],
  ["Phone Etiquette", "Manejar transferencias y llamadas complejas.", "transfer"],
  ["Apologizing Professionally", "Redacción de disculpas formales ante fallos.", "apologize"],
  ["Conflict Resolution", "Herramientas de mediación y empatía corporativa.", "conflict"],
  ["Strategic Outsourcing", "Evaluación de proveedores externos.", "vendor"],
  ["Product Launch", "Estrategia Go-to-Market.", "launch"],
  ["Supply Chain Basics", "Logística y flujo de mercancías.", "inventory"],
  ["Customer Satisfaction", "Métricas NPS y análisis de reseñas.", "satisfaction"],
  ["Time Management", "Priorización de tareas urgentes vs importantes.", "prioritize"],
  ["Strategic Benchmarking", "Comparar rendimientos contra competidores.", "benchmark"],
  ["Contract Negotiations", "Revisión de términos clave en contratos.", "contract"],
  ["Risk Assessment", "Identificar amenazas de operación básicas.", "risk"],
  ["Equity & Shares", "Introducción al financiamiento corporativo.", "shares"],
  ["Virtual Meetings", "Comandos verbales para Zoom/Teams.", "mute"],
  ["Professional Networking", "Discursos de elevador y conexiones en LinkedIn.", "networking"],
  ["Market Research", "Análisis DAFO/SWOT en inglés.", "research"],
  ["Talent Acquisition", "Políticas de reclutamiento y onboarding.", "hiring"],
  ["Sales Pitch Mastery", "Técnicas de venta directa y persuasión.", "pitch"],
  ["Office Ergonomics", "Salud ocupacional y productividad.", "posture"],
  ["Review Milestone B", "Evaluación de competencias gerenciales del Nivel B.", "progress"]
]

TEMAS_C = [
  ["Global Market Analysis", "Evaluación macroeconómica y geopolítica de mercados.", "macroeconomic"],
  ["Crisis Management", "Comunicación ante desastres de marca y relaciones públicas.", "crisis"],
  ["Financial Results Reporting", "EBITDA, balances generales y reportes de dividendos.", "ebitda"],
  ["Mergers & Acquisitions", "Fusiones de corporativos y debida diligencia.", "merger"],
  ["Public Speaking Mastery", "Tácticas de retórica y persuasión ante audiencias masivas.", "rhetoric"],
  ["Nuanced Negotiation", "Negociar concesiones difíciles bajo presión.", "concession"],
  ["Legal Contracts Drafting", "Comprensión fina de cláusulas penales e indemnizaciones.", "indemnity"],
  ["ESG & Corporate Sustainability", "Gobernanza corporativa, huella de carbono y RSE.", "sustainability"],
  ["Corporate Strategy & Pivot", "Reestructuración estratégica e innovación abierta.", "pivot"],
  ["IPO & Exit Strategies", "Salir a bolsa o estructurar adquisiciones hostiles.", "ipo"],
  ["Leadership Philosophy", "Modelos de liderazgo exponencial y mentoría.", "leadership"],
  ["Change Management", "Gestionar transiciones organizacionales globales.", "transition"],
  ["Investor Relations", "Cómo dar discursos convincentes ante accionistas VIP.", "shareholders"],
  ["Corporate Governance", "Políticas anticorrupción y cumplimiento normativo.", "compliance"],
  ["Succession Planning", "Elegir líderes sucesores en mesas directivas.", "successor"],
  ["AI & Tech Disruption", "Impacto de IA generativa en la cadena de valor.", "technology"],
  ["Fintech & Blockchain", "Descentralización financiera y criptoactivos en tesorería.", "fintech"],
  ["Biotech Innovations", "Desarrollo farmacéutico y patentes científicas.", "patents"],
  ["Green Energy Transition", "Migrar operaciones corporativas a fuentes limpias.", "renewable"],
  ["Supply Chain Resilience", "Asegurar la cadena logística contra eventos de fuerza mayor.", "resilience"],
  ["Luxury Brand Management", "Mercadotecnia de alta gama y valor percibido.", "luxury"],
  ["Real Estate Investment", "Fideicomisos y portafolios de bienes raíces.", "reit"],
  ["Venture Capital Pitching", "Levantar rondas de inversión Serie A/B.", "venture"],
  ["Cybersecurity Protocols", "Políticas corporativas contra ataques de ransomware.", "ransomware"],
  ["Strategic Alliances", "Crear joint ventures estratégicos.", "alliance"],
  ["Intellectual Property", "Litigios marcarios y registros de derechos de autor.", "trademark"],
  ["Executive Ghostwriting", "Redactar discursos para directores ejecutivos.", "ghostwriting"],
  ["Diplomatic Communication", "Mitigar hostilidades y manejar preguntas incómodas.", "diplomatic"],
  ["The Power of Silence", "Uso estratégico de pausas en alta negociación.", "silence"],
  ["Diversity & Inclusion Strategy", "Políticas corporativas de equidad y pertenencia.", "inclusion"],
  ["E-commerce Scaling", "Logística transfronteriza y marketing automatizado.", "ecommerce"],
  ["Behavioral Economics", "Cómo influyen los sesgos cognitivos en el consumo.", "behavioral"],
  ["Milestone Capstone C", "Evaluación de competencias directivas globales.", "capstone"]
]

lessons_dir = "c:\\Users\\jeico\\onixlingo\\language-ai-tutor\\backend\\app\\data\\lessons"
os.makedirs(lessons_dir, exist_ok=True)

def generate_lesson_file(level, index, title, description, vocab):
    lesson_id = f"{level.lower()}-{index}"
    difficulty = "easy" if level == "A" else "medium" if level == "B" else "hard"
    
    # 1. Theory Stage
    theory_stage = {
        "id": "stg_theory",
        "type": "lecture",
        "title": f"Theory Core: {title}",
        "parts": [
            {
                "visual": f"ONIXLINGO PROFESSIONAL ENGLISH SYSTEM\n\nNivel {level} • Lesson {level}-{index}\nTopic: {title}\n\nKey Concepts:\n- {vocab.upper()}\n- Professional Application\n- Didactic Framework\n\nStudy Principle:\nEnsure absolute precision and professional communication style in all exercises.",
                "audio": f"Welcome to Lesson {level}-{index} covering {title}. Let us explore the theory and strategic application of our core vocabulary word: {vocab}."
            },
            {
                "visual": f"VOCABULARY CONTEXTUAL DEEP DIVE:\n\n1. {vocab.upper()}: Essential vocabulary element for this module.\n2. APPLICATION: Practical usage in professional environments.\n3. PROTOCOL: Aligning communication style with executive standards.",
                "audio": f"Please focus on our key term: {vocab}. It is highly important in professional contexts."
            },
            {
                "visual": f"BUSINESS ENGLISH STRATEGY:\n\nMaintain structured sentences using clear professional terminology. Avoid casual slang when discussing '{title}'.\n\nApply the key concept '{vocab}' to complete the subsequent exercises successfully.",
                "audio": f"Remember to prioritize structured clarity. Use the vocabulary word '{vocab}' to solve the drills."
            }
        ]
    }
    
    # 2. Choice Stage (10 Questions)
    choice_questions = []
    # Q1: Definition of the term
    choice_questions.append({
        "id": f"{lesson_id}-q-choice-1",
        "type": "quiz_choice",
        "question": f"What does the term '{vocab}' primarily refer to in the context of '{title}'?",
        "options": [
            f"The primary professional concept of {vocab} used in {title}.",
            f"A casual slang term that should be avoided in {title}.",
            f"An obsolete word that is no longer used in business.",
            f"A generic term with no specific meaning in {title}."
        ],
        "correct_answer": f"The primary professional concept of {vocab} used in {title}.",
        "explanation": f"Understanding the definition of '{vocab}' is fundamental to mastering '{title}'."
    })
    # Q2: Appropriate situation
    choice_questions.append({
        "id": f"{lesson_id}-q-choice-2",
        "type": "quiz_choice",
        "question": f"When is it most appropriate to use or address '{vocab}' during a business event?",
        "options": [
            f"When presenting key ideas related to '{title}' to stakeholders.",
            f"Only when communicating in an informal setting outside work.",
            f"When you want to intentionally confuse your colleagues.",
            f"Never, as '{vocab}' is not a professional term."
        ],
        "correct_answer": f"When presenting key ideas related to '{title}' to stakeholders.",
        "explanation": f"Addressing '{vocab}' in professional presentations improves overall communication regarding '{title}'."
    })
    # Q3: Best practice
    choice_questions.append({
        "id": f"{lesson_id}-q-choice-3",
        "type": "quiz_choice",
        "question": f"Which of the following is considered a best practice when managing '{title}'?",
        "options": [
            f"Prioritizing active alignment and utilizing '{vocab}' appropriately.",
            f"Bypassing all communication channels to save time.",
            f"Working in complete isolation without updating the team.",
            f"Ignoring the strategic value of '{vocab}' altogether."
        ],
        "correct_answer": f"Prioritizing active alignment and utilizing '{vocab}' appropriately.",
        "explanation": f"Active alignment and correct usage of '{vocab}' are key pillars of successful '{title}' execution."
    })
    # Q4: Common mistake
    choice_questions.append({
        "id": f"{lesson_id}-q-choice-4",
        "type": "quiz_choice",
        "question": f"What is a common mistake professionals make when dealing with '{title}'?",
        "options": [
            f"Misunderstanding the strategic role of '{vocab}' in the process.",
            f"Collaborating too much with other team members.",
            f"Preparing the meeting agenda too far in advance.",
            f"Documenting all decisions with high precision."
        ],
        "correct_answer": f"Misunderstanding the strategic role of '{vocab}' in the process.",
        "explanation": f"Failing to recognize the impact of '{vocab}' often leads to inefficient outcomes in '{title}'."
    })
    # Q5: Spanish context translation
    choice_questions.append({
        "id": f"{lesson_id}-q-choice-5",
        "type": "quiz_choice",
        "question": f"Translate or explain the core concept of '{vocab}' for a Spanish-speaking professional:",
        "options": [
            f"Representa el concepto clave de '{vocab}' adaptado al entorno de '{title}'.",
            f"Una palabra casual que significa algo gracioso.",
            f"Una traducción literal sin ningún sentido corporativo.",
            f"Un término técnico de programación no relacionado con el inglés."
        ],
        "correct_answer": f"Representa el concepto clave de '{vocab}' adaptado al entorno de '{title}'.",
        "explanation": f"Translating '{vocab}' requires understanding its practical business application within '{title}'."
    })
    # Q6: Strategy questions
    choice_questions.append({
        "id": f"{lesson_id}-q-choice-6",
        "type": "quiz_choice",
        "question": f"How does the concept of '{vocab}' help in optimizing business processes?",
        "options": [
            f"It provides a clear framework to coordinate '{title}' activities.",
            f"It allows teams to skip standard validation steps.",
            f"It encourages casual and unstructured email threads.",
            f"It increases the time required to complete simple projects."
        ],
        "correct_answer": f"It provides a clear framework to coordinate '{title}' activities.",
        "explanation": f"Using '{vocab}' as a benchmark optimizes workflows and coordination."
    })
    # Q7: Executive decision
    choice_questions.append({
        "id": f"{lesson_id}-q-choice-7",
        "type": "quiz_choice",
        "question": f"In a meeting discussing '{title}', how should an executive present '{vocab}'?",
        "options": [
            f"With clear metrics showing its impact on organizational goals.",
            f"By speaking quickly to avoid answering difficult questions.",
            f"As a minor detail that does not deserve much attention.",
            f"Without preparing any slides or supporting data."
        ],
        "correct_answer": f"With clear metrics showing its impact on organizational goals.",
        "explanation": f"Data-driven presentations of '{vocab}' ensure executive alignment and support."
    })
    # Q8: Collaboration
    choice_questions.append({
        "id": f"{lesson_id}-q-choice-8",
        "type": "quiz_choice",
        "question": f"When collaborating on tasks involving '{vocab}', what should team members do first?",
        "options": [
            f"Align on the key deliverables and define '{vocab}' milestones.",
            f"Start working immediately without assigning specific roles.",
            f"Postpone all discussions until the deadline is close.",
            f"Request an immediate budget expansion from the CFO."
        ],
        "correct_answer": f"Align on the key deliverables and define '{vocab}' milestones.",
        "explanation": f"Defining milestones related to '{vocab}' prevents project delays and confusion."
    })
    # Q9: Strategic benefit
    choice_questions.append({
        "id": f"{lesson_id}-q-choice-9",
        "type": "quiz_choice",
        "question": f"What is the primary benefit of mastering the vocabulary of '{title}'?",
        "options": [
            f"It enables seamless communication using professional words like '{vocab}'.",
            f"It guarantees an immediate salary promotion.",
            f"It allows you to bypass corporate compliance guidelines.",
            f"It reduces the necessity of holding weekly team syncs."
        ],
        "correct_answer": f"It enables seamless communication using professional words like '{vocab}'.",
        "explanation": f"Professional words like '{vocab}' are the building blocks of expert-level business English."
    })
    # Q10: Global alignment
    choice_questions.append({
        "id": f"{lesson_id}-q-choice-10",
        "type": "quiz_choice",
        "question": f"Why is global corporate alignment on '{vocab}' important for multinational companies?",
        "options": [
            f"It ensures standard interpretation across different regions.",
            f"It permits teams to use their local slangs in formal letters.",
            f"It limits the influence of the head office on subsidiaries.",
            f"It makes legal contracts shorter and less detailed."
        ],
        "correct_answer": f"It ensures standard interpretation across different regions.",
        "explanation": f"Standard interpretation of '{vocab}' prevents costly international communication errors."
    })
    
    # 3. Order Sentence Stage (10 Questions)
    order_questions = []
    
    # Level-specific templates
    if level == "A":
        templates = [
            (f"We say {vocab} in our meetings.", ["We", "say", vocab, "in", "our", "meetings."]),
            (f"This is my new {vocab}.", ["This", "is", "my", "new", f"{vocab}."]),
            (f"I need to check the {vocab}.", ["I", "need", "to", "check", "the", f"{vocab}."]),
            (f"Please present your {vocab} now.", ["Please", "present", "your", vocab, "now."]),
            (f"Our team prioritizes {vocab} every day.", ["Our", "team", "prioritizes", vocab, "every", "day."]),
            (f"Can you confirm the {vocab}?", ["Can", "you", "confirm", "the", f"{vocab}?"]),
            (f"We must organize the {vocab}.", ["We", "must", "organize", "the", f"{vocab}."]),
            (f"Let's review the {vocab} status.", ["Let's", "review", "the", vocab, "status."]),
            (f"They want to improve {vocab}.", ["They", "want", "to", "improve", f"{vocab}."]),
            (f"He works with {vocab} daily.", ["He", "works", "with", vocab, "daily."])
        ]
    elif level == "B":
        templates = [
            (f"We must implement {vocab} to optimize operations.", ["We", "must", "implement", vocab, "to", "optimize", "operations."]),
            (f"Our current strategy prioritizes {vocab} for the client.", ["Our", "current", "strategy", "prioritizes", vocab, "for", "the", "client."]),
            (f"Please coordinate with the team regarding {vocab}.", ["Please", "coordinate", "with", "the", "team", "regarding", f"{vocab}."]),
            (f"Let us schedule a meeting to discuss {vocab}.", ["Let", "us", "schedule", "a", "meeting", "to", "discuss", f"{vocab}."]),
            (f"The project manager requires a report on {vocab}.", ["The", "project", "manager", "requires", "a", "report", "on", f"{vocab}."]),
            (f"We need to analyze how {vocab} affects our budget.", ["We", "need", "to", "analyze", "how", vocab, "affects", "our", "budget."]),
            (f"Can you confirm the timeline for {vocab} delivery?", ["Can", "you", "confirm", "the", "timeline", "for", vocab, "delivery?"]),
            (f"This new initiative aligns with our {vocab} targets.", ["This", "new", "initiative", "aligns", "with", "our", vocab, "targets."]),
            (f"They have decided to outsource our {vocab} management.", ["They", "have", "decided", "to", "outsource", "our", vocab, "management."]),
            (f"We should focus on enhancing {vocab} in this quarter.", ["We", "should", "focus", "on", "enhancing", vocab, "in", "this", "quarter."])
        ]
    else: # Level C
        templates = [
            (f"Strategic alignment requires absolute compliance with {vocab} protocols.", ["Strategic", "alignment", "requires", "absolute", "compliance", "with", vocab, "protocols."]),
            (f"We are leveraging {vocab} to mitigate macroeconomic risks.", ["We", "are", "leveraging", vocab, "to", "mitigate", "macroeconomic", "risks."]),
            (f"The executive board prioritized {vocab} in the annual report.", ["The", "executive", "board", "prioritized", vocab, "in", "the", "annual", "report."]),
            (f"Our digital transformation pivot relies heavily on {vocab}.", ["Our", "digital", "transformation", "pivot", "relies", "heavily", "on", f"{vocab}."]),
            (f"A comprehensive audit revealed significant gaps in {vocab}.", ["A", "comprehensive", "audit", "revealed", "significant", "gaps", "in", f"{vocab}."]),
            (f"We must renegotiate contract clauses to safeguard {vocab}.", ["We", "must", "renegotiate", "contract", "clauses", "to", "safeguard", f"{vocab}."]),
            (f"The merger is designed to generate synergies in {vocab}.", ["The", "merger", "is", "designed", "to", "generate", "synergies", "in", f"{vocab}."]),
            (f"He delivered a persuasive speech regarding {vocab} sustainability.", ["He", "delivered", "a", "persuasive", "speech", "regarding", vocab, "sustainability."]),
            (f"Our joint venture will focus primarily on {vocab} innovation.", ["Our", "joint", "venture", "will", "focus", "primarily", "on", vocab, "innovation."]),
            (f"Regulatory compliance dictates that we secure {vocab} immediately.", ["Regulatory", "compliance", "dictates", "that", "we", "secure", vocab, "immediately."])
        ]
        
    for q_idx, (full_sentence, correct_order) in enumerate(templates):
        # Shuffled parts: just reverse or shift to shuffle simply but deterministically
        parts = correct_order.copy()
        if len(parts) > 3:
            # Shift the first two items to the end
            parts = parts[2:] + parts[:2]
        
        order_questions.append({
            "id": f"{lesson_id}-q-order-{q_idx+1}",
            "type": "order_sentence",
            "question": f"Arrange the words to make a professional sentence about '{vocab}' (Drill {q_idx+1}):",
            "parts": parts,
            "correct_order": correct_order,
            "explanation": f"Correct word order is vital to communicate concepts related to '{vocab}' clearly."
        })
        
    # 4. Listening Stage (5 Questions)
    listening_questions = []
    listening_sentences = [
        f"Our primary objective is to discuss '{vocab}' in detail.",
        f"Could you please clarify the status of '{vocab}'?",
        f"We are committed to improving our '{vocab}' metrics.",
        f"The client gave positive feedback about '{vocab}'.",
        f"Let's align our schedule to focus on '{vocab}'."
    ]
    for q_idx, text in enumerate(listening_sentences):
        listening_questions.append({
            "id": f"{lesson_id}-q-listening-{q_idx+1}",
            "type": "listening_match",
            "question": "Select exactly what you hear in the audio feed:",
            "tts_text": text,
            "options": [
                text,
                f"An alternative incorrect statement about '{vocab}'.",
                "A generic business statement unrelated to the topic."
            ],
            "correct_answer": text,
            "explanation": f"Listening accuracy ensures correct auditory comprehension of '{vocab}' in meetings."
        })
        
    # 5. Fill Input Stage (5 Questions)
    fill_questions = []
    # Q1: spelling of vocab
    spelling_part = vocab[:3] if len(vocab) >= 3 else vocab[:2]
    blank_suffix = "_" * (len(vocab) - len(spelling_part))
    fill_questions.append({
        "id": f"{lesson_id}-q-fill-1",
        "type": "fill_input",
        "question": f"Complete the spelling of the corporate vocabulary: '{spelling_part}{blank_suffix}' (Tip: refers to '{vocab}')",
        "correct_answers": [vocab, vocab.capitalize()],
        "hints": [f"Starts with '{spelling_part}'"],
        "explanation": f"This exercise tests your active orthographic spelling of '{vocab}'."
    })
    if level == "A":
        # Q2: preposition
        fill_questions.append({
            "id": f"{lesson_id}-q-fill-2",
            "type": "fill_input",
            "question": f"Complete the sentence: 'The team wants to discuss the new {vocab} ____ Monday morning.' (on / at)",
            "correct_answers": ["on"],
            "hints": ["Preposition used with days of the week"],
            "explanation": f"We use 'on' with specific days of the week like Monday morning to schedule our {vocab} sync."
        })
        # Q3: verb
        fill_questions.append({
            "id": f"{lesson_id}-q-fill-3",
            "type": "fill_input",
            "question": f"Complete the sentence: 'Please ____ sure to double-check the {vocab} details.' (make / take)",
            "correct_answers": ["make", "Make"],
            "hints": ["Starts with 'm'"],
            "explanation": f"The phrase 'make sure' is a standard business collocation meaning to ensure our {vocab} is accurate."
        })
        # Q4: noun
        fill_questions.append({
            "id": f"{lesson_id}-q-fill-4",
            "type": "fill_input",
            "question": f"Complete the sentence: 'We should schedule a brief ____ to review our {vocab} progress.' (meeting / card)",
            "correct_answers": ["meeting", "sync", "call"],
            "hints": ["A business gathering to discuss work items"],
            "explanation": f"A 'meeting' is a professional gathering to discuss work items like {vocab}."
        })
        # Q5: preposition
        fill_questions.append({
            "id": f"{lesson_id}-q-fill-5",
            "type": "fill_input",
            "question": f"Complete the sentence: 'We need a ____ report about the {vocab} status.' (clear / slow)",
            "correct_answers": ["clear"],
            "hints": ["Easy to understand and well-structured"],
            "explanation": f"In business, 'clear' reports are preferred to ensure everyone understands the {vocab} status."
        })
    elif level == "B":
        # Q2: preposition
        fill_questions.append({
            "id": f"{lesson_id}-q-fill-2",
            "type": "fill_input",
            "question": f"Complete the sentence: 'Our current strategy regarding {vocab} depends ____ team coordination.' (on / from)",
            "correct_answers": ["on"],
            "hints": ["Verb 'depend' preposition"],
            "explanation": f"The verb 'depend' is always followed by the preposition 'on' in professional English."
        })
        # Q3: verb
        fill_questions.append({
            "id": f"{lesson_id}-q-fill-3",
            "type": "fill_input",
            "question": f"Complete the sentence: 'We must ____ our resources to optimize {vocab} results.' (allocate / ignore)",
            "correct_answers": ["allocate", "Allocate"],
            "hints": ["To distribute or assign resources"],
            "explanation": f"To 'allocate' resources means to distribute or assign them for a specific business purpose like {vocab}."
        })
        # Q4: noun
        fill_questions.append({
            "id": f"{lesson_id}-q-fill-4",
            "type": "fill_input",
            "question": f"Complete the sentence: 'The department manager requested a detailed ____ on {vocab}.' (update / break)",
            "correct_answers": ["update", "report"],
            "hints": ["Latest status or progress report"],
            "explanation": f"An 'update' provides the latest status or progress on a corporate topic like {vocab}."
        })
        # Q5: preposition
        fill_questions.append({
            "id": f"{lesson_id}-q-fill-5",
            "type": "fill_input",
            "question": f"Complete the sentence: 'Establishing a ____ framework for {vocab} is our top priority.' (robust / simple)",
            "correct_answers": ["robust"],
            "hints": ["Strong, healthy and resilient"],
            "explanation": f"A 'robust' framework is strong, healthy, and capable of supporting complex operations around {vocab}."
        })
    else: # Level C
        # Q2: preposition
        fill_questions.append({
            "id": f"{lesson_id}-q-fill-2",
            "type": "fill_input",
            "question": f"Complete the sentence: 'The executive board expressed concerns ____ the implementation of {vocab}.' (about / to)",
            "correct_answers": ["about"],
            "hints": ["Expressing worry or concern"],
            "explanation": f"In formal writing, we express concern 'about' or 'over' an issue like the {vocab} deployment."
        })
        # Q3: verb
        fill_questions.append({
            "id": f"{lesson_id}-q-fill-3",
            "type": "fill_input",
            "question": f"Complete the sentence: 'We aim to ____ key synergies to drive {vocab} forward.' (leverage / reduce)",
            "correct_answers": ["leverage", "Leverage"],
            "hints": ["To use something to maximum advantage"],
            "explanation": f"To 'leverage' means to use something to maximum advantage, such as synergies to accelerate {vocab}."
        })
        # Q4: noun
        fill_questions.append({
            "id": f"{lesson_id}-q-fill-4",
            "type": "fill_input",
            "question": f"Complete the sentence: 'This strategic initiative represents a major ____ in our {vocab} model.' (paradigm / delay)",
            "correct_answers": ["paradigm"],
            "hints": ["A fundamental change in approach or model"],
            "explanation": f"A 'paradigm' shift or model is a fundamental change in approach or underlying assumptions regarding {vocab}."
        })
        # Q5: preposition
        fill_questions.append({
            "id": f"{lesson_id}-q-fill-5",
            "type": "fill_input",
            "question": f"Complete the sentence: 'The legal team requires a ____ analysis of the {vocab} regulations.' (comprehensive / quick)",
            "correct_answers": ["comprehensive"],
            "hints": ["Thorough, complete, and all-inclusive"],
            "explanation": f"A 'comprehensive' analysis is complete, thorough, and covers all relevant aspects of {vocab} regulations."
        })
    
    lesson_json = {
        "id": lesson_id,
        "version": "3.0-PRO",
        "title": title,
        "level": level,
        "description": description,
        "total_xp": 300,
        "difficulty": difficulty,
        "tags": [level.lower(), "standard", "english", "didactic", "grammar", "vocabulary"],
        "stages": [
            theory_stage,
            {
                "id": "stg_drill_choice",
                "type": "gamified_quiz",
                "title": "Drill 1: Executive Vocabulary",
                "questions": choice_questions
            },
            {
                "id": "stg_drill_order",
                "type": "gamified_quiz",
                "title": "Drill 2: Syntax Construction",
                "questions": order_questions
            },
            {
                "id": "stg_drill_listening",
                "type": "gamified_quiz",
                "title": "Drill 3: Auditory Processing",
                "questions": listening_questions
            },
            {
                "id": "stg_drill_writing",
                "type": "gamified_quiz",
                "title": "Drill 4: Written Precision",
                "questions": fill_questions
            }
        ]
    }
    
    # Save file
    file_path = os.path.join(lessons_dir, f"{lesson_id}.json")
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(lesson_json, f, indent=2, ensure_ascii=False)

def main():
    print("Generating 100 professional lessons...")
    count = 0
    # Level A
    for idx, item in enumerate(TEMAS_A):
        generate_lesson_file("A", idx + 1, item[0], item[1], item[2])
        count += 1
    # Level B
    for idx, item in enumerate(TEMAS_B):
        generate_lesson_file("B", idx + 1, item[0], item[1], item[2])
        count += 1
    # Level C
    for idx, item in enumerate(TEMAS_C):
        generate_lesson_file("C", idx + 1, item[0], item[1], item[2])
        count += 1
    print(f"Sucesfully generated {count} custom lessons JSON files.")

if __name__ == "__main__":
    main()
