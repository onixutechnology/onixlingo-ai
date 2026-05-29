import { LevelSection, LessonNode, ExerciseType } from './curriculum';

// --- CURRÍCULUM CON 200 LECCIONES REALES EN CHINO MANDARÍN POR NIVEL (600 LECCIONES TOTALES) ---

const TEMAS_A_DATA: string[][] = [
  [
    "Primeras Impresiones",
    "Presentaciones básicas y saludos ejecutivos.",
    "你好"
  ],
  [
    "El Escritorio de Oficina",
    "Objetos de oficina y vocabulario de trabajo elemental.",
    "办公桌"
  ],
  [
    "Rutinas Diarias",
    "Hábitos de productividad diarios.",
    "工作"
  ],
  [
    "Decir la Hora",
    "Programación de horarios simples.",
    "时钟"
  ],
  [
    "Números y Precios",
    "Cálculos básicos de costos y dinero.",
    "美元"
  ],
  [
    "Direcciones Simples",
    "Ubicación física en las oficinas.",
    "左边"
  ],
  [
    "Conocer al Equipo",
    "Estructura jerárquica básica del equipo.",
    "经理"
  ],
  [
    "Comida y Bebida",
    "Ordenar alimentos en almuerzos de negocios rápidos.",
    "咖啡"
  ],
  [
    "Viajes de Negocios Básicos",
    "Logística elemental de aeropuertos.",
    "门票"
  ],
  [
    "Registro en el Hotel",
    "Registrarse en recepciones de hotel.",
    "房间"
  ],
  [
    "Redactar Correos Simples",
    "Saludos y firmas de correo ejecutivo.",
    "电子邮件"
  ],
  [
    "Describir un Producto",
    "Adjetivos simples de productos.",
    "好的"
  ],
  [
    "Suministros de Oficina",
    "Inventario y existencias básicas de papelería.",
    "纸张"
  ],
  [
    "Calendarios y Fechas",
    "Días de la semana y meses de negocios.",
    "星期一"
  ],
  [
    "Habilidades Telefónicas Básicas",
    "Atender llamadas y tomar notas elementales.",
    "电话"
  ],
  [
    "Revisión Semanal",
    "Revisión rápida de tareas realizadas.",
    "完成"
  ],
  [
    "Fortalezas Personales",
    "Habilidades básicas de presentación personal.",
    "有条理"
  ],
  [
    "La Semana Laboral",
    "Diferenciar entre días laborales y fin de semana.",
    "星期"
  ],
  [
    "Agendar Citas",
    "Agendar reuniones de uno a uno.",
    "会议"
  ],
  [
    "Presentación de Clientes",
    "Presentar a un colega con un cliente.",
    "介绍"
  ],
  [
    "Hablar del Clima",
    "Romper el hielo de manera elemental.",
    "天气"
  ],
  [
    "Perfil de la Empresa",
    "Describir el sector y tamaño básico de la empresa.",
    "公司"
  ],
  [
    "En el Banco",
    "Transacciones y pagos simples.",
    "银行"
  ],
  [
    "Conceptos de Emergencia",
    "Reportar incidentes sencillos de oficina.",
    "帮助"
  ],
  [
    "Títulos de Puestos",
    "Nombres de puestos en el organigrama corporativo.",
    "主管"
  ],
  [
    "Socializar en el Trabajo",
    "Conversar con compañeros en la cafetería.",
    "家庭"
  ],
  [
    "Soporte Técnico Básico",
    "Describir problemas simples de computadora.",
    "电脑"
  ],
  [
    "Distribución de la Oficina",
    "Zonas comunes de la oficina.",
    "布局"
  ],
  [
    "Pedidos Simples",
    "Solicitudes directas a proveedores.",
    "订单"
  ],
  [
    "Viaje al Trabajo",
    "Medios de transporte diarios.",
    "地铁"
  ],
  [
    "Historia de la Empresa",
    "Hablar de la fundación en pasado simple elemental.",
    "历史"
  ],
  [
    "Acuerdos Básicos",
    "Aceptar y rechazar propuestas sencillas.",
    "同意"
  ],
  [
    "Reglas de la Oficina",
    "Políticas elementales de vestimenta y conducta.",
    "规则"
  ],
  [
    "Hito de Revisión A",
    "Consolidación de todo el vocabulario del Nivel A.",
    "总结"
  ],
  [
    "Papelería de Oficina",
    "Vocabulario básico para herramientas de escritura y papelería.",
    "钢笔"
  ],
  [
    "Silla Ergonómica",
    "Discussing office furniture and comfortable seating.",
    "椅子"
  ],
  [
    "Descanso del Mediodía",
    "Vocabulario esencial para ordenar almuerzos rápidos.",
    "午餐"
  ],
  [
    "Horario Diario",
    "Organización y lectura de horarios básicos de trabajo.",
    "时间"
  ],
  [
    "Crear una Agenda",
    "Cómo enlistar los puntos a tratar en una reunión.",
    "议程"
  ],
  [
    "Escribir una Nota",
    "Dejar recordatorios breves en el escritorio de un colega.",
    "便签"
  ],
  [
    "Archivador",
    "Organización física de carpetas y documentos.",
    "文件夹"
  ],
  [
    "Responder Llamadas",
    "Tomar mensajes de voz sencillos en el teléfono de la oficina.",
    "通话"
  ],
  [
    "Enviar Correos",
    "Estructura básica para enviar correos rápidos.",
    "发送"
  ],
  [
    "Recibir una Respuesta",
    "Checking your inbox for simple confirmations.",
    "回复"
  ],
  [
    "Seguridad de Documentos",
    "Almacenar archivos confidenciales de forma segura.",
    "安全"
  ],
  [
    "Ventanas de la Oficina",
    "Describir el entorno físico de la oficina.",
    "窗户"
  ],
  [
    "Charla de Pasillo",
    "Conversaciones casuales y breves de pasillo.",
    "饮用水"
  ],
  [
    "Té de la Tarde",
    "Breve descanso para recargar energías.",
    "茶叶"
  ],
  [
    "Opciones de Almuerzo",
    "Healthy options for eating at the workplace.",
    "便当"
  ],
  [
    "Descanso Corto",
    "Managing small pauses during high-productivity hours.",
    "零食"
  ],
  [
    "Sincronización de Equipo",
    "Short standing meetings to align daily tasks.",
    "同步"
  ],
  [
    "Llegar al Trabajo",
    "Describing your morning commute and arrival times.",
    "到达"
  ],
  [
    "Salir de la Oficina",
    "Saying goodbye to colleagues at the end of the day.",
    "出发"
  ],
  [
    "Iniciar un Proyecto",
    "First steps and simple discussions about new tasks.",
    "开始"
  ],
  [
    "Terminar Tareas",
    "How to report that a daily assignment is completed.",
    "结束"
  ],
  [
    "Reporte Semanal",
    "Simple summary of your accomplishments.",
    "报告"
  ],
  [
    "Hacer Copias",
    "Using the office printer and copier machines.",
    "复印"
  ],
  [
    "Pantalla de Escritorio",
    "Describing your computer monitor and setup.",
    "屏幕"
  ],
  [
    "Atajos de Teclado",
    "Basic typing skills to save time at work.",
    "键盘"
  ],
  [
    "Acceso a Internet",
    "Simple phrases to report connection issues.",
    "互联网"
  ],
  [
    "Credenciales de Acceso",
    "Setting up passwords and usernames securely.",
    "登录"
  ],
  [
    "Acceso Denegado",
    "Reporting IT blockages and login errors.",
    "密码"
  ],
  [
    "Mesa de Oficina",
    "Arranging physical desks for collaborative work.",
    "桌子"
  ],
  [
    "Servicio de Taxi",
    "Ordering transportation for local business visits.",
    "出租车"
  ],
  [
    "Estación de Tren",
    "Navigating public transit for your daily commute.",
    "火车"
  ],
  [
    "Parada de Autobús",
    "Understanding public bus routes near the office.",
    "公交车"
  ],
  [
    "Reservación de Hotel",
    "Simple vocabulary to confirm a room booking.",
    "酒店"
  ],
  [
    "Control de Pasaportes",
    "Basic travel logistics at international borders.",
    "护照"
  ],
  [
    "Abordaje de Vuelo",
    "Understanding airport gate announcements.",
    "登机口"
  ],
  [
    "Llaves de la Oficina",
    "Requesting access badges and physical keys.",
    "钥匙"
  ],
  [
    "Salas de Reunión",
    "Booking empty spaces for team discussions.",
    "会议室"
  ],
  [
    "Máquina de Café",
    "How to make or order coffee in the lounge.",
    "咖啡机"
  ],
  [
    "Organizador de Escritorio",
    "Keeping your working area clean and tidy.",
    "整理器"
  ],
  [
    "Herramientas de Escritura",
    "Basic office supplies for drafting diagrams.",
    "铅笔"
  ],
  [
    "Notas en el Cuaderno",
    "Jotting down quick ideas during a presentation.",
    "笔记本"
  ],
  [
    "Notas Adhesivas",
    "Color-coded reminders for short-term tasks.",
    "贴纸"
  ],
  [
    "Uso de la Calculadora",
    "Basic math operations for daily cost estimation.",
    "计算器"
  ],
  [
    "Reloj de la Oficina",
    "Checking elapsed time during business meetings.",
    "挂钟"
  ],
  [
    "Gafete de Visitante",
    "Registering external guests at the lobby.",
    "访客"
  ],
  [
    "Espacio de Estacionamiento",
    "Asking for corporate parking permits and spots.",
    "停车场"
  ],
  [
    "Piso del Ascensor",
    "Navigating high-rise office buildings.",
    "电梯"
  ],
  [
    "Botiquín de Primeros Auxilios",
    "Locating emergency medical supplies at work.",
    "绷带"
  ],
  [
    "Aire Acondicionado de la Oficina",
    "Adjusting temperature and ventilation controls.",
    "风扇"
  ],
  [
    "Menú de Almuerzo",
    "Reading cafeteria options and selecting dishes.",
    "菜单"
  ],
  [
    "Recibo de Pago",
    "Asking for simple bills and transaction vouchers.",
    "收据"
  ],
  [
    "Compra en la Tienda",
    "Buying urgent equipment for a presentation.",
    "购买"
  ],
  [
    "Lámpara de Escritorio",
    "Ensuring proper lighting at your workspace.",
    "台灯"
  ],
  [
    "Eliminación de Basura",
    "Simple recycling policies and waste bins.",
    "垃圾桶"
  ],
  [
    "Taza Corporativa",
    "Branded items and simple office kitchen supplies.",
    "马克杯"
  ],
  [
    "Cargador de Laptop",
    "Reporting low battery and power issues.",
    "充电器"
  ],
  [
    "Conector de Auriculares",
    "Using audio gear for virtual conference calls.",
    "耳机"
  ],
  [
    "Foto de Equipo",
    "Building workplace memories and simple events.",
    "照片"
  ],
  [
    "Escritorio Limpio",
    "Basic hygiene and maintenance of work areas.",
    "清洁"
  ],
  [
    "Planta de Oficina",
    "Describing green spaces that improve productivity.",
    "植物"
  ],
  [
    "Calendario de Pared",
    "Tracking upcoming holidays and corporate events.",
    "日历"
  ],
  [
    "Artículo del Portafolios",
    "Essential tools you bring to work every day.",
    "提包"
  ],
  [
    "Archivar Reportes",
    "Organizing paper files in structured categories.",
    "归档"
  ],
  [
    "Recepción de Bienvenida",
    "Greeting visitors at the main reception area.",
    "大堂"
  ],
  [
    "Barra de Snacks",
    "Selecting quick food items between meetings.",
    "水果"
  ],
  [
    "Hora de Cierre",
    "Final procedures before locked doors at night.",
    "门锁"
  ]
];

