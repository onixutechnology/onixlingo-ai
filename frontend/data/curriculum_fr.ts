import { LevelSection, LessonNode, ExerciseType } from './curriculum';

// --- CURRÍCULUM CON 100 LECCIONES REALES EN FRANCÉS POR NIVEL (300 LECCIONES TOTALES) ---

const TEMAS_A_DATA: string[][] = [
  [
    "Primeras Impresiones",
    "Presentaciones básicas y saludos ejecutivos.",
    "bonjour"
  ],
  [
    "El Escritorio de Oficina",
    "Objetos de oficina y vocabulario de trabajo elemental.",
    "bureau"
  ],
  [
    "Rutinas Diarias",
    "Hábitos de productividad diarios.",
    "travail"
  ],
  [
    "Decir la Hora",
    "Programación de horarios simples.",
    "horloge"
  ],
  [
    "Números y Precios",
    "Cálculos básicos de costos y dinero.",
    "euros"
  ],
  [
    "Direcciones Simples",
    "Ubicación física en las oficinas.",
    "gauche"
  ],
  [
    "Conocer al Equipo",
    "Estructura jerárquica básica del equipo.",
    "directeur"
  ],
  [
    "Comida y Bebida",
    "Ordenar alimentos en almuerzos de negocios rápidos.",
    "café"
  ],
  [
    "Viajes de Negocios Básicos",
    "Logística elemental de aeropuertos.",
    "billet"
  ],
  [
    "Registro en el Hotel",
    "Registrarse en recepciones de hotel.",
    "chambre"
  ],
  [
    "Redactar Correos Simples",
    "Saludos y firmas de correo ejecutivo.",
    "courriel"
  ],
  [
    "Describir un Producto",
    "Adjetivos simples de productos.",
    "bon"
  ],
  [
    "Suministros de Oficina",
    "Inventario y existencias básicas de papelería.",
    "papier"
  ],
  [
    "Calendarios y Fechas",
    "Días de la semana y meses de negocios.",
    "lundi"
  ],
  [
    "Habilidades Telefónicas Básicas",
    "Atender llamadas y tomar notas elementales.",
    "téléphone"
  ],
  [
    "Revisión Semanal",
    "Revisión rápida de tareas realizadas.",
    "fini"
  ],
  [
    "Fortalezas Personales",
    "Habilidades básicas de presentación personal.",
    "ordonné"
  ],
  [
    "La Semana Laboral",
    "Diferenciar entre días laborales y fin de semana.",
    "semaine"
  ],
  [
    "Agendar Citas",
    "Agendar reuniones de uno a uno.",
    "réunion"
  ],
  [
    "Presentación de Clientes",
    "Presentar a un colega con un cliente.",
    "accueil"
  ],
  [
    "Hablar del Clima",
    "Romper el hielo de manera elemental.",
    "temps"
  ],
  [
    "Perfil de la Empresa",
    "Describir el sector y tamaño básico de la empresa.",
    "société"
  ],
  [
    "En el Banco",
    "Transacciones y pagos simples.",
    "banque"
  ],
  [
    "Conceptos de Emergencia",
    "Reportar incidentes sencillos de oficina.",
    "aide"
  ],
  [
    "Títulos de Puestos",
    "Nombres de puestos en el organigrama corporativo.",
    "responsable"
  ],
  [
    "Socializar en el Trabajo",
    "Conversar con compañeros en la cafetería.",
    "famille"
  ],
  [
    "Soporte Técnico Básico",
    "Describir problemas simples de computadora.",
    "ordinateur"
  ],
  [
    "Distribución de la Oficina",
    "Zonas comunes de la oficina.",
    "plan"
  ],
  [
    "Pedidos Simples",
    "Solicitudes directas a proveedores.",
    "commande"
  ],
  [
    "Viaje al Trabajo",
    "Medios de transporte diarios.",
    "métro"
  ],
  [
    "Historia de la Empresa",
    "Hablar de la fundación en pasado simple elemental.",
    "histoire"
  ],
  [
    "Acuerdos Básicos",
    "Aceptar y rechazar propuestas sencillas.",
    "accord"
  ],
  [
    "Reglas de la Oficina",
    "Políticas elementales de vestimenta y conducta.",
    "règles"
  ],
  [
    "Hito de Revisión A",
    "Consolidación de todo el vocabulario del Nivel A.",
    "résumé"
  ],
  [
    "Papelería de Oficina",
    "Vocabulario básico para herramientas de escritura y papelería.",
    "stylo"
  ],
  [
    "Silla Ergonómica",
    "Discussing office furniture and comfortable seating.",
    "chaise"
  ],
  [
    "Descanso del Mediodía",
    "Vocabulario esencial para ordenar almuerzos rápidos.",
    "déjeuner"
  ],
  [
    "Horario Diario",
    "Organización y lectura de horarios básicos de trabajo.",
    "heure"
  ],
  [
    "Crear una Agenda",
    "Cómo enlistar los puntos a tratar en una reunión.",
    "agenda"
  ],
  [
    "Escribir una Nota",
    "Dejar recordatorios breves en el escritorio de un colega.",
    "note"
  ],
  [
    "Archivador",
    "Organización física de carpetas y documentos.",
    "dossier"
  ],
  [
    "Responder Llamadas",
    "Tomar mensajes de voz sencillos en el teléfono de la oficina.",
    "téléphoner"
  ],
  [
    "Enviar Correos",
    "Estructura básica para enviar correos rápidos.",
    "envoyer"
  ],
  [
    "Recibir una Respuesta",
    "Checking your inbox for simple confirmations.",
    "réponse"
  ],
  [
    "Seguridad de Documentos",
    "Almacenar archivos confidenciales de forma segura.",
    "sûreté"
  ],
  [
    "Ventanas de la Oficina",
    "Describir el entorno físico de la oficina.",
    "fenêtre"
  ],
  [
    "Charla de Pasillo",
    "Conversaciones casuales y breves de pasillo.",
    "eau"
  ],
  [
    "Té de la Tarde",
    "Breve descanso para recargar energías.",
    "thé"
  ],
  [
    "Opciones de Almuerzo",
    "Healthy options for eating at the workplace.",
    "panier"
  ],
  [
    "Descanso Corto",
    "Managing small pauses during high-productivity hours.",
    "goûter"
  ],
  [
    "Sincronización de Equipo",
    "Short standing meetings to align daily tasks.",
    "synchro"
  ],
  [
    "Llegar al Trabajo",
    "Describing your morning commute and arrival times.",
    "arriver"
  ],
  [
    "Salir de la Oficina",
    "Saying goodbye to colleagues at the end of the day.",
    "partir"
  ],
  [
    "Iniciar un Proyecto",
    "First steps and simple discussions about new tasks.",
    "début"
  ],
  [
    "Terminar Tareas",
    "How to report that a daily assignment is completed.",
    "finir"
  ],
  [
    "Reporte Semanal",
    "Simple summary of your accomplishments.",
    "rapport"
  ],
  [
    "Hacer Copias",
    "Using the office printer and copier machines.",
    "copie"
  ],
  [
    "Pantalla de Escritorio",
    "Describing your computer monitor and setup.",
    "écran"
  ],
  [
    "Atajos de Teclado",
    "Basic typing skills to save time at work.",
    "clavier"
  ],
  [
    "Acceso a Internet",
    "Simple phrases to report connection issues.",
    "internet"
  ],
  [
    "Credenciales de Acceso",
    "Setting up passwords and usernames securely.",
    "connexion"
  ],
  [
    "Acceso Denegado",
    "Reporting IT blockages and login errors.",
    "code"
  ],
  [
    "Mesa de Oficina",
    "Arranging physical desks for collaborative work.",
    "table"
  ],
  [
    "Servicio de Taxi",
    "Ordering transportation for local business visits.",
    "taxi"
  ],
  [
    "Estación de Tren",
    "Navigating public transit for your daily commute.",
    "train"
  ],
  [
    "Parada de Autobús",
    "Understanding public bus routes near the office.",
    "bus"
  ],
  [
    "Reservación de Hotel",
    "Simple vocabulary to confirm a room booking.",
    "hôtel"
  ],
  [
    "Control de Pasaportes",
    "Basic travel logistics at international borders.",
    "passeport"
  ],
  [
    "Abordaje de Vuelo",
    "Understanding airport gate announcements.",
    "porte"
  ],
  [
    "Llaves de la Oficina",
    "Requesting access badges and physical keys.",
    "clé"
  ],
  [
    "Salas de Reunión",
    "Booking empty spaces for team discussions.",
    "salle"
  ],
  [
    "Máquina de Café",
    "How to make or order coffee in the lounge.",
    "cafetière"
  ],
  [
    "Organizador de Escritorio",
    "Keeping your working area clean and tidy.",
    "classeur"
  ],
  [
    "Herramientas de Escritura",
    "Basic office supplies for drafting diagrams.",
    "crayon"
  ],
  [
    "Notas en el Cuaderno",
    "Jotting down quick ideas during a presentation.",
    "cahier"
  ],
  [
    "Notas Adhesivas",
    "Color-coded reminders for short-term tasks.",
    "autocollant"
  ],
  [
    "Uso de la Calculadora",
    "Basic math operations for daily cost estimation.",
    "calculatrice"
  ],
  [
    "Reloj de la Oficina",
    "Checking elapsed time during business meetings.",
    "pendule"
  ],
  [
    "Gafete de Visitante",
    "Registering external guests at the lobby.",
    "visiteur"
  ],
  [
    "Espacio de Estacionamiento",
    "Asking for corporate parking permits and spots.",
    "parking"
  ],
  [
    "Piso del Ascensor",
    "Navigating high-rise office buildings.",
    "ascenseur"
  ],
  [
    "Botiquín de Primeros Auxilios",
    "Locating emergency medical supplies at work.",
    "pansement"
  ],
  [
    "Aire Acondicionado de la Oficina",
    "Adjusting temperature and ventilation controls.",
    "ventilateur"
  ],
  [
    "Menú de Almuerzo",
    "Reading cafeteria options and selecting dishes.",
    "menu"
  ],
  [
    "Recibo de Pago",
    "Asking for simple bills and transaction vouchers.",
    "reçu"
  ],
  [
    "Compra en la Tienda",
    "Buying urgent equipment for a presentation.",
    "achat"
  ],
  [
    "Lámpara de Escritorio",
    "Ensuring proper lighting at your workspace.",
    "lampe"
  ],
  [
    "Eliminación de Basura",
    "Simple recycling policies and waste bins.",
    "poubelle"
  ],
  [
    "Taza Corporativa",
    "Branded items and simple office kitchen supplies.",
    "tasse"
  ],
  [
    "Cargador de Laptop",
    "Reporting low battery and power issues.",
    "chargeur"
  ],
  [
    "Conector de Auriculares",
    "Using audio gear for virtual conference calls.",
    "casque"
  ],
  [
    "Foto de Equipo",
    "Building workplace memories and simple events.",
    "photo"
  ],
  [
    "Escritorio Limpio",
    "Basic hygiene and maintenance of work areas.",
    "propre"
  ],
  [
    "Planta de Oficina",
    "Describing green spaces that improve productivity.",
    "plante"
  ],
  [
    "Calendario de Pared",
    "Tracking upcoming holidays and corporate events.",
    "calendrier"
  ],
  [
    "Artículo del Portafolios",
    "Essential tools you bring to work every day.",
    "sac"
  ],
  [
    "Archivar Reportes",
    "Organizing paper files in structured categories.",
    "fichier"
  ],
  [
    "Recepción de Bienvenida",
    "Greeting visitors at the main reception area.",
    "hall"
  ],
  [
    "Barra de Snacks",
    "Selecting quick food items between meetings.",
    "fruit"
  ],
  [
    "Hora de Cierre",
    "Final procedures before locked doors at night.",
    "verrou"
  ]
];

