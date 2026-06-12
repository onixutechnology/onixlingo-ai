import sys
def p(m):
    print(m, flush=True)

p("Starting db test")
p("import os")
import os
p("import logging")
import logging
p("from sqlalchemy import create_engine")
from sqlalchemy import create_engine
p("from sqlalchemy.orm import sessionmaker")
from sqlalchemy.orm import sessionmaker
p("from dotenv import load_dotenv")
from dotenv import load_dotenv

p("load_dotenv()")
load_dotenv()

p("logger")
logger = logging.getLogger("OnixLingo.Database")
DATABASE_URL = os.getenv("DATABASE_URL")
p("db_url: " + str(DATABASE_URL))

if not DATABASE_URL:
    p("sqlite")
    DATABASE_URL = "sqlite:///./onixlingo.db"
    p("create_engine")
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
    p("engine created")

p("done db")
