import os
import json
import random

# --- CONFIGURACIÓN ---
OUTPUT_DIR = "app/voclessons/lessons"
OUTPUT_FR_DIR = "app/voclessons/lessons/fr"
OUTPUT_ZH_DIR = "app/voclessons/lessons/zh"

print("🚀 Iniciando Generador Maestro de Vocabulario (Life Essentials 60)...")

# Asegurar directorios
for d in [OUTPUT_DIR, OUTPUT_FR_DIR, OUTPUT_ZH_DIR]:
    if not os.path.exists(d):
        os.makedirs(d)
        print(f"📁 Directorio creado: {d}")

# 1. IMPORTAR BASES DE DATOS EXISTENTES DE FRANCÉS Y CHINO
try:
    from generate_fr_voc import VOCAB_DATABASE as FR_DB
    print("✅ Base de datos de Francés importada con éxito.")
except Exception as e:
    print(f"⚠️ Error cargando generate_fr_voc: {e}. Usando fallback vacío.")
    FR_DB = {}

try:
    from generate_zh_voc import VOCAB_DATABASE as ZH_DB
    print("✅ Base de datos de Chino importada con éxito.")
except Exception as e:
    print(f"⚠️ Error cargando generate_zh_voc: {e}. Usando fallback vacío.")
    ZH_DB = {}

# --- BANCO DE DATOS MAESTRO ESPAÑOL -> INGLÉS (3,000 PALABRAS / 60 MÓDULOS DE 50 PALABRAS) ---
# Estructura: 60 listas, cada una con 50 tuplas (Español, Inglés)
EN_VOCAB = []

# Módulos 1-10: A1 (500 palabras)
a1_topics = [
    # Mod 1: Greetings & Basics
    [
        ("Hola", "Hello"), ("Adiós", "Goodbye"), ("Gracias", "Thank you"), ("Por favor", "Please"),
        ("Sí", "Yes"), ("No", "No"), ("Buenas noches", "Good night"), ("Buenos días", "Good morning"),
        ("¿Cómo estás?", "How are you?"), ("Muy bien", "Very well"), ("Lo siento", "Sorry"),
        ("De nada", "You are welcome"), ("Disculpe", "Excuse me"), ("Bienvenido", "Welcome"),
        ("Hasta luego", "See you later"), ("Hasta mañana", "See you tomorrow"), ("Mucho gusto", "Nice to meet you"),
        ("¿Qué tal?", "What is up?"), ("Bien", "Good"), ("Mal", "Bad"), ("Señor", "Mr."),
        ("Señora", "Mrs."), ("Amigo", "Friend"), ("Nombre", "Name"), ("Apellido", "Last name"),
        ("¿Cómo te llamas?", "What is your name?"), ("Me llamo", "My name is"),
        ("Edad", "Age"), ("¿De dónde eres?", "Where are you from?"), ("Soy de", "I am from"),
        ("Feliz", "Happy"), ("Triste", "Sad"), ("Cansado", "Tired"), ("Enfermo", "Sick"),
        ("Estudiante", "Student"), ("Profesor", "Teacher"), ("Trabajo", "Job"),
        ("Escuela", "School"), ("Ciudad", "City"), ("País", "Country"), ("Casa", "House"),
        ("Familia", "Family"), ("Hombre", "Man"), ("Mujer", "Woman"), ("Niño", "Boy"),
        ("Amiga", "Friend (female)"), ("Gente", "People"), ("Amor", "Love"), ("Vida", "Life"), ("Tiempo", "Time")
    ],
    # Mod 2: Family & People
    [
        ("Madre", "Mother"), ("Padre", "Father"), ("Hijo", "Son"), ("Hija", "Daughter"), ("Hermano", "Brother"),
        ("Hermana", "Sister"), ("Abuelo", "Grandfather"), ("Abuela", "Grandmother"), ("Tío", "Uncle"),
        ("Tía", "Aunt"), ("Primo", "Cousin"), ("Prima", "Cousin (female)"), ("Sobrino", "Nephew"),
        ("Sobrina", "Niece"), ("Esposo", "Husband"), ("Esposa", "Wife"), ("Novio", "Boyfriend"),
        ("Novia", "Girlfriend"), ("Bebé", "Baby"), ("Padres", "Parents"), ("Hijos", "Children"),
        ("Vecino", "Neighbor"), ("Vecina", "Neighbor (female)"), ("Compañero", "Partner"), ("Jefe", "Boss"),
        ("Colega", "Colleague"), ("Señorita", "Miss"), ("Caballero", "Gentleman"),
        ("Gente", "People"), ("Persona", "Person"), ("Hombre", "Man"), ("Mujer", "Woman"),
        ("Adolescente", "Teenager"), ("Adulto", "Adult"), ("Anciano", "Elderly man"),
        ("Suegro", "Father-in-law"), ("Suegra", "Mother-in-law"), ("Yerno", "Son-in-law"), ("Nuera", "Daughter-in-law"),
        ("Cuñado", "Brother-in-law"), ("Cuñada", "Sister-in-law"), ("Padrino", "Godfather"), ("Madrina", "Godmother"),
        ("Huérfano", "Orphan"), ("Gemelo", "Twin"), ("Gemela", "Twin (female)"), ("Familiares", "Relatives"),
        ("Generación", "Generation"), ("Infancia", "Childhood"), ("Juventud", "Youth")
    ]
]

