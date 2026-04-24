from huggingface_hub import InferenceClient
import os
from dotenv import load_dotenv

load_dotenv()

token = os.getenv("HF_TOKEN")
client = InferenceClient(token=token)

try:
    print("Testing with Llama-3.2-1B-Instruct...")
    response = client.text_generation(
        "Generate a simple MCQ about science.",
        model="meta-llama/Llama-3.2-1B-Instruct",
        max_new_tokens=100
    )
    print(f"Success! Response: {response[:100]}...")
except Exception as e:
    print(f"Failed! Error: {e}")

try:
    print("\nTesting with Mistral-7B-Instruct-v0.3...")
    response = client.text_generation(
        "Generate a simple MCQ about science.",
        model="mistralai/Mistral-7B-Instruct-v0.3",
        max_new_tokens=100
    )
    print(f"Success! Response: {response[:100]}...")
except Exception as e:
    print(f"Failed! Error: {e}")
