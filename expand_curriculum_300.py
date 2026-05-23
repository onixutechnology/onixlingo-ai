import os
import json

# MASTER CURRICULUM DATA - LEVEL A (100 ITEMS)
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
  ["Review Milestone A", "Consolidación de todo el vocabulario del Nivel A.", "summary"],
  ["Office Stationery", "Vocabulario básico para herramientas de escritura y papelería.", "pen"],
  ["Ergonomic Chair", "Discussing office furniture and comfortable seating.", "chair"],
  ["Midday Break", "Vocabulario esencial para ordenar almuerzos rápidos.", "lunch"],
  ["Daily Schedule", "Organización y lectura de horarios básicos de trabajo.", "time"],
  ["Creating an Agenda", "Cómo enlistar los puntos a tratar en una reunión.", "agenda"],
  ["Writing a Note", "Dejar recordatorios breves en el escritorio de un colega.", "note"],
  ["File Cabinet", "Organización física de carpetas y documentos.", "folder"],
  ["Answering Calls", "Tomar mensajes de voz sencillos en el teléfono de la oficina.", "telephone"],
  ["Sending Emails", "Estructura básica para enviar correos rápidos.", "send"],
  ["Receiving a Reply", "Checking your inbox for simple confirmations.", "reply"],
  ["Document Security", "Almacenar archivos confidenciales de forma segura.", "safe"],
  ["Office Windows", "Describir el entorno físico de la oficina.", "window"],
  ["Water Cooler Talk", "Conversaciones casuales y breves de pasillo.", "water"],
  ["Afternoon Tea", "Breve descanso para recargar energías.", "tea"],
  ["Lunchbox Choices", "Healthy options for eating at the workplace.", "lunchbox"],
  ["Short Break", "Managing small pauses during high-productivity hours.", "snack"],
  ["Team Sync", "Short standing meetings to align daily tasks.", "sync"],
  ["Arriving at Work", "Describing your morning commute and arrival times.", "arrive"],
  ["Departing the Office", "Saying goodbye to colleagues at the end of the day.", "depart"],
  ["Starting a Project", "First steps and simple discussions about new tasks.", "start"],
  ["Finishing Tasks", "How to report that a daily assignment is completed.", "finish"],
  ["Weekly Report", "Simple summary of your accomplishments.", "report"],
  ["Making Copies", "Using the office printer and copier machines.", "copy"],
  ["Desktop Screen", "Describing your computer monitor and setup.", "screen"],
  ["Keyboard Shortcuts", "Basic typing skills to save time at work.", "keyboard"],
  ["Internet Access", "Simple phrases to report connection issues.", "internet"],
  ["Login Credentials", "Setting up passwords and usernames securely.", "login"],
  ["Access Denied", "Reporting IT blockages and login errors.", "password"],
  ["Office Table", "Arranging physical desks for collaborative work.", "table"],
  ["Taxi Dispatch", "Ordering transportation for local business visits.", "taxi"],
  ["Train Station", "Navigating public transit for your daily commute.", "train"],
  ["Bus Stop", "Understanding public bus routes near the office.", "bus"],
  ["Hotel Reservation", "Simple vocabulary to confirm a room booking.", "hotel"],
  ["Passport Control", "Basic travel logistics at international borders.", "passport"],
  ["Flight Boarding", "Understanding airport gate announcements.", "gate"],
  ["Office Keys", "Requesting access badges and physical keys.", "key"],
  ["Meeting Rooms", "Booking empty spaces for team discussions.", "boardroom"],
  ["Coffee Machine", "How to make or order coffee in the lounge.", "coffeemaker"],
  ["Desk Organizer", "Keeping your working area clean and tidy.", "organizer"],
  ["Writing Tools", "Basic office supplies for drafting diagrams.", "pencil"],
  ["Notebook Entry", "Jotting down quick ideas during a presentation.", "notebook"],
  ["Sticky Notes", "Color-coded reminders for short-term tasks.", "sticker"],
  ["Calculator Tools", "Basic math operations for daily cost estimation.", "calculator"],
  ["Office Clock", "Checking elapsed time during business meetings.", "wallclock"],
  ["Visitor Badge", "Registering external guests at the lobby.", "visitor"],
  ["Parking Space", "Asking for corporate parking permits and spots.", "parking"],
  ["Elevator Floor", "Navigating high-rise office buildings.", "elevator"],
  ["First Aid Kit", "Locating emergency medical supplies at work.", "bandage"],
  ["Office Air", "Adjusting temperature and ventilation controls.", "fan"],
  ["Lunch Menu", "Reading cafeteria options and selecting dishes.", "menu"],
  ["Payment Receipt", "Asking for simple bills and transaction vouchers.", "receipt"],
  ["Store Purchase", "Buying urgent equipment for a presentation.", "purchase"],
  ["Desk Lamp", "Ensuring proper lighting at your workspace.", "lamp"],
  ["Trash Disposal", "Simple recycling policies and waste bins.", "bin"],
  ["Corporate Mug", "Branded items and simple office kitchen supplies.", "mug"],
  ["Laptop Charger", "Reporting low battery and power issues.", "charger"],
  ["Headphone Jack", "Using audio gear for virtual conference calls.", "audio"],
  ["Team Photo", "Building workplace memories and simple events.", "photo"],
  ["Clean Desk", "Basic hygiene and maintenance of work areas.", "clean"],
  ["Office Plant", "Describing green spaces that improve productivity.", "plant"],
  ["Wall Calendar", "Tracking upcoming holidays and corporate events.", "calendar"],
  ["Briefcase Item", "Essential tools you bring to work every day.", "bag"],
  ["Filing Reports", "Organizing paper files in structured categories.", "file"],
  ["Welcome Desk", "Greeting visitors at the main reception area.", "lobby"],
  ["Snack Bar", "Selecting quick food items between meetings.", "fruit"],
  ["Closing Hour", "Final procedures before locked doors at night.", "lock"]
]

