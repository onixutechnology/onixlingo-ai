from sqlalchemy.orm import Session
from app.db import models
from datetime import datetime

# ✅ Importamos la lógica de la siguiente lección
from app.services.lesson_service import get_next_lesson_id 

def get_user_progress(db: Session, user_id: int, lesson_id: str):
    return db.query(models.Progress).filter(
        models.Progress.user_id == user_id, 
        models.Progress.lesson_id == lesson_id
    ).first()

def initialize_progress(db: Session, user_id: int, lesson_id: str, lesson_type: str, total_steps: int):
    new_prog = models.Progress(
        user_id=user_id,
        lesson_id=lesson_id,
        lesson_type=lesson_type,
        status="locked", 
        current_step=0,
        total_steps=total_steps
    )
    db.add(new_prog)
    db.commit()
    db.refresh(new_prog)
    return new_prog

def update_lesson_progress(
    db: Session, 
    user_id: int, 
    lesson_id: str, 
    score: int, 
    steps_completed: int, 
    total_steps: int, 
    lesson_type: str = "standard"
):
    # 1. Obtener o Crear Progreso Actual
    progress = get_user_progress(db, user_id, lesson_id)
    if not progress:
        progress = initialize_progress(db, user_id, lesson_id, lesson_type, total_steps)

    # 2. Actualizar métricas
    progress.current_step = steps_completed
    progress.total_steps = total_steps
    progress.score = max(progress.score, score) 
    progress.status = "active"
    progress.updated_at = datetime.now()

    # 3. Calcular Estrellas
    if score >= 90: progress.stars = 3
    elif score >= 70: progress.stars = 2
    elif score >= 50: progress.stars = 1
    else: progress.stars = 0

    # 4. Lógica de Aprobación
    passed = (score >= 50) or (steps_completed >= total_steps and total_steps > 0)

    if passed:
        progress.status = "completed"
        # Intentar desbloquear siguiente nivel
        _unlock_next_content(db, user_id, lesson_id, lesson_type)
        _check_achievements(db, user_id, score)

    db.commit()
    db.refresh(progress)
    return progress

def _unlock_next_content(db: Session, user_id: int, current_lesson_id: str, current_type: str):
    """
    Busca la siguiente lección y la desbloquea cambiando el status a 'active'.
    """
    next_id = get_next_lesson_id(current_lesson_id)
    print(f"🔓 [LOGICA] Leccion terminada: {current_lesson_id} | Siguiente detectada: {next_id}")

    if next_id:
        next_progress = get_user_progress(db, user_id, next_id)
        
        if not next_progress:
            # Crear registro nuevo con status 'active' (desbloqueado)
            new_unlock = models.Progress(
                user_id=user_id,
                lesson_id=next_id,
                lesson_type=current_type,
                status="active", 
                stars=0,
                score=0,
                current_step=0,
                total_steps=10 
            )
            db.add(new_unlock)
            print(f" -> ✅ Nueva lección creada y desbloqueada: {next_id}")
            
        else:
            # Si ya existía, asegurarse de que se marque como desbloqueada
            if next_progress.status == "locked":
                next_progress.status = "active"
                print(f" -> ✅ Lección existente desbloqueada: {next_id}")

def _check_achievements(db: Session, user_id: int, current_score: int):
    if current_score == 100:
        exists = db.query(models.UserAchievement).filter_by(
            user_id=user_id, achievement_code="perfectionist"
        ).first()
        if not exists:
            new_ach = models.UserAchievement(user_id=user_id, achievement_code="perfectionist")
            db.add(new_ach)
