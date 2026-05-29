import os
import json

# Target directories
lessons_dir = "c:\\Users\\jeico\\onixlingo\\language-ai-tutor\\backend\\app\\data\\lessons\\fr"
frontend_curriculum_file = "c:\\Users\\jeico\\onixlingo\\language-ai-tutor\\frontend\\data\\curriculum_fr.ts"

os.makedirs(lessons_dir, exist_ok=True)

# 1. TRANSLATION MAPPING DICTIONARIES (300 UNIQUE PAIRS)
VOCAB_MAPPING = {
    # Level A
    "hello": "bonjour", "desk": "bureau", "work": "travail", "clock": "horloge",
    "dollars": "euros", "left": "gauche", "manager": "directeur", "coffee": "café",
    "ticket": "billet", "room": "chambre", "email": "courriel", "good": "bon",
    "paper": "papier", "monday": "lundi", "phone": "téléphone", "done": "fini",
    "organized": "ordonné", "week": "semaine", "meet": "réunion", "intro": "accueil",
    "weather": "temps", "company": "société", "bank": "banque", "help": "aide",
    "director": "responsable", "family": "famille", "computer": "ordinateur", "layout": "plan",
    "order": "commande", "subway": "métro", "history": "histoire", "agree": "accord",
    "rules": "règles", "summary": "résumé", "pen": "stylo", "chair": "chaise",
    "lunch": "déjeuner", "time": "heure", "agenda": "agenda", "note": "note",
    "folder": "dossier", "telephone": "téléphoner", "send": "envoyer", "reply": "réponse",
    "safe": "sûreté", "window": "fenêtre", "water": "eau", "tea": "thé",
    "lunchbox": "panier", "snack": "goûter", "sync": "synchro", "arrive": "arriver",
    "depart": "partir", "start": "début", "finish": "finir", "report": "rapport",
    "copy": "copie", "screen": "écran", "keyboard": "clavier", "internet": "internet",
    "login": "connexion", "password": "code", "table": "table", "taxi": "taxi",
    "train": "train", "bus": "bus", "hotel": "hôtel", "passport": "passeport",
    "gate": "porte", "key": "clé", "boardroom": "salle", "coffeemaker": "cafetière",
    "organizer": "classeur", "pencil": "crayon", "notebook": "cahier", "sticker": "autocollant",
    "calculator": "calculatrice", "wallclock": "pendule", "visitor": "visiteur", "parking": "parking",
    "elevator": "ascenseur", "bandage": "pansement", "fan": "ventilateur", "menu": "menu",
    "receipt": "reçu", "purchase": "achat", "lamp": "lampe", "bin": "poubelle",
    "mug": "tasse", "charger": "chargeur", "audio": "casque", "photo": "photo",
    "clean": "propre", "plant": "plante", "calendar": "calendrier", "bag": "sac",
    "file": "fichier", "lobby": "hall", "fruit": "fruit", "lock": "verrou",
    # Level B
    "moderator": "animateur", "offer": "offre", "formal": "formel", "timezone": "fuseau",
    "milestone": "jalon", "feedback": "retour", "increase": "hausse", "client": "client",
    "experience": "expérience", "flight": "vol", "strategy": "stratégie", "budget": "budget",
    "reboot": "redémarrage", "integrity": "intégrité", "transfer": "transfert", "apologize": "excuser",
    "conflict": "conflit", "vendor": "fournisseur", "launch": "lancement", "inventory": "inventaire",
    "satisfaction": "satisfaction", "prioritize": "prioriser", "benchmark": "comparatif", "contract": "contrat",
    "risk": "risque", "shares": "actions", "mute": "sourdine", "networking": "réseautage",
    "research": "recherche", "hiring": "embauche", "pitch": "argumentaire", "posture": "posture",
    "progress": "progrès", "schedules": "horaires", "constructive": "constructif", "trends": "tendances",
    "objections": "objections", "schedulezone": "planification", "actionable": "actionnable", "update": "actualisation",
    "demonstrate": "démonstration", "support": "support", "standards": "normes", "stock": "stock",
    "market": "marché", "branding": "image", "pipeline": "processus", "prospect": "prospect",
    "efficiency": "efficacité", "capacity": "capacité", "ethical": "éthique", "green": "écologique",
    "safety": "sécurité", "wellness": "bien-être", "ideation": "idéation", "delegate": "déléguer",
    "alignment": "alignement", "costs": "coûts", "expenses": "dépenses", "income": "revenus",
    "pricing": "tarification", "timelines": "délais", "outsourcer": "prestataire", "turnover": "rotation",
    "onboard": "intégration", "skills": "compétences", "culture": "culture", "mentor": "mentor",
    "mediation": "médiation", "scrum": "mêlée", "sprint": "sprint", "standup": "point",
    "appraisal": "bilan", "promotion": "promotion", "remote": "télétravail", "zoom": "conférence",
    "etiquette": "étiquette", "deck": "diaporama", "concise": "concis", "contacts": "contacts",
    "card": "carte", "profile": "profil", "survey": "enquête", "promoter": "promoteur",
    "persona": "personnage", "ux": "expérience-utilisateur", "quality": "qualité", "mitigate": "atténuer",
    "backup": "sauvegarde", "ticketcode": "ticket", "patch": "correctif", "database": "base",
    "ergonomics": "ergonomie", "maintenance": "maintenance", "prevention": "prévention", "reimbursement": "remboursement",
    "itinerary": "itinéraire", "booth": "stand", "teambuilding": "cohésion", "assessment": "évaluation",
    # Level C
    "macroeconomic": "macroéconomique", "crisis": "crise", "ebitda": "ebitda", "merger": "fusion",
    "rhetoric": "rhétorique", "concession": "concession", "indemnity": "indemnité", "sustainability": "durabilité",
    "pivot": "pivot", "ipo": "introduction", "leadership": "leadership", "transition": "transition",
    "shareholders": "actionnaires", "compliance": "conformité", "successor": "successeur", "technology": "technologie",
    "fintech": "fintech", "patents": "brevets", "renewable": "renouvelable", "resilience": "résilience",
    "luxury": "luxe", "reit": "foncière", "venture": "capital-risque", "ransomware": "rançongiciel",
    "alliance": "alliance", "trademark": "marque", "ghostwriting": "rédaction", "diplomatic": "diplomatique",
    "silence": "silence", "inclusion": "inclusion", "ecommerce": "commerce", "behavioral": "comportemental",
    "capstone": "synthèse", "restructuring": "restructuration", "regulatory": "réglementaire", "antitrust": "antimonopole",
    "litigation": "litige", "patent": "brevet", "disputes": "différends", "board": "conseil",
    "shareholder": "actionnaire", "remuneration": "rémunération", "roadshow": "tournée", "exit": "sortie",
    "takeover": "rachat", "funding": "financement", "equity": "capitaux", "diligence": "diligence",
    "synergies": "synergies", "strategicalliance": "coopération", "jointventure": "coentreprise", "crossborder": "transfrontalier",
    "decarbonization": "décarbonation", "philanthropy": "philanthropie", "pr": "relations-publiques", "reputation": "réputation",
    "pressinterview": "entretien", "oratorical": "oratoire", "keynote": "discours", "fiduciary": "fiduciaire",
    "capitalallocation": "allocation", "treasury": "trésorerie", "hedging": "couverture", "valuation": "valorisation",
    "dividend": "dividende", "debt": "dette", "globalsupply": "chaîne", "portresilience": "resilience",
    "offshoring": "délocalisation", "geopolitics": "géopolitique", "disruption": "disruption", "automation": "automatisation",
    "privacy": "confidentialité", "intellectual": "intellectuel", "culturalalign": "alignement-culturel", "brandvalue": "valeur",
    "premium": "haut-de-gamme", "franchise": "franchise", "tariffs": "tarifs", "heuristics": "heuristique",
    "elasticity": "élasticité", "clv": "valeur-client", "acquisition": "acquisition", "analytics": "métriques",
    "cloud": "nuage", "incubator": "incubateur", "profitability": "profitabilité", "divestiture": "scission",
    "sovereign": "souverain", "arbitrage": "arbitrage", "nomination": "nomination", "greenbonds": "obligations",
    "arbitration": "conciliation", "liquidation": "liquidation", "enterprise": "entreprise", "multicultural": "multiculturel",
    "licensing": "licenciement", "partnership": "partenariat", "oversight": "surveillance", "executive": "dirigeant"
}