# MASTER CURRICULUM DATA - LEVEL B (100 ITEMS)
TEMAS_B = [
  ["Leading a Team Sync", "Cómo estructurar juntas operativas semanales.", "moderator"],
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
  ["Review Milestone B", "Evaluación de competencias gerenciales del Nivel B.", "progress"],
  ["Project Milestone Sync", "Definición y seguimiento de entregables específicos.", "schedules"],
  ["Constructive Feedback", "Metodologías de feedback para el desarrollo del equipo.", "constructive"],
  ["Data Interpretation", "Análisis de gráficos de barras y tendencias.", "trends"],
  ["Client Objections", "Manejo de objeciones comerciales con tacto profesional.", "objections"],
  ["Executive Scheduling", "Negociación de agendas y zonas horarias en juntas.", "schedulezone"],
  ["Action Items", "Asignación clara de tareas pendientes tras una reunión.", "actionable"],
  ["Status Update", "Presentar avances en el desarrollo de un proyecto.", "update"],
  ["Product Demo", "Presentar las características y beneficios de un software.", "demonstrate"],
  ["Customer Care", "Políticas de servicio al cliente y resolución de quejas.", "support"],
  ["Service Level Agreement", "Introducción a los contratos de nivel de servicio SLA.", "standards"],
  ["Inventory Auditing", "Control periódico de stock y materias primas.", "stock"],
  ["Market Analysis", "Estudiar la competencia y demanda de un producto.", "market"],
  ["Brand Strategy", "Desarrollo de identidad y posicionamiento de marca.", "branding"],
  ["Sales Pipeline", "Etapas de conversión de leads en clientes reales.", "pipeline"],
  ["Lead Generation", "Estrategias para atraer clientes potenciales.", "prospect"],
  ["Operational Efficiency", "Reducción de cuellos de botella en la producción.", "efficiency"],
  ["Capacity Planning", "Estimación de recursos y mano de obra necesaria.", "capacity"],
  ["Corporate Ethics", "Políticas internas anticorrupción y de transparencia.", "ethical"],
  ["Sustainable Office", "Iniciativas para reducir la huella de carbono laboral.", "green"],
  ["Safety Protocols", "Normas de seguridad ocupacional en la planta.", "safety"],
  ["Stress Management", "Técnicas de bienestar corporativo y productividad.", "wellness"],
  ["Creative Brainstorm", "Generación colectiva de ideas innovadoras.", "ideation"],
  ["Task Delegation", "Cómo asignar responsabilidades según habilidades.", "delegate"],
  ["Goal Alignment", "Sincronizar metas individuales con las corporativas.", "alignment"],
  ["Project Budget", "Estructurar costos y gastos de una campaña.", "costs"],
  ["Cost Allocation", "Distribución de gastos entre diferentes áreas.", "expenses"],
  ["Revenue Streams", "Identificar las fuentes principales de ingresos.", "income"],
  ["Pricing Model", "Estrategias de precios según la demanda del mercado.", "pricing"],
  ["Launch Timeline", "Cronograma estratégico para un nuevo producto.", "timelines"],
  ["Outsourcing Risks", "Ventajas y riesgos de contratar servicios externos.", "outsourcer"],
  ["Employee Attrition", "Análisis de rotación de personal y retención.", "turnover"],
  ["Onboarding Guide", "Integración efectiva de nuevos talentos al equipo.", "onboard"],
  ["Skills Matrix", "Evaluación de competencias dentro de un departamento.", "skills"],
  ["Corporate Culture", "Valores y hábitos de convivencia en la organización.", "culture"],
  ["Mentorship Program", "Guía y desarrollo de profesionales junior.", "mentor"],
  ["Conflict Mediation", "Resolución diplomática de tensiones internas.", "mediation"],
  ["Agile Framework", "Introducción a la metodología Scrum en proyectos.", "scrum"],
  ["Sprint Planning", "Juntas de planeación de tareas a corto plazo.", "sprint"],
  ["Daily Standup", "Reuniones cortas diarias para actualizar avances.", "standup"],
  ["Performance Review", "Evaluación de KPIs y cumplimiento de objetivos.", "appraisal"],
  ["Career Pathing", "Estructuración de planes de crecimiento interno.", "promotion"],
  ["Remote Collaboration", "Herramientas y etiqueta para el trabajo en casa.", "remote"],
  ["Virtual Tools", "Uso eficiente de plataformas de videoconferencia.", "zoom"],
  ["Email Netiquette", "Reglas no escritas de la correspondencia formal.", "etiquette"],
  ["Pitch Deck Basics", "Estructura de diapositivas para convencer inversores.", "deck"],
  ["Elevator Speech", "Presentación de tu proyecto en menos de un minuto.", "concise"],
  ["Networking Events", "Cómo romper el hielo y construir contactos valiosos.", "contacts"],
  ["Business Cards", "Intercambio de datos e información de contacto.", "card"],
  ["LinkedIn Branding", "Optimización del perfil profesional en redes.", "profile"],
  ["Survey Analysis", "Diseño e interpretación de encuestas de satisfacción.", "survey"],
  ["NPS Score", "Medición de lealtad de clientes mediante Net Promoter Score.", "promoter"],
  ["Customer Persona", "Perfil representativo del cliente ideal.", "persona"],
  ["User Experience", "Introducción al diseño centrado en el usuario.", "ux"],
  ["Quality Control", "Normas básicas de inspección y estándares ISO.", "quality"],
  ["Risk Mitigation", "Estrategias sencillas para evitar pérdidas en proyectos.", "mitigate"],
  ["Data Backup", "Políticas de resguardo de información crítica.", "backup"],
  ["IT Ticketing", "Reportar y dar seguimiento a fallas del sistema.", "ticketcode"],
  ["Software Update", "Programación de mantenimiento informático.", "patch"],
  ["Server Migration", "Traslado seguro de bases de datos locales.", "database"],
  ["Office Ergonomics Professional", "Diseño del espacio para evitar lesiones físicas.", "ergonomics"],
  ["Facility Management", "Mantenimiento y servicios del edificio de oficinas.", "maintenance"],
  ["Workplace Safety", "Prevención de riesgos laborales en el día a día.", "prevention"],
  ["Travel Expenses", "Comprobación y reembolso de viáticos de viaje.", "reimbursement"],
  ["Itinerary Planning", "Coordinación detallada de vuelos y hospedaje.", "itinerary"],
  ["Conference Booking", "Reservación de stands en eventos internacionales.", "booth"],
  ["Team Integration", "Planificación de dinámicas y eventos para fortalecer al equipo.", "teambuilding"],
  ["Review Milestone B2", "Evaluación de competencias operativas y de gestión.", "assessment"]
]

