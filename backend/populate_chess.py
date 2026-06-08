from app.database import SessionLocal
from app.db.models import ChessLesson
from app.services.chess_catalog import CHESS_CATALOG
import sys

def main():
    db = SessionLocal()
    count = 0
    
    # Obtener todas las lecciones existentes para no hacer inserts dobles
    existing = {l.id for l in db.query(ChessLesson.id).all()}
    
    for lesson_id, data in CHESS_CATALOG.items():
        if lesson_id not in existing:
            new_lesson = ChessLesson(
                id=lesson_id,
                module_id=data.get('module_id', 'unknown'),
                title=data.get('title', lesson_id),
                instruction=data.get('instruction', 'Analiza la posición y encuentra el mejor movimiento.'),
                fen=data.get('fen', 'start'),
                solution=data.get('solution', 'FREE_PLAY'),
                hint=data.get('hint', ''),
                explanation=data.get('explanation', '')
            )
            db.add(new_lesson)
            count += 1
            
    if count > 0:
        db.commit()
        print(f"✅ Se insertaron {count} lecciones nuevas en la BD.")
    else:
        print("✅ Todas las lecciones de CHESS_CATALOG ya están en la BD.")

if __name__ == "__main__":
    main()
