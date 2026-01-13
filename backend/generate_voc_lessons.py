import os
import json
import random

# --- 1. CONFIGURACIÓN DE RUTA ---
# Basado en tu imagen, la ruta es esta:
OUTPUT_DIR = "app/voclessons/lessons"

# --- 2. CURRÍCULO COMPLETO Y REAL (A1 -> C1) ---
DATA_SOURCE = {
    # 🏢 NEGOCIOS (Business)
    "business": {
        "A1": [
            [("Job", "Trabajo"), ("Boss", "Jefe"), ("Office", "Oficina"), ("Team", "Equipo"), ("Desk", "Escritorio"), ("Call", "Llamada"), ("Pay", "Paga"), ("Work", "Trabajo")], 
            [("Money", "Dinero"), ("Meeting", "Reunión"), ("Email", "Correo"), ("Plan", "Plan"), ("Date", "Fecha"), ("Time", "Hora"), ("File", "Archivo"), ("Pen", "Bolígrafo")]
        ],
        "A2": [
            [("Salary", "Salario"), ("Client", "Cliente"), ("Staff", "Personal"), ("Break", "Descanso"), ("Bill", "Factura"), ("Cost", "Costo"), ("Sale", "Venta"), ("Tax", "Impuesto")],
            [("Schedule", "Horario"), ("Task", "Tarea"), ("Hire", "Contratar"), ("Deal", "Trato"), ("Offer", "Oferta"), ("Price", "Precio"), ("Sign", "Firmar"), ("Risk", "Riesgo")]
        ],
        "B1": [
            [("Budget", "Presupuesto"), ("Deadline", "Fecha límite"), ("Goal", "Meta"), ("Brand", "Marca"), ("Launch", "Lanzamiento"), ("Skill", "Habilidad"), ("Trend", "Tendencia"), ("Growth", "Crecimiento")],
            [("Profit", "Ganancia"), ("Loss", "Pérdida"), ("Debt", "Deuda"), ("Loan", "Préstamo"), ("Wage", "Sueldo"), ("Career", "Carrera"), ("Supply", "Suministro"), ("Demand", "Demanda")]
        ],
        "B2": [
            [("Forecast", "Pronóstico"), ("Shareholder", "Accionista"), ("Feedback", "Retroalimentación"), ("Outcome", "Resultado"), ("Quarter", "Trimestre"), ("Income", "Ingresos"), ("Expense", "Gasto"), ("Policy", "Política")],
            [("Revenue", "Ingresos brutos"), ("Strategy", "Estrategia"), ("Investor", "Inversor"), ("Partner", "Socio"), ("Contract", "Contrato"), ("Network", "Red de contactos"), ("Resign", "Renunciar"), ("Retire", "Jubilarse")]
        ],
        "C1": [
            [("Merger", "Fusión"), ("Acquisition", "Adquisición"), ("Liability", "Pasivo"), ("Assets", "Activos"), ("Turnover", "Rotación"), ("Stakeholder", "Parte interesada"), ("Dividend", "Dividendo"), ("Bankruptcy", "Bancarrota")],
            [("Overhead", "Gastos generales"), ("Benchmark", "Referencia"), ("Outsource", "Subcontratar"), ("Audit", "Auditoría"), ("Portfolio", "Cartera"), ("Equity", "Patrimonio"), ("Monopoly", "Monopolio"), ("Subsidiary", "Filial")]
        ]
    },

    # 💻 TECNOLOGÍA (Tech)
    "tech": {
        "A1": [
            [("Mouse", "Ratón"), ("Screen", "Pantalla"), ("User", "Usuario"), ("Web", "Red"), ("Key", "Tecla"), ("App", "App"), ("Code", "Código"), ("Click", "Clic")], 
            [("Phone", "Teléfono"), ("Laptop", "Portátil"), ("Data", "Datos"), ("File", "Archivo"), ("Save", "Guardar"), ("Load", "Cargar"), ("Game", "Juego"), ("Bot", "Bot")]
        ],
        "A2": [
            [("Folder", "Carpeta"), ("Link", "Enlace"), ("Login", "Acceso"), ("Wifi", "Wifi"), ("Icon", "Ícono"), ("Text", "Texto"), ("Chat", "Chat"), ("Video", "Video")], 
            [("Search", "Buscar"), ("Cloud", "Nube"), ("Error", "Error"), ("Email", "Email"), ("Post", "Publicar"), ("Share", "Compartir"), ("Like", "Me gusta"), ("View", "Vista")]
        ],
        "B1": [
            [("Database", "Base de datos"), ("Server", "Servidor"), ("Bug", "Error de código"), ("Update", "Actualizar"), ("Network", "Red"), ("Hardware", "Hardware"), ("Software", "Software"), ("Virus", "Virus")], 
            [("Browser", "Navegador"), ("Cookie", "Cookie"), ("Digital", "Digital"), ("Cyber", "Ciber"), ("Memory", "Memoria"), ("Driver", "Controlador"), ("Input", "Entrada"), ("Output", "Salida")]
        ],
        "B2": [
            [("Frontend", "Interfaz visual"), ("Backend", "Lógica servidor"), ("Deploy", "Desplegar"), ("Cache", "Caché"), ("Framework", "Marco de trabajo"), ("Debug", "Depurar"), ("Script", "Guion"), ("Source", "Fuente")], 
            [("Query", "Consulta"), ("Domain", "Dominio"), ("Hosting", "Alojamiento"), ("Plugin", "Complemento"), ("Widget", "Artilugio"), ("Layout", "Diseño"), ("Pixel", "Píxel"), ("Vector", "Vector")]
        ],
        "C1": [
            [("Latency", "Latencia"), ("Bandwidth", "Ancho de banda"), ("Encryption", "Cifrado"), ("Endpoint", "Punto final"), ("Algorithm", "Algoritmo"), ("Syntax", "Sintaxis"), ("Compile", "Compilar"), ("Runtime", "Tiempo de ejecución")], 
            [("Scalability", "Escalabilidad"), ("Middleware", "Intermediario"), ("Cluster", "Cúmulo"), ("Backdoor", "Puerta trasera"), ("Firewall", "Cortafuegos"), ("Protocol", "Protocolo"), ("Thread", "Hilo"), ("Kernel", "Núcleo")]
        ]
    },

    # 📈 MARKETING (Marketing)
    "marketing": {
        "A1": [
            [("Ad", "Anuncio"), ("Buy", "Comprar"), ("Sell", "Vender"), ("Shop", "Tienda"), ("Price", "Precio"), ("New", "Nuevo"), ("Good", "Bueno"), ("Bad", "Malo")],
            [("Brand", "Marca"), ("Logo", "Logotipo"), ("User", "Usuario"), ("Name", "Nombre"), ("Photo", "Foto"), ("Video", "Video"), ("Text", "Texto"), ("Call", "Llamar")]
        ],
        "A2": [
            [("Client", "Cliente"), ("Market", "Mercado"), ("Poster", "Cartel"), ("Sale", "Oferta"), ("Trend", "Moda"), ("Idea", "Idea"), ("Plan", "Plan"), ("Team", "Equipo")],
            [("Target", "Objetivo"), ("Social", "Social"), ("Media", "Medios"), ("Post", "Publicación"), ("Share", "Compartir"), ("Like", "Me gusta"), ("View", "Vista"), ("Fan", "Seguidor")]
        ],
        "B1": [
            [("Campaign", "Campaña"), ("Content", "Contenido"), ("Discount", "Descuento"), ("Event", "Evento"), ("Focus", "Enfoque"), ("Image", "Imagen"), ("Loyalty", "Lealtad"), ("Traffic", "Tráfico")],
            [("Launch", "Lanzamiento"), ("Budget", "Presupuesto"), ("Channel", "Canal"), ("Demand", "Demanda"), ("Impact", "Impacto"), ("Public", "Público"), ("Survey", "Encuesta"), ("Value", "Valor")]
        ],
        "B2": [
            [("Conversion", "Conversión"), ("Funnel", "Embudo"), ("Lead", "Cliente potencial"), ("Metric", "Métrica"), ("Niche", "Nicho"), ("Reach", "Alcance"), ("Sponsor", "Patrocinador"), ("Viral", "Viral")],
            [("Analysis", "Análisis"), ("Audience", "Audiencia"), ("Benefit", "Beneficio"), ("Growth", "Crecimiento"), ("Insight", "Perspectiva"), ("Keyword", "Palabra clave"), ("Ranking", "Clasificación"), ("Segment", "Segmento")]
        ],
        "C1": [
            [("Analytics", "Analítica"), ("Demographics", "Demografía"), ("Engagement", "Compromiso"), ("Influencer", "Influenciador"), ("Optimization", "Optimización"), ("Positioning", "Posicionamiento"), ("Retention", "Retención"), ("Sentiment", "Sentimiento")],
            [("Algorithm", "Algoritmo"), ("Attribution", "Atribución"), ("Copyright", "Derechos de autor"), ("Franchise", "Franquicia"), ("Merchandise", "Mercancía"), ("Newsletter", "Boletín"), ("Projection", "Proyección"), ("Testimonial", "Testimonio")]
        ]
    },

    # 🍎 ESENCIALES (Life Essentials - BÁSICO)
    "basics": {
        "A1": [
            # Frutas y Comida Básica
            [("Apple", "Manzana"), ("Banana", "Plátano"), ("Orange", "Naranja"), ("Water", "Agua"), ("Milk", "Leche"), ("Bread", "Pan"), ("Egg", "Huevo"), ("Fish", "Pescado")],
            # Familia y Personas
            [("Family", "Familia"), ("Mother", "Madre"), ("Father", "Padre"), ("Sister", "Hermana"), ("Brother", "Hermano"), ("Friend", "Amigo"), ("Boy", "Niño"), ("Girl", "Niña")]
        ],
        "A2": [
            # Transportes y Vehículos
            [("Car", "Coche"), ("Bus", "Autobús"), ("Train", "Tren"), ("Bike", "Bici"), ("Road", "Carretera"), ("Wheel", "Rueda"), ("Door", "Puerta"), ("Key", "Llave")],
            # Ropa y Colores
            [("Shirt", "Camisa"), ("Shoe", "Zapato"), ("Pants", "Pantalones"), ("Hat", "Sombrero"), ("Red", "Rojo"), ("Blue", "Azul"), ("Green", "Verde"), ("Black", "Negro")]
        ],
        "B1": [
            # Verbos de Acción
            [("Run", "Correr"), ("Jump", "Saltar"), ("Swim", "Nadar"), ("Walk", "Caminar"), ("Eat", "Comer"), ("Sleep", "Dormir"), ("Read", "Leer"), ("Write", "Escribir")],
            # Partes del Cuerpo y Salud
            [("Head", "Cabeza"), ("Hand", "Mano"), ("Leg", "Pierna"), ("Eye", "Ojo"), ("Face", "Cara"), ("Heart", "Corazón"), ("Sick", "Enfermo"), ("Health", "Salud")]
        ],
        "B2": [
            # Casa y Muebles
            [("Furniture", "Muebles"), ("Curtain", "Cortina"), ("Shelf", "Estante"), ("Carpet", "Alfombra"), ("Kitchen", "Cocina"), ("Bedroom", "Dormitorio"), ("Mirror", "Espejo"), ("Lamp", "Lámpara")],
            # Naturaleza y Clima
            [("Weather", "Clima"), ("Rain", "Lluvia"), ("Sun", "Sol"), ("Snow", "Nieve"), ("Tree", "Árbol"), ("Flower", "Flor"), ("River", "Río"), ("Mountain", "Montaña")]
        ],
        "C1": [
            # Emociones y Abstractos
            [("Freedom", "Libertad"), ("Wisdom", "Sabiduría"), ("Justice", "Justicia"), ("Courage", "Coraje"), ("Honesty", "Honestidad"), ("Beauty", "Belleza"), ("Truth", "Verdad"), ("Peace", "Paz")],
            # Sociedad
            [("Citizen", "Ciudadano"), ("Culture", "Cultura"), ("History", "Historia"), ("Law", "Ley"), ("Politics", "Política"), ("Religion", "Religión"), ("Tradition", "Tradición"), ("Economy", "Economía")]
        ]
    }
}

