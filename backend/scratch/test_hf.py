import requests
import os
from dotenv import load_dotenv

load_dotenv()

token = os.getenv("HF_TOKEN")
model_id = "mistralai/Mistral-7B-Instruct-v0.3"
api_url = f"https://api-inference.huggingface.co/models/{model_id}"

headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json"
}

payload = {
    "inputs": "Hello, how are you?",
    "parameters": {"max_new_tokens": 10}
}

print(f"URL: {api_url}")
response = requests.post(api_url, headers=headers, json=payload)
print(f"Status Code: {response.status_code}")
print(f"Response: {response.text[:500]}")
