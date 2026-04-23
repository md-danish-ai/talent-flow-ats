# app/auth/service.py

from app.database.db import SessionLocal
from app.auth.utils import hash_password, verify_password, generate_jwt
from fastapi import HTTPException
from app.utils.status_codes import StatusCode
from app.users.models import User
from app.interview_attempts.models import InterviewRecord
from app.user_details.models import UserDetail
from app.paper_assignments.repository import assign_best_paper
from datetime import date as dt_date


def signup_user(data):
    db_session = SessionLocal()
    try:
        existing_user = (
            db_session.query(User).filter(User.mobile == data.mobile).first()
        )
        if existing_user:
            raise HTTPException(
                status_code=StatusCode.CONFLICT,
                detail="This mobile number is already registered.",
            )

        hashed_password = hash_password(data.mobile)

        new_user = User(
            username=data.name,
            mobile=data.mobile,
            email=data.email,
            password=hashed_password,
            test_level_id=data.test_level_id,
            department_id=data.department_id,
            role="user",
            is_active=True,
            created_by=None,
        )
        db_session.add(new_user)
        db_session.commit()
        db_session.refresh(new_user)

        # Trigger Auto-Assignment immediately after signup
        try:
            assign_best_paper(
                db=db_session,
                user_id=new_user.id,
                department_id=new_user.department_id,
                test_level_id=new_user.test_level_id,
                assigned_date=dt_date.today()
            )
            new_user.process_status = 'ready'
            db_session.commit()
        except Exception as e:
            # Log error but don't fail signup.
            print(f"Auto-assignment failed for user {new_user.id}: {str(e)}")

        user_data = {
            "id": new_user.id,
            "username": new_user.username,
            "role": new_user.role,
            "department_id": new_user.department_id,
        }
        token = generate_jwt(user_data)
        return {"access_token": token, "user": user_data}

    except HTTPException:
        raise
    except Exception:
        db_session.rollback()
        raise HTTPException(
            status_code=StatusCode.INTERNAL_SERVER_ERROR,
            detail="An internal server error occurred. Please try again later.",
        )
    finally:
        db_session.close()


def signin_user(data):
    db_session = SessionLocal()
    try:
        user = None
        # 1. Primary Lookups
        if data.mobile:
            user = db_session.query(User).filter(
                User.mobile == data.mobile).first()
            if not user:
                raise HTTPException(
                    status_code=StatusCode.UNAUTHORIZED,
                    detail="The mobile number provided is not registered.",
                )
        elif data.email:
            user = db_session.query(User).filter(
                User.email == data.email).first()
            if not user:
                raise HTTPException(
                    status_code=StatusCode.UNAUTHORIZED,
                    detail="The email address provided is not registered.",
                )

        # 2. Cross-check for Admins (if both provided)
        if data.mobile and data.email:
            if user.email != data.email:
                raise HTTPException(
                    status_code=StatusCode.UNAUTHORIZED,
                    detail="The provided email and mobile number do not match.",
                )

        if not user.is_active:
            raise HTTPException(
                status_code=StatusCode.FORBIDDEN,
                detail="Your account is currently inactive. Please contact the administrator.",
            )

        # 3. Password Check
        if not verify_password(data.password, user.password):
            raise HTTPException(
                status_code=StatusCode.UNAUTHORIZED,
                detail="The password you entered is incorrect.",
            )

        # Role is now auto-detected from the database record

        # For regular users, check/trigger auto-assignment on login if not already assigned
        if user.role == "user":
            try:
                assign_best_paper(
                    db=db_session,
                    user_id=user.id,
                    department_id=user.department_id,
                    test_level_id=user.test_level_id,
                    assigned_date=dt_date.today()
                )
                user.process_status = 'ready'
                db_session.commit()
            except Exception as e:
                print(
                    f"Auto-assignment during login failed for user {user.id}: {str(e)}")

        user_data = {"id": user.id, "username": user.username,
                     "role": user.role, "department_id": user.department_id}
        token = generate_jwt(user_data)
        return {
            "access_token": token,
            "user": user_data,
        }
    finally:
        db_session.close()


