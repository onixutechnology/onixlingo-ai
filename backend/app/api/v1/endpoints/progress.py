from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from app.db.session import get_db
from app.db import models
from app.api import deps  # Asumo que aquí tienes get_current_active_user
from app.schemas.titanium import ProgressUpdate, ProgressRead, DashboardMap, LessonType
from app.services import progress_service

router = APIRouter()

# --- 1. GUARDAR PROGRESO Y DESBLOQUEAR (El corazón del sistema) ---
@router.post("/complete", response_model=ProgressRead)
def complete_lesson(
    *,
    db: Session = Depends(get_db),
    data: ProgressUpdate,
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """
    Recibe el avance, calcula score, guarda y DESBLOQUEA la siguiente lección.
    """
    # Delegamos toda la lógica sucia al servicio
    progress = progress_service.update_lesson_progress(
        db=db,
        user_id=current_user.id,
        lesson_id=data.lesson_id,
        score=data.score,
        steps_completed=data.current_step
        # Nota: Si tu progress_service necesita lesson_type, pásalo aquí:
        # lesson_type=data.lesson_type 
    )
    
    return progress

# --- 2. MAPA DE AVANCE (Para pintar el Dashboard) ---
@router.get("/map", response_model=DashboardMap)
def get_dashboard_map(
    *,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """
    Devuelve TODO el progreso organizado por bloques (Standard, Pro, Vocab).
    """
    # Obtenemos todo el historial raw
    all_progress = db.query(models.Progress).filter(
        models.Progress.user_id == current_user.id
    ).all()

    # Filtramos en memoria (o podrías hacer 3 queries, pero esto es más rápido para <1000 registros)
    standard_list = [p for p in all_progress if p.lesson_type == models.LessonType.STANDARD]
    pro_list = [p for p in all_progress if p.lesson_type == models.LessonType.PRO]
    vocab_list = [p for p in all_progress if p.lesson_type == models.LessonType.VOCAB]

    # Calcular XP Total (Ejemplo simple)
    total_xp = sum(p.score for p in all_progress)

    return DashboardMap(
        standard=standard_list,
        pro=pro_list,
        vocab=vocab_list,
        total_xp=total_xp
    )

# --- 3. ANALYTICS & RADAR (Manteniendo tu lógica visual) ---
# He adaptado tu lógica anterior para que use el current_user seguro

@router.get("/stats", response_model=Dict[str, Any])
def get_user_stats(
    *,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    raw_progress = db.query(models.Progress).filter(models.Progress.user_id == current_user.id).all()
    modules_count = len([p for p in raw_progress if p.status == 'completed'])
    
    # Tu lógica de Skill Radar (refinada)
    skills = {"Speaking": 20, "Writing": 20, "Listening": 20, "Reading": 20, "Grammar": 20, "Vocabulary": 20}
    
    for p in raw_progress:
        lid = p.lesson_id.lower()
        impact = p.stars * 5
        
        # Heurística simple basada en ID (puedes mejorar esto luego con metadata real)
        if "speak" in lid: skills["Speaking"] += impact; skills["Listening"] += (impact // 2)
        elif "write" in lid: skills["Writing"] += impact; skills["Grammar"] += (impact // 2)
        elif "listen" in lid: skills["Listening"] += impact
        elif "read" in lid: skills["Reading"] += impact; skills["Vocabulary"] += (impact // 2)
        elif "voc" in lid: skills["Vocabulary"] += impact
        else: skills["Grammar"] += (impact // 3); skills["Vocabulary"] += (impact // 3)

    # Normalizar a 100
    radar_data = [{"subject": k, "A": min(v, 100), "fullMark": 100} for k, v in skills.items()]

    return {
        "username": current_user.username,
        "level_label": _calculate_label(modules_count),
        "total_xp": sum(p.score for p in raw_progress),
        "streak_days": 5, # Aquí conectarías tu lógica real de racha
        "completed_modules": modules_count,
        "global_progress": min(int((modules_count / 60) * 100), 100), # Asumiendo 60 lecciones totales
        "skills_radar": radar_data
    }

def _calculate_label(count: int) -> str:
    if count < 5: return "A1 - Beginner"
    if count < 15: return "A2 - Elementary"
    if count < 30: return "B1 - Intermediate"
    if count < 45: return "B2 - Upper Intermediate"
    return "C1 - Advanced"

# --- 4. DEBUG (Mantén esto solo si es necesario, comenta en producción) ---
@router.post("/debug/unlock-all")
def unlock_all_levels(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(deps.get_current_active_user) # Solo el usuario logueado
):
    """Modo Dios para pruebas rápidas"""
    # ... (Tu lógica de fuerza bruta, pero usando current_user.id) ...
    return {"msg": "Done"}