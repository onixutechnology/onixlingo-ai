import json
import os

# --- 1. CONFIGURACIÓN DE RUTA ---
# Asegúrate de que esta carpeta exista
OUTPUT_DIR = "app/datapro/lessonspro"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# --- 2. EL CURRÍCULUM COMPLETO (TÍTULOS REALES) ---
CURRICULUM = {
    "b1": [
        "Professional Introductions", "Formal Emailing", "Business Travel Logistics", 
        "Scheduling Meetings", "Office Small Talk", "Describing Job Roles", 
        "Telephone Etiquette", "Giving Instructions", "Professional Apologies", "B1 Milestone: Networking Event"
    ],
    "b2": [
        "Leading Effective Meetings", "Negotiation Fundamentals", "Data Presentation", 
        "Conflict Resolution", "Performance Feedback", "Project Management Terms", 
        "Writing Reports", "Job Interviews", "Marketing Basics", "B2 Milestone: Quarterly Review"
    ],
    "c1": [
        "Global Market Analysis", "Crisis Management", "Financial Terminology", 
        "Mergers & Acquisitions", "Public Speaking", "Nuanced Negotiation", 
        "Legal Contracts", "ESG & Sustainability", "Corporate Strategy", "C1 Milestone: Board Presentation"
    ],
    "c2": [
        "Idiomatic Business Expressions", "Subtlety & Persuasion", "Cultural Intelligence (CQ)", 
        "Advanced Economics", "Humor in Business", "Hostile Q&A Handling", 
        "Executive Ghostwriting", "Diplomatic Language", "Interpreting Silence", "C2 Milestone: Global Summit"
    ],
    "exec": [
        "Organizational Vision", "Stakeholder Management", "IPO & Exit Strategies", 
        "Corporate Governance", "Leadership Philosophy", "Change Management", 
        "Investor Relations", "Risk Assessment", "Succession Planning", "Executive Milestone: Shareholder Meeting"
    ],
    "mastery": [
        "AI & Tech Disruption", "Fintech & Blockchain", "Biotech Innovations", 
        "Green Energy Transition", "Supply Chain Logistics", "Luxury Brand Management", 
        "Real Estate Development", "Venture Capital Pitching", "Cybersecurity Protocols", "Mastery Capstone: Building a Unicorn"
    ]
}

# --- 3. LA "PLANTILLA MAESTRA" (ESTRUCTURA PROFESIONAL) ---
# Esta función crea un JSON válido y rico en estructura para cada lección
def create_lesson_structure(lesson_id, title, level):
    # Personalización leve basada en el nivel para que no se vea todo igual
    intro_text = f"Welcome to the {level.upper()} executive module: {title}."
    
    return {
        "id": lesson_id,
        "title": title,
        "stages": [
            # ETAPA 1: TEORÍA (CONCEPTOS DE ALTO NIVEL)
            {
                "id": "stage-1",
                "type": "theory",
                "title": f"Strategic Concept: {title}",
                "parts": [
                    {
                        "visual": f"{intro_text}\n\nIn this session, we analyze the critical vocabulary required to navigate this scenario with authority.\n\nKey Principle:\nTrue professionals don't just communicate information; they communicate *intent*.\n\nObserve the nuance in the following exercises.",
                        "audio": f"{intro_text} Let's master this topic."
                    }
                ]
            },
            # ETAPA 2: LISTENING / SELECCIÓN (QUIZ)
            {
                "id": "stage-2",
                "type": "quiz",
                "title": "Executive Comprehension",
                "questions": [
                    {
                        "type": "quiz_choice",
                        "question": f"Which is the most professional approach regarding '{title}'?",
                        "options": [
                            "Use casual slang to seem friendly.",
                            "Prioritize clarity, brevity, and formal tone.",
                            "Avoid eye contact and speak softly.",
                            "Use overly complex words to sound smart."
                        ],
                        "correct_answer": "Prioritize clarity, brevity, and formal tone.",
                        "explanation": "Executive presence is built on clear and concise communication, not complexity."
                    }
                ]
            },
            # ETAPA 3: CONSTRUCCIÓN DE FRASES (GAMIFIED)
            {
                "id": "stage-3",
                "type": "gamified_quiz",
                "title": "Structure & Syntax Drill",
                "questions": [
                    {
                        "type": "order_sentence",
                        "question": "Arrange the standard corporate phrase:",
                        "parts": ["We", "need", "to", "leverage", "our", "core", "competencies."],
                        "correct_order": ["We", "need", "to", "leverage", "our", "core", "competencies."],
                        "explanation": "'Leveraging competencies' is standard business English for using your strengths."
                    },
                    {
                        "type": "fill_input",
                        "question": "Complete the term: Return on ______ (ROI).",
                        "correct_answers": ["Investment", "investment"],
                        "explanation": "ROI stands for Return On Investment."
                    }
                ]
            }
        ]
    }

# --- 4. EL MOTOR DE GENERACIÓN ---
def main():
    print(f"🚀 Iniciando generación de contenido en: {OUTPUT_DIR}")
    count = 0
    
    for level, titles in CURRICULUM.items():
        for i, title in enumerate(titles):
            # Generar ID: pro-b1-1, pro-exec-5, etc.
            lesson_num = i + 1
            # Ajuste para 'exec' y 'mastery' que usan prefijos distintos en tu frontend
            prefix = "pro-" + level 
            if level == "exec": prefix = "pro-exec" 
            if level == "mastery": prefix = "pro-mastery"
            
            lesson_id = f"{prefix}-{lesson_num}"
            
            # Crear contenido
            lesson_data = create_lesson_structure(lesson_id, title, level)
            
            # Guardar archivo
            filename = os.path.join(OUTPUT_DIR, f"{lesson_id}.json")
            with open(filename, "w", encoding="utf-8") as f:
                json.dump(lesson_data, f, indent=4, ensure_ascii=False)
            
            print(f"✅ Generado: {filename}")
            count += 1

    print(f"\n✨ ¡ÉXITO! {count} lecciones profesionales generadas.")

if __name__ == "__main__":
    main()