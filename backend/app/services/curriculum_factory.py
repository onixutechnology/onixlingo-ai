import os
import json
import logging
import warnings
from typing import Dict, Any, List

# Suppress FutureWarning from deprecated google.generativeai package
warnings.filterwarnings("ignore", category=FutureWarning, module="google.generativeai")

try:
    import google.generativeai as genai
    _GENAI_AVAILABLE = True
except ImportError:
    genai = None  # type: ignore
    _GENAI_AVAILABLE = False

try:
    from app.core.settings import settings as _app_settings
except Exception:
    _app_settings = None  # type: ignore

logger = logging.getLogger("OnixLingo.CurriculumFactory")

# Curriculum topics definition
TEMAS_A1 = [
    ("First Impressions", "Presentaciones básicas y saludos ejecutivos.", "hello"),
    ("The Office Desk", "Objetos de oficina y vocabulario de trabajo elemental.", "desk"),
    ("Daily Routines", "Hábitos de productividad diarios.", "work"),
    ("Telling Time", "Programación de horarios simples.", "clock"),
    ("Numbers & Prices", "Cálculos básicos de costos y dinero.", "dollars"),
    ("Simple Directions", "Ubicación física en las oficinas.", "left"),
    ("Meeting the Team", "Estructura jerárquica básica del equipo.", "manager"),
    ("Food & Drink", "Ordenar alimentos en almuerzos de negocios rápidos.", "coffee"),
    ("Business Travel Basics", "Logística elemental de aeropuertos.", "ticket"),
    ("Hotel Check-in", "Registrarse en recepciones de hotel.", "room"),
    ("Writing Simple Emails", "Saludos y firmas de correo ejecutivo.", "email"),
    ("Describing a Product", "Adjetivos simples de productos.", "good"),
    ("Office Supplies", "Inventario y existencias básicas de papelería.", "paper"),
    ("Calendars & Dates", "Días de la semana y meses de negocios.", "monday"),
    ("Basic Phone Skills", "Atender llamadas y tomar notas elementales.", "phone"),
    ("Weekly Review", "Revisión rápida de tareas realizadas.", "done"),
    ("Personal Strengths", "Habilidades básicas de presentación personal.", "organized"),
    ("The Working Week", "Diferenciar entre días laborales y fin de semana.", "week"),
    ("Making Appointments", "Agendar reuniones de uno a uno.", "meet"),
    ("Client Introductions", "Presentar a un colega con un cliente.", "intro"),
    ("Talking about Weather", "Romper el hielo de manera elemental.", "weather"),
    ("Company Profile", "Describir el sector y tamaño básico de la empresa.", "company"),
    ("At the Bank", "Transacciones y pagos simples.", "bank"),
    ("Emergency Basics", "Reportar incidentes sencillos de oficina.", "help"),
    ("Job Titles", "Nombres de puestos en el organigrama corporativo.", "director"),
    ("Socializing at Work", "Conversar con compañeros en la cafetería.", "family"),
    ("IT Support Basics", "Describir problemas simples de computadora.", "computer"),
    ("Office Layout", "Zonas comunes de la oficina.", "layout"),
    ("Simple Orders", "Solicitudes directas a proveedores.", "order"),
    ("Commuting to Work", "Medios de transporte diarios.", "subway"),
    ("Company History", "Hablar de la fundación en pasado simple elemental.", "history"),
    ("Basic Agreements", "Aceptar y rechazar propuestas sencillas.", "agree"),
    ("Office Rules", "Políticas elementales de vestimenta y conducta.", "rules"),
    ("Review Milestone A", "Consolidación de todo el vocabulario del Nivel A.", "summary"),
    ("Office Stationery", "Vocabulario básico para herramientas de escritura y papelería.", "pen"),
    ("Ergonomic Chair", "Discussing office furniture and comfortable seating.", "chair"),
    ("Midday Break", "Vocabulario esencial para ordenar almuerzos rápidos.", "lunch"),
    ("Daily Schedule", "Organización y lectura de horarios básicos de trabajo.", "time"),
    ("Creating an Agenda", "Cómo enlistar los puntos a tratar en una reunión.", "agenda"),
    ("Writing a Note", "Dejar recordatorios breves en el escritorio de un colega.", "note"),
    ("File Cabinet", "Organización física de carpetas y documentos.", "folder"),
    ("Answering Calls", "Tomar mensajes de voz sencillos en el teléfono de la oficina.", "telephone"),
    ("Sending Emails", "Estructura básica para enviar correos rápidos.", "send"),
    ("Receiving a Reply", "Checking your inbox for simple confirmations.", "reply"),
    ("Document Security", "Almacenar archivos confidenciales de forma segura.", "safe"),
    ("Office Windows", "Describir el entorno físico de la oficina.", "window"),
    ("Water Cooler Talk", "Conversaciones casuales y breves de pasillo.", "water"),
    ("Afternoon Tea", "Breve descanso para recargar energías.", "tea"),
    ("Lunchbox Choices", "Healthy options for eating at the workplace.", "lunchbox"),
    ("Short Break", "Managing small pauses during high-productivity hours.", "snack"),
    ("Team Sync", "Short standing meetings to align daily tasks.", "sync"),
    ("Arriving at Work", "Describing your morning commute and arrival times.", "arrive"),
    ("Departing the Office", "Saying goodbye to colleagues at the end of the day.", "depart"),
    ("Starting a Project", "First steps and simple discussions about new tasks.", "start"),
    ("Finishing Tasks", "How to report that a daily assignment is completed.", "finish"),
    ("Weekly Report", "Simple summary of your accomplishments.", "report"),
    ("Making Copies", "Using the office printer and copier machines.", "copy"),
    ("Desktop Screen", "Describing your computer monitor and setup.", "screen"),
    ("Keyboard Shortcuts", "Basic typing skills to save time at work.", "keyboard"),
    ("Internet Access", "Simple phrases to report connection issues.", "internet"),
    ("Login Credentials", "Setting up passwords and usernames securely.", "login"),
    ("Access Denied", "Reporting IT blockages and login errors.", "password"),
    ("Office Table", "Arranging physical desks for collaborative work.", "table"),
    ("Taxi Dispatch", "Ordering transportation for local business visits.", "taxi"),
    ("Train Station", "Navigating public transit for your daily commute.", "train"),
    ("Bus Stop", "Understanding public bus routes near the office.", "bus"),
    ("Hotel Reservation", "Simple vocabulary to confirm a room booking.", "hotel"),
    ("Passport Control", "Basic travel logistics at international borders.", "passport"),
    ("Flight Boarding", "Understanding airport gate announcements.", "gate"),
    ("Office Keys", "Requesting access badges and physical keys.", "key"),
    ("Meeting Rooms", "Booking empty spaces for team discussions.", "boardroom"),
    ("Coffee Machine", "How to make or order coffee in the lounge.", "coffeemaker"),
    ("Desk Organizer", "Keeping your working area clean and tidy.", "organizer"),
    ("Writing Tools", "Basic office supplies for drafting diagrams.", "pencil"),
    ("Notebook Entry", "Jotting down quick ideas during a presentation.", "notebook"),
    ("Sticky Notes", "Color-coded reminders for short-term tasks.", "sticker"),
    ("Calculator Tools", "Basic math operations for daily cost estimation.", "calculator"),
    ("Office Clock", "Checking elapsed time during business meetings.", "wallclock"),
    ("Visitor Badge", "Registering external guests at the lobby.", "visitor"),
    ("Parking Space", "Asking for corporate parking permits and spots.", "parking"),
    ("Elevator Floor", "Navigating high-rise office buildings.", "elevator"),
    ("First Aid Kit", "Locating emergency medical supplies at work.", "bandage"),
    ("Office Air", "Adjusting temperature and ventilation controls.", "fan"),
    ("Lunch Menu", "Reading cafeteria options and selecting dishes.", "menu"),
    ("Payment Receipt", "Asking for simple bills and transaction vouchers.", "receipt"),
    ("Store Purchase", "Buying urgent equipment for a presentation.", "purchase"),
    ("Desk Lamp", "Ensuring proper lighting at your workspace.", "lamp"),
    ("Trash Disposal", "Simple recycling policies and waste bins.", "bin"),
    ("Corporate Mug", "Branded items and simple office kitchen supplies.", "mug"),
    ("Laptop Charger", "Reporting low battery and power issues.", "charger"),
    ("Headphone Jack", "Using audio gear for virtual conference calls.", "audio"),
    ("Team Photo", "Building workplace memories and simple events.", "photo"),
    ("Clean Desk", "Basic hygiene and maintenance of work areas.", "clean"),
    ("Office Plant", "Describing green spaces that improve productivity.", "plant"),
    ("Wall Calendar", "Tracking upcoming holidays and corporate events.", "calendar"),
    ("Briefcase Item", "Essential tools you bring to work every day.", "bag"),
    ("Filing Reports", "Organizing paper files in structured categories.", "file"),
    ("Welcome Desk", "Greeting visitors at the main reception area.", "lobby"),
    ("Snack Bar", "Selecting quick food items between meetings.", "fruit"),
    ("Closing Hour", "Final procedures before locked doors at night.", "lock"),
    ("Personal Greetings", "Saludos informales entre compañeros.", "greetings"),
    ("Saying Thank You", "Expresiones de gratitud en la oficina.", "thanks"),
    ("Introducing Others", "Presentar a un nuevo compañero de equipo.", "introduce"),
    ("The Office Building", "Partes principales del edificio corporativo.", "building"),
    ("My Workstation", "Describir tu cubículo y herramientas personales.", "computer"),
    ("Simple Requests", "Pedir favores sencillos a un colega.", "please"),
    ("The Company Cafeteria", "Vocabulario de comida y almuerzos en la cafetería.", "lunch"),
    ("Talking about Family", "Romper el hielo hablando de tu familia en el descanso.", "family"),
    ("Weekend Plans", "Preguntar y contar qué harás el fin de semana.", "weekend"),
    ("Basic Colors", "Describir colores de carpetas y productos.", "colors"),
    ("Office Furniture", "Mobiliario básico del espacio de trabajo.", "chair"),
    ("A Regular Day", "Describir un día ordinario en la oficina.", "day"),
    ("Taking a Message", "Tomar recados telefónicos sencillos.", "message"),
    ("Asking for Help", "Cómo pedir asistencia básica a un compañero.", "help"),
    ("Making Tea", "Ofrecer té o bebidas calientes a un cliente.", "tea"),
    ("Going to Lunch", "Acordar una hora para ir a comer con colegas.", "eat"),
    ("The Copy Room", "Vocabulario sobre copias, escáner e impresora.", "copy"),
    ("Receiving Visitors", "Dar la bienvenida a un cliente en recepción.", "visitor"),
    ("Simple Weather", "Romper el hielo hablando del clima del día.", "weather"),
    ("Company Logo", "Describir los colores y formas del logo de la empresa.", "logo"),
    ("Asking for the Time", "Preguntar qué hora es educadamente.", "time"),
    ("Using a Map", "Navegar el mapa de la oficina o el campus.", "map"),
    ("A Clean Workspace", "Mantener limpio y ordenado tu escritorio.", "clean"),
    ("Taking the Bus", "Rutas y horarios del transporte público a la oficina.", "bus"),
    ("A Business Lunch", "Ordenar comida sencilla en una comida de negocios.", "restaurant"),
    ("Ordering Coffee", "Cómo pedir tu tipo de café favorito en la cafetería.", "coffee"),
    ("The Office Kitchen", "Elementos comunes de la cocina de la oficina.", "kitchen"),
    ("Writing a Sticky Note", "Dejar una nota recordatoria a un colega.", "note"),
    ("Confirming a Time", "Confirmar la hora de una cita simple.", "confirm"),
    ("Saying Goodbye", "Despedirse al final del día laboral.", "goodbye"),
    ("Describing a Coworker", "Adjetivos simples para describir a tus compañeros.", "person"),
    ("The Mailroom", "Recibir y enviar paquetes y cartas.", "mail"),
    ("Simple Calculations", "Sumar y restar cifras de costos elementales.", "math"),
    ("Finding a Pen", "Pedir prestados bolígrafos u hojas de papel.", "pen"),
    ("The Conference Room", "Ubicación y reserva de salas de juntas sencillas.", "room"),
    ("Checking the Calendar", "Verificar días festivos y juntas en tu agenda.", "calendar"),
    ("The Company Website", "Navegación y secciones básicas de la web corporativa.", "website"),
    ("My Daily Tasks", "Una lista simple de lo que debes hacer hoy.", "tasks"),
    ("Arriving Early", "La importancia de la puntualidad y cómo reportar retrasos.", "punctual"),
    ("Leaving the Office", "Pasos sencillos antes de cerrar el cubículo.", "leave"),
    ("Office Hobbies", "Conversar sobre pasatiempos comunes con el equipo.", "hobbies"),
    ("A Good Job", "Felicitar a un compañero por su trabajo sencillo.", "praise"),
    ("Answering a Call", "Frases estándar al contestar el teléfono.", "phone"),
    ("IT Setup", "Vocabulario básico de teclado, mouse y pantalla.", "setup"),
    ("The Office Lounge", "Espacios de descanso y relajación corporativos.", "lounge"),
    ("Buying a Ticket", "Comprar boletos de metro o tren local.", "ticket"),
    ("Paying in Cash", "Vocabulario de billetes y monedas.", "cash"),
    ("A Simple Report", "Redactar una oración corta de estatus.", "report"),
    ("The Company Name", "Explicar el nombre y origen de la empresa.", "name"),
    ("Saying Sorry", "Disculparse por un error menor sin importancia.", "sorry"),
    ("Meeting a Friend", "Planes sencillos después del horario laboral.", "friends"),
    ("The Parking Permit", "Solicitar acceso al estacionamiento de la empresa.", "parking"),
    ("My Job Title", "Explicar tu puesto a personas fuera de la empresa.", "job"),
    ("Office Outfits", "Vestimenta corporativa y días casuales.", "clothes"),
    ("Healthy Snacks", "Elegir opciones saludables de comida en la oficina.", "healthy"),
    ("A Cold Drink", "Pedir agua o refrescos en una reunión.", "drink"),
    ("Working in a Team", "Conceptos muy simples de colaboración.", "team"),
    ("Using a Calculator", "Hacer cuentas de viáticos sencillas.", "calculator"),
    ("The Welcome Sign", "Letreros de bienvenida y direcciones.", "sign"),
    ("An Office Birthday", "Felicitar a un colega y comer pastel.", "birthday"),
    ("A New Computer", "Describir el desempaque de tu equipo nuevo.", "computer"),
    ("The Office Elevator", "Preguntar por el piso correcto de una oficina.", "elevator"),
    ("Writing a Checklist", "Hacer listas de control para tareas diarias.", "checklist"),
    ("The Office Desk Lamp", "Ajustar la iluminación de tu mesa de trabajo.", "light"),
    ("Talking about Sports", "Romper el hielo comentando el partido de ayer.", "sports"),
    ("A Simple Question", "Cómo formular preguntas cortas a tu supervisor.", "question"),
    ("Finding a File", "Buscar una carpeta en el gabinete físico o digital.", "file"),
    ("A Quick Call", "Agendar una llamada corta de 5 minutos.", "call"),
    ("Using the Internet", "Vocabulario de conexión y páginas web.", "internet"),
    ("The Reception Area", "Esperar a un anfitrión en la sala de espera.", "waiting"),
    ("Office Safety Drill", "Instrucciones de evacuación muy básicas.", "drill"),
    ("A Quiet Room", "Buscar un espacio sin ruido para concentrarte.", "quiet"),
    ("Checking the Weather", "Verificar si lloverá antes de salir de la oficina.", "rain"),
    ("My Office Hours", "Explicar tu horario de entrada y salida.", "hours"),
    ("A Beautiful View", "Describir el paisaje desde la ventana de la oficina.", "view"),
    ("A Good Colleague", "Agradecer el apoyo diario de un compañero.", "friendship"),
    ("The Snack Machine", "Comprar galletas o papas en la máquina expendedora.", "vendor"),
    ("An Empty Desk", "Organizar una estación de trabajo que no se usa.", "empty"),
    ("The Office Printer", "Cargar papel o cambiar cartucho de tóner.", "toner"),
    ("A Perfect Presentation", "Felicitaciones simples por un buen speech.", "congrats"),
    ("Using the Notebook", "Escribir apuntes durante una inducción.", "notes"),
    ("The Company Anniversary", "Celebrar los años de éxito de la empresa.", "anniversary"),
    ("The Employee ID", "El uso del gafete de identificación obligatorio.", "badge"),
    ("A Short Message", "Enviar un mensaje de texto rápido a un colega.", "sms"),
    ("Office Schedule", "Días festivos y puentes laborales del año.", "holidays"),
    ("The Office Carpet", "Vocabulario para describir el espacio físico de trabajo.", "decor"),
    ("A Great Product", "Adjetivos positivos para el producto de la empresa.", "best"),
    ("Finding a Chair", "Pedir prestada una silla para una visita corta.", "seat"),
    ("A Hot Afternoon", "Ajustar el aire acondicionado en la oficina.", "ac"),
    ("Receiving Mail", "Firmar de recibido para un paquete de mensajería.", "delivery"),
    ("Office Dictionary", "Aprender términos en inglés usando el diccionario.", "dictionary"),
    ("An Easy Task", "Explicar que una actividad no requiere mucho esfuerzo.", "easy"),
    ("The Coffee Break", "Tomarse 10 minutos para recargar energías.", "break"),
    ("Using the Staircase", "Subir o bajar escaleras por salud.", "stairs"),
    ("A Clean Cup", "Lavar tu taza en el fregadero de la cocina.", "cup"),
    ("Meeting the Client", "Saludar con un apretón de manos formal simple.", "handshake"),
    ("Making Plans", "Acordar una hora para revisar un pendiente.", "plan"),
    ("The Office Door", "Instrucciones para abrir y cerrar con llave.", "door"),
    ("Review Milestone A1-Part 1", "Repaso general de la primera mitad del nivel A1.", "review1"),
    ("Review Milestone A1-Part 2", "Consolidación final de las 200 lecciones del nivel A1.", "capstone_a1")
]

