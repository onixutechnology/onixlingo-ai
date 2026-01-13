import os
import json
import random

# --- CONFIGURACIÓN ---
OUTPUT_DIR = "app/voclessons/lessons"

# --- BANCO DE DATOS MASIVO (4 PARTES POR NIVEL) ---
# Estructura: Categoría -> Nivel -> Lista de 4 listas (Partes 1, 2, 3, 4)
DATA_SOURCE = {
    "business": {
        "A1": [
            [("Job", "Trabajo"), ("Boss", "Jefe"), ("Office", "Oficina"), ("Team", "Equipo"), ("Desk", "Escritorio"), ("Call", "Llamada")],
            [("Money", "Dinero"), ("Pay", "Paga"), ("Work", "Trabajo"), ("Plan", "Plan"), ("Date", "Cita"), ("Note", "Nota")],
            [("Staff", "Personal"), ("File", "Archivo"), ("Pen", "Bolígrafo"), ("Room", "Sala"), ("Chair", "Silla"), ("Break", "Descanso")],
            [("Busy", "Ocupado"), ("Late", "Tarde"), ("Early", "Temprano"), ("Open", "Abierto"), ("Close", "Cerrado"), ("Sell", "Vender")]
        ],
        "A2": [
            [("Salary", "Salario"), ("Client", "Cliente"), ("Meeting", "Reunión"), ("Bill", "Factura"), ("Cost", "Costo"), ("Sale", "Venta")],
            [("Task", "Tarea"), ("Hire", "Contratar"), ("Deal", "Trato"), ("Offer", "Oferta"), ("Price", "Precio"), ("Sign", "Firmar")],
            [("Manager", "Gerente"), ("Worker", "Obrero"), ("Resume", "Currículum"), ("Skill", "Habilidad"), ("Tax", "Impuesto"), ("Cash", "Efectivo")],
            [("Order", "Pedido"), ("Product", "Producto"), ("Service", "Servicio"), ("Refund", "Reembolso"), ("Cheap", "Barato"), ("Bonus", "Bono")]
        ],
        "B1": [
            [("Budget", "Presupuesto"), ("Deadline", "Fecha límite"), ("Goal", "Meta"), ("Brand", "Marca"), ("Launch", "Lanzamiento"), ("Risk", "Riesgo")],
            [("Profit", "Ganancia"), ("Loss", "Pérdida"), ("Debt", "Deuda"), ("Loan", "Préstamo"), ("Wage", "Sueldo"), ("Career", "Carrera")],
            [("Supply", "Suministro"), ("Demand", "Demanda"), ("Retail", "Minorista"), ("Whole", "Mayorista"), ("Strike", "Huelga"), ("Union", "Sindicato")],
            [("Trend", "Tendencia"), ("Growth", "Crecimiento"), ("Share", "Acción"), ("Trade", "Comercio"), ("Import", "Importar"), ("Export", "Exportar")]
        ],
        "B2": [
            [("Forecast", "Pronóstico"), ("Shareholder", "Accionista"), ("Feedback", "Retroalimentación"), ("Outcome", "Resultado"), ("Quarter", "Trimestre"), ("Income", "Ingresos")],
            [("Revenue", "Ingresos brutos"), ("Strategy", "Estrategia"), ("Investor", "Inversor"), ("Partner", "Socio"), ("Contract", "Contrato"), ("Network", "Red")],
            [("Resign", "Renunciar"), ("Retire", "Jubilarse"), ("Vacancy", "Vacante"), ("Promotion", "Ascenso"), ("Dismiss", "Despedir"), ("Recruit", "Reclutar")],
            [("Expense", "Gasto"), ("Policy", "Política"), ("Agenda", "Agenda"), ("Minutes", "Actas"), ("Proposal", "Propuesta"), ("Quote", "Cotización")]
        ],
        "C1": [
            [("Merger", "Fusión"), ("Acquisition", "Adquisición"), ("Liability", "Pasivo"), ("Assets", "Activos"), ("Turnover", "Rotación"), ("Stakeholder", "Interesado")],
            [("Overhead", "Gastos generales"), ("Benchmark", "Referencia"), ("Outsource", "Subcontratar"), ("Audit", "Auditoría"), ("Portfolio", "Cartera"), ("Equity", "Patrimonio")],
            [("Monopoly", "Monopolio"), ("Subsidiary", "Filial"), ("Lucrative", "Lucrativo"), ("Insolvent", "Insolvente"), ("Commodity", "Materia prima"), ("Fluctuate", "Fluctuar")],
            [("Dividend", "Dividendo"), ("Bankruptcy", "Bancarrota"), ("Fiscal", "Fiscal"), ("Deficit", "Déficit"), ("Embargo", "Embargo"), ("Tycoon", "Magnate")]
        ]
    },
    "tech": {
        "A1": [
            [("Mouse", "Ratón"), ("Screen", "Pantalla"), ("User", "Usuario"), ("Web", "Red"), ("Key", "Tecla"), ("App", "App")],
            [("Phone", "Teléfono"), ("Laptop", "Portátil"), ("Data", "Datos"), ("File", "Archivo"), ("Save", "Guardar"), ("Load", "Cargar")],
            [("Game", "Juego"), ("Bot", "Bot"), ("Chat", "Chat"), ("Text", "Texto"), ("Wifi", "Wifi"), ("Icon", "Ícono")],
            [("Click", "Clic"), ("Type", "Escribir"), ("Copy", "Copiar"), ("Paste", "Pegar"), ("Cut", "Cortar"), ("Print", "Imprimir")]
        ],
        "A2": [
            [("Folder", "Carpeta"), ("Link", "Enlace"), ("Login", "Acceso"), ("Email", "Email"), ("Post", "Publicar"), ("Share", "Compartir")],
            [("Search", "Buscar"), ("Cloud", "Nube"), ("Error", "Error"), ("Video", "Video"), ("Audio", "Audio"), ("Image", "Imagen")],
            [("Device", "Dispositivo"), ("Tablet", "Tableta"), ("Cable", "Cable"), ("Power", "Energía"), ("Battery", "Batería"), ("Charge", "Cargar")],
            [("Online", "En línea"), ("Offline", "Desconectado"), ("Site", "Sitio"), ("Page", "Página"), ("Block", "Bloquear"), ("Trash", "Basura")]
        ],
        "B1": [
            [("Database", "Base de datos"), ("Server", "Servidor"), ("Bug", "Error código"), ("Update", "Actualizar"), ("Network", "Red"), ("Hardware", "Hardware")],
            [("Software", "Software"), ("Virus", "Virus"), ("Browser", "Navegador"), ("Cookie", "Cookie"), ("Digital", "Digital"), ("Cyber", "Ciber")],
            [("Memory", "Memoria"), ("Driver", "Controlador"), ("Input", "Entrada"), ("Output", "Salida"), ("Install", "Instalar"), ("Delete", "Borrar")],
            [("Upload", "Subir"), ("Download", "Bajar"), ("Stream", "Transmitir"), ("Signal", "Señal"), ("Router", "Enrutador"), ("Access", "Acceso")]
        ],
        "B2": [
            [("Frontend", "Interfaz visual"), ("Backend", "Lógica servidor"), ("Deploy", "Desplegar"), ("Cache", "Caché"), ("Framework", "Marco"), ("Debug", "Depurar")],
            [("Script", "Guion"), ("Source", "Fuente"), ("Query", "Consulta"), ("Domain", "Dominio"), ("Hosting", "Alojamiento"), ("Plugin", "Complemento")],
            [("Widget", "Artilugio"), ("Layout", "Diseño"), ("Pixel", "Píxel"), ("Vector", "Vector"), ("Layers", "Capas"), ("Responsive", "Adaptable")],
            [("Loop", "Bucle"), ("Array", "Matriz"), ("String", "Cadena"), ("Float", "Flotante"), ("Integer", "Entero"), ("Boolean", "Booleano")]
        ],
        "C1": [
            [("Latency", "Latencia"), ("Bandwidth", "Ancho de banda"), ("Encryption", "Cifrado"), ("Endpoint", "Punto final"), ("Algorithm", "Algoritmo"), ("Syntax", "Sintaxis")],
            [("Compile", "Compilar"), ("Runtime", "Ejecución"), ("Scalability", "Escalabilidad"), ("Middleware", "Intermediario"), ("Cluster", "Cúmulo"), ("Backdoor", "Puerta trasera")],
            [("Firewall", "Cortafuegos"), ("Protocol", "Protocolo"), ("Thread", "Hilo"), ("Kernel", "Núcleo"), ("Repository", "Repositorio"), ("Commit", "Confirmación")],
            [("Branch", "Rama"), ("Merge", "Fusionar"), ("Pull", "Extraer"), ("Push", "Empujar"), ("Clone", "Clonar"), ("Fork", "Bifurcar")]
        ]
    },
    "marketing": {
        "A1": [
            [("Ad", "Anuncio"), ("Buy", "Comprar"), ("Sell", "Vender"), ("Shop", "Tienda"), ("Price", "Precio"), ("New", "Nuevo")],
            [("Good", "Bueno"), ("Bad", "Malo"), ("Brand", "Marca"), ("Logo", "Logo"), ("User", "Usuario"), ("Name", "Nombre")],
            [("Photo", "Foto"), ("Video", "Video"), ("Text", "Texto"), ("Call", "Llamar"), ("Ask", "Pedir"), ("See", "Ver")],
            [("Like", "Me gusta"), ("Fan", "Fan"), ("Star", "Estrella"), ("Top", "Top"), ("Hot", "Popular"), ("Win", "Ganar")]
        ],
        "A2": [
            [("Client", "Cliente"), ("Market", "Mercado"), ("Poster", "Cartel"), ("Sale", "Oferta"), ("Trend", "Moda"), ("Idea", "Idea")],
            [("Plan", "Plan"), ("Team", "Equipo"), ("Target", "Objetivo"), ("Social", "Social"), ("Media", "Medios"), ("Post", "Post")],
            [("Share", "Compartir"), ("View", "Vista"), ("Follow", "Seguir"), ("Group", "Grupo"), ("Blog", "Blog"), ("Link", "Enlace")],
            [("News", "Noticias"), ("Story", "Historia"), ("Review", "Reseña"), ("Rate", "Calificar"), ("Search", "Buscar"), ("List", "Lista")]
        ],
        "B1": [
            [("Campaign", "Campaña"), ("Content", "Contenido"), ("Discount", "Descuento"), ("Event", "Evento"), ("Focus", "Enfoque"), ("Image", "Imagen")],
            [("Loyalty", "Lealtad"), ("Traffic", "Tráfico"), ("Launch", "Lanzamiento"), ("Budget", "Presupuesto"), ("Channel", "Canal"), ("Demand", "Demanda")],
            [("Impact", "Impacto"), ("Public", "Público"), ("Survey", "Encuesta"), ("Value", "Valor"), ("Sample", "Muestra"), ("Demo", "Demo")],
            [("Status", "Estado"), ("Update", "Actualizar"), ("Profile", "Perfil"), ("Member", "Miembro"), ("Access", "Acceso"), ("Direct", "Directo")]
        ],
        "B2": [
            [("Conversion", "Conversión"), ("Funnel", "Embudo"), ("Lead", "Cliente pot."), ("Metric", "Métrica"), ("Niche", "Nicho"), ("Reach", "Alcance")],
            [("Sponsor", "Patrocinador"), ("Viral", "Viral"), ("Analysis", "Análisis"), ("Audience", "Audiencia"), ("Benefit", "Beneficio"), ("Growth", "Crecimiento")],
            [("Insight", "Perspectiva"), ("Keyword", "Palabra clave"), ("Ranking", "Ranking"), ("Segment", "Segmento"), ("Brief", "Resumen"), ("Pitch", "Lanzamiento")],
            [("Organic", "Orgánico"), ("Paid", "Pagado"), ("Click", "Clic"), ("Impression", "Impresión"), ("Bounce", "Rebote"), ("Rate", "Tasa")]
        ],
        "C1": [
            [("Analytics", "Analítica"), ("Demographics", "Demografía"), ("Engagement", "Compromiso"), ("Influencer", "Influencer"), ("Optimization", "Optimización"), ("Positioning", "Posicionamiento")],
            [("Retention", "Retención"), ("Sentiment", "Sentimiento"), ("Algorithm", "Algoritmo"), ("Attribution", "Atribución"), ("Copyright", "Derechos"), ("Franchise", "Franquicia")],
            [("Merchandise", "Mercancía"), ("Newsletter", "Boletín"), ("Projection", "Proyección"), ("Testimonial", "Testimonio"), ("Affiliate", "Afiliado"), ("B2B", "Negocio a Negocio")],
            [("B2C", "Negocio a Cliente"), ("ROI", "Retorno Inv."), ("KPI", "Indicador Clave"), ("CRM", "Gestión Clientes"), ("SEO", "Posicionamiento"), ("SEM", "Marketing Busc.")]
        ]
    },
    "travel": {
        "A1": [
            [("Ticket", "Boleto"), ("Bus", "Autobús"), ("Train", "Tren"), ("Hotel", "Hotel"), ("Map", "Mapa"), ("Bag", "Bolso")],
            [("Passport", "Pasaporte"), ("Airport", "Aeropuerto"), ("Taxi", "Taxi"), ("Car", "Auto"), ("Stop", "Parada"), ("Go", "Ir")],
            [("Wait", "Esperar"), ("City", "Ciudad"), ("Town", "Pueblo"), ("Road", "Camino"), ("Street", "Calle"), ("Park", "Parque")],
            [("Bed", "Cama"), ("Room", "Habitación"), ("Key", "Llave"), ("Door", "Puerta"), ("Open", "Abrir"), ("Help", "Ayuda")]
        ],
        "A2": [
            [("Flight", "Vuelo"), ("Luggage", "Equipaje"), ("Seat", "Asiento"), ("Gate", "Puerta Emb."), ("Delay", "Retraso"), ("Arrival", "Llegada")],
            [("Exit", "Salida"), ("Tourist", "Turista"), ("Guide", "Guía"), ("Visit", "Visita"), ("Trip", "Viaje"), ("Pack", "Empacar")],
            [("Drive", "Conducir"), ("Ride", "Montar"), ("Walk", "Caminar"), ("Fly", "Volar"), ("Swim", "Nadar"), ("Boat", "Barco")],
            [("Beach", "Playa"), ("Sun", "Sol"), ("Rain", "Lluvia"), ("Snow", "Nieve"), ("Cold", "Frío"), ("Hot", "Caliente")]
        ],
        "B1": [
            [("Booking", "Reserva"), ("Customs", "Aduanas"), ("Boarding", "Embarque"), ("Passenger", "Pasajero"), ("Rental", "Alquiler"), ("Currency", "Moneda")],
            [("Route", "Ruta"), ("Subway", "Metro"), ("Station", "Estación"), ("Terminal", "Terminal"), ("Platform", "Andén"), ("Crew", "Tripulación")],
            [("Foreign", "Extranjero"), ("Local", "Local"), ("Culture", "Cultura"), ("Language", "Idioma"), ("Translate", "Traducir"), ("Speak", "Hablar")],
            [("View", "Vista"), ("Photo", "Foto"), ("Camera", "Cámara"), ("Memory", "Recuerdo"), ("Souvenir", "Recuerdo"), ("Gift", "Regalo")]
        ],
        "B2": [
            [("Itinerary", "Itinerario"), ("Accommodation", "Alojamiento"), ("Departure", "Salida"), ("Layover", "Escala"), ("Shuttle", "Enlace"), ("Visa", "Visado")],
            [("Insurance", "Seguro"), ("Vaccine", "Vacuna"), ("Destination", "Destino"), ("Exploration", "Exploración"), ("Journey", "Travesía"), ("Adventure", "Aventura")],
            [("Resort", "Complejo"), ("Hostel", "Hostal"), ("Camping", "Acampar"), ("Hiking", "Senderismo"), ("Cruise", "Crucero"), ("Voyage", "Viaje largo")],
            [("Schedule", "Horario"), ("Timetable", "Tabla tiempos"), ("Announce", "Anuncio"), ("Notice", "Aviso"), ("Warning", "Advertencia"), ("Emergency", "Emergencia")]
        ],
        "C1": [
            [("Embassy", "Embajada"), ("Commute", "Conmutar"), ("Landmark", "Hito"), ("Sightseeing", "Turismo"), ("Excursion", "Excursión"), ("Jetlag", "Desfase")],
            [("Stopover", "Parada técnica"), ("Amenities", "Servicios"), ("Concierge", "Conserje"), ("Valet", "Aparcacoches"), ("Suite", "Suite"), ("Upgrade", "Mejora")],
            [("Border", "Frontera"), ("Immigration", "Inmigración"), ("Declaration", "Declaración"), ("Smuggle", "Contrabando"), ("Valid", "Válido"), ("Expire", "Expirar")],
            [("Heritage", "Patrimonio"), ("Ancient", "Antiguo"), ("Ruins", "Ruinas"), ("Monument", "Monumento"), ("Statue", "Estatua"), ("Temple", "Templo")]
        ]
    },
    "basics": {
        "A1": [
            [("Apple", "Manzana"), ("Banana", "Plátano"), ("Orange", "Naranja"), ("Water", "Agua"), ("Milk", "Leche"), ("Bread", "Pan")],
            [("Egg", "Huevo"), ("Fish", "Pescado"), ("Meat", "Carne"), ("Rice", "Arroz"), ("Salt", "Sal"), ("Sugar", "Azúcar")],
            [("Red", "Rojo"), ("Blue", "Azul"), ("Green", "Verde"), ("Black", "Negro"), ("White", "Blanco"), ("Yellow", "Amarillo")],
            [("One", "Uno"), ("Two", "Dos"), ("Three", "Tres"), ("Four", "Cuatro"), ("Five", "Cinco"), ("Ten", "Diez")]
        ],
        "A2": [
            [("Car", "Coche"), ("Bus", "Autobús"), ("Train", "Tren"), ("Bike", "Bici"), ("Road", "Carretera"), ("Wheel", "Rueda")],
            [("Shirt", "Camisa"), ("Shoe", "Zapato"), ("Pants", "Pantalones"), ("Hat", "Sombrero"), ("Coat", "Abrigo"), ("Dress", "Vestido")],
            [("Family", "Familia"), ("Mother", "Madre"), ("Father", "Padre"), ("Sister", "Hermana"), ("Brother", "Hermano"), ("Friend", "Amigo")],
            [("House", "Casa"), ("Room", "Cuarto"), ("Kitchen", "Cocina"), ("Door", "Puerta"), ("Window", "Ventana"), ("Wall", "Pared")]
        ],
        "B1": [
            [("Run", "Correr"), ("Jump", "Saltar"), ("Swim", "Nadar"), ("Walk", "Caminar"), ("Eat", "Comer"), ("Sleep", "Dormir")],
            [("Read", "Leer"), ("Write", "Escribir"), ("Speak", "Hablar"), ("Listen", "Escuchar"), ("Think", "Pensar"), ("Know", "Saber")],
            [("Head", "Cabeza"), ("Hand", "Mano"), ("Leg", "Pierna"), ("Eye", "Ojo"), ("Face", "Cara"), ("Heart", "Corazón")],
            [("Sick", "Enfermo"), ("Health", "Salud"), ("Pain", "Dolor"), ("Doctor", "Médico"), ("Nurse", "Enfermera"), ("Medicine", "Medicina")]
        ],
        "B2": [
            [("Furniture", "Muebles"), ("Table", "Mesa"), ("Chair", "Silla"), ("Bed", "Cama"), ("Sofa", "Sofá"), ("Lamp", "Lámpara")],
            [("Fridge", "Refri"), ("Oven", "Horno"), ("Stove", "Estufa"), ("Sink", "Lavabo"), ("Plate", "Plato"), ("Cup", "Taza")],
            [("Weather", "Clima"), ("Rain", "Lluvia"), ("Sun", "Sol"), ("Snow", "Nieve"), ("Wind", "Viento"), ("Cloud", "Nube")],
            [("Tree", "Árbol"), ("Flower", "Flor"), ("River", "Río"), ("Mountain", "Montaña"), ("Sea", "Mar"), ("Sky", "Cielo")]
        ],
        "C1": [
            [("Freedom", "Libertad"), ("Wisdom", "Sabiduría"), ("Justice", "Justicia"), ("Courage", "Coraje"), ("Honesty", "Honestidad"), ("Beauty", "Belleza")],
            [("Truth", "Verdad"), ("Peace", "Paz"), ("War", "Guerra"), ("Love", "Amor"), ("Hate", "Odio"), ("Hope", "Esperanza")],
            [("Citizen", "Ciudadano"), ("Culture", "Cultura"), ("History", "Historia"), ("Law", "Ley"), ("Politics", "Política"), ("Religion", "Religión")],
            [("Tradition", "Tradición"), ("Economy", "Economía"), ("Society", "Sociedad"), ("Science", "Ciencia"), ("Art", "Arte"), ("Nature", "Naturaleza")]
        ]
    }
}

