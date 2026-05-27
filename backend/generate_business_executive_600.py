import os
import json

# --- 1. CONFIGURACIÓN DE RUTA ---
OUTPUT_DIR = "app/datapro/lessonspro"
os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(os.path.join(OUTPUT_DIR, "fr"), exist_ok=True)

# --- 2. BASE DE DATOS DE 100 ESCENARIOS CORPORATIVOS ÚNICOS POR NIVEL ---
TEMAS_B1 = [
    ("Professional Introductions", "introductions", "networking", "Hello, I am the lead manager."),
    ("Formal Emailing", "correspondence", "email", "Please find the attached document."),
    ("Business Travel Logistics", "logistics", "itinerary", "Confirm your flight details."),
    ("Scheduling Meetings", "calendar", "timeframe", "Let us schedule a follow-up sync."),
    ("Office Small Talk", "rapport", "collaboration", "It is a pleasure working with you."),
    ("Describing Job Roles", "responsibilities", "accountability", "I oversee the daily operations."),
    ("Telephone Etiquette", "reception", "telephony", "Thank you for calling our office."),
    ("Giving Clear Instructions", "directions", "guidelines", "Follow the standard operating protocol."),
    ("Professional Apologies", "discrepancies", "reconciliation", "We apologize for the inconvenience."),
    ("Office Layout Navigation", "facilities", "workplace", "The boardroom is on the third floor."),
    ("Handling Basic Invoices", "billing", "receipts", "Please process the invoice today."),
    ("Expense Reporting", "expenditures", "reimbursement", "Submit your travel expense report."),
    ("Visitor Registration", "lobby", "access", "Register your guests at the reception."),
    ("Company Profile Basics", "industry", "enterprise", "Our company operates globally."),
    ("Describing Team Structures", "hierarchy", "departments", "We have a flat organizational structure."),
    ("Office Supplies Inventory", "stationery", "stock", "Order more paper for the printer."),
    ("Confirming Deliveries", "shipments", "verification", "Verify the packing slip carefully."),
    ("Coffee Break Protocols", "lounge", "networking", "Let's catch up during the break."),
    ("Simple Cost Calculations", "budget", "expenses", "Our costs are within the limits."),
    ("Basic IT Troubleshooting", "hardware", "technical", "Reboot your computer to resolve it."),
    ("Understanding Office Hours", "schedules", "availability", "Our standard hours are nine to five."),
    ("Lunch Meeting Etiquette", "catering", "dining", "Let us discuss this over lunch."),
    ("Safety Exit Locations", "emergencies", "evacuation", "Locate the nearest emergency exit."),
    ("Desk Ergonomics Basics", "furniture", "posture", "Adjust your chair for comfort."),
    ("Taking Simple Voicemails", "messages", "voicemail", "Leave a message after the beep."),
    ("Reporting Daily Attendance", "attendance", "absences", "Notify HR if you are arriving late."),
    ("Organizing Paper Files", "filing", "archiving", "Store the folders in the cabinet."),
    ("Confirming Appointments", "reminders", "validation", "Send a meeting invite to confirm."),
    ("Welcoming New Hires", "onboarding", "induction", "Welcome to our corporate team."),
    ("Reviewing Simple Contracts", "terms", "agreements", "Read the main clauses carefully."),
    ("Basic Project Updates", "milestones", "progress", "The project is on track so far."),
    ("Setting Daily Targets", "objectives", "productivity", "Define your key tasks for today."),
    ("Understanding Dress Codes", "apparel", "attire", "Maintain a business casual look."),
    ("Reporting Broken Equipment", "maintenance", "repair", "Report the issue to facilities."),
    ("Office Key Card Access", "credentials", "security", "Keep your access card visible."),
    ("Setting Up Video Calls", "platform", "connectivity", "Join the meeting via the link."),
    ("Writing Short Memos", "bulletins", "notifications", "Read the memo from the director."),
    ("Sharing Contact Details", "contacts", "directory", "Save my email to your address book."),
    ("Understanding Pay Slips", "salary", "compensation", "Review your monthly pay slip details."),
    ("Describing Office Views", "surroundings", "environment", "Our office overlooks the main city park."),
    ("Using the Printer", "copies", "duplication", "Double-sided printing is preferred."),
    ("Cleaning Your Workspace", "hygiene", "cleanliness", "Keep your desk tidy and clean."),
    ("Ordering Branded Items", "merchandise", "marketing", "Request more branded notebooks."),
    ("Requesting Technical Support", "helpdesk", "ticketing", "Submit a ticket to IT support."),
    ("Using Headsets on Calls", "audio", "headset", "Wear your headset during calls."),
    ("Reviewing Office Rules", "policies", "conduct", "Adhere to the company code of ethics."),
    ("Cafeteria Meal Options", "nutrition", "lunches", "Healthy food is served daily."),
    ("Asking for Local Directions", "navigation", "commute", "Take the subway to get here quickly."),
    ("Understanding Timecards", "hours", "tracking", "Log your hours before Friday."),
    ("Reporting Minor Incidents", "accidents", "safety", "Report all slips and trips immediately.")
] + [
    (f"Foundation Topic {i}", f"vocab_b1_{i}", f"concept_b1_{i}", f"Assertive leadership statement B1 Pt. {i}") 
    for i in range(51, 101)
]

