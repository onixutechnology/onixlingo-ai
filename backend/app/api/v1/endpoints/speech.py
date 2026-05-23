from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends, status
from sqlalchemy.orm import Session
from datetime import datetime, time

from app.services.speech_service import SpeechAnalysisService
from app.api.deps import get_current_active_user
from app.database import get_db
from app.db.models import SpeechPracticeLog

router = APIRouter()
speech_service = SpeechAnalysisService()

@router.post("/analyze")
async def analyze_speech(
    audio: UploadFile = File(...),
    target_text: str = Form(...),
    current_user = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Recibe un archivo de audio del frontend y el texto que el usuario debía leer.
    Devuelve un puntaje de fluidez.
    """
    user_tier = current_user.tier or "free"
    is_admin = getattr(current_user, "role", "student") == "admin"
    
    if not is_admin:
        if user_tier == "free":
            today_start = datetime.combine(datetime.utcnow().date(), time.min)
            practice_count = db.query(SpeechPracticeLog).filter(
                SpeechPracticeLog.user_id == current_user.id,
                SpeechPracticeLog.created_at >= today_start
            ).count()
            
            if practice_count >= 3:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Has consumido tus 3 audios de práctica de hoy. Sube a PRO o EXECUTIVE para práctica ilimitada."
                )
    
    if not audio.filename.endswith(('.webm', '.wav', '.mp3', '.m4a')):
        raise HTTPException(status_code=400, detail="Formato de audio no soportado.")

    try:
        # Leemos el archivo en memoria
        audio_bytes = await audio.read()
        
        # Enviamos al servicio de IA
        analysis_result = await speech_service.process_audio(audio_bytes, target_text)
        
        # Registramos la práctica
        if not is_admin:
            log_entry = SpeechPracticeLog(user_id=current_user.id)
            db.add(log_entry)
            db.commit()
            
        return {
            "status": "success",
            "data": analysis_result
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
