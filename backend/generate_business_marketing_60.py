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

print("🚀 Iniciando Generador Maestro de Vocabulario (Business y Marketing 60)...")

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

# --- MAPEO DE ESPAÑOL A INGLÉS COMÚN ---
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
    # Fallback si no encuentra
    return cleaned

# --- SEMILLAS PARA COMBINATORIA MÓDULOS 11 A 60 ---

# 1. BANCO SEMILLA BUSINESS
biz_verbs = ["Optimizar", "Negociar", "Auditar", "Evaluar", "Lanzar", "Diversificar", "Monitorear", "Financiar", "Reestructurar", "Liderar", "Promover", "Reducir", "Aumentar", "Coordinar", "Adquirir"]
biz_nouns = ["el presupuesto", "el contrato", "el flujo de caja", "el rendimiento", "el riesgo corporativo", "la inversión", "la ventaja competitiva", "el plan de expansión", "la eficiencia operativa", "los costos de producción", "la retención de talento", "la solvencia financiera", "las acciones bursátiles", "la cultura organizacional", "la cadena de suministro"]
biz_contexts = ["globalmente", "en la junta directiva", "en el corto plazo", "a nivel ejecutivo", "con los proveedores", "de forma sostenible", "con los accionistas", "en el mercado internacional", "con eficiencia", "estratégicamente"]

# 2. BANCO SEMILLA MARKETING
mkt_verbs = ["Analizar", "Optimizar", "Segmentar", "Lanzar", "Posicionar", "Fidelizar", "Promover", "Atraer", "Aumentar", "Monitorear", "Captar", "Diseñar", "Evaluar", "Habilitar", "Diferenciar"]
mkt_nouns = ["la campaña publicitaria", "el embudo de ventas", "el público objetivo", "la imagen de marca", "la tasa de conversión", "el alcance orgánico", "los clientes potenciales", "el contenido digital", "el tráfico web", "las palabras clave", "el presupuesto de marketing", "la presencia en redes", "la analítica web", "los testimonios de clientes", "la fidelidad a la marca"]
mkt_contexts = ["en redes sociales", "de forma orgánica", "para motores de búsqueda", "en el canal B2B", "en dispositivos móviles", "con influencers", "estratégicamente", "en el mercado local", "para aumentar las ventas", "de forma viral"]

# 3. TRADUCCIONES DE PALABRAS DE SOPORTE COMBINADAS (FRANCÉS Y CHINO)
verb_translations = {
    # Verbos Negocios
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
    "Promover": ("Promouvoir", "Promote", "晋升 (Jìnshēng)"),
    "Reducir": ("Réduire", "Reduce", "降低 (Jiàngdī)"),
    "Aumentar": ("Augmenter", "Increase", "增加 (Zēngjiā)"),
    "Coordinar": ("Coordonner", "Coordinate", "协调 (Xiétiáo)"),
    "Adquirir": ("Acquérir", "Acquire", "收购 (Shōugòu)"),
    
    # Verbos Marketing
    "Analizar": ("Analyser", "Analyze", "分析 (Fēnxī)"),
    "Segmentar": ("Segmenter", "Segment", "细分 (Xìfēn)"),
    "Posicionar": ("Positionner", "Position", "定位 (Dìngwèi)"),
    "Fidelizar": ("Fidéliser", "Retain", "留住 (Liúzhù)"),
    "Atraer": ("Attirer", "Attract", "吸引 (Xīyǐn)"),
    "Captar": ("Capter", "Acquire / Capture", "获客 (Huòkè)"),
    "Diseñar": ("Concevoir", "Design", "设计 (Shèjì)"),
    "Habilitar": ("Activer", "Enable", "启用 (Qǐyòng)"),
    "Diferenciar": ("Différencier", "Differentiate", "区分 (Qūfēn)")
}