def _create_staff(data, role):
    db_session = SessionLocal()
    try:
        existing_user = (
            db_session.query(User).filter(User.mobile == data.mobile).first()
        )
        if existing_user:
            raise HTTPException(
                status_code=StatusCode.CONFLICT,
                detail="This mobile number is already registered.",
            )

        hashed_password = hash_password(data.mobile)

        new_user = User(
            username=data.name,
            mobile=data.mobile,
            email=data.email,
            password=hashed_password,
            role=role,
            is_active=True,
            created_by=None,
        )
        db_session.add(new_user)
        db_session.commit()
        db_session.refresh(new_user)

        user_data = {
            "id": new_user.id,
            "username": new_user.username,
            "role": new_user.role,
        }
        token = generate_jwt(user_data)
        return {"access_token": token, "user": user_data}

    except HTTPException:
        raise
    except Exception:
        db_session.rollback()
        raise HTTPException(
            status_code=StatusCode.INTERNAL_SERVER_ERROR,
            detail="An internal server error occurred. Please try again later.",
        )
    finally:
        db_session.close()


def create_admin(data):
    return _create_staff(data, "admin")


def create_project_lead(data):
    return _create_staff(data, "project_lead")


def get_user_by_id(user_id):
    db_session = SessionLocal()
    try:
        user_obj = db_session.query(User).filter(User.id == user_id).first()

        if not user_obj:
            return None

        user = {
            "id": user_obj.id,
            "username": user_obj.username,
            "mobile": user_obj.mobile,
            "email": user_obj.email,
            "role": user_obj.role,
            "test_level_id": user_obj.test_level_id,
            "test_level_name": user_obj.test_level.name if user_obj.test_level else None,
            "department_id": user_obj.department_id,
            "department_name": user_obj.department.name if user_obj.department else None,
            "created_at": user_obj.created_at,
        }

        if user["role"] == "user":
            from app.user_details.models import UserDetail

            details = (
                db_session.query(UserDetail)
                .filter(UserDetail.user_id == user_id)
                .first()
            )
            if details:
                user["is_submitted"] = details.is_submitted
                user["is_interview_submitted"] = details.is_interview_submitted
                user["recruitment_details"] = {
                    "personalDetails": details.personal_details,
                    "familyDetails": details.family_details,
                    "sourceOfInformation": details.source_of_information,
                    "educationDetails": details.education_details,
                    "workExperienceDetails": details.work_experience_details,
                    "otherDetails": details.other_details,
                }
            else:
                user["is_submitted"] = False
                user["is_interview_submitted"] = False
                user["recruitment_details"] = None
        else:
            user["is_submitted"] = False
            user["is_interview_submitted"] = False
            user["recruitment_details"] = None

        return user
    finally:
        db_session.close()


