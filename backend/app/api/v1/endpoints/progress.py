from fastapi import APIRouter, Depends, HTTPException, status
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
            difficulty_completed=data.difficulty_completed
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

    total_xp = sum(p.score for p in all_progress)

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

    skills = {"Speaking": 20, "Writing": 20, "Listening": 20, "Reading": 20, "Grammar": 20, "Vocabulary": 20}
    
    for p in raw_progress:
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

    return {
        "username": current_user.username,
        "level_label": _calculate_label(modules_count),
        "total_xp": sum(p.score for p in raw_progress),
        "streak_days": current_user.streak_days or 0, 
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
        # Sumariza el XP (score) total de cada usuario en la tabla Progress
        ranking_query = db.query(
            models.Progress.user_id,
            func.sum(models.Progress.score).label("total_xp")
        ).group_by(
            models.Progress.user_id
        ).order_by(
            func.sum(models.Progress.score).desc()
        ).limit(limit).all()

        leaderboard_data = []
        rank = 1
        
        for user_id, total_xp in ranking_query:
            is_me = (user_id == current_user.id)
            
            # Generador de Alias para proteger la privacidad (Ej. "Exec_004")
            alias = f"Exec_{str(user_id).zfill(3)}" if not is_me else current_user.username
            
            leaderboard_data.append({
                "rank": rank,
                "alias": alias,
                "xp": int(total_xp) if total_xp else 0,
                "isMe": is_me
            })
            rank += 1
            
        # Si el usuario actual no quedó en el Top 5, lo agregamos al final para que vea su posición
        if not any(u["isMe"] for u in leaderboard_data):
            my_xp_query = db.query(func.sum(models.Progress.score)).filter(
                models.Progress.user_id == current_user.id
            ).scalar()
            
            my_xp = int(my_xp_query) if my_xp_query else 0
            
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