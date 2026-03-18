
import os
import sys
# Add the project root to sys.path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from app.database.db import SessionLocal
from app.classifications.models import Classification

def check():
    db = SessionLocal()
    try:
        items = db.query(Classification).all()
        print(f"Total classifications: {len(items)}")
        for item in items:
            print(f"ID: {item.id}, Type: {item.type}, Name: {item.name}, Code: {item.code}")
    finally:
        db.close()

if __name__ == "__main__":
    check()
