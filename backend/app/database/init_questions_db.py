from app.database.db import get_db
import os

def apply_schema():
    print("Applying questions schema...")
    conn = get_db()
    cur = conn.cursor()
    
    schema_path = os.path.join(os.path.dirname(__file__), "questions_schema.sql")
    
    with open(schema_path, "r") as f:
        sql = f.read()
        
    try:
        cur.execute(sql)
        conn.commit()
        print("Schema applied successfully!")
    except Exception as e:
        conn.rollback()
        print(f"Error applying schema: {e}")
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    apply_schema()
