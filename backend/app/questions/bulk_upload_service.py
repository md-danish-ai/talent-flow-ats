# app/questions/bulk_upload_service.py

import os
import io
import pandas as pd
import asyncio
import zipfile
from typing import List, Dict, Optional, Tuple
from uuid import uuid4
from fastapi import UploadFile, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field, field_validator, ValidationError, ConfigDict

from app.core.config import settings
from app.utils.status_codes import StatusCode
from app.questions.models import Question
from app.answer.models import QuestionAnswer
from app.classifications.models import Classification
from app.database.db import SessionLocal
from .constants import QuestionType

# --- Pydantic Models for Strict Validation ---

class BaseRowSchema(BaseModel):
    subject_code: str = Field(alias="Subject Code")
    exam_level_code: str = Field(alias="Exam Level Code")
    marks: int = Field(default=5, alias="Marks")
    question_text: Optional[str] = Field(None, alias="Question Text")
    question_image: Optional[str] = Field(None, alias="Question Image")

    model_config = ConfigDict(populate_by_name=True, extra="allow")

    @field_validator('question_text', 'question_image', mode='before')
    @classmethod
    def coerce_to_str_or_none(cls, v):
        if pd.isna(v) or v == "" or v is None:
            return None
        return str(v)

    @field_validator('marks', mode='before')
    @classmethod
    def parse_marks(cls, v):
        try:
            if v is None or pd.isna(v):
                return 5
            return int(float(v))
        except Exception:
            return 5

class MCQRowSchema(BaseRowSchema):
    correct_option: int = Field(alias="Correct Option")

class TypingRowSchema(BaseRowSchema):
    title: str = Field(alias="Title")
    paragraph: str = Field(alias="Paragraph")

class LeadGenRowSchema(BaseRowSchema):
    instructions: str = Field(alias="Instructions")

class ContactRowSchema(BaseRowSchema):
    website_url: str = Field(alias="Website URL")

# --- Optimized Service ---