TITLE_MAPPING = {
    # Level A
    "First Impressions": "Primeras Impresiones", "The Office Desk": "El Escritorio de Oficina",
    "Daily Routines": "Rutinas Diarias", "Telling Time": "Decir la Hora", "Numbers & Prices": "Números y Precios",
    "Simple Directions": "Direcciones Simples", "Meeting the Team": "Conocer al Equipo",
    "Food & Drink": "Comida y Bebida", "Business Travel Basics": "Viajes de Negocios Básicos",
    "Hotel Check-in": "Registro en el Hotel", "Writing Simple Emails": "Redactar Correos Simples",
    "Describing a Product": "Describir un Producto", "Office Supplies": "Suministros de Oficina",
    "Calendars & Dates": "Calendarios y Fechas", "Basic Phone Skills": "Habilidades Telefónicas Básicas",
    "Weekly Review": "Revisión Semanal", "Personal Strengths": "Fortalezas Personales",
    "The Working Week": "La Semana Laboral", "Making Appointments": "Agendar Citas",
    "Client Introductions": "Presentación de Clientes", "Talking about Weather": "Hablar del Clima",
    "Company Profile": "Perfil de la Empresa", "At the Bank": "En el Banco", "Emergency Basics": "Conceptos de Emergencia",
    "Job Titles": "Títulos de Puestos", "Socializing at Work": "Socializar en el Trabajo",
    "IT Support Basics": "Soporte Técnico Básico", "Office Layout": "Distribución de la Oficina",
    "Simple Orders": "Pedidos Simples", "Commuting to Work": "Viaje al Trabajo", "Company History": "Historia de la Empresa",
    "Basic Agreements": "Acuerdos Básicos", "Office Rules": "Reglas de la Oficina",
    "Review Milestone A": "Hito de Revisión A", "Office Stationery": "Papelería de Oficina",
    "Ergonomic Chair": "Silla Ergonómica", "Midday Break": "Descanso del Mediodía", "Daily Schedule": "Horario Diario",
    "Creating an Agenda": "Crear una Agenda", "Writing a Note": "Escribir una Nota", "File Cabinet": "Archivador",
    "Answering Calls": "Responder Llamadas", "Sending Emails": "Enviar Correos", "Receiving a Reply": "Recibir una Respuesta",
    "Document Security": "Seguridad de Documentos", "Office Windows": "Ventanas de la Oficina",
    "Water Cooler Talk": "Charla de Pasillo", "Afternoon Tea": "Té de la Tarde", "Lunchbox Choices": "Opciones de Almuerzo",
    "Short Break": "Descanso Corto", "Team Sync": "Sincronización de Equipo", "Arriving at Work": "Llegar al Trabajo",
    "Departing the Office": "Salir de la Oficina", "Starting a Project": "Iniciar un Proyecto",
    "Finishing Tasks": "Terminar Tareas", "Weekly Report": "Reporte Semanal", "Making Copies": "Hacer Copias",
    "Desktop Screen": "Pantalla de Escritorio", "Keyboard Shortcuts": "Atajos de Teclado",
    "Internet Access": "Acceso a Internet", "Login Credentials": "Credenciales de Acceso",
    "Access Denied": "Acceso Denegado", "Office Table": "Mesa de Oficina", "Taxi Dispatch": "Servicio de Taxi",
    "Train Station": "Estación de Tren", "Bus Stop": "Parada de Autobús", "Hotel Reservation": "Reservación de Hotel",
    "Passport Control": "Control de Pasaportes", "Flight Boarding": "Abordaje de Vuelo",
    "Office Keys": "Llaves de la Oficina", "Meeting Rooms": "Salas de Reunión", "Coffee Machine": "Máquina de Café",
    "Desk Organizer": "Organizador de Escritorio", "Writing Tools": "Herramientas de Escritura",
    "Notebook Entry": "Notas en el Cuaderno", "Sticky Notes": "Notas Adhesivas", "Calculator Tools": "Uso de la Calculadora",
    "Office Clock": "Reloj de la Oficina", "Visitor Badge": "Gafete de Visitante",
    "Parking Space": "Espacio de Estacionamiento", "Elevator Floor": "Piso del Ascensor",
    "First Aid Kit": "Botiquín de Primeros Auxilios", "Office Air": "Aire Acondicionado de la Oficina",
    "Lunch Menu": "Menú de Almuerzo", "Payment Receipt": "Recibo de Pago", "Store Purchase": "Compra en la Tienda",
    "Desk Lamp": "Lámpara de Escritorio", "Trash Disposal": "Eliminación de Basura", "Corporate Mug": "Taza Corporativa",
    "Laptop Charger": "Cargador de Laptop", "Headphone Jack": "Conector de Auriculares", "Team Photo": "Foto de Equipo",
    "Clean Desk": "Escritorio Limpio", "Office Plant": "Planta de Oficina", "Wall Calendar": "Calendario de Pared",
    "Briefcase Item": "Artículo del Portafolios", "Filing Reports": "Archivar Reportes",
    "Welcome Desk": "Recepción de Bienvenida", "Snack Bar": "Barra de Snacks", "Closing Hour": "Hora de Cierre",
    # Level B
    "Leading a Team Sync": "Liderar una Sincronización de Equipo", "Negotiation Skills 101": "Habilidades de Negociación Básicas",
    "Formal Email Writing": "Redacción de Correos Formales", "Strategic Scheduling": "Programación Estratégica",
    "Project Milestones": "Hitos del Proyecto", "Giving Feedback": "Dar Retroalimentación",
    "Describing Data Trends": "Describir Tendencias de Datos", "Handling Client Objections": "Manejar Objeciones del Cliente",
    "Job Interviews": "Entrevistas de Trabajo", "Business Trip Logistics": "Logística del Viaje de Negocios",
    "Marketing Strategy": "Estrategia de Marketing", "Budget Planning": "Planificación del Presupuesto",
    "Tech Support Mastery": "Dominio del Soporte Técnico", "Corporate Values": "Valores Corporativos",
    "Phone Etiquette": "Etiqueta Telefónica", "Apologizing Professionally": "Disculparse Profesionalmente",
    "Conflict Resolution": "Resolución de Conflictos", "Strategic Outsourcing": "Subcontratación Estratégica",
    "Product Launch": "Lanzamiento de Producto", "Supply Chain Basics": "Conceptos Básicos de la Cadena de Suministro",
    "Customer Satisfaction": "Satisfacción del Cliente", "Time Management": "Gestión del Tiempo",
    "Strategic Benchmarking": "Evaluación Comparativa Estratégica", "Contract Negotiations": "Negociaciones de Contrato",
    "Risk Assessment": "Evaluación de Riesgos", "Equity & Shares": "Acciones y Participaciones",
    "Virtual Meetings": "Reuniones Virtuales", "Professional Networking": "Red de Contactos Profesionales",
    "Market Research": "Investigación de Mercado", "Talent Acquisition": "Adquisición de Talento",
    "Sales Pitch Mastery": "Dominio del Discurso de Ventas", "Office Ergonomics": "Ergonomía en la Oficina",
    "Review Milestone B": "Hito de Revisión B", "Project Milestone Sync": "Sincronización de Hitos del Proyecto",
    "Constructive Feedback": "Retroalimentación Constructiva", "Data Interpretation": "Interpretación de Datos",
    "Client Objections": "Objeciones de Clientes", "Executive Scheduling": "Programación Ejecutiva",
    "Action Items": "Tareas Pendientes", "Status Update": "Actualización de Estado",
    "Product Demo": "Demostración de Producto", "Customer Care": "Atención al Cliente",
    "Service Level Agreement": "Acuerdo de Nivel de Servicio", "Inventory Auditing": "Auditoría de Inventario",
    "Market Analysis": "Análisis de Mercado", "Brand Strategy": "Estrategia de Marca",
    "Sales Pipeline": "Canal de Ventas", "Lead Generation": "Generación de Prospectos",
    "Operational Efficiency": "Eficiencia Operativa", "Capacity Planning": "Planificación de Capacidad",
    "Corporate Ethics": "Ética Corporativa", "Sustainable Office": "Oficina Sostenible",
    "Safety Protocols": "Protocolos de Seguridad", "Stress Management": "Manejo del Estrés",
    "Creative Brainstorm": "Lluvia de Ideas Creativa", "Task Delegation": "Delegación de Tareas",
    "Goal Alignment": "Alineación de Objetivos", "Project Budget": "Presupuesto del Proyecto",
    "Cost Allocation": "Asignación de Costos", "Revenue Streams": "Fuentes de Ingresos",
    "Pricing Model": "Modelo de Precios", "Launch Timeline": "Cronograma de Lanzamiento",
    "Outsourcing Risks": "Riesgos de Subcontratación", "Employee Attrition": "Rotación de Personal",
    "Onboarding Guide": "Guía de Onboarding", "Skills Matrix": "Matriz de Habilidades",
    "Corporate Culture": "Cultura Corporativa", "Mentorship Program": "Programa de Mentoría",
    "Conflict Mediation": "Mediación de Conflictos", "Agile Framework": "Marco Metodológico Ágil",
    "Sprint Planning": "Planificación del Sprint", "Daily Standup": "Reunión Diaria Corta",
    "Performance Review": "Evaluación del Desempeño", "Career Pathing": "Plan de Carrera",
    "Remote Collaboration": "Colaboración Remota", "Virtual Tools": "Herramientas Virtuales",
    "Email Netiquette": "Etiqueta de Correo Electrónico", "Pitch Deck Basics": "Conceptos Básicos de Pitch Deck",
    "Elevator Speech": "Discurso de Elevador", "Networking Events": "Eventos de Networking",
    "Business Cards": "Tarjetas de Presentación", "LinkedIn Branding": "Marca Personal en LinkedIn",
    "Survey Analysis": "Análisis de Encuestas", "NPS Score": "Métricas del NPS",
    "Customer Persona": "Perfil del Cliente Ideal", "User Experience": "Experiencia del Usuario",
    "Quality Control": "Control de Calidad", "Risk Mitigation": "Mitigación de Riesgos",
    "Data Backup": "Respaldo de Datos", "IT Ticketing": "Gestión de Tickets de TI",
    "Software Update": "Actualización de Software", "Server Migration": "Migración de Servidores",
    "Office Ergonomics Professional": "Ergonomía de Oficina Profesional", "Facility Management": "Gestión de Instalaciones",
    "Workplace Safety": "Seguridad en el Lugar de Trabajo", "Travel Expenses": "Gastos de Viaje",
    "Itinerary Planning": "Planificación de Itinerarios", "Conference Booking": "Reservación de Conferencias",
    "Team Integration": "Integración del Equipo", "Review Milestone B2": "Hito de Revisión B2",
    # Level C
    "Global Market Analysis": "Análisis del Mercado Global", "Crisis Management": "Gestión de Crisis",
    "Financial Results Reporting": "Reporte de Resultados Financieros", "Mergers & Acquisitions": "Fusiones y Adquisiciones",
    "Public Speaking Mastery": "Dominio de la Oratoria", "Nuanced Negotiation": "Negociación con Matices",
    "Legal Contracts Drafting": "Redacción de Contratos Legales", "ESG & Corporate Sustainability": "ESG y Sostenibilidad Corporativa",
    "Corporate Strategy & Pivot": "Estrategia y Pivote Corporativo", "IPO & Exit Strategies": "OPI y Estrategias de Salida",
    "Leadership Philosophy": "Filosofía de Liderazgo", "Change Management": "Gestión del Cambio",
    "Investor Relations": "Relaciones con Inversores", "Corporate Governance": "Gobernanza Corporativa",
    "Succession Planning": "Planificación de la Sucesión", "AI & Tech Disruption": "Disrupción Tecnológica e IA",
    "Fintech & Blockchain": "Fintech y Blockchain", "Biotech Innovations": "Innovaciones Biotecnológicas",
    "Green Energy Transition": "Transición a Energías Limpias", "Supply Chain Resilience": "Resiliencia de la Cadena de Suministro",
    "Luxury Brand Management": "Gestión de Marcas de Lujo", "Real Estate Investment": "Inversión en Bienes Raíces",
    "Venture Capital Pitching": "Presentaciones para Capital de Riesgo", "Cybersecurity Protocols": "Protocolos de Ciberseguridad",
    "Strategic Alliances": "Alianzas Estratégicas", "Intellectual Property": "Propiedad Intelectual",
    "Executive Ghostwriting": "Redacción Fantasma Ejecutiva", "Diplomatic Communication": "Comunicación Diplomática",
    "The Power of Silence": "El Poder del Silencio", "Diversity & Inclusion Strategy": "Estrategia de Diversidad e Inclusión",
    "E-commerce Scaling": "Escalamiento del Comercio Electrónico", "Behavioral Economics": "Economía del Comportamiento",
    "Milestone Capstone C": "Proyecto Final del Hito C", "Corporate Restructuring": "Reestructuración Corporativa",
    "Regulatory Compliance": "Cumplimiento Regulatorio", "Antitrust Regulations": "Regulaciones Antimonopolio",
    "Litigation Management": "Gestión de Litigios", "Patent Protection": "Protección de Patentes",
    "Trademark Disputes": "Disputas de Marcas Registradas", "Board of Directors": "Junta Directiva",
    "Shareholder Activism": "Activismo de los Accionistas", "Executive Compensation": "Compensación Ejecutiva",
    "IPO Roadshow": "Roadshow de OPI", "Exit Strategy": "Estrategia de Salida",
    "Hostile Takeover": "Adquisición Hostil", "Venture Capital Rounds": "Rondas de Capital de Riesgo",
    "Private Equity": "Capital Privado", "Due Diligence Audit": "Auditoría de Debida Diligencia",
    "Merger Synergies": "Sinergias de Fusión", "Strategic Alliance Setup": "Creación de Alianzas Estratégicas",
    "Joint Venture Setup": "Creación de Coempresas", "Cross-Border M&A": "Fusiones y Adquisiciones Transfronterizas",
    "Carbon Footprint": "Huella de Carbono", "Social Responsibility": "Responsabilidad Social",
    "Crisis Communication": "Comunicación de Crisis", "Reputation Management": "Gestión de la Reputación",
    "Media Training": "Entrenamiento de Medios", "Public Speaking Rhetoric": "Retórica de la Oratoria Pública",
    "Keynote Address": "Discurso Magistral", "Fiduciary Duty": "Deber Fiduciario",
    "Capital Allocation": "Asignación de Capital", "Treasury Management": "Gestión de Tesorería",
    "Hedging Strategies": "Estrategias de Cobertura", "Asset Valuation": "Valoración de Activos",
    "Dividend Policy": "Política de Dividendos", "Debt Restructuring": "Reestructuración de Deuda",
    "Global Supply Chain": "Cadena de Suministro Global", "Logistics Resilience": "Resiliencia Logística",
    "Outsourcing Strategy": "Estrategia de Subcontratación", "Geopolitical Strategy": "Estrategia Geopolítica",
    "Market Disruption": "Disrupción del Mercado", "AI Integration": "Integración de IA",
    "Data Privacy Laws": "Leyes de Privacidad de Datos", "Intellectual Capital": "Capital Intelectual",
    "Cultural Alignment": "Alineación Cultural", "Brand Valuation": "Valoración de Marca",
    "High-End Marketing": "Marketing de Alta Gama", "Franchise Scaling": "Escalamiento de Franquicias",
    "Cross-Border Logistics": "Logística Transfronteriza", "Behavioral Heuristics": "Heurística del Comportamiento",
    "Pricing Inelasticity": "Inelasticidad de Precios", "Customer Lifetime Value": "Valor del Ciclo de Vida del Cliente",
    "Acquisition Cost": "Costo de Adquisición", "Business Intelligence": "Inteligencia de Negocios",
    "Digital Transformation": "Transformación Digital", "Venture Studio Setup": "Creación de Venture Studio",
    "Shareholder Value Optimization": "Optimización del Valor para el Accionista",
    "Corporate Restructuring Strategy": "Estrategia de Reestructuración Corporativa",
    "Global Expansion Risk": "Riesgo de Expansión Global", "Regulatory Arbitrage": "Arbitraje Regulatorio",
    "Strategic Succession Planning": "Planificación de la Sucesión Estratégica",
    "Sustainable Debt Financing": "Financiamiento de Deuda Sostenible", "High-Stakes Mediation": "Mediación de Alto Riesgo",
    "Venture Capital Exits": "Salidas de Capital de Riesgo", "Enterprise Risk Architecture": "Arquitectura de Riesgo Empresarial",
    "Cross-Cultural M&A Integration": "Integración de F&A Multicultural",
    "Technology Transfer Agreements": "Acuerdos de Transferencia de Tecnología",
    "Public-Private Partnerships": "Asociaciones Público-Privadas",
    "Ethical Governance Oversight": "Supervisión de Gobernanza Ética", "Milestone Capstone Executive": "Proyecto Final del Hito Ejecutivo"
}

