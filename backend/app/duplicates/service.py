import difflib
from sqlalchemy.orm import Session
from app.duplicates.models import DuplicateUserMatch, AdminNotification
from app.user_details.schemas import UserDetailsSchema
from app.user_details.models import UserDetail
from app.users.models import User
from app.duplicates import repository
from app.utils.pagination import create_paginated_response
from typing import Optional

def get_string_similarity(str1: str, str2: str) -> float:
    if not str1 and not str2:
        return 100.0
    if not str1 or not str2:
        return 0.0
    return difflib.SequenceMatcher(None, str(str1).lower().strip(), str(str2).lower().strip()).ratio() * 100

def get_family_member_name(family_details: list, relation: str) -> str:
    for member in family_details:
        rel = member.get("relation", "").lower()
        if rel == relation.lower() or member.get("relationLabel", "").lower() == relation.lower():
            return member.get("name", "")
    return ""

def detect_duplicates(db: Session, new_user_id: int, new_data: UserDetailsSchema):
    # Step 1: Blocking (Fetch users with same DOB)
    dob = new_data.personalDetails.dob
    if not dob:
        return
        
    new_user_rec = db.query(User).filter(User.id == new_user_id).first()
    new_created_at = new_user_rec.created_at.isoformat() if new_user_rec and new_user_rec.created_at else None

    # Fetch users with the same DOB
    candidates = db.query(UserDetail).filter(
        UserDetail.personal_details['dob'].astext == dob,
        UserDetail.user_id != new_user_id
    ).all()

    if not candidates:
        return

    best_match = None
    highest_score = 0.0

    new_first_name = new_data.personalDetails.firstName
    new_last_name = new_data.personalDetails.lastName
    
    # Extract Family
    new_father = get_family_member_name([m.model_dump() for m in new_data.familyDetails], "father")
    new_mother = get_family_member_name([m.model_dump() for m in new_data.familyDetails], "mother")

    for candidate in candidates:
        cand_personal = candidate.personal_details or {}
        cand_family = candidate.family_details or []
        
        cand_first_name = cand_personal.get("firstName", "")
        cand_last_name = cand_personal.get("lastName", "")
        
        cand_father = get_family_member_name(cand_family, "father")
        cand_mother = get_family_member_name(cand_family, "mother")
        
        cand_user_rec = db.query(User).filter(User.id == candidate.user_id).first()
        cand_created_at = cand_user_rec.created_at.isoformat() if cand_user_rec and cand_user_rec.created_at else None
        
        # Stage 2: Primary Identity Matching
        # Name: 40, DOB: 30, Father: 15, Mother: 15
        
        # We already know DOB matches perfectly from the query
        score_dob = 30.0
        
        new_full_name = f"{new_first_name} {new_last_name}".strip()
        cand_full_name = f"{cand_first_name} {cand_last_name}".strip()
        name_sim = get_string_similarity(new_full_name, cand_full_name)
        score_name = (name_sim / 100.0) * 40.0
        
        father_sim = get_string_similarity(new_father, cand_father)
        score_father = (father_sim / 100.0) * 15.0
        
        mother_sim = get_string_similarity(new_mother, cand_mother)
        score_mother = (mother_sim / 100.0) * 15.0
        
        primary_score = score_name + score_dob + score_father + score_mother
        
        if primary_score < 70:
            continue
            
        # Stage 3: Full Profile Matching
        fields_to_compare = []
        
        # Personal
        personal_fields = []
        personal_fields.append((new_data.personalDetails.presentAddressLine1, cand_personal.get("presentAddressLine1", "")))
        personal_fields.append((new_data.personalDetails.presentCity, cand_personal.get("presentCity", "")))
        personal_fields.append((new_data.personalDetails.presentState, cand_personal.get("presentState", "")))
        personal_fields.append((new_data.personalDetails.presentPincode, cand_personal.get("presentPincode", "")))
        
        personal_sim = sum([get_string_similarity(str(v1), str(v2)) for v1, v2 in personal_fields]) / len(personal_fields) if personal_fields else 0
        fields_to_compare.extend(personal_fields)
        
        # Education
        new_edu = [e.model_dump() for e in new_data.educationDetails]
        cand_edu = candidate.education_details or []
        new_edu_str = " ".join([f"{e.get('school', '')} {e.get('board', '')} {e.get('year', '')}" for e in new_edu])
        cand_edu_str = " ".join([f"{e.get('school', '')} {e.get('board', '')} {e.get('year', '')}" for e in cand_edu])
        
        edu_sim = get_string_similarity(new_edu_str, cand_edu_str)
        fields_to_compare.append((new_edu_str, cand_edu_str))
        
        # Work Exp
        new_work = [w.model_dump() for w in new_data.workExperienceDetails]
        cand_work = candidate.work_experience_details or []
        new_work_str = " ".join([f"{w.get('company', '')} {w.get('designation', '')} {w.get('joinDate', '')}" for w in new_work])
        cand_work_str = " ".join([f"{w.get('company', '')} {w.get('designation', '')} {w.get('joinDate', '')}" for w in cand_work])
        
        work_sim = get_string_similarity(new_work_str, cand_work_str)
        fields_to_compare.append((new_work_str, cand_work_str))
        
        # Calculate full profile sim
        total_sim = 0.0
        for val1, val2 in fields_to_compare:
            total_sim += get_string_similarity(str(val1), str(val2))
            
        full_profile_score = total_sim / len(fields_to_compare) if fields_to_compare else 0
        
        final_score = (primary_score * 0.6) + (full_profile_score * 0.4)
        
        if final_score > highest_score:
            highest_score = final_score
            best_match = {
                "candidate_user_id": candidate.user_id,
                "primary_score": primary_score,
                "final_score": final_score,
                "match_details": {
                    "new_user": {
                        "name": new_full_name,
                        "dob": dob,
                        "father": new_father,
                        "mother": new_mother,
                        "created_at": new_created_at,
                        "education": new_edu_str.strip()[:100] + ("..." if len(new_edu_str)>100 else ""),
                        "work": new_work_str.strip()[:100] + ("..." if len(new_work_str)>100 else ""),
                        "city": new_data.personalDetails.presentCity
                    },
                    "matched_user": {
                        "name": cand_full_name,
                        "dob": dob,
                        "father": cand_father,
                        "mother": cand_mother,
                        "created_at": cand_created_at,
                        "education": cand_edu_str.strip()[:100] + ("..." if len(cand_edu_str)>100 else ""),
                        "work": cand_work_str.strip()[:100] + ("..." if len(cand_work_str)>100 else ""),
                        "city": cand_personal.get("presentCity", "")
                    },
                    "scores": {
                        "name": name_sim,
                        "dob": 100.0,
                        "father": father_sim,
                        "mother": mother_sim,
                        "personal": personal_sim,
                        "education": edu_sim,
                        "work": work_sim
                    }
                }
            }
            
    if best_match and best_match["final_score"] >= 70:
        final_score = best_match["final_score"]
        status = "high" if final_score >= 85 else "possible"
        
        # Create records
        match_record = DuplicateUserMatch(
            new_user_id=new_user_id,
            matched_user_id=best_match["candidate_user_id"],
            primary_score=best_match["primary_score"],
            final_score=final_score,
            status=status,
            match_details=best_match["match_details"]
        )
        db.add(match_record)
        db.flush() # To get match_record.id
        
        new_name = best_match["match_details"]["new_user"]["name"]
        matched_name = best_match["match_details"]["matched_user"]["name"]

        notification = AdminNotification(
            type="duplicate_user",
            reference_id=match_record.id,
            title=f"Potential Duplicate: {new_name}",
            message=f"A new registration for '{new_name}' matches existing profile '{matched_name}' with a {final_score:.1f}% similarity score. Review required."
        )
        db.add(notification)
        db.commit()


class DuplicateService:
    def __init__(self, db: Session):
        self.db = db

    async def get_notifications(self, pagination, is_read: Optional[bool] = None):
        results, total_records = repository.get_notifications(
            self.db, 
            pagination, 
            is_read
        )
        
        unread_count, read_count = repository.get_counts(self.db)
        
        formatted_data = [
            {
                "id": n.id,
                "type": n.type,
                "reference_id": n.reference_id,
                "title": n.title,
                "message": n.message,
                "is_read": n.is_read,
                "created_at": n.created_at,
                "match_details": m.match_details if m else None,
                "final_score": m.final_score if m else None,
            }
            for n, m in results
        ]
        
        paginated_data = create_paginated_response(formatted_data, total_records, pagination)
        paginated_data["unread_count"] = unread_count
        paginated_data["read_count"] = read_count
        
        return paginated_data

    async def mark_read(self, notification_ids: list[int]):
        return repository.update_notification_status(self.db, notification_ids, True)

    async def mark_unread(self, notification_ids: list[int]):
        return repository.update_notification_status(self.db, notification_ids, False)