TEMAS_A2 = [
    ("Office Supplies", "Inventario y existencias básicas de papelería.", "paper"),
    ("Calendars & Dates", "Días de la semana y meses de negocios.", "monday"),
    ("Basic Phone Skills", "Atender llamadas y tomar notas elementales.", "phone"),
    ("Weekly Review", "Revisión rápida de tareas realizadas.", "done"),
    ("Personal Strengths", "Habilidades básicas de presentación personal.", "organized"),
    ("The Working Week", "Diferenciar entre días laborales y fin de semana.", "week"),
    ("Making Appointments", "Agendar reuniones de uno a uno.", "meet"),
    ("Client Introductions", "Presentar a un colega con un cliente.", "intro"),
    ("Talking about Weather", "Romper el hielo de manera elemental.", "weather"),
    ("Company Profile", "Describir el sector y tamaño básico de la empresa.", "company"),
    ("IT Support Ticket", "Reportar un problema sencillo de software.", "ticket"),
    ("Office Stationery", "Herramientas de escritorio y papelería.", "pen"),
    ("Lunch Orders", "Ordenar alimentos para una reunión de equipo.", "lunch"),
    ("Visitor Registration", "Registrar a un cliente externo en la recepción.", "visitor"),
    ("Conference Room Booking", "Reservar una sala de juntas por correo.", "room"),
    ("Simple Travel Request", "Solicitar la aprobación de viáticos de viaje.", "travel"),
    ("Taxi Reservation", "Pedir transporte local para visitas de negocios.", "taxi"),
    ("Filing Documents", "Organización física y digital de expedientes.", "file"),
    ("Taking Simple Notes", "Anotar puntos clave durante una presentación.", "notes"),
    ("Using the Printer", "Resolver problemas comunes con la copiadora.", "printer"),
    ("Confirming Attendance", "Aceptar o declinar invitaciones de calendario.", "calendar"),
    ("Laptop Accessories", "Pedir mouse, teclado o cargador al área de TI.", "charger"),
    ("A Warm Welcome", "Dar la bienvenida a un consultor internacional.", "welcome"),
    ("Simple Workplace Rules", "Políticas de conducta y puntualidad.", "rules"),
    ("Describing a Project", "Explicar brevemente en qué estás trabajando hoy.", "project"),
    ("Checking the Inbox", "Clasificar correos por orden de prioridad.", "email"),
    ("Office Key Cards", "Solicitar reposición de tu gafete de acceso.", "badge"),
    ("Coffee and Tea Service", "Ofrecer hospitalidad en la sala de espera.", "coffee"),
    ("Asking for Directions", "Encontrar oficinas y departamentos en el edificio.", "directions"),
    ("Simple Tasks Status", "Informar si una tarea está completada o pendiente.", "status"),
    ("Ordering Lunch", "Ordenar comida rápida para comer en la oficina.", "order"),
    ("The Office Chair", "Ajustar la silla de tu cubículo por comodidad.", "chair"),
    ("A Short Break", "Tomar 5 minutos de descanso en medio de una tarea.", "break"),
    ("My Workspace", "Organizar tus papeles y plumas en la mesa.", "workspace"),
    ("Checking the Time", "Asegurar que llegas puntual a tu próxima llamada.", "time"),
    ("IT Password Reset", "Cambiar tu contraseña del correo corporativo.", "password"),
    ("Sending a Package", "Enviar muestras de producto por mensajería.", "package"),
    ("A Good Morning", "Saludar formalmente a tu equipo al entrar.", "morning"),
    ("Office Air Temperature", "Ajustar el aire acondicionado de la sala.", "ac"),
    ("Leaving Early", "Pedir permiso para salir antes por una cita médica.", "permission"),
    ("Simple Feedback", "Dar una sugerencia positiva a un compañero.", "feedback"),
    ("A New Keyboard", "Reportar que tu teclado no escribe bien.", "keyboard"),
    ("The Water Dispenser", "Encontrar el dispensador de agua potable.", "water"),
    ("Review Milestone A2-Part 1", "Repaso general de la primera parte de A2.", "review_a2_1"),
    ("Receiving a Call", "Contestar amablemente una llamada del conmutador.", "call"),
    ("Ordering Office Paper", "Pedir cajas de hojas para la impresora.", "paper"),
    ("The Meeting Agenda", "Escribir los puntos sencillos que trataremos.", "agenda"),
    ("A Fast Question", "Hacer una pregunta rápida en el canal de chat.", "chat"),
    ("Office Desk Cleanup", "Mantener ordenada tu mesa antes de irte.", "clean"),
    ("The Office Window", "Abrir la ventana para refrescar la oficina.", "window"),
    ("Booking a Taxi", "Agendar un taxi para el aeropuerto.", "cab"),
    ("The Lunch Box", "Usar el refrigerador común de la cocina.", "fridge"),
    ("Taking a Message", "Escribir un recado para tu jefe de parte de un cliente.", "message"),
    ("Finding a Marker", "Buscar marcadores para el pizarrón blanco.", "marker"),
    ("Working late", "Avisar que te quedarás una hora extra en la oficina.", "late"),
    ("A Visitor Card", "Dar un pase temporal a un proveedor externo.", "pass"),
    ("Office Noise", "Pedir amablemente bajar el volumen de la música.", "noise"),
    ("The Lunch Break", "Ir a comer al jardín o área de descanso.", "lunchbreak"),
    ("A Simple Email Draft", "Escribir un borrador rápido de correo.", "draft"),
    ("Confirming the Date", "Asegurar que la fecha de la cita es correcta.", "date"),
    ("The Coffee Mug", "Lavar tu taza en el fregadero común.", "mug"),
    ("Simple Greeting Card", "Felicitar a un compañero por su cumpleaños.", "card"),
    ("Ordering Snacks", "Comprar papas o galletas para una junta.", "snacks"),
    ("IT Screen Issue", "Pedir ayuda por una pantalla que parpadea.", "screen"),
    ("Office Door Lock", "Asegurar que la puerta esté bien cerrada.", "lock"),
    ("The Desktop View", "Cambiar el fondo de pantalla de tu computadora.", "desktop"),
    ("Office Safety Rules", "Ubicar los extintores y salidas de emergencia.", "safety"),
    ("Checking the Calendar", "Verificar si hay juntas agendadas hoy.", "calendar"),
    ("Ordering Tea", "Pedir té verde en lugar de café.", "tea"),
    ("A Short Email Reply", "Responder con un 'gracias' rápido a un correo.", "thanks"),
    ("Finding the Scissors", "Pedir prestadas tijeras o cinta adhesiva.", "scissors"),
    ("The Elevator Button", "Subir al quinto piso para la junta.", "elevator"),
    ("Checking the Weather", "Ver si necesitas paraguas al salir.", "weather"),
    ("A Good Presentation", "Felicitar a un compañero por sus diapositivas.", "slides"),
    ("Simple Calculations", "Calcular sumas sencillas de viáticos.", "numbers"),
    ("A Quick Reminder", "Enviar un recordatorio corto por mensaje.", "reminder"),
    ("The Office Carpet", "Cuidar la limpieza de los pasillos.", "carpet"),
    ("Asking for the Wi-Fi", "Pedir la clave de internet para tu teléfono.", "wifi"),
    ("The Welcome Desk", "Registrar tu hora de llegada en la entrada.", "lobby"),
    ("The Snack Machine", "Comprar agua en la máquina expendedora.", "vendor"),
    ("An Empty Room", "Buscar un sala libre para una llamada de 5 minutos.", "quiet"),
    ("Checking your Tasks", "Marcar como completada una tarea en tu lista.", "done"),
    ("The Desktop Mouse", "Reportar que tu mouse inalámbrico no tiene pilas.", "mouse"),
    ("The Office Kitchen", "Usar el horno de microondas para calentar tu comida.", "microwave"),
    ("Confirming a Appointment", "Asegurar que la cita sigue en pie.", "appointment"),
    ("Saying Goodbye", "Despedirse formalmente de tus compañeros al salir.", "goodbye"),
    ("The Mail Delivery", "Firmar de recibido para un paquete de DHL.", "mail"),
    ("Finding a Pencil", "Pedir prestado un lápiz con goma.", "pencil"),
    ("A Simple Project Plan", "Hacer una lista de los pasos del proyecto.", "plan"),
    ("Arriving Early", "La importancia de llegar 5 minutos antes.", "punctual"),
    ("Office Clothes", "Vestir adecuadamente según la política de la empresa.", "dress"),
    ("Ordering Pizza", "Comprar pizza para celebrar el fin de un proyecto.", "pizza"),
    ("The Air Fan", "Prender el ventilador si hace calor.", "fan"),
    ("A Hot Drink", "Preparar chocolate caliente en la cocina.", "chocolate"),
    ("The Meeting Minutes", "Anotar los acuerdos tomados en la junta.", "minutes"),
    ("Simple Office Decor", "Poner una pequeña planta en tu escritorio.", "plant"),
    ("The Employee Badge", "Mostrar tu gafete al policía de seguridad.", "badge"),
    ("The Office Calculator", "Hacer cuentas rápidas en tu escritorio.", "calculator"),
    ("Review Milestone A2-Part 2", "Repaso general de la segunda parte de A2.", "review_a2_2"),
    ("A2 Graduation Capstone", "Evaluación final del nivel A2 y graduación.", "graduation_a2"),
    ("Handling a Delay", "Cómo avisar a un cliente que llegarás 10 minutos tarde.", "delay"),
    ("Scheduling a Call", "Proponer dos opciones de horario para una llamada.", "schedule"),
    ("Requesting a File", "Pedir a un colega que te envíe un documento PDF.", "file"),
    ("Office Workspace Map", "Ubicar los cubículos de los jefes de departamento.", "map"),
    ("Simple Expense Report", "Llenar una plantilla sencilla de gastos de viaje.", "expenses"),
    ("Using the Headset", "Conectar tus audífonos para una llamada virtual.", "headset"),
    ("The Team Chat Channel", "Etiqueta al escribir mensajes grupales.", "slack"),
    ("Finding the Cafeteria", "Preguntar dónde comer fuera del edificio.", "restaurant"),
    ("Introducing a Guest", "Presentar a un proveedor con el recepcionista.", "introduce"),
    ("A Clear Explanation", "Explicar cómo funciona una herramienta sencilla.", "explain"),
    ("Confirming a Payment", "Avisar que ya se realizó una transferencia.", "payment"),
    ("Describing an Error", "Cómo reportar una pantalla azul de error en Windows.", "error"),
    ("Ordering Business Cards", "Pedir la impresión de tus tarjetas de presentación.", "cards"),
    ("Asking for Feedback", "Preguntar a tu supervisor si le gustó tu reporte.", "ask"),
    ("The Office Fridge Rules", "Mantener la limpieza del refrigerador común.", "fridge"),
    ("Making a Quick Draft", "Redactar las ideas principales de una carta.", "draft"),
    ("The Reception Lobby", "Esperar pacientemente a que bajen por ti.", "lobby"),
    ("A Polite Decline", "Rechazar una invitación a cenar de forma cortés.", "decline"),
    ("The Company Dress Code", "Diferencia entre ropa formal y casual de negocios.", "outfit"),
    ("IT Helpdesk Call", "Pedir soporte por teléfono para tu cuenta.", "helpdesk"),
    ("Office Desk Sharing", "Reglas sencillas de escritorios compartidos (hot-desking).", "desk"),
    ("A Good Collaboration", "Agradecer la ayuda en una tarea pesada.", "thanks"),
    ("Finding the Stairs", "Ubicar las escaleras de servicio y emergencia.", "stairs"),
    ("A Clean Cup", "Lavar tu taza de café al terminar tu turno.", "clean"),
    ("Confirming a Room", "Verificar si la sala de juntas está libre.", "room"),
    ("Saying Hello in Teams", "Frases de apertura en chats corporativos.", "hello"),
    ("The Mail Delivery Status", "Rastrear un paquete enviado por mensajería.", "tracking"),
    ("Asking for a Pencil", "Pedir prestada papelería básica en la oficina.", "stationery"),
    ("Simple Tasks Board", "Mover tarjetas de tareas en un tablero Trello.", "kanban"),
    ("Punctual Meeting Start", "Iniciar la junta a la hora exacta acordada.", "start"),
    ("Ordering Lunch Online", "Usar apps de comida para comer con el equipo.", "app"),
    ("The Office Chair Height", "Ajustar la ergonomía de tu silla de trabajo.", "seat"),
    ("The Desk Organizer", "Mantener tus plumas y clips ordenados.", "organizer"),
    ("A Great Presentation", "Felicitaciones de oficina a un orador.", "congrats"),
    ("A Hot Office Day", "Ajustar el termostato del aire acondicionado.", "climate"),
    ("Leaving the Office Early", "Avisar que saldrás temprano por un compromiso.", "leave"),
    ("The Parking Permit Card", "Cómo solicitar la tarjeta de acceso de auto.", "parking"),
    ("My Office Laptop", "Describir el desempaque y encendido de tu laptop.", "laptop"),
    ("Using the Calculator", "Sumar facturas de gastos menores.", "accounting"),
    ("The Safe Evacuation Plan", "Identificar las zonas de seguridad sísmica.", "plan"),
    ("Review Milestone A2-Part 3", "Repaso general de la tercera parte de A2.", "review_a2_3"),
    ("The Office Microwave", "Reglas de limpieza e higiene al calentar comida.", "microwave"),
    ("A Quick Reminder Email", "Enviar un correo corto de seguimiento.", "followup"),
    ("Office Simple Decoration", "Elegir fotos familiares para tu escritorio.", "family"),
    ("Checking the Calendar Dates", "Verificar las semanas del año laboral.", "weeks"),
    ("Ordering Office Tea", "Pedir té de manzanilla o limón en el descanso.", "tea"),
    ("Finding the Scissors", "Buscar herramientas de corte en la papelería.", "scissors"),
    ("The Office Elevator Floor", "Ubicar las oficinas de recursos humanos.", "floor"),
    ("Checking the Forecast", "Ver si lloverá para no mojar tus reportes.", "weather"),
    ("A Polite Conversation", "Romper el hielo de forma cortés en el elevador.", "icebreaker"),
    ("Simple Math Operations", "Calcular el total de una factura con impuestos.", "tax"),
    ("A Quick Note Draft", "Apuntar el número telefónico de un cliente.", "number"),
    ("The Office Carpet Clean", "Reportar si se derrama café en el pasillo.", "clean"),
    ("Asking for the Wi-Fi Password", "Conectar a la red de invitados de la oficina.", "wifi"),
    ("The Welcome Reception Sign", "Leer el letrero de bienvenida a las visitas.", "welcome"),
    ("The Snack Vending Machine", "Comprar unas galletas en la tarde.", "snack"),
    ("An Empty Meeting Room", "Ver si una sala chica está libre para zoom.", "room"),
    ("Checking Completed Tasks", "Marcar como listos tus pendientes semanales.", "tasks"),
    ("The Desktop Mouse Batteries", "Pedir baterías nuevas al área de soporte.", "support"),
    ("The Office Kitchen Sink", "Mantener limpio el fregadero de la cocina.", "sink"),
    ("Confirming a Time Slot", "Preguntar si una hora le queda cómoda al cliente.", "timeslot"),
    ("Saying Goodbye to the Team", "Despedirse amablemente de los colegas.", "goodbye"),
    ("The Mail Package Received", "Confirmar la entrega de un paquete en la oficina.", "delivery"),
    ("Finding a Black Pen", "Pedir un bolígrafo de tinta negra para firmar.", "pen"),
    ("A Simple Tasks Outline", "Hacer un cronograma muy sencillo de actividades.", "outline"),
    ("Being Punctual in Calls", "Importancia de conectarse a tiempo a las llamadas.", "calls"),
    ("The Office Suit Outfit", "Días de vestimenta casual y formal corporativa.", "outfit"),
    ("Ordering Pizza for Success", "Festejar la meta mensual con pizza en la oficina.", "pizza"),
    ("The Air Fan Settings", "Ajustar la velocidad del ventilador de la oficina.", "air"),
    ("A Warm Hot Chocolate", "Preparar chocolate en los días de invierno.", "drink"),
    ("The Meeting Action Items", "Anotar quién hará cada tarea pendiente.", "actionable"),
    ("A Green Desk Plant", "Los beneficios de tener plantas en tu cubículo.", "green"),
    ("The Secure Access Badge", "El uso del gafete de identificación.", "badge"),
    ("The Office Math Calculator", "Hacer cuentas de presupuestos sencillos.", "calculator"),
    ("Finding the Fire Extinguisher", "Ubicar el extintor más cercano de tu mesa.", "extinguisher"),
    ("A Polite Reminder Note", "Dejar una nota recordatoria sobre una junta.", "note"),
    ("The Office Carpet Cleanliness", "La importancia de cuidar las áreas comunes.", "decor"),
    ("Asking for a Guest Pass", "Pedir pase de estacionamiento para tu cliente.", "pass"),
    ("The Snack Machine Operation", "Cómo pagar con tarjeta en la expendedora.", "payment"),
    ("A Quiet Work Corner", "Buscar un rincón libre para concentrarte mejor.", "quiet"),
    ("Checking your Agenda Items", "Revisar los puntos a tratar hoy en tu lista.", "list"),
    ("The Desktop Screen Flickering", "Pedir revisión técnica de tu monitor de oficina.", "monitor"),
    ("The Kitchen Microwave Clean", "Reglas sencillas de higiene con el microondas.", "hygiene"),
    ("A Quick Call Confirmation", "Asegurar que la llamada de 10 minutos sigue en pie.", "confirm"),
    ("Saying Hello to Co-workers", "Frases cordiales para iniciar la jornada laboral.", "hello"),
    ("The Mail Courier Tracking", "Revisar el estatus de un paquete enviado.", "courier"),
    ("Finding a Red Marker", "Pedir un marcador rojo para diagramas.", "stationery"),
    ("A Simple Tasks Checklist", "Hacer una lista de pendientes en tu libreta.", "checklist"),
    ("Being Early in Virtual Calls", "Conectarse un minuto antes a la sala de zoom.", "zoom"),
    ("The Casual Dress Code", "Qué vestir en los viernes de 'Casual Friday'.", "casual"),
    ("Ordering Lunch Delivery", "Coordinar una orden grupal de ensaladas.", "delivery"),
    ("The Office Seat Cushion", "Mejorar la comodidad física de tu silla.", "seat"),
    ("The Desk Accessories Box", "Guardar tus clips y ligas de oficina.", "box"),
    ("A Great Speech Congrats", "Felicitar a un compañero tras su oratoria.", "praise"),
    ("A Hot Office Climate", "Avisar que el aire acondicionado está fallando.", "hvac"),
    ("Leaving Early for Health", "Pedir permiso de salida para ir al dentista.", "health"),
    ("The Secure Access Gate", "Pasar el gafete en los torniquetes de entrada.", "gate"),
    ("The Office Math Sheet", "Sumar cifras de gastos de oficina sencillas.", "sheet"),
    ("Review Milestone A2-Part 4", "Repaso general final de la segunda mitad de A2.", "review_a2_4"),
    ("A2 Graduation Capstone Elite", "Examen de graduación del nivel A2 y paso a B1.", "graduation_a2_elite")
]

