import json
import random
import os

# --- BASE DE DATOS DE EVALUACIÓN (50 Frases Curadas) ---

# 1. IDENTITY & TO BE (A1-1)
set_identity = [
    "Hello, my name is Sarah and I am twenty years old.",
    "My best friend is not from London, he is from Paris.",
    "Are you happy with your new job in the city?",
    "I am very tired today because I worked a lot.",
    "She is intelligent, funny, and very friendly.",
    "Honestly, I am not ready for this exam yet.",
    "They are the best students in the whole school.",
    "Is he the new manager of the marketing department?",
    "We are very excited about the concert tomorrow.",
    "Unfortunately, the restaurant is closed on Mondays.",
    "Who is that woman standing next to the door?",
    "I am not a doctor, I am a software developer."
]

# 2. NUMBERS, AGES & TIMELINES (A1-2)
set_timelines = [
    "My younger brother is fifteen years old today.",
    "There are twenty-five students in my English class.",
    "I have two sisters and one brother living in New York.",
    "Next year, I will be thirty years old.",
    "My grandmother was born in nineteen fifty-five.",
    "When I was a child, I was afraid of dogs.",
    "Where were you yesterday afternoon?",
    "In two years, she will be a professional lawyer.",
    "I was very shy, but now I am confident.",
    "It is exactly nine thirty in the morning.",
    "How old will you be in two thousand thirty?",
    "My parents were very happy with the news."
]

# 3. ROUTINE & HABITS (A1-3)
set_routines = [
    "I usually wake up at seven o'clock in the morning.",
    "She goes to the gym every day after work.",
    "We never watch TV during the week, only on weekends.",
    "He doesn't brush his teeth before breakfast.",
    "Do you always take a shower at night?",
    "My father works in a bank, but he doesn't like it.",
    "She studies English every day because she wants to learn.",
    "Does your sister live in this apartment too?",
    "We usually have toast and eggs for breakfast.",
    "I rarely drink coffee after six PM.",
    "What time do you usually go to bed?",
    "He never listens to music while he works."
]

# 4. FOOD & ORDERING (A1-4)
set_food = [
    "I would like a cheeseburger with fries, please.",
    "How much water do you drink every day?",
    "Can I have a slice of chocolate cake?",
    "There isn't any cheese left in the fridge.",
    "We need to buy some apples and a bottle of milk.",
    "Please bring me the check, I need to go now.",
    "I'd like to make a reservation for two people.",
    "Excuse me, do you have a table for four?",
    "I don't eat meat because I am a vegetarian.",
    "Would you like some sugar in your coffee?",
    "This soup is delicious but a little bit salty.",
    "How many sandwiches did you order?"
]

# 5. COMPLEX CONNECTORS (A1+)
set_complex = [
    "Even though I am hungry, I don't want to eat pizza.",
    "I'm sorry, but I think you are wrong about that.",
    "Please, don't open the window, it is cold outside.",
    "Believe it or not, I wake up at 4 AM every day.",
    "To be honest, I prefer tea over coffee.",
    "Generally speaking, English is easier than German."
]

# --- MEZCLADOR INTELIGENTE (Total: 50 Frases) ---
final_sentences = []
final_sentences.extend(random.sample(set_identity, 10))
final_sentences.extend(random.sample(set_timelines, 10))
final_sentences.extend(random.sample(set_routines, 10))
final_sentences.extend(random.sample(set_food, 10))
final_sentences.extend(random.sample(set_complex, 5)) # +5 complejas

# Rellenar hasta 50 si falta alguna (por seguridad)
all_pool = set_identity + set_timelines + set_routines + set_food + set_complex
while len(final_sentences) < 50:
    s = random.choice(all_pool)
    if s not in final_sentences:
        final_sentences.append(s)

random.shuffle(final_sentences)

# --- ENSAMBLAJE DEL EXAMEN BOSS ---
lesson = {
    "id": "a1-boss",
    "title": "Checkpoint A1: The Final Exam 🏆",
    "level": "A1",
    "description": "El Examen Final. Demuestra tu fluidez ante Mr. Cavendish.",
    "stages": []
}

# 1. INTRODUCCIÓN DRAMÁTICA (Lecture Mode)
lesson["stages"].append({
    "type": "lecture",
    "title": "The Evaluation Room",
    "parts": [
        {
            "visual": "## Mr. Cavendish 🧐\nExaminador Oficial de Nivel A1.\n\n* **Strict** (Estricto)\n* **Fair** (Justo)\n* **British Accent** (Acento Británico)",
            "audio": "Good morning. Please, come in. I am Mister Cavendish. I will be your examiner today. Put your books away. This is the moment of truth.",
            "animation": "formal" # Asumiendo que tienes una animación formal/seria
        },
        {
            "visual": "## Las Reglas 📜\n\n1. **Fluidez:** 50 Frases sin error.\n2. **Entrevista:** Conversación libre.\n\n¿Estás listo?",
            "audio": "The exam has two parts. First, I want to hear your pronunciation. Read the fifty sentences clearly. Then, we will have a little chat. Do not be nervous... unless you didn't study.",
            "animation": "teacher_pointing"
        }
    ]
})

# 2. EL DRILL DE 50 FRASES
lesson["stages"].append({
    "type": "pronunciation_drill",
    "sentences": final_sentences
})

# 3. ENTREVISTA FINAL (Chat Estricto)
lesson["stages"].append({
    "type": "practice_chat",
    "scenario": "Estás sentado frente a Mr. Cavendish en una oficina elegante. Él tiene tu expediente en la mano.",
    "ai_system_prompt": "ROLE: You are 'Mr. Cavendish', a strict but polite British English Examiner. GOAL: Assess if the user is ready for A2 level.\n\nINSTRUCTIONS:\n1. Speak formally. Use 'Indeed', 'I see', 'Very well'.\n2. Ask about: Their Routine, Their Past (Childhood), and Future Plans.\n3. If user makes a grammar mistake, correct them instantly: 'Excuse me, did you mean...?'\n4. Challenge them. Don't accept 'Yes/No' answers. Ask 'Why?'.\n5. After 6 turns, tell them: 'Congratulations, you passed' OR 'You need more practice'."
})

# GUARDAR
output_path = "backend/app/data/lessons/a1-boss.json"
os.makedirs(os.path.dirname(output_path), exist_ok=True)
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(lesson, f, indent=2, ensure_ascii=False)

print(f"✅ CHECKPOINT A1 (BOSS MODE) GENERADO: {output_path} con 50 frases y Mr. Cavendish.")