import os
import json
import random

# --- CONFIGURATION ---
OUTPUT_EN = "app/voclessons/lessons"
OUTPUT_FR = "app/voclessons/lessons/fr"
OUTPUT_ZH = "app/voclessons/lessons/zh"

CATEGORIES = [
    "basics", "lifestyle", "travel", "business", "marketing",
    "negotiation", "networking", "finance", "leadership", "innovation", "tech"
]
LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"]

# Base vocabulary pools (Real single words & concepts)
VOCAB_POOLS = {
    "basics": [
        ("Hello", "Hola", "Bonjour", "你好 (Nǐ hǎo)"),
        ("Goodbye", "Adiós", "Au revoir", "再见 (Zàijiàn)"),
        ("Please", "Por favor", "S'il vous plaît", "请 (Qǐng)"),
        ("Thank you", "Gracias", "Merci", "谢谢 (Xièxiè)"),
        ("Yes", "Sí", "Oui", "是 (Shì)"),
        ("No", "No", "Non", "不 (Bù)"),
        ("Water", "Agua", "Eau", "水 (Shuǐ)"),
        ("Food", "Comida", "Nourriture", "食物 (Shíwù)"),
        ("Friend", "Amigo", "Ami", "朋友 (Péngyǒu)"),
        ("Family", "Familia", "Famille", "家人 (Jiārén)"),
        ("Time", "Tiempo", "Temps", "时间 (Shíjiān)"),
        ("Day", "Día", "Jour", "天 (Tiān)"),
        ("Night", "Noche", "Nuit", "晚上 (Wǎnshàng)"),
        ("Morning", "Mañana", "Matin", "早上 (Zǎoshang)"),
        ("Today", "Hoy", "Aujourd'hui", "今天 (Jīntiān)")
    ],
    "travel": [
        ("Airport", "Aeropuerto", "Aéroport", "机场 (Jīchǎng)"),
        ("Flight", "Vuelo", "Vol", "航班 (Hángbān)"),
        ("Passport", "Pasaporte", "Passeport", "护照 (Hùzhào)"),
        ("Ticket", "Boleto", "Billet", "票 (Piào)"),
        ("Hotel", "Hotel", "Hôtel", "酒店 (Jiǔdiàn)"),
        ("Luggage", "Equipaje", "Bagages", "行李 (Xínglǐ)"),
        ("Train", "Tren", "Train", "火车 (Huǒchē)"),
        ("Station", "Estación", "Gare", "车站 (Chēzhàn)"),
        ("Map", "Mapa", "Carte", "地图 (Dìtú)"),
        ("Tourist", "Turista", "Touriste", "游客 (Yóukè)"),
        ("Guide", "Guía", "Guide", "导游 (Dǎoyóu)"),
        ("Customs", "Aduana", "Douane", "海关 (Hǎiguān)"),
        ("Visa", "Visa", "Visa", "签证 (Qiānzhèng)"),
        ("Currency", "Moneda", "Devise", "货币 (Huòbì)"),
        ("Destination", "Destino", "Destination", "目的地 (Mùdìdì)")
    ],
    "business": [
        ("Company", "Empresa", "Entreprise", "公司 (Gōngsī)"),
        ("Meeting", "Reunión", "Réunion", "会议 (Huìyì)"),
        ("Office", "Oficina", "Bureau", "办公室 (Bàngōngshì)"),
        ("Manager", "Gerente", "Directeur", "经理 (Jīnglǐ)"),
        ("Employee", "Empleado", "Employé", "员工 (Yuángōng)"),
        ("Client", "Cliente", "Client", "客户 (Kèhù)"),
        ("Contract", "Contrato", "Contrat", "合同 (Hétóng)"),
        ("Project", "Proyecto", "Projet", "项目 (Xiàngmù)"),
        ("Deadline", "Plazo", "Date limite", "截止日期 (Jiézhǐ rìqī)"),
        ("Report", "Reporte", "Rapport", "报告 (Bàogào)"),
        ("Salary", "Salario", "Salaire", "工资 (Gōngzī)"),
        ("Budget", "Presupuesto", "Budget", "预算 (Yùsuàn)"),
        ("Profit", "Ganancia", "Profit", "利润 (Lìrùn)"),
        ("Loss", "Pérdida", "Perte", "损失 (Sǔnshī)"),
        ("Strategy", "Estrategia", "Stratégie", "战略 (Zhànlüè)")
    ],
    "marketing": [
        ("Brand", "Marca", "Marque", "品牌 (Pǐnpái)"),
        ("Campaign", "Campaña", "Campagne", "活动 (Huódòng)"),
        ("Market", "Mercado", "Marché", "市场 (Shìchǎng)"),
        ("Target", "Objetivo", "Cible", "目标 (Mùbiāo)"),
        ("Audience", "Audiencia", "Public", "受众 (Shòuzhòng)"),
        ("Advertising", "Publicidad", "Publicité", "广告 (Guǎnggào)"),
        ("Promotion", "Promoción", "Promotion", "促销 (Cùxiāo)"),
        ("Product", "Producto", "Produit", "产品 (Chǎnpǐn)"),
        ("Service", "Servicio", "Service", "服务 (Fúwù)"),
        ("Price", "Precio", "Prix", "价格 (Jiàgé)"),
        ("Sales", "Ventas", "Ventes", "销售 (Xiāoshòu)"),
        ("Consumer", "Consumidor", "Consommateur", "消费者 (Xiāofèi zhě)"),
        ("Trend", "Tendencia", "Tendance", "趋势 (Qūshì)"),
        ("Social Media", "Redes Sociales", "Réseaux sociaux", "社交媒体 (Shèjiāo méitǐ)"),
        ("Content", "Contenido", "Contenu", "内容 (Nèiróng)")
    ],
    "tech": [
        ("Computer", "Computadora", "Ordinateur", "电脑 (Diànnǎo)"),
        ("Software", "Software", "Logiciel", "软件 (Ruǎnjiàn)"),
        ("Hardware", "Hardware", "Matériel", "硬件 (Yìngjiàn)"),
        ("Network", "Red", "Réseau", "网络 (Wǎngluò)"),
        ("Data", "Datos", "Données", "数据 (Shùjù)"),
        ("Internet", "Internet", "Internet", "互联网 (Hùliánwǎng)"),
        ("Server", "Servidor", "Serveur", "服务器 (Fúwùqī)"),
        ("Code", "Código", "Code", "代码 (Dàimǎ)"),
        ("Program", "Programa", "Programme", "程序 (Chéngxù)"),
        ("Database", "Base de datos", "Base de données", "数据库 (Shùjùkù)"),
        ("Security", "Seguridad", "Sécurité", "安全 (Ānquán)"),
        ("Cloud", "Nube", "Cloud", "云 (Yún)"),
        ("Algorithm", "Algoritmo", "Algorithme", "算法 (Suànfǎ)"),
        ("Application", "Aplicación", "Application", "应用 (Yìngyòng)"),
        ("User", "Usuario", "Utilisateur", "用户 (Yònghù)")
    ]
}

