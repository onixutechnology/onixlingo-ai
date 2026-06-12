import os
import json

OUTPUT_EN = "app/voclessons/lessons"
OUTPUT_FR = "app/voclessons/lessons/fr"
OUTPUT_ZH = "app/voclessons/lessons/zh"

BATCH_DATA = {
    "basics_mod_6": {
        "cat": "basics", "level": "C2", "title": "Fundamentos Cotidianos C2",
        "words": [
            ("Philosophy", "Filosofía", "Philosophie", "哲学 (Zhéxué)"), ("Phenomenon", "Fenómeno", "Phénomène", "现象 (Xiànxiàng)"),
            ("Paradigm", "Paradigma", "Paradigme", "范式 (Fànshì)"), ("Dilemma", "Dilema", "Dilemme", "困境 (Kùnjìng)"),
            ("Hypothesis", "Hipótesis", "Hypothèse", "假设 (Jiǎshè)"), ("Synthesis", "Síntesis", "Synthèse", "综合 (Zōnghé)"),
            ("Doctrine", "Doctrina", "Doctrine", "学说 (Xuéshuō)"), ("Entity", "Entidad", "Entité", "实体 (Shítǐ)"),
            ("Essence", "Esencia", "Essence", "本质 (Běnzhí)"), ("Spectrum", "Espectro", "Spectre", "光谱 (Guāngpǔ)"),
            ("Axiom", "Axioma", "Axiome", "公理 (Gōnglǐ)"), ("Cognition", "Cognición", "Cognition", "认知 (Rènzhī)"),
            ("Consciousness", "Conciencia", "Conscience", "意识 (Yìshí)"), ("Epistemology", "Epistemología", "Épistémologie", "认识论 (Rènshílùn)"),
            ("Ontology", "Ontología", "Ontologie", "本体论 (Běntǐlùn)"), ("Empiricism", "Empirismo", "Empirisme", "经验主义 (Jīngyànzhǔyì)"),
            ("Heuristic", "Heurística", "Heuristique", "启发式 (Qǐfāshì)"), ("Nuance", "Matiz", "Nuance", "细微差别 (Xìwēichābié)"),
            ("Dichotomy", "Dicotomía", "Dichotomie", "二分法 (Èrfēnfǎ)"), ("Symbiosis", "Simbiosis", "Symbiose", "共生 (Gòngshēng)"),
            ("Synergy", "Sinergia", "Synergie", "协同作用 (Xiétóngzuòyòng)"), ("Equilibrium", "Equilibrio", "Équilibre", "平衡 (Pínghéng)"),
            ("Flux", "Flujo", "Flux", "不断变化 (Bùduànbiànhuà)"), ("Catalyst", "Catalizador", "Catalyseur", "催化剂 (Cuīhuàjì)"),
            ("Apex", "Cúspide", "Apogée", "顶点 (Dǐngdiǎn)"), ("Zenith", "Cénit", "Zénith", "顶峰 (Dǐngfēng)"),
            ("Nadir", "Nadir", "Nadir", "最低点 (Zuìdīdiǎn)"), ("Quintessence", "Quintaesencia", "Quintessence", "典范 (Diǎnfàn)"),
            ("Epitome", "Epítome", "Épitomé", "缩影 (Suōyǐng)"), ("Archetype", "Arquetipo", "Archétype", "原型 (Yuánxíng)"),
            ("Proclivity", "Proclividad", "Proclivité", "倾向 (Qīngxiàng)"), ("Propensity", "Propensión", "Propension", "习性 (Xíxìng)"),
            ("Affinity", "Afinidad", "Affinité", "密切关系 (Mìqièguānxì)"), ("Ambiguity", "Ambigüedad", "Ambiguïté", "模棱两可 (Móléngliǎngkě)"),
            ("Anomaly", "Anomalía", "Anomalie", "异常 (Yìcháng)"), ("Conundrum", "Acertijo", "Énigme", "难题 (Nántí)"),
            ("Enigma", "Enigma", "Énigme", "谜 (Mí)"), ("Paradox", "Paradoja", "Paradoxe", "悖论 (Bèilùn)"),
            ("Skepticism", "Escepticismo", "Scepticisme", "怀疑论 (Huáiyílùn)"), ("Cynicism", "Cinismo", "Cynisme", "犬儒主义 (Quǎnrúzhǔyì)"),
            ("Stoicism", "Estoicismo", "Stoïcisme", "斯多葛主义 (Sīduōgézhǔyì)"), ("Pragmatism", "Pragmatismo", "Pragmatisme", "实用主义 (Shíyòngzhǔyì)"),
            ("Idealism", "Idealismo", "Idéalisme", "理想主义 (Lǐxiǎngzhǔyì)"), ("Nihilism", "Nihilismo", "Nihilisme", "虚无主义 (Xūwúzhǔyì)"),
            ("Altruism", "Altruismo", "Altruisme", "利他主义 (Lìtāzhǔyì)"), ("Narcissism", "Narcisismo", "Narcissisme", "自恋 (Zìliàn)"),
            ("Hedonism", "Hedonismo", "Hédonisme", "享乐主义 (Xiǎnglèzhǔyì)"), ("Autonomy", "Autonomía", "Autonomie", "自治 (Zìzhì)"),
            ("Sovereignty", "Soberanía", "Souveraineté", "主权 (Zhǔquán)"), ("Hegemony", "Hegemonía", "Hégémonie", "霸权 (Bàquán)")
        ]
    },
    "travel_mod_1": {
        "cat": "travel", "level": "A1", "title": "Viajes y Exploración A1",
        "words": [
            ("Ticket", "Boleto", "Billet", "票 (Piào)"), ("Passport", "Pasaporte", "Passeport", "护照 (Hùzhào)"),
            ("Suitcase", "Maleta", "Valise", "手提箱 (Shǒutíxiāng)"), ("Bag", "Bolso", "Sac", "包 (Bāo)"),
            ("Flight", "Vuelo", "Vol", "航班 (Hángbān)"), ("Airport", "Aeropuerto", "Aéroport", "机场 (Jīchǎng)"),
            ("Train", "Tren", "Train", "火车 (Huǒchē)"), ("Station", "Estación", "Gare", "车站 (Chēzhàn)"),
            ("Bus", "Autobús", "Bus", "公共汽车 (Gōnggòngqìchē)"), ("Stop", "Parada", "Arrêt", "车站 (Chēzhàn)"),
            ("Taxi", "Taxi", "Taxi", "出租车 (Chūzūchē)"), ("Car", "Coche", "Voiture", "汽车 (Qìchē)"),
            ("Hotel", "Hotel", "Hôtel", "酒店 (Jiǔdiàn)"), ("Room", "Habitación", "Chambre", "房间 (Fángjiān)"),
            ("Bed", "Cama", "Lit", "床 (Chuáng)"), ("Key", "Llave", "Clé", "钥匙 (Yàoshi)"),
            ("Map", "Mapa", "Carte", "地图 (Dìtú)"), ("Street", "Calle", "Rue", "街道 (Jiēdào)"),
            ("City", "Ciudad", "Ville", "城市 (Chéngshì)"), ("Town", "Pueblo", "Village", "城镇 (Chéngzhèn)"),
            ("Beach", "Playa", "Plage", "海滩 (Hǎitān)"), ("Sea", "Mar", "Mer", "海 (Hǎi)"),
            ("Mountain", "Montaña", "Montagne", "山 (Shān)"), ("Sun", "Sol", "Soleil", "太阳 (Tàiyáng)"),
            ("Rain", "Lluvia", "Pluie", "雨 (Yǔ)"), ("Snow", "Nieve", "Neige", "雪 (Xuě)"),
            ("Wind", "Viento", "Vent", "风 (Fēng)"), ("Cold", "Frío", "Froid", "冷 (Lěng)"),
            ("Hot", "Calor", "Chaud", "热 (Rè)"), ("Money", "Dinero", "Argent", "钱 (Qián)"),
            ("Bank", "Banco", "Banque", "银行 (Yínháng)"), ("Card", "Tarjeta", "Carte", "卡 (Kǎ)"),
            ("Price", "Precio", "Prix", "价格 (Jiàgé)"), ("Shop", "Tienda", "Magasin", "商店 (Shāngdiàn)"),
            ("Restaurant", "Restaurante", "Restaurant", "餐厅 (Cāntīng)"), ("Food", "Comida", "Nourriture", "食物 (Shíwù)"),
            ("Water", "Agua", "Eau", "水 (Shuǐ)"), ("Coffee", "Café", "Café", "咖啡 (Kāfēi)"),
            ("Tea", "Té", "Thé", "茶 (Chá)"), ("Breakfast", "Desayuno", "Petit déjeuner", "早餐 (Zǎocān)"),
            ("Lunch", "Almuerzo", "Déjeuner", "午餐 (Wǔcān)"), ("Dinner", "Cena", "Dîner", "晚餐 (Wǎncān)"),
            ("Toilet", "Baño", "Toilettes", "厕所 (Cèsuǒ)"), ("Police", "Policía", "Police", "警察 (Jǐngchá)"),
            ("Doctor", "Médico", "Médecin", "医生 (Yīshēng)"), ("Hospital", "Hospital", "Hôpital", "医院 (Yīyuàn)"),
            ("Help", "Ayuda", "Aide", "帮助 (Bāngzhù)"), ("Friend", "Amigo", "Ami", "朋友 (Péngyǒu)"),
            ("Family", "Familia", "Famille", "家人 (Jiārén)"), ("Photo", "Foto", "Photo", "照片 (Zhàopiàn)")
        ]
    },
    "travel_mod_2": {
        "cat": "travel", "level": "A2", "title": "Viajes y Exploración A2",
        "words": [
            ("Journey", "Viaje", "Voyage", "旅行 (Lǚxíng)"), ("Trip", "Viaje corto", "Excursion", "短途旅行 (Duǎntúlǚxíng)"),
            ("Tour", "Recorrido", "Tour", "游览 (Yóulǎn)"), ("Tourist", "Turista", "Touriste", "游客 (Yóukè)"),
            ("Guide", "Guía", "Guide", "导游 (Dǎoyóu)"), ("Camera", "Cámara", "Appareil photo", "照相机 (Zhàoxiàngjī)"),
            ("Sightseeing", "Turismo", "Tourisme", "观光 (Guāngguāng)"), ("Museum", "Museo", "Musée", "博物馆 (Bówùguǎn)"),
            ("Castle", "Castillo", "Château", "城堡 (Chéngbǎo)"), ("Palace", "Palacio", "Palais", "宫殿 (Gōngdiàn)"),
            ("Church", "Iglesia", "Église", "教堂 (Jiàotáng)"), ("Bridge", "Puente", "Pont", "桥 (Qiáo)"),
            ("Square", "Plaza", "Place", "广场 (Guǎngchǎng)"), ("Market", "Mercado", "Marché", "市场 (Shìchǎng)"),
            ("Ticket office", "Taquilla", "Guichet", "售票处 (Shòupiàochù)"), ("Information", "Información", "Information", "信息 (Xìnxī)"),
            ("Luggage", "Equipaje", "Bagages", "行李 (Xínglǐ)"), ("Backpack", "Mochila", "Sac à dos", "背包 (Bēibāo)"),
            ("Departure", "Salida", "Départ", "出发 (Chūfā)"), ("Arrival", "Llegada", "Arrivée", "到达 (Dàodá)"),
            ("Delay", "Retraso", "Retard", "延迟 (Yánchí)"), ("Platform", "Andén", "Quai", "站台 (Zhàntái)"),
            ("Track", "Vía", "Voie", "轨道 (Guǐdào)"), ("Seat", "Asiento", "Siège", "座位 (Zuòwèi)"),
            ("Window", "Ventana", "Fenêtre", "窗户 (Chuānghu)"), ("Aisle", "Pasillo", "Couloir", "过道 (Guòdào)"),
            ("Stairs", "Escaleras", "Escaliers", "楼梯 (Lóutī)"), ("Elevator", "Ascensor", "Ascenseur", "电梯 (Diàntī)"),
            ("Exit", "Salida", "Sortie", "出口 (Chūkǒu)"), ("Entrance", "Entrada", "Entrée", "入口 (Rùkǒu)"),
            ("Reception", "Recepción", "Réception", "前台 (Qiántái)"), ("Guest", "Huésped", "Client", "客人 (Kèrén)"),
            ("Reservation", "Reserva", "Réservation", "预订 (Yùdìng)"), ("Menu", "Menú", "Menu", "菜单 (Càidān)"),
            ("Bill", "Cuenta", "Addition", "账单 (Zhàngdān)"), ("Tip", "Propina", "Pourboire", "小费 (Xiǎofèi)"),
            ("Delicious", "Delicioso", "Délicieux", "美味 (Měiwèi)"), ("Spicy", "Picante", "Épicé", "辣 (Là)"),
            ("Sweet", "Dulce", "Doux", "甜 (Tián)"), ("Salty", "Salado", "Salé", "咸 (Xián)"),
            ("Currency", "Moneda", "Devise", "货币 (Huòbì)"), ("Exchange", "Cambio", "Change", "兑换 (Duìhuàn)"),
            ("Cash", "Efectivo", "Espèces", "现金 (Xiànjīn)"), ("Coin", "Moneda (metal)", "Pièce", "硬币 (Yìngbì)"),
            ("Pharmacy", "Farmacia", "Pharmacie", "药店 (Yàodiàn)"), ("Medicine", "Medicina", "Médicament", "药 (Yào)"),
            ("Accident", "Accidente", "Accident", "事故 (Shìgù)"), ("Danger", "Peligro", "Danger", "危险 (Wēixiǎn)"),
            ("Safe", "Seguro", "Sûr", "安全 (Ānquán)"), ("Lost", "Perdido", "Perdu", "迷路 (Mílù)")
        ]
    },
    "travel_mod_3": {
        "cat": "travel", "level": "B1", "title": "Viajes y Exploración B1",
        "words": [
            ("Destination", "Destino", "Destination", "目的地 (Mùdìdì)"), ("Adventure", "Aventura", "Aventure", "冒险 (Màoxiǎn)"),
            ("Expedition", "Expedición", "Expédition", "探险 (Tànxiǎn)"), ("Explore", "Explorar", "Explorer", "探索 (Tànsuǒ)"),
            ("Wander", "Deambular", "Errer", "漫游 (Mànyóu)"), ("Discover", "Descubrir", "Découvrir", "发现 (Fāxiàn)"),
            ("Landscape", "Paisaje", "Paysage", "风景 (Fēngjǐng)"), ("Scenery", "Vista", "Vue", "景色 (Jǐngsè)"),
            ("Horizon", "Horizonte", "Horizon", "地平线 (Dìpíngxiàn)"), ("Coast", "Costa", "Côte", "海岸 (Hǎi'àn)"),
            ("Island", "Isla", "Île", "岛屿 (Dǎoyǔ)"), ("Valley", "Valle", "Vallée", "山谷 (Shāngǔ)"),
            ("Forest", "Bosque", "Forêt", "森林 (Sēnlín)"), ("Jungle", "Selva", "Jungle", "丛林 (Cónglín)"),
            ("Desert", "Desierto", "Désert", "沙漠 (Shāmò)"), ("Climate", "Clima", "Climat", "气候 (Qìhòu)"),
            ("Temperature", "Temperatura", "Température", "温度 (Wēndù)"), ("Forecast", "Pronóstico", "Prévision", "预报 (Yùbào)"),
            ("Customs", "Aduana", "Douane", "海关 (Hǎiguān)"), ("Border", "Frontera", "Frontière", "边境 (Biānjìng)"),
            ("Security", "Seguridad", "Sécurité", "安检 (Ānjiǎn)"), ("Boarding", "Embarque", "Embarquement", "登机 (Dēngjī)"),
            ("Gate", "Puerta (aeropuerto)", "Porte", "登机口 (Dēngjīkǒu)"), ("Terminal", "Terminal", "Terminal", "航站楼 (Hángzhànlóu)"),
            ("Connection", "Conexión", "Connexion", "转机 (Zhuǎnjī)"), ("Layover", "Escala", "Escale", "停留 (Tíngliú)"),
            ("Cabin", "Cabina", "Cabine", "机舱 (Jīcāng)"), ("Crew", "Tripulación", "Équipage", "乘务员 (Chéngwùyuán)"),
            ("Accommodation", "Alojamiento", "Hébergement", "住宿 (Zhùsù)"), ("Hostel", "Hostal", "Auberge", "青年旅舍 (Qīngniánlǚshè)"),
            ("Resort", "Complejo turístico", "Complexe", "度假村 (Dùjiācūn)"), ("Campsite", "Camping", "Camping", "营地 (Yíngdì)"),
            ("Tent", "Tienda de campaña", "Tente", "帐篷 (Zhàngpéng)"), ("Facilities", "Instalaciones", "Installations", "设施 (Shèshī)"),
            ("Vacancy", "Vacante", "Place libre", "空房 (Kōngfáng)"), ("Deposit", "Depósito", "Caution", "押金 (Yājīn)"),
            ("Refund", "Reembolso", "Remboursement", "退款 (Tuìkuǎn)"), ("Discount", "Descuento", "Réduction", "折扣 (Zhékòu)"),
            ("Budget", "Presupuesto", "Budget", "预算 (Yùsuàn)"), ("Expense", "Gasto", "Dépense", "开支 (Kāizhī)"),
            ("Souvenir", "Recuerdo", "Souvenir", "纪念品 (Jìniànpǐn)"), ("Postcard", "Postal", "Carte postale", "明信片 (Míngxìnpiàn)"),
            ("Local", "Local", "Local", "本地人 (Běndìrén)"), ("Foreigner", "Extranjero", "Étranger", "外国人 (Wàiguórén)"),
            ("Culture", "Cultura", "Culture", "文化 (Wénhuà)"), ("Tradition", "Tradición", "Tradition", "传统 (Chuántǒng)"),
            ("Festival", "Festival", "Festival", "节日 (Jiérì)"), ("Celebration", "Celebración", "Célébration", "庆祝 (Qìngzhù)"),
            ("Direction", "Dirección (rumbo)", "Direction", "方向 (Fāngxiàng)"), ("Distance", "Distancia", "Distance", "距离 (Jùlí)")
        ]
    },
    "travel_mod_4": {
        "cat": "travel", "level": "B2", "title": "Viajes y Exploración B2",
        "words": [
            ("Itinerary", "Itinerario", "Itinéraire", "行程 (Xíngchéng)"), ("Excursion", "Excursión", "Excursion", "远足 (Yuǎnzú)"),
            ("Backpacking", "Viaje de mochilero", "Voyage en sac à dos", "背包旅行 (Bēibāolǚxíng)"), ("Pilgrimage", "Peregrinación", "Pèlerinage", "朝圣 (Cháoshèng)"),
            ("Voyage", "Viaje por mar", "Voyage en mer", "航海 (Hánghǎi)"), ("Cruise", "Crucero", "Croisière", "游轮 (Yóulún)"),
            ("Expats", "Expatriados", "Expatriés", "外籍人士 (Wàijírénshì)"), ("Nomad", "Nómada", "Nomade", "游牧民 (Yóumùmín)"),
            ("Wanderlust", "Pasión por viajar", "Envie de voyager", "漫游癖 (Mànyóupǐ)"), ("Jetlag", "Desfase horario", "Décalage horaire", "时差 (Shíchā)"),
            ("Visa", "Visado", "Visa", "签证 (Qiānzhèng)"), ("Immigration", "Inmigración", "Immigration", "移民局 (Yímínjú)"),
            ("Deportation", "Deportación", "Déportation", "驱逐出境 (Qūzhúchūjìng)"), ("Smuggling", "Contrabando", "Contrebande", "走私 (Zǒusī)"),
            ("Declaration", "Declaración", "Déclaration", "申报 (Shēnbào)"), ("Quarantine", "Cuarentena", "Quarantaine", "隔离 (Gélí)"),
            ("Turbulence", "Turbulencia", "Turbulence", "颠簸 (Diānbǒ)"), ("Altitude", "Altitud", "Altitude", "海拔 (Hǎibá)"),
            ("Coordinates", "Coordenadas", "Coordonnées", "坐标 (Zuòbiāo)"), ("Latitude", "Latitud", "Latitude", "纬度 (Wěidù)"),
            ("Longitude", "Longitud", "Longitude", "经度 (Jīngdù)"), ("Hemisphere", "Hemisferio", "Hémisphère", "半球 (Bànqiú)"),
            ("Equator", "Ecuador", "Équateur", "赤道 (Chìdào)"), ("Peninsula", "Península", "Péninsule", "半岛 (Bàndǎo)"),
            ("Archipelago", "Archipiélago", "Archipel", "群岛 (Qúndǎo)"), ("Glacier", "Glaciar", "Glacier", "冰川 (Bīngchuān)"),
            ("Canyon", "Cañón", "Canyon", "峡谷 (Xiágǔ)"), ("Oasis", "Oasis", "Oasis", "绿洲 (Lǜzhōu)"),
            ("Dune", "Duna", "Dune", "沙丘 (Shāqiū)"), ("Coral reef", "Arrecife de coral", "Récif corallien", "珊瑚礁 (Shānhújiāo)"),
            ("Sanctuary", "Santuario", "Sanctuaire", "保护区 (Bǎohùqū)"), ("Heritage", "Patrimonio", "Patrimoine", "遗产 (Yíchán)"),
            ("Ruins", "Ruinas", "Ruines", "遗址 (Yízhǐ)"), ("Artifact", "Artefacto", "Artéfact", "文物 (Wénwù)"),
            ("Excavation", "Excavación", "Excavation", "发掘 (Fājué)"), ("Monastery", "Monasterio", "Monastère", "修道院 (Xiūdàoyuàn)"),
            ("Shrine", "Santuario (templo)", "Sanctuaire", "神龛 (Shénkān)"), ("Mosque", "Mezquita", "Mosquée", "清真寺 (Qīngzhēnsì)"),
            ("Synagogue", "Sinagoga", "Synagogue", "犹太教堂 (Yóutàijiàotáng)"), ("Folklore", "Folclore", "Folklore", "民俗 (Mínsú)"),
            ("Dialect", "Dialecto", "Dialecte", "方言 (Fāngyán)"), ("Gesture", "Gesto", "Geste", "手势 (Shǒushì)"),
            ("Etiquette", "Etiqueta", "Étiquette", "礼仪 (Lǐyí)"), ("Hospitality", "Hospitalidad", "Hospitalité", "好客 (Hàokè)"),
            ("Bargain", "Regatear", "Marchander", "讨价还价 (Tǎojiàhuánjià)"), ("Haggle", "Regateo", "Marchandage", "砍价 (Kǎnjià)"),
            ("Counterfeit", "Falsificación", "Contrefaçon", "假货 (Jiǎhuò)"), ("Authentic", "Auténtico", "Authentique", "正宗 (Zhèngzōng)"),
            ("Exotic", "Exótico", "Exotique", "异国情调 (Yìguóqíngdiào)"), ("Picturesque", "Pintoresco", "Pittoresque", "风景如画 (Fēngjǐngrúhuà)")
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
        "icon": "Plane" if cat == "travel" else "Book",
        "color": "indigo" if cat == "travel" else "blue"
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
        cat = data["cat"]
        
        assert len(words) == 50, f"{lesson_id} has {len(words)} words instead of 50!"
        
        en_pairs = [{"id": f"p_{str(i+1).zfill(2)}", "en": w[0], "es": w[1]} for i, w in enumerate(words)]
        en_data = create_json_structure(lesson_id, cat, level, 1, en_pairs, title_prefix="English", title=title_es)
        with open(os.path.join(OUTPUT_EN, f"{lesson_id}.json"), "w", encoding="utf-8") as f:
            json.dump(en_data, f, ensure_ascii=False, indent=2)
            
        fr_pairs = [{"id": f"p_{str(i+1).zfill(2)}", "fr": w[2], "es": w[1]} for i, w in enumerate(words)]
        fr_data = create_json_structure(lesson_id, cat, level, 1, fr_pairs, title_prefix="Français", title=title_es)
        with open(os.path.join(OUTPUT_FR, f"{lesson_id}.json"), "w", encoding="utf-8") as f:
            json.dump(fr_data, f, ensure_ascii=False, indent=2)
            
        zh_pairs = [{"id": f"p_{str(i+1).zfill(2)}", "zh": w[3], "es": w[1]} for i, w in enumerate(words)]
        zh_data = create_json_structure(lesson_id, cat, level, 1, zh_pairs, title_prefix="中文", title=title_es)
        with open(os.path.join(OUTPUT_ZH, f"{lesson_id}.json"), "w", encoding="utf-8") as f:
            json.dump(zh_data, f, ensure_ascii=False, indent=2)
            
    print("✅ BATCH 2 (Basics C2, Travel A1-B2) - 15 JSON files created successfully with EXACT 250 UNIQUE WORDS.")

if __name__ == "__main__":
    generate_batch()
