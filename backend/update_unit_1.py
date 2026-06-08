import json
import re
from app.database import SessionLocal
from app.db.models import ChessLesson

NEW_LESSONS = {
  "lvl1-mod1-lsn1": {
    "module_id": "lvl1-mod1",
    "fen": "4k3/8/8/8/8/8/8/K7 w - - 0 1",
    "solution": "a1a2",
    "title": "Lección 1: Conociendo el tablero de 64 casillas",
    "instruction": "Mueve el Rey a a2 para dar tu primer paso en este tablero de 64 casillas.",
    "explanation": "¡Excelente! El tablero está compuesto por casillas claras y oscuras."
  },
  "lvl1-mod1-lsn2": {
    "module_id": "lvl1-mod1",
    "fen": "4k3/8/8/8/8/8/8/R7 w - - 0 1",
    "solution": "a1h1",
    "title": "Lección 2: Las filas horizontales",
    "instruction": "Las filas van de izquierda a derecha. Mueve la Torre blanca por toda la fila 1, desde a1 hasta h1.",
    "explanation": "¡Bien hecho! La fila 1 es la base de las piezas blancas."
  },
  "lvl1-mod1-lsn3": {
    "module_id": "lvl1-mod1",
    "fen": "4k3/8/8/8/8/8/8/R7 w - - 0 1",
    "solution": "a1a8",
    "title": "Lección 3: Las columnas verticales",
    "instruction": "Las columnas van de arriba a abajo. Mueve la Torre blanca por la columna 'a', desde a1 hasta a8.",
    "explanation": "¡Perfecto! Las columnas se nombran con letras de la 'a' a la 'h'."
  },
  "lvl1-mod1-lsn4": {
    "module_id": "lvl1-mod1",
    "fen": "4k3/8/8/8/8/8/8/5B2 w - - 0 1",
    "solution": "f1a6",
    "title": "Lección 4: Las diagonales blancas",
    "instruction": "Los alfiles dominan las diagonales. Mueve el Alfil de f1 hasta a6 por las casillas claras.",
    "explanation": "¡Así es! Este es tu alfil de casillas blancas."
  },
  "lvl1-mod1-lsn5": {
    "module_id": "lvl1-mod1",
    "fen": "4k3/8/8/8/8/8/8/2B5 w - - 0 1",
    "solution": "c1h6",
    "title": "Lección 5: Las diagonales negras",
    "instruction": "Mueve el Alfil de casillas oscuras desde c1 hasta h6.",
    "explanation": "¡Muy bien! Las diagonales conectan el tablero."
  },
  "lvl1-mod1-lsn6": {
    "module_id": "lvl1-mod1",
    "fen": "4k3/8/8/8/8/8/4P3/4K3 w - - 0 1",
    "solution": "e2e4",
    "title": "Lección 6: El centro absoluto (d4, d5, e4, e5)",
    "instruction": "El centro es la zona más importante. Avanza el peón de e2 a e4 para dominar el centro absoluto.",
    "explanation": "Dominar e4, d4, e5 y d5 es vital en la apertura."
  },
  "lvl1-mod1-lsn7": {
    "module_id": "lvl1-mod1",
    "fen": "4k3/8/8/8/8/8/2P5/4K3 w - - 0 1",
    "solution": "c2c4",
    "title": "Lección 7: El centro ampliado",
    "instruction": "El centro ampliado rodea al centro absoluto. Mueve el peón de c2 a c4.",
    "explanation": "El peón en c4 controla la casilla central d5 desde el centro ampliado."
  },
  "lvl1-mod1-lsn8": {
    "module_id": "lvl1-mod1",
    "fen": "4k3/8/8/8/8/8/8/4K2R w K - 0 1",
    "solution": "e1g1",
    "title": "Lección 8: El flanco de Rey",
    "instruction": "El flanco de Rey abarca desde la columna 'e' hasta la 'h'. Enroca corto (O-O) para proteger a tu Rey.",
    "explanation": "El enroque corto resguarda al monarca en su flanco."
  },
  "lvl1-mod1-lsn9": {
    "module_id": "lvl1-mod1",
    "fen": "4k3/8/8/8/8/8/8/R3K3 w Q - 0 1",
    "solution": "e1c1",
    "title": "Lección 9: El flanco de Dama",
    "instruction": "El flanco de Dama abarca de la 'a' a la 'd'. Enroca largo (O-O-O) para llevar el Rey a este flanco.",
    "explanation": "El enroque largo conecta las torres en el flanco de dama."
  },
  "lvl1-mod1-lsn10": {
    "module_id": "lvl1-mod1",
    "fen": "4k3/8/8/8/8/8/8/R3K3 w Q - 0 1",
    "solution": "a1h1",
    "title": "Lección 10: La regla del cuadro blanco",
    "instruction": "La esquina derecha siempre debe ser blanca ('cuadro blanco a la derecha'). Mueve la Torre a la esquina h1.",
    "explanation": "Correcto. h1 y a8 son siempre casillas blancas."
  },
  "lvl1-mod1-lsn11": {
    "module_id": "lvl1-mod1",
    "fen": "4k3/8/8/8/8/8/8/1N2K3 w - - 0 1",
    "solution": "b1c3",
    "title": "Lección 11: Notación algebraica (Letras)",
    "instruction": "Las letras indican las columnas. Mueve el Caballo desde b1 hacia la columna 'c' (casilla c3).",
    "explanation": "¡Bien! Las columnas van de la A a la H."
  },
  "lvl1-mod1-lsn12": {
    "module_id": "lvl1-mod1",
    "fen": "4k3/8/8/8/8/8/P7/4K3 w - - 0 1",
    "solution": "a2a4",
    "title": "Lección 12: Notación algebraica (Números)",
    "instruction": "Los números indican las filas. Avanza el peón de la fila 2 hasta la fila 4 (casilla a4).",
    "explanation": "¡Exacto! Las filas van del 1 al 8."
  },
  "lvl1-mod1-lsn13": {
    "module_id": "lvl1-mod1",
    "fen": "4k2B/8/8/8/8/8/8/R3K3 w - - 0 1",
    "solution": "a1h8",
    "title": "Lección 13: Localizando a1 y h8",
    "instruction": "Estas son las esquinas extremas oscuras. Mueve la Torre de a1 para capturar el Alfil en h8.",
    "explanation": "¡Gran puntería! a1 y h8 cruzan todo el tablero en diagonal."
  },
  "lvl1-mod1-lsn14": {
    "module_id": "lvl1-mod1",
    "fen": "4k3/8/8/8/8/8/PPPPPPPP/4K3 w - - 0 1",
    "solution": "d2d4",
    "title": "Lección 14: La posición inicial de los peones",
    "instruction": "Los peones blancos inician en la fila 2. Avanza el peón central de d2 a d4.",
    "explanation": "La fila 2 es la línea de infantería."
  },
  "lvl1-mod1-lsn15": {
    "module_id": "lvl1-mod1",
    "fen": "4k3/8/8/8/8/8/8/R3K2R w - - 0 1",
    "solution": "a1d1",
    "title": "Lección 15: La posición de las Torres",
    "instruction": "Las torres inician en las esquinas a1 y h1. Mueve la torre de a1 hacia el centro en d1.",
    "explanation": "Las esquinas son el hogar natural de las Torres."
  },
  "lvl1-mod1-lsn16": {
    "module_id": "lvl1-mod1",
    "fen": "4k3/8/8/8/8/8/8/1N2K1N1 w - - 0 1",
    "solution": "g1f3",
    "title": "Lección 16: La posición de los Caballos",
    "instruction": "Los caballos inician junto a las torres en b1 y g1. Mueve el caballo de g1 a f3.",
    "explanation": "f3 y c3 son las casillas de desarrollo natural para los caballos."
  },
  "lvl1-mod1-lsn17": {
    "module_id": "lvl1-mod1",
    "fen": "4k3/8/8/8/8/8/8/2B1KB2 w - - 0 1",
    "solution": "f1c4",
    "title": "Lección 17: La posición de los Alfiles",
    "instruction": "Los alfiles custodian al rey y la reina (c1 y f1). Desarrolla el alfil de f1 a c4.",
    "explanation": "La casilla c4 apunta directamente al centro."
  },
  "lvl1-mod1-lsn18": {
    "module_id": "lvl1-mod1",
    "fen": "4k3/8/8/8/8/8/8/3QK3 w - - 0 1",
    "solution": "d1d5",
    "title": "Lección 18: La Dama en su color",
    "instruction": "La Dama blanca siempre va en casilla blanca (d1). Muévela de d1 a d5.",
    "explanation": "¡Bien! La Dama negra inicia en d8 (casilla oscura)."
  },
  "lvl1-mod1-lsn19": {
    "module_id": "lvl1-mod1",
    "fen": "4k3/8/8/8/8/8/8/3QK3 w - - 0 1",
    "solution": "e1e2",
    "title": "Lección 19: El Rey al lado de su Reina",
    "instruction": "El Rey completa la pareja real en e1. Mueve el Rey a e2.",
    "explanation": "El Rey inicia en e1 (casilla oscura para el blanco)."
  },
  "lvl1-mod1-lsn20": {
    "module_id": "lvl1-mod1",
    "fen": "7k/8/8/8/8/8/8/R3K3 w - - 0 1",
    "solution": "a1a8",
    "title": "Lección 20: Visión periférica del tablero",
    "instruction": "El tablero entero es tu dominio. Mueve la Torre de a1 hasta a8 para darle jaque al rey en h8.",
    "explanation": "La torre ataca a distancia de borde a borde."
  },
  "lvl1-mod1-lsn21": {
    "module_id": "lvl1-mod1",
    "fen": "4k3/8/8/8/8/8/8/1N2K3 w - - 0 1",
    "solution": "b1c3",
    "title": "Lección 21: Casillas de transición",
    "instruction": "El caballo de b1 usa casillas de transición. Muévelo a c3.",
    "explanation": "c3 permite al caballo saltar luego a d5 o e4."
  },
  "lvl1-mod1-lsn22": {
    "module_id": "lvl1-mod1",
    "fen": "4k3/8/8/8/3P4/8/8/4K3 w - - 0 1",
    "solution": "d4d5",
    "title": "Lección 22: El territorio propio",
    "instruction": "Las primeras 4 filas son tu territorio. Mueve el peón de d4 a d5, cruzando la frontera.",
    "explanation": "Al cruzar la línea central, invades el campo rival."
  },
  "lvl1-mod1-lsn23": {
    "module_id": "lvl1-mod1",
    "fen": "4k3/8/8/3P4/8/8/8/4K3 w - - 0 1",
    "solution": "d5d6",
    "title": "Lección 23: El territorio enemigo",
    "instruction": "Tu peón ya está en territorio enemigo (fila 5). Avanza hacia d6.",
    "explanation": "Entre más profundo entres, más peligroso eres."
  },
  "lvl1-mod1-lsn24": {
    "module_id": "lvl1-mod1",
    "fen": "4k3/8/8/8/3P4/8/8/4K3 w - - 0 1",
    "solution": "d4d5",
    "title": "Lección 24: Líneas limítrofes",
    "instruction": "La tensión ocurre en la frontera. Avanza el peón de d4 a d5 para cruzar la línea divisoria (filas 4 y 5).",
    "explanation": "Has cruzado el Ecuador del tablero."
  },
  "lvl1-mod1-lsn25": {
    "module_id": "lvl1-mod1",
    "fen": "4k3/8/8/8/8/8/P6P/4K3 w - - 0 1",
    "solution": "h2h4",
    "title": "Lección 25: Simetría posicional",
    "instruction": "El tablero es simétrico. Avanza ambos peones de los extremos. Inicia moviendo h2 a h4.",
    "explanation": "La simetría a menudo se rompe en el flanco de ataque."
  },
  "lvl1-mod1-lsn26": {
    "module_id": "lvl1-mod1",
    "fen": "4k3/8/8/8/8/8/8/N3K3 w - - 0 1",
    "solution": "a1b3",
    "title": "Lección 26: Puntos ciegos",
    "instruction": "Las esquinas limitan a los caballos. Saca al caballo de a1 llevándolo a b3.",
    "explanation": "¡Mejor! Ahora controla más casillas hacia el centro."
  },
  "lvl1-mod1-lsn27": {
    "module_id": "lvl1-mod1",
    "fen": "4k3/8/8/8/8/8/8/Q3K3 w - - 0 1",
    "solution": "a1d4",
    "title": "Lección 27: Rutas óptimas para piezas",
    "instruction": "La Reina es veloz. Centraliza la Reina desde a1 directamente a d4 en un solo movimiento.",
    "explanation": "¡Poder centralizado! Desde d4 la dama domina todo."
  },
  "lvl1-mod1-lsn28": {
    "module_id": "lvl1-mod1",
    "fen": "4k3/8/8/8/8/8/8/B3K3 w - - 0 1",
    "solution": "a1h8",
    "title": "Lección 28: Geometría básica",
    "instruction": "El Alfil en a1 domina la diagonal larga. Muévelo hasta la otra esquina en h8.",
    "explanation": "Esa es la diagonal mayor de casillas oscuras."
  },
  "lvl1-mod1-lsn29": {
    "module_id": "lvl1-mod1",
    "fen": "4k3/8/8/8/8/8/8/R1B1K3 w - - 0 1",
    "solution": "c1f4",
    "title": "Lección 29: Coordinación visual",
    "instruction": "Dos piezas trabajando juntas. Mueve el Alfil de c1 a f4.",
    "explanation": "Pronto coordinarás piezas sin tener que pensar en las coordenadas."
  },
  "lvl1-mod1-lsn30": {
    "module_id": "lvl1-mod1",
    "fen": "4k3/8/8/8/8/8/8/R3K2K w - - 0 1",
    "solution": "h1g2",
    "title": "Lección 30: Examen de Geografía",
    "instruction": "Prueba final: Mueve el Rey de h1 a g2.",
    "explanation": "¡Has aprobado la unidad 1! El tablero ya no tiene secretos para ti."
  }
}

