from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from typing import List

# 👇 Ajusta estas rutas de importación según tu estructura
from app.database import get_db 
from app.api.deps import get_current_user 
from app.db.models import ChessLesson, ChessProgress, User
from app.schemas.chess import ChessLessonResponse, ChessProgressCreate, ChessProgressResponse

router = APIRouter(prefix="/chess", tags=["Chess Academy"])

# =====================================================================
# ♟️ DICCIONARIO DE ANOTACIONES DE AJEDREZ PROFESIONALES (MASTER-LEVEL ANNOTATIONS)
# =====================================================================
MODULES_DETAILED_INFO = {
    # 1-6. Fundamentos
    "m-king": {
        "name": "Fundamentos del Rey",
        "concept": "la seguridad del monarca y la centralización en los finales",
        "detail": "el Rey no solo debe ser protegido a toda costa en el medio juego mediante el enroque, sino que en la fase final se transforma en una pieza activa y sumamente ofensiva capaz de guiar la victoria.",
        "tactics": "la oposición, la regla del cuadrado y la triangulación para ganar tiempos."
    },
    "m-queen": {
        "name": "Fundamentos de la Dama",
        "concept": "el poder de la pieza de mayor alcance y su versatilidad táctica",
        "detail": "la Dama combina la movilidad rectilínea de la torre y las diagonales del alfil. Su mal desarrollo temprano puede exponerla a ataques con ganancia de tiempo por parte de piezas menores.",
        "tactics": "los ataques dobles, la penetración en séptima fila y las clavadas indirectas coordinadas."
    },
    "m-rook": {
        "name": "Fundamentos de la Torre",
        "concept": "el dominio absoluto de las columnas abiertas y semiabiertas",
        "detail": "las Torres aumentan drásticamente su potencial al colocarse en la séptima u octava fila enemiga, o al duplicarse para coordinar un ataque masivo contra la estructura de peones rival.",
        "tactics": "el paso de torre por la tercera fila, el control de la séptima fila y los mates de pasillo."
    },
    "m-bishop": {
        "name": "Fundamentos del Alfil",
        "concept": "el control de largas diagonales y la ventaja de la pareja de alfiles",
        "detail": "el Alfil es una pieza de largo alcance cuyo poder se maximiza en posiciones abiertas. Aprender a diferenciar entre un alfil 'bueno' (cuyos peones no bloquean sus diagonales) y uno 'malo' es crucial.",
        "tactics": "el fianchetto, las enfiladas y los sacrificios temáticos en h7 (el regalo griego)."
    },
    "m-knight": {
        "name": "Fundamentos del Caballo",
        "concept": "el movimiento hiperactivo no lineal y el control de puestos avanzados",
        "detail": "el Caballo es el rey de las posiciones cerradas gracias a su capacidad de saltar sobre otras piezas. Ubicar un caballo en la quinta o sexta fila (un puesto avanzado inexpugnable) paraliza las líneas enemigas.",
        "tactics": "los tenedores (forks), las horquillas de peón y los saltos con doble jaque."
    },
    "m-pawn": {
        "name": "Fundamentos del Peón",
        "concept": "la estructura, la cadena de peones y la promoción",
        "detail": "el peón es el alma del ajedrez. Su avance define la naturaleza del juego (abierto o cerrado), crea casillas débiles permanentes y su promoción al final es la llave del triunfo.",
        "tactics": "los peones pasados protegidos, los avances de ruptura y la captura al paso (en passant)."
    },
    # 7-26. Táctica (10 Originales + 10 Nuevos)
    "t-fork": {
        "name": "Táctica: El Ataque Doble",
        "concept": "la bifurcación de amenazas múltiples simultáneas",
        "detail": "un ataque doble explota la incapacidad del rival para defender dos debilidades al mismo tiempo. Es la táctica más común y devastadora del ajedrez, realizable por cualquier pieza.",
        "tactics": "las horquillas de caballo, los ataques de peón a dos piezas mayores y las damas centralizadas."
    },
    "t-pin": {
        "name": "Táctica: La Clavada",
        "concept": "la inmovilización táctica de una pieza defensora",
        "detail": "la clavada ocurre cuando una pieza de largo alcance ataca a una pieza enemiga que, al moverse, expondría a otra de mayor valor (clavada relativa) o al propio Rey (clavada absoluta).",
        "tactics": "presionar la pieza clavada sumando atacantes y explotando la debilidad de la casilla."
    },
    "t-skew": {
        "name": "Táctica: La Enfilada",
        "concept": "el ataque atravesado a piezas de alto valor en línea",
        "detail": "es lo opuesto a la clavada: una pieza de gran valor (ej. el Rey o la Dama) es atacada y, al verse obligada a moverse, expone a una pieza defensora menos valiosa detrás de ella.",
        "tactics": "las enfiladas de torre en finales de peones y los ataques cruzados de alfil."
    },
    "t-disc": {
        "name": "Táctica: Descubierta",
        "concept": "el ataque oculto liberado al desplazar una pieza",
        "detail": "ocurre cuando el movimiento de una pieza abre una línea de ataque para otra pieza de su propio bando. La pieza que se mueve es libre de crear una segunda amenaza catastrófica.",
        "tactics": "los jaques a la descubierta y las capturas intermedias con ganancia de material."
    },
    "t-double": {
        "name": "Táctica: Jaque Doble",
        "concept": "el jaque simultáneo de dos piezas que fuerza el movimiento del rey",
        "detail": "el jaque doble es la táctica más potente porque el oponente no puede bloquear el jaque ni capturar la pieza atacante; la única respuesta legal es mover al Rey obligatoriamente.",
        "tactics": "coordinar alfiles y caballos, o torres y alfiles para forzar la huida del rey."
    },
    "t-deflect": {
        "name": "Táctica: Desviación",
        "concept": "apartar al defensor clave de su casilla de control",
        "detail": "consiste en obligar a una pieza enemiga a abandonar la casilla que está defendiendo, usualmente mediante un sacrificio u oferta de cambio atractiva pero fatal.",
        "tactics": "sacrificios de atracción en la octava fila o desviar la dama de la defensa del mate."
    },
    "t-attract": {
        "name": "Táctica: Atracción",
        "concept": "atraer a una pieza enemiga a una casilla fatal",
        "detail": "a diferencia de la desviación, aquí se obliga o atrae activamente a una pieza enemiga (frecuentemente al Rey) a colocarse en una casilla donde recibirá una combinación táctica destructiva.",
        "tactics": "sacrificios de torre o dama para forzar al rey a exponerse a un doble de caballo."
    },
    "t-block": {
        "name": "Táctica: Interrupción",
        "concept": "bloquear las líneas de comunicación defensiva del rival",
        "detail": "esta maniobra introduce una pieza propia en la línea de acción de las piezas defensoras enemigas (como una torre o dama defendiendo un punto clave), cortando su coordinación.",
        "tactics": "interposición de peones o piezas menores con sacrificios para cortar la defensa de un mate."
    },
    "t-clear": {
        "name": "Táctica: Despeje de Casilla",
        "concept": "liberar casillas o líneas de paso esenciales para el ataque",
        "detail": "se vacía una casilla ocupada por una pieza propia con ganancia de tiempo (ej. mediante un jaque o una amenaza directa) para que otra pieza más potente ocupe ese lugar de inmediato.",
        "tactics": "despejar la diagonal para un alfil letal o la casilla de salto para un caballo ejecutor."
    },
    "t-interpose": {
        "name": "Táctica: Interposición",
        "concept": "colocar un obstáculo intermedio en las líneas del oponente",
        "detail": "interrumpir el jaque o la amenaza directa interponiendo una pieza propia, a menudo ganando un tiempo precioso para reorganizar el contraataque.",
        "tactics": "interposición activa con contraataques directos al rey enemigo."
    },
    "t-desperado": {
        "name": "Táctica: El Recurso Desperado",
        "concept": "el sacrificio de piezas condenadas para obtener una compensación material",
        "detail": "cuando una pieza propia está irremediablemente perdida, se la sacrifica por la mayor ganancia material posible antes de ser capturada.",
        "tactics": "los contra-sacrificios intermedios y las capturas desesperadas para forzar tablas por ahogado."
    },
    "t-xray": {
        "name": "Táctica: Ataque de Rayos X",
        "concept": "la influencia a larga distancia de piezas mayores a través de obstáculos",
        "detail": "dos piezas del mismo tipo ejercen presión indirecta a lo largo de una columna o diagonal, penetrando los defensores enemigos intermedios.",
        "tactics": "la defensa indirecta de piezas atacadas y las clavadas de rayos X en columnas abiertas."
    },
    "t-overload": {
        "name": "Táctica: Sobrecarga Defensiva",
        "concept": "saturar las tareas defensivas de una pieza enemiga clave",
        "detail": "identifica un defensor enemigo que está protegiendo múltiples casillas o piezas de alto valor, y ataca una de ellas para colapsar su esquema defensivo.",
        "tactics": "la desviación del defensor sobrecargado y los ataques cruzados de doble flanco."
    },
    "t-windmill": {
        "name": "Táctica: El Molino de Viento",
        "concept": "la consecución repetitiva de jaques descubiertos demoledores",
        "detail": "maniobra coordinada entre alfil y torre que desata una serie imparable de jaques descubiertos, capturando la mitad de las piezas del oponente en el proceso.",
        "tactics": "el jaque doble intermedio y la demolición de la estructura de enroque."
    },
    "t-zwischenzug": {
        "name": "Táctica: Movimiento Intermedio",
        "concept": "la inserción de una amenaza intermedia inesperada",
        "detail": "intercalas una jugada forzada (usualmente un jaque o una captura de mayor valor) en medio de una secuencia de intercambios aparentemente obvia.",
        "tactics": "los jaques de desvío intermedios y las contradebilidades posicionales."
    },
    "t-interference": {
        "name": "Táctica: Interferencia de Líneas",
        "concept": "interrumpir los canales de comunicación y defensa de las fuerzas rivales",
        "detail": "colocas un obstáculo (una pieza propia o sacrificada) en la intersección de dos líneas defensivas enemigas, quebrando su coordinación y asegurando la ganancia material.",
        "tactics": "sacrificios de obstrucción física y desvíos de comunicación en diagonales cruzadas."
    },
    "t-undermining": {
        "name": "Táctica: Socavamiento del Soporte",
        "concept": "la destrucción o distracción de la pieza de anclaje defensivo",
        "detail": "elimina o distrae a la pieza que sostiene toda la estructura defensiva de la posición oponente, derrumbando sus defensas de manera inmediata.",
        "tactics": "la captura del peón ancla y la eliminación del caballo defensor en f3/f6."
    },
    "t-backrank-adv": {
        "name": "Táctica: Fila Trasera Avanzada",
        "concept": "la explotación extrema de la debilidad en la octava fila",
        "detail": "combinaciones tácticas profundas que aprovechan el confinamiento del rey detrás de sus propios peones mediante múltiples sacrificios de desviación.",
        "tactics": "los sacrificios dobles de dama en la octava fila y la infiltración de torres duplicadas."
    },
    "t-pos-sacrifice": {
        "name": "Táctica: Sacrificio Posicional",
        "concept": "la entrega voluntaria de material a cambio de compensaciones estratégicas",
        "detail": "entregas una calidad o peón no para dar mate inmediato, sino para obtener casillas fuertes permanentes, dominar diagonales o bloquear la iniciativa rival.",
        "tactics": "el sacrificio de calidad en c3/c6 y la entrega de peones para abrir líneas al alfil."
    },
    "t-desperado-queen": {
        "name": "Táctica: Dama Desperado",
        "concept": "el autosacrificio extremo de la Dama para forzar tablas o contrajuego letal",
        "detail": "en posiciones perdidas o bajo inminente jaque mate, se utiliza la Dama propia como un kamikaze atacando constantemente al monarca rival para inducir tablas por ahogado.",
        "tactics": "el jaque perpetuo desesperado y el ahogado forzado en la esquina."
    },
    # 27-43. Patrones de Mate (7 Originales + 10 Nuevos)
    "mate-corridor": {
        "name": "Patrones: Mate de Pasillo",
        "concept": "aprovechar la debilidad crónica de la octava fila del rey",
        "detail": "ocurre cuando el Rey enemigo está atrapado detrás de su propia cadena de peones (generalmente f7, g7, h7) y una torre o dama penetra en la última fila para dar jaque mate sin escapatoria.",
        "tactics": "desviar la torre defensora trasera o sacrificar piezas para abrir la columna."
    },
    "mate-smothered": {
        "name": "Patrones: Mate de la Coz",
        "concept": "el mate de caballo asfixiante con el rey rodeado",
        "detail": "el Rey queda completamente rodeado y asfixiado por sus propias piezas, impidiéndole moverse. Un caballo propio salta para propinar el jaque mate definitivo por encima de los defensores.",
        "tactics": "sacrificios espectaculares de dama en g8/b8 para forzar la captura con la torre enemiga."
    },
    "mate-anastasia": {
        "name": "Patrones: Mate de Anastasia",
        "concept": "acorralamiento del rey mediante caballo y torre en la banda",
        "detail": "el Caballo controla las casillas de escape del rey en la columna lateral (ej. e7 y e5), mientras que una torre penetra en la columna 'h' o 'a' abierta tras un sacrificio táctico de apertura.",
        "tactics": "sacrificios de dama para abrir la columna lateral h/a frente al enroque."
    },
    "mate-boden": {
        "name": "Patrones: Mate de Boden",
        "concept": "dos alfiles cruzando diagonales letales contra el rey enrocado",
        "detail": "el Rey (usualmente tras un enroque largo) queda atrapado por sus propias piezas en un flanco, y dos alfiles coordinados cruzan diagonales para cortar toda respiración y propinar el mate.",
        "tactics": "sacrificios de dama en c6 para abrir la diagonal del alfil de casillas oscuras."
    },
    "mate-blackburne": {
        "name": "Patrones: Mate de Blackburne",
        "concept": "ataque combinado y cruzado de alfiles y caballo",
        "detail": "un patrón elegante donde un caballo blanco en g5 u otra casilla activa y dos alfiles coordinados barren las casillas reales enemigas, superando las defensas del enroque.",
        "tactics": "sacrificar un alfil o caballo en h7 para atraer al rey y rematar con el otro alfil."
    },
    "mate-lolli": {
        "name": "Patrones: Mate de Lolli",
        "concept": "penetración letal con peón infiltrado en f6",
        "detail": "el bando atacante infiltra un peón en la sexta fila (f6 o h6), creando debilidades insalvables en las casillas oscuras o claras del enroque, permitiendo a la Dama dar mate directo en g7.",
        "tactics": "sacrificios en h7 para debilitar el enroque antes del asalto de la dama."
    },
    "mate-arabian": {
        "name": "Patrones: Mate Árabe",
        "concept": "coordinación de caballo en f6 y torre en la esquina g8/h8",
        "detail": "uno de los patrones de mate más antiguos del ajedrez. El Caballo en f6 (o casilla equivalente) protege a la Torre colocada en g8 o h8, bloqueando al mismo tiempo la casilla de escape g7 del rey.",
        "tactics": "presionar la columna abierta y sacrificar para forzar al rey a la esquina."
    },
    "mate-damiano": {
        "name": "Patrones: Mate de Damiano",
        "concept": "el asalto de Dama y peón avanzado en el flanco de rey",
        "detail": "un clásico patrón de mate donde un peón propio infiltrado en g6 o f6 sirve de ancla inamovible para que la Dama de mate directo en la casilla h7 o g7.",
        "tactics": "los sacrificios sucesivos de torres en la columna h abierta."
    },
    "mate-greco": {
        "name": "Patrones: Mate de Greco",
        "concept": "el rey acorralado en la esquina por el alfil y rematado por la dama",
        "detail": "el Alfil controla la casilla de escape g8 desde a2-g8, mientras que la Dama penetra en la columna h para asestar el mate definitivo.",
        "tactics": "el sacrificio griego clásico de alfil en h7 y el jaque descubierto."
    },
    "mate-legal": {
        "name": "Patrones: Mate de Légal",
        "concept": "el pseudo-sacrificio de Dama para dar mate con tres piezas menores activas",
        "detail": "una joya táctica donde se entrega la Dama voluntariamente para desatar un contraataque relámpago coordinando dos caballos y un alfil centralizado.",
        "tactics": "los saltos dobles de caballo y la clavada ineficaz en g4."
    },
    "mate-morphy": {
        "name": "Patrones: Mate de Morphy",
        "concept": "la coordinación de torre activa y alfil cortando el enroque",
        "detail": "utilizando la columna g abierta, la Torre arrastra al rey a la esquina y el Alfil sella su destino cruzando las diagonales de escape del rey.",
        "tactics": "los jaques descubiertos y la demolición del peón de f7."
    },
    "mate-reti": {
        "name": "Patrones: Mate de Réti",
        "concept": "el mate sorpresivo de alfil protegido por torre o dama centralizada",
        "detail": "el Rey queda atrapado en el centro del tablero bloqueado por sus propias piezas, y un alfil propio apoyado a distancia sella la red de mate de forma instantánea.",
        "tactics": "sacrificios de dama para abrir la columna central e/d."
    },
    "mate-pillsbury": {
        "name": "Patrones: Mate de Pillsbury",
        "concept": "el ataque demoledor en la columna g con torre y alfil coordinados",
        "detail": "el Alfil vigila las casillas claras del enroque mientras la Torre asesta jaques sucesivos en la columna g abierta tras eliminar la cobertura enemiga.",
        "tactics": "los sacrificios en g7 para desmantelar la defensa real."
    },
    "mate-fool": {
        "name": "Patrones: Mate del Loco",
        "concept": "el mate de dama en la diagonal débil e1-h4 / e8-h5",
        "detail": "el oponente avanza erróneamente sus peones de f y g en la apertura, exponiendo mortalmente la diagonal que lleva directo a su rey en solo dos jugadas.",
        "tactics": "los ataques inmediatos por la diagonal f2-g4."
    },
    "mate-scholar": {
        "name": "Patrones: Mate del Pastor",
        "concept": "el ataque relámpago coordinando alfil y dama sobre f7",
        "detail": "el oponente descuida la debilidad de f7 y la Dama blanca remata la partida en solo 4 jugadas.",
        "tactics": "el desarrollo de Dama a h5/f3 y el alfil a c4."
    },
    "mate-smothered-adv": {
        "name": "Patrones: Mate de la Coz Avanzado",
        "concept": "la red de mate asfixiante con múltiples sacrificios forzados",
        "detail": "redes complejas de mate donde el rey enemigo es forzado mediante jaques dobles a confinarse en una esquina rodeado por sus propios peones y piezas.",
        "tactics": "la desviación forzada de la torre y el doble jaque de caballo."
    },
    "mate-double-bishop": {
        "name": "Patrones: Mate de Alfiles Cruzados",
        "concept": "el dominio total de las diagonales paralelas barriendo al rey",
        "detail": "dos alfiles coordinados cortan todas las salidas del monarca en el flanco, cruzando sus diagonales de largo alcance de forma estética e ineludible.",
        "tactics": "los sacrificios posicionales de desvío en el centro."
    },
    # 44-63. Apertura (5 Originales + 15 Nuevos)
    "op-center": {
        "name": "Apertura: El Centro",
        "concept": "el control y la ocupación de las casillas centrales e4, d4, e5, d5",
        "detail": "el desarrollo temprano debe enfocarse en controlar el centro del tablero. Esto otorga espacio para maniobrar las piezas y restringe severamente los planes del rival.",
        "tactics": "avances temáticos de peón, clavadas al caballo defensor del centro y rupturas directas."
    },
    "op-king-gambit": {
        "name": "Apertura: Gambito de Rey",
        "concept": "el ataque romántico e hiperagresivo mediante e4 y f4",
        "detail": "una apertura clásica donde las blancas sacrifican su peón de 'f' en la jugada dos para desviar el peón central de las negras, abrir la columna 'f' y lanzar un asalto directo al rey.",
        "tactics": "desarrollo veloz del caballo a f3, ataques con alfil en c4 y presión masiva en f7."
    },
    "op-sicilian": {
        "name": "Apertura: Defensa Siciliana",
        "concept": "la respuesta asimétrica y combativa 1...c5",
        "detail": "las negras responden a 1.e4 con 1...c5, controlando d4 desde el flanco e iniciando una lucha asimétrica llena de contrajuego dinámico en el flanco de dama y opciones de contraataque.",
        "tactics": "la ruptura d5 de las negras, el control de la casilla c4 y los ataques en la columna c abierta."
    },
    "op-ruy-lopez": {
        "name": "Apertura: Ruy López (Apertura Española)",
        "concept": "la presión posicional a largo plazo mediante 3.Ab5",
        "detail": "una de las aperturas más prestigiosas. Blancas desarrollan el alfil a b5 para clavar o presionar el caballo de c6, el cual defiende el peón central de e5 de las negras.",
        "tactics": "maniobras temáticas de caballo blanco a d2-f1-g3, expansión en el flanco de rey y control del centro."
    },
    "op-french": {
        "name": "Apertura: Defensa Francesa",
        "concept": "la estructura sólida y cerrada mediante 1...e6 y 2...d5",
        "detail": "las negras ceden espacio central inicialmente a cambio de crear una cadena de peones ultra sólida e indestructible. El contrajuego negro se enfoca en presionar la base blanca en d4.",
        "tactics": "las rupturas c5 y f6 de las negras, y el ataque blanco al peón retrasado de e6."
    },
    "op-carokann": {
        "name": "Apertura: Defensa Caro-Kann",
        "concept": "la estructura de peones ultra-sólida y segura mediante 1...c6",
        "detail": "las negras responden con c6 para apoyar d5, asegurando el desarrollo armonioso del alfil de casillas claras fuera de la cadena de peones.",
        "tactics": "el cambio central en d5 y el contrajuego posicional en el flanco de dama."
    },
    "op-scandinavian": {
        "name": "Apertura: Defensa Escandinava",
        "concept": "el contraataque inmediato del peón de rey mediante 1...d5",
        "detail": "negras abren y desafían el centro blanco en la jugada uno, forzando la apertura de líneas para la dama y los alfiles de forma explosiva.",
        "tactics": "la retirada de dama a a5/d6 y el desarrollo rápido de piezas menores."
    },
    "op-slav": {
        "name": "Apertura: Defensa Eslava",
        "concept": "la fortificación del centro de dama mediante c6",
        "detail": "una de las defensas más sólidas del ajedrez frente a 1.d4, permitiendo a las negras desarrollar sus alfiles sin quedar encerrados tras una cadena de peones.",
        "tactics": "la ruptura e5 y el control de la gran diagonal b1-h7."
    },
    "op-gruenfeld": {
        "name": "Apertura: Defensa Grünfeld",
        "concept": "el contraataque hipermoderno con g6, d5 y c5",
        "detail": "las negras permiten que las blancas ocupen el centro con peones para destruirlo y socavarlo a distancia utilizando la pareja de alfiles y el alfil de fianchetto.",
        "tactics": "el fianchetto de rey y la presión masiva sobre d4."
    },
    "op-kings-indian": {
        "name": "Apertura: Defensa India de Rey",
        "concept": "la estrategia del contraataque dinámico con enroque corto y fianchetto",
        "detail": "las negras ceden el centro al blanco en la apertura para luego lanzar una tormenta de peones masiva en el flanco de rey con f5 y g5.",
        "tactics": "la ruptura e5/c5 y el ataque al rey blanco enroquetado largo."
    },
    "op-nimzo": {
        "name": "Apertura: Defensa Nimzoindia",
        "concept": "la clavada de caballo en c3 y el control indirecto del centro",
        "detail": "las negras clavan el caballo blanco en c3 con Ab4, previniendo el avance e4 blanco y creando peones doblados débiles en el flanco de dama del rival.",
        "tactics": "el control de la casilla e4 y la presión sobre los peones doblados de c3/c4."
    },
    "op-qga": {
        "name": "Apertura: Gambito de Dama Aceptado",
        "concept": "la captura del peón lateral blanco en d5 para ganar actividad",
        "detail": "las negras aceptan el peón ofrecido en c4 con la idea de ceder el centro temporalmente para luego contraatacar con c5 y a6, liberando sus alfiles rápidamente.",
        "tactics": "la ruptura c5 y la expansión con b5 en el flanco de dama."
    },
    "op-qgd": {
        "name": "Apertura: Gambito de Dama Rehusado",
        "concept": "la defensa de trinchera clásica apoyando d5 con e6",
        "detail": "la respuesta clásica y ultra sólida frente a 1.d4. Las negras defienden su peón central a toda costa, posponiendo el desarrollo del alfil de casillas claras para el medio juego.",
        "tactics": "la liberación del alfil de c8 mediante b6/Ab7 y el control de la columna c."
    },
    "op-catalan": {
        "name": "Apertura: Apertura Catalana",
        "concept": "la combinación de fianchetto de rey con presión central",
        "detail": "las blancas fianchettan su alfil en g2, ejerciendo una presión silenciosa pero mortal sobre la gran diagonal de casillas claras y el flanco de dama enemigo a largo plazo.",
        "tactics": "la presión sobre b7 y c6, y el control de las casillas centrales d5/e4."
    },
    "op-london": {
        "name": "Apertura: El Sistema Londres",
        "concept": "el esquema universal inexpugnable con Af4, e3 y c3",
        "detail": "un sistema ultra-sólido y flexible para las blancas que no requiere memorizar largas líneas. Se enfoca en desarrollar las piezas a sus casillas ideales de forma estándar.",
        "tactics": "el ataque al flanco de rey con caballo en e5 y dama en f3/h3."
    },
    "op-english": {
        "name": "Apertura: Apertura Inglesa",
        "concept": "el control espacial del centro de forma lateral mediante 1.c4",
        "detail": "una apertura hipermoderna e inteligente. Blancas controlan la casilla central d5 desde el flanco, retrasando el avance de sus peones centrales para confundir los planes del rival.",
        "tactics": "el fianchetto de rey y el ataque al flanco de dama con alfil en g2."
    },
    "op-alekhine": {
        "name": "Apertura: Defensa Alekhine",
        "concept": "provocar la expansión prematura de los peones blancos con 1...Nf6",
        "detail": "una defensa provocativa y psicológica. Las negras saltan con su caballo atrayendo los peones blancos hacia adelante para luego atacarlos y destruirlos como objetivos débiles.",
        "tactics": "las rupturas d6 y c5 para socavar la cadena de peones avanzada."
    },
    "op-pirc": {
        "name": "Apertura: Defensa Pirc",
        "concept": "el desarrollo flexible con d6, g6 y Ag7 contra e4",
        "detail": "las negras permiten que las blancas formen un centro ideal para luego atacarlo dinámicamente desde los flancos, manteniendo la flexibilidad posicional en las primeras jugadas.",
        "tactics": "las rupturas c6/c5 y el avance temático a6/b5."
    },
    "op-bird": {
        "name": "Apertura: Apertura Bird",
        "concept": "el ataque al flanco de rey con 1.f4 controlando e5",
        "detail": "apertura agresiva que busca controlar la casilla central e5 desde la jugada uno, abriendo la columna f para presionar el flanco de rey enemigo desde el inicio.",
        "tactics": "el fianchetto de dama con b3/Ab2 y la penetración de caballo en e5."
    },
    "op-benoni": {
        "name": "Apertura: Defensa Benoni",
        "concept": "la lucha asimétrica y aguda con c5 y d5 cerrados",
        "detail": "las negras desafían el centro de dama con c5 y forzan al blanco a cerrar la posición con d5, creando un juego dinámico en el flanco de dama apoyado por el alfil de g7.",
        "tactics": "el avance a6/b5 de las negras y la ruptura e6 para liberar la columna e."
    },
    # 64-75. Estrategia (2 Originales + 10 Nuevos)
    "str-pawns": {
        "name": "Estrategia: Estructura de Peones",
        "concept": "comprender los peones doblados, aislados, colgantes y pasados",
        "detail": "los peones determinan el plan estratégico a largo plazo. Un peón aislado (sin peones adyacentes) es una debilidad eterna, mientras que un peón pasado es un arma letal hacia el final.",
        "tactics": "bloquear peones pasados con un caballo y atacar la base de las cadenas de peones."
    },
    "str-outpost": {
        "name": "Estrategia: Puestos Avanzados",
        "concept": "el establecimiento de piezas en casillas enemigas débiles e inexpugnables",
        "detail": "un puesto avanzado es una casilla (usualmente en la 4ª, 5ª o 6ª fila) que no puede ser atacada por peones enemigos. Un caballo colocado aquí ejerce una influencia paralizante sobre el oponente.",
        "tactics": "cambiar los defensores de la casilla débil y anclar el caballo con un peón propio robusto."
    },
    "str-passed-pawn": {
        "name": "Estrategia: Peón Pasado Protegido",
        "concept": "el valor de crear y defender un peón pasado",
        "detail": "un peón pasado protegido es una fuerza destructiva insalvable para el oponente. Obliga al rey enemigo a inmovilizarse para vigilar su avance.",
        "tactics": "el bloqueo del rey defensor y el soporte activo de las torres traseras."
    },
    "str-weak-squares": {
        "name": "Estrategia: Casillas Débiles",
        "concept": "identificar y ocupar las debilidades en la estructura rival",
        "detail": "las casillas que ya no pueden ser defendidas por peones propios son debilidades permanentes que deben ser ocupadas por piezas menores para asfixiar al rival.",
        "tactics": "las maniobras de recolocación de caballo y la eliminación de alfiles defensores."
    },
    "str-bad-bishop": {
        "name": "Estrategia: Alfil Bueno vs Alfil Malo",
        "concept": "la optimización de diagonales según la estructura de peones",
        "detail": "si tus peones están colocados en el mismo color que las casillas de tu alfil, limitan severamente su movilidad transformándolo en un 'peón gordo' o alfil malo.",
        "tactics": "el cambio de piezas menores desfavorables y la colocación activa en diagonales libres."
    },
    "str-bishop-pair": {
        "name": "Estrategia: Pareja de Alfiles",
        "concept": "la superioridad de la pareja de alfiles en posiciones abiertas",
        "detail": "dos alfiles coordinados operando en diagonales complementarias barren el tablero y controlan un espacio inmenso, superando con creces a la pareja de caballos.",
        "tactics": "abrir el tablero mediante rupturas de peones y fijar debilidades en los flancos."
    },
    "str-semiopen-file": {
        "name": "Estrategia: Columnas Semiabiertas",
        "concept": "la presión constante sobre peones enemigos retrasados",
        "detail": "una columna donde solo el rival tiene peones es un canal de ataque perfecto para tus torres, permitiéndote atacar peones débiles y retrasados de forma recurrente.",
        "tactics": "el doblado de torres en la columna y la presión sobre el peón objetivo."
    },
    "str-queenside-maj": {
        "name": "Estrategia: Mayoría en Flanco de Dama",
        "concept": "la creación de peones pasados alejados del centro",
        "detail": "tener más peones que el oponente en el flanco de dama te permite avanzar y crear un peón pasado, obligando al rey enemigo a abandonar el centro para detenerlo en el final.",
        "tactics": "el avance armónico de la cadena de peones y la ruptura final."
    },
    "str-carlsbad": {
        "name": "Estrategia: Estructura Carlsbad",
        "concept": "la estructura clásica de peón de dama y el ataque de minorías",
        "detail": "una de las estructuras más estudiadas en ajedrez. El blanco busca avanzar sus peones a y b en el flanco de dama para forzar debilidades permanentes en la cadena negra.",
        "tactics": "el ataque de minorías con b4-b5 y la maniobra defensiva de negras en el centro."
    },
    "str-prophylaxis": {
        "name": "Estrategia: Pensamiento Profiláctico",
        "concept": "la prevención activa de los planes tácticos del rival",
        "detail": "consiste en jugar no para atacar directamente, sino para desmantelar las ideas del oponente antes de que se materialicen en amenazas, limitando su contrajuego.",
        "tactics": "los movimientos preventivos de rey en finales y las jugadas h3/a3."
    },
    "str-isolated-pawn": {
        "name": "Estrategia: Peón de Dama Aislado",
        "concept": "el dinamismo y la ganancia de espacio frente a debilidad estática",
        "detail": "el peón de dama aislado (IQP) otorga control de las casillas centrales y excelentes oportunidades de ataque al flanco de rey, a cambio de ser una debilidad en el final.",
        "tactics": "la ruptura d5 para abrir diagonales al alfil y el ataque directo al monarca."
    },
    "str-pawn-chain": {
        "name": "Estrategia: Cadenas de Peones",
        "concept": "el ataque a la base y ruptura de cadenas cerradas",
        "detail": "las cadenas cerradas fijan el espacio en el tablero. La regla fundamental es atacar la base de la cadena oponiendo rupturas laterales para dinamitar la defensa.",
        "tactics": "la ruptura f4/f5 de blancas y c5/f6 de las negras en posiciones de bloqueo."
    },
    # 76-80. Finales (5 Nuevos)
    "end-opposition": {
        "name": "Finales: La Oposición de Reyes",
        "concept": "el control del espacio utilizando la oposición directa de reyes",
        "detail": "el monarca que tiene la oposición fuerza al rey rival a retroceder, abriendo paso para que sus propios peones coronen sin oposición.",
        "tactics": "la oposición a distancia, la oposición lateral y la maniobra de flanqueo."
    },
    "end-square": {
        "name": "Finales: La Regla del Cuadrado",
        "concept": "el cálculo visual rápido de la velocidad de coronación",
        "detail": "traza un cuadrado imaginario desde el peón pasado hasta la línea de coronación. Si el rey enemigo logra ingresar a este cuadrado, atrapará al peón a tiempo.",
        "tactics": "el avance desesperado del peón pasado y la interceptación de rey."
    },
    "end-lucena": {
        "name": "Finales: La Posición de Lucena",
        "concept": "la técnica definitiva para ganar finales de torre y peón",
        "detail": "consiste en construir un puente con la torre en la 4ª fila para proteger al rey propio del asedio de jaques de la torre enemiga, permitiendo coronar el peón pasado.",
        "tactics": "el puente de torre en la 4ª fila y el corte lateral del rey oponente."
    },
    "end-philidor": {
        "name": "Finales: La Posición de Philidor",
        "concept": "la defensa infalible en finales de torre y peón para asegurar tablas",
        "detail": "las negras sitúan su torre en la 3ª fila impidiendo el avance del rey blanco. En cuanto el peón blanco avanza a la 6ª fila, la torre baja al fondo para dar jaques infinitos.",
        "tactics": "la barrera de torre en tercera fila y los jaques desde la retaguardia."
    },
    "end-triangulation": {
        "name": "Finales: Triangulación de Rey",
        "concept": "perder un tiempo deliberadamente con el rey para ceder el turno al oponente",
        "detail": "maniobra geométrica letal en finales de peones. Al mover el rey en forma de triángulo, vuelves a la casilla original pero cediendo el turno al rival, forzando su derrota.",
        "tactics": "la pérdida voluntaria de turno y la entrada en la brecha posicional."
    }
}

