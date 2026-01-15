# backend/app/db/models.py

from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, func, Enum
from sqlalchemy.orm import relationship
from app.db.base import Base
import enum

# Define tus tipos de lecciones para evitar errores de texto
class LessonType(str, enum.Enum):
    STANDARD = "standard"
    PRO = "pro"
    VOCAB = "vocab"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    # ... (tus campos existentes)
    username = Column(String, unique=True, index=True, nullable=False)
    
    # Relaciones
    progress = relationship("Progress", back_populates="owner", cascade="all, delete-orphan")
    achievements = relationship("UserAchievement", back_populates="user") # Nueva relación

class Progress(Base):
    __tablename__ = "progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    lesson_id = Column(String, index=True, nullable=False) 
    
    # NUEVO: Para saber a qué bloque pertenece este progreso sin parsear el ID
    lesson_type = Column(Enum(LessonType), default=LessonType.STANDARD) 

    stars = Column(Integer, default=0)
    score = Column(Integer, default=0)
    
    current_step = Column(Integer, default=0)
    total_steps = Column(Integer, default=1)
    status = Column(String, default="locked") 
    
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    owner = relationship("User", back_populates="progress")

# NUEVA TABLA: Para los trofeos
class UserAchievement(Base):
    __tablename__ = "user_achievements"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    achievement_code = Column(String, index=True) # Ej: "first_perfect_score"
    earned_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", back_populates="achievements")