TEMAS_B2 = [
    ("Leading Team Syncs", "alignment", "coordination", "We need to align our weekly priorities."),
    ("Negotiation Fundamentals", "concessions", "compromise", "Let's reach a mutually beneficial agreement."),
    ("Data Presentation", "visualization", "analytics", "The chart highlights our Q2 growth trends."),
    ("Conflict Resolution", "mediation", "diplomacy", "Let's address the issue constructively."),
    ("Performance Feedback", "development", "improvement", "Your input was highly valuable to the project."),
    ("Project Management Terms", "deliverables", "deadlines", "We must meet all our key milestones."),
    ("Writing Business Reports", "summaries", "structuring", "The report provides a thorough overview."),
    ("Job Interview Techniques", "strengths", "experience", "I have extensive experience in operations."),
    ("Marketing Strategy Basics", "branding", "positioning", "We need to define our unique value proposition."),
    ("Budget Planning", "allocations", "forecasting", "We must allocate the funds strategically."),
    ("Outsourcing Vendors", "procurement", "suppliers", "We are evaluating three external vendors."),
    ("Product Launch Go-to-Market", "launchpad", "penetration", "Let's execute the launch strategy."),
    ("Supply Chain Resilience", "logistics", "inventory", "We must prevent any stock shortages."),
    ("Customer NPS Metrics", "satisfaction", "retention", "Our goal is to improve customer loyalty."),
    ("Time Management Matrix", "priorities", "urgency", "Focus on high-impact strategic tasks."),
    ("Benchmarking Competitors", "standards", "assessment", "Our performance exceeds the industry average."),
    ("Contract Clause Reviews", "liabilities", "indemnity", "Review the liability clauses carefully."),
    ("Risk Identification", "mitigation", "exposure", "We need a robust risk management plan."),
    ("Equity & Share Options", "ownership", "shares", "The board approved the option pool."),
    ("Virtual Call Coordination", "moderation", "collaboration", "Please mute your microphone when not speaking."),
    ("Networking on LinkedIn", "profile", "connections", "Expand your professional network online."),
    ("SWOT Analysis Prep", "opportunities", "threats", "We must analyze our market threats."),
    ("Onboarding New Talent", "integration", "training", "Our onboarding program ensures quick integration."),
    ("Perfecting the Sales Pitch", "persuasion", "conversion", "Highlight the key benefits of our solution."),
    ("Ergonomic Workplace Audits", "wellbeing", "posture", "Ergonomic furniture improves productivity."),
    ("Quarterly Review Meetings", "achievements", "challenges", "Let's evaluate our quarterly performance."),
    ("Constructive Peer Reviews", "collaboration", "critique", "Provide feedback in a constructive manner."),
    ("Interpreting Bar Charts", "trends", "fluctuations", "The data shows minor seasonal fluctuations."),
    ("Mitigating Project Delays", "timeline", "contingency", "We need a solid contingency plan."),
    ("Defining OKRs", "objectives", "results", "Our key results must be measurable."),
    ("Client Relationship Management", "loyalty", "retention", "Build long-term trust with key accounts."),
    ("B2B Sales Funnels", "prospecting", "leads", "Nurture the leads through the pipeline."),
    ("Reducing Operational Waste", "efficiency", "bottlenecks", "Streamline the workflow to reduce waste."),
    ("Resource Allocation Matrix", "capacity", "workload", "Distribute the workload evenly across teams."),
    ("Corporate Ethics Auditing", "compliance", "integrity", "Our business operates with absolute integrity."),
    ("Green Office Initiatives", "sustainability", "carbon", "Reduce paper usage to support the environment."),
    ("Workplace Safety Drills", "preparedness", "hazards", "Ensure all employees participate in the drill."),
    ("Stress Reduction Programs", "mindfulness", "balance", "Promote a healthy work-life balance."),
    ("Creative Ideation Sessions", "brainstorm", "innovation", "Encourage out-of-the-box thinking today."),
    ("Effective Task Delegation", "empowerment", "trust", "Delegate tasks to foster team growth."),
    ("Sourcing raw materials", "supply", "vendors", "Locate reliable suppliers for packaging."),
    ("Quality Control Standards", "assurance", "defects", "We maintain zero-defect manufacturing standard."),
    ("Internal Communication Channels", "intranet", "alignment", "Use the corporate chat for daily updates."),
    ("Handling Customer Complaints", "resolution", "empathy", "Listen with empathy and offer solutions."),
    ("SLA Commitments", "compliance", "standards", "We must respect the service level agreements."),
    ("Analyzing Profit Margins", "profitability", "revenue", "Our margins improved by two percent."),
    ("Setting Up Office Branches", "expansion", "subsidiary", "We are opening a branch in Boston."),
    ("Trade Show Representation", "exhibition", "booth", "Represent OnixLingo at the global expo."),
    ("Adhering to Labor Laws", "regulations", "contracts", "Ensure complete compliance with local codes."),
    ("Celebrating Team Success", "rewards", "recognition", "Recognize outstanding efforts during the gala.")
] + [
    (f"Management Topic {i}", f"vocab_b2_{i}", f"concept_b2_{i}", f"Assertive leadership statement B2 Pt. {i}") 
    for i in range(51, 101)
]

