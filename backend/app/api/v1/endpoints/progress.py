from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func # 🔥 IMPORTANTE: Necesario para sumar el XP en el ranking
from typing import List, Dict, Any

# --- IMPORTS DE INFRAESTRUCTURA ---
from app.database import get_db
from app.db import models 
from app.api import deps 

# --- IMPORTS DE SCHEMAS (DTOs) ---
from app.schemas.titanium import ProgressUpdate, ProgressRead, DashboardMap

# --- IMPORTS DE LÓGICA DE NEGOCIO ---
from app.services import progress_service

router = APIRouter()

# ==============================================================================
# 1. GUARDAR PROGRESO Y DESBLOQUEAR (El corazón del sistema)
# ==============================================================================
@router.post("/complete", response_model=ProgressRead)
def complete_lesson(
    *,
    db: Session = Depends(get_db),
    data: ProgressUpdate,
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """
    Recibe el avance del Frontend, calcula el score, guarda en DB
    y ejecuta la lógica para DESBLOQUEAR la siguiente lección.
    """
    try:
        # Delegamos la lógica compleja al servicio
        progress = progress_service.update_lesson_progress(
            db=db,
            user_id=current_user.id,
            lesson_id=data.lesson_id,
            score=data.score,
            steps_completed=data.current_step,
            total_steps=data.total_steps, 
            lesson_type=data.lesson_type,
            difficulty_completed=data.difficulty_completed,
            language=getattr(data, 'language', 'en') or 'en'
        )
        return progress
    except Exception as e:
        print(f"❌ Error en complete_lesson: {str(e)}") 
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="No se pudo guardar el progreso."
        )

