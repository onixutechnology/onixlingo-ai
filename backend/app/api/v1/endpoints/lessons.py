import json
import logging
from pathlib import Path
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, HTTPException, status, Path as PathParam
from pydantic import BaseModel

# Configuramos el logger
logger = logging.getLogger("OnixLingo.ContentDelivery")

router = APIRouter()

# --- 1. CONFIGURACIÓN DE RUTAS (CORREGIDO) ---
CURRENT_FILE = Path(__file__).resolve()

# Asumiendo que este archivo está en: app/api/v1/endpoints/lessons.py
# parents[0]=endpoints, [1]=v1, [2]=api, [3]=app, [4]=ROOT (carpeta del proyecto)
APP_ROOT = CURRENT_FILE.parents[4] 

# 🚨 CORRECCIÓN AQUÍ: Apuntamos a la carpeta que mostraste en la imagen
# Antes: APP_ROOT / "app" / "data" / "lessons"
LESSONS_DIR = APP_ROOT / "app" / "data" / "datapro" / "lessonspro"

# --- 2. MODELOS DE VALIDACIÓN "A PRUEBA DE BALAS" ---

class LessonStage(BaseModel):
    id: str
    type: str 
    
    title: Optional[str] = None
    description: Optional[str] = None
    xp_reward: Optional[int] = 0
    
    # Datos de contenido dinámicos
    parts: Optional[List[Dict[str, Any]]] = None      
    questions: Optional[List[Dict[str, Any]]] = None  
    scenario: Optional[str] = None                    
    ai_system_prompt: Optional[str] = None            
    initial_message: Optional[str] = None             
    success_criteria: Optional[List[str]] = None      
    items: Optional[List[str]] = None                 
    buckets: Optional[Dict[str, List[str]]] = None    

    # Ignorar campos extra para evitar errores 500
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
    Busca el archivo JSON en data/datapro/lessonspro/ y lo devuelve.
    """
    
    # 1. Construir ruta (le agregamos .json si no lo trae)
    # Nota: El frontend suele mandar el ID sin extensión.
    filename = f"{lesson_id}.json"
    target_file = LESSONS_DIR / filename
    
    # Log para depuración (verás esto en la consola si falla)
    logger.info(f"🔍 Buscando lección en: {target_file}")

    # 2. Verificar existencia
    if not target_file.exists():
        logger.error(f"❌ Archivo no encontrado en disco: {target_file}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lección '{lesson_id}' no encontrada en el sistema."
        )

    # 3. Leer y Servir
    try:
        with open(target_file, "r", encoding="utf-8") as f:
            raw_data = json.load(f)
            
        # Validación Pydantic
        return LessonContent(**raw_data)

    except json.JSONDecodeError as e:
        logger.error(f"🔥 JSON CORRUPTO en {lesson_id}: {e}")
        raise HTTPException(status_code=500, detail="El archivo de la lección está dañado (JSON inválido).")
    except Exception as e:
        logger.error(f"🔥 ERROR CRÍTICO: {e}")
        raise HTTPException(status_code=500, detail=f"Error interno: {str(e)}")