from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from passlib.context import CryptContext
import logging

# --- IMPORTS PROPIOS ---
from app.core.settings import settings
from app.database import create_db, get_db, User, Progress
from app.api.v1.endpoints import lessons, gemini_ai

# 1. Configuración de Logging (Para ver errores en consola)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 2. Inicializar Base de Datos
try:
    create_db()
    logger.info("✅ Base de datos inicializada correctamente.")
except Exception as e:
    logger.error(f"❌ Error al conectar con la base de datos: {e}")

# 3. Configuración de Seguridad (Hashing)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# --- INICIALIZACIÓN DE LA APP ---
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend de OnixLingo con soporte para IA, Base de Datos y Ngrok.",
    version="1.0.0",
    openapi_url="/api/v1/openapi.json"
)

# --- CONFIGURACIÓN CORS (CRÍTICO PARA NGROK) ---
# allow_origins=["*"] es esencial para Ngrok porque la URL cambia siempre.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite cualquier origen (localhost, ngrok, vercel, etc.)
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos los métodos (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # Permite todos los headers
)

# --- MODELOS PYDANTIC (Schemas) ---
class UserCreate(BaseModel):
    username: str
    password: str

class ProgressUpdate(BaseModel):
    username: str
    lesson_id: str
    stars: int

# --- ENDPOINTS DE AUTENTICACIÓN Y USUARIOS ---

@app.post("/api/v1/register", status_code=status.HTTP_201_CREATED)
def register(user: UserCreate, db: Session = Depends(get_db)):
    """
    Registra un nuevo usuario.
    Retorna error 400 si el usuario ya existe.
    """
    # 1. Verificar existencia
    existing_user = db.query(User).filter(User.username == user.username).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="El nombre de usuario ya está en uso."
        )
    
    # 2. Hashear password y guardar
    hashed_password = pwd_context.hash(user.password)
    db_user = User(username=user.username, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return {"message": "Usuario creado exitosamente", "user_id": db_user.id}

@app.post("/api/v1/login")
def login(user: UserCreate, db: Session = Depends(get_db)):
    """
    Autentica al usuario y devuelve su progreso actual.
    """
    # 1. Buscar usuario
    db_user = db.query(User).filter(User.username == user.username).first()
    
    # 2. Validar password
    if not db_user or not pwd_context.verify(user.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Credenciales incorrectas"
        )
    
    # 3. Formatear progreso para el Frontend (Zustand store)
    progress_data = {}
    for p in db_user.progress:
        progress_data[p.lesson_id] = {
            "stars": p.stars, 
            "score": p.stars * 10 
        }
        
    return {
        "message": "Login exitoso", 
        "username": db_user.username, 
        "progress": progress_data
    }

@app.post("/api/v1/save_progress")
def save_progress(data: ProgressUpdate, db: Session = Depends(get_db)):
    """
    Guarda el progreso (estrellas) de una lección específica.
    Solo actualiza si la nueva puntuación es mayor o igual.
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
        # Lógica de "High Score": Solo actualizamos si mejora o empata
        if data.stars >= prog.stars:
            prog.stars = data.stars
    else:
        # Crear nuevo registro
        new_prog = Progress(user_id=user.id, lesson_id=data.lesson_id, stars=data.stars)
        db.add(new_prog)
    
    db.commit()
    return {"status": "saved", "lesson": data.lesson_id, "stars": data.stars}

# --- REGISTRO DE RUTAS (ROUTERS) ---

# Lecciones (JSON estático + Lógica de juego)
app.include_router(lessons.router, prefix="/api/v1/lessons", tags=["Lecciones"])

# Inteligencia Artificial (Gemini)
app.include_router(gemini_ai.router, prefix="/api/v1/ai", tags=["IA Tutor"])

# --- ENDPOINT DE SALUD (Health Check) ---
@app.get("/", tags=["General"])
async def root():
    return {
        "app": "OnixLingo Backend",
        "status": "Running 🚀",
        "docs": "/docs",
        "ngrok_ready": True
    }