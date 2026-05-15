import json
import os
from pathlib import Path

# Configuración de rutas
BASE_DIR = Path(__file__).resolve().parent
OUTPUT_DIR = BASE_DIR / "app" / "data" / "lessons" / "fr"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def generate_a2_lessons():
    themes = [
        ("Emails Clients", "Rédaction formelle", "Objet : Suite à notre réunion", "L'e-mail est votre visage numérique."),
        ("Réunions de Projet", "Vocabulaire opérationnel", "Le projet avance bien.", "Gérer les réunions avec efficacité."),
        ("Feed-back Équipe", "Donner son avis", "C'est un bon travail.", "La communication constructive."),
        ("Rapports d'Activité", "Passé composé", "J'ai fini le rapport.", "Rendre compte de vos actions."),
        ("Résolution de Problèmes", "Futur simple", "Nous trouverons une solution.", "Anticiper et résoudre."),
        ("Relations Clients", "Hospitalité", "Comment puis-je vous aider ?", "Le service client d'excellence."),
        ("Gestion de Conflits", "Négociation de base", "Je comprends votre point de vue.", "Gérer les tensions."),
        ("Analyse de Données", "Comparatifs", "Plus cher que prévu.", "Analyser les résultats."),
        ("Présentations Courtes", "Structure", "Aujourd'hui, je vais présenter...", "L'art de la présentation."),
        ("Révision A2", "Bilan opérationnel", "Récapitulatif.", "Prêt pour le niveau B1.")
    ]

    for i, (title, desc, intro_text, visual) in enumerate(themes):
        lesson_id = f"fr-a2-{i+1}"
        lesson = {
            "id": lesson_id,
            "title": title,
            "total_xp": 100,
            "stages": [
                {
                    "id": "theory-1",
                    "type": "theory",
                    "title": title,
                    "parts": [
                        { "visual": visual, "audio": f"Leçon sur {title.lower()}." }
                    ]
                },
                {
                    "id": "quiz-1",
                    "type": "quiz",
                    "title": "Pratique",
                    "questions": [
                        {
                            "type": "quiz_choice",
                            "question": f"Comment s'appelle cette unité ?",
                            "options": [title, "Autre", "N/A"],
                            "correct_answer": title,
                            "explanation": "Correct."
                        }
                    ]
                }
            ]
        }
        
        file_path = OUTPUT_DIR / f"{lesson_id}.json"
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(lesson, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    generate_a2_lessons()
