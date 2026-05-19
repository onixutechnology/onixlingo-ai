import psycopg2

try:
    conn = psycopg2.connect("postgresql://postgres:9O0YQ6O1V2O8E7N9@db.onixu.company:5432/postgres", connect_timeout=5)
    conn.autocommit = True
    cur = conn.cursor()
    
    fields = [
        "full_name VARCHAR",
        "phone VARCHAR",
        "country_code VARCHAR DEFAULT 'MX'",
        "avatar_url VARCHAR"
    ]
    
    for field in fields:
        col_name = field.split()[0]
        print(f"Agregando {col_name}...")
        try:
            cur.execute(f"ALTER TABLE users ADD COLUMN IF NOT EXISTS {field}")
            print(f"✅ {col_name} agregada.")
        except Exception as e:
            print(f"❌ Error en {col_name}: {e}")
            
    cur.close()
    conn.close()
    print("🚀 Proceso terminado.")
except Exception as e:
    print(f"💥 Error de conexión: {e}")
