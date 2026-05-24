import os
import json
import random
import sys
import io

# Force UTF-8 encoding for standard output and error to prevent Windows charmap encoding errors
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# --- CONFIGURACIÓN ---
OUTPUT_DIR = "app/voclessons/lessons"
OUTPUT_FR_DIR = "app/voclessons/lessons/fr"
OUTPUT_ZH_DIR = "app/voclessons/lessons/zh"

print("🚀 Iniciando Generador Maestro Vocabulario 60 (10 Categorías)...")

# Asegurar directorios
for d in [OUTPUT_DIR, OUTPUT_FR_DIR, OUTPUT_ZH_DIR]:
    if not os.path.exists(d):
        os.makedirs(d)
        print(f"📁 Directorio creado: {d}")

# 1. IMPORTAR BASES DE DATOS EXISTENTES
try:
    from generate_fr_voc import VOCAB_DATABASE as FR_DB
    print("✅ Base de datos de Francés importada con éxito.")
except Exception as e:
    print(f"⚠️ Error cargando generate_fr_voc: {e}. Usando fallback vacío.")
    FR_DB = {}

try:
    from generate_zh_voc import VOCAB_DATABASE as ZH_DB
    print("✅ Base de datos de Chino importada con éxito.")
except Exception as e:
    print(f"⚠️ Error cargando generate_zh_voc: {e}. Usando fallback vacío.")
    ZH_DB = {}

# --- MAPEO DE ESPAÑOL A INGLÉS COMÚN PARA CATEGORÍAS INDIVIDUALES ---
ES_TO_EN_MAP = {
    # Negocios comunes (Originales de generate_fr_voc.py / generate_zh_voc.py)
    "Reunión de negocios": "Business meeting",
    "Presupuesto anual": "Annual budget",
    "Contrato mercantil": "Commercial contract",
    "Factura comercial": "Commercial invoice",
    "Estrategia de ventas": "Sales strategy",
    "Sociedad anónima": "Public limited company",
    "Fusión de empresas": "Merger of companies",
    "Adquisición corporativa": "Corporate acquisition",
    "Recursos humanos": "Human resources",
    "Flujo de caja": "Cash flow",
    "Margen de ganancia": "Profit margin",
    "Junta directiva": "Board of directors",
    "Plan de negocios": "Business plan",
    "Auditoría externa": "External audit",
    "Ventaja competitiva": "Competitive advantage",
    "Negociación salarial": "Salary negotiation",
    "Desarrollo profesional": "Professional development",
    "Retención de talento": "Talent retention",
    "Eficiencia operativa": "Operational efficiency",
    "Productividad laboral": "Labor productivity",
    "Estructura corporativa": "Corporate structure",
    "Solvencia financiera": "Financial solvency",
    "Control de calidad": "Quality control",
    "Capital de trabajo": "Working capital",
    "Activos y pasivos": "Assets and liabilities",
    "Gastos de representación": "Representation expenses",
    "Impuestos corporativos": "Corporate taxes",
    "Deuda empresarial": "Business debt",
    "Inversión de capital": "Capital investment",
    "Bolsa de valores": "Stock exchange",
    "Acciones y dividendos": "Shares and dividends",
    "Socio comercial": "Business partner",
    "Proveedor de servicios": "Service provider",
    "Clientes potenciales": "Potential clients",
    "Competencia desleal": "Unfair competition",
    "Liderazgo ejecutivo": "Executive leadership",
    "Cultura organizacional": "Organizational culture",
    "Responsabilidad social": "Social responsibility",
    "Gastos generales": "Overhead costs",
    "Despido injustificado": "Unfair dismissal",
    "Renuncia voluntaria": "Voluntary resignation",
    "Jubilación anticipada": "Early retirement",
    "Puesto vacante": "Vacant position",
    "Ascenso laboral": "Job promotion",
    "Proceso de selección": "Selection process",
    "Contratación de personal": "Staff hiring",
    "Evaluación de desempeño": "Performance evaluation",
    "Capacitación empresarial": "Corporate training",
    "Clima laboral": "Work environment",
    "Sindicato de trabajadores": "Labor union",
    
    # Marketing comunes
    "Campaña publicitaria": "Advertising campaign",
    "Estudio de mercado": "Market research",
    "Público objetivo": "Target audience",
    "Imagen de marca": "Brand image",
    "Logotipo corporativo": "Corporate logo",
    "Estrategia de marketing": "Marketing strategy",
    "Lanzamiento de producto": "Product launch",
    "Presupuesto de campaña": "Campaign budget",
    "Canal de distribución": "Distribution channel",
    "Segmentación de mercado": "Market segmentation",
    "Posicionamiento de marca": "Brand positioning",
    "Fidelización de clientes": "Customer loyalty",
    "Tasa de conversión": "Conversion rate",
    "Embudo de ventas": "Sales funnel",
    "Cliente potencial": "Potential customer",
    "Métrica de rendimiento": "Performance metric",
    "Nicho de mercado": "Market niche",
    "Alcance orgánico": "Organic reach",
    "Alcance pagado": "Paid reach",
    "Patrocinio corporativo": "Corporate sponsorship",
    "Marketing de contenidos": "Content marketing",
    "Campaña viral": "Viral campaign",
    "Análisis de audiencia": "Audience analysis",
    "Perspectiva de mercado": "Market insight",
    "Palabra clave": "Keyword",
    "Clasificación en motores": "Search engine ranking",
    "Segmento de clientes": "Customer segment",
    "Resumen ejecutivo": "Executive brief",
    "Discurso de venta": "Sales pitch",
    "Tráfico del sitio": "Site traffic",
    "Tasa de rebote": "Bounce rate",
    "Impresiones de anuncio": "Ad impressions",
    "Costo por clic": "Cost per click",
    "Analítica web": "Web analytics",
    "Compromiso del cliente": "Customer engagement",
    "Optimización de motores": "Search engine optimization",
    "Retención de usuarios": "User retention",
    "Análisis de sentimiento": "Sentiment analysis",
    "Atribución de ventas": "Sales attribution",
    "Derechos de autor": "Copyright",
    "Franquicia comercial": "Commercial franchise",
    "Boletín informativo": "Newsletter",
    "Proyección de ventas": "Sales projection",
    "Testimonio de cliente": "Customer testimonial",
    "Programa de afiliados": "Affiliate program",
    "Negocio a negocio": "Business-to-business (B2B)",
    "Negocio a consumidor": "Business-to-consumer (B2C)",
    "Retorno de inversión": "Return on investment (ROI)",
    "Indicador clave": "Key performance indicator (KPI)",
    "Gestión de relaciones": "Customer relationship management (CRM)"
}

def translate_es_to_en(es_word):
    cleaned = es_word.strip()
    if cleaned in ES_TO_EN_MAP:
        return ES_TO_EN_MAP[cleaned]
    return cleaned

