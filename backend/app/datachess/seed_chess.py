# app/datachess/seed_chess.py

import sys
import os
from dotenv import load_dotenv

# 🔥 1. CARGAR ENTORNO PRIMERO (Para detectar Neon)
load_dotenv()

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.db.session import SessionLocal, engine 
from app.db.base import Base 
from app.db.models import ChessLesson

Base.metadata.create_all(bind=engine)

MODULES_CONFIG = [
    {"id": "fundamentals", "name": "Fundamentos Esenciales"},
    {"id": "tactics-1", "name": "Táctica Básica: Patrones"},
    {"id": "checkmates", "name": "Patrones de Mate"},
    {"id": "openings", "name": "Control del Centro (Aperturas)"},
    {"id": "middlegame", "name": "Estrategia de Medio Juego"},
    {"id": "endgames", "name": "Finales Teóricos"},
    {"id": "advanced", "name": "Cálculo Avanzado (Titanium)"}
]

# 🔥 PUZZLES ESPECÍFICOS (FENs Corregidos: ¡Todos tienen Reyes!)
SPECIFIC_LESSONS = {
    "fundamentals-1": {
        "title": "La Torre: Muros de Piedra",
        "instruction": "Captura el peón indefenso con tu Torre.",
        "fen": "3k4/8/8/3p4/8/8/8/3R2K1 w - - 0 1", # Rey negro d8, Rey blanco g1
        "solution": "d1d5",
        "hint": "La torre se mueve en línea recta.",
        "explanation": "¡Bien hecho! La torre es una pieza de largo alcance."
    },
    "tactics-1-1": {
        "title": "El Ataque Doble (The Fork)",
        "instruction": "Mueve el Caballo para atacar al Rey y a la Dama simultáneamente.",
        "fen": "3k4/8/8/3q4/8/8/1N6/K7 w - - 0 1", # Rey negro d8, Rey blanco a1
        "solution": "b2c4",
        "hint": "Busca una casilla desde donde el Caballo amenace dos piezas valiosas.",
        "explanation": "¡Excelente! Has ejecutado un 'Fork' clásico."
    },
    "checkmates-5": {
        "title": "Mate Rápido",
        "instruction": "Da mate en 1.",
        "fen": "6k1/5ppp/8/8/8/8/8/3R2K1 w - - 0 1",
        "solution": "d1d8",
        "hint": "Busca la debilidad en la última fila.",
        "explanation": "¡Mate del pasillo!"
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
                # 🔥 MODO JUEGO LIBRE (FREE_PLAY) PARA EL RESTO
                lessons_to_insert.append(
                    ChessLesson(
                        id=lesson_id,
                        module_id=module["id"],
                        title=f"{module['name']} - Práctica Libre",
                        instruction="Juega contra el motor. Desarrolla tus piezas y busca la victoria.",
                        fen="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", # Tablero estándar inicial
                        solution="FREE_PLAY", # Código maestro para activar la IA en el frontend
                        hint="Desarrolla tus caballos y alfiles primero.",
                        explanation="¡Excelente práctica!"
                    )
                )

    try:
        for lesson in lessons_to_insert:
            # 🔥 CRÍTICO: Usamos merge() para sobrescribir los viejos datos corruptos en Neon
            db.merge(lesson)
        db.commit()
        print(f"✅ ¡Éxito! 70 Lecciones de ajedrez (Puzzles y Free Play) inyectadas en Neon.")
    except Exception as e:
        print(f"❌ Error inyectando datos: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    generate_lessons()