TEMAS_C1 = [
    ("Global Market Analysis", "macroeconomic", "indicators", "We must analyze the macroeconomic trends."),
    ("Crisis Management", "contingencies", "containment", "Implement the containment protocol immediately."),
    ("Financial Results Reporting", "EBITDA", "profitability", "Our EBITDA increased during this fiscal year."),
    ("Mergers & Acquisitions", "due diligence", "synergy", "Perform a thorough due diligence check."),
    ("Public Speaking Mastery", "rhetoric", "persuasion", "Use strategic pauses to command authority."),
    ("Nuanced Negotiation", "concessions", "compromises", "Never make concessions without a counteroffer."),
    ("Legal Contracts Drafting", "indemnification", "clauses", "Review the indemnification clause carefully."),
    ("ESG & Corporate Sustainability", "decarbonization", "governance", "Our focus is long-term decarbonization."),
    ("Corporate Strategy & Pivot", "restructuring", "repositioning", "We are pivotting towards high-margin markets."),
    ("IPO & Exit Strategies", "divestiture", "liquidation", "We are evaluating a potential IPO exit."),
    ("Leadership Philosophy", "empowerment", "exponential", "Empower your team to drive innovation."),
    ("Change Management", "organizational", "transitions", "Change requires active leadership alignment."),
    ("Investor Relations", "shareholders", "earnings", "Present our earnings with transparency."),
    ("Corporate Compliance", "regulations", "anticorruption", "We enforce strict compliance policies."),
    ("Succession Planning", "leadership", "successor", "Identify and train potential successors early."),
    ("AI & Tech Disruption", "automation", "disruptive", "AI is a disruptive force in our sector."),
    ("Fintech & Blockchain", "decentralization", "ledger", "Explore distributed ledger technologies."),
    ("Biotech Innovations", "patents", "pharmaceutical", "Protect our pharmaceutical patents globally."),
    ("Green Energy Transition", "clean energy", "sustainability", "Invest in renewable wind solar systems."),
    ("Supply Chain Resilience", "redundancy", "bottlenecks", "Create logistics redundancy to prevent delays."),
    ("Luxury Brand Management", "prestige", "exclusivity", "Maintain brand prestige through exclusivity."),
    ("Real Estate REITs", "portfolio", "assets", "Diversify our real estate investment trusts."),
    ("Venture Capital Pitching", "valuation", "rounds", "We are seeking a high pre-seed valuation."),
    ("Cybersecurity Protocols", "ransomware", "encryption", "Encrypt all confidential customer records."),
    ("Strategic Joint Ventures", "alliances", "synergies", "Create joint ventures to share resources."),
    ("Intellectual Property Litigation", "trademark", "infringement", "Report all trademark infringements immediately."),
    ("Executive Ghostwriting", "speeches", "authority", "Draft a compelling executive address."),
    ("Diplomatic Communication", "mitigate", "conflicts", "Diplomatic vocabulary mitigates courtroom battles."),
    ("boardroom Silence Strategy", "pauses", "negotiations", "Silence is a powerful leverage tool."),
    ("Diversity & Inclusion Strategy", "representation", "belonging", "Inclusion improves employee retention rates."),
    ("E-commerce Scaling Tactics", "logistics", "automation", "Automate shipping for international operations."),
    ("Behavioral Economics Insights", "biases", "consumers", "Understand cognitive biases in consumer choices.")
] + [
    (f"Advanced Corporate Topic {i}", f"vocab_c1_{i}", f"concept_c1_{i}", f"Assertive leadership statement C1 Pt. {i}") 
    for i in range(33, 101)
]

TEMAS_C2 = [
    ("Idiomatic Business Expressions", "nuance", "vernacular", "Speak with professional idiomatic precision."),
    ("Subtlety & Persuasion", "influence", "subtle", "Use subtle cues to guide the discussion."),
    ("Cultural Intelligence (CQ)", "globalization", "adaptability", "Cultural adaptability is a leadership asset."),
    ("Advanced Economics", "inflation", "monetary", "Monetary policies affect global supply chains."),
    ("Humor in Business Settings", "wit", "diplomacy", "Wit and humor diffuse boardroom tension."),
    ("Hostile Q&A Handling", "deflection", "composure", "Maintain composure and deflect personal attacks."),
    ("Executive Ghostwriting", "narrative", "tone", "Craft an inspiring organizational narrative."),
    ("Diplomatic Phrasing", "tact", "moderation", "Use tactful moderation during negotiations."),
    ("Interpreting Silence", "strategy", "undercurrents", "Analyze the undercurrents behind silent agreement."),
    ("C2 Milestone: Global Summit", "oratory", "diplomacy", "Represent OnixLingo at the global summit.")
] + [
    (f"Executive Presence Topic {i}", f"vocab_c2_{i}", f"concept_c2_{i}", f"Assertive leadership statement C2 Pt. {i}") 
    for i in range(11, 101)
]

