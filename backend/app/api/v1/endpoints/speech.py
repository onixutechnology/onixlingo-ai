from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from app.services.speech_service import SpeechAnalysisService
from app.core.security import get_current_user


router = APIRouter()
speech_service = SpeechAnalysisService()

@router.post("/analyze")
async def analyze_speech(
    audio: UploadFile = File(...),
    target_text: str = Form(...),
    # current_user = Depends(get_current_user) # Descomenta para proteger la ruta
):
    """
    Recibe un archivo de audio del frontend y el texto que el usuario debía leer.
    Devuelve un puntaje de fluidez.
    """
    if not audio.filename.endswith(('.webm', '.wav', '.mp3', '.m4a')):
        raise HTTPException(status_code=400, detail="Formato de audio no soportado.")

    try:
        # Leemos el archivo en memoria
        audio_bytes = await audio.read()
        
        # Enviamos al servicio de IA
        analysis_result = await speech_service.process_audio(audio_bytes, target_text)
        
        return {
            "status": "success",
            "data": analysis_result
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
