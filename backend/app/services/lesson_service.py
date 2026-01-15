# backend/app/services/lesson_service.py

import os
import re
from pathlib import Path
from app.db.models import LessonType

# 1. DEFINIR RUTAS EXACTAS (Ajusta según tu estructura real)
# Asumiendo que este archivo está en backend/app/services/
BASE_DIR = Path(__file__).resolve().parent.parent  # Sube a backend/app/
STANDARD_DIR = BASE_DIR / "data" / "lessons"
PRO_DIR = BASE_DIR / "datapro" / "lessonspro"
# OJO: En tu imagen 'voclessons' parece estar dentro de services o fuera. 
# Ajusta esta ruta si es necesario:
VOCAB_DIR = BASE_DIR / "voclessons" / "lessons" 

def natural_sort_key(s):
    """Ayuda a ordenar ['a1-1', 'a1-10', 'a1-2'] como [1, 2, 10]"""
    return [int(text) if text.isdigit() else text.lower()
            for text in re.split('([0-9]+)', s)]

def get_all_lessons(folder_path: Path):
    """Lee todos los .json de una carpeta y devuelve sus IDs ordenados"""
    if not folder_path.exists():
        return []
    
    files = [f.stem for f in folder_path.glob("*.json")] # .stem quita el .json
    return sorted(files, key=natural_sort_key)

# Caches para no leer el disco en cada petición
_COURSE_CACHE = {
    LessonType.STANDARD: get_all_lessons(STANDARD_DIR),
    LessonType.PRO: get_all_lessons(PRO_DIR),
    LessonType.VOCAB: get_all_lessons(VOCAB_DIR)
}

def get_lesson_type_by_id(lesson_id: str) -> LessonType:
    """
    Detecta el tipo de lección basado en tus nombres de archivo reales.
    """
    if lesson_id.startswith("pro-"):
        return LessonType.PRO
    elif "basics_mod_" in lesson_id or "_mod_" in lesson_id:
        return LessonType.VOCAB
    
    # Tus lecciones standard son 'a1-1', 'b1-2', etc. (no tienen prefijo especial)
    return LessonType.STANDARD

def get_next_lesson_id(current_lesson_id: str) -> str | None:
    """Busca la siguiente lección automáticamente"""
    lesson_type = get_lesson_type_by_id(current_lesson_id)
    lesson_list = _COURSE_CACHE.get(lesson_type, [])
    
    try:
        current_index = lesson_list.index(current_lesson_id)
        if current_index + 1 < len(lesson_list):
            return lesson_list[current_index + 1]
    except ValueError:
        # Si no encuentra el ID actual (ej: cambiaste el nombre del archivo)
        return None
    
    return None

def reload_lessons_cache():
    """Llamar si agregas archivos nuevos sin reiniciar el servidor"""
    global _COURSE_CACHE
    _COURSE_CACHE[LessonType.STANDARD] = get_all_lessons(STANDARD_DIR)
    _COURSE_CACHE[LessonType.PRO] = get_all_lessons(PRO_DIR)
    _COURSE_CACHE[LessonType.VOCAB] = get_all_lessons(VOCAB_DIR)