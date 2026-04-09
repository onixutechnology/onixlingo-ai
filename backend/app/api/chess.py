from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from typing import List

# 👇 Ajusta estas rutas de importación según tu estructura
from app.db.session import get_db 
from app.api.deps import get_current_user 
from app.db.models import ChessLesson, ChessProgress, User
from app.schemas.chess import ChessLessonResponse, ChessProgressCreate, ChessProgressResponse

router = APIRouter(prefix="/chess", tags=["Chess Academy"])

@router.get("/lessons/{lesson_id}", response_model=ChessLessonResponse)
def get_chess_lesson(
    lesson_id: str, 
    response: Response, # 🚀 Agregado para controlar el caché
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Devuelve el FEN, solución y datos de un puzzle para la Practice Arena"""
    # 🛡️ ANTI-CACHÉ MATADOR (Evita el 304)
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    
    lesson = db.query(ChessLesson).filter(ChessLesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lección de ajedrez no encontrada")
    
    return lesson

@router.post("/progress")
def save_chess_progress(
    progress_data: ChessProgressCreate,
    response: Response, # 🚀 Agregado para controlar el caché
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Guarda la victoria del puzzle y bloquea la inyección de XP repetida"""
    # 🛡️ ANTI-CACHÉ MATADOR
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    
    lesson = db.query(ChessLesson).filter(ChessLesson.id == progress_data.lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lección no encontrada")

    # Validar si ya lo resolvió antes
    existing = db.query(ChessProgress).filter(
        ChessProgress.user_id == current_user.id,
        ChessProgress.lesson_id == progress_data.lesson_id
    ).first()

    if existing:
        return {"msg": "Puzzle ya completado", "xp_added": 0}

    # Guardar victoria
    new_progress = ChessProgress(
        user_id=current_user.id,
        lesson_id=progress_data.lesson_id,
        status=progress_data.status,
        earned_xp=25
    )
    db.add(new_progress)
    db.commit()
    
    return {"msg": "Progreso de ajedrez guardado", "xp_added": 25}

@router.get("/progress", response_model=ChessProgressResponse)
def get_user_chess_progress(
    response: Response, # 🚀 Agregado para controlar el caché
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Devuelve los IDs de los puzzles completados para armar el Lobby Frontend"""
    # 🛡️ ANTI-CACHÉ MATADOR
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    
    progress = db.query(ChessProgress.lesson_id).filter(
        ChessProgress.user_id == current_user.id
    ).all()
    
    completed_ids = [p[0] for p in progress]
    return {
        "completed_lessons": completed_ids,
        "total_puzzles": len(completed_ids)
    }
