import os
import json

# Target directories
lessons_dir = "c:\\Users\\jeico\\onixlingo\\language-ai-tutor\\backend\\app\\data\\lessons\\zh"
frontend_curriculum_file = "c:\\Users\\jeico\\onixlingo\\language-ai-tutor\\frontend\\data\\curriculum_zh.ts"

os.makedirs(lessons_dir, exist_ok=True)

# 1. TRANSLATION MAPPING DICTIONARIES (300 UNIQUE PAIRS)
VOCAB_MAPPING = {
    # Level A
    "hello": "你好", "desk": "办公桌", "work": "工作", "clock": "时钟",
    "dollars": "美元", "left": "左边", "manager": "经理", "coffee": "咖啡",
    "ticket": "门票", "room": "房间", "email": "电子邮件", "good": "好的",
    "paper": "纸张", "monday": "星期一", "phone": "电话", "done": "完成",
    "organized": "有条理", "week": "星期", "meet": "会议", "intro": "介绍",
    "weather": "天气", "company": "公司", "bank": "银行", "help": "帮助",
    "director": "主管", "family": "家庭", "computer": "电脑", "layout": "布局",
    "order": "订单", "subway": "地铁", "history": "历史", "agree": "同意",
    "rules": "规则", "summary": "总结", "pen": "钢笔", "chair": "椅子",
    "lunch": "午餐", "time": "时间", "agenda": "议程", "note": "便签",
    "folder": "文件夹", "telephone": "通话", "send": "发送", "reply": "回复",
    "safe": "安全", "window": "窗户", "water": "饮用水", "tea": "茶叶",
    "lunchbox": "便当", "snack": "零食", "sync": "同步", "arrive": "到达",
    "depart": "出发", "start": "开始", "finish": "结束", "report": "报告",
    "copy": "复印", "screen": "屏幕", "keyboard": "键盘", "internet": "互联网",
    "login": "登录", "password": "密码", "table": "桌子", "taxi": "出租车",
    "train": "火车", "bus": "公交车", "hotel": "酒店", "passport": "护照",
    "gate": "登机口", "key": "钥匙", "boardroom": "会议室", "coffeemaker": "咖啡机",
    "organizer": "整理器", "pencil": "铅笔", "notebook": "笔记本", "sticker": "贴纸",
    "calculator": "计算器", "wallclock": "挂钟", "visitor": "访客", "parking": "停车场",
    "elevator": "电梯", "bandage": "绷带", "fan": "风扇", "menu": "菜单",
    "receipt": "收据", "purchase": "购买", "lamp": "台灯", "bin": "垃圾桶",
    "mug": "马克杯", "charger": "充电器", "audio": "耳机", "photo": "照片",
    "clean": "清洁", "plant": "植物", "calendar": "日历", "bag": "提包",
    "file": "归档", "lobby": "大堂", "fruit": "水果", "lock": "门锁",
    
    # Level B
    "moderator": "主持人", "offer": "报价", "formal": "正式", "timezone": "时区",
    "milestone": "里程碑", "feedback": "反馈", "increase": "增长", "client": "客户",
    "experience": "经验", "flight": "航班", "strategy": "战略", "budget": "预算",
    "reboot": "重启", "integrity": "诚信", "transfer": "转账", "apologize": "致歉",
    "conflict": "冲突", "vendor": "供应商", "launch": "发布", "inventory": "库存",
    "satisfaction": "满意度", "prioritize": "优先权", "benchmark": "基准", "contract": "合同",
    "risk": "风险", "shares": "股份", "mute": "静音", "networking": "人脉",
    "research": "研发", "hiring": "招聘", "pitch": "推介", "posture": "姿态",
    "progress": "进度", "schedules": "时刻表", "constructive": "建设性", "trends": "趋势",
    "objections": "异议", "schedulezone": "排程", "actionable": "可行性", "update": "更新",
    "demonstrate": "演示", "support": "支持", "standards": "标准", "stock": "现货",
    "market": "市场", "branding": "品牌", "pipeline": "漏斗", "prospect": "潜客",
    "efficiency": "效率", "capacity": "容量", "ethical": "伦理", "green": "环保",
    "safety": "安全规程", "wellness": "健康", "ideation": "构思", "delegate": "授权",
    "alignment": "对齐", "costs": "成本", "expenses": "报销", "income": "收入",
    "pricing": "定价", "timelines": "时间线", "outsourcer": "外包商", "turnover": "周转率",
    "onboard": "入职", "skills": "技能", "culture": "文化", "mentor": "导师",
    "mediation": "调解", "scrum": "敏捷", "sprint": "冲刺", "standup": "站会",
    "appraisal": "评估", "promotion": "晋升", "remote": "远程", "zoom": "视频会议",
    "etiquette": "礼仪", "deck": "幻灯片", "concise": "简洁", "contacts": "联系人",
    "card": "名片", "profile": "简介", "survey": "问卷", "promoter": "推荐者",
    "persona": "画像", "ux": "用户体验", "quality": "质量", "mitigate": "缓解",
    "backup": "备份", "ticketcode": "工单", "patch": "补丁", "database": "数据库",
    "ergonomics": "工效学", "maintenance": "维护", "prevention": "预防", "reimbursement": "退款",
    "itinerary": "行程", "booth": "展位", "teambuilding": "团建", "assessment": "考核",
    
    # Level C
    "macroeconomic": "宏观经济", "crisis": "危机", "ebitda": "税息折旧及摊销前利润", "merger": "合并",
    "rhetoric": "修辞", "concession": "妥协", "indemnity": "赔偿金", "sustainability": "可持续性",
    "pivot": "转型", "ipo": "首次公开募股", "leadership": "领导力", "transition": "过渡",
    "shareholders": "股东们", "compliance": "合规性", "successor": "接班人", "technology": "技术创新",
    "fintech": "金融科技", "patents": "专利权", "renewable": "可再生", "resilience": "韧性",
    "luxury": "奢侈品", "reit": "房地产信托基金", "venture": "风险投资", "ransomware": "勒索软件",
    "alliance": "联盟", "trademark": "商标", "ghostwriting": "代笔", "diplomatic": "外交",
    "silence": "沉默", "inclusion": "包容性", "ecommerce": "电子商务", "behavioral": "行为学",
    "capstone": "终极项目", "restructuring": "重组", "regulatory": "监管", "antitrust": "反垄断",
    "litigation": "诉讼", "patent": "专利", "disputes": "争议", "board": "董事会",
    "shareholder": "股东", "remuneration": "薪酬", "roadshow": "路演", "exit": "退出",
    "takeover": "收购", "funding": "资金筹集", "equity": "股权", "diligence": "尽职调查",
    "synergies": "协同效应", "strategicalliance": "战略联盟", "jointventure": "合资企业", "crossborder": "跨国境",
    "decarbonization": "脱碳", "philanthropy": "慈善事业", "pr": "公共关系", "reputation": "声誉",
    "pressinterview": "媒体采访", "oratorical": "雄辩", "keynote": "主题演讲", "fiduciary": "受托人",
    "capitalallocation": "资本配置", "treasury": "资金管理", "hedging": "套期保值", "valuation": "估值",
    "dividend": "红利", "debt": "债务", "globalsupply": "全球供应", "portresilience": "港口韧性",
    "offshoring": "离岸外包", "geopolitics": "地缘政治", "disruption": "颠覆", "automation": "自动化",
    "privacy": "隐私", "intellectual": "知识产权", "culturalalign": "文化融合", "brandvalue": "品牌价值",
    "premium": "溢价", "franchise": "特许经营", "tariffs": "关税", "heuristics": "启发式",
    "elasticity": "弹性", "clv": "客户终身价值", "acquisition": "客户获取", "analytics": "数据分析",
    "cloud": "云计算", "incubator": "孵化器", "profitability": "盈利能力", "divestiture": "资产剥离",
    "sovereign": "主权", "arbitrage": "套利", "nomination": "提名", "greenbonds": "绿色债券",
    "arbitration": "仲裁", "liquidation": "清算", "enterprise": "企业", "multicultural": "多元文化",
    "licensing": "许可", "partnership": "合伙关系", "oversight": "监督", "executive": "高管"
}