noun_translations = {
    # Sustantivos Negocios
    "el presupuesto": ("le budget", "the budget", "预算 (Yùsuàn)"),
    "el contrato": ("le contrat", "the contract", "合同 (Hétóng)"),
    "el flujo de caja": ("le flux de trésorerie", "the cash flow", "现金流 (Xiànjīnliú)"),
    "el rendimiento": ("la performance", "the performance", "业绩 (Yèjī)"),
    "el riesgo corporativo": ("le risque d'entreprise", "the corporate risk", "企业风险 (Qǐyè fēngxiǎn)"),
    "la inversión": ("l'investissement", "the investment", "投资 (Tóuzī)"),
    "la ventaja competitiva": ("l'avantage concurrentiel", "the competitive advantage", "竞争优势 (Jìngzhēng yōushì)"),
    "el plan de expansión": ("le plan d'expansion", "the expansion plan", "扩张计划 (Kuòzhāng jìhuà)"),
    "la eficiencia operativa": ("l'efficacité opérationnelle", "the operational efficiency", "运营效率 (Yùnyíng xiàolǜ)"),
    "los costos de producción": ("les coûts de production", "the production costs", "生产成本 (Shēngchǎn chéngběn)"),
    "la retención de talento": ("la rétention des talents", "the talent retention", "人才留存 (Réncái liúcún)"),
    "la solvencia financiera": ("la solvabilité financière", "the financial solvency", "财务偿债能力 (Cáiwù chángzhài nénglì)"),
    "las acciones bursátiles": ("les actions en bourse", "the stock shares", "股票份额 (Gǔpiào fèn'é)"),
    "la cultura organizacional": ("la culture organisationnelle", "the organizational culture", "组织文化 (Zǔzhī wénhuà)"),
    "la cadena de suministro": ("la chaîne d'approvisionnement", "the supply chain", "供应链 (Gōngyìngliàn)"),
    
    # Sustantivos Marketing
    "la campaña publicitaria": ("la campagne publicitaire", "the advertising campaign", "广告活动 (Guǎnggào huódòng)"),
    "el embudo de ventas": ("le tunnel de vente", "the sales funnel", "销售渠道 (Xiāoshòu qúdào)"),
    "el público objetivo": ("le public cible", "the target audience", "目标受众 (Mùbiāo shòuzhòng)"),
    "la imagen de marca": ("l'image de marque", "the brand image", "品牌形象 (Pǐnpái xíngxiàng)"),
    "la tasa de conversión": ("le taux de conversion", "the conversion rate", "转化率 (Zhuǎnhuà lǜ)"),
    "el alcance orgánico": ("la portée organique", "the organic reach", "有机触达 (Yǒujī chùdá)"),
    "los clientes potenciales": ("les clients potentiels / leads", "the potential clients / leads", "潜在客户 (Qiánzài kèhù)"),
    "el contenido digital": ("le contenu numérique", "the digital content", "数字内容 (Shùzì nèiróng)"),
    "el tráfico web": ("le trafic web", "the web traffic", "网站流量 (Wǎngzhàn liúliàng)"),
    "las palabras clave": ("les mots-clés", "the keywords", "关键词 (Guānjiàncí)"),
    "el presupuesto de marketing": ("le budget marketing", "the marketing budget", "营销预算 (Yíngxiāo yùsuàn)"),
    "la presencia en redes": ("la présence sur les réseaux", "the social media presence", "社媒存在感 (Shèméi cúnzàigǎn)"),
    "la analítica web": ("l'analyse web", "the web analytics", "网站分析 (Wǎngzhàn fēnxī)"),
    "los testimonios de clientes": ("les témoignages clients", "the customer testimonials", "客户证言 (Kèhù zhèngyán)"),
    "la fidelidad a la marca": ("la fidélité à la marque", "the brand loyalty", "品牌忠诚度 (Pǐnpái zhōngchéngdù)")
}

