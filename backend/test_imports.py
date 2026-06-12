import sys
print("Starting imports...")
try:
    print("Importing app.config...")
    from app.config import settings
    print("Importing app.database...")
    from app.database import create_db, get_db
    print("Importing app.services...")
    from app.services import user_service
    print("Importing app.datachess.seed_chess...")
    from app.datachess.seed_chess import generate_lessons 
    print("Importing app.api.v1.endpoints...")
    from app.api.v1.endpoints import auth, lessons, progress, ai, users, speech, chess_ws, billing, avatar, exercises, admin
    print("Importing app.api.v1.endpoints.chess...")
    from app.api.v1.endpoints import chess as chess_endpoints
    print("Importing app.api.chess...")
    from app.api import chess 
    print("ALL IMPORTS DONE")
except Exception as e:
    import traceback
    print(traceback.format_exc())
