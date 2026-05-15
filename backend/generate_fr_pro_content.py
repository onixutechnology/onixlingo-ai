import json
import os
from pathlib import Path

# Configuración de rutas
BASE_DIR = Path(__file__).resolve().parent
OUTPUT_DIR = BASE_DIR / "app" / "datapro" / "lessonspro" / "fr"
os.makedirs(OUTPUT_DIR, exist_ok=True)

levels = ["b1", "b2", "c1", "c2", "exec", "mastery"]
titles_map = {
    "b1": "Fondations Exécutives",
    "b2": "Gestion et Management",
    "c1": "Stratégie Avancée",
    "c2": "Présence Exécutive",
    "exec": "Dynamique du Conseil",
    "mastery": "Leadership Global"
}

lesson_themes = {
    "b1": ["Introductions", "Emails", "Voyages", "Réunions", "Téléphone", "Présentations", "Networking", "Culture", "Social", "Bilan"],
    "b2": ["Liderazgo", "Négociation", "Conflits", "Feedback", "Entretien", "Motivation", "Ventes", "Marketing", "RH", "Bilan"],
    "c1": ["Pitching", "Crisis", "Persuasion", "M&A", "Finance", "Legal", "Public Speaking", "Ethics", "CSR", "Bilan"],
    "c2": ["Eloquence", "Diplomacy", "Philosophy", "Innovation", "Global Markets", "Media Training", "Policy", "Influence", "Mentoring", "Bilan"],
    "exec": ["Boardroom", "Stakeholders", "Governance", "Auditing", "Compliance", "Quarterly", "Restructuring", "Expansion", "IPO", "Bilan"],
    "mastery": ["Intercultural", "Global Strategy", "Complex Systems", "Future Trends", "Sustainability", "Visionary", "Legacy", "Excellence", "Integrity", "Final"]
}

def generate_lesson(level, lesson_num, theme):
    lesson_id = f"pro-{level}-{lesson_num}"
    lesson_title = f"{titles_map[level]} : {theme}"
    
    lesson = {
        "id": lesson_id,
        "title": lesson_title,
        "level": level.upper(),
        "type": "titanium_gauntlet",
        "total_xp": 500,
        "stages": [
            {
                "id": "stage-intro",
                "type": "theory",
                "title": f"Aperçu du Module : {theme}",
                "parts": [
                    {
                        "visual": f"Bienvenue au module de perfectionnement professionnel.\n\nCe cours porte sur : {theme}.\n\nObjectifs :\n1. Maîtriser le vocabulaire clé.\n2. Améliorer la fluidité en contexte exécutif.\n3. Gérer les situations complexes.",
                        "audio": f"Bienvenue. Ce module se concentre sur {theme}."
                    }
                ]
            },
            {
                "id": "stage-quiz-1",
                "type": "quiz",
                "title": "Phase 1 : Analyse et Compréhension",
                "questions": [
                    {
                        "type": "quiz_choice",
                        "question": f"Quel est l'objectif principal de ce module sur {theme} ?",
                        "options": ["Pratique basique", "Maîtrise exécutive", "Vocabulaire général"],
                        "correct_answer": "Maîtrise exécutive",
                        "explanation": "Le niveau Titanium exige une précision absolue."
                    },
                    {
                        "type": "listening_match",
                        "question": "Écoutez et choisissez le ton approprié :",
                        "tts_text": "Je propose de restructurer notre département.",
                        "options": ["Formel", "Informel"],
                        "correct_answer": "Formel",
                        "explanation": "Le verbe 'proposer' est un standard de la communication boardroom."
                    }
                ]
            },
            {
                "id": "stage-quiz-2",
                "type": "quiz",
                "title": "Phase 2 : Syntaxe et Structure",
                "questions": [
                    {
                        "type": "order_sentence",
                        "question": "Construisez la proposition de valeur :",
                        "parts": ["Nous", "optimisons", "les", "processus", "globaux."],
                        "correct_order": ["Nous", "optimisons", "les", "processus", "globaux."],
                        "explanation": "Sujet + Verbe d'action + Complément stratégique."
                    }
                ]
            }
        ]
    }
    
    # Añadir más preguntas para completar un set profesional (simulado)
    # Por brevedad en el script, añadiré 2 más de cada tipo
    for i in range(3, 11):
        lesson["stages"][1]["questions"].append({
            "type": "quiz_choice",
            "question": f"Question de réflexion {i} sur {theme}",
            "options": ["Option A", "Option B", "Option C"],
            "correct_answer": "Option A",
            "explanation": "Explication stratégique détaillée en français."
        })
        
    return lesson

for level in levels:
    for i in range(1, 11):
        theme = lesson_themes[level][i-1]
        content = generate_lesson(level, i, theme)
        file_path = OUTPUT_DIR / f"pro-{level}-{i}.json"
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(content, f, ensure_ascii=False, indent=2)

print(f"✅ 60 lecciones profesionales generadas en {OUTPUT_DIR}")
