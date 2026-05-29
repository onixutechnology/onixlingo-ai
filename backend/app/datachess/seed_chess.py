import sys
import os
import json
from pathlib import Path
from dotenv import load_dotenv

# Cargar variables de entorno y path
load_dotenv()
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.database import SessionLocal, engine 
from app.db.base import Base 
from app.db.models import ChessLesson

# Asegurar tablas
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

# Definir la ruta exacta para la carpeta de JSONs (datachess/lessons)
CURRENT_DIR = Path(__file__).resolve().parent
JSON_DIR = CURRENT_DIR / "lessons"

def load_json_lesson(lesson_id):
    """Busca y carga el archivo JSON correspondiente al lesson_id."""
    file_path = JSON_DIR / f"{lesson_id}.json"
    if file_path.exists():
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    return None

def generate_lessons():
    print("[i] Iniciando el motor de inyección de datos (Titanium Seed)...")
    db = SessionLocal()
    
    # 🚀 OPTIMIZACIÓN TEMIBLE (Bypass de Red para PostgreSQL remoto)
    try:
        existing_count = db.query(ChessLesson).count()
        if existing_count >= 700:
            print(f"[+] Las lecciones de ajedrez ya están sembradas en la DB ({existing_count} registros). Omitiendo inyección lenta...")
            db.close()
            return
    except Exception as e:
        print(f"[-] Error al verificar lecciones existentes: {e}")
        
    lessons_to_insert = []
    
    # Crear la carpeta automáticamente si no existe
    JSON_DIR.mkdir(parents=True, exist_ok=True)

    for module in MODULES_CONFIG:
        for lesson_num in range(1, 101):
            lesson_id = f"{module['id']}-{lesson_num}"
            json_data = load_json_lesson(lesson_id)
            
            if json_data:
                # 1. Si existe el JSON, cargamos la lección curada
                lessons_to_insert.append(
                    ChessLesson(
                        id=lesson_id, 
                        module_id=module["id"], 
                        title=json_data.get("title", f"Lección {lesson_num}"),
                        instruction=json_data.get("instruction", ""),
                        fen=json_data.get("fen", "start"),
                        solution=json_data.get("solution", ""),
                        hint=json_data.get("hint", ""),
                        explanation=json_data.get("explanation", "")
                    )
                )
            else:
                # 2. Si no existe, generamos el Fallback (Modo Libre / Sandbox)
                lessons_to_insert.append(
                    ChessLesson(
                        id=lesson_id,
                        module_id=module["id"],
                        title=f"{module['name']} - Arena",
                        instruction="Sandbox Mode. Play against the AI to improve your skills (Juega contra la IA para mejorar).",
                        fen="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
                        solution="FREE_PLAY", 
                        hint="Develop your pieces (Desarrolla tus piezas) y protege al Rey (King).",
                        explanation="¡Partida completada! Excelente práctica."
                    )
                )

    try:
        for lesson in lessons_to_insert:
            db.merge(lesson)
        db.commit()
        print(f"[+] ¡Éxito! Base de datos de Ajedrez actualizada con {len(lessons_to_insert)} lecciones.")
        print(f"[*] Se buscaron los JSON en: {JSON_DIR}")
    except Exception as e:
        print(f"[-] Error inyectando datos: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    generate_lessons()
