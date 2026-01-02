from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from passlib.context import CryptContext
from typing import Optional
import logging

# --- IMPORTS PROPIOS ---
from app.core.settings import settings
from app.database import create_db, get_db, User, Progress
from app.api.v1.endpoints import lessons, gemini_ai

# 1. Configuración de Logging (Vital para depurar en Render)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 2. Inicializar Base de Datos
try:
    create_db()
    logger.info("✅ Base de datos inicializada y conectada.")
except Exception as e:
    logger.error(f"❌ Error CRÍTICO al conectar DB: {e}")

# 3. Configuración de Seguridad (Hashing de contraseñas)
pwd_context = CryptContext(schemes=["argon2", "bcrypt"], deprecated="auto")

# --- INICIALIZACIÓN DE LA APP ---
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend Profesional OnixLingo (FastAPI + PostgreSQL + Gemini AI)",
    version="1.0.0",
    docs_url="/docs",
    redoc_url=None
)

# --- CONFIGURACIÓN CORS (PERMISIVA PARA EVITAR BLOQUEOS) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Acepta Vercel, Localhost, Ngrok, etc.
    allow_credentials=True,
    allow_methods=["*"],  # Acepta GET, POST, OPTIONS, PUT, DELETE
    allow_headers=["*"],  # Acepta Authorization, Content-Type, etc.
)

# --- MODELOS PYDANTIC (Validación de Datos) ---
class UserCreate(BaseModel):
    username: str
    email: Optional[str] = None  # Agregado para compatibilidad con el Frontend
    password: str

class ProgressUpdate(BaseModel):
    username: str
    lesson_id: str
    stars: int

# --- ENDPOINTS DE AUTENTICACIÓN Y USUARIOS ---

@app.post("/api/v1/register", status_code=status.HTTP_201_CREATED)
def register(user: UserCreate, db: Session = Depends(get_db)):
    """
    Registra un nuevo usuario en PostgreSQL.
    """
    logger.info(f"📝 Intentando registrar usuario: {user.username}")
    
    # 1. Verificar existencia
    existing_user = db.query(User).filter(User.username == user.username).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="El nombre de usuario ya está en uso."
        )
    
    # 2. Hashear password y guardar
    hashed_password = pwd_context.hash(user.password)
    # Nota: Si tu modelo de DB tiene campo email, agrégalo aquí: email=user.email
    db_user = User(username=user.username, hashed_password=hashed_password)
    
    try:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        logger.info(f"✅ Usuario {user.username} creado con éxito (ID: {db_user.id})")
        return {"message": "Usuario creado exitosamente", "user_id": db_user.id}
    except Exception as e:
        db.rollback()
        logger.error(f"❌ Error al guardar en DB: {e}")
        raise HTTPException(status_code=500, detail="Error interno al crear usuario")

@app.post("/api/v1/login")
def login(user: UserCreate, db: Session = Depends(get_db)):
    """
    Autentica al usuario y devuelve su progreso sincronizado.
    """
    logger.info(f"🔐 Intento de login: {user.username}")
    
    # 1. Buscar usuario
    db_user = db.query(User).filter(User.username == user.username).first()
    
    # 2. Validar password
    if not db_user or not pwd_context.verify(user.password, db_user.hashed_password):
        logger.warning(f"⚠️ Login fallido para: {user.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Credenciales incorrectas"
        )
    
    # 3. Formatear progreso
    progress_data = {}
    for p in db_user.progress:
        progress_data[p.lesson_id] = {
            "stars": p.stars, 
            "score": p.stars * 10 
        }
        
    logger.info(f"🔓 Login exitoso para: {user.username}")
    return {
        "message": "Login exitoso", 
        "username": db_user.username, 
        "progress": progress_data
    }

@app.post("/api/v1/save_progress")
def save_progress(data: ProgressUpdate, db: Session = Depends(get_db)):
    """
    Guarda o actualiza el progreso (estrellas) de una lección.
    """
    user = db.query(User).filter(User.username == data.username).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # Buscar progreso existente
    prog = db.query(Progress).filter(
        Progress.user_id == user.id, 
        Progress.lesson_id == data.lesson_id
    ).first()
    
    if prog:
        # Lógica "High Score": Solo actualizamos si mejora
        if data.stars >= prog.stars:
            prog.stars = data.stars
    else:
        # Nuevo registro
        new_prog = Progress(user_id=user.id, lesson_id=data.lesson_id, stars=data.stars)
        db.add(new_prog)
    
    try:
        db.commit()
        return {"status": "saved", "lesson": data.lesson_id, "stars": data.stars}
    except Exception as e:
        db.rollback()
        logger.error(f"Error guardando progreso: {e}")
        raise HTTPException(status_code=500, detail="Error al guardar progreso")

# --- REGISTRO DE RUTAS (ROUTERS) ---
app.include_router(lessons.router, prefix="/api/v1/lessons", tags=["Lecciones"])
app.include_router(gemini_ai.router, prefix="/api/v1/ai", tags=["IA Tutor"])

# --- ENDPOINT DE SALUD ---
@app.get("/", tags=["General"])
async def root():
    return {
        "app": "OnixLingo Backend v1.0",
        "status": "Online 🟢",
        "cors_enabled": True
    }