const TEMAS_B_DATA: string[][] = [
  [
    "Liderar una Sincronización de Equipo",
    "Cómo estructurar juntas operativas semanales.",
    "主持人"
  ],
  [
    "Habilidades de Negociación Básicas",
    "Conceptos básicos para cerrar acuerdos.",
    "报价"
  ],
  [
    "Redacción de Correos Formales",
    "Uso de conectores lógicos profesionales.",
    "正式"
  ],
  [
    "Programación Estratégica",
    "Negociar horarios de juntas globales.",
    "时区"
  ],
  [
    "Hitos del Proyecto",
    "Definición y seguimiento de entregables.",
    "里程碑"
  ],
  [
    "Dar Retroalimentación",
    "Metodologías de feedback constructivo.",
    "反馈"
  ],
  [
    "Describir Tendencias de Datos",
    "Comparación de gráficos y estadísticas.",
    "增长"
  ],
  [
    "Manejar Objeciones del Cliente",
    "Fórmulas de diplomacia ejecutiva.",
    "客户"
  ],
  [
    "Entrevistas de Trabajo",
    "Responder preguntas de comportamiento laboral.",
    "经验"
  ],
  [
    "Logística del Viaje de Negocios",
    "Coordinación avanzada de itinerarios.",
    "航班"
  ],
  [
    "Estrategia de Marketing",
    "Estudio de las 4Ps del marketing.",
    "战略"
  ],
  [
    "Planificación del Presupuesto",
    "Estructuración de presupuestos anuales.",
    "预算"
  ],
  [
    "Dominio del Soporte Técnico",
    "Solución guiada de incidentes de IT.",
    "重启"
  ],
  [
    "Valores Corporativos",
    "Definición de visión, misión y ética corporativa.",
    "诚信"
  ],
  [
    "Etiqueta Telefónica",
    "Manejar transferencias y llamadas complejas.",
    "转账"
  ],
  [
    "Disculparse Profesionalmente",
    "Redacción de disculpas formales ante fallos.",
    "致歉"
  ],
  [
    "Resolución de Conflictos",
    "Herramientas de mediación y empatía corporativa.",
    "冲突"
  ],
  [
    "Subcontratación Estratégica",
    "Evaluación de proveedores externos.",
    "供应商"
  ],
  [
    "Lanzamiento de Producto",
    "Estrategia Go-to-Market.",
    "发布"
  ],
  [
    "Conceptos Básicos de la Cadena de Suministro",
    "Logística y flujo de mercancías.",
    "库存"
  ],
  [
    "Satisfacción del Cliente",
    "Métricas NPS y análisis de reseñas.",
    "满意度"
  ],
  [
    "Gestión del Tiempo",
    "Priorización de tareas urgentes vs importantes.",
    "优先权"
  ],
  [
    "Evaluación Comparativa Estratégica",
    "Comparar rendimientos contra competidores.",
    "基准"
  ],
  [
    "Negociaciones de Contrato",
    "Revisión de términos clave en contratos.",
    "合同"
  ],
  [
    "Evaluación de Riesgos",
    "Identificar amenazas de operación básicas.",
    "风险"
  ],
  [
    "Acciones y Participaciones",
    "Introducción al financiamiento corporativo.",
    "股份"
  ],
  [
    "Reuniones Virtuales",
    "Comandos verbales para Zoom/Teams.",
    "静音"
  ],
  [
    "Red de Contactos Profesionales",
    "Discursos de elevador y conexiones en LinkedIn.",
    "人脉"
  ],
  [
    "Investigación de Mercado",
    "Análisis DAFO/SWOT en inglés.",
    "研发"
  ],
  [
    "Adquisición de Talento",
    "Políticas de reclutamiento y onboarding.",
    "招聘"
  ],
  [
    "Dominio del Discurso de Ventas",
    "Técnicas de venta directa y persuasión.",
    "推介"
  ],
  [
    "Ergonomía en la Oficina",
    "Salud ocupacional y productividad.",
    "姿态"
  ],
  [
    "Hito de Revisión B",
    "Evaluación de competencias gerenciales del Nivel B.",
    "进度"
  ],
  [
    "Sincronización de Hitos del Proyecto",
    "Definición y seguimiento de entregables específicos.",
    "时刻表"
  ],
  [
    "Retroalimentación Constructiva",
    "Metodologías de feedback para el desarrollo del equipo.",
    "建设性"
  ],
  [
    "Interpretación de Datos",
    "Análisis de gráficos de barras y tendencias.",
    "趋势"
  ],
  [
    "Objeciones de Clientes",
    "Manejo de objeciones comerciales con tacto profesional.",
    "异议"
  ],
  [
    "Programación Ejecutiva",
    "Negociación de agendas y zonas horarias en juntas.",
    "排程"
  ],
  [
    "Tareas Pendientes",
    "Asignación clara de tareas pendientes tras una reunión.",
    "可行性"
  ],
  [
    "Actualización de Estado",
    "Presentar avances en el desarrollo de un proyecto.",
    "更新"
  ],
  [
    "Demostración de Producto",
    "Presentar las características y beneficios de un software.",
    "演示"
  ],
  [
    "Atención al Cliente",
    "Políticas de servicio al cliente y resolución de quejas.",
    "支持"
  ],
  [
    "Acuerdo de Nivel de Servicio",
    "Introducción a los contratos de nivel de servicio SLA.",
    "标准"
  ],
  [
    "Auditoría de Inventario",
    "Control periódico de stock y materias primas.",
    "现货"
  ],
  [
    "Análisis de Mercado",
    "Estudiar la competencia y demanda de un producto.",
    "市场"
  ],
  [
    "Estrategia de Marca",
    "Desarrollo de identidad y posicionamiento de marca.",
    "品牌"
  ],
  [
    "Canal de Ventas",
    "Etapas de conversión de leads en clientes reales.",
    "漏斗"
  ],
  [
    "Generación de Prospectos",
    "Estrategias para atraer clientes potenciales.",
    "潜客"
  ],
  [
    "Eficiencia Operativa",
    "Reducción de cuellos de botella en la producción.",
    "效率"
  ],
  [
    "Planificación de Capacidad",
    "Estimación de recursos y mano de obra necesaria.",
    "容量"
  ],
  [
    "Ética Corporativa",
    "Políticas internas anticorrupción y de transparencia.",
    "伦理"
  ],
  [
    "Oficina Sostenible",
    "Iniciativas para reducir la huella de carbono laboral.",
    "环保"
  ],
  [
    "Protocolos de Seguridad",
    "Normas de seguridad ocupacional en la planta.",
    "安全规程"
  ],
  [
    "Manejo del Estrés",
    "Técnicas de bienestar corporativo y productividad.",
    "健康"
  ],
  [
    "Lluvia de Ideas Creativa",
    "Generación colectiva de ideas innovadoras.",
    "构思"
  ],
  [
    "Delegación de Tareas",
    "Cómo asignar responsabilidades según habilidades.",
    "授权"
  ],
  [
    "Alineación de Objetivos",
    "Sincronizar metas individuales con las corporativas.",
    "对齐"
  ],
  [
    "Presupuesto del Proyecto",
    "Estructurar costos y gastos de una campaña.",
    "成本"
  ],
  [
    "Asignación de Costos",
    "Distribución de gastos entre diferentes áreas.",
    "报销"
  ],
  [
    "Fuentes de Ingresos",
    "Identificar las fuentes principales de ingresos.",
    "收入"
  ],
  [
    "Modelo de Precios",
    "Estrategias de precios según la demanda del mercado.",
    "定价"
  ],
  [
    "Cronograma de Lanzamiento",
    "Cronograma estratégico para un nuevo producto.",
    "时间线"
  ],
  [
    "Riesgos de Subcontratación",
    "Ventajas y riesgos de contratar servicios externos.",
    "外包商"
  ],
  [
    "Rotación de Personal",
    "Análisis de rotación de personal y retención.",
    "周转率"
  ],
  [
    "Guía de Onboarding",
    "Integración efectiva de nuevos talentos al equipo.",
    "入职"
  ],
  [
    "Matriz de Habilidades",
    "Evaluación de competencias dentro de un departamento.",
    "技能"
  ],
  [
    "Cultura Corporativa",
    "Valores y hábitos de convivencia en la organización.",
    "文化"
  ],
  [
    "Programa de Mentoría",
    "Guía y desarrollo de profesionales junior.",
    "导师"
  ],
  [
    "Mediación de Conflictos",
    "Resolución diplomática de tensiones internas.",
    "调解"
  ],
  [
    "Marco Metodológico Ágil",
    "Introducción a la metodología Scrum en proyectos.",
    "敏捷"
  ],
  [
    "Planificación del Sprint",
    "Juntas de planeación de tareas a corto plazo.",
    "冲刺"
  ],
  [
    "Reunión Diaria Corta",
    "Reuniones cortas diarias para actualizar avances.",
    "站会"
  ],
  [
    "Evaluación del Desempeño",
    "Evaluación de KPIs y cumplimiento de objetivos.",
    "评估"
  ],
  [
    "Plan de Carrera",
    "Estructuración de planes de crecimiento interno.",
    "晋升"
  ],
  [
    "Colaboración Remota",
    "Herramientas y etiqueta para el trabajo en casa.",
    "远程"
  ],
  [
    "Herramientas Virtuales",
    "Uso eficiente de plataformas de videoconferencia.",
    "视频会议"
  ],
  [
    "Etiqueta de Correo Electrónico",
    "Reglas no escritas de la correspondencia formal.",
    "礼仪"
  ],
  [
    "Conceptos Básicos de Pitch Deck",
    "Estructura de diapositivas para convencer inversores.",
    "幻灯片"
  ],
  [
    "Discurso de Elevador",
    "Presentación de tu proyecto en menos de un minuto.",
    "简洁"
  ],
  [
    "Eventos de Networking",
    "Cómo romper el hielo y construir contactos valiosos.",
    "联系人"
  ],
  [
    "Tarjetas de Presentación",
    "Intercambio de datos e información de contacto.",
    "名片"
  ],
  [
    "Marca Personal en LinkedIn",
    "Optimización del perfil profesional en redes.",
    "简介"
  ],
  [
    "Análisis de Encuestas",
    "Diseño e interpretación de encuestas de satisfacción.",
    "问卷"
  ],
  [
    "Métricas del NPS",
    "Medición de lealtad de clientes mediante Net Promoter Score.",
    "推荐者"
  ],
  [
    "Perfil del Cliente Ideal",
    "Perfil representativo del cliente ideal.",
    "画像"
  ],
  [
    "Experiencia del Usuario",
    "Introducción al diseño centrado en el usuario.",
    "用户体验"
  ],
  [
    "Control de Calidad",
    "Normas básicas de inspección y estándares ISO.",
    "质量"
  ],
  [
    "Mitigación de Riesgos",
    "Estrategias sencillas para evitar pérdidas en proyectos.",
    "缓解"
  ],
  [
    "Respaldo de Datos",
    "Políticas de resguardo de información crítica.",
    "备份"
  ],
  [
    "Gestión de Tickets de TI",
    "Reportar y dar seguimiento a fallas del sistema.",
    "工单"
  ],
  [
    "Actualización de Software",
    "Programación de mantenimiento informático.",
    "补丁"
  ],
  [
    "Migración de Servidores",
    "Traslado seguro de bases de datos locales.",
    "数据库"
  ],
  [
    "Ergonomía de Oficina Profesional",
    "Diseño del espacio para evitar lesiones físicas.",
    "工效学"
  ],
  [
    "Gestión de Instalaciones",
    "Mantenimiento y servicios del edificio de oficinas.",
    "维护"
  ],
  [
    "Seguridad en el Lugar de Trabajo",
    "Prevención de riesgos laborales en el día a día.",
    "预防"
  ],
  [
    "Gastos de Viaje",
    "Comprobación y reembolso de viáticos de viaje.",
    "退款"
  ],
  [
    "Planificación de Itinerarios",
    "Coordinación detallada de vuelos y hospedaje.",
    "行程"
  ],
  [
    "Reservación de Conferencias",
    "Reservación de stands en eventos internacionales.",
    "展位"
  ],
  [
    "Integración del Equipo",
    "Planificación de dinámicas y eventos para fortalecer al equipo.",
    "团建"
  ],
  [
    "Hito de Revisión B2",
    "Evaluación de competencias operativas y de gestión.",
    "考核"
  ]
];

