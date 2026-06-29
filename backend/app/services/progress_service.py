from sqlalchemy.orm import Session
from app.db import models
from datetime import datetime

# ✅ Importamos la lógica de la siguiente lección
from app.services.lesson_service import get_next_lesson_id 

def get_user_progress(db: Session, user_id: int, lesson_id: str, language: str = "en"):
    return db.query(models.Progress).filter(
        models.Progress.user_id == user_id, 
        models.Progress.lesson_id == lesson_id,
        models.Progress.language == language
    ).first()

def initialize_progress(db: Session, user_id: int, lesson_id: str, lesson_type: str, total_steps: int, language: str = "en"):
    new_prog = models.Progress(
        user_id=user_id,
        lesson_id=lesson_id,
        lesson_type=lesson_type,
        status="locked", 
        current_step=0,
        total_steps=total_steps,
        language=language
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
    lesson_type: str = "standard",
    difficulty_completed: str = "easy",
    language: str = "en",
    user_timezone: str = "UTC"
):
    # 1. Obtener o Crear Progreso Actual
    progress = get_user_progress(db, user_id, lesson_id, language)
    if not progress:
        progress = initialize_progress(db, user_id, lesson_id, lesson_type, total_steps, language)

    # 2. Actualizar métricas
    progress.current_step = steps_completed
    progress.total_steps = total_steps
    progress.score = max(progress.score, score) 
    progress.status = "active"
    progress.difficulty_completed = difficulty_completed
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
        
        # 🔥 Calcular boletos para sorteo (Vocabulario)
        if lesson_type == "vocab":
            user = db.query(models.User).filter(models.User.id == user_id).first()
            if user:
                is_premium_tier = user.is_pro or (user.tier in ["pro", "executive"])
                if difficulty_completed == "pro" and is_premium_tier:
                    progress.tickets_earned = 5
                else:
                    progress.tickets_earned = 1

        # Intentar desbloquear siguiente nivel
        _unlock_next_content(db, user_id, lesson_id, lesson_type, language)
        _check_achievements(db, user_id, score)
        
        # 🔥 Actualizar Racha (Streak) con Zona Horaria Local
        _update_user_streak(db, user_id, user_timezone)

        # 🔥 OTORGAR PUNTOS DE ELOCUENCIA (Si es Pro)
        if lesson_type == "pro":
            user = db.query(models.User).filter(models.User.id == user_id).first()
            if user: user.eloquence_points += 50 

    db.commit()
    db.refresh(progress)
    return progress

def _unlock_next_content(db: Session, user_id: int, current_lesson_id: str, current_type: str, language: str = "en"):
    """
    Busca la siguiente lección y la desbloquea cambiando el status a 'active'.
    """
    next_id = get_next_lesson_id(current_lesson_id)
    print(f"🔓 [LOGICA] Leccion terminada: {current_lesson_id} | Siguiente detectada: {next_id} | Idioma: {language}")

    if next_id:
        next_progress = get_user_progress(db, user_id, next_id, language)
        
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
                total_steps=10,
                language=language
            )
            db.add(new_unlock)
            print(f" -> ✅ Nueva lección creada y desbloqueada: {next_id} ({language})")
            
        else:
            # Si ya existía, asegurarse de que se marque como desbloqueada
            if next_progress.status == "locked":
                next_progress.status = "active"
                print(f" -> ✅ Lección existente desbloqueada: {next_id} ({language})")

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

import zoneinfo
from datetime import timezone

def _update_user_streak(db: Session, user_id: int, user_timezone: str = "UTC"):
    """
    Calcula y actualiza la racha diaria del usuario respetando su zona horaria local.
    """
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user: return

    try:
        tz = zoneinfo.ZoneInfo(user_timezone)
    except Exception:
        tz = timezone.utc

    # Hora actual en UTC y luego convertida a la zona horaria del usuario
    now_utc = datetime.now(timezone.utc)
    now_local = now_utc.astimezone(tz)
    current_date = now_local.date()

    if not user.last_activity_at:
        user.streak_days = 1
    else:
        # Convertir last_activity_at (que asumimos está en UTC) a la zona del usuario
        last_act_utc = user.last_activity_at
        if last_act_utc.tzinfo is None:
            last_act_utc = last_act_utc.replace(tzinfo=timezone.utc)
        
        last_act_local = last_act_utc.astimezone(tz)
        last_date = last_act_local.date()
        
        diff = (current_date - last_date).days
        
        if diff == 1:
            # Consecutivo: Aumenta racha
            user.streak_days += 1
        elif diff > 1:
            # Se rompió la racha: Reinicia
            user.streak_days = 1
        # Si diff == 0, ya hizo algo hoy en su zona horaria local, la racha se mantiene igual

    user.last_activity_at = now_utc.replace(tzinfo=None) # Guardar como naive UTC para compatibilidad


def grant_eloquence_points(db: Session, user_id: int, points: int):
    """Otorga puntos de elocuencia directamente (usado por Ajedrez u otros eventos)"""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user:
        user.eloquence_points += points
        db.commit()
