from sqlalchemy import text
from app.database import engine

def main():
    try:
        with engine.connect() as conn:
            conn.execute(text('ALTER TABLE campaigns ADD COLUMN is_scheduled BOOLEAN DEFAULT FALSE;'))
            conn.execute(text('ALTER TABLE campaigns ADD COLUMN scheduled_at TIMESTAMP WITH TIME ZONE;'))
            conn.execute(text('ALTER TABLE campaigns ADD COLUMN frequency VARCHAR DEFAULT \'once\';'))
            conn.commit()
            print('Postgres DB updated.')
    except Exception as e:
        print('Error:', e)

if __name__ == '__main__':
    main()