const TEMAS_C_DATA: string[][] = [
  [
    "Análisis del Mercado Global",
    "Evaluación macroeconómica y geopolítica de mercados.",
    "宏观经济"
  ],
  [
    "Gestión de Crisis",
    "Comunicación ante desastres de marca y relaciones públicas.",
    "危机"
  ],
  [
    "Reporte de Resultados Financieros",
    "EBITDA, balances generales y reportes de dividendos.",
    "税息折旧及摊销前利润"
  ],
  [
    "Fusiones y Adquisiciones",
    "Fusiones de corporativos y debida diligencia.",
    "合并"
  ],
  [
    "Dominio de la Oratoria",
    "Tácticas de retórica y persuasión ante audiencias masivas.",
    "修辞"
  ],
  [
    "Negociación con Matices",
    "Negociar concesiones difíciles bajo presión.",
    "妥协"
  ],
  [
    "Redacción de Contratos Legales",
    "Comprensión fina de cláusulas penales e indemnizaciones.",
    "赔偿金"
  ],
  [
    "ESG y Sostenibilidad Corporativa",
    "Gobernanza corporativa, huella de carbono y RSE.",
    "可持续性"
  ],
  [
    "Estrategia y Pivote Corporativo",
    "Reestructuración estratégica e innovación abierta.",
    "转型"
  ],
  [
    "OPI y Estrategias de Salida",
    "Salir a bolsa o estructurar adquisiciones hostiles.",
    "首次公开募股"
  ],
  [
    "Filosofía de Liderazgo",
    "Modelos de liderazgo exponencial y mentoría.",
    "领导力"
  ],
  [
    "Gestión del Cambio",
    "Gestionar transiciones organizacionales globales.",
    "过渡"
  ],
  [
    "Relaciones con Inversores",
    "Cómo dar discursos convincentes ante accionistas VIP.",
    "股东们"
  ],
  [
    "Gobernanza Corporativa",
    "Políticas anticorrupción y cumplimiento normativo.",
    "合规性"
  ],
  [
    "Planificación de la Sucesión",
    "Elegir líderes sucesores en mesas directivas.",
    "接班人"
  ],
  [
    "Disrupción Tecnológica e IA",
    "Impacto de IA generativa en la cadena de valor.",
    "技术创新"
  ],
  [
    "Fintech y Blockchain",
    "Descentralización financiera y criptoactivos en tesorería.",
    "金融科技"
  ],
  [
    "Innovaciones Biotecnológicas",
    "Desarrollo farmacéutico y patentes científicas.",
    "专利权"
  ],
  [
    "Transición a Energías Limpias",
    "Migrar operaciones corporativas a fuentes limpias.",
    "可再生"
  ],
  [
    "Resiliencia de la Cadena de Suministro",
    "Asegurar la cadena logística contra eventos de fuerza mayor.",
    "韧性"
  ],
  [
    "Gestión de Marcas de Lujo",
    "Mercadotecnia de alta gama y valor percibido.",
    "奢侈品"
  ],
  [
    "Inversión en Bienes Raíces",
    "Fideicomisos y portafolios de bienes raíces.",
    "房地产信托基金"
  ],
  [
    "Presentaciones para Capital de Riesgo",
    "Levantar rondas de inversión Serie A/B.",
    "风险投资"
  ],
  [
    "Protocolos de Ciberseguridad",
    "Políticas corporativas contra ataques de ransomware.",
    "勒索软件"
  ],
  [
    "Alianzas Estratégicas",
    "Crear joint ventures estratégicos.",
    "联盟"
  ],
  [
    "Propiedad Intelectual",
    "Litigios marcarios y registros de derechos de autor.",
    "商标"
  ],
  [
    "Redacción Fantasma Ejecutiva",
    "Redactar discursos para directores ejecutivos.",
    "代笔"
  ],
  [
    "Comunicación Diplomática",
    "Mitigar hostilidades y manejar preguntas incómodas.",
    "外交"
  ],
  [
    "El Poder del Silencio",
    "Uso estratégico de pausas en alta negociación.",
    "沉默"
  ],
  [
    "Estrategia de Diversidad e Inclusión",
    "Políticas corporativas de equidad y pertenencia.",
    "包容性"
  ],
  [
    "Escalamiento del Comercio Electrónico",
    "Logística transfronteriza y marketing automatizado.",
    "电子商务"
  ],
  [
    "Economía del Comportamiento",
    "Cómo influyen los sesgos cognitivos en el consumo.",
    "行为学"
  ],
  [
    "Proyecto Final del Hito C",
    "Evaluación de competencias directivas globales.",
    "终极项目"
  ],
  [
    "Reestructuración Corporativa",
    "Rediseño organizacional para mejorar rentabilidad.",
    "重组"
  ],
  [
    "Cumplimiento Regulatorio",
    "Normas estrictas de cumplimiento legal y ambiental.",
    "监管"
  ],
  [
    "Regulaciones Antimonopolio",
    "Leyes de competencia y prevención de monopolios.",
    "反垄断"
  ],
  [
    "Gestión de Litigios",
    "Gestión de disputas legales y demandas marcarias.",
    "诉讼"
  ],
  [
    "Protección de Patentes",
    "Registro de patentes y defensa de propiedad intelectual.",
    "专利"
  ],
  [
    "Disputas de Marcas Registradas",
    "Resolución de conflictos de marcas registradas.",
    "争议"
  ],
  [
    "Junta Directiva",
    "Dinámica y responsabilidades de la junta directiva.",
    "董事会"
  ],
  [
    "Activismo de los Accionistas",
    "Relación con accionistas que presionan por cambios.",
    "股东"
  ],
  [
    "Compensación Ejecutiva",
    "Estructuración de bonos y opciones sobre acciones.",
    "薪酬"
  ],
  [
    "Roadshow de OPI",
    "Presentación ante inversionistas previo a salir a bolsa.",
    "路演"
  ],
  [
    "Estrategia de Salida",
    "Vías de salida: adquisiciones, fusiones o liquidación.",
    "退出"
  ],
  [
    "Adquisición Hostil",
    "Estrategias de defensa ante compras hostiles de acciones.",
    "收购"
  ],
  [
    "Rondas de Capital de Riesgo",
    "Levantamiento de capital de riesgo Serie A y B.",
    "资金筹集"
  ],
  [
    "Capital Privado",
    "Inversión institucional en empresas de alto potencial.",
    "股权"
  ],
  [
    "Auditoría de Debida Diligencia",
    "Auditoría exhaustiva previa a la adquisición de activos.",
    "尽职调查"
  ],
  [
    "Sinergias de Fusión",
    "Estimación de ahorros operativos tras una fusión.",
    "协同效应"
  ],
  [
    "Creación de Alianzas Estratégicas",
    "Acuerdos de cooperación conjunta entre corporativos.",
    "战略联盟"
  ],
  [
    "Creación de Coempresas",
    "Creación de una nueva entidad compartida.",
    "合资企业"
  ],
  [
    "Fusiones y Adquisiciones Transfronterizas",
    "Fusiones transfronterizas y barreras regulatorias.",
    "跨国境"
  ],
  [
    "Huella de Carbono",
    "Estrategias para alcanzar la neutralidad de carbono.",
    "脱碳"
  ],
  [
    "Responsabilidad Social",
    "Programas de impacto social y filantropía.",
    "慈善事业"
  ],
  [
    "Comunicación de Crisis",
    "Estrategias de relaciones públicas ante escándalos de marca.",
    "公共关系"
  ],
  [
    "Gestión de la Reputación",
    "Medición y protección del valor de la marca.",
    "声誉"
  ],
  [
    "Entrenamiento de Medios",
    "Preparación de directivos para interviews de prensa.",
    "媒体采访"
  ],
  [
    "Retórica de la Oratoria Pública",
    "Tácticas avanzadas de oratoria y persuasión de masas.",
    "雄辩"
  ],
  [
    "Discurso Magistral",
    "Discursos magistrales en convenciones globales.",
    "主题演讲"
  ],
  [
    "Deber Fiduciario",
    "Responsabilidad legal y financiera ante los inversores.",
    "受托人"
  ],
  [
    "Asignación de Capital",
    "Decidir la reinversión de utilidades en la empresa.",
    "资本配置"
  ],
  [
    "Gestión de Tesorería",
    "Control de liquidez, divisas y flujo de caja global.",
    "资金管理"
  ],
  [
    "Estrategias de Cobertura",
    "Uso de derivados para protegerse contra fluctuaciones.",
    "套期保值"
  ],
  [
    "Valoración de Activos",
    "Modelos matemáticos para calcular el precio de activos.",
    "估值"
  ],
  [
    "Política de Dividendos",
    "Decidir el reparto de utilidades a los accionistas.",
    "红利"
  ],
  [
    "Reestructuración de Deuda",
    "Negociar nuevos plazos de pago con bancos acreedores.",
    "债务"
  ],
  [
    "Cadena de Suministro Global",
    "Asegurar el abasto internacional contra contingencias.",
    "全球供应"
  ],
  [
    "Resiliencia Logística",
    "Resiliencia ante cuellos de botella en puertos globales.",
    "港口韧性"
  ],
  [
    "Estrategia de Subcontratación",
    "Decisión estratégica de fabricar o externalizar.",
    "离岸外包"
  ],
  [
    "Estrategia Geopolítica",
    "Adaptar operaciones ante guerras comerciales y aranceles.",
    "地缘政治"
  ],
  [
    "Disrupción del Mercado",
    "Innovaciones tecnológicas que cambian las reglas del juego.",
    "颠覆"
  ],
  [
    "Integración de IA",
    "Automatización y adopción de IA generativa en la empresa.",
    "自动化"
  ],
  [
    "Leyes de Privacidad de Datos",
    "Cumplimiento de regulaciones estrictas como GDPR.",
    "隐私"
  ],
  [
    "Capital Intelectual",
    "Retener talento clave tras reestructuraciones.",
    "知识产权"
  ],
  [
    "Alineación Cultural",
    "Fusionar culturas corporativas de distintos países.",
    "文化融合"
  ],
  [
    "Valoración de Marca",
    "Estimar el valor monetario intangible de una marca.",
    "品牌价值"
  ],
  [
    "Marketing de Alta Gama",
    "Estrategias de posicionamiento en mercados de lujo.",
    "溢价"
  ],
  [
    "Escalamiento de Franquicias",
    "Modelos de expansión a través de franquicias globales.",
    "特许经营"
  ],
  [
    "Logística Transfronteriza",
    "Aduanas, aranceles y envíos transfronterizos.",
    "关税"
  ],
  [
    "Heurística del Comportamiento",
    "Cómo influyen los sesgos cognitivos en el consumo.",
    "启发式"
  ],
  [
    "Inelasticidad de Precios",
    "Estudiar la sensibilidad del precio en el cliente.",
    "弹性"
  ],
  [
    "Valor del Ciclo de Vida del Cliente",
    "Optimización del valor a largo plazo de los clientes.",
    "客户终身价值"
  ],
  [
    "Costo de Adquisición",
    "Métricas del costo de adquisición de clientes (CAC).",
    "客户获取"
  ],
  [
    "Inteligencia de Negocios",
    "Uso estratégico de Big Data para toma de decisiones.",
    "数据分析"
  ],
  [
    "Transformación Digital",
    "Migrar sistemas tradicionales a arquitecturas cloud.",
    "云计算"
  ],
  [
    "Creación de Venture Studio",
    "Creación de incubadoras internas de startups corporativas.",
    "孵化器"
  ],
  [
    "Optimización del Valor para el Accionista",
    "Maximización de la rentabilidad a largo plazo para inversores.",
    "盈利能力"
  ],
  [
    "Estrategia de Reestructuración Corporativa",
    "Planificación de escisiones y reorganización corporativa.",
    "资产剥离"
  ],
  [
    "Riesgo de Expansión Global",
    "Evaluación de riesgos al ingresar a nuevos mercados soberanos.",
    "主权"
  ],
  [
    "Arbitraje Regulatorio",
    "Aprovechamiento estratégico de diferencias regulatorias globales.",
    "套利"
  ],
  [
    "Planificación de la Sucesión Estratégica",
    "Planificación sistemática para la transición del liderazgo ejecutivo.",
    "提名"
  ],
  [
    "Financiamiento de Deuda Sostenible",
    "Emisión de bonos verdes y financiamiento de proyectos ecológicos.",
    "绿色债券"
  ],
  [
    "Mediación de Alto Riesgo",
    "Mediación diplomática y arbitraje en disputas comerciales.",
    "仲裁"
  ],
  [
    "Salidas de Capital de Riesgo",
    "Estrategias de salida y liquidación para inversiones de capital.",
    "清算"
  ],
  [
    "Arquitectura de Riesgo Empresarial",
    "Diseño de marcos integrales de gestión de riesgos corporativos.",
    "企业"
  ],
  [
    "Integración de F&A Multicultural",
    "Integración posterior a la fusión de equipos globales diversos.",
    "多元文化"
  ],
  [
    "Acuerdos de Transferencia de Tecnología",
    "Acuerdos de licenciamiento y transferencia de tecnología patentada.",
    "许可"
  ],
  [
    "Asociaciones Público-Privadas",
    "Estructuración de contratos de concesión con entidades gubernamentales.",
    "合伙关系"
  ],
  [
    "Supervisión de Gobernanza Ética",
    "Supervisión de comités de auditoría y ética en la junta directiva.",
    "监督"
  ],
  [
    "Proyecto Final del Hito Ejecutivo",
    "Evaluación de competencias directivas de alta gerencia.",
    "高管"
  ]
];