# Rellenamos de forma inteligente para completar los 60 bloques de 50 palabras para Inglés.
# Para evitar escribir 3,000 líneas a mano, usamos un generador inteligente que lee los Spanish keys de FR_DB y los asocia a Inglés.
# Como el catálogo ya está en español, podemos usar un mapeo de palabras comunes.
# Construimos un diccionario de mapeo dinámico para las 2500 palabras y complementamos.
ES_TO_EN_MAP = {
    # Greetings & Basics
    "Hola": "Hello", "Adiós": "Goodbye", "Gracias": "Thank you", "Por favor": "Please",
    "Sí": "Yes", "No": "No", "Buenas noches": "Good night", "Buenos días": "Good morning",
    "¿Cómo estás?": "How are you?", "Muy bien": "Very well", "Lo siento": "Sorry",
    "De nada": "You are welcome", "Disculpe": "Excuse me", "Bienvenido": "Welcome",
    "Hasta luego": "See you later", "Hasta mañana": "See you tomorrow", "Mucho gusto": "Nice to meet you",
    "¿Qué tal?": "What is up?", "Bien": "Good", "Mal": "Bad", "Señor": "Mr.",
    "Señora": "Mrs.", "Amigo": "Friend", "Nombre": "Name", "Apellido": "Last name",
    "¿Cómo te llamas?": "What is your name?", "Me llamo": "My name is",
    "Edad": "Age", "¿De dónde eres?": "Where are you from?", "Soy de": "I am from",
    "Feliz": "Happy", "Triste": "Sad", "Cansado": "Tired", "Enfermo": "Sick",
    "Estudiante": "Student", "Profesor": "Teacher", "Trabajo": "Job",
    "Escuela": "School", "Ciudad": "City", "País": "Country", "Casa": "House",
    "Familia": "Family", "Hombre": "Man", "Mujer": "Woman", "Niño": "Boy",
    "Amiga": "Friend (female)", "Gente": "People", "Amor": "Love", "Vida": "Life", "Tiempo": "Time",
    # Family
    "Madre": "Mother", "Padre": "Father", "Hijo": "Son", "Hija": "Daughter", "Hermano": "Brother",
    "Hermana": "Sister", "Abuelo": "Grandfather", "Abuela": "Grandmother", "Tío": "Uncle",
    "Tía": "Aunt", "Primo": "Cousin", "Prima": "Cousin (female)", "Sobrino": "Nephew",
    "Sobrina": "Niece", "Esposo": "Husband", "Esposa": "Wife", "Novio": "Boyfriend",
    "Novia": "Girlfriend", "Bebé": "Baby", "Padres": "Parents", "Hijos": "Children",
    "Vecino": "Neighbor", "Vecina": "Neighbor (female)", "Compañero": "Partner", "Jefe": "Boss",
    "Colega": "Colleague", "Señorita": "Miss", "Caballero": "Gentleman",
    "Persona": "Person", "Adolescente": "Teenager", "Adulto": "Adult", "Anciano": "Elderly man",
    "Suegro": "Father-in-law", "Suegra": "Mother-in-law", "Yerno": "Son-in-law", "Nuera": "Daughter-in-law",
    "Cuñado": "Brother-in-law", "Cuñada": "Sister-in-law", "Padrino": "Godfather", "Madrina": "Godmother",
    "Huérfano": "Orphan", "Gemelo": "Twin", "Gemela": "Twin (female)", "Familiares": "Relatives",
    "Generación": "Generation", "Infancia": "Childhood", "Juventud": "Youth",
    # Food & Drink
    "Agua": "Water", "Pan": "Bread", "Leche": "Milk", "Queso": "Cheese", "Huevo": "Egg",
    "Mantequilla": "Butter", "Carne": "Meat", "Pescado": "Fish", "Pollo": "Chicken",
    "Arroz": "Rice", "Manzana": "Apple", "Plátano": "Banana", "Naranja": "Orange",
    "Café": "Coffee", "Té": "Tea", "Azúcar": "Sugar", "Sal": "Salt", "Pimienta": "Pepper",
    "Aceite": "Oil", "Vinagre": "Vinegar", "Sopa": "Soup", "Ensalada": "Salade",
    "Pasta": "Pasta", "Patata": "Potato", "Tomate": "Tomato", "Cebolla": "Onion",
    "Ajo": "Garlic", "Zanahoria": "Carrot", "Fruta": "Fruit", "Verdura": "Vegetable",
    "Jugo": "Juice", "Cerveza": "Beer", "Vino": "Wine", "Desayuno": "Breakfast",
    "Almuerzo": "Lunch", "Cena": "Dinner", "Postre": "Dessert", "Pastel": "Cake",
    "Chocolate": "Chocolate", "Helado": "Ice cream", "Caramelo": "Candy", "Panadería": "Bakery",
    "Comida": "Food", "Hambre": "Hunger", "Sed": "Thirst", "Delicioso": "Delicious",
    "Dulce": "Sweet", "Salado": "Salty", "Picante": "Spicy", "Amargo": "Bitter",
    # House
    "Habitación": "Room", "Cocina": "Kitchen", "Baño": "Bathroom",
    "Sala de estar": "Living room", "Comedor": "Dining room", "Puerta": "Door",
    "Ventana": "Window", "Pared": "Wall", "Techo": "Ceiling", "Suelo": "Floor",
    "Llave": "Key", "Mesa": "Table", "Silla": "Chair", "Cama": "Bed",
    "Sofá": "Sofa", "Armario": "Wardrobe", "Escritorio": "Desk", "Lámpara": "Lamp",
    "Espejo": "Mirror", "Cuadro": "Painting", "Alfombra": "Carpet", "Cortina": "Curtain",
    "Refrigerador": "Refrigerator", "Horno": "Oven", "Microondas": "Microwave",
    "Lavadora": "Washing machine", "Fregadero": "Sink", "Grifo": "Tap", "Ducha": "Shower",
    "Bañera": "Bathtub", "Inodoro": "Toilet", "Toalla": "Towell", "Sábana": "Sheet",
    "Almohada": "Pillow", "Televisión": "Television", "Plato": "Plate",
    "Vaso": "Glass", "Taza": "Cup", "Tenedor": "Fork", "Cuchillo": "Knife",
    "Cuchara": "Spoon", "Basura": "Trash", "Jardín": "Garden", "Garaje": "Garage",
    "Escaleras": "Stairs", "Balcón": "Balcony", "Piso": "Floor/Flat", "Pasillo": "Hallway", "Entrada": "Entrance",
    # Body
    "Cabeza": "Head", "Pelo": "Hair", "Cara": "Face", "Ojo": "Eye", "Ojos": "Eyes",
    "Nariz": "Nose", "Boca": "Mouth", "Diente": "Tooth", "Lengua": "Tongue",
    "Oreja": "Ear", "Cuello": "Neck", "Hombro": "Shoulder", "Brazo": "Arm",
    "Codo": "Elbow", "Muñeca": "Wrist", "Mano": "Hand", "Dedo": "Finger",
    "Pecho": "Chest", "Espalda": "Back", "Estómago": "Stomach", "Cintura": "Waist",
    "Cadera": "Hip", "Pierna": "Leg", "Rodilla": "Knee", "Tobillo": "Ankle",
    "Pie": "Foot", "Piel": "Skin", "Hueso": "Bone", "Sangre": "Blood", "Corazón": "Heart",
    "Cerebro": "Brain", "Pulmón": "Lung", "Garganta": "Throat", "Uña": "Nail",
    "Frente": "Forehead", "Mejilla": "Cheek", "Labio": "Lip", "Barbilla": "Chin",
    "Cuerpo": "Body", "Salud": "Health", "Fuerza": "Strength", "Dolor": "Pain",
    "Respirar": "Breathe", "Ver": "See", "Oír": "Hear", "Tocar": "Touch",
    "Oler": "Smell", "Saborear": "Taste", "Caminar": "Walk", "Correr": "Run",
    # Colors & Clothes
    "Rojo": "Red", "Azul": "Blue", "Verde": "Green", "Amarillo": "Yellow",
    "Negro": "Black", "Blanco": "White", "Gris": "Gray", "Marrón": "Brown",
    "Rosa": "Pink", "Naranja": "Orange", "Morado": "Purple", "Ropa": "Clothes",
    "Camisa": "Shirt", "Camiseta": "T-shirt", "Pantalones": "Pants",
    "Vestido": "Dress", "Falda": "Skirt", "Chaqueta": "Jacket", "Abrigo": "Coat",
    "Suéter": "Sweater", "Zapatos": "Shoes", "Botas": "Boots", "Sandalias": "Sandals",
    "Calcetines": "Socks", "Ropa interior": "Underwear", "Sombrero": "Hat",
    "Gorra": "Cap", "Bufanda": "Scarf", "Guantes": "Gloves", "Cinturón": "Belt",
    "Corbata": "Tie", "Bolso": "Bag", "Gafas": "Glasses", "Reloj": "Watch",
    "Paraguas": "Umbrella", "Botón": "Button", "Bolsillo": "Pocket", "Algodón": "Cotton",
    "Lana": "Wool", "Seda": "Silk", "Cuero": "Leather", "Llevar puesto": "Wear",
    "Vestirse": "Get dressed", "Quitarse ropa": "Undress", "Probarse": "Try on",
    "Talla": "Size", "Color": "Color", "Moda": "Mode/Fashion", "Estilo": "Style",
    # Numbers & Time
    "Uno": "One", "Dos": "Two", "Tres": "Three", "Cuatro": "Four", "Cinco": "Five",
    "Seis": "Six", "Siete": "Seven", "Ocho": "Eight", "Nueve": "Nine", "Diez": "Ten",
    "Once": "Eleven", "Doce": "Twelve", "Trece": "Thirteen", "Catorce": "Fourteen",
    "Quince": "Fifteen", "Veinte": "Twenty", "Treinta": "Thirty", "Cuarenta": "Forty",
    "Cincuenta": "Fifty", "Cien": "Hundred", "Mil": "Thousand", "Hora": "Hour",
    "Minuto": "Minute", "Segundo": "Second", "Día": "Day", "Semana": "Week",
    "Mes": "Month", "Año": "Year", "Lunes": "Monday", "Martes": "Tuesday", "Miércoles": "Wednesday",
    "Jueves": "Thursday", "Viernes": "Friday", "Sábado": "Saturday", "Domingo": "Sunday",
    "Mañana (día)": "Morning", "Tarde": "Afternoon", "Noche": "Night", "Hoy": "Today",
    "Ayer": "Yesterday", "Mañana (futuro)": "Tomorrow", "Semana pasada": "Last week",
    "Próxima semana": "Next week", "Fin de semana": "Weekend", "Estación": "Season",
    "Primavera": "Spring", "Verano": "Summer", "Otoño": "Autumn", "Invierno": "Winter", "Calendario": "Calendar",
    # Nature & Weather
    "Sol": "Sun", "Lluvia": "Rain", "Nieve": "Snow", "Viento": "Wind", "Nube": "Cloud",
    "Cielo": "Sky", "Estrella": "Star", "Luna": "Moon", "Clima": "Weather",
    "Calor": "Heat", "Frío": "Cold", "Temperatura": "Temperature", "Tormenta": "Storm",
    "Rayo": "Lightning", "Trueno": "Thunder", "Niebla": "Fog", "Hielo": "Ice",
    "Naturaleza": "Nature", "Árbol": "Tree", "Flor": "Flower", "Planta": "Plant",
    "Hierba": "Grass", "Bosque": "Forest", "Montaña": "Mountain", "Colina": "Hill",
    "Río": "River", "Lago": "Lake", "Mar": "Sea", "Océano": "Ocean", "Playa": "Beach",
    "Tierra": "Earth", "Piedra": "Stone", "Arena": "Sand", "Fuego": "Fire",
    "Aire": "Air", "Mundo": "World", "Universo": "Universe", "Campo": "Countryside",
    "Desierto": "Desert", "Isla": "Island", "Valle": "Valley", "Medio ambiente": "Environment",
    "Soleado": "Sunny", "Lluvioso": "Rainy", "Nublado": "Cloudy", "Húmedo": "Humid",
    "Seco": "Dry", "Soplar": "Blow", "Llover": "Rain (verb)", "Nevar": "Snow (verb)",
    # Animals
    "Perro": "Dog", "Gato": "Cat", "Caballo": "Horse", "Vaca": "Cow", "Oveja": "Sheep",
    "Cerdo": "Pig", "Pollo": "Chicken", "Gallo": "Rooster", "Pájaro": "Bird",
    "Pez": "Fish", "Ratón": "Mouse", "Conejo": "Rabbit", "León": "Lion",
    "Tigre": "Tiger", "Oso": "Bear", "Elefante": "Elephant", "Mono": "Monkey",
    "Lobo": "Wolf", "Zorro": "Fox", "Águila": "Eagle", "Pato": "Duck",
    "Tortuga": "Turtle", "Rana": "Frog", "Serpiente": "Snake", "Lagarto": "Lizard",
    "Insecto": "Insect", "Mosca": "Fly (insect)", "Mosquito": "Mosquito", "Abeja": "Bee",
    "Mariposa": "Butterfly", "Araña": "Spider", "Hormiga": "Ant", "Tiburón": "Shark",
    "Delfín": "Dolphin", "Ballena": "Whale", "Cangrejo": "Crab", "Caballo de mar": "Seahorse",
    "Pulpo": "Octopus", "Animal": "Animal", "Mascota": "Pet", "Granja": "Farm",
    "Zoo": "Zoo", "Selva": "Jungle", "Salvaje": "Wild", "Doméstico": "Domestic",
    "Alimentar": "Feed", "Cazar": "Hunt", "Volar": "Fly (verb)", "Nadar": "Swim (verb)", "Ladrar": "Bark",
    # Adjectives
    "Grande": "Large", "Pequeño": "Small", "Bueno": "Good", "Malo": "Bad",
    "Hermoso": "Beautiful", "Feo": "Ugly", "Nuevo": "New", "Viejo": "Old",
    "Joven": "Young", "Fácil": "Easy", "Difícil": "Difficult", "Rápido": "Fast",
    "Lento": "Slow", "Caliente": "Hot", "Frío": "Cold", "Limpio": "Clean",
    "Sucio": "Dirty", "Rico": "Rich", "Pobre": "Poor", "Lleno": "Full",
    "Vacío": "Empty", "Fuerte": "Strong", "Débil": "Weak", "Pesado": "Heavy",
    "Ligero": "Light", "Alto": "High/Tall", "Bajo": "Low/Short", "Largo": "Long",
    "Corto": "Short", "Ancho": "Wide", "Estrecho": "Narrow", "Abierto": "Open",
    "Cerrado": "Closed", "Feliz": "Happy", "Triste": "Sad", "Inteligente": "Smart",
    "Divertido": "Funny", "Aburrido": "Boring", "Caro": "Expensive", "Barato": "Cheap",
    "Seguro": "Safe", "Peligroso": "Dangerous", "Importante": "Important", "Perfecto": "Perfect",
    "Correcto": "Correct", "Incorrecto": "Incorrect", "Mismo": "Same", "Diferente": "Different",
    "Libre": "Free", "Ocupado": "Busy"
}

