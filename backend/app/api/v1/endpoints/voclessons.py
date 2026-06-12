import json
import logging
from pathlib import Path
from fastapi import APIRouter, HTTPException, status, Query, Path as PathParam, Depends
from app.api.v1.endpoints.lessons import LessonContent
from app.api.deps import get_current_active_user

logger = logging.getLogger("OnixLingo.VocabDelivery")

router = APIRouter()

CURRENT_FILE = Path(__file__).resolve()
APP_ROOT = CURRENT_FILE.parents[4] 

VOCAB_DIR = APP_ROOT / "app" / "voclessons" / "lessons"

@router.get("/{lesson_id}", response_model=LessonContent)
async def get_vocab_lesson(
    lesson_id: str = PathParam(..., title="ID de la lección de vocabulario"),
    lang: str = Query("en", description="Idioma"),
    current_user = Depends(get_current_active_user)
):
    filename = f"{lesson_id}.json"
    
    target_file = VOCAB_DIR / lang / filename
    fallback_en = VOCAB_DIR / "en" / filename
    root_fallback = VOCAB_DIR / filename
    
    if target_file.exists():
        final_file = target_file
    elif lang != "en" and fallback_en.exists():
        final_file = fallback_en
    elif root_fallback.exists():
        final_file = root_fallback
    else:
        logger.error(f"❌ Archivo vocabulario {lesson_id} no encontrado en {VOCAB_DIR}")
        raise HTTPException(status_code=404, detail="Lección de vocabulario no encontrada.")
        
    try:
        with open(final_file, "r", encoding="utf-8") as f:
            raw_data = json.load(f)
        return LessonContent(**raw_data)
    except Exception as e:
        logger.error(f"🔥 Error leyendo {final_file}: {e}")
        raise HTTPException(status_code=500, detail="Error interno al leer la lección de vocabulario.")