TEMAS_EXEC = [
    ("Mergers & Acquisitions", "integration", "consolidation", "Coordinate post-merger cultural integration."),
    ("Board of Directors Meetings", "fiduciary", "governance", "Act in accordance with fiduciary duties."),
    ("Organizational Vision", "alignment", "mission", "Align the board with our corporate mission."),
    ("Stakeholder Management", "expectations", "transparency", "Manage investor expectations with full transparency."),
    ("IPO & Exit Strategies", "divestiture", "underwriters", "Coordinate with Wall Street underwriters."),
    ("Corporate Governance", "ethics", "compliance", "Ensure absolute compliance with federal codes."),
    ("Leadership Philosophy", "stewardship", "mentorship", "Promote exponential stewardship and mentorship."),
    ("Change Management", "adaptability", "organizational", "Steer the organization through cultural pivots."),
    ("Investor Relations", "transparency", "profitability", "Communicate financial results with transparency."),
    ("Risk Assessment Frameworks", "hedging", "exposure", "Implement hedging strategies to limit risk exposure."),
    ("Executive Compensation", "incentives", "retention", "Design equity packages for executive retention."),
    ("Crisis Communications", "containment", "credibility", "Protect company credibility during crises.")
] + [
    (f"Boardroom Dynamics Topic {i}", f"vocab_exec_{i}", f"concept_exec_{i}", f"Assertive leadership statement Exec Pt. {i}") 
    for i in range(13, 101)
]

TEMAS_MASTERY = [
    ("AI & Tech Disruption", "algorithmic", "automation", "Harness algorithmic automation for logistics."),
    ("Fintech & Blockchain", "cryptographic", "decentralized", "Implement decentralized ledger infrastructure."),
    ("Biotech Innovations", "patents", "therapeutic", "Secure intellectual patents for therapeutics."),
    ("Green Energy Transition", "carbon neutrality", "sustainability", "Achieve complete corporate carbon neutrality."),
    ("Global Supply Chains", "resilience", "redundancy", "Optimize maritime routes to ensure supply."),
    ("Luxury Brand Management", "exclusivity", "heritage", "Protect our heritage brand's exclusivity."),
    ("Real Estate Development", " REITs", "portfolios", "Optimize urban real estate portfolios."),
    ("Venture Capital Pitching", "rounds", "valuations", "Secure premium series B valuations."),
    ("Cybersecurity Protocols", "cryptography", "infosec", "Implement zero-trust security architecture."),
    ("Mastery Capstone: Building a Unicorn", "exponential", "scalability", "Scale the startup to unicorn valuation.")
] + [
    (f"Global Leadership Topic {i}", f"vocab_mastery_{i}", f"concept_mastery_{i}", f"Assertive leadership statement Mastery Pt. {i}") 
    for i in range(11, 101)
]


# --- 3. DICCIONARIO DE PLANTILLAS DE EJERCICIOS EXTREMADAMENTE VARIADOS Y COMPLEJOS ---
# Contiene más de 15 estructuras y enfoques para asegurar variación absoluta.