TEMAS_B1 = [
    ("Leading a Team Sync", "Cómo estructurar juntas operativas semanales.", "moderator"),
    ("Negotiation Skills 101", "Conceptos básicos para cerrar acuerdos.", "offer"),
    ("Formal Email Writing", "Uso de conectores lógicos profesionales.", "formal"),
    ("Strategic Scheduling", "Negociar horarios de juntas globales.", "timezone"),
    ("Project Milestones", "Definición y seguimiento de entregables.", "milestone"),
    ("Giving Feedback", "Metodologías de feedback constructivo.", "feedback"),
    ("Describing Data Trends", "Comparación de gráficos y estadísticas.", "increase"),
    ("Handling Client Objections", "Fórmulas de diplomacia ejecutiva.", "client"),
    ("Job Interviews", "Responder preguntas de comportamiento laboral.", "experience"),
    ("Business Trip Logistics", "Coordinación avanzada de itinerarios.", "flight"),
    ("Marketing Strategy", "Estudio de las 4Ps del marketing.", "strategy"),
    ("Budget Planning", "Estructuración de presupuestos anuales.", "budget"),
    ("Tech Support Mastery", "Solución guiada de incidentes de IT.", "reboot"),
    ("Corporate Values", "Definición de visión, misión y ética corporativa.", "integrity"),
    ("Phone Etiquette", "Manejar transferencias y llamadas complejas.", "transfer"),
    ("Apologizing Professionally", "Redacción de disculpas formales ante fallos.", "apologize"),
    ("Conflict Resolution", "Herramientas de mediación y empatía corporativa.", "conflict"),
    ("Strategic Outsourcing", "Evaluación de proveedores externos.", "vendor"),
    ("Product Launch", "Estrategia Go-to-Market.", "launch"),
    ("Supply Chain Basics", "Logística y flujo de mercancías.", "inventory"),
    ("Customer Satisfaction", "Métricas NPS y análisis de reseñas.", "satisfaction"),
    ("Time Management", "Priorización de tareas urgentes vs importantes.", "prioritize"),
    ("Strategic Benchmarking", "Comparar rendimientos contra competidores.", "benchmark"),
    ("Contract Negotiations", "Revisión de términos clave en contratos.", "contract"),
    ("Risk Assessment", "Identificar amenazas de operación básicas.", "risk"),
    ("Equity & Shares", "Introducción al financiamiento corporativo.", "shares"),
    ("Virtual Meetings", "Comandos verbales para Zoom/Teams.", "mute"),
    ("Professional Networking", "Discursos de elevador y conexiones en LinkedIn.", "networking"),
    ("Market Research", "Análisis DAFO/SWOT en inglés.", "research"),
    ("Talent Acquisition", "Políticas de reclutamiento y onboarding.", "hiring"),
    ("Sales Pitch Mastery", "Técnicas de venta directa y persuasión.", "pitch"),
    ("Office Ergonomics", "Salud ocupacional y productividad.", "posture"),
    ("Review Milestone B", "Evaluación de competencias gerenciales del Nivel B.", "progress"),
    ("Project Milestone Sync", "Definición y seguimiento de entregables específicos.", "schedules"),
    ("Constructive Feedback", "Metodologías de feedback para el desarrollo del equipo.", "constructive"),
    ("Data Interpretation", "Análisis de gráficos de barras y tendencias.", "trends"),
    ("Client Objections", "Manejo de objeciones comerciales con tacto profesional.", "objections"),
    ("Executive Scheduling", "Negociación de agendas y zonas horarias en juntas.", "schedulezone"),
    ("Action Items", "Asignación clara de tareas pendientes tras una reunión.", "actionable"),
    ("Status Update", "Presentar avances en el desarrollo de un proyecto.", "update"),
    ("Product Demo", "Presentar las características y beneficios de un software.", "demonstrate"),
    ("Customer Care", "Políticas de servicio al cliente y resolución de quejas.", "support"),
    ("Service Level Agreement", "Introducción a los contratos de nivel de servicio SLA.", "standards"),
    ("Inventory Auditing", "Control periódico de stock y materias primas.", "stock"),
    ("Market Analysis", "Estudiar la competencia y demanda de un producto.", "market"),
    ("Brand Strategy", "Desarrollo de identidad y posicionamiento de marca.", "branding"),
    ("Sales Pipeline", "Etapas de conversión de leads en clientes reales.", "pipeline"),
    ("Lead Generation", "Estrategias para atraer clientes potenciales.", "prospect"),
    ("Operational Efficiency", "Reducción de cuellos de botella en la producción.", "efficiency"),
    ("Capacity Planning", "Estimación de recursos y mano de obra necesaria.", "capacity"),
    ("Corporate Ethics", "Políticas internas anticorrupción y de transparencia.", "ethical"),
    ("Sustainable Office", "Iniciativas para reducir la huella de carbono laboral.", "green"),
    ("Safety Protocols", "Normas de seguridad ocupacional en la planta.", "safety"),
    ("Stress Management", "Técnicas de bienestar corporativo y productividad.", "wellness"),
    ("Creative Brainstorm", "Generación colectiva de ideas innovadoras.", "ideation"),
    ("Task Delegation", "Cómo asignar responsabilidades según habilidades.", "delegate"),
    ("Goal Alignment", "Sincronizar metas individuales con las corporativas.", "alignment"),
    ("Project Budget", "Estructurar costos y gastos de una campaña.", "costs"),
    ("Cost Allocation", "Distribución de gastos entre diferentes áreas.", "expenses"),
    ("Revenue Streams", "Identificar las fuentes principales de ingresos.", "income"),
    ("Pricing Model", "Estrategias de precios según la demanda del mercado.", "pricing"),
    ("Launch Timeline", "Cronograma estratégico para un nuevo producto.", "timelines"),
    ("Outsourcing Risks", "Ventajas y riesgos de contratar servicios externos.", "outsourcer"),
    ("Employee Attrition", "Análisis de rotación de personal y retención.", "turnover"),
    ("Onboarding Guide", "Integración efectiva de nuevos talentos al equipo.", "onboard"),
    ("Skills Matrix", "Evaluación de competencias dentro de un departamento.", "skills"),
    ("Corporate Culture", "Valores y hábitos de convivencia en la organización.", "culture"),
    ("Mentorship Program", "Guía y desarrollo de profesionales junior.", "mentor"),
    ("Conflict Mediation", "Resolución diplomática de tensiones internas.", "mediation"),
    ("Agile Framework", "Introducción a la metodología Scrum en proyectos.", "scrum"),
    ("Sprint Planning", "Juntas de planeación de tareas a corto plazo.", "sprint"),
    ("Daily Standup", "Reuniones cortas diarias para actualizar avances.", "standup"),
    ("Performance Review", "Evaluación de KPIs y cumplimiento de objetivos.", "appraisal"),
    ("Career Pathing", "Estructuración de planes de crecimiento interno.", "promotion"),
    ("Remote Collaboration", "Herramientas y etiqueta para el trabajo en casa.", "remote"),
    ("Virtual Tools", "Uso eficiente de plataformas de videoconferencia.", "zoom"),
    ("Email Netiquette", "Reglas no escritas de la correspondencia formal.", "etiquette"),
    ("Pitch Deck Basics", "Estructura de diapositivas para convencer inversores.", "deck"),
    ("Elevator Speech", "Presentación de tu proyecto en menos de un minuto.", "concise"),
    ("Networking Events", "Cómo romper el hielo y construir contactos valiosos.", "contacts"),
    ("Business Cards", "Intercambio de datos e información de contacto.", "card"),
    ("LinkedIn Branding", "Optimización del perfil profesional en redes.", "profile"),
    ("Survey Analysis", "Diseño e interpretación de encuestas de satisfacción.", "survey"),
    ("NPS Score", "Medición de lealtad de clientes mediante Net Promoter Score.", "promoter"),
    ("Customer Persona", "Perfil representativo del cliente ideal.", "persona"),
    ("User Experience", "Introducción al diseño centrado en el usuario.", "ux"),
    ("Quality Control", "Normas básicas de inspección y estándares ISO.", "quality"),
    ("Risk Mitigation", "Estrategias sencillas para evitar pérdidas en proyectos.", "mitigate"),
    ("Data Backup", "Políticas de resguardo de información crítica.", "backup"),
    ("IT Ticketing", "Reportar y dar seguimiento a fallas del sistema.", "ticketcode"),
    ("Software Update", "Programación de mantenimiento informático.", "patch"),
    ("Server Migration", "Traslado seguro de bases de datos locales.", "database"),
    ("Office Ergonomics Professional", "Diseño del espacio para evitar lesiones físicas.", "ergonomics"),
    ("Facility Management", "Mantenimiento y servicios del edificio de oficinas.", "maintenance"),
    ("Workplace Safety", "Prevención de riesgos laborales en el día a día.", "prevention"),
    ("Travel Expenses", "Comprobación y reembolso de viáticos de viaje.", "reimbursement"),
    ("Itinerary Planning", "Coordinación detallada de vuelos y hospedaje.", "itinerary"),
    ("Conference Booking", "Reservación de stands en eventos internacionales.", "booth"),
    ("Team Integration", "Planificación de dinámicas y eventos para fortalecer al equipo.", "teambuilding"),
    ("Review Milestone B2", "Evaluación de competencias operativas y de gestión.", "assessment")
] * 2  # 200 items

