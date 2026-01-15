# backend/app/services/progress_service.py

from sqlalchemy.orm import Session
from app.db import models
from app.services import lesson_service # Importamos el servicio de arriba

def get_user_progress(db: Session, user_id: int, lesson_id: str):
    return db.query(models.Progress).filter(
        models.Progress.user_id == user_id, 
        models.Progress.lesson_id == lesson_id
    ).first()

def initialize_progress(db: Session, user_id: int, lesson_id: str):
    """Crea el registro inicial si no existe (status locked por defecto)"""
    lesson_type = lesson_service.get_lesson_type_by_id(lesson_id)
    new_prog = models.Progress(
        user_id=user_id,
        lesson_id=lesson_id,
        lesson_type=lesson_type,
        status="locked", # Empieza bloqueada hasta que la lógica diga lo contrario
        current_step=0,
        total_steps=10 # Esto debería venir de la data real de la lección
    )
    db.add(new_prog)
    db.commit()
    db.refresh(new_prog)
    return new_prog

def update_lesson_progress(db: Session, user_id: int, lesson_id: str, score: int, steps_completed: int):
    """
    Actualiza el avance. Si llega al 100% y aprueba, desbloquea la siguiente.
    """
    progress = get_user_progress(db, user_id, lesson_id)
    if not progress:
        progress = initialize_progress(db, user_id, lesson_id)

    # Actualizar métricas
    progress.current_step = steps_completed
    progress.score = max(progress.score, score) # Guardar siempre el mejor score
    progress.status = "active"

    # CALCULAR ESTRELLAS (Lógica de negocio)
    if score >= 90: progress.stars = 3
    elif score >= 70: progress.stars = 2
    elif score >= 50: progress.stars = 1
    else: progress.stars = 0

    # LOGICA DE COMPLETADO
    # Asumimos que si completó todos los pasos y tiene > 60 puntos, pasa.
    passed = steps_completed >= progress.total_steps and score >= 60

    if passed:
        progress.status = "completed"
        # AQUÍ OCURRE EL DESBLOQUEO AUTOMÁTICO
        _unlock_next_content(db, user_id, lesson_id)
        # AQUÍ CHECAMOS TROFEOS
        _check_achievements(db, user_id, score)

    db.commit()
    db.refresh(progress)
    return progress

def _unlock_next_content(db: Session, user_id: int, current_lesson_id: str):
    """Función interna para buscar y abrir la siguiente lección"""
    next_id = lesson_service.get_next_lesson_id(current_lesson_id)
    
    if next_id:
        # Verificar si ya existe registro
        next_progress = get_user_progress(db, user_id, next_id)
        if not next_progress:
            # Crear el registro de la siguiente lección en estado 'active' (desbloqueada)
            lesson_type = lesson_service.get_lesson_type_by_id(next_id)
            new_unlock = models.Progress(
                user_id=user_id,
                lesson_id=next_id,
                lesson_type=lesson_type,
                status="active", # ¡Desbloqueada!
                total_steps=10 
            )
            db.add(new_unlock)
        else:
            # Si existía pero estaba bloqueada, la abrimos
            if next_progress.status == "locked":
                next_progress.status = "active"

def _check_achievements(db: Session, user_id: int, current_score: int):
    """Ejemplo simple de trofeos"""
    # Lógica: Si saca 100, trofeo de perfección
    if current_score == 100:
        exists = db.query(models.UserAchievement).filter_by(user_id=user_id, achievement_code="perfectionist").first()
        if not exists:
            new_ach = models.UserAchievement(user_id=user_id, achievement_code="perfectionist")
            db.add(new_ach)