def update_db():
    db = SessionLocal()
    for lesson_id, data in NEW_LESSONS.items():
        lesson = db.query(ChessLesson).filter_by(id=lesson_id).first()
        if lesson:
            lesson.fen = data["fen"]
            lesson.solution = data["solution"]
            lesson.title = data["title"]
            lesson.instruction = data["instruction"]
            lesson.explanation = data["explanation"]
            lesson.hint = ""
        else:
            new_lesson = ChessLesson(
                id=lesson_id,
                module_id=data["module_id"],
                title=data["title"],
                instruction=data["instruction"],
                fen=data["fen"],
                solution=data["solution"],
                hint="",
                explanation=data["explanation"]
            )
            db.add(new_lesson)
    db.commit()
    print("DB actualizada con FEN validos.")

def update_python_catalog():
    filepath = "app/services/chess_catalog.py"
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    for lesson_id, data in NEW_LESSONS.items():
        pattern = r"(\"" + lesson_id + r"\"|\'" + lesson_id + r"\')\s*:\s*\{.*?\}(?=\s*(?:,|\n|$))"
        replacement = f'"{lesson_id}": {json.dumps(data, ensure_ascii=False)}'
        content = re.sub(pattern, replacement, content, flags=re.DOTALL)
        
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print("Catalog.py actualizado con FEN validos.")

if __name__ == "__main__":
    update_db()
    update_python_catalog()