# LISTAS DE TÉRMINOS EN PYTHON PARA COHERENCIA DETERMINISTA ABSOLUTA CON EL FRONTEND
lvl1_terms = [
    "Coordinación de Alfil y Dama", "Seguridad del Enroque Corto", "Control del Centro del Tablero",
    "Estructura de Peones Inicial", "Desarrollo de Piezas Menores", "El Valor Relativo del Material",
    "Mates de Pasillo Elementales", "Clavadas Básicas de Alfil", "Ataques Dobles de Peón",
    "Aperturas Clásicas Italianas", "Reglas del Enroque Largo", "El Peón Pasado en Acción",
    "Stalemate y Tablas por Ahogado", "Triple Repetición de Posición", "Ajedrez por Correspondencia",
    "Columnas Abiertas para Principiantes", "Diagonales Libres para Alfil", "Casillas Fuertes y Puestos Avanzados",
    "La Ventaja de Desarrollo Rápido", "Evitar Pérdidas de Turno Tempranas", "Captura al Paso Posicional",
    "Protección del Caballo Centralizado", "El Doble Ataque de la Dama", "Mate del Pastor Defensivo",
    "Prevención de Clavadas en g5/g4", "Interposición de Piezas Menores", "El Rey Activo en el Medio Juego",
    "La Fuerza de las Torres Duplicadas", "Estrategia del Enroque Opuesto", "La Cadena de Peones en f7/g7/h7",
    "Control del Espacio del Flanco", "La Pareja de Alfiles Básica", "Peón Retrasado como Debilidad",
    "Ataques de Mate en h7", "Defensa de la Primera Fila", "Maniobra de Caballo en d2-f3",
    "Alfil del Fianchetto Activo", "Presión en la Séptima Fila", "Apertura Española Moderna",
    "Defensa Siciliana Abierta", "Gambito de Dama Declinado", "Defensa Caro-Kann Sólida",
    "El Caballo en la Banda del Tablero", "Soporte de Peones Conectados", "Seguridad de la Dama Expuesta",
    "Ataques de Descubierta Simples", "Enfiladas Cruzadas en Flanco", "Molino de Viento Básico",
    "Zugzwang Posicional Elemental", "Profilaxis ante Avances de Peón", "Interferencia Física de Peones",
    "Socavamiento de Peón de d4", "Mate de la Coz Elemental", "Mate de Anastasia Básico",
    "Mate de Boden Cruzado", "Mate de Blackburne Coordinado", "Mate de Lolli f6",
    "Mate Árabe Ancestral", "Apertura Escandinava Central", "Defensa Francesa Clásica",
    "Peón Pasado Protegido Básico", "Casillas Débiles en el Enroque", "Alfil Bueno contra Malo Inicial",
    "Pareja de Alfiles Abierta", "Columnas Semiabiertas de Torre", "Mayoría en Flanco de Dama",
    "Estructura Carlsbad Inicial", "Ajedrez a la Ciega Elemental", "Toma de Decisiones bajo Reloj",
    "Oposición de Reyes Básica"
]