# --- MASTER TRANSLATIONS DICTIONARY FOR COMBINATORICS ---
translations = {
    # VERBOS
    "Comer": ("Manger", "Eat", "吃 (Chī)"),
    "Dormir": ("Dormir", "Sleep", "睡 (Shuì)"),
    "Beber": ("Boire", "Drink", "喝 (Hē)"),
    "Caminar": ("Marcher", "Walk", "走 (Zǒu)"),
    "Correr": ("Courir", "Run", "跑 (Pǎo)"),
    "Hablar": ("Parler", "Speak", "说 (Shuō)"),
    "Escribir": ("Écrire", "Write", "写 (Xiě)"),
    "Leer": ("Lire", "Read", "读 (Dú)"),
    "Comprar": ("Acheter", "Buy", "买 (Mǎi)"),
    "Cocinar": ("Cuisiner", "Cook", "烹饪 (Pēngrèn)"),
    "Ver": ("Voir", "See", "看 (Kàn)"),
    "Escuchar": ("Écouter", "Listen", "听 (Tīng)"),
    "Sentir": ("Sentir", "Feel", "感觉 (Gǎnjué)"),
    "Pensar": ("Penser", "Think", "想 (Xiǎng)"),
    "Conocer": ("Connaître", "Know / Meet", "认识 (Rènshi)"),
    
    "Viajar": ("Voyager", "Travel", "旅游 (Lǚyóu)"),
    "Reservar": ("Réserver", "Book / Reserve", "预订 (Yùdìng)"),
    "Embarcar": ("Embarquer", "Board", "登机 (Dēngjī)"),
    "Volar": ("Voler", "Fly", "飞 (Fēi)"),
    "Conducir": ("Conduire", "Drive", "驾驶 (Jiàshǐ)"),
    "Explorar": ("Explorer", "Explore", "探索 (Tànsuǒ)"),
    "Visitar": ("Visiter", "Visit", "参观 (Cānguān)"),
    "Navegar": ("Naviguer", "Navigate / Sail", "航行 (Hángxíng)"),
    "Aterrizar": ("Atterrir", "Land", "降落 (Jiàngluò)"),
    "Despegar": ("Décoller", "Take off", "起飞 (Qǐfēi)"),
    "Facturar": ("Enregistrer", "Check in", "托运 (Tuōyùn)"),
    "Declarar": ("Déclarer", "Declare", "申报 (Shēnbào)"),
    "Alquilar": ("Louer", "Rent", "租赁 (Zūlìn)"),
    "Cambiar": ("Changer", "Change / Exchange", "兑换 (Duìhuàn)"),
    
    "Optimizar": ("Optimiser", "Optimize", "优化 (Yōuhuà)"),
    "Negociar": ("Négocier", "Negotiate", "谈判 (Tánpàn)"),
    "Auditar": ("Auditer", "Audit", "审计 (Shěnjì)"),
    "Evaluar": ("Évaluer", "Evaluate", "评估 (Pínggū)"),
    "Lanzar": ("Lancer", "Launch", "发布 (Fābù)"),
    "Diversificar": ("Diversifier", "Diversify", "多元化 (Duōyuánhuà)"),
    "Monitorear": ("Surveiller", "Monitor", "监控 (Jiānkòng)"),
    "Financiar": ("Financer", "Finance", "资助 (Zīzhù)"),
    "Reestructurar": ("Restructurer", "Restructure", "重组 (Chóngzǔ)"),
    "Liderar": ("Diriger", "Lead", "领导 (Lǐngdǎo)"),
    "Promover": ("Promouvoir", "Promote", "促销 (Cùxiāo)"),
    "Reducir": ("Réduire", "Reduce", "降低 (Jiàngdī)"),
    "Aumentar": ("Augmenter", "Increase", "增加 (Zēngjiā)"),
    "Coordinar": ("Coordonner", "Coordinate", "协调 (Xiétiáo)"),
    "Adquirir": ("Acquérir", "Acquire", "收购 (Shōugòu)"),
    
    "Analizar": ("Analyser", "Analyze", "分析 (Fēnxī)"),
    "Segmentar": ("Segmenter", "Segment", "细分 (Xìfēn)"),
    "Posicionar": ("Positionner", "Position", "定位 (Dìngwèi)"),
    "Fidelizar": ("Fidéliser", "Retain", "留住 (Liúzhù)"),
    "Atraer": ("Attirer", "Attract", "吸引 (Xīyǐn)"),
    "Captar": ("Capter", "Capture", "获客 (Huòkè)"),
    "Diseñar": ("Concevoir", "Design", "设计 (Shèjì)"),
    "Habilitar": ("Activer", "Enable", "启用 (Qǐyòng)"),
    "Diferenciar": ("Différencier", "Differentiate", "区分 (Qūfēn)"),
    
    "Socializar": ("Socialiser", "Socialize", "社交 (Shèjiāo)"),
    "Conversar": ("Converser", "Converse / Talk", "交谈 (Jiāotán)"),
    "Presentar": ("Présenter", "Introduce", "介绍 (Jièshào)"),
    "Conectar": ("Connecter", "Connect", "建立联系 (Jiànlì liánxì)"),
    "Interactuar": ("Interagir", "Interact", "互动 (Hùdòng)"),
    "Dialogar": ("Dialoguer", "Dialogue", "对话 (Duìhuà)"),
    "Relacionarse": ("Se lier", "Associate / Network", "交往 (Jiāowǎng)"),
    "Colaborar": ("Collaborer", "Collaborate", "合作 (Hézuò)"),
    "Simpatizar": ("Sympathiser", "Sympathize / Bond", "交好 (Jiāohǎo)"),
    "Agradecer": ("Remercier", "Thank", "感恩 (Gǎn'ēn)"),
    "Saludar": ("Saluer", "Greet", "问候 (Wènhòu)"),
    "Invitar": ("Inviter", "Invite", "邀请 (Yāoqǐng)"),
    "Frecuentar": ("Fréquenter", "Frequent / Attend", "常去 (Chángqù)"),
    
    "Inspirar": ("Inspirer", "Inspire", "鼓舞 (Gǔwǔ)"),
    "Delegar": ("Déléguer", "Delegate", "授权 (Shòukuán)"),
    "Persuadir": ("Persuader", "Persuade", "说服 (Shuōfú)"),
    "Motivar": ("Motiver", "Motivate", "激励 (Jīlì)"),
    "Decidir": ("Décider", "Decide", "决定 (Juédìng)"),
    "Dirigir": ("Diriger", "Direct / Guide", "指导 (Zhǐdǎo)"),
    "Guiar": ("Guider", "Guide", "引导 (Yǐndǎo)"),
    "Influir": ("Influencer", "Influence", "影响 (Yǐngxiǎng)"),
    "Fomentar": ("Encourager", "Foster / Encourage", "促进 (Cùjìn)"),
    "Comunicar": ("Communiquer", "Comunicate", "沟通 (Gōutōng)"),
    "Planificar": ("Planifier", "Plan", "策划 (Cèhuà)"),
    "Empoderar": ("Responsabiliser", "Empower", "赋能 (Fùnéng)"),
    "Reconocer": ("Reconnaître", "Recognize / Praise", "表彰 (Biǎozhāng)"),
    "Unificar": ("Unifier", "Unify", "凝聚 (Níngjù)"),
    
    "Invertir": ("Investir", "Invest", "投资 (Tóuzī)"),
    "Ahorrar": ("Épargner", "Save", "储蓄 (Chǔxù)"),
    "Multiplicar": ("Multiplier", "Multiply", "翻倍 (Fānbèi)"),
    "Monetizar": ("Monétiser", "Monetize", "变现 (Biànxiàn)"),
    "Hedgear": ("Couvrir", "Hedge", "套期保值 (Tàoqī bǎozhí)"),
    "Capitalizar": ("Capitaliser", "Capitalize", "资本化 (Zīběnhuà)"),
    "Generar": ("Générer", "Generate", "创造 (Chuàngzào)"),
    "Comerciar": ("Commercer", "Trade", "交易 (Jiāoyì)"),
    "Liquidar": ("Liquider", "Liquidate", "清算 (Qīngsuàn)"),
    "Prever": ("Prévoir", "Forecast", "预测 (Yùcè)"),
    
    "Pactar": ("Convenir", "Agree / Pact", "协定 (Xiédìng)"),
    "Cerrar": ("Clôturer", "Close / Finalize", "达成 (Dáchéng)"),
    "Mediar": ("Médiatiser", "Mediate", "调解 (Tiáojiě)"),
    "Resolver": ("Résoudre", "Resolve", "解决 (Jiějué)"),
    "Acordar": ("Accepter", "Agree", "商定 (Shāngdìng)"),
    "Transigir": ("Faire des compromis", "Compromise", "妥协 (Tuǒxié)"),
    "Argumentar": ("Argumenter", "Argue", "论证 (Lùnzhèng)"),
    "Proponer": ("Proposer", "Propose", "提议 (Tíyì)"),
    "Formalizar": ("Formaliser", "Formalize", "正式化 (Zhèngshìhuà)"),
    "Garantizar": ("Garantir", "Guarantee", "保证 (Bǎozhèng)"),
    "Alinear": ("Aligner", "Align", "对齐 (Duìqí)"),
    "Equilibrar": ("Équilibrer", "Balance", "平衡 (Pínghéng)"),
    
    "Meditar": ("Méditer", "Meditate", "冥想 (Míngxiǎng)"),
    "Ejercitar": ("Exercer", "Exercise", "锻炼 (Duànliàn)"),
    "Nutrir": ("Nourrir", "Nourish", "滋养 (Zīyǎng)"),
    "Relajarse": ("Se détendre", "Relax", "放松 (Fàngsōng)"),
    "Vivir": ("Vivre", "Live", "生活 (Shēnghuó)"),
    "Disfrutar": ("Profiter", "Enjoy", "享受 (Xiǎngshòu)"),
    "Cuidar": ("Soigner", "Care", "呵护 (Hēhù)"),
    "Desconectar": ("Déconnecter", "Disconnect / Unwind", "放空 (Fàngkōng)"),
    "Mejorar": ("Améliorer", "Improve", "提升 (Tíshēng)"),
    "Cultivar": ("Cultiver", "Cultivate", "培养 (Péiyǎng)"),
    "Fortalecer": ("Renforcer", "Strengthen", "增强 (Zēngqiáng)"),
    "Embellecer": ("Embellir", "Beautify", "美化 (Měihuà)"),
    "Renovar": ("Renouveler", "Renovate / Refresh", "更新 (Gēngxīn)"),
    
    "Innovar": ("Innover", "Innovate", "创新 (Chuàngxīn)"),
    "Investigar": ("Rechercher", "Research", "科研 (Kēyán)"),
    "Programar": ("Programmer", "Program", "编程 (Biānchéng)"),
    "Automatizar": ("Automatiser", "Automate", "自动化 (Zìdònghuà)"),
    "Descubrir": ("Découvrir", "Discover", "探索 (Tànsuǒ)"),
    "Simular": ("Simuler", "Simulate", "模拟 (Mónǐ)"),
    "Cifrar": ("Chiffrer", "Encrypt", "加密 (Jiāmì)"),
    "Predecir": ("Prédire", "Predict", "预测 (Yùcè)"),
    "Revolucionar": ("Révolutionner", "Revolutionize", "颠覆 (Diānfù)"),
    "Patentar": ("Breveter", "Patent", "申请专利 (Shēnqǐng zhuānlì)"),
    "Desarrollar": ("Développer", "Develop", "开发 (Kāifā)"),

    # SUSTANTIVOS
    "la manzana": ("la pomme", "the apple", "苹果 (Píngguǒ)"),
    "el pan": ("le pain", "the bread", "面包 (Miànbāo)"),
    "el agua": ("l'eau", "the water", "水 (Shuǐ)"),
    "la casa": ("la maison", "the house", "房屋 (Fángwū)"),
    "la habitación": ("la chambre", "the room", "房间 (Fángjiān)"),
    "la familia": ("la famille", "the family", "家人 (Jiārén)"),
    "el amigo": ("l'ami", "the friend", "朋友 (Péngyou)"),
    "la ropa": ("les vêtements", "the clothes", "衣服 (Yīfu)"),
    "el coche": ("la voiture", "the car", "汽车 (Qìchē)"),
    "el libro": ("le livre", "the book", "书本 (Shūběn)"),
    "la mesa": ("la table", "the table", "桌子 (Zhuōzi)"),
    "la silla": ("la chaise", "the chair", "椅子 (Yǐzi)"),
    "el perro": ("le chien", "the dog", "小狗 (Xiǎogǒu)"),
    "el gato": ("le chat", "the cat", "小猫 (Xiǎomāo)"),
    "el cuerpo": ("le corps", "the body", "身体 (Shēntǐ)"),
    
    "el equipaje de mano": ("le bagage à main", "the carry-on baggage", "手提行李 (Shǒutí xínglǐ)"),
    "el billete de avión": ("le billet d'avion", "the flight ticket", "飞机票 (Fēijī piào)"),
    "el pasaporte vigente": ("le passeport valide", "the valid passport", "有效护照 (Yǒuxiào hùzhào)"),
    "el hotel de lujo": ("l'hôtel de luxe", "the luxury hotel", "豪华酒店 (Háohuá jiǔdiàn)"),
    "el itinerario de viaje": ("l'itinéraire de voyage", "the travel itinerary", "旅行路线 (Lǚxíng lùxiàn)"),
    "el autobús local": ("le bus local", "the local bus", "当地巴士 (Dāngdì bāshì)"),
    "la terminal de salidas": ("le terminal des départs", "the departures terminal", "出发航站楼 (Chūfā hángzhànlóu)"),
    "la aduana nacional": ("la douane nationale", "the national customs", "海关 (Hǎiguān)"),
    "el guía turístico": ("le guide touristique", "the tour guide", "导游 (Dǎoyóu)"),
    "la moneda extranjera": ("la devise étrangère", "the foreign currency", "外币 (Wàibì)"),
    "la estación de tren": ("la gare ferroviaire", "the train station", "火车站 (Huǒchēzhàn)"),
    "la tarjeta de embarque": ("la carte d'embarquement", "the boarding pass", "登机牌 (Dēngjīpái)"),
    "el seguro de viaje": ("l'assurance voyage", "the travel insurance", "旅行保险 (Lǚxíng bǎoxiǎn)"),
    "el coche de alquiler": ("la voiture de location", "the rental car", "租车 (Zūchē)"),
    "la visa de turista": ("le visa touristique", "the tourist visa", "旅游签证 (Lǚyóu qiānzhèng)"),
    
    "el presupuesto anual": ("le budget annuel", "the annual budget", "年度预算 (Niándù yùsuàn)"),
    "el contrato mercantil": ("le contrat commercial", "the commercial contract", "商务合同 (Shāngwù hétóng)"),
    "el flujo de caja": ("le flux de trésorerie", "the cash flow", "现金流 (Xiànjīnliú)"),
    "el rendimiento laboral": ("la performance au travail", "the job performance", "工作业绩 (Gōngzuò yèjī)"),
    "el riesgo corporativo": ("le risque d'entreprise", "the corporate risk", "公司风险 (Gōngsī fēngxiǎn)"),
    "la inversión de capital": ("l'investissement de capitaux", "the capital investment", "资本投资 (Zīběn tóuzī)"),
    "la ventaja competitiva": ("l'avantage concurrentiel", "the competitive advantage", "竞争优势 (Jìngzhēng yōushì)"),
    "el plan de expansión": ("le plan d'expansion", "the expansion plan", "扩张规划 (Kuòzhāng guīhuà)"),
    "la eficiencia operativa": ("l'efficacité opérationnelle", "the operational efficiency", "运营效率 (Yùnyíng xiàolǜ)"),
    "los costos de producción": ("les coûts de production", "the production costs", "生产成本 (Shēngchǎn chéngběn)"),
    "la retención de talento": ("la rétention des talents", "the talent retention", "人才留存 (Réncái liúcún)"),
    "la solvencia financiera": ("la solvabilité financière", "the financial solvency", "财务偿债能力 (Cáiwù chángzhài nénglì)"),
    "las acciones bursátiles": ("les actions en bourse", "the stock shares", "股票股份 (Gǔpiào gǔfèn)"),
    "la cultura organizacional": ("la culture organisationnelle", "the organizational culture", "组织文化 (Zǔzhī wénhuà)"),
    "la cadena de suministro": ("la chaîne d'approvisionnement", "the supply chain", "供应链 (Gōngyìngliàn)"),
    
    "la campaña publicitaria": ("la campagne publicitaire", "the advertising campaign", "广告活动 (Guǎnggào huódòng)"),
    "el embudo de ventas": ("le tunnel de vente", "the sales funnel", "销售漏斗 (Xiāoshòu lòudǒu)"),
    "el público objetivo": ("le public cible", "the target audience", "目标受众 (Mùbiāo shòuzhòng)"),
    "la imagen de marca": ("l'image de marque", "the brand image", "品牌形象 (Pǐnpái xíngxiàng)"),
    "la tasa de conversión": ("le taux de conversion", "the conversion rate", "转化率 (Zhuǎnhuà lǜ)"),
    "el alcance orgánico": ("la portée organique", "the organic reach", "有机触达 (Yǒujī chùdá)"),
    "los clientes potenciales": ("les prospects / leads", "the potential clients / leads", "潜在客户 (Qiánzài kèhù)"),
    "el contenido digital": ("le contenu numérique", "the digital content", "数字内容 (Shùzì nèiróng)"),
    "el tráfico web": ("le trafic web", "the web traffic", "网站流量 (Wǎngzhàn liúliàng)"),
    "las palabras clave": ("les mots-clés", "the keywords", "关键词 (Guānjiàncí)"),
    "el presupuesto de marketing": ("le budget marketing", "the marketing budget", "营销预算 (Yíngxiāo yùsuàn)"),
    "la presencia en redes": ("la présence sur les réseaux", "the social media presence", "社交媒体存在 (Shèjiāo méitǐ cúnzài)"),
    "la analítica web": ("l'analyse web", "the web analytics", "网络分析 (Wǎngluò fēnxī)"),
    "los testimonios de clientes": ("les témoignages clients", "the customer testimonials", "客户证言 (Kèhù zhèngyán)"),
    "la fidelidad a la marca": ("la fidélité à la marque", "the brand loyalty", "品牌忠诚度 (Pǐnpái zhōngchéngdù)"),
    
    "la charla informal": ("le bavardage", "the small talk", "闲聊 (Xiánliáo)"),
    "el evento de networking": ("l'événement de réseautage", "the networking event", "社交活动 (Shèjiāo huódòng)"),
    "la cena de negocios": ("le dîner d'affaires", "the business dinner", "商务晚宴 (Shāngwù wǎnyàn)"),
    "la tarjeta de presentación": ("la carte de visite", "the business card", "名片 (Míngpiàn)"),
    "el contacto profesional": ("le contact professionnel", "the professional contact", "职业人脉 (Zhíyè rénmài)"),
    "la relación mutua": ("la relation mutuelle", "the mutual relationship", "双边关系 (Shuāngbiān guānxì)"),
    "el tema de conversación": ("le sujet de conversation", "the conversation topic", "话题 (Huàtí)"),
    "la etiqueta social": ("l'étiquette sociale", "the social etiquette", "社交礼仪 (Shèjiāo lǐyí)"),
    "el grupo de interés": ("le groupe d'intérêt", "the interest group", "兴趣小组 (Xìngqù xiǎozhǔ)"),
    "la comunidad profesional": ("la communauté professionnelle", "the professional community", "职业圈子 (Zhíyè quānzi)"),
    "el respeto mutuo": ("le respect mutuel", "the mutual respect", "相互尊重 (Xiānghù zūnzhòng)"),
    "la anécdota personal": ("l'anecdote personnelle", "the personal anecdote", "个人趣事 (Gèrén qùshì)"),
    "la red de contactos": ("le réseau de contacts", "the contact network", "人脉网络 (Rénmài wǎngluò)"),
    "la reunión social": ("le rassemblement social", "the social gathering", "社交聚会 (Shèjiāo jùhuì)"),
    "el apretón de manos": ("la poignée de main", "the handshake", "握手 (Wòshǒu)"),
    
    "la visión estratégica": ("la vision stratégique", "the strategic vision", "战略愿景 (Zhànlüè yuànjǐng)"),
    "la toma de decisiones": ("la prise de décision", "the decision making", "决策能力 (Juécè nénglì)"),
    "el discurso inspirador": ("le discours inspirant", "the inspiring speech", "励志演讲 (Lìzhì yǎnjiǎng)"),
    "la oratoria elocuente": ("l'art oratoire éloquent", "the eloquent public speaking", "雄辩口才 (Xióngbiàn kǒucái)"),
    "la delegación de autoridad": ("la délégation de pouvoir", "the delegation of authority", "分权授权 (Fēnquán shòukuán)"),
    "la motivación de equipos": ("la motivation d'équipe", "the team motivation", "团队激励 (Tuánduì jīlì)"),
    "el rendimiento sobresaliente": ("la performance exceptionnelle", "the outstanding performance", "卓越表现 (Zhuóyuè biǎoxiàn)"),
    "la resiliencia corporativa": ("la résilience de l'entreprise", "the corporate resilience", "企业韧性 (Qǐyè rènxìng)"),
    "el liderazgo ético": ("le leadership éthique", "the ethical leadership", "伦理领导力 (Lúnlǐ lǐngdǎolì)"),
    "los objetivos de la organización": ("les objectifs de l'organisation", "the organizational goals", "组织目标 (Zǔzhī mùbiāo)"),
    "el consenso ejecutivo": ("le consensus exécutif", "the executive consensus", "高管共识 (Gāoguǎn gòngshí)"),
    "la cultura de excelencia": ("la culture de l'excellence", "the culture of excellence", "追求卓越文化 (Zhuīqiú zhuóyuè wénhuà)"),
    "la dirección estratégica": ("la direction stratégique", "the strategic direction", "战略导向 (Zhànlüè dǎoxiàng)"),
    "el impacto global": ("l'impact mondial", "the global impact", "全球影响 (Quánqiú yǐngxiǎng)"),
    "la influencia positiva": ("l'influence positive", "the positive influence", "积极影响 (Jījí yǐngxiǎng)"),
    
    "los activos financieros": ("les actifs financiers", "the financial assets", "金融资产 (Jīnróng zīchǎn)"),
    "el portafolio diversificado": ("le portefeuille diversifié", "the diversified portfolio", "多元化组合 (Duōyuánhuà zǔhé)"),
    "los ingresos pasivos": ("les revenus passifs", "the passive income", "被动收入 (Bèidòng shōurù)"),
    "el mercado bursátil": ("le marché boursier", "the stock market", "证券市场 (Zhèngquàn shìchǎng)"),
    "el capital de inversión": ("le capital d'investissement", "the investment capital", "投资资本 (Tóuzī zīběn)"),
    "la tasa de interés": ("le taux d'intérêt", "the interest rate", "利率 (Lìlǜ)"),
    "la riqueza personal": ("la richesse personnelle", "the personal wealth", "个人财富 (Gèrén cáifù)"),
    "el crecimiento patrimonial": ("la croissance patrimoniale", "the wealth growth", "财富增长 (Cáifù zēngzhǎng)"),
    "la bolsa de valores": ("la bourse des valeurs", "the stock exchange", "股票交易所 (Gǔpiào jiāoyìsuǒ)"),
    "los bonos del estado": ("les obligations d'État", "the government bonds", "国债 (Guózhài)"),
    "la inversión inmobiliaria": ("l'investissement immobilier", "the real estate investment", "房地产投资 (Fángdìchǎn tóuzī)"),
    "el fondo de inversión": ("le fonds d'investissement", "the investment fund", "投资基金 (Tóuzī jījīn)"),
    "las tendencias macroeconómicas": ("les tendances macroéconomiques", "the macroeconomic trends", "宏观经济趋势 (Hóngguān jīngjì qūshì)"),
    "el análisis de riesgos": ("l'analyse des risques", "the risk analysis", "风险评估 (Fēngxiǎn pínggū)"),
    "las criptomonedas avanzadas": ("les crypto-monnaies avancées", "the advanced cryptocurrencies", "前沿加密货币 (Qiányán jiāmì huòbì)"),
    
    "el acuerdo de beneficio mutuo": ("l'accord mutuellement bénéfique", "the win-win agreement", "互利共赢协议 (Hùlì gòngyíng xiéyì)"),
    "la oferta final": ("l'offre finale", "the final offer", "最终报价 (Zuìzhōng bàojià)"),
    "la cláusula del contrato": ("la clause contractuelle", "the contract clause", "合同条款 (Hétóng tiáokuǎn)"),
    "la mesa de negociación": ("la table de négociation", "the negotiation table", "谈判桌 (Tánpànzhuō)"),
    "el punto de equilibrio": ("le point d'équilibre", "the break-even point", "盈亏平衡点 (Yíngkuī pínghéngdiǎn)"),
    "la resolución de conflictos": ("la résolution des conflits", "the conflict resolution", "解决冲突 (Jiějué chōngtū)"),
    "el compromiso mutuo": ("le compromis mutuel", "the mutual compromise", "相互妥协 (Xiānghù tuǒxié)"),
    "la objeción del cliente": ("l'objection du client", "the customer objection", "客户异议 (Kèhù yìyì)"),
    "el trato comercial": ("l'accord commercial / deal", "the commercial deal", "商业交易 (Shāngyè jiāoyì)"),
    "la contraoferta razonable": ("la contre-proposition raisonnable", "the reasonable counteroffer", "合理还价 (Hélǐ huánjià)"),
    "la concesión estratégica": ("la concession stratégique", "the strategic concession", "战略让步 (Zhànlüè ràngbù)"),
    "la firma del contrato": ("la signature du contrat", "the contract signing", "签署合同 (Qiānshǔ hétóng)"),
    "el pacto de confidencialidad": ("l'accord de confidentialité", "the non-disclosure agreement", "保密协议 (Bǎomì xiéyì)"),
    "los intereses alineados": ("les intérêts alignés", "the aligned interests", "利益一致 (Lìyì yīzhì)"),
    "el arbitraje de disputas": ("l'arbitrage des différends", "the dispute arbitration", "争端仲裁 (Zhēngduān zhòngcái)"),
    
    "la paz mental": ("la paix d'esprit", "the peace of mind", "心平气和 (Xīnpíngqìhé)"),
    "el estilo de vida saludable": ("le mode de vie sain", "the healthy lifestyle", "健康生活方式 (Jiànkāng shēnghuó fāngshì)"),
    "la nutrición equilibrada": ("la nutrition équilibrée", "the balanced nutrition", "均衡营养 (Jūnhéng yíngyǎng)"),
    "el entrenamiento físico": ("l'entraînement physique", "the physical workout", "体能训练 (Tǐnéng xùnliàn)"),
    "el hábito de alto rendimiento": ("l'habitude de haute performance", "the high-performance habit", "高效习惯 (Gāoxiào xíguàn)"),
    "la meditación diaria": ("la méditation quotidienne", "the daily meditation", "每日冥想 (Měirì míngxiǎng)"),
    "el bienestar integral": ("le bien-être intégral", "the holistic wellness", "身心健康 (Shēnxīn jiànkāng)"),
    "la alta cocina (gourmet)": ("la haute cuisine", "the gourmet fine dining", "高级美食 (Gāojí měishí)"),
    "la moda de lujo": ("la mode de luxe", "the luxury fashion", "奢侈时尚 (Shēchǐ shíshàng)"),
    "el descanso restaurador": ("le sommeil réparateur", "the restorative rest", "恢复性睡眠 (Huīfùxì shuìmián)"),
    "la rutina de spa": ("la routine de spa", "the spa routine", "水疗护理 (Shuǐliáo hùlǐ)"),
    "el deporte al aire libre": ("le sport de plein air", "the outdoor sport", "户外运动 (Hùwài yùndòng)"),
    "la salud preventiva": ("la santé préventive", "the preventive health", "预防性健康 (Yùfángxì jiànkāng)"),
    "el desarrollo personal": ("le développement personnel", "the self-improvement", "自我成长 (Zìwǒ chéngzhǎng)"),
    "el ocio de alta gama": ("les loisirs haut de gamme", "the high-end leisure", "高端休闲 (Gāoduān xiūxián)"),
    
    "la inteligencia artificial": ("l'intelligence artificielle", "the artificial intelligence", "人工智能 (Réngōng zhìnéng)"),
    "el aprendizaje automático": ("l'apprentissage automatique", "the machine learning", "机器学习 (Jīqì xuéxí)"),
    "la tecnología cuántica": ("la technologie quantique", "the quantum technology", "量子技术 (Liàngzǐ jìshù)"),
    "la energía renovable": ("l'énergie renouvelable", "the renewable energy", "可再生能源 (Kě zàishēng néngyuán)"),
    "la biotecnología avanzada": ("la biotechnologie avancée", "the advanced biotechnology", "前沿生物技术 (Qiányán shēngwù jìshù)"),
    "el análisis de macrodatos (big data)": ("l'analyse des mégadonnées", "the big data analytics", "大数据分析 (Dàshùjù fēnxī)"),
    "la automatización inteligente": ("l'automatisation intelligente", "the smart automation", "智能自动化 (Zhǐnéng zìdònghuà)"),
    "la exploración espacial": ("l'exploration spatiale", "the space exploration", "太空探索 (Tàikōng tànsuǒ)"),
    "la nanotecnología de vanguardia": ("la nanotechnologie de pointe", "the cutting-edge nanotechnology", "尖端纳米技术 (Jiānduān nàmǐ jìshù)"),
    "el algoritmo de cifrado": ("l'algorithme de chiffrement", "the encryption algorithm", "加密算法 (Jiāmì suànfǎ)"),
    "la patente de innovación": ("le brevet d'innovation", "the innovation patent", "创新专利 (Chuàngxīn zhuānlì)"),
    "el modelo predictivo": ("le modèle prédictif", "the predictive model", "预测模型 (Yùcè móxíng)"),
    "la investigación científica": ("la recherche scientifique", "the scientific research", "科学研究 (Kēxué yánjiū)"),
    "las tendencias exponenciales": ("les tendances exponentielles", "the exponential trends", "指数趋势 (Zhǐshù qūshì)"),
    "el desarrollo sostenible": ("le développement durable", "the sustainable development", "可持续发展 (Kěchíxù fāzhǎn)"),

    # CONTEXTOS
    "en la cocina": ("dans la cuisine", "in the kitchen", "在厨房 (Zài chúfáng)"),
    "en el hogar": ("à la maison", "at home", "在家里 (Zài jiālǐ)"),
    "con amigos": ("avec des amis", "with friends", "与朋友 (Yǔ péngyou)"),
    "por la mañana": ("le matin", "in the morning", "在早上 (Zài zǎoshang)"),
    "todos los días": ("tous les jours", "every day", "每天 (Měitiān)"),
    "con cuidado": ("avec soin", "carefully", "小心地 (Xiǎoxīnde)"),
    "en el jardín": ("dans le jardin", "in the garden", "在花园 (Zài huāyuán)"),
    "en la escuela": ("à l'école", "at school", "在学校 (Zài xuéxiào)"),
    "con alegría": ("avec joie", "joyfully", "快乐地 (Kuàilède)"),
    "en la vida diaria": ("dans la vie quotidienne", "in daily life", "在日常生活中 (Zài rìcháng shēnghuó zhōng)"),
    
    "en el aeropuerto": ("à l'aéroport", "at the airport", "在机场 (Zài jīchǎng)"),
    "en la estación": ("à la gare", "at the station", "在车站 (Zài chēzhàn)"),
    "durante el vuelo": ("pendant le vol", "during the flight", "在飞行中 (Zài fēixíng zhōng)"),
    "en el extranjero": ("à l'étranger", "abroad", "在国外 (Zài guówài)"),
    "en el hotel": ("à l'hôtel", "at the hotel", "在酒店 (Zài jiǔdiàn)"),
    "en el centro de la ciudad": ("au centre-ville", "in the city center", "在市中心 (Zài shìzhōngxīn)"),
    "con el pasaporte": ("avec le passeport", "with the passport", "配合护照 (Pèihé hùzhào)"),
    "en la playa": ("à la plage", "at the beach", "在海滩上 (Zài hǎitān shàng)"),
    "en las ruinas antiguas": ("dans les ruines antiques", "in ancient ruins", "在古遗迹中 (Zài gǔ yíjī zhōng)"),
    "con los locales": ("avec les habitants locaux", "with locals", "与当地人 (Yǔ dāngdìrén)"),
    
    "globalmente": ("globalement", "globally", "全球 (Quánqiú)"),
    "en la junta directiva": ("au conseil d'administration", "in the board of directors", "在董事会 (Zài dǒngshìhuì)"),
    "en el corto plazo": ("à court terme", "in the short term", "在短期内 (Zài duǎnqī nèi)"),
    "a nivel ejecutivo": ("au niveau exécutif", "at the executive level", "在高管层 (Zài gāoguǎncéng)"),
    "con los proveedores": ("avec les fournisseurs", "with suppliers", "与供应商 (Yǔ gōngyìngshāng)"),
    "de forma sostenible": ("de manière durable", "sustainably", "可持续地 (Kěchíxù de)"),
    "con los accionistas": ("avec les actionnaires", "with shareholders", "与股东 (Yǔ gǔdōng)"),
    "en el mercado internacional": ("sur le marché international", "in the international market", "在国际市场 (Zài guójì shìchǎng)"),
    "con eficiencia": ("efficacement", "efficiently", "高效地 (Gāoxiào de)"),
    "estratégicamente": ("stratégiquement", "strategically", "战略性地 (Zhànlüèxìng de)"),
    
    "en redes sociales": ("sur les réseaux sociaux", "on social media", "在社交媒体上 (Zài shèjiāo méitǐ shàng)"),
    "de forma orgánica": ("organiquement", "organically", "有机地 (Yǒujī de)"),
    "para motores de búsqueda": ("pour les moteurs de recherche", "for search engines", "针对搜索引擎 (Zhēnduì sōusuǒ yǐnqíng)"),
    "en el canal B2B": ("dans le canal B2B", "in the B2B channel", "在B2B渠道中 (Zài B2B qúdào zhōng)"),
    "en dispositivos móviles": ("sur les appareils mobiles", "on mobile devices", "在移动设备上 (Zài yídòng shèbèi shàng)"),
    "con influencers": ("avec des influenceurs", "with influencers", "与网红 (Yǔ wǎnghóng)"),
    "en el mercado local": ("sur le marché local", "in the local market", "在本地市场 (Zài běndì market)"),
    "para aumentar las ventas": ("pour augmenter les ventes", "to increase sales", "拉动销量 (Lādòng xiāoliàng)"),
    "de forma viral": ("de manière virale", "virally", "病毒式地 (Bìngdúshì de)"),
    
    "en el cóctel": ("au cocktail", "at the cocktail party", "在酒会上 (Zài jiǔhuì shàng)"),
    "en la convención": ("à la convention", "at the convention", "在大会上 (Zài dàhuì shàng)"),
    "con carisma": ("avec charisme", "charismatically", "充满魅力地 (Chōngmǎn mèilì de)"),
    "de manera informal": ("de manière informelle", "informally", "非正式地 (Fēi zhèngshì de)"),
    "con empatía": ("avec empathie", "empathetically", "充满同理心地 (Chōngmǎn tónglǐxīn de)"),
    "en el club social": ("au club social", "in the social club", "在俱乐部 (Zài jùlèbù)"),
    "con profesionalismo": ("avec professionnalisme", "professionally", "专业地 (Zhuānyè de)"),
    "en la mesa de honor": ("à la table d'honneur", "at the head table", "在主桌 (Zài zhǔzhuō)"),
    "con soltura": ("avec aisance", "with ease", "自如地 (Zìrú de)"),
    "en el ámbito corporativo": ("dans le milieu corporatif", "in the corporate environment", "在职场环境 (Zài zhíchǎng huánjìng)"),
    
    "frente al público": ("devant le public", "in front of the audience", "在公众面前 (Zài gōngzhòng miànqián)"),
    "en momentos de crisis": ("en temps de crise", "in times of crisis", "在危机时刻 (Zài wēijī shíkè)"),
    "con elocuencia": ("avec éloquence", "eloquently", "雄辩地 (Xióngbiàn de)"),
    "con visión de futuro": ("avec une vision prospective", "with a future vision", "有远见地 (Yǒu yuǎnjiàn de)"),
    "desde la presidencia": ("depuis la présidence", "from the presidency", "作为总裁 (Zuòwéi zǒngcái)"),
    "con integridad": ("avec intégrité", "with integrity", "正直地 (Zhèngzhí de)"),
    "en el comité ejecutivo": ("au comité exécutif", "in the executive committee", "在高管会 (Zài gāoguǎnhuì)"),
    "para inspirar confianza": ("pour inspirer confiance", "to inspire confidence", "为了启发信任 (Wèile qǐfā xìnrèn)"),
    "en la organización global": ("dans l'organisation mondiale", "in the global organization", "在全球组织内 (Zài quánqiú zǔzhī nèi)"),
    "con determinación": ("avec détermination", "with determination", "坚毅地 (Jiānyì de)"),
    
    "en el mercado global": ("sur le marché mondial", "in the global market", "在全球市场 (Zài quánqiú shìchǎng)"),
    "en la bolsa": ("en bourse", "in the stock market", "在股市 (Zài gǔshì)"),
    "para el futuro financiero": ("pour l'avenir financier", "for the financial future", "为了财务未来 (Wèile cáiwù wèilái)"),
    "con diversificación": ("avec diversification", "with diversification", "通过多元化 (Tōngguò duōyuánhuà)"),
    "en bienes raíces": ("en immobilier", "in real estate", "在房地产 (Zài fángdìchǎn)"),
    "de forma segura": ("de manière sécurisée", "safely", "安全地 (Ānquán de)"),
    "con asesoría financiera": ("avec conseil financier", "with financial advice", "通过财务咨询 (Tōngguò cáiwù zīxún)"),
    "a largo plazo": ("à long terme", "long-term", "长期 (Chángqī)"),
    "con inteligencia financiera": ("avec intelligence financière", "with financial intelligence", "理智地理财 (Lǐzhì de lǐcái)"),
    "en activos rentables": ("dans des actifs rentables", "in profitable assets", "在盈利资产中 (Zài yínglì zīchǎn zhōng)"),
    
    "con firmeza": ("avec fermeté", "firmly", "坚定地 (Jiāndìng de)"),
    "en la mesa de tratos": ("à la table des négociations", "at the deal table", "在商谈桌上 (Zài shāngtán zhuō shàng)"),
    "con diplomacia": ("avec diplomatie", "diplomatically", "有外交手腕地 (Yǒu wàijiāo shǒuwàn de)"),
    "de mutuo acuerdo": ("d'un commun accord", "by mutual agreement", "双方一致商定 (Shuāngfāng yīzhì shāngdìng)"),
    "con flexibilidad": ("avec flexibilité", "flexibly", "灵活地 (Línghuó de)"),
    "bajo términos estrictos": ("selon des conditions strictes", "under strict terms", "在严格的条款下 (Zài yángé de tiáokuǎn xià)"),
    "con éxito total": ("avec un succès total", "with complete success", "获得圆满成功 (Huòdé yuánmǎn chénggōng)"),
    "con los representantes legales": ("avec les représentants légaux", "with legal representatives", "与法务代表 (Yǔ fǎwù dàibiǎo)"),
    "con paciencia": ("avec patience", "patiently", "耐心地 (Nàixīnde)"),
    
    "con plenitud": ("pleinement", "fully", "充实地 (Chōngshí de)"),
    "en la vida cotidiana": ("dans la vie quotidienne", "in daily life", "日常生活中 (Rìcháng shēnghuó zhōng)"),
    "para reducir el estrés": ("pour réduire le stress", "to reduce stress", "缓解压力地 (Huǎnjiě yālì de)"),
    "en el centro de bienestar": ("au centre de bien-être", "in the wellness center", "在康养中心 (Zài kāngyǎng zhōngxīn)"),
    "de forma consciente": ("consciemment", "mindfully", "正念地 (Zhèngniàn de)"),
    "con equilibrio": ("avec équilibre", "balanced", "平衡地 (Pínghéng de)"),
    "en tus ratos libres": ("pendant votre temps libre", "in your free time", "在空闲时间 (Zài kòngxián shíjiān)"),
    "con elegancia": ("avec élégance", "elegantly", "优雅地 (Yōuyǎ de)"),
    "para una mente sana": ("pour un esprit sain", "for a healthy mind", "追求健康心灵 (Zhuīqiú jiànkāng xīnlíng)"),
    "en tu rutina diaria": ("dans votre routine quotidienne", "in your daily routine", "融入日课中 (Róngrù rìkè zhōng)"),
    
    "en el laboratorio": ("en laboratoire", "in the laboratory", "在实验室里 (Zài shíyànshì lǐ)"),
    "con rigor científico": ("avec rigueur scientifique", "with scientific rigor", "以科学的严谨性 (Yǐ kēxué de yánjǐnxìng)"),
    "para el futuro": ("pour l'avenir", "for the future", "为未来 (Wèi wèilái)"),
    "en la nube": ("dans le cloud", "in the cloud", "在云端 (Zài yúnduān)"),
    "con algoritmos avanzados": ("avec des algorithmes avancés", "with advanced algorithms", "通过高级算法 (Tōngguò gāojí suànfǎ)"),
    "en la industria moderna": ("dans l'industrie moderne", "in modern industry", "在现代工业中 (Zài xiàndài gōngyè zhōng)"),
    "de forma innovadora": ("de manière innovante", "innovatively", "创新地 (Chuàngxīn de)"),
    "con fines de investigación": ("à des fins de recherche", "for research purposes", "用于研究目的 (Yòngyú yánjiū mùdì)"),
    "a nivel global": ("à l'échelle mondiale", "globally", "全球性地 (Quánqiúxìng de)"),
    "en el sector tecnológico": ("dans le secteur technologique", "in the tech sector", "在科技领域 (Zài kējì lǐngyù)")
}

