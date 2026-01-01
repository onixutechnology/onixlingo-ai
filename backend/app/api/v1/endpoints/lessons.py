import json
import os
from fastapi import APIRouter, HTTPException
from typing import Any, Dict

router = APIRouter()

# Definimos la ruta de forma relativa a la ejecución
LESSONS_DIR = "app/data/lessons"

@router.get("/{lesson_id}")
async def get_static_lesson(lesson_id: str) -> Dict[str, Any]:
    """
    Lee un archivo JSON manual y lo devuelve.
    """
    # Construimos la ruta completa
    file_path = os.path.join(LESSONS_DIR, f"{lesson_id}.json")
    
    # --- DEBUG LOG (MIRA ESTO EN TU TERMINAL SI FALLA) ---
    print(f"📂 Buscando lección en: {os.path.abspath(file_path)}")
    
    if not os.path.exists(file_path):
        print("❌ Archivo NO encontrado")
        raise HTTPException(status_code=404, detail=f"Lección '{lesson_id}' no encontrada en el servidor")
    
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            lesson_data = json.load(f)
        print("✅ Lección cargada con éxito")
        return lesson_data
    except Exception as e:
        print(f"❌ Error de lectura JSON: {e}")
        raise HTTPException(status_code=500, detail="Error de formato en el archivo de lección")