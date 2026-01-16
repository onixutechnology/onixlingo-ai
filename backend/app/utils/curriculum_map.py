# backend/app/utils/curriculum_map.py

"""
ESTE ARCHIVO DEFINE LA SECUENCIA DE LECCIONES.
Cuando un usuario termina la lección "key", se desbloquea la lección "value".
"""

NEXT_LESSON_MAP = {}

# ==============================================================================
# 1. RUTA STANDARD (A1 -> A2 -> B1)
# Basado en tus archivos: a1-1.json hasta b1-7.json
# ==============================================================================

# --- Nivel A1 (1 al 7) ---
for i in range(1, 7):
    NEXT_LESSON_MAP[f"a1-{i}"] = f"a1-{i+1}"
NEXT_LESSON_MAP["a1-7"] = "a2-1"  # Puente de A1 a A2

# --- Nivel A2 (1 al 7) ---
for i in range(1, 7):
    NEXT_LESSON_MAP[f"a2-{i}"] = f"a2-{i+1}"
NEXT_LESSON_MAP["a2-7"] = "b1-1"  # Puente de A2 a B1

# --- Nivel B1 (1 al 7) ---
for i in range(1, 7):
    NEXT_LESSON_MAP[f"b1-{i}"] = f"b1-{i+1}"
# NEXT_LESSON_MAP["b1-7"] = "b2-1" # Descomentar si creas archivos b2-x.json


# ==============================================================================
# 2. RUTA PRO (Executive Foundation -> Mastery)
# Basado en tus archivos: pro-b1, pro-b2, pro-c1, pro-c2, pro-exec, pro-mastery
# Cada nivel tiene 10 lecciones (1 al 10)
# ==============================================================================

# --- Pro B1: Executive Foundation ---
for i in range(1, 10):
    NEXT_LESSON_MAP[f"pro-b1-{i}"] = f"pro-b1-{i+1}"
NEXT_LESSON_MAP["pro-b1-10"] = "pro-b2-1"  # Puente a Management

# --- Pro B2: Management Skills ---
for i in range(1, 10):
    NEXT_LESSON_MAP[f"pro-b2-{i}"] = f"pro-b2-{i+1}"
NEXT_LESSON_MAP["pro-b2-10"] = "pro-c1-1"  # Puente a Strategic

# --- Pro C1: Strategic Proficiency ---
for i in range(1, 10):
    NEXT_LESSON_MAP[f"pro-c1-{i}"] = f"pro-c1-{i+1}"
NEXT_LESSON_MAP["pro-c1-10"] = "pro-c2-1"  # Puente a Fluency

# --- Pro C2: Executive Fluency ---
for i in range(1, 10):
    NEXT_LESSON_MAP[f"pro-c2-{i}"] = f"pro-c2-{i+1}"
NEXT_LESSON_MAP["pro-c2-10"] = "pro-exec-1"  # Puente a Director/Exec

# --- Pro Exec: Boardroom Vision ---
for i in range(1, 10):
    NEXT_LESSON_MAP[f"pro-exec-{i}"] = f"pro-exec-{i+1}"
NEXT_LESSON_MAP["pro-exec-10"] = "pro-mastery-1"  # Puente a Titanium Mastery

# --- Pro Mastery: Titanium Specializations ---
for i in range(1, 10):
    NEXT_LESSON_MAP[f"pro-mastery-{i}"] = f"pro-mastery-{i+1}"
# Fin de la ruta actual (o puente a especializaciones específicas si existen)


# ==============================================================================
# 3. HELPER FUNCTION
# ==============================================================================

def get_next_lesson_id(current_id: str) -> str | None:
    """
    Devuelve el ID de la siguiente lección basado en la actual.
    Retorna None si no hay siguiente lección definida.
    """
    return NEXT_LESSON_MAP.get(current_id)