PINYIN_MAPPING = {
    # Level A
    "hello": "nihao", "desk": "bangongzhuo", "work": "gongzuo", "clock": "shizhong",
    "dollars": "meiyuan", "left": "zuobian", "manager": "jingli", "coffee": "kafei",
    "ticket": "menpiao", "room": "fangjian", "email": "dianziyoujian", "good": "haode",
    "paper": "zhizhang", "monday": "xingqiyi", "phone": "dianhua", "done": "wancheng",
    "organized": "youtiaoli", "week": "xingqi", "meet": "huiyi", "intro": "jieshao",
    "weather": "tianqi", "company": "gongsi", "bank": "yinhang", "help": "bangzhu",
    "director": "zhuguan", "family": "jiating", "computer": "diannao", "layout": "buju",
    "order": "dingdan", "subway": "ditie", "history": "lishi", "agree": "tongyi",
    "rules": "guize", "summary": "zongjie", "pen": "gangbi", "chair": "yizi",
    "lunch": "wucan", "time": "shijian", "agenda": "yicheng", "note": "bianqian",
    "folder": "wenjianjia", "telephone": "tonghua", "send": "fasong", "reply": "huifu",
    "safe": "anquan", "window": "chuanghu", "water": "yinyongshui", "tea": "chaye",
    "lunchbox": "biandang", "snack": "lingshi", "sync": "tongbu", "arrive": "daoda",
    "depart": "chufa", "start": "kaishi", "finish": "jieshu", "report": "baogao",
    "copy": "fuyin", "screen": "pingmu", "keyboard": "jianpan", "internet": "hulianwang",
    "login": "denglu", "password": "mima", "table": "zhuozi", "taxi": "chuzuche",
    "train": "huoche", "bus": "gongjiaoche", "hotel": "jiudian", "passport": "huzhao",
    "gate": "dengjikou", "key": "yaoshi", "boardroom": "huiyishi", "coffeemaker": "kafeiji",
    "organizer": "zhengliqi", "pencil": "qianbi", "notebook": "bijiben", "sticker": "tiezhi",
    "calculator": "jisuanqi", "wallclock": "guazhong", "visitor": "fangke", "parking": "tingchechang",
    "elevator": "dianti", "bandage": "bengdai", "fan": "fengshan", "menu": "caidan",
    "receipt": "shouju", "purchase": "goumai", "lamp": "taideng", "bin": "lajitong",
    "mug": "makebei", "charger": "chongdianqi", "audio": "erji", "photo": "zhaopian",
    "clean": "qingjie", "plant": "zhiwu", "calendar": "rili", "bag": "tibao",
    "file": "guidang", "lobby": "datang", "fruit": "shuiguo", "lock": "mensuo",
    
    # Level B
    "moderator": "zhuchiren", "offer": "baojia", "formal": "zhengshi", "timezone": "shiqu",
    "milestone": "lichengbei", "feedback": "fankui", "increase": "zengzhang", "client": "kehu",
    "experience": "jingyan", "flight": "hangban", "strategy": "zhanlue", "budget": "yusuan",
    "reboot": "chongqi", "integrity": "chengxin", "transfer": "zhuanzhang", "apologize": "zhiqian",
    "conflict": "chongtu", "vendor": "gongyingshang", "launch": "fabu", "inventory": "kucun",
    "satisfaction": "manyidu", "prioritize": "youxianquan", "benchmark": "jizhun", "contract": "hetong",
    "risk": "fengxian", "shares": "gufen", "mute": "jingyin", "networking": "renmai",
    "research": "yanfa", "hiring": "zhaopin", "pitch": "tuijie", "posture": "zitai",
    "progress": "jindu", "schedules": "shikebiao", "constructive": "jianshexing", "trends": "qushi",
    "objections": "yiyi", "schedulezone": "paicheng", "actionable": "kexingxing", "update": "gengxin",
    "demonstrate": "yanshi", "support": "zhichi", "standards": "biaozhun", "stock": "xianhuo",
    "market": "shichang", "branding": "pinpai", "pipeline": "loudou", "prospect": "qianke",
    "efficiency": "xiaolv", "capacity": "rongliang", "ethical": "lunli", "green": "huanbao",
    "safety": "anquanguicheng", "wellness": "jiankang", "ideation": "gousi", "delegate": "shouquan",
    "alignment": "duiqi", "costs": "chengben", "expenses": "baoxiao", "income": "shouru",
    "pricing": "dingjia", "timelines": "shijianxian", "outsourcer": "waibaoshang", "turnover": "zhouzhuanlv",
    "onboard": "ruzhi", "skills": "jineng", "culture": "wenhua", "mentor": "daoshi",
    "mediation": "tiaojie", "scrum": "minjie", "sprint": "chongci", "standup": "zhanhui",
    "appraisal": "pinggu", "promotion": "jinsheng", "remote": "yuancheng", "zoom": "shipinhuiyi",
    "etiquette": "liyi", "deck": "huandengpian", "concise": "jianjie", "contacts": "lianxiren",
    "card": "mingpian", "profile": "jianjie", "survey": "wenjuan", "promoter": "tuijianzhe",
    "persona": "huaxiang", "ux": "yonghutiyan", "quality": "zhiliang", "mitigate": "huanjie",
    "backup": "beifen", "ticketcode": "gongdan", "patch": "buding", "database": "shujuku",
    "ergonomics": "gongxiaoxue", "maintenance": "weihu", "prevention": "yufang", "reimbursement": "tuikuan",
    "itinerary": "xingcheng", "booth": "zhanwei", "teambuilding": "tuanjian", "assessment": "kaohe",
    
    # Level C
    "macroeconomic": "hongguanjingji", "crisis": "weiji", "ebitda": "shuixizhejiujitanxiaoqianlirun", "merger": "hebing",
    "rhetoric": "xiuci", "concession": "tuoxie", "indemnity": "peichangjin", "sustainability": "kechixuxing",
    "pivot": "zhuanxing", "ipo": "shoucigongkaimugu", "leadership": "lingdaoli", "transition": "guodu",
    "shareholders": "gudongmen", "compliance": "heguixing", "successor": "jiebanren", "technology": "jishuchuangxin",
    "fintech": "jinrongkeji", "patents": "zhuanliquan", "renewable": "kezaisheng", "resilience": "renxing",
    "luxury": "shechipin", "reit": "fangdichanxintuojijin", "venture": "fengxiantouzi", "ransomware": "lesuoruanjian",
    "alliance": "lianmeng", "trademark": "shangbiao", "ghostwriting": "daibi", "diplomatic": "waijiao",
    "silence": "chenmo", "inclusion": "baorongxing", "ecommerce": "dianzishangwu", "behavioral": "xingweixue",
    "capstone": "zhongjixiangmu", "restructuring": "chongzu", "regulatory": "jianguan", "antitrust": "fanlongduan",
    "litigation": "susong", "patent": "zhuanli", "disputes": "zhengyi", "board": "dongshihui",
    "shareholder": "gudong", "remuneration": "xinchou", "roadshow": "luyan", "exit": "tuichu",
    "takeover": "shougou", "funding": "zijinchouji", "equity": "guquan", "diligence": "jinzhidiaocha",
    "synergies": "xietongxiaoying", "strategicalliance": "zhanluelianmeng", "jointventure": "heziqiye", "crossborder": "kuaguojing",
    "decarbonization": "tuotan", "philanthropy": "cishanshiye", "pr": "gonggongguanxi", "reputation": "shengyu",
    "pressinterview": "meiticaifang", "oratorical": "xiongbian", "keynote": "zhutiyanjian", "fiduciary": "shoutuoren",
    "capitalallocation": "zibenpeizhi", "treasury": "zijinguanli", "hedging": "taoqibaozhi", "valuation": "guzhi",
    "dividend": "hongli", "debt": "zhaiwu", "globalsupply": "quanqiugongying", "portresilience": "gangkourenxing",
    "offshoring": "lianwaibao", "geopolitics": "diyuanzhengzhi", "disruption": "dianfu", "automation": "zidonghua",
    "privacy": "yinsi", "intellectual": "zhishichanquan", "culturalalign": "wenhuaronghe", "brandvalue": "pinpaijiazhi",
    "premium": "yijia", "franchise": "texujingying", "tariffs": "guanshui", "heuristics": "qifashi",
    "elasticity": "tanxing", "clv": "kehuzhongshenjiazhi", "acquisition": "kehuhuoqu", "analytics": "shujufenxi",
    "cloud": "yunjisuan", "incubator": "fuhuaqi", "profitability": "yinglinengli", "divestiture": "zichanboli",
    "sovereign": "zhuquan", "arbitrage": "taoli", "nomination": "timing", "greenbonds": "lusezhaiquan",
    "arbitration": "zhongcai", "liquidation": "qingsuan", "enterprise": "qiye", "multicultural": "duoyuanwenhua",
    "licensing": "xuke", "partnership": "hehuoguanxi", "oversight": "jiandu", "executive": "gaoguan"
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

# 2. GENERATE BACKEND LESSON JSON FILES (600 FILES TOTAL)
def generate_lesson_file(level, index, eng_title, description, eng_vocab):
    vocab = VOCAB_MAPPING.get(eng_vocab, eng_vocab)
    pinyin = PINYIN_MAPPING.get(eng_vocab, eng_vocab)
    title = TITLE_MAPPING.get(eng_title, eng_title)
    if index > 100:
        title = f"{title} (Parte 2)"
    
    lesson_id = f"zh-{level.lower()}-{index}"
    difficulty = "easy" if level == "A" else "medium" if level == "B" else "hard"
    
    # grammatical points, pinyin/tone guides, and Guanxi rules
    if level == "A":
        point_grammatical = (
            "- Estructura de oración básica: Sujeto + Tiempo + Verbo + Objeto (ej. '我们使用{vocab}').\\n"
            "- El uso del verbo copulativo 是 (shì) para identificar roles y objetos de oficina (ej. '这是{vocab}').\\n"
            "- Clave Didáctica: Identificación de sustantivos de oficina y orden sintáctico elemental."
        )
        phonetic_tip = f"Pinyin y Tonos: Recuerda pronunciar '{pinyin}' prestando atención a los tonos de cada sílaba."
        golden_rule = "Regla de Oro de Guanxi: En China, la cortesía básica al saludar ('你好' Nǐhǎo) y entregar tarjetas de presentación con ambas manos es el primer paso indispensable para construir confianza."
    elif level == "B":
        point_grammatical = (
            "- Partículas aspectuales: El uso de 了 (le) para indicar acciones completadas en el trabajo (ej. '完成了{vocab}').\\n"
            "- Verbos auxiliares de necesidad u obligación: 应该 (yīnggāi - deber) y 需要 (xūyào - necesitar) (ej. '我们需要{vocab}').\\n"
            "- Clave Didáctica: Expresar flujos de trabajo completados y necesidades de inventario o presupuestos."
        )
        phonetic_tip = f"Pinyin y Tonos: Presta atención a los cambios de tono en palabras combinadas con '{pinyin}'."
        golden_rule = "Regla de Oro de Guanxi: Al negociar en el nivel B, la puntualidad y las comidas de negocios son fundamentales. Nunca rechaces de manera directa una propuesta; prefiere frases diplomáticas como 'lo consideraremos' (我们考虑一下) para no hacer perder cara (面子 miànzi)."
    else: # Level C
        point_grammatical = (
            "- Estructuras condicionales avanzadas: 如果... 就... (rúguǒ... jiù...) para planes de contingencia (ej. '如果优化{vocab}，我们就提高利润').\\n"
            "- Estructura de énfasis 是... 的 (shì... de) para recalcar el agente o el momento de la estrategia.\\n"
            "- Clave Didáctica: Formulación de hipótesis estratégicas y discursos diplomáticos de nivel directivo."
        )
        phonetic_tip = f"Pinyin y Tonos: Usa la cadencia adecuada en discursos sobre '{pinyin}', haciendo pausas estratégicas para enfatizar conceptos clave."
        golden_rule = "Regla de Oro de Guanxi: En el nivel C, las relaciones a largo plazo (关系 Guanxi) con altos directivos y reguladores pesan tanto como el contrato escrito. El respeto a la jerarquía y el intercambio de regalos institucionales abren puertas decisivas."
        
    point_grammatical = point_grammatical.replace("{vocab}", vocab)
    
    # Theory Stage (Chinese & Spanish Bilingual Didactics)
    theory_stage = {
        "id": "stg_theory",
        "type": "lecture",
        "title": f"Teoría Core: {title}",
        "parts": [
            {
                "visual": f"★ SISTEMA DE CHINO MANDARÍN PROFESIONAL ONIXLINGO ★\n\nNivel {level} • Lección {level}-{index} de 200\nTema: {title}\n\nConcepto Clave:\n☞ '{vocab.upper()}' ({pinyin.upper()})\n\n[Punto Gramatical - 语法要点]\n{point_grammatical}",
                "audio": f"Bienvenido a la lección {level}-{index} sobre {title}. Exploremos la teoría y la aplicación estratégica de nuestro vocabulario clave: {vocab}, pronunciado como {pinyin}."
            },
            {
                "visual": f"[Análisis Detallado del Vocabulario]\n- Carácter : '{vocab}' (Pinyin: {pinyin} | Traducción/Uso: {description})\n- Aplicación Práctica : '我们必须使用 {vocab}。' (Debemos usar {vocab}.)\n\n[Guía de Pronunciación y Tonos - 拼音与声调]\n- {phonetic_tip}",
                "audio": f"Por favor, concéntrate en nuestro término clave: {vocab}. Répételo después de mí: {vocab}."
            },
            {
                "visual": f"[Regla de Oro de Guanxi - 商务黄金法则]\n- {golden_rule}\n\n¡Comience los ejercicios prácticos ahora!",
                "audio": "Comencemos los ejercicios interactivos para validar su comprensión."
            }
        ]
    }
    
    
    # Choice Stage (10 Questions in Chinese)
    choice_questions = []
    choice_questions.append({
        "id": f"{lesson_id}-q-choice-1",
        "type": "quiz_choice",
        "question": f"在“{title}”的背景下，“{vocab}”主要指什么？",
        "options": [
            f"在“{title}”中使用的核心专业概念“{vocab}”。",
            f"在“{title}”中应该避免使用的非正式俗语。",
            f"一个在商业活动中不再使用的过时词汇。",
            f"一个在“{title}”中没有任何特定含义的通用词汇。"
        ],
        "correct_answer": f"在“{title}”中使用的核心专业概念“{vocab}”。",
        "explanation": f"理解“{vocab}”的定义是掌握“{title}”的基础。"
    })
    choice_questions.append({
        "id": f"{lesson_id}-q-choice-2",
        "type": "quiz_choice",
        "question": f"在商业活动中，何时最适合讨论与“{title}”相关的“{vocab}”？",
        "options": [
            f"在向利益相关者展示与“{title}”相关的关键想法时。",
            f"仅在工作之余的非正式私人沟通中。",
            f"当您想故意混淆同事和合作伙伴时。",
            f"永远不要讨论，因为“{vocab}”不是专业术语。"
        ],
        "correct_answer": f"在向利益相关者展示与“{title}”相关的关键想法时。",
        "explanation": f"在商务陈述中提及“{vocab}”能提升关于“{title}”的整体沟通效果。"
    })
    choice_questions.append({
        "id": f"{lesson_id}-q-choice-3",
        "type": "quiz_choice",
        "question": f"以下哪项被认为是管理“{title}”的良好专业实践？",
        "options": [
            f"优先进行主动对齐并妥善使用“{vocab}”。",
            f"绕过所有标准沟通渠道以节省时间。",
            f"在完全孤立的状态下工作，不通知团队。",
            f"完全忽略“{vocab}”在项目中的战略价值。"
        ],
        "correct_answer": f"优先进行主动对齐并妥善使用“{vocab}”。",
        "explanation": f"主动对齐和正确使用“{vocab}”是成功执行“{title}”的支柱。"
    })
    choice_questions.append({
        "id": f"{lesson_id}-q-choice-4",
        "type": "quiz_choice",
        "question": f"专业人员在“{title}”方面常犯的哪种常见错误与“{vocab}”有关？",
        "options": [
            f"误解“{vocab}”在整个业务流程中的战略作用。",
            f"与其他团队成员进行了过多的沟通与协作。",
            f"提前太长时间准备了部门会议的议程。",
            f"以极高的精度详细记录了所有的业务决策。"
        ],
        "correct_answer": f"误解“{vocab}”在整个业务流程中的战略作用。",
        "explanation": f"未能认识到“{vocab}”的影响往往会导致“{title}”的执行效率低下。"
    })
    choice_questions.append({
        "id": f"{lesson_id}-q-choice-5",
        "type": "quiz_choice",
        "question": f"对于说西班牙语的专业人士，“{vocab}”在“{title}”环境中的最接近含义是什么？",
        "options": [
            f"它代表了适合“{title}”商务环境的“{vocab}”核心概念。",
            f"一个在商业活动中没有任何用处的俚语。",
            f"一个没有任何实际应用价值的字面翻译。",
            f"一个与商务汉语完全无关的复杂技术词汇。"
        ],
        "correct_answer": f"它代表了适合“{title}”商务环境的“{vocab}”核心概念。",
        "explanation": f"翻译或应用“{vocab}”需要理解其在“{title}”中的实际商业用途。"
    })
    choice_questions.append({
        "id": f"{lesson_id}-q-choice-6",
        "type": "quiz_choice",
        "question": f"“{vocab}”的概念如何帮助优化“{title}”相关的业务流程？",
        "options": [
            f"它为协调“{title}”中的各项活动提供了清晰的框架。",
            f"它允许团队跳过所有标准的业务审批步骤。",
            f"它鼓励进行非正式且无结构的业务讨论。",
            f"它增加了完成简单项目所需的总体时间。"
        ],
        "correct_answer": f"它为协调“{title}”中的各项活动提供了清晰的框架。",
        "explanation": f"将“{vocab}”作为参考能优化工作流和团队的整体协作。"
    })

    choice_questions.append({
        "id": f"{lesson_id}-q-choice-7",
        "type": "quiz_choice",
        "question": f"在关于“{title}”的会议上，主管应该如何介绍“{vocab}”？",
        "options": [
            f"通过清晰的指标展示其对公司业务目标的影响。",
            f"通过非常快速的发言来避免回答困难的问题。",
            f"将其作为一个不需要过多关注的次要细节。",
            f"在不准备任何幻灯片或支持数据的情况下介绍。"
        ],
        "correct_answer": f"通过清晰的指标展示其对公司业务目标的影响。",
        "explanation": f"基于数据的“{vocab}”陈述能确保管理层的对齐和支持。"
    })
    choice_questions.append({
        "id": f"{lesson_id}-q-choice-8",
        "type": "quiz_choice",
        "question": f"在开展涉及“{vocab}”的任务合作时，团队首先应该做什么？",
        "options": [
            f"明确关键交付物并设定“{vocab}”的里程碑。",
            f"立即开始工作，而不分配任何具体的职责角色。",
            f"推迟所有讨论，直到截止日期临近为止。",
            f"立即向财务总监申请增加项目预算。"
        ],
        "correct_answer": f"明确关键交付物并设定“{vocab}”的里程碑。",
        "explanation": f"定义与“{vocab}”相关的里程碑可以防止项目延误和团队混乱。"
    })
    choice_questions.append({
        "id": f"{lesson_id}-q-choice-9",
        "type": "quiz_choice",
        "question": f"掌握“{title}”相关专业词汇（如“{vocab}”）的主要好处是什么？",
        "options": [
            f"它能让您在商务活动中流利地使用专业词汇“{vocab}”进行沟通。",
            f"它能确保您在没有额外努力的情况下获得立即晋升。",
            f"它允许您绕过公司所有的合规性管理规定。",
            f"它减少了每周进行团队对齐会议的必要性。"
        ],
        "correct_answer": f"它能让您在商务活动中流利地使用专业词汇“{vocab}”进行沟通。",
        "explanation": f"在商务汉语中，熟练使用诸如“{vocab}”之类的专业词汇是专家级水平的基石。"
    })
    choice_questions.append({
        "id": f"{lesson_id}-q-choice-10",
        "type": "quiz_choice",
        "question": f"为什么全球在“{vocab}”上的协调一致对跨国公司至关重要？",
        "options": [
            f"它确保了不同地区和部门之间的一致性理解。",
            f"它允许团队在正式公文中大量使用地方俗语。",
            f"它限制了公司总部对地方分公司的决策控制力。",
            f"它使法律合同变得更短且不需要包含细节。"
        ],
        "correct_answer": f"它确保了不同地区和部门之间的一致性理解。",
        "explanation": f"对“{vocab}”的统一解读可以防止昂贵的跨国沟通误区。"
    })
    
    # Order Sentence Stage (10 Questions in Chinese)
    order_questions = []
    if level == "A":
        templates = [
            (f"我们在会议中使用我们的{vocab}。", ["我们", "在会议中", "使用", "我们的", vocab, "。"]),
            (f"这是我们项目的{vocab}。", ["这是", "我们项目的", vocab, "。"]),
            (f"今天早上我要确认我们的{vocab}。", ["今天早上", "我要", "确认", "我们的", vocab, "。"]),
            (f"请现在提交您的{vocab}。", ["请", "现在", "提交", "您的", vocab, "。"]),
            (f"我们的团队非常看重这个{vocab}。", ["我们的", "团队", "非常看重", "这个", vocab, "。"]),
            (f"我们可以在中午前确认这个{vocab}吗？", ["我们", "可以在", "中午前", "确认这个", vocab, "吗", "？"]),
            (f"这周我们需要安排我们的{vocab}。", ["这周", "我们需要", "安排", "我们的", vocab, "。"]),
            (f"让我们一起查看我们{vocab}的状态。", ["让我们", "一起", "查看我们", vocab, "的", "状态", "。"]),
            (f"他们希望改善我们{vocab}的效率。", ["他们", "希望", "改善我们", vocab, "的", "效率", "。"]),
            (f"她每天都在使用我们的{vocab}。", ["她", "每天", "都在使用", "我们的", vocab, "。"])
        ]
    elif level == "B":
        templates = [
            (f"我们必须实施您的{vocab}以优化工作流程。", ["我们", "必须", "实施您的", vocab, "以", "优化", "工作流程", "。"]),
            (f"我们目前的战略优先考虑您针对客户的{vocab}。", ["我们", "目前的", "战略", "优先考虑", "您", "针对客户的", vocab, "。"]),
            (f"请就我们{vocab}的事宜与团队进行协调。", ["请", "就我们", vocab, "的", "事宜", "与团队", "进行协调", "。"]),
            (f"让我们安排一次简短的会议来讨论我们的{vocab}。", ["让我们", "安排", "一次简短的会议", "来讨论", "我们的", vocab, "。"]),
            (f"项目经理要求提供一份关于我们{vocab}的报告。", ["项目", "经理", "要求", "提供一份关于", "我们", vocab, "的", "报告", "。"]),
            (f"我们必须 analyze our {vocab} how it affects the budget.", ["我们", "必须", "分析我们的", vocab, "如何", "影响", "总体预算", "。"]),
            (f"您能确认交付我们{vocab}的具体时间表吗？", ["您能", "确认交付", "我们", vocab, "的", "具体", "时间表", "吗", "？"]),
            (f"这一举措与我们{vocab}的总体目标完全一致。", ["这一", "举措", "与我们", vocab, "的", "总体目标", "完全一致", "。"]),
            (f"他们已经决定将我们{vocab}的管理工作进行外包。", ["他们", "已经", "决定将", "我们", vocab, "的", "管理工作", "进行外包", "。"]),
            (f"我们本季度应该专注于提升我们{vocab}的质量。", ["我们", "本季度", "应该", "专注于提升", "我们", vocab, "的", "质量", "。"])
        ]
    else: # Level C
        templates = [
            (f"战略对齐要求我们严格遵守关于{vocab}的规定。", ["战略", "对齐", "要求我们", "严格遵守", "关于", vocab, "的", "规定", "。"]),
            (f"我们利用我们的{vocab}来缓解全球面临的各种风险。", ["我们", "利用我们的", vocab, "来", "缓解", "全球面临的", "各种风险", "。"]),
            (f"董事会今年已经优先考虑了我们{vocab}的部署。", ["董事会", "今年", "已经优先考虑了", "我们", vocab, "的", "部署", "。"]),
            (f"我们的数字化转型在很大程度上取决于我们{vocab}的整合。", ["我们的", "数字化转型", "在很大程度上", "取决于我们", vocab, "的", "整合", "。"]),
            (f"全面而深入的审计揭示了我们{vocab}中存在的漏洞。", ["全面而", "深入的", "审计", "揭示了", "我们", vocab, "中", "存在的漏洞", "。"]),
            (f"我们必须重新谈判相关条款以切实保护我们的{vocab}。", ["我们", "必须", "重新谈判", "相关条款", "以切实", "保护我们的", vocab, "。"]),
            (f"这次合并旨在与我们现有的{vocab}产生协同效应。", ["这次", "合并", "旨在与我们", "现有的", vocab, "产生", "协同效应", "。"]),
            (f"他就我们{vocab}的发展发表了极具说服力的演讲。", ["他", "就我们", vocab, "的", "发展", "发表了", "极具说服力的", "演讲", "。"]),
            (f"我们的合资企业将专注于共同开发我们的全新{vocab}。", ["我们的", "合资企业", "将专注于", "共同开发", "我们的", "全新", vocab, "。"]),
            (f"合规性监管要求我们必须全面确保{vocab}的安全。", ["合规性", "监管", "要求我们", "必须", "全面确保", vocab, "的", "安全", "。"])
        ]
        
    for q_idx, (full_sentence, correct_order) in enumerate(templates):
        parts = correct_order.copy()
        if len(parts) > 3:
            parts = parts[2:] + parts[:2]
        
        order_questions.append({
            "id": f"{lesson_id}-q-order-{q_idx+1}",
            "type": "order_sentence",
            "question": f"Arrange the words to build a professional sentence about “{vocab}” (Exercise {q_idx+1}) :",
            "parts": parts,
            "correct_order": correct_order,
            "explanation": f"The correct order of words is crucial to express ideas about “{vocab}” clearly in professional Mandarin."
        })
        
    # Listening Stage (5 Questions)
    listening_questions = []
    listening_sentences = [
        f"我们的主要目标是详细讨论我们的“{vocab}”。",
        f"您能澄清一下我们“{vocab}”目前的具体状态吗？",
        f"我们今年完全致力于提高我们“{vocab}”的效率。",
        f"客户对我们“{vocab}”的表现给出了非常积极的反馈。",
        f"让我们对齐时间表，把精力集中在我们的“{vocab}”上。"
    ]
    for q_idx, text in enumerate(listening_sentences):
        listening_questions.append({
            "id": f"{lesson_id}-q-listening-{q_idx+1}",
            "type": "listening_match",
            "question": "Select exactly what you hear in the audio stream:",
            "tts_text": text,
            "options": [
                text,
                f"另一个关于我们“{vocab}”的错误说法。",
                "一个与当前话题完全无关的通用商务表述。"
            ],
            "correct_answer": text,
            "explanation": "Active listening ensures correct audit understanding of vocabulary during business meetings."
        })
        
    # Fill Input Stage (5 Questions in Chinese)
    fill_questions = []
    # Q1: Active spelling check using pinyin without tones
    fill_questions.append({
        "id": f"{lesson_id}-q-fill-1",
        "type": "fill_input",
        "question": f"请写出专业词汇“{vocab}”的拼音（不用带声调，字母全部小写，例如：ni hao）：",
        "correct_answers": [pinyin, pinyin.replace(" ", ""), pinyin.capitalize(), pinyin.title()],
        "hints": [f"Su pinyin empieza con '{pinyin[:2]}'"],
        "explanation": f"This exercise tests your active spelling and pinyin recognition of the term '{vocab}' ({pinyin})."
    })
    
    if level == "A":
        fill_questions.append({
            "id": f"{lesson_id}-q-fill-2",
            "type": "fill_input",
            "question": f"请完成句子：“我们需要认真____处理关于{vocab}的工作。” (地 / 的)",
            "correct_answers": ["地"],
            "hints": ["副词修饰动词用“地” (adverbial marker)"],
            "explanation": f"在汉语中，修饰动词（处理）时应该使用副词标志“地”，用来修饰关于{vocab}的工作执行。"
        })
        fill_questions.append({
            "id": f"{lesson_id}-q-fill-3",
            "type": "fill_input",
            "question": f"请完成句子：“团队想____星期一早上讨论关于{vocab}的计划。” (在 / 到)",
            "correct_answers": ["在"],
            "hints": ["表示在某个具体时间点"],
            "explanation": f"在具体的时间状语（星期一早上）之前，我们应该使用介词“在”，以安排对{vocab}的讨论。"
        })
        fill_questions.append({
            "id": f"{lesson_id}-q-fill-4",
            "type": "fill_input",
            "question": f"请完成句子：“这是一____关于{vocab}的紧急报告。” (份 / 张)",
            "correct_answers": ["份"],
            "hints": ["用于报告、文件或合同的专业量词"],
            "explanation": f"在专业商务汉语中，用于“报告”、“文件”或“合同”等文本性交付物的量词是“份”。"
        })
        fill_questions.append({
            "id": f"{lesson_id}-q-fill-5",
            "type": "fill_input",
            "question": f"请完成句子：“我们____去会议室讨论关于{vocab}的议程吧。” (一起 / 一下)",
            "correct_answers": ["一起"],
            "hints": ["表示多个人共同行动"],
            "explanation": f"“一起”表示团队成员共同前往并开展关于“{vocab}”的业务讨论，体现团队协作。"
        })
    elif level == "B":
        fill_questions.append({
            "id": f"{lesson_id}-q-fill-2",
            "type": "fill_input",
            "question": f"请完成句子：“我们目前的战略取决于团队____努力，以推进{vocab}。” (的 / 得)",
            "correct_answers": ["的"],
            "hints": ["定语修饰名词时用“的” (possessive marker)"],
            "explanation": f"“团队的努力”中，“努力”被用作名词，前面应该使用结构助词“的”来连接对“{vocab}”的投入。"
        })
        fill_questions.append({
            "id": f"{lesson_id}-q-fill-3",
            "type": "fill_input",
            "question": f"请完成句子：“请____团队成员协调关于{vocab}的预算。” (与 / 被)",
            "correct_answers": ["与"],
            "hints": ["表示与某人协同或和某人一起"],
            "explanation": f"介词“与”用于引入协同工作的对象，符合团队合作协调“{vocab}”预算的商务场景。"
        })
        fill_questions.append({
            "id": f"{lesson_id}-q-fill-4",
            "type": "fill_input",
            "question": f"请完成句子：“项目经理要求提供一____关于{vocab}的详细审计。” (份 / 个)",
            "correct_answers": ["份"],
            "hints": ["用于书面专业审计的量词"],
            "explanation": f"在商务公文中，针对“审计”或“资产负债”等文件的正式量词应使用“份”。"
        })
        fill_questions.append({
            "id": f"{lesson_id}-q-fill-5",
            "type": "fill_input",
            "question": f"请完成句子：“我们必须建立一个____的体系来管理{vocab}。” (高效 / 慢速)",
            "correct_answers": ["高效"],
            "hints": ["表示高效率和高产出"],
            "explanation": f"“高效”是高管对体系的核心要求，以确保对“{vocab}”的高产出和优化运营。"
        })
    else: # Level C
        fill_questions.append({
            "id": f"{lesson_id}-q-fill-2",
            "type": "fill_input",
            "question": f"请完成句子：“董事会____关于{vocab}的重组计划表示了高度关注。” (对 / 比)",
            "correct_answers": ["对"],
            "hints": ["引入关注或指涉的对象"],
            "explanation": f"介词“对”在这里起引入对象的作用，表示董事会关注的客体是“{vocab}”的重组。"
        })
        fill_questions.append({
            "id": f"{lesson_id}-q-fill-3",
            "type": "fill_input",
            "question": f"请完成句子：“我们必须精益求精，____能确保{vocab}的绝对安全。” (才 / 就)",
            "correct_answers": ["才"],
            "hints": ["表示条件限制，只有这样才能实现"],
            "explanation": f"副词“才”用于与前半句的“精益求精”形成逻辑条件呼应，表示只有达到该要求才能确保“{vocab}”的绝对安全。"
        })
        fill_questions.append({
            "id": f"{lesson_id}-q-fill-4",
            "type": "fill_input",
            "question": f"请完成句子：“这次战略合并旨在____协同效应，推动{vocab}的发展。” (产生 / 减少)",
            "correct_answers": ["产生"],
            "hints": ["表示带来或创造出某种效应"],
            "explanation": f"在高级商务汉语中，动词“产生”与“协同效应”是规范的固定词汇搭配，能有效促进“{vocab}”的发展。"
        })
        fill_questions.append({
            "id": f"{lesson_id}-q-fill-5",
            "type": "fill_input",
            "question": f"请完成句子：“主管要求对{vocab}的规定进行一次____的合规审查。” (全面 / 粗略)",
            "correct_answers": ["全面"],
            "hints": ["表示完整且没有遗漏的"],
            "explanation": f"“全面”指覆盖所有维度的审查，完全符合管理层对“{vocab}”合规性的高级监管标准。"
        })
        
    lesson_json = {
        "id": lesson_id,
        "version": "3.0-PRO",
        "title": title,
        "level": level,
        "description": description,
        "total_xp": 300,
        "difficulty": difficulty,
        "tags": [level.lower(), "standard", "chinese", "didactic", "grammar", "vocabulary"],
        "stages": [
            theory_stage,
            {
                "id": "stg_drill_choice",
                "type": "gamified_quiz",
                "title": "Drill 1: Vocabulario de Dirección",
                "questions": choice_questions
            },
            {
                "id": "stg_drill_order",
                "type": "gamified_quiz",
                "title": "Drill 2: Construcción de la Syntaxe",
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
    print("Writing frontend curriculum_zh.ts file...")
    
    temas_a_clean = [[TITLE_MAPPING.get(item[0], item[0]), item[1], VOCAB_MAPPING.get(item[2], item[2])] for item in temas_a]
    temas_b_clean = [[TITLE_MAPPING.get(item[0], item[0]), item[1], VOCAB_MAPPING.get(item[2], item[2])] for item in temas_b]
    temas_c_clean = [[TITLE_MAPPING.get(item[0], item[0]), item[1], VOCAB_MAPPING.get(item[2], item[2])] for item in temas_c]
    
    temas_a_str = json.dumps(temas_a_clean, indent=2, ensure_ascii=False)
    temas_b_str = json.dumps(temas_b_clean, indent=2, ensure_ascii=False)
    temas_c_str = json.dumps(temas_c_clean, indent=2, ensure_ascii=False)
    
    ts_code = f"""import {{ LevelSection, LessonNode, ExerciseType }} from './curriculum';

// --- CURRÍCULUM CON 200 LECCIONES REALES EN CHINO MANDARÍN POR NIVEL (600 LECCIONES TOTALES) ---

const TEMAS_A_DATA: string[][] = {temas_a_str};

const TEMAS_B_DATA: string[][] = {temas_b_str};

const TEMAS_C_DATA: string[][] = {temas_c_str};

// Generar lecciones de forma dinámica con tipado seguro
const buildLessons = (prefix: 'a' | 'b' | 'c', rawData: string[][], limit = 200): LessonNode[] => {{
  const lessons: LessonNode[] = [];
  for (let idx = 0; idx < limit; idx++) {{
    const num = idx + 1;
    const id = `zh-${{prefix}}-${{num}}`;
    
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
      locked: !(prefix === 'a' && num === 1), // Desbloqueada únicamente zh-a-1 por defecto
      completed: false,
      stars: 0,
      position,
      aiPrompt: `Roleplay: Discuss the topic of '${{dataItem[0]}}' in Mandarin Chinese using the key terminology related to '${{dataItem[2]}}'.`
    }});
  }}
  return lessons;
}}

export const CURRICULUM_ZH: LevelSection[] = [
  {{
    id: 'ZH-A',
    title: 'Nivel A: Cimientos y Supervivencia',
    description: 'Establece los cimientos indispensables del chino mandarín y desenvuélvete en situaciones cotidianas.',
    color: 'orange',
    lessons: buildLessons('a', TEMAS_A_DATA, 200)
  }},
  {{
    id: 'ZH-B',
    title: 'Nivel B: Operaciones y Negocios',
    description: 'Comunícate con soltura, domina el vocabulario de oficina y maneja transacciones comerciales en chino.',
    color: 'blue',
    lessons: buildLessons('b', TEMAS_B_DATA, 200)
  }},
  {{
    id: 'ZH-C',
    title: 'Nivel C: Liderazgo y Guanxi',
    description: 'Domina negociaciones estratégicas de alto nivel y establece relaciones sólidas (Guanxi) en China.',
    color: 'purple',
    lessons: buildLessons('c', TEMAS_C_DATA, 200)
  }}
];

// Helper para búsqueda rápida
export function getChineseLessonById(id: string): LessonNode | undefined {{
    for (const section of CURRICULUM_ZH) {{
        const lesson = section.lessons.find(l => l.id === id);
        if (lesson) return lesson;
    }}
    return undefined;
}}
"""
    with open(frontend_curriculum_file, "w", encoding="utf-8") as f:
        f.write(ts_code)
    print("Frontend curriculum_zh.ts successfully updated!")

def main():
    print("Loading English topics from expand_curriculum_300...")
    from expand_curriculum_300 import TEMAS_A, TEMAS_B, TEMAS_C
    
    # Clean old files to ensure pristine standard cache
    print("Cleaning old Chinese JSON files...")
    if os.path.exists(lessons_dir):
        for f in os.listdir(lessons_dir):
            if f.endswith(".json"):
                os.remove(os.path.join(lessons_dir, f))
    
    print("Generating 600 professional unique lessons for Chinese backend...")
    count = 0
    # Level A
    for idx in range(200):
        item = TEMAS_A[idx % len(TEMAS_A)]
        generate_lesson_file("A", idx + 1, item[0], item[1], item[2])
        count += 1
    # Level B
    for idx in range(200):
        item = TEMAS_B[idx % len(TEMAS_B)]
        generate_lesson_file("B", idx + 1, item[0], item[1], item[2])
        count += 1
    # Level C
    for idx in range(200):
        item = TEMAS_C[idx % len(TEMAS_C)]
        generate_lesson_file("C", idx + 1, item[0], item[1], item[2])
        count += 1
    print(f"Successfully generated {count} Chinese custom lessons JSON files.")
    
    generate_frontend_ts_file(TEMAS_A, TEMAS_B, TEMAS_C)

if __name__ == "__main__":
    main()
