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
# Subimos 4 niveles para llegar a la raíz 'backend'
APP_ROOT = CURRENT_FILE.parents[4] 

# 📂 Carpeta Normal: backend/app/data/lessons
LESSONS_DIR = APP_ROOT / "app" / "data" / "lessons"

# 💎 Carpeta PRO: backend/app/datapro/lessonspro
LESSONS_PRO_DIR = APP_ROOT / "app" / "datapro" / "lessonspro"

# --- 2. MODELOS DE VALIDACIÓN "A PRUEBA DE BALAS" ---

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
    """
    Endpoint inteligente:
    - Si el ID empieza con 'pro-', busca en 'datapro/lessonspro'.
    - Si no, busca en 'data/lessons'.
    """
    
    # 1. LÓGICA DE SELECCIÓN DE CARPETA 🧠
    if lesson_id.startswith("pro-"):
        # Es una lección PRO
        target_file = LESSONS_PRO_DIR / f"{lesson_id}.json"
        logger.info(f"💎 Buscando lección PRO en: {target_file}")
    else:
        # Es una lección Normal
        target_file = LESSONS_DIR / f"{lesson_id}.json"
        logger.info(f"📘 Buscando lección Normal en: {target_file}")
    
    # 2. Verificar existencia
    if not target_file.exists():
        logger.error(f"❌ Archivo no encontrado: {target_file}")
        # Tip para debug: Imprimimos dónde intentó buscar
        print(f"⚠️ DEBUG: Intenté buscar en: {target_file} y no está.")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lección '{lesson_id}' no encontrada en el sistema."
        )

    # 3. Leer y Servir
    try:
        with open(target_file, "r", encoding="utf-8") as f:
            raw_data = json.load(f)
            
        return LessonContent(**raw_data)

    except json.JSONDecodeError as e:
        logger.error(f"🔥 JSON MAL FORMADO en {lesson_id}: {e}")
        raise HTTPException(status_code=500, detail="El archivo JSON tiene errores de sintaxis.")
    except Exception as e:
        logger.error(f"🔥 ERROR DE VALIDACIÓN CRÍTICO: {e}")
        print(f"------------ DETALLE DEL ERROR ------------\n{e}\n-------------------------------------------")
        raise HTTPException(status_code=500, detail=f"Error procesando la lección: {str(e)}")