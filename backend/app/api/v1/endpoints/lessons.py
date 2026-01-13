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
LESSONS_DIR = APP_ROOT / "app" / "data" / "lessons"

# --- 2. MODELOS DE VALIDACIÓN "A PRUEBA DE BALAS" ---

class LessonStage(BaseModel):
    # Campos obligatorios mínimos
    id: str
    type: str 
    
    # Campos opcionales (Aceptamos TODO para que no falle el error 500)
    title: Optional[str] = None
    description: Optional[str] = None
    xp_reward: Optional[int] = 0
    
    # Datos de contenido (Cualquier cosa que venga en el JSON pasará)
    parts: Optional[List[Dict[str, Any]]] = None      # Lectures
    questions: Optional[List[Dict[str, Any]]] = None  # Quizzes
    scenario: Optional[str] = None                    # Chat
    ai_system_prompt: Optional[str] = None            # Chat
    initial_message: Optional[str] = None             # Chat
    success_criteria: Optional[List[str]] = None      # Chat
    items: Optional[List[str]] = None                 # Bucket Sort
    buckets: Optional[Dict[str, List[str]]] = None    # Bucket Sort

    # ESTO ES LA CLAVE: Si hay campos extra en el JSON, IGNÓRALOS, no lances error.
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
    Endpoint robusto que lee el JSON y lo sirve sin validaciones estrictas.
    """
    
    # 1. Construir ruta
    target_file = LESSONS_DIR / f"{lesson_id}.json"
    
    # 2. Verificar existencia
    if not target_file.exists():
        logger.error(f"❌ Archivo no encontrado: {target_file}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lección '{lesson_id}' no encontrada."
        )

    # 3. Leer y Servir (Con manejo de errores detallado en consola)
    try:
        with open(target_file, "r", encoding="utf-8") as f:
            raw_data = json.load(f)
            
        # Validación Pydantic permisiva
        return LessonContent(**raw_data)

    except json.JSONDecodeError as e:
        logger.error(f"🔥 JSON MAL FORMADO en {lesson_id}: {e}")
        raise HTTPException(status_code=500, detail="El archivo JSON tiene errores de sintaxis.")
    except Exception as e:
        # Aquí atrapamos el error de validación y lo imprimimos en tu terminal
        logger.error(f"🔥 ERROR DE VALIDACIÓN CRÍTICO: {e}")
        print(f"------------ DETALLE DEL ERROR ------------\n{e}\n-------------------------------------------")
        raise HTTPException(status_code=500, detail=f"Error procesando la lección: {str(e)}")