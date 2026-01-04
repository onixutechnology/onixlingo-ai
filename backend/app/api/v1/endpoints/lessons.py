import json
import logging
from pathlib import Path
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, HTTPException, status, Path as PathParam

# Configuramos el logger específico para este módulo
logger = logging.getLogger("OnixLingo.ContentDelivery")

router = APIRouter()

# --- CONFIGURACIÓN DE RUTAS ROBUSTA ---
# Calculamos la ruta absoluta basada en la ubicación de ESTE archivo
# Esto evita errores si ejecutas el backend desde carpetas distintas.
BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent # Sube hasta 'backend'
LESSONS_DIR = BASE_DIR / "app" / "data" / "lessons"

# --- ESQUEMA DE VALIDACIÓN (PYDANTIC LITE) ---
# Aunque leemos JSON, validamos que tenga lo mínimo necesario antes de responder
# para evitar que el Frontend explote.

def validate_lesson_structure(data: dict, lesson_id: str):
    """
    Verifica que el JSON tenga los campos críticos para el Dashboard Titanium.
    """
    required_fields = ["id", "title", "stages"]
    for field in required_fields:
        if field not in data:
            logger.error(f"❌ JSON corrupto en {lesson_id}: Falta campo '{field}'")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Integridad de datos fallida: La lección no tiene '{field}'"
            )
    return True

@router.get("/{lesson_id}", response_model=Dict[str, Any])
async def get_lesson_content(
    lesson_id: str = PathParam(..., title="ID de la lección", min_length=3, pattern="^[a-zA-Z0-9_-]+$")
):
    """
    Recupera el contenido estático de una lección (JSON).
    
    - **Validación de Seguridad**: Evita Path Traversal (ej: ../../).
    - **Validación de Datos**: Asegura que el JSON sea válido.
    """
    
    # 1. Construcción Segura del Path
    target_file = LESSONS_DIR / f"{lesson_id}.json"
    
    # 2. Seguridad: Path Traversal Check
    # Nos aseguramos de que el archivo final esté realmente DENTRO de la carpeta lessons
    try:
        target_file = target_file.resolve()
        if LESSONS_DIR.resolve() not in target_file.parents:
            logger.warning(f"🚨 Intento de ataque Path Traversal detectado: {lesson_id}")
            raise HTTPException(status_code=403, detail="Acceso denegado a recursos del sistema.")
    except Exception:
        # Si falla resolve() porque el archivo no existe, lo manejamos abajo
        pass

    logger.info(f"📂 Solicitando recurso: {target_file.name}")

    # 3. Verificación de Existencia
    if not target_file.exists() or not target_file.is_file():
        logger.warning(f"⚠️ Lección no encontrada: {lesson_id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"El módulo de aprendizaje '{lesson_id}' no está disponible o no existe."
        )

    # 4. Lectura y Parsing Seguro
    try:
        with open(target_file, "r", encoding="utf-8") as f:
            lesson_data = json.load(f)
            
        # 5. Validación de Integridad
        validate_lesson_structure(lesson_data, lesson_id)
        
        logger.info(f"✅ Lección servida exitosamente: {lesson_id}")
        return lesson_data

    except json.JSONDecodeError as e:
        logger.error(f"❌ Error de sintaxis JSON en {lesson_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error crítico: El archivo de lección está corrupto (JSON inválido)."
        )
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"❌ Error inesperado leyendo lección: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del sistema de contenidos."
        )