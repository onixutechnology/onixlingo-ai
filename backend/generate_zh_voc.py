import os
import json

# --- CONFIGURACIÓN DE SALIDA ---
OUTPUT_DIR = "app/voclessons/lessons/zh"

# --- BANCO DE DATOS DE VOCABULARIO (2,500 PARES ESPAÑOL -> CHINO HANZI + PINYIN) ---
# Estructura: Categoría -> Lista de 10 Módulos (cada uno con 50 tuplas (Español, Chino))
VOCAB_DATABASE = {
    "basics": [
        # Módulo 1: Saludos y Expresiones Comunes (Fácil)
        [
            ("Hola", "你好 (Nǐ hǎo)"), ("Adiós", "再见 (Zàijiàn)"), ("Gracias", "谢谢 (Xièxie)"), ("Por favor", "请 (Qǐng)"),
            ("Sí", "是 (Shì)"), ("No", "不 (Bù)"), ("Buenas noches", "晚安 (Wǎn'ān)"), ("Buenos días", "早上好 (Zǎoshang hǎo)"),
            ("¿Cómo estás?", "你好吗 (Nǐ hǎo ma)"), ("Muy bien", "很好 (Hěn hǎo)"), ("Lo siento", "对不起 (Duìbuqǐ)"),
            ("De nada", "不客气 (Bù kèqi)"), ("Disculpe", "打扰一下 (Dǎrǎo yīxià)"), ("Bienvenido", "欢迎 (Huānyíng)"),
            ("Hasta luego", "一会儿见 (Yīhuǐ'er jiàn)"), ("Hasta mañana", "明天见 (Míngtiān jiàn)"), ("Mucho gusto", "很高兴认识你 (Hěn gāoxìng rènshi nǐ)"),
            ("¿Qué tal?", "怎么样 (Zěnmeyàng)"), ("Bien", "好 (Hǎo)"), ("Mal", "不好 (Bù hǎo)"), ("Señor", "先生 (Xiānsheng)"),
            ("Señora", "女士 (Nǚshì)"), ("Amigo", "朋友 (Péngyou)"), ("Nombre", "名字 (Míngzi)"), ("Apellido", "姓 (Xìng)"),
            ("¿Cómo te llamas?", "你叫什么名字 (Nǐ jiào shénme míngzi)"), ("Me llamo", "我叫 (Wǒ jiào)"),
            ("Edad", "年龄 (Niánlíng)"), ("¿De dónde eres?", "你来自哪里 (Nǐ láizì nǎlǐ)"), ("Soy de", "我来自 (Wǒ láizì)"),
            ("Feliz", "快乐 (Kuàilè)"), ("Triste", "伤心 (Shāngxīn)"), ("Cansado", "累 (Lèi)"), ("Enfermo", "生病 (Shēngbìng)"),
            ("Estudiante", "学生 (Xuéshēng)"), ("Profesor", "老师 (Lǎoshī)"), ("Trabajo", "工作 (Gōngzuò)"),
            ("Escuela", "学校 (Xuéxiào)"), ("Ciudad", "城市 (Chéngshì)"), ("País", "国家 (Guójiā)"), ("Casa", "家 (Jiā)"),
            ("Familia", "家庭 (Jiātíng)"), ("Hombre", "男人 (Nánrén)"), ("Mujer", "女人 (Nǚrén)"), ("Niño", "孩子 (Háizi)"),
            ("Amiga", "女朋友 (Nǚ péngyou)"), ("Gente", "人们 (Rénmen)"), ("Amor", "爱 (Ài)"), ("Vida", "生活 (Shēnghuó)"), ("Tiempo", "时间 (Shíjiān)")
        ],
        # Módulo 2: La Familia y Personas (Fácil)
        [
            ("Madre", "妈妈 (Māma)"), ("Padre", "爸爸 (Bàba)"), ("Hijo", "儿子 (Érzi)"), ("Hija", "女儿 (Nǚ'ér)"), ("Hermano mayor", "哥哥 (Gēge)"),
            ("Hermana mayor", "姐姐 (Jiějie)"), ("Hermano menor", "弟弟 (Dìdi)"), ("Hermana menor", "妹妹 (Mèimei)"), ("Abuelo paterno", "爷爷 (Yéye)"),
            ("Abuela paterna", "奶奶 (Nǎinai)"), ("Tío", "叔叔 (Shūshu)"), ("Tía", "阿姨 (Āyí)"), ("Primo", "堂哥 (Tánggē)"),
            ("Prima", "堂妹 (Tángmèi)"), ("Sobrino", "外甥 (Wàishēng)"), ("Sobrina", "外甥女 (Wàishēngnǚ)"), ("Esposo", "丈夫 (Zhàngfu)"),
            ("Esposa", "妻子 (Qīzi)"), ("Novio", "男朋友 (Nán péngyou)"), ("Novia", "女朋友 (Nǚ péngyou)"), ("Bebé", "婴儿 (Yīng'ér)"),
            ("Padres", "父母 (Fùmǔ)"), ("Hijos", "孩子们 (Háizimen)"), ("Vecino", "邻居 (Línjū)"), ("Jefe", "老板 (Lǎobǎn)"),
            ("Colega", "同事 (Tóngshì)"), ("Señorita", "小姐 (Xiǎojiě)"), ("Compañero de clase", "同学 (Tóngxué)"),
            ("Gente", "大家 (Dàjiā)"), ("Persona", "人 (Rén)"), ("Bebé", "宝宝 (Bǎobao)"), ("Adulto", "大人 (Dàren)"),
            ("Anciano", "老人 (Lǎorén)"), ("Suegro", "岳父 (Yuèfù)"), ("Suegra", "岳母 (Yuèmǔ)"), ("Yerno", "女婿 (Nǚxu)"),
            ("Nuera", "儿媳 (Érxí)"), ("Abuelo materno", "外公 (Wàigōng)"), ("Abuela materna", "外婆 (Wàipó)"),
            ("Padrino", "教父 (Jiàofù)"), ("Madrina", "教母 (Jiàomǔ)"), ("Gemelo", "双胞胎 (Shuāngbāotāi)"),
            ("Generación", "一代 (Yīdài)"), ("Infancia", "童年 (Tóngnián)"), ("Juventud", "青春 (Qīngchūn)"),
            ("Hombre", "男士 (Nánshì)"), ("Mujer", "女士 (Nǚshì)"), ("Amigo cercano", "挚友 (Zhìyǒu)"),
            ("Parientes", "亲戚 (Qīnqi)"), ("Vecinos", "邻里 (Línlǐ)")
        ],
        # Módulo 3: Números y Tiempo (Fácil)
        [
            ("Uno", "一 (Yī)"), ("Dos", "二 (Èr)"), ("Tres", "三 (Sān)"), ("Cuatro", "四 (Sì)"), ("Cinco", "五 (Wǔ)"),
            ("Seis", "六 (Liù)"), ("Siete", "七 (Qī)"), ("Ocho", "八 (Bā)"), ("Nueve", "九 (Jiǔ)"), ("Diez", "十 (Shí)"),
            ("Once", "十一 (Shíyī)"), ("Doce", "十二 (Shí'èr)"), ("Trece", "十三 (Shísān)"), ("Catorce", "十四 (Shísì)"),
            ("Quince", "十五 (Shíwǔ)"), ("Veinte", "二十 (Èrshí)"), ("Treinta", "三十 (Sānshí)"), ("Cuarenta", "四十 (Sìshí)"),
            ("Cincuenta", "五十 (Wǔshí)"), ("Cien", "百 (Bǎi)"), ("Mil", "千 (Qiān)"), ("Hora", "小时 (Xiǎoshí)"),
            ("Minuto", "分钟 (Fēnzhōng)"), ("Segundo", "秒 (Miǎo)"), ("Día", "天 (Tiān)"), ("Semana", "星期 (Xīngqī)"),
            ("Mes", "月 (Yuè)"), ("Año", "年 (Nián)"), ("Lunes", "星期一 (Xīngqīyī)"), ("Martes", "星期二 (Xīngqī'èr)"),
            ("Miércoles", "星期三 (Xīngqīsān)"), ("Jueves", "星期四 (Xīngqīshì)"), ("Viernes", "星期五 (Xīngqīwǔ)"),
            ("Sábado", "星期六 (Xīngqīliù)"), ("Domingo", "星期日 (Xīngqīrì)"), ("Mañana (día)", "早上 (Zǎoshang)"),
            ("Tarde", "下午 (Xiàwǔ)"), ("Noche", "晚上 (Wǎnshang)"), ("Hoy", "今天 (Jīntiān)"), ("Ayer", "昨天 (Zuótiān)"),
            ("Mañana (futuro)", "明天 (Míngtiān)"), ("Semana pasada", "上周 (Shàngzhōu)"),
            ("Próxima semana", "下周 (Xiàzhōu)"), ("Fin de semana", "周末 (Zhōumò)"), ("Estación", "季节 (Jìjié)"),
            ("Primavera", "春天 (Chūntiān)"), ("Verano", "夏天 (Xiàtiān)"), ("Otoño", "秋天 (Qiūtiān)"),
            ("Invierno", "冬天 (Dōngtiān)"), ("Calendario", "日历 (Rìlì)")
        ],
        # Módulo 4: Alimentos y Bebidas (Fácil)
        [
            ("Agua", "水 (Shuǐ)"), ("Pan", "面包 (Miànbāo)"), ("Leche", "牛奶 (Niúnǎi)"), ("Queso", "芝士 (Zhīshì)"), ("Huevo", "鸡蛋 (Jīdàn)"),
            ("Mantequilla", "黄油 (Huángyóu)"), ("Carne", "肉 (Ròu)"), ("Pescado", "鱼 (Yú)"), ("Pollo", "鸡肉 (Jīròu)"),
            ("Arroz", "米饭 (Mǐfàn)"), ("Manzana", "苹果 (Píngguǒ)"), ("Plátano", "香蕉 (Xiāngjiāo)"), ("Naranja", "橙子 (Chéngzi)"),
            ("Café", "咖啡 (Kāfēi)"), ("Té", "茶 (Chá)"), ("Azúcar", "糖 (Táng)"), ("Sal", "盐 (Yán)"), ("Pimienta", "胡椒 (Hújiāo)"),
            ("Aceite", "油 (Yóu)"), ("Vinagre", "醋 (Cù)"), ("Sopa", "汤 (Tāng)"), ("Ensalada", "沙拉 (Shālā)"),
            ("Fideos", "面条 (Miàntiáo)"), ("Patata", "土豆 (Tǔdòu)"), ("Tomate", "西红柿 (Xīhóngshì)"), ("Cebolla", "洋葱 (Yángcōng)"),
            ("Ajo", "大蒜 (Dàsuàn)"), ("Zanahoria", "胡萝卜 (Húluóbo)"), ("Fruta", "水果 (Shuǐguǒ)"), ("Verdura", "蔬菜 (Shūcài)"),
            ("Jugo", "果汁 (Guǒzhī)"), ("Cerveza", "啤酒 (Píjiǔ)"), ("Vino", "葡萄酒 (Pútáojiǔ)"), ("Desayuno", "早餐 (Zǎocān)"),
            ("Almuerzo", "午餐 (Wǔcān)"), ("Cena", "晚餐 (Wǎncān)"), ("Postre", "甜点 (Tiándiǎn)"), ("Pastel", "蛋糕 (Dàngāo)"),
            ("Chocolate", "巧克力 (Qiǎokèlì)"), ("Helado", "冰淇淋 (Bīngqílín)"), ("Caramelo", "糖果 (Tángguǒ)"), ("Panadería", "面包店 (Miànbāodiàn)"),
            ("Comida", "食物 (Shíwù)"), ("Hambre", "饿 (È)"), ("Sed", "渴 (Kě)"), ("Delicioso", "好吃 (Hǎo chī)"),
            ("Dulce", "甜 (Tián)"), ("Salado", "咸 (Xián)"), ("Picante", "辣 (Là)"), ("Amargo", "苦 (Kǔ)")
        ],
        # Módulo 5: La Casa y Muebles (Fácil)
        [
            ("Casa", "房子 (Fángzi)"), ("Habitación", "房间 (Fángjiān)"), ("Cocina", "厨房 (Chúfáng)"), ("Baño", "浴室 (Yùshì)"),
            ("Sala de estar", "客厅 (Kètīng)"), ("Comedor", "餐厅 (Cāntīng)"), ("Puerta", "门 (Mén)"),
            ("Ventana", "窗户 (Chuānghu)"), ("Pared", "墙 (Qiáng)"), ("Techo", "天花板 (Tiānhuābǎn)"), ("Suelo", "地板 (Dìbǎn)"),
            ("Llave", "钥匙 (Yàoshi)"), ("Mesa", "桌子 (Zhuōzi)"), ("Silla", "椅子 (Yǐzi)"), ("Cama", "床 (Chuáng)"),
            ("Sofá", "沙发 (Shāfā)"), ("Armario", "衣柜 (Yīguì)"), ("Escritorio", "书桌 (Shūzhuō)"), ("Lámpara", "灯 (Dēng)"),
            ("Espejo", "镜子 (Jìngzi)"), ("Cuadro", "画 (Huà)"), ("Alfombra", "地毯 (Dìtǎn)"), ("Cortina", "窗帘 (Chuānglián)"),
            ("Refrigerador", "冰箱 (Bīngxiāng)"), ("Horno", "烤箱 (Kǎoxiāng)"), ("Microondas", "微波炉 (Wēibōlú)"),
            ("Lavadora", "洗衣机 (Xǐyījī)"), ("Fregadero", "水槽 (Shuǐcáo)"), ("Grifo", "水龙头 (Shuǐlóngtóu)"), ("Ducha", "淋浴 (Línyù)"),
            ("Bañera", "浴缸 (Yùgāng)"), ("Inodoro", "马桶 (Mǎtǒng)"), ("Toalla", "毛巾 (Máojīn)"), ("Sábana", "床单 (Chuángdān)"),
            ("Almohada", "枕头 (Zhěntou)"), ("Televisión", "电视 (Diànshì)"), ("Plato", "盘子 (Pánzi)"),
            ("Vaso", "玻璃杯 (Bōlibēi)"), ("Taza", "杯子 (Bēizi)"), ("Tenedor", "叉子 (Chāzi)"), ("Cuchillo", "刀子 (Dāozi)"),
            ("Cuchara", "勺子 (Sháozi)"), ("Basura", "垃圾 (Lājī)"), ("Jardín", "花园 (Huāyuán)"), ("Garaje", "车库 (Chēkù)"),
            ("Escaleras", "楼梯 (Lóutī)"), ("Balcón", "阳台 (Yángtái)"), ("Piso", "楼层 (Lóucéng)"), ("Pasillo", "走廊 (Zǒuláng)"), ("Entrada", "门口 (Ménkǒu)")
        ],
        # Módulo 6: El Cuerpo Humano (Fácil)
        [
            ("Cabeza", "头 (Tóu)"), ("Pelo", "头发 (Tóufa)"), ("Cara", "脸 (Liǎn)"), ("Ojo", "眼睛 (Yǎnjing)"),
            ("Nariz", "鼻子 (Bízi)"), ("Boca", "嘴 (Zuǐ)"), ("Diente", "牙齿 (Yáchǐ)"), ("Lengua", "舌头 (Shétou)"),
            ("Oreja", "耳朵 (Ěrduo)"), ("Cuello", "脖子 (Bózi)"), ("Hombro", "肩膀 (Jiānbǎng)"), ("Brazo", "手臂 (Shǒubì)"),
            ("Codo", "手肘 (Shǒuzhǒu)"), ("Muñeca", "手腕 (Shǒuwàn)"), ("Mano", "手 (Shǒu)"), ("Dedo", "手指 (Shǒuzhǐ)"),
            ("Pecho", "胸部 (Xiōngbù)"), ("Espalda", "背 (Bèi)"), ("Estómago", "肚子 (Dùzi)"), ("Cintura", "腰 (Yāo)"),
            ("Pierna", "腿 (Tuǐ)"), ("Rodilla", "膝盖 (Xīgài)"), ("Tobillo", "脚踝 (Jiǎohuái)"),
            ("Pie", "脚 (Jiǎo)"), ("Piel", "皮肤 (Pífū)"), ("Hueso", "骨头 (Gǔtou)"), ("Sangre", "血液 (Xuèyè)"), ("Corazón", "心脏 (Xīnzàng)"),
            ("Cerebro", "大脑 (Dànǎo)"), ("Pulmón", "肺 (Fèi)"), ("Garganta", "喉咙 (Hóulóng)"), ("Uña", "指甲 (Zhījia)"),
            ("Frente", "前额 (Qián'é)"), ("Mejilla", "脸颊 (Liǎnjiá)"), ("Labio", "嘴唇 (Zuǐchún)"), ("Barbilla", "下巴 (Xiàba)"),
            ("Cuerpo", "身体 (Shēntǐ)"), ("Salud", "健康 (Jiànkāng)"), ("Fuerza", "力量 (Lìliàng)"), ("Dolor", "疼痛 (Téngtòng)"),
            ("Respirar", "呼吸 (Hūxī)"), ("Ver", "看 (Kàn)"), ("Oír", "听 (Tīng)"), ("Tocar", "摸 (Mō)"),
            ("Oler", "闻 (Wén)"), ("Saborear", "尝 (Cháng)"), ("Caminar", "走路 (Zǒulù)"), ("Correr", "跑步 (Pǎobù)"),
            ("Codo", "肘 (Zhǒu)"), ("Tobillo", "踝 (Huái)")
        ],
        # Módulo 7: Colores y Ropa (Fácil)
        [
            ("Rojo", "红色 (Hóngsè)"), ("Azul", "蓝色 (Lánsè)"), ("Verde", "绿色 (Lǜsè)"), ("Amarillo", "黄色 (Huángsè)"),
            ("Negro", "黑色 (Hēisè)"), ("Blanco", "白色 (Báisè)"), ("Gris", "灰色 (Huīsè)"), ("Marrón", "棕色 (Zōngsè)"),
            ("Rosa", "粉红色 (Fěnhóngsè)"), ("Naranja", "橙色 (Chéngsè)"), ("Morado", "紫色 (Zǐsè)"), ("Ropa", "衣服 (Yīfu)"),
            ("Camisa", "衬衫 (Chènshān)"), ("Camiseta", "T恤 (T-xù)"), ("Pantalones", "裤子 (Kùzi)"),
            ("Vestido", "连衣裙 (Liányīqún)"), ("Falda", "裙子 (Qúnzi)"), ("Chaqueta", "夹克 (Jiákè)"), ("Abrigo", "大衣 (Dàyī)"),
            ("Suéter", "毛衣 (Máoyī)"), ("Zapatos", "鞋子 (Xiézi)"), ("Botas", "靴子 (Xuēzi)"), ("Sandalias", "凉鞋 (Liángxié)"),
            ("Calcetines", "袜子 (Wàzi)"), ("Ropa interior", "内衣 (Nèiyī)"), ("Sombrero", "帽子 (Màozi)"),
            ("Gorra", "鸭舌帽 (Yāshémào)"), ("Bufanda", "围巾 (Wéijīn)"), ("Guantes", "手套 (Shǒutào)"), ("Cinturón", "皮带 (Pídài)"),
            ("Corbata", "领带 (Lǐngdài)"), ("Bolso", "包包 (Bāobao)"), ("Gafas", "眼镜 (Yǎnjìng)"), ("Reloj", "手表 (Shǒubiǎo)"),
            ("Paraguas", "雨伞 (Yǔsǎn)"), ("Botón", "纽扣 (Niǔkòu)"), ("Bolsillo", "口袋 (Kǒudài)"), ("Algodón", "棉 (Mián)"),
            ("Lana", "羊毛 (Yángmáo)"), ("Seda", "丝绸 (Sīchóu)"), ("Cuero", "皮革 (Pígé)"), ("Llevar puesto", "穿 (Chuān)"),
            ("Vestirse", "穿衣服 (Chuān yīfu)"), ("Quitarse ropa", "脱衣服 (Tuō yīfu)"), ("Comprar", "买 (Mǎi)"),
            ("Probarse", "试穿 (Shìchuān)"), ("Talla", "尺码 (Chǐmǎ)"), ("Color", "颜色 (Yánsè)"), ("Moda", "时尚 (Shíshàng)"), ("Estilo", "风格 (Fēnggé)")
        ],
        # Módulo 8: Clima y Naturaleza (Fácil)
        [
            ("Sol", "太阳 (Tàiyáng)"), ("Lluvia", "雨 (Yǔ)"), ("Nieve", "雪 (Xuě)"), ("Viento", "风 (Fēng)"), ("Nube", "云 (Yún)"),
            ("Cielo", "天空 (Tiānkōng)"), ("Estrella", "星星 (Xīngxing)"), ("Luna", "月亮 (Yuèliang)"), ("Clima", "天气 (Tiānqì)"),
            ("Calor", "热 (Rè)"), ("Frío", "冷 (Lěng)"), ("Temperatura", "温度 (Wēndù)"), ("Tormenta", "暴风雨 (Bàofēngyǔ)"),
            ("Rayo", "闪电 (Shǎndiàn)"), ("Trueno", "打雷 (Dǎléi)"), ("Niebla", "雾 (Wù)"), ("Hielo", "冰 (Bīng)"),
            ("Naturaleza", "自然 (Zìrán)"), ("Árbol", "树 (Shù)"), ("Flor", "花 (Huā)"), ("Planta", "植物 (Zhíwù)"),
            ("Hierba", "草 (Cǎo)"), ("Bosque", "森林 (Sēnlín)"), ("Montaña", "山 (Shān)"), ("Colina", "小山 (Xiǎoshān)"),
            ("Río", "河 (Hé)"), ("Lago", "湖 (Hú)"), ("Mar", "海 (Hǎi)"), ("Océano", "海洋 (Hǎiyáng)"), ("Playa", "沙滩 (Shātān)"),
            ("Tierra", "土地 (Tǔdì)"), ("Piedra", "石头 (Shítou)"), ("Arena", "沙子 (Shāzi)"), ("Fuego", "火 (Huǒ)"),
            ("Aire", "空气 (Kōngqì)"), ("Mundo", "世界 (Shìjiè)"), ("Universo", "宇宙 (Yǔzhòu)"), ("Campo", "农村 (Nóngcūn)"),
            ("Desierto", "沙漠 (Shāmò)"), ("Isla", "岛屿 (Dǎoyǔ)"), ("Valle", "山谷 (Shāngǔ)"), ("Medio ambiente", "环境 (Huánjìng)"),
            ("Soleado", "晴天 (Qíngtiān)"), ("Lluvioso", "下雨天 (Xiàyǔtiān)"), ("Nublado", "阴天 (Yīntiān)"), ("Húmedo", "潮湿 (Cháoshī)"),
            ("Seco", "干燥 (Gānzào)"), ("Soplar", "刮风 (Guāfēng)"), ("Llover", "下雨 (Xiàyǔ)"), ("Nevar", "下雪 (Xiàxuě)")
        ],
        # Módulo 9: Animales Comunes (Fácil)
        [
            ("Perro", "狗 (Gǒu)"), ("Gato", "猫 (Māo)"), ("Caballo", "马 (Mǎ)"), ("Vaca", "奶牛 (Nǎiniú)"), ("Oveja", "绵羊 (Miányáng)"),
            ("Cerdo", "猪 (Zhū)"), ("Pollo", "鸡 (Jī)"), ("Gallo", "公鸡 (Gōngjī)"), ("Pájaro", "鸟 (Niǎo)"),
            ("Pez", "鱼 (Yú)"), ("Ratón", "老鼠 (Lǎoshǔ)"), ("Conejo", "兔子 (Tùzi)"), ("León", "狮子 (Shīzi)"),
            ("Tigre", "老虎 (Lǎohǔ)"), ("Oso", "熊 (Xióng)"), ("Elefante", "大象 (Dàxiàng)"), ("Mono", "猴子 (Hóuzi)"),
            ("Lobo", "狼 (Láng)"), ("Zorro", "狐狸 (Húli)"), ("Águila", "老鹰 (Lǎoyīng)"), ("Pato", "鸭子 (Yāzi)"),
            ("Tortuga", "乌龟 (Wūguī)"), ("Rana", "青蛙 (Qīngwā)"), ("Serpiente", "蛇 (Shé)"), ("Lagarto", "蜥蜴 (Xīyì)"),
            ("Insecto", "昆虫 (Kūnchóng)"), ("Mosca", "苍蝇 (Cāngying)"), ("Mosquito", "蚊子 (Wénzi)"), ("Abeja", "蜜蜂 (Mìfēng)"),
            ("Mariposa", "蝴蝶 (Húdié)"), ("Araña", "蜘蛛 (Zhīzhū)"), ("Hormiga", "蚂蚁 (Mǎyǐ)"), ("Tiburón", "鲨鱼 (Shāyú)"),
            ("Delfín", "海豚 (Hǎitún)"), ("Ballena", "鲸鱼 (Jīngyú)"), ("Cangrejo", "螃蟹 (Pángxiè)"), ("Caballo de mar", "海马 (Hǎimǎ)"),
            ("Pulpo", "章鱼 (Zhāngyú)"), ("Animal", "动物 (Dòngwù)"), ("Mascota", "宠物 (Chǒngwù)"), ("Granja", "农场 (Nóngchǎng)"),
            ("Zoo", "动物园 (Dòngwùyuán)"), ("Selva", "丛林 (Cónglín)"), ("Salvaje", "野生 (Yěshēng)"), ("Doméstico", "驯养 (Xùnyǎng)"),
            ("Alimentar", "喂养 (Wèiyǎng)"), ("Cazar", "打猎 (Dǎliè)"), ("Volar", "飞 (Fēi)"), ("Nadar", "游泳 (Yóuyǒng)"), ("Ladrar", "狗叫 (Gǒu jiào)")
        ],
        # Módulo 10: Adjetivos Básicos (Fácil)
        [
            ("Grande", "大 (Dà)"), ("Pequeño", "小 (Xiǎo)"), ("Bueno", "好 (Hǎo)"), ("Malo", "坏 (Huài)"),
            ("Hermoso", "漂亮 (Piàoliang)"), ("Feo", "难看 (Nánkàn)"), ("Nuevo", "新 (Xīn)"), ("Viejo", "旧 (Jiù)"),
            ("Joven", "年轻 (Niánqīng)"), ("Fácil", "容易 (Róngyì)"), ("Difícil", "难 (Nán)"), ("Rápido", "快 (Kuài)"),
            ("Lento", "慢 (Màn)"), ("Caliente", "热 (Rè)"), ("Frío", "冷 (Lěng)"), ("Limpio", "干净 (Gānjìng)"),
            ("Sucio", "脏 (Zāng)"), ("Rico", "富有 (Fùyǒu)"), ("Pobre", "贫穷 (Pínqióng)"), ("Lleno", "满 (Mǎn)"),
            ("Vacío", "空 (Kōng)"), ("Fuerte", "强壮 (Qiángzhuàng)"), ("Débil", "虚弱 (Xūruò)"), ("Pesado", "重 (Zhòng)"),
            ("Ligero", "轻 (Qīng)"), ("Alto", "高 (Gāo)"), ("Bajo", "矮 (Ǎi)"), ("Largo", "长 (Cháng)"),
            ("Corto", "短 (Duǎn)"), ("Ancho", "宽 (Kuān)"), ("Estrecho", "窄 (Zhǎi)"), ("Abierto", "开 (Kāi)"),
            ("Cerrado", "关 (Guān)"), ("Feliz", "快乐 (Kuàilè)"), ("Triste", "难过 (Nánguò)"), ("Inteligente", "聪明 (Cōngming)"),
            ("Divertido", "有趣 (Yǒuqù)"), ("Aburrido", "无聊 (Wúliáo)"), ("Caro", "贵 (Guì)"), ("Barato", "便宜 (Piányi)"),
            ("Seguro", "安全 (Ānquán)"), ("Peligroso", "危险 (Wēixiǎn)"), ("Importante", "重要 (Zhòngyào)"), ("Perfecto", "完美 (Wánměi)"),
            ("Correcto", "对 (Duì)"), ("Incorrecto", "错 (Cuò)"), ("Mismo", "一样 (Yīyàng)"), ("Diferente", "不同 (Bùtóng)"),
            ("Libre", "自由 (Zìyóu)"), ("Ocupado", "忙 (Máng)")
        ]
    ],
    "travel": [
        # Módulo 1: En el Aeropuerto (Fácil-Medio)
        [
            ("Pasaporte", "护照 (Hùzhào)"), ("Vuelo", "航班 (Hángbān)"), ("Equipaje", "行李 (Xíngli)"), ("Maleta", "行李箱 (Xínglixiāng)"),
            ("Aeropuerto", "机场 (Jīchǎng)"), ("Boleto", "机票 (Jīpiào)"), ("Tarjeta de embarque", "登机牌 (Dēngjīpái)"),
            ("Seguridad", "安检 (Ānjiǎn)"), ("Aduana", "海关 (Hǎiguān)"), ("Puerta de embarque", "登机口 (Dēngjīkǒu)"),
            ("Terminal", "航站楼 (Hángzhànlóu)"), ("Pasajero", "旅客 (Lǚkè)"), ("Piloto", "飞行员 (Fēixíngyuán)"), ("Azafata", "空姐 (Kōngjiě)"),
            ("Avión", "飞机 (Fēijī)"), ("Despegue", "起飞 (Qǐfēi)"), ("Aterrizaje", "降落 (Jiàngluò)"), ("Retraso", "延误 (Yánwù)"),
            ("Conexión", "转机 (Zhuǎnjī)"), ("Sala VIP", "贵宾室 (Guìbīnshì)"), ("Llegadas", "到达 (Dàodá)"),
            ("Salidas", "出发 (Chūfā)"), ("Báscula", "称重处 (Chēngzhòngchù)"), ("Exceso de equipaje", "行李超重 (Xíngli chāozhòng)"),
            ("Control de pasaportes", "护照检查 (Hùzhào jiǎnchá)"), ("Visa", "签证 (Qiānzhèng)"), ("Turista", "游客 (Yóukè)"),
            ("Declarar", "申报 (Shēnbào)"), ("Objetos de valor", "贵重物品 (Guìzhòng wùpǐn)"), ("Perdido", "丢失 (Diūshī)"),
            ("Equipaje de mano", "手提行李 (Shǒutí xíngli)"), ("Escala", "经停 (Jīngtíng)"), ("Clase ejecutiva", "商务舱 (Shāngwùcāng)"),
            ("Reservar", "预订 (Yùdìng)"), ("Cancelar", "取消 (Qǔxiāo)"), ("Confirmar", "确认 (Quèrèn)"),
            ("Viajar", "旅游 (Lǚyóu)"), ("Embarcar", "登机 (Dēngjī)"), ("Volar", "飞 (Fēi)"), ("Facturar equipaje", "托运行李 (Tuōyùn xíngli)"),
            ("Asiento", "座位 (Zuòwèi)"), ("Pasillo", "过道 (Guòdào)"), ("Ventana", "靠窗 (Kàochuāng)"), ("Cinturón de seguridad", "安全带 (Ānquándài)"),
            ("Pantalla de información", "信息屏 (Xìnxīpíng)"), ("Reclamación de equipaje", "行李领取处 (Xíngli lǐngqǔchù)"),
            ("Oficina de turismo", "游客咨询处 (Yóukè zīxúnchù)"), ("Mapa de la ciudad", "市区地图 (Shìqū dìtú)"),
            ("Moneda", "货币 (Huòbì)"), ("Cambio de divisas", "外币兑换处 (Wàibì duìhuànchù)")
        ],
        # Módulo 2: En el Hotel (Fácil-Medio)
        [
            ("Reserva", "预订 (Yùdìng)"), ("Habitación", "房间 (Fángjiān)"), ("Llave", "钥匙 (Yàoshi)"), ("Recepción", "前台 (Qiántái)"),
            ("Recepcionista", "接待员 (Jiēdàiyuán)"), ("Huésped", "客人 (Kèrén)"), ("Botones", "行李员 (Xíngliyúan)"),
            ("Ascensor", "电梯 (Diàntī)"), ("Cama matrimonial", "双人床 (Shuāngrénchuáng)"), ("Cama individual", "单人床 (Dānrénchuáng)"),
            ("Baño privado", "独立卫浴 (Dúlì wèiyù)"), ("Aire acondicionado", "空调 (Kōngtiáo)"),
            ("Calefacción", "暖气 (Nuǎnqì)"), ("Servicio de habitaciones", "客房服务 (Kèfáng fúwù)"),
            ("Desayuno incluido", "含早餐 (Hán zǎocān)"), ("Piscina", "游泳池 (Yóuyǒngchí)"), ("Gimnasio", "健身房 (Jiànshēnfáng)"),
            ("Wi-Fi gratis", "免费无线网 (Miǎnfèi wúxiànwǎng)"), ("Caja fuerte", "保险箱 (Bǎoxiǎnxiāng)"), ("Minibar", "迷你吧 (Mínǐbā)"),
            ("Vista al mar", "海景 (Hǎijǐng)"), ("Factura", "账单 (Zhàngdān)"), ("Tarjeta de crédito", "信用卡 (Xìnyòngkǎ)"),
            ("Efectivo", "现金 (Xiànjīn)"), ("Firmar", "签字 (Qiānzì)"), ("Registrarse", "办理入住 (Bànlǐ rùzhù)"),
            ("Salir del hotel", "退房 (Tuìfáng)"), ("Toalla limpia", "干净毛巾 (Gānjìng máojīn)"),
            ("Manta", "毯子 (Tǎnzi)"), ("Almohada extra", "多余枕头 (Duōyú zhěntou)"), ("Jabón", "肥皂 (Féizào)"),
            ("Champú", "洗发水 (Xǐfàshuǐ)"), ("Secador de pelo", "吹风机 (Chuīfēngjī)"), ("Limpieza", "打扫 (Dǎsǎo)"),
            ("Queja", "投诉 (Tóusù)"), ("Ruido", "噪音 (Zàoyīn)"), ("Tranquilo", "安静 (Ānjìng)"), ("Estacionamiento", "停车场 (Tíngchēcháng)"),
            ("Llave electrónica", "房卡 (Fángkǎ)"), ("Equipaje", "行李 (Xíngli)"), ("Pasaporte", "护照 (Hùzhào)"),
            ("Despertador", "闹钟 (Nàozhōng)"), ("Hacer la maleta", "收拾行李 (Shōushi xíngli)"), ("Deshacer la maleta", "打开行李 (Dǎkāi xíngli)"),
            ("Piso", "楼层 (Lóucéng)"), ("Entrada", "大堂 (Dàtáng)"), ("Salida de emergencia", "紧急出口 (Jǐnjí chūkǒu)"),
            ("Folleto", "手册 (Shǒucè)"), ("Recomendar", "推荐 (Tuījiàn)"), ("Estadía", "停留 (Tíngliú)")
        ],
        # Módulo 3: Medios de Transporte (Fácil-Medio)
        [
            ("Tren", "火车 (Huǒchē)"), ("Autobús", "公交车 (Gōngjiāochē)"), ("Coche", "汽车 (Qìchē)"), ("Bicicleta", "自行车 (Zìxíngchē)"),
            ("Metro", "地铁 (Dìtiě)"), ("Taxi", "出租车 (Chūzūchē)"), ("Motocicleta", "摩托车 (Mótuōchē)"), ("Tranvía", "有轨电车 (Yǒuguǐ diànchē)"),
            ("Barco", "船 (Chuán)"), ("Ferry", "渡轮 (Dùlún)"), ("Estación de tren", "火车站 (Huǒchēzhàn)"), ("Parada de autobús", "公交车站 (Gōngjiāochē zhàn)"),
            ("Conductor", "司机 (Sījī)"), ("Pasajero", "乘客 (Chéngkè)"), ("Boleto de viaje", "车票 (Chēpiào)"),
            ("Tarifa", "票价 (Piàojià)"), ("Horario", "时刻表 (Shíkèbiǎo)"), ("Línea", "线路 (Xiànlù)"), ("Ruta", "路线 (Lùxiàn)"),
            ("Mapa de rutas", "路线图 (Lùxiàntú)"), ("Taquilla", "售票处 (Shòupiàochù)"), ("Máquina expendedora", "自动售票机 (Zìdòng shòupiàojī)"),
            ("Andén", "站台 (Zhàntái)"), ("Vía", "铁轨 (Tiěguǐ)"), ("Destino", "目的地 (Mùdìdì)"), ("Origen", "出发地 (Chūfādì)"),
            ("Viaje de ida", "单程票 (Dānchéngpiào)"), ("Viaje de ida y vuelta", "往返票 (Wǎngfǎnpiào)"),
            ("Alquiler de coches", "租车 (Zūchē)"), ("Licencia de conducir", "驾驶执照 (Jiàshǐ zhízhào)"),
            ("Gasolinera", "加油站 (Jiāyóuzhàn)"), ("Carretera", "公路 (Gōnglù)"), ("Autopista", "高速公路 (Gāosù gōnglù)"),
            ("Tráfico", "交通 (Jiāotōng)"), ("Semáforo", "红绿灯 (Hónglǜdēng)"), ("Paso de peatones", "人行横道 (Rénxínghéngdào)"),
            ("Peaje", "收费站 (Shōufèizhàn)"), ("Aparcamiento", "停车场 (Tíngchēcháng)"), ("Conducir", "开车 (Kāichē)"), ("Caminar", "步行 (Bùxíng)"),
            ("Perder el autobús", "错过公交车 (Cuòguò gōngjiāochē)"), ("Subir al tren", "上火车 (Shàng huǒchē)"),
            ("Bajar del tren", "下火车 (Xià huǒchē)"), ("Transbordo", "换乘 (Huànchéng)"),
            ("A tiempo", "准时 (Zhǔnshí)"), ("Retrasado", "晚点 (Wǎndiǎn)"), ("Cancelado", "取消 (Qǔxiāo)"),
            ("Asiento reservado", "预留座位 (Yùliú zuòwèi)"), ("Equipaje de mano", "手提行李 (Shǒutí xíngli)"), ("Viajero", "旅行者 (Lǚxíngzhě)")
        ],
        # Módulo 4: Direcciones y Orientación (Fácil-Medio)
        [
            ("Derecha", "右边 (Yòubian)"), ("Izquierda", "左边 (Zuǒbian)"), ("Recto", "直走 (Zhí zǒu)"), ("Girar", "转弯 (Zhuǎnwān)"),
            ("Esquina", "拐角 (Guǎijiǎo)"), ("Cruce", "十字路口 (Shízìlùkǒu)"), ("Semáforo", "红绿灯 (Hónglǜdēng)"), ("Calle", "街道 (Jiēdào)"),
            ("Avenida", "大道 (Dàdào)"), ("Plaza", "广场 (Guǎngcháng)"), ("Mapa", "地图 (Dìtú)"), ("Brújula", "指南针 (Zhǐnánzhēn)"),
            ("Dirección", "方向 (Fāngxiàng)"), ("Norte", "北 (Běi)"), ("Sur", "南 (Nán)"), ("Este", "东 (Dōng)"), ("Oeste", "西 (Xī)"),
            ("Cerca", "近 (Jìn)"), ("Lejos", "远 (Yuǎn)"), ("Aquí", "这里 (Zhèlǐ)"), ("Allí", "那里 (Nàlǐ)"),
            ("Al lado de", "在...旁边 (Zài...pángbiān)"), ("Enfrente de", "在...对面 (Zài...duìmiàn)"), ("Detrás de", "在...后面 (Zài...hòumiàn)"),
            ("Delante de", "在...前面 (Zài...qiánmiàn)"), ("Entre", "在...之间 (Zài...zhījiān)"), ("Cruzar la calle", "过马路 (Guò mǎlù)"),
            ("Perderse", "迷路 (Mílù)"), ("Preguntar el camino", "问路 (Wènlù)"),
            ("Mostrar el camino", "指路 (Zhǐlù)"), ("Seguir las señales", "跟着指示牌 (Gēnzhe zhǐshìpái)"),
            ("Señal de tráfico", "交通标志 (Jiāotōng biāozhì)"), ("GPS", "导航 (Dǎoháng)"), ("Dirección postal", "地址 (Dìzhǐ)"),
            ("Bloque", "街区 (Jiēqū)"), ("Puente", "桥 (Qiáo)"), ("Túnel", "隧道 (Suìdào)"), ("Estación", "车站 (Chēzhàn)"),
            ("Parada", "站 (Zhàn)"), ("Buscar", "寻找 (Xúnzhǎo)"), ("Encontrar", "找到 (Zhǎodào)"), ("Llegar", "到达 (Dàodá)"),
            ("Partir", "出发 (Chūfā)"), ("Ruta más rápida", "最快路线 (Zuì kuài lùxiàn)"), ("Peatón", "行人 (Xíngrén)"),
            ("Zona peatonal", "步行街 (Bùxíngjiē)"), ("Pérdida", "迷失 (Míshī)"), ("Ubicación", "位置 (Wèizhì)"),
            ("Distancia", "距离 (Jùlí)"), ("Kilómetro", "公里 (Gōnglǐ)")
        ],
        # Módulo 5: En la Ciudad (Fácil-Medio)
        [
            ("Ciudad", "城市 (Chéngshì)"), ("Centro de la ciudad", "市中心 (Shì zhōngxīn)"), ("Calle peatonal", "步行街 (Bùxíngjiē)"),
            ("Edificio", "大楼 (Dàlóu)"), ("Rascacielos", "摩天大楼 (Mótiān dàlóu)"), ("Monumento", "纪念碑 (Jìniànbēi)"),
            ("Museo", "博物馆 (Bówùguǎn)"), ("Iglesia", "教堂 (Jiàotáng)"), ("Catedral", "大教堂 (Dàjiàotáng)"), ("Parque", "公园 (Gōngyuán)"),
            ("Banco", "银行 (Yínháng)"), ("Cajero automático", "自动取款机 (Zìdòng qǔkuǎnjī)"),
            ("Supermercado", "超级市场 (Chāojí shìcháng)"), ("Tienda de ropa", "服装店 (Fúzhuāngdiàn)"),
            ("Farmacia", "药店 (Yàodiàn)"), ("Hospital", "医院 (Yīyuàn)"), ("Oficina de correos", "邮局 (Yóujú)"),
            ("Estación de policía", "警察局 (Jǐngchá jú)"), ("Ayuntamiento", "市政厅 (Shìzhèngtīng)"),
            ("Biblioteca", "图书馆 (Túshūguǎn)"), ("Teatro", "剧院 (Jùyuàn)"), ("Cine", "电影院 (Diànyǐngyuàn)"),
            ("Restaurante", "餐馆 (Cānguǎn)"), ("Cafetería", "咖啡馆 (Kāfēiguǎn)"), ("Bar", "酒吧 (Jiǔbā)"),
            ("Mercado", "市场 (Shìcháng)"), ("Panadería", "面包店 (Miànbāodiàn)"), ("Quiosco", "报摊 (Bàotān)"),
            ("Hotel", "酒店 (Jiǔdiàn)"), ("Atracción turística", "旅游景点 (Lǚyóu jǐngdiǎn)"), ("Guía turístico", "导游 (Dǎoyóu)"),
            ("Tour de la ciudad", "城市观光 (Chéngshì guānguāng)"), ("Entrada", "门票 (Ménpiào)"), ("Precio", "价格 (Jiàgé)"),
            ("Horario de apertura", "营业时间 (Yíngyè shíjiān)"), ("Abierto", "营业中 (Yíngyèzhōng)"), ("Cerrado", "打烊 (Dǎyàng)"),
            ("Descuento", "打折 (Dǎzhé)"), ("Gratis", "免费 (Miǎnfèi)"), ("Barrio", "社区 (Shèqū)"), ("Acera", "人行道 (Rénxíngdào)"),
            ("Papelera", "垃圾桶 (Lājītǒng)"), ("Fuente", "喷泉 (Pēnquán)"), ("Estatua", "雕像 (Diāoxiàng)"), ("Ruta turística", "旅游路线 (Lǚyóu lùxiàn)"),
            ("Información", "咨询 (Zīxún)"), ("Cruzar", "横穿 (Héngchuān)"), ("Explorar", "探索 (Tànsuǒ)"), ("Fotografiar", "拍照 (Pāizhào)"),
            ("Cámara de fotos", "相机 (Xiàngjī)")
        ],
        # Módulo 6: En la Playa y la Naturaleza (Fácil-Medio)
        [
            ("Playa", "沙滩 (Shātān)"), ("Mar", "海 (Hǎi)"), ("Océano", "海洋 (Hǎiyáng)"), ("Arena", "沙子 (Shāzi)"), ("Ola", "海浪 (Hǎilàng)"),
            ("Sol", "太阳 (Tàiyáng)"), ("Calor", "炎热 (Yánrè)"), ("Sombrilla", "遮阳伞 (Zhēyángsǎn)"), ("Toalla de playa", "沙滩巾 (Shātānjīn)"),
            ("Traje de baño", "泳衣 (Yǒngyī)"), ("Gafas de sol", "太阳镜 (Tàiyángjìng)"),
            ("Bloqueador solar", "防晒霜 (Fángshàishuāng)"), ("Bañarse", "洗澡 (Xǐzǎo)"), ("Nadar", "游泳 (Yóuyǒng)"),
            ("Bucear", "潜水 (Qiánshuǐ)"), ("Tomar el sol", "晒太阳 (Shài tàiyáng)"), ("Concha marina", "贝壳 (Bèiké)"),
            ("Cangrejo", "螃蟹 (Pángxiè)"), ("Salvavidas", "救生员 (Jiùshēngyuán)"), ("Piscina", "游泳池 (Yóuyǒngchí)"),
            ("Veleros", "帆船 (Fānchuán)"), ("Puerto", "港口 (Gǎngkǒu)"), ("Isla", "岛屿 (Dǎoyǔ)"), ("Costa", "海岸 (Hǎi'àn)"),
            ("Acantilado", "悬崖 (Xuányá)"), ("Bosque", "森林 (Sēnlín)"), ("Sendero", "小路 (Xiǎolù)"), ("Hacer senderismo", "徒步旅行 (Túbù lǚxíng)"),
            ("Montaña", "山 (Shān)"), ("Lago", "湖泊 (Húpō)"), ("Río", "河流 (Héliú)"), ("Catarata", "瀑布 (Pùbù)"),
            ("Valle", "山谷 (Shāngǔ)"), ("Puesta de sol", "日落 (Rìluò)"), ("Amanecer", "日出 (Rìchū)"),
            ("Acampar", "露营 (Lùyíng)"), ("Tienda de campaña", "帐篷 (Zhàngpeng)"), ("Fogata", "营火 (Yínghuǒ)"),
            ("Mochila", "双肩包 (Shuāngjiānbāo)"), ("Linterna", "手电筒 (Shǒudiàntǒng)"), ("Naturaleza", "自然 (Zìrán)"),
            ("Árbol", "树木 (Shùmù)"), ("Flor", "花朵 (Huāduǒ)"), ("Pájaro", "鸟类 (Niǎolèi)"), ("Aire fresco", "新鲜空气 (Xīnxiān kōngqì)"),
            ("Clima soleado", "晴朗天气 (Qínglǎng tiānqì)"), ("Brisa marina", "海风 (Hǎifēng)"), ("Marea alta", "涨潮 (Zhàngcháo)"),
            ("Marea baja", "退潮 (Tuìcháo)"), ("Sombrilla de playa", "沙滩伞 (Shātānsǎn)")
        ],
        # Módulo 7: Emergencias de Viaje (Fácil-Medio)
        [
            ("Ayuda", "帮助 (Bāngzhù)"), ("Socorro", "救命 (Jiùmìng)"), ("Emergencia", "紧急情况 (Jǐnjí qíngkuàng)"), ("Accidente", "事故 (Shìgù)"),
            ("Hospital", "医院 (Yīyuàn)"), ("Médico", "医生 (Yīshēng)"), ("Ambulancia", "救护车 (Jiùhùchē)"), ("Policía", "警察 (Jǐngchá)"),
            ("Bomberos", "消防员 (Xiāofángyuán)"), ("Farmacia de guardia", "值班药店 (Zhíbān yàodiàn)"), ("Medicamento", "药物 (Yàowù)"),
            ("Dolor", "疼痛 (Téngtòng)"), ("Enfermo", "生病 (Shēngbìng)"), ("Herido", "受伤 (Shòushāng)"), ("Sangre", "流血 (Liúxuè)"),
            ("Robo", "盗窃 (Dàoqiè)"), ("Ladrón", "小偷 (Xiǎotōu)"), ("Carterista", "扒手 (Báshǒu)"), ("Pérdida", "丢失 (Diūshī)"),
            ("Extraviado", "迷路 (Mílù)"), ("Seguro de viaje", "旅游保险 (Lǚyóu bǎoxiǎn)"), ("Embajada", "大使馆 (Dàshǐguǎn)"),
            ("Consulado", "领事馆 (Lǐngshìguǎn)"), ("Llamada de emergencia", "紧急电话 (Jǐnjí diànhuà)"), ("Teléfono", "电话 (Diànhuà)"),
            ("Peligro", "危险 (Wēixiǎn)"), ("Seguro", "安全 (Ānquán)"), ("Fuego", "火灾 (Huǒzāi)"), ("Humo", "烟雾 (Yānwù)"),
            ("Salida de emergencia", "紧急出口 (Jǐnjí chūkǒu)"), ("Extintor", "灭火器 (Mièhuǒqì)"),
            ("Botiquín", "急救包 (Jíjiùbāo)"), ("Receta médica", "处方 (Chǔfāng)"),
            ("Alergia", "过敏 (Guòmǐn)"), ("Fiebre", "发烧 (Fāshāo)"), ("Fractura", "骨折 (Gǔzhé)"), ("Herida", "伤口 (Shāngkǒu)"),
            ("Quemadura", "烧伤 (Shāoshāng)"), ("Mareo", "头晕 (Tóuyūn)"), ("Asfixia", "窒息 (Zhìxī)"),
            ("Ayudar", "帮助 (Bāngzhù)"), ("Llamar a la policía", "报警 (Bàojǐng)"), ("Robar", "偷窃 (Tōuqiè)"),
            ("Perder el pasaporte", "丢失护照 (Diūshī hùzhào)"), ("Bloquear tarjeta", "锁卡 (Suǒ kǎ)"),
            ("Dirección de emergencia", "紧急地址 (Jǐnjí dìzhǐ)"), ("SOS", "求救信号 (Qiújiù xìnhào)"), ("Alarma", "警报 (Jǐngbào)"),
            ("Refugio", "避难所 (Bìnànsuǒ)"), ("Evacuación", "疏散 (Shūsàn)")
        ],
        # Módulo 8: Compras Turísticas (Fácil-Medio)
        [
            ("Tienda", "商店 (Shāngdiàn)"), ("Mercado", "市场 (Shìcháng)"), ("Souvenir", "纪念品 (Jìniànpǐn)"), ("Regalo", "礼物 (Lǐwù)"),
            ("Precio", "价格 (Jiàgé)"), ("¿Cuánto cuesta?", "多少钱 (Duōshao qián)"), ("Caro", "贵 (Guì)"),
            ("Barato", "便宜 (Piányi)"), ("Descuento", "打折 (Dǎzhé)"), ("Oferta", "特价 (Tèjià)"),
            ("Cajero", "收银员 (Shōuyínyuán)"), ("Caja", "收银台 (Shōuyíntái)"), ("Bolsa", "袋子 (Dàizi)"), ("Efectivo", "现金 (Xiànjīn)"),
            ("Cambio", "找零 (Zhǎolíng)"), ("Tarjeta de crédito", "信用卡 (Xìnyòngkǎ)"), ("Recibo", "收据 (Shōujù)"),
            ("Factura", "发票 (Fāpiào)"), ("Comprar", "购买 (Gòumǎi)"), ("Pagar", "付款 (Fùkuǎn)"),
            ("Probarse ropa", "试穿衣服 (Shìchuān yīfu)"), ("Probador", "试衣间 (Shìyījiān)"),
            ("Talla", "尺寸 (Chǐcùn)"), ("Color", "颜色 (Yánsè)"), ("Garantía", "保修 (Bǎoxiū)"), ("Devolución", "退货 (Tuìhuò)"),
            ("Reembolso", "退款 (Tuìkuǎn)"), ("Cliente", "顾客 (Gùkè)"), ("Vendedor", "售货员 (Shòuhuòyuán)"),
            ("Artesanía", "手工艺品 (Shǒugōngyìpǐn)"), ("Postal", "明信片 (Míngxìnpiàn)"), ("Mapa", "地图 (Dìtú)"),
            ("Guía de viaje", "旅游指南 (Lǚyóu zhǐnán)"), ("Especialidad local", "特产 (Tèchǎn)"),
            ("Comida típica", "特色美食 (Tèsè měishí)"), ("Centro comercial", "购物中心 (Gòuwù zhōngxīn)"),
            ("Supermercado", "超市 (Chāoshì)"), ("Joyas", "珠宝 (Zhūbǎo)"), ("Perfume", "香水 (Xiāngshuǐ)"),
            ("Ropa típica", "传统服饰 (Chuántǒng fúshì)"), ("Regatear", "讨价还价 (Tǎojiàhuánjià)"), ("Elegir", "选择 (Xuǎnzé)"),
            ("Calidad", "质量 (Zhìliàng)"), ("Impuestos", "税 (Shuì)"), ("Libre de impuestos", "免税 (Miǎnshuì)"),
            ("Moneda local", "本地货币 (Běndì huòbì)"), ("Propina", "小费 (Xiǎofèi)"), ("Costo total", "总费用 (Zǒng fèiyòng)"),
            ("Billetera", "钱包 (Qiánbāo)"), ("Monedero", "零钱包 (Língqiánbāo)")
        ],
        # Módulo 9: Frases en el Restaurante (Fácil-Medio)
        [
            ("Mesa", "桌子 (Zhuōzi)"), ("Reservar una mesa", "订桌 (Dìngzhuō)"), ("Menú", "菜单 (Càidān)"),
            ("Carta de vinos", "酒单 (Jiǔdān)"), ("Mesero", "服务员 (Fúwùyuán)"), ("Mesera", "女服务员 (Nǚ fúwùyuán)"),
            ("Plato", "盘子 (Pánzi)"), ("Vaso", "玻璃杯 (Bōlibēi)"), ("Copa de vino", "高脚杯 (Gāojiǎobēi)"),
            ("Agua mineral", "矿泉水 (Kuàngquánshuǐ)"), ("Pan", "面包 (Miànbāo)"), ("Cubiertos", "餐具 (Cānjù)"),
            ("Tenedor", "叉子 (Chāzi)"), ("Cuchillo", "刀子 (Dāozi)"), ("Cuchara", "勺子 (Sháozi)"),
            ("Servilleta", "餐巾纸 (Cānjīnzhǐ)"), ("Entrada", "前菜 (Qiáncài)"), ("Plato principal", "主菜 (Zhǔcài)"),
            ("Postre", "甜点 (Tiándiǎn)"), ("Café", "咖啡 (Kāfēi)"), ("Cuenta", "账单 (Zhàngdān)"),
            ("La cuenta, por favor", "买单 (Mǎidān)"), ("Propina", "小费 (Xiǎofèi)"),
            ("Pagar en efectivo", "付现金 (Fù xiànjīn)"), ("Pagar con tarjeta", "刷卡 (Shuākǎ)"),
            ("Delicioso", "美味 (Měiwèi)"), ("Excelente", "非常好 (Fēicháng hǎo)"), ("Buen provecho", "慢用 (Màn yòng)"),
            ("¡Salud!", "干杯 (Gānbēi)"), ("Agua del grifo", "自来水 (Zìláishuǐ)"), ("Vegetariano", "素食者 (Sùshízhě)"),
            ("Vegano", "纯素食者 (Chúnsùshízhě)"), ("Alergia alimentaria", "食物过敏 (Shíwù guòmǐn)"), ("Sin gluten", "无麸质 (Wú fūzhì)"),
            ("Carne bien cocida", "全熟 (Quánshú)"), ("Carne a término medio", "七分熟 (Qīfēnshú)"),
            ("Carne casi cruda", "三分熟 (Sānfēnshú)"), ("Pedir", "点菜 (Diǎncài)"), ("Recomendar", "推荐 (Tuījiàn)"),
            ("Desayuno", "早餐 (Zǎocān)"), ("Almuerzo", "午餐 (Wǔcān)"), ("Cena", "晚餐 (Wǎncān)"),
            ("Cocina típica", "本地菜 (Běndìcài)"), ("Especialidad del chef", "招牌菜 (Zhāopáicài)"),
            ("Hielo", "冰块 (Bīngkuài)"), ("Sal", "盐 (Yán)"), ("Pimienta", "胡椒 (Hújiāo)"), ("Salsa", "酱汁 (Jiàngzhī)"),
            ("Servicio incluido", "含服务费 (Hán fúwùfèi)"), ("Estrella Michelin", "米其林星级 (Mǐqílín xīngjí)")
        ],
        # Módulo 10: Clima e Incidencias de Viaje (Fácil-Medio)
        [
            ("Clima", "天气 (Tiānqì)"), ("Previsión del tiempo", "天气预报 (Tiānqì yùbào)"), ("Lluvia", "雨 (Yǔ)"),
            ("Nieve", "雪 (Xuě)"), ("Tormenta", "暴风雨 (Bàofēngyǔ)"), ("Niebla", "雾 (Wù)"), ("Viento fuerte", "大风 (Dàfēng)"),
            ("Ola de calor", "热浪 (Rèlàng)"), ("Frío extremo", "极寒 (Jíhán)"), ("Humedad", "湿度 (Shīdù)"),
            ("Retraso de vuelo", "航班延误 (Hángbān yánwù)"), ("Vuelo cancelado", "航班取消 (Hángbān qǔxiāo)"),
            ("Pérdida de equipaje", "行李丢失 (Xíngli diūshī)"), ("Equipaje dañado", "行李损坏 (Xíngli sǔnhuài)"),
            ("Pérdida de conexión", "错过转机 (Cuòguò zhuǎnjī)"), ("Huelga de transporte", "交通罢工 (Jiāotōng bàgōng)"),
            ("Tránsito pesado", "堵车 (Dǔchē)"), ("Carretera cortada", "道路封闭 (Dàolù fēngbì)"),
            ("Avería de coche", "车辆故障 (Chēliàng gùzhàng)"), ("Neumático desinflado", "爆胎 (Bàotāi)"),
            ("Falta de gasolina", "没油了 (Méi yóu le)"), ("Perder el tren", "错过火车 (Cuòguò huǒchē)"),
            ("Boleto perdido", "车票丢失 (Chēpiào diūshī)"), ("Robo de billetera", "钱包被盗 (Qiánbāo bèidào)"),
            ("Reserva no encontrada", "找不到预订 (Zhǎobùdào yùdìng)"), ("Habitación ruidosa", "房间吵闹 (Fángjiān chǎonào)"),
            ("Sin agua caliente", "没有热水 (Méiyǒu rèshuǐ)"), ("Falla de Wi-Fi", "无线网故障 (Wúxiànwǎng gùzhàng)"),
            ("Enfermedad del viajero", "旅行者生病 (Lǚxíngzhě shēngbìng)"), ("Quemadura de sol", "晒伤 (Shàishāng)"),
            ("Picadura de insecto", "昆虫叮咬 (Kūnchóng dīngyǎo)"), ("Mareo del viaje", "晕车 (Yùnchē)"),
            ("Falta de tiempo", "时间不够 (Shíjiān bùgòu)"), ("Reclamación", "投诉 (Tóusù)"),
            ("Oficina de quejas", "投诉处 (Tóusùchù)"), ("Compensación", "赔偿 (Péicháng)"),
            ("Reembolso", "退款 (Tuìkuǎn)"), ("Ayuda consular", "领事协助 (Lǐngshì xiézhù)"),
            ("Asistencia en carretera", "道路救援 (Dàolù jiùyuán)"), ("Seguro de viaje", "旅游保险 (Lǚyóu bǎoxiǎn)"),
            ("Cambiar boleto", "改签机票 (Gǎiqiān jīpiào)"), ("Servicio al cliente", "客服 (Kèfú)"),
            ("Incidencia", "事件 (Shìjiàn)"), ("Solución", "解决方案 (Jiějué fāng'àn)"), ("Esperar", "等待 (Děngdài)"),
            ("Solucionar", "解决 (Jiějué)"), ("Disculparse", "道歉 (Dàoqiàn)"), ("Comprensión", "理解 (Lǐjiě)"),
            ("Paciencia", "耐心 (Nàixīn)"), ("Buen viaje", "一路平安 (Yīlù píng'ān)")
        ]
    ],
    "business": [
        # Módulo 1: La Oficina (Medio)
        [
            ("Escritorio", "办公桌 (Bàngōngzhuō)"), ("Silla ergonómica", "人体工学椅 (Réntǐ gōngxué yǐ)"), ("Ordenador", "电脑 (Diànnǎo)"),
            ("Teclado", "键盘 (Jiànpán)"), ("Ratón", "鼠标 (Shǔbiāo)"), ("Pantalla", "屏幕 (Píngmù)"), ("Impresora", "打印机 (Dǎyìnjī)"),
            ("Escáner", "扫描仪 (Sǎomiáoyí)"), ("Fotocopiadora", "复印机 (Fùyìnjī)"), ("Papel", "纸张 (Zhǐzhāng)"),
            ("Archivo", "文件夹 (Wénjiànjiā)"), ("Archivador", "档案柜 (Dàng'ànguì)"), ("Documento", "文件 (Wénjiàn)"),
            ("Carpeta", "目录 (Mùlù)"), ("Bolígrafo", "圆珠笔 (Yuánzhūbǐ)"), ("Lápiz", "铅笔 (Qiānbǐ)"),
            ("Calculadora", "计算器 (Jìsuànqì)"), ("Teléfono de oficina", "办公电话 (Bàngōng diànhuà)"),
            ("Proyector", "投影仪 (Tóuyǐngyí)"), ("Pizarra blanca", "白板 (Báibǎn)"), ("Sala de reuniones", "会议室 (Huìyìshì)"),
            ("Sala de juntas", "董事会会议室 (Dǒngshìhuì huìyìshì)"), ("Recepción", "接待处 (Jiēdàichù)"), ("Pasillo", "走廊 (Zǒuláng)"),
            ("Cafetería", "咖啡厅 (Kāfēitīng)"), ("Compañero de trabajo", "同事 (Tóngshì)"), ("Jefe", "老板 (Lǎobǎn)"),
            ("Director", "总监 (Zǒngjiān)"), ("Gerente", "经理 (Jīnglǐ)"), ("Secretaria", "秘书 (Mìshū)"),
            ("Asistente", "助理 (Zhùlǐ)"), ("Horario de trabajo", "工作时间 (Gōngzuò shíjiān)"),
            ("Jornada laboral", "工作日 (Gōngzuòrì)"), ("Tiempo completo", "全职 (Quánzhí)"),
            ("Medio tiempo", "兼职 (Jiānzhí)"), ("Horas extras", "加班 (Jiābān)"),
            ("Pausa para el café", "咖啡时间 (Kāfēi shíjiān)"), ("Descanso", "休息 (Xiūxi)"), ("Almuerzo corporativo", "商务午餐 (Shāngwù wǔcān)"),
            ("Tarjeta de presentación", "名片 (Míngpiàn)"), ("Agenda", "议程 (Yìchéng)"), ("Correo electrónico", "电子邮件 (Diànzǐ yóujiàn)"),
            ("Bandeja de entrada", "收件箱 (Shōujiànxiāng)"), ("Enviar", "发送 (Fāsòng)"), ("Recibir", "接收 (Jiēshōu)"),
            ("Firmar", "签字 (Qiānzì)"), ("Sello", "印章 (Yìnzhāng)"), ("Grapadora", "订书机 (Dìngshūjī)"),
            ("Clips", "回形针 (Huíxíngzhēn)"), ("Trituradora de papel", "碎纸机 (Suìzhǐjī)")
        ],
        # Módulo 2: Reuniones y Juntas (Medio)
        [
            ("Reunión", "会议 (Huìyì)"), ("Convocatoria", "会议通知 (Huìyì tōngzhī)"), ("Orden del día", "议程 (Yìchéng)"),
            ("Acta de la reunión", "会议记录 (Huìyì jìlù)"), ("Participante", "参会者 (Cānhuìzhě)"),
            ("Organizador", "组织者 (Zǔzhīzhě)"), ("Presentación", "演示 (Yǎnshì)"), ("Diapositiva", "幻灯片 (Huàndēngpiàn)"),
            ("Punto clave", "要点 (Yàodiǎn)"), ("Discutir", "讨论 (Tǎolùn)"), ("Debatir", "辩论 (Biànlùn)"),
            ("Proponer", "提议 (Tíyì)"), ("Propuesta", "提案 (Tí'àn)"), ("Sugerencia", "建议 (Jiànyì)"),
            ("Opinión", "意见 (Yìjiàn)"), ("Acuerdo", "协议 (Xiéyì)"), ("Desacuerdo", "分歧 (Fēnqí)"),
            ("Llegar a un consenso", "达成共识 (Dáchéng gòngshí)"), ("Tomar una decisión", "做决定 (Zuò juédìng)"),
            ("Votar", "投票 (Tóupiào)"), ("Voto", "选票 (Xuǎnpiào)"), ("Unanimidad", "一致同意 (Yīzhì tóngyì)"), ("Minuta", "纪要 (Jìyào)"),
            ("Resumen", "总结 (Zǒngjié)"), ("Conclusión", "结论 (Jiélùn)"), ("Plan de acción", "行动计划 (Xíngdòng jìhuà)"),
            ("Fecha límite", "截止日期 (Jiézhǐ rìqī)"), ("Seguimiento", "跟进 (Gēnjìn)"), ("Videoconferencia", "视频会议 (Shìpín huìyì)"),
            ("Llamada virtual", "虚拟通话 (Xūnǐ tōnghuà)"), ("Pantalla compartida", "屏幕共享 (Píngmù gòngxiǎng)"),
            ("Micrófono", "麦克风 (Màikèfēng)"), ("Silenciar", "静音 (Jìngyīn)"), ("Interrumpir", "打断 (Dǎduàn)"),
            ("Tomar la palabra", "发言 (Fāyán)"), ("Ceder la palabra", "让发言权 (Ràng fāyánquán)"),
            ("Preguntas y respuestas", "问答环节 (Wèndá huánjié)"), ("Feedback", "反馈 (Fǎnkuì)"),
            ("Lluvia de ideas", "头脑风暴 (Tóunǎofēngbào)"), ("Aplazar", "推迟 (Tuīchí)"), ("Adelantar", "提前 (Tíqián)"),
            ("Cancelar reunión", "取消会议 (Qǔxiāo huìyì)"), ("Eficiente", "高效 (Gāoxiào)"),
            ("Productivo", "富有成效 (Fùyǒu chéngxiào)"), ("Pérdida de tiempo", "浪费时间 (Làngfèi shíjiān)"), ("Puntual", "准时 (Zhǔnshí)"),
            ("Retraso", "迟到 (Chídào)"), ("Ausencia", "缺席 (Quēxí)"), ("Presente", "出席 (Chūxí)"), ("Invitar", "邀请 (Yāoqǐng)")
        ],
        # Módulo 3: Finanzas Corporativas (Medio)
        [
            ("Presupuesto", "预算 (Yùsuàn)"), ("Ingresos", "收入 (Shōurù)"), ("Gastos", "支出 (Zhīchū)"), ("Costos", "成本 (Chéngběn)"),
            ("Ganancia", "利润 (Lìrùn)"), ("Pérdida", "亏损 (Kuīsǔn)"), ("Factura", "发票 (Fāpiào)"), ("Recibo", "收据 (Shōujù)"),
            ("Pago", "付款 (Fùkuǎn)"), ("Transferencia bancaria", "银行转账 (Yínháng zhuǎnzhàng)"), ("Cuenta bancaria", "银行账户 (Yínháng zhànghù)"),
            ("Finanzas", "财务 (Cáiwù)"), ("Inversión", "投资 (Tóuzī)"), ("Inversionista", "投资者 (Tóuzīzhě)"),
            ("Capital", "资金 (Zījīn)"), ("Flujo de caja", "现金流 (Xiànjīnliú)"), ("Balance general", "资产负债表 (Zīchǎn fùzhàibiǎo)"),
            ("Auditoría", "审计 (Shěnjì)"), ("Auditor", "审计师 (Shěnjìshī)"), ("Impuestos", "税收 (Shuìshōu)"), ("Declaración de impuestos", "报税 (Bàoshuì)"),
            ("IVA", "增值税 (Zēngzhíshuì)"), ("Rentabilidad", "盈利能力 (Yínglì nénglì)"), ("Margen de ganancia", "利润率 (Lìrùnlǜ)"),
            ("Deuda", "债务 (Zhàiwù)"), ("Préstamo", "贷款 (Dàikuǎn)"), ("Crédito", "信用 (Xìnyòng)"), ("Interés", "利息 (Lìxī)"),
            ("Tasa de interés", "利率 (Lìlǜ)"), ("Acciones", "股票 (Gǔpiào)"), ("Accionista", "股东 (Gǔdōng)"),
            ("Dividendo", "股息 (Gǔxī)"), ("Mercado de valores", "股市 (Gǔshì)"), ("Activos", "资产 (Zīchǎn)"),
            ("Pasivos", "负债 (Fùzhài)"), ("Liquidez", "流动性 (Liúdòngxìng)"), ("Quiebra", "破产 (Pòchǎn)"),
            ("Bancarrota", "倒闭 (Dǎobì)"), ("Fusión", "合并 (Hébìng)"), ("Adquisición", "收购 (Shōugòu)"),
            ("Contabilidad", "会计 (Kuàijì)"), ("Contador", "会计师 (Kuàijìshī)"), ("Gastos generales", "日常开支 (Rìcháng kāizhī)"),
            ("Reducción de costos", "降低成本 (Jiàngdī chéngběn)"), ("Facturación", "计费 (Jìfèi)"),
            ("Moneda extranjera", "外汇 (Wàihuì)"), ("Tipo de cambio", "汇率 (Huìlǜ)"),
            ("Riesgo financiero", "财务风险 (Cáiwù fēngxiǎn)"), ("Subvención", "补贴 (Bǔtiē)"), ("Patrocinio", "赞助 (Zànzhù)")
        ],
        # Módulo 4: Recursos Humanos y Empleo (Medio)
        [
            ("Contratación", "招聘 (Zhāopìn)"), ("Empleo", "就业 (Jiùyè)"), ("Puesto de trabajo", "岗位 (Gǎngwèi)"),
            ("Vacante", "空缺 (Kòngquē)"), ("Candidato", "候选人 (Hòuxuǎnrén)"), ("Currículum", "简历 (Jiǎnlì)"),
            ("Carta de presentación", "求职信 (Qiúzhí xìn)"), ("Entrevista de trabajo", "面试 (Miànshì)"),
            ("Entrevistador", "面试官 (Miànshìguān)"), ("Seleccionar", "筛选 (Shāixuǎn)"), ("Contratar", "雇佣 (Gùyōng)"),
            ("Contrato de trabajo", "劳动合同 (Láodòng hétóng)"), ("Período de prueba", "试用期 (Shìyòngqī)"),
            ("Salario", "薪水 (Xīnshuǐ)"), ("Sueldo base", "基本工资 (Jīběn gōngzī)"), ("Nómina", "工资单 (Gōngzīdān)"),
            ("Beneficios", "福利 (Fúlì)"), ("Seguro médico", "医疗保险 (Yīliáo bǎoxiǎn)"), ("Vacaciones pagadas", "带薪年假 (Dàixīn niánjià)"),
            ("Licencia de maternidad", "产假 (Chǎnjià)"), ("Licencia médica", "病假 (Bìngjià)"),
            ("Despido", "解雇 (Jiěgù)"), ("Despedir", "开除 (Kāichú)"), ("Renunciar", "辞职 (Cízhí)"),
            ("Renuncia", "辞呈 (Cíchéng)"), ("Jubilación", "退休 (Tuìxiū)"), ("Jubilarse", "退休 (Tuìxiū)"),
            ("Sindicato", "工会 (Gōnghuì)"), ("Huelga", "罢工 (Bàgōng)"), ("Formación", "培训 (Péixùn)"),
            ("Capacitación", "技能提升 (Jìnéng tíshēng)"), ("Evaluación de desempeño", "绩效评估 (Jìxiào pínggū)"),
            ("Ascenso", "晋升 (Jìnshēng)"), ("Ascender", "升职 (Shēngzhí)"), ("Transferencia", "调动 (Diàodòng)"),
            ("Recursos Humanos", "人力资源 (Rénlì zīyuán)"), ("Director de RRHH", "人力资源总监 (Rénlì zīyuán zǒngjiān)"),
            ("Plantilla", "员工总数 (Yuángōng zǒngshù)"), ("Clima laboral", "工作氛围 (Gōngzuò fēnwéi)"), ("Motivación", "动力 (Dònglì)"),
            ("Liderazgo", "领导力 (Lǐngdǎolì)"), ("Trabajo en equipo", "团队合作 (Tuánduì hézuò)"), ("Diversidad", "多样性 (Duōyàngxìng)"),
            ("Discriminación", "歧视 (Qíshì)"), ("Acoso laboral", "职场骚扰 (Zhíchǎng sāorǎo)"),
            ("Prevención de riesgos", "风险预防 (Fēngxiǎn yùfáng)"), ("Seguridad laboral", "职业安全 (Zhíyè ānquán)"),
            ("Jornada flexible", "弹性工作制 (Tánxìng gōngzuòzhì)"), ("Teletrabajo", "远程办公 (Yuǎnchéng bàngōng)"), ("Fichar", "打卡 (Dǎkǎ)")
        ],
        # Módulo 5: Negociación y Tratos (Medio)
        [
            ("Negociación", "谈判 (Tánpàn)"), ("Negociar", "谈判 (Tánpàn)"), ("Trato", "交易 (Jiāoyì)"), ("Acuerdo", "协议 (Xiéyì)"),
            ("Socio comercial", "商业伙伴 (Shāngyè huǒbàn)"), ("Cliente", "客户 (Kèhù)"), ("Proveedor", "供应商 (Gōngyìngshāng)"),
            ("Competencia", "竞争 (Jìngzhēng)"), ("Competidor", "竞争对手 (Jìngzhēng duìshǒu)"), ("Estrategia", "策略 (Cèlüè)"),
            ("Táctica", "战术 (Zhànshù)"), ("Oferta", "报价 (Bàojià)"), ("Contraoferta", "还价 (Huánjià)"),
            ("Términos del contrato", "合同条款 (Hétóng tiáokuǎn)"), ("Condiciones", "条件 (Tiáojiàn)"),
            ("Firma del contrato", "合同签字 (Hétóng qiānzì)"), ("Firmar", "签署 (Qiānshǔ)"),
            ("Cerrar el trato", "达成交易 (Dáchéng jiāoyì)"), ("Renovar contrato", "续签合同 (Xùqiān hétóng)"),
            ("Romper contrato", "终止合同 (Zhōngzhǐ hétóng)"), ("Monopolio", "垄断 (Lǒngduàn)"), ("Mercado", "市场 (Shìcháng)"),
            ("Demanda", "需求 (Xūqiú)"), ("Oferta comercial", "商业提案 (Shāngyè tí'àn)"), ("Margen de maniobra", "回旋余地 (Huíxuán yúdì)"),
            ("Punto muerto", "僵局 (Jiāngjú)"), ("Concesión", "让步 (Ràngbù)"), ("Beneficio mutuo", "互利 (Hùlì)"),
            ("Ganar-Ganar", "双赢 (Shuāngyíng)"), ("Poder de negociación", "谈判筹码 (Tánpàn chóumǎ)"),
            ("Precio de venta", "售价 (Shòujià)"), ("Descuento", "折扣 (Zhékòu)"), ("Volumen de compra", "采购量 (Cǎigòuliàng)"),
            ("Plazo de entrega", "交货期 (Jiāohuòqī)"), ("Garantía comercial", "商业担保 (Shāngyè dānbǎo)"),
            ("Penalización", "罚金 (Fájīn)"), ("Disputa", "纠纷 (Jiūfēn)"), ("Mediación", "调解 (Tiáojiě)"),
            ("Arbitraje", "仲裁 (Zhòngcái)"), ("Tribunal comercial", "商事法庭 (Shāngshì fǎtíng)"),
            ("Legal", "合法的 (Héfǎ de)"), ("Ilegal", "违法的 (Wéifǎ de)"), ("Cumplimiento", "合规 (Héguī)"),
            ("Cláusula de rescisión", "解约条款 (Jiěyuē tiáokuǎn)"), ("Confidencialidad", "保密性 (Bǎomìxìng)"),
            ("Acuerdo de no divulgación", "保密协议 (Bǎomì xiéyì)"), ("Ética empresarial", "商业道德 (Shāngyè dàodé)"),
            ("Transparencia", "透明度 (Tòumíngdù)"), ("Reputación", "声誉 (Shēngyù)"), ("Imagen de marca", "品牌形象 (Pǐnpái xíngxiàng)")
        ],
        # Módulo 6: Gestión de Proyectos (Medio)
        [
            ("Proyecto", "项目 (Xiàngmù)"), ("Gestión de proyectos", "项目管理 (Xiàngmù guǎnlǐ)"),
            ("Director de proyecto", "项目经理 (Xiàngmù jīnglǐ)"), ("Planificación", "项目规划 (Xiàngmù guīhuà)"),
            ("Cronograma", "进度表 (Jìndùbiǎo)"), ("Fase", "阶段 (Jiēduàn)"), ("Etapa", "步骤 (Bùzhòu)"),
            ("Hito", "里程碑 (Lǐchéngbēi)"), ("Fecha límite", "截止日期 (Jiézhǐ rìqī)"), ("Retraso", "延期 (Yánqī)"),
            ("Recursos", "资源 (Zīyuán)"), ("Asignación de recursos", "资源分配 (Zīyuán fēnpèi)"),
            ("Presupuesto de proyecto", "项目预算 (Xiàngmù yùsuàn)"), ("Desviación", "偏差 (Piānchā)"),
            ("Control de calidad", "质量控制 (Zhìliàng kòngzhì)"), ("Garantía de calidad", "质量保证 (Zhìliàng bǎozhèng)"),
            ("Riesgo", "风险 (Fēngxiǎn)"), ("Gestión de riesgos", "风险管理 (Fēngxiǎn guǎnlǐ)"), ("Plan de contingencia", "应急预案 (Yìngjí yù'àn)"),
            ("Entrega", "交付物 (Jiāofùwù)"), ("Entregar", "交付 (Jiāofù)"), ("Cliente final", "最终客户 (Zuìzhōng kèhù)"),
            ("Especificaciones", "规格说明 (Guīgé shuōmíng)"), ("Requisitos", "项目需求 (Xiàngmù xūqiú)"), ("Cambio de alcance", "范围变更 (Fànwéi biàngēng)"),
            ("Reunión de inicio", "启动会 (Qǐdònghuì)"), ("Progreso", "进度 (Jìndù)"), ("Informe de estado", "进度报告 (Jìndù bàogào)"),
            ("Subcontratación", "外包 (Wàibāo)"), ("Subcontratar", "外包 (Wàibāo)"), ("Socio", "合作伙伴 (Hézuò huǒbàn)"),
            ("Colaboración", "协作 (Xiézuò)"), ("Coordinación", "协调 (Xiétiáo)"), ("Equipo de proyecto", "项目团队 (Xiàngmù tuánduì)"),
            ("Metodología", "方法论 (Fāngfǎlùn)"), ("Agile", "敏捷 (Mǐnjié)"), ("Scrum", "Scrum (Scrum)"), ("Kanban", "看板 (Kànbǎn)"),
            ("Flujo de trabajo", "工作流 (Gōngzuòliú)"), ("Cuello de botella", "瓶颈 (Píngjǐng)"),
            ("Optimización", "优化 (Yōuhuà)"), ("Rendimiento", "绩效 (Jìxiào)"), ("Indicador clave", "关键指标 (Guānjiàn zhǐbiāo)"),
            ("KPI", "KPI (KPI)"), ("Éxito del proyecto", "项目成功 (Xiàngmù chénggōng)"), ("Fracaso", "失败 (Shībài)"),
            ("Evaluación", "评估 (Pínggū)"), ("Lecciones aprendidas", "经验教训 (Jīngyàn jiàoxùn)"),
            ("Cierre de proyecto", "项目收尾 (Xiàngmù shōuwěi)"), ("Archivar", "归档 (Guīdàng)")
        ],
        # Módulo 7: Liderazgo y Roles Ejecutivos (Medio)
        [
            ("Liderazgo", "领导力 (Lǐngdǎolì)"), ("Líder", "领导者 (Lǐngdǎozhě)"), ("Director General", "总经理 (Zǒngjīnglǐ)"),
            ("Presidente", "董事长 (Dǒngshìzhǎng)"), ("Vicepresidente", "副总裁 (Fù zǒngcái)"),
            ("Director Financiero", "首席财务官 (Shǒuxí cáiwùguān)"), ("Director de Operaciones", "首席运营官 (Shǒuxí yùnyíngguān)"),
            ("Director de Tecnología", "首席技术官 (Shǒuxí jìshùguān)"), ("Gerente de sucursal", "分公司经理 (Fēngōngsī jīnglǐ)"),
            ("Supervisor", "主管 (Zhǔguǎn)"), ("Coordinador", "协调员 (Xiétiáoyuán)"), ("Responsable", "负责人 (Fùzérén)"),
            ("Jefe de departamento", "部门经理 (Bùmén jīnglǐ)"), ("Mando intermedio", "中层管理人员 (Zhōngcéng guǎnlǐ rényuán)"),
            ("Ejecutivo", "高管 (Gāoguǎn)"), ("Junta directiva", "董事会 (Dǒngshìhuì)"), ("CEO", "首席执行官 (Shǒuxí zhíxíngguān)"),
            ("Autoridad", "权威 (Quánwēi)"), ("Poder", "权力 (Quánlì)"), ("Responsabilidad", "职责 (Zhízé)"),
            ("Toma de decisiones", "决策 (Juéocè)"), ("Delegar", "授权 (Shòukuán)"), ("Delegación", "代表团 (Dàibiǎotuán)"),
            ("Visión estratégica", "战略眼光 (Zhànlüè yǎnguāng)"), ("Misión de la empresa", "公司使命 (Gōngsī shǐmìng)"),
            ("Valores corporativos", "企业价值 (Qǐyè jiàzhí)"), ("Cultura de empresa", "企业文化 (Qǐyè wénhuà)"),
            ("Motivar", "激励 (Jīlì)"), ("Inspirar", "启发 (Qǐfā)"), ("Influencia", "影响力 (Yǐngxiǎnglì)"),
            ("Mentor", "导师 (Dǎoshī)"), ("Mentoría", "导师制 (Dǎoshīzhì)"), ("Coaching", "辅导 (Fǔdǎo)"),
            ("Desarrollo profesional", "职业发展 (Zhíyè fāzhǎn)"), ("Capacidad de análisis", "分析能力 (Fēnxī nénglì)"),
            ("Resolución de problemas", "解决问题 (Jiějué wèntí)"), ("Inteligencia emocional", "情商 (Qíngshāng)"),
            ("Empatía", "共情 (Gòngqíng)"), ("Comunicación asertiva", "断言沟通 (Duànyán gōutōng)"),
            ("Gestión del cambio", "变革管理 (Biàngé guǎnlǐ)"), ("Innovación", "创新 (Chuàngxīn)"),
            ("Creatividad", "创造力 (Chuàngzàolì)"), ("Objetivos estratégicos", "战略目标 (Zhànlüè mùbiāo)"),
            ("Resultados", "结果 (Jiéguǒ)"), ("Productividad", "生产力 (Shēngchǎnlì)"), ("Eficiencia", "效率 (Xiàolǜ)"),
            ("Competitividad", "竞争力 (Jìngzhēnglì)"), ("Crecimiento corporativo", "公司成长 (Gōngsī chéngzhǎng)"),
            ("Éxito ejecutivo", "管理成功 (Guǎnlǐ chénggōng)"), ("Prestigio", "声望 (Shēngwàng)")
        ],
        # Módulo 8: Ventas y Distribución (Medio)
        [
            ("Ventas", "销售 (Xiāoshòu)"), ("Volumen de ventas", "销售额 (Xiāoshòu'é)"), ("Fuerza de ventas", "销售团队 (Xiāoshòu tuánduì)"),
            ("Vendedor", "销售员 (Xiāoshòuyuán)"), ("Comercial", "商务代表 (Shāngwù dàibiǎo)"), ("Representante de ventas", "销售代表 (Xiāoshòu dàibiǎo)"),
            ("Canal de distribución", "分销渠道 (Fēnxiāo qúdào)"), ("Distribuidor", "分销商 (Fēnxiāoshāng)"),
            ("Mayorista", "批发商 (Pīfāshāng)"), ("Minorista", "零售商 (Língshòushāng)"), ("Punto de venta", "销售点 (Xiāoshòudiǎn)"),
            ("Comercio electrónico", "电子商务 (Diànzǐ shāngwù)"), ("Exportación", "出口 (Chūkǒu)"), ("Importación", "进口 (Jìnkǒu)"),
            ("Logística", "物流 (Wùliú)"), ("Cadena de suministro", "供应链 (Gōngyìngliàn)"),
            ("Transporte", "运输 (Yùnshū)"), ("Almacenamiento", "仓储 (Cāngchǔ)"), ("Almacén", "仓库 (Cāngkù)"),
            ("Inventario", "库存 (Kùcún)"), ("Control de stock", "库存控制 (Kùcún kòngzhì)"),
            ("Rotación de inventario", "库存周转 (Kùcún zhōuzhuǎn)"), ("Desabastecimiento", "缺货 (Quēhuò)"),
            ("Pedido", "订单 (Dìngdān)"), ("Procesamiento de pedidos", "订单处理 (Dìngdān chǔlǐ)"),
            ("Envío", "发货 (Fāhuò)"), ("Fecha de entrega", "交货日期 (Jiāohuò rìqī)"), ("Entrega a domicilio", "送货上门 (Sònghuò shàngmén)"),
            ("Servicio posventa", "售后服务 (Shòuhòu fúwù)"), ("Garantía", "保修 (Bǎoxiu)"),
            ("Atención al cliente", "客户服务 (Kèhù fúwù)"), ("Satisfacción del cliente", "客户满意度 (Kèhù mǎnyìdù)"),
            ("Fidelización de clientes", "客户忠诚度 (Kèhù zhōngchéngdù)"), ("Queja del cliente", "客户投诉 (Kèhù tóusù)"),
            ("Devolución de mercancía", "退货 (Tuìhuò)"), ("Reembolso", "退款 (Tuìkuǎn)"),
            ("Facturación", "开具发票 (Kāijù fāpiào)"), ("Precio unitario", "单价 (Dānjià)"),
            ("Descuento por volumen", "批量折扣 (Pīliàng zhékòu)"), ("Condiciones de pago", "付款条件 (Fùkuǎn tiáokiàn)"),
            ("Crédito comercial", "商业信用 (Shāngyè xìnyòng)"), ("Cobro", "收款 (Shōukuǎn)"), ("Impagado", "坏账 (Huàizhàng)"),
            ("Mercancía", "商品 (Shāngpǐn)"), ("Embalaje", "包装 (Bāozhuāng)"), ("Etiqueta", "标签 (Biāoqiān)"),
            ("Código de barras", "条形码 (Tiáoxíngmǎ)"), ("Seguimiento de envío", "物流跟踪 (Wùliú gēnzōng)"),
            ("Flete", "运费 (Yùnfèi)"), ("Aduanas", "海关 (海关)")
        ],
        # Módulo 9: Protocolo y Relaciones (Medio)
        [
            ("Comunicación", "沟通 (Gōutōng)"), ("Relaciones Públicas", "公共关系 (Gōnggòng guānxi)"),
            ("Comunicado de prensa", "新闻稿 (Xīnwéngǎo)"), ("Rueda de prensa", "新闻发布会 (Xīnwén fābùhuì)"),
            ("Periodista", "记者 (Jìzhě)"), ("Medios de comunicación", "媒体 (Méitǐ)"),
            ("Cobertura mediática", "媒体报道 (Méitǐ bàodào)"), ("Entrevista", "采访 (Cǎifǎng)"),
            ("Portavoz", "发言人 (Fāyánrén)"), ("Reputación corporativa", "企业声誉 (Qǐyè shēngyù)"),
            ("Imagen pública", "公众形象 (Gōngzhòng xíngxiàng)"), ("Responsabilidad social", "社会责任 (Shèhuì zérèn)"),
            ("RSE", "CSR (CSR)"), ("Crisis de reputación", "公关危机 (Gōngguān wēijī)"),
            ("Gestión de crisis", "危机管理 (Wēijī guǎnlǐ)"), ("Boletín interno", "内部通信 (Nèibù tōngxìn)"),
            ("Intranet", "内网 (Nèiwǎng)"), ("Evento corporativo", "公司活动 (Gōngsī huódòng)"), ("Patrocinio", "赞助 (Zànzhù)"),
            ("Patrocinador", "赞助商 (Zànzhùshāng)"), ("Mecenazgo", "资助 (Zīzhù)"), ("Identidad corporativa", "企业标识 (Qǐyè biāozhì)"),
            ("Manual de marca", "品牌手册 (Pǐnpái shǒucè)"), ("Slogan", "口号 (Kǒuhào)"), ("Público objetivo", "目标受众 (Mùbiāo shòuzhòng)"),
            ("Mensaje clave", "核心信息 (Héxīn xìnxī)"), ("Estrategia de comunicación", "沟通策略 (Gōutōng cèlüè)"),
            ("Campaña de RRPP", "公关活动 (Gōngguān huódòng)"), ("Lanzamiento", "发布 (Fābù)"), ("Presentación de producto", "产品发布 (Chǎnpǐn fābù)"),
            ("Feria comercial", "行业展会 (Hángyè zhǎnhuì)"), ("Exposición", "展览会 (Zhǎnlǎnhuì)"), ("Networking", "人脉拓展 (Rénmài tuòzhǎn)"),
            ("Contacto de negocios", "商务联系人 (Shāngwù liánxìrén)"), ("Relaciones institucionales", "机构关系 (Jīgòu guānxi)"),
            ("Lobby", "游说 (Yóushuì)"), ("Lobbista", "游说者 (Yóushuìzhě)"), ("Opinión pública", "舆论 (Yúlùn)"),
            ("Encuesta de opinión", "民意调查 (Mínyì diàochá)"), ("Gabinete de prensa", "新闻办 (Xīnwénbàn)"),
            ("Dossier de prensa", "新闻资料袋 (Xīnwén zīliàodài)"), ("Transmisión en vivo", "网络直播 (Wǎngluò zhíbō)"),
            ("Redes sociales corporativas", "企业社交媒体 (Qǐyè shèjiāo méitǐ)"), ("Seguidor", "粉丝 (Fěnsī)"),
            ("Comunidad virtual", "虚拟社区 (Xūnǐ shèqū)"), ("Influencer", "网红 (Wǎnghóng)"),
            ("Embajador de marca", "品牌大使 (Pǐnpái dàshǐ)"), ("Notoriedad", "知名度 (Zhīmíngdù)"),
            ("Ética de negocios", "商业道德 (Shāngyè dàodé)"), ("Guanxi (Contactos)", "关系 (Guānxi)")
        ],
        # Módulo 10: Legal y Cumplimiento (Medio)
        [
            ("Asesoría jurídica", "法律咨询 (Fǎlǜ zīxún)"), ("Abogado de empresa", "企业律师 (Qǐyè lǜshī)"),
            ("Contrato legal", "法律合同 (Fǎlǜ hétóng)"), ("Cláusula contractual", "合同条款 (Hétóng tiáokuǎn)"),
            ("Validez jurídica", "法律效力 (Fǎlǜ xiàolì)"), ("Incumplimiento de contrato", "违约 (Wéiyuē)"),
            ("Propiedad intelectual", "知识产权 (Zhīshi chǎnquán)"), ("Patente", "专利 (Zhuānlì)"),
            ("Marca registrada", "商标 (Shāngbiāo)"), ("Derechos de autor", "版权 (Bǎnquán)"),
            ("Licencia comercial", "商业许可 (Shāngyè xǔkě)"), ("Cumplimiento normativo", "合规 (Héguī)"),
            ("Regulación", "规章 (Guīzhāng)"), ("Normativa del sector", "行业规范 (Hángyè guīfàn)"),
            ("Protección de datos", "数据保护 (Shùjù bǎohù)"), ("RGPD", "GDPR (GDPR)"),
            ("Privacidad de datos", "数据隐私 (Shùjù yǐnsī)"), ("Litigio legal", "诉讼 (Sùsòng)"),
            ("Demanda judicial", "起诉 (Qǐsù)"), ("Tribunal", "法庭 (Fǎtíng)"), ("Juicio", "审判 (Shěnpàn)"),
            ("Juez", "法官 (Fǎguān)"), ("Sentencia", "判决 (Pànjué)"), ("Multa administrativa", "行政罚款 (Xíngzhèng fákuǎn)"),
            ("Sanción", "处罚 (Chǔfá)"), ("Responsabilidad civil", "民事责任 (Mínshì zérèn)"),
            ("Firma digital", "电子签名 (Diànzǐ qiānmíng)"), ("Poder notarial", "授权书 (Shòukuánshū)"),
            ("Notario", "公证人 (Gōngzhèngrén)"), ("Escritura pública", "公证书 (Gōngzhèngshū)"), ("Registro mercantil", "商业登记 (Shāngyè dēngjì)"),
            ("Constitución de sociedad", "公司注册 (Gōngsī zhùcè)"), ("Estatutos de la sociedad", "公司章程 (Gōngsī zhāngchéng)"),
            ("Asamblea general", "股东大会 (Gǔdōng dàhuì)"), ("Derecho laboral", "劳动法 (Láodòngfǎ)"),
            ("Derecho mercantil", "商法 (Shāngfǎ)"), ("Derecho fiscal", "税法 (Shuìfǎ)"),
            ("Evasión de impuestos", "逃税 (Táoshuì)"), ("Fraude", "欺诈 (Qīzhà)"), ("Corrupción", "贪污 (Tānwū)"),
            ("Blanqueo de capitales", "洗钱 (Xǐqián)"), ("Lucha contra el fraude", "反欺诈 (Fǎn qīzhà)"),
            ("Código ético", "道德守则 (Dàodé shǒuzé)"), ("Canal de denuncias", "举报渠道 (Jǔbào qúdào)"),
            ("Riesgo legal", "法律风险 (Fǎlǜ fēngxiǎn)"), ("Auditoría legal", "法律审计 (Fǎlǜ shěnjì)"), ("Arbitraje", "仲裁 (Zhòngcái)"),
            ("Jurisprudencia", "司法 interpretaciones (Sīfǎ)"), ("Seguro de responsabilidad", "责任保险 (Zérèn bǎoxiǎn)"),
            ("Liquidación de empresa", "公司清算 (Gōngsī qīngsuàn)")
        ]
    ],
    "marketing": [
        # Módulo 1: Conceptos de Marca (Medio)
        [
            ("Marca", "品牌 (Pǐnpái)"), ("Identidad de marca", "品牌形象 (Pǐnpái xíngxiàng)"), ("Imagen de marca", "品牌形象 (Pǐnpái xíngxiàng)"),
            ("Logotipo", "标志 (Biāozhì)"), ("Eslogan", "口号 (Kǒuhào)"), ("Manual de marca", "设计规范 (Shèjì guīfàn)"),
            ("Posicionamiento", "定位 (Dìngwèi)"), ("Valor de marca", "品牌价值 (Pǐnpái jiàzhí)"),
            ("Fidelidad a la marca", "品牌忠诚度 (Pǐnpái zhōngchéngdù)"), ("Reconocimiento de marca", "品牌知名度 (Pǐnpái zhīmíngdù)"),
            ("Nombre de marca", "品牌名称 (Pǐnpái míngchēng)"), ("Esencia de marca", "品牌精髓 (Pǐnpái jīngsuǐ)"),
            ("Promesa de marca", "品牌承诺 (Pǐnpái chéngnuò)"), ("Asociaciones de marca", "品牌联想 (Pǐnpái liánxiǎng)"),
            ("Extensión de marca", "品牌延伸 (Pǐnpái yánshēn)"), ("Co-branding", "联合品牌 (Liánhé pǐnpái)"),
            ("Marca propia", "自有品牌 (Zìyǒu pǐnpái)"), ("Marca blanca", "白牌 (Báipái)"),
            ("Diferenciación", "差异化 (Chāyìhuà)"), ("Ventaja competitiva", "竞争优势 (Jìngzhēng yōushì)"),
            ("Público objetivo", "目标客户 (Mùbiāo kèhù)"), ("Cliente ideal", "理想客户 (Lǐxiǎng kèhù)"), ("Buyer persona", "用户画像 (Yònghù huàxiàng)"),
            ("Segmentación", "市场细分 (Shìcháng xìfēn)"), ("Mercado objetivo", "目标市场 (Mùbiāo shìcháng)"), ("Nicho de mercado", "利基市场 (Lìjī shìcháng)"),
            ("Ciclo de vida del producto", "产品生命周期 (Chǎnpǐn shēngmìng zhōuqī)"), ("Desarrollo de producto", "产品开发 (Chǎnpǐn kāifā)"),
            ("Lanzamiento de marca", "品牌发布 (Pǐnpái fābù)"), ("Relanzamiento", "重新定位 (Chóngxīn dìngwèi)"),
            ("Estrategia de marca", "品牌策略 (Pǐnpái cèlüè)"), ("Brand manager", "品牌经理 (Pǐnpái jīnglǐ)"),
            ("Consistencia de marca", "品牌一致性 (Pǐnpái yīzhìxìng)"), ("Experiencia de marca", "品牌体验 (Pǐnpái tǐyàn)"),
            ("Punto de contacto", "接触点 (Jiēchùdiǎn)"), ("Embalaje de marca", "包装 (Bāozhuāng)"),
            ("Diseño corporativo", "企业设计 (Qǐyè shèjì)"), ("Valores de marca", "品牌价值 (Pǐnpái jiàzhí)"),
            ("Storytelling", "品牌故事 (Pǐnpái gùshi)"), ("Mensaje de marca", "品牌信息 (Pǐnpái xìnxī)"),
            ("Autenticidad de marca", "真实性 (Zhēnshíxìng)"), ("Credibilidad", "公信力 (Gōngxìnlì)"), ("Confianza", "信任 (Xìnrèn)"),
            ("Afinidad de marca", "品牌亲和力 (Pǐnpái qīnhélì)"), ("Embajador de marca", "品牌代言人 (Pǐnpái dàiyánrén)"),
            ("Evangelista de marca", "品牌布道者 (Pǐnpái bùdàozhě)"), ("Propiedad de la marca", "品牌所有权 (Pǐnpái suǒyǒuquán)"),
            ("Protección de marca", "品牌保护 (Pǐnpái bǎohù)"), ("Piratería de marca", "品牌侵权 (Pǐnpái qīnquán)"),
            ("Auditoría de marca", "品牌审计 (Pǐnpái shěnjì)")
        ],
        # Módulo 2: Publicidad y Campañas (Medio)
        [
            ("Publicidad", "广告 (Guǎnggào)"), ("Anuncio", "广告 (Guǎnggào)"), ("Campaña publicitaria", "广告活动 (Guǎnggào huódòng)"),
            ("Agencia de publicidad", "广告公司 (Guǎnggào gōngsī)"), ("Anunciante", "广告主 (Guǎnggàozhǔ)"), ("Medio publicitario", "广告媒介 (Guǎnggào méijiè)"),
            ("Medios masivos", "大众媒体 (Dàzhòng méitǐ)"), ("Publicidad exterior", "户外广告 (Hùwài guǎnggào)"),
            ("Cartel publicitario", "海报 (Hǎibào)"), ("Valla publicitaria", "路牌广告 (Lùpái guǎnggào)"),
            ("Folleto publicitario", "宣传单 (Xuānchuándān)"), ("Catálogo", "目录 (Mùlù)"), ("Spot de televisión", "电视广告 (Diànshì guǎnggào)"),
            ("Anuncio de radio", "广播广告 (Guǎngbō guǎnggào)"), ("Publicidad impresa", "印刷广告 (Yìnshuā guǎnggào)"),
            ("Publicidad digital", "数字广告 (Shùzì guǎnggào)"), ("Banner", "横幅广告 (Héngfú guǎnggào)"),
            ("Anuncio pop-up", "弹窗广告 (Tánchuāng guǎnggào)"), ("Publicidad nativa", "原生广告 (Yuánshēng guǎnggào)"),
            ("Anuncio patrocinado", "赞助链接 (Zànzhù liànjiē)"), ("Redacción publicitaria", "广告文案 (Guǎnggào wén'àn)"),
            ("Redactor creativo", "文案策划 (Wén'àn cèhuà)"), ("Director de arte", "美术指导 (Měishù zhǐdǎo)"),
            ("Presupuesto de campaña", "活动预算 (Huódòng yùsuàn)"), ("Gasto publicitario", "广告开支 (Guǎnggào kāizhī)"),
            ("ROAS", "广告支出回报率 (ROAS)"), ("Impresión publicitaria", "曝光量 (Bàoguāngliàng)"),
            ("Alcance de campaña", "覆盖面 (Fùgǎimiàn)"), ("Frecuencia", "广告频次 (Píncì)"),
            ("Costo por mil", "千次展示成本 (CPM)"), ("CPM", "CPM (CPM)"), ("Costo por clic", "单次点击成本 (CPC)"),
            ("CPC", "CPC (CPC)"), ("Costo por adquisición", "单次获取成本 (CPA)"), ("CPA", "CPA (CPA)"),
            ("Tasa de clics", "点击率 (CTR)"), ("CTR", "CTR (CTR)"), ("Punto de venta", "终端展示 (Zhōngduān zhǎnshì)"),
            ("Eslogan de campaña", "广告口号 (Guǎnggào kǒuhào)"), ("CTA", "行动 call to action (CTA)"),
            ("Llamado a la acción", "行动号召 (Xíngdòng hàozhào)"), ("Prueba A/B", "A/B 测试 (A/B cèshì)"),
            ("Público meta", "目标受众 (Mùbiāo shòuzhòng)"), ("Impacto publicitario", "广告效果 (Guǎnggào xiàoguǒ)"),
            ("Eficacia publicitaria", "广告效率 (Guǎnggào xiàolǜ)"), ("Creatividad", "创意 (Chuàngyì)"),
            ("Persuasión", "说服力 (Shuōfúlì)"), ("Mensaje publicitario", "广告信息 (Guǎnggào xìnxī)"),
            ("Regulación publicitaria", "广告监管 (Guǎnggào jiānguǎn)"), ("Ética publicitaria", "广告道德 (Guǎnggào dàodé)"),
            ("Publicidad engañosa", "虚假广告 (Xūjiǎ guǎnggào)")
        ],
        # Módulo 3: Marketing Digital y Redes Sociales (Medio)
        [
            ("Marketing Digital", "数字营销 (Shùzì yíngxiāo)"), ("Redes sociales", "社交媒体 (Shèjiāo méitǐ)"),
            ("Gestor de redes sociales", "社群运营 (Shèqún yùnyíng)"), ("Publicación", "发帖 (Fātiě)"),
            ("Post", "帖子 (Tiězi)"), ("Compartir", "分享 (Fēnxiǎng)"), ("Me gusta", "点赞 (Diǎnzàn)"),
            ("Comentario", "评论 (Pínglùn)"), ("Seguidor", "粉丝 (Fěnsī)"), ("Perfil en línea", "在线个人资料 (Zàixiàn gènrén zīliào)"),
            ("Cuenta de empresa", "企业账号 (Qǐyè zhànghào)"), ("Hashtag", "标签 (Biāoqiān)"), ("Tendencia", "趋势 (Qūshì)"),
            ("Viral", "病毒式传播 (Bìngdúshì chuánbō)"), ("Contenido viral", "病毒内容 (Contenido viral)"),
            ("Engagement", "粉丝互动 (Fěnsī hùdòng)"), ("Tasa de compromiso", "互动率 (Hùdònglǜ)"),
            ("Marketing de contenidos", "内容营销 (Nèiróng yíngxiāo)"), ("Blog de marketing", "营销博客 (Yíngxiāo bókè)"),
            ("Creador de contenidos", "内容创作者 (Nèiróng chuàngjiànzhě)"), ("Influencer", "网络红人 (Wǎngluò hóngrén)"),
            ("Embajador digital", "数字代言人 (Shùzì dàiyánrén)"), ("Red social corporativa", "企业社交网络 (Qǐyè shèjiāo wǎngluò)"),
            ("Transmisión en directo", "网络直播 (Wǎngluò zhíbō)"), ("Líder de opinión", "意见领袖 (Yìjiàn lǐngxiù)"),
            ("Seguidores activos", "活跃粉丝 (Huóyuè fěnsī)"), ("Pérdida de seguidores", "掉粉 (Diàofěn)"),
            ("Alcance orgánico", "自然覆盖率 (Zìrán fùgǎilǜ)"), ("Alcance pagado", "付费覆盖率 (Fùfèi fùgǎilǜ)"),
            ("Anuncio en redes sociales", "社交广告 (Shèjiāo guǎnggào)"), ("Administrador de anuncios", "广告管理工具 (Guǎnggào guǎnlǐ gōngjù)"),
            ("Público personalizado", "自定义受众 (Zìdìnyì shòuzhòng)"), ("Remarketing", "重定向营销 (Chóngdìngxiàng yíngxiāo)"),
            ("Segmentación digital", "数字定位 (Shùzì dìngwèi)"), ("Pixel de seguimiento", "跟踪像素 (Gēnzōng xiàngsù)"),
            ("Analítica web", "网站分析 (Wǎngzhàn fēnxī)"), ("Google Analytics", "谷歌分析 (Gǔgē fēnxī)"),
            ("Tráfico web", "网站流量 (Wǎngzhàn liúliàng)"), ("Página de aterrizaje", "落地页 (Luòdìyè)"),
            ("Tasa de rebote", "跳出率 (Tiàochūlǜ)"), ("Tiempo de permanencia", "页面停留时间 (Tíngliú shíjiān)"),
            ("Conversión digital", "数字转化 (Shùzì zhuǎnhuà)"), ("Embudo de conversión", "转化漏斗 (Zhuǎnhuà lòudǒu)"),
            ("Generación de prospectos", "潜在客户开发 (Qiánzài kèhù kāifā)"), ("Suscriptor de boletín", "邮件订阅者 (Yóujiàn dìngyuèzhě)"),
            ("Boletín digital", "电子简报 (Diànzǐ jiǎnbào)"), ("E-mailing", "邮件营销 (Yóujiàn yíngxiāo)"),
            ("Tasa de apertura", "邮件打开率 (Dǎkāilǜ)"), ("Tasa de cancelación", "退订率 (Tuìdìnglǜ)"),
            ("Reputación en línea", "网络声誉 (Wǎngluò shēngyù)")
        ],
        # Módulo 4: SEO y SEM (Medio)
        [
            ("SEO", "搜索引擎优化 (SEO)"), ("Optimización en buscadores", "搜索优化 (Sōusuǒ yōuhuà)"),
            ("SEM", "搜索引擎营销 (SEM)"), ("Marketing en buscadores", "搜索营销 (Sōusuǒ yíngxiāo)"),
            ("Palabra clave", "关键词 (Guānjiàncí)"), ("Palabra clave de cola larga", "长尾关键词 (Chángwěi guānjiàncí)"),
            ("Volumen de búsqueda", "搜索量 (Sōusuǒliàng)"), ("Dificultad de palabra clave", "关键词难度 (Guānjiàncí nándù)"),
            ("Motor de búsqueda", "搜索引擎 (Sōusuǒ yǐnqíng)"), ("Google", "谷歌 (Gǔgē)"),
            ("Resultados de búsqueda", "搜索结果 (Sōusuǒ jiéguǒ)"), ("SERP", "搜索结果页面 (SERP)"),
            ("SEO en la página", "站内 SEO (Zhànnèi SEO)"), ("SEO fuera de la página", "站外 SEO (Zhànwài SEO)"),
            ("SEO técnico", "技术性 SEO (Jìshùxìng SEO)"), ("Enlace entrante", "反向链接 (Fǎnxiàng liànjiē)"), ("Backlink", "外链 (Wàiliàn)"),
            ("Enlace interno", "内链 (Nèiliàn)"), ("Enlace externo", "外链 (Wàiliàn)"),
            ("Texto de anclaje", "锚文本 (Máo wénběn)"), ("Autoridad de dominio", "域名权重 (Yùmíng quánzhòng)"),
            ("Autoridad de página", "页面权重 (Yèmiàn quánzhòng)"), ("Indexación", "索引 (Suǒyǐn)"),
            ("Rastreo web", "抓取 (Zhuāqǔ)"), ("Algoritmo de búsqueda", "搜索算法 (Sōusuǒ suànfǎ)"),
            ("Penalización de Google", "谷歌处罚 (Gǔgē chǔfá)"), ("Contenido duplicado", "重复内容 (Chóngfù nèiróng)"),
            ("Etiqueta de título", "标题标签 (Biāotí biāoqiān)"), ("Meta descripción", "元 description (Yuán miàoshù)"),
            ("Etiqueta Alt de imagen", "图片Alt属性 (Alt shǔxìng)"), ("Etiqueta de encabezado", "H标签 (H biāoqiān)"),
            ("Velocidad de carga", "网速 (Wǎngsù)"), ("Diseño adaptable", "自适应设计 (Zìshìyìng shèjì)"),
            ("Mapa del sitio XML", "网站地图 (Wǎngzhàn dìtú)"), ("Robots.txt", "Robots文件 (Robots wénjiàn)"),
            ("Anuncio de búsqueda pagado", "竞价排名广告 (Jìngjià páimíng)"), ("Google Ads", "谷歌广告 (Gǔgē guǎnggào)"),
            ("Subasta de anuncios", "广告竞价 (Guǎnggào jìngjià)"), ("Nivel de calidad", "质量得分 (Zhìliàng défēn)"),
            ("Costo por clic máximo", "最高点击成本 (Max CPC)"), ("CPC medio", "平均点击成本 (Avg CPC)"),
            ("Red de búsqueda", "搜索网络 (Sōusuǒ wǎngluò)"), ("Red de Display", "展示广告网络 (Zhǎnshì wǎngluò)"),
            ("Extensión de anuncio", "广告附加信息 (Guǎnggào fùjiā)"), ("Grupo de anuncios", "广告组 (Guǎnggào zǔ)"),
            ("Campaña de SEM", "SEM推广 (SEM tuīguǎng)"), ("Tasa de conversión", "转化率 (Zhuǎnhuàlǜ)"),
            ("Gasto de SEM", "SEM花费 (SEM huāfèi)"), ("Retorno de inversión", "投资回报率 (ROI)"),
            ("Tráfico orgánico", "自然流量 (Zìrán liúliàng)"), ("Tráfico de pago", "付费流量 (Fùfèi liúliàng)")
        ],
        # Módulo 5: Estrategias de Contenido (Medio)
        [
            ("Estrategia de contenidos", "内容策略 (Nèiróng cèlüè)"), ("Marketing de contenidos", "内容营销 (Nèiróng yíngxiāo)"),
            ("Creador de contenidos", "内容创作者 (Nèiróng chuàngjiànzhě)"), ("Redactor de contenidos", "撰稿人 (Zhuàngǎorén)"),
            ("Editor de contenidos", "内容编辑 (Nèiróng biānjí)"), ("Calendario editorial", "内容日历 (Nèiróng rìlì)"),
            ("Planificación de contenidos", "内容规划 (Nèiróng guīhuà)"), ("Auditoría de contenidos", "内容审计 (Nèiróng shěnjì)"),
            ("Contenido de valor", "有价值内容 (Yǒu jiàzhí nèiróng)"), ("Contenido educativo", "知识型内容 (Zhīshixíng nèiróng)"),
            ("Contenido interactivo", "互动式内容 (Hùdòngshì nèiróng)"), ("Entrada de blog", "博客文章 (Bókè wénzhāng)"),
            ("Libro electrónico", "电子书 (Diànzǐshū)"), ("Infografía", "信息图表 (Xìnxī túbiǎo)"),
            ("Caso de éxito", "案例分析 (Ànlì fēnxī)"), ("Testimonio de cliente", "客户证言 (Kèhù zhèngyán)"),
            ("Video marketing", "视频营销 (Shìpín yíngxiāo)"), ("Podcast de marketing", "播客 (Bōkè)"),
            ("Seminario web", "网络研讨会 (Wǎngluò yántǎohuì)"), ("Presentación en línea", "在线演示 (Zàixiàn yǎnshì)"),
            ("Boletín informativo", "简报 (Jiǎnbào)"), ("Contenido de usuarios", "用户生成内容 (UGC)"),
            ("UGC", "UGC (UGC)"), ("Storytelling", "故事营销 (Gùshi yíngxiāo)"), ("Tono de voz", "品牌语调 (Yǔdiào)"),
            ("Línea editorial", "编辑方针 (Biānjí fāngzhēn)"), ("Curación de contenidos", "内容策划 (Nèiróng cèhuà)"),
            ("Distribución de contenidos", "内容分发 (Nèiróng fēnfā)"), ("Promoción de contenidos", "内容推广 (Nèiróng tuīguǎng)"),
            ("Reutilización de contenidos", "内容再利用 (Nèiróng zài lìyòng)"), ("Contenido perenne", "常青内容 (Chángqīng nèiróng)"),
            ("Contenido de tendencia", "热点内容 (Rèdiǎn nèiróng)"), ("Embudo de marketing", "营销漏斗 (Yíngxiāo lòudǒu)"),
            ("Contenido TOFU", "漏斗顶部内容 (TOFU)"), ("Contenido MOFU", "漏斗中部内容 (MOFU)"),
            ("Contenido BOFU", "漏斗底部内容 (BOFU)"), ("Llamado a la acción", "行动呼吁 (Xíngdòng hūyù)"),
            ("CTA", "CTA (CTA)"), ("Optimización de contenidos", "内容优化 (Nèiróng yōuhuà)"),
            ("Legibilidad", "可读性 (Kědúlìxìng)"), ("Originalidad", "原创性 (Yuánchuàngxìng)"),
            ("Propiedad del contenido", "内容版权 (Nèiróng bǎnquán)"), ("Plagio", "剽窃 (Piáoqiè)"),
            ("Autoría", "署名权 (Shǔmíngquán)"), ("Rendimiento de contenidos", "内容表现 (Nèiróng biǎoxiàn)"),
            ("Tasa de lectura", "阅读率 (Yuèdúlǜ)"), ("Tiempo de lectura", "阅读时长 (Yuèdú shícháng)"),
            ("Interacciones", "社交分享 (Shèjiāo fēnxiǎng)"), ("Valoración de contenidos", "内容评分 (Nèiróng píngfēn)"),
            ("Comentarios del lector", "读者评论 (Dúzhě pínglùn)")
        ],
        # Módulo 6: Métricas y KPIs de Marketing (Medio)
        [
            ("Métrica", "指标 (Zhǐbiāo)"), ("Indicador clave de rendimiento", "关键绩效指标 (KPI)"),
            ("KPI de marketing", "营销KPI (Yíngxiāo KPI)"), ("ROI de marketing", "营销投资回报率 (ROI)"),
            ("Tasa de conversión", "转化率 (Zhuǎnhuàlǜ)"), ("Tasa de clics", "点击率 (Diǎnjīlǜ)"),
            ("Costo por adquisición", "获取成本 (CPA)"), ("Costo por lead", "线索成本 (CPL)"),
            ("Valor de vida del cliente", "客户生命周期价值 (LTV)"), ("Costo de adquisición", "客户获取成本 (CAC)"),
            ("Tasa de retención", "客户留存率 (Liúcúnlǜ)"), ("Tasa de abandono", "流失率 (Liúshīlǜ)"),
            ("Tasa de rebote web", "跳出率 (Tiàochūlǜ)"), ("Tráfico web", "网站访问量 (Wǎngzhàn fǎngwènliàng)"),
            ("Visitas a la página web", "页面浏览量 (PV)"), ("Sesión web", "网站会话 (Huìhuà)"),
            ("Usuario único", "独立访客 (UV)"), ("Tiempo de sesión medio web", "平均访问时长 (Shícháng)"),
            ("MQL", "营销合格线索 (MQL)"), ("SQL", "销售合格线索 (SQL)"),
            ("Prospecto comercial", "销售线索 (Lead)"), ("Tasa de cierre de ventas", "销售成交率 (Chéngjiāolǜ)"),
            ("Ingreso de marketing", "营销收入 (Yíngxiāo shōurù)"), ("Costo publicitario", "广告费用 (Guǎnggào fèiyòng)"),
            ("Gasto en marketing", "营销支出 (Yíngxiāo zhīchū)"), ("Impresión digital", "曝光次数 (Bàoguāng cìshù)"),
            ("Alcance de campaña", "覆盖人群 (Fùgǎi rénqún)"), ("Frecuencia", "展示频次 (Píncì)"),
            ("Tasa de apertura", "邮件打开率 (Dǎkāilǜ)"),
            ("Tasa de clics de correo", "邮件点击率 (Diǎnjīlǜ)"),
            ("Tasa de rebote de correo", "邮件退信率 (Tuìxìnlǜ)"),
            ("Tasa de spam", "垃圾邮件率 (Lājī yóujiàn lǜ)"), ("Compartidos en redes sociales", "社交分享数 (Fēnxiǎngshù)"),
            ("Menciones de marca", "品牌提及量 (Tíjíliàng)"), ("Cuota de voz", "品牌声量份额 (SOV)"),
            ("NPS", "净推荐值 (NPS)"), ("Satisfacción del cliente", "客户满意度 (CSAT)"),
            ("Retención del cliente", "客户留存 (Kèhù liúcún)"), ("Valor de por vida", "生命周期价值 (LTV)"),
            ("Ratio de conversión del embudo", "漏斗转化率 (Lòudǒu zhuǎnhuà)"), ("Analítica digital", "数字分析 (Shùzì fēnxī)"),
            ("Tablero de KPIs", "数据看板 (Shùjù kànbǎn)"), ("Google Analytics", "谷歌分析 (Gǔgē fēnxī)"),
            ("Datos de marketing", "营销数据 (Yíngxiāo shùjù)"), ("Informe de marketing", "营销报告 (Yíngxiāo bàogào)"),
            ("Análisis de datos", "数据分析 (Shùjù fēnxī)"), ("Optimización de KPIs", "KPI优化 (KPI yōuhuà)"),
            ("Métrica de vanidad", "虚荣指标 (Xūróng zhǐbiāo)"), ("Métrica accionable", "实用指标 (Shíyòng zhǐbiāo)")
        ],
        # Módulo 7: Investigación de Mercado (Medio)
        [
            ("Investigación de mercado", "市场调研 (Shìcháng diàoyán)"), ("Análisis de mercado", "市场分析 (Shìcháng fēnxī)"),
            ("Encuesta de mercado", "市场调查 (Shìcháng diàochá)"), ("Cuestionario de encuesta", "调查问卷 (Diàochá wènjuàn)"),
            ("Grupo focal", "焦点小组 (Jiāodiǎn xiǎozǔ)"), ("Entrevista cualitativa", "定性访谈 (Dìngxìng fǎntán)"),
            ("Datos primarios", "一手数据 (Yīshǒu shùjù)"), ("Datos secundarios", "二手数据 (Èrshǒu shùjù)"),
            ("Investigación cualitativa", "定性研究 (Dìngxìng yánjiū)"), ("Investigación cuantitativa", "定量研究 (Dìngliàng yánjiū)"),
            ("Muestra", "样本 (Yàngběn)"), ("Tamaño de muestra", "样本量 (Yàngběnliàng)"),
            ("Sesgo de muestra", "抽样偏差 (Chōuyàng piānchā)"), ("Público objetivo", "目标人群 (Mùbiāo rénqún)"),
            ("Segmentación de mercado", "市场细分 (Shìcháng xìfēn)"), ("Demografía", "人口普查数据 (Rénkǒu pǔchá)"),
            ("Psicografía", "心理特征 (Xīnlǐ tèzhēng)"), ("Comportamiento del consumidor", "消费者行为 (Xīnfèizhě xíngwéi)"),
            ("Tendencia de mercado", "市场趋势 (Shìcháng qūshì)"), ("Tamaño del mercado", "市场规模 (Shìcháng guīmó)"),
            ("Cuota de mercado", "市场份额 (Shìcháng fèn'é)"), ("Crecimiento del mercado", "市场增长 (Shìcháng zēngzhǎng)"),
            ("Mercado saturado", "饱和市场 (Bǎohé shìcháng)"), ("Barrera de entrada", "市场准入门槛 (Ménkǎn)"),
            ("Competencia", "行业竞争 (Hángyè jìngzhēng)"), ("Análisis de la competencia", "竞争对手分析 (Jìngzhēng duìshǒu)"),
            ("Benchmarking", "行业基准 (Jīzhǔn)"), ("Análisis FODA", "SWOT分析 (SWOT fēnxī)"),
            ("Fortaleza", "优势 (Yōushì)"), ("Oportunidad", "机会 (Jīhuì)"),
            ("Debilidad", "劣势 (Lièshì)"), ("Amenaza", "威胁 (Wēixié)"),
            ("Prueba de concepto", "概念测试 (Gàiniàn cèshì)"), ("Prueba de mercado", "市场测试 (Shìcháng cèshì)"),
            ("Lanzamiento de prueba", "试销 (Shìxiāo)"), ("Comentarios del cliente", "客户反馈 (Kèhù fǎnkuì)"),
            ("Satisfacción del cliente", "客户满意度 (Kèhù mǎnyìdù)"), ("Puntaje NPS", "NPS推荐值 (NPS)"),
            ("Fidelización de clientes", "客户留存 (Kèhù liúcún)"), ("Tasa de pérdida de clientes", "客户流失率 (Liúshīlǜ)"),
            ("Preferencias del consumidor", "消费者偏好 (消费者偏好)"), ("Hábitos de consumo", "消费习惯 (Xiāofèi xíguàn)"),
            ("Perfil del consumidor", "消费者特征 (消费者特征)"), ("Segmento de mercado", "细分市场 (Xìfēn shìcháng)"),
            ("Mercado potencial", "潜在市场 (Qiánzài shìcháng)"), ("Nicho de mercado", "利基市场 (Lìjī shìcháng)"),
            ("Demanda del consumidor", "消费者需求 (消费者需求)"), ("Poder adquisitivo", "购买力 (Gòumǎilì)"),
            ("Elasticidad de precio", "价格弹性 (Jiàgé tánxìng)"), ("Estudio de viabilidad", "可行性研究 (Kěxíngxìng)")
        ],
        # Módulo 8: Relaciones Públicas y Eventos (Medio)
        [
            ("Relaciones Públicas", "公共关系 (Gōnggòng guānxi)"), ("RRPP", "公关 (Gōngguān)"),
            ("Comunicado de prensa", "新闻发布 (Xīnwén fābù)"), ("Dossier de prensa", "媒体资料包 (Méitǐ zīliào)"),
            ("Rueda de prensa", "媒体见面会 (Jiànmiànhuì)"), ("Periodista", "记者 (Jìzhě)"),
            ("Medios de comunicación", "新闻媒体 (Xīnwén méitǐ)"), ("Cobertura de medios", "媒体曝光 (Méitǐ bàodào)"),
            ("Contacto de prensa", "媒体联络人 (Méitǐ liánluòrén)"), ("Relaciones con los medios", "媒体关系 (Méitǐ guānxi)"),
            ("Portavoz de la marca", "品牌发言人 (Fāyánrén)"), ("Reputación de la marca", "品牌声誉 (声誉)"),
            ("Gestión de la reputación", "声誉管理 (Shēngyù guǎnlǐ)"), ("Crisis de reputación", "公关危机 (Gōngguān wēijī)"),
            ("Gabinete de prensa", "新闻办公室 (新闻办公室)"), ("Evento corporativo", "企业活动 (Qǐyè huódòng)"),
            ("Evento promocional", "推广活动 (Tuīguǎng huódòng)"), ("Feria comercial", "行业展会 (Zhǎnhuì)"),
            ("Exposición comercial", "商业展览 (Shāngyè zhǎnlǎn)"), ("Patrocinio de eventos", "活动赞助 (Hùodòng zànzhù)"),
            ("Patrocinador del evento", "活动赞助商 (Zànzhùshāng)"), ("Mecenazgo", "艺术赞助 (Art zànzhù)"),
            ("Networking", "社交拓展 (Shèjiāo tuòzhǎn)"), ("Cóctel de networking", "社交酒会 (Jiǔhuì)"),
            ("Presentación de producto", "产品展示 (Chǎnpǐn zhǎnshì)"), ("Lanzamiento de producto", "新品发布 (Xīnpǐn fābù)"),
            ("Conferencia ejecutiva", "行业大会 (Hángyè dàhuì)"), ("Seminario corporativo", "企业研讨会 (Yántǎohuì)"),
            ("Embajador de la marca", "品牌形象大使 (Dàshǐ)"), ("Influencer", "意见领袖 (KOL)"),
            ("Líder de opinión", "行业专家 (Zhānjiā)"), ("Notoriedad de la marca", "品牌知名度 (Zhīmíngdù)"),
            ("Imagen pública", "公众形象 (公众形象)"), ("Relaciones comunitarias", "社区关系 (Shèqū guānxi)"),
            ("Responsabilidad social", "企业社会责任 (CSR)"), ("RSE corporativa", "RSE (RSE)"),
            ("Manual de crisis", "危机处理手册 (Wēijī chǔlǐ)"), ("Imagen corporativa", "公司形象 (Gōngsī xíngxiàng)"),
            ("Identidad visual", "VI设计 (VI shèjì)"), ("Logotipo de la marca", "品牌LOGO (LOGO)"),
            ("Eslogan de la marca", "品牌口号 (Kǒuhào)"), ("Público meta", "目标受众 (Shòuzhòng)"),
            ("Mensaje clave", "核心公关信息 (Héxīn xìnxī)"), ("Estrategia de RRPP", "公关策略 (Gōngguān cèlüè)"),
            ("Campaña de RRPP", "公关战役 (Gōngguān zhànyì)"), ("Lanzamiento promocional", "推介会 (Tuījièhuì)"),
            ("Feria de muestras", "商品交易会 (Jiāoyìhuì)"), ("Contacto de negocios", "商务人脉 (Shāngwù rénmài)"),
            ("Transmisión en directo", "直播活动 (Zhíbō huódòng)"), ("Notoriedad pública", "公众曝光度 (Bàoguāngdù)")
        ],
        # Módulo 9: Comercio Electrónico y Embudo (Medio)
        [
            ("Comercio electrónico", "电子商务 (Diànzǐ shāngwù)"), ("Tienda en línea", "网店 (Wǎngdiàn)"),
            ("Carrito de compras", "购物车 (Gòuwùchē)"), ("Proceso de pago", "结账流程 (Jiézhàng liúchéng)"),
            ("Pasarela de pago", "支付网关 (Zhīfù wǎngguān)"), ("Tarjeta de crédito", "信用卡支付 (Xìnyòngkǎ)"),
            ("PayPal", "支付宝/微信/PayPal (PayPal)"), ("Envío de compra", "物流配送 (Pèisòng)"),
            ("Plazo de entrega", "送货时效 (Sònghuò shíxiào)"), ("Costo de envío", "快递运费 (Yùnfèi)"),
            ("Seguimiento de envío", "订单跟踪 (Dìngdān gēnzōng)"), ("Devolución de compra", "退货申请 (Tuìhuò)"),
            ("Reembolso", "退款处理 (Tuìkuǎn)"), ("Atención al cliente", "售后客服 (Kèfú)"),
            ("Fidelización de clientes", "会员忠诚计划 (Huìyuán)"), ("Embudo de conversión", "转化漏斗 (Zhǔanhùalòudǒu)"),
            ("Embudo de ventas", "销售漏斗 (Xiāoshòu lòudǒu)"), ("Prospecto comercial", "潜在销售线索 (Lead)"),
            ("MQL", "营销合格线索 (MQL)"), ("SQL", "销售合格线索 (SQL)"),
            ("Tasa de conversión", "漏斗 conversion rate (Zhuǎnhuà)"), ("Tasa de rebote", "网页跳出率 (Tiàochūlǜ)"),
            ("Abandono de carrito", "弃单率 (Qìdānlǜ)"), ("Optimización de conversión", "转化率优化 (CRO)"),
            ("CRO", "CRO (CRO)"), ("Página de aterrizaje", "营销落地页 (Luòdìyè)"),
            ("Página de producto", "商品详情页 (Xiángqíngyè)"), ("Ficha de producto", "产品参数 (Cǎnpǐn cānshù)"),
            ("Imagen de producto", "产品主图 (Cǎnpǐn zhǔtú)"), ("Opiniones de clientes", "买家评价 (Mǎijiā píngjià)"),
            ("Testimonio de cliente", "真实好评 (Zhēnshí hǎopíng)"), ("Valoración de producto", "评分 (Píngfēn)"),
            ("Venta cruzada", "交叉销售 (Jiāochā xiāoshòu)"), ("Venta sugerida", "向上销售 (Xiàngshàng xiāoshòu)"),
            ("Descuento", "打折优惠 (优惠)"), ("Cupón de descuento", "优惠券 (Yōuhuìquàn)"),
            ("Oferta limitada", "限时特惠 (Xiànshí tèhuì)"), ("Envío gratis", "免运费 (Miǎn yùnfèi)"),
            ("Garantía de devolución", "无理由退换货 (Tuìhuànhuò)"), ("Seguridad", "安全交易保障 (Ānquán)"),
            ("RGPD", "数据保护合规 (GDPR)"), ("Protección de datos", "隐私保护 (Yǐnsī bǎohù)"),
            ("Términos y condiciones", "用户协议 (Yònghù xiéyì)"), ("CGV", "服务条款 (Terms)"),
            ("Facturación", "开票系统 (Kāipiào)"), ("Precio total", "应付总额 (Zǒng'é)"),
            ("Bolsa de compra", "购物车 (Gòuwùchē)"), ("Cliente", "电商买家 (Mǎijiā)"),
            ("Proveedor", "电商供应商 (Gōngyìngshāng)"), ("Plataforma", "电商平台 (Píngtái)")
        ],
        # Módulo 10: Growth Hacking (Medio)
        [
            ("Growth Hacking", "增长黑客 (Zēngzhǎng hēikè)"), ("Crecimiento rápido", "快速增长 (Kuàisù zēngzhǎng)"),
            ("Growth hacker", "增长专家 (Zēngzhǎng zhuānjiā)"), ("Estrategia", "增长策略 (Zēngzhǎng cèlüè)"),
            ("Experimento", "增长实验 (Shíyàn)"), ("Prueba rápida", "快速测试 (Kuàisù cèshì)"),
            ("Adquisición de usuarios", "用户获客 (Hùokè)"), ("Activación de usuarios", "用户激活 (Jīhuó)"),
            ("Retención de usuarios", "用户留存 (Liúcún)"), ("Monetización", "商业变现 (Biànxiàn)"),
            ("Referencia", "用户推荐裂变 (Lièbiàn)"), ("Embudo AARRR", "AARRR海盗漏斗 (AARRR)"),
            ("Embudo pirata", "海盗模型 (AARRR)"), ("Métrica estrella", "北极星指标 (NSM)"),
            ("NSM", "North Star Metric (NSM)"), ("Efecto de red", "网络效应 (Wǎngluò xiàoyìng)"),
            ("Bucle viral", "病毒传播循环 (Bìngdú)"), ("Coeficiente viral", "病毒系数 (K-factor)"),
            ("Coeficiente K", "K值 (K-value)"), ("Crecimiento orgánico", "自然增长 (Zìrán zēngzhǎng)"),
            ("Boca en boca", "口碑营销 (Kǒubēi yíngxiāo)"), ("Marketing de guerrilla", "游击营销 (Yóují yíngxiāo)"),
            ("Marketing viral", "病毒营销 (Bìngdú yíngxiāo)"), ("Optimización del embudo", "漏斗深度优化 (Yōuhuà)"),
            ("Prueba A/B", "A/B对比测试 (A/B cèshì)"), ("Tasa de conversión", "转化效率 (Zhuǎnhuà)"),
            ("Tasa de abandono", "流失占比 (Liúshī)"), ("LTV", "生命周期总价值 (LTV)"),
            ("CAC", "获客总成本 (CAC)"), ("Ratio LTV a CAC", "LTV/CAC 比率 (Ratio)"),
            ("Escalabilidad", "可扩展性 (Kuòzhǎnxìng)"), ("Automatización", "营销自动化 (Zìdònghuà)"),
            ("Herramienta", "自动化工具 (Gōngjù)"), ("Flujo automatizado", "自动化工作流 (Workflow)"),
            ("Generación de prospectos", "线索自动获取 (Leads)"), ("Prospección digital", "数字获客开发 (Prospection)"),
            ("Raspado de datos", "数据爬取 (Scraping)"), ("Análisis de datos", "数据智能分析 (Analyse)"),
            ("Datos cuantitativos", "定量增长数据 (Data)"), ("Datos cualitativos", "定性研究数据 (Qualitative)"),
            ("Comportamiento", "用户行为轨迹 (Comportement)"), ("UX de growth", "用户体验优化 (UX)"),
            ("UI de growth", "交互界面优化 (UI)"), ("Optimización de landing", "落地页转化率优化 (Landing)"),
            ("Psicología del consumidor", "消费心理学 (Psychology)"), ("Gatillo mental", "心理触发器 (Trigger)"),
            ("Prueba social", "社会认同效应 (Preuve)"), ("Escasez", "稀缺性效应 (Rareté)"),
            ("Urgencia", "紧迫感效应 (Urgence)"), ("Fidelización", "用户高粘性留存 (Fidélisation)"),
            ("Embajador", "增长大使 (Ambassadeur)")
        ]
    ],
    "tech": [
        # Módulo 1: Hardware y Computadoras (Medio-Alto)
        [
            ("Ordenador", "电脑 (Diànnǎo)"), ("Portátil", "笔记本电脑 (Bǐjìběn diànnǎo)"), ("Servidor", "服务器 (Fúwùqì)"),
            ("Procesador", "处理器 (Chǔlǐqì)"), ("CPU", "CPU (CPU)"), ("Memoria RAM", "运行内存 (Yùnxíng nèicún)"),
            ("RAM", "RAM (RAM)"), ("Disco duro", "硬盘 (Yìngpán)"), ("SSD", "固态硬盘 (Gùtài yìngpán)"),
            ("Tarjeta gráfica", "显卡 (Xiǎnkǎ)"), ("GPU", "GPU (GPU)"), ("Placa base", "主板 (Zhǔbǎn)"),
            ("Fuente de alimentación", "电源 (Diànyuán)"), ("Refrigeración", "散热系统 (Sànrè xìtǒng)"),
            ("Carcasa", "机箱 (Jīxiāng)"), ("Pantalla", "显示器 (Xiǎnshìqì)"), ("Teclado", "键盘 (Jiànpán)"),
            ("Ratón", "鼠标 (Shǔbiāo)"), ("Impresora", "打印机 (Dǎyìnjī)"), ("Escáner", "扫描仪 (Sǎomiáoyí)"),
            ("Altavoces", "扬声器 (Yángshēngqì)"), ("Auriculares", "耳机 (Ěrjī)"), ("Micrófono", "麦克风 (Màikèfēng)"),
            ("Cámara web", "摄像头 (Shèxiàngtóu)"), ("Cable HDMI", "HDMI线 (HDMI xiàn)"), ("Puerto USB", "USB接口 (USB jiēkǒu)"),
            ("Conector", "连接器 (Liánjiēqì)"), ("Red", "网络 (Wǎngluò)"), ("Router", "路由器 (Lùyóuqì)"),
            ("Módem", "调制解调器 (Modem)"), ("Cable Ethernet", "网线 (Wǎngxiàn)"), ("Wi-Fi", "无线网 (Wúxiànwǎng)"),
            ("Dispositivo de almacenamiento", "存储设备 (Cǔnchǔ shèbèi)"), ("Memoria USB", "U盘 (U-pán)"),
            ("Tarjeta SD", "SD卡 (SD kǎ)"), ("Lector de tarjetas", "读卡器 (Dúkǎqì)"), ("Hardware", "硬件 (Yìnjiàn)"),
            ("Dispositivo externo", "外设 (Wàishè)"), ("Componente", "组件 (Zǔjiàn)"), ("Instalar", "安装 (Ānzhuāng)"),
            ("Desinstalar", "卸载 (Xièzài)"), ("Configurar", "配置 (Pèizhì)"), ("Actualizar hardware", "硬件升级 (Shēngjí)"),
            ("Reparar", "维修 (Wéixiū)"), ("Falla de hardware", "硬件故障 (Gùzhàng)"), ("Compatibilidad", "兼容性 (Jiānróngxìng)"),
            ("Rendimiento", "性能 (Xìngnéng)"), ("Velocidad de procesamiento", "处理速度 (Sùdù)"),
            ("Consumo de energía", "功耗 (Gōnghào)"), ("Batería", "电池 (Diànchí)")
        ],
        # Módulo 2: Software y Aplicaciones (Medio-Alto)
        [
            ("Software", "软件 (Ruǎnjiàn)"), ("Aplicación", "应用程序 (Yìngyòng chéngxù)"), ("App", "应用 (Yìngyòng)"),
            ("Sistema operativo", "操作系统 (Cāozuò xìtǒng)"), ("Windows", "Windows (Windows)"), ("macOS", "macOS (macOS)"),
            ("Linux", "Linux (Linux)"), ("Programa", "程序 (Chéngxù)"), ("Instalación", "安装 (Ānzhuāng)"),
            ("Desinstalación", "卸载 (Xièzài)"), ("Actualización", "软件更新 (Gēngxīn)"),
            ("Versión", "版本 (Bǎnběn)"), ("Licencia de software", "软件许可 (Xǔkě)"), ("Código abierto", "开源 (Kāiyuán)"),
            ("Software propietario", "专有软件 (Zhuānyǒu ruǎnjiàn)"), ("Software gratuito", "免费软件 (Miǎnfèi ruǎnjiàn)"),
            ("Navegador web", "浏览器 (Liúlǎnqì)"), ("Buscador", "搜索引擎 (Sōusuǒ yǐnqíng)"),
            ("Base de datos", "数据库 (Shùjùkù)"), ("Procesador de textos", "文字处理器 (Wénzì chǔlǐqì)"),
            ("Hoja de cálculo", "电子表格 (Diànzǐ biǎogé)"), ("Editor de imágenes", "图像 Youth editor (Biānjí)"),
            ("Antivirus", "杀毒软件 (Shādú ruǎnjiàn)"), ("Firewall", "防火墙 (Fánghuǒqiáng)"), ("Almacenamiento en la nube", "云存储 (Yúncǔnchǔ)"),
            ("Copia de seguridad", "备份 (Bèifèn)"), ("Restauración", "恢复 (Huīfù)"), ("Archivo ejecutable", "可执行 Fichero (Chéngxù)"),
            ("Extensión", "文件后缀 (Hòuzhuì)"), ("Comprimir", "压缩 (Yāsuō)"),
            ("Descomprimir", "解压 (Jiěyā)"), ("Error de software", "程序漏洞 (Lòudòng)"), ("Bug", "Bug (Bug)"),
            ("Colapso del sistema", "系统崩溃 (Bēngkuì)"), ("Reiniciar", "重启 (Chóngqǐ)"), ("Apagar", "关机 (Guānjī)"),
            ("Encender", "开机 (Kāijī)"), ("Interfaz", "用户界面 (UI)"), ("UI", "UI (UI)"),
            ("Experiencia de usuario", "用户体验 (UX)"), ("UX", "UX (UX)"), ("Menú de navegación", "导航菜单 (Càidān)"),
            ("Barra de herramientas", "工具栏 (Gōngjùlán)"), ("Ventana emergente", "弹窗 (Tánchuāng)"),
            ("Icono", "图标 (Túbiāo)"), ("Botón", "按钮 (Ànniǔ)"), ("Cuadro de texto", "文本框 (Wénběnkuāng)"),
            ("Casilla de verificación", "复选框 (Fùxuǎnkuāng)"), ("Desplazamiento", "滚动 (Gǔndòng)"),
            ("Arrastrar y soltar", "拖拽 (Tuōzhuài)"), ("Atajo de teclado", "快捷键 (Kuàijiéjiàn)")
        ],
        # Módulo 3: Programación y Código (Medio-Alto)
        [
            ("Programación", "编程 (Biānchéng)"), ("Programador", "程序员 (Biānchéngyuán)"), ("Desarrollador", "开发者 (Kāifāzhě)"),
            ("Código fuente", "源代码 (Yuándàimǎ)"), ("Lenguaje de programación", "编程语言 (Yǔyán)"),
            ("Python", "Python (Python)"), ("JavaScript", "JavaScript (JavaScript)"), ("HTML", "HTML (HTML)"), ("CSS", "CSS (CSS)"),
            ("Java", "Java (Java)"), ("C++", "C++ (C++)"), ("PHP", "PHP (PHP)"), ("SQL", "SQL (SQL)"),
            ("Variable", "变量 (Biànliàng)"), ("Constante", "常量 (Chángliàng)"), ("Tipo de datos", "数据类型 (Shùjù lèixíng)"),
            ("Cadena de texto", "字符串 (Zìfúchuán)"), ("Entero", "整型 (Zhěngxíng)"), ("Flotante", "浮点型 (Fúdiǎnxíng)"),
            ("Booleano", "布尔值 (Bù'ěrzhí)"), ("Arreglo", "数组 (Shùzǔ)"), ("Matriz", "矩阵 (Jǔzhèn)"), ("Lista", "列表 (Lièbiǎo)"),
            ("Diccionario", "字典 (Zìdiǎn)"), ("Función", "函数 (Hánshù)"), ("Método", "方法 (Fāngfǎ)"),
            ("Parámetro", "参数 (Cānshù)"), ("Argumento", "实参 (Shícān)"), ("Retorno", "返回值 (Fǎnhuízhí)"),
            ("Condicional", "条件语句 (Tiáojiàn)"), ("Bucle", "循环 (Xúnhuán)"), ("Bucle For", "For 循环 (For)"),
            ("Bucle While", "While 循环 (While)"), ("Algoritmo", "算法 (Suànfǎ)"), ("Compilación", "编译 (Biānyì)"),
            ("Compilador", "编译器 (Biānyìqì)"), ("Interpretación", "解释 (Jiěshì)"), ("Intérprete", "解释器 (Jiěshìqì)"),
            ("Depuración", "调试 (Tiáoshì)"), ("Depurar", "Debug (调试)"), ("Error de sintaxis", "语法错误 (Yǔfǎ cuòwù)"),
            ("Error de ejecución", "运行错误 (Yùnxíng cuòwù)"), ("Comentario", "注释 (Zhùshì)"),
            ("Librería", "类库 (Lèikù)"), ("Framework", "框架 (Kuàngjià)"), ("API", "API接口 (API)"),
            ("Control de versiones", "版本控制 (Bǎnběn kòngzhì)"), ("Git", "Git (Git)"), ("Repositorio", "仓库 (Cāngkù)"),
            ("Rama", "分支 (Fēnzhī)")
        ],
        # Módulo 4: Desarrollo Web (Medio-Alto)
        [
            ("Desarrollo Web", "网页开发 (Wǎngyè kāifā)"), ("Diseño Web", "网页设计 (Wǎngyè shèjì)"),
            ("Frontend", "前端 (Qiánduān)"), ("Backend", "后端 (Hòuduān)"), ("Fullstack", "全栈 (Quánzhàn)"),
            ("Página web", "网页 (Wǎngyè)"), ("Sitio web", "网站 (Wǎngzhàn)"), ("Servidor web", "Web服务器 (Fúwùqì)"),
            ("Alojamiento web", "网站托管 (Hézhāng)"), ("Hosting", "主机托管 (Hosting)"), ("Dominio", "域名 (Yùmíng)"),
            ("Subdominio", "子域名 (Zǐyùmíng)"), ("Dirección IP", "IP地址 (IP dìzhǐ)"), ("URL", "网格地址 (URL)"),
            ("Protocolo HTTP", "HTTP协议 (HTTP)"), ("HTTPS", "HTTPS安全协议 (HTTPS)"), ("Certificado SSL", "SSL证书 (SSL)"),
            ("FTP", "文件传输 (FTP)"), ("DNS", "域名解析 (DNS)"), ("Base de datos web", "Web数据库 (Shùjùkù)"),
            ("Consulta", "数据查询 (Cháxún)"), ("Tabla", "表格 (Biǎogé)"),
            ("Registro", "数据行 (Jìlù)"), ("Clave primaria", "主键 (Zhǔjiàn)"),
            ("Clave foránea", "外键 (Wàijiàn)"), ("Diseño adaptable", "响应式设计 (Xiǎngyìngshì)"),
            ("Mobile-first", "移动优先 (Yídòng yōuxiān)"), ("Navegador", "浏览器 (Liúlǎnqì)"), ("Caché web", "网页缓存 (Huáncún)"),
            ("Cookies", "网页Cookie (Cookie)"), ("Sesión de usuario", "用户会话 (Huìhuà)"), ("Filtro", "筛选器 (Shāixuǎnqì)"),
            ("Buscador interno", "站内搜索 (Sōusuǒ)"), ("Formulario", "表单 (Biǎodān)"),
            ("Enviar", "提交表单 (Tíjiāo)"), ("Validación", "数据校验 (Jiàoyàn)"),
            ("Script lado cliente", "客户端脚本 (Client)"),
            ("Script lado servidor", "服务端脚本 (Server)"), ("Node.js", "Node.js (Node)"),
            ("React", "React框架 (React)"), ("Angular", "Angular框架 (Angular)"), ("Vue", "Vue框架 (Vue)"),
            ("Hoja de estilos", "样式表 (Yàngshìbiǎo)"), ("SASS", "SASS编译 (SASS)"), ("Bootstrap", "Bootstrap (Bootstrap)"),
            ("Tailwind CSS", "Tailwind CSS (Tailwind)"), ("WordPress", "WordPress (WordPress)"), ("CMS", "内容管理系统 (CMS)"),
            ("Optimización SEO", "搜索引擎优化 (SEO)"), ("Mapa del sitio", "网站地图 (Plan)")
        ],
        # Módulo 5: Redes e Internet (Medio-Alto)
        [
            ("Red de ordenadores", "计算机网络 (Wǎngluò)"), ("Internet", "互联网 (Hùliánwǎng)"), ("Intranet", "企业内网 (Nèiwǎng)"),
            ("Conexión de red", "网络连接 (Liánjiē)"), ("Ancho de banda", "网络带宽 (Dàikuān)"),
            ("Velocidad de descarga", "下载速度 (Xiàzǎi sùdù)"),
            ("Velocidad de subida", "上传速度 (Shàngchuán sùdù)"), ("Latencia de red", "网络延迟 (Yánchí)"),
            ("Ping de red", "网络延迟测试 (Ping)"), ("Dirección IP", "IP地址 (IP dìzhǐ)"), ("Dirección MAC", "MAC地址 (MAC)"),
            ("Máscara de subred", "子网掩码 (Zǐwǎng yǎnmǎ)"), ("Puerta de enlace", "默认网关 (Wǎngguān)"),
            ("Servidor DNS", "DNS服务器 (DNS)"), ("Servidor DHCP", "DHCP服务器 (DHCP)"), ("Protocolo TCP/IP", "TCP/IP协议 (TCP)"),
            ("Protocolo UDP", "UDP协议 (UDP)"), ("Paquete de datos", "数据包 (Shùjùbāo)"), ("Pérdida de paquetes", "丢包 (Diūbāo)"),
            ("Cifrado", "网络加密 (Jiāmì)"), ("Desencriptación", "数据解密 (Jiěmì)"), ("VPN", "虚拟专用网 (VPN)"),
            ("Red privada virtual", "专用安全网络 (VPN)"), ("Cortafuegos", "防火墙 (Pare-feu)"), ("Firewall", "防火墙 (Firewall)"),
            ("Servidor Proxy", "代理服务器 (Proxy)"), ("Wi-Fi", "无线网络 (Wi-Fi)"),
            ("Punto de acceso", "无线接入点 (AP)"), ("Contraseña", "网络密码 (Mìmǎ)"),
            ("Seguridad WPA3", "WPA3安全标准 (WPA3)"), ("Fibra óptica", "光纤 (Guāngxiān)"), ("Cable coaxial", "同轴电缆 (Diànlǎn)"),
            ("Cable Ethernet", "双绞线网线 (Wǎngxiàn)"), ("Conmutador de red", "交换机 (Switch)"), ("Switch", "网络交换机 (Switch)"),
            ("Enrutador", "路由器 (Lùyóuqì)"), ("Módem", "猫 (Modem)"), ("Red LAN", "局域网 (LAN)"),
            ("Red WAN", "广域网 (WAN)"), ("Red WLAN", "无线局域网 (WLAN)"), ("Topología de red", "网络拓扑 (Tuòpǔ)"),
            ("Servidor de archivos", "文件服务器 (Fúwùqì)"), ("Nube privada", "私有云 (Yún)"),
            ("Nube pública", "公有云 (Yún)"), ("Nube híbrida", "混合云 (Yún)"), ("Tráfico de red", "网络流量 (Liúliàng)"),
            ("Sobrecarga", "网络拥堵 (Yōngdǔ)"), ("Corte de conexión", "断网 (Duànwǎng)"),
            ("Proveedor de Internet", "网络服务商 (ISP)"), ("ISP", "宽带运营商 (ISP)"), ("IP estática", "静态IP (IP)")
        ],
        # Módulo 6: Ciberseguridad (Medio-Alto)
        [
            ("Ciberseguridad", "网络安全 (Wǎngluò ānquán)"), ("Seguridad informática", "信息安全 (Xīnxī ānquán)"),
            ("Amenaza cibernética", "安全威胁 (Wēixié)"), ("Ataque cibernético", "网络攻击 (Gōngjī)"),
            ("Hacker", "黑客 (Hēikè)"), ("Pirata informático", "网络黑客 (Hēikè)"), ("Hacker ético", "白帽黑客 (Báimào hēikè)"),
            ("Vulnerabilidad", "安全漏洞 (Lòudòng)"), ("Exploit", "漏洞利用 (Exploit)"), ("Parche de seguridad", "安全补丁 (Bǔdīng)"),
            ("Virus", "电脑病毒 (Bìngdú)"), ("Gusano", "网络蠕虫 (Rúchóng)"), ("Troyano", "特洛伊木马 (Mùmǎ)"),
            ("Malware", "恶意软件 (Malware)"), ("Ransomware", "勒索软件 (Ransomware)"), ("Spyware", "间谍软件 (Spyware)"),
            ("Adware", "广告软件 (Adware)"), ("Phishing", "网络钓鱼 (Diàoyú)"), ("Ingeniería social", "社会工程学 (Shèhuì gōngchéng)"),
            ("Spam", "垃圾邮件 (Spam)"), ("Ataque DDoS", "DDoS攻击 (DDoS)"), ("Fuerza bruta", "暴力破解 (Brute force)"),
            ("Inyección SQL", "SQL注入 (SQL zhùrù)"), ("Cifrado", "安全加密 (Jiāmì)"),
            ("Clave de cifrado", "加密密钥 (Mìyuè)"), ("Algoritmo", "加密算法 (Suànfǎ)"),
            ("Contraseña segura", "强密码 (Mìmǎ)"),
            ("Autenticación de doble factor", "双重身份验证 (2FA)"), ("2FA", "两步验证 (2FA)"),
            ("Firma digital", "数字签名 (Qiānmíng)"), ("Certificado digital", "数字证书 (Zhèngshū)"),
            ("Gestor de contraseñas", "密码管理器 (Manager)"), ("Copia de seguridad", "安全备份 (Sauvegarde)"),
            ("Recuperación de datos", "数据恢复 (Récupération)"), ("Fuga de datos", "数据泄露 (Xièlòu)"),
            ("Brecha de seguridad", "安全防线突破 (Brèche)"), ("Acceso no autorizado", "越权访问 (Accès)"),
            ("Suplantación", "身份冒用 (Usurpation)"), ("Monitoreo de red", "安全监控 (Surveillance)"),
            ("Auditoría de seguridad", "安全审计 (Audit)"), ("Cumplimiento", "合规安全 (Conformité)"),
            ("Privacidad", "数据隐私保护 (Confidentialité)"), ("RGPD", "数据条例 (GDPR)"),
            ("Antivirus activo", "杀毒盾 (Antivirus)"), ("Escaneo de virus", "病毒扫描 (Analyse)"),
            ("Cuarentena", "文件隔离区 (Quarantaine)"), ("Eliminar virus", "杀毒 (Supprimer)"),
            ("Ingeniería inversa", "逆向工程 (Rétro-ingénierie)"), ("Huella digital", "数字指纹 (Empreinte)"),
            ("Biometría", "生物识别 (Biométrie)")
        ],
        # Módulo 7: Bases de Datos y SQL (Medio-Alto)
        [
            ("Base de datos", "数据库 (Shùjùkù)"), ("Relacional", "关系型数据库 (Shùjùkù)"),
            ("SGBD", "数据库管理系统 (SGBD)"), ("MySQL", "MySQL数据库 (MySQL)"), ("PostgreSQL", "PostgreSQL (Postgres)"), ("Oracle", "Oracle数据库 (Oracle)"),
            ("SQL Server", "SQL Server (SQL)"), ("SQLite", "SQLite数据库 (SQLite)"), ("NoSQL", "非关系型数据库 (NoSQL)"), ("MongoDB", "MongoDB (Mongo)"),
            ("Tabla", "数据表 (Shùjùbiǎo)"), ("Fila", "数据行 (Xíng)"),
            ("Columna", "数据列 (Liè)"), ("Registro", "数据记录 (Jìlù)"),
            ("Campo", "数据字段 (Zìduàn)"), ("Clave primaria", "数据主键 (Zhǔjiàn)"), ("Clave foránea", "数据外键 (Wàijiàn)"),
            ("Índice", "数据库索引 (Suǒyǐn)"), ("Consulta SQL", "SQL查询 (Cháxún)"), ("SELECT", "SQL SELECT语句 (SELECT)"),
            ("INSERT", "SQL INSERT语句 (INSERT)"), ("UPDATE", "SQL UPDATE语句 (UPDATE)"), ("DELETE", "SQL DELETE语句 (DELETE)"),
            ("Cláusula WHERE", "WHERE条件 (WHERE)"), ("Unión", "多表关联 (JOIN)"), ("INNER JOIN", "等值连接 (INNER JOIN)"),
            ("LEFT JOIN", "左连接 (LEFT JOIN)"), ("Esquema", "数据库架构 (Schéma)"),
            ("Normalización", "数据库范式化 (Normalisation)"), ("Desnormalización", "反规范化 (Dénormalisation)"),
            ("Transacción", "数据库事务 (Transaction)"), ("Propiedades ACID", "ACID特性 (ACID)"),
            ("Commit", "事务提交 (Commit)"), ("Rollback", "事务回滚 (Rollback)"),
            ("Copia de seguridad", "数据库备份 (Sauvegarde)"),
            ("Restaurar", "数据还原 (Restaurer)"),
            ("Exportar", "导出数据 (Exporter)"), ("Importar", "导入数据 (Importer)"),
            ("Integridad", "数据完整性 (Intégrité)"), ("Consistencia", "数据一致性 (Cohérence)"),
            ("Redundancia", "数据冗余 (Redondance)"),
            ("Administrador", "数据库管理员 (DBA)"), ("DBA", "DBA (DBA)"),
            ("Almacenamiento", "数据仓储 (Stockage)"), ("Data Warehouse", "数据仓库 (Entrepôt)"),
            ("Minería de datos", "数据挖掘 (Forage)"), ("Big Data", "大数据 (Big Data)"),
            ("Análisis de datos", "数据洞察 (Analyse)"), ("Migración", "数据搬迁 (Migration)"),
            ("Rendimiento", "数据库性能 (Performance)"), ("Optimización", "SQL优化 (Optimisation)")
        ],
        # Módulo 8: Inteligencia Artificial (Medio-Alto)
        [
            ("Inteligencia Artificial", "人工智能 (Réngōng zhìnéng)"), ("IA", "IA (IA)"),
            ("Machine Learning", "机器学习 (Jīqì xuéxí)"), ("Aprendizaje Automático", "自动学习 (Apprentissage)"),
            ("Aprendizaje Profundo", "深度学习 (Shēndù xuéxí)"), ("Deep Learning", "深度学习 (Deep learning)"),
            ("Red neuronal", "神经网络 (Shénjīng wǎngluò)"), ("Red neuronal artificial", "人工神经网络 (Yeux)"),
            ("Neurona artificial", "人工神经元 (Neurone)"), ("Algoritmo", "学习算法 (Suànfǎ)"),
            ("Modelo", "AI模型 (Modèle)"), ("Entrenamiento", "模型训练 (Entraînement)"),
            ("Datos de entrenamiento", "训练数据 (Données)"), ("Datos de prueba", "测试数据 (Données)"),
            ("Conjunto de datos", "数据集 (Jéushùjù)"), ("Dataset", "数据集 (Dataset)"),
            ("Lenguaje natural", "自然语言处理 (TALN)"), ("PLN", "NLP技术 (PLN)"),
            ("Visión por computadora", "计算机视觉 (Vision)"), ("Reconocimiento de imágenes", "图像识别 (Reconnaissance)"),
            ("Reconocimiento de voz", "语音识别 (Reconnaissance)"), ("Síntesis de voz", "语音合成 (Synthèse)"),
            ("Chatbot", "聊天机器人 (Chatbot)"), ("Agente inteligente", "智能体 (Agent)"), ("Predicción", "数据预测 (Prédiction)"),
            ("Clasificación", "数据分类 (Classification)"), ("Regresión", "数据回归 (Régression)"),
            ("Agrupamiento", "聚类分析 (Clustering)"), ("Sobreajuste", "过拟合 (Surapprentissage)"),
            ("Subajuste", "欠拟合 (Sous-apprentissage)"), ("Sesgo", "算法偏差 (Biais)"),
            ("Ética en IA", "人工智能伦理 (Éthique)"), ("CNN", "卷积神经网络 (CNN)"),
            ("RNN", "循环神经网络 (RNN)"), ("Transformer", "Transformer架构 (Transformer)"),
            ("Modelo de lenguaje", "大语言模型 (LLM)"), ("LLM", "LLM (LLM)"),
            ("IA generativa", "生成式人工智能 (Générative)"), ("Prompt", "提示词 (Prompt)"),
            ("Ingeniería de prompts", "提示词工程 (Ingénierie)"), ("Robótica", "机器人技术 (Robotique)"),
            ("Coche autónomo", "自动驾驶汽车 (Voiture)"), ("Automatización", "智能自动化 (Automatisation)"),
            ("Ciencia de datos", "数据科学 (Science)"), ("Científico de datos", "数据科学家 (Scientifique)"),
            ("Análisis predictivo", "预测性分析 (Analyse)"), ("Algoritmo genético", "遗传算法 (Génétique)"),
            ("Supervisado", "监督学习 (Supervisé)"), ("No supervisado", "无监督学习 (Non supervisé)"), ("Por refuerzo", "强化学习 (Reinforcement)")
        ],
        # Módulo 9: Computación en la Nube y DevOps (Medio-Alto)
        [
            ("Computación en la Nube", "云计算 (Yúnjìsuàn)"), ("Nube", "云端 (Yún)"),
            ("Servicio en la nube", "云服务 (SaaS)"), ("SaaS", "软件即服务 (SaaS)"), ("PaaS", "平台即服务 (PaaS)"), ("IaaS", "基础设施即服务 (IaaS)"),
            ("AWS", "亚马逊云科技 (AWS)"), ("Azure", "微软云 (Azure)"), ("Google Cloud", "谷歌云 (Google Cloud)"),
            ("Servidor en la nube", "云服务器 (Serveur)"), ("Almacenamiento en la nube", "云存储 (Stockage)"),
            ("Base de datos en la nube", "云数据库 (Base)"), ("Escalabilidad", "云弹性扩容 (Évolutivité)"),
            ("Elasticidad", "云端弹性 (Élasticité)"), ("Alta disponibilidad", "高可用性 (Haute)"),
            ("DevOps", "DevOps开发运维 (DevOps)"), ("Integración continua", "持续集成 (CI)"), ("CI", "CI (CI)"),
            ("Entrega continua", "持续部署 (CD)"), ("CD", "CD (CD)"),
            ("Automatización de despliegue", "自动化部署 (Automatisation)"), ("Despliegue", "软件发布 (Déploiement)"),
            ("Desplegar", "部署上线 (Déployer)"), ("Entorno de desarrollo", "开发环境 (Développement)"),
            ("Entorno de pruebas", "测试环境 (Test)"),
            ("Entorno de producción", "生产环境 (Production)"), ("Contenedor", "容器化技术 (Conteneur)"),
            ("Docker", "Docker容器 (Docker)"), ("Kubernetes", "K8s集群管理 (Kubernetes)"), ("Orquestación", "容器编排 (Orchestration)"),
            ("Microservicios", "微服务 Mono (Microservices)"), ("Monolito", "单体架构 (Monolithe)"),
            ("Infraestructura como código", "基础设施即代码 (IaC)"), ("IaC", "IaC (IaC)"),
            ("Monitoreo", "系统监控 (Surveillance)"), ("Registro de logs", "系统日志 (Journalisation)"),
            ("Métrica", "系统运行指标 (Métrique)"), ("Alerta", "故障报警 (Alerte)"),
            ("Tiempo de actividad", "正常运行时间 (Uptime)"), ("Tiempo de inactividad", "系统停机时间 (Downtime)"),
            ("Caída del servidor", "服务器宕机 (Panne)"), ("Recuperación", "灾难恢复 (Recovery)"),
            ("Migración a la nube", "云端迁移 (Migration)"), ("Virtualización", "虚拟化 (Virtualisation)"),
            ("Máquina virtual", "虚拟机 (VM)"), ("VM", "VM虚拟机 (VM)"), ("Serverless", "无服务器架构 (Serverless)"),
            ("FaaS", "函数即服务 (FaaS)"), ("Seguridad", "云端安全防护 (Sécurité)"),
            ("Proveedor de nube", "云服务提供商 (Fournisseur)")
        ],
        # Módulo 10: Metodologías Ágiles (Medio-Alto)
        [
            ("Metodología Ágil", "敏捷开发方法 (Méthodologie)"), ("Manifiesto Ágil", "敏捷宣言 (Manifeste)"),
            ("Scrum", "Scrum敏捷框架 (Scrum)"), ("Scrum Master", "Scrum大师 (Scrum Master)"),
            ("Product Owner", "产品负责人 (Product Owner)"),
            ("Equipo de desarrollo", "研发团队 (Équipe)"), ("Sprint", "冲刺迭代 (Sprint)"),
            ("Duración del sprint", "迭代周期 (Durée)"), ("Planificación", "迭代规划会 (Planification)"),
            ("Daily Scrum", "每日站会 (Daily Scrum)"), ("Reunión diaria", "站立会议 (Mêlée)"),
            ("Revisión del sprint", "评审会议 (Revue)"), ("Retrospectiva", "回顾会议 (Rétrospective)"),
            ("Backlog de producto", "产品需求积压 (Product backlog)"), ("Backlog de sprint", "迭代任务积压 (Sprint backlog)"),
            ("Punto de historia", "故事点 (Story point)"), ("Estimación", "工时估算 (Estimation)"),
            ("Historia de usuario", "用户故事 (User story)"), ("Criterio de aceptación", "验收标准 (Critères)"),
            ("Definición de terminado", "已完成定义 (DoD)"), ("DoD", "DoD完成标准 (DoD)"),
            ("Definición de preparado", "准备就绪定义 (DoR)"), ("DoR", "DoR就绪标准 (DoR)"), ("Kanban", "看板管理 (Kanban)"),
            ("Tablero Kanban", "看板墙 (Tableau)"), ("Columna de estado", "状态看板列 (Colonne)"),
            ("Límite WIP", "在制品限制 (WIP)"), ("Trabajo en progreso", "进行中任务 (WIP)"),
            ("Flujo de valor", "价值流 (Flux)"), ("Burndown chart", "燃尽图 (Burndown chart)"),
            ("Velocidad del equipo", "团队迭代速度 (Vélocité)"), ("Cuello de botella", "流程卡顿点 (Goulot)"),
            ("Mejora continua", "持续改进 (Amélioration)"), ("Kaizen", "改善 (Kaizen)"),
            ("Colaboración", "客户共创 (Collaboration)"), ("Respuesta al cambio", "拥抱变化 (Adaptation)"),
            ("Software funcional", "可用软件 (Logiciel)"), ("Interacción individual", "人与互动 (Individus)"),
            ("Desarrollo iterativo", "迭代开发 (Développement)"), ("Desarrollo incremental", "增量交付 (Développement)"),
            ("Sprint backlog", "任务看板 (Sprint backlog)"), ("Product backlog", "需求池 (Product backlog)"),
            ("Tablero Scrum", "Scrum任务墙 (Tableau)"), ("Planificación de sprint", "迭代计划 (Réunion)"),
            ("Demo", "产品演示 (Démonstration)"), ("Bloqueo de tarea", "开发受阻 (Bloquage)"),
            ("Tarea pendiente", "待办任务 (Tâche)")
        ]
    ]
}