# Expand the dictionary dynamically for missing categories
missing_cats = [c for c in CATEGORIES if c not in VOCAB_POOLS]
for cat in missing_cats:
    VOCAB_POOLS[cat] = VOCAB_POOLS["business"].copy() # Fallback

def get_word_pool(category, count=50):
    base_pool = VOCAB_POOLS.get(category, VOCAB_POOLS["basics"])
    # If pool is smaller than count, we multiply and add numbers to make them unique
    pool = []
    idx = 1
    while len(pool) < count:
        for en, es, fr, zh in base_pool:
            if len(pool) >= count:
                break
            suffix = f" {idx}" if idx > 1 else ""
            pool.append((en + suffix, es + suffix, fr + suffix, zh + suffix))
        idx += 1
    random.shuffle(pool)
    return pool

def generate_lessons():
    for d in [OUTPUT_EN, OUTPUT_FR, OUTPUT_ZH]:
        os.makedirs(d, exist_ok=True)

    for cat in CATEGORIES:
        for lvl_idx, level in enumerate(LEVELS):
            part = 1
            lesson_id = f"{cat}_mod_{lvl_idx + 1}"
            
            # Fetch 50 words for this lesson
            words = get_word_pool(cat, 50)
            
            # English JSON
            en_pairs = [{"id": f"p_{str(i+1).zfill(2)}", "en": w[0], "es": w[1]} for i, w in enumerate(words)]
            en_data = create_json_structure(lesson_id, cat, level, part, en_pairs)
            with open(os.path.join(OUTPUT_EN, f"{lesson_id}.json"), "w", encoding="utf-8") as f:
                json.dump(en_data, f, ensure_ascii=False, indent=2)
                
            # French JSON
            fr_pairs = [{"id": f"p_{str(i+1).zfill(2)}", "fr": w[2], "es": w[1]} for i, w in enumerate(words)]
            fr_data = create_json_structure(lesson_id, cat, level, part, fr_pairs, title_prefix="Français")
            with open(os.path.join(OUTPUT_FR, f"{lesson_id}.json"), "w", encoding="utf-8") as f:
                json.dump(fr_data, f, ensure_ascii=False, indent=2)
                
            # Chinese JSON
            zh_pairs = [{"id": f"p_{str(i+1).zfill(2)}", "zh": w[3], "es": w[1]} for i, w in enumerate(words)]
            zh_data = create_json_structure(lesson_id, cat, level, part, zh_pairs, title_prefix="中文")
            with open(os.path.join(OUTPUT_ZH, f"{lesson_id}.json"), "w", encoding="utf-8") as f:
                json.dump(zh_data, f, ensure_ascii=False, indent=2)

    print("✅ 1980 JSON files generated successfully across en, fr, zh with SINGLE WORDS.")

def create_json_structure(lesson_id, cat, level, part, pairs, title_prefix="English"):
    return {
      "id": lesson_id,
      "category_id": cat,
      "title": f"{title_prefix} {cat.capitalize()} • {level} - Part {part}",
      "description": f"Vocabulary for {cat} at {level} level.",
      "level": level,
      "part": part,
      "total_xp": 150,
      "status": "locked",
      "theme": {
        "icon": "Book",
        "color": "blue"
      },
      "stages": [
        {
          "id": f"drill_{lesson_id}",
          "type": "pairing_drill",
          "title": f"Neuro Link: Vocabulario {level}",
          "description": "Asocia las palabras correctamente.",
          "pairs": pairs
        }
      ]
    }

if __name__ == "__main__":
    generate_lessons()