TEMAS_B2 = TEMAS_B1

TEMAS_C1 = [
    ("Global Market Analysis", "Evaluación macroeconómica y geopolítica de mercados.", "macroeconomic"),
    ("Crisis Management", "Comunicación ante desastres de marca y relaciones públicas.", "crisis"),
    ("Financial Results Reporting", "EBITDA, balances generales y reportes de dividendos.", "ebitda"),
    ("Mergers & Acquisitions", "Fusiones de corporativos y debida diligencia.", "merger"),
    ("Public Speaking Mastery", "Tácticas de retórica y persuasión ante audiencias masivas.", "rhetoric"),
    ("Nuanced Negotiation", "Negociar concesiones difíciles bajo presión.", "concession"),
    ("Legal Contracts Drafting", "Comprensión fina de cláusulas penales e indemnizaciones.", "indemnity"),
    ("ESG & Corporate Sustainability", "Gobernanza corporativa, huella de carbono y RSE.", "sustainability"),
    ("Corporate Strategy & Pivot", "Reestructuración estratégica e innovación abierta.", "pivot"),
    ("IPO & Exit Strategies", "Salir a bolsa o estructurar adquisiciones hostiles.", "ipo"),
    ("Leadership Philosophy", "Modelos de liderazgo exponencial y mentoría.", "leadership"),
    ("Change Management", "Gestionar transiciones organizacionales globales.", "transition"),
    ("Investor Relations", "Cómo dar discursos convincentes ante accionistas VIP.", "shareholders"),
    ("Corporate Governance", "Políticas anticorrupción y cumplimiento normativo.", "compliance"),
    ("Succession Planning", "Elegir líderes sucesores en mesas directivas.", "successor"),
    ("AI & Tech Disruption", "Impacto de IA generativa en la cadena de valor.", "technology"),
    ("Fintech & Blockchain", "Descentralización financiera y criptoactivos en tesorería.", "fintech"),
    ("Biotech Innovations", "Desarrollo farmacéutico y patentes científicas.", "patents"),
    ("Green Energy Transition", "Migrar operaciones corporativas a fuentes limpias.", "renewable"),
    ("Supply Chain Resilience", "Asegurar la cadena logística contra eventos de fuerza mayor.", "resilience"),
    ("Luxury Brand Management", "Mercadotecnia de alta gama y valor percibido.", "luxury"),
    ("Real Estate Investment", "Fideicomisos y portafolios de bienes raíces.", "reit"),
    ("Venture Capital Pitching", "Levantar rondas de inversión Serie A/B.", "venture"),
    ("Cybersecurity Protocols", "Políticas corporativas contra ataques de ransomware.", "ransomware"),
    ("Strategic Alliances", "Crear joint ventures estratégicos.", "alliance"),
    ("Intellectual Property", "Litigios marcarios y registros de derechos de autor.", "trademark"),
    ("Executive Ghostwriting", "Redactar discursos para directores ejecutivos.", "ghostwriting"),
    ("Diplomatic Communication", "Mitigar hostilidades y manejar preguntas incómodas.", "diplomatic"),
    ("The Power of Silence", "Uso de pausas en alta negociación.", "silence"),
    ("Diversity & Inclusion Strategy", "Políticas corporativas de equidad y pertenencia.", "inclusion"),
    ("E-commerce Scaling", "Logística transfronteriza y marketing automatizado.", "ecommerce"),
    ("Behavioral Economics", "Cómo influyen los sesgos cognitivos en el consumo.", "behavioral"),
    ("Milestone Capstone C", "Evaluación de competencias directivas globales.", "capstone"),
    ("Corporate Restructuring", "Rediseño organizacional para mejorar rentabilidad.", "restructuring"),
    ("Regulatory Compliance", "Normas estrictas de cumplimiento legal y ambiental.", "regulatory"),
    ("Antitrust Regulations", "Leyes de competencia y prevención de monopolios.", "antitrust"),
    ("Litigation Management", "Gestión de disputas legales y demandas marcarias.", "litigation"),
    ("Patent Protection", "Registro de patentes y defensa de propiedad intelectual.", "patent"),
    ("Trademark Disputes", "Resolución de conflictos de marcas registradas.", "disputes"),
    ("Board of Directors", "Dinámica y responsabilidades de la junta directiva.", "board"),
    ("Shareholder Activism", "Relación con accionistas que presionan por cambios.", "shareholder"),
    ("Executive Compensation", "Estructuración de bonos y opciones sobre acciones.", "remuneration"),
    ("IPO Roadshow", "Presentación ante inversionistas previo a salir a bolsa.", "roadshow"),
    ("Exit Strategy", "Vías de salida: adquisiciones, fusiones o liquidación.", "exit"),
    ("Hostile Takeover", "Estrategias de defensa ante compras hostiles de acciones.", "takeover"),
    ("Venture Capital Rounds", "Levantamiento de capital de riesgo Serie A y B.", "funding"),
    ("Private Equity", "Inversión institucional en empresas de alto potencial.", "equity"),
    ("Due Diligence Audit", "Auditoría exhaustiva previa a la adquisición de activos.", "diligence"),
    ("Merger Synergies", "Estimación de ahorros operativos tras una fusión.", "synergies"),
    ("Strategic Alliance Setup", "Acuerdos de cooperación conjunta entre corporativos.", "strategicalliance"),
    ("Joint Venture Setup", "Creación de una nueva entidad compartida.", "jointventure"),
    ("Cross-Border M&A", "Fusiones transfronterizas y barreras regulatorias.", "crossborder"),
    ("Carbon Footprint", "Estrategias para alcanzar la neutralidad de carbono.", "decarbonization"),
    ("Social Responsibility", "Programas de impacto social y filantropía.", "philanthropy"),
    ("Crisis Communication", "Estrategias de relaciones públicas ante escándalos de marca.", "pr"),
    ("Reputation Management", "Medición y protección del valor de la marca.", "reputation"),
    ("Media Training", "Preparación de directivos para interviews de prensa.", "pressinterview"),
    ("Public Speaking Rhetoric", "Tácticas avanzadas de oratoria y persuasión de masas.", "oratorical"),
    ("Keynote Address", "Discursos magistrales en convenciones globales.", "keynote"),
    ("Fiduciary Duty", "Responsabilidad legal y financiera ante los inversores.", "fiduciary"),
    ("Capital Allocation", "Decidir la reinversión de utilidades en la empresa.", "capitalallocation"),
    ("Treasury Management", "Control de liquidez, divisas y flujo de caja global.", "treasury"),
    ("Hedging Strategies", "Uso de derivados para protegerse contra fluctuaciones.", "hedging"),
    ("Asset Valuation", "Modelos matemáticos para calcular el precio de activos.", "valuation"),
    ("Dividend Policy", "Decidir el reparto de utilidades a los accionistas.", "dividend"),
    ("Debt Restructuring", "Negociar nuevos plazos de pago con bancos acreedores.", "debt"),
    ("Global Supply Chain", "Asegurar el abasto internacional contra contingencias.", "globalsupply"),
    ("Logistics Resilience", "Resiliencia ante cuellos de botella en puertos globales.", "portresilience"),
    ("Outsourcing Strategy", "Decisión estratégica de fabricar o externalizar.", "offshoring"),
    ("Geopolitical Strategy", "Adaptar operaciones ante guerras comerciales y aranceles.", "geopolitics"),
    ("Market Disruption", "Innovaciones tecnológicas que cambian las reglas del juego.", "disruption"),
    ("AI Integration", "Automatización y adopción de IA generativa en la empresa.", "automation"),
    ("Data Privacy Laws", "Cumplimiento de regulaciones estrictas como GDPR.", "privacy"),
    ("Intellectual Capital", "Retener talento clave tras reestructuraciones.", "intellectual"),
    ("Cultural Alignment", "Fusionar culturas corporativas de distintos países.", "culturalalign"),
    ("Brand Valuation", "Estimar el valor monetario intangible de una marca.", "brandvalue"),
    ("High-End Marketing", "Estrategias de posicionamiento en mercados de lujo.", "premium"),
    ("Franchise Scaling", "Modelos de expansión a través de franquicias globales.", "franchise"),
    ("Cross-Border Logistics", "Aduanas, aranceles y envíos transfronterizos.", "tariffs"),
    ("Behavioral Heuristics", "Cómo influyen los sesgos cognitivos en el consumo.", "heuristics"),
    ("Pricing Inelasticity", "Estudiar la sensibilidad del precio en el cliente.", "elasticity"),
    ("Customer Lifetime Value", "Optimización del valor a largo plazo de los clientes.", "clv"),
    ("Acquisition Cost", "Métricas del costo de adquisición de clientes (CAC).", "acquisition"),
    ("Business Intelligence", "Uso estratégico de Big Data para toma de decisiones.", "analytics"),
    ("Digital Transformation", "Migrar sistemas tradicionales a arquitecturas cloud.", "cloud"),
    ("Venture Studio Setup", "Creación de incubadoras internas de startups corporativas.", "incubator"),
    ("Shareholder Value Optimization", "Maximización de la rentabilidad a largo plazo para inversores.", "profitability"),
    ("Corporate Restructuring Strategy", "Planificación de escisiones y reorganización corporativa.", "divestiture"),
    ("Global Expansion Risk", "Evaluación de riesgos al ingresar a nuevos mercados soberanos.", "sovereign"),
    ("Regulatory Arbitrage", "Aprovechamiento estratégico de diferencias regulatorias globales.", "arbitrage"),
    ("Strategic Succession Planning", "Planificación sistemática para la transición del liderazgo ejecutivo.", "nomination"),
    ("Sustainable Debt Financing", "Emisión de bonos verdes y financiamiento de proyectos ecológicos.", "greenbonds"),
    ("High-Stakes Mediation", "Mediación diplomática y arbitraje en disputas comerciales.", "arbitration"),
    ("Venture Capital Exits", "Estrategias de salida y liquidación para inversiones de capital.", "liquidation"),
    ("Enterprise Risk Architecture", "Diseño de marcos integrales de gestión de riesgos corporativos.", "enterprise"),
    ("Cross-Cultural M&A Integration", "Integración posterior a la fusión de equipos globales diversos.", "multicultural"),
    ("Technology Transfer Agreements", "Acuerdos de licenciamiento y transferencia de tecnología patentada.", "licensing"),
    ("Public-Private Partnerships", "Estructuración de contratos de concesión con entidades gubernamentales.", "partnership"),
    ("Ethical Governance Oversight", "Supervisión de comités de auditoría y ética en la junta directiva.", "oversight"),
    ("Milestone Capstone Executive", "Evaluación de competencias directivas de alta gerencia.", "executive")
] * 2  # 200 items