def get_users_by_role(role: str, page: int = 1, limit: int = 10, search: str = None, date_from: str = None, date_to: str = None, department_id: int = None, test_level_id: int = None, status: str = None):
    db_session = SessionLocal()
    try:
        from sqlalchemy import func, or_
        from datetime import date as dt_date
        from app.paper_assignments.models import PaperAssignment
        from app.papers.models import Paper
        from app.users.models import User as UserModel
        from app.departments.models import Department
        from app.classifications.models import Classification as Cls
        from sqlalchemy.orm import aliased

        from datetime import datetime, time
        def safe_parse_date(value: str):
            """Parse a date string safely, returning None for invalid/partial dates."""
            if not value or not isinstance(value, str):
                return None
            try:
                # Basic cleanup
                v = value.strip().split(" ")[0]
                if "-" not in v:
                    return None
                parts = v.split("-")
                if len(parts) != 3:
                    return None
                # Year, Month, Day
                y, m, d = int(parts[0]), int(parts[1]), int(parts[2])
                return dt_date(y, m, d)
            except (ValueError, TypeError, IndexError):
                return None

        # 1. AUTO-EXPIRATION LOGIC (Bulk update for expired tests)
        today = dt_date.today()
        # Users with assigned_date in past, who are 'ready' but haven't started/submitted
        to_expire_query = (
            db_session.query(UserModel)
            .join(PaperAssignment, UserModel.id == PaperAssignment.user_id)
            .filter(
                UserModel.role == "user",
                UserModel.is_active,
                UserModel.process_status == "ready",
                PaperAssignment.assigned_date < today
            )
        )

        for u in to_expire_query.all():
            u.process_status = "expired"
            u.is_active = False

        if to_expire_query.count() > 0:
            db_session.commit()

        # 2. DATA RETRIEVAL
        range_from = safe_parse_date(date_from)
        range_to = safe_parse_date(date_to)

        UserDept = aliased(Department)

        # Latest assignment per user via row_number()
        assignment_subq = (
            db_session.query(
                PaperAssignment.user_id,
                PaperAssignment.paper_id,
                PaperAssignment.department_id,
                PaperAssignment.test_level_id,
                PaperAssignment.is_attempted,
                PaperAssignment.assigned_date,
                func.row_number()
                .over(
                    partition_by=PaperAssignment.user_id,
                    order_by=PaperAssignment.id.desc(),
                )
                .label("rn"),
            )
            .subquery()
        )

        # Latest attempt per user via row_number()
        attempt_subq = (
            db_session.query(
                InterviewRecord.user_id,
                InterviewRecord.id,
                InterviewRecord.status,
                InterviewRecord.started_at,
                InterviewRecord.submitted_at,
                func.row_number()
                .over(
                    partition_by=InterviewRecord.user_id,
                    order_by=InterviewRecord.id.desc(),
                )
                .label("rn"),
            )
            .subquery()
        )

        results_query = (
            db_session.query(
                UserModel,
                assignment_subq.c.paper_id.label("asgn_paper_id"),
                assignment_subq.c.department_id.label("asgn_dept_id"),
                assignment_subq.c.test_level_id.label("asgn_level_id"),
                assignment_subq.c.is_attempted.label("asgn_is_attempted"),
                assignment_subq.c.assigned_date.label("asgn_date"),
                Paper.paper_name,
                Department.name.label("asgn_dept_name"),
                Cls.name.label("level_name"),
                UserDept.name.label("user_dept_name"),
                attempt_subq.c.id.label("attempt_id"),
                attempt_subq.c.status.label("attempt_status"),
                attempt_subq.c.started_at.label("attempt_started_at"),
                attempt_subq.c.submitted_at.label("attempt_submitted_at"),
                UserDetail.is_submitted,
                UserDetail.is_interview_submitted,
                UserDetail.is_reinterview,
                UserDetail.reinterview_date,
            )
            .outerjoin(
                assignment_subq,
                (UserModel.id == assignment_subq.c.user_id) & (
                    assignment_subq.c.rn == 1),
            )
            .outerjoin(Paper, assignment_subq.c.paper_id == Paper.id)
            .outerjoin(Department, assignment_subq.c.department_id == Department.id)
            .outerjoin(UserDept, UserModel.department_id == UserDept.id)
            .outerjoin(Cls, assignment_subq.c.test_level_id == Cls.id)
            .outerjoin(
                attempt_subq,
                (UserModel.id == attempt_subq.c.user_id) & (
                    attempt_subq.c.rn == 1),
            )
            .outerjoin(UserDetail, UserModel.id == UserDetail.user_id)
            .filter(UserModel.role == role)
        )

        # Apply Filters
        if department_id:
            results_query = results_query.filter(
                or_(UserModel.department_id == department_id,
                    assignment_subq.c.department_id == department_id)
            )
        if test_level_id:
            results_query = results_query.filter(
                assignment_subq.c.test_level_id == test_level_id)
        if search:
            pattern = f"%{search}%"
            results_query = results_query.filter(
                or_(UserModel.username.ilike(pattern), UserModel.email.ilike(
                    pattern), UserModel.mobile.ilike(pattern))
            )

        # 3. DATE FILTERS (Strictly New Registrations or Re-interviews)
        if range_from:
            start_date_obj = range_from
            end_date_obj = range_to if range_to else range_from
            
            # For TIMESTAMP (created_at) - explicitly cover the full day
            start_ts = datetime.combine(start_date_obj, time.min)
            end_ts = datetime.combine(end_date_obj, time.max)
            
            results_query = results_query.filter(
                or_(
                    UserModel.created_at.between(start_ts, end_ts),
                    UserDetail.reinterview_date.between(start_date_obj, end_date_obj)
                )
            )

        # 4. STATUS FILTER
        if status and status != "all":
            if status == "pending":
                results_query = results_query.filter(
                    or_(UserModel.process_status == "pending",
                        assignment_subq.c.rn.is_(None))
                )
            else:
                results_query = results_query.filter(UserModel.process_status == status)

        total_records = results_query.count()
        results = results_query.order_by(UserModel.id.desc()).offset(
            (page - 1) * limit).limit(limit).all()

        data = [
            {
                "id": row.User.id,
                "username": row.User.username,
                "mobile": row.User.mobile,
                "email": row.User.email,
                "role": row.User.role,
                "process_status": row.User.process_status,
                "test_level_id": row.User.test_level_id,
                "test_level_name": row.User.test_level.name if row.User.test_level else None,
                "department_id": row.User.department_id,
                "department_name": row.user_dept_name,
                "is_active": row.User.is_active,
                "is_details_submitted": row.is_submitted if row.is_submitted is not None else False,
                "is_interview_submitted": row.is_interview_submitted if row.is_interview_submitted is not None else False,
                "is_reinterview": row.is_reinterview if row.is_reinterview is not None else False,
                "reinterview_date": row.reinterview_date.isoformat() if row.reinterview_date else None,
                "user_type": "returning" if (row.is_reinterview and row.reinterview_date and range_from and row.reinterview_date == range_from) else "new",
                "assignment": {
                    "is_assigned": row.asgn_paper_id is not None,
                    "paper_id": row.asgn_paper_id,
                    "paper_name": row.paper_name,
                    "department_id": row.asgn_dept_id,
                    "department_name": row.asgn_dept_name,
                    "test_level_id": row.asgn_level_id,
                    "test_level_name": row.level_name,
                    "assigned_date": row.asgn_date.isoformat() if row.asgn_date else None,
                    "is_attempted": bool(row.asgn_is_attempted) or row.attempt_status in ["submitted", "auto_submitted"],
                    "has_started": row.attempt_id is not None and row.attempt_status == "started"
                } if row.asgn_paper_id else None
            }
            for row in results
        ]

        from app.utils.pagination import create_paginated_response, PaginationParams
        return create_paginated_response(
            data=data,
            total_records=total_records,
            params=PaginationParams(page=page, limit=limit)
        )

    except Exception as e:
        print(f"Error in get_users_by_role: {str(e)}")
        raise HTTPException(
            status_code=StatusCode.INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}",
        )
    finally:
        db_session.close()


