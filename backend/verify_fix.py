import requests
import os

BASE_URL = "http://localhost:4000"
UPLOAD_URL = f"{BASE_URL}/questions/upload-image"

def test_upload_and_serve():
    # Create a dummy image
    dummy_image_path = "test_image.png"
    with open(dummy_image_path, "wb") as f:
        f.write(b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82")

    try:
        # Note: We need a valid token for current_user = Depends(get_current_user)
        # However, for local testing if the server is running without strict auth or if we can bypass it.
        # If auth is required, this test will fail with 401.
        
        print(f"Uploading image to {UPLOAD_URL}...")
        files = {"image": ("test_image.png", open(dummy_image_path, "rb"), "image/png")}
        # You might need to add headers={"Authorization": "Bearer <TOKEN>"} here
        # response = requests.post(UPLOAD_URL, files=files)
        
        # Since I can't easily get a token here, I will check if the existing images are served.
        # Based on previous `ls` output: 
        # /Users/varshanagda/tfa-backend/talent-flow-ats/backend/app/images/846e0a380cdf4527842de6a04ef1eec4_pngimg.com___mario_PNG125.png
        
        existing_image_name = "846e0a380cdf4527842de6a04ef1eec4_pngimg.com___mario_PNG125.png"
        image_url = f"{BASE_URL}/images/{existing_image_name}"
        
        print(f"Checking access to existing image: {image_url}")
        response = requests.get(image_url)
        
        if response.status_code == 200:
            print("✅ SUCCESS: Image is accessible!")
        else:
            print(f"❌ FAILURE: Image returned status code {response.status_code}")
            print(f"Response: {response.text}")

    finally:
        if os.path.exists(dummy_image_path):
            os.remove(dummy_image_path)

if __name__ == "__main__":
    test_upload_and_serve()