CATEGORIES = ["basics", "travel", "business", "marketing", "tech"]
LEVELS = ["A1", "A2", "B1", "B2", "C1"]

def generate():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        print(f"Directory verified/created: {OUTPUT_DIR}")

    count = 0
    
    # Recorremos cada categoría
    for category in CATEGORIES:
        # Obtenemos los 10 módulos de esta categoría
        modules_list = VOCAB_DATABASE.get(category, [])
        
        for mod_idx in range(10):
            module_num = mod_idx + 1
            
            # Determinamos el nivel gramatical (A1 para módulos 1-4, A2 para 5-7, B1 para 8-10)
            if module_num <= 4:
                level = "A1"
            elif module_num <= 7:
                level = "A2"
            else:
                level = "B1"

            # Obtenemos los pares de palabras
            raw_pairs = modules_list[mod_idx]
            
            # Formateamos los pares de palabras: "en" almacena ESPAÑOL y "es" almacena CHINO + PINYIN
            # para que el frontend (que espera "en" y "es") muestre Español a Chino sin Inglés.
            formatted_pairs = []
            for i, p in enumerate(raw_pairs):
                pair_id = f"p_{i+1:02d}"
                formatted_pairs.append({
                    "id": pair_id,
                    "en": p[0],  # Palabra en ESPAÑOL
                    "es": p[1]   # Palabra en CHINO (Hanzi + Pinyin)
                })
            
            file_id = f"{category}_mod_{module_num:02d}"
            
            # Títulos bonitos en Español/Chino
            category_titles = {
                "basics": "Life Essentials (Básicos)",
                "travel": "World Explorer (Viajes)",
                "business": "Business Pro (Negocios)",
                "marketing": "Growth Hacking (Marketing)",
                "tech": "Tech Stack (Tecnología)"
            }
            category_names_zh = {
                "basics": "日常基础 (Rìcháng Jīchǔ)",
                "travel": "旅行词汇 (Lǚxíng Cíhuì)",
                "business": "商务用语 (Shāngwù Yòngyǔ)",
                "marketing": "市场营销 (Shìcháng Yíngxiāo)",
                "tech": "技术与电脑 (Jìshù yǔ Diànnǎo)"
            }
            
            main_title_es = category_titles.get(category, "Vocabulario")
            main_title_zh = category_names_zh.get(category, "Vocabulaire")
            
            # Estructura del JSON que espera el backend y entrega al frontend
            lesson_data = {
                "id": file_id,
                "category_id": category,
                "title": f"{main_title_zh} {level}-{module_num}",
                "description": f"Dominio de vocabulario de {main_title_es}. Nivel {level}, Módulo {module_num}.",
                "level": level,
                "part": module_num,
                "total_xp": 500,
                "status": "locked",
                "theme": {
                    "icon": "Languages",
                    "color": "orange"
                },
                "stages": [
                    {
                        "id": f"drill_{file_id}",
                        "type": "pairing_drill",
                        "title": f"Neuro Link: {main_title_zh}",
                        "description": "Asociación rápida e inteligente de conceptos.",
                        "instruction": "Empareja la palabra en Español con su traducción correcta en Chino.",
                        "pairs": formatted_pairs
                    }
                ]
            }

            output_file_path = f"{OUTPUT_DIR}/{file_id}.json"
            
            # Escribir el archivo
            with open(output_file_path, "w", encoding="utf-8") as f:
                json.dump(lesson_data, f, indent=2, ensure_ascii=False)
                
            count += 1
            print(f"[OK] Generado: {file_id}.json ({len(formatted_pairs)} pares Espanol -> Chino)")

    print(f"\nSUCCESS: Se han inyectado {count} bloques de vocabulario en {OUTPUT_DIR}")

if __name__ == "__main__":
    generate()
