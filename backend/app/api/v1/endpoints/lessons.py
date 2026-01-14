import json
import logging
from pathlib import Path
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, HTTPException, status, Path as PathParam
from pydantic import BaseModel

# Configuramos el logger
logger = logging.getLogger("OnixLingo.ContentDelivery")

router = APIRouter()

# --- 1. CONFIGURACIÓN DE RUTAS ---
CURRENT_FILE = Path(__file__).resolve()
APP_ROOT = CURRENT_FILE.parents[4] 

# Ruta 1: Lecciones Normales (app/data/lessons)
NORMAL_DIR = APP_ROOT / "app" / "data" / "lessons"

# Ruta 2: Lecciones PRO (CORREGIDA SEGÚN TUS FOTOS)
# Antes tenías: ... / "data" / "datapro" ... (Esto sobraba)
# Ahora es directo: app -> datapro -> lessonspro
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

# --- 3. ENDPOINT ---
@router.get("/{lesson_id}", response_model=LessonContent)
def get_lesson_content(
    lesson_id: str = PathParam(..., title="ID de la lección")
):
    filename = f"{lesson_id}.json"
    
    # LÓGICA DE BÚSQUEDA INTELIGENTE
    if lesson_id.startswith("pro-"):
        target_file = PRO_DIR / filename
        search_location = "PRO Directory (app/datapro)"
    else:
        target_file = NORMAL_DIR / filename
        search_location = "NORMAL Directory (app/data)"

    logger.info(f"🔍 Buscando '{lesson_id}' en: {target_file}")

    if not target_file.exists():
        # Intento de rescate cruzado
        if search_location.startswith("PRO"):
            target_file = NORMAL_DIR / filename
        else:
            target_file = PRO_DIR / filename
            
        if not target_file.exists():
            logger.error(f"❌ Archivo no encontrado: {target_file}")
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