context_translations = {
    # Contextos Negocios
    "globalmente": ("globalement", "globally", "全球 (Quánqiú)"),
    "en la junta directiva": ("au conseil d'administration", "in the board of directors", "在董事会 (Zài dǒngshìhuì)"),
    "en el corto plazo": ("à court terme", "in the short term", "在短期内 (Zài duǎnqī nèi)"),
    "a nivel ejecutivo": ("au niveau exécutif", "at the executive level", "在执行层面 (Zài zhíxíng céngmiàn)"),
    "con los proveedores": ("avec les fournisseurs", "with suppliers", "与供应商 (Yǔ gōngyìngshāng)"),
    "de forma sostenible": ("de manière durable", "sustainably", "可持续地 (Kěchíxù de)"),
    "con los accionistas": ("avec les actionnaires", "with shareholders", "与股东 (Yǔ gǔdōng)"),
    "en el mercado internacional": ("sur le marché international", "in the international market", "在国际市场 (Zài guójì shìchǎng)"),
    "con eficiencia": ("efficacement", "efficiently", "高效地 (Gāoxiào de)"),
    "estratégicamente": ("stratégiquement", "strategically", "战略性地 (Zhànlüèxìng de)"),
    
    # Contextos Marketing
    "en redes sociales": ("sur les réseaux sociaux", "on social media", "在社交媒体上 (Zài shèjiāo méitǐ shàng)"),
    "de forma orgánica": ("organiquement", "organically", "有机地 (Yǒujī de)"),
    "para motores de búsqueda": ("pour les moteurs de recherche", "for search engines", "针对搜索引擎 (Zhēnduì sōusuǒ yǐnqíng)"),
    "en el canal B2B": ("dans le secteur B2B", "in the B2B channel", "在B2B渠道中 (Zài B2B qúdào zhōng)"),
    "en dispositivos móviles": ("sur les appareils mobiles", "on mobile devices", "在移动设备上 (Zài yídòng shèbèi shàng)"),
    "con influencers": ("avec des influenceurs", "with influencers", "与网红合作 (Yǔ wǎnghóng hézuò)"),
    "en el mercado local": ("sur le marché local", "in the local market", "在本地市场 (Zài běndì shìchǎng)"),
    "para aumentar las ventas": ("pour augmenter les ventes", "to increase sales", "旨在增加销量 (Zhǐzài zēngjiā xiāoliàng)"),
    "de forma viral": ("de manière virale", "virally", "病毒式传播 (Bìngdú shì chuánbō)")
}

# --- C2 AVANZADOS (BUSINESS Y MARKETING) ---
c2_business_pool = [
    ("Hegemonía de mercado", "Hégémonie du marché", "Market hegemony", "市场霸权 (Shìchǎng bàquán)"),
    ("Responsabilidad fiduciaria", "Responsabilité fiduciaire", "Fiduciary responsibility", "信托责任 (Xìntuō zérèn)"),
    ("Activos intangibles", "Actifs intangibles", "Intangible assets", "无形资产 (Wúxíng zīchǎn)"),
    ("Pasivos contingentes", "Passifs éventuels", "Contingent liabilities", "或有负债 (Huòyǒu fùzhài)"),
    ("Ventaja comparativa", "Avantage comparatif", "Comparative advantage", "比较优势 (Bǐjiào yōushì)"),
    ("Arbitraje financiero", "Arbitrage financier", "Financial arbitration", "金融仲裁 (Jīnróng zhòngcái)"),
    ("Tratado de libre comercio", "Accord de libre-échange", "Free trade agreement", "自由贸易协定 (Zìyóu màoyì xiétíng)"),
    ("Junta general de accionistas", "Assemblée générale des actionnaires", "General meeting of shareholders", "股东周年大会 (Gǔdōng zhōunián dàhuì)"),
    ("Especulación bursátil", "Spéculation boursière", "Stock speculation", "股票投机 (Gǔpiào tóujī)"),
    ("Políticas proteccionistas", "Politiques protectionnistes", "Protectionist policies", "保护主义政策 (Bǎohù zhǔyì zhèngcè)"),
    ("Monopolio bilateral", "Monopole bilatéral", "Bilateral monopoly", "双边垄断 (Shuāngbiān lǒngduàn)"),
    ("Devaluación monetaria", "Dévaluation monétaire", "Currency devaluation", "货币贬值 (Huòbì biǎnzhí)"),
    ("Tasa interna de retorno", "Taux de rentabilité interne", "Internal rate of return", "内部收益率 (Nèibù shōuyìlǜ)"),
    ("Subsidio gubernamental", "Subvention gouvernementale", "Government subsidy", "政府补贴 (Zhèngfǔ bǔtiē)"),
    ("Déficit presupuestario", "Déficit budgétaire", "Budget deficit", "预算赤字 (Yùsuàn chìzì)"),
    ("Superávit comercial", "Excédent commercial", "Trade surplus", "贸易顺差 (Màoyì shùnchā)"),
    ("Amortización acelerada", "Amortissement accéléré", "Accelerated amortization", "加速折旧 (Jiāsù zhéjiù)"),
    ("Apalancamiento financiero", "Levier financier", "Financial leverage", "财务杠杆 (Cáiwù gànggān)"),
    ("Capitalización de mercado", "Capitalisation boursière", "Market capitalization", "市值 (Shìzhí)"),
    ("Gobernanza corporativa", "Gouvernance d'entreprise", "Corporate governance", "公司治理 (Gōngsī zhìlǐ)")
]

