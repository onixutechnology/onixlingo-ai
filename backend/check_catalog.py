import sys
import re
from app.services.chess_catalog import CHESS_LESSONS_CATALOG

print(f"Total lecciones en catálogo: {len(CHESS_LESSONS_CATALOG)}")
fens = set()
for l in CHESS_LESSONS_CATALOG:
    fens.add(l.get('fen', 'NO_FEN'))
    
print(f"Total FENs únicos: {len(fens)}")
if len(fens) < 10:
    print("Muestra de FENs:")
    for f in fens:
        print(f" - {f}")
