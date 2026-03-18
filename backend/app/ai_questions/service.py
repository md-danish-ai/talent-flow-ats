import json
import re
from typing import List, Optional
from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select, func
from difflib import SequenceMatcher

from .schemas import AIQuestionRequest, GeneratedQuestion
from .utils import AIClient
from app.questions.models import Question
from app.classifications.models import Classification

class AIQuestionService:
    def __init__(self, db: Session):
        self.db = db
        self.ai_client = AIClient()

    async def generate_questions(self, request: AIQuestionRequest, user_id: int) -> List[Question]:
        # 1. Fetch Classifications to get codes and metadata
        q_type = self.db.get(Classification, request.question_type_id)
        s_type = self.db.get(Classification, request.subject_type_id)
        e_level = self.db.get(Classification, request.exam_level_id)

        if not q_type or not s_type or not e_level:
            error_msg = f"Missing classification metadata. Found q_type={q_type}, s_type={s_type}, e_level={e_level}. Ensure the database is seeded."
            raise HTTPException(status_code=400, detail=error_msg)

        generated_questions = []
        
        for _ in range(request.number_of_questions):
            # 2. Build Prompt using dynamic metadata
            meta = q_type.extra_metadata or {}
            prompt = self.ai_client.build_prompt(
                q_type.code,
                s_type.code,
                e_level.code,
                meta
            )
            
            # 3. Call AI
            ai_response = self.ai_client.generate(prompt)
            if not ai_response:
                print("Skipping: AI Client returned empty response.")
                continue
                
            # 4. Parse AI Response
            parsed_data = self._parse_json_response(ai_response)
            if not parsed_data:
                print(f"Skipping: Failed to parse JSON from AI response: {ai_response[:200]}...")
                continue
                
            # 5. Duplicate Detection (Fuzzy Match)
            if self._is_duplicate(parsed_data["question_text"]):
                print(f"Skipping: Duplicate question detected: {parsed_data['question_text'][:100]}...")
                continue
            
            # 6. Prepare Metadata/Data
            # For image-based questions, we might store the AI's description in metadata or use it later
            # For now, we'll prefix the image_url if it's an image question type
            image_url = None
            if "image" in q_type.code.lower():
                image_url = "PENDING_IMAGE_GENERATION" # Placeholder or logic for image-gen
                
            # Handle multi-select vs single answer validation
            correct_ans = parsed_data.get("correct_answer")
            if meta.get("is_multi_select") and not isinstance(correct_ans, list):
                # Force to list if AI returned a single string for a multi-select
                correct_ans = [correct_ans] if correct_ans else []
                
            # Save to DB using string-based classification columns
            new_question = Question(
                question_type=q_type.name,
                subject_type=s_type.name,
                exam_level=e_level.name,
                question_text=parsed_data["question_text"],
                passage=parsed_data.get("passage"),
                options=parsed_data.get("options", []),
                marks=1,
                created_by=user_id
            )
            self.db.add(new_question)
            generated_questions.append(new_question)
            
        self.db.commit()
        for q in generated_questions:
            self.db.refresh(q)
            
        return generated_questions

    def _parse_json_response(self, text: str) -> Optional[dict]:
        try:
            # Look for JSON between curly braces
            # Match top-level JSON object (simple balanced brace matching simplified for Python re)
            # Find the first { and the last }
            start_idx = text.find('{')
            end_idx = text.rfind('}')
            
            if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
                json_str = text[start_idx:end_idx+1]
                # Remove any leading/trailing backticks or "json" labels if the AI included them
                json_str = re.sub(r'^```json\s*|^\s*```|```\s*$', '', json_str.strip(), flags=re.MULTILINE)
                return json.loads(json_str)
            
            print(f"No JSON object found in AI response: {text[:200]}...")
            return None
        except Exception as e:
            print(f"JSON Parse Error: {e}")
            return None

    def _is_duplicate(self, text: str, threshold: float = 0.85) -> bool:
        normalized_new = self._normalize_text(text)
        
        # Simple exact match check first
        stmt = select(Question).where(func.lower(Question.question_text) == normalized_new.lower())
        if self.db.execute(stmt).first():
            return True
            
        # Fuzzy match against recent questions (limit for performance)
        stmt = select(Question).order_by(Question.created_at.desc()).limit(100)
        existing_questions = self.db.execute(stmt).scalars().all()
        
        for q in existing_questions:
            similarity = SequenceMatcher(None, normalized_new, self._normalize_text(q.question_text)).ratio()
            if similarity > threshold:
                return True
                
        return False

    def _normalize_text(self, text: str) -> str:
        # Lowercase and remove non-alphanumeric chars
        return re.sub(r'[^a-zA-Z0-9]', '', text).lower()