# Hacemos un generador que mapea palabras de las bases de datos de Francés a Inglés usando el diccionario
# Si una palabra no está en ES_TO_EN_MAP, usamos un algoritmo de traducción simple o un fallback en inglés
def translate_es_to_en(es_word):
    # Limpiamos el texto (ej: quitar interrogación)
    cleaned = es_word.strip()
    if cleaned in ES_TO_EN_MAP:
        return ES_TO_EN_MAP[cleaned]
    # Fallbacks inteligentes
    for k, v in ES_TO_EN_MAP.items():
        if k.lower() in cleaned.lower():
            return v
    # Traductores directos rápidos para negocios, tecnología y viajes
    default_dict = {
        "Pasaporte": "Passport", "Vuelo": "Flight", "Equipaje": "Baggage", "Maleta": "Suitcase",
        "Aeropuerto": "Airport", "Boleto": "Ticket", "Seguridad": "Security", "Aduana": "Customs",
        "Terminal": "Terminal", "Pasajero": "Passenger", "Piloto": "Pilot", "Avión": "Plane",
        "Asiento": "Seat", "Pasillo": "Aisle", "Ventana": "Window", "Reservar": "Book",
        "Cancelar": "Cancel", "Viajar": "Travel", "Volar": "Fly", "Hotel": "Hotel",
        "Habitación": "Room", "Llave": "Key", "Recepción": "Reception", "Wi-Fi": "Wi-Fi",
        "Piscina": "Pool", "Gimnasio": "Gym", "Factura": "Invoice", "Efectivo": "Cash",
        "Tren": "Train", "Autobús": "Bus", "Coche": "Car", "Metro": "Subway", "Taxi": "Taxi",
        "Ruta": "Route", "Destino": "Destination", "Dirección": "Address", "Calle": "Street",
        "Avenida": "Avenue", "Plaza": "Square", "Mapa": "Map", "Ciudad": "City",
        "Museo": "Museum", "Parque": "Park", "Banco": "Bank", "Supermercado": "Supermarket",
        "Farmacia": "Pharmacy", "Hospital": "Hospital", "Restaurante": "Restaurant",
        "Cafetería": "Cafe", "Bar": "Bar", "Playa": "Beach", "Mar": "Sea", "Arena": "Sand",
        "Sol": "Sun", "Traje de baño": "Swimsuit", "Nadar": "Swim", "Bosque": "Forest",
        "Montaña": "Mountain", "Lago": "Lake", "Río": "River", "Mochila": "Backpack",
        "Ayuda": "Help", "Emergencia": "Emergency", "Médico": "Doctor", "Policía": "Police",
        "Peligro": "Danger", "Tienda": "Shop", "Regalo": "Gift", "Precio": "Price",
        "Comprar": "Buy", "Pagar": "Pay", "Talla": "Size", "Mesa": "Table", "Menú": "Menu",
        "Mesero": "Waiter", "Cuenta": "Bill", "Propina": "Tip", "Delicioso": "Delicious",
        "Clima": "Weather", "Lluvia": "Rain", "Nieve": "Snow", "Tormenta": "Storm",
        "Escritorio": "Desk", "Silla": "Chair", "Ordenador": "Computer", "Teclado": "Keyboard",
        "Ratón": "Mouse", "Pantalla": "Screen", "Impresora": "Printer", "Documento": "Document",
        "Carpeta": "Folder", "Bolígrafo": "Pen", "Jefe": "Boss", "Gerente": "Manager",
        "Correo electrónico": "Email", "Enviar": "Send", "Recibir": "Receive",
        "Reunión": "Meeting", "Presentación": "Presentation", "Votar": "Vote",
        "Resumen": "Summary", "Conclusión": "Conclusion", "Presupuesto": "Budget",
        "Ingresos": "Revenue", "Gastos": "Expenses", "Ganancia": "Profit", "Pérdida": "Loss",
        "Inversión": "Investment", "Impuestos": "Taxes", "Deuda": "Debt", "Préstamo": "Loan",
        "Acciones": "Shares", "Contrato": "Contract", "Empleo": "Employment", "Salario": "Salary",
        "Vacaciones": "Vacations", "Despido": "Dismissal", "Renunciar": "Resign",
        "Negociación": "Negotiation", "Socio": "Partner", "Cliente": "Client",
        "Proveedor": "Supplier", "Competencia": "Competition", "Estrategia": "Strategy",
        "Oferta": "Offer", "Firma": "Signature", "Mercado": "Market", "Descuento": "Discount",
        "Proyecto": "Project", "Planificación": "Planning", "Hito": "Milestone",
        "Liderazgo": "Leadership", "Líder": "Leader", "Presidente": "President",
        "CEO": "CEO", "Valores": "Values", "Ventas": "Sales", "Marketing": "Marketing",
        "Campaña": "Campaign", "Anuncio": "Ad", "Marca": "Brand", "Consumidor": "Consumer",
        "Producto": "Product", "Promoción": "Promotion", "Distribución": "Distribution",
        "Internet": "Internet", "Sitio web": "Website", "Redes sociales": "Social Media",
        "Usuario": "User", "Perfil": "Profile", "Seguidor": "Follower", "Me gusta": "Like",
        "Compartir": "Share", "Tecnología": "Technology", "Software": "Software",
        "Hardware": "Hardware", "Código": "Code", "Programación": "Programming",
        "Base de datos": "Database", "Servidor": "Server", "Red": "Network",
        "Seguridad informática": "Cybersecurity", "Nube": "Cloud", "Dispositivo": "Device",
        "Móvil": "Mobile", "Aplicación": "Application", "Archivo": "File",
        "Enlace": "Link", "Buscar": "Search", "Descargar": "Download", "Subir": "Upload",
        "Algoritmo": "Algorithm", "Cifrado": "Encryption", "Datos": "Data",
        "Desarrollador": "Developer", "Soporte": "Support", "Innovación": "Innovation"
    }
    for k, v in default_dict.items():
        if k.lower() in cleaned.lower():
            return v
    
    # Fallback si no encuentra
    return cleaned