# MASTER CURRICULUM DATA - LEVEL C (100 ITEMS)
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
  ["Milestone Capstone C", "Evaluación de competencias directivas globales.", "capstone"],
  ["Corporate Restructuring", "Rediseño organizacional para mejorar rentabilidad.", "restructuring"],
  ["Regulatory Compliance", "Normas estrictas de cumplimiento legal y ambiental.", "regulatory"],
  ["Antitrust Regulations", "Leyes de competencia y prevención de monopolios.", "antitrust"],
  ["Litigation Management", "Gestión de disputas legales y demandas marcarias.", "litigation"],
  ["Patent Protection", "Registro de patentes y defensa de propiedad intelectual.", "patent"],
  ["Trademark Disputes", "Resolución de conflictos de marcas registradas.", "disputes"],
  ["Board of Directors", "Dinámica y responsabilidades de la junta directiva.", "board"],
  ["Shareholder Activism", "Relación con accionistas que presionan por cambios.", "shareholder"],
  ["Executive Compensation", "Estructuración de bonos y opciones sobre acciones.", "remuneration"],
  ["IPO Roadshow", "Presentación ante inversionistas previo a salir a bolsa.", "roadshow"],
  ["Exit Strategy", "Vías de salida: adquisiciones, fusiones o liquidación.", "exit"],
  ["Hostile Takeover", "Estrategias de defensa ante compras hostiles de acciones.", "takeover"],
  ["Venture Capital Rounds", "Levantamiento de capital de riesgo Serie A y B.", "funding"],
  ["Private Equity", "Inversión institucional en empresas de alto potencial.", "equity"],
  ["Due Diligence Audit", "Auditoría exhaustiva previa a la adquisición de activos.", "diligence"],
  ["Merger Synergies", "Estimación de ahorros operativos tras una fusión.", "synergies"],
  ["Strategic Alliance Setup", "Acuerdos de cooperación conjunta entre corporativos.", "strategicalliance"],
  ["Joint Venture Setup", "Creación de una nueva entidad compartida.", "jointventure"],
  ["Cross-Border M&A", "Fusiones transfronterizas y barreras regulatorias.", "crossborder"],
  ["Carbon Footprint", "Estrategias para alcanzar la neutralidad de carbono.", "decarbonization"],
  ["Social Responsibility", "Programas de impacto social y filantropía.", "philanthropy"],
  ["Crisis Communication", "Estrategias de relaciones públicas ante escándalos de marca.", "pr"],
  ["Reputation Management", "Medición y protección del valor de la marca.", "reputation"],
  ["Media Training", "Preparación de directivos para interviews de prensa.", "pressinterview"],
  ["Public Speaking Rhetoric", "Tácticas avanzadas de oratoria y persuasión de masas.", "oratorical"],
  ["Keynote Address", "Discursos magistrales en convenciones globales.", "keynote"],
  ["Fiduciary Duty", "Responsabilidad legal y financiera ante los inversores.", "fiduciary"],
  ["Capital Allocation", "Decidir la reinversión de utilidades en la empresa.", "capitalallocation"],
  ["Treasury Management", "Control de liquidez, divisas y flujo de caja global.", "treasury"],
  ["Hedging Strategies", "Uso de derivados para protegerse contra fluctuaciones.", "hedging"],
  ["Asset Valuation", "Modelos matemáticos para calcular el precio de activos.", "valuation"],
  ["Dividend Policy", "Decidir el reparto de utilidades a los accionistas.", "dividend"],
  ["Debt Restructuring", "Negociar nuevos plazos de pago con bancos acreedores.", "debt"],
  ["Global Supply Chain", "Asegurar el abasto internacional contra contingencias.", "globalsupply"],
  ["Logistics Resilience", "Resiliencia ante cuellos de botella en puertos globales.", "portresilience"],
  ["Outsourcing Strategy", "Decisión estratégica de fabricar o externalizar.", "offshoring"],
  ["Geopolitical Strategy", "Adaptar operaciones ante guerras comerciales y aranceles.", "geopolitics"],
  ["Market Disruption", "Innovaciones tecnológicas que cambian las reglas del juego.", "disruption"],
  ["AI Integration", "Automatización y adopción de IA generativa en la empresa.", "automation"],
  ["Data Privacy Laws", "Cumplimiento de regulaciones estrictas como GDPR.", "privacy"],
  ["Intellectual Capital", "Retener talento clave tras reestructuraciones.", "intellectual"],
  ["Cultural Alignment", "Fusionar culturas corporativas de distintos países.", "culturalalign"],
  ["Brand Valuation", "Estimar el valor monetario intangible de una marca.", "brandvalue"],
  ["High-End Marketing", "Estrategias de posicionamiento en mercados de lujo.", "premium"],
  ["Franchise Scaling", "Modelos de expansión a través de franquicias globales.", "franchise"],
  ["Cross-Border Logistics", "Aduanas, aranceles y envíos transfronterizos.", "tariffs"],
  ["Behavioral Heuristics", "Cómo influyen los sesgos cognitivos en el consumo.", "heuristics"],
  ["Pricing Inelasticity", "Estudiar la sensibilidad del precio en el cliente.", "elasticity"],
  ["Customer Lifetime Value", "Optimización del valor a largo plazo de los clientes.", "clv"],
  ["Acquisition Cost", "Métricas del costo de adquisición de clientes (CAC).", "acquisition"],
  ["Business Intelligence", "Uso estratégico de Big Data para toma de decisiones.", "analytics"],
  ["Digital Transformation", "Migrar sistemas tradicionales a arquitecturas cloud.", "cloud"],
  ["Venture Studio Setup", "Creación de incubadoras internas de startups corporativas.", "incubator"],
  ["Shareholder Value Optimization", "Maximización de la rentabilidad a largo plazo para inversores.", "profitability"],
  ["Corporate Restructuring Strategy", "Planificación de escisiones y reorganización corporativa.", "divestiture"],
  ["Global Expansion Risk", "Evaluación de riesgos al ingresar a nuevos mercados soberanos.", "sovereign"],
  ["Regulatory Arbitrage", "Aprovechamiento estratégico de diferencias regulatorias globales.", "arbitrage"],
  ["Strategic Succession Planning", "Planificación sistemática para la transición del liderazgo ejecutivo.", "nomination"],
  ["Sustainable Debt Financing", "Emisión de bonos verdes y financiamiento de proyectos ecológicos.", "greenbonds"],
  ["High-Stakes Mediation", "Mediación diplomática y arbitraje en disputas comerciales.", "arbitration"],
  ["Venture Capital Exits", "Estrategias de salida y liquidación para inversiones de capital.", "liquidation"],
  ["Enterprise Risk Architecture", "Diseño de marcos integrales de gestión de riesgos corporativos.", "enterprise"],
  ["Cross-Cultural M&A Integration", "Integración posterior a la fusión de equipos globales diversos.", "multicultural"],
  ["Technology Transfer Agreements", "Acuerdos de licenciamiento y transferencia de tecnología patentada.", "licensing"],
  ["Public-Private Partnerships", "Estructuración de contratos de concesión con entidades gubernamentales.", "partnership"],
  ["Ethical Governance Oversight", "Supervisión de comités de auditoría y ética en la junta directiva.", "oversight"],
  ["Milestone Capstone Executive", "Evaluación de competencias directivas de alta gerencia.", "executive"]
]

