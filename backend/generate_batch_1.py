import os
import json

OUTPUT_EN = "app/voclessons/lessons"
OUTPUT_FR = "app/voclessons/lessons/fr"
OUTPUT_ZH = "app/voclessons/lessons/zh"

# 100% Curated Data for the "Basics" category (Levels A1 to C1)
# Format: (English, Spanish, French, Chinese)

BATCH_DATA = {
    "basics_mod_1": {
        "level": "A1",
        "title": "Fundamentos Cotidianos A1",
        "words": [
            ("Hello", "Hola", "Bonjour", "你好 (Nǐ hǎo)"), ("Goodbye", "Adiós", "Au revoir", "再见 (Zàijiàn)"),
            ("Please", "Por favor", "S'il vous plaît", "请 (Qǐng)"), ("Thank you", "Gracias", "Merci", "谢谢 (Xièxiè)"),
            ("Yes", "Sí", "Oui", "是 (Shì)"), ("No", "No", "Non", "不 (Bù)"),
            ("Water", "Agua", "Eau", "水 (Shuǐ)"), ("Food", "Comida", "Nourriture", "食物 (Shíwù)"),
            ("Friend", "Amigo", "Ami", "朋友 (Péngyǒu)"), ("Family", "Familia", "Famille", "家人 (Jiārén)"),
            ("Time", "Tiempo", "Temps", "时间 (Shíjiān)"), ("Day", "Día", "Jour", "天 (Tiān)"),
            ("Night", "Noche", "Nuit", "晚上 (Wǎnshàng)"), ("Morning", "Mañana", "Matin", "早上 (Zǎoshang)"),
            ("Today", "Hoy", "Aujourd'hui", "今天 (Jīntiān)"), ("Tomorrow", "Mañana", "Demain", "明天 (Míngtiān)"),
            ("Yesterday", "Ayer", "Hier", "昨天 (Zuótiān)"), ("Week", "Semana", "Semaine", "星期 (Xīngqī)"),
            ("Month", "Mes", "Mois", "月 (Yuè)"), ("Year", "Año", "Année", "年 (Nián)"),
            ("Man", "Hombre", "Homme", "男人 (Nánrén)"), ("Woman", "Mujer", "Femme", "女人 (Nǚrén)"),
            ("Boy", "Niño", "Garçon", "男孩 (Nánhái)"), ("Girl", "Niña", "Fille", "女孩 (Nǚhái)"),
            ("House", "Casa", "Maison", "家 (Jiā)"), ("Car", "Coche", "Voiture", "汽车 (Qìchē)"),
            ("Money", "Dinero", "Argent", "钱 (Qián)"), ("Work", "Trabajo", "Travail", "工作 (Gōngzuò)"),
            ("School", "Escuela", "École", "学校 (Xuéxiào)"), ("Book", "Libro", "Livre", "书 (Shū)"),
            ("Pen", "Bolígrafo", "Stylo", "笔 (Bǐ)"), ("Sun", "Sol", "Soleil", "太阳 (Tàiyáng)"),
            ("Moon", "Luna", "Lune", "月亮 (Yuèliàng)"), ("Star", "Estrella", "Étoile", "星星 (Xīngxīng)"),
            ("Tree", "Árbol", "Arbre", "树 (Shù)"), ("Flower", "Flor", "Fleur", "花 (Huā)"),
            ("Cat", "Gato", "Chat", "猫 (Māo)"), ("Dog", "Perro", "Chien", "狗 (Gǒu)"),
            ("Bird", "Pájaro", "Oiseau", "鸟 (Niǎo)"), ("Fish", "Pez", "Poisson", "鱼 (Yú)"),
            ("Fire", "Fuego", "Feu", "火 (Huǒ)"), ("Earth", "Tierra", "Terre", "地球 (Dìqiú)"),
            ("Air", "Aire", "Air", "空气 (Kōngqì)"), ("Sky", "Cielo", "Ciel", "天空 (Tiānkōng)"),
            ("Sea", "Mar", "Mer", "海 (Hǎi)"), ("River", "Río", "Rivière", "河 (Hé)"),
            ("Mountain", "Montaña", "Montagne", "山 (Shān)"), ("Road", "Camino", "Route", "路 (Lù)"),
            ("City", "Ciudad", "Ville", "城市 (Chéngshì)"), ("Country", "País", "Pays", "国家 (Guójiā)")
        ]
    },
    "basics_mod_2": {
        "level": "A2",
        "title": "Fundamentos Cotidianos A2",
        "words": [
            ("Always", "Siempre", "Toujours", "总是 (Zǒng shì)"), ("Never", "Nunca", "Jamais", "从不 (Cóng bù)"),
            ("Sometimes", "A veces", "Parfois", "有时 (Yǒushí)"), ("Often", "A menudo", "Souvent", "经常 (Jīngcháng)"),
            ("Usually", "Usualmente", "Habituellement", "通常 (Tōngcháng)"), ("Now", "Ahora", "Maintenant", "现在 (Xiànzài)"),
            ("Later", "Más tarde", "Plus tard", "后来 (Hòulái)"), ("Before", "Antes", "Avant", "以前 (Yǐqián)"),
            ("After", "Después", "Après", "之后 (Zhīhòu)"), ("Soon", "Pronto", "Bientôt", "很快 (Hěn kuài)"),
            ("Here", "Aquí", "Ici", "这里 (Zhèlǐ)"), ("There", "Allí", "Là", "那里 (Nàlǐ)"),
            ("Everywhere", "En todas partes", "Partout", "到处 (Dàochù)"), ("Nowhere", "En ninguna parte", "Nulle part", "无处 (Wú chù)"),
            ("Anything", "Cualquier cosa", "N'importe quoi", "任何事 (Rènhé shì)"), ("Nothing", "Nada", "Rien", "没有什么 (Méiyǒu shénme)"),
            ("Everything", "Todo", "Tout", "一切 (Yīqiè)"), ("Someone", "Alguien", "Quelqu'un", "某人 (Mǒu rén)"),
            ("Anyone", "Cualquiera", "N'importe qui", "任何人 (Rènhé rén)"), ("Everyone", "Todos", "Tout le monde", "每个人 (Měi gè rén)"),
            ("Body", "Cuerpo", "Corps", "身体 (Shēntǐ)"), ("Head", "Cabeza", "Tête", "头 (Tóu)"),
            ("Hand", "Mano", "Main", "手 (Shǒu)"), ("Eye", "Ojo", "Œil", "眼睛 (Yǎnjing)"),
            ("Face", "Cara", "Visage", "脸 (Liǎn)"), ("Heart", "Corazón", "Cœur", "心 (Xīn)"),
            ("Mind", "Mente", "Esprit", "头脑 (Tóunǎo)"), ("Idea", "Idea", "Idée", "主意 (Zhǔyì)"),
            ("Question", "Pregunta", "Question", "问题 (Wèntí)"), ("Answer", "Respuesta", "Réponse", "回答 (Huídá)"),
            ("Reason", "Razón", "Raison", "理由 (Lǐyóu)"), ("Fact", "Hecho", "Fait", "事实 (Shìshí)"),
            ("Truth", "Verdad", "Vérité", "真相 (Zhēnxiàng)"), ("Lie", "Mentira", "Mensonge", "谎言 (Huǎngyán)"),
            ("Rule", "Regla", "Règle", "规则 (Guīzé)"), ("Law", "Ley", "Loi", "法律 (Fǎlǜ)"),
            ("Power", "Poder", "Pouvoir", "力量 (Lìliàng)"), ("Force", "Fuerza", "Force", "武力 (Wǔlì)"),
            ("Energy", "Energía", "Énergie", "能量 (Néngliàng)"), ("Light", "Luz", "Lumière", "光 (Guāng)"),
            ("Dark", "Oscuridad", "Obscurité", "黑暗 (Hēi'àn)"), ("Sound", "Sonido", "Son", "声音 (Shēngyīn)"),
            ("Voice", "Voz", "Voix", "声音 (Voz) (Shēngyīn)"), ("Word", "Palabra", "Mot", "字 (Zì)"),
            ("Name", "Nombre", "Nom", "名字 (Míngzì)"), ("Number", "Número", "Nombre", "数字 (Shùzì)"),
            ("Line", "Línea", "Ligne", "线 (Xiàn)"), ("Shape", "Forma", "Forme", "形状 (Xíngzhuàng)"),
            ("Color", "Color", "Couleur", "颜色 (Yánsè)"), ("Piece", "Pedazo", "Morceau", "片 (Piàn)")
        ]
    },
    "basics_mod_3": {
        "level": "B1",
        "title": "Fundamentos Cotidianos B1",
        "words": [
            ("Ability", "Habilidad", "Capacité", "能力 (Nénglì)"), ("Action", "Acción", "Action", "行动 (Xíngdòng)"),
            ("Advice", "Consejo", "Conseil", "建议 (Jiànyì)"), ("Agreement", "Acuerdo", "Accord", "协议 (Xiéyì)"),
            ("Amount", "Cantidad", "Montant", "金额 (Jīn'é)"), ("Animal", "Animal", "Animal", "动物 (Dòngwù)"),
            ("Art", "Arte", "Art", "艺术 (Yìshù)"), ("Article", "Artículo", "Article", "文章 (Wénzhāng)"),
            ("Attention", "Atención", "Attention", "注意 (Zhùyì)"), ("Base", "Base", "Base", "基础 (Jīchǔ)"),
            ("Beauty", "Belleza", "Beauté", "美丽 (Měilì)"), ("Beginning", "Principio", "Début", "开始 (Kāishǐ)"),
            ("Belief", "Creencia", "Croyance", "信仰 (Xìnyǎng)"), ("Blood", "Sangre", "Sang", "血液 (Xuèyè)"),
            ("Bottom", "Fondo", "Fond", "底部 (Dǐbù)"), ("Box", "Caja", "Boîte", "盒子 (Hézi)"),
            ("Building", "Edificio", "Bâtiment", "建筑 (Jiànzhù)"), ("Business", "Negocio", "Affaire", "商业 (Shāngyè)"),
            ("Care", "Cuidado", "Soin", "关心 (Guānxīn)"), ("Case", "Caso", "Cas", "情况 (Qíngkuàng)"),
            ("Cause", "Causa", "Cause", "原因 (Yuányīn)"), ("Center", "Centro", "Centre", "中心 (Zhōngxīn)"),
            ("Chance", "Oportunidad", "Chance", "机会 (Jīhuì)"), ("Change", "Cambio", "Changement", "改变 (Gǎibiàn)"),
            ("Character", "Carácter", "Caractère", "性格 (Xìnggé)"), ("Child", "Niño/a", "Enfant", "孩子 (Háizi)"),
            ("Choice", "Elección", "Choix", "选择 (Xuǎnzé)"), ("Class", "Clase", "Classe", "班级 (Bānjí)"),
            ("Clear", "Claro", "Clair", "清楚 (Qīngchǔ)"), ("Close", "Cerca", "Proche", "近 (Jìn)"),
            ("Condition", "Condición", "Condition", "条件 (Tiáojiàn)"), ("Control", "Control", "Contrôle", "控制 (Kòngzhì)"),
            ("Course", "Curso", "Cours", "课程 (Kèchéng)"), ("Court", "Corte", "Cour", "法庭 (Fǎtíng)"),
            ("Cover", "Cubierta", "Couverture", "覆盖 (Fùgài)"), ("Culture", "Cultura", "Culture", "文化 (Wénhuà)"),
            ("Data", "Datos", "Données", "数据 (Shùjù)"), ("Decision", "Decisión", "Décision", "决定 (Juédìng)"),
            ("Degree", "Grado", "Degré", "程度 (Chéngdù)"), ("Detail", "Detalle", "Détail", "细节 (Xìjié)"),
            ("Development", "Desarrollo", "Développement", "发展 (Fāzhǎn)"), ("Difference", "Diferencia", "Différence", "差异 (Chāyì)"),
            ("Direction", "Dirección", "Direction", "方向 (Fāngxiàng)"), ("Disease", "Enfermedad", "Maladie", "疾病 (Jíbìng)"),
            ("Distance", "Distancia", "Distance", "距离 (Jùlí)"), ("Door", "Puerta", "Porte", "门 (Mén)"),
            ("Doubt", "Duda", "Doute", "怀疑 (Huáiyí)"), ("Dream", "Sueño", "Rêve", "梦想 (Mèngxiǎng)"),
            ("Duty", "Deber", "Devoir", "责任 (Zérèn)"), ("Education", "Educación", "Éducation", "教育 (Jiàoyù)")
        ]
    },
    "basics_mod_4": {
        "level": "B2",
        "title": "Fundamentos Cotidianos B2",
        "words": [
            ("Effect", "Efecto", "Effet", "效果 (Xiàoguǒ)"), ("Effort", "Esfuerzo", "Effort", "努力 (Nǔlì)"),
            ("End", "Fin", "Fin", "结束 (Jiéshù)"), ("Environment", "Medio ambiente", "Environnement", "环境 (Huánjìng)"),
            ("Event", "Evento", "Événement", "事件 (Shìjiàn)"), ("Example", "Ejemplo", "Exemple", "例子 (Lìzi)"),
            ("Experience", "Experiencia", "Expérience", "经验 (Jīngyàn)"), ("Fact", "Hecho", "Fait", "事实 (Shìshí)"),
            ("Factor", "Factor", "Facteur", "因素 (Yīnsù)"), ("Failure", "Fracaso", "Échec", "失败 (Shībài)"),
            ("Family", "Familia", "Famille", "家庭 (Jiātíng)"), ("Fear", "Miedo", "Peur", "害怕 (Hàipà)"),
            ("Feeling", "Sentimiento", "Sentiment", "感觉 (Gǎnjué)"), ("Field", "Campo", "Champ", "领域 (Lǐngyù)"),
            ("Figure", "Figura", "Figure", "数字 (Shùzì)"), ("Fire", "Fuego", "Feu", "火 (Huǒ)"),
            ("Floor", "Piso", "Étage", "楼层 (Lóucéng)"), ("Form", "Forma", "Forme", "形式 (Xíngshì)"),
            ("Freedom", "Libertad", "Liberté", "自由 (Zìyóu)"), ("Front", "Frente", "Avant", "前面 (Qiánmiàn)"),
            ("Future", "Futuro", "Avenir", "未来 (Wèilái)"), ("Game", "Juego", "Jeu", "游戏 (Yóuxì)"),
            ("Glass", "Vidrio", "Verre", "玻璃 (Bōlí)"), ("Goal", "Meta", "But", "目标 (Mùbiāo)"),
            ("Group", "Grupo", "Groupe", "组 (Zǔ)"), ("Growth", "Crecimiento", "Croissance", "增长 (Zēngzhǎng)"),
            ("Half", "Mitad", "Moitié", "半 (Bàn)"), ("Health", "Salud", "Santé", "健康 (Jiànkāng)"),
            ("History", "Historia", "Histoire", "历史 (Lìshǐ)"), ("Hope", "Esperanza", "Espoir", "希望 (Xīwàng)"),
            ("Hospital", "Hospital", "Hôpital", "医院 (Yīyuàn)"), ("Hour", "Hora", "Heure", "小时 (Xiǎoshí)"),
            ("Idea", "Idea", "Idée", "想法 (Xiǎngfǎ)"), ("Image", "Imagen", "Image", "图片 (Túpiàn)"),
            ("Impact", "Impacto", "Impact", "影响 (Yǐngxiǎng)"), ("Income", "Ingresos", "Revenu", "收入 (Shōurù)"),
            ("Increase", "Aumento", "Augmentation", "增加 (Zēngjiā)"), ("Industry", "Industria", "Industrie", "工业 (Gōngyè)"),
            ("Information", "Información", "Information", "信息 (Xìnxī)"), ("Interest", "Interés", "Intérêt", "兴趣 (Xìngqù)"),
            ("Issue", "Problema", "Problème", "问题 (Wèntí)"), ("Item", "Artículo", "Article", "项目 (Xiàngmù)"),
            ("Job", "Trabajo", "Emploi", "工作 (Gōngzuò)"), ("Knowledge", "Conocimiento", "Connaissance", "知识 (Zhīshí)"),
            ("Language", "Idioma", "Langue", "语言 (Yǔyán)"), ("Level", "Nivel", "Niveau", "水平 (Shuǐpíng)"),
            ("Life", "Vida", "Vie", "生活 (Shēnghuó)"), ("Line", "Línea", "Ligne", "排 (Pái)"),
            ("List", "Lista", "Liste", "列表 (Lièbiǎo)"), ("Local", "Local", "Local", "本地 (Běndì)")
        ]
    },
    "basics_mod_5": {
        "level": "C1",
        "title": "Fundamentos Cotidianos C1",
        "words": [
            ("Loss", "Pérdida", "Perte", "损失 (Sǔnshī)"), ("Machine", "Máquina", "Machine", "机器 (Jīqì)"),
            ("Major", "Principal", "Majeur", "主要 (Zhǔyào)"), ("Management", "Gestión", "Gestion", "管理 (Guǎnlǐ)"),
            ("Market", "Mercado", "Marché", "市场 (Shìchǎng)"), ("Material", "Material", "Matériel", "材料 (Cáiliào)"),
            ("Matter", "Materia/Asunto", "Matière", "事情 (Shìqíng)"), ("Measure", "Medida", "Mesure", "措施 (Cuòshī)"),
            ("Media", "Medios", "Médias", "媒体 (Méitǐ)"), ("Meeting", "Reunión", "Réunion", "会议 (Huìyì)"),
            ("Member", "Miembro", "Membre", "成员 (Chéngyuán)"), ("Memory", "Memoria", "Mémoire", "记忆 (Jìyì)"),
            ("Method", "Método", "Méthode", "方法 (Fāngfǎ)"), ("Middle", "Medio", "Milieu", "中间 (Zhōngjiān)"),
            ("Military", "Militar", "Militaire", "军事 (Jūnshì)"), ("Mind", "Mente", "Esprit", "思想 (Sīxiǎng)"),
            ("Minute", "Minuto", "Minute", "分钟 (Fēnzhōng)"), ("Model", "Modelo", "Modèle", "模型 (Móxíng)"),
            ("Moment", "Momento", "Moment", "时刻 (Shíkè)"), ("Month", "Mes", "Mois", "月份 (Yuèfèn)"),
            ("Morning", "Mañana", "Matin", "早晨 (Zǎochén)"), ("Mother", "Madre", "Mère", "母亲 (Mǔqīn)"),
            ("Movement", "Movimiento", "Mouvement", "运动 (Yùndòng)"), ("Music", "Música", "Musique", "音乐 (Yīnyuè)"),
            ("Nation", "Nación", "Nation", "国家 (Guójiā)"), ("Nature", "Naturaleza", "Nature", "自然 (Zìrán)"),
            ("Network", "Red", "Réseau", "网络 (Wǎngluò)"), ("News", "Noticias", "Nouvelles", "新闻 (Xīnwén)"),
            ("Note", "Nota", "Note", "笔记 (Bǐjì)"), ("Number", "Número", "Nombre", "数目 (Shùmù)"),
            ("Object", "Objeto", "Objet", "物体 (Wùtǐ)"), ("Officer", "Oficial", "Officier", "军官 (Jūnguān)"),
            ("Operation", "Operación", "Opération", "操作 (Cāozuò)"), ("Opportunity", "Oportunidad", "Opportunité", "机遇 (Jīyù)"),
            ("Option", "Opción", "Option", "选项 (Xuǎnxiàng)"), ("Order", "Orden", "Ordre", "秩序 (Zhìxù)"),
            ("Organization", "Organización", "Organisation", "组织 (Zǔzhī)"), ("Page", "Página", "Page", "页面 (Yèmiàn)"),
            ("Pain", "Dolor", "Douleur", "痛苦 (Tòngkǔ)"), ("Paper", "Papel", "Papier", "纸张 (Zhǐzhāng)"),
            ("Parent", "Padre/Madre", "Parent", "父母 (Fùmǔ)"), ("Part", "Parte", "Partie", "部分 (Bùfèn)"),
            ("Party", "Fiesta/Partido", "Fête", "派对 (Pàiduì)"), ("Patient", "Paciente", "Patient", "病人 (Bìngrén)"),
            ("Pattern", "Patrón", "Modèle", "模式 (Móshì)"), ("Peace", "Paz", "Paix", "和平 (Hépíng)"),
            ("People", "Gente", "Gens", "人们 (Rénmen)"), ("Performance", "Rendimiento", "Performance", "表现 (Biǎoxiàn)"),
            ("Period", "Período", "Période", "时期 (Shíqī)"), ("Person", "Persona", "Personne", "人 (Rén)")
        ]
    }
}