# --- NUEVOS POOLS C2 DE SOPORTE ADICIONAL ---
c2_pools = {
    "basics": [
        ("Epistemología abstracta", "Épistémologie abstraite", "Abstract epistemology", "抽象认识论 (Chōuxiàng rènshilùn)"),
        ("Inefabilidad ontológica", "Ineffabilité ontologique", "Ontological ineffability", "本体论不可言喻性 (Běntǐlùn bùkě yányùxìng)"),
        ("Solipsismo extremo", "Solipsisme extrême", "Extreme solipsism", "极端唯我论 (Jídān wéiwǒlùn)"),
        ("Heurística cognitiva", "Heuristique cognitive", "Cognitive heuristics", "认知启发法 (Rènzhī qǐfāfǎ)"),
        ("Dicotomía conceptual", "Dichotomie conceptuelle", "Conceptual dichotomy", "概念二分法 (Gàiniàn èrfēnfǎ)"),
        ("Axioma incuestionable", "Axiome incontestable", "Unquestionable axiom", "无可争议公理 (Wúkě zhēngyì gōnglǐ)"),
        ("Ontología analítica", "Ontologie analytique", "Analytical ontology", "分析本体论 (Fēnxī běntǐlùn)")
    ],
    "travel": [
        ("Itinerario transcontinental", "Itinéraire transcontinental", "Transcontinental itinerary", "跨洲行程表 (Kuàzhōu xíngchéngbiǎo)"),
        ("Conserjería de guante blanco", "Conciergerie haut de gamme", "White-glove concierge service", "白手套礼宾服务 (Báishǒutào lǐbīn fúwù)"),
        ("Repatriación consular", "Rapatriement consulaire", "Consular repatriation", "领事遣返 (Lǐngshì qiǎnfǎn)"),
        ("Soberanía aduanera", "Souveraineté douanière", "Customs sovereignty", "海关主权 (Hǎiguān zhǔquán)"),
        ("Excursión antropológica", "Excursion anthropologique", "Anthropological excursion", "人类学考察 (Rénlèixué kǎochá)"),
        ("Amenities personalizadas", "Prestations personnalisées", "Customized amenities", "个性化配套设施 (Gèxìnghuà pèitào shèshī)"),
        ("Desfase horario severo", "Décalage horaire sévère", "Severe jetlag", "严重时差反应 (Yánzhòng shíchā fǎnyìng)")
    ],
    "business": [
        ("Hegemonía de mercado", "Hégémonie du marché", "Market hegemony", "市场霸权 (Shìchǎng bàquán)"),
        ("Responsabilidad fiduciaria", "Responsabilité fiduciaire", "Fiduciary responsibility", "信托责任 (Xìntuō zérèn)"),
        ("Activos intangibles", "Actifs intangibles", "Intangible assets", "无形资产 (Wúxíng zīchǎn)"),
        ("Pasivos contingentes", "Passifs éventuels", "Contingent liabilities", "或有负债 (Huòyǒu fùzhài)"),
        ("Ventaja comparativa", "Avantage comparatif", "Comparative advantage", "比较优势 (Bǐjiào yōushì)"),
        ("Arbitraje financiero", "Arbitrage financier", "Financial arbitration", "金融仲裁 (Jīnróng zhòngcái)"),
        ("Tratado de libre comercio", "Accord de libre-échange", "Free trade agreement", "自由贸易协定 (Zìyóu màoyì xiétíng)")
    ],
    "marketing": [
        ("Valor de vida del cliente", "Valeur à vie du client", "Customer lifetime value", "客户终身价值 (Kèhù zhōngshēn jiàzhì)"),
        ("Costo de adquisición de cliente", "Coût d'acquisition client", "Customer acquisition cost", "客户获取成本 (Kèhù huòqǔ chênbên)"),
        ("Optimización de tasa de conversión", "Optimisation du taux de conversion", "Conversion rate optimization", "转化率优化 (Zhuānhuà lǜ yōuhuà)"),
        ("Marketing de motores de búsqueda", "Marketing par moteurs de recherche", "Search engine marketing (SEM)", "搜索引擎营销 (Sōusuǒ yǐnqíng yíngxiāo)"),
        ("Retorno de la inversión publicitaria", "Retour sur dépenses publicitaires", "Return on ad spend (ROAS)", "广告支出回报率 (Guǎnggào zhīchū huíbàolǜ)"),
        ("Mercadotecnia de guerrilla", "Guérilla marketing", "Guerrilla marketing", "游击营销 (Yóujī yíngxiāo)"),
        ("Segmentación psicográfica", "Segmentation psychographique", "Psychographic segmentation", "心理细分 (Xīnlǐ xìfēn)")
    ],
    "networking": [
        ("Reciprocidad social", "Réciprocité sociale", "Social reciprocity", "社交互惠性 (Shèjiāo hùhuìxìng)"),
        ("Guanxi interpersonal", "Guanxi interpersonnel", "Interpersonal Guanxi (networking)", "人际关系网 (Rénjì guānxìwǎng)"),
        ("Capital social acumulado", "Capital social accumulé", "Accumulated social capital", "累积社交资本 (Lěijī shèjiāo zīběn)"),
        ("Afinidad electiva", "Affinité élective", "Elective affinity", "选择性亲和力 (Xuǎnzéxìng qīnhélì)"),
        ("Cohesión comunitaria", "Cohésion communautaire", "Community cohesion", "社区凝聚力 (Shèqū níngjùlì)"),
        ("Protocolo diplomático", "Protocole diplomatique", "Diplomatic protocol", "外交礼仪 (Wàijiāo lǐyí)"),
        ("Dinámica interpersonal", "Dynamique interpersonnelle", "Interpersonal dynamics", "人际动力学 (Rénjì dònglìxué)")
    ],
    "leadership": [
        ("Gobernanza participativa", "Gouvernance participative", "Participative governance", "参与式治理 (Cānyùshì zhìlǐ)"),
        ("Autoridad pragmática", "Autorité pragmatique", "Pragmatic authority", "务实权威 (Wùshí quánwēi)"),
        ("Retórica aristotélica", "Rhétorique aristotélicienne", "Aristotelian rhetoric", "亚里士多德修辞学 (Yàlǐshìduōdé xiūcíxué)"),
        ("Pensamiento sistémico", "Pensée systémique", "Systemic thinking", "系统性思维 (Xìtǒngxì sīwéi)"),
        ("Disrupción estratégica", "Disruption stratégique", "Strategic disruption", "战略颠覆 (Zhànlüè diānfù)"),
        ("Inteligencia emocional ejecutiva", "Intelligence émotionnelle de direction", "Executive emotional intelligence", "高管情商 (Gāoguǎn qíngshāng)"),
        ("Liderazgo transformacional", "Leadership transformationnel", "Transformational leadership", "变革型领导力 (Biàngéxíng lǐngdǎolì)")
    ],
    "finance": [
        ("Diversificación del riesgo", "Diversification du risque", "Risk diversification", "风险分散 (Fēngxiǎn fēnsàn)"),
        ("Apalancamiento de capital", "Levier financier", "Financial leverage", "财务杠杆 (Cáiwù gànggān)"),
        ("Capitalización bursátil", "Capitalisation boursière", "Market capitalization", "总市值 (Zǒng shìzhí)"),
        ("Especulación financiera", "Spéculation financière", "Financial speculation", "金融投机 (Jīnróng tóujī)"),
        ("Liquidez de activos", "Liquidité des actifs", "Asset liquidity", "资产流动性 (Zīchǎn liúdòngxìng)"),
        ("Rendimiento ajustado", "Rendement ajusté", "Adjusted yield", "调整后收益率 (Tiáozhěng hòu shōuyìlǜ)"),
        ("Arbitraje de carteras", "Arbitrage de portefeuille", "Portfolio arbitrage", "组合套利 (Zǔhé tàolì)")
    ],
    "negotiation": [
        ("Acuerdo jurídicamente vinculante", "Accord juridiquement contraignant", "Legally binding agreement", "具法律约束力协议 (Jù fǎlǜ yuēshùlì xiéyì)"),
        ("Resolución alternativa", "Règlement alternatif des différends", "Alternative dispute resolution", "替代性争议解决 (Tìdàixìng zhēngyì jiějué)"),
        ("Arbitraje vinculante", "Arbitrage exécutoire", "Binding arbitration", "有约束力仲裁 (Yǒu yuēshùlì zhòngcái)"),
        ("Pacto de no divulgación", "Accord de non-divulgation (NDA)", "Non-disclosure agreement", "保密承诺书 (Bǎomì chéngnuòshū)"),
        ("Concesión estratégica", "Concession stratégique", "Strategic concession", "战略特许 (Zhànlüè tèxǔ)"),
        ("Punto de ruptura", "Point de rupture", "Breaking point", "谈判破裂点 (Tánpàn pòlièdiǎn)"),
        ("Alineación de intereses", "Alignement des intérêts", "Alignment of interests", "利益一致性 (Lìyì yīzhìxìng)")
    ],
    "lifestyle": [
        ("Gastronomía molecular", "Gastronomie moléculaire", "Molecular gastronomy", "分子美食学 (Fēnzǐ měishíxué)"),
        ("Estilo de vida holístico", "Mode de vie holistique", "Holistic lifestyle", "整体健康生活方式 (Zhěngtǐ jiànkāng shēnghuó fāngshì)"),
        ("Mindfulness contemplativo", "Pleine conscience contemplative", "Contemplative mindfulness", "沉思正念 (Chénsī zhèngniàn)"),
        ("Ocio sofisticado", "Loisirs sophistiqués", "Sophisticated leisure", "雅致休闲 (Yǎzhì xiūxián)"),
        ("Alta costura de vanguardia", "Haute couture d'avant-garde", "Avant-garde haute couture", "前沿高级定制女装 (Qiányán gāojí dìngzhì nǚzhuāng)"),
        ("Bienestar restaurativo", "Bien-être restaurateur", "Restorative wellness", "恢复性康养 (Huīfùxì kāngyǎng)"),
        ("Diseño biofílico", "Design biophilique", "Biophilic design", "亲生物设计 (Qīnshēngwù shèjì)")
    ],
    "innovation": [
        ("Singularidad tecnológica", "Singularité technologique", "Technological singularity", "技术奇点 (Jìshù qídiǎn)"),
        ("Computación cuántica", "Informatique quantique", "Quantum computing", "量子计算 (Liàngzǐ jìsuàn)"),
        ("Aprendizaje profundo", "Apprentissage profond", "Deep learning", "深度学习 (Shēndù xuéxí)"),
        ("Biotecnología recombinante", "Biotechnologie recombinante", "Recombinant biotechnology", "重组生物技术 (Chóngzǔ shēngwù jìshù)"),
        ("Nanotecnología molecular", "Nanotechnologie moléculaire", "Molecular nanotechnology", "分子纳米技术 (Fēnzǐ nàmǐ jìshù)"),
        ("Descarbonización sostenible", "Décarbonation durable", "Sustainable decarbonization", "可持续脱碳 (Kěchíxù tuōtàn)"),
        ("Automatización robótica", "Automatisation robotique", "Robotic process automation", "机器人流程自动化 (Jīqìrén liúchéng zìdònghuà)")
    ]
}

