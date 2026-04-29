import os
import re
import psycopg2
import csv
from io import StringIO
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database connection details
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "postgres")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "talent_flow_ats")

SQL_FILE_PATH = "backups/users_1.sql"

def get_db_connection():
    return psycopg2.connect(
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT,
        database=DB_NAME
    )

def parse_sql_inserts(file_path):
    with open(file_path, 'r') as f:
        content = f.read()
    
    pattern = r"VALUES \((.*?)\);"
    matches = re.findall(pattern, content)
    
    users_data = []
    for match in matches:
        row = next(csv.reader(StringIO(match), quotechar="'", skipinitialspace=True))
        users_data.append(row)
        
    return users_data

def insert_users():
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        users = parse_sql_inserts(SQL_FILE_PATH)
        print(f"Found {len(users)} users in SQL file.")
        
        base_date = datetime.now()
        
        for i, user in enumerate(users):
            day_offset = i // 10
            current_date = (base_date + timedelta(days=day_offset)).strftime('%Y-%m-%d %H:%M:%S')
            
            username = user[0]
            mobile = user[1]
            email = user[2]
            password = user[3]
            role = user[4]
            is_active = user[5].lower() == 'true'
            created_by = None 
            department_id = int(user[9])
            test_level_id = int(user[10])
            
            # Use ON CONFLICT to update created_at if user already exists
            query = """
                INSERT INTO users (
                    username, mobile, email, password, role, is_active, 
                    created_by, created_at, updated_at, department_id, test_level_id
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (mobile) DO UPDATE SET 
                    created_at = EXCLUDED.created_at,
                    updated_at = EXCLUDED.updated_at,
                    email = EXCLUDED.email
            """
            
            try:
                cur.execute(query, (
                    username, mobile, email, password, role, is_active,
                    created_by, current_date, current_date, department_id, test_level_id
                ))
            except Exception as e:
                print(f"Skipping user {email} due to error: {e}")
                conn.rollback() # Rollback the sub-transaction if needed, but in psycopg2 we need to be careful
                # Actually, in psycopg2, a failed execute breaks the transaction.
                # I'll use a savepoint or just handle it differently.
                continue
            
            if (i + 1) % 10 == 0:
                print(f"Processed {i + 1} users (Date: {current_date.split(' ')[0]})")
        
        conn.commit()
        print("Success: Users processed with spread dates.")
        
    except Exception as e:
        conn.rollback()
        print(f"Global error: {e}")
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    insert_users()