CATEGORIES = ["business", "tech", "marketing", "travel", "basics"]
LEVELS = ["A1", "A2", "B1", "B2", "C1"]

def generate():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        print(f"📁 Directorio verificado: {OUTPUT_DIR}")

    count = 0
    
    for category in CATEGORIES:
        for lvl_idx, level in enumerate(LEVELS):
            # Obtener las 4 partes de datos reales
            level_data = DATA_SOURCE.get(category, {}).get(level, [])
            
            # Si faltan datos para completar 4 partes, rellenar con genéricos (Seguridad)
            while len(level_data) < 4:
                level_data.append([("Generic 1", "Genérico 1"), ("Generic 2", "Genérico 2")])

            for part_idx in range(4): 
                part = part_idx + 1
                pairs = [{"id": f"p_{i}", "en": p[0], "es": p[1]} for i, p in enumerate(level_data[part_idx])]
                
                # --- CÁLCULO DE ID (1 a 20) ---
                module_num = (lvl_idx * 4) + part
                file_id = f"{category}_mod_{module_num:02d}"
                
                # Títulos bonitos
                titles = {
                    "basics": "Life Essentials",
                    "business": "Business Pro",
                    "tech": "Tech Stack",
                    "marketing": "Growth Hacking",
                    "travel": "World Explorer"
                }
                main_title = titles.get(category, "Vocabulary")
                
                lesson_data = {
                    "id": file_id,
                    "title": f"{main_title} {level}-{part}",
                    "description": f"Mastering {category} vocabulary. Level {level}, Part {part}.",
                    "level": level,
                    "total_xp": 100 + (lvl_idx * 20),
                    "stages": [
                        {
                            "id": f"drill_{file_id}",
                            "type": "pairing_drill",
                            "title": f"Neuro Link: {category.title()}",
                            "description": "Rapid association drill.",
                            "pairs": pairs
                        }
                    ]
                }

                with open(f"{OUTPUT_DIR}/{file_id}.json", "w", encoding="utf-8") as f:
                    json.dump(lesson_data, f, indent=2, ensure_ascii=False)
                
                count += 1
                print(f"✅ Created: {file_id}.json")

    print(f"\n🚀 SUCCESS: {count} lessons generated in {OUTPUT_DIR}")

if __name__ == "__main__":
    generate()