# 2. GENERATE BACKEND LESSON JSON FILES (2000 FILES TOTAL)
def generate_lesson_file(level_id, index, eng_title, description, eng_vocab):
    vocab = VOCAB_MAPPING.get(eng_vocab, eng_vocab)
    title = TITLE_MAPPING.get(eng_title, eng_title)
    if index > 100:
        title = f"{title} (Partie 2)"
    
    lesson_id = f"fr-{level_id.lower()}-{index}"
    difficulty = "easy" if level_id in ["a1", "a2"] else "medium" if level_id in ["b1", "b2"] else "hard"
    
    # point grammatical, guide phonétique and rules in French
    if level_id == "a1":
        point_grammatical = (
            "- Le présent de l'indicatif : verbes réguliers en -er ('nous utilisons {vocab}') et auxiliaires ('je suis', 'nous avons').\\n"
            "- L'accord en genre et nombre des adjectifs de bureau (ex: 'un dossier vert', 'des chaises vertes').\\n"
            "- Clé Didactique : Structure de base Sujet + Verbe + Complément pour la communication simple."
        )
        phonetic_tip = f"Prononciation : Faites attention à la liaison entre 'un' et '{vocab}' s'il commence par une voyelle."
        golden_rule = "Règle d'Or : Dans le niveau A1, privilégiez des phrases courtes et directes pour éviter les erreurs d'incompréhension."
    elif level_id == "a2":
        point_grammatical = (
            "- Le passé composé avec l'auxiliaire avoir et être (ex: 'nous avons reçu {vocab}').\\n"
            "- Les adjectifs possessifs (mon, ton, son, notre, votre, leur).\\n"
            "- Clé Didactique : Raconter des événements passés et des activités de bureau quotidiennes."
        )
        phonetic_tip = f"Prononciation : La lettre 'e' finale dans '{vocab}' est généralement muette."
        golden_rule = "Règle d'Or : Au niveau A2, la ponctualité est essentielle en France; arriver 5 minutes avant l'heure démontre du professionnalisme."
    elif level_id == "b1":
        point_grammatical = (
            "- L'utilisation des verbes modaux professionnels : Devoir, Pouvoir et Vouloir ('nous devons allouer {vocab}').\\n"
            "- Les pronoms compléments (en, y) pour éviter les répétitions dans vos e-mails : 'Nous y pensons pour {vocab}'.\\n"
            "- Clé Didactique : L'expression de l'obligation modérée et de la possibilité en milieu corporatif."
        )
        phonetic_tip = f"Prononciation : Prononcez bien le 's' final dans les mots de liaison comme 'nous devons' devant une voyelle."
        golden_rule = "Règle d'Or : Au niveau B1, structurez vos arguments avec des connecteurs logiques formels ('cependant', 'par conséquent')."
    elif level_id == "b2":
        point_grammatical = (
            "- Le futur simple pour les projections professionnelles ('nous développerons {vocab}').\\n"
            "- Le conditionnel présent pour formuler des demandes polies ou suggestions ('je voudrais revoir {vocab}').\\n"
            "- Clé Didactique : Formulation de plans à moyen terme et requêtes formelles auprès des clients."
        )
        phonetic_tip = f"Prononciation : Le son de la lettre 'r' en français se prononce au fond de la gorge pour '{vocab}'."
        golden_rule = "Règle d'Or : Au niveau B2, soignez l'étiquette téléphonique en commençant vos appels par des salutations formelles et claires."
    elif level_id == "c1":
        point_grammatical = (
            "- Le subjonctif présent après les structures d'exigence : 'Il est impératif que nous fassiez {vocab}'.\\n"
            "- Le gérondif pour exprimer la simultanéité des actions stratégiques : 'En optimisant notre {vocab}, nous augmentons l'EBITDA'.\\n"
            "- Clé Didactique : La nuance rhétorique et l'expression diplomatique de l'obligation stricte."
        )
        phonetic_tip = f"Prononciation : Utilisez des pauses stratégiques (cadence oratoire) para mettre en valeur le concept de '{vocab}'."
        golden_rule = "Règle d'Or : Au niveau C1, connectez toujours l'opération avec les indicateurs financiers et le devoir fiduciaire."
    elif level_id == "c2":
        point_grammatical = (
            "- Le subjonctif passé pour évaluer des scénarios rétrospectifs ('bien que nous ayons fini {vocab}').\\n"
            "- Les propositions concessives complexes (bien que, quoique, malgré).\\n"
            "- Clé Didactique : Articulation de rapports d'évaluation rétrospective et de risques géopolitiques."
        )
        phonetic_tip = f"Prononciation : Maintenez une intonation descendante en fin de phrase affirmative pour marquer l'autorité stratégique."
        golden_rule = "Règle d'Or : Au niveau C2, la diplomatie fine et le respect scrupuleux de la hiérarchie lors des conseils d'administration français sont cruciaux."
    elif level_id == "tfi":
        point_grammatical = (
            "- L'accord du participe passé avec l'auxiliaire avoir quand le COD précède le verbe.\\n"
            "- L'utilisation des prépositions temporelles complexes (depuis, pendant, durant, en).\\n"
            "- Clé Didactique : Identification rapide des structures grammaticales pièges courantes dans l'examen officiel."
        )
        phonetic_tip = f"Prononciation : Entraînez votre oreille à distinguer les homophones professionnels pour éviter les pièges auditifs de l'examen."
        golden_rule = "Règle d'Or : Pour le TFI, gérez votre temps de manière rigoureuse en éliminant immédiatement les distracteurs évidents."
    elif level_id == "m1":
        point_grammatical = (
            "- Les pronoms démonstratifs et possessifs complexes (celui-ci, la leur, le vôtre).\\n"
            "- Les adverbes et locutions de concession avancée (certes, toutefois, en dépit de).\\n"
            "- Clé Didactique : Rédaction de communiqués de presse et gestion de la réputation de marque en situation de crise."
        )
        phonetic_tip = f"Prononciation : Modulez votre voix pour exprimer de l'empathie et de la clarté lors de présentations de relations publiques."
        golden_rule = "Règle d'Or : En relations publiques, réagissez rapidement en cas de crise mais basez toutes vos déclarations sur des faits audités."
    elif level_id == "m2":
        point_grammatical = (
            "- La voix passive dans la rédaction de procès-verbaux de conseils d'administration.\\n"
            "- Les structures conditionnelles complexes exprimant l'hypothèse incertaine ('pour autant que', 'pourvu que').\\n"
            "- Clé Didactique : Négociation de contrats de fusion-acquisition et de protocoles d'investissement transfrontaliers."
        )
        phonetic_tip = f"Prononciation : Gardez un ton stable et posé pour projeter de la sérénité lors de négociations financières tendues."
        golden_rule = "Règle d'Or : Lors de fusions-acquisitions, portez une attention particulière à l'intégration culturelle des équipes pour assurer le succès de la transaction."
    else: # pro
        point_grammatical = (
            "- Le conditionnel passé pour formuler des regrets stratégiques ou des analyses rétrospectives d'incidents.\\n"
            "- Les inversions sujet-verbe complexes après des adverbes de liaison (ex: 'À peine avions-nous optimisé {vocab} que...').\\n"
            "- Clé Didactique : Discours devant l'assemblée générale des actionnaires et conformité aux normes réglementaires."
        )
        phonetic_tip = f"Prononciation : Soignez la clarté de votre articulation pour les webcasts internationaux de la haute direction."
        golden_rule = "Règle d'Or : À l'échelle de la gouvernance PRO, veillez à ce que la rentabilité financière s'aligne toujours sur l'éthique et la durabilité ESG."

    point_grammatical = point_grammatical.replace("{vocab}", vocab)
    
    # Theory Stage (French)
    theory_stage = {
        "id": "stg_theory",
        "type": "lecture",
        "title": f"Concept Stratégique: {title}",
        "parts": [
            {
                "visual": f"★ ONIXLINGO SYSTÈME PROFESSIONNEL DE FRANÇAIS ★\n\nNiveau {level_id.upper()} • Leçon {level_id.upper()}-{index} de 200\nSujet: {title}\n\nConcept Clé:\n☞ '{vocab.upper()}'\n\n[Point Grammatical - Enfoque Gramatical]\n{point_grammatical}",
                "audio": f"Bienvenue à la leçon {level_id.upper()}-{index} sur {title}. Explorons la théorie et l'application stratégique de notre mot de vocabulaire clé : {vocab}."
            },
            {
                "visual": f"[Analyse Détaillée du Vocabulaire]\n- Vocable : '{vocab}' (Traducción/Uso: {description})\n- Application Pratique : 'Nous devons intégrer {vocab} pour réussir.'\n\n[Guide de Prononciation - Guía Fonética]\n- {phonetic_tip}",
                "audio": f"Veuillez vous concentrer sur notre terme clé : {vocab}. Répétez après moi : {vocab}."
            },
            {
                "visual": f"[Règle d'Or Professionnelle - Regla de Oro]\n- {golden_rule}\n\n¡Comencez les exercices pratiques maintenant !",
                "audio": "Commençons les exercices interactifs pour valider votre compréhension."
            }
        ]
    }
    
    # Choice Stage (10 Questions in French)
    choice_questions = []
    for q_num in range(1, 11):
        if q_num == 1:
            question = f"Que signifie principalement le terme \"{vocab}\" dans le contexte de \"{title}\" ?"
            correct = f"Le concept professionnel principal de {vocab} utilisé dans {title}."
            options = [
                correct,
                f"Un terme familier à éviter dans {title}.",
                f"Un mot obsolète qui n'est plus utilisé dans les affaires.",
                f"Un terme générique sans signification spécifique dans {title}."
            ]
            explanation = f"Comprendre la définition de \"{vocab}\" est fondamental pour maîtriser \"{title}\"."
        elif q_num == 2:
            question = f"Quand est-il le plus approprié d'aborder \"{vocab}\" lors d'un événement professionnel ?"
            correct = f"Lors de la présentation d'idées clés liées à \"{title}\" aux parties prenantes."
            options = [
                correct,
                f"Uniquement lors de communications informelles en dehors du travail.",
                f"Lorsque vous souhaitez intentionnellement confondre vos collègues.",
                f"Jamais, car \"{vocab}\" n'est pas un terme professionnel."
            ]
            explanation = f"Aborder \"{vocab}\" dans les présentations professionnelles améliore la communication globale concernant \"{title}\"."
        elif q_num == 3:
            question = f"Laquelle des options suivantes est considérée comme une bonne pratique pour gérer \"{title}\" ?"
            correct = f"Prioriser l'alignement actif et utiliser \"{vocab}\" de manière appropriée."
            options = [
                correct,
                f"Contourner tous les canaux de communication pour gagner du temps.",
                f"Travailler dans un isolement complet sans informer l'équipe.",
                f"Ignorer complètement la valeur stratégique de \"{vocab}\"."
            ]
            explanation = f"L'alignement actif et l'utilisation correcte de \"{vocab}\" sont los piliers d'une exécution réussie de \"{title}\"."
        elif q_num == 4:
            question = f"Quelle erreur courante les professionnels commettent-ils concernant \"{title}\" ?"
            correct = f"Mal comprendre le rôle stratégique de \"{vocab}\" dans le processus."
            options = [
                correct,
                f"Trop collaborer avec les autres membres de l'équipe.",
                f"Préparer l'ordre du jour de la réunion trop longtemps à l'avance.",
                f"Documenter toutes les décisions avec une grande précision."
            ]
            explanation = f"Ne pas reconnaître l'impact de \"{vocab}\" conduit souvent à des résultats inefficaces dans \"{title}\"."
        elif q_num == 5:
            question = f"Quelle est la traduction ou l'équivalent le plus proche de \"{vocab}\" pour un professionnel hispanophone ?"
            correct = f"Il représente le concept clé de \"{vocab}\" adapté à l'environnement de \"{title}\"."
            options = [
                correct,
                f"Un mot très familier qui n'a pas de sens dans les affaires.",
                f"Une traduction littérale sans aucune application pratique.",
                f"Un terme technique complexe non lié au français des affaires."
            ]
            explanation = f"Traduire ou adapter \"{vocab}\" nécessite de comprendre son application commerciale pratique dans \"{title}\"."
        elif q_num == 6:
            question = f"Comment le concept de \"{vocab}\" aide-t-il à optimiser les processus d'affaires ?"
            correct = f"Il fournit un cadre clair pour coordonner les activités de \"{title}\"."
            options = [
                correct,
                f"Il permet aux équipes de sauter les étapes de validation standard.",
                f"Il encourage les discussions informelles et non structurées.",
                f"Il augmente le temps nécessaire pour terminer des projets simples."
            ]
            explanation = f"Utiliser \"{vocab}\" comme référence optimise les flux de travail et la coordination générale."
        elif q_num == 7:
            question = f"Lors d'une réunion sur \"{title}\", comment un cadre doit-il présenter \"{vocab}\" ?"
            correct = f"Avec des indicateurs clairs montrant son impact sur les objectifs de l'entreprise."
            options = [
                correct,
                f"En parlant très rapidement pour éviter les questions difficiles.",
                f"Comme un détail mineur qui ne mérite pas beaucoup d'attention.",
                f"Sans préparer de diapositives ni de données de support."
            ]
            explanation = f"Les présentations de \"{vocab}\" basées sur des données assurent l'alignement et le soutien de la direction."
        elif q_num == 8:
            question = f"Lors d'une collaboration sur des tâches impliquant \"{vocab}\", que doit faire l'équipe en premier ?"
            correct = f"S'aligner sur les livrables clés et définir les jalons de \"{vocab}\"."
            options = [
                correct,
                f"Commencer à travailler immédiatement sans attribuer de rôles spécifiques.",
                f"Reporter toutes les discussions jusqu'à ce que la date limite soit proche.",
                f"Demander une augmentation immédiate du budget au directeur financier."
            ]
            explanation = f"Définir les jalons liés à \"{vocab}\" prévient les retards et la confusion dans le projet."
        elif q_num == 9:
            question = f"Quel est le principal avantage de maîtriser le vocabulaire de \"{title}\" ?"
            correct = f"Cela permet une communication fluide en utilisant des mots professionnels comme \"{vocab}\"."
            options = [
                correct,
                f"Cela garantit une promotion salariale immédiate sans effort supplémentaire.",
                f"Cela vous permet de contourner les directives de conformité de l'entreprise.",
                f"Cela réduit la nécessité de tenir des réunions d'alignement hebdomadaires."
            ]
            explanation = f"Les mots professionnels comme \"{vocab}\" sont les piliers du français des affaires au niveau expert."
        else:
            question = f"Pourquoi l'alignement mondial sur \"{vocab}\" est-il important pour les entreprises multinationales ?"
            correct = f"Cela garantit une interprétation standardisée dans les différentes régions."
            options = [
                correct,
                f"Cela permet aux équipes d'utiliser leur argot local dans les lettres formelles.",
                f"Cela limite l'influence du siège social sur les filiales locales.",
                f"Cela rend les contrats juridiques plus courts et moins détaillés."
            ]
            explanation = f"Une interprétation standardisée de \"{vocab}\" prévient les erreurs de communication internationales coûteuses."
            
        choice_questions.append({
            "id": f"{lesson_id}-q-choice-{q_num}",
            "type": "quiz_choice",
            "question": question,
            "options": options,
            "correct_answer": correct,
            "explanation": explanation
        })
    
    # Order Sentence Stage
    order_questions = []
    if level_id in ["a1", "a2"]:
        templates = [
            (f"Nous utilisons notre {vocab} pendant les réunions.", ["Nous", "utilisons", "notre", vocab, "pendant", "les", "réunions."]),
            (f"Voici notre {vocab} pour le projet.", ["Voici", "notre", vocab, "pour", "le", "projet."]),
            (f"Je dois vérifier notre {vocab} ce matin.", ["Je", "dois", "vérifier", "notre", vocab, "ce", "matin."]),
            (f"Veuillez présenter votre {vocab} maintenant s'il vous plaît.", ["Veuillez", "présenter", "votre", vocab, "maintenant", "s'il", "vous", "plaît."]),
            (f"Notre équipe apprécie chaque {vocab} de bureau.", ["Notre", "équipe", "apprécie", "chaque", vocab, "de", "bureau."]),
            (f"Pouvez-vous confirmer notre {vocab} avant midi ?", ["Pouvez-vous", "confirmer", "notre", vocab, "avant", "midi", "?"]),
            (f"Nous devons organiser notre {vocab} cette semaine.", ["Nous", "devons", "organiser", "notre", vocab, "cette", "semaine."]),
            (f"Examinons le statut de notre {vocab} ensemble.", ["Examinons", "le", "statut", "de", "notre", vocab, "ensemble."]),
            (f"Ils souhaitent améliorer notre {vocab} de travail.", ["Ils", "souhaitent", "améliorer", "notre", vocab, "de", "travail."]),
            (f"Elle travaille avec notre {vocab} tous les jours.", ["Elle", "travaille", "avec", "notre", vocab, "tous", "les", "jours."])
        ]
    elif level_id in ["b1", "b2"]:
        templates = [
            (f"Nous devons implémenter votre {vocab} pour optimiser le travail.", ["Nous", "devons", "implémenter", "votre", vocab, "pour", "optimiser", "le", "travail."]),
            (f"Notre stratégie actuelle privilégie votre {vocab} pour le client.", ["Notre", "stratégie", "actuelle", "privilégie", "votre", vocab, "pour", "le", "client."]),
            (f"Veuillez vous coordonner avec l'équipe concernant notre {vocab}.", ["Veuillez", "vous", "coordonner", "avec", "l'équipe", "concernant", "notre", f"{vocab}."]),
            (f"Planifions une réunion rapide pour discutir de notre {vocab}.", ["Planifions", "une", "réunion", "rapide", "pour", "discuter", "de", "notre", f"{vocab}."]),
            (f"Le chef de projet demande un rapport sur notre {vocab}.", ["Le", "chef", "de", "projet", "demande", "un", "rapport", "sur", "notre", f"{vocab}."]),
            (f"Nous devons analyser comment notre {vocab} influence le budget.", ["Nous", "devons", "analyser", "comment", "notre", vocab, "influence", "le", "budget."]),
            (f"Pouvez-vous confirmer le calendrier pour livrer notre {vocab} ?", ["Pouvez-vous", "confirmer", "le", "calendrier", "pour", "livrer", "notre", f"{vocab} ?"]),
            (f"Cette initiative s'aligne avec les objectifs de notre {vocab}.", ["Cette", "initiative", "s'aligne", "avec", "les", "objectifs", "de", "notre", f"{vocab}."]),
            (f"Ils ont décidé d'externaliser la gestion de notre {vocab}.", ["Ils", "ont", "décidé", "d'externaliser", "la", "gestion", "de", "notre", f"{vocab}."]),
            (f"Nous devrions nous concentrer sur l'amélioration de notre {vocab}.", ["Nous", "devrions", "nous", "concentrer", "sur", "l'amélioration", "de", "notre", f"{vocab}."])
        ]
    else: # c1, c2, tfi, m1, m2, pro
        templates = [
            (f"L'alignement stratégique exige un respect strict de notre {vocab}.", ["L'alignement", "stratégique", "exige", "un", "respect", "strict", "de", "notre", f"{vocab}."]),
            (f"Nous exploitons notre {vocab} pour atténuer les risques globaux.", ["Nous", "exploitons", "notre", vocab, "pour", "atténuer", "les", "risques", "globaux."]),
            (f"Le comité de direction a priorisé notre {vocab} cette année.", ["Le", "comité", "de", "direction", "a", "priorisé", "notre", vocab, "cette", "année."]),
            (f"Notre transition numérique repose fortement sur l'intégration de notre {vocab}.", ["Notre", "transition", "numérique", "repose", "fortement", "sur", "l'intégration", "de", "notre", f"{vocab}."]),
            (f"Une vérification approfondie a révélé des lacunes concernant notre {vocab}.", ["Une", "vérification", "approfondie", "a", "révélé", "des", "lacunes", "concernant", "notre", f"{vocab}."]),
            (f"Nous devons renégocier les conditions pour protéger notre {vocab}.", ["Nous", "devons", "renégocier", "les", "conditions", "pour", "protéger", "notre", f"{vocab}."]),
            (f"Cette fusion est conçue pour générer des synergies avec notre {vocab}.", ["Cette", "fusion", "est", "conçue", "pour", "générer", "des", "synergies", "avec", "notre", f"{vocab}."]),
            (f"Il a prononcé un discours convaincant sur notre {vocab}.", ["Il", "a", "prononcé", "un", "discours", "convaincant", "sur", "notre", f"{vocab}."]),
            (f"Notre coentreprise va se concentrer sur le développement de notre {vocab}.", ["Notre", "coentreprise", "va", "se", "concentrer", "sur", "le", "développement", "de", "notre", f"{vocab}."]),
            (f"La conformité réglementaire nous impose de sécuriser notre {vocab}.", ["La", "conformité", "réglementaire", "nous", "impose", "de", "sécuriser", "notre", f"{vocab}."])
        ]
        
    for q_idx, (full_sentence, correct_order) in enumerate(templates):
        parts = correct_order.copy()
        if len(parts) > 3:
            parts = parts[2:] + parts[:2]
        
        order_questions.append({
            "id": f"{lesson_id}-q-order-{q_idx+1}",
            "type": "order_sentence",
            "question": f"Arrangez les mots pour construire une phrase professionnelle concernant \"{vocab}\" (Exercice {q_idx+1}) :",
            "parts": parts,
            "correct_order": correct_order,
            "explanation": f"L'ordre correct des mots est essentiel pour exprimer clairement les concepts liés à \"{vocab}\"."
        })
        
    # Listening Stage
    listening_questions = []
    listening_sentences = [
        f"Notre objectif principal est de discuter de notre \"{vocab}\" en détail.",
        f"Pourriez-vous s'il vous plaît clarifier le statut de notre \"{vocab}\" ?",
        f"Nous sommes pleinement engagés à améliorer notre \"{vocab}\" cette année.",
        f"Le client a donné un retour très positif sur notre \"{vocab}\".",
        f"Alignons nos calendriers pour nous concentrer sur notre \"{vocab}\"."
    ]
    for q_idx, text in enumerate(listening_sentences):
        listening_questions.append({
            "id": f"{lesson_id}-q-listening-{q_idx+1}",
            "type": "listening_match",
            "question": "Sélectionnez exactement ce que vous entendez dans le flux audio :",
            "tts_text": text,
            "options": [
                text,
                f"Une autre déclaration sur notre \"{vocab}\" qui n'est pas correcte.",
                "Une phrase d'affaires générique sans rapport avec le sujet."
            ],
            "correct_answer": text,
            "explanation": f"L'écoute active assure la bonne compréhension auditive de \"{vocab}\" en réunion."
        })
        
    # Fill Input Stage
    fill_questions = []
    spelling_part = vocab[:3] if len(vocab) >= 3 else vocab[:2]
    blank_suffix = "_" * (len(vocab) - len(spelling_part))
    fill_questions.append({
        "id": f"{lesson_id}-q-fill-1",
        "type": "fill_input",
        "question": f"Complétez l'orthographe du vocabulaire professionnel : \"{spelling_part}{blank_suffix}\" (Indice : désigne \"{vocab}\")",
        "correct_answers": [vocab, vocab.capitalize()],
        "hints": [f"Commence par '{spelling_part}'"],
        "explanation": f"Cet exercice teste votre orthographe active de \"{vocab}\"."
    })
    
    if level_id in ["a1", "a2"]:
        fill_questions.append({
            "id": f"{lesson_id}-q-fill-2",
            "type": "fill_input",
            "question": f"Complétez la phrase : \"L'équipe veut discuter de notre {vocab} ____ lundi matin.\" (le / en)",
            "correct_answers": ["le"],
            "hints": ["Article défini utilisé devant les jours de la semaine"],
            "explanation": "En français, on utilise l'article défini 'le' devant un jour de la semana pour indiquer un rendez-vous habituel ou fixe."
        })
        fill_questions.append({
            "id": f"{lesson_id}-q-fill-3",
            "type": "fill_input",
            "question": f"Complétez la phrase : \"Veuillez ____ attention à ne pas faire d'erreur sur notre {vocab}.\" (faire / prendre)",
            "correct_answers": ["faire", "Faire"],
            "hints": ["Verbe signifiant effectuer ou prêter attention"],
            "explanation": "L'expression 'faire attention' est une collocation standard en français."
        })
        fill_questions.append({
            "id": f"{lesson_id}-q-fill-4",
            "type": "fill_input",
            "question": f"Complétez la phrase : \"Nous devons organiser une ____ pour revoir notre {vocab}.\" (réunion / carte)",
            "correct_answers": ["réunion", "discussion", "session"],
            "hints": ["Un rassemblement de personnes pour travailler ensemble"],
            "explanation": "Une 'réunion' est le terme standard pour un meeting professionnel."
        })
        fill_questions.append({
            "id": f"{lesson_id}-q-fill-5",
            "type": "fill_input",
            "question": f"Complétez la phrase : \"Il nous faut un rapport ____ sur le statut de notre {vocab}.\" (clair / lent)",
            "correct_answers": ["clair"],
            "hints": ["Facile à comprendre et bien structuré"],
            "explanation": "Un rapport 'clair' est indispensable pour assurer l'alignement."
        })
    elif level_id in ["b1", "b2"]:
        fill_questions.append({
            "id": f"{lesson_id}-q-fill-2",
            "type": "fill_input",
            "question": f"Complétez la phrase : \"Notre stratégie actuelle concernant notre {vocab} dépend ____ l'équipe.\" (de / par)",
            "correct_answers": ["de", "d'"],
            "hints": ["Préposition après le verbe dépendre"],
            "explanation": "Le verbe dépendre se construit avec la préposition de."
        })
        fill_questions.append({
            "id": f"{lesson_id}-q-fill-3",
            "type": "fill_input",
            "question": f"Complétez la phrase : \"Nous devons ____ nos ressources pour améliorer notre {vocab}.\" (allouer / ignorer)",
            "correct_answers": ["allouer", "Allouer"],
            "hints": ["Distribuer ou attribuer des ressources"],
            "explanation": "Allouer des ressources signifie les dédier stratégiquement."
        })
        fill_questions.append({
            "id": f"{lesson_id}-q-fill-4",
            "type": "fill_input",
            "question": f"Complétez la phrase : \"Le responsable de département a demandé une ____ sur notre {vocab}.\" (mise à jour / pause)",
            "correct_answers": ["mise à jour", "analyse", "évaluation"],
            "hints": ["Dernières informations sur l'état d'avancement"],
            "explanation": "Une 'mise à jour' est essentielle pour suivre le statut d'un projet."
        })
        fill_questions.append({
            "id": f"{lesson_id}-q-fill-5",
            "type": "fill_input",
            "question": f"Complétez la phrase : \"Établir un cadre ____ pour notre {vocab} est notre priorité.\" (solide / simple)",
            "correct_answers": ["solide"],
            "hints": ["Robuste, stable et bien défini"],
            "explanation": "Un cadre 'solide' prévient les risques et dérives futures."
        })
    else: # c1, c2, tfi, m1, m2, pro
        fill_questions.append({
            "id": f"{lesson_id}-q-fill-2",
            "type": "fill_input",
            "question": f"Complétez la phrase : \"Bien que notre transition soit complexe, elle ____ nécessaire pour optimiser notre {vocab}.\" (est / soit)",
            "correct_answers": ["soit", "est"],
            "hints": ["Subjonctif requis après 'bien que' pour exprimer la concession"],
            "explanation": "La conjonction 'bien que' exige traditionnellement le subjonctif ('soit')."
        })
        fill_questions.append({
            "id": f"{lesson_id}-q-fill-3",
            "type": "fill_input",
            "question": f"Complétez la phrase : \"Il est essentiel que le conseil ____ notre proposition sur {vocab}.\" (approuve / approuver)",
            "correct_answers": ["approuve"],
            "hints": ["Subjonctif requis après 'il est essentiel que'"],
            "explanation": "Les expressions de nécessité impersonnelles comme 'il est essentiel que' imposent l'usage du subjonctif."
        })
        fill_questions.append({
            "id": f"{lesson_id}-q-fill-4",
            "type": "fill_input",
            "question": f"Complétez la phrase : \"Nous parviendrons à optimiser {vocab} ____ allouant plus de capital.\" (en / par)",
            "correct_answers": ["en"],
            "hints": ["Préposition du gérondif exprimant le moyen"],
            "explanation": "Le gérondif en français s'exprime par 'en' suivi du participe présent."
        })
        fill_questions.append({
            "id": f"{lesson_id}-q-fill-5",
            "type": "fill_input",
            "question": f"Complétez la phrase : \"La revalorisation de {vocab} a généré d'importantes ____ pour le groupe.\" (synergies / pertes)",
            "correct_answers": ["synergies"],
            "hints": ["Bénéfices mutuels issus de l'association de ressources"],
            "explanation": "Les 'synergies' désignent les effets de levier positifs d'une restructuration réussie."
        })
        
    lesson_json = {
        "id": lesson_id,
        "title": title,
        "level": level_id.upper(),
        "description": description,
        "total_xp": 300,
        "difficulty": difficulty,
        "tags": [level_id.lower(), "standard", "french", "didactic", "grammar", "vocabulary"],
        "stages": [
            theory_stage,
            {
                "id": "stg_drill_choice",
                "type": "gamified_quiz",
                "title": "Drill 1: Vocabulaire de Direction",
                "questions": choice_questions
            },
            {
                "id": "stg_drill_order",
                "type": "gamified_quiz",
                "title": "Drill 2: Construction de la Syntaxe",
                "questions": order_questions
            },
            {
                "id": "stg_drill_listening",
                "type": "gamified_quiz",
                "title": "Drill 3: Traitement Auditif",
                "questions": listening_questions
            },
            {
                "id": "stg_drill_writing",
                "type": "gamified_quiz",
                "title": "Drill 4: Précision Écrite",
                "questions": fill_questions
            }
        ]
    }
    
    file_path = os.path.join(lessons_dir, f"{lesson_id}.json")
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(lesson_json, f, indent=2, ensure_ascii=False)

