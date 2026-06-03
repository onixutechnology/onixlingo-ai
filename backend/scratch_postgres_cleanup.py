import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("[ERROR] No se encontró la variable DATABASE_URL en el entorno.")
    exit(1)

if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL)

with engine.connect() as conn:
    print("--- INSPECCIÓN DE USUARIOS (POSTGRESQL) ---")
    try:
        res = conn.execute(text("SELECT id, username, email, tier, is_pro FROM users"))
        users = res.fetchall()
        for u in users:
            print(f"ID: {u[0]} | Username: {u[1]} | Email: {u[2]} | Tier: {u[3]} | IsPro: {u[4]}")
    except Exception as e:
        print(f"Error al leer usuarios: {e}")

    print("\n--- LIMPIEZA DE USUARIOS ---")
    try:
        # Obtenemos los IDs y usernames de los usuarios que NO son admin ni j2022eico2
        res_delete = conn.execute(
            text("SELECT id, username FROM users WHERE username NOT IN ('admin', 'j2022eico2')")
        )
        to_delete = res_delete.fetchall()
        to_delete_ids = [u[0] for u in to_delete]
        to_delete_names = [u[1] for u in to_delete]

        print(f"Usuarios a eliminar: {to_delete_names}")

        if to_delete_ids:
            # Eliminamos de tablas relacionadas
            related_tables = [
                "progress", 
                "user_achievements", 
                "chess_progress", 
                "chess_moves", 
                "chess_matches", 
                "speech_practice_logs", 
                "exam_attempts"
            ]
            
            for table in related_tables:
                try:
                    # Verificar si existe columna user_id en la tabla
                    res_cols = conn.execute(text(f"SELECT column_name FROM information_schema.columns WHERE table_name='{table}'"))
                    cols = [r[0] for r in res_cols.fetchall()]
                    
                    if "user_id" in cols:
                        conn.execute(
                            text(f"DELETE FROM {table} WHERE user_id IN :ids"),
                            {"ids": tuple(to_delete_ids)}
                        )
                        print(f"  - Eliminados registros relacionados de la tabla '{table}' por user_id")
                    elif "username" in cols:
                        conn.execute(
                            text(f"DELETE FROM {table} WHERE username IN :names"),
                            {"names": tuple(to_delete_names)}
                        )
                        print(f"  - Eliminados registros relacionados de la tabla '{table}' por username")
                    elif "white_player_id" in cols or "black_player_id" in cols:
                        if "white_player_id" in cols:
                            conn.execute(
                                text(f"DELETE FROM {table} WHERE white_player_id IN :ids OR black_player_id IN :ids"),
                                {"ids": tuple(to_delete_ids)}
                            )
                            print(f"  - Eliminados registros de ajedrez en '{table}'")
                except Exception as tbl_err:
                    print(f"  [AVISO] No se pudo limpiar la tabla '{table}': {tbl_err}")

            # Ahora eliminamos de la tabla de usuarios
            conn.execute(
                text("DELETE FROM users WHERE id IN :ids"),
                {"ids": tuple(to_delete_ids)}
            )
            
            # Liberar códigos beta usados por correos eliminados
            conn.execute(
                text("UPDATE beta_codes SET is_used = False, used_by_email = NULL, used_at = NULL WHERE used_by_email NOT IN (SELECT email FROM users)")
            )
            
            conn.commit()
            print(f"[OK] Usuarios eliminados con éxito de la tabla 'users'.")
        else:
            print("[INFO] No hay usuarios adicionales para eliminar en PostgreSQL.")

    except Exception as e:
        conn.rollback()
        print(f"[ERROR] Durante la limpieza de PostgreSQL: {e}")

    print("\n--- INSPECCIÓN FINAL DE USUARIOS (POSTGRESQL) ---")
    try:
        res = conn.execute(text("SELECT id, username, email, tier, is_pro FROM users"))
        users = res.fetchall()
        for u in users:
            print(f"ID: {u[0]} | Username: {u[1]} | Email: {u[2]} | Tier: {u[3]} | IsPro: {u[4]}")
    except Exception as e:
        print(f"Error al leer usuarios finales: {e}")
