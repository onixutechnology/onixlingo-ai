import sys
import os
from dotenv import load_dotenv

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

SPECIFIC_LESSONS = {
    "fundamentals-1": {
        "title": "La Torre: Muros de Piedra",
        "instruction": "Captura el peón indefenso con tu Torre. Tienes 3 intentos antes de recibir ayuda.",
        "fen": "3k4/8/8/3p4/8/8/8/3R2K1 w - - 0 1", 
        "solution": "d1d5",
        "hint": "La torre se mueve en línea recta.",
        "explanation": "¡Bien hecho! La torre es una pieza de largo alcance."
    },
    "tactics-1-1": {
        "title": "El Ataque Doble (The Fork)",
        "instruction": "Encuentra el ataque doble con el Caballo.",
        "fen": "3k4/8/8/3q4/8/8/1N6/K7 w - - 0 1", 
        "solution": "b2c4",
        "hint": "Busca una casilla desde donde el Caballo amenace dos piezas.",
        "explanation": "¡Excelente! Has ejecutado un 'Fork' clásico."
    },
    "checkmates-5": {
        "title": "Mate Rápido",
        "instruction": "Da mate en 1 movimiento.",
        "fen": "6k1/5ppp/8/8/8/8/8/3R2K1 w - - 0 1",
        "solution": "d1d8",
        "hint": "Busca la debilidad en la última fila.",
        "explanation": "¡Mate del pasillo!"
    }
}

def generate_lessons():
    print("🔄 Iniciando la carga de datos de ajedrez...")
    db = SessionLocal()
    lessons_to_insert = []

    for mod_idx, module in enumerate(MODULES_CONFIG):
        for lesson_num in range(1, 11):
            lesson_id = f"{module['id']}-{lesson_num}"
            
            if lesson_id in SPECIFIC_LESSONS:
                data = SPECIFIC_LESSONS[lesson_id]
                lessons_to_insert.append(ChessLesson(id=lesson_id, module_id=module["id"], **data))
            else:
                lessons_to_insert.append(
                    ChessLesson(
                        id=lesson_id,
                        module_id=module["id"],
                        title=f"{module['name']} - Arena de Práctica",
                        instruction="Modo Sandbox. Juega libremente contra el motor de Inteligencia Artificial.",
                        fen="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
                        solution="FREE_PLAY", 
                        hint="Desarrolla tus piezas y protege al rey.",
                        explanation="¡Partida completada!"
                    )
                )

    try:
        for lesson in lessons_to_insert:
            db.merge(lesson)
        db.commit()
        print(f"✅ ¡Éxito! Base de datos de Ajedrez actualizada e inyectada correctamente.")
    except Exception as e:
        print(f"❌ Error inyectando datos: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    generate_lessons()
