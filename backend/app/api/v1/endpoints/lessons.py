import json
import logging
from pathlib import Path
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, HTTPException, status, Path as PathParam
from pydantic import BaseModel

# Configuramos el logger
logger = logging.getLogger("OnixLingo.ContentDelivery")

router = APIRouter()

# --- 1. CONFIGURACIÓN DE RUTAS (DOBLE RUTA) ---
CURRENT_FILE = Path(__file__).resolve()
APP_ROOT = CURRENT_FILE.parents[4] 

# Ruta 1: Lecciones Normales
# (Asegúrate que esta carpeta exista, aunque esté vacía por ahora)
NORMAL_DIR = APP_ROOT / "app" / "data" / "lessons"

# Ruta 2: Lecciones PRO
# 🚨 CORRECCIÓN: Agregué "data" que faltaba en tu ruta anterior según tu estructura de archivos
PRO_DIR = APP_ROOT / "app" / "data" / "datapro" / "lessonspro"

# --- 2. MODELOS DE VALIDACIÓN ---

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

# --- 3. ENDPOINT INTELIGENTE ---

@router.get("/{lesson_id}", response_model=LessonContent)
def get_lesson_content(
    lesson_id: str = PathParam(..., title="ID de la lección")
):
    """
    Busca automáticamente en la carpeta PRO o NORMAL según el ID.
    """
    filename = f"{lesson_id}.json"
    
    # 🕵️‍♂️ LÓGICA DE BÚSQUEDA INTELIGENTE
    if lesson_id.startswith("pro-"):
        target_file = PRO_DIR / filename
        search_location = "PRO Directory"
    else:
        target_file = NORMAL_DIR / filename
        search_location = "NORMAL Directory"

    # Log para ver qué está pasando
    logger.info(f"🔍 Buscando '{lesson_id}' en {search_location} ({target_file})")

    # 1. Primer intento: Buscar en la carpeta designada
    if not target_file.exists():
        # 2. Intento de rescate: Buscar en la OTRA carpeta por si acaso
        logger.warning(f"⚠️ No encontrado en {search_location}. Intentando ruta alternativa...")
        
        if search_location == "PRO Directory":
            target_file = NORMAL_DIR / filename
        else:
            target_file = PRO_DIR / filename
            
        # 3. Fallo definitivo
        if not target_file.exists():
            logger.error(f"❌ Archivo no encontrado en ninguna ruta: {lesson_id}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Lección '{lesson_id}' no encontrada en el sistema."
            )

    # 4. Leer y Servir
    try:
        with open(target_file, "r", encoding="utf-8") as f:
            raw_data = json.load(f)
            
        return LessonContent(**raw_data)

    except json.JSONDecodeError as e:
        logger.error(f"🔥 JSON CORRUPTO en {lesson_id}: {e}")
        raise HTTPException(status_code=500, detail="El archivo JSON tiene errores de sintaxis.")
    except Exception as e:
        logger.error(f"🔥 ERROR CRÍTICO: {e}")
        raise HTTPException(status_code=500, detail=f"Error interno: {str(e)}")