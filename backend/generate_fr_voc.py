import os
import json

# --- CONFIGURACIÓN DE SALIDA ---
OUTPUT_DIR = "app/voclessons/lessons/fr"

# --- BANCO DE DATOS DE VOCABULARIO (2,500 PARES ESPAÑOL -> FRANCÉS) ---
# Estructura: Categoría -> Lista de 10 Módulos (cada uno con 50 tuplas (Español, Francés))
VOCAB_DATABASE = {
    "basics": [
        # Módulo 1: Saludos y Expresiones Comunes (Fácil)
        [
            ("Hola", "Bonjour"), ("Adiós", "Au revoir"), ("Gracias", "Merci"), ("Por favor", "S'il vous plaît"),
            ("Sí", "Oui"), ("No", "Non"), ("Buenas noches", "Bonsoir"), ("Buenos días", "Bonne journée"),
            ("¿Cómo estás?", "Comment ça va ?"), ("Muy bien", "Très bien"), ("Lo siento", "Désolé"),
            ("De nada", "De rien"), ("Disculpe", "Excusez-moi"), ("Bienvenido", "Bienvenue"),
            ("Hasta luego", "À plus tard"), ("Hasta mañana", "À demain"), ("Mucho gusto", "Enchanté"),
            ("¿Qué tal?", "Quoi de neuf ?"), ("Bien", "Bien"), ("Mal", "Mal"), ("Señor", "Monsieur"),
            ("Señora", "Madame"), ("Amigo", "Ami"), ("Nombre", "Nom"), ("Apellido", "Prénom"),
            ("¿Cómo te llamas?", "Comment tu t'appelles ?"), ("Me llamo", "Je m'appelle"),
            ("Edad", "Âge"), ("¿De dónde eres?", "D'où viens-tu ?"), ("Soy de", "Je viens de"),
            ("Feliz", "Heureux"), ("Triste", "Triste"), ("Cansado", "Fatigué"), ("Enfermo", "Malade"),
            ("Estudiante", "Étudiant"), ("Profesor", "Professeur"), ("Trabajo", "Travail"),
            ("Escuela", "École"), ("Ciudad", "Ville"), ("País", "Pays"), ("Casa", "Maison"),
            ("Familia", "Famille"), ("Hombre", "Homme"), ("Mujer", "Femme"), ("Niño", "Enfant"),
            ("Amiga", "Amie"), ("Gente", "Gens"), ("Amor", "Amour"), ("Vida", "Vie"), ("Tiempo", "Temps")
        ],
        # Módulo 2: La Familia y Personas (Fácil)
        [
            ("Madre", "Mère"), ("Padre", "Père"), ("Hijo", "Fils"), ("Hija", "Fille"), ("Hermano", "Frère"),
            ("Hermana", "Sœur"), ("Abuelo", "Grand-père"), ("Abuela", "Grand-mère"), ("Tío", "Oncle"),
            ("Tía", "Tante"), ("Primo", "Cousin"), ("Prima", "Cousine"), ("Sobrino", "Neveu"),
            ("Sobrina", "Nièce"), ("Esposo", "Époux"), ("Esposa", "Épouse"), ("Novio", "Petit ami"),
            ("Novia", "Petite amie"), ("Bebé", "Bébé"), ("Padres", "Parents"), ("Hijos", "Enfants"),
            ("Vecino", "Voisin"), ("Vecina", "Voisine"), ("Compañero", "Compagnon"), ("Jefe", "Patron"),
            ("Colega", "Collègue"), ("Señorita", "Mademoiselle"), ("Caballero", "Monsieur"),
            ("Gente", "Monde"), ("Persona", "Personne"), ("Hombre", "Homme"), ("Mujer", "Femme"),
            ("Adolescente", "Adolescent"), ("Adulto", "Adulte"), ("Anciano", "Vieillard"),
            ("Suegro", "Beau-père"), ("Suegra", "Belle-mère"), ("Yerno", "Gendre"), ("Nuera", "Belle-fille"),
            ("Cuñado", "Beau-frère"), ("Cuñada", "Belle-sœur"), ("Padrino", "Parrain"), ("Madrina", "Marraine"),
            ("Huérfano", "Orphelin"), ("Gemelo", "Jumeau"), ("Gemela", "Jumelle"), ("Familiares", "Proches"),
            ("Generación", "Génération"), ("Infancia", "Enfance"), ("Juventud", "Jeunesse")
        ],
        # Módulo 3: Alimentos y Bebidas (Fácil)
        [
            ("Agua", "Eau"), ("Pan", "Pain"), ("Leche", "Lait"), ("Queso", "Fromage"), ("Huevo", "Œuf"),
            ("Mantequilla", "Beurre"), ("Carne", "Viande"), ("Pescado", "Poisson"), ("Pollo", "Poulet"),
            ("Arroz", "Riz"), ("Manzana", "Pomme"), ("Plátano", "Banane"), ("Naranja", "Orange"),
            ("Café", "Café"), ("Té", "Thé"), ("Azúcar", "Sucre"), ("Sal", "Sel"), ("Pimienta", "Poivre"),
            ("Aceite", "Huile"), ("Vinagre", "Vinaigre"), ("Sopa", "Soupe"), ("Ensalada", "Salade"),
            ("Pasta", "Pâtes"), ("Patata", "Pomme de terre"), ("Tomate", "Tomate"), ("Cebolla", "Oignon"),
            ("Ajo", "Ail"), ("Zanahoria", "Carotte"), ("Fruta", "Fruit"), ("Verdura", "Légume"),
            ("Jugo", "Jus"), ("Cerveza", "Bière"), ("Vino", "Vin"), ("Desayuno", "Petit-déjeuner"),
            ("Almuerzo", "Déjeuner"), ("Cena", "Dîner"), ("Postre", "Dessert"), ("Pastel", "Gâteau"),
            ("Chocolate", "Chocolat"), ("Helado", "Glace"), ("Caramelo", "Bonbon"), ("Panadería", "Boulangerie"),
            ("Comida", "Nourriture"), ("Hambre", "Faim"), ("Sed", "Soif"), ("Delicioso", "Délicieux"),
            ("Dulce", "Doux"), ("Salado", "Salé"), ("Picante", "Épicé"), ("Amargo", "Amer")
        ],
        # Módulo 4: La Casa y Muebles (Fácil)
        [
            ("Casa", "Maison"), ("Habitación", "Chambre"), ("Cocina", "Cuisine"), ("Baño", "Salle de bain"),
            ("Sala de estar", "Salon"), ("Comedor", "Salle à manger"), ("Puerta", "Porte"),
            ("Ventana", "Fenêtre"), ("Pared", "Mur"), ("Techo", "Plafond"), ("Suelo", "Sol"),
            ("Llave", "Clé"), ("Mesa", "Table"), ("Silla", "Chaise"), ("Cama", "Lit"),
            ("Sofá", "Canapé"), ("Armario", "Armoire"), ("Escritorio", "Bureau"), ("Lámpara", "Lampe"),
            ("Espejo", "Miroir"), ("Cuadro", "Tableau"), ("Alfombra", "Tapis"), ("Cortina", "Rideau"),
            ("Refrigerador", "Réfrigérateur"), ("Horno", "Four"), ("Microondas", "Micro-ondes"),
            ("Lavadora", "Lave-linge"), ("Fregadero", "Évier"), ("Grifo", "Robinet"), ("Ducha", "Douche"),
            ("Bañera", "Baignoire"), ("Inodoro", "Toilettes"), ("Toalla", "Serviette"), ("Sábana", "Drap"),
            ("Almohada", "Oreiller"), ("Televisión", "Télévision"), ("Plato", "Assiette"),
            ("Vaso", "Verre"), ("Taza", "Tasse"), ("Tenedor", "Fourchette"), ("Cuchillo", "Couteau"),
            ("Cuchara", "Cuillère"), ("Basura", "Poubelle"), ("Jardín", "Jardin"), ("Garaje", "Garage"),
            ("Escaleras", "Escalier"), ("Balcón", "Balcon"), ("Piso", "Étage"), ("Pasillo", "Couloir"), ("Entrada", "Entrée")
        ],
        # Módulo 5: El Cuerpo Humano (Fácil)
        [
            ("Cabeza", "Tête"), ("Pelo", "Cheveux"), ("Cara", "Visage"), ("Ojo", "Œil"), ("Ojos", "Yeux"),
            ("Nariz", "Nez"), ("Boca", "Bouche"), ("Diente", "Dent"), ("Lengua", "Langue"),
            ("Oreja", "Oreille"), ("Cuello", "Cou"), ("Hombro", "Épaule"), ("Brazo", "Bras"),
            ("Codo", "Coude"), ("Muñeca", "Poignet"), ("Mano", "Main"), ("Dedo", "Doigt"),
            ("Pecho", "Poitrine"), ("Espalda", "Dos"), ("Estómago", "Estomac"), ("Cintura", "Taille"),
            ("Cadera", "Hanche"), ("Pierna", "Jambe"), ("Rodilla", "Genou"), ("Tobillo", "Cheville"),
            ("Pie", "Pied"), ("Piel", "Peau"), ("Hueso", "Os"), ("Sangre", "Sang"), ("Corazón", "Cœur"),
            ("Cerebro", "Cerveau"), ("Pulmón", "Poumon"), ("Garganta", "Gorge"), ("Uña", "Ongle"),
            ("Frente", "Front"), ("Mejilla", "Joue"), ("Labio", "Lèvre"), ("Barbilla", "Menton"),
            ("Cuerpo", "Corps"), ("Salud", "Santé"), ("Fuerza", "Force"), ("Dolor", "Douleur"),
            ("Respirar", "Respirer"), ("Ver", "Voir"), ("Oír", "Entendre"), ("Tocar", "Toucher"),
            ("Oler", "Sentir"), ("Saborear", "Goûter"), ("Caminar", "Marcher"), ("Correr", "Courir")
        ],
        # Módulo 6: Colores y Ropa (Fácil)
        [
            ("Rojo", "Rouge"), ("Azul", "Bleu"), ("Verde", "Vert"), ("Amarillo", "Jaune"),
            ("Negro", "Noir"), ("Blanco", "Blanc"), ("Gris", "Gris"), ("Marrón", "Marron"),
            ("Rosa", "Rose"), ("Naranja", "Orange"), ("Morado", "Violet"), ("Ropa", "Vêtements"),
            ("Camisa", "Chemise"), ("Camiseta", "T-shirt"), ("Pantalones", "Pantalon"),
            ("Vestido", "Robe"), ("Falda", "Jupe"), ("Chaqueta", "Veste"), ("Abrigo", "Manteau"),
            ("Suéter", "Pull"), ("Zapatos", "Chaussures"), ("Botas", "Bottes"), ("Sandalias", "Sandales"),
            ("Calcetines", "Chaussettes"), ("Ropa interior", "Sous-vêtements"), ("Sombrero", "Chapeau"),
            ("Gorra", "Casquette"), ("Bufanda", "Écharpe"), ("Guantes", "Gants"), ("Cinturón", "Ceinture"),
            ("Corbata", "Cravate"), ("Bolso", "Sac à main"), ("Gafas", "Lunettes"), ("Reloj", "Montre"),
            ("Paraguas", "Parapluie"), ("Botón", "Bouton"), ("Bolsillo", "Poche"), ("Algodón", "Coton"),
            ("Lana", "Laine"), ("Seda", "Soie"), ("Cuero", "Cuir"), ("Llevar puesto", "Porter"),
            ("Vestirse", "S'habiller"), ("Quitarse ropa", "Se déshabiller"), ("Comprar", "Acheter"),
            ("Probarse", "Essayer"), ("Talla", "Taille"), ("Color", "Couleur"), ("Moda", "Mode"), ("Estilo", "Style")
        ],
        # Módulo 7: Números y Tiempo (Fácil)
        [
            ("Uno", "Un"), ("Dos", "Deux"), ("Tres", "Trois"), ("Cuatro", "Quatre"), ("Cinco", "Cinq"),
            ("Seis", "Six"), ("Siete", "Sept"), ("Ocho", "Huit"), ("Nueve", "Neuf"), ("Diez", "Dix"),
            ("Once", "Onze"), ("Doce", "Douze"), ("Trece", "Treize"), ("Catorce", "Quatorze"),
            ("Quince", "Quinze"), ("Veinte", "Vingt"), ("Treinta", "Trente"), ("Cuarenta", "Quarante"),
            ("Cincuenta", "Cinquante"), ("Cien", "Cent"), ("Mil", "Mille"), ("Hora", "Heure"),
            ("Minuto", "Minute"), ("Segundo", "Seconde"), ("Día", "Jour"), ("Semana", "Semaine"),
            ("Mes", "Mois"), ("Año", "An"), ("Lunes", "Lundi"), ("Martes", "Mardi"), ("Miércoles", "Mercredi"),
            ("Jueves", "Jeudi"), ("Viernes", "Vendredi"), ("Sábado", "Samedi"), ("Domingo", "Dimanche"),
            ("Mañana (día)", "Matin"), ("Tarde", "Après-midi"), ("Noche", "Nuit"), ("Hoy", "Aujourd'hui"),
            ("Ayer", "Hier"), ("Mañana (futuro)", "Demain"), ("Semana pasada", "Semaine dernière"),
            ("Próxima semana", "Semaine prochaine"), ("Fin de semana", "Week-end"), ("Estación", "Saison"),
            ("Primavera", "Printemps"), ("Verano", "Été"), ("Otoño", "Automne"), ("Invierno", "Hiver"), ("Calendario", "Calendrier")
        ],
        # Módulo 8: Clima y Naturaleza (Fácil)
        [
            ("Sol", "Soleil"), ("Lluvia", "Pluie"), ("Nieve", "Neige"), ("Viento", "Vent"), ("Nube", "Nuage"),
            ("Cielo", "Ciel"), ("Estrella", "Étoile"), ("Luna", "Lune"), ("Clima", "Climat"),
            ("Calor", "Chaleur"), ("Frío", "Froid"), ("Temperatura", "Température"), ("Tormenta", "Tempête"),
            ("Rayo", "Éclair"), ("Trueno", "Tonnerre"), ("Niebla", "Brouillard"), ("Hielo", "Glace"),
            ("Naturaleza", "Nature"), ("Árbol", "Arbre"), ("Flor", "Fleur"), ("Planta", "Plante"),
            ("Hierba", "Herbe"), ("Bosque", "Forêt"), ("Montaña", "Montagne"), ("Colina", "Colline"),
            ("Río", "Rivière"), ("Lago", "Lac"), ("Mar", "Mer"), ("Océano", "Océan"), ("Playa", "Plage"),
            ("Tierra", "Terre"), ("Piedra", "Pierre"), ("Arena", "Sable"), ("Fuego", "Feu"),
            ("Aire", "Air"), ("Mundo", "Monde"), ("Universo", "Univers"), ("Campo", "Campagne"),
            ("Desierto", "Désert"), ("Isla", "Île"), ("Valle", "Vallée"), ("Medio ambiente", "Environnement"),
            ("Soleado", "Ensoleillé"), ("Lluvioso", "Pluvieux"), ("Nublado", "Nuageux"), ("Húmedo", "Humide"),
            ("Seco", "Sec"), ("Soplar", "Souffler"), ("Llover", "Pleuvoir"), ("Nevar", "Neiger")
        ],
        # Módulo 9: Animales Comunes (Fácil)
        [
            ("Perro", "Chien"), ("Gato", "Chat"), ("Caballo", "Cheval"), ("Vaca", "Vache"), ("Oveja", "Mouton"),
            ("Cerdo", "Cochon"), ("Pollo", "Poulet"), ("Gallo", "Coq"), ("Pájaro", "Oiseau"),
            ("Pez", "Poisson"), ("Ratón", "Souris"), ("Conejo", "Lapin"), ("León", "Lion"),
            ("Tigre", "Tigre"), ("Oso", "Ours"), ("Elefante", "Éléphant"), ("Mono", "Singe"),
            ("Lobo", "Loup"), ("Zorro", "Renard"), ("Águila", "Aigle"), ("Pato", "Canard"),
            ("Tortuga", "Tortue"), ("Rana", "Grenouille"), ("Serpiente", "Serpent"), ("Lagarto", "Lézard"),
            ("Insecto", "Insecte"), ("Mosca", "Mouche"), ("Mosquito", "Moustique"), ("Abeja", "Abeille"),
            ("Mariposa", "Papillon"), ("Araña", "Araignée"), ("Hormiga", "Fourmi"), ("Tiburón", "Requin"),
            ("Delfín", "Dauphin"), ("Ballena", "Baleine"), ("Cangrejo", "Crabe"), ("Caballo de mar", "Hippocampe"),
            ("Pulpo", "Poulpe"), ("Animal", "Animal"), ("Mascota", "Animal de compagnie"), ("Granja", "Ferme"),
            ("Zoo", "Zoo"), ("Selva", "Jungle"), ("Salvaje", "Sauvage"), ("Doméstico", "Domestique"),
            ("Alimentar", "Nourrir"), ("Cazar", "Chasser"), ("Volar", "Voler"), ("Nadar", "Nager"), ("Ladrar", "Aboyer")
        ],
        # Módulo 10: Adjetivos Básicos (Fácil)
        [
            ("Grande", "Grand"), ("Pequeño", "Petit"), ("Bueno", "Bon"), ("Malo", "Mauvais"),
            ("Hermoso", "Beau"), ("Feo", "Laid"), ("Nuevo", "Nouveau"), ("Viejo", "Vieux"),
            ("Joven", "Jeune"), ("Fácil", "Facile"), ("Difícil", "Difficile"), ("Rápido", "Rapide"),
            ("Lento", "Lent"), ("Caliente", "Chaud"), ("Frío", "Froid"), ("Limpio", "Propre"),
            ("Sucio", "Sale"), ("Rico", "Riche"), ("Pobre", "Pauvre"), ("Lleno", "Plein"),
            ("Vacío", "Vide"), ("Fuerte", "Fort"), ("Débil", "Faible"), ("Pesado", "Lourd"),
            ("Ligero", "Léger"), ("Alto", "Haut"), ("Bajo", "Bas"), ("Largo", "Long"),
            ("Corto", "Court"), ("Ancho", "Large"), ("Estrecho", "Étroit"), ("Abierto", "Ouvert"),
            ("Cerrado", "Fermé"), ("Feliz", "Heureux"), ("Triste", "Triste"), ("Inteligente", "Intelligent"),
            ("Divertido", "Amusant"), ("Aburrido", "Ennuyeux"), ("Caro", "Cher"), ("Barato", "Bon marché"),
            ("Seguro", "Sûr"), ("Peligroso", "Dangereux"), ("Importante", "Important"), ("Perfecto", "Parfait"),
            ("Correcto", "Correct"), ("Incorrecto", "Incorrect"), ("Mismo", "Même"), ("Diferente", "Différent"),
            ("Libre", "Libre"), ("Ocupado", "Occupé")
        ]
    ],
    "travel": [
        # Módulo 1: En el Aeropuerto (Fácil-Medio)
        [
            ("Pasaporte", "Passeport"), ("Vuelo", "Vol"), ("Equipaje", "Bagages"), ("Maleta", "Valise"),
            ("Aeropuerto", "Aéroport"), ("Boleto", "Billet"), ("Pasaje de abordar", "Carte d'embarquement"),
            ("Seguridad", "Sécurité"), ("Aduana", "Douane"), ("Puerta de embarque", "Porte d'embarquement"),
            ("Terminal", "Terminal"), ("Pasajero", "Passager"), ("Piloto", "Pilote"), ("Azafata", "Hôtesse de l'air"),
            ("Avión", "Avion"), ("Despegue", "Décollage"), ("Aterrizaje", "Atterrissage"), ("Retraso", "Retard"),
            ("Conexión", "Correspondance"), ("Salas VIP", "Salon VIP"), ("Llegadas", "Arrivées"),
            ("Salidas", "Départs"), ("Báscula", "Balance"), ("Exceso de equipaje", "Excédent de bagages"),
            ("Control de pasaportes", "Contrôle des passeports"), ("Visa", "Visa"), ("Turista", "Touriste"),
            ("Declarar", "Déclarer"), ("Objetos de valor", "Objets de valeur"), ("Perdido", "Perdu"),
            ("Equipaje de mano", "Bagage à main"), ("Escala", "Escale"), ("Clase ejecutiva", "Classe affaires"),
            ("Reservar", "Réserver"), ("Cancelar", "Annuler"), ("Confirmar", "Confirmer"),
            ("Viajar", "Voyager"), ("Embarcar", "Embarquer"), ("Volar", "Voler"), ("Facturar equipaje", "Enregistrer les bagages"),
            ("Asiento", "Siège"), ("Pasillo", "Couloir"), ("Ventana", "Hublot"), ("Cinturón de seguridad", "Ceinture de sécurité"),
            ("Pantalla de información", "Écran d'information"), ("Búsqueda de equipaje", "Livraison des bagages"),
            ("Oficina de turismo", "Office de tourisme"), ("Mapa de la ciudad", "Plan de la ville"),
            ("Moneda", "Devise"), ("Cambio de divisas", "Bureau de change")
        ],
        # Módulo 2: En el Hotel (Fácil-Medio)
        [
            ("Reserva", "Réservation"), ("Habitación", "Chambre"), ("Llave", "Clé"), ("Recepción", "Réception"),
            ("Recepcionista", "Réceptionniste"), ("Huésped", "Client"), ("Botones", "Bagagiste"),
            ("Ascensor", "Ascenseur"), ("Cama matrimonial", "Lit double"), ("Cama individual", "Lit simple"),
            ("Baño privado", "Salle de bain privée"), ("Aire acondicionado", "Climatisation"),
            ("Calefacción", "Chauffage"), ("Servicio de habitaciones", "Service d'étage"),
            ("Desayuno incluido", "Petit-déjeuner inclus"), ("Piscina", "Piscine"), ("Gimnasio", "Gymnase"),
            ("Wi-Fi gratuito", "Wi-Fi gratuit"), ("Caja fuerte", "Coffre-fort"), ("Minibar", "Minibar"),
            ("Vista al mar", "Vue sur la mer"), ("Factura", "Facture"), ("Tarjeta de crédito", "Carte de crédit"),
            ("Efectivo", "Espèces"), ("Firmar", "Signer"), ("Registrarse", "Faire le check-in"),
            ("Salir del hotel", "Faire le check-out"), ("Toalla limpia", "Serviette propre"),
            ("Manta", "Couverture"), ("Almohada extra", "Oreiller supplémentaire"), ("Jabón", "Savon"),
            ("Champú", "Shampooing"), ("Secador de pelo", "Sèche-cheveux"), ("Limpieza", "Ménage"),
            ("Queja", "Réclamation"), ("Ruido", "Bruit"), ("Tranquilo", "Calme"), ("Estacionamiento", "Parking"),
            ("Llave electrónica", "Carte magnétique"), ("Equipaje", "Bagages"), ("Pasaporte", "Passeport"),
            ("Despertador", "Réveil"), ("Hacer la maleta", "Faire sa valise"), ("Deshacer la maleta", "Défaire sa valise"),
            ("Piso", "Étage"), ("Entrada", "Entrée"), ("Salida de emergencia", "Sortie de secours"),
            ("Folleto", "Brochure"), ("Recomendar", "Recommander"), ("Estadía", "Séjour")
        ],
        # Módulo 3: Medios de Transporte (Fácil-Medio)
        [
            ("Tren", "Train"), ("Autobús", "Bus"), ("Coche", "Voiture"), ("Bicicleta", "Vélo"),
            ("Metro", "Métro"), ("Taxi", "Taxi"), ("Motocicleta", "Moto"), ("Tranvía", "Tramway"),
            ("Barco", "Bateau"), ("Ferry", "Ferry"), ("Estación de tren", "Gare"), ("Parada de autobús", "Arrêt de bus"),
            ("Conductor", "Chauffeur"), ("Pasajero", "Passager"), ("Boleto de viaje", "Ticket de transport"),
            ("Tarifa", "Tarif"), ("Horario", "Horaire"), ("Línea", "Ligne"), ("Ruta", "Itinéraire"),
            ("Mapa de rutas", "Plan du réseau"), ("Taquilla", "Guichet"), ("Máquina expendedora", "Distributeur automatique"),
            ("Andén", "Quai"), ("Vía", "Voie"), ("Destino", "Destination"), ("Origen", "Origine"),
            ("Viaje de ida", "Aller simple"), ("Viaje de ida y vuelta", "Aller-retour"),
            ("Alquiler de coches", "Location de voitures"), ("Licencia de conducir", "Permis de conduire"),
            ("Gasolinera", "Station-service"), ("Carretera", "Route"), ("Autopista", "Autoroute"),
            ("Tráfico", "Circulation"), ("Semáforo", "Feu de signalisation"), ("Paso de peatones", "Passage piéton"),
            ("Peaje", "Péage"), ("Aparcamiento", "Parking"), ("Conducir", "Conduire"), ("Caminar", "Marcher"),
            ("Perder el autobús", "Rater le bus"), ("Subir al tren", "Monter dans le train"),
            ("Bajar del tren", "Descendre du train"), ("Transbordo", "Changement"),
            ("A tiempo", "À l'heure"), ("Retrasado", "En retard"), ("Cancelado", "Annulé"),
            ("Asiento reservado", "Siège réservé"), ("Equipaje de mano", "Bagage à main"), ("Viajero", "Voyageur")
        ],
        # Módulo 4: Direcciones y Orientación (Fácil-Medio)
        [
            ("Derecha", "Droite"), ("Izquierda", "Gauche"), ("Recto", "Tout droit"), ("Girar", "Tourner"),
            ("Esquina", "Coin"), ("Cruce", "Carrefour"), ("Semáforo", "Feu"), ("Calle", "Rue"),
            ("Avenida", "Avenue"), ("Plaza", "Place"), ("Mapa", "Carte"), ("Brújula", "Boussole"),
            ("Dirección", "Direction"), ("Norte", "Nord"), ("Sur", "Sud"), ("Este", "Est"), ("Oeste", "Ouest"),
            ("Cerca", "Près"), ("Lejos", "Loin"), ("Aquí", "Ici"), ("Allí", "Là-bas"),
            ("Al lado de", "À côté de"), ("Enfrente de", "En face de"), ("Detrás de", "Derrière"),
            ("Delante de", "Devant"), ("Entre", "Entre"), ("Cruzar la calle", "Traverser la rue"),
            ("Perderse", "Se perdre"), ("Preguntar el camino", "Demander le chemin"),
            ("Mostrar el camino", "Montrer le chemin"), ("Seguir las señales", "Suivre les panneaux"),
            ("Señal de tráfico", "Panneau de signalisation"), ("GPS", "GPS"), ("Dirección postal", "Adresse"),
            ("Bloque", "Pâté de maisons"), ("Puente", "Pont"), ("Túnel", "Tunnel"), ("Estación", "Station"),
            ("Parada", "Arrêt"), ("Buscar", "Chercher"), ("Encontrar", "Trouver"), ("Llegar", "Arriver"),
            ("Partir", "Partir"), ("Ruta más rápida", "Chemin le plus rapide"), ("Peatón", "Piéton"),
            ("Zona peatonal", "Zone piétonne"), ("Pérdida", "Perte"), ("Ubicación", "Emplacement"),
            ("Distancia", "Distance"), ("Kilómetro", "Kilomètre")
        ],
        # Módulo 5: En la Ciudad (Fácil-Medio)
        [
            ("Ciudad", "Ville"), ("Centro de la ciudad", "Centre-ville"), ("Calle peatonal", "Rue piétonne"),
            ("Edificio", "Bâtiment"), ("Rascacielos", "Gratte-ciel"), ("Monumento", "Monument"),
            ("Museo", "Musée"), ("Iglesia", "Église"), ("Catedral", "Cathédrale"), ("Parque", "Parc"),
            ("Banco", "Banque"), ("Cajero automático", "Distributeur de billets"),
            ("Supermercado", "Supermarché"), ("Tienda de ropa", "Magasin de vêtements"),
            ("Farmacia", "Pharmacie"), ("Hospital", "Hôpital"), ("Oficina de correos", "Poste"),
            ("Estación de policía", "Commissariat de police"), ("Ayuntamiento", "Mairie"),
            ("Biblioteca", "Bibliothèque"), ("Teatro", "Théâtre"), ("Cine", "Cinéma"),
            ("Restaurante", "Restaurant"), ("Cafetería", "Café"), ("Bar", "Bar"),
            ("Mercado", "Marché"), ("Panadería", "Boulangerie"), ("Quiosco", "Kiosque"),
            ("Hotel", "Hôtel"), ("Atracción turística", "Attraction touristique"), ("Guía turístico", "Guide"),
            ("Tour de la ciudad", "Visite de la ville"), ("Entrada", "Billet d'entrée"), ("Precio", "Prix"),
            ("Horario de apertura", "Heures d'ouverture"), ("Abierto", "Ouvert"), ("Cerrado", "Fermé"),
            ("Descuento", "Réduction"), ("Gratis", "Gratuit"), ("Barrio", "Quartier"), ("Acera", "Trottoir"),
            ("Papelera", "Poubelle"), ("Fuente", "Fontaine"), ("Estatua", "Statue"), ("Ruta turística", "Circuit touristique"),
            ("Información", "Information"), ("Cruzar", "Traverser"), ("Explorar", "Explorer"), ("Fotografiar", "Photographier"),
            ("Cámara de fotos", "Appareil photo")
        ],
        # Módulo 6: En la Playa y la Naturaleza (Fácil-Medio)
        [
            ("Playa", "Plage"), ("Mar", "Mer"), ("Océano", "Océan"), ("Arena", "Sable"), ("Ola", "Vague"),
            ("Sol", "Soleil"), ("Calor", "Chaleur"), ("Sombrilla", "Parasol"), ("Toalla de playa", "Serviette de plage"),
            ("Traje de baño", "Maillot de bain"), ("Gafas de sol", "Lunettes de soleil"),
            ("Bloqueador solar", "Crème solaire"), ("Bañarse", "Se baigner"), ("Nadar", "Nager"),
            ("Bucear", "Plonger"), ("Tomar el sol", "Bronzer"), ("Concha marina", "Coquillage"),
            ("Cangrejo", "Crabe"), ("Salvavidas", "Maître-nageur"), ("Piscina", "Piscine"),
            ("Barco de vela", "Voilier"), ("Puerto", "Port"), ("Isla", "Île"), ("Costa", "Côte"),
            ("Acantilado", "Falaise"), ("Bosque", "Forêt"), ("Sendero", "Sentier"), ("Hacer senderismo", "Faire de la randonnée"),
            ("Montaña", "Montagne"), ("Lago", "Lac"), ("Río", "Rivière"), ("Catarata", "Cascade"),
            ("Valle", "Vallée"), ("Puesta de sol", "Coucher de soleil"), ("Amanecer", "Lever du soleil"),
            ("Acampar", "Camper"), ("Tienda de campaña", "Tente"), ("Fogata", "Feu de camp"),
            ("Mochila", "Sac à dos"), ("Linterna", "Lampe de poche"), ("Naturaleza", "Nature"),
            ("Árbol", "Arbre"), ("Flor", "Fleur"), ("Pájaro", "Oiseau"), ("Aire fresco", "Air pur"),
            ("Clima soleado", "Temps ensoleillé"), ("Brisa marina", "Brise marine"), ("Marea alta", "Marée haute"),
            ("Marea baja", "Marée basse"), ("Sombrilla de playa", "Parasol")
        ],
        # Módulo 7: Emergencias de Viaje (Fácil-Medio)
        [
            ("Ayuda", "Aide"), ("Socorro", "Au secours !"), ("Emergencia", "Urgence"), ("Accidente", "Accident"),
            ("Hospital", "Hôpital"), ("Médico", "Médecin"), ("Ambulancia", "Ambulance"), ("Policía", "Police"),
            ("Bomberos", "Pompiers"), ("Farmacia de guardia", "Pharmacie de garde"), ("Medicamento", "Médicament"),
            ("Dolor", "Douleur"), ("Enfermo", "Malade"), ("Herido", "Blessé"), ("Sangre", "Sang"),
            ("Robo", "Vol"), ("Ladrón", "Voleur"), ("Carterista", "Pickpocket"), ("Pérdida", "Perte"),
            ("Extraviado", "Égaré"), ("Seguro de viaje", "Assurance voyage"), ("Embajada", "Ambassade"),
            ("Consulado", "Consulat"), ("Llamada de emergencia", "Appel d'urgence"), ("Teléfono", "Téléphone"),
            ("Peligro", "Danger"), ("Seguro", "Sûr"), ("Fuego", "Feu"), ("Humo", "Fumée"),
            ("Salida de emergencia", "Sortie de secours"), ("Extintor", "Extincteur"),
            ("Botiquín", "Trousse de premiers secours"), ("Receta médica", "Ordonnance"),
            ("Alergia", "Allergie"), ("Fiebre", "Fièvre"), ("Fractura", "Fracture"), ("Herida", "Blessure"),
            ("Quemadura", "Brûlure"), ("Mareo", "Vertige"), ("Asfixia", "Étouffement"),
            ("Ayudar", "Aider"), ("Llamar a la policía", "Appeler la police"), ("Robar", "Voler"),
            ("Perder el pasaporte", "Perdre son passeport"), ("Bloquear tarjeta", "Bloquer la carte"),
            ("Dirección de emergencia", "Adresse d'urgence"), ("SOS", "SOS"), ("Alarma", "Alarme"),
            ("Refugio", "Abri"), ("Evacuación", "Évacuation")
        ],
        # Módulo 8: Compras Turísticas (Fácil-Medio)
        [
            ("Tienda", "Magasin"), ("Mercado", "Marché"), ("Souvenir", "Souvenir"), ("Regalo", "Cadeau"),
            ("Precio", "Prix"), ("¿Cuánto cuesta?", "Combien ça coûte ?"), ("Caro", "Cher"),
            ("Barato", "Bon marché"), ("Descuento", "Réduction"), ("Oferta", "Promotion"),
            ("Cajero", "Caissier"), ("Caja", "Caisse"), ("Bolsa", "Sac"), ("Efectivo", "Espèces"),
            ("Cambio", "Monnaie"), ("Tarjeta de crédito", "Carte de crédit"), ("Recibo", "Reçu"),
            ("Factura", "Facture"), ("Comprar", "Acheter"), ("Pagar", "Payer"),
            ("Probarse ropa", "Essayer des vêtements"), ("Probador", "Cabine d'essayage"),
            ("Talla", "Taille"), ("Color", "Couleur"), ("Garantía", "Garantie"), ("Devolución", "Retour"),
            ("Reembolso", "Remboursement"), ("Cliente", "Client"), ("Vendedor", "Vendeur"),
            ("Artesanía", "Artisanat"), ("Postal", "Carte postale"), ("Mapa", "Carte"),
            ("Libro de guía", "Guide de voyage"), ("Especialidad local", "Spécialité locale"),
            ("Comida típica", "Nourriture typique"), ("Centro comercial", "Centre commercial"),
            ("Supermercado", "Supermarché"), ("Joyas", "Bijoux"), ("Perfume", "Parfum"),
            ("Ropa típica", "Habits traditionnels"), ("Regatear", "Marchander"), ("Elegir", "Choisir"),
            ("Calidad", "Qualité"), ("Impuestos", "Taxes"), ("Libre de impuestos", "Duty-free"),
            ("Moneda local", "Monnaie locale"), ("Propinas", "Pourboires"), ("Costo total", "Coût total"),
            ("Billetera", "Portefeuille"), ("Monedero", "Porte-monnaie")
        ],
        # Módulo 9: Frases en el Restaurante (Fácil-Medio)
        [
            ("Mesa", "Table"), ("Reservar una mesa", "Réserver une table"), ("Menú", "Menu"),
            ("Carta de vinos", "Carte des vins"), ("Mesero", "Serveur"), ("Mesera", "Serveuse"),
            ("Plato", "Assiette"), ("Vaso", "Verre"), ("Copa de vino", "Verre de vin"),
            ("Agua mineral", "Eau minérale"), ("Pan", "Pain"), ("Cubiertos", "Couverts"),
            ("Tenedor", "Fourchette"), ("Cuchillo", "Couteau"), ("Cuchara", "Cuillère"),
            ("Servilleta", "Serviette"), ("Entrada (plato)", "Entrée"), ("Plato principal", "Plat principal"),
            ("Postre", "Dessert"), ("Café", "Café"), ("Cuenta", "Addition"),
            ("¿Nos trae la cuenta?", "L'addition, s'il vous plaît"), ("Propina", "Pourboire"),
            ("Pagar en efectivo", "Payer en espèces"), ("Pagar con tarjeta", "Payer par carte"),
            ("Delicioso", "Délicieux"), ("Excelente", "Excellent"), ("Buen provecho", "Bon appétit"),
            ("Salud (brindis)", "Santé !"), ("Agua del grifo", "Carafe d'eau"), ("Vegetariano", "Végétarien"),
            ("Vegano", "Végétalien"), ("Alergia alimentaria", "Allergie alimentaire"), ("Sin gluten", "Sans gluten"),
            ("Carne bien cocida", "Viande bien cuite"), ("Carne a término medio", "Viande à point"),
            ("Carne casi cruda", "Viande saignante"), ("Pedir", "Commander"), ("Recomendar", "Recommander"),
            ("Desayuno", "Petit-déjeuner"), ("Almuerzo", "Déjeuner"), ("Cena", "Dîner"),
            ("Cocina típica", "Cuisine locale"), ("Especialidad del chef", "Spécialité du chef"),
            ("Hielo", "Glaçons"), ("Sal", "Sel"), ("Pimienta", "Poivre"), ("Salsa", "Sauce"),
            ("Servicio incluido", "Service compris"), ("Estrella Michelin", "Étoile Michelin")
        ],
        # Módulo 10: Clima e Incidencias de Viaje (Fácil-Medio)
        [
            ("Clima", "Météo"), ("Previsión del tiempo", "Prévisions météo"), ("Lluvia", "Pluie"),
            ("Nieve", "Neige"), ("Tormenta", "Tempête"), ("Niebla", "Brouillard"), ("Viento fuerte", "Vent fort"),
            ("Ola de calor", "Vague de chaleur"), ("Frío extremo", "Froid extrême"), ("Humedad", "Humidité"),
            ("Retraso de vuelo", "Retard de vol"), ("Vuelo cancelado", "Vol annulé"),
            ("Pérdida de equipaje", "Perte de bagages"), ("Equipaje dañado", "Bagage endommagé"),
            ("Pérdida de conexión", "Correspondance ratée"), ("Huelga de transporte", "Grève des transports"),
            ("Tráfico pesado", "Embouteillage"), ("Carretera cortada", "Route barrée"),
            ("Avería del coche", "Panne de voiture"), ("Neumático desinflado", "Pneu crevé"),
            ("Falta de gasolina", "Panne d'essence"), ("Perder el tren", "Rater le train"),
            ("Boleto perdido", "Billet perdu"), ("Robo de cartera", "Vol de portefeuille"),
            ("Reserva no encontrada", "Réservation introuvable"), ("Habitación ruidosa", "Chambre bruyante"),
            ("Sin agua caliente", "Pas d'eau chaude"), ("Falla del Wi-Fi", "Panne de Wi-Fi"),
            ("Enfermedad del viajero", "Maladie du voyageur"), ("Quemadura de sol", "Coup de soleil"),
            ("Picadura de insecto", "Piqûre d'insecte"), ("Mareo en el viaje", "Mal des transports"),
            ("Falta de tiempo", "Manque de temps"), ("Reclamación", "Réclamation"),
            ("Oficina de quejas", "Bureau des réclamations"), ("Compensación", "Indemnisation"),
            ("Reembolso", "Remboursement"), ("Ayuda consular", "Assistance consulaire"),
            ("Asistencia en carretera", "Dépannage"), ("Seguro de viaje", "Assurance voyage"),
            ("Cambiar billete", "Modifier le billet"), ("Servicio al cliente", "Service client"),
            ("Incidencia", "Incident"), ("Solución", "Solution"), ("Esperar", "Attendre"),
            ("Solucionar", "Résoudre"), ("Disculparse", "S'excuser"), ("Comprensión", "Compréhension"),
            ("Paciencia", "Patience"), ("Viaje seguro", "Bon voyage")
        ]
    ],
    "business": [
        # Módulo 1: La Oficina (Medio)
        [
            ("Escritorio", "Bureau"), ("Silla ergonómica", "Chaise ergonomique"), ("Ordenador", "Ordinateur"),
            ("Teclado", "Clavier"), ("Ratón", "Souris"), ("Pantalla", "Écran"), ("Impresora", "Imprimante"),
            ("Escáner", "Scanner"), ("Fotocopiadora", "Photocopieuse"), ("Papel", "Papier"),
            ("Archivo", "Classeur"), ("Archivador", "Armoire à dossiers"), ("Documento", "Document"),
            ("Carpeta", "Dossier"), ("Bolígrafo", "Stylo"), ("Lápiz", "Crayon"),
            ("Calculadora", "Calculatrice"), ("Teléfono de oficina", "Téléphone de bureau"),
            ("Proyector", "Projecteur"), ("Pizarra blanca", "Tableau blanc"), ("Sala de reuniones", "Salle de réunion"),
            ("Sala de juntas", "Salle du conseil"), ("Recepción", "Réception"), ("Pasillo", "Couloir"),
            ("Cafetería", "Cafétéria"), ("Compañero de trabajo", "Collègue de travail"), ("Jefe", "Chef"),
            ("Director", "Directeur"), ("Gerente", "Manager"), ("Secretaria", "Secrétaire"),
            ("Asistente", "Assistant"), ("Horario de trabajo", "Heures de travail"),
            ("Jornada laboral", "Journée de travail"), ("Tiempo completo", "Temps plein"),
            ("Medio tiempo", "Temps partiel"), ("Horas extras", "Heures supplémentaires"),
            ("Pausa para el café", "Pause café"), ("Descanso", "Pause"), ("Almuerzo corporativo", "Déjeuner d'affaires"),
            ("Tarjeta de presentación", "Carte de visite"), ("Agenda", "Agenda"), ("Correo electrónico", "E-mail"),
            ("Bandeja de entrada", "Boîte de réception"), ("Enviar", "Envoyer"), ("Recibir", "Recevoir"),
            ("Firmar", "Signer"), ("Sello", "Tampon"), ("Grapadora", "Agrafeuse"),
            ("Clips", "Trombon"), ("Trituradora de papel", "Broyeur de papier")
        ],
        # Módulo 2: Reuniones y Juntas (Medio)
        [
            ("Reunión", "Réunion"), ("Convocatoria", "Convocation"), ("Orden del día", "Ordre du jour"),
            ("Acta de la reunión", "Compte rendu de réunion"), ("Participante", "Participant"),
            ("Organizador", "Organisateur"), ("Presentación", "Présentation"), ("Diapositiva", "Diapositive"),
            ("Punto clave", "Point clé"), ("Discutir", "Discuter"), ("Debatir", "Débattre"),
            ("Proponer", "Proposer"), ("Propuesta", "Proposition"), ("Sugerencia", "Suggestion"),
            ("Opinión", "Opinion"), ("Acuerdo", "Accord"), ("Desacuerdo", "Désaccord"),
            ("Llegar a un consenso", "Parvenir à un consensus"), ("Tomar una decisión", "Prendre une décision"),
            ("Votar", "Voter"), ("Voto", "Vote"), ("Unanimidad", "Unanimité"), ("Minuta", "Minutes"),
            ("Resumen", "Résumé"), ("Conclusión", "Conclusion"), ("Plan de acción", "Plan d'action"),
            ("Fecha límite", "Date limite"), ("Seguimiento", "Suivi"), ("Videoconferencia", "Vidéoconférence"),
            ("Llamada virtual", "Appel virtuel"), ("Pantalla compartida", "Partage d'écran"),
            ("Micrófono", "Microphone"), ("Silenciar", "Mettre en sourdine"), ("Interrumpir", "Interrompre"),
            ("Tomar la palabra", "Prendre la parole"), ("Ceder la palabra", "Céder la parole"),
            ("Preguntas y respuestas", "Questions-réponses"), ("Feedback", "Retour d'expérience"),
            ("Lluvia de ideas", "Remue-méninges"), ("Aplazar", "Reporter"), ("Adelantar", "Avancer"),
            ("Cancelar reunión", "Annuler la réunion"), ("Eficiente", "Efficace"),
            ("Productivo", "Productif"), ("Pérdida de tiempo", "Perte de temps"), ("Puntual", "Ponctuel"),
            ("Retraso", "Retard"), ("Ausencia", "Absence"), ("Presente", "Présent"), ("Invitar", "Inviter")
        ],
        # Módulo 3: Finanzas Corporativas (Medio)
        [
            ("Presupuesto", "Budget"), ("Ingresos", "Revenus"), ("Gastos", "Dépenses"), ("Costos", "Coûts"),
            ("Ganancia", "Bénéfice"), ("Pérdida", "Perte"), ("Factura", "Facture"), ("Recibo", "Reçu"),
            ("Pago", "Paiement"), ("Transferencia bancaria", "Virement bancaire"), ("Cuenta bancaria", "Compte bancaire"),
            ("Finanzas", "Finances"), ("Inversión", "Investissement"), ("Inversionista", "Investisseur"),
            ("Capital", "Capital"), ("Flujo de caja", "Flux de trésorerie"), ("Balance general", "Bilan"),
            ("Auditoría", "Audit"), ("Auditor", "Auditeur"), ("Impuestos", "Impôts"), ("Declaración de impuestos", "Déclaration d'impôts"),
            ("IVA", "TVA"), ("Rentabilidad", "Rentabilité"), ("Margen de ganancia", "Marge bénéficiaire"),
            ("Deuda", "Dette"), ("Préstamo", "Prêt"), ("Crédito", "Crédit"), ("Interés", "Intérêt"),
            ("Tasa de interés", "Taux d'intérêt"), ("Acciones", "Actions"), ("Accionista", "Actionnaire"),
            ("Dividendo", "Dividende"), ("Mercado de valores", "Bourse"), ("Activos", "Actifs"),
            ("Pasivos", "Passifs"), ("Liquidez", "Liquidité"), ("Quiebra", "Faillite"),
            ("Bancarrota", "Banqueroute"), ("Fusión", "Fusion"), ("Adquisición", "Acquisition"),
            ("Contabilidad", "Comptabilité"), ("Contador", "Comptable"), ("Gastos generales", "Frais généraux"),
            ("Reducción de costos", "Réduction des coûts"), ("Facturación", "Facturation"),
            ("Moneda extranjera", "Devise étrangère"), ("Tipo de cambio", "Taux de change"),
            ("Riesgo financiero", "Risque financier"), ("Subvención", "Subvention"), ("Patrocinio", "Parrainage")
        ],
        # Módulo 4: Recursos Humanos y Empleo (Medio)
        [
            ("Contratación", "Recrutement"), ("Empleo", "Emploi"), ("Puesto de trabajo", "Poste de travail"),
            ("Vacante", "Vacance"), ("Candidato", "Candidat"), ("Currículum", "Curriculum vitae"),
            ("Carta de presentación", "Lettre de motivation"), ("Entrevista de trabajo", "Entretien d'embauche"),
            ("Entrevistador", "Recruteur"), ("Seleccionar", "Sélectionner"), ("Contratar", "Embaucher"),
            ("Contrato de trabajo", "Contrat de travail"), ("Período de prueba", "Période d'essai"),
            ("Salario", "Salaire"), ("Sueldo base", "Salaire de base"), ("Nómina", "Fiche de paie"),
            ("Beneficios", "Avantages"), ("Seguro médico", "Assurance maladie"), ("Vacaciones pagadas", "Congés payés"),
            ("Licencia de maternidad", "Congé maternité"), ("Licencia médica", "Arrêt maladie"),
            ("Despido", "Licenciement"), ("Despedir", "Licencier"), ("Renunciar", "Démissionner"),
            ("Renuncia", "Démission"), ("Jubilación", "Retraite"), ("Jubilarse", "Prendre sa retraite"),
            ("Sindicato", "Syndicat"), ("Huelga", "Grève"), ("Formación", "Formation"),
            ("Capacitación", "Développement des compétences"), ("Evaluación de desempeño", "Évaluation des performances"),
            ("Ascenso", "Promotion"), ("Ascender", "Promouvoir"), ("Transferencia", "Mutation"),
            ("Recursos Humanos", "Ressources humaines"), ("Director de RRHH", "Directeur des RH"),
            ("Plantilla", "Effectif"), ("Clima laboral", "Climat de travail"), ("Motivación", "Motivation"),
            ("Liderazgo", "Leadership"), ("Trabajo en equipo", "Travail d'équipe"), ("Diversidad", "Diversité"),
            ("Discriminación", "Discrimination"), ("Acoso laboral", "Harcèlement professionnel"),
            ("Prevención de riesgos", "Prévention des risques"), ("Seguridad laboral", "Sécurité au travail"),
            ("Jornada flexible", "Horaires flexibles"), ("Teletrabajo", "Télétravail"), ("Fichar (entrada)", "Pointer")
        ],
        # Módulo 5: Negociación y Tratos (Medio)
        [
            ("Negociación", "Négociation"), ("Negociar", "Négocier"), ("Trato", "Accord"), ("Acuerdo", "Compromis"),
            ("Socio comercial", "Partenaire commercial"), ("Cliente", "Client"), ("Proveedor", "Fournisseur"),
            ("Competencia", "Concurrence"), ("Competidor", "Concurrent"), ("Estrategia", "Stratégie"),
            ("Táctica", "Tactique"), ("Oferta", "Offre"), ("Contraoferta", "Contre-offre"),
            ("Términos del contrato", "Termes du contrat"), ("Condiciones", "Conditions"),
            ("Firma del contrato", "Signature du contrat"), ("Firmar", "Signer"),
            ("Cerrar el trato", "Conclure l'affaire"), ("Renovar contrato", "Renouveler le contrat"),
            ("Romper contrato", "Résilier le contrat"), ("Monopolio", "Monopole"), ("Mercado", "Marché"),
            ("Demanda", "Demande"), ("Oferta comercial", "Proposition commerciale"), ("Margen de maniobra", "Marge de manœuvre"),
            ("Punto muerto", "Impasse"), ("Concesión", "Concession"), ("Beneficio mutuo", "Bénéfice mutuel"),
            ("Ganar-Ganar", "Gagnant-gagnant"), ("Poder de negociación", "Pouvoir de négociation"),
            ("Precio de venta", "Prix de vente"), ("Descuento", "Remise"), ("Volumen de compra", "Volume d'achat"),
            ("Plazo de entrega", "Délai de livraison"), ("Garantía comercial", "Garantie commerciale"),
            ("Penalización", "Pénalité"), ("Disputa", "Litige"), ("Mediación", "Médiation"),
            ("Arbitraje", "Arbitrage"), ("Tribunal comercial", "Tribunal de commerce"),
            ("Legal", "Légal"), ("Ilegal", "Illégal"), ("Cumplimiento", "Conformité"),
            ("Cláusula de rescisión", "Clause de résiliation"), ("Confidencialidad", "Confidentialité"),
            ("Acuerdo de no divulgación", "Accord de non-divulgation"), ("Ética empresarial", "Éthique des affaires"),
            ("Transparencia", "Transparence"), ("Reputación", "Réputation"), ("Imagen de marca", "Image de marque")
        ],
        # Módulo 6: Gestión de Proyectos (Medio)
        [
            ("Proyecto", "Projet"), ("Gestión de proyectos", "Gestion de projet"),
            ("Director de proyecto", "Chef de projet"), ("Planificación", "Planification"),
            ("Cronograma", "Calendrier de projet"), ("Fase", "Phase"), ("Etapa", "Étape"),
            ("Hito", "Jalon"), ("Fecha límite", "Date limite"), ("Retraso", "Retard"),
            ("Recursos", "Ressources"), ("Asignación de recursos", "Allocation des ressources"),
            ("Presupuesto de proyecto", "Budget du projet"), ("Desviación", "Écart"),
            ("Control de calidad", "Contrôle qualité"), ("Garantía de calidad", "Assurance qualité"),
            ("Riesgo", "Risque"), ("Gestión de riesgos", "Gestion des risques"), ("Plan de contingencia", "Plan de contingence"),
            ("Entrega", "Livrable"), ("Entregar", "Livrer"), ("Cliente final", "Client final"),
            ("Especificaciones", "Spécifications"), ("Requisitos", "Exigences"), ("Cambio de alcance", "Modification de la portée"),
            ("Reunión de inicio", "Réunion de lancement"), ("Progreso", "Progrès"), ("Informe de estado", "Rapport d'avancement"),
            ("Subcontratación", "Sous-traitance"), ("Subcontratar", "Sous-traiter"), ("Socio", "Partenaire"),
            ("Colaboración", "Collaboration"), ("Coordinación", "Coordination"), ("Equipo de proyecto", "Équipe de projet"),
            ("Metodología", "Méthodologie"), ("Agile", "Agile"), ("Scrum", "Scrum"), ("Kanban", "Kanban"),
            ("Flujo de trabajo", "Flux de travail"), ("Cuello de botella", "Goulot d'étranglement"),
            ("Optimización", "Optimisation"), ("Rendimiento", "Performance"), ("Indicador clave", "Indicateur clé"),
            ("KPI", "KPI"), ("Éxito del proyecto", "Succès du projet"), ("Fracaso", "Échec"),
            ("Evaluación", "Évaluation"), ("Lecciones aprendidas", "Leçons apprises"),
            ("Cierre de proyecto", "Clôture du projet"), ("Archivar", "Archiver")
        ],
        # Módulo 7: Liderazgo y Roles Ejecutivos (Medio)
        [
            ("Liderazgo", "Leadership"), ("Líder", "Leader"), ("Director General", "Directeur général"),
            ("Presidente", "Président"), ("Vicepresidente", "Vice-président"),
            ("Director Financiero", "Directeur financier"), ("Director de Operaciones", "Directeur des opérations"),
            ("Director de Tecnología", "Directeur de la technologie"), ("Gerente de sucursal", "Directeur de filiale"),
            ("Supervisor", "Superviseur"), ("Coordinador", "Coordinateur"), ("Responsable", "Responsable"),
            ("Jefe de departamento", "Chef de département"), ("Mando intermedio", "Cadre moyen"),
            ("Ejecutivo", "Cadre"), ("Junta directiva", "Conseil d'administration"), ("CEO", "PDG"),
            ("Autoridad", "Autorité"), ("Poder", "Pouvoir"), ("Responsabilidad", "Responsabilité"),
            ("Toma de decisiones", "Prise de décision"), ("Delegar", "Délégué"), ("Delegación", "Délégation"),
            ("Visión estratégica", "Vision stratégique"), ("Misión de la empresa", "Mission de l'entreprise"),
            ("Valores corporativos", "Valeurs de l'entreprise"), ("Cultura de empresa", "Culture d'entreprise"),
            ("Motivar", "Motiver"), ("Inspirar", "Inspirer"), ("Influencia", "Influence"),
            ("Mentor", "Mentor"), ("Mentoría", "Mentorat"), ("Entrenamiento", "Coaching"),
            ("Desarrollo profesional", "Développement professionnel"), ("Capacidad de análisis", "Capacité d'analyse"),
            ("Resolución de problemas", "Résolution de problèmes"), ("Inteligencia emocional", "Intelligence émotionnelle"),
            ("Empatía", "Empathie"), ("Comunicación asertiva", "Communication assertive"),
            ("Gestión del cambio", "Gestion du changement"), ("Innovación", "Innovation"),
            ("Creatividad", "Créativité"), ("Objetivos estratégicos", "Objectifs stratégiques"),
            ("Resultados", "Résultats"), ("Productividad", "Productivité"), ("Eficiencia", "Efficacité"),
            ("Competitividad", "Compétitivité"), ("Crecimiento corporativo", "Croissance de l'entreprise"),
            ("Éxito ejecutivo", "Succès managérial"), ("Prestigio", "Prestige")
        ],
        # Módulo 8: Ventas y Distribución (Medio)
        [
            ("Ventas", "Ventes"), ("Volumen de ventas", "Volume des ventes"), ("Fuerza de ventas", "Force de vente"),
            ("Vendedor", "Vendeur"), ("Comercial", "Commercial"), ("Representante de ventas", "Représentant commercial"),
            ("Canal de distribución", "Canal de distribution"), ("Distribuidor", "Distributeur"),
            ("Mayorista", "Grossiste"), ("Minorista", "Détaillant"), ("Punto de venta", "Point de vente"),
            ("Comercio electrónico", "E-commerce"), ("Exportación", "Exportation"), ("Importación", "Importation"),
            ("Logística", "Logistique"), ("Cadena de suministro", "Chaîne d'approvisionnement"),
            ("Transporte", "Transport"), ("Almacenamiento", "Stockage"), ("Almacén", "Entrepôt"),
            ("Inventario", "Inventaire"), ("Control de stock", "Contrôle des stocks"),
            ("Rotación de inventario", "Rotation des stocks"), ("Desabastecimiento", "Rupture de stock"),
            ("Pedido", "Commande"), ("Procesamiento de pedidos", "Traitement des commandes"),
            ("Envío", "Expédition"), ("Fecha de entrega", "Date de livraison"), ("Entrega a domicilio", "Livraison à domicile"),
            ("Servicio posventa", "Service après-vente"), ("Garantía", "Garantie"),
            ("Atención al cliente", "Service client"), ("Satisfacción del cliente", "Satisfaction client"),
            ("Fidelización de clientes", "Fidélisation de la clientèle"), ("Queja del cliente", "Réclamation client"),
            ("Devolución de mercancía", "Retour de marchandise"), ("Reembolso", "Remboursement"),
            ("Facturación", "Facturation"), ("Precio unitario", "Prix unitaire"),
            ("Descuento por volumen", "Remise sur volume"), ("Condiciones de pago", "Conditions de paiement"),
            ("Crédito comercial", "Crédit commercial"), ("Cobro", "Encaissement"), ("Impagado", "Impayé"),
            ("Mercancía", "Marchandise"), ("Embalaje", "Emballage"), ("Etiqueta", "Étiquette"),
            ("Código de barras", "Code-barres"), ("Seguimiento de envío", "Suivi de colis"),
            ("Flete", "Fret"), ("Aduanas", "Douanes")
        ],
        # Módulo 9: Comunicación Corporativa y RRPP (Medio)
        [
            ("Comunicación", "Communication"), ("Relaciones Públicas", "Relations publiques"),
            ("Comunicado de prensa", "Communiqué de presse"), ("Rueda de prensa", "Conférence de presse"),
            ("Periodista", "Journaliste"), ("Medios de comunicación", "Médias"),
            ("Cobertura mediática", "Couverture médiatique"), ("Entrevista", "Entretien"),
            ("Portavoz", "Porte-parole"), ("Reputación corporativa", "Réputation de l'entreprise"),
            ("Imagen pública", "Image publique"), ("Responsabilidad social", "Responsabilité sociale des entreprises"),
            ("RSE", "RSE"), ("Crisis de reputación", "Crise de réputation"),
            ("Gestión de crisis", "Gestion de crise"), ("Boletín interno", "Newsletter interne"),
            ("Intranet", "Intranet"), ("Evento corporativo", "Événement d'entreprise"), ("Patrocinio", "Sponsorisation"),
            ("Patrocinador", "Sponsor"), ("Mecenazgo", "Mécénat"), ("Identidad corporativa", "Identité visuelle"),
            ("Manual de marca", "Charte graphique"), ("Slogan", "Slogan"), ("Público objetivo", "Public cible"),
            ("Mensaje clave", "Message clé"), ("Estrategia de comunicación", "Stratégie de communication"),
            ("Campaña de RRPP", "Campagne de RP"), ("Lanzamiento", "Lancement"), ("Presentación de producto", "Lancement de produit"),
            ("Feria comercial", "Salon professionnel"), ("Exposición", "Exposition"), ("Networking", "Réseautage"),
            ("Contacto de negocios", "Contact professionnel"), ("Relaciones institucionales", "Relations institutionnelles"),
            ("Lobby", "Lobbying"), ("Lobbista", "Lobbyiste"), ("Opinión pública", "Opinion publique"),
            ("Encuesta de opinión", "Sondage d'opinion"), ("Gabinete de prensa", "Service de presse"),
            ("Dossier de prensa", "Dossier de presse"), ("Transmisión en vivo", "Diffusion en direct"),
            ("Redes sociales corporativas", "Réseaux sociaux d'entreprise"), ("Seguidor", "Abonné"),
            ("Comunidad virtual", "Communauté virtuelle"), ("Influencer", "Influenceur"),
            ("Embajador de marca", "Ambassadeur de marque"), ("Notoriedad", "Notoriété"),
            ("Ética en comunicación", "Éthique de la communication"), ("Transparencia informativa", "Transparence de l'information")
        ],
        # Módulo 10: Legal y Cumplimiento (Medio)
        [
            ("Asesoría jurídica", "Conseil juridique"), ("Abogado de empresa", "Avocat d'affaires"),
            ("Contrato legal", "Contrat légal"), ("Cláusula contractual", "Clause contractuelle"),
            ("Validez jurídica", "Validité juridique"), ("Incumplimiento de contrato", "Rupture de contrat"),
            ("Propiedad intelectual", "Propriété intellectuelle"), ("Patente", "Brevet"),
            ("Marca registrada", "Marque déposée"), ("Derechos de autor", "Droits d'auteur"),
            ("Licencia comercial", "Licence commerciale"), ("Cumplimiento normativo", "Conformité"),
            ("Regulación", "Règlementation"), ("Normativa del sector", "Normes du secteur"),
            ("Protección de datos", "Protection des données"), ("RGPD", "RGPD"),
            ("Privacidad de la información", "Confidentialité des données"), ("Litigio legal", "Litige juridique"),
            ("Demanda judicial", "Poursuite judiciaire"), ("Tribunal", "Tribunal"), ("Juicio", "Procès"),
            ("Juez", "Juge"), ("Sentencia", "Jugement"), ("Multa administrativa", "Amende administrative"),
            ("Sanción", "Sanction"), ("Responsabilidad civil", "Responsabilité civile"),
            ("Firma digital", "Signature électronique"), ("Poder notarial", "Procuration"),
            ("Notario", "Notaire"), ("Escritura pública", "Acte notarié"), ("Registro mercantil", "Registre du commerce"),
            ("Constitución de sociedad", "Création de société"), ("Estatutos de la sociedad", "Statuts de la société"),
            ("Asamblea general", "Assemblée générale"), ("Derecho laboral", "Droit du travail"),
            ("Derecho mercantil", "Droit commercial"), ("Derecho fiscal", "Droit fiscal"),
            ("Evasión de impuestos", "Évasion fiscale"), ("Fraude", "Fraude"), ("Corrupción", "Corruption"),
            ("Blanqueo de capitales", "Blanchiment d'argent"), ("Lucha contra el fraude", "Lutte contre la fraude"),
            ("Código ético", "Code de déontologie"), ("Canal de denuncias", "Lanceur d'alerte"),
            ("Riesgo legal", "Risque juridique"), ("Auditoría legal", "Audit légal"), ("Arbitraje comercial", "Arbitrage"),
            ("Jurisprudencia", "Jurisprudence"), ("Seguro de responsabilidad", "Assurance responsabilité civile"),
            ("Liquidación de empresa", "Liquidation d'entreprise")
        ]
    ],
    "marketing": [
        # Módulo 1: Conceptos de Marca (Medio)
        [
            ("Marca", "Marque"), ("Identidad de marca", "Identité de marque"), ("Imagen de marca", "Image de marque"),
            ("Logotipo", "Logotype"), ("Eslogan", "Slogan"), ("Manual de marca", "Charte graphique"),
            ("Posicionamiento", "Positionnement"), ("Valor de marca", "Capital de marque"),
            ("Fidelidad a la marca", "Fidélité à la marque"), ("Reconocimiento de marca", "Notoriété de la marque"),
            ("Nombre de marca", "Nom de marque"), ("Esencia de marca", "Essence de la marque"),
            ("Promesa de marca", "Promesse de marque"), ("Asociaciones de marca", "Associations de marque"),
            ("Extensión de marca", "Extension de marque"), ("Co-branding", "Co-marquage"),
            ("Marca propia", "Marque propre"), ("Marca blanca", "Marque distributeur"),
            ("Diferenciación", "Différenciation"), ("Ventaja competitiva", "Avantage concurrentiel"),
            ("Público objetivo", "Public cible"), ("Cliente ideal", "Client idéal"), ("Buyer persona", "Buyer persona"),
            ("Segmentación", "Segmentation"), ("Mercado objetivo", "Marché cible"), ("Nicho de mercado", "Niche de marché"),
            ("Ciclo de vida del producto", "Cycle de vie du produit"), ("Desarrollo de producto", "Développement de produit"),
            ("Lanzamiento de marca", "Lancement de la marque"), ("Relanzamiento", "Relancement"),
            ("Estrategia de marca", "Stratégie de marque"), ("Brand manager", "Chef de marque"),
            ("Consistencia de marca", "Cohérence de la marque"), ("Experiencia de marca", "Expérience de marque"),
            ("Punto de contacto", "Point de contact"), ("Embalaje de marca", "Packaging"),
            ("Diseño corporativo", "Design d'entreprise"), ("Valores de marca", "Valeurs de marque"),
            ("Narrativa de marca", "Storytelling"), ("Mensaje de marca", "Message de marque"),
            ("Autenticidad de marca", "Authenticité"), ("Credibilidad", "Crédibilité"), ("Confianza", "Confiance"),
            ("Afinidad de marca", "Affinité de marque"), ("Embajador de marca", "Ambassadeur de marque"),
            ("Evangelista de marca", "Évangéliste de la marque"), ("Propiedad intelectual de la marca", "Propriété de la marque"),
            ("Protección de marca", "Protection de la marque"), ("Piratería de marca", "Contrefaçon"),
            ("Auditoría de marca", "Audit de marque")
        ],
        # Módulo 2: Publicidad y Campañas (Medio)
        [
            ("Publicidad", "Publicité"), ("Anuncio", "Annonce"), ("Campaña publicitaria", "Campagne publicitaire"),
            ("Agencia de publicidad", "Agence de publicité"), ("Anunciante", "Annonceur"), ("Medio publicitario", "Support publicitaire"),
            ("Medios masivos", "Médias de masse"), ("Publicidad exterior", "Publicité extérieure"),
            ("Cartel publicitario", "Affiche publicitaire"), ("Valla publicitaria", "Panneau publicitaire"),
            ("Folleto publicitario", "Prospectus"), ("Catálogo", "Catalogue"), ("Spot de televisión", "Spot télévisé"),
            ("Anuncio de radio", "Publicité radio"), ("Publicidad impresa", "Publicité écrite"),
            ("Publicidad digital", "Publicité digitale"), ("Banner publicitario", "Bannière publicitaire"),
            ("Anuncio pop-up", "Fenêtre contextuelle"), ("Publicidad nativa", "Publicité native"),
            ("Anuncio patrocinado", "Lien sponsorisé"), ("Redacción publicitaria", "Conception-rédaction"),
            ("Redactor creativo", "Concepteur-rédacteur"), ("Director de arte", "Directeur artistique"),
            ("Presupuesto de campaña", "Budget de campagne"), ("Gasto publicitario", "Dépenses publicitaires"),
            ("Retorno de la inversión publicitaria", "ROAS"), ("Impresión publicitaria", "Impression"),
            ("Alcance de campaña", "Portée"), ("Frecuencia de exposición", "Fréquence"),
            ("Costo por mil", "Coût pour mille"), ("CPM", "CPM"), ("Costo por clic", "Coût par clic"),
            ("CPC", "CPC"), ("Costo por adquisición", "Coût par acquisition"), ("CPA", "CPA"),
            ("Tasa de clics", "Taux de clics"), ("CTR", "CTR"), ("Punto de venta publicitario", "PLV"),
            ("Eslogan de campaña", "Accroche"), ("Llamado a la acción", "Appel à l'action"),
            ("CTA", "CTA"), ("Prueba A/B", "Test A/B"), ("Público meta", "Cible"),
            ("Impacto publicitario", "Impact publicitaire"), ("Eficacia publicitaria", "Efficacité publicitaire"),
            ("Creatividad publicitaria", "Créativité"), ("Persuasión", "Persuasion"),
            ("Mensaje publicitario", "Message publicitaire"), ("Regulación publicitaria", "Réglementation publicitaire"),
            ("Ética publicitaria", "Éthique publicitaire"), ("Publicidad engañosa", "Publicité mensongère")
        ],
        # Módulo 3: Marketing Digital y Redes Sociales (Medio)
        [
            ("Marketing Digital", "Marketing digital"), ("Redes sociales", "Réseaux sociaux"),
            ("Gestor de redes sociales", "Community manager"), ("Publicación", "Publication"),
            ("Post", "Post"), ("Compartir", "Partager"), ("Me gusta", "J'aime"),
            ("Comentario", "Commentaire"), ("Seguidor", "Abonné"), ("Perfil en línea", "Profil en ligne"),
            ("Cuenta de empresa", "Compte professionnel"), ("Hashtag", "Hashtag"), ("Tendencia", "Tendance"),
            ("Viral", "Viral"), ("Contenido viral", "Contenu viral"),
            ("Compromiso digital", "Engagement"), ("Tasa de compromiso", "Taux d'engagement"),
            ("Marketing de contenidos", "Marketing de contenu"), ("Blog de marketing", "Blog de marketing"),
            ("Creador de contenidos", "Créateur de contenu"), ("Influencer", "Influenceur"),
            ("Embajador digital", "Ambassadeur digital"), ("Red social corporativa", "Réseau social d'entreprise"),
            ("Transmisión en directo", "Diffusion en direct"), ("Líder de opinión", "Leader d'opinion"),
            ("Seguidores activos", "Abonnés actifs"), ("Pérdida de seguidores", "Désabonnements"),
            ("Alcance orgánico", "Portée organique"), ("Alcance pagado", "Portée payante"),
            ("Anuncio en redes sociales", "Social ad"), ("Administrador de anuncios", "Gestionnaire de publicités"),
            ("Público personalizado", "Audience personnalisée"), ("Remarketing", "Remarketing"),
            ("Segmentación digital", "Ciblage digital"), ("Pixel de seguimiento", "Pixel de suivi"),
            ("Analítica web", "Analyses Web"), ("Google Analytics", "Google Analytics"),
            ("Tráfico web", "Trafic Web"), ("Página de aterrizaje", "Page d'atterrissage"),
            ("Tasa de rebote", "Taux de rebond"), ("Tiempo de permanencia", "Temps de session"),
            ("Conversión digital", "Conversion digitale"), ("Embudo de conversión", "Tunnel de conversion"),
            ("Generación de prospectos", "Génération de leads"), ("Suscriptor de boletín", "Abonné à la newsletter"),
            ("Boletín digital", "Newsletter"), ("Marketing por correo", "E-mailing"),
            ("Tasa de apertura", "Taux d'ouverture"), ("Tasa de cancelación de suscripción", "Taux de désinscription"),
            ("Reputación en línea", "E-réputation")
        ],
        # Módulo 4: SEO y SEM (Medio)
        [
            ("SEO", "SEO"), ("Optimización en motores de búsqueda", "Optimisation pour les moteurs de recherche"),
            ("SEM", "SEM"), ("Marketing en motores de búsqueda", "Marketing sur les moteurs de recherche"),
            ("Palabra clave", "Mot-clé"), ("Palabra clave de cola larga", "Mot-clé de longue traîne"),
            ("Volumen de búsqueda", "Volume de recherche"), ("Dificultad de palabra clave", "Difficulté de mot-clé"),
            ("Motor de búsqueda", "Moteur de recherche"), ("Google", "Google"),
            ("Resultados de búsqueda", "Résultats de recherche"), ("SERP", "SERP"),
            ("SEO en la página", "SEO on-page"), ("SEO fuera de la página", "SEO off-page"),
            ("SEO técnico", "SEO technique"), ("Enlace entrante", "Lien retour"), ("Backlink", "Backlink"),
            ("Enlace interno", "Lien interne"), ("Enlace externo", "Lien externe"),
            ("Texto de anclaje", "Texte d'ancrage"), ("Autoridad de dominio", "Autorité de domaine"),
            ("Autoridad de página", "Autorité de page"), ("Indexación", "Indexation"),
            ("Rastreo web", "Exploration"), ("Algoritmo de búsqueda", "Algorithme de recherche"),
            ("Penalización de Google", "Pénalité Google"), ("Contenido duplicado", "Contenu dupliqué"),
            ("Etiqueta de título", "Balise de titre"), ("Meta descripción", "Méta description"),
            ("Etiqueta Alt de imagen", "Balise alt d'image"), ("Etiqueta de encabezado", "Balise H1-H6"),
            ("Velocidad de carga de la página", "Vitesse de page"), ("Diseño adaptable", "Responsive design"),
            ("Mapa del sitio XML", "Plan du site XML"), ("Robots.txt", "Robots.txt"),
            ("Anuncio de búsqueda pagado", "Annonce de recherche payante"), ("Google Ads", "Google Ads"),
            ("Subasta de anuncios", "Enchère publicitaire"), ("Nivel de calidad", "Score de qualité"),
            ("Costo por clic máximo", "CPC max"), ("CPC medio", "CPC moyen"),
            ("Red de búsqueda de Google", "Réseau de recherche Google"), ("Red de Display de Google", "Réseau Display"),
            ("Extensión de anuncio", "Extension d'annonce"), ("Grupo de anuncios", "Groupe d'annonces"),
            ("Campaña de SEM", "Campagne SEM"), ("Tasa de conversión de SEM", "Taux de conversion SEM"),
            ("Gasto de SEM", "Dépenses SEM"), ("Retorno de inversión de SEM", "ROI SEM"),
            ("Tráfico orgánico", "Trafic organique"), ("Tráfico de pago", "Trafic payant")
        ],
        # Módulo 5: Estrategias de Contenido (Medio)
        [
            ("Estrategia de contenidos", "Stratégie de contenu"), ("Marketing de contenidos", "Marketing de contenu"),
            ("Creador de contenidos", "Créateur de contenu"), ("Redactor de contenidos", "Rédacteur de contenu"),
            ("Editor de contenidos", "Éditeur de contenu"), ("Calendario editorial", "Calendrier éditorial"),
            ("Planificación de contenidos", "Planification du contenu"), ("Auditoría de contenidos", "Audit de contenu"),
            ("Contenido de valor", "Contenu à valeur ajoutée"), ("Contenido educativo", "Contenu éducatif"),
            ("Contenido interactivo", "Contenu interactif"), ("Entrada de blog", "Article de blog"),
            ("Libro electrónico", "Livre blanc"), ("Infografía", "Infographie"),
            ("Caso de éxito", "Étude de cas"), ("Testimonio de cliente", "Témoignage client"),
            ("Video marketing", "Marketing vidéo"), ("Podcast de marketing", "Podcast"),
            ("Seminario web", "Webinaire"), ("Presentación en línea", "Présentation en ligne"),
            ("Boletín informativo", "Newsletter"), ("Contenido generado por el usuario", "UGC"),
            ("UGC", "UGC"), ("Narrativa de marca", "Storytelling"), ("Tono de voz de la marca", "Ton de voix"),
            ("Línea editorial", "Ligne éditoriale"), ("Curación de contenidos", "Curation de contenu"),
            ("Distribución de contenidos", "Distribution du contenu"), ("Promoción de contenidos", "Promotion du contenu"),
            ("Reutilización de contenidos", "Recyclage de contenu"), ("Contenido de hoja perenne", "Contenu intemporel"),
            ("Contenido de tendencia", "Contenu d'actualité"), ("Embudo de marketing", "Tunnel de marketing"),
            ("Contenido para la parte superior", "Contenu TOFU"), ("Contenido para la parte media", "Contenu MOFU"),
            ("Contenido para la parte inferior", "Contenu BOFU"), ("Llamado a la acción", "Appel à l'action"),
            ("CTA", "CTA"), ("Optimización de contenidos", "Optimisation du contenu"),
            ("Legibilidad de contenido", "Lisibilité"), ("Originalidad de contenido", "Originalité"),
            ("Propiedad del contenido", "Droits d'auteur du contenu"), ("Plagio de contenidos", "Plagiat de contenu"),
            ("Autoría de contenidos", "Auteur du contenu"), ("Rendimiento de contenidos", "Performance du contenu"),
            ("Tasa de lectura", "Taux de lecture"), ("Tiempo de lectura de página", "Temps de lecture de la page"),
            ("Interacciones con el contenido", "Partages du contenu"), ("Valoración de contenidos", "Évaluation du contenu"),
            ("Comentarios del lector", "Commentaires des lecteurs")
        ],
        # Módulo 6: Métricas y KPIs de Marketing (Medio)
        [
            ("Métrica de marketing", "Métrique marketing"), ("Indicador clave de rendimiento", "KPI"),
            ("KPI de marketing", "KPI marketing"), ("Retorno de la inversión de marketing", "ROI marketing"),
            ("Tasa de conversión de marketing", "Taux de conversion"), ("Tasa de clics de marketing", "CTR"),
            ("Costo por adquisición", "CPA"), ("Costo por lead", "CPL"),
            ("Valor del tiempo de vida del cliente", "LTV"), ("Costo de adquisición de clientes", "CAC"),
            ("Tasa de retención de clientes", "Taux de rétention"), ("Tasa de abandono de clientes", "Taux de désabonnement"),
            ("Tasa de rebote web", "Taux de rebond"), ("Tráfico de sitio web", "Trafic de site Web"),
            ("Visitas a la página web", "Vues de page"), ("Sesión de usuario web", "Session utilisateur"),
            ("Usuario único web", "Visiteur unique"), ("Tiempo de sesión medio web", "Durée moyenne des sessions"),
            ("Prospecto calificado por marketing", "MQL"), ("Prospecto calificado por ventas", "SQL"),
            ("Prospecto comercial", "Lead"), ("Tasa de cierre de ventas", "Taux de clôture"),
            ("Ingreso de marketing", "Revenus marketing"), ("Costo publicitario", "Coût publicitaire"),
            ("Gasto en marketing", "Dépenses de marketing"), ("Impresión digital", "Impression"),
            ("Alcance de campaña", "Portée de campagne"), ("Frecuencia de exposición", "Fréquence d'exposition"),
            ("Tasa de apertura de correo electrónico", "Taux d'ouverture d'e-mail"),
            ("Tasa de clics de correo electrónico", "Taux de clics d'e-mail"),
            ("Tasa de rebote de correo electrónico", "Taux de rebond d'e-mail"),
            ("Tasa de spam", "Taux de spam"), ("Compartidos en redes sociales", "Partages sociaux"),
            ("Menciones de marca", "Mentions de marque"), ("Cuota de voz de la marca", "Part de voix"),
            ("Puntaje neto del promotor", "NPS"), ("Satisfacción del cliente", "Satisfaction client"),
            ("Retención del cliente", "Rétention client"), ("Valor de por vida del cliente", "Valeur à vie du client"),
            ("Ratio de conversión del embudo", "Ratio de conversion du tunnel"), ("Analítica digital", "Analyses digitales"),
            ("Tablero de KPIs", "Tableau de bord de KPI"), ("Google Analytics", "Google Analytics"),
            ("Datos de marketing", "Données marketing"), ("Informe de marketing", "Rapport marketing"),
            ("Análisis de datos de marketing", "Analyse des données"), ("Optimización de KPIs", "Optimisation des KPI"),
            ("Métrica de vanidad", "Métrique de vanité"), ("Métrica accionable", "Métrique exploitable")
        ],
        # Módulo 7: Investigación de Mercado (Medio)
        [
            ("Investigación de mercado", "Étude de marché"), ("Análisis de mercado", "Analyse de marché"),
            ("Encuesta de mercado", "Sondage de marché"), ("Cuestionario de encuesta", "Questionnaire d'enquête"),
            ("Grupo focal", "Groupe de discussion"), ("Entrevista cualitativa", "Entretien qualitatif"),
            ("Datos primarios de mercado", "Données primaires"), ("Datos secundarios de mercado", "Données secondaires"),
            ("Investigación cualitativa", "Recherche qualitative"), ("Investigación cuantitativa", "Recherche quantitative"),
            ("Muestra de mercado", "Échantillon"), ("Tamaño de muestra de mercado", "Taille de l'échantillon"),
            ("Sesgo de muestra de mercado", "Biais d'échantillonnage"), ("Público objetivo", "Public cible"),
            ("Segmentación de mercado", "Segmentation du marché"), ("Demografía de mercado", "Démographie"),
            ("Psicografía de mercado", "Psychographie"), ("Comportamiento de compra del consumidor", "Comportement du consommateur"),
            ("Tendencia de mercado", "Tendance du marché"), ("Tamaño del mercado", "Taille du marché"),
            ("Cuota de mercado", "Part de marché"), ("Crecimiento del mercado", "Croissance du marché"),
            ("Mercado saturado", "Marché saturé"), ("Barrera de entrada al mercado", "Barrière à l'entrée"),
            ("Competencia de mercado", "Concurrence"), ("Análisis de la competencia de mercado", "Analyse de la concurrence"),
            ("Benchmarking", "Benchmarking"), ("Análisis FODA", "Analyse FFOM"),
            ("Fortaleza FODA", "Force"), ("Oportunidad FODA", "Opportunité"),
            ("Debilidad FODA", "Faiblesse"), ("Amenaza FODA", "Menace"),
            ("Prueba de concepto de producto", "Test de concept"), ("Prueba de mercado de producto", "Test de marché"),
            ("Lanzamiento de prueba", "Lancement test"), ("Comentarios del cliente", "Commentaires des clients"),
            ("Satisfacción del cliente", "Satisfaction de la clientèle"), ("Puntaje NPS de lealtad", "Score NPS"),
            ("Fidelización de clientes", "Fidélisation client"), ("Tasa de pérdida de clientes", "Taux d'attrition"),
            ("Preferencias del consumidor", "Préférences des consommateurs"), ("Hábitos de consumo", "Habitudes de consommation"),
            ("Perfil del consumidor", "Profil du consommateur"), ("Segmento de mercado", "Segment de marché"),
            ("Mercado potencial", "Marché potentiel"), ("Nicho de mercado", "Niche de marché"),
            ("Demanda del consumidor", "Demande des consommateurs"), ("Poder adquisitivo de mercado", "Pouvoir d'achat"),
            ("Elasticidad de precio de la demanda", "Élasticité-prix de la demande"), ("Estudio de viabilidad comercial", "Étude de faisabilité")
        ],
        # Módulo 8: Relaciones Públicas y Eventos (Medio)
        [
            ("Relaciones Públicas", "Relations publiques"), ("RRPP de marketing", "RP"),
            ("Comunicado de prensa", "Communiqué de presse"), ("Dossier de prensa", "Dossier de presse"),
            ("Rueda de prensa", "Conférence de presse"), ("Periodista de prensa", "Journaliste"),
            ("Medios de comunicación de masas", "Médias"), ("Cobertura de medios de comunicación", "Couverture médiatique"),
            ("Contacto de prensa", "Contact presse"), ("Relaciones con los medios", "Relations médias"),
            ("Portavoz de la marca", "Porte-parole"), ("Reputación de la marca", "Réputation de marque"),
            ("Gestión de la reputación corporativa", "Gestion de la réputation"), ("Crisis de reputación de marca", "Crise de réputation"),
            ("Gabinete de prensa de la marca", "Bureau de presse"), ("Evento corporativo", "Événement d'entreprise"),
            ("Evento promocional de marketing", "Événement promotionnel"), ("Feria comercial del sector", "Salon professionnel"),
            ("Exposición comercial", "Exposition commerciale"), ("Patrocinio de eventos", "Sponsorisation d'événements"),
            ("Patrocinador del evento", "Sponsor de l'événement"), ("Mecenazgo de marketing", "Mécénat"),
            ("Networking corporativo", "Réseautage"), ("Cóctel de networking", "Cocktail de réseautage"),
            ("Presentación de producto", "Présentation de produit"), ("Lanzamiento de producto de marketing", "Lancement de produit"),
            ("Conferencia ejecutiva", "Conférence"), ("Seminario corporativo", "Séminaire"),
            ("Embajador de la marca", "Ambassadeur de la marque"), ("Influencer de marketing", "Influenceur"),
            ("Líder de opinión sectorial", "Leader d'opinion"), ("Notoriedad de la marca", "Notoriété de la marque"),
            ("Imagen pública de marca", "Image publique"), ("Relaciones comunitarias de marketing", "Relations avec la communauté"),
            ("Responsabilidad social de la marca", "RSE de la marque"), ("RSE corporativa", "RSE"),
            ("Manual de crisis de marca", "Plan de gestion de crise"), ("Imagen corporativa", "Image de l'entreprise"),
            ("Identidad visual de la marca", "Identité visuelle"), ("Logotipo de la marca", "Logo de la marque"),
            ("Eslogan de la marca", "Slogan"), ("Público meta de marketing", "Public cible"),
            ("Mensaje clave de marketing", "Message clé"), ("Estrategia de RRPP de marketing", "Stratégie de RP"),
            ("Campaña de RRPP de marketing", "Campagne de RP"), ("Lanzamiento promocional de marketing", "Lancement"),
            ("Feria de muestras comercial", "Foire commerciale"), ("Contacto de negocios de marketing", "Contact professionnel"),
            ("Transmisión en directo de marketing", "Diffusion en direct"), ("Notoriedad pública de marca", "Visibilité de la marque")
        ],
        # Módulo 9: Comercio Electrónico y Embudo (Medio)
        [
            ("Comercio electrónico", "E-commerce"), ("Tienda en línea", "Boutique en ligne"),
            ("Carrito de compras en línea", "Panier d'achat"), ("Proceso de pago en línea", "Processus de paiement"),
            ("Pasarela de pago en línea", "Passerelle de paiement"), ("Tarjeta de crédito de compra", "Carte de crédit"),
            ("PayPal", "PayPal"), ("Envío de compra", "Expédition"),
            ("Plazo de entrega de compra", "Délai de livraison"), ("Costo de envío de compra", "Frais de port"),
            ("Seguimiento de envío de compra", "Suivi de commande"), ("Devolución de compra", "Retour de commande"),
            ("Reembolso de compra", "Remboursement"), ("Atención al cliente de compra", "Service client"),
            ("Fidelización de clientes de compra", "Fidélisation client"), ("Embudo de conversión de venta", "Tunnel de conversion"),
            ("Embudo de ventas corporativo", "Tunnel de vente"), ("Prospecto comercial en embudo", "Lead"),
            ("Prospecto calificado por marketing", "MQL"), ("Prospecto calificado por ventas", "SQL"),
            ("Tasa de conversión de embudo", "Taux de conversion"), ("Tasa de rebote web de embudo", "Taux de rebond"),
            ("Tasa de abandono de carrito de compra", "Taux d'abandon de panier"), ("Optimización de la tasa de conversión", "CRO"),
            ("CRO", "CRO"), ("Página de aterrizaje de embudo", "Page d'atterrissage"),
            ("Página de producto de compra", "Page de produit"), ("Ficha de producto de compra", "Fiche produit"),
            ("Imagen de producto de compra", "Image de produit"), ("Opiniones de clientes de compra", "Avis clients"),
            ("Testimonio de cliente de compra", "Témoignage"), ("Valoración de producto de compra", "Évaluation"),
            ("Venta cruzada", "Vente croisée"), ("Venta sugerida", "Vente incitative"),
            ("Descuento promocional de compra", "Code promo"), ("Cupón de descuento de compra", "Bon de réduction"),
            ("Oferta por tiempo limitado", "Offre à durée limitée"), ("Envío gratis de compra", "Livraison gratuite"),
            ("Garantía de devolución de dinero", "Garantie satisfait ou remboursé"), ("Seguridad de la transacción", "Sécurité des transactions"),
            ("RGPD de comercio electrónico", "RGPD"), ("Protección de datos de compra", "Protection des données"),
            ("Términos y condiciones de compra", "Conditions générales de vente"), ("CGV", "CGV"),
            ("Facturación de compra", "Facturation"), ("Precio total de compra", "Prix total"),
            ("Bolsa de compra en línea", "Panier"), ("Cliente de comercio electrónico", "Client e-commerce"),
            ("Proveedor de comercio electrónico", "Fournisseur e-commerce"), ("Plataforma de comercio electrónico", "Plateforme e-commerce")
        ],
        # Módulo 10: Growth Hacking (Medio)
        [
            ("Growth Hacking", "Growth hacking"), ("Crecimiento rápido de marca", "Croissance rapide"),
            ("Growth hacker", "Growth hacker"), ("Estrategia de growth hacking", "Stratégie de growth hacking"),
            ("Experimento de growth hacking", "Expérience"), ("Prueba rápida de marketing", "Test rapide"),
            ("Adquisición de usuarios", "Acquisition d'utilisateurs"), ("Activación de usuarios", "Activation"),
            ("Retención de usuarios de marca", "Rétention d'utilisateurs"), ("Monetización de usuarios", "Monétisation"),
            ("Referencia de usuarios de marca", "Recommandation"), ("Embudo AARRR de growth hacking", "Tunnel AARRR"),
            ("Embudo pirata de growth hacking", "Tunnel pirate"), ("Métrica estrella del norte", "North Star Metric"),
            ("NSM", "North Star Metric"), ("Efecto de red de crecimiento", "Effet de réseau"),
            ("Bucle viral de crecimiento", "Boucle virale"), ("Coeficiente viral de crecimiento", "Coefficient viral"),
            ("Coeficiente K de crecimiento", "Facteur K"), ("Crecimiento orgánico de marca", "Croissance organique"),
            ("Crecimiento de boca en boca", "Bouche-à-oreille"), ("Marketing de guerrilla", "Marketing de guérilla"),
            ("Marketing viral de marca", "Marketing viral"), ("Optimización del embudo de venta", "Optimisation du tunnel"),
            ("Prueba A/B de growth hacking", "Test A/B"), ("Tasa de conversión de growth", "Taux de conversion"),
            ("Tasa de abandono de growth", "Taux d'attrition"), ("Valor de vida del cliente", "LTV"),
            ("Costo de adquisición del cliente", "CAC"), ("Ratio LTV a CAC de growth", "Ratio LTV/CAC"),
            ("Escalabilidad de growth", "Évolutivité"), ("Automatización de marketing", "Automatisation du marketing"),
            ("Herramienta de automatización", "Outil d'automatisation"), ("Flujo de trabajo automatizado", "Workflow"),
            ("Generación de prospectos en growth", "Génération de leads"), ("Prospección digital de growth", "Prospection"),
            ("Raspado de datos de growth", "Scraping de données"), ("Análisis de datos de growth", "Analyse de données"),
            ("Datos cuantitativos de growth", "Données quantitatives"), ("Datos cualitativos de growth", "Données qualitatives"),
            ("Comportamiento del usuario", "Comportement de l'utilisateur"), ("Experiencia de usuario de growth", "UX"),
            ("Interfaz de usuario de growth", "UI"), ("Optimización de landing page", "Optimisation de landing page"),
            ("Psicología del consumidor", "Psychologie du consommateur"), ("Gatillo mental de growth", "Déclencheur mental"),
            ("Prueba social de growth", "Preuve sociale"), ("Escasez promocional de growth", "Rareté"),
            ("Urgencia promocional de growth", "Urgence"), ("Fidelización del usuario", "Fidélisation"),
            ("Embajador del crecimiento", "Ambassadeur de croissance")
        ]
    ],
    "tech": [
        # Módulo 1: Hardware y Computadoras (Medio-Alto)
        [
            ("Ordenador", "Ordinateur"), ("Portátil", "Ordinateur portable"), ("Servidor", "Serveur"),
            ("Procesador", "Processeur"), ("CPU", "CPU"), ("Memoria RAM", "Mémoire vive"),
            ("RAM", "RAM"), ("Disco duro", "Disque dur"), ("SSD", "SSD"),
            ("Tarjeta gráfica", "Carte graphique"), ("GPU", "GPU"), ("Placa base", "Carte mère"),
            ("Fuente de alimentación", "Alimentation"), ("Sistema de refrigeración", "Refroidissement"),
            ("Carcasa", "Boîtier"), ("Pantalla", "Écran"), ("Teclado", "Clavier"),
            ("Ratón", "Souris"), ("Impresora", "Imprimante"), ("Escáner", "Scanner"),
            ("Altavoces", "Haut-parleurs"), ("Auriculares", "Casque"), ("Micrófono", "Microphone"),
            ("Cámara web", "Webcam"), ("Cable HDMI", "Câble HDMI"), ("Puerto USB", "Port USB"),
            ("Conector", "Connecteur"), ("Red", "Réseau"), ("Router", "Routeur"),
            ("Módem", "Modem"), ("Cable Ethernet", "Câble Ethernet"), ("Wi-Fi", "Wi-Fi"),
            ("Dispositivo de almacenamiento", "Périphérique de stockage"), ("Memoria USB", "Clé USB"),
            ("Tarjeta SD", "Carte SD"), ("Lector de tarjetas", "Lecteur de carte"), ("Hardware", "Matériel informatique"),
            ("Dispositivo externo", "Périphérique"), ("Componente", "Composant"), ("Instalar", "Installer"),
            ("Desinstalar", "Désinstaller"), ("Configurar", "Configurer"), ("Actualizar hardware", "Mettre à niveau"),
            ("Reparar", "Réparer"), ("Falla de hardware", "Panne de matériel"), ("Compatibilidad", "Compatibilité"),
            ("Rendimiento", "Performance"), ("Velocidad de procesamiento", "Vitesse de traitement"),
            ("Consumo de energía", "Consommation d'énergie"), ("Batería", "Batterie")
        ],
        # Módulo 2: Software y Aplicaciones (Medio-Alto)
        [
            ("Software", "Logiciel"), ("Aplicación", "Application"), ("App", "App"),
            ("Sistema operativo", "Système d'exploitation"), ("Windows", "Windows"), ("macOS", "macOS"),
            ("Linux", "Linux"), ("Programa", "Programme"), ("Instalación", "Installation"),
            ("Desinstalación", "Désinstallation"), ("Actualización de software", "Mise à jour"),
            ("Versión", "Version"), ("Licencia de software", "Licence"), ("Código abierto", "Open source"),
            ("Software propietario", "Logiciel propriétaire"), ("Software gratuito", "Gratuiciel"),
            ("Navegador web", "Navigateur Web"), ("Buscador", "Moteur de recherche"),
            ("Base de datos", "Base de données"), ("Procesador de textos", "Traitement de texte"),
            ("Hoja de cálculo", "Tableur"), ("Editor de imágenes", "Éditeur d'images"),
            ("Antivirus", "Antivirus"), ("Firewall", "Pare-feu"), ("Nube de almacenamiento", "Stockage cloud"),
            ("Copia de seguridad", "Sauvegarde"), ("Restauración", "Restauration"), ("Archivo ejecutable", "Fichier exécutable"),
            ("Extensión de archivo", "Extension de fichier"), ("Comprimir archivo", "Compresser"),
            ("Descomprimir archivo", "Décompresser"), ("Error de software", "Bogue"), ("Bug", "Bug"),
            ("Colapso del sistema", "Plantage"), ("Reiniciar", "Redémarrer"), ("Apagar", "Éteindre"),
            ("Encender", "Allumer"), ("Interfaz de usuario", "Interface utilisateur"), ("UI", "UI"),
            ("Experiencia de usuario", "Expérience utilisateur"), ("UX", "UX"), ("Menú de navegación", "Menu"),
            ("Barra de herramientas", "Barre d'outils"), ("Ventana emergente", "Fenêtre contextuelle"),
            ("Icono", "Icône"), ("Botón", "Bouton"), ("Cuadro de texto", "Champ de texte"),
            ("Casilla de verificación", "Case à cocher"), ("Desplazamiento", "Défilement"),
            ("Arrastrar y soltar", "Glisser-déposer"), ("Atajo de teclado", "Raccourci clavier")
        ],
        # Módulo 3: Programación y Código (Medio-Alto)
        [
            ("Programación", "Programmation"), ("Programador", "Programmeur"), ("Desarrollador", "Développeur"),
            ("Código fuente", "Code source"), ("Lenguaje de programación", "Langage de programmation"),
            ("Python", "Python"), ("JavaScript", "JavaScript"), ("HTML", "HTML"), ("CSS", "CSS"),
            ("Java", "Java"), ("C++", "C++"), ("PHP", "PHP"), ("SQL", "SQL"),
            ("Variable", "Variable"), ("Constante", "Constante"), ("Tipo de datos", "Type de données"),
            ("Cadena de texto", "Chaîne de caractères"), ("Entero", "Entier"), ("Flotante", "Flottant"),
            ("Booleano", "Booléen"), ("Arreglo", "Tableau"), ("Matriz", "Matrice"), ("Lista", "Liste"),
            ("Diccionario de datos", "Dictionnaire"), ("Función", "Fonction"), ("Método", "Méthode"),
            ("Parámetro", "Paramètre"), ("Argumento", "Argument"), ("Retorno", "Retour"),
            ("Condicional", "Conditionnel"), ("Bucle", "Boucle"), ("Bucle For", "Boucle For"),
            ("Bucle While", "Boucle While"), ("Algoritmo", "Algorithme"), ("Compilación", "Compilation"),
            ("Compilador", "Compilateur"), ("Interpretación", "Interprétation"), ("Intérprete", "Interprète"),
            ("Depuración", "Débogage"), ("Depurar", "Déboguer"), ("Error de sintaxis", "Erreur de syntaxe"),
            ("Error de ejecución", "Erreur d'exécution"), ("Comentario de código", "Commentaire"),
            ("Librería", "Bibliothèque"), ("Framework", "Framework"), ("API", "API"),
            ("Control de versiones", "Contrôle de version"), ("Git", "Git"), ("Repositorio", "Dépôt"),
            ("Rama de Git", "Branche")
        ],
        # Módulo 4: Desarrollo Web (Medio-Alto)
        [
            ("Desarrollo Web", "Développement Web"), ("Diseño Web", "Design Web"),
            ("Frontend", "Frontend"), ("Backend", "Backend"), ("Fullstack", "Fullstack"),
            ("Página web", "Page Web"), ("Sitio web", "Site Web"), ("Servidor web", "Serveur Web"),
            ("Alojamiento web", "Hébergement Web"), ("Hosting", "Hosting"), ("Dominio", "Nom de domaine"),
            ("Subdominio", "Sous-domaine"), ("Dirección IP", "Adresse IP"), ("URL", "URL"),
            ("Protocolo HTTP", "Protocole HTTP"), ("HTTPS", "HTTPS"), ("Certificado SSL", "Certificat SSL"),
            ("FTP", "FTP"), ("DNS", "DNS"), ("Base de datos web", "Base de données"),
            ("Consulta de base de datos", "Requête"), ("Tabla de base de datos", "Table"),
            ("Registro de base de datos", "Enregistrement"), ("Clave primaria", "Clé primaire"),
            ("Clave foránea", "Clé étrangère"), ("Diseño adaptable", "Responsive design"),
            ("Diseño para móviles", "Mobile-first"), ("Navegador", "Navigateur"), ("Caché web", "Cache"),
            ("Cookies", "Cookies"), ("Sesión de usuario", "Session"), ("Filtro", "Filtre"),
            ("Buscador interno", "Moteur de recherche"), ("Formulario", "Formulaire"),
            ("Enviar formulario", "Soumettre"), ("Validación", "Validation"),
            ("JavaScript del lado del cliente", "Script côté client"),
            ("JavaScript del lado del servidor", "Script côté serveur"), ("Node.js", "Node.js"),
            ("React", "React"), ("Angular", "Angular"), ("Vue", "Vue"),
            ("Hoja de estilos", "Feuille de style"), ("SASS", "SASS"), ("Bootstrap", "Bootstrap"),
            ("Tailwind CSS", "Tailwind CSS"), ("WordPress", "WordPress"), ("CMS", "CMS"),
            ("Optimización SEO", "Optimisation SEO"), ("Mapa del sitio", "Plan du site")
        ],
        # Módulo 5: Redes e Internet (Medio-Alto)
        [
            ("Red de ordenadores", "Réseau informatique"), ("Internet", "Internet"), ("Intranet", "Intranet"),
            ("Conexión de red", "Connexion"), ("Ancho de banda", "Bande passante"),
            ("Velocidad de descarga", "Vitesse de téléchargement"),
            ("Velocidad de subida", "Vitesse d'envoi"), ("Latencia de red", "Latence"),
            ("Ping de red", "Ping"), ("Dirección IP", "Adresse IP"), ("Dirección MAC", "Adresse MAC"),
            ("Máscara de subred", "Masque de sous-réseau"), ("Puerta de enlace", "Passerelle"),
            ("Servidor DNS", "Serveur DNS"), ("Servidor DHCP", "Serveur DHCP"), ("Protocolo TCP/IP", "TCP/IP"),
            ("Protocolo UDP", "UDP"), ("Paquete de datos", "Paquet de données"), ("Pérdida de paquetes", "Perte de paquets"),
            ("Cifrado de datos", "Chiffrement"), ("Desencriptación", "Déchiffrement"), ("VPN", "VPN"),
            ("Red privada virtual", "Réseau privé virtuel"), ("Cortafuegos", "Pare-feu"), ("Firewall", "Firewall"),
            ("Servidor Proxy", "Serveur proxy"), ("Wi-Fi de red", "Wi-Fi"),
            ("Punto de acceso Wi-Fi", "Point d'accès"), ("Contraseña de Wi-Fi", "Mot de passe Wi-Fi"),
            ("Seguridad WPA3", "Sécurité WPA3"), ("Fibra óptica", "Fibre optique"), ("Cable coaxial", "Câble coaxial"),
            ("Cable Ethernet RJ45", "Câble Ethernet"), ("Conmutador de red", "Commutateur"), ("Switch", "Switch"),
            ("Enrutador", "Routeur"), ("Módem", "Modem"), ("Red LAN", "Réseau LAN"),
            ("Red WAN", "Réseau WAN"), ("Red WLAN", "Réseau WLAN"), ("Topología de red", "Topologie de réseau"),
            ("Servidor de archivos", "Serveur de fichiers"), ("Nube privada", "Nuage privé"),
            ("Nube pública", "Nuage public"), ("Nube híbrida", "Nuage hybride"), ("Tráfico de red", "Trafic réseau"),
            ("Sobrecarga de red", "Surcharge de réseau"), ("Corte de conexión", "Coupure de connexion"),
            ("Proveedor de Internet", "Fournisseur d'accès Internet"), ("ISP", "FAI"), ("Dirección IP estática", "IP statique")
        ],
        # Módulo 6: Ciberseguridad (Medio-Alto)
        [
            ("Ciberseguridad", "Cybersécurité"), ("Seguridad informática", "Sécurité informatique"),
            ("Amenaza cibernética", "Cybermenace"), ("Ataque cibernético", "Cyberattaque"),
            ("Hacker", "Hacker"), ("Pirata informático", "Pirate informatique"), ("Hacker ético", "Hacker éthique"),
            ("Vulnerabilidad", "Vulnérabilité"), ("Exploit", "Exploit"), ("Parche de seguridad", "Correctif de sécurité"),
            ("Virus informático", "Virus"), ("Gusano informático", "Ver"), ("Troyano informático", "Cheval de Troie"),
            ("Malware", "Malware"), ("Ransomware", "Ransomware"), ("Spyware", "Spyware"),
            ("Adware", "Adware"), ("Phishing", "Hameçonnage"), ("Ingeniería social", "Ingénierie sociale"),
            ("Spam de correo", "Spam"), ("Ataque DDoS", "Attaque DDoS"), ("Fuerza bruta", "Force brute"),
            ("Inyección SQL", "Injection SQL"), ("Cifrado fuerte", "Chiffrement fort"),
            ("Clave de cifrado", "Clé de chiffrement"), ("Algoritmo de cifrado", "Algorithme de chiffrement"),
            ("Contraseña segura", "Mot de passe sécurisé"),
            ("Autenticación de dos factores", "Authentification à deux facteurs"), ("2FA", "2FA"),
            ("Firma digital", "Signature numérique"), ("Certificado digital", "Certificat numérique"),
            ("Gestor de contraseñas", "Gestionnaire de mots de passe"), ("Copia de seguridad cifrada", "Sauvegarde"),
            ("Recuperación de datos", "Récupération de données"), ("Fuga de datos", "Fuite de données"),
            ("Brecha de seguridad", "Brèche de sécurité"), ("Acceso no autorizado", "Accès non autorisé"),
            ("Suplantación de identidad", "Usurpation d'identité"), ("Monitoreo de red", "Surveillance réseau"),
            ("Auditoría de seguridad", "Audit de sécurité"), ("Cumplimiento normativo", "Conformité"),
            ("Privacidad de datos", "Confidentialité des données"), ("RGPD de seguridad", "RGPD"),
            ("Antivirus activo", "Antivirus actif"), ("Escaneo de virus", "Analyse antivirus"),
            ("Cuarentena de archivos", "Quarantaine"), ("Eliminar virus", "Supprimer le virus"),
            ("Ingeniería inversa", "Rétro-ingénierie"), ("Huella digital", "Empreinte digitale"),
            ("Seguridad biométrica", "Biométrie")
        ],
        # Módulo 7: Bases de Datos y SQL (Medio-Alto)
        [
            ("Base de datos", "Base de données"), ("Base de datos relacional", "Base de données relationnelle"),
            ("SGBD", "SGBD"), ("MySQL", "MySQL"), ("PostgreSQL", "PostgreSQL"), ("Oracle", "Oracle"),
            ("SQL Server", "SQL Server"), ("SQLite", "SQLite"), ("NoSQL", "NoSQL"), ("MongoDB", "MongoDB"),
            ("Tabla de datos", "Table de données"), ("Fila de datos", "Ligne"),
            ("Columna de datos", "Colonne"), ("Registro de base de datos", "Enregistrement"),
            ("Campo de datos", "Champ"), ("Clave primaria", "Clé primaire"), ("Clave foránea", "Clé étrangère"),
            ("Índice de base de datos", "Index"), ("Consulta SQL", "Requête SQL"), ("SELECT de SQL", "SELECT"),
            ("INSERT de SQL", "INSERT"), ("UPDATE de SQL", "UPDATE"), ("DELETE de SQL", "DELETE"),
            ("Cláusula WHERE de SQL", "WHERE"), ("Unión de tablas", "JOIN"), ("INNER JOIN de SQL", "INNER JOIN"),
            ("LEFT JOIN de SQL", "LEFT JOIN"), ("Esquema de base de datos", "Schéma de base de données"),
            ("Normalización de base de datos", "Normalisation"), ("Desnormalización", "Dénormalisation"),
            ("Transacción de base de datos", "Transaction"), ("Propiedades ACID", "Propriétés ACID"),
            ("Commit de base de datos", "Commit"), ("Rollback de base de datos", "Rollback"),
            ("Copia de seguridad de base de datos", "Sauvegarde de base de données"),
            ("Restaurar base de datos", "Restaurer la base de données"),
            ("Exportar datos", "Exporter des données"), ("Importar datos", "Importer des données"),
            ("Integridad de datos", "Intégrité des données"), ("Consistencia de datos", "Cohérence des données"),
            ("Redundancia de datos", "Redondance des données"),
            ("Administrador de bases de datos", "Administrateur de bases de données"), ("DBA", "DBA"),
            ("Almacenamiento de datos", "Stockage de données"), ("Data Warehouse", "Entrepôt de données"),
            ("Minería de datos", "Forage de données"), ("Big Data", "Big Data"),
            ("Análisis de datos de base de datos", "Analyse de données"), ("Migración de datos", "Migration de données"),
            ("Rendimiento de base de datos", "Performance de base de données"), ("Optimización de consultas", "Optimisation")
        ],
        # Módulo 8: Inteligencia Artificial y Machine Learning (Medio-Alto)
        [
            ("Inteligencia Artificial", "Intelligence artificielle"), ("IA", "IA"),
            ("Aprendizaje Automático", "Apprentissage automatique"), ("Machine Learning", "Machine learning"),
            ("Aprendizaje Profundo", "Apprentissage profond"), ("Deep Learning", "Deep learning"),
            ("Red neuronal", "Réseau neuronal"), ("Red neuronal artificial", "Réseau de neurones"),
            ("Neurona artificial", "Neurone"), ("Algoritmo de aprendizaje", "Algorithme d'apprentissage"),
            ("Modelo de aprendizaje", "Modèle"), ("Entrenamiento de modelo", "Entraînement du modèle"),
            ("Datos de entrenamiento", "Données d'entraînement"), ("Datos de prueba", "Données de test"),
            ("Conjunto de datos", "Jeu de données"), ("Dataset", "Dataset"),
            ("Procesamiento del lenguaje natural", "Traitement du langage naturel"), ("PLN", "TALN"),
            ("Visión por computadora", "Vision par ordinateur"), ("Reconocimiento de imágenes", "Reconnaissance d'images"),
            ("Reconocimiento de voz", "Reconnaissance vocale"), ("Síntesis de voz", "Synthèse vocale"),
            ("Chatbot", "Chatbot"), ("Agente inteligente", "Agent intelligent"), ("Predicción de datos", "Prédiction"),
            ("Clasificación de datos", "Classification"), ("Regresión de datos", "Régression"),
            ("Agrupamiento de datos", "Clustering"), ("Sobreajuste de datos", "Surapprentissage"),
            ("Subajuste de datos", "Sous-apprentissage"), ("Sesgo en IA", "Biais"),
            ("Ética en IA", "Éthique de l'IA"), ("Red neuronal convolucional", "CNN"),
            ("Red neuronal recurrente", "RNN"), ("Transformer de IA", "Transformer"),
            ("Modelo de lenguaje grande", "Grand modèle de langage"), ("LLM", "LLM"),
            ("Generación de contenido de IA", "IA générative"), ("Prompt de IA", "Prompt"),
            ("Ingeniería de prompts", "Ingénierie de prompts"), ("Robótica", "Robotique"),
            ("Coche autónomo", "Voiture autonome"), ("Automatización inteligente", "Automatisation"),
            ("Ciencia de datos", "Science des données"), ("Científico de datos", "Scientifique des données"),
            ("Análisis predictivo", "Analyse prédictive"), ("Algoritmo genético", "Algorithme génétique"),
            ("Supervisado", "Supervisé"), ("No supervisado", "Non supervisé"), ("Por refuerzo", "Par renforcement")
        ],
        # Módulo 9: Computación en la Nube y DevOps (Medio-Alto)
        [
            ("Computación en la Nube", "Cloud computing"), ("Nube informática", "Nuage"),
            ("Servicio en la nube", "Service cloud"), ("SaaS", "SaaS"), ("PaaS", "PaaS"), ("IaaS", "IaaS"),
            ("Amazon Web Services", "AWS"), ("Microsoft Azure", "Azure"), ("Google Cloud", "Google Cloud"),
            ("Servidor en la nube", "Serveur cloud"), ("Almacenamiento en la nube", "Stockage cloud"),
            ("Base de datos en la nube", "Base de données cloud"), ("Escalabilidad en la nube", "Évolutivité"),
            ("Elasticidad en la nube", "Élasticité"), ("Alta disponibilidad", "Haute disponibilité"),
            ("DevOps", "DevOps"), ("Integración continua", "Intégration continue"), ("CI", "CI"),
            ("Entrega continua", "Déploiement continu"), ("CD", "CD"),
            ("Automatización de despliegue", "Automatisation du déploiement"), ("Despliegue de software", "Déploiement"),
            ("Desplegar software", "Déployer"), ("Entorno de desarrollo", "Environnement de développement"),
            ("Entorno de pruebas", "Environnement de test"),
            ("Entorno de producción", "Environnement de production"), ("Contenedor de software", "Conteneur"),
            ("Docker", "Docker"), ("Kubernetes", "Kubernetes"), ("Orquestación de contenedores", "Orchestration"),
            ("Microservicios", "Microservices"), ("Arquitectura monolítica", "Architecture monolithique"),
            ("Infraestructura como código", "Infrastructure as code"), ("IaC", "IaC"),
            ("Monitoreo de sistemas", "Surveillance des systèmes"), ("Registro de logs", "Journalisation"),
            ("Métrica de rendimiento", "Métrique de performance"), ("Alerta de caída de sistema", "Alerte"),
            ("Tiempo de actividad", "Temps de fonctionnement"), ("Tiempo de inactividad", "Temps d'arrêt"),
            ("Caída del servidor", "Panne de serveur"), ("Recuperación ante desastres", "Plan de reprise d'activité"),
            ("Migración a la nube", "Migration vers le cloud"), ("Virtualización", "Virtualisation"),
            ("Máquina virtual", "Machine virtuelle"), ("VM", "VM"), ("Servicio sin servidor", "Serverless"),
            ("Función como servicio", "FaaS"), ("Seguridad en la nube", "Sécurité du cloud"),
            ("Proveedor de nube", "Fournisseur de services cloud")
        ],
        # Módulo 10: Metodologías Ágiles y Gestión (Medio-Alto)
        [
            ("Metodología Ágil", "Méthodologie agile"), ("Manifiesto Ágil", "Manifeste agile"),
            ("Scrum", "Scrum"), ("Marco Scrum", "Cadre Scrum"), ("Scrum Master", "Scrum Master"),
            ("Propietario del Producto", "Product Owner"), ("Product Owner", "Product Owner"),
            ("Equipo de desarrollo ágil", "Équipe de développement"), ("Sprint", "Sprint"),
            ("Duración del sprint", "Durée du sprint"), ("Planificación del sprint", "Planification de sprint"),
            ("Reunión diaria de Scrum", "Daily Scrum"), ("Reunión diaria", "Mêlée quotidienne"),
            ("Revisión del sprint", "Revue de sprint"), ("Retrospectiva del sprint", "Rétrospective de sprint"),
            ("Pila del producto", "Product backlog"), ("Pila del sprint", "Sprint backlog"),
            ("Punto de historia", "Story point"), ("Estimación de esfuerzo", "Estimation de l'effort"),
            ("Historia de usuario", "User story"), ("Criterio de aceptación", "Critères d'acceptation"),
            ("Definición de terminado", "Définition de fini"), ("DoD", "DoD"),
            ("Definición de preparado", "Définition de prêt"), ("DoR", "DoR"), ("Kanban", "Kanban"),
            ("Tablero Kanban", "Tableau Kanban"), ("Columna de estado", "Colonne d'état"),
            ("Límite de trabajo en progreso", "Limite WIP"), ("Trabajo en progreso", "Travail en cours"),
            ("Flujo de valor", "Flux de valeur"), ("Gráfico de trabajo restante", "Burndown chart"),
            ("Velocidad del equipo ágil", "Vélocité de l'équipe"), ("Cuello de botella en flujo", "Goulot d'étranglement"),
            ("Mejora continua", "Amélioration continue"), ("Kaizen", "Kaizen"), ("Retrospectiva ágil", "Rétrospective"),
            ("Colaboración con el cliente", "Collaboration avec le client"), ("Respuesta al cambio", "Adaptation au changement"),
            ("Software funcional", "Logiciel fonctionnel"), ("Interacción individual", "Individus et interactions"),
            ("Desarrollo iterativo", "Développement itératif"), ("Desarrollo incremental", "Développement incrémental"),
            ("Sprint backlog", "Sprint backlog"), ("Product backlog", "Product backlog"),
            ("Tablero Scrum", "Tableau Scrum"), ("Reunión de planificación", "Réunion de planification"),
            ("Demo del producto", "Démonstration du produit"), ("Retrospectiva", "Rétrospective"),
            ("Bloqueo de tarea", "Bloquage"), ("Tarea pendiente", "Tâche en attente")
        ]
    ]
}

