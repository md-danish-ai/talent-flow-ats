import json
import re
from typing import Optional, List, Dict, Any
from app.core.config import settings
from huggingface_hub import InferenceClient


class AIClient:
    def __init__(self):
        # Using a highly available model for serverless inference
        # Using a more capable model for multi-question generation
        self.model_id = "Qwen/Qwen2.5-7B-Instruct"
        token = getattr(settings, "HF_TOKEN", None)
        self.client = InferenceClient(token=token)

    def generate(self, prompt: str) -> Optional[List[Dict[str, Any]]]:
        try:
            print(f"Sending prompt to AI (via huggingface_hub SDK): {prompt[:100]}...")
            
            # Using chat_completion as it's more robustly supported across providers
            response = self.client.chat_completion(
                model=self.model_id,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=settings.AI_MAX_TOKENS,
                temperature=0.2,
            )
            
            text = response.choices[0].message.content
            print(f"DEBUG: AI Full Response Length: {len(text)}")
            print(f"DEBUG: AI Raw Response: {text}")

            parsed = self._extract_json(text)
            if parsed:
                print(f"Successfully parsed {len(parsed)} questions from AI response.")
                return parsed

            return None
        except Exception as e:
            print(f"AI Client SDK Error: {str(e)}")
            # Fallback to a simpler model if Llama fails
            if "not supported" in str(e).lower() or "404" in str(e) or "rate limit" in str(e).lower():
                return self._fallback_generate(prompt)
            return None

    def _fallback_generate(self, prompt: str) -> Optional[List[Dict[str, Any]]]:
        """Simple fallback using a different model if the primary one fails."""
        try:
            print("DEBUG: Using fallback model (mistralai/Mistral-7B-Instruct-v0.3)...")
            response = self.client.text_generation(
                prompt,
                model="mistralai/Mistral-7B-Instruct-v0.3",
                max_new_tokens=settings.AI_MAX_TOKENS,
            )
            return self._extract_json(response)
        except Exception as e:
            print(f"AI Client Fallback Exception: {e}")
            return None

    def generate_image(self, image_prompt: str) -> Optional[str]:
        """Generates an image from a prompt and returns the relative URL."""
        import uuid
        import os

        try:
            print(f"DEBUG: Generating image for prompt: {image_prompt[:100]}...")
            # Using FLUX.1-schnell for fast, high-quality generation
            image_data = self.client.text_to_image(
                image_prompt,
                model="black-forest-labs/FLUX.1-schnell"
            )

            if not image_data:
                return None

            # Create filename and save to upload directory
            filename = f"ai_{uuid.uuid4().hex}.png"
            filepath = os.path.join(settings.UPLOAD_DIR, filename)

            # Ensure directory exists
            os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

            # Save the image
            image_data.save(filepath)
            
            print(f"DEBUG: Image saved successfully to {filepath}")
            return f"/images/{filename}"
        except Exception as e:
            print(f"DEBUG: Image Generation Error: {e}")
            return None

    def _extract_json(self, text: str) -> Optional[List[Dict[str, Any]]]:
        try:
            # Look for JSON array [ ... ]
            match = re.search(r"\[[\s\S]*\]", text)
            if match:
                return json.loads(match.group(0))
        except Exception as e:
            print(f"JSON extract/parse error: {e}")
        return None

    def build_prompt(self, question_type: str, subject: str, level: str, count: int, combined_instructions: str) -> str:
        prompt = f"""You are an expert recruitment content creator. You return strictly valid JSON.

Generate exactly {count} questions for recruitment.
Target Topic: {subject}
Difficulty Level: {level}
Question Format: {question_type}

CONTEXT & GUIDELINES:
{combined_instructions}

IMPORTANT RULES:
- Return ONLY a JSON array.
- Do NOT include any introductory text, explanation, or markdown outside the array.
- Output must start with [ and end with ].
- Ensure valid JSON (double quotes only).
- Every question MUST have an 'explanation' field explaining why the answer is correct.
- UNIQUENESS: Every question and passage must be entirely unique and creative. Avoid repeating common facts or scenarios.
- VARIETY: Use a wide range of scenarios, technical details, and industry-specific situations.
"""
        
        # Adding dynamic constraints based on type
        constraints = []
        if "choice" in question_type.lower() or "mcq" in question_type.lower():
            constraints.append("- Each question must have exactly 4 options (A, B, C, D).")
            constraints.append("- Provide 'correct_answer' as a single key (e.g., 'B').")

        if "passage" in question_type.lower():
            constraints.append("- Include a detailed, professional reading passage for each question in the 'passage' field.")

        if "image" in question_type.lower():
            constraints.append("- This is an IMAGE-based question. You MUST provide a detailed 'image_prompt' field describing what the image should show (e.g., 'A professional diagram of a marketing funnel').")

        if "typing" in question_type.lower():
            constraints.append("- This is a TYPING TEST. You MUST provide the full paragraph to be typed in the 'passage' field (200-300 words).")
            constraints.append("- Set 'question_text' to 'Type the following paragraph as accurately and quickly as possible.'")
            constraints.append("- Leave 'options' as an empty object {}.")

        if "lead" in question_type.lower() or "contact" in question_type.lower():
            constraints.append("- This is a DATA COLLECTION task. Set 'question_text' to a professional company bio, a scenario, or a simulated URL (e.g., 'Extract details from: https://acme-industries.com/about').")
            constraints.append("- Leave 'options' as an empty object {}.")

        if constraints:
            prompt += "\nFORMAT CONSTRAINTS:\n" + "\n".join(constraints)

        prompt += """

Format Example:
[
  {
    "question_text": "string",
    "options": {
      "A": "string",
      "B": "string",
      "C": "string",
      "D": "string"
    },
    "correct_answer": "A",
    "passage": "string",
    "image_prompt": "string",
    "explanation": "string"
  }
]
"""
        return prompt