# ==============================================================================
# 2. MAPA DE AVANCE (Para pintar los candados en el Dashboard)
# ==============================================================================
@router.get("/map", response_model=DashboardMap)
def get_dashboard_map(
    *,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """
    Devuelve TODO el progreso del usuario organizado por bloques.
    """
    all_progress = db.query(models.Progress).filter(
        models.Progress.user_id == current_user.id
    ).all()

    standard_list = [p for p in all_progress if p.lesson_type == "standard"]
    pro_list = [p for p in all_progress if p.lesson_type == "pro"]
    vocab_list = [p for p in all_progress if p.lesson_type == "vocab"]

    chess_xp = db.query(func.sum(models.ChessProgress.earned_xp)).filter(
        models.ChessProgress.user_id == current_user.id
    ).scalar() or 0

    total_xp = sum(p.score for p in all_progress) + chess_xp

    return DashboardMap(
        standard=standard_list,
        pro=pro_list,
        vocab=vocab_list,
        total_xp=total_xp
    )

# ==============================================================================
# 3. ANALYTICS & RADAR (Estadísticas del Usuario)
# ==============================================================================
@router.get("/stats", response_model=Dict[str, Any])
def get_user_stats(
    *,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """
    Genera las métricas para el perfil, el gráfico de radar y el estado PRO.
    """
    raw_progress = db.query(models.Progress).filter(models.Progress.user_id == current_user.id).all()
    
    completed_lessons = [p for p in raw_progress if p.status == 'completed']
    modules_count = len(completed_lessons)
    
    # Calcular precisión y fluidez real basada en las lecciones completadas
    if completed_lessons:
        avg_accuracy = sum(p.score for p in completed_lessons) // len(completed_lessons)
        avg_accuracy = min(100, max(0, avg_accuracy))
        avg_fluency = min(100, max(0, int(avg_accuracy * 0.95)))
    else:
        avg_accuracy = 0
        avg_fluency = 0

    skills = {"Speaking": 0, "Writing": 0, "Listening": 0, "Reading": 0, "Grammar": 0, "Vocabulary": 0}
    
    for p in raw_progress:
        if p.status != 'completed':
            continue
        lid = p.lesson_id.lower()
        impact = p.stars * 5 
        
        if "speak" in lid: 
            skills["Speaking"] += impact
            skills["Listening"] += (impact // 2)
        elif "write" in lid: 
            skills["Writing"] += impact
            skills["Grammar"] += (impact // 2)
        elif "listen" in lid: 
            skills["Listening"] += impact
        elif "read" in lid: 
            skills["Reading"] += impact
            skills["Vocabulary"] += (impact // 2)
        elif "voc" in lid: 
            skills["Vocabulary"] += impact
        else: 
            skills["Grammar"] += (impact // 3)
            skills["Vocabulary"] += (impact // 3)

    radar_data = [{"subject": k, "A": min(v, 100), "fullMark": 100} for k, v in skills.items()]

    # Contar usuarios premium en vivo (excluye admin, jeicomorales1, cuentas de prueba y registrados gratis con códigos)
    premium_count = db.query(models.User).filter(
        (models.User.is_pro == True) | (models.User.tier == "titanium") | (models.User.tier == "pro") | (models.User.tier == "executive"),
        models.User.role != "admin",
        models.User.email != "jeicomorales1@gmail.com",
        models.User.email != "j2022eico2@gmail.com",
        models.User.email != "moralesmorenojacob0@gmail.com",
        models.User.username != "jeicomorales1",
        models.User.paddle_subscription_id != None
    ).count()

    chess_xp = db.query(func.sum(models.ChessProgress.earned_xp)).filter(
        models.ChessProgress.user_id == current_user.id
    ).scalar() or 0
    total_xp = sum(p.score for p in raw_progress) + chess_xp

    # Obtener historial real de XP
    recent_prog = db.query(models.Progress).filter(
        models.Progress.user_id == current_user.id,
        models.Progress.status == 'completed',
        models.Progress.score > 0
    ).order_by(models.Progress.updated_at.desc()).limit(15).all()

    xp_history = []
    for rp in recent_prog:
        xp_history.append({
            "amount": rp.score,
            "module": rp.lesson_id.replace("_", " ").title(),
            "date": rp.updated_at.isoformat() if rp.updated_at else None
        })

    level_data = _level_details(total_xp)

    return {
        "username": current_user.username,
        "level_label": _calculate_label(modules_count),
        "level": level_data["level"],
        "level_details": level_data,
        "total_xp": total_xp,
        "streak_days": current_user.streak_days or 0, 
        "last_activity_at": current_user.last_activity_at.isoformat() if current_user.last_activity_at else None,
        "xp_history": xp_history,
        "completed_modules": modules_count,
        "global_progress": min(int((modules_count / 60) * 100), 100),
        "skills_radar": radar_data,
        "is_pro": current_user.is_pro,
        "achievements": [a.achievement_code for a in current_user.achievements],
        "premium_users_count": premium_count,
        "total_tickets": sum(p.tickets_earned for p in raw_progress if p.tickets_earned),
        "accuracy": avg_accuracy,
        "fluency_score": avg_fluency
    }

@router.get("/eloquence-leaderboard")
def get_eloquence_leaderboard(
    country: str = None,
    db: Session = Depends(get_db)
):
    """Retorna el ranking global o filtrado por país con métricas reales"""
    # 1. Base query
    query = db.query(models.User)
    
    if country and country != "all":
        query = query.filter(models.User.country_code == country.upper())

    # 2. Métricas Globales (basadas en el filtro)
    total_users = query.count()
    avg_eloquence = db.query(func.avg(models.User.eloquence_points))
    if country and country != "all":
        avg_eloquence = avg_eloquence.filter(models.User.country_code == country.upper())
    
    avg_val = avg_eloquence.scalar() or 0
    
    # 3. Ranking
    top_users = query.order_by(models.User.eloquence_points.desc()).limit(25).all()
    
    leaderboard = []
    for idx, user in enumerate(top_users):
        completed_count = db.query(models.Progress).filter(
            models.Progress.user_id == user.id,
            models.Progress.status == "completed"
        ).count()

        display_name = f"{user.username[0].upper()}."

        leaderboard.append({
            "rank": idx + 1,
            "username": display_name,
            "country_code": user.country_code or "MX",
            "eloquence_points": user.eloquence_points,
            "streak_days": user.streak_days or 0,
            "completed_lessons": completed_count,
            "is_pro": user.is_pro or user.tier == "titanium"
        })
    
    return {
        "leaderboard": leaderboard,
        "stats": {
            "total_active_users": total_users,
            "avg_eloquence": round(float(avg_val), 1)
        }
    }

def _calculate_label(count: int) -> str:
    if count < 5: return "A1 - Beginner"
    if count < 15: return "A2 - Elementary"
    if count < 30: return "B1 - Intermediate"
    if count < 45: return "B2 - Upper Intermediate"
    return "C1 - Advanced"

def _calculate_level(xp: int) -> int:
    if xp < 100: return 1
    if xp < 500: return 2
    if xp < 1000: return 3
    excess = xp - 1000
    return 4 + (excess // 2000)

def _level_details(xp: int):
    level = _calculate_level(xp)
    if level == 1:
        current_base = 0
        next_base = 100
    elif level == 2:
        current_base = 100
        next_base = 500
    elif level == 3:
        current_base = 500
        next_base = 1000
    else:
        current_base = 1000 + ((level - 4) * 2000)
        next_base = current_base + 2000
    
    xp_in_level = xp - current_base
    total_for_level = next_base - current_base
    progress_percent = int((xp_in_level / total_for_level) * 100) if total_for_level > 0 else 0
    xp_to_next = next_base - xp
    
    return {
        "level": level,
        "xp_to_next": xp_to_next,
        "progress_percent": progress_percent,
        "next_level": level + 1,
        "current_base": current_base,
        "next_base": next_base
    }



# ==============================================================================
# 🔥 NUEVO: 4. GLOBAL LEADERBOARD (Ranking Ejecutivo)
# ==============================================================================
@router.get("/leaderboard")
def get_global_leaderboard(
    limit: int = 5,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """
    Obtiene a los usuarios con mayor XP acumulada de manera anónima (Alias).
    """
    try:
        # Obtener todos los usuarios de la base de datos
        users_query = db.query(models.User).all()
        
        # Calcular el XP total para cada usuario
        leaderboard_list = []
        for user in users_query:
            xp_sum = db.query(func.sum(models.Progress.score)).filter(
                models.Progress.user_id == user.id
            ).scalar() or 0
            
            chess_xp = db.query(func.sum(models.ChessProgress.earned_xp)).filter(
                models.ChessProgress.user_id == user.id
            ).scalar() or 0
            
            total_xp = xp_sum + chess_xp
            
            leaderboard_list.append({
                "user_id": user.id,
                "username": user.username,
                "xp": int(total_xp)
            })
            
        # Ordenar por XP acumulado descendente
        leaderboard_list.sort(key=lambda u: u["xp"], reverse=True)
        
        # Formatear la respuesta
        leaderboard_data = []
        for idx, item in enumerate(leaderboard_list[:limit]):
            is_me = (item["user_id"] == current_user.id)
            alias = item["username"]
            leaderboard_data.append({
                "rank": idx + 1,
                "alias": alias,
                "xp": item["xp"],
                "isMe": is_me
            })
            
        # Si el usuario actual no quedó en el Top, lo agregamos al final para que vea su posición
        if not any(u["isMe"] for u in leaderboard_data):
            my_xp_query = db.query(func.sum(models.Progress.score)).filter(
                models.Progress.user_id == current_user.id
            ).scalar() or 0
            
            my_chess_xp = db.query(func.sum(models.ChessProgress.earned_xp)).filter(
                models.ChessProgress.user_id == current_user.id
            ).scalar() or 0
            
            my_xp = int(my_xp_query) + my_chess_xp
            
            leaderboard_data.append({
                "rank": "-",
                "alias": current_user.username,
                "xp": my_xp,
                "isMe": True
            })
            
        return {"leaderboard": leaderboard_data}

    except Exception as e:
        print(f"❌ Error generando leaderboard: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="Error al generar las métricas globales."
        )

# ==============================================================================
# 5. DEBUG / ADMIN (Solo para desarrollo)
# ==============================================================================
@router.post("/debug/unlock-all/{username}")
def unlock_all_levels(
    username: str,
    db: Session = Depends(get_db)
):
    """
    Modo Dios: Desbloquea todas las lecciones para el usuario actual.
    """
    return {"msg": f"Niveles desbloqueados para {username} (Simulado)"}


# ==============================================================================
# 🔥 SIMULADORES OFICIALES (TOEIC, TOEFL, IELTS) - CONTROL DE TIEMPO RESISTENTE A LOGOUT
# ==============================================================================
from datetime import datetime, timezone, timedelta

@router.get("/exam/{exam_id}/status", response_model=Dict[str, Any])
def get_exam_status(
    exam_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """
    Obtiene el estado de un simulador activo. Si el tiempo límite ya pasó,
    marca el intento como expirado.
    """
    # 🚨 Protección de nivel Executive
    if current_user.tier not in ["executive", "titanium"] and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Los simuladores oficiales de certificación están limitados al plan EXECUTIVE."
        )

    attempt = db.query(models.ExamAttempt).filter(
        models.ExamAttempt.user_id == current_user.id,
        models.ExamAttempt.exam_id == exam_id,
        models.ExamAttempt.status == "active"
    ).first()

    if not attempt:
        return {"status": "none", "remaining_seconds": 0}

    # Calcular tiempo transcurrido
    now = datetime.now(timezone.utc)
    started_at = attempt.started_at
    if started_at.tzinfo is None:
        started_at = started_at.replace(tzinfo=timezone.utc)

    elapsed = (now - started_at).total_seconds()
    remaining = attempt.time_limit_seconds - elapsed

    if remaining <= 0:
        # Expirado
        attempt.status = "expired"
        attempt.finished_at = attempt.started_at + timedelta(seconds=attempt.time_limit_seconds)
        db.commit()
        return {"status": "expired", "remaining_seconds": 0}

    return {
        "status": "active",
        "started_at": attempt.started_at.isoformat(),
        "time_limit_seconds": attempt.time_limit_seconds,
        "remaining_seconds": int(remaining)
    }


@router.post("/exam/{exam_id}/start", response_model=Dict[str, Any])
def start_exam_attempt(
    exam_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """
    Inicia un nuevo intento de simulador para el usuario.
    Si ya hay uno activo y no expirado, lo devuelve.
    """
    # 🚨 Protección de nivel Executive
    if current_user.tier not in ["executive", "titanium"] and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Los simuladores oficiales de certificación están limitados al plan EXECUTIVE."
        )

    # Buscar intento activo existente
    attempt = db.query(models.ExamAttempt).filter(
        models.ExamAttempt.user_id == current_user.id,
        models.ExamAttempt.exam_id == exam_id,
        models.ExamAttempt.status == "active"
    ).first()

    now = datetime.now(timezone.utc)

    if attempt:
        started_at = attempt.started_at
        if started_at.tzinfo is None:
            started_at = started_at.replace(tzinfo=timezone.utc)

        elapsed = (now - started_at).total_seconds()
        remaining = attempt.time_limit_seconds - elapsed

        if remaining > 0:
            return {
                "status": "active",
                "started_at": attempt.started_at.isoformat(),
                "time_limit_seconds": attempt.time_limit_seconds,
                "remaining_seconds": int(remaining)
            }
        else:
            # Marcarlo como expirado
            attempt.status = "expired"
            attempt.finished_at = attempt.started_at + timedelta(seconds=attempt.time_limit_seconds)
            db.commit()

    # Definir límites de tiempo por simulador
    limits = {
        "toeic_listening": 2700,  # 45 min
        "toeic_reading": 4500,    # 75 min
        "toeic_mock": 7200,       # 120 min (2h)
        "toefl_mock": 10800,      # 180 min (3h)
        "ielts_mock": 10200       # 170 min (2h 50m)
    }
    exam_base_id = exam_id.lower()
    if "_v" in exam_base_id:
        exam_base_id = exam_base_id.split("_v")[0]
    limit_sec = limits.get(exam_base_id, 7200)

    new_attempt = models.ExamAttempt(
        user_id=current_user.id,
        exam_id=exam_id,
        started_at=datetime.utcnow(),
        time_limit_seconds=limit_sec,
        status="active"
    )
    db.add(new_attempt)
    db.commit()
    db.refresh(new_attempt)

    return {
        "status": "active",
        "started_at": new_attempt.started_at.isoformat(),
        "time_limit_seconds": new_attempt.time_limit_seconds,
        "remaining_seconds": new_attempt.time_limit_seconds
    }


@router.post("/exam/{exam_id}/submit", response_model=Dict[str, Any])
def submit_exam_attempt(
    exam_id: str,
    score: int = Query(0, description="Puntaje obtenido"),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """
    Finaliza un intento de simulador registrando la hora de término
    y calculando la duración del examen.
    """
    attempt = db.query(models.ExamAttempt).filter(
        models.ExamAttempt.user_id == current_user.id,
        models.ExamAttempt.exam_id == exam_id,
        models.ExamAttempt.status == "active"
    ).first()

    now = datetime.now(timezone.utc)

    if not attempt:
        return {"status": "none", "duration_seconds": 0, "msg": "No había un intento activo."}

    started_at = attempt.started_at
    if started_at.tzinfo is None:
        started_at = started_at.replace(tzinfo=timezone.utc)

    duration = (now - started_at).total_seconds()
    
    # Si se pasó del límite de tiempo, la duración oficial se topa al límite
    if duration > attempt.time_limit_seconds:
        duration = attempt.time_limit_seconds

    attempt.status = "completed"
    attempt.finished_at = datetime.utcnow()
    attempt.score = score
    db.commit()

    return {
        "status": "completed",
        "started_at": attempt.started_at.isoformat(),
        "finished_at": attempt.finished_at.isoformat(),
        "duration_seconds": int(duration),
        "score": score
    }