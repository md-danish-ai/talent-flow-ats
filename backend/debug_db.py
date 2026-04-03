from app.database.db import SessionLocal
from sqlalchemy import text

db = SessionLocal()
try:
    result = db.execute(
        text(
            "SELECT column_name FROM information_schema.columns WHERE table_name = 'papers'"
        )
    )
    columns = [row[0] for row in result]
    print("Columns in 'papers' table:", columns)
finally:
    db.close()
