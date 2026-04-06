# app/datachess/seed_chess.py

import sys
import os

# Esto asegura que Python encuentre la carpeta 'app' desde la raíz del backend
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.db.session import SessionLocal, engine  # 🔥 IMPORTAMOS EL ENGINE
from app.db.base import Base                     # 🔥 IMPORTAMOS LA BASE
from app.db.models import ChessLesson

# 🔥 EL TRUCO DE FUERZA BRUTA: Esto crea las tablas físicas en la base de datos si no existen
Base.metadata.create_all(bind=engine)

# --- ESTRUCTURA DE LOS 7 MÓDULOS ---
MODULES_CONFIG = [
    {"id": "fundamentals", "name": "Fundamentos Esenciales"},
    {"id": "tactics-1", "name": "Táctica Básica: Patrones"},
    {"id": "checkmates", "name": "Patrones de Mate"},
    {"id": "openings", "name": "Control del Centro (Aperturas)"},
    {"id": "middlegame", "name": "Estrategia de Medio Juego"},
    {"id": "endgames", "name": "Finales Teóricos"},
    {"id": "advanced", "name": "Cálculo Avanzado (Titanium)"}
]

# Puzzles reales de prueba
SPECIFIC_LESSONS = {
    "fundamentals-1": {
        "title": "La Torre: Muros de Piedra",
        "instruction": "Captura el peón indefenso con tu Torre.",
        "fen": "8/8/8/3p4/8/8/8/3R4 w - - 0 1",
        "solution": "d1d5",
        "hint": "La torre se mueve en línea recta.",
        "explanation": "¡Bien hecho! La torre es una pieza de largo alcance."
    },
    "tactics-1-1": {
        "title": "El Ataque Doble (The Fork)",
        "instruction": "Mueve el Caballo para atacar al Rey y a la Dama simultáneamente.",
        "fen": "8/8/8/3q4/8/8/1N6/K7 w - - 0 1",
        "solution": "b2c4",
        "hint": "Busca una casilla desde donde el Caballo amenace dos piezas valiosas.",
        "explanation": "¡Excelente! Has ejecutado un 'Fork' clásico."
    },
    "checkmates-1": {
        "title": "Mate del Pasillo",
        "instruction": "Las blancas dan Jaque Mate en 1 movimiento.",
        "fen": "6k1/5ppp/8/8/8/8/8/3R2K1 w - - 0 1",
        "solution": "d1d8",
        "hint": "Observa cómo los peones negros bloquean a su propio Rey.",
        "explanation": "¡Jaque Mate! El Rey está atrapado."
    }
}

def generate_lessons():
    db = SessionLocal()
    lessons_to_insert = []

    for mod_idx, module in enumerate(MODULES_CONFIG):
        for lesson_num in range(1, 11):
            lesson_id = f"{module['id']}-{lesson_num}"
            
            if lesson_id in SPECIFIC_LESSONS:
                data = SPECIFIC_LESSONS[lesson_id]
                lessons_to_insert.append(
                    ChessLesson(
                        id=lesson_id,
                        module_id=module["id"],
                        title=data["title"],
                        instruction=data["instruction"],
                        fen=data["fen"],
                        solution=data["solution"],
                        hint=data["hint"],
                        explanation=data["explanation"]
                    )
                )
            else:
                # 67 Puzzles genéricos para completar la currícula
                lessons_to_insert.append(
                    ChessLesson(
                        id=lesson_id,
                        module_id=module["id"],
                        title=f"{module['name']} - Unit {lesson_num}",
                        instruction="Encuentra el mejor movimiento para las blancas.",
                        fen="8/P7/8/8/8/8/8/K6k w - - 0 1", # FEN genérico
                        solution="a7a8",
                        hint="Corona el peón avanzando a la última fila.",
                        explanation="¡Movimiento completado con éxito!"
                    )
                )

    try:
        for lesson in lessons_to_insert:
            existing = db.query(ChessLesson).filter(ChessLesson.id == lesson.id).first()
            if not existing:
                db.add(lesson)
        db.commit()
        print(f"✅ ¡Éxito! 70 Lecciones de ajedrez inyectadas en la base de datos.")
    except Exception as e:
        print(f"❌ Error inyectando datos: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    generate_lessons()