TEMAS_C2 = TEMAS_C1

TEMAS_TOEIC = TEMAS_C1

# 700 lessons catalog map
CATALOG = {}

TOEIC_GRAMMAR_TOPICS = [
    # 0: Word Forms (Noun vs Adjective vs Adverb vs Verb)
    ("Word Forms (Categorías Gramaticales)",
     "- Adjetivos modifican sustantivos: 'We need a professional {vocab}.' (Necesitamos un {vocab} profesional.)\n"
     "- Adverbios modifican verbos: 'The project was completed successfully.' (El proyecto se completó con éxito.)\n"
     "- Clave TOEIC: Identifica si la palabra faltante modifica a un nombre (requiere adjetivo) o a una acción (requiere adverbio)."),
    
    # 1: Prepositions vs Conjunctions
    ("Prepositions vs Conjunctions (Preposiciones y Conjunciones)",
     "- Preposiciones preceden a sustantivos o gerundios: 'Despite the high cost of {vocab}...' (A pesar del alto costo del {vocab}...)\n"
     "- Conjunciones introducen cláusulas completas con sujeto y verbo: 'Although {vocab} was costly...' (Aunque el {vocab} fue costoso...)\n"
     "- Clave TOEIC: Revisa si lo que sigue al espacio en blanco es un sustantivo o una frase con verbo activo."),
    
    # 2: Subject-Verb Agreement
    ("Subject-Verb Agreement (Concordancia de Sujeto y Verbo)",
     "- Conectores correlativos: 'Neither the supervisor nor the managers are responsible for {vocab}.' (Ni el supervisor ni los gerentes son responsables del {vocab}.)\n"
     "- El verbo concuerda en número con el sustantivo más cercano al conector 'nor' o 'or'.\n"
     "- Clave TOEIC: Ante 'neither... nor...' o 'either... or...', localiza el último sujeto para definir si el verbo es singular o plural."),
    
    # 3: Pronouns (Pronombres Personales, Posesivos y Reflexivos)
    ("Pronoun Case (Casos y Clases de Pronombres)",
     "- Pronombre Reflexivo: 'The CEO analyzed the {vocab} reports herself.' (La Directora Ejecutiva analizó los reportes de {vocab} ella misma.)\n"
     "- Posesivos: 'their department', 'ours', 'its value'.\n"
     "- Clave TOEIC: Los pronombres reflexivos ('himself', 'themselves') se usan para enfatizar que el sujeto realiza la acción sin ayuda."),
    
    # 4: Conditionals and Subjunctive
    ("Conditionals & Subjunctive (Condicionales y Subjuntivo)",
     "- Condicional Mixto: 'If we had prioritized {vocab} yesterday, we would be market leaders today.' (Si hubiéramos priorizado el {vocab} ayer, hoy seríamos líderes de mercado.)\n"
     "- Subjuntivo tras verbos de demanda: 'The board insists that he review the {vocab} guidelines.' (La junta insiste en que él revise las directrices de {vocab}.)\n"
     "- Clave TOEIC: Tras 'insist', 'demand' o 'require' que +, se usa la forma base del verbo sin 's' ('review' en lugar de 'reviews')."),
    
    # 5: Gerunds vs Infinitives
    ("Gerunds vs Infinitives (Gerundios e Infinitivos)",
     "- Verbos seguidos de Gerundio: 'They suggested postponing the {vocab} rollout.' (Sugerieron posponer el despliegue del {vocab}.)\n"
     "- Verbos seguidos de Infinitivo: 'We decided to acquire the {vocab}.' (Decidimos adquirir el {vocab}.)\n"
     "- Clave TOEIC: Memoriza los verbos comunes que exigen gerundio (suggest, avoid, consider, postpone, recommend) vs infinitivo (decide, plan, offer, agree)."),
    
    # 6: Participles as Adjectives (-ed vs -ing)
    ("Participles as Adjectives (Participios como Adjetivos)",
     "- Participio Pasivo (-ed) describe el sentimiento de una persona: 'The director is interested in {vocab}.' (La directora está interesada en el {vocab}.)\n"
     "- Participio Activo (-ing) describe la causa del sentimiento: 'The {vocab} presentation was interesting.' (La presentación de {vocab} fue interesante.)\n"
     "- Clave TOEIC: Si el sustantivo modificado siente la emoción, usa '-ed'; si la causa, usa '-ing'."),
    
    # 7: Business Collocations
    ("Business Collocations (Colocaciones Verbales)",
     "- Expresiones fijas: 'make a decision' (tomar una decisión), 'conduct an audit' (realizar una auditoría), 'allocate resources' (asignar recursos).\n"
     "- Evita traducciones literales como 'take a decision' o 'make an audit'.\n"
     "- Clave TOEIC: La familiaridad con colocaciones de negocios comunes te permite responder de forma casi instantánea."),
    
    # 8: Passive Voice
    ("Passive Voice (Voz Pasiva)",
     "- Estructura: Sujeto Paciente + Verbo 'to be' + Participio Pasivo: 'The {vocab} was updated yesterday.' (El {vocab} fue actualizado ayer.)\n"
     "- Usada para dar énfasis al resultado o cuando el agente es desconocido/obvio.\n"
     "- Clave TOEIC: Si el sujeto no realiza la acción (por ejemplo, 'invoices', 'reports'), la respuesta requerirá voz pasiva ('will be processed')."),
    
    # 9: Modals and Probability
    ("Modal Verbs (Verbos Modales de Obligación y Posibilidad)",
     "- Obligación estricta / Regulación: 'All employees must report the {vocab} status.' (Todos los empleados deben reportar el estatus del {vocab}.)\n"
     "- Posibilidad leve: 'The merger might affect our {vocab}.' (La fusión podría afectar nuestro {vocab}.)\n"
     "- Clave TOEIC: Analiza la intención de la oración: 'must' (obligación obligatoria), 'should' (sugerencia/consejo), 'might' (posibilidad débil).")
]

