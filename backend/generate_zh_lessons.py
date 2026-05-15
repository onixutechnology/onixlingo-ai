import json
import os
from pathlib import Path

# Configuración de rutas
BASE_DIR = Path(__file__).resolve().parent
OUTPUT_DIR = BASE_DIR / "app" / "data" / "lessons" / "zh"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def generate_zh_lessons():
    levels = ["a1", "a2", "b1", "b2", "c1", "c2"]
    
    themes_map = {
        "a1": [
            ("你好 (Nǐ hǎo)", "Saludos y Tonos", "Nǐ hǎo! Bienvenue en Chine."),
            ("数字 (Shùzì)", "Números y Precios", "Yī, èr, sān..."),
            ("我的名字 (Wǒ de míngzì)", "Presentación Personal", "Wǒ jiào..."),
            ("家 (Jiā)", "Familia y Hogar", "Wǒ de jiā zài..."),
            ("吃饭 (Chī fàn)", "Comida y Restaurante", "Wǒ yào chī..."),
            ("时间 (Shíjiān)", "Días y Horas", "Xiànzài jǐ diǎn?"),
            ("工作 (Gōngzuò)", "En la Oficina", "Wǒ zài bàn gōng shì..."),
            ("买东西 (Mǎi dōngxī)", "Compras y Pagos", "Duō shǎo qián?"),
            ("去哪里 (Qù nǎlǐ)", "Transporte y Viajes", "Wǒ qù běijīng..."),
            ("复习 (Fùxí)", "Bilan A1", "Gōngxǐ!")
        ],
        "a2": [("Operación Zh A2-" + str(i+1), "Negocios básicos", "Mandarín operativo.") for i in range(10)],
        "b1": [("Gestión Zh B1-" + str(i+1), "Guanxi y Cultura", "Mandarín intermedio.") for i in range(10)],
        "b2": [("Estrategia Zh B2-" + str(i+1), "Liderazgo", "Mandarín avanzado.") for i in range(10)],
        "c1": [("Diplomacia Zh C1-" + str(i+1), "Persuasión", "Mandarín autónomo.") for i in range(10)],
        "c2": [("Maestría Zh C2-" + str(i+1), "Visión Global", "Mandarín experto.") for i in range(10)]
    }

    for level in levels:
        for i, theme_data in enumerate(themes_map[level]):
            title, desc, intro = theme_data
            lesson_id = f"zh-{level}-{i+1}"
            
            lesson = {
                "id": lesson_id,
                "title": title,
                "total_xp": 100,
                "stages": [
                    {
                        "id": "intro",
                        "type": "theory",
                        "title": title,
                        "parts": [
                            {
                                "visual": f"{title}\n\n{desc}\n\n{intro}",
                                "audio": f"Bienvenue à la leçon sur {title}."
                            }
                        ]
                    },
                    {
                        "id": "drill",
                        "type": "pairing_drill",
                        "title": "Vocabulaire Professionnel",
                        "pairs": [
                            { "id": "p1", "en": "Manager", "es": "经理 (Jīnglǐ)" },
                            { "id": "p2", "en": "Company", "es": "公司 (Gōngsī)" },
                            { "id": "p3", "en": "Work", "es": "工作 (Gōngzuò)" },
                            { "id": "p4", "en": "Hello", "es": "你好 (Nǐ hǎo)" }
                        ]
                    },
                    {
                        "id": "quiz",
                        "type": "quiz",
                        "title": "Vérification",
                        "questions": [
                            {
                                "type": "quiz_choice",
                                "question": f"¿Qué significa '{title}'?",
                                "options": [desc, "Otra cosa", "No lo sé"],
                                "correct_answer": desc,
                                "explanation": f"'{title}' se refiere a {desc.lower()} en contexto profesional."
                            }
                        ]
                    }
                ]
            }
            
            file_path = OUTPUT_DIR / f"{lesson_id}.json"
            with open(file_path, "w", encoding="utf-8") as f:
                json.dump(lesson, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    generate_zh_lessons()