# 3. WRITE TS FILE DYNAMICALLY FOR THE FRONTEND
def generate_frontend_ts_file(temas_a, temas_b, temas_c):
    print("Writing frontend curriculum_fr.ts file...")
    
    temas_a_clean = [[TITLE_MAPPING.get(item[0], item[0]), item[1], VOCAB_MAPPING.get(item[2], item[2])] for item in temas_a]
    temas_b_clean = [[TITLE_MAPPING.get(item[0], item[0]), item[1], VOCAB_MAPPING.get(item[2], item[2])] for item in temas_b]
    temas_c_clean = [[TITLE_MAPPING.get(item[0], item[0]), item[1], VOCAB_MAPPING.get(item[2], item[2])] for item in temas_c]
    
    temas_a_str = json.dumps(temas_a_clean, indent=2, ensure_ascii=False)
    temas_b_str = json.dumps(temas_b_clean, indent=2, ensure_ascii=False)
    temas_c_str = json.dumps(temas_c_clean, indent=2, ensure_ascii=False)
    
    ts_code = f"""import {{ LevelSection, LessonNode, ExerciseType }} from './curriculum';

// --- CURRÍCULUM CON 200 LECCIONES REALES EN FRANCÉS POR NIVEL (2000 LECCIONES TOTALES) ---

const TEMAS_A_DATA: string[][] = {temas_a_str};

const TEMAS_B_DATA: string[][] = {temas_b_str};

const TEMAS_C_DATA: string[][] = {temas_c_str};

// Generar lecciones de forma dinámica con tipado seguro
const buildLessons = (prefix: string, rawData: string[][], limit = 200): LessonNode[] => {{
  const lessons: LessonNode[] = [];
  for (let idx = 0; idx < limit; idx++) {{
    const num = idx + 1;
    const id = `fr-${{prefix}}-${{num}}`;
    
    // Alternar tipos de ejercicio
    const types: ExerciseType[] = ['lecture', 'grammar', 'chat', 'listening'];
    const type = types[idx % types.length];
    
    // Posición para diseño en zigzag serpentine
    const positions: ('left' | 'center' | 'right')[] = ['center', 'left', 'center', 'right'];
    const position = positions[idx % positions.length];
    
    const dataItem = rawData[idx % rawData.length];
    const title = num > 100 ? `${{dataItem[0]}} Pt. 2` : dataItem[0];
    
    lessons.push({{
      id,
      title,
      description: dataItem[1],
      type,
      locked: !(prefix === 'a1' && num === 1), // Desbloqueada únicamente fr-a1-1 por defecto
      completed: false,
      stars: 0,
      position,
      aiPrompt: `Roleplay: Discuss the topic of '${{dataItem[0]}}' in French using the key terminology related to '${{dataItem[2]}}'.`
    }});
  }}
  return lessons;
}}

export const CURRICULUM_FR: LevelSection[] = [
  {{
    id: 'FR-A1',
    title: 'Nivel A1: Bases y Supervivencia',
    description: 'Establece los cimientos indispensables del francés y sobrevive en entornos de trabajo.',
    color: 'emerald',
    lessons: buildLessons('a1', TEMAS_A_DATA, 200)
  }},
  {{
    id: 'FR-A2',
    title: 'Nivel A2: Comunicación Cotidiana',
    description: 'Domina tareas cotidianas y operativas en francés de negocios.',
    color: 'emerald',
    lessons: buildLessons('a2', TEMAS_A_DATA, 200)
  }},
  {{
    id: 'FR-B1',
    title: 'Nivel B1: Autonomía de Oficina',
    description: 'Comunícate con soltura, redacta correos formales y lidera juntas con precisión.',
    color: 'blue',
    lessons: buildLessons('b1', TEMAS_B_DATA, 200)
  }},
  {{
    id: 'FR-B2',
    title: 'Nivel B2: Operaciones Ejecutivas',
    description: 'Domina la agilidad operativa, gestión de proyectos y retroalimentación de equipos.',
    color: 'blue',
    lessons: buildLessons('b2', TEMAS_B_DATA, 200)
  }},
  {{
    id: 'FR-C1',
    title: 'Nivel C1: Liderazgo Estratégico',
    description: 'Domina negociaciones de alto nivel, fusiones y discursos ante mesas directivas.',
    color: 'orange',
    lessons: buildLessons('c1', TEMAS_C_DATA, 200)
  }},
  {{
    id: 'FR-C2',
    title: 'Nivel C2: Geopolítica Global',
    description: 'Lidera la toma de decisiones corporativas globales con total naturalidad y retórica fina.',
    color: 'orange',
    lessons: buildLessons('c2', TEMAS_C_DATA, 200)
  }},
  {{
    id: 'FR-TFI',
    title: 'Certificación: TFI® Mastery',
    description: 'Preparación de alto rendimiento para el examen oficial TFI® de habilidades lingüísticas.',
    color: 'purple',
    lessons: buildLessons('tfi', TEMAS_C_DATA, 200)
  }},
  {{
    id: 'FR-M1',
    title: 'Business Mastery I: RRPP y Crisis',
    description: 'Gestiona la reputación de marca, relaciones de prensa y comunicación estratégica de crisis.',
    color: 'purple',
    lessons: buildLessons('m1', TEMAS_C_DATA, 200)
  }},
  {{
    id: 'FR-M2',
    title: 'Business Mastery II: Fusiones',
    description: 'Lidera integraciones corporativas y negociaciones de fusiones transfronterizas.',
    color: 'purple',
    lessons: buildLessons('m2', TEMAS_C_DATA, 200)
  }},
  {{
    id: 'FR-PRO',
    title: 'Pro Executive Operations: Gobernanza',
    description: 'Auditoría ética, supervisión regulatoria global y toma de decisiones a nivel de mesa directiva.',
    color: 'purple',
    lessons: buildLessons('pro', TEMAS_C_DATA, 200)
  }}
];

// Helper para búsqueda rápida
export function getFrenchLessonById(id: string): LessonNode | undefined {{
    const cleanId = id.toLowerCase();
    for (const section of CURRICULUM_FR) {{
        const lesson = section.lessons.find(l => l.id.toLowerCase() === cleanId);
        if (lesson) return lesson;
    }}
    return undefined;
}}
"""
    with open(frontend_curriculum_file, "w", encoding="utf-8") as f:
        f.write(ts_code)
    print("Frontend curriculum_fr.ts successfully updated!")

