from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any

# --- IMPORTS DE INFRAESTRUCTURA ---
from app.database import get_db
from app.db import models  # ✅ CORRECTO: Importamos los modelos desde su nueva casa
from app.api import deps   # Dependencia de autenticación (get_current_active_user)

# --- IMPORTS DE SCHEMAS (DTOs) ---
# Asegúrate de que tu archivo de schemas se llame 'titanium.py'. 
# Si se llama 'schemas.py', cambia esto a: from app.schemas import ...
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
            # ✅ IMPORTANTE: Pasamos el tipo para saber qué mapa desbloquear
            lesson_type=data.lesson_type 
        )
        return progress
    except Exception as e:
        # Loguear error real en consola del servidor
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
    Devuelve TODO el progreso del usuario organizado por bloques:
    - Standard (Curso Normal)
    - Pro (Business/Advanced)
    - Vocab (Vocabulario)
    """
    # 1. Traemos todo el historial de este usuario
    all_progress = db.query(models.Progress).filter(
        models.Progress.user_id == current_user.id
    ).all()

    # 2. Filtramos en memoria (Python) para separar las listas
    # Esto es más rápido que hacer 3 consultas SQL separadas.
    standard_list = [p for p in all_progress if p.lesson_type == models.LessonType.STANDARD]
    pro_list = [p for p in all_progress if p.lesson_type == models.LessonType.PRO]
    vocab_list = [p for p in all_progress if p.lesson_type == models.LessonType.VOCAB]

    # 3. Calculamos XP Total
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
    Genera las métricas para el perfil y el gráfico de radar.
    """
    raw_progress = db.query(models.Progress).filter(models.Progress.user_id == current_user.id).all()
    
    # Contamos solo las completadas
    completed_lessons = [p for p in raw_progress if p.status == 'completed']
    modules_count = len(completed_lessons)
    
    # --- Lógica de Skills Radar ---
    skills = {"Speaking": 20, "Writing": 20, "Listening": 20, "Reading": 20, "Grammar": 20, "Vocabulary": 20}
    
    for p in raw_progress:
        lid = p.lesson_id.lower()
        impact = p.stars * 5 # Cada estrella suma 5 puntos de impacto
        
        # Heurística basada en el ID de la lección
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
            # Lecciones generales suman un poco a todo
            skills["Grammar"] += (impact // 3)
            skills["Vocabulary"] += (impact // 3)

    # Normalizar a 100 (Topes)
    radar_data = [{"subject": k, "A": min(v, 100), "fullMark": 100} for k, v in skills.items()]

    return {
        "username": current_user.username,
        "level_label": _calculate_label(modules_count),
        "total_xp": sum(p.score for p in raw_progress),
        "streak_days": 5, # TODO: Conectar lógica real de racha
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

# ==============================================================================
# 4. DEBUG / ADMIN (Solo para desarrollo)
# ==============================================================================
@router.post("/debug/unlock-all")
def unlock_all_levels(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """
    Modo Dios: Desbloquea todas las lecciones para el usuario actual.
    Útil para testing rápido sin hacer todo el curso.
    """
    # Ejemplo básico: Inserta registros 'completed' dummy
    # En producción deberías comentar o proteger este endpoint con role='admin'
    return {"msg": f"Niveles desbloqueados para {current_user.username} (Simulado)"}