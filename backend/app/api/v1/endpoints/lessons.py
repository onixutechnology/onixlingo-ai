import json
import logging
from pathlib import Path
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, HTTPException, status, Path as PathParam
from pydantic import BaseModel, ValidationError

# Configuramos el logger
logger = logging.getLogger("OnixLingo.ContentDelivery")

router = APIRouter()

# --- 1. CONFIGURACIÓN DE RUTAS ---
# Calculamos la ruta absoluta de forma robusta
CURRENT_FILE = Path(__file__).resolve()
# Estructura: backend/app/api/v1/endpoints/lessons.py -> Subimos 4 niveles a 'backend'
APP_ROOT = CURRENT_FILE.parents[4] 
LESSONS_DIR = APP_ROOT / "app" / "data" / "lessons"

# Validación de arranque
if not LESSONS_DIR.exists():
    logger.warning(f"⚠️ DIRECTORIO NO ENCONTRADO: {LESSONS_DIR}")

# --- 2. MODELOS DE VALIDACIÓN (SCHEMA TITANIUM FLEXIBLE) ---

class LessonStage(BaseModel):
    id: str
    type: str # 'lecture', 'gamified_quiz', 'practice_chat', 'bucket_sort'
    
    # Campos comunes
    title: Optional[str] = None
    description: Optional[str] = None
    xp_reward: Optional[int] = 0

    # Campos Específicos (Titanium V2)
    # Ya no obligamos a usar 'content', aceptamos los campos directos del generador
    parts: Optional[List[Dict[str, Any]]] = None      # Para Lectures (Multimedia)
    questions: Optional[List[Dict[str, Any]]] = None  # Para Quizzes/Drills
    
    # Campos para Chat/Roleplay
    scenario: Optional[str] = None
    ai_system_prompt: Optional[str] = None
    initial_message: Optional[str] = None
    success_criteria: Optional[List[str]] = None

    # Campos para Bucket Sort
    items: Optional[List[str]] = None
    buckets: Optional[Dict[str, List[str]]] = None

    # Mantenemos compatibilidad con lógica antigua o branching futuro
    next_stage_id: Optional[str] = None
    content: Optional[Dict[str, Any]] = None 

    class Config:
        # CRÍTICO: Permite campos extra no definidos en el modelo
        # Esto evita el Error 500 si el JSON tiene un campo nuevo que olvidamos declarar
        extra = "allow" 

class LessonContent(BaseModel):
    id: str
    title: str
    version: Optional[str] = "1.0"
    level: Optional[str] = "A1"
    total_xp: Optional[int] = 0
    tags: Optional[List[str]] = []
    description: Optional[str] = None
    stages: List[LessonStage]

# --- 3. ENDPOINTS ---

@router.get("/{lesson_id}", response_model=LessonContent)
def get_lesson_content(
    lesson_id: str = PathParam(..., title="ID de la lección", min_length=3)
):
    """
    Recupera el contenido de una lección.
    Soporta formato Titanium V2 (parts, questions) y Legacy.
    """
    
    # A. Construcción del Path
    target_file = LESSONS_DIR / f"{lesson_id}.json"
    
    # B. Seguridad: Path Traversal Check
    try:
        target_file = target_file.resolve()
        if LESSONS_DIR.resolve() not in target_file.parents:
            logger.critical(f"🚨 SEGURIDAD: Intento de Path Traversal -> {lesson_id}")
            raise HTTPException(status_code=403, detail="Acceso denegado.")
    except Exception:
        pass

    logger.info(f"📂 Cargando lección: {target_file.name}")

    # C. Verificación de Existencia
    if not target_file.exists() or not target_file.is_file():
        logger.warning(f"⚠️ Lección no encontrada: {lesson_id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lección '{lesson_id}' no encontrada."
        )

    # D. Lectura y Validación
    try:
        with open(target_file, "r", encoding="utf-8") as f:
            raw_data = json.load(f)
            
        # Validación Pydantic
        lesson = LessonContent(**raw_data)
        return lesson

    except json.JSONDecodeError as e:
        logger.error(f"❌ JSON Corrupto en {lesson_id}: {e}")
        raise HTTPException(status_code=500, detail="Archivo de datos corrupto.")
    except ValidationError as ve:
        logger.error(f"❌ Error de Schema en {lesson_id}: {ve}")
        # Mostramos el error detallado para depuración
        raise HTTPException(status_code=500, detail=f"Error de estructura de datos: {ve}")
    except Exception as e:
        logger.error(f"❌ Error I/O: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor.")