CATEGORIES = ["basics", "travel", "business", "marketing", "tech"]
LEVELS = ["A1", "A2", "B1", "B2", "C1"]

def generate():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        print(f"📁 Directorio verificado/creado: {OUTPUT_DIR}")

    count = 0
    
    # Recorremos cada categoría
    for category in CATEGORIES:
        # Obtenemos los 10 módulos de esta categoría
        modules_list = VOCAB_DATABASE.get(category, [])
        
        for mod_idx in range(10):
            module_num = mod_idx + 1
            
            # Determinamos el nivel gramatical (A1 para módulos 1-4, A2 para 5-7, B1 para 8-10)
            if module_num <= 4:
                level = "A1"
            elif module_num <= 7:
                level = "A2"
            else:
                level = "B1"

            # Obtenemos los pares de palabras
            raw_pairs = modules_list[mod_idx]
            
            # Formateamos los pares de palabras: "en" almacena ESPAÑOL y "es" almacena FRANCÉS
            # para que el frontend (que espera "en" y "es") muestre Español a Francés sin Inglés.
            formatted_pairs = []
            for i, p in enumerate(raw_pairs):
                pair_id = f"p_{i+1:02d}"
                formatted_pairs.append({
                    "id": pair_id,
                    "en": p[0],  # Palabra en ESPAÑOL
                    "es": p[1]   # Palabra en FRANCÉS
                })
            
            file_id = f"{category}_mod_{module_num:02d}"
            
            # Títulos bonitos en Español/Francés
            category_titles = {
                "basics": "Life Essentials (Básicos)",
                "travel": "World Explorer (Viajes)",
                "business": "Business Pro (Negocios)",
                "marketing": "Growth Hacking (Marketing)",
                "tech": "Tech Stack (Tecnología)"
            }
            category_names_fr = {
                "basics": "Les Bases du Quotidien",
                "travel": "Vocabulaire du Voyageur",
                "business": "Affaires et Entreprises",
                "marketing": "Marketing et Communication",
                "tech": "Technologie et Informatique"
            }
            
            main_title_es = category_titles.get(category, "Vocabulario")
            main_title_fr = category_names_fr.get(category, "Vocabulaire")
            
            # Estructura del JSON que espera el backend y entrega al frontend
            lesson_data = {
                "id": file_id,
                "category_id": category,
                "title": f"{main_title_fr} {level}-{module_num}",
                "description": f"Dominio de vocabulario de {main_title_es}. Nivel {level}, Módulo {module_num}.",
                "level": level,
                "part": module_num,
                "total_xp": 500,
                "status": "locked",
                "theme": {
                    "icon": "Languages",
                    "color": "orange"
                },
                "stages": [
                    {
                        "id": f"drill_{file_id}",
                        "type": "pairing_drill",
                        "title": f"Neuro Link: {main_title_fr}",
                        "description": "Asociación rápida e inteligente de conceptos.",
                        "instruction": "Empareja la palabra en Español con su traducción correcta en Francés.",
                        "pairs": formatted_pairs
                    }
                ]
            }

            output_file_path = f"{OUTPUT_DIR}/{file_id}.json"
            
            # Escribir el archivo
            with open(output_file_path, "w", encoding="utf-8") as f:
                json.dump(lesson_data, f, indent=2, ensure_ascii=False)
                
            count += 1
            print(f"[OK] Generado: {file_id}.json ({len(formatted_pairs)} pares Espanol -> Frances)")

    print(f"\nSUCCESS: Se han inyectado {count} bloques de vocabulario en {OUTPUT_DIR}")

if __name__ == "__main__":
    generate()