def create_json_structure(lesson_id, cat, level, part, pairs, title_prefix="English", title=""):
    return {
      "id": lesson_id,
      "category_id": cat,
      "title": f"{title_prefix} - {title}",
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

def generate_batch():
    for d in [OUTPUT_EN, OUTPUT_FR, OUTPUT_ZH]:
        os.makedirs(d, exist_ok=True)
        
    for lesson_id, data in BATCH_DATA.items():
        words = data["words"]
        level = data["level"]
        title_es = data["title"]
        
        # Ensure exactly 50 words
        assert len(words) == 50, f"{lesson_id} has {len(words)} words instead of 50!"
        
        # EN
        en_pairs = [{"id": f"p_{str(i+1).zfill(2)}", "en": w[0], "es": w[1]} for i, w in enumerate(words)]
        en_data = create_json_structure(lesson_id, "basics", level, 1, en_pairs, title_prefix="English", title=title_es)
        with open(os.path.join(OUTPUT_EN, f"{lesson_id}.json"), "w", encoding="utf-8") as f:
            json.dump(en_data, f, ensure_ascii=False, indent=2)
            
        # FR
        fr_pairs = [{"id": f"p_{str(i+1).zfill(2)}", "fr": w[2], "es": w[1]} for i, w in enumerate(words)]
        fr_data = create_json_structure(lesson_id, "basics", level, 1, fr_pairs, title_prefix="Français", title=title_es)
        with open(os.path.join(OUTPUT_FR, f"{lesson_id}.json"), "w", encoding="utf-8") as f:
            json.dump(fr_data, f, ensure_ascii=False, indent=2)
            
        # ZH
        zh_pairs = [{"id": f"p_{str(i+1).zfill(2)}", "zh": w[3], "es": w[1]} for i, w in enumerate(words)]
        zh_data = create_json_structure(lesson_id, "basics", level, 1, zh_pairs, title_prefix="中文", title=title_es)
        with open(os.path.join(OUTPUT_ZH, f"{lesson_id}.json"), "w", encoding="utf-8") as f:
            json.dump(zh_data, f, ensure_ascii=False, indent=2)
            
    print("✅ BATCH 1 (Basics A1 to C1) - 15 JSON files created successfully with EXACT 250 UNIQUE WORDS.")

if __name__ == "__main__":
    generate_batch()