lvl2_terms = [
    "Molino de Viento con Jaque Doble", "Sacrificio de Desvío Temático", "Atracción al Rey Enrocado",
    "Interferencia en Columnas Abiertas", "Despeje de Casilla para Caballo", "Clavadas Absolutas en e-file",
    "Rayos X sobre la Dama", "El Recurso Desperado de Torre", "Mate de la Coz con Sacrificio",
    "Mate de Anastasia en g-file", "Mate de Boden con Sacrificio de Dama", "Mate de Blackburne Cruzado",
    "Mate de Lolli con Dama en g7", "Mate Árabe de Caballo y Torre", "Mate de Damiano con Peón en f6",
    "Mate de Greco en Diagonal Abierta", "Mate de Légal con Pseudo-Sacrificio", "Mate de Morphy en Columna Abierta",
    "Mate de Réti Centralizado", "Mate de Pillsbury en g7", "Mate del Pastor Avanzado",
    "Mate del Loco en Diagonal Letal", "Mate de la Coz Doble", "Mate de Alfiles Cruzados Letal",
    "Ataques Dobles de Dama y Caballo", "Clavadas Complejas de Torres", "Enfiladas Cruzadas de Alfil",
    "Descubiertas con Ganancia de Dama", "Jaques Dobles Destructivos", "Desvío Defensivo del Alfil",
    "Atracción en la Octava Fila", "Interposición de Torres en f4", "Despeje de Diagonal para Alfil",
    "Interposición de Caballo Defensor", "El Desperado de Alfil Condenado", "Rayos X de Torre y Dama",
    "Sobrecarga del Caballo Defensor", "Molinos Sucesivos de Dos Torres", "Zwischenzug con Jaque Intermedio",
    "Interferencia de Alfil en c6", "Socavamiento de la Estructura de f3", "Mate de la Coz por Desvío",
    "Ataques Dobles de Peón en e5", "Clavadas Relativas del Caballo", "Enfiladas de Dama en el Centro",
    "Descubierta de Torre con Jaque", "Jaque Doble de Caballo y Alfil", "Desvío del Rey de la Casilla f7",
    "Atracción de Dama a Casilla g8", "Interposición de Peón en d5", "Despeje de Casilla para Alfil",
    "Interposición de Alfil en e2", "El Desperado de Caballo Perdido", "Rayos X sobre el Rey Enrocado",
    "Sobrecarga de la Dama Defensora", "Molino de Viento en g7/f7", "Zwischenzug con Amenaza de Mate",
    "Interferencia de Dama en b7", "Socavamiento del Caballo en c3", "Mate de la Coz con Dama Kamikaze",
    "Ataques Dobles de Alfil y Caballo", "Clavadas en la Diagonal Corta", "Enfiladas en la Octava Fila",
    "Descubiertas de Alfil con Jaque", "Jaque Doble con Torre y Alfil", "Desvío de la Torre Defensora Lateral",
    "Atracción de Rey al Centro del Tablero", "Interposición de Caballo en d4", "Despeje de Línea para Torre",
    "Interposición de Peón en f5", "El Desperado de Dama Acabada", "Rayos X Cruzados de Dos Alfiles",
    "Sobrecarga del Alfil de Casillas Blancas", "Molino de Viento de Torre y Caballo", "Zwischenzug de Captura Intermedia",
    "Interferencia en la Diagonal Central", "Socavamiento de Peones Conectados", "Mate de la Coz en d8",
    "Ataques Dobles de Torre y Alfil", "Clavadas en la Diagonal de Casillas Negras"
]

