import json
import random
import os

# --- 1. BASE DE DATOS DE CONTENIDO (Nivel C1/Business) ---

# Textos para lectura en voz alta (Debe incluir términos técnicos y pausas)
read_aloud_texts = [
    "Welcome to the annual tech conference. We are thrilled to have industry leaders from around the globe joining us today. Please ensure that you have your badges visible at all times.",
    "Attention passengers. This is a security announcement. Please do not leave your luggage unattended at any time. Unattended items will be removed by airport security immediately.",
    "Traffic update: There is heavy congestion on Highway 95 due to construction work. Commuters are advised to seek alternate routes to avoid significant delays this morning.",
    "In financial news, stock markets rallied today as major tech companies reported higher than expected earnings. Analysts suggest this trend may continue into the next quarter."
]

# Preguntas de entrevista (Respuestas abiertas)
interview_q = [
    {
        "q": "Where do you see yourself in five years?",
        "context": "Imagine you are in a job interview for a Manager position."
    },
    {
        "q": "Describe your ideal work environment.",
        "context": "Focus on team dynamics and office culture."
    },
    {
        "q": "What do you consider your greatest professional strength?",
        "context": "Provide a specific example from your past experience."
    }
]

# Fotos para describir (Simuladas con texto de contexto)
picture_descriptions = [
    "Context: A group of business people in a meeting room looking at a graph on a screen.",
    "Context: A woman wearing a safety helmet holding blueprints at a construction site.",
    "Context: A busy airport terminal with passengers checking in at the counter."
]

# --- 2. GENERADORES DE ETAPAS (LOGICA PRO) ---

def gen_instruction(title, text, animation="talking"):
    """Genera una diapositiva de instrucción hablada por el avatar"""
    return {
        "type": "lecture",
        "title": title,
        "parts": [{
            "visual": f"## {title} 📢\n\n{text}",
            "audio": text,
            "animation": animation
        }]
    }

def gen_read_aloud_stage(idx):
    """
    Genera la etapa de lectura. 
    Usa 'pronunciation_drill' para que el Frontend muestre el texto grande 
    y evalúe la coincidencia de voz automáticamente.
    """
    text = random.choice(read_aloud_texts)
    return {
        "type": "pronunciation_drill",
        "title": f"Task {idx}: Read a Text Aloud",
        "content": "Preparation: 45 seconds | Response: 45 seconds",
        "sentences": [text], # El frontend iterará sobre esto y validará la voz
        "ai_system_prompt": "You are a TOEIC examiner. Rate the user's pronunciation, intonation, and stress."
    }

def gen_describe_picture_stage(idx):
    """Tarea de describir imagen (usamos quiz type con input de voz si el frontend lo soporta, o chat)"""
    pic = random.choice(picture_descriptions)
    return {
        "type": "practice_chat",
        "scenario": f"TASK {idx}: DESCRIBE THE PICTURE\n\n{pic}",
        "ai_system_prompt": "User is describing a picture. Evaluate usage of prepositions and present continuous tense.",
        "input_mode": "voice"
    }

def gen_interview_stage(idx):
    """Entrevista simulada"""
    item = random.choice(interview_q)
    return {
        "type": "practice_chat",
        "scenario": f"TASK {idx}: RESPOND TO QUESTIONS\n\nQuestion: {item['q']}\n({item['context']})",
        "ai_system_prompt": "You are an interviewer. Evaluate the candidate's response for coherence, vocabulary and fluency.",
        "input_mode": "voice"
    }

# --- 3. ENSAMBLAJE DEL EXAMEN ---

lesson = {
    "id": "toeic-speaking-1",
    "title": "TOEIC Speaking: Official Simulation",
    "level": "C1",
    "description": "Examen completo de expresión oral (20 min).",
    "stages": []
}

# SECCIÓN 1: INTRODUCCIÓN
lesson["stages"].append(gen_instruction(
    "Speaking Test Instructions",
    "In this section, you will answer 11 questions. For some questions you will have time to prepare. Speak clearly and answer fully.",
    "serious"
))

# SECCIÓN 2: READ ALOUD (Questions 1-2)
lesson["stages"].append(gen_instruction(
    "Questions 1-2: Read Aloud",
    "You will see a text on the screen. You have 45 seconds to prepare. Then you will have 45 seconds to read the text aloud.",
    "teacher_pointing"
))
lesson["stages"].append(gen_read_aloud_stage(1))
lesson["stages"].append(gen_read_aloud_stage(2))

# SECCIÓN 3: DESCRIBE A PICTURE (Question 3)
lesson["stages"].append(gen_instruction(
    "Question 3: Describe a Picture",
    "You will see a picture. Describe it in as much detail as possible. Focus on Who, What, and Where.",
    "analyzing"
))
lesson["stages"].append(gen_describe_picture_stage(3))

# SECCIÓN 4: RESPOND TO QUESTIONS (Questions 4-6)
lesson["stages"].append(gen_instruction(
    "Questions 4-6: Interview",
    "Imagine that a marketing firm is doing research in your area. You agreed to participate in a telephone interview.",
    "talking"
))
lesson["stages"].append(gen_interview_stage(4))
lesson["stages"].append(gen_interview_stage(5))

# --- 4. GUARDADO ---
output_path = "backend/app/data/lessons/toeic_speaking.json"
os.makedirs(os.path.dirname(output_path), exist_ok=True)

with open(output_path, "w", encoding="utf-8") as f:
    json.dump(lesson, f, indent=2, ensure_ascii=False)

print(f"✅ EXAMEN TOEIC SPEAKING GENERADO: {output_path}")
print("NOTA: Asegúrate de ejecutar 'git push' para subir los cambios a Render si estás en producción.")