def toggle_user_status(user_id: int):
    db_session = SessionLocal()
    try:
        user = db_session.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=StatusCode.NOT_FOUND,
                detail="User not found.",
            )
        user.is_active = not user.is_active
        db_session.commit()
        return {"id": user.id, "is_active": user.is_active}
    except HTTPException:
        raise
    except Exception:
        db_session.rollback()
        raise HTTPException(
            status_code=StatusCode.INTERNAL_SERVER_ERROR,
            detail="An internal server error occurred.",
        )
    finally:
        db_session.close()


def delete_user(user_id: int):
    db_session = SessionLocal()
    try:
        user = db_session.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=StatusCode.NOT_FOUND,
                detail="User not found.",
            )
        db_session.delete(user)
        db_session.commit()
        return {"id": user_id, "message": "User deleted successfully"}
    except HTTPException:
        raise
    except Exception:
        db_session.rollback()
        raise HTTPException(
            status_code=StatusCode.INTERNAL_SERVER_ERROR,
            detail="An internal server error occurred.",
        )
    finally:
        db_session.close()


def update_user_basic_info(user_id: int, data):
    db_session = SessionLocal()
    try:
        user = db_session.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=StatusCode.NOT_FOUND,
                detail="User not found.",
            )

        if data.name is not None:
            user.username = data.name
        if data.mobile is not None:
            # Check for conflict if mobile is changing
            if data.mobile != user.mobile:
                conflicting_user = db_session.query(User).filter(
                    User.mobile == data.mobile).first()
                if conflicting_user:
                    raise HTTPException(
                        status_code=StatusCode.CONFLICT,
                        detail="This mobile number is already registered.",
                    )
                user.mobile = data.mobile
        if data.email is not None:
            user.email = data.email
        if data.test_level_id is not None:
            user.test_level_id = data.test_level_id
        if data.department_id is not None:
            user.department_id = data.department_id

        db_session.commit()
        db_session.refresh(user)
        return {"message": "User basic info updated successfully", "user_id": user.id}
    except HTTPException:
        raise
    except Exception as e:
        db_session.rollback()
        raise HTTPException(
            status_code=StatusCode.INTERNAL_SERVER_ERROR,
            detail=str(e),
        )
    finally:
        db_session.close()
