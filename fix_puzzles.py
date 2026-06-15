import json
import os

data = {
    'lunes': {
        'id': 'daily-puzzle-lunes',
        'fen': 'r3k2r/1bppqpb1/pn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1',
        'solution': 'FREE_PLAY',
        'title': 'Reto Diario: Lunes',
        'instruction': 'Pesadilla Matemática (Posición Perft-2).',
        'explanation': 'Utilizada por científicos para estresar motores de IA. Infinitas ramificaciones, un solo error te liquida.'
    },
    'martes': {
        'id': 'daily-puzzle-martes',
        'fen': '8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1',
        'solution': 'FREE_PLAY',
        'title': 'Reto Diario: Martes',
        'instruction': 'Final Calculador Infernal (Posición Perft-3).',
        'explanation': 'Un final de torres que vuelve locas a las computadoras. Cada avance de peón cambia la evaluación drásticamente.'
    },
    'miercoles': {
        'id': 'daily-puzzle-miercoles',
        'fen': 'r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1',
        'solution': 'FREE_PLAY',
        'title': 'Reto Diario: Miércoles',
        'instruction': 'Caos Absoluto (Posición Perft-5).',
        'explanation': 'Un tablero visualmente imposible. Múltiples coronaciones inminentes, jaques y tensión extrema.'
    },
    'jueves': {
        'id': 'daily-puzzle-jueves',
        'fen': 'rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8',
        'solution': 'FREE_PLAY',
        'title': 'Reto Diario: Jueves',
        'instruction': 'Estructura Apocalíptica (Posición Perft-6).',
        'explanation': 'Tensiones en 4 flancos simultáneos. Si sobrevives 10 jugadas contra el bot, eres un genio.'
    },
    'viernes': {
        'id': 'daily-puzzle-viernes',
        'fen': 'r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10',
        'solution': 'FREE_PLAY',
        'title': 'Reto Diario: Viernes',
        'instruction': 'Espejo Roto (Máxima Complejidad Simétrica).',
        'explanation': 'La posición es tan tensa que el primero en atacar suele perder, a menos que calcule 15 jugadas adelante.'
    },
    'sabado': {
        'id': 'daily-puzzle-sabado',
        'fen': '2rq1rk1/pb2bppp/1pn1pn2/3p4/2PP4/1PN2N2/PB2BPPP/2RQ1RK1 w - - 3 12',
        'solution': 'FREE_PLAY',
        'title': 'Reto Diario: Sábado',
        'instruction': 'La Trampa de los Peones Colgantes.',
        'explanation': 'La posición más difícil de dominar a nivel estratégico. Si avanzas muy pronto, pierdes.'
    },
    'domingo': {
        'id': 'daily-puzzle-domingo',
        'fen': 'r1bq1rk1/pp2npbp/2npp1p1/8/2BNP3/2N1B3/PPP2PPP/R2Q1RK1 w - - 4 10',
        'solution': 'FREE_PLAY',
        'title': 'Reto Diario: Domingo',
        'instruction': 'Sangre en el Dragón (Nivel Gran Maestro).',
        'explanation': 'Ataques de mate en ambos bandos. Una jugada lenta y recibirás jaque mate implacable.'
    }
}

for day, content in data.items():
    with open(f"backend/app/data/lessons/chess/{day}.json", "w", encoding="utf-8") as f:
        json.dump(content, f, ensure_ascii=False, indent=2)

print("Listo!")