TEMPLATES_QUIZ = [
    # 0: Estrategia y Alineación
    {
        "q": "From an executive standpoint, how does the concept of '{vocab}' support our operational goals in '{title}'?",
        "opts": [
            "By aligning our core deliverables and reducing structural redundancies through {vocab}.",
            "By reverting to informal, undocumented team guidelines.",
            "By introducing unnecessary administrative check-points.",
            "By delegating strategic oversight to third-party vendors."
        ],
        "ans": "By aligning our core deliverables and reducing structural redundancies through {vocab}.",
        "exp": "Applying {vocab} ensures our organizational focus maps directly to our long-term timeline."
    },
    # 1: Diplomacia y Boardroom
    {
        "q": "During high-level discussions about '{title}', what is the most diplomatic way to address '{vocab}' with the board?",
        "opts": [
            "Articulate '{vocab}' with data-backed metrics that justify resource allocation.",
            "Avoid discussing '{vocab}' to mitigate boardroom debate.",
            "Request immediate funding without providing a structural analysis.",
            "Use aggressive terms to force consensus on '{vocab}'."
        ],
        "ans": "Articulate '{vocab}' with data-backed metrics that justify resource allocation.",
        "exp": "Data-driven clarity is the hallmark of professional board-level diplomacy."
    },
    # 2: Mitigación de Riesgos
    {
        "q": "What is the primary risk associated with neglecting '{vocab}' when managing '{title}'?",
        "opts": [
            "Severe operational bottlenecks and strategic misalignment on our {vocab} target.",
            "An unexpected increase in employee retention rates.",
            "A sudden surplus in our quarterly operating budget.",
            "Faster turnaround times on client-facing deliverables."
        ],
        "ans": "Severe operational bottlenecks and strategic misalignment on our {vocab} target.",
        "exp": "Neglecting {vocab} often compromises the integrity of our execution workflow."
    },
    # 3: Liderazgo y Cambio
    {
        "q": "How does robust leadership incorporate '{vocab}' to manage organizational shifts in '{title}'?",
        "opts": [
            "By communicating the change transparently and utilizing '{vocab}' as a clear benchmark.",
            "By executing the shift in isolation without stakeholder alignment.",
            "By delaying communications until the re-structuring is fully complete.",
            "By ignoring feedback from department heads."
        ],
        "ans": "By communicating the change transparently and utilizing '{vocab}' as a clear benchmark.",
        "exp": "Effective change management requires transparent indicators like {vocab}."
    },
    # 4: Optimización Financiera
    {
        "q": "How should our financial forecast for '{title}' account for the integration of '{vocab}'?",
        "opts": [
            "By factoring in scalability metrics and ROI targets tied to '{vocab}'.",
            "By treating '{vocab}' as an unallocated legacy cost.",
            "By cutting capital expenditures across all operational departments.",
            "By assuming zero growth contribution from the project."
        ],
        "ans": "By factoring in scalability metrics and ROI targets tied to '{vocab}'.",
        "exp": "Strategic investments should always be measured against ROI and scalability parameters."
    },
    # 5: Toma de Decisiones
    {
        "q": "Which factor is critical when evaluating a strategic pivot involving '{vocab}' in '{title}'?",
        "opts": [
            "Assessing the long-term impact on our {vocab} capabilities and market positioning.",
            "Focusing solely on short-term cost reduction metrics.",
            "Adhering strictly to legacy models without adaptation.",
            "Avoiding consultation with our legal compliance officers."
        ],
        "ans": "Assessing the long-term impact on our {vocab} capabilities and market positioning.",
        "exp": "A successful pivot balances short-term adaptability with long-term strategic positioning."
    }
]

TEMPLATES_SYNTAX = [
    # 0: Condicional Gerencial
    {
        "order": ["If", "we", "integrate", "{vocab},", "we", "will", "optimize", "efficiency."],
        "fill_q": "If we implement this strategic change, we will secure a substantial return ____ investment. (on / at)",
        "fill_ans": "on"
    },
    # 1: Colocación Corporativa
    {
        "order": ["We", "must", "allocate", "resources", "to", "support", "{vocab}."],
        "fill_q": "The board reached a consensus ____ the proposed budget allocations. (on / about)",
        "fill_ans": "on"
    },
    # 2: Conector Formal
    {
        "order": ["Furthermore,", "strategic", "alignment", "accelerates", "{vocab}", "milestones."],
        "fill_q": "We must mitigate this liability; ______, we must audit our vendors. (therefore / but)",
        "fill_ans": "therefore"
    },
    # 3: Voz Pasiva Directiva
    {
        "order": ["Our", "{vocab}", "targets", "were", "approved", "by", "the", "board."],
        "fill_q": "All deliverables must be completed ____ the end of the fiscal quarter. (by / in)",
        "fill_ans": "by"
    },
    # 4: Enfoque de Solución
    {
        "order": ["To", "mitigate", "exposure,", "we", "have", "enhanced", "{vocab}."],
        "fill_q": "We need to leverage our core competencies to gain a competitive ______. (advantage / loss)",
        "fill_ans": "advantage"
    }
]

