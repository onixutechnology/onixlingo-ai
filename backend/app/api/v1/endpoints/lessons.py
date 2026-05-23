import json
import logging
from pathlib import Path
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, HTTPException, status, Path as PathParam, Query, Depends
from pydantic import BaseModel

# 🔥 Importamos la validación base de usuario para saber quién está pidiendo la lección
from app.api.deps import get_current_active_user

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
    pairs: Optional[List[Dict[str, Any]]] = None      
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

# --- 3. ENDPOINT MULTILENGUAJE CON SEGURIDAD ---
@router.get("/{lesson_id}", response_model=LessonContent)
def get_lesson_content(
    lesson_id: str = PathParam(..., title="ID de la lección"),
    lang: str = Query("en", description="Idioma de la lección (en, fr, zh)"),
    # 🔥 Identificamos al usuario que hace la petición
    current_user = Depends(get_current_active_user)
):
    # 🚨 LÓGICA DE SEGURIDAD VIP 🚨
    user_tier = current_user.tier or "free"
    is_admin = getattr(current_user, "role", "student") == "admin"

    if not is_admin:
        if user_tier == "free":
            if not lesson_id.startswith("a-"):
                logger.warning(f"🔒 Acceso denegado a lección {lesson_id} para usuario Free: {current_user.username}")
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="El plan Free solo incluye acceso a lecciones del nivel A1. Sube a PRO o EXECUTIVE para desbloquear todos los niveles."
                )
        elif user_tier == "pro":
            if lesson_id.startswith("pro-"):
                logger.warning(f"🔒 Acceso denegado a lección Executive {lesson_id} para usuario Pro: {current_user.username}")
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Las lecciones de Modo Executive requieren el plan EXECUTIVE. Actualiza tu suscripción para acceder."
                )
        elif user_tier not in ["executive", "titanium"]:
            if lesson_id.startswith("pro-") and not current_user.is_pro:
                logger.warning(f"🔒 Intento de acceso bloqueado a la lección {lesson_id} por el usuario {current_user.username}")
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Esta lección premium requiere una suscripción OnixPro o Executive activa."
                )

    filename = f"{lesson_id}.json"
    
    # Si el idioma solicitado es 'en' (por defecto) pero la lección tiene prefijo 'fr-' o 'zh-',
    # deducimos el idioma correcto automáticamente.
    if lang == "en":
        if lesson_id.startswith("fr-"):
            lang = "fr"
        elif lesson_id.startswith("zh-"):
            lang = "zh"

    # Definimos las posibles rutas de búsqueda
    base_dir = PRO_DIR if lesson_id.startswith("pro-") else NORMAL_DIR
    
    target_file = base_dir / lang / filename
    fallback_en = base_dir / "en" / filename
    root_fallback = base_dir / filename

    logger.info(f"🔍 Buscando '{lesson_id}' en idioma '{lang}'")

    # Lógica de cascada: Idioma solicitado -> Inglés (en/) -> Raíz del directorio
    if target_file.exists():
        final_file = target_file
    elif lang != "en" and fallback_en.exists():
        logger.warning(f"⚠️ Lección {lesson_id} no está en {lang}. Cargando desde 'en/'.")
        final_file = fallback_en
    elif root_fallback.exists():
        logger.info(f"📂 Lección {lesson_id} encontrada en la raíz del directorio de contenido.")
        final_file = root_fallback
    else:
        logger.error(f"❌ Archivo {lesson_id} no encontrado en ninguna de las rutas intentadas.")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lección no encontrada en el servidor."
        )

    try:
        with open(final_file, "r", encoding="utf-8") as f:
            raw_data = json.load(f)
        return LessonContent(**raw_data)
    except Exception as e:
        logger.error(f"🔥 Error leyendo archivo: {e}")
        raise HTTPException(status_code=500, detail="Error interno al leer lección.")