c2_marketing_pool = [
    ("Costeo basado en actividades", "Coût par activité", "Activity-based costing", "作业成本法 (Zuòyè chéngběn fǎ)"),
    ("Valor de vida del cliente", "Valeur à vie du client", "Customer lifetime value", "客户终身价值 (Kèhù zhōngshēn jiàzhì)"),
    ("Costo de adquisición de cliente", "Coût d'acquisition client", "Customer acquisition cost", "客户获取成本 (Kèhù huòqǔ chéngbên)"),
    ("Pruebas divididas A/B", "Tests A/B fractionnés", "A/B split testing", "A/B分流测试 (A/B fēnliú cèshì)"),
    ("Optimización de tasa de conversión", "Optimisation du taux de conversion", "Conversion rate optimization", "转化率优化 (Zhuānhuà lǜ yōuhuà)"),
    ("Posicionamiento orgánico en buscadores", "Référencement naturel (SEO)", "Search engine optimization (SEO)", "搜索引擎优化 (Sōusuǒ yǐnqíng yōuhuà)"),
    ("Marketing de motores de búsqueda", "Marketing par moteurs de recherche", "Search engine marketing (SEM)", "搜索引擎营销 (Sōusuǒ yǐnqíng yíngxiāo)"),
    ("Retorno de la inversión publicitaria", "Retour sur dépenses publicitaires", "Return on ad spend (ROAS)", "广告支出回报率 (Guǎnggào zhīchū huíbàolǜ)"),
    ("Mercadotecnia de guerrilla", "Guérilla marketing", "Guerrilla marketing", "游击营销 (Yóujī yíngxiāo)"),
    ("Segmentación psicográfica", "Segmentation psychographique", "Psychographic segmentation", "心理细分 (Xīnlǐ xìfēn)"),
    ("Análisis de embudo multinivel", "Analyse d'entonnoir multiniveau", "Multilevel funnel analysis", "多层漏斗分析 (Duōcéng lòudǒu fēnxī)"),
    ("Compromiso hiper-personalizado", "Engagement hyper-personnalisé", "Hyper-personalized engagement", "超个性化互动 (Chāo gèxìnghuà hùdòng)"),
    ("Mercadotecnia omnicanal", "Marketing omnicanal", "Omnichannel marketing", "全渠道营销 (Quán qúdào yíngxiāo)"),
    ("Atribución multitáctil", "Attribution tactile multiple", "Multi-touch attribution", "多触点归因 (Duō chùdiǎn guīyīn)"),
    ("Estrategia de penetración de mercado", "Stratégie de pénétration du marché", "Market penetration strategy", "市场渗透策略 (Shìchǎng shèntòu cèlüè)"),
    ("Publicidad nativa programática", "Publicité native programmatique", "Programmatic native advertising", "程序化原生广告 (Chéngxùhuà yuánshēng guǎnggào)"),
    ("Tasa de abandono de carrito", "Taux d'abandon de panier", "Cart abandonment rate", "购物车 abandonment 率 (Gòuwùchē fàngqì lǜ)"),
    ("Defensa de la marca del consumidor", "Défense de la marque par le consommateur", "Consumer brand advocacy", "消费者品牌拥护 (Xiāofèizhě pǐnpái yōnghù)"),
    ("Marketing basado en cuentas", "Marketing basé sur les comptes", "Account-based marketing", "基于账户的营销 (Jīyú zhànghù de yíngxiāo)"),
    ("Sindicación de contenido premium", "Syndication de contenu premium", "Premium content syndication", "优质内容联合发布 (Yōuzhì nèiróng liánhé fābù)")
]

LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"]

# --- FUNCIÓN DE GENERACIÓN ---
def generate_industry_60(category, title_en, title_fr, title_zh, seeds_verbs, seeds_nouns, seeds_contexts, c2_pool):
    print(f"\n📂 Generando {category.upper()} (60 Módulos de 50 palabras)...")
    count_en = 0
    count_fr = 0
    count_zh = 0

    # Cargar datos del pool original
    orig_fr = FR_DB.get(category, []) # Lista de 10 módulos de 50 palabras
    orig_zh = ZH_DB.get(category, [])

    # Para evitar repetidos a nivel general dentro de la categoría
    generated_es_words = set()

    # Primero registramos las palabras originales del pool para evitar duplicarlas después
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

            # CASO A: Primeros 10 módulos (A1) -> Usamos los 10 módulos del pool original de FR y ZH
            if lvl_idx == 0:
                mod_idx = part - 1 # 0 a 9
                fr_data = orig_fr[mod_idx] if mod_idx < len(orig_fr) else []
                zh_data = orig_zh[mod_idx] if mod_idx < len(orig_zh) else []

                # Fallback por seguridad
                while len(fr_data) < 50:
                    fr_data.append(("Especialidad", "Spécialité"))
                while len(zh_data) < 50:
                    zh_data.append(("Especialidad", "专业 (Zhuānyè)"))

                for i in range(50):
                    pair_id = f"p_{i+1:02d}"
                    es_fr, fr_val = fr_data[i]
                    es_zh, zh_val = zh_data[i]

                    en_val = translate_es_to_en(es_fr)

                    pairs_en.append({"id": pair_id, "en": en_val, "es": es_fr})
                    pairs_fr.append({"id": pair_id, "en": es_fr, "es": fr_val})
                    pairs_zh.append({"id": pair_id, "en": es_zh, "es": zh_val})

            # CASO B: Módulos 11 a 50 (A2, B1, B2, C1) -> Generación combinatoria única
            elif lvl_idx < 5:
                random.seed(module_num + 999) # Semilla consistente
                attempts = 0
                
                while len(pairs_en) < 50 and attempts < 1000:
                    attempts += 1
                    # Elegimos verbo, sustantivo y contexto al azar
                    v = random.choice(seeds_verbs)
                    n = random.choice(seeds_nouns)
                    c = random.choice(seeds_contexts)

                    es_phrase = f"{v} {n} {c}"
                    es_key = es_phrase.strip().lower()

                    # Comprobamos que no se haya usado nunca
                    if es_key not in generated_es_words:
                        generated_es_words.add(es_key)

                        # Traducir combinatoria
                        v_fr, v_en, v_zh = verb_translations[v]
                        n_fr, n_en, n_zh = noun_translations[n]
                        c_fr, c_en, c_zh = context_translations[c]

                        # Construir traducciones
                        en_phrase = f"{v_en} {n_en} {c_en}"
                        
                        # Francés requiere ajustar preposiciones o minúsculas básico
                        fr_phrase = f"{v_fr} {n_fr} {c_fr}"
                        
                        # Chino es directo sin espacios
                        zh_phrase = f"{v_zh}{n_zh}{c_zh}"

                        pair_id = f"p_{len(pairs_en)+1:02d}"

                        pairs_en.append({"id": pair_id, "en": en_phrase, "es": es_phrase})
                        pairs_fr.append({"id": pair_id, "en": es_phrase, "es": fr_phrase})
                        pairs_zh.append({"id": pair_id, "en": es_phrase, "es": zh_phrase})

                # Si por alguna razón de colisión no llega a 50, rellenamos con términos fijos garantizando unicidad
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

            # CASO C: Módulos 51 a 60 (C2) -> Se generan a partir del c2_pool avanzado de forma única
            else:
                random.seed(module_num + 888)
                shuffled_pool = list(c2_pool)
                random.shuffle(shuffled_pool)

                # Expandir pool por duplicación segura con variaciones
                extended_pool = []
                for idx, item in enumerate(shuffled_pool):
                    extended_pool.append(item)
                
                # Crear variantes de C2 para llegar a 50 únicas por bloque
                # Combinamos con verbos ejecutivos de C2
                c2_verbs = ["Analizar meticulosamente", "Evaluar críticamente", "Optimizar estratégicamente", "Negociar formalmente", "Auditar rigurosamente"]
                for i in range(50):
                    pair_id = f"p_{i+1:02d}"
                    if i < len(extended_pool):
                        es, fr, en, zh = extended_pool[i]
                    else:
                        # Crear combinación avanzada de C2
                        verb = c2_verbs[i % len(c2_verbs)]
                        base_es, base_fr, base_en, base_zh = extended_pool[i % len(extended_pool)]
                        
                        es = f"{verb} {base_es.lower()}"
                        
                        v_en = verb.split()[0] + " " + verb.split()[1] if len(verb.split()) > 1 else verb
                        en = f"{v_en} {base_en.lower()}"
                        fr = f"{verb.split()[0]} {base_fr.lower()}"
                        zh = f"严谨{base_zh}"

                    pairs_en.append({"id": pair_id, "en": en, "es": es})
                    pairs_fr.append({"id": pair_id, "en": es, "es": fr})
                    pairs_zh.append({"id": pair_id, "en": es, "es": zh})

            # --- ESCRIBIR ARCHIVOS JSON ---
            
            # 1. INGLÉS (Por defecto)
            lesson_en = {
                "id": file_id,
                "category_id": category,
                "title": f"{title_en} • {level} - Part {part}",
                "description": f"Master executive vocabulary. Level {level}, Module {part} of 10.",
                "level": level,
                "part": part,
                "total_xp": 100 + (lvl_idx * 50),
                "status": "locked",
                "theme": {"icon": "Briefcase" if category == "business" else "TrendingUp", "color": "indigo" if category == "business" else "emerald"},
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
                "title": f"{title_fr} • {level} - Part {part}",
                "description": f"Dominio de vocabulario de {title_fr}. Nivel {level}, Módulo {part} de 10.",
                "level": level,
                "part": part,
                "total_xp": 100 + (lvl_idx * 50),
                "status": "locked",
                "theme": {"icon": "Briefcase" if category == "business" else "TrendingUp", "color": "indigo" if category == "business" else "emerald"},
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
                "title": f"{title_zh} • {level} - Part {part}",
                "description": f"{title_zh}大师. Nivel {level}, Módulo {part} de 10.",
                "level": level,
                "part": part,
                "total_xp": 100 + (lvl_idx * 50),
                "status": "locked",
                "theme": {"icon": "Briefcase" if category == "business" else "TrendingUp", "color": "indigo" if category == "business" else "emerald"},
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

    print(f"✅ {category.upper()} COMPLETADO: {count_en} en, {count_fr} fr, {count_zh} zh.")

# --- GENERAR BUSINESS Y MARKETING ---
generate_industry_60(
    category="business",
    title_en="Business & Career",
    title_fr="Affaires et Carrière",
    title_zh="商务与职业 (Shāngwù yǔ Zhíyè)",
    seeds_verbs=biz_verbs,
    seeds_nouns=biz_nouns,
    seeds_contexts=biz_contexts,
    c2_pool=c2_business_pool
)

generate_industry_60(
    category="marketing",
    title_en="Marketing & Growth",
    title_fr="Marketing et Croissance",
    title_zh="营销与增长 (Yíngxiāo yǔ Zēngzhǎng)",
    seeds_verbs=mkt_verbs,
    seeds_nouns=mkt_nouns,
    seeds_contexts=mkt_contexts,
    c2_pool=c2_marketing_pool
)

print("\n✨ TODOS LOS MÓDULOS DE BUSINESS Y MARKETING SE HAN GENERADO CORRECTAMENTE! ✨")