lvl3_terms = [
    "Defensa Siciliana Dragón Acelerado", "Defensa Francesa Tarrasch", "Ruy López Berlín Posicional",
    "Caro-Kann de Avance Aguda", "Gambito de Dama Rehusado Ortodoxo", "Defensa Grünfeld del Cambio",
    "Defensa India de Rey Sämisch", "Sistema Londres con e3 y Ad3", "Apertura Inglesa Symmetrical",
    "Defensa Nimzoindia Clásica", "Gambito de Dama Aceptado Moderno", "Defensa Semi-Eslava Merano",
    "Defensa Eslava Clásica", "Defensa India de Dama Posicional", "Defensa Holandesa Stonewall",
    "Apertura Catalana Abierta", "Apertura Réti Clásica", "Apertura Bird de Ataque",
    "Defensa Benoni Moderna", "Gambito Volga con b5", "Ataque Trompowsky 2.Ag5",
    "Gambito Budapest Agudo", "Defensa Alekhine de Avance", "Defensa Pirc Ataque Austriaco",
    "Trampa de Noah's Ark Ruy López", "Trampa del Légal Italiana", "Trampa del Elefante Gambito de Dama",
    "Trampa de la Caña de Pescar", "Transposiciones de Siciliana a Francesa", "Orden de Jugadas en la Caro-Kann",
    "Control de Transposiciones en la Eslava", "Evitar el Ataque Fegatello", "Trampa Siberiana Gambito Morra",
    "Contrarrestar el Ataque Grob 1.g4", "Trampa del Gambito Englund", "Prevención de Ataques de Dama Rápidos",
    "Defensa Siciliana Najdorf", "Defensa Siciliana Scheveningen", "Defensa Siciliana Paulsen",
    "Defensa Siciliana Kan", "Defensa Siciliana Taimanov", "Defensa Siciliana Alapin",
    "Defensa Siciliana Cerrada", "Defensa Siciliana Grand Prix", "Defensa Francesa Winawer",
    "Defensa Francesa de Avance", "Defensa Francesa Rubinstein", "Defensa Francesa MacCutcheon",
    "Ruy López Variación de Cambio", "Ruy López Variación Abierta", "Ruy López Variación Cerrada",
    "Ruy López Variación Marshall", "Ruy López Defensa Steinitz", "Apertura Italiana Evans Gambit",
    "Apertura Italiana Giuoco Piano", "Gambito de Rey Aceptado Muzio", "Gambito de Rey Rehusado Falkbeer",
    "Defensa Petroff Sólida", "Defensa de los Dos Caballos Fegatello", "Defensa Philidor Anticuada",
    "Apertura Escocesa Clásica", "Apertura de los Cuatro Caballos Central", "Gambito Morra Aceptado",
    "Defensa Siciliana Dragón Variación Yugoslavia", "Defensa Francesa Clásica Steinitz", "Defensa Caro-Kann Clásica",
    "Defensa Caro-Kann Variación del Cambio", "Defensa Escandinava de Dama Retirada", "Defensa Escandinava con Cf6",
    "Defensa Eslava Variación del Cambio", "Defensa Semi-Eslava Variación Botvinnik", "Defensa Grünfeld con Af4",
    "Defensa India de Rey Variación Clásica", "Defensa India de Rey Variación de Cuatro Peones", "Defensa Nimzoindia Variación Rubinstein",
    "Defensa Nimzoindia Variación Kmoch", "Defensa India de Dama Variación Fianchetto", "Apertura Catalana Cerrada",
    "Sistema Colle-Koltanowski Central", "Ataque Torre Posicional", "Apertura Inglesa Variación Siciliana Invertida",
    "Apertura Inglesa de Doble Fianchetto", "Apertura Réti de Doble Fianchetto", "Apertura Bird Estructuras Holandesas Invertidas",
    "Defensa Benoni Cerrada"
]