# --- DEFINICIÓN DE LOS 10 BLOQUES DE VOCABULARIO ---
CATEGORY_SPECS = [
    {
        "id": "basics",
        "title_en": "Life Essentials",
        "title_fr": "Les Bases du Quotidien",
        "title_zh": "日常基础 (Rìcháng Jīchǔ)",
        "theme_icon": "Coffee",
        "theme_color": "orange",
        "verbs": ["Comer", "Dormir", "Beber", "Caminar", "Correr", "Hablar", "Escribir", "Leer", "Comprar", "Cocinar", "Ver", "Escuchar", "Sentir", "Pensar", "Conocer"],
        "nouns": ["la manzana", "el pan", "el agua", "la casa", "la habitación", "la familia", "el amigo", "la ropa", "el coche", "el libro", "la mesa", "la silla", "el perro", "el gato", "el cuerpo"],
        "contexts": ["en la cocina", "en el hogar", "con amigos", "por la mañana", "todos los días", "con cuidado", "en el jardín", "en la escuela", "con alegría", "en la vida diaria"]
    },
    {
        "id": "travel",
        "title_en": "Global Travel",
        "title_fr": "Voyages Globaux",
        "title_zh": "全球旅行 (Quánqiú Lǚxíng)",
        "theme_icon": "Plane",
        "theme_color": "sky",
        "verbs": ["Viajar", "Reservar", "Embarcar", "Volar", "Conducir", "Explorar", "Visitar", "Navegar", "Aterrizar", "Despegar", "Facturar", "Declarar", "Comprar", "Alquilar", "Cambiar"],
        "nouns": ["el equipaje de mano", "el billete de avión", "el pasaporte vigente", "el hotel de lujo", "el itinerario de viaje", "el autobús local", "la terminal de salidas", "la aduana nacional", "el guía turístico", "la moneda extranjera", "la estación de tren", "la tarjeta de embarque", "el seguro de viaje", "el coche de alquiler", "la visa de turista"],
        "contexts": ["en el aeropuerto", "en la estación", "durante el vuelo", "en el extranjero", "en el hotel", "en el centro de la ciudad", "con el pasaporte", "en la playa", "en las ruinas antiguas", "con los locales"]
    },
    {
        "id": "business",
        "title_en": "Business & Career",
        "title_fr": "Affaires et Carrière",
        "title_zh": "商务与职业 (Shāngwù yǔ Zhíyè)",
        "theme_icon": "Briefcase",
        "theme_color": "indigo",
        "verbs": ["Optimizar", "Negociar", "Auditar", "Evaluar", "Lanzar", "Diversificar", "Monitorear", "Financiar", "Reestructurar", "Liderar", "Promover", "Reducir", "Aumentar", "Coordinar", "Adquirir"],
        "nouns": ["el presupuesto anual", "el contrato mercantil", "el flujo de caja", "el rendimiento laboral", "el riesgo corporativo", "la inversión de capital", "la ventaja competitiva", "el plan de expansión", "la eficiencia operativa", "los costos de producción", "la retención de talento", "la solvencia financiera", "las acciones bursátiles", "la cultura organizacional", "la cadena de suministro"],
        "contexts": ["globalmente", "en la junta directiva", "en el corto plazo", "a nivel ejecutivo", "con los proveedores", "de forma sostenible", "con los accionistas", "en el mercado internacional", "con eficiencia", "estratégicamente"]
    },
    {
        "id": "marketing",
        "title_en": "Marketing & Growth",
        "title_fr": "Marketing et Croissance",
        "title_zh": "营销与增长 (Yíngxiāo yǔ Zēngzhǎng)",
        "theme_icon": "Users",
        "theme_color": "emerald",
        "verbs": ["Analizar", "Optimizar", "Segmentar", "Lanzar", "Posicionar", "Fidelizar", "Promover", "Atraer", "Aumentar", "Monitorear", "Captar", "Diseñar", "Evaluar", "Habilitar", "Diferenciar"],
        "nouns": ["la campaña publicitaria", "el embudo de ventas", "el público objetivo", "la imagen de marca", "la tasa de conversión", "el alcance orgánico", "los clientes potenciales", "el contenido digital", "el tráfico web", "las palabras clave", "el presupuesto de marketing", "la presencia en redes", "la analítica web", "los testimonios de clientes", "la fidelidad a la marca"],
        "contexts": ["en redes sociales", "de forma orgánica", "para motores de búsqueda", "en el canal B2B", "en dispositivos móviles", "con influencers", "estratégicamente", "en el mercado local", "para aumentar las ventas", "de forma viral"]
    },
    {
        "id": "networking",
        "title_en": "Social & Networking",
        "title_fr": "Réseautage et Social",
        "title_zh": "人脉与社交 (Rénmài yǔ Shèjiāo)",
        "theme_icon": "MessageSquare",
        "theme_color": "pink",
        "verbs": ["Socializar", "Conversar", "Presentar", "Conectar", "Interactuar", "Dialogar", "Relacionarse", "Colaborar", "Simpatizar", "Agradecer", "Saludar", "Invitar", "Frecuentar"],
        "nouns": ["la charla informal", "el evento de networking", "la cena de negocios", "la tarjeta de presentación", "el contacto profesional", "la relación mutua", "el tema de conversación", "la etiqueta social", "el grupo de interés", "la comunidad profesional", "el respeto mutuo", "la anécdota personal", "la red de contactos", "la reunión social", "el apretón de manos"],
        "contexts": ["en el cóctel", "en la convención", "con carisma", "de manera informal", "con empatía", "en el club social", "con profesionalismo", "en la mesa de honor", "con soltura", "en el ámbito corporativo"]
    },
    {
        "id": "leadership",
        "title_en": "Executive Leadership",
        "title_fr": "Leadership Exécutif",
        "title_zh": "高管领导力 (Gāoguǎn Lǐngdǎolì)",
        "theme_icon": "Crown",
        "theme_color": "purple",
        "verbs": ["Inspirar", "Liderar", "Delegar", "Persuadir", "Motivar", "Decidir", "Dirigir", "Guiar", "Influir", "Fomentar", "Comunicar", "Planificar", "Empoderar", "Reconocer", "Unificar"],
        "nouns": ["la visión estratégica", "la toma de decisiones", "el discurso inspirador", "la oratoria elocuente", "la delegación de autoridad", "la motivación de equipos", "el rendimiento sobresaliente", "la resiliencia corporativa", "el liderazgo ético", "los objetivos de la organización", "el consenso ejecutivo", "la cultura de excelencia", "la dirección estratégica", "el impacto global", "la influencia positiva"],
        "contexts": ["frente al público", "en momentos de crisis", "con elocuencia", "con visión de futuro", "desde la presidencia", "con integridad", "en el comité ejecutivo", "para inspirar confianza", "en la organización global", "con determinación"]
    },
    {
        "id": "finance",
        "title_en": "Finance & Wealth",
        "title_fr": "Finances et Patrimoine",
        "title_zh": "金融与财富 (Jīnróng yǔ Cáifù)",
        "theme_icon": "Coins",
        "theme_color": "amber",
        "verbs": ["Invertir", "Ahorrar", "Multiplicar", "Analizar", "Diversificar", "Monetizar", "Hedgear", "Capitalizar", "Generar", "Comerciar", "Liquidar", "Prever", "Optimizar", "Monitorear", "Evaluar"],
        "nouns": ["los activos financieros", "el portafolio diversificado", "los ingresos pasivos", "el mercado bursátil", "el capital de inversión", "la tasa de interés", "la riqueza personal", "el crecimiento patrimonial", "la bolsa de valores", "los bonos del estado", "la inversión inmobiliaria", "el fondo de inversión", "las tendencias macroeconómicas", "el análisis de riesgos", "las criptomonedas avanzadas"],
        "contexts": ["en la bolsa", "para el futuro financiero", "con diversificación", "en bienes raíces", "de forma segura", "en el mercado global", "con asesoría financiera", "a largo plazo", "con inteligencia financiera", "en activos rentables"]
    },
    {
        "id": "negotiation",
        "title_en": "Negotiation & Deals",
        "title_fr": "Négociation et Affaires",
        "title_zh": "商务谈判 (Shāngwù Tánpàn)",
        "theme_icon": "Handshake",
        "theme_color": "teal",
        "verbs": ["Negociar", "Pactar", "Persuadir", "Cerrar", "Mediar", "Resolver", "Acordar", "Transigir", "Argumentar", "Proponer", "Formalizar", "Garantizar", "Alinear", "Equilibrar", "Escuchar"],
        "nouns": ["el acuerdo de beneficio mutuo", "la oferta final", "la cláusula del contrato", "la mesa de negociación", "el punto de equilibrio", "la resolución de conflictos", "el compromiso mutuo", "la objeción del cliente", "el trato comercial", "la contraoferta razonable", "la concesión estratégica", "la firma del contrato", "el pacto de confidencialidad", "los intereses alineados", "el arbitraje de disputas"],
        "contexts": ["con firmeza", "en la mesa de tratos", "con diplomacia", "de mutuo acuerdo", "con flexibilidad", "bajo términos estrictos", "con éxito total", "con los representantes legales", "con paciencia", "estratégicamente"]
    },
    {
        "id": "lifestyle",
        "title_en": "Lifestyle & Wellness",
        "title_fr": "Style de Vie et Bien-être",
        "title_zh": "生活方式与康养 (Shēnghuó Fāngshì yǔ Kāngyǎng)",
        "theme_icon": "Sparkles",
        "theme_color": "rose",
        "verbs": ["Meditar", "Ejercitar", "Nutrir", "Relajarse", "Vivir", "Disfrutar", "Cuidar", "Desconectar", "Mejorar", "Cultivar", "Fortalecer", "Embellecer", "Renovar", "Equilibrar", "Optimizar"],
        "nouns": ["la paz mental", "el estilo de vida saludable", "la nutrición equilibrada", "el entrenamiento físico", "el hábito de alto rendimiento", "la meditación diaria", "el bienestar integral", "la alta cocina (gourmet)", "la moda de lujo", "el descanso restaurador", "la rutina de spa", "el deporte al aire libre", "la salud preventiva", "el desarrollo personal", "el ocio de alta gama"],
        "contexts": ["con plenitud", "en la vida cotidiana", "para reducir el estrés", "en el centro de bienestar", "de forma consciente", "con equilibrio", "en tus ratos libres", "con elegancia", "para una mente sana", "en tu rutina diaria"]
    },
    {
        "id": "innovation",
        "title_en": "Science & AI",
        "title_fr": "Science et IA",
        "title_zh": "科学与人工智能 (Kēxué yǔ Réngōng Zhìnéng)",
        "theme_icon": "Lightbulb",
        "theme_color": "cyan",
        "verbs": ["Innovar", "Investigar", "Programar", "Automatizar", "Descubrir", "Simular", "Cifrar", "Predecir", "Revolucionar", "Patentar", "Analizar", "Optimizar", "Diseñar", "Explorar", "Desarrollar"],
        "nouns": ["la inteligencia artificial", "el aprendizaje automático", "la tecnología cuántica", "la energía renovable", "la biotecnología avanzada", "el análisis de macrodatos (big data)", "la automatización inteligente", "la exploración espacial", "la nanotecnología de vanguardia", "el algoritmo de cifrado", "la patente de innovación", "el modelo predictivo", "la investigación científica", "las tendencias exponenciales", "el desarrollo sostenible"],
        "contexts": ["en el laboratorio", "con rigor científico", "para el futuro", "en la nube", "con algoritmos avanzados", "en la industria moderna", "de forma innovadora", "con fines de investigación", "a nivel global", "en el sector tecnológico"]
    }
]

LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"]

# --- LOOP DE GENERACIÓN ---
for spec in CATEGORY_SPECS:
    category = spec["id"]
    print(f"\n📂 Generando CATEGORÍA: {category.upper()} (60 Módulos de 50 palabras)...")
    
    count_en = 0
    count_fr = 0
    count_zh = 0

    # Cargar pools originales si existen
    orig_fr = FR_DB.get(category, [])
    orig_zh = ZH_DB.get(category, [])

    # Mantener un set global para evitar duplicados en la categoría
    generated_es_words = set()

    # Si hay palabras en el pool original, registrarlas para evitar duplicados en combinaciones futuras
    for mod in orig_fr:
        for es, fr in mod:
            generated_es_words.add(es.strip().lower())

    for lvl_idx, level in enumerate(LEVELS):
        for part in range(1, 11): # 10 módulos por nivel
            module_num = (lvl_idx * 10) + part
            file_id = f"{category}_mod_{module_num:02d}"

            pairs_en = []
            pairs_fr = []
            pairs_zh = []

            # CASO A: Módulo 1-10 (A1) -> Usar pool original si existe (en basics, travel, business, marketing)
            if lvl_idx == 0 and len(orig_fr) >= 10:
                mod_idx = part - 1 # 0 a 9
                fr_data = orig_fr[mod_idx]
                zh_data = orig_zh[mod_idx]

                for i in range(min(50, len(fr_data))):
                    pair_id = f"p_{i+1:02d}"
                    es_fr, fr_val = fr_data[i]
                    es_zh, zh_val = zh_data[i]

                    en_val = translate_es_to_en(es_fr)

                    pairs_en.append({"id": pair_id, "en": en_val, "es": es_fr})
                    pairs_fr.append({"id": pair_id, "en": es_fr, "es": fr_val})
                    pairs_zh.append({"id": pair_id, "en": es_zh, "es": zh_val})

            # CASO B: Módulos 11-50 (o todos los de categorías nuevas) -> Combinatoria temática alineada al tema central
            elif lvl_idx < 5:
                random.seed(module_num + 9999 + hash(category) % 1000)
                attempts = 0
                
                while len(pairs_en) < 50 and attempts < 2000:
                    attempts += 1
                    v = random.choice(spec["verbs"])
                    n = random.choice(spec["nouns"])
                    c = random.choice(spec["contexts"])

                    es_phrase = f"{v} {n} {c}"
                    es_key = es_phrase.strip().lower()

                    if es_key not in generated_es_words:
                        generated_es_words.add(es_key)

                        # Traducir combinatoria
                        v_fr, v_en, v_zh = translations[v]
                        n_fr, n_en, n_zh = translations[n]
                        c_fr, c_en, c_zh = translations[c]

                        en_phrase = f"{v_en} {n_en} {c_en}"
                        fr_phrase = f"{v_fr} {n_fr} {c_fr}"
                        zh_phrase = f"{v_zh}{n_zh}{c_zh}"

                        pair_id = f"p_{len(pairs_en)+1:02d}"

                        pairs_en.append({"id": pair_id, "en": en_phrase, "es": es_phrase})
                        pairs_fr.append({"id": pair_id, "en": es_phrase, "es": fr_phrase})
                        pairs_zh.append({"id": pair_id, "en": es_phrase, "es": zh_phrase})

            # CASO C: Módulos 51-60 (C2) -> Pool sofisticado específico C2
            else:
                random.seed(module_num + 8888 + hash(category) % 1000)
                c2_pool = c2_pools.get(category, c2_pools["basics"])
                
                shuffled_pool = list(c2_pool)
                random.shuffle(shuffled_pool)

                # Si no es de 50, expandimos dinámicamente con combinaciones de C2
                c2_exec_verbs = ["Analizar críticamente", "Optimizar minuciosamente", "Liderar estratégicamente", "Fomentar activamente", "Coordinar formalmente"]
                
                for i in range(50):
                    pair_id = f"p_{i+1:02d}"
                    if i < len(shuffled_pool):
                        es, fr, en, zh = shuffled_pool[i]
                    else:
                        # Variación de C2 combinatoria
                        verb = c2_exec_verbs[i % len(c2_exec_verbs)]
                        base_es, base_fr, base_en, base_zh = shuffled_pool[i % len(shuffled_pool)]
                        
                        es = f"{verb} {base_es.lower()}"
                        v_en = verb.split()[0] + " " + verb.split()[1] if len(verb.split()) > 1 else verb
                        en = f"{v_en} {base_en.lower()}"
                        fr = f"{verb.split()[0]} {base_fr.lower()}"
                        zh = f"高效{base_zh}"

                    pairs_en.append({"id": pair_id, "en": en, "es": es})
                    pairs_fr.append({"id": pair_id, "en": es, "es": fr})
                    pairs_zh.append({"id": pair_id, "en": es, "es": zh})

            # Relleno de seguridad final (por si acaso colisiona y falta alguna palabra)
            fill_idx = 1
            while len(pairs_en) < 50:
                es_phrase = f"Especialidad {category} avanzada {fill_idx} {level} {part}"
                en_phrase = f"Advanced {category} specialty {fill_idx} {level} {part}"
                fr_phrase = f"Spécialité {category} avancée {fill_idx} {level} {part}"
                zh_phrase = f"高级{category}专业词汇 {fill_idx} {level} {part}"
                
                pair_id = f"p_{len(pairs_en)+1:02d}"
                pairs_en.append({"id": pair_id, "en": en_phrase, "es": es_phrase})
                pairs_fr.append({"id": pair_id, "en": es_phrase, "es": fr_phrase})
                pairs_zh.append({"id": pair_id, "en": es_phrase, "es": zh_phrase})
                fill_idx += 1

            # --- ESCRIBIR ARCHIVOS JSON ---
            
            # 1. INGLÉS (Por defecto)
            lesson_en = {
                "id": file_id,
                "category_id": category,
                "title": f"{spec['title_en']} • {level} - Part {part}",
                "description": f"Master executive vocabulary. Level {level}, Module {part} of 10.",
                "level": level,
                "part": part,
                "total_xp": 100 + (lvl_idx * 50),
                "status": "locked",
                "theme": {"icon": spec["theme_icon"], "color": spec["theme_color"]},
                "stages": [
                    {
                        "id": f"drill_{file_id}",
                        "type": "pairing_drill",
                        "title": f"Neuro Link: {level} Vocabulary",
                        "description": "Interactive pairing association.",
                        "pairs": pairs_en
                    }
                ]
            }
            with open(f"{OUTPUT_DIR}/{file_id}.json", "w", encoding="utf-8") as f:
                json.dump(lesson_en, f, indent=2, ensure_ascii=False)
            count_en += 1
            
            # 2. FRANCÉS (fr)
            lesson_fr = {
                "id": file_id,
                "category_id": category,
                "title": f"{spec['title_fr']} • {level} - Part {part}",
                "description": f"Dominio de vocabulario de {spec['title_fr']}. Nivel {level}, Módulo {part} de 10.",
                "level": level,
                "part": part,
                "total_xp": 100 + (lvl_idx * 50),
                "status": "locked",
                "theme": {"icon": spec["theme_icon"], "color": spec["theme_color"]},
                "stages": [
                    {
                        "id": f"drill_{file_id}",
                        "type": "pairing_drill",
                        "title": f"Neuro Link: Vocabulaire {level}",
                        "description": "Asociación rápida e inteligente de conceptos.",
                        "pairs": pairs_fr
                    }
                ]
            }
            with open(f"{OUTPUT_FR_DIR}/{file_id}.json", "w", encoding="utf-8") as f:
                json.dump(lesson_fr, f, indent=2, ensure_ascii=False)
            count_fr += 1

            # 3. CHINO (zh)
            lesson_zh = {
                "id": file_id,
                "category_id": category,
                "title": f"{spec['title_zh']} • {level} - Part {part}",
                "description": f"{spec['title_zh']} 大师. Nivel {level}, Módulo {part} de 10.",
                "level": level,
                "part": part,
                "total_xp": 100 + (lvl_idx * 50),
                "status": "locked",
                "theme": {"icon": spec["theme_icon"], "color": spec["theme_color"]},
                "stages": [
                    {
                        "id": f"drill_{file_id}",
                        "type": "pairing_drill",
                        "title": f"Neuro Link: 词汇训练 {level}",
                        "description": "快速联想记忆卡片.",
                        "pairs": pairs_zh
                    }
                ]
            }
            with open(f"{OUTPUT_ZH_DIR}/{file_id}.json", "w", encoding="utf-8") as f:
                json.dump(lesson_zh, f, indent=2, ensure_ascii=False)
            count_zh += 1

    print(f"✅ CATEGORÍA COMPLETADA: {category.upper()} -> {count_en} en, {count_fr} fr, {count_zh} zh.")

print("\n✨ TODOS LOS 10 BLOQUES DE VOCABULARIO CON 60 MÓDULOS DE 50 PALABRAS SE HAN GENERADO CORRECTAMENTE EN INGLÉS, FRANCÉS Y CHINO! ✨")
