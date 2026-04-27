import json
import logging
from pathlib import Path
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, HTTPException, status, Path as PathParam, Query
from pydantic import BaseModel

# Configuramos el logger
logger = logging.getLogger("OnixLingo.ContentDelivery")

router = APIRouter()

# --- 1. CONFIGURACIÓN DE RUTAS ---
CURRENT_FILE = Path(__file__).resolve()
APP_ROOT = CURRENT_FILE.parents[4] 

# Rutas base correctas
NORMAL_DIR = APP_ROOT / "app" / "data" / "lessons"
PRO_DIR = APP_ROOT / "app" / "datapro" / "lessonspro"

# --- 2. MODELOS ---
class LessonStage(BaseModel):
    id: str
    type: str 
    title: Optional[str] = None
    description: Optional[str] = None
    xp_reward: Optional[int] = 0
    parts: Optional[List[Dict[str, Any]]] = None      
    questions: Optional[List[Dict[str, Any]]] = None  
    scenario: Optional[str] = None                    
    ai_system_prompt: Optional[str] = None            
    initial_message: Optional[str] = None             
    success_criteria: Optional[List[str]] = None      
    items: Optional[List[str]] = None                 
    buckets: Optional[Dict[str, List[str]]] = None    
    class Config:
        extra = "ignore" 

class LessonContent(BaseModel):
    id: str
    title: str
    version: Optional[str] = "1.0"
    level: Optional[str] = "A1"
    total_xp: Optional[int] = 0
    tags: Optional[List[str]] = []
    stages: List[LessonStage]
    class Config:
        extra = "ignore"

# --- 3. ENDPOINT MULTILENGUAJE ---
@router.get("/{lesson_id}", response_model=LessonContent)
def get_lesson_content(
    lesson_id: str = PathParam(..., title="ID de la lección"),
    lang: str = Query("en", description="Idioma de la lección (en, fr, zh)") # 🔥 AGREGADO
):
    filename = f"{lesson_id}.json"
    
    # Decidir si buscamos en la carpeta PRO o NORMAL, agregando el idioma
    if lesson_id.startswith("pro-"):
        target_file = PRO_DIR / lang / filename
        fallback_file = PRO_DIR / "en" / filename
    else:
        target_file = NORMAL_DIR / lang / filename
        fallback_file = NORMAL_DIR / "en" / filename

    logger.info(f"🔍 Buscando '{lesson_id}' en idioma '{lang}': {target_file}")

    # Si no existe en Francés/Chino, hacemos "fallback" a Inglés para no romper la app
    if not target_file.exists():
        if lang != "en" and fallback_file.exists():
            logger.warning(f"⚠️ Lección {lesson_id} no está en {lang}. Cargando en Inglés por defecto.")
            target_file = fallback_file
        else:
            logger.error(f"❌ Archivo no encontrado en absoluto.")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Lección no encontrada en el servidor."
            )

    try:
        with open(target_file, "r", encoding="utf-8") as f:
            raw_data = json.load(f)
        return LessonContent(**raw_data)
    except Exception as e:
        logger.error(f"🔥 Error leyendo archivo: {e}")
        raise HTTPException(status_code=500, detail="Error interno al leer lección.")