import sys
print("Importing sqlalchemy...", flush=True)
import sqlalchemy
print(f"SQLAlchemy version: {sqlalchemy.__version__}", flush=True)
from sqlalchemy import create_engine
print("Successfully imported create_engine!", flush=True)
