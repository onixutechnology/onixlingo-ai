import os
import json
import random

# CONFIGURACIÓN DE RUTA (Ajusta según tu estructura real)
BASE_DIR = "app/voclessons/lessons"

# ESTRUCTURA LÓGICA DE CONTENIDO (Temas Profesionales)
TOPICS = {
    "tech": [
        ("Database", "Base de datos"), ("Frontend", "Interfaz de usuario"), ("Backend", "Lógica del servidor"),
        ("Deploy", "Desplegar"), ("Debug", "Depurar"), ("Framework", "Entorno de trabajo"),
        ("Cloud", "Nube"), ("Server", "Servidor"), ("API", "Interfaz de programación"),
        ("Variable", "Variable"), ("Function", "Función"), ("Loop", "Bucle")
    ],
    "business": [
        ("Meeting", "Reunión"), ("Deadline", "Fecha límite"), ("Budget", "Presupuesto"),
        ("CEO", "Director General"), ("Profit", "Ganancia"), ("Loss", "Pérdida"),
        ("Deal", "Trato"), ("Partner", "Socio"), ("Contract", "Contrato"),
        ("Signature", "Firma"), ("Proposal", "Propuesta"), ("Invoice", "Factura")
    ],
    "marketing": [
        ("Brand", "Marca"), ("Target", "Objetivo"), ("Lead", "Cliente potencial"),
        ("Funnel", "Embudo"), ("Ad", "Anuncio"), ("Reach", "Alcance"),
        ("Click", "Clic"), ("Conversion", "Conversión"), ("Trend", "Tendencia"),
        ("Post", "Publicación"), ("User", "Usuario"), ("Content", "Contenido")
    ],
    "travel": [
        ("Flight", "Vuelo"), ("Ticket", "Boleto"), ("Hotel", "Hotel"),
        ("Passport", "Pasaporte"), ("Luggage", "Equipaje"), ("Gate", "Puerta de embarque"),
        ("Arrival", "Llegada"), ("Departure", "Salida"), ("Customs", "Aduanas"),
        ("Delay", "Retraso"), ("Seat", "Asiento"), ("Booking", "Reserva")
    ]
}

LEVELS = ["A1", "A2", "B1", "B2", "C1"]

def generate_lessons():
    if not os.path.exists(BASE_DIR):
        os.makedirs(BASE_DIR)
        print(f"Created directory: {BASE_DIR}")

    count = 0
    
    # Generar 10 lecciones por cada categoría (Total 40)
    for category, words in TOPICS.items():
        for i in range(1, 11): 
            count += 1
            
            # Selección aleatoria de pares para variar las lecciones
            selected_pairs = random.sample(words, k=min(8, len(words))) # 8 pares por lección
            
            lesson_id = f"{category}_mod_{i:02d}" # Ej: tech_mod_01
            title = f"{category.capitalize()} Essentials {i}"
            
            # Estructura del JSON
            lesson_data = {
                "id": lesson_id,
                "title": title,
                "description": f"Master key vocabulary for {category}. Module {i}.",
                "level": random.choice(LEVELS),
                "total_xp": 150,
                "stages": [
                    {
                        "id": f"drill_{lesson_id}",
                        "type": "pairing_drill",
                        "title": "Neuro Link Connection",
                        "description": "Connect the concepts rapidly.",
                        "pairs": [
                            {"id": f"p_{idx}", "en": en, "es": es} 
                            for idx, (en, es) in enumerate(selected_pairs)
                        ]
                    }
                ]
            }

            # Guardar archivo
            filename = f"{lesson_id}.json"
            filepath = os.path.join(BASE_DIR, filename)
            
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(lesson_data, f, indent=2, ensure_ascii=False)
            
            print(f"Generated: {filename}")

    print(f"\n✅ SUCCESS: {count} vocabulary lessons generated in '{BASE_DIR}'")

if __name__ == "__main__":
    generate_lessons()