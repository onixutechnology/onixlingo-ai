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
        
        # 🔥 Actualizar Racha (Streak)
        _update_user_streak(db, user_id)

        # 🔥 OTORGAR PUNTOS DE ELOCUENCIA (Si es Pro)
        if lesson_type == "pro":
            user = db.query(models.User).filter(models.User.id == user_id).first()
            if user: user.eloquence_points += 50 

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

    # 🔥 1. LOGRO: RACHA DE 7 DÍAS
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user and user.streak_days >= 7:
        _grant_if_not_exists(db, user_id, "streak_7")
    
    # 🔥 2. LOGRO: RACHA DE 30 DÍAS
    if user and user.streak_days >= 30:
        _grant_if_not_exists(db, user_id, "streak_30")

    # 🔥 3. LOGRO: MAESTRÍA A1 (Completar 10 lecciones de A1 en cualquier idioma)
    a1_completed = db.query(models.Progress).filter(
        models.Progress.user_id == user_id,
        models.Progress.lesson_id.like("%-a1-%"),
        models.Progress.status == "completed"
    ).count()
    if a1_completed >= 10:
        _grant_if_not_exists(db, user_id, "master_a1")

    # 🔥 4. LOGRO: GRAN MAESTRO (Completar 5 lecciones de Ajedrez)
    chess_completed = db.query(models.ChessProgress).filter(
        models.ChessProgress.user_id == user_id,
        models.ChessProgress.status == "completed"
    ).count()
    if chess_completed >= 5:
        _grant_if_not_exists(db, user_id, "chess_grandmaster")

def _grant_if_not_exists(db: Session, user_id: int, code: str):
    exists = db.query(models.UserAchievement).filter_by(
        user_id=user_id, achievement_code=code
    ).first()
    if not exists:
        new_ach = models.UserAchievement(user_id=user_id, achievement_code=code)
        db.add(new_ach)
        print(f"🏆 Logro otorgado: {code} al usuario {user_id}")

def _update_user_streak(db: Session, user_id: int):
    """
    Calcula y actualiza la racha diaria del usuario.
    """
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user: return

    now = datetime.now()
    if not user.last_activity_at:
        user.streak_days = 1
    else:
        last_act = user.last_activity_at
        diff = (now.date() - last_act.date()).days
        
        if diff == 1:
            # Consecutivo: Aumenta racha
            user.streak_days += 1
        elif diff > 1:
            # Se rompió la racha: Reinicia
            user.streak_days = 1
        # Si diff == 0, ya hizo algo hoy, la racha se mantiene igual

    user.last_activity_at = now

def grant_eloquence_points(db: Session, user_id: int, points: int):
    """Otorga puntos de elocuencia directamente (usado por Ajedrez u otros eventos)"""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user:
        user.eloquence_points += points
        db.commit()
