from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_exercises_status():
    return {"status": "Exercises engine active"}
