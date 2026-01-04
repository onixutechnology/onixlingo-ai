from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.db.base import Base  # Asumiendo que definiste Base en base.py

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=True)
    hashed_password = Column(String, nullable=False)
    
    # Metadatos Titanium
    is_active = Column(Boolean, default=True)
    role = Column(String, default="student") 
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relaciones
    progress = relationship("Progress", back_populates="owner", cascade="all, delete-orphan")

class Progress(Base):
    __tablename__ = "progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    lesson_id = Column(String, index=True, nullable=False) # Ej: 'pro-b1-1'
    
    # --- MÉTRICAS TITANIUM ---
    stars = Column(Integer, default=0)
    score = Column(Integer, default=0)
    
    # CAMPOS NUEVOS PARA EL 35% DE AVANCE
    current_step = Column(Integer, default=0) # Slide actual (ej: 7)
    total_steps = Column(Integer, default=1)  # Total slides (ej: 20)
    status = Column(String, default="locked") # 'locked', 'active', 'completed'
    
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    owner = relationship("User", back_populates="progress")