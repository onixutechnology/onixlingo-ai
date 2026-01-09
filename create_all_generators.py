import os

# --- CONFIGURACIÓN DEL MOLDE ---
# Este es el archivo que usaremos como base. DEBE EXISTIR.
SOURCE_TEMPLATE = "generate_lesson_a1_1_pro.py"

# Estos son los valores que buscaremos dentro del molde para reemplazarlos.
# Asegúrate de que estos textos existan exactos dentro de 'generate_lesson_a1_1_pro.py'
OLD_ID_MARKER = "pro-a1-1"
OLD_TITLE_MARKER = "The Networking Event"
OLD_DESC_MARKER = "Identity & To Be"  # O el texto que tengas en el 'topic' o prompt

# --- LISTA MAESTRA DE LECCIONES (Del 1 al 7 para A1, A2, B1) ---
ALL_LESSONS = [
    # === NIVEL A1 ===
    {"id": "pro-a1-1", "title": "The Networking Event", "desc": "Identity & To Be"},
    {"id": "pro-a1-2", "title": "Time Mastery", "desc": "Logistics & Schedules"},
    {"id": "pro-a1-3", "title": "Budget & Numbers", "desc": "Currency & Prices"},
    {"id": "pro-a1-4", "title": "Daily Routine", "desc": "Habits & Productivity"},
    {"id": "pro-a1-5", "title": "Office Navigation", "desc": "Locations & Directions"},
    {"id": "pro-a1-6", "title": "The Business Lunch", "desc": "Hospitality & Ordering"},
    {"id": "pro-a1-7", "title": "Business Trip", "desc": "Travel Logistics"},

    # === NIVEL A2 ===
    {"id": "pro-a2-1", "title": "Project Update", "desc": "Past Simple Reporting"},
    {"id": "pro-a2-2", "title": "Future Forecast", "desc": "Planning with Going To"},
    {"id": "pro-a2-3", "title": "Tech Support", "desc": "Troubleshooting basics"},
    {"id": "pro-a2-4", "title": "Client Call", "desc": "Phone Etiquette"},
    {"id": "pro-a2-5", "title": "Office Safety", "desc": "Modals & Rules"},
    {"id": "pro-a2-6", "title": "Inventory Check", "desc": "Countable vs Uncountable"},
    {"id": "pro-a2-7", "title": "Scheduling Conflicts", "desc": "Present Continuous"},

    # === NIVEL B1 ===
    {"id": "pro-b1-1", "title": "The Elevator Pitch", "desc": "Professional Intros"},
    {"id": "pro-b1-2", "title": "Crisis Management", "desc": "Formal Emailing"},
    {"id": "pro-b1-3", "title": "Negotiation Tactics", "desc": "First Conditional"},
    {"id": "pro-b1-4", "title": "Performance Review", "desc": "Giving Feedback"},
    {"id": "pro-b1-5", "title": "Market Trends", "desc": "Comparatives & Data"},
    {"id": "pro-b1-6", "title": "Leading a Meeting", "desc": "Phrasal Verbs"},
    {"id": "pro-b1-7", "title": "Strategic Planning", "desc": "Future Perfect"},
]

def main():
    # 1. Verificar que el molde existe
    if not os.path.exists(SOURCE_TEMPLATE):
        print(f"❌ ERROR CRÍTICO: No encuentro el archivo molde '{SOURCE_TEMPLATE}'.")
        print("   Por favor, asegúrate de estar en la carpeta correcta.")
        return

    # 2. Leer el contenido del molde
    with open(SOURCE_TEMPLATE, "r", encoding="utf-8") as f:
        template_content = f.read()

    print(f"✅ Molde '{SOURCE_TEMPLATE}' cargado correctamente.\n")

    created_count = 0
    skipped_count = 0

    # 3. Iterar y crear archivos
    for lesson in ALL_LESSONS:
        # Construir nombre del archivo: generate_lesson_a1_5_pro.py
        # Extraemos las partes del ID: pro-a1-5 -> a1_5
        parts = lesson["id"].split("-") # ['pro', 'a1', '5']
        level_code = parts[1] # a1
        lesson_num = parts[2] # 5
        
        filename = f"generate_lesson_{level_code}_{lesson_num}_pro.py"

        # VERIFICACIÓN DE EXISTENCIA
        if os.path.exists(filename):
            print(f"⚠️  Saltando: {filename} (Ya existe)")
            skipped_count += 1
            continue

        # Si no existe, creamos el contenido reemplazando datos
        new_content = template_content.replace(OLD_ID_MARKER, lesson["id"])
        new_content = new_content.replace(OLD_TITLE_MARKER, lesson["title"])
        new_content = new_content.replace(OLD_DESC_MARKER, lesson["desc"])

        # Escribir archivo
        try:
            with open(filename, "w", encoding="utf-8") as f:
                f.write(new_content)
            print(f"✨ Creado: {filename}")
            created_count += 1
        except Exception as e:
            print(f"❌ Error creando {filename}: {e}")

    print("\n" + "="*40)
    print(f"RESUMEN FINAL:")
    print(f"   Creados: {created_count}")
    print(f"   Omitidos: {skipped_count}")
    print("="*40)

if __name__ == "__main__":
    main()