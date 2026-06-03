import re
from pathlib import Path
from app.db.models import LessonType

# 1. CONFIGURACIÓN DE RUTAS EXACTAS
BASE_DIR = Path(__file__).resolve().parent.parent 

STANDARD_DIR = BASE_DIR / "data" / "lessons" 
PRO_DIR = BASE_DIR / "datapro" / "lessonspro" 
VOCAB_DIR = BASE_DIR / "voclessons" / "lessons" 

LEVEL_ORDERS = {
    "en": ["a1", "a2", "b1", "b2", "c1", "c2", "toeic"],
    "fr": ["a1", "a2", "b1", "b2", "c1", "c2", "tfi", "m1", "m2", "pro"],
    "zh": ["a", "b", "c"]
}

def lesson_sort_key(lid: str):
    parts = lid.lower().split("-")
    if len(parts) == 3:  # Caso fr-a1-1 o zh-a-1
        lang = parts[0]
        lvl = parts[1]
        try:
            num = int(parts[2])
        except ValueError:
            num = 9999
        lvl_list = LEVEL_ORDERS.get(lang, [])
        try:
            lvl_idx = lvl_list.index(lvl)
        except ValueError:
            lvl_idx = 999
        return (lang, lvl_idx, num)
    elif len(parts) == 2:  # Caso en (e.g. a1-1, toeic-10) o pro-exec-1
        if parts[0] == "pro":
            # Para lecciones PRO, mantenemos la estructura
            try:
                num = int(parts[1])
            except ValueError:
                num = 9999
            return ("pro", 0, num)
        lang = "en"
        lvl = parts[0]
        try:
            num = int(parts[1])
        except ValueError:
            num = 9999
        lvl_list = LEVEL_ORDERS.get(lang, [])
        try:
            lvl_idx = lvl_list.index(lvl)
        except ValueError:
            lvl_idx = 999
        return (lang, lvl_idx, num)
    else:
        return ("other", 0, lid)

def natural_sort_key(s):
    return [int(text) if text.isdigit() else text.lower()
            for text in re.split('([0-9]+)', s)]

def get_all_lessons(folder_path: Path):
    if not folder_path.exists():
        print(f"⚠️ ALERTA: No se encontró la carpeta {folder_path}")
        return []
    files = [f.stem for f in folder_path.rglob("*.json")]
    return sorted(list(set(files)), key=natural_sort_key)

# Generate dynamic lesson IDs
dynamic_standard_lessons = []
levels = ["a1", "a2", "b1", "b2", "c1", "c2", "toeic"]
for level in levels:
    limit = 201 if level in ["a1", "a2", "b1", "b2", "c1", "c2", "toeic"] else 101
    for idx in range(1, limit):
        dynamic_standard_lessons.append(f"{level}-{idx}")

# Generate dynamic PRO lesson IDs (30 blocks × 100 lessons = 3000)
dynamic_pro_lessons = []
PRO_BLOCK_IDS = [
    'exec-b1', 'exec-b2', 'exec-c1', 'exec-c2', 'exec-exec', 'exec-mastery',
    'exec-crisis', 'exec-ma', 'exec-vc', 'exec-fintech', 'exec-pr', 'exec-rhetoric',
    'exec-esg', 'exec-ai', 'exec-logistics', 'exec-negotiation', 'exec-compliance', 'exec-media',
    'exec-finance', 'exec-sourcing', 'exec-shareholders', 'exec-launch', 'exec-investors', 'exec-transformation',
    'exec-hr', 'exec-legal', 'exec-risk', 'exec-ipo', 'exec-macro', 'exec-thesis'
]
for block in PRO_BLOCK_IDS:
    for idx in range(1, 101):
        dynamic_pro_lessons.append(f"pro-{block}-{idx}")

def pro_sort_key(lid: str):
    parts = lid.lower().split("-")
    if len(parts) >= 3:
        try:
            num = int(parts[-1])
        except ValueError:
            num = 9999
        block_id = "-".join(parts[1:-1])
        try:
            block_idx = PRO_BLOCK_IDS.index(block_id)
        except ValueError:
            block_idx = 999
        return (block_idx, num)
    return (999, 999)

# Cargar lecciones en memoria al iniciar (Optimizacion extrema para evitar crasheo por timeout en uvicorn)
_COURSE_CACHE = {
    LessonType.STANDARD: dynamic_standard_lessons,
    LessonType.PRO: dynamic_pro_lessons,
    LessonType.VOCAB: get_all_lessons(VOCAB_DIR)
}

# Sort list using custom curriculum keys
_COURSE_CACHE[LessonType.STANDARD] = sorted(list(set(_COURSE_CACHE[LessonType.STANDARD])), key=lesson_sort_key)
_COURSE_CACHE[LessonType.PRO] = sorted(list(set(_COURSE_CACHE[LessonType.PRO])), key=pro_sort_key)

def get_lesson_type_by_id(lesson_id: str) -> LessonType:
    if lesson_id.startswith("pro-"):
        return LessonType.PRO
    elif "basics_mod_" in lesson_id or "_mod_" in lesson_id:
        return LessonType.VOCAB
    return LessonType.STANDARD

def get_next_lesson_id(current_lesson_id: str) -> str | None:
    """Retorna el ID de la siguiente lección o None si es la última"""
    lesson_type = get_lesson_type_by_id(current_lesson_id)
    lesson_list = _COURSE_CACHE.get(lesson_type, [])
    
    # FILTRO INTELIGENTE: Asegurar que la siguiente lección pertenezca al mismo currículo (en, fr, zh)
    prefix = ""
    if "-" in current_lesson_id:
        parts = current_lesson_id.split("-")
        if len(parts) > 2: # Caso fr-a1-1 o zh-a1-1
            prefix = parts[0] + "-"
    
    filtered_list = [lid for lid in lesson_list if lid.startswith(prefix)] if prefix else [lid for lid in lesson_list if not any(lid.startswith(p) for p in ["fr-", "zh-"])]

    try:
        current_index = filtered_list.index(current_lesson_id)
        if current_index + 1 < len(filtered_list):
            return filtered_list[current_index + 1]
    except ValueError:
        return None
    return None

# --- SYSTEM CHECK ---
print("--- ONIXLINGO LESSON LOADER (TITANIUM) ---")
print(f"[-] Standard & Dynamic Lessons ({len(_COURSE_CACHE[LessonType.STANDARD])}): {STANDARD_DIR}")
print(f"[-] Pro Lessons   ({len(_COURSE_CACHE[LessonType.PRO])}): {PRO_DIR}")
print(f"[-] Vocab Lessons ({len(_COURSE_CACHE[LessonType.VOCAB])}): {VOCAB_DIR}")
print("-----------------------------------------------")