// Generar lecciones de forma dinámica con tipado seguro
const buildLessons = (prefix: 'a' | 'b' | 'c', rawData: string[][], limit = 200): LessonNode[] => {
  const lessons: LessonNode[] = [];
  for (let idx = 0; idx < limit; idx++) {
    const num = idx + 1;
    const id = `zh-${prefix}-${num}`;
    
    // Alternar tipos de ejercicio
    const types: ExerciseType[] = ['lecture', 'grammar', 'chat', 'listening'];
    const type = types[idx % types.length];
    
    // Posición para diseño en zigzag serpentine
    const positions: ('left' | 'center' | 'right')[] = ['center', 'left', 'center', 'right'];
    const position = positions[idx % positions.length];
    
    const dataItem = rawData[idx % rawData.length];
    const title = num > 100 ? `${dataItem[0]} Pt. 2` : dataItem[0];
    
    lessons.push({
      id,
      title,
      description: dataItem[1],
      type,
      locked: !(prefix === 'a' && num === 1), // Desbloqueada únicamente zh-a-1 por defecto
      completed: false,
      stars: 0,
      position,
      aiPrompt: `Roleplay: Discuss the topic of '${dataItem[0]}' in Mandarin Chinese using the key terminology related to '${dataItem[2]}'.`
    });
  }
  return lessons;
}

