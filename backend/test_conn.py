# backend/test_conn.py
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine

load_dotenv()
url = os.getenv("DATABASE_URL")
if not url:
    url = "sqlite:///./onixlingo.db"

if url.startswith("postgres://"):
    url = url.replace("postgres://", "postgresql://", 1)

db_host = url.split('@')[-1] if '@' in url else url
print(f"[INFO] Engine URL Host: {db_host}")

try:
    # Set connect_timeout to 3 seconds for postgresql / sqlite
    connect_args = {}
    if "postgresql" in url:
        connect_args = {"connect_timeout": 3}
    
    engine = create_engine(url, connect_args=connect_args)
    print("[INFO] Attempting to connect...")
    conn = engine.connect()
    print("[SUCCESS] Connected successfully!")
    conn.close()
except Exception as e:
    print(f"[ERROR] Connection failed: {e}")