# Ensure we have EXACTLY 100 items per level
assert len(TEMAS_A) == 100, f"TEMAS_A has {len(TEMAS_A)} items, needs 100"
assert len(TEMAS_B) == 100, f"TEMAS_B has {len(TEMAS_B)} items, needs 100"
assert len(TEMAS_C) == 100, f"TEMAS_C has {len(TEMAS_C)} items, needs 100"

# Target directories
lessons_dir = "c:\\Users\\jeico\\onixlingo\\language-ai-tutor\\backend\\app\\data\\lessons"
frontend_curriculum_file = "c:\\Users\\jeico\\onixlingo\\language-ai-tutor\\frontend\\data\\curriculum.ts"

os.makedirs(lessons_dir, exist_ok=True)

# 1. GENERATE BACKEND LESSON JSON FILES (300 FILES TOTAL)
def generate_lesson_file(level, index, title, description, vocab):
    lesson_id = f"{level.lower()}-{index}"
    difficulty = "easy" if level == "A" else "medium" if level == "B" else "hard"
    
    # Theory Stage
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
    
    # Choice Stage (10 Questions)
    choice_questions = []
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
    
    # Order Sentence Stage (10 Questions)
    order_questions = []
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
        parts = correct_order.copy()
        if len(parts) > 3:
            parts = parts[2:] + parts[:2]
        
        order_questions.append({
            "id": f"{lesson_id}-q-order-{q_idx+1}",
            "type": "order_sentence",
            "question": f"Arrange the words to make a professional sentence about '{vocab}' (Drill {q_idx+1}):",
            "parts": parts,
            "correct_order": correct_order,
            "explanation": f"Correct word order is vital to communicate concepts related to '{vocab}' clearly."
        })
        
    # Listening Stage (5 Questions)
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
        
    # Fill Input Stage (5 Questions)
    fill_questions = []
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
        fill_questions.append({
            "id": f"{lesson_id}-q-fill-2",
            "type": "fill_input",
            "question": f"Complete the sentence: 'The team wants to discuss the new {vocab} ____ Monday morning.' (on / at)",
            "correct_answers": ["on"],
            "hints": ["Preposition used with days of the week"],
            "explanation": f"We use 'on' with specific days of the week like Monday morning to schedule our {vocab} sync."
        })
        fill_questions.append({
            "id": f"{lesson_id}-q-fill-3",
            "type": "fill_input",
            "question": f"Complete the sentence: 'Please ____ sure to double-check the {vocab} details.' (make / take)",
            "correct_answers": ["make", "Make"],
            "hints": ["Starts with 'm'"],
            "explanation": f"The phrase 'make sure' is a standard business collocation meaning to ensure our {vocab} is accurate."
        })
        fill_questions.append({
            "id": f"{lesson_id}-q-fill-4",
            "type": "fill_input",
            "question": f"Complete the sentence: 'We should schedule a brief ____ to review our {vocab} progress.' (meeting / card)",
            "correct_answers": ["meeting", "sync", "call"],
            "hints": ["A business gathering to discuss work items"],
            "explanation": f"A 'meeting' is a professional gathering to discuss work items like {vocab}."
        })
        fill_questions.append({
            "id": f"{lesson_id}-q-fill-5",
            "type": "fill_input",
            "question": f"Complete the sentence: 'We need a ____ report about the {vocab} status.' (clear / slow)",
            "correct_answers": ["clear"],
            "hints": ["Easy to understand and well-structured"],
            "explanation": f"In business, 'clear' reports are preferred to ensure everyone understands the {vocab} status."
        })
    elif level == "B":
        fill_questions.append({
            "id": f"{lesson_id}-q-fill-2",
            "type": "fill_input",
            "question": f"Complete the sentence: 'Our current strategy regarding {vocab} depends ____ team coordination.' (on / from)",
            "correct_answers": ["on"],
            "hints": ["Verb 'depend' preposition"],
            "explanation": f"The verb 'depend' is always followed by the preposition 'on' in professional English."
        })
        fill_questions.append({
            "id": f"{lesson_id}-q-fill-3",
            "type": "fill_input",
            "question": f"Complete the sentence: 'We must ____ our resources to optimize {vocab} results.' (allocate / ignore)",
            "correct_answers": ["allocate", "Allocate"],
            "hints": ["To distribute or assign resources"],
            "explanation": f"To 'allocate' resources means to distribute or assign them for a specific business purpose like {vocab}."
        })
        fill_questions.append({
            "id": f"{lesson_id}-q-fill-4",
            "type": "fill_input",
            "question": f"Complete the sentence: 'The department manager requested a detailed ____ on {vocab}.' (update / break)",
            "correct_answers": ["update", "report"],
            "hints": ["Latest status or progress report"],
            "explanation": f"An 'update' provides the latest status or progress on a corporate topic like {vocab}."
        })
        fill_questions.append({
            "id": f"{lesson_id}-q-fill-5",
            "type": "fill_input",
            "question": f"Complete the sentence: 'Establishing a ____ framework for {vocab} is our top priority.' (robust / simple)",
            "correct_answers": ["robust"],
            "hints": ["Strong, healthy and resilient"],
            "explanation": f"A 'robust' framework is strong, healthy, and capable of supporting complex operations around {vocab}."
        })
    else: # Level C
        fill_questions.append({
            "id": f"{lesson_id}-q-fill-2",
            "type": "fill_input",
            "question": f"Complete the sentence: 'The executive board expressed concerns ____ the implementation of {vocab}.' (about / to)",
            "correct_answers": ["about"],
            "hints": ["Expressing worry or concern"],
            "explanation": f"In formal writing, we express concern 'about' or 'over' an issue like the {vocab} deployment."
        })
        fill_questions.append({
            "id": f"{lesson_id}-q-fill-3",
            "type": "fill_input",
            "question": f"Complete the sentence: 'We aim to ____ key synergies to drive {vocab} forward.' (leverage / reduce)",
            "correct_answers": ["leverage", "Leverage"],
            "hints": ["To use something to maximum advantage"],
            "explanation": f"To 'leverage' means to use something to maximum advantage, such as synergies to accelerate {vocab}."
        })
        fill_questions.append({
            "id": f"{lesson_id}-q-fill-4",
            "type": "fill_input",
            "question": f"Complete the sentence: 'This strategic initiative represents a major ____ in our {vocab} model.' (paradigm / delay)",
            "correct_answers": ["paradigm"],
            "hints": ["A fundamental change in approach or model"],
            "explanation": f"A 'paradigm' shift or model is a fundamental change in approach or underlying assumptions regarding {vocab}."
        })
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
    
    file_path = os.path.join(lessons_dir, f"{lesson_id}.json")
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(lesson_json, f, indent=2, ensure_ascii=False)

