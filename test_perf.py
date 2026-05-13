import requests
import time
import random

BASE_URL = "http://localhost:4000"

# 1. Create a random user to get a token
mobile = f"99999{random.randint(10000, 99999)}"
data = {
    "name": "Test User Perf",
    "mobile": mobile,
    "email": f"test_{mobile}@example.com",
    "department_id": 1,
    "test_level_id": 1
}

print("Signing up new user...")
resp = requests.post(f"{BASE_URL}/auth/sign-up-user", json=data)
if resp.status_code != 201:
    print("Signup failed:", resp.text)
    # try login
    resp = requests.post(f"{BASE_URL}/auth/sign-in-user", json={"mobile": mobile, "password": mobile})

if resp.status_code not in [200, 201]:
    print("Failed to get token")
    exit(1)

token = resp.json().get("data", {}).get("access_token")
headers = {"Authorization": f"Bearer {token}"}

# 2. First call (Cache Miss)
print("\n--- FIRST CALL (Cache Miss - Needs DB read & JSON build) ---")
start = time.time()
r1 = requests.get(f"{BASE_URL}/paper-assignments/get-my-assigned-paper", headers=headers)
end = time.time()
print(f"Status: {r1.status_code}")
print(f"Time Taken: {(end - start) * 1000:.2f} ms")

# 3. Second call (Cache Hit)
print("\n--- SECOND CALL (Cache Hit - Reading from Redis) ---")
start = time.time()
r2 = requests.get(f"{BASE_URL}/paper-assignments/get-my-assigned-paper", headers=headers)
end = time.time()
print(f"Status: {r2.status_code}")
print(f"Time Taken: {(end - start) * 1000:.2f} ms")

# 4. Third call (Cache Hit)
print("\n--- THIRD CALL (Cache Hit - Reading from Redis) ---")
start = time.time()
r3 = requests.get(f"{BASE_URL}/paper-assignments/get-my-assigned-paper", headers=headers)
end = time.time()
print(f"Status: {r3.status_code}")
print(f"Time Taken: {(end - start) * 1000:.2f} ms")

