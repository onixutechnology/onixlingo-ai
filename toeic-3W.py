import json
import random
import os

# --- BASE DE DATOS WRITING ---
email_scenarios = [
    "You received an email from a client complaining about a late delivery. Write a polite response apologizing and offering a discount.",
    "Write an email to your manager asking for two days of leave next month for a family wedding.",
    "You need to reschedule a meeting with a supplier. Write an email proposing a new time."
]

essay_topics = [
    "Do you agree or disagree? 'Remote work is more productive than working in an office.'",
    "Some companies prefer to hire experienced workers, while others hire recent graduates. Which do you prefer and why?",
    "Describe a significant challenge you faced at work and how you overcame it."
]

# --- ENSAMBLAJE ---
lesson = {
    "id": "toeic-writing-1",
    "title": "TOEIC Writing: Emails & Essays",
    "level": "C1",
    "description": "Redacción profesional de negocios.",
    "stages": []
}

lesson["stages"].append({
    "type": "lecture",
    "title": "Email Etiquette",
    "parts": [{
        "visual": "## The Sandwich Method 🥪\n\n1. **Greeting & Purpose** (Positive)\n2. **The Issue/Request** (Meat)\n3. **Closing & Call to Action** (Positive)",
        "audio": "When writing business emails, structure is key. Start positive, state your business clearly, and end with a polite closing like 'Sincerely' or 'Best regards'.",
        "animation": "talking"
    }]
})

# SIMULACIÓN DE EMAIL (Tarea 6-7)
prompt_email = random.choice(email_scenarios)
lesson["stages"].append({
    "type": "practice_chat",
    "scenario": "Business Email Response",
    "question": f"TASK: {prompt_email}",
    "ai_system_prompt": "ROLE: TOEIC Grader. GOAL: Evaluate the user's email for tone, grammar, and clarity. Give a score out of 10."
})

# SIMULACIÓN DE ENSAYO (Tarea 8)
prompt_essay = random.choice(essay_topics)
lesson["stages"].append({
    "type": "lecture",
    "title": "Opinion Essay",
    "parts": [{
        "visual": "## Opinion Essay (300 words)\n\n* Introduction (Thesis)\n* Argument 1 + Example\n* Argument 2 + Example\n* Conclusion",
        "audio": "For the final essay, you have 30 minutes. Pick a side immediately. Do not be neutral. Support your opinion with specific examples.",
        "animation": "serious"
    }]
})

lesson["stages"].append({
    "type": "practice_chat",
    "scenario": "Opinion Essay",
    "question": f"TOPIC: {prompt_essay}",
    "ai_system_prompt": "ROLE: TOEIC Essay Grader. GOAL: Assess structure, vocabulary, and grammar. Provide constructive feedback."
})

output_path = "backend/app/data/lessons/toeic_writing.json"
os.makedirs(os.path.dirname(output_path), exist_ok=True)
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(lesson, f, indent=2, ensure_ascii=False)

print(f"✅ TOEIC WRITING GENERADO: {output_path}")