const TEMAS_B_DATA: string[][] = [
  [
    "Liderar una Sincronización de Equipo",
    "Cómo estructurar juntas operativas semanales.",
    "animateur"
  ],
  [
    "Habilidades de Negociación Básicas",
    "Conceptos básicos para cerrar acuerdos.",
    "offre"
  ],
  [
    "Redacción de Correos Formales",
    "Uso de conectores lógicos profesionales.",
    "formel"
  ],
  [
    "Programación Estratégica",
    "Negociar horarios de juntas globales.",
    "fuseau"
  ],
  [
    "Hitos del Proyecto",
    "Definición y seguimiento de entregables.",
    "jalon"
  ],
  [
    "Dar Retroalimentación",
    "Metodologías de feedback constructivo.",
    "retour"
  ],
  [
    "Describir Tendencias de Datos",
    "Comparación de gráficos y estadísticas.",
    "hausse"
  ],
  [
    "Manejar Objeciones del Cliente",
    "Fórmulas de diplomacia ejecutiva.",
    "client"
  ],
  [
    "Entrevistas de Trabajo",
    "Responder preguntas de comportamiento laboral.",
    "expérience"
  ],
  [
    "Logística del Viaje de Negocios",
    "Coordinación avanzada de itinerarios.",
    "vol"
  ],
  [
    "Estrategia de Marketing",
    "Estudio de las 4Ps del marketing.",
    "stratégie"
  ],
  [
    "Planificación del Presupuesto",
    "Estructuración de presupuestos anuales.",
    "budget"
  ],
  [
    "Dominio del Soporte Técnico",
    "Solución guiada de incidentes de IT.",
    "redémarrage"
  ],
  [
    "Valores Corporativos",
    "Definición de visión, misión y ética corporativa.",
    "intégrité"
  ],
  [
    "Etiqueta Telefónica",
    "Manejar transferencias y llamadas complejas.",
    "transfert"
  ],
  [
    "Disculparse Profesionalmente",
    "Redacción de disculpas formales ante fallos.",
    "excuser"
  ],
  [
    "Resolución de Conflictos",
    "Herramientas de mediación y empatía corporativa.",
    "conflit"
  ],
  [
    "Subcontratación Estratégica",
    "Evaluación de proveedores externos.",
    "fournisseur"
  ],
  [
    "Lanzamiento de Producto",
    "Estrategia Go-to-Market.",
    "lancement"
  ],
  [
    "Conceptos Básicos de la Cadena de Suministro",
    "Logística y flujo de mercancías.",
    "inventaire"
  ],
  [
    "Satisfacción del Cliente",
    "Métricas NPS y análisis de reseñas.",
    "satisfaction"
  ],
  [
    "Gestión del Tiempo",
    "Priorización de tareas urgentes vs importantes.",
    "prioriser"
  ],
  [
    "Evaluación Comparativa Estratégica",
    "Comparar rendimientos contra competidores.",
    "comparatif"
  ],
  [
    "Negociaciones de Contrato",
    "Revisión de términos clave en contratos.",
    "contrat"
  ],
  [
    "Evaluación de Riesgos",
    "Identificar amenazas de operación básicas.",
    "risque"
  ],
  [
    "Acciones y Participaciones",
    "Introducción al financiamiento corporativo.",
    "actions"
  ],
  [
    "Reuniones Virtuales",
    "Comandos verbales para Zoom/Teams.",
    "sourdine"
  ],
  [
    "Red de Contactos Profesionales",
    "Discursos de elevador y conexiones en LinkedIn.",
    "réseautage"
  ],
  [
    "Investigación de Mercado",
    "Análisis DAFO/SWOT en inglés.",
    "recherche"
  ],
  [
    "Adquisición de Talento",
    "Políticas de reclutamiento y onboarding.",
    "embauche"
  ],
  [
    "Dominio del Discurso de Ventas",
    "Técnicas de venta directa y persuasión.",
    "argumentaire"
  ],
  [
    "Ergonomía en la Oficina",
    "Salud ocupacional y productividad.",
    "posture"
  ],
  [
    "Hito de Revisión B",
    "Evaluación de competencias gerenciales del Nivel B.",
    "progrès"
  ],
  [
    "Sincronización de Hitos del Proyecto",
    "Definición y seguimiento de entregables específicos.",
    "horaires"
  ],
  [
    "Retroalimentación Constructiva",
    "Metodologías de feedback para el desarrollo del equipo.",
    "constructif"
  ],
  [
    "Interpretación de Datos",
    "Análisis de gráficos de barras y tendencias.",
    "tendances"
  ],
  [
    "Objeciones de Clientes",
    "Manejo de objeciones comerciales con tacto profesional.",
    "objections"
  ],
  [
    "Programación Ejecutiva",
    "Negociación de agendas y zonas horarias en juntas.",
    "planification"
  ],
  [
    "Tareas Pendientes",
    "Asignación clara de tareas pendientes tras una reunión.",
    "actionnable"
  ],
  [
    "Actualización de Estado",
    "Presentar avances en el desarrollo de un proyecto.",
    "actualisation"
  ],
  [
    "Demostración de Producto",
    "Presentar las características y beneficios de un software.",
    "démonstration"
  ],
  [
    "Atención al Cliente",
    "Políticas de servicio al cliente y resolución de quejas.",
    "support"
  ],
  [
    "Acuerdo de Nivel de Servicio",
    "Introducción a los contratos de nivel de servicio SLA.",
    "normes"
  ],
  [
    "Auditoría de Inventario",
    "Control periódico de stock y materias primas.",
    "stock"
  ],
  [
    "Análisis de Mercado",
    "Estudiar la competencia y demanda de un producto.",
    "marché"
  ],
  [
    "Estrategia de Marca",
    "Desarrollo de identidad y posicionamiento de marca.",
    "image"
  ],
  [
    "Canal de Ventas",
    "Etapas de conversión de leads en clientes reales.",
    "processus"
  ],
  [
    "Generación de Prospectos",
    "Estrategias para atraer clientes potenciales.",
    "prospect"
  ],
  [
    "Eficiencia Operativa",
    "Reducción de cuellos de botella en la producción.",
    "efficacité"
  ],
  [
    "Planificación de Capacidad",
    "Estimación de recursos y mano de obra necesaria.",
    "capacité"
  ],
  [
    "Ética Corporativa",
    "Políticas internas anticorrupción y de transparencia.",
    "éthique"
  ],
  [
    "Oficina Sostenible",
    "Iniciativas para reducir la huella de carbono laboral.",
    "écologique"
  ],
  [
    "Protocolos de Seguridad",
    "Normas de seguridad ocupacional en la planta.",
    "sécurité"
  ],
  [
    "Manejo del Estrés",
    "Técnicas de bienestar corporativo y productividad.",
    "bien-être"
  ],
  [
    "Lluvia de Ideas Creativa",
    "Generación colectiva de ideas innovadoras.",
    "idéation"
  ],
  [
    "Delegación de Tareas",
    "Cómo asignar responsabilidades según habilidades.",
    "déléguer"
  ],
  [
    "Alineación de Objetivos",
    "Sincronizar metas individuales con las corporativas.",
    "alignement"
  ],
  [
    "Presupuesto del Proyecto",
    "Estructurar costos y gastos de una campaña.",
    "coûts"
  ],
  [
    "Asignación de Costos",
    "Distribución de gastos entre diferentes áreas.",
    "dépenses"
  ],
  [
    "Fuentes de Ingresos",
    "Identificar las fuentes principales de ingresos.",
    "revenus"
  ],
  [
    "Modelo de Precios",
    "Estrategias de precios según la demanda del mercado.",
    "tarification"
  ],
  [
    "Cronograma de Lanzamiento",
    "Cronograma estratégico para un nuevo producto.",
    "délais"
  ],
  [
    "Riesgos de Subcontratación",
    "Ventajas y riesgos de contratar servicios externos.",
    "prestataire"
  ],
  [
    "Rotación de Personal",
    "Análisis de rotación de personal y retención.",
    "rotation"
  ],
  [
    "Guía de Onboarding",
    "Integración efectiva de nuevos talentos al equipo.",
    "intégration"
  ],
  [
    "Matriz de Habilidades",
    "Evaluación de competencias dentro de un departamento.",
    "compétences"
  ],
  [
    "Cultura Corporativa",
    "Valores y hábitos de convivencia en la organización.",
    "culture"
  ],
  [
    "Programa de Mentoría",
    "Guía y desarrollo de profesionales junior.",
    "mentor"
  ],
  [
    "Mediación de Conflictos",
    "Resolución diplomática de tensiones internas.",
    "médiation"
  ],
  [
    "Marco Metodológico Ágil",
    "Introducción a la metodología Scrum en proyectos.",
    "mêlée"
  ],
  [
    "Planificación del Sprint",
    "Juntas de planeación de tareas a corto plazo.",
    "sprint"
  ],
  [
    "Reunión Diaria Corta",
    "Reuniones cortas diarias para actualizar avances.",
    "point"
  ],
  [
    "Evaluación del Desempeño",
    "Evaluación de KPIs y cumplimiento de objetivos.",
    "bilan"
  ],
  [
    "Plan de Carrera",
    "Estructuración de planes de crecimiento interno.",
    "promotion"
  ],
  [
    "Colaboración Remota",
    "Herramientas y etiqueta para el trabajo en casa.",
    "télétravail"
  ],
  [
    "Herramientas Virtuales",
    "Uso eficiente de plataformas de videoconferencia.",
    "conférence"
  ],
  [
    "Etiqueta de Correo Electrónico",
    "Reglas no escritas de la correspondencia formal.",
    "étiquette"
  ],
  [
    "Conceptos Básicos de Pitch Deck",
    "Estructura de diapositivas para convencer inversores.",
    "diaporama"
  ],
  [
    "Discurso de Elevador",
    "Presentación de tu proyecto en menos de un minuto.",
    "concis"
  ],
  [
    "Eventos de Networking",
    "Cómo romper el hielo y construir contactos valiosos.",
    "contacts"
  ],
  [
    "Tarjetas de Presentación",
    "Intercambio de datos e información de contacto.",
    "carte"
  ],
  [
    "Marca Personal en LinkedIn",
    "Optimización del perfil profesional en redes.",
    "profil"
  ],
  [
    "Análisis de Encuestas",
    "Diseño e interpretación de encuestas de satisfacción.",
    "enquête"
  ],
  [
    "Métricas del NPS",
    "Medición de lealtad de clientes mediante Net Promoter Score.",
    "promoteur"
  ],
  [
    "Perfil del Cliente Ideal",
    "Perfil representativo del cliente ideal.",
    "personnage"
  ],
  [
    "Experiencia del Usuario",
    "Introducción al diseño centrado en el usuario.",
    "expérience-utilisateur"
  ],
  [
    "Control de Calidad",
    "Normas básicas de inspección y estándares ISO.",
    "qualité"
  ],
  [
    "Mitigación de Riesgos",
    "Estrategias sencillas para evitar pérdidas en proyectos.",
    "atténuer"
  ],
  [
    "Respaldo de Datos",
    "Políticas de resguardo de información crítica.",
    "sauvegarde"
  ],
  [
    "Gestión de Tickets de TI",
    "Reportar y dar seguimiento a fallas del sistema.",
    "ticket"
  ],
  [
    "Actualización de Software",
    "Programación de mantenimiento informático.",
    "correctif"
  ],
  [
    "Migración de Servidores",
    "Traslado seguro de bases de datos locales.",
    "base"
  ],
  [
    "Ergonomía de Oficina Profesional",
    "Diseño del espacio para evitar lesiones físicas.",
    "ergonomie"
  ],
  [
    "Gestión de Instalaciones",
    "Mantenimiento y servicios del edificio de oficinas.",
    "maintenance"
  ],
  [
    "Seguridad en el Lugar de Trabajo",
    "Prevención de riesgos laborales en el día a día.",
    "prévention"
  ],
  [
    "Gastos de Viaje",
    "Comprobación y reembolso de viáticos de viaje.",
    "remboursement"
  ],
  [
    "Planificación de Itinerarios",
    "Coordinación detallada de vuelos y hospedaje.",
    "itinéraire"
  ],
  [
    "Reservación de Conferencias",
    "Reservación de stands en eventos internacionales.",
    "stand"
  ],
  [
    "Integración del Equipo",
    "Planificación de dinámicas y eventos para fortalecer al equipo.",
    "cohésion"
  ],
  [
    "Hito de Revisión B2",
    "Evaluación de competencias operativas y de gestión.",
    "évaluation"
  ]
];