def load_catalog():
    global CATALOG
    levels = {
        "a1": TEMAS_A1,
        "a2": TEMAS_A2,
        "b1": TEMAS_B1,
        "b2": TEMAS_B2,
        "c1": TEMAS_C1,
        "c2": TEMAS_C2,
        "toeic": TEMAS_TOEIC
    }
    for level, dataset in levels.items():
        for idx, (title, desc, vocab) in enumerate(dataset):
            num = idx + 1
            # Standard lessons names
            lesson_id = f"{level}-{num}"
            CATALOG[lesson_id] = {
                "title": title,
                "description": desc,
                "vocab": vocab,
                "level": level.upper(),
                "index": num
            }

load_catalog()


async def generate_dynamic_lesson(lesson_id: str, lang: str = "es") -> Dict[str, Any]:
    """Generates complete premium lesson content dynamically via AI to ensure perfect grammar and multi-language UI."""
    meta = CATALOG.get(lesson_id.lower())
    if not meta:
        # Fallback dynamic logic for arbitrary IDs
        parts = lesson_id.split("-")
        level_part = parts[0].upper() if len(parts) > 0 else "A1"
        idx_part = parts[1] if len(parts) > 1 else "1"
        meta = {
            "title": f"Business Strategy Module {idx_part}",
            "description": f"Master executive terms for level {level_part}.",
            "vocab": "strategy",
            "level": level_part,
            "index": int(idx_part) if idx_part.isdigit() else 1
        }
    
    title = meta["title"]
    desc = meta["description"]
    vocab = meta["vocab"]
    level = meta["level"]

    if not _GENAI_AVAILABLE or not _app_settings or not _app_settings.GEMINI_API_KEY:
        logger.error("GEMINI_API_KEY missing or google.generativeai unavailable.")
        return {"id": lesson_id, "title": "API Error", "stages": []}

    genai.configure(api_key=_app_settings.GEMINI_API_KEY)
    
    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        system_instruction="You are an elite C-Level Executive English Curriculum Designer. You design flawless, highly professional JSON lessons for a corporate language app.",
        generation_config={
            "temperature": 0.5,
            "top_p": 0.95,
            "max_output_tokens": 8192,
            "response_mime_type": "application/json"
        }
    )
    
    prompt = f"""
    Create a highly professional interactive English lesson in JSON format.
    
    Lesson Details:
    - ID: {lesson_id}
    - Level: {level}
    - Topic: {title} ({desc})
    - Core Vocabulary Word: "{vocab}"
    - Target UI Language for Explanations/Hints: {lang} (If 'es', write explanations in Spanish; if 'fr', French; if 'zh', Chinese; if 'en', English).
    
    Rules for the exercises:
    1. Sentences MUST be grammatically perfect. Pay attention to whether "{vocab}" is a noun, verb, or adjective, and use it correctly.
    2. Distractor options must look like realistic grammatical or corporate mistakes. DO NOT generate nonsensical distractors.
    3. The English sentences must be highly professional and corporate, appropriate for the level {level}.
    4. Explanations must strictly be in the target UI language '{lang}'.
    5. Generate EXACTLY 10 quiz_choice, 10 order_sentence, 5 listening_match, and 5 fill_input questions.
    
    Output JSON Schema:
    {{
      "id": "{lesson_id}",
      "title": "{title}",
      "version": "4.0-AI",
      "level": "{level}",
      "total_xp": 300,
      "tags": ["{level}", "Dynamic", "AI-Generated"],
      "stages": [
        {{
          "id": "stg_theory",
          "type": "lecture",
          "title": "Theoretical Concept (translate to {lang})",
          "parts": [
            {{ "visual": "Text introducing the {vocab} and {title} in {lang}", "audio": "Welcome to the lesson... in English" }},
            {{ "visual": "Grammar and usage tip in {lang}", "audio": "Please note how we use {vocab}... in English" }}
          ]
        }},
        {{
          "id": "stg_quiz_choice",
          "type": "quiz_choice",
          "title": "Interactive Quiz (translate to {lang})",
          "description": "Select the correct response (translate to {lang})",
          "questions": [
             {{
                "id": "{lesson_id}-q-choice-1",
                "type": "quiz_choice",
                "question": "A professional English question testing the usage of '{vocab}'. Can have a blank ____.",
                "options": ["Correct Option", "Realistic Distractor 1", "Realistic Distractor 2", "Realistic Distractor 3"],
                "correct_answer": "Correct Option",
                "explanation": "Explanation of why it's correct in {lang}."
             }}
          ]
        }},
        {{
          "id": "stg_order_sentence",
          "type": "order_sentence",
          "title": "Syntax Reconstruction (translate to {lang})",
          "description": "Order the words to form a sentence (translate to {lang})",
          "questions": [
             {{
                "id": "{lesson_id}-q-order-1",
                "type": "order_sentence",
                "question": "Arrange the words (translate to {lang}):",
                "parts": ["randomized", "array", "of", "words"],
                "correct_order": ["The", "correct", "ordered", "words"],
                "explanation": "Syntax explanation in {lang}."
             }}
          ]
        }},
        {{
          "id": "stg_listening",
          "type": "listening_match",
          "title": "Listening Comprehension (translate to {lang})",
          "description": "Select the exact phrase you hear (translate to {lang})",
          "questions": [
             {{
                "id": "{lesson_id}-q-listen-1",
                "type": "listening_match",
                "question": "Select the exact phrase you hear (translate to {lang}):",
                "tts_text": "A highly professional English sentence using '{vocab}'.",
                "options": [
                   "The exact sentence.",
                   "A grammatically similar but incorrect sentence.",
                   "Another realistic distractor."
                ],
                "correct_answer": "The exact sentence.",
                "explanation": "Listening tip in {lang}."
             }}
          ]
        }},
        {{
          "id": "stg_fill",
          "type": "fill_input",
          "title": "Vocabulary Mastery (translate to {lang})",
          "description": "Type the missing word (translate to {lang})",
          "questions": [
             {{
                "id": "{lesson_id}-q-fill-1",
                "type": "fill_input",
                "question": "Complete the sentence: The team will ____ the new protocol tomorrow. (Translate instructions to {lang})",
                "correct_answers": ["implement", "Implement"],
                "hints": ["Hint in {lang}"],
                "explanation": "Grammar explanation in {lang}."
             }}
          ]
        }}
      ]
    }}
    """
    
    try:
        response = await model.generate_content_async(prompt)
        return json.loads(response.text)
    except Exception as e:
        logger.error(f"Gemini AI generation failed: {e}")
        return {
            "id": lesson_id,
            "title": f"Generation Error - {title}",
            "version": "1.0",
            "level": level,
            "total_xp": 100,
            "tags": ["Error"],
            "stages": []
        }

