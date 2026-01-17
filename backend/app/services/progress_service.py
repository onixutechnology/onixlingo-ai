from sqlalchemy.orm import Session
from app.db import models
from datetime import datetime

# ✅ IMPORTACIÓN CORRECTA: Usamos tu función del mapa
from app.utils.curriculum_map import get_next_lesson_id 

def get_user_progress(db: Session, user_id: int, lesson_id: str):
    """
    Busca el progreso de una lección específica.
    """
    return db.query(models.Progress).filter(
        models.Progress.user_id == user_id, 
        models.Progress.lesson_id == lesson_id
    ).first()

def initialize_progress(db: Session, user_id: int, lesson_id: str, lesson_type: str, total_steps: int):
    """
    Crea el registro inicial si no existe.
    """
    new_prog = models.Progress(
        user_id=user_id,
        lesson_id=lesson_id,
        lesson_type=lesson_type,
        status="locked", 
        current_step=0,
        total_steps=total_steps # Guardamos el total real recibido del frontend
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
    total_steps: int, # 👈 RECIBIMOS ESTO DEL FRONTEND
    lesson_type: str = "standard"
):
    """
    Actualiza el avance. Si aprueba, desbloquea la siguiente usando el mapa.
    """
    
    # 1. Obtener o Crear Progreso Actual
    progress = get_user_progress(db, user_id, lesson_id)
    if not progress:
        progress = initialize_progress(db, user_id, lesson_id, lesson_type, total_steps)

    # 2. Actualizar métricas
    progress.current_step = steps_completed
    progress.total_steps = total_steps # Actualizamos por si cambió la lección
    progress.score = max(progress.score, score) 
    progress.status = "active"
    progress.updated_at = datetime.now()

    # 3. Calcular Estrellas
    if score >= 90: progress.stars = 3
    elif score >= 70: progress.stars = 2
    elif score >= 50: progress.stars = 1
    else: progress.stars = 0

    # 4. Lógica de Aprobación ROBUSTA
    # Aprueba si: Score > 60%  O  Completó todos los pasos (útil para lecciones sin examen)
    passed = (score >= 60) or (steps_completed >= total_steps and total_steps > 0)

    if passed:
        progress.status = "completed"
        
        # 🔥 DESBLOQUEO AUTOMÁTICO (Usando tu mapa)
        _unlock_next_content(db, user_id, lesson_id, lesson_type)
        
        # 🏆 VERIFICAR TROFEOS
        _check_achievements(db, user_id, score)

    db.commit()
    db.refresh(progress)
    return progress

def _unlock_next_content(db: Session, user_id: int, current_lesson_id: str, current_type: str):
    """
    Usa tu mapa inteligente para encontrar la siguiente lección y abrirla.
    """
    # 1. Obtener ID de la siguiente lección desde TU MAPA
    next_id = get_next_lesson_id(current_lesson_id)
    
    if next_id:
        # 2. Verificar si ya existe registro
        next_progress = get_user_progress(db, user_id, next_id)
        
        if not next_progress:
            # 3. Si no existe, CREARLO DESBLOQUEADO ('active')
            print(f"🔓 [AUTO-UNLOCK] Desbloqueando: {next_id} para usuario {user_id}")
            new_unlock = models.Progress(
                user_id=user_id,
                lesson_id=next_id,
                lesson_type=current_type,
                status="active", # 🔓 AQUÍ SE QUITA EL CANDADO
                stars=0,
                score=0,
                current_step=0,
                total_steps=10 # Valor default, se ajustará cuando el usuario entre
            )
            db.add(new_unlock)
        else:
            # 4. Si existía bloqueado, abrirlo
            if next_progress.status == "locked":
                print(f"🔓 [AUTO-UNLOCK] Abriendo lección existente: {next_id}")
                next_progress.status = "active"
                db.add(next_progress)

def _check_achievements(db: Session, user_id: int, current_score: int):
    """
    Sistema simple de Gamificación.
    """
    if current_score == 100:
        exists = db.query(models.UserAchievement).filter_by(
            user_id=user_id, 
            achievement_code="perfectionist"
        ).first()
        
        if not exists:
            new_ach = models.UserAchievement(
                user_id=user_id, 
                achievement_code="perfectionist"
            )
            db.add(new_ach)