const TEMAS_C_DATA: string[][] = [
  [
    "Análisis del Mercado Global",
    "Evaluación macroeconómica y geopolítica de mercados.",
    "macroéconomique"
  ],
  [
    "Gestión de Crisis",
    "Comunicación ante desastres de marca y relaciones públicas.",
    "crise"
  ],
  [
    "Reporte de Resultados Financieros",
    "EBITDA, balances generales y reportes de dividendos.",
    "ebitda"
  ],
  [
    "Fusiones y Adquisiciones",
    "Fusiones de corporativos y debida diligencia.",
    "fusion"
  ],
  [
    "Dominio de la Oratoria",
    "Tácticas de retórica y persuasión ante audiencias masivas.",
    "rhétorique"
  ],
  [
    "Negociación con Matices",
    "Negociar concesiones difíciles bajo presión.",
    "concession"
  ],
  [
    "Redacción de Contratos Legales",
    "Comprensión fina de cláusulas penales e indemnizaciones.",
    "indemnité"
  ],
  [
    "ESG y Sostenibilidad Corporativa",
    "Gobernanza corporativa, huella de carbono y RSE.",
    "durabilité"
  ],
  [
    "Estrategia y Pivote Corporativo",
    "Reestructuración estratégica e innovación abierta.",
    "pivot"
  ],
  [
    "OPI y Estrategias de Salida",
    "Salir a bolsa o estructurar adquisiciones hostiles.",
    "introduction"
  ],
  [
    "Filosofía de Liderazgo",
    "Modelos de liderazgo exponencial y mentoría.",
    "leadership"
  ],
  [
    "Gestión del Cambio",
    "Gestionar transiciones organizacionales globales.",
    "transition"
  ],
  [
    "Relaciones con Inversores",
    "Cómo dar discursos convincentes ante accionistas VIP.",
    "actionnaires"
  ],
  [
    "Gobernanza Corporativa",
    "Políticas anticorrupción y cumplimiento normativo.",
    "conformité"
  ],
  [
    "Planificación de la Sucesión",
    "Elegir líderes sucesores en mesas directivas.",
    "successeur"
  ],
  [
    "Disrupción Tecnológica e IA",
    "Impacto de IA generativa en la cadena de valor.",
    "technologie"
  ],
  [
    "Fintech y Blockchain",
    "Descentralización financiera y criptoactivos en tesorería.",
    "fintech"
  ],
  [
    "Innovaciones Biotecnológicas",
    "Desarrollo farmacéutico y patentes científicas.",
    "brevets"
  ],
  [
    "Transición a Energías Limpias",
    "Migrar operaciones corporativas a fuentes limpias.",
    "renouvelable"
  ],
  [
    "Resiliencia de la Cadena de Suministro",
    "Asegurar la cadena logística contra eventos de fuerza mayor.",
    "résilience"
  ],
  [
    "Gestión de Marcas de Lujo",
    "Mercadotecnia de alta gama y valor percibido.",
    "luxe"
  ],
  [
    "Inversión en Bienes Raíces",
    "Fideicomisos y portafolios de bienes raíces.",
    "foncière"
  ],
  [
    "Presentaciones para Capital de Riesgo",
    "Levantar rondas de inversión Serie A/B.",
    "capital-risque"
  ],
  [
    "Protocolos de Ciberseguridad",
    "Políticas corporativas contra ataques de ransomware.",
    "rançongiciel"
  ],
  [
    "Alianzas Estratégicas",
    "Crear joint ventures estratégicos.",
    "alliance"
  ],
  [
    "Propiedad Intelectual",
    "Litigios marcarios y registros de derechos de autor.",
    "marque"
  ],
  [
    "Redacción Fantasma Ejecutiva",
    "Redactar discursos para directores ejecutivos.",
    "rédaction"
  ],
  [
    "Comunicación Diplomática",
    "Mitigar hostilidades y manejar preguntas incómodas.",
    "diplomatique"
  ],
  [
    "El Poder del Silencio",
    "Uso estratégico de pausas en alta negociación.",
    "silence"
  ],
  [
    "Estrategia de Diversidad e Inclusión",
    "Políticas corporativas de equidad y pertenencia.",
    "inclusion"
  ],
  [
    "Escalamiento del Comercio Electrónico",
    "Logística transfronteriza y marketing automatizado.",
    "commerce"
  ],
  [
    "Economía del Comportamiento",
    "Cómo influyen los sesgos cognitivos en el consumo.",
    "comportemental"
  ],
  [
    "Proyecto Final del Hito C",
    "Evaluación de competencias directivas globales.",
    "synthèse"
  ],
  [
    "Reestructuración Corporativa",
    "Rediseño organizacional para mejorar rentabilidad.",
    "restructuration"
  ],
  [
    "Cumplimiento Regulatorio",
    "Normas estrictas de cumplimiento legal y ambiental.",
    "réglementaire"
  ],
  [
    "Regulaciones Antimonopolio",
    "Leyes de competencia y prevención de monopolios.",
    "antimonopole"
  ],
  [
    "Gestión de Litigios",
    "Gestión de disputas legales y demandas marcarias.",
    "litige"
  ],
  [
    "Protección de Patentes",
    "Registro de patentes y defensa de propiedad intelectual.",
    "brevet"
  ],
  [
    "Disputas de Marcas Registradas",
    "Resolución de conflictos de marcas registradas.",
    "différends"
  ],
  [
    "Junta Directiva",
    "Dinámica y responsabilidades de la junta directiva.",
    "conseil"
  ],
  [
    "Activismo de los Accionistas",
    "Relación con accionistas que presionan por cambios.",
    "actionnaire"
  ],
  [
    "Compensación Ejecutiva",
    "Estructuración de bonos y opciones sobre acciones.",
    "rémunération"
  ],
  [
    "Roadshow de OPI",
    "Presentación ante inversionistas previo a salir a bolsa.",
    "tournée"
  ],
  [
    "Estrategia de Salida",
    "Vías de salida: adquisiciones, fusiones o liquidación.",
    "sortie"
  ],
  [
    "Adquisición Hostil",
    "Estrategias de defensa ante compras hostiles de acciones.",
    "rachat"
  ],
  [
    "Rondas de Capital de Riesgo",
    "Levantamiento de capital de riesgo Serie A y B.",
    "financement"
  ],
  [
    "Capital Privado",
    "Inversión institucional en empresas de alto potencial.",
    "capitaux"
  ],
  [
    "Auditoría de Debida Diligencia",
    "Auditoría exhaustiva previa a la adquisición de activos.",
    "diligence"
  ],
  [
    "Sinergias de Fusión",
    "Estimación de ahorros operativos tras una fusión.",
    "synergies"
  ],
  [
    "Creación de Alianzas Estratégicas",
    "Acuerdos de cooperación conjunta entre corporativos.",
    "coopération"
  ],
  [
    "Creación de Coempresas",
    "Creación de una nueva entidad compartida.",
    "coentreprise"
  ],
  [
    "Fusiones y Adquisiciones Transfronterizas",
    "Fusiones transfronterizas y barreras regulatorias.",
    "transfrontalier"
  ],
  [
    "Huella de Carbono",
    "Estrategias para alcanzar la neutralidad de carbono.",
    "décarbonation"
  ],
  [
    "Responsabilidad Social",
    "Programas de impacto social y filantropía.",
    "philanthropie"
  ],
  [
    "Comunicación de Crisis",
    "Estrategias de relaciones públicas ante escándalos de marca.",
    "relations-publiques"
  ],
  [
    "Gestión de la Reputación",
    "Medición y protección del valor de la marca.",
    "réputation"
  ],
  [
    "Entrenamiento de Medios",
    "Preparación de directivos para interviews de prensa.",
    "entretien"
  ],
  [
    "Retórica de la Oratoria Pública",
    "Tácticas avanzadas de oratoria y persuasión de masas.",
    "oratoire"
  ],
  [
    "Discurso Magistral",
    "Discursos magistrales en convenciones globales.",
    "discours"
  ],
  [
    "Deber Fiduciario",
    "Responsabilidad legal y financiera ante los inversores.",
    "fiduciaire"
  ],
  [
    "Asignación de Capital",
    "Decidir la reinversión de utilidades en la empresa.",
    "allocation"
  ],
  [
    "Gestión de Tesorería",
    "Control de liquidez, divisas y flujo de caja global.",
    "trésorerie"
  ],
  [
    "Estrategias de Cobertura",
    "Uso de derivados para protegerse contra fluctuaciones.",
    "couverture"
  ],
  [
    "Valoración de Activos",
    "Modelos matemáticos para calcular el precio de activos.",
    "valorisation"
  ],
  [
    "Política de Dividendos",
    "Decidir el reparto de utilidades a los accionistas.",
    "dividende"
  ],
  [
    "Reestructuración de Deuda",
    "Negociar nuevos plazos de pago con bancos acreedores.",
    "dette"
  ],
  [
    "Cadena de Suministro Global",
    "Asegurar el abasto internacional contra contingencias.",
    "chaîne"
  ],
  [
    "Resiliencia Logística",
    "Resiliencia ante cuellos de botella en puertos globales.",
    "resilience"
  ],
  [
    "Estrategia de Subcontratación",
    "Decisión estratégica de fabricar o externalizar.",
    "délocalisation"
  ],
  [
    "Estrategia Geopolítica",
    "Adaptar operaciones ante guerras comerciales y aranceles.",
    "géopolitique"
  ],
  [
    "Disrupción del Mercado",
    "Innovaciones tecnológicas que cambian las reglas del juego.",
    "disruption"
  ],
  [
    "Integración de IA",
    "Automatización y adopción de IA generativa en la empresa.",
    "automatisation"
  ],
  [
    "Leyes de Privacidad de Datos",
    "Cumplimiento de regulaciones estrictas como GDPR.",
    "confidentialité"
  ],
  [
    "Capital Intelectual",
    "Retener talento clave tras reestructuraciones.",
    "intellectuel"
  ],
  [
    "Alineación Cultural",
    "Fusionar culturas corporativas de distintos países.",
    "alignement-culturel"
  ],
  [
    "Valoración de Marca",
    "Estimar el valor monetario intangible de una marca.",
    "valeur"
  ],
  [
    "Marketing de Alta Gama",
    "Estrategias de posicionamiento en mercados de lujo.",
    "haut-de-gamme"
  ],
  [
    "Escalamiento de Franquicias",
    "Modelos de expansión a través de franquicias globales.",
    "franchise"
  ],
  [
    "Logística Transfronteriza",
    "Aduanas, aranceles y envíos transfronterizos.",
    "tarifs"
  ],
  [
    "Heurística del Comportamiento",
    "Cómo influyen los sesgos cognitivos en el consumo.",
    "heuristique"
  ],
  [
    "Inelasticidad de Precios",
    "Estudiar la sensibilidad del precio en el cliente.",
    "élasticité"
  ],
  [
    "Valor del Ciclo de Vida del Cliente",
    "Optimización del valor a largo plazo de los clientes.",
    "valeur-client"
  ],
  [
    "Costo de Adquisición",
    "Métricas del costo de adquisición de clientes (CAC).",
    "acquisition"
  ],
  [
    "Inteligencia de Negocios",
    "Uso estratégico de Big Data para toma de decisiones.",
    "métriques"
  ],
  [
    "Transformación Digital",
    "Migrar sistemas tradicionales a arquitecturas cloud.",
    "nuage"
  ],
  [
    "Creación de Venture Studio",
    "Creación de incubadoras internas de startups corporativas.",
    "incubateur"
  ],
  [
    "Optimización del Valor para el Accionista",
    "Maximización de la rentabilidad a largo plazo para inversores.",
    "profitabilité"
  ],
  [
    "Estrategia de Reestructuración Corporativa",
    "Planificación de escisiones y reorganización corporativa.",
    "scission"
  ],
  [
    "Riesgo de Expansión Global",
    "Evaluación de riesgos al ingresar a nuevos mercados soberanos.",
    "souverain"
  ],
  [
    "Arbitraje Regulatorio",
    "Aprovechamiento estratégico de diferencias regulatorias globales.",
    "arbitrage"
  ],
  [
    "Planificación de la Sucesión Estratégica",
    "Planificación sistemática para la transición del liderazgo ejecutivo.",
    "nomination"
  ],
  [
    "Financiamiento de Deuda Sostenible",
    "Emisión de bonos verdes y financiamiento de proyectos ecológicos.",
    "obligations"
  ],
  [
    "Mediación de Alto Riesgo",
    "Mediación diplomática y arbitraje en disputas comerciales.",
    "conciliation"
  ],
  [
    "Salidas de Capital de Riesgo",
    "Estrategias de salida y liquidación para inversiones de capital.",
    "liquidation"
  ],
  [
    "Arquitectura de Riesgo Empresarial",
    "Diseño de marcos integrales de gestión de riesgos corporativos.",
    "entreprise"
  ],
  [
    "Integración de F&A Multicultural",
    "Integración posterior a la fusión de equipos globales diversos.",
    "multiculturel"
  ],
  [
    "Acuerdos de Transferencia de Tecnología",
    "Acuerdos de licenciamiento y transferencia de tecnología patentada.",
    "licenciement"
  ],
  [
    "Asociaciones Público-Privadas",
    "Estructuración de contratos de concesión con entidades gubernamentales.",
    "partenariat"
  ],
  [
    "Supervisión de Gobernanza Ética",
    "Supervisión de comités de auditoría y ética en la junta directiva.",
    "surveillance"
  ],
  [
    "Proyecto Final del Hito Ejecutivo",
    "Evaluación de competencias directivas de alta gerencia.",
    "dirigeant"
  ]
];