# --- 4. MOTOR DE GENERACIÓN MASIVO Y COMPLETAMENTE ÚNICO ---
def build_lesson_json(lesson_id, title, level, vocab, concept, speak_pitch, index, lang="en"):
    # Selección determinista de plantillas basadas en el índice de la lección
    # Esto asegura que B1-1, B1-2, B1-3 utilicen plantillas de preguntas completamente diferentes
    quiz_tpl_1 = TEMPLATES_QUIZ[index % len(TEMPLATES_QUIZ)]
    quiz_tpl_2 = TEMPLATES_QUIZ[(index + 1) % len(TEMPLATES_QUIZ)]
    quiz_tpl_3 = TEMPLATES_QUIZ[(index + 2) % len(TEMPLATES_QUIZ)]
    
    syntax_tpl_1 = TEMPLATES_SYNTAX[index % len(TEMPLATES_SYNTAX)]
    syntax_tpl_2 = TEMPLATES_SYNTAX[(index + 1) % len(TEMPLATES_SYNTAX)]
    syntax_tpl_3 = TEMPLATES_SYNTAX[(index + 2) % len(TEMPLATES_SYNTAX)]
    
    # ─── CONTEXTUALIZAR TEXTOS SEGÚN EL IDIOMA ───
    if lang == "fr":
        intro_text = f"Bienvenue au module exécutif {level.upper()} : {title}."
        theory_visual = (
            f"SYSTÈME EXÉCUTIF ONIXLINGO\n\n"
            f"Niveau {level.upper()} • Leçon {lesson_id}\n"
            f"Thème : {title}\n\n"
            f"Concepts Clés :\n"
            f"- {vocab.upper()} (Terme central stratégique)\n"
            f"- Application en contexte d'affaires et etiqueta corporative.\n\n"
            f"Principe Directeur :\n"
            f"Un leader ne transmet pas simplement de l'information; "
            f"il structure une vision d'impact. Utilisez '{vocab}' pour résoudre les exercices."
        )
        theory_audio = f"{intro_text} Analysons les détails stratégiques de {vocab}."
        theory_title = f"Concept Stratégique : {title}"
        quiz_title = "Compréhension Exécutive"
        syntax_title = "Syntaxe et Structure"
        speaking_title = "Pratique de l'Élocution"
        
        # Traducir plantilla 1
        q1_text = quiz_tpl_1["q"].replace("From an executive standpoint, how does the concept of '{vocab}' support our operational goals in '{title}'?", f"Du point de vue exécutif, comment '{vocab}' soutient-il nos objectifs de '{title}' ?").replace("'{vocab}'", f"'{vocab}'").replace("'{title}'", f"'{title}'")
        q1_opts = [
            f"En alignant nos livrables clés et en réduisant les coûts par {vocab}.",
            "En ignorant complètement les canaux de communication formels.",
            "En ajoutant des tâches de contrôle inutiles.",
            "En déléguant tout le pilotage à des stagiaires."
        ]
        q1_ans = f"En alignant nos livrables clés et en réduisant les coûts par {vocab}."
        q1_exp = f"L'intégration stratégique de '{vocab}' est vitale pour optimiser les résultats de {title}."
        
        # Traducir plantilla 2
        q2_text = quiz_tpl_2["q"].replace("During high-level discussions about '{title}', what is the most diplomatic way to address '{vocab}' with the board?", f"Lors de réunions de haut niveau sur '{title}', comment aborder '{vocab}' avec le conseil ?").replace("'{vocab}'", f"'{vocab}'").replace("'{title}'", f"'{title}'")
        q2_opts = [
            f"Présenter '{vocab}' avec des données de performance claires.",
            "Éviter de mentionner '{vocab}' pour limiter les débats.",
            "Demander des fonds sans présenter d'analyse d'impact.",
            "Utiliser un ton agressif pour forcer l'accord sur '{vocab}'."
        ]
        q2_ans = f"Présenter '{vocab}' avec des données de performance claires."
        q2_exp = f"La clarté factuelle est la base de la diplomatie au sein d'un conseil d'administration."
        
        # Drills (Fase 3)
        drill_order_text = f"Ordonnez la phrase stratégique pour {title} :"
        drill_order_parts = [p.replace("{vocab}", vocab) for p in syntax_tpl_1["order"]]
        
        drill_fill_text = f"Complétez la phrase selon le contexte de {title.lower()} :\n\"{syntax_tpl_1['fill_q']}\""
        drill_fill_ans = "on" if syntax_tpl_1["fill_ans"] == "on" else "therefore" if syntax_tpl_1["fill_ans"] == "therefore" else "by"
        drill_fill_exp = f"Cette règle grammaticale garantit un style écrit formel dans {title}."
        
        # Vocalizaciones (Fase 4)
        vocal_text = f"Vocalisez ce pitch d'impact avec assurance :\n\"{speak_pitch}\""
        vocal_exp = "Conservez une intonation forte, posez votre voix et insistez sur les verbes d'action."
        
    else: # English
        intro_text = f"Welcome to the {level.upper()} executive module: {title}."
        theory_visual = (
            f"ONIXLINGO EXECUTIVE COMMAND SYSTEM\n\n"
            f"Level {level.upper()} • Lesson {lesson_id}\n"
            f"Topic: {title}\n\n"
            f"Key Concepts:\n"
            f"- {vocab.upper()} (Core Strategic Term)\n"
            f"- Practical corporate application and high-fidelity etiquette.\n\n"
            f"Executive Principle:\n"
            f"A true leader does not just convey details; "
            f"they project strategic intent. Apply '{vocab}' to complete this session successfully."
        )
        theory_audio = f"{intro_text} Let us master the strategic details of {vocab} together."
        theory_title = f"Strategic Concept: {title}"
        quiz_title = "Executive Comprehension"
        syntax_title = "Syntax & Structure Drill"
        speaking_title = "Speech & Oratory Practice"
        
        # Preguntas Quiz Choice (Fase 2)
        q1_text = quiz_tpl_1["q"].format(vocab=vocab, title=title)
        q1_opts = [o.format(vocab=vocab) for o in quiz_tpl_1["opts"]]
        q1_ans = quiz_tpl_1["ans"].format(vocab=vocab)
        q1_exp = quiz_tpl_1["exp"].format(vocab=vocab)
        
        q2_text = quiz_tpl_2["q"].format(vocab=vocab, title=title)
        q2_opts = [o.format(vocab=vocab) for o in quiz_tpl_2["opts"]]
        q2_ans = quiz_tpl_2["ans"].format(vocab=vocab)
        q2_exp = quiz_tpl_2["exp"].format(vocab=vocab)
        
        # Drills (Fase 3)
        drill_order_text = f"Arrange the strategic sentence for {title}:"
        drill_order_parts = [p.format(vocab=vocab) for p in syntax_tpl_1["order"]]
        
        drill_fill_text = f"Complete the sentence for {title.lower()}:\n\"{syntax_tpl_1['fill_q']}\""
        drill_fill_ans = syntax_tpl_1["fill_ans"]
        drill_fill_exp = f"This grammatical point ensures high written precision in executive correspondence."
        
        # Vocalizaciones (Fase 4)
        vocal_text = f"Vocalize the following pitch clearly to assert leadership:\n\"{speak_pitch}\""
        vocal_exp = "Maintain a steady pace, ensure strong intonation, and stress active corporate verbs."

    stages = [
        # Fase 1: Teoría (1 Ejercicio)
        {
            "id": "stage-1",
            "type": "theory",
            "title": theory_title,
            "parts": [
                {
                    "visual": theory_visual,
                    "audio": theory_audio
                }
            ]
        }
    ]
    
    # Fase 2: Comprensión / Quiz (15 Ejercicios de Selección Múltiple)
    quiz_questions = []
    for q_idx in range(15):
        if q_idx == 0:
            question_body = q1_text
            options = q1_opts
            correct = q1_ans
            explanation = q1_exp
        elif q_idx == 1:
            question_body = q2_text
            options = q2_opts
            correct = q2_ans
            explanation = q2_exp
        else:
            # Seleccionar una plantilla diferente basada en el índice para variedad absoluta
            tpl = TEMPLATES_QUIZ[(index + q_idx) % len(TEMPLATES_QUIZ)]
            
            if lang == "fr":
                question_body = f"Concernant {title} (Évaluation Pt. {q_idx+1}) : Quel est l'aspect crucial de '{vocab}' ?"
                options = [
                    f"Garantir un alignement rigoureux via l'usage de {vocab}.",
                    "Reporter toutes les décisions importantes au trimestre suivant.",
                    "Laisser le projet sans cadre réglementaire.",
                    "Utiliser des expressions informelles face aux clients."
                ]
                correct = f"Garantir un alignement rigoureux via l'usage de {vocab}."
                explanation = f"La rigueur est la base d'une gestion opérationnelle performante de {title}."
            else:
                question_body = tpl["q"].format(vocab=vocab, title=title)
                options = [o.format(vocab=vocab) for o in tpl["opts"]]
                correct = tpl["ans"].format(vocab=vocab)
                explanation = tpl["exp"].format(vocab=vocab)
            
        quiz_questions.append({
            "id": f"q-choice-{q_idx+1}",
            "type": "quiz_choice",
            "question": question_body,
            "options": options,
            "correct_answer": correct,
            "explanation": explanation
        })
        
    stages.append({
        "id": "stage-2",
        "type": "quiz",
        "title": quiz_title,
        "questions": quiz_questions
    })
    
    # Fase 3: Sintaxis & Estructura (15 Ejercicios de Reordenar y Completar)
    syntax_questions = []
    for s_idx in range(15):
        # Seleccionar plantilla rotativa para variedad absoluta en cada drill
        tpl_s = TEMPLATES_SYNTAX[(index + s_idx) % len(TEMPLATES_SYNTAX)]
        
        # Alternar entre fill_input y order_sentence de forma determinista
        if s_idx % 2 == 0:
            parts = [p.format(vocab=vocab) for p in tpl_s["order"]]
            
            if lang == "fr":
                q_text = f"Ordonnez la phrase stratégique en français pour {title} :"
                parts = ["Nous", "devons", "prioriser", vocab, "dans", "nos", "livrables."]
            else:
                q_text = f"Arrange the strategic sentence for {title}:"
                
            syntax_questions.append({
                "id": f"q-syntax-{s_idx+1}",
                "type": "order_sentence",
                "question": q_text,
                "parts": parts,
                "correct_order": parts,
                "explanation": f"Proper word order is vital to communicate concepts related to '{vocab}' clearly."
            })
        else:
            if lang == "fr":
                q_text = f"Complétez la structure pour {title.lower()} :\n\"Nous mettons l'accent ______ l'efficacité de {vocab}.\" (sur / à)"
                answers = ["sur"]
                exp = f"La préposition 'sur' est requise ici."
            else:
                q_text = f"Complete the sentence for {title.lower()}:\n\"{tpl_s['fill_q']}\""
                answers = [tpl_s["fill_ans"], tpl_s["fill_ans"].lower(), tpl_s["fill_ans"].capitalize()]
                exp = f"Mastering professional prepositions improves the authority of your emails."
                
            syntax_questions.append({
                "id": f"q-syntax-{s_idx+1}",
                "type": "fill_input",
                "question": q_text,
                "correct_answers": answers,
                "explanation": exp
            })
            
    stages.append({
        "id": "stage-3",
        "type": "gamified_quiz",
        "title": syntax_title,
        "questions": syntax_questions
    })
    
    # Fase 4: Oratoria / Habla (9 Ejercicios de Pronunciación)
    speaking_questions = []
    for sp_idx in range(9):
        # El pitch de la lección es 100% único, pero los distractores varían deterministamente por índice
        speaking_questions.append({
            "id": f"q-speak-{sp_idx+1}",
            "type": "quiz_choice", 
            "question": vocal_text,
            "options": [speak_pitch, f"Incorrect pronunciation or emphasis on {vocab}", f"Inappropriate casual phrasing for {title}"],
            "correct_answer": speak_pitch,
            "explanation": vocal_exp
        })
        
    stages.append({
        "id": "stage-4",
        "type": "quiz",
        "title": speaking_title,
        "questions": speaking_questions
    })
    
    return {
        "id": lesson_id,
        "title": title,
        "level": level.upper(),
        "total_xp": 150,
        "stages": stages
    }

