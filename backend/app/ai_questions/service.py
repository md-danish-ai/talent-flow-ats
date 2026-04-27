import re
from typing import List, Optional
from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select, func
from difflib import SequenceMatcher

from .schemas import AIQuestionRequest
from .utils import AIClient
from app.questions.models import Question
from app.classifications.models import Classification
from app.answer.models import QuestionAnswer


class AIQuestionService:
    def __init__(self, db: Session):
        self.db = db
        self.ai_client = AIClient()

    async def generate_questions(self, request: AIQuestionRequest, user_id: int) -> List[Question]:
        # 1. Fetch Classifications
        q_type = self.db.get(Classification, int(request.question_type.get("id")))
        s_type = self.db.get(Classification, int(request.subject_type.get("id")))
        e_level = self.db.get(Classification, int(request.exam_level.get("id")))

        if not q_type or not s_type or not e_level:
            error_msg = "Missing classification metadata. Ensure the database is seeded."
            raise HTTPException(status_code=400, detail=error_msg)

        # 2. Build Combined Instructions from 'description' metadata
        instructions = []
        for obj in [q_type, s_type, e_level]:
            meta = obj.extra_metadata or {}
            desc = meta.get("description")
            if desc:
                instructions.append(f"- {obj.name}: {desc}")
        
        # Include User's Additional Context
        if request.additional_context:
            instructions.append(f"- User Requirement: {request.additional_context}")
        
        combined_instructions = "\n".join(instructions)

        # 3. Build Prompt using Names (Labels) and merged instructions
        prompt = self.ai_client.build_prompt(
            q_type.name,
            s_type.name,
            e_level.name,
            request.number_of_questions,
            combined_instructions,
        )
        print(f"DEBUG: Generated Prompt: {prompt[:500]}...")

        # 4. Call AI once for all questions
        parsed_questions = self.ai_client.generate(prompt)
        if not parsed_questions or not isinstance(parsed_questions, list):
            print(f"ERROR: AI Client returned empty or invalid response: {parsed_questions}")
            return []

        print(f"DEBUG: AI generated {len(parsed_questions)} questions.")

        generated_questions = []
        seen_in_batch = set() # Track duplicates within the current AI response

        # 5. Process each generated question
        for parsed_data in parsed_questions:
            # 6. Duplicate Detection (DB + Current Batch)
            text_to_check = parsed_data.get("question_text", "")
            passage_to_check = parsed_data.get("passage", "")
            
            # Check against what we just saw in this batch
            batch_key = self._normalize_text(text_to_check + (passage_to_check or ""))
            if batch_key in seen_in_batch:
                print("Skipping: Duplicate found within current AI response batch.")
                continue
                
            if self._is_duplicate(text_to_check, passage_to_check):
                print(f"Skipping: Duplicate question detected in DB: {text_to_check[:100]}...")
                continue
            
            seen_in_batch.add(batch_key)

            # 7. Transform Options to Manual List Format
            # Manual repository format: [{"option_label": "A", "option_text": "...", "is_correct": bool}, ...]
            raw_options = parsed_data.get("options", {})
            correct_ans_key = parsed_data.get("correct_answer") # e.g., "A"
            
            formatted_options = []
            if isinstance(raw_options, dict):
                for label, text in raw_options.items():
                    formatted_options.append({
                        "option_label": label,
                        "option_text": text,
                        "is_correct": str(label).strip().upper() == str(correct_ans_key).strip().upper()
                    })
            elif isinstance(raw_options, list):
                # Fallback if AI returns a list
                formatted_options = raw_options

            # 8. Handle Image Generation for Image-based types
            image_url = None
            image_prompt = parsed_data.get("image_prompt")
            if image_prompt and "image" in q_type.code.lower():
                image_url = self.ai_client.generate_image(image_prompt)

            # 9. Save Question using standard codes (Matches manual repository)
            new_question = Question(
                question_type=q_type.code,
                subject_type=s_type.code,
                exam_level=e_level.code,
                question_text=parsed_data.get("question_text"),
                image_url=image_url,
                passage=parsed_data.get("passage"),
                options=formatted_options,
                marks=request.marks,
                created_by=user_id,
            )
            self.db.add(new_question)
            self.db.flush() # Ensure we have an ID for the answer table

            # 9. Save Answer to 'question_answers' table
            answer_text = ""
            if isinstance(raw_options, dict):
                answer_text = raw_options.get(correct_ans_key, str(correct_ans_key))
            else:
                answer_text = str(correct_ans_key)

            new_answer = QuestionAnswer(
                question_id=new_question.id,
                answer_text=answer_text,
                explanation=parsed_data.get("explanation"),
                created_by=user_id,
            )
            self.db.add(new_answer)
            generated_questions.append(new_question)

        self.db.commit()
        for q in generated_questions:
            self.db.refresh(q)

        return generated_questions


    def _is_duplicate(self, text: str, passage: Optional[str] = None, threshold: float = 0.85) -> bool:
        if not text and not passage:
            return False
            
        normalized_new = self._normalize_text(text)
        normalized_passage = self._normalize_text(passage) if passage else ""

        # 1. Exact match check for question text
        stmt = select(Question).where(func.lower(Question.question_text) == normalized_new.lower())
        if passage:
            # If there's a passage, it must also match for it to be a true duplicate
            # (Allows same instruction for different paragraphs in Typing Tests)
            stmt = stmt.where(func.lower(Question.passage) == normalized_passage.lower())
        
        if self.db.execute(stmt).first():
            return True

        # 2. Fuzzy match against recent questions (limit for performance)
        stmt = select(Question).order_by(Question.created_at.desc()).limit(100)
        existing_questions = self.db.execute(stmt).scalars().all()

        for q in existing_questions:
            # If we have a passage, check passage similarity with a stricter threshold (0.95)
            # because paragraphs are long and can have similar vocabulary without being duplicates.
            if passage and q.passage:
                sim = SequenceMatcher(None, normalized_passage, self._normalize_text(q.passage)).ratio()
                if sim > 0.95: # Stricter for passages
                    return True
            else:
                # Standard question text similarity
                sim = SequenceMatcher(None, normalized_new, self._normalize_text(q.question_text)).ratio()
                if sim > threshold:
                    return True

        return False

    def _normalize_text(self, text: str) -> str:
        if not text:
            return ""
        # Lowercase and remove non-alphanumeric chars
        return re.sub(r"[^a-zA-Z0-9]", "", text).lower()