// Generar lecciones de forma dinámica con tipado seguro
const buildLessons = (prefix: 'a' | 'b' | 'c', rawData: string[][]): LessonNode[] => {
  return rawData.map((item, idx) => {
    const num = idx + 1;
    const id = `fr-${prefix}-${num}`;
    
    // Alternar tipos de ejercicio
    const types: ExerciseType[] = ['lecture', 'grammar', 'chat', 'listening'];
    const type = types[idx % types.length];
    
    // Posición para diseño en zigzag serpentine
    const positions: ('left' | 'center' | 'right')[] = ['center', 'left', 'center', 'right'];
    const position = positions[idx % positions.length];
    
    return {
      id,
      title: item[0],
      description: item[1],
      type,
      locked: !(prefix === 'a' && num === 1), // Desbloqueada únicamente fr-a-1 por defecto
      completed: false,
      stars: 0,
      position,
      aiPrompt: `Roleplay: Discuss the topic of '${item[0]}' in French using the key terminology related to '${item[2]}'.`
    };
  });
}

export const CURRICULUM_FR: LevelSection[] = [
  {
    id: 'FR-A',
    title: 'Nivel A: Bases y Supervivencia',
    description: 'Establece los cimientos indispensables del francés y sobrevive en entornos de trabajo.',
    color: 'emerald',
    lessons: buildLessons('a', TEMAS_A_DATA)
  },
  {
    id: 'FR-B',
    title: 'Nivel B: Operaciones y Profesional',
    description: 'Comunícate con soltura, redacta correos formales y lidera juntas con precisión en francés.',
    color: 'blue',
    lessons: buildLessons('b', TEMAS_B_DATA)
  },
  {
    id: 'FR-C',
    title: 'Nivel C: Gestión Estratégica',
    description: 'Domina negociaciones de alto nivel, fusiones y discursos en francés ante mesas directivas.',
    color: 'orange',
    lessons: buildLessons('c', TEMAS_C_DATA)
  }
];

// Helper para búsqueda rápida
export function getFrenchLessonById(id: string): LessonNode | undefined {
    for (const section of CURRICULUM_FR) {
        const lesson = section.lessons.find(l => l.id === id);
        if (lesson) return lesson;
    }
    return undefined;
}