def main():
    print("Loading English topics from expand_curriculum_300...")
    from expand_curriculum_300 import TEMAS_A, TEMAS_B, TEMAS_C
    
    # Clean old files to ensure pristine standard cache
    print("Cleaning old French JSON files...")
    if os.path.exists(lessons_dir):
        for f in os.listdir(lessons_dir):
            if f.endswith(".json"):
                os.remove(os.path.join(lessons_dir, f))
    
    print("Generating 2000 professional unique lessons for French backend...")
    count = 0
    
    levels_config = [
        ("a1", TEMAS_A),
        ("a2", TEMAS_A),
        ("b1", TEMAS_B),
        ("b2", TEMAS_B),
        ("c1", TEMAS_C),
        ("c2", TEMAS_C),
        ("tfi", TEMAS_C),
        ("m1", TEMAS_C),
        ("m2", TEMAS_C),
        ("pro", TEMAS_C)
    ]
    
    for level_id, temas_list in levels_config:
        print(f"-> Generating level {level_id.upper()}...")
        for idx in range(200):
            item = temas_list[idx % len(temas_list)]
            generate_lesson_file(level_id, idx + 1, item[0], item[1], item[2])
            count += 1
            
    print(f"Successfully generated {count} French custom lessons JSON files.")
    
    generate_frontend_ts_file(TEMAS_A, TEMAS_B, TEMAS_C)

if __name__ == "__main__":
    main()
