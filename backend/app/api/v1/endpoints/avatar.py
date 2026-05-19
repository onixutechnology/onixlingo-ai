from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_avatar_status():
    return {"status": "Avatar engine active"}