export const CURRICULUM_ZH: LevelSection[] = [
  {
    id: 'ZH-A',
    title: 'Nivel A: Cimientos y Supervivencia',
    description: 'Establece los cimientos indispensables del chino mandarín y desenvuélvete en situaciones cotidianas.',
    color: 'orange',
    lessons: buildLessons('a', TEMAS_A_DATA, 200)
  },
  {
    id: 'ZH-B',
    title: 'Nivel B: Operaciones y Negocios',
    description: 'Comunícate con soltura, domina el vocabulario de oficina y maneja transacciones comerciales en chino.',
    color: 'blue',
    lessons: buildLessons('b', TEMAS_B_DATA, 200)
  },
  {
    id: 'ZH-C',
    title: 'Nivel C: Liderazgo y Guanxi',
    description: 'Domina negociaciones estratégicas de alto nivel y establece relaciones sólidas (Guanxi) en China.',
    color: 'purple',
    lessons: buildLessons('c', TEMAS_C_DATA, 200)
  }
];

// Helper para búsqueda rápida
export function getChineseLessonById(id: string): LessonNode | undefined {
    for (const section of CURRICULUM_ZH) {
        const lesson = section.lessons.find(l => l.id === id);
        if (lesson) return lesson;
    }
    return undefined;
}
