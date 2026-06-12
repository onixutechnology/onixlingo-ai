import sys
def p(m):
    print(m, flush=True)

p("1")
from app.config import settings
p("2")
from app.database import create_db, get_db
p("3")
from app.services import user_service
p("4")
from app.datachess.seed_chess import generate_lessons
p("5")
from app.api.v1.endpoints import auth
p("6")
from app.api.v1.endpoints import lessons
p("7")
from app.api.v1.endpoints import progress
p("8")
from app.api.v1.endpoints import ai
p("9")
from app.api.v1.endpoints import users
p("10")
from app.api.v1.endpoints import speech
p("11")
from app.api.v1.endpoints import chess_ws
p("12")
from app.api.v1.endpoints import billing
p("13")
from app.api.v1.endpoints import avatar
p("14")
from app.api.v1.endpoints import exercises
p("15")
from app.api.v1.endpoints import admin
p("16")
from app.api.v1.endpoints import chess
p("17")
from app.api import chess as api_chess
p("18")