class BulkUploadService:
    # --- Unified Configuration Registry ---
    # Maps official QuestionType to its Pydantic Schema and common aliases
    QUESTION_CONFIG = {
        QuestionType.MULTIPLE_CHOICE: {
            "schema": MCQRowSchema,
            "aliases": ["mcq", "multiple choice"]
        },
        QuestionType.IMAGE_MULTIPLE_CHOICE: {
            "schema": MCQRowSchema,
            "aliases": ["image_mcq", "image mcq"]
        },
        QuestionType.SUBJECTIVE: {
            "schema": BaseRowSchema,
            "aliases": ["subjective"]
        },
        QuestionType.IMAGE_SUBJECTIVE: {
            "schema": BaseRowSchema,
            "aliases": ["image_subjective", "image subjective"]
        },
        QuestionType.PASSAGE_CONTENT: {
            "schema": BaseRowSchema,
            "aliases": ["passage"]
        },
        QuestionType.TYPING_TEST: {
            "schema": TypingRowSchema,
            "aliases": ["typing", "typing test"]
        },
        QuestionType.LEAD_GENERATION: {
            "schema": LeadGenRowSchema,
            "aliases": ["lead_generation", "lead generation"]
        },
        QuestionType.CONTACT_DETAILS: {
            "schema": ContactRowSchema,
            "aliases": ["contact_details", "contact details"]
        }
    }

    def __init__(self):
        self.upload_dir = os.path.join(settings.MEDIA_ROOT, "questions")
        os.makedirs(self.upload_dir, exist_ok=True)

    async def process_bulk_upload(
        self,
        file: UploadFile,
        question_type: str,
        user_id: int,
        zip_file: Optional[UploadFile] = None,
        default_subject: Optional[str] = None,
        default_level: Optional[str] = None,
        default_marks: Optional[int] = None
    ):
        # 1. Load Data with Pandas
        try:
            contents = await file.read()
            df = pd.read_excel(io.BytesIO(contents))
            # Convert NaN to None for clean processing
            df = df.where(pd.notnull(df), None)
            rows = df.to_dict('records')
        except Exception as e:
            raise HTTPException(status_code=StatusCode.BAD_REQUEST, detail=f"Invalid Excel format: {str(e)}")

        # 2. Parallel Image Processing if ZIP provided
        images_map = {}
        if zip_file:
            images_map = await self._process_zip_images(zip_file)

        # 3. Setup Metadata for Validation
        db = SessionLocal()
        try:
            subjects_map, levels_map = self._get_metadata_cache(db)
            
            # 3. Resolve Official Question Type
            official_type = self._resolve_type(question_type)
            
            if not official_type:
                available = [q.value for q in self.QUESTION_CONFIG.keys()]
                raise HTTPException(
                    status_code=StatusCode.BAD_REQUEST, 
                    detail=f"Invalid question type: {question_type}. Available official types: {available}"
                )

            prepared_data = []
            errors = []

            # 4. Modular Parsing & Validation
            for idx, row in enumerate(rows):
                row_num = idx + 2
                
                # Apply defaults if missing in row
                if not row.get("Subject Code") and default_subject:
                    row["Subject Code"] = default_subject
                if not row.get("Exam Level Code") and default_level:
                    row["Exam Level Code"] = default_level
                if (not row.get("Marks") or pd.isna(row.get("Marks"))) and default_marks is not None:
                    row["Marks"] = default_marks

                try:
                    parsed_item = self._parse_and_validate(row, official_type, subjects_map, levels_map, images_map)
                    prepared_data.append(parsed_item)
                except (ValidationError, ValueError) as e:
                    error_msgs = []
                    if isinstance(e, ValidationError):
                        error_msgs = [f"{err['loc'][-1]}: {err['msg']}" for err in e.errors()]
                    else:
                        error_msgs = [str(e)]
                    errors.append({"row": row_num, "errors": error_msgs})

            if errors:
                return {"success": False, "errors": errors}

            # 5. Optimized Bulk DB Insert
            return await self._execute_bulk_insert(db, prepared_data, user_id)

        except Exception as e:
            db.rollback()
            if isinstance(e, HTTPException):
                raise e
            raise HTTPException(status_code=StatusCode.INTERNAL_SERVER_ERROR, detail=str(e))
        finally:
            db.close()

    def _resolve_type(self, q_type_str: str) -> Optional[QuestionType]:
        """Resolves an incoming string (alias or official code) to a QuestionType Enum"""
        if not q_type_str:
            return None
            
        clean_type = q_type_str.strip().lower()
        
        for q_type, config in self.QUESTION_CONFIG.items():
            # Check official value (e.g., "MULTIPLE_CHOICE")
            if clean_type == q_type.value.lower():
                return q_type
            # Check aliases (e.g., "mcq")
            if clean_type in config.get("aliases", []):
                return q_type
        
        return None

    def _parse_and_validate(self, row: Dict, q_type: QuestionType, subjects_map: Dict, levels_map: Dict, images_map: Dict) -> Dict:
        """Modular parser using Pydantic for validation and business logic for mapping"""
        
        # Determine Schema from Registry
        config = self.QUESTION_CONFIG.get(q_type)
        if not config:
            raise ValueError(f"No configuration found for question type: {q_type}")
            
        Schema = config.get("schema", BaseRowSchema)
        
        # 1. Pydantic Basic Validation
        try:
            validated_row = Schema(**row)
        except ValidationError as e:
            raise e
        
        # 2. Metadata Check
        sub_code = str(validated_row.subject_code).strip().upper()
        lvl_code = str(validated_row.exam_level_code).strip().upper()
        
        sub = subjects_map.get(sub_code)
        lvl = levels_map.get(lvl_code)
        
        if not sub:
            raise ValueError(f"Invalid Subject Code: {sub_code}")
        if not lvl:
            raise ValueError(f"Invalid Level Code: {lvl_code}")

        # 3. Image URL mapping
        q_image_url = None
        if validated_row.question_image:
            if validated_row.question_image not in images_map:
                raise ValueError(f"Image {validated_row.question_image} missing in ZIP")
            q_image_url = images_map[validated_row.question_image]

        # 4. Type Specific Logic
        options = []
        ans_text = ""
        ans_explanation = row.get('Answer Explanation', row.get('Model Answer', row.get('Explanation', "")))
        passage = None

        if q_type in [QuestionType.MULTIPLE_CHOICE, QuestionType.IMAGE_MULTIPLE_CHOICE]:
            correct_idx = getattr(validated_row, 'correct_option', None)
            
            # Extract options dynamically (up to 10)
            for i in range(1, 11):
                opt_text = row.get(f'Option {i}')
                opt_img = row.get(f'Option {i} Image')
                if opt_text or opt_img:
                    img_url = images_map.get(opt_img) if opt_img else None
                    is_correct = (i == correct_idx)
                    options.append({
                        "option_label": chr(64 + len(options) + 1),
                        "option_text": str(opt_text or ""), 
                        "image_url": img_url, 
                        "is_correct": is_correct
                    })
                    if is_correct:
                        ans_text = chr(64 + len(options))
            
            if not options:
                raise ValueError("At least one option is required")
            if correct_idx and correct_idx > len(options):
                raise ValueError(f"Correct Option {correct_idx} is out of range")

        elif q_type in [QuestionType.SUBJECTIVE, QuestionType.IMAGE_SUBJECTIVE, QuestionType.PASSAGE_CONTENT]:
            # Subjective questions use 'Model Answer' or 'Answer' column
            ans_text = row.get('Model Answer', row.get('Answer', ""))
            options = []

        elif q_type == QuestionType.TYPING_TEST:
            passage = getattr(validated_row, 'paragraph', None)
            options = []

        elif q_type == QuestionType.LEAD_GENERATION:
            options = {k: row.get(v) for k, v in {
                "company_name": "Company Name", "website": "Website", "contact_name": "Contact Person",
                "designation": "Designation", "email": "Email", "linkedin_url": "LinkedIn URL",
                "phone": "Phone", "address": "Location"
            }.items()}

        elif q_type == QuestionType.CONTACT_DETAILS:
            options = {k: row.get(v) for k, v in {
                "websiteUrl": "Website URL", "companyName": "Organization", "streetAddress": "Street Address",
                "city": "City", "state": "State", "zipCode": "Zip Code",
                "companyPhoneNumber": "Phone", "generalEmail": "Email", "facebookPage": "Facebook Page"
            }.items()}

        # 5. Final Package
        q_text = validated_row.question_text
        if not q_text:
            # Fallback for special types
            q_text = row.get('Title') or row.get('Instructions') or row.get('Website URL') or ""

        return {
            "question": {
                "question_type": q_type.value,
                "subject_type": sub['code'],
                "exam_level": lvl['code'],
                "question_text": str(q_text),
                "image_url": q_image_url,
                "marks": validated_row.marks,
                "options": options,
                "passage": passage
            },
            "answer": {
                "answer_text": str(ans_text or ""),
                "explanation": str(ans_explanation or "")
            }
        }

    async def _execute_bulk_insert(self, db: Session, data_list: List[Dict], user_id: int):
        """High-performance bulk insert using return_defaults for IDs"""
        questions = [Question(**item['question'], created_by=user_id) for item in data_list]
        
        # Step 1: Bulk Save Questions (returns IDs in objects)
        db.bulk_save_objects(questions, return_defaults=True)
        db.flush()

        # Step 2: Bulk Save Answers linked to Question IDs
        answers = []
        for i, q in enumerate(questions):
            ans_data = data_list[i]['answer']
            answers.append(QuestionAnswer(
                question_id=q.id,
                answer_text=ans_data['answer_text'],
                explanation=ans_data['explanation'],
                created_by=user_id
            ))
        
        db.bulk_save_objects(answers)
        db.commit()
        
        return {"success": True, "count": len(questions)}

    async def _process_zip_images(self, image_zip: UploadFile) -> Dict[str, str]:
        """Parallelized image saving from ZIP"""
        images_map = {}
        try:
            zip_contents = await image_zip.read()
            with zipfile.ZipFile(io.BytesIO(zip_contents)) as z:
                # Filter out directories and metadata
                image_files = [f for f in z.namelist() if not f.startswith('__MACOSX/') and not f.endswith('/')]
                
                # Create saving tasks for parallel execution
                tasks = []
                for img_path in image_files:
                    filename = os.path.basename(img_path)
                    if filename:
                        tasks.append(self._async_save_image(filename, z.read(img_path)))
                
                # Execute all tasks in parallel
                results = await asyncio.gather(*tasks)
                for orig_name, saved_url in results:
                    images_map[orig_name] = saved_url
                    
        except Exception as e:
            print(f"ZIP Error: {e}")
        return images_map

    async def _async_save_image(self, original_name: str, data: bytes) -> Tuple[str, str]:
        """Wrapper to run blocking I/O in a thread pool"""
        return await asyncio.to_thread(self._save_bytes_image, original_name, data)

    def _save_bytes_image(self, original_name: str, data: bytes) -> Tuple[str, str]:
        clean_name = original_name.replace(" ", "_").replace("-", "_")
        filename = f"{uuid4().hex}_{clean_name}"
        file_path = os.path.join(self.upload_dir, filename)
        with open(file_path, "wb") as f:
            f.write(data)
        return original_name, f"/images/questions/{filename}"

    def _get_metadata_cache(self, db: Session) -> Tuple[Dict, Dict]:
        """Optimized metadata fetching"""
        subjects = db.query(Classification.code, Classification.name).filter(Classification.type == 'subject').all()
        levels = db.query(Classification.code, Classification.name).filter(Classification.type == 'exam_level').all()
        
        sub_map = {s.code.upper(): {"code": s.code} for s in subjects}
        lvl_map = {lvl.code.upper(): {"code": lvl.code} for lvl in levels}
        
        return sub_map, lvl_map
