import os
import json
import logging
from pathlib import Path
from contextlib import asynccontextmanager
from dotenv import load_dotenv

from fastapi import FastAPI, Request, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

# --- IMPORTACIONES LOCALES ---
from app.config import settings
from app.database import create_db, get_db
from app.services import user_service
from app.datachess.seed_chess import generate_lessons 

# --- IMPORTAMOS LOS ROUTERS ---
from app.api.v1.endpoints import auth, lessons, progress, ai, users, speech, chess_ws 
from app.api import chess 

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    logging.basicConfig(
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        level=logging.INFO
    )
    logger = logging.getLogger("OnixLingo.Core")
    try:
        create_db()
        logger.info("✅ [DB] Base de datos conectada y esquemas sincronizados.")
        logger.info("⏳ [DB] Verificando e inyectando lecciones de ajedrez...")
        generate_lessons()
        logger.info("✅ [DB] Ajedrez sincronizado y listo para jugar.")
    except Exception as e:
        logger.critical(f"❌ [DB] Error crítico al conectar DB: {e}")
    yield
    logger.info("🛑 [SYSTEM] Apagando sistema OnixLingo...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="OnixLingo Enterprise LMS API",
    version="8.0.0-titanium",
    docs_url="/docs",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS, 
    allow_origin_regex=r"https://.*\.vercel\.app", 
    allow_credentials=True, 
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"], 
    allow_headers=["*"],
    expose_headers=["*"]
)

# 🔥 CORRECCIÓN: Webhook de Paddle optimizado para Integer IDs
@app.post("/api/v1/webhooks/paddle", tags=["Payments"], include_in_schema=False)
async def paddle_webhook(
    request: Request, 
    db: Session = Depends(get_db)
):
    logger = logging.getLogger("OnixLingo.Payments")
    
    try:
        payload = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON payload")

    event_type = payload.get("event_type")
    
    if event_type == "transaction.completed":
        data = payload.get("data", {})
        custom_data = data.get("custom_data", {})
        
        try:
            # Forzamos la conversión a int() tal como lo exige el modelo User
            user_id = int(custom_data.get("internal_user_id"))
            
            updated_user = user_service.set_pro_status(db, user_id=user_id, is_pro=True)
            if updated_user:
                logger.info(f"✅ [UPGRADE] Usuario ID {user_id} actualizado a PRO exitosamente vía Paddle.")
            else:
                logger.warning(f"⚠️ [WARNING] Usuario ID {user_id} pagó pero no se encontró en DB.")
                
        except (TypeError, ValueError):
            logger.error(f"❌ [PADDLE ERROR] El internal_user_id no es un entero válido: {custom_data.get('internal_user_id')}")
            return {"status": "error", "detail": "Invalid user ID"}
        except Exception as e:
            logger.error(f"❌ [DB ERROR] Fallo al actualizar estado PRO: {e}")

    return {"status": "success", "event_type": event_type}

# 🔗 CONEXIÓN DE RUTAS (ROUTERS)
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/v1/users", tags=["Users Profile"])
app.include_router(progress.router, prefix="/api/v1/progress", tags=["Analytics & Progress"])
app.include_router(lessons.router, prefix="/api/v1/lessons", tags=["Lessons"])
app.include_router(ai.router, prefix="/api/v1/ai", tags=["AI Engine"])
app.include_router(speech.router, prefix="/api/v1/speech", tags=["Speech Analysis"])
app.include_router(chess.router, prefix="/api/v1", tags=["Chess Academy"])

# ⚡ NUEVO: WEBSOCKET PARA AJEDREZ EN VIVO
app.include_router(chess_ws.router, prefix="/ws/chess/matches", tags=["WebSockets"])

@app.get("/", tags=["System"])
@app.head("/", include_in_schema=False)
def health_check():
    return {
        "system": "OnixLingo Enterprise Kernel",
        "status": "OPERATIONAL 🟢",
        "version": "Titanium 8.0",
        "domain_check": "Verified"
    }

# 🌍 Endpoint multilenguaje
@app.get("/api/v1/voclessons/{lesson_id}", tags=["Lessons"])
def get_voc_lesson(
    lesson_id: str, 
    lang: str = Query("en", description="Idioma de la lección (en, fr, zh)")
):
    base_dir = Path(__file__).resolve().parent 
    
    file_path = base_dir / "voclessons" / "lessons" / lang / f"{lesson_id}.json"
    if file_path.exists():
        with open(file_path, "r", encoding="utf-8") as f:
            return json.load(f)
            
    file_path_alt = base_dir.parent / "app" / "voclessons" / "lessons" / lang / f"{lesson_id}.json"
    if file_path_alt.exists():
        with open(file_path_alt, "r", encoding="utf-8") as f:
            return json.load(f)

    raise HTTPException(status_code=404, detail=f"Lesson {lesson_id} not found for language '{lang}'")import os
