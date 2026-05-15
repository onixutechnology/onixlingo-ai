import json
import os
from pathlib import Path

# Configuración de rutas
BASE_DIR = Path(__file__).resolve().parent
OUTPUT_DIR = BASE_DIR / "app" / "data" / "lessons" / "fr"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def generate_advanced_lessons():
    levels = ["b2", "c1", "c2"]
    themes_map = {
        "b2": [
            ("Expansion Globale", "Stratégie"), ("Innovation Disruptive", "Tech"), 
            ("Fusions et Acquisitions", "Finance"), ("Gestion de Crise", "Comms"), 
            ("Lobbying et Influence", "Politique"), ("Audit Interne", "Finance"), 
            ("Compliance et Éthique", "Legal"), ("Vision Stratégique", "Leadership"), 
            ("Agilité Opérationnelle", "Management"), ("Bilan B2", "Revision")
        ],
        "c1": [
            ("Diplomatie de Haute Volée", "C-Level"), ("Rétorique Exécutive", "Eloquence"), 
            ("Stakeholders Management", "Strategy"), ("Introductions en Bourse (IPO)", "Finance"), 
            ("Responsabilité Sociétale (CSR)", "Ethics"), ("Gestion de l'Image", "PR"), 
            ("Négociations Multilatérales", "Diplomacy"), ("Intelligence Économique", "Strategy"), 
            ("Leadership Transformationnel", "Management"), ("Bilan C1", "Revision")
        ],
        "c2": [
            ("Philosophie de l'Excellence", "Mastery"), ("Éloquence Absolue", "Mastery"), 
            ("Gouvernance Mondiale", "Mastery"), ("Héritage Corporatif", "Mastery"), 
            ("Futurisme et Prospective", "Mastery"), ("Intégrité Radicale", "Mastery"), 
            ("Maîtrise de l'Incertitude", "Mastery"), ("Excellence Opérationnelle", "Mastery"), 
            ("Leadership Visionnaire", "Mastery"), ("Évaluation Finale C2", "Final")
        ]
    }

    for level in levels:
        for i, (title, focus) in enumerate(themes_map[level]):
            lesson_id = f"fr-{level}-{i+1}"
            lesson = {
                "id": lesson_id,
                "title": title,
                "total_xp": 100,
                "stages": [
                    {
                        "id": "theory-1", "type": "theory", "title": title,
                        "parts": [{ "visual": f"Maîtrise du module {title}.", "audio": f"Expertise {level.upper()}." }]
                    },
                    {
                        "id": "quiz-1", "type": "quiz", "title": "Validation",
                        "questions": [{ "type": "quiz_choice", "question": "Confirmer?", "options": ["Oui"], "correct_answer": "Oui", "explanation": "." }]
                    }
                ]
            }
            file_path = OUTPUT_DIR / f"{lesson_id}.json"
            with open(file_path, "w", encoding="utf-8") as f:
                json.dump(lesson, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    generate_advanced_lessons()
