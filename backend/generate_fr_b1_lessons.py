import json
import os
from pathlib import Path

# Configuración de rutas
BASE_DIR = Path(__file__).resolve().parent
OUTPUT_DIR = BASE_DIR / "app" / "data" / "lessons" / "fr"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def generate_b1_lessons():
    themes = [
        ("Négociation Avancée", "Conditionnel", "Si nous signons demain...", "L'art de l'accord."),
        ("Stratégie de Marché", "Analyse", "Le marché est porteur.", "Vision à long terme."),
        ("Ventes Directes", "Persuasion", "Ce produit est révolutionnaire.", "Convaincre le client."),
        ("Marketing Digital", "Outils", "Optimisons le SEO.", "La visibilité en ligne."),
        ("Finance Corporative", "Budgets", "Le ROI est positif.", "Maîtrise des chiffres."),
        ("RH et Recrutement", "Entretiens", "Parlez-moi de vous.", "Trouver les talents."),
        ("Leadership Éthique", "Valeurs", "L'intégrité avant tout.", "Diriger avec exemplarité."),
        ("Culture d'Entreprise", "Valeurs", "Notre ADN est l'innovation.", "L'identité de marque."),
        ("Droit des Affaires", "Contrats", "Les clauses de confidentialité.", "Protection juridique."),
        ("Révision B1", "Bilan Management", "Expertise acquise.", "Vers le niveau B2.")
    ]

    for i, (title, desc, intro_text, visual) in enumerate(themes):
        lesson_id = f"fr-b1-{i+1}"
        lesson = {
            "id": lesson_id,
            "title": title,
            "total_xp": 100,
            "stages": [
                {
                    "id": "theory-1", "type": "theory", "title": title,
                    "parts": [{ "visual": visual, "audio": f"Module {title}." }]
                },
                {
                    "id": "quiz-1", "type": "quiz", "title": "Check",
                    "questions": [{ "type": "quiz_choice", "question": "Ok?", "options": ["Oui"], "correct_answer": "Oui", "explanation": "." }]
                }
            ]
        }
        file_path = OUTPUT_DIR / f"{lesson_id}.json"
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(lesson, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    generate_b1_lessons()
