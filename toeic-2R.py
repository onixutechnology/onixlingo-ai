import json
import random
import os

# --- BASE DE DATOS TOEIC READING ---
grammar_q = [
    {"q": "The CEO suggested ___ costs by switching suppliers.", "ans": "reducing", "opts": ["reduce", "to reduce", "reduction"], "rule": "Suggest + Gerund (-ing)"},
    {"q": "Ms. Sato ___ in the HR department since 2010.", "ans": "has worked", "opts": ["works", "is working", "worked"], "rule": "Present Perfect (since)"},
    {"q": "The shipment arrived ___ despite the storm.", "ans": "promptly", "opts": ["prompt", "promptness", "prompted"], "rule": "Adverb modifying verb"},
    {"q": "We need to comply ___ the new regulations.", "ans": "with", "opts": ["to", "for", "on"], "rule": "Comply + With"}
]

text_passages = [
    {
        "title": "Memo: Office Renovation",
        "text": "To: All Staff\nFrom: Facilities\n\nPlease be advised that the 4th floor will be closed for renovations starting next Monday. All employees seated in this area should relocate to the temporary desks on the 2nd floor. We apologize for the inconvenience.",
        "q": "What are employees asked to do?",
        "ans": "Move to temporary desks",
        "opts": ["Work from home", "Help with renovations", "Take a vacation"]
    }
]

# --- GENERADORES ---

def gen_part5_sentences(idx):
    """Part 5: Incomplete Sentences (Gramática)"""
    item = random.choice(grammar_q)
    opts = item["opts"] + [item["ans"]]
    random.shuffle(opts)
    
    return {
        "id": f"R5_{idx}",
        "type": "quiz_choice",
        "question": f"Select the best word: \"{item['q']}\"",
        "options": opts,
        "correct_answer": item["ans"],
        "explanation": f"Regla Gramatical: {item['rule']}."
    }

def gen_part7_passage(idx):
    """Part 7: Reading Comprehension"""
    item = random.choice(text_passages)
    opts = item["opts"] + [item["ans"]]
    random.shuffle(opts)
    
    return {
        "id": f"R7_{idx}",
        "type": "quiz_choice",
        "question": f"Read the text:\n\n**{item['title']}**\n_{item['text']}_\n\n{item['q']}",
        "options": opts,
        "correct_answer": item["ans"],
        "explanation": "La respuesta se encuentra explícitamente en el texto del memo."
    }

# --- ENSAMBLAJE ---
lesson = {
    "id": "toeic-reading-1",
    "title": "TOEIC Reading: Grammar & Texts",
    "level": "B2/C1",
    "description": "Dominio gramatical y velocidad lectora.",
    "stages": []
}

lesson["stages"].append({
    "type": "lecture",
    "title": "Part 5 Strategy",
    "parts": [{
        "visual": "## Speed Reading ⚡\n\nNo leas toda la frase primero. Mira las opciones.\n\n* Si las palabras son similares (quick, quickly), es **Gramática**.\n* Si son diferentes, es **Vocabulario**.",
        "audio": "In Part 5, time is money. First, look at the options. Determine if it is a grammar question or a vocabulary question before reading the full sentence.",
        "animation": "analyzing"
    }]
})

lesson["stages"].append({"type": "quiz", "questions": [gen_part5_sentences(i) for i in range(10)]})
lesson["stages"].append({"type": "quiz", "questions": [gen_part7_passage(i) for i in range(5)]})

output_path = "backend/app/data/lessons/toeic_reading.json"
os.makedirs(os.path.dirname(output_path), exist_ok=True)
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(lesson, f, indent=2, ensure_ascii=False)

print(f"✅ TOEIC READING GENERADO: {output_path}")