# 2. WRITE TS FILE DYNAMICALLY FOR THE FRONTEND
def generate_frontend_ts_file():
    print("Writing frontend curriculum.ts file...")
    temas_a_str = json.dumps(TEMAS_A, indent=2, ensure_ascii=False)
    temas_b_str = json.dumps(TEMAS_B, indent=2, ensure_ascii=False)
    temas_c_str = json.dumps(TEMAS_C, indent=2, ensure_ascii=False)
    
    ts_code = f"""export type ExerciseType = 'chat' | 'grammar' | 'listening' | 'toeic_mock' | 'lecture';

// 1. Estructura del Nodo (La lección individual)
export interface LessonNode {{
  id: string; // DEBE COINCIDIR EXACTAMENTE con el nombre del archivo JSON en backend
  title: string;
  description: string;
  type: ExerciseType;
  
  // Gamification & UI
  locked: boolean;
  completed: boolean;
  stars: 0 | 1 | 2 | 3;
  position: 'left' | 'center' | 'right'; 
  
  // Prompt de Respaldo para la IA
  aiPrompt: string;
}}

// 2. Estructura de la Sección (El Nivel)
export interface LevelSection {{
  id: string;
  title: string;
  description: string;
  color: 'emerald' | 'blue' | 'orange' | 'purple'; 
  lessons: LessonNode[];
}}

// --- CURRÍCULUM CON 100 LECCIONES REALES POR NIVEL (300 LECCIONES TOTALES) ---

const TEMAS_A_DATA: string[][] = {temas_a_str};

const TEMAS_B_DATA: string[][] = {temas_b_str};

const TEMAS_C_DATA: string[][] = {temas_c_str};

// Generar lecciones de forma dinámica con tipado seguro
const buildLessons = (prefix: 'a' | 'b' | 'c', rawData: string[][]): LessonNode[] => {{
  return rawData.map((item, idx) => {{
    const num = idx + 1;
    const id = `${{prefix}}-${{num}}`;
    
    // Alternar tipos de ejercicio
    const types: ExerciseType[] = ['lecture', 'grammar', 'chat', 'listening'];
    const type = types[idx % types.length];
    
    // Posición para diseño en zigzag serpentine
    const positions: ('left' | 'center' | 'right')[] = ['center', 'left', 'center', 'right'];
    const position = positions[idx % positions.length];
    
    return {{
      id,
      title: item[0],
      description: item[1],
      type,
      locked: !(prefix === 'a' && num === 1), // Desbloqueada únicamente a-1 por defecto
      completed: false,
      stars: 0,
      position,
      aiPrompt: `Roleplay: Discuss the topic of '${{item[0]}}' using the key terminology related to '${{item[2]}}'.`
    }};
  }});
}}

export const CURRICULUM: LevelSection[] = [
  {{
    id: 'A',
    title: 'Nivel A: Foundations & Survival',
    description: 'Establece los cimientos indispensables del inglés y sobrevive en entornos de oficina.',
    color: 'emerald',
    lessons: buildLessons('a', TEMAS_A_DATA)
  }},
  {{
    id: 'B',
    title: 'Nivel B: Operations & Professional',
    description: 'Comunícate con soltura, redacta correos formales y lidera juntas con precisión.',
    color: 'blue',
    lessons: buildLessons('b', TEMAS_B_DATA)
  }},
  {{
    id: 'C',
    title: 'Nivel C: Strategic Management',
    description: 'Domina negociaciones de alto nivel, fusiones y discursos ante mesas directivas.',
    color: 'orange',
    lessons: buildLessons('c', TEMAS_C_DATA)
  }},
  // Bloque especial TOEIC
  {{
    id: 'TOEIC',
    title: 'Certificación: TOEIC® Mastery',
    description: 'Preparación de alto rendimiento para el examen oficial TOEIC® de habilidades ejecutivas.',
    color: 'purple',
    lessons: [
      {{ 
        id: 'toeic_listening', 
        title: 'Photo Description', 
        description: 'Part 1: Visual Analysis.',
        type: 'listening', 
        locked: true, completed: false, stars: 0, position: 'left',
        aiPrompt: 'Analyze business photographs strictly following TOEIC format.'
      }},
      {{ 
        id: 'toeic_reading', 
        title: 'Incomplete Sentences', 
        description: 'Part 5: Grammar Precision.',
        type: 'grammar', 
        locked: true, completed: false, stars: 0, position: 'right',
        aiPrompt: 'Fill in the blanks with precise business grammar.'
      }},
      {{ 
        id: 'toeic_speaking', 
        title: 'Express an Opinion', 
        description: 'Question 11: Logic.',
        type: 'chat', 
        locked: true, completed: false, stars: 0, position: 'center',
        aiPrompt: 'State an opinion and support it with reasons.'
      }},
      {{ 
        id: 'toeic_writing', 
        title: 'Email Response', 
        description: 'Questions 6-7.',
        type: 'toeic_mock', 
        locked: true, completed: false, stars: 0, position: 'left',
        aiPrompt: 'Respond to a written request with specific requirements.'
      }}
    ]
  }}
];

// Helper para búsqueda rápida
export function getLessonById(id: string): LessonNode | undefined {{
    for (const section of CURRICULUM) {{
        const lesson = section.lessons.find(l => l.id === id);
        if (lesson) return lesson;
    }}
    return undefined;
}}
"""
    with open(frontend_curriculum_file, "w", encoding="utf-8") as f:
        f.write(ts_code)
    print("Frontend curriculum.ts successfully updated!")

def main():
    print("Generating 300 professional unique lessons for backend...")
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
    print(f"Successfully generated {count} custom lessons JSON files.")
    
    generate_frontend_ts_file()

if __name__ == "__main__":
    main()