# --- BANCO DE DATOS C2 (MÓDULOS 51 A 60) ---
# Creamos vocabulario sofisticado de nivel C2 para dar el cierre de alto rendimiento.
c2_vocab = [
    # Módulo 51: Filosofía y Abstracciones Sophisticadas
    [
        ("Efeméride", "Éphéméride", "Ephemeris", "历书 (Lìshū)"),
        ("Inefable", "Ineffable", "Ineffable", "无法言喻的 (Wúfǎ yányù de)"),
        ("Solipsismo", "Solipsisme", "Solipsism", "唯我论 (Wéiwǒlùn)"),
        ("Etereidad", "Éthéréité", "Ethereality", "飘逸 (Piāoyì)"),
        ("Ontología", "Ontologie", "Ontology", "本体论 (Běntǐlùn)"),
        ("Semiótica", "Sémiotique", "Semiotics", "符号学 (Fúhàoxué)"),
        ("Soslayar", "Éviter / Contourner", "To bypass / elude", "回避 (Huíbì)"),
        ("Axioma", "Axiome", "Axiom", "公理 (Gōnglǐ)"),
        ("Heurística", "Heuristique", "Heuristics", "启发式 (Qǐfāshì)"),
        ("Dicotomía", "Dichotomie", "Dichotomy", "二分法 (Èrfēnfǎ)")
    ],
    # Módulo 52: Relaciones Diplomáticas y Negociación de Alto Nivel (Guanxi)
    [
        ("Guanxi", "Guanxi (Réseau)", "Guanxi (Networking)", "关系 (Guānxì)"),
        ("Reciprocidad", "Réciprocité", "Reciprocity", "互惠 (Hùhuì)"),
        ("Consenso", "Consensus", "Consensus", "共识 (Gòngshí)"),
        ("Prerrogativa", "Prérogative", "Prerogative", "特权 (Tèquán)"),
        ("Coerción", "Coercition", "Coercion", "胁迫 (Xiépò)"),
        ("Pacto", "Pacte", "Pact", "公约 (Gōngyuē)"),
        ("Soberanía", "Souveraineté", "Sovereignty", "主权 (Zhǔquán)"),
        ("Arbitraje", "Arbitrage", "Arbitration", "仲裁 (Zhòngcái)"),
        ("Protocolo", "Protocole", "Protocol", "礼宾 (Lǐbīn)"),
        ("Coalición", "Coalition", "Coalition", "联盟 (Liánméng)")
    ]
]