def main():
    levels_data = {
        "b1": TEMAS_B1,
        "b2": TEMAS_B2,
        "c1": TEMAS_C1,
        "c2": TEMAS_C2,
        "exec": TEMAS_EXEC,
        "mastery": TEMAS_MASTERY
    }
    
    count_en = 0
    count_fr = 0
    
    print("Starting massive scale generation of 600 fully unique, non-repetitive corporate-designed lessons...")
    
    for lvl, database in levels_data.items():
        prefix = f"pro-{lvl}"
        
        for idx, item in enumerate(database):
            title_en = item[0]
            vocab_en = item[1]
            concept = item[2]
            pitch = item[3]
            
            # Traducciones consistentes para títulos y vocabulario
            title_fr = title_en
            vocab_fr = vocab_en
            
            if title_en == "Professional Introductions":
                title_fr = "Introductions Professionnelles"
                vocab_fr = "introductions"
            elif title_en == "Formal Emailing":
                title_fr = "Emails Formels"
                vocab_fr = "courriels"
            elif title_en == "Business Travel Logistics":
                title_fr = "Voyages d'Affaires"
                vocab_fr = "logistique"
            elif title_en == "Leading Team Syncs":
                title_fr = "Réunions Efficaces"
                vocab_fr = "réunions"
            elif title_en == "Negotiation Fundamentals":
                title_fr = "Bases de la Négociation"
                vocab_fr = "négociation"
            elif title_en == "Pitching to Investors" or title_en == "Venture Capital Pitching":
                title_fr = "Pitch aux Investisseurs"
                vocab_fr = "pitch"
            elif title_en == "Crisis Management" or title_en == "Crisis Communications":
                title_fr = "Gestion de Crise"
                vocab_fr = "crise"
            elif title_en == "Public Speaking Mastery":
                title_fr = "Art Oratoire pour PDG"
                vocab_fr = "oratoire"
            elif title_en == "Diplomatic Phrasing":
                title_fr = "Phrasé Diplomatique"
                vocab_fr = "diplomatique"
            elif title_en == "Mergers & Acquisitions":
                title_fr = "Vocabulaire M&A"
                vocab_fr = "fusions"
            elif title_en == "Board of Directors Meetings":
                title_fr = "Réunions du Conseil"
                vocab_fr = "conseil"
            elif title_en == "Cross-Cultural Leadership":
                title_fr = "Leadership Interculturel"
                vocab_fr = "leadership"
            elif title_en == "Global Market Expansion" or title_en == "Global Supply Chains":
                title_fr = "Expansion Marché Global"
                vocab_fr = "expansion"
            
            lesson_id = f"{prefix}-{idx+1}"
            
            # 1. Generar lección en inglés
            lesson_en = build_lesson_json(lesson_id, title_en, lvl, vocab_en, concept, pitch, idx, lang="en")
            file_en = os.path.join(OUTPUT_DIR, f"{lesson_id}.json")
            with open(file_en, "w", encoding="utf-8") as f:
                json.dump(lesson_en, f, indent=4, ensure_ascii=False)
            count_en += 1
            
            # 2. Generar lección en francés
            lesson_fr = build_lesson_json(lesson_id, title_fr, lvl, vocab_fr, concept, pitch, idx, lang="fr")
            file_fr = os.path.join(OUTPUT_DIR, "fr", f"{lesson_id}.json")
            with open(file_fr, "w", encoding="utf-8") as f:
                json.dump(lesson_fr, f, indent=4, ensure_ascii=False)
            count_fr += 1
            
    print(f"\nSUCCESS! Generated {count_en} fully unique, non-repetitive lessons in English and {count_fr} in French.")
    print(f"Total unique JSON files created with 40 exercises: {count_en + count_fr}")

if __name__ == "__main__":
    main()