def generate():
    # Crear directorio si no existe
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        print(f"📁 Directorio creado: {OUTPUT_DIR}")

    count = 0
    
    # Recorrer categorías
    for category, levels in DATA_SOURCE.items():
        levels_keys = ["A1", "A2", "B1", "B2", "C1"]
        
        # Recorrer niveles
        for idx_level, level_key in enumerate(levels_keys):
            if level_key not in levels:
                continue
                
            parts = levels[level_key]
            
            # Recorrer las 2 partes de cada nivel
            for i, pairs_list in enumerate(parts):
                part_num = i + 1
                
                # --- CÁLCULO MATEMÁTICO DEL MÓDULO (Para coincidir con Frontend) ---
                # A1 (index 0) -> part 1 -> modulo 1
                # A1 (index 0) -> part 2 -> modulo 2
                # A2 (index 1) -> part 1 -> modulo 3
                # ...
                module_num = (idx_level * 2) + part_num
                module_str = f"{module_num:02d}" # "01", "02", "10"
                
                # ID EXACTO: category_mod_01.json
                file_id = f"{category}_mod_{module_str}"
                
                # Título personalizado según categoría
                display_title = f"{category.capitalize()} Mastery {level_key}-{part_num}"
                if category == "basics":
                    titles = {
                        "A1": "Food & Family",
                        "A2": "Transport & Clothes",
                        "B1": "Action & Body",
                        "B2": "Home & Nature",
                        "C1": "Abstract Concepts"
                    }
                    display_title = f"{titles.get(level_key, 'Basics')} (Part {part_num})"

                # Estructura del JSON
                lesson_content = {
                    "id": file_id,
                    "title": display_title,
                    "description": f"Vocabulary builder for {category}. Level {level_key}, Part {part_num}.",
                    "level": level_key,
                    "total_xp": 150 + (idx_level * 50), # Más XP para niveles altos
                    "stages": [
                        {
                            "id": f"drill_{file_id}",
                            "type": "pairing_drill",
                            "title": f"Neuro Link: {display_title}",
                            "description": "Connect the words to their meanings.",
                            "pairs": [{"id": f"p_{idx}", "en": p[0], "es": p[1]} for idx, p in enumerate(pairs_list)]
                        }
                    ]
                }

                # Escribir archivo
                file_path = os.path.join(OUTPUT_DIR, f"{file_id}.json")
                with open(file_path, "w", encoding="utf-8") as f:
                    json.dump(lesson_content, f, indent=2, ensure_ascii=False)
                
                count += 1
                print(f"✅ Created: {file_id}.json")

    print(f"\n✨ SUCCESS: {count} vocabulary lessons generated in '{OUTPUT_DIR}'.")

if __name__ == "__main__":
    generate()