lvl4_terms = [
    "Peón de Dama Aislado Dinámico", "Ataque de Minorías Carlsbad", "Profilaxis al Estilo Petrosian",
    "Pareja de Alfiles en Finales Abiertos", "Finales de Torre y Peón de Lucena", "Defensa de Philidor Sólida",
    "Triangulación de Rey en e5", "Zugzwang Corporativo de Mercado", "El Gambito de Marca Corporativo",
    "La Fortaleza de Peones C-Suite", "Iniciativa y Gestión del Riesgo", "Evaluación Estática del Portafolio",
    "Pensamiento Esquemático Posicional", "Toma de Decisiones bajo Presión de Tiempo", "Ajedrez a la Ciega C-Suite",
    "Simetría Competitiva en el Tablero", "El Arte de la Defensa de Recursos", "El Gambito Corporativo",
    "La Oposición de Mercado de Marcas", "Estructura de Peones Organizacionales", "La Cadena de Peones en Logística",
    "Profilaxis ante Competencia Disruptiva", "Simplificación de Portafolios Financieros", "El Puente de Lucena Operativo",
    "La Defensa Philidor en Crisis", "Triangulación en Negociaciones de M&A", "Puestos Avanzados de Distribución",
    "Alfil Bueno contra Malo en Capital Humano", "Pareja de Alfiles en Liderazgo Compartido", "Columnas Abiertas en Flujo de Información",
    "Mayoría en Flanco de Dama Comercial", "Zugzwang de Ofertas y Licitaciones", "Sacrificio de Calidad en Capital de Trabajo",
    "El Molino de Viento de Ventas Recurrentes", "Interferencia en Distribución de Competencia", "Sobrecarga de Capacidad de Producción",
    "El Recurso Desperado ante Quiebra Financiera", "Rayos X en Auditorías de Cumplimiento", "Ataques Dobles en Campañas de Marketing",
    "La Clavada en Contratos de Exclusividad", "La Enfilada de Precios Bajos Disruptivos", "El Jaque Descubierto en Innovación de Productos",
    "Peones Colgantes en el Centro Posicional", "Casillas Débiles Permanentes y Puestos Avanzados", "Profilaxis Dinámica del Método Karpov",
    "Control de Diagonales Abiertas y Fianchettos", "Maniobras de Caballos en Posiciones Cerradas", "El Arte de la Defensa Posicional Extrema",
    "Cambios Estratégicos de Piezas Menores", "La Ventaja de Espacio y Asfixia del Rival", "La Iniciativa a Largo Plazo sin Ventaja Material",
    "Sacrificios Posicionales de Calidad en d5", "Oposición de Reyes Distante y Marcha Activa", "Regla del Cuadrado en Finales de Peones",
    "Final de Alfil de Casillas Blancas del Color Erróneo", "Finales de Alfiles de Diferente Color - Tablas Teóricas", "Finales de Alfiles del Mismo Color - Explotación de Debilidades",
    "Finales de Caballo contra Peón Pasado Distante", "Finales de Caballo y Peón contra Caballo Solo", "Finales de Torre y Peón contra Torre Avanzado",
    "Finales de Dama contra Peón en Séptima Fila", "Finales de Dama contra Torre - Método del Triángulo", "Finales de Dos Alfiles contra Rey Solitario",
    "Finales de Caballo y Alfil contra Rey Solitario", "Finales de Peones Doblados y Aislados en el Flanco", "Marcha Triunfal del Rey Activo en el Final",
    "Peones Pasados Distantes en Finales de Caballos", "Peones Pasados Conectados en Finales de Torres", "La Regla de Tarrasch de Torres Detrás de Peones",
    "Fortalezas Inexpugnables en Finales de Dama", "Finales Prácticos de Magnus Carlsen - Presión al Límite", "Finales de Torres con Alfiles de Diferente Color",
    "Estructuras Carlsbad con Ataque de Minorías", "Zugzwang de Bloqueo de Alfil", "Sacrificios Posicionales en f5",
    "Profilaxis ante Expansión de Flanco Enemigo", "La Cadena de Peones en d5/e4", "El Puente de Lucena y Apoyos de Torre",
    "La Defensa Philidor con Corte en Quinta Fila", "Triangulación en Finales de Alfiles", "Puestos Avanzados de Caballo en d5/d4",
    "Alfil Bueno contra Malo con Peones Fijos", "Pareja de Alfiles Dominando el Flanco de Rey", "Columnas Abiertas y Control de la Octava Fila",
    "Finales de Dama y Peón de Caballo en Séptima Fila"
]

