from pydantic import BaseModel
from typing import List, Optional

class ChessLessonResponse(BaseModel):
    id: str
    module_id: str
    title: str
    instruction: str
    fen: str
    solution: str
    hint: Optional[str] = None
    explanation: Optional[str] = None

    class Config:
        from_attributes = True

class ChessProgressCreate(BaseModel):
    lesson_id: str
    status: str = "completed"

class ChessProgressResponse(BaseModel):
    completed_lessons: List[str]
    total_puzzles: int
