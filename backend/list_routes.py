
import os
import sys

# Add the project root to sys.path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from app.main import app

def list_routes():
    print(f"{'Method':<10} {'Path':<40} {'Name'}")
    print("-" * 70)
    for route in app.routes:
        methods = ", ".join(getattr(route, "methods", []))
        path = getattr(route, "path", "")
        name = getattr(route, "name", "")
        print(f"{methods:<10} {path:<40} {name}")

if __name__ == "__main__":
    list_routes()