def generate_rich_chess_texts(module_part: str, num_part: str, solution: str, explanation_base: str) -> tuple[str, str]:
    """Genera textos de ajedrez ultra-profesionales, académicos y sumamente extensos."""
    info = None
    
    # RESOLVER DE FORMA DETERMINISTA LOS 320 MÓDULOS PROGRAMÁTICOS
    if module_part.startswith("lvl1-gen-") or module_part.startswith("lvl1-mod-"):
        try:
            idx = int(module_part.split("-")[-1])
            term = lvl1_terms[(idx - 31) % len(lvl1_terms)]
            info = {
                "name": f"Fundamentos de {term}",
                "concept": f"el entendimiento inicial de {term.lower()}",
                "detail": f"la comprensión teórica y práctica de {term.lower()} es la base esencial para desarrollar una visión posicional sólida desde las primeras jugadas.",
                "tactics": f"los principios fundamentales de {term.lower()} y la prevención de errores comunes."
            }
        except Exception:
            pass
    elif module_part.startswith("lvl2-gen-") or module_part.startswith("lvl2-mod-"):
        try:
            idx = int(module_part.split("-")[-1])
            term = lvl2_terms[(idx - 21) % len(lvl2_terms)]
            info = {
                "name": f"Táctica de {term}",
                "concept": f"la ejecución precisa de {term.lower()}",
                "detail": f"reconocer y explotar {term.lower()} permite desmantelar de forma combinativa el enroque rival y ganar ventajas materiales decisivas.",
                "tactics": f"los sacrificios temáticos, la desviación y la atracción asociados a {term.lower()}."
            }
        except Exception:
            pass
    elif module_part.startswith("lvl3-gen-") or module_part.startswith("lvl3-mod-"):
        try:
            idx = int(module_part.split("-")[-1])
            term = lvl3_terms[(idx - 16) % len(lvl3_terms)]
            info = {
                "name": f"Teoría de {term}",
                "concept": f"las ideas estratégicas de {term.lower()}",
                "detail": f"dominar {term.lower()} te permite dictar el ritmo de la partida desde la fase de apertura, estableciendo cadenas de peones y diagonales favorables.",
                "tactics": f"el control del centro, las transposiciones y el orden de jugadas en {term.lower()}."
            }
        except Exception:
            pass
    elif module_part.startswith("lvl4-gen-") or module_part.startswith("lvl4-mod-"):
        try:
            idx = int(module_part.split("-")[-1])
            term = lvl4_terms[(idx - 16) % len(lvl4_terms)]
            info = {
                "name": f"Maestría de {term}",
                "concept": f"la visión posicional de {term.lower()}",
                "detail": f"el dominio de {term.lower()} representa la cúspide del pensamiento estratégico, donde la táctica se subordina al planeamiento a largo plazo y a la profilaxis.",
                "tactics": f"la triangulación, la oposición y el pensamiento esquemático de {term.lower()}."
            }
        except Exception:
            pass
            
    if not info:
        info = MODULES_DETAILED_INFO.get(module_part, {
            "name": "Entrenamiento de Ajedrez",
            "concept": "el cálculo de variantes tácticas y el control del espacio",
            "detail": "la maestría en ajedrez requiere un entendimiento profundo de la geometría del tablero, la coordinación armónica de las piezas y la anticipación de los recursos defensivos del oponente.",
            "tactics": "las jugadas forzadas, los jaques intermedios y las redes de mate."
        })
    
    # 1. GENERATE DEEP INSTRUCTION (Anotación e Instrucción Premium)
    instruction = (
        f"Bienvenido a la Unidad {num_part} del módulo de {info['name']}. "
        f"En esta posición de alto nivel, el objetivo principal es dominar {info['concept']}. "
        f"Analiza detalladamente la colocación de las piezas: {info['detail']} "
        f"Debes aplicar conceptos clave como {info['tactics']} para neutralizar las amenazas enemigas y encontrar el camino óptimo. "
        f"Observa las debilidades estructurales del oponente, calcula las variantes forzadas y realiza el movimiento preciso con la pieza correcta para reclamar la ventaja decisiva."
    )
    
    # 2. GENERATE DEEP EXPLANATION (Análisis de Gran Maestro Temático y Extenso)
    explanation = (
        f"¡Brillante resolución en la Unidad {num_part}! La jugada seleccionada ({solution}) demuestra una excelente comprensión técnica de {info['name']}. "
        f"Análisis Posicional del Maestro: Al ejecutar la maniobra correcta, logramos dominar {info['concept']}. "
        f"Este movimiento estratégico funciona debido a que explota directamente la geometría del tablero y sobrecarga la coordinación de defensa del oponente. "
        f"En términos de teoría avanzada, {info['detail']} "
        f"Detalle Táctico: {explanation_base} "
        f"La precisión demostrada aquí no solo asegura la ganancia material o posicional inmediata, sino que restringe permanentemente la movilidad de las fuerzas enemigas en este sector. "
        f"Dominar este tipo de patrones es lo que diferencia a un aficionado de un jugador de nivel experto y competitivo. "
        f"¡Sigue acumulando esta sólida base teórica para incrementar tu ELO táctico y dominar tus próximas partidas!"
    )
    
    return instruction, explanation