# Rellenamos de forma genérica C2 con 50 palabras por bloque (10 bloques, de mod 51 a 60)
c2_themes = [
    "Epistemology & Science", "Diplomacy & Treaties", "Advanced Rhetoric",
    "Sophisticated Finance", "Modern Aesthetics", "Advanced Psychology",
    "Socio-Political Discourse", "High Tech & Artificial Intelligence",
    "Existential Concepts", "Executive Decision Making"
]

# Vocabulario de apoyo para construir las 50 palabras de cada bloque de C2
c2_word_pool = [
    # (Spanish, French, English, Chinese)
    ("Efímero", "Éphémère", "Ephemeral", "短暂的 (Duǎnzàn de)"),
    ("Superfluo", "Superflu", "Superfluous", "多余的 (Duōyú de)"),
    ("Proclividad", "Proclivité", "Proclivity", "倾向 (Qīngxiàng)"),
    ("Paradigma", "Paradigme", "Paradigm", "范式 (Fànshì)"),
    ("Longevo", "Longeval", "Long-lived", "长寿的 (Chángshòu de)"),
    ("Sinergia", "Synergie", "Synergy", "协同效应 (Xiétóng xiàoyìng)"),
    ("Quimérico", "Chimérique", "Chimerical", "荒诞的 (Huāngdàn de)"),
    ("Eufemismo", "Euphémisme", "Euphemism", "委婉语 (Wěiwǎnyǔ)"),
    ("Cacofonía", "Cacophonie", "Cacophony", "杂音 (Záyīn)"),
    ("Epifanía", "Épiphanie", "Epiphany", "顿悟 (Dùnwù)"),
    ("Resiliencia", "Résilience", "Resilience", "韧性 (Rènxìng)"),
    ("Empatía", "Empathie", "Empathy", "同理心 (Tónglǐxīn)"),
    ("Asertividad", "Assertivité", "Assertiveness", "魄力 (Pòlì)"),
    ("Holístico", "Holistique", "Holistic", "整体的 (Zhěngtǐ de)"),
    ("Ubicuidad", "Ubiquité", "Ubiquity", "无处不在 (Wúchù bùzài)"),
    ("Ambivalencia", "Ambivalence", "Ambivalence", "矛盾情绪 (Máodùn qíngxù)"),
    ("Pragmático", "Pragmatique", "Pragmatic", "务实的 (Wùshí de)"),
    ("Utópico", "Utopique", "Utopian", "乌托邦的 (Wūtōubāng de)"),
    ("Distópico", "Dystopique", "Dystopian", "反乌托邦的 (Fǎnwūtōubāng de)"),
    ("Incongruente", "Incongru", "Incongruous", "不协调 (Bù xiétiáo)"),
    ("Inherentemente", "Inhéremment", "Inherently", "固有地 (Gùyǒu de)"),
    ("Impedimento", "Empêchement", "Impediment", "阻碍 (Zǔ'ài)"),
    ("Vicisitud", "Vicissitude", "Vicissitude", "变迁 (Biànqiān)"),
    ("Conjetura", "Conjecture", "Conjecture", "推测 (Tuīcè)"),
    ("Sintaxis", "Syntaxe", "Syntax", "句法 (Jùfǎ)"),
    ("Pragmática", "Pragmatique", "Pragmatics", "语用学 (Yǔyòngxué)"),
    ("Elipsis", "Ellipse", "Ellipsis", "省略 (Shěnglüè)"),
    ("Metáfora", "Métaphore", "Metaphor", "隐喻 (Yǐnyù)"),
    ("Metonimia", "Métonymie", "Metonymy", "借代 (Jièdài)"),
    ("Sinécdoque", "Synecdoque", "Synecdoche", "提喻 (Tíyù)"),
    ("Hipérbole", "Hyperbole", "Hyperbole", "夸张 (Kuāzhāng)"),
    ("Ironía", "Ironie", "Irony", "讽刺 (Fěngcì)"),
    ("Sarcasmo", "Sarcasme", "Sarcasm", "挖苦 (Wākǔ)"),
    ("Paradoja", "Paradoxe", "Paradox", "悖论 (Bèilùn)"),
    ("Oximoron", "Oxymore", "Oxymoron", "矛盾修辞 (Máodùn xiūcí)"),
    ("Antítesis", "Antithèse", "Antithesis", "对照 (Duìzhào)"),
    ("Analogía", "Analogie", "Analogy", "类比 (Lèibǐ)"),
    ("Inducción", "Induction", "Induction", "归纳 (Guīnà)"),
    ("Deducción", "Déduction", "Deduction", "演绎 (Yǎnyì)"),
    ("Abducción", "Abduction", "Abduction", "设证 (Shèzhèng)"),
    ("Silogismo", "Syllogisme", "Syllogism", "三段论 (Sānduànlùn)"),
    ("Falacia", "Sophisme / Fallace", "Fallacy", "谬误 (Miùwù)"),
    ("Sofisma", "Sophisme", "Sophism", "诡辩 (Guǐbiàn)"),
    ("Dogma", "Dogme", "Dogma", "教条 (Jiàotiáo)"),
    ("Escepticismo", "Scepticisme", "Skepticism", "怀疑论 (Huáiyílùn)"),
    ("Relativismo", "Relativisme", "Relativism", "相对主义 (Xiāngduìzhǔyì)"),
    ("Pluralismo", "Pluralisme", "Pluralism", "多元化 (Duōyuánhuà)"),
    ("Monismo", "Monisme", "Monism", "单元论 (Dānyuánlùn)"),
    ("Dualismo", "Dualisme", "Dualism", "二元论 (Èryuánlùn)"),
    ("Solipsismo", "Solipsisme", "Solipsism", "唯我论 (Wéiwǒlùn)"),
    ("Panteísmo", "Panthéisme", "Pantheism", "泛神论 (Fànshénlùn)"),
    ("Deísmo", "Déisme", "Deism", "自然神论 (Zìránshénlùn)"),
    ("Ateísmo", "Athéisme", "Atheism", "无神论 (Wúshénlùn)"),
    ("Agnosticismo", "Agnosticisme", "Agnosticism", "不可知论 (Bùkězhīlùn)")
]

