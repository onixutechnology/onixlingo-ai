import sqlite3
import os

db_path = "onixlingo.db"

if not os.path.exists(db_path):
    print(f"[ERROR] No se encontró la base de datos en {db_path}")
    exit(1)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

print("--- INSPECCIÓN DE USUARIOS ---")
try:
    cursor.execute("SELECT id, username, email, tier, is_pro FROM users")
    users = cursor.fetchall()
    for u in users:
        print(f"ID: {u[0]} | Username: {u[1]} | Email: {u[2]} | Tier: {u[3]} | IsPro: {u[4]}")
except Exception as e:
    print(f"Error al leer usuarios: {e}")

print("\n--- LIMPIEZA DE USUARIOS ---")
try:
    # Eliminar registros relacionados para evitar violaciones de clave foránea si las hay
    # Primero vemos qué tablas existen en la base de datos
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = [t[0] for t in cursor.fetchall()]
    print(f"Tablas encontradas: {', '.join(tables)}")

    # Obtenemos los IDs de los usuarios que NO son admin ni j2022eico2
    cursor.execute("SELECT id, username FROM users WHERE username NOT IN ('admin', 'j2022eico2')")
    to_delete = cursor.fetchall()
    to_delete_ids = [u[0] for u in to_delete]
    to_delete_names = [u[1] for u in to_delete]

    print(f"Usuarios a eliminar: {to_delete_names}")

    if to_delete_ids:
        # Eliminamos de tablas relacionadas
        related_tables = ["progress", "user_progress", "analytics", "user_lessons", "subscriptions", "user_subscription"]
        for table in related_tables:
            if table in tables:
                # Intentamos eliminar por user_id o similar si existe la columna
                cursor.execute(f"PRAGMA table_info({table})")
                cols = [c[1] for c in cursor.fetchall()]
                if "user_id" in cols:
                    cursor.execute(f"DELETE FROM {table} WHERE user_id IN ({','.join(['?']*len(to_delete_ids))})", to_delete_ids)
                    print(f"  - Eliminados registros relacionados de la tabla '{table}'")
                elif "username" in cols:
                    cursor.execute(f"DELETE FROM {table} WHERE username IN ({','.join(['?']*len(to_delete_names))})", to_delete_names)
                    print(f"  - Eliminados registros relacionados de la tabla '{table}'")

        # Ahora eliminamos de la tabla de usuarios
        cursor.execute(f"DELETE FROM users WHERE id IN ({','.join(['?']*len(to_delete_ids))})", to_delete_ids)
        print(f"[OK] Usuarios eliminados con éxito de la tabla 'users'.")
        
        # Opcional: reiniciar estado de códigos beta usados por correos eliminados
        if "beta_codes" in tables:
            cursor.execute("UPDATE beta_codes SET is_used = 0, used_by_email = NULL, used_at = NULL WHERE used_by_email NOT IN (SELECT email FROM users)")
            print("  - Códigos beta liberados para correos eliminados.")

        conn.commit()
    else:
        print("[INFO] No hay usuarios adicionales para eliminar.")

except Exception as e:
    conn.rollback()
    print(f"[ERROR] Durante la limpieza: {e}")

print("\n--- INSPECCIÓN FINAL DE USUARIOS ---")
try:
    cursor.execute("SELECT id, username, email, tier, is_pro FROM users")
    users = cursor.fetchall()
    for u in users:
        print(f"ID: {u[0]} | Username: {u[1]} | Email: {u[2]} | Tier: {u[3]} | IsPro: {u[4]}")
except Exception as e:
    print(f"Error al leer usuarios finales: {e}")

conn.close()