@router.get("/lessons/{lesson_id}", response_model=ChessLessonResponse)
def get_chess_lesson(
    lesson_id: str, 
    response: Response, # 🚀 Agregado para controlar el caché
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Devuelve el FEN, solución y datos de un puzzle para la Practice Arena"""
    # 🛡️ ANTI-CACHÉ MATADOR (Evita el 304)
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    
    lesson = db.query(ChessLesson).filter(ChessLesson.id == lesson_id).first()
    if not lesson:
        # DYNAMIC FAILSAFE GENERATION FOR CHESS PUZZLES (1500 DYNAMIC UNITS)
        parts = lesson_id.split("-")
        module_part = "-".join(parts[:-1]) if len(parts) > 1 else "m-king"
        num_part = parts[-1] if len(parts) > 1 else "1"
        
        # Determine realistic FEN & solutions based on tactical modules
        fen_map = {
            "m-king": ("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "e2e4", "Move king pawn to expand control."),
            "m-queen": ("r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 4 4", "f3f7", "Deliver Scholar's mate with the Queen."),
            "m-rook": ("r4rk1/pp3ppp/2p5/8/8/8/PPP2PPP/R4RK1 w - - 0 1", "a1d1", "Control the open d-file with your rook."),
            "t-fork": ("r1bqkb1r/ppp2ppp/2np1n2/4p3/4P3/2N2N2/PPPP1PPP/R1BQKB1R w KQkq - 0 5", "f3e5", "Sacrifice center piece to fork with d4 later."),
            "mate-corridor": ("6k1/5ppp/8/8/8/8/5PPP/6K1 w - - 0 1", "g1f1", "Activate your king or prevent back rank mate.")
        }
        
        # Default fallback FEN
        fen, solution, explanation = fen_map.get(module_part, ("r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4", "d2d4", "Strike the center with d4 to open diagonals."))
        
        # Create dynamic mock ChessLesson
        lesson = ChessLesson(
            id=lesson_id,
            module_id=module_part,
            title=f"Módulo {module_part.upper()} - Puzzle {num_part}",
            instruction=f"Analiza la posición en la Unidad {num_part}. ¡Encuentra el movimiento óptimo para ganar ventaja!",
            fen=fen,
            solution=solution,
            hint="Busca amenazas directas, jaques o capturas de piezas indefensas.",
            explanation=f"Explicación técnica: {explanation} Esto asegura el control posicional."
        )
        try:
            db.add(lesson)
            db.commit()
            db.refresh(lesson)
        except Exception:
            db.rollback()
            lesson = db.query(ChessLesson).filter(ChessLesson.id == lesson_id).first()
    
    # 🌟 DYNAMIC TEXT ENRICHMENT (7,000+ words target across lessons)
    parts = lesson.id.split("-")
    module_part = "-".join(parts[:-1]) if len(parts) > 1 else "m-king"
    num_part = parts[-1] if len(parts) > 1 else "1"
    
    rich_inst, rich_exp = generate_rich_chess_texts(module_part, num_part, lesson.solution, lesson.explanation)
    lesson.instruction = rich_inst
    lesson.explanation = rich_exp
    
    return lesson

@router.post("/progress")
def save_chess_progress(
    progress_data: ChessProgressCreate,
    response: Response, # 🚀 Agregado para controlar el caché
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Guarda la victoria del puzzle y bloquea la inyección de XP repetida"""
    # 🛡️ ANTI-CACHÉ MATADOR
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    
    lesson = db.query(ChessLesson).filter(ChessLesson.id == progress_data.lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lección no encontrada")

    # Validar cuota diaria de ajedrez para usuarios Free
    user_tier = current_user.tier or "free"
    is_admin = getattr(current_user, "role", "student") == "admin"
    if not is_admin and user_tier == "free":
        from datetime import datetime, time
        today_start = datetime.combine(datetime.utcnow().date(), time.min)
        today_completions = db.query(ChessProgress).filter(
            ChessProgress.user_id == current_user.id,
            ChessProgress.completed_at >= today_start
        ).count()
        if today_completions >= 5:
            raise HTTPException(
                status_code=403,
                detail="Has alcanzado el límite de 5 puzzles diarios del plan Free. Sube a PRO o EXECUTIVE para resolver puzzles de forma ilimitada."
            )

    # Validar si ya lo resolvió antes
    existing = db.query(ChessProgress).filter(
        ChessProgress.user_id == current_user.id,
        ChessProgress.lesson_id == progress_data.lesson_id
    ).first()

    if existing:
        return {"msg": "Puzzle ya completado", "xp_added": 0}

    # Guardar victoria
    new_progress = ChessProgress(
        user_id=current_user.id,
        lesson_id=progress_data.lesson_id,
        status=progress_data.status,
        earned_xp=25
    )
    db.add(new_progress)

    # Increment ELO in DB safely!
    db_user = db.query(User).filter(User.id == current_user.id).first()
    new_elo = 800
    if db_user:
        if db_user.chess_tactical_elo is None:
            db_user.chess_tactical_elo = 800
        db_user.chess_tactical_elo += 15
        new_elo = db_user.chess_tactical_elo
        db.add(db_user)
    
    db.commit()
    
    return {"msg": "Progreso de ajedrez guardado", "xp_added": 25, "new_tactical_elo": new_elo}

@router.get("/progress", response_model=ChessProgressResponse)
def get_user_chess_progress(
    response: Response, # 🚀 Agregado para controlar el caché
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Devuelve los IDs de los puzzles completados para armar el Lobby Frontend"""
    # 🛡️ ANTI-CACHÉ MATADOR
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    
    progress = db.query(ChessProgress.lesson_id).filter(
        ChessProgress.user_id == current_user.id
    ).all()
    
    completed_ids = [p[0] for p in progress]
    return {
        "completed_lessons": completed_ids,
        "total_puzzles": len(completed_ids)
    }
