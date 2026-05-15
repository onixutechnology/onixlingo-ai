import json
import os
from pathlib import Path

# Configuración de rutas
BASE_DIR = Path(__file__).resolve().parent
OUTPUT_DIR = BASE_DIR / "app" / "data" / "lessons" / "fr"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def generate_a1_lessons():
    a1_themes = [
        ("Premier Contact", "Salutations et verbe être", "Bonjour, je suis...", "Bienvenue. Apprenons à nous présenter."),
        ("L'Espace de Travail", "Objets du bureau", "C'est mon bureau.", "Voici votre nouvel environnement de travail."),
        ("Chiffres et Budgets", "Nombres et prix", "Ça coûte dix euros.", "La gestion des prix est cruciale."),
        ("Gestion du Temps", "Heures et planning", "La réunion est à midi.", "Organisons votre emploi du temps."),
        ("La Routine de Bureau", "Habitudes quotidiennes", "Je commence à 9h.", "Décrivez votre journée type."),
        ("Le Déjeuner d'Affaires", "Commander au restaurant", "Je voudrais le menu.", "L'étiquette au restaurant."),
        ("Appels de Base", "Téléphone et messages", "Puis-je parler à Paul ?", "Gérer les appels entrants."),
        ("Déplacements Urbains", "Itinéraires et lieux", "Où est la gare ?", "Naviguer dans la ville."),
        ("Check-in Hôtel", "Logistique voyage", "J'ai une réservation.", "Arrivée à l'hôtel pour le travail."),
        ("Révision A1", "Bilan du niveau", "Révision générale.", "Félicitations pour votre parcours.")
    ]

    for i, (title, desc, intro_text, visual) in enumerate(a1_themes):
        lesson_id = f"fr-a1-{i+1}"
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
                        {
                            "visual": visual,
                            "audio": f"Bienvenue dans la leçon sur {title.lower()}."
                        }
                    ]
                },
                {
                    "id": "drill-1",
                    "type": "pairing_drill",
                    "title": "Vocabulaire Clé",
                    "pairs": [
                        { "id": "p1", "en": "Office", "es": "Bureau" },
                        { "id": "p2", "en": "Manager", "es": "Directeur" },
                        { "id": "p3", "en": "Meeting", "es": "Réunion" },
                        { "id": "p4", "en": "File", "es": "Dossier" }
                    ]
                },
                {
                    "id": "quiz-1",
                    "type": "quiz",
                    "title": "Compréhension",
                    "questions": [
                        {
                            "type": "quiz_choice",
                            "question": f"Comment dit-on '{title}' en français ?",
                            "options": [title, "Autre chose", "Rien"],
                            "correct_answer": title,
                            "explanation": "C'est la base de cette unité."
                        }
                    ]
                }
            ]
        }
        
        file_path = OUTPUT_DIR / f"{lesson_id}.json"
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(lesson, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    generate_a1_lessons()
    print("✅ 10 lecciones A1 francesas generadas.")
