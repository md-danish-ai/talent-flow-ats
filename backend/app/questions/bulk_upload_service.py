# app/questions/bulk_upload_service.py

import pandas as pd
import io
import zipfile
import os
from uuid import uuid4
from fastapi import UploadFile, HTTPException
from app.core.config import settings
from app.questions import repository as question_repo
from app.classifications import repository as classification_repo
from app.database.db import SessionLocal
from app.questions.models import Question
from app.answer.models import QuestionAnswer
from app.utils.status_codes import StatusCode

class BulkUploadService:
    def __init__(self):
        self.upload_dir = settings.UPLOAD_DIR
        os.makedirs(self.upload_dir, exist_ok=True)

    def _validate_code(self, code, type_):
        if not code:
            return None
        record = classification_repo.get_by_code_and_type(str(code).strip().upper(), type_)
        return record

    async def process_bulk_upload(
        self, 
        file: UploadFile, 
        zip_file: UploadFile = None, 
        default_subject: str = None, 
        default_level: str = None, 
        default_marks: int = 0,
        question_type: str = "mcq",
        user_id: int = None
    ):
        errors = []
        df = None
        images_map = {}

        # 1. Pre-fetch Classifications for High Performance (Avoid N+1 queries)
        try:
            # Fetch all active classifications once (repo handles its own session)
            all_classifications_data, _ = classification_repo.get_all(limit=1000)
            
            # Create fast lookup maps {code.upper(): dict_record}
            subjects_map = {c['code'].upper(): c for c in all_classifications_data if c['type'] == 'subject' and c['is_active']}
            levels_map = {c['code'].upper(): c for c in all_classifications_data if c['type'] == 'exam_level' and c['is_active']}
            qtypes_map = {c['code'].upper(): c for c in all_classifications_data if c['type'] == 'question_type' and c['is_active']}
            
            # Map common internal names to official codes if needed
            internal_mapping = {'mcq': 'MULTIPLE_CHOICE', 'subjective': 'SUBJECTIVE'}
            q_type_key = internal_mapping.get(question_type.lower(), question_type).upper()
            official_question_type = q_type_key if q_type_key in qtypes_map else 'MULTIPLE_CHOICE'

        except Exception as e:
            raise HTTPException(status_code=StatusCode.INTERNAL_SERVER_ERROR, detail=f"Failed to fetch classifications: {str(e)}")

        # 2. Parse Data File (Excel or CSV)
        filename = file.filename.lower()
        try:
            content = await file.read()
            if filename.endswith(('.xlsx', '.xls')):
                df = pd.read_excel(io.BytesIO(content))
            elif filename.endswith('.csv'):
                df = pd.read_csv(io.BytesIO(content))
            else:
                raise HTTPException(status_code=StatusCode.BAD_REQUEST, detail="Data file must be Excel or CSV")
            
            # 3. Parse ZIP File (Optional, for images)
            if zip_file:
                zip_content = await zip_file.read()
                with zipfile.ZipFile(io.BytesIO(zip_content)) as z:
                    for name in z.namelist():
                        # Extract images from 'images/' folder or root of ZIP
                        if not name.endswith('/'):
                            image_data = z.read(name)
                            # Handle both 'images/file.jpg' and 'file.jpg'
                            short_name = os.path.basename(name)
                            images_map[short_name] = image_data
        
        except Exception as e:
            if isinstance(e, HTTPException): raise e
            raise HTTPException(status_code=StatusCode.BAD_REQUEST, detail=f"Error parsing files: {str(e)}")

        if df is None or df.empty:
            raise HTTPException(status_code=StatusCode.BAD_REQUEST, detail="Excel file is empty")

        # 2. Prepare for Validation
        # Clean column names (strip whitespace and lower case for matching if needed, but we'll use specific mapping)
        cols = {str(c).strip().lower(): c for c in df.columns}
        
        # Mapping helpers
        def get_val(row, *aliases):
            for a in aliases:
                a_lower = a.lower()
                if a_lower in cols:
                    val = row[cols[a_lower]]
                    if pd.notna(val): return val
            return None

        questions_to_create = []
        
        # Map internal frontend types to official classification codes
        TYPE_MAPPING = {
            'mcq': 'MULTIPLE_CHOICE',
            'image_mcq': 'IMAGE_MULTIPLE_CHOICE',
            'subjective': 'SUBJECTIVE',
            'image_subjective': 'IMAGE_SUBJECTIVE'
        }
        
        # Normalize question_type (already handled above but ensuring logic consistency)
        # official_question_type is defined at the start now

        # 3. Validation Loop
        for index, row in df.iterrows():
            row_num = index + 2  # Excel row number
            row_errors = []

            # Metadata Override
            sub_code = get_val(row, 'Subject Code', 'subject_code') or default_subject
            lvl_code = get_val(row, 'Exam Level Code', 'exam_level_code', 'Level Code') or default_level
            marks = get_val(row, 'Marks', 'marks') or default_marks
            q_text = get_val(row, 'Question Text', 'question_text', 'Question')
            q_image_name = get_val(row, 'Question Image', 'question_image')
            
            # Validate Text
            if not q_text and not q_image_name:
                row_errors.append("Question Text or Question Image is required")

            # Validate Codes (Using Optimized Memory Maps)
            sub_key = str(sub_code).strip().upper() if sub_code else None
            lvl_key = str(lvl_code).strip().upper() if lvl_code else None
            
            sub_record = subjects_map.get(sub_key)
            if not sub_record:
                row_errors.append(f"Invalid Subject Code: '{sub_code}'")
            
            lvl_record = levels_map.get(lvl_key)
            if not lvl_record:
                row_errors.append(f"Invalid Level Code: '{lvl_code}'")

            # Validate Images existence in ZIP
            processed_q_image_url = None
            if q_image_name:
                if q_image_name not in images_map:
                    row_errors.append(f"Image '{q_image_name}' not found in ZIP images folder")
                else:
                    processed_q_image_url = q_image_name # Placeholder for now

            # Type Specific Logic
            options_json = []
            ans_text = ""
            ans_explanation = get_val(row, 'Model Answer', 'explanation', 'Explanation') or ""

            if official_question_type in ['MULTIPLE_CHOICE', 'IMAGE_MULTIPLE_CHOICE']:
                correct_opt_idx = get_val(row, 'Correct Option', 'correct_option_number', 'Answer')
                try:
                    val_str = str(correct_opt_idx).strip().lower() if correct_opt_idx is not None else ""
                    if not val_str or val_str in ['null', 'undefined', 'none', 'nan']:
                        row_errors.append("Correct Option is required for MCQ")
                        correct_opt_idx = -1
                    else:
                        correct_opt_idx = int(float(correct_opt_idx))
                        if correct_opt_idx <= 0:
                            row_errors.append(f"Correct Option number '{correct_opt_idx}' is invalid. It must be 1, 2, 3...")
                            correct_opt_idx = -1
                except Exception:
                    row_errors.append(f"Invalid Correct Option: '{correct_opt_idx}'. Must be a number (1, 2, 3...)")
                    correct_opt_idx = -1

                # Collect Options (1 to 10)
                found_options = 0
                for i in range(1, 11):
                    opt_text = get_val(row, f'Option {i} Text', f'Option {i}')
                    opt_img_name = get_val(row, f'Option {i} Image')
                    
                    if opt_text or opt_img_name:
                        found_options += 1
                        is_correct = (found_options == correct_opt_idx)
                        
                        opt_img_url = None
                        if opt_img_name:
                            if opt_img_name not in images_map:
                                row_errors.append(f"Option {i} Image '{opt_img_name}' not found in ZIP")
                            else:
                                opt_img_url = opt_img_name # Placeholder
                        
                        options_json.append({
                            "option_label": chr(64 + found_options), # A, B, C...
                            "option_text": str(opt_text or ""),
                            "is_correct": is_correct,
                            "image_url": opt_img_url
                        })
                        
                        if is_correct:
                            ans_text = chr(64 + found_options)

                if found_options < 2:
                    row_errors.append("At least 2 options are required for MCQ")
                
                # Only check range if we haven't already flagged it as missing/invalid (-1)
                if correct_opt_idx != -1:
                    if correct_opt_idx > found_options or correct_opt_idx < 1:
                        row_errors.append(f"Correct Option number '{correct_opt_idx}' is out of range (Total options found: {found_options})")
            
            elif official_question_type in ['SUBJECTIVE', 'IMAGE_SUBJECTIVE']:
                # For subjective, we don't need options or correct option index
                # The answer explanation (Model Answer) is already collected in ans_explanation
                ans_text = "" # Not used for subjective

            # Collect all errors for this row
            if row_errors:
                errors.append({"row": row_num, "errors": row_errors})
            else:
                # Prepare data for insertion (if no errors in whole file)
                questions_to_create.append({
                    "data": {
                        "question_type": official_question_type,
                        "subject_type": sub_record['code'] if sub_record else sub_code,
                        "exam_level": lvl_record['code'] if lvl_record else lvl_code,
                        "question_text": str(q_text or ""),
                        "image_url_name": q_image_name, # Temp
                        "marks": int(marks) if marks else 0,
                        "options": options_json,
                        "answer": {
                            "answer_text": ans_text,
                            "explanation": str(ans_explanation or "")
                        }
                    },
                    "images_to_upload": {
                        "q_image": q_image_name,
                        "opt_images": {idx: opt['image_url'] for idx, opt in enumerate(options_json) if opt['image_url']}
                    }
                })

        # 4. Final Decision
        if errors:
            return {"success": False, "errors": errors}

        # 5. Execute Insertion (Transaction)
        db = SessionLocal()
        try:
            for item in questions_to_create:
                q_data = item['data']
                img_info = item['images_to_upload']

                # Actual Image Uploads
                if img_info['q_image']:
                    q_data['image_url'] = self._save_bytes_image(img_info['q_image'], images_map[img_info['q_image']])
                else:
                    q_data['image_url'] = None

                for idx, img_name in img_info['opt_images'].items():
                    q_data['options'][idx]['image_url'] = self._save_bytes_image(img_name, images_map[img_name])

                # DB Insert
                new_q = Question(
                    question_type=q_data['question_type'],
                    subject_type=q_data['subject_type'],
                    exam_level=q_data['exam_level'],
                    question_text=q_data['question_text'],
                    image_url=q_data['image_url'],
                    marks=q_data['marks'],
                    options=q_data['options'],
                    created_by=user_id
                )
                db.add(new_q)
                db.flush()

                new_ans = QuestionAnswer(
                    question_id=new_q.id,
                    answer_text=q_data['answer']['answer_text'],
                    explanation=q_data['answer']['explanation'],
                    created_by=user_id
                )
                db.add(new_ans)

            db.commit()
            return {"success": True, "count": len(questions_to_create)}
        
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=StatusCode.INTERNAL_SERVER_ERROR, detail=f"Database error during bulk upload: {str(e)}")
        finally:
            db.close()

    def _save_bytes_image(self, original_name: str, data: bytes) -> str:
        clean_name = original_name.replace(" ", "_").replace("-", "_")
        filename = f"{uuid4().hex}_{clean_name}"
        file_path = os.path.join(self.upload_dir, filename)
        with open(file_path, "wb") as f:
            f.write(data)
        return f"/images/{filename}"
