import requests
import json
import re
from typing import Optional, Dict, Any
from app.core.config import settings

class AIClient:
    def __init__(self):
        # Using the new unified Hugging Face router (OpenAI-compatible)
        self.api_url = "https://router.huggingface.co/v1/chat/completions"
        token = getattr(settings, 'HF_TOKEN', None)
        self.headers = {"Content-Type": "application/json"}
        if token:
            self.headers["Authorization"] = f"Bearer {token}"

    def generate(self, prompt: str) -> Optional[str]:
        if not getattr(settings, 'HF_TOKEN', None):
            print("WARNING: HF_TOKEN is missing. AI generation might fail if the model is not public.")

        payload = {
            "model": "meta-llama/Llama-3.2-3B-Instruct",
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "max_tokens": 1000,
            "temperature": 0.7,
            "top_p": 0.9,
            "stream": False
        }
        
        try:
            print(f"Sending prompt to AI (Router API): {prompt[:100]}...")
            response = requests.post(self.api_url, headers=self.headers, json=payload, timeout=60)
            if response.status_code != 200:
                print(f"AI API Error: {response.status_code} - {response.text}")
                return None
                
            result = response.json()
            # Extract content from OpenAI format: result['choices'][0]['message']['content']
            if "choices" in result and len(result["choices"]) > 0:
                generated = result["choices"][0]["message"].get("content", "").strip()
                print(f"AI Response received: {generated[:100]}...")
                return generated
            
            print(f"AI API returned unexpected format: {result}")
            return None
        except Exception as e:
            print(f"AI Client Exception: {e}")
            return None

    def build_prompt(self, question_type: str, subject: str, level: str, metadata: Dict[str, Any]) -> str:
        base_prompt = f"Act as an expert recruitment manager for a BPO/Call Center. Generate a high-quality {level} difficulty {question_type} question about {subject}."
         
        constraints = []
        
        # 1. Handle MCQ Options
        if "mcq" in question_type.lower():
            count = metadata.get("option_count", 4)
            constraints.append(f"Provide exactly {count} distinct options (e.g., A to {'F' if count == 6 else 'E' if count == 5 else 'D'}).")
            
            if metadata.get("is_multi_select"):
                constraints.append("This is a multi-select question. Provide a list of all correct answer keys (e.g., ['A', 'C']).")
            else:
                constraints.append("This is a single-choice question. Provide exactly one correct answer key (e.g., 'B').")
        
        # 2. Handle Subjective/Passage/Image
        if "subjective" in question_type.lower():
            max_words = metadata.get("max_words", 200)
            constraints.append(f"This is an open-ended subjective question. The model answer should be around {max_words} words.")
        
        if "passage" in question_type.lower():
            constraints.append("Include a detailed reading passage or set of instructions before the question.")
            
        if "image" in question_type.lower():
            constraints.append("This question refers to an image. Provide a highly descriptive 'image_description' field that explains what should be in the image (e.g., 'A bar chart showing quarterly sales performance').")

        prompt = f"{base_prompt} {' '.join(constraints)}"
        prompt += "\nReturn the response strictly in the following JSON format:\n"
        prompt += "{\n"
        prompt += '  "question_text": "...",\n'
        prompt += '  "options": {"A": "...", "B": "..."}, \n'
        prompt += '  "correct_answer": "...", // String for single choice, or List for multi-select\n'
        prompt += '  "passage": "...", \n'
        prompt += '  "explanation": "...",\n'
        prompt += '  "image_description": "..." // Only if image-based\n'
        prompt += "}\n"
        prompt += "Ensure the output is valid JSON and contains NO other text or explanation outside the brackets."
        
        return prompt
