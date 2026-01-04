import os
import time

scripts = [
    "generate_lesson_a1_1_pro.py",
    "generate_lesson_a1_2_pro.py",
    "generate_lesson_a1_3_pro.py",
    "generate_lesson_a1_4_pro.py",
    "generate_checkpoint_a1.py"
]

print("🚀 INICIANDO GENERACIÓN MASIVA DE CONTENIDO A1...")
print("-" * 50)

for script in scripts:
    print(f"🔄 Ejecutando {script}...")
    exit_code = os.system(f"python {script}")
    if exit_code == 0:
        print("✅ OK")
    else:
        print(f"❌ ERROR en {script}")

print("-" * 50)
print("✨ ¡TODO LISTO! Base de datos actualizada.")