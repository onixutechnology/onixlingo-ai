import re
from pathlib import Path
from app.db.models import LessonType

# 1. CONFIGURACIÓN DE RUTAS EXACTAS
# __file__ = backend/app/services/lesson_service.py
# .parent = backend/app/services
# .parent.parent = backend/app
BASE_DIR = Path(__file__).resolve().parent.parent 

# 🔥 RUTAS ACTUALIZADAS: Ahora STANDARD_DIR apunta a tus 70 lecciones de ajedrez
STANDARD_DIR = BASE_DIR / "datachess" / "lessons" 
PRO_DIR = BASE_DIR / "datapro" / "lessonspro" 
VOCAB_DIR = BASE_DIR / "voclessons" / "lessons" 

def natural_sort_key(s):
    return [int(text) if text.isdigit() else text.lower()
            for text in re.split('([0-9]+)', s)]

def get_all_lessons(folder_path: Path):
    if not folder_path.exists():
        print(f"⚠️ ALERTA: No se encontró la carpeta {folder_path}")
        return []
    # Lee solo archivos .json
    files = [f.stem for f in folder_path.glob("*.json")]
    return sorted(files, key=natural_sort_key)

# Cargar lecciones en memoria al iniciar
_COURSE_CACHE = {
    LessonType.STANDARD: get_all_lessons(STANDARD_DIR),
    LessonType.PRO: get_all_lessons(PRO_DIR),
    LessonType.VOCAB: get_all_lessons(VOCAB_DIR)
}

def get_lesson_type_by_id(lesson_id: str) -> LessonType:
    # Lógica para saber en qué lista buscar
    if lesson_id.startswith("pro-"):
        return LessonType.PRO
    elif "basics_mod_" in lesson_id or "_mod_" in lesson_id:
        return LessonType.VOCAB
    return LessonType.STANDARD

def get_next_lesson_id(current_lesson_id: str) -> str | None:
    """Retorna el ID de la siguiente lección o None si es la última"""
    lesson_type = get_lesson_type_by_id(current_lesson_id)
    lesson_list = _COURSE_CACHE.get(lesson_type, [])
    
    try:
        current_index = lesson_list.index(current_lesson_id)
        if current_index + 1 < len(lesson_list):
            return lesson_list[current_index + 1]
    except ValueError:
        return None
    return None

# --- SYSTEM CHECK (Verás esto en la consola al iniciar tu backend) ---
print("--- 🚀 ONIXLINGO LESSON LOADER (TITANIUM) ---")
print(f"♟️  Chess Lessons ({len(_COURSE_CACHE[LessonType.STANDARD])}): {STANDARD_DIR}")
print(f"⭐  Pro Lessons   ({len(_COURSE_CACHE[LessonType.PRO])}): {PRO_DIR}")
print(f"📖  Vocab Lessons ({len(_COURSE_CACHE[LessonType.VOCAB])}): {VOCAB_DIR}")
print("-----------------------------------------------")
