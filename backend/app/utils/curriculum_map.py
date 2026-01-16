# backend/app/utils/curriculum_map.py

"""
ESTE ARCHIVO DEFINE LA SECUENCIA DE LECCIONES.
Cuando un usuario termina la lección "key", se desbloquea la lección "value".
"""

NEXT_LESSON_MAP = {}

# ==============================================================================
# 1. RUTA STANDARD (A1 -> A2 -> B1)
# ==============================================================================
for i in range(1, 7):
    NEXT_LESSON_MAP[f"a1-{i}"] = f"a1-{i+1}"
NEXT_LESSON_MAP["a1-7"] = "a2-1"

for i in range(1, 7):
    NEXT_LESSON_MAP[f"a2-{i}"] = f"a2-{i+1}"
NEXT_LESSON_MAP["a2-7"] = "b1-1"

for i in range(1, 7):
    NEXT_LESSON_MAP[f"b1-{i}"] = f"b1-{i+1}"

# ==============================================================================
# 2. RUTA PRO (Executive Foundation -> Mastery)
# ==============================================================================
# Pro B1 (10 lecciones)
for i in range(1, 10):
    NEXT_LESSON_MAP[f"pro-b1-{i}"] = f"pro-b1-{i+1}"
NEXT_LESSON_MAP["pro-b1-10"] = "pro-b2-1"

# Pro B2
for i in range(1, 10):
    NEXT_LESSON_MAP[f"pro-b2-{i}"] = f"pro-b2-{i+1}"
NEXT_LESSON_MAP["pro-b2-10"] = "pro-c1-1"

# Pro C1
for i in range(1, 10):
    NEXT_LESSON_MAP[f"pro-c1-{i}"] = f"pro-c1-{i+1}"
NEXT_LESSON_MAP["pro-c1-10"] = "pro-c2-1"

# Pro C2
for i in range(1, 10):
    NEXT_LESSON_MAP[f"pro-c2-{i}"] = f"pro-c2-{i+1}"
NEXT_LESSON_MAP["pro-c2-10"] = "pro-exec-1"

# Pro Exec
for i in range(1, 10):
    NEXT_LESSON_MAP[f"pro-exec-{i}"] = f"pro-exec-{i+1}"
NEXT_LESSON_MAP["pro-exec-10"] = "pro-mastery-1"

# Pro Mastery
for i in range(1, 10):
    NEXT_LESSON_MAP[f"pro-mastery-{i}"] = f"pro-mastery-{i+1}"

# ==============================================================================
# 3. RUTA VOCABULARY (Life, Business, Marketing, Tech, Travel)
# Estructura: category_mod_01 hasta category_mod_20
# Calculado según tu script generador: (5 niveles * 4 partes = 20 módulos)
# ==============================================================================
vocab_categories = ['basics', 'business', 'marketing', 'tech', 'travel']

for cat in vocab_categories:
    # Generamos del 1 al 19 para mapear al siguiente (el 20 es el final)
    for i in range(1, 20): 
        # Formato con ceros a la izquierda: basics_mod_01 -> basics_mod_02
        current_id = f"{cat}_mod_{str(i).zfill(2)}"
        next_id = f"{cat}_mod_{str(i+1).zfill(2)}"
        
        NEXT_LESSON_MAP[current_id] = next_id

# ==============================================================================
# 4. HELPER FUNCTION
# ==============================================================================
def get_next_lesson_id(current_id: str) -> str | None:
    """
    Devuelve el ID de la siguiente lección basado en la actual.
    Retorna None si no hay siguiente lección definida.
    """
    return NEXT_LESSON_MAP.get(current_id)