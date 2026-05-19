import json
import random
import os

# --- BASE DE DATOS TOEIC LISTENING ---
locations = ["conference room", "airport terminal", "warehouse", "reception desk", "main lobby"]
actions = ["reviewing the quarterly report", "boarding the flight", "inspecting the inventory", "scheduling an appointment", "greeting a client"]
distractors = ["eating lunch", "playing sports", "watching a movie", "sleeping on the couch", "cleaning the floor"]

conversations = [
    {
        "script": "M: When is the deadline for the marketing proposal?\nW: It was due yesterday, but the manager extended it until Friday.\nM: That's a relief. I thought I was going to miss it.",
        "question": "When is the proposal due now?",
        "correct": "Friday",
        "options": ["Yesterday", "Today", "Next Monday"]
    },
    {
        "script": "W: Excuse me, does this bus go to the city center?\nM: No, this one goes to the airport. You need the number 42 bus.\nW: Oh, thanks. Do you know when it arrives?",
        "question": "Where does the woman want to go?",
        "correct": "The city center",
        "options": ["The airport", "The bus station", "Number 42"]
    }
]

# --- GENERADORES DE EJERCICIOS ---

def gen_part1_photographs(idx):
    """Simula Part 1: El usuario ve una 'imagen' (descrita en texto/img) y escucha 4 opciones."""
    loc = random.choice(locations)
    act = random.choice(actions)
    correct_sentence = f"They are {act} in the {loc}."
    
    # Generar distractores plausibles
    opts = [
        correct_sentence,
        f"They are {random.choice(distractors)}.",
        f"The {loc} is empty.",
        f"He is leaving the {loc}."
    ]
    random.shuffle(opts)
    
    return {
        "id": f"L1_{idx}",
        "type": "quiz_choice",
        "question": "[IMAGE CONTEXT: A busy business setting]. Listen to the four statements.",
        "audio_script": "A) " + opts[0] + " B) " + opts[1] + " C) " + opts[2] + " D) " + opts[3], 
        "options": ["Statement A", "Statement B", "Statement C", "Statement D"],
        "correct_answer": f"Statement {chr(65 + opts.index(correct_sentence))}",
        "explanation": f"La descripción correcta es: '{correct_sentence}'."
    }

def gen_part3_conversations(idx):
    """Simula Part 3: Conversaciones cortas."""
    data = random.choice(conversations)
    opts = data["options"] + [data["correct"]]
    random.shuffle(opts)
    
    return {
        "id": f"L3_{idx}",
        "type": "quiz_choice",
        "question": f"Listen to the conversation. {data['question']}",
        "audio_script": data["script"], # TU IA LEERÁ ESTO
        "options": opts,
        "correct_answer": data["correct"],
        "explanation": "Basado en el audio, la fecha fue extendida hasta el Viernes."
    }

# --- ENSAMBLAJE DE LA LECCIÓN ---
lesson = {
    "id": "toeic-listening-1",
    "title": "TOEIC Listening: Business Context",
    "level": "B2/C1",
    "description": "Entrenamiento auditivo intensivo con IA.",
    "stages": []
}

# INTRODUCCIÓN CON AVATAR
lesson["stages"].append({
    "id": "intro",
    "type": "lecture",
    "title": "Strategy: Photodescription",
    "parts": [
        {
            "visual": "## TOEIC Part 1: Focus on Verbs 📸\n\nEn la Parte 1, concéntrate en:\n1. **Sujeto** (Who)\n2. **Acción** (Present Continuous)\n3. **Entorno** (Where)",
            "audio": "Welcome to the Listening Section. In Part 1, you will see a picture. I will read four sentences. You must select the one that best describes the action. Beware of similar sounding words!",
            "animation": "teacher_pointing"
        }
    ]
})

# EJERCICIOS
lesson["stages"].append({"id": "quiz-part1", "type": "quiz", "questions": [gen_part1_photographs(i) for i in range(5)]})
lesson["stages"].append({"id": "quiz-part3", "type": "quiz", "questions": [gen_part3_conversations(i) for i in range(5)]})

# GUARDAR
output_path = "backend/app/data/lessons/toeic_listening.json"
os.makedirs(os.path.dirname(output_path), exist_ok=True)
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(lesson, f, indent=2, ensure_ascii=False)

print(f"✅ TOEIC LISTENING GENERADO: {output_path}")