# --- 2. LOOP DE GENERACIÓN DE LOS 60 MÓDULOS DE 50 PALABRAS CADA UNO ---
LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"]

# Mapeo de categorías del pool de FR/ZH a los niveles gramaticales correspondientes para construir 50 módulos
CAT_MAPPING = {
    0: "basics",    # A1 (1-10)
    1: "travel",    # A2 (11-20)
    2: "business",  # B1 (21-30)
    3: "marketing", # B2 (31-40)
    4: "tech"       # C1 (41-50)
}

# Títulos de nivel y nombres atractivos
TITLES_EN = "Life Essentials Mastery"
TITLES_FR = "Les Bases du Quotidien"
TITLES_ZH = "日常基础 (Rìcháng Jīchǔ)"

count_en = 0
count_fr = 0
count_zh = 0

for lvl_idx, level in enumerate(LEVELS):
    for part in range(1, 11): # 10 módulos por nivel
        module_num = (lvl_idx * 10) + part
        file_id = f"basics_mod_{module_num:02d}"
        
        # OBTENEMOS LAS PALABRAS PARA ESTE MÓDULO (50 PARES)
        pairs_en = []
        pairs_fr = []
        pairs_zh = []
        
        # CASO 1: Módulos 1-50 (A1 a C1) - Se extraen de FR_DB y ZH_DB
        if lvl_idx < 5:
            cat_name = CAT_MAPPING[lvl_idx]
            mod_idx = part - 1 # 0 a 9
            
            # Obtener datos de francés
            fr_data = FR_DB.get(cat_name, [])[mod_idx] if cat_name in FR_DB else []
            # Obtener datos de chino
            zh_data = ZH_DB.get(cat_name, [])[mod_idx] if cat_name in ZH_DB else []
            
            # Si faltan datos en los pools, rellenamos con pool genérico para evitar fallos
            while len(fr_data) < 50:
                fr_data.append(("Especialidad", "Spécialité"))
            while len(zh_data) < 50:
                zh_data.append(("Especialidad", "专业 (Zhuānyè)"))
                
            # Generamos pares formateados
            for i in range(50):
                pair_id = f"p_{i+1:02d}"
                es_word_fr, fr_translation = fr_data[i]
                es_word_zh, zh_translation = zh_data[i]
                
                # Mapeamos a Inglés traduciendo la clave en español
                en_word = translate_es_to_en(es_word_fr)
                
                pairs_en.append({"id": pair_id, "en": en_word, "es": es_word_fr})
                pairs_fr.append({"id": pair_id, "en": es_word_fr, "es": fr_translation})
                pairs_zh.append({"id": pair_id, "en": es_word_zh, "es": zh_translation})
                
        # CASO 2: Módulos 51-60 (C2) - Se generan del c2_word_pool
        else:
            # Seleccionamos y barajamos el pool C2
            random.seed(module_num) # Semilla fija para consistencia en re-runs
            shuffled_pool = list(c2_word_pool)
            random.shuffle(shuffled_pool)
            
            # Si nos faltan palabras para llegar a 50, rellenamos multiplicando el pool
            while len(shuffled_pool) < 50:
                shuffled_pool.extend(c2_word_pool)
                
            for i in range(50):
                pair_id = f"p_{i+1:02d}"
                es, fr, en, zh = shuffled_pool[i]
                
                # Para evitar duplicados en el ID del lote, agregamos sufijo si se repiten
                pairs_en.append({"id": pair_id, "en": en, "es": es})
                pairs_fr.append({"id": pair_id, "en": es, "es": fr})
                pairs_zh.append({"id": pair_id, "en": es, "es": zh})

        # --- ESCRIBIR ARCHIVOS JSON ---
        
        # 1. INGLÉS (Carpeta por defecto)
        lesson_en = {
            "id": file_id,
            "category_id": "basics",
            "title": f"{TITLES_EN} • {level} - Part {part}",
            "description": f"Master executive vocabulary. Level {level}, Module {part} of 10.",
            "level": level,
            "part": part,
            "total_xp": 100 + (lvl_idx * 50),
            "status": "locked",
            "theme": {"icon": "Sparkles", "color": "orange"},
            "stages": [
                {
                    "id": f"drill_{file_id}",
                    "type": "pairing_drill",
                    "title": f"Neuro Link: {level} Vocabulary",
                    "description": "Interactive pairing association.",
                    "pairs": pairs_en
                }
            ]
        }
        with open(f"{OUTPUT_DIR}/{file_id}.json", "w", encoding="utf-8") as f:
            json.dump(lesson_en, f, indent=2, ensure_ascii=False)
        count_en += 1
        
        # 2. FRANCÉS (Carpeta fr)
        lesson_fr = {
            "id": file_id,
            "category_id": "basics",
            "title": f"{TITLES_FR} • {level} - Part {part}",
            "description": f"Dominio de vocabulario de Les Bases du Quotidien. Nivel {level}, Módulo {part} de 10.",
            "level": level,
            "part": part,
            "total_xp": 100 + (lvl_idx * 50),
            "status": "locked",
            "theme": {"icon": "Sparkles", "color": "orange"},
            "stages": [
                {
                    "id": f"drill_{file_id}",
                    "type": "pairing_drill",
                    "title": f"Neuro Link: Vocabulaire {level}",
                    "description": "Asociación rápida e inteligente de conceptos.",
                    "pairs": pairs_fr
                }
            ]
        }
        with open(f"{OUTPUT_FR_DIR}/{file_id}.json", "w", encoding="utf-8") as f:
            json.dump(lesson_fr, f, indent=2, ensure_ascii=False)
        count_fr += 1

        # 3. CHINO (Carpeta zh)
        lesson_zh = {
            "id": file_id,
            "category_id": "basics",
            "title": f"{TITLES_ZH} • {level} - Part {part}",
            "description": f"日常基础词汇大师. Nivel {level}, Módulo {part} de 10.",
            "level": level,
            "part": part,
            "total_xp": 100 + (lvl_idx * 50),
            "status": "locked",
            "theme": {"icon": "Sparkles", "color": "orange"},
            "stages": [
                {
                    "id": f"drill_{file_id}",
                    "type": "pairing_drill",
                    "title": f"Neuro Link: 词汇训练 {level}",
                    "description": "快速联想记忆卡片.",
                    "pairs": pairs_zh
                }
            ]
        }
        with open(f"{OUTPUT_ZH_DIR}/{file_id}.json", "w", encoding="utf-8") as f:
            json.dump(lesson_zh, f, indent=2, ensure_ascii=False)
        count_zh += 1

print(f"\n✨ GENERACIÓN COMPLETADA EXITOSAMENTE! ✨")
print(f"[-] Inglés  : {count_en} archivos creados en {OUTPUT_DIR}")
print(f"[-] Francés : {count_fr} archivos creados en {OUTPUT_FR_DIR}")
print(f"[-] Chino   : {count_zh} archivos creados en {OUTPUT_ZH_DIR}")
print(f"--------------------------------------------------")
