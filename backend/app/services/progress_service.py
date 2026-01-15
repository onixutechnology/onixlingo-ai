from sqlalchemy.orm import Session
from app.db import models
from app.services import lesson_service

def get_user_progress(db: Session, user_id: int, lesson_id: str):
    """
    Busca el progreso de una lección específica.
    """
    return db.query(models.Progress).filter(
        models.Progress.user_id == user_id, 
        models.Progress.lesson_id == lesson_id
    ).first()

def initialize_progress(db: Session, user_id: int, lesson_id: str, lesson_type: models.LessonType = None):
    """
    Crea el registro inicial si no existe (status locked por defecto).
    Si no se pasa lesson_type, intenta deducirlo.
    """
    # Si no nos pasan el tipo, intentamos adivinarlo (fallback)
    if not lesson_type:
        lesson_type = lesson_service.get_lesson_type_by_id(lesson_id)
        
    new_prog = models.Progress(
        user_id=user_id,
        lesson_id=lesson_id,
        lesson_type=lesson_type, # Fundamental para el mapa de Dashboard
        status="locked", 
        current_step=0,
        total_steps=10 # Idealmente, esto vendría de los metadatos de la lección real
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
    lesson_type: str = None # Recibimos "standard", "pro", o "vocab" desde el API
):
    """
    Actualiza el avance. Si llega al 100% y aprueba, desbloquea la siguiente.
    """
    # 1. Asegurar que tenemos un tipo de lección válido (Enum)
    # Convertimos el string que viene del API al Enum de la base de datos
    enum_type = models.LessonType.STANDARD
    if lesson_type == "pro": enum_type = models.LessonType.PRO
    elif lesson_type == "vocab": enum_type = models.LessonType.VOCAB
    
    # 2. Obtener o Crear Progreso
    progress = get_user_progress(db, user_id, lesson_id)
    if not progress:
        progress = initialize_progress(db, user_id, lesson_id, enum_type)

    # 3. Actualizar métricas
    progress.current_step = steps_completed
    progress.score = max(progress.score, score) # Guardar siempre el mejor score
    progress.status = "active"

    # 4. Calcular Estrellas
    if score >= 90: progress.stars = 3
    elif score >= 70: progress.stars = 2
    elif score >= 50: progress.stars = 1
    else: progress.stars = 0

    # 5. Lógica de Aprobación
    # Si completó los pasos o sacó buen puntaje (>60), se considera pasada.
    passed = (steps_completed >= progress.total_steps) or (score >= 60)

    if passed:
        progress.status = "completed"
        
        # 🔥 DESBLOQUEO AUTOMÁTICO
        # Pasamos el tipo actual para saber en qué lista buscar la siguiente
        _unlock_next_content(db, user_id, lesson_id, enum_type)
        
        # 🏆 VERIFICAR TROFEOS
        _check_achievements(db, user_id, score)

    db.commit()
    db.refresh(progress)
    return progress

def _unlock_next_content(db: Session, user_id: int, current_lesson_id: str, current_type: models.LessonType):
    """
    Busca cuál es la siguiente lección en el curso y la desbloquea.
    """
    # Usamos lesson_service para encontrar el ID siguiente
    # Nota: lesson_service debe tener la lógica para buscar en Standard/Pro/Vocab
    next_id = lesson_service.get_next_lesson_id(current_lesson_id)
    
    if next_id:
        # Verificar si ya existe registro para la siguiente lección
        next_progress = get_user_progress(db, user_id, next_id)
        
        if not next_progress:
            # Si no existe, lo creamos YA desbloqueado ("active")
            # Importante: El tipo de la siguiente lección suele ser el mismo que la actual
            new_unlock = models.Progress(
                user_id=user_id,
                lesson_id=next_id,
                lesson_type=current_type, # Mantenemos el mismo bloque
                status="active", # ¡Desbloqueada!
                total_steps=10 
            )
            db.add(new_unlock)
        else:
            # Si existía pero estaba bloqueada (status="locked"), la abrimos
            if next_progress.status == "locked":
                next_progress.status = "active"
                db.add(next_progress)

def _check_achievements(db: Session, user_id: int, current_score: int):
    """
    Sistema simple de Gamificación.
    """
    # Trofeo: Perfeccionista (100 puntos)
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