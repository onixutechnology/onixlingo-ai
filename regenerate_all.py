import os
import time
import sys

# ==========================================
# CONFIGURACIÓN: LISTA DE SCRIPTS
# ==========================================

# 1. Generamos dinámicamente los nombres del 1 al 7 para cada nivel
# Esto evita escribir 21 líneas de código a mano.
a1_scripts = [f"generate_lesson_a1_{i}_pro.py" for i in range(1, 8)]
a2_scripts = [f"generate_lesson_a2_{i}_pro.py" for i in range(1, 8)]
b1_scripts = [f"generate_lesson_b1_{i}_pro.py" for i in range(1, 8)]

# 2. Agregamos los scripts de certificación (basado en tu captura de pantalla)
toeic_scripts = [
    "toeic-1L.py", 
    "toeic-2R.py", 
    "toeic-3W.py", 
    "toeic-4S.py"
]

# 3. Scripts de utilidades o checkpoints (si los tienes)
utils_scripts = [
    # "generate_checkpoint_a1.py" # Descomenta si lo tienes
]

# Unimos todo en un diccionario para procesarlo por grupos
all_groups = {
    "🟢 NIVEL A1 (Foundations)": a1_scripts,
    "🔵 NIVEL A2 (Operations) ": a2_scripts,
    "🟠 NIVEL B1 (Management) ": b1_scripts,
    "🟣 CERTIFICACIÓN TOEIC   ": toeic_scripts,
    "⚙️  UTILIDADES            ": utils_scripts
}

# ==========================================
# MOTOR DE EJECUCIÓN
# ==========================================
def main():
    start_time = time.time()
    success_count = 0
    fail_count = 0
    missing_count = 0

    print("\n" + "="*60)
    print("🚀 INICIANDO REGENERACIÓN MASIVA DE ONIXLINGO LMS")
    print("="*60 + "\n")

    for group_name, scripts in all_groups.items():
        if not scripts: continue # Saltar grupos vacíos
        
        print(f"--- {group_name} ---")
        
        for script in scripts:
            # 1. Verificar si el archivo existe
            if not os.path.exists(script):
                print(f"   ⚠️  Saltando: {script} (No encontrado)")
                missing_count += 1
                continue
            
            # 2. Ejecutar el script
            print(f"   🔄 Ejecutando {script}...", end=" ", flush=True)
            
            try:
                # Usamos os.system. Si devuelve 0, es éxito.
                exit_code = os.system(f"python {script}")
                
                if exit_code == 0:
                    print("✅ OK")
                    success_count += 1
                else:
                    print("❌ ERROR DE EJECUCIÓN")
                    fail_count += 1
            except Exception as e:
                print(f"❌ EXCEPCIÓN: {e}")
                fail_count += 1
        
        print("") # Espacio entre grupos

    # ==========================================
    # RESUMEN FINAL
    # ==========================================
    total_time = round(time.time() - start_time, 2)
    
    print("="*60)
    print("📊 RESUMEN DE OPERACIÓN")
    print(f"⏱️  Tiempo Total: {total_time} segundos")
    print(f"✅ Generados:    {success_count}")
    print(f"❌ Fallidos:     {fail_count}")
    print(f"⚠️  No existen:   {missing_count}")
    print("="*60)
    
    if fail_count == 0:
        print("\n✨ ¡TODO LISTO! Tu base de datos JSON está sincronizada al 100%.")
    else:
        print("\n⚠️  Hubo errores. Revisa la consola arriba.")

if __name__ == "__main__":
    main()