import json
import logging
from pathlib import Path
from contextlib import asynccontextmanager
from dotenv import load_dotenv

from fastapi import FastAPI, Request, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

# --- IMPORTACIONES LOCALES ---
from app.config import settings
from app.database import create_db, get_db
from app.services import user_service
from app.datachess.seed_chess import generate_lessons 

# --- IMPORTAMOS LOS ROUTERS ---
from app.api.v1.endpoints import auth, lessons, progress, ai, users, speech, chess_ws 
from app.api import chess 

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    logging.basicConfig(
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        level=logging.INFO
    )
    logger = logging.getLogger("OnixLingo.Core")
    try:
        create_db()
        logger.info("✅ [DB] Base de datos conectada y esquemas sincronizados.")
        logger.info("⏳ [DB] Verificando e inyectando lecciones de ajedrez...")
        generate_lessons()
        logger.info("✅ [DB] Ajedrez sincronizado y listo para jugar.")
    except Exception as e:
        logger.critical(f"❌ [DB] Error crítico al conectar DB: {e}")
    yield
    logger.info("🛑 [SYSTEM] Apagando sistema OnixLingo...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="OnixLingo Enterprise LMS API",
    version="8.0.0-titanium",
    docs_url="/docs",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS, 
    allow_origin_regex=r"https://.*\.vercel\.app", 
    allow_credentials=True, 
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"], 
    allow_headers=["*"],
    expose_headers=["*"]
)

# 🔥 CORRECCIÓN: Webhook de Paddle optimizado para Integer IDs
@app.post("/api/v1/webhooks/paddle", tags=["Payments"], include_in_schema=False)
async def paddle_webhook(
    request: Request, 
    db: Session = Depends(get_db)
):
    logger = logging.getLogger("OnixLingo.Payments")
    
    try:
        payload = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON payload")

    event_type = payload.get("event_type")
    
    if event_type == "transaction.completed":
        data = payload.get("data", {})
        custom_data = data.get("custom_data", {})
        
        try:
            # Forzamos la conversión a int() tal como lo exige el modelo User
            user_id = int(custom_data.get("internal_user_id"))
            
            updated_user = user_service.set_pro_status(db, user_id=user_id, is_pro=True)
            if updated_user:
                logger.info(f"✅ [UPGRADE] Usuario ID {user_id} actualizado a PRO exitosamente vía Paddle.")
            else:
                logger.warning(f"⚠️ [WARNING] Usuario ID {user_id} pagó pero no se encontró en DB.")
                
        except (TypeError, ValueError):
            logger.error(f"❌ [PADDLE ERROR] El internal_user_id no es un entero válido: {custom_data.get('internal_user_id')}")
            return {"status": "error", "detail": "Invalid user ID"}
        except Exception as e:
            logger.error(f"❌ [DB ERROR] Fallo al actualizar estado PRO: {e}")

    return {"status": "success", "event_type": event_type}

# 🔗 CONEXIÓN DE RUTAS (ROUTERS)
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/v1/users", tags=["Users Profile"])
app.include_router(progress.router, prefix="/api/v1/progress", tags=["Analytics & Progress"])
app.include_router(lessons.router, prefix="/api/v1/lessons", tags=["Lessons"])
app.include_router(ai.router, prefix="/api/v1/ai", tags=["AI Engine"])
app.include_router(speech.router, prefix="/api/v1/speech", tags=["Speech Analysis"])
app.include_router(chess.router, prefix="/api/v1", tags=["Chess Academy"])

# ⚡ NUEVO: WEBSOCKET PARA AJEDREZ EN VIVO
app.include_router(chess_ws.router, prefix="/ws/chess/matches", tags=["WebSockets"])

@app.get("/", tags=["System"])
@app.head("/", include_in_schema=False)
def health_check():
    return {
        "system": "OnixLingo Enterprise Kernel",
        "status": "OPERATIONAL 🟢",
        "version": "Titanium 8.0",
        "domain_check": "Verified"
    }

# 🌍 Endpoint multilenguaje
@app.get("/api/v1/voclessons/{lesson_id}", tags=["Lessons"])
def get_voc_lesson(
    lesson_id: str, 
    lang: str = Query("en", description="Idioma de la lección (en, fr, zh)")
):
    base_dir = Path(__file__).resolve().parent 
    
    file_path = base_dir / "voclessons" / "lessons" / lang / f"{lesson_id}.json"
    if file_path.exists():
        with open(file_path, "r", encoding="utf-8") as f:
            return json.load(f)
            
    file_path_alt = base_dir.parent / "app" / "voclessons" / "lessons" / lang / f"{lesson_id}.json"
    if file_path_alt.exists():
        with open(file_path_alt, "r", encoding="utf-8") as f:
            return json.load(f)

    raise HTTPException(status_code=404, detail=f"Lesson {lesson_id} not found for language '{lang}'")