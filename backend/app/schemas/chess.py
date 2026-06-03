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


from datetime import datetime

class MatchmakingQueueCreate(BaseModel):
    time_control: str  # bullet | blitz | rapid | classical
    elo_rating: int
    elo_range: Optional[int] = 100

class MatchmakingQueueResponse(BaseModel):
    id: int
    user_id: int
    time_control: str
    elo_rating: int
    elo_range: int
    queued_at: datetime
    status: str = "queued"

    class Config:
        from_attributes = True

class MatchmakingStatusResponse(BaseModel):
    status: str  # queued | matched | idle
    match_id: Optional[str] = None
    your_color: Optional[str] = None  # white | black
    opponent_username: Optional[str] = None
    opponent_elo: Optional[int] = None

