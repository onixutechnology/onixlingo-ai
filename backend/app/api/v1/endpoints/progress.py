from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from app.database import get_db, User, Progress

router = APIRouter()

# --- DTOs ---
class ProgressUpdate(BaseModel):
    username: str
    lesson_id: str
    stars: int

class SkillMetric(BaseModel):
    subject: str
    A: int
    fullMark: int = 100

class DashboardStats(BaseModel):
    username: str
    level_label: str
    total_xp: int
    streak_days: int
    completed_modules: int
    global_progress: int
    skills_radar: List[SkillMetric]

# --- HELPERS ---
def calculate_user_level(modules_count: int) -> str:
    if modules_count < 5: return "A1 - Beginner"
    if modules_count < 15: return "A2 - Elementary"
    if modules_count < 30: return "B1 - Intermediate"
    if modules_count < 45: return "B2 - Upper Intermediate"
    return "C1 - Advanced"

def analyze_skills(progress_records: List[Progress]) -> List[SkillMetric]:
    skills = {"Speaking": 20, "Writing": 20, "Listening": 20, "Reading": 20, "Grammar": 20, "Vocabulary": 20}
    for p in progress_records:
        lid = p.lesson_id.lower()
        impact = p.stars * 5 
        if "speaking" in lid: skills["Speaking"] += impact; skills["Listening"] += (impact // 2)
        elif "writing" in lid: skills["Writing"] += impact; skills["Grammar"] += (impact // 2)
        elif "listening" in lid: skills["Listening"] += impact
        elif "reading" in lid: skills["Reading"] += impact; skills["Vocabulary"] += (impact // 2)
        else: skills["Grammar"] += (impact // 2); skills["Vocabulary"] += (impact // 2)
    return [SkillMetric(subject=k, A=min(v, 100)) for k, v in skills.items()]

# --- ENDPOINTS ---

@router.get("/user/stats/{username}", response_model=DashboardStats)
def get_user_analytics(username: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if not user: raise HTTPException(status_code=404, detail="Usuario no encontrado")

    raw_progress = db.query(Progress).filter(Progress.user_id == user.id).all()
    modules_count = len(raw_progress)
    total_xp = (modules_count * 50) + (sum(p.stars for p in raw_progress) * 20)
    
    return DashboardStats(
        username=user.username,
        level_label=calculate_user_level(modules_count),
        total_xp=total_xp,
        streak_days=int(modules_count / 1.5) if modules_count > 1 else 1,
        completed_modules=modules_count,
        global_progress=min(int((modules_count / 60) * 100), 100),
        skills_radar=analyze_skills(raw_progress)
    )

@router.post("/save_progress")
def save_progress(data: ProgressUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == data.username).first()
    if not user: raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    try:
        prog = db.query(Progress).filter(Progress.user_id == user.id, Progress.lesson_id == data.lesson_id).first()
        if prog:
            if data.stars > prog.stars: prog.stars = data.stars
        else:
            db.add(Progress(user_id=user.id, lesson_id=data.lesson_id, stars=data.stars))
        
        db.commit()
        return {"status": "success", "lesson_id": data.lesson_id}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error guardando progreso: {str(e)}")

# 3. 🔥 MODO DIOS: FUERZA BRUTA PARA DESBLOQUEAR TODO
@router.post("/debug/unlock-all/{username}")
def unlock_all_levels(username: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if not user: raise HTTPException(status_code=404, detail="Usuario no encontrado")

    niveles = ["a1", "a2", "b1", "b2", "c1"]
    all_ids = []

    # ESTRATEGIA DE COBERTURA TOTAL:
    # Generamos variaciones para asegurarnos de atinarle al ID correcto
    for nivel in niveles:
        for i in range(1, 25): 
            # 1. Formato estándar: pro-a1-1
            all_ids.append(f"pro-{nivel}-{i}")
            # 2. Formato con ceros: pro-a1-01 (común en bases de datos)
            all_ids.append(f"pro-{nivel}-{i:02d}")
            # 3. Formato sin prefijo: a1-1 (por si acaso)
            all_ids.append(f"{nivel}-{i}")
            
    # Certificaciones
    certs = ["toeic_listening", "toeic_reading", "toeic_speaking", "toeic_writing"]
    all_ids.extend(certs)

    count = 0
    try:
        for lesson_id in all_ids:
            exists = db.query(Progress).filter(Progress.user_id == user.id, Progress.lesson_id == lesson_id).first()
            
            if not exists:
                db.add(Progress(user_id=user.id, lesson_id=lesson_id, stars=3))
                count += 1
            elif exists.stars < 3:
                exists.stars = 3 # Forzamos 3 estrellas si ya existía
        
        db.commit()
        return {"message": f"🔓 FUERZA BRUTA: Se verificaron {len(all_ids)} combinaciones. Nuevos desbloqueos: {count}"}
    
    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Error interno")

# 4. 🔥 SINCRONIZACIÓN (VITAL)
@router.get("/user/progress-map/{username}")
def get_progress_map(username: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if not user: return {}
    
    progress_records = db.query(Progress).filter(Progress.user_id == user.id).all()
    
    progress_map = {}
    for p in progress_records:
        progress_map[p.lesson_id] = { "stars": p.stars, "score": 100 }
    
    return progress_map