import json
import math
from sqlalchemy import case, desc, func, or_

from app.database.db import SessionLocal
from app.users.models import User
from app.departments.models import Department
from app.classifications.models import Classification
from app.papers.models import Paper
from app.interview_attempts.models import InterviewRecord
from app.evaluations.models import InterviewEvaluation
from app.utils.enums import RoleType, EvaluationStatus, ProcessStatus
from app.utils.expiration import run_auto_expiration


def get_report_user_list(
    search: str | None = None,
    start_date: str | None = None,
    end_date: str | None = None,
    status: str | None = None,
    completion_reason: str | None = None,
    overall_grade: str | None = None,
    project_lead_id: int | None = None,
    department_id: int | None = None,
    test_level_id: int | None = None,
    page: int = 1,
    limit: int = 10,
) -> dict:
    """
    User-centric report listing (for the Reports tab).
    Returns non-software users with dept, exam level, re-attempt flag,
    and latest attempt info. Correctly applies date and status filters in SQL.
    """
    db = SessionLocal()
    try:
        run_auto_expiration(db)
        TestLevel = Classification

        # Subquery to get max InterviewRecord ID for each user
        latest_attempt_subquery = (
            db.query(
                InterviewRecord.user_id,
                func.max(InterviewRecord.id).label("max_id"),
            )
            .group_by(InterviewRecord.user_id)
            .subquery()
        )

        query = (
            db.query(
                User,
                Department.name.label("dept_name"),
                TestLevel.name.label("level_name"),
                InterviewRecord,
                Department.requires_interview.label("requires_interview"),
            )
            .outerjoin(Department, Department.id == User.department_id)
            .outerjoin(TestLevel, TestLevel.id == User.test_level_id)
            .outerjoin(
                latest_attempt_subquery,
                latest_attempt_subquery.c.user_id == User.id,
            )
            .outerjoin(
                InterviewRecord,
                InterviewRecord.id == latest_attempt_subquery.c.max_id,
            )
            .filter(User.role == RoleType.USER.value)
        )

        # Search by name / mobile / email
        if search:
            pattern = f"%{search.strip()}%"
            query = query.filter(
                (User.username.ilike(pattern))
                | (User.mobile.ilike(pattern))
                | (User.email.ilike(pattern))
            )

        # Department filter
        if department_id:
            query = query.filter(User.department_id == int(department_id))

        # Exam level filter
        if test_level_id:
            query = query.filter(User.test_level_id == int(test_level_id))

        # Status filter
        if status and status != "all":
            if status == "expired":
                query = query.filter(
                    or_(
                        InterviewRecord.status == "expired",
                        (
                            latest_attempt_subquery.c.max_id.is_(None)
                            & (User.process_status == ProcessStatus.EXPIRED.value)
                        ),
                    )
                )
            elif status == "ready":
                query = query.filter(
                    or_(
                        InterviewRecord.status == "ready",
                        (
                            latest_attempt_subquery.c.max_id.is_(None)
                            & (User.process_status == ProcessStatus.READY.value)
                        ),
                    )
                )
            elif status == "not_required":
                query = query.filter(Department.requires_interview.is_(False))
            else:
                query = query.filter(InterviewRecord.status == status)

        # Completion reason filter
        if completion_reason and completion_reason != "all":
            query = query.filter(InterviewRecord.completion_reason == completion_reason)

        # Overall grade filter
        if overall_grade and overall_grade != "all":
            query = query.filter(InterviewRecord.overall_grade == overall_grade)

        # Date filter on attempt date (submitted_at or started_at)
        attempt_date = func.coalesce(
            InterviewRecord.submitted_at,
            InterviewRecord.started_at,
            User.created_at,
        )

        if start_date:
            query = query.filter(func.date(attempt_date) >= start_date)

        if end_date:
            query = query.filter(func.date(attempt_date) <= end_date)

        # Project lead filter
        if project_lead_id:
            query = query.join(
                InterviewEvaluation,
                InterviewEvaluation.attempt_id == InterviewRecord.id,
            ).filter(InterviewEvaluation.project_lead_id == int(project_lead_id))

        total_items = query.count()
        total_pages = math.ceil(total_items / limit) if limit > 0 else 0

        user_rows = (
            query.order_by(desc(attempt_date), desc(User.id))
            .limit(limit)
            .offset((page - 1) * limit)
            .all()
        )

        results: list[dict] = []

        for (
            user,
            dept_name,
            level_name,
            latest_record,
            requires_interview,
        ) in user_rows:
            attempts_count = (
                db.query(InterviewRecord)
                .filter(InterviewRecord.user_id == user.id)
                .count()
            )

            latest_attempt = None
            if latest_record:
                # Paper info
                paper = (
                    db.query(Paper).filter(Paper.id == latest_record.paper_id).first()
                )

                # Interviewers list
                interviewers = [
                    {"name": row[0], "status": row[1]}
                    for row in (
                        db.query(User.username, InterviewEvaluation.status)
                        .join(
                            InterviewEvaluation,
                            InterviewEvaluation.project_lead_id == User.id,
                        )
                        .filter(InterviewEvaluation.attempt_id == latest_record.id)
                        .order_by(
                            case(
                                (
                                    InterviewEvaluation.status
                                    == EvaluationStatus.COMPLETED.value,
                                    0,
                                ),
                                else_=1,
                            ),
                            InterviewEvaluation.updated_at.asc(),
                        )
                        .all()
                    )
                ]

                typing_stats = getattr(latest_record, "typing_stats", None)
                if isinstance(typing_stats, str):
                    try:
                        typing_stats = json.loads(typing_stats)
                    except Exception:
                        typing_stats = None

                if not typing_stats and latest_record.responses:
                    responses = (
                        latest_record.responses
                        if isinstance(latest_record.responses, list)
                        else []
                    )
                    for r in responses:
                        if not isinstance(r, dict):
                            continue
                        if r.get("typing_stats") and isinstance(
                            r["typing_stats"], dict
                        ):
                            typing_stats = r["typing_stats"]
                            break
                        section_code = str(r.get("section_code") or "").upper()
                        section_name = str(r.get("section_name") or "").upper()
                        if "TYPING" in section_code or "TYPING" in section_name:
                            ans_text = r.get("answer_text") or ""
                            if isinstance(
                                ans_text, str
                            ) and ans_text.strip().startswith("{"):
                                try:
                                    parsed = json.loads(ans_text)
                                    stats = parsed.get("stats") or parsed.get(
                                        "typing_stats"
                                    )
                                    if stats and isinstance(stats, dict):
                                        typing_stats = stats
                                        break
                                except Exception:
                                    pass

                latest_attempt = {
                    "attempt_id": latest_record.id,
                    "paper_id": latest_record.paper_id,
                    "paper_name": paper.paper_name if paper else "N/A",
                    "status": latest_record.status,
                    "completion_reason": latest_record.completion_reason,
                    "started_at": latest_record.started_at,
                    "submitted_at": latest_record.submitted_at,
                    "total_questions": latest_record.total_questions,
                    "attempted_count": latest_record.attempted_count,
                    "unattempted_count": latest_record.unattempted_count,
                    "total_marks": (
                        float(latest_record.total_marks)
                        if latest_record.total_marks is not None
                        else 0.0
                    ),
                    "obtained_marks": (
                        float(latest_record.obtained_marks)
                        if latest_record.obtained_marks is not None
                        else 0.0
                    ),
                    "overall_grade": latest_record.overall_grade,
                    "active_duration_seconds": latest_record.active_duration_seconds,
                    "typing_stats": typing_stats,
                    "interviewers": interviewers,
                }

            if requires_interview is False:
                computed_status = "not_required"
            elif latest_record and latest_record.status:
                computed_status = latest_record.status
            elif user.process_status == ProcessStatus.EXPIRED.value:
                computed_status = "expired"
            elif user.process_status == ProcessStatus.READY.value:
                computed_status = "ready"
            elif user.process_status:
                computed_status = user.process_status
            else:
                computed_status = "ready"

            results.append(
                {
                    "user_id": user.id,
                    "username": user.username,
                    "mobile": user.mobile,
                    "department": dept_name,
                    "test_level": level_name,
                    "requires_interview": (
                        requires_interview if requires_interview is not None else True
                    ),
                    "status": computed_status,
                    "process_status": user.process_status,
                    "attempts_count": attempts_count,
                    "is_reattempt": attempts_count > 1,
                    "latest_attempt": latest_attempt,
                }
            )

        return {
            "data": results,
            "pagination": {
                "total_records": total_items,
                "total_pages": total_pages,
                "current_page": page,
                "per_page": limit,
                "has_next": page < total_pages,
                "has_previous": page > 1,
            },
        }
    finally:
        db.close()


def get_export_all_reports_data(
    start_date: str | None = None,
    end_date: str | None = None,
) -> list[dict]:
    """
    Fetch candidate test results within date range formatted for Excel report export.
    """
    db = SessionLocal()
    try:
        query = (
            db.query(InterviewRecord, User)
            .join(User, User.id == InterviewRecord.user_id)
            .filter(User.role == RoleType.USER.value)
        )

        if start_date:
            query = query.filter(
                func.coalesce(
                    func.date(InterviewRecord.submitted_at),
                    func.date(InterviewRecord.started_at),
                )
                >= start_date
            )

        if end_date:
            query = query.filter(
                func.coalesce(
                    func.date(InterviewRecord.submitted_at),
                    func.date(InterviewRecord.started_at),
                )
                <= end_date
            )

        records = query.order_by(
            desc(
                func.coalesce(InterviewRecord.submitted_at, InterviewRecord.started_at)
            ),
            desc(InterviewRecord.id),
        ).all()

        results: list[dict] = []

        for record, user in records:
            subject_grades: list[dict] = record.subject_grades or []
            responses: list[dict] = record.responses or []

            grades_by_subject: dict[str, str] = {}
            lead_obt = 0.0
            company_obt = 0.0

            for sg in subject_grades:
                if not isinstance(sg, dict):
                    continue
                s_name = (sg.get("section_name") or "").strip().lower()
                s_code = (sg.get("section_code") or "").strip().lower()
                grade = sg.get("grade") or "-"
                obt_m = float(sg.get("obtained_marks") or 0.0)

                grades_by_subject[s_name] = grade
                grades_by_subject[s_code] = grade

                if "lead generation" in s_name or "lead_generation" in s_code:
                    lead_obt = obt_m
                elif (
                    "company contact details" in s_name
                    or "company_contact_details" in s_code
                ):
                    company_obt = obt_m

            wpm = 0.0
            accuracy = 0.0
            for r in responses:
                if not isinstance(r, dict):
                    continue

                if r.get("typing_stats") and isinstance(r["typing_stats"], dict):
                    ts = r["typing_stats"]
                    wpm = float(ts.get("wpm", 0.0))
                    accuracy = float(ts.get("accuracy", 0.0))
                    break

                section_code = str(r.get("section_code") or "").upper()
                section_name = str(r.get("section_name") or "").upper()
                if "TYPING" in section_code or "TYPING" in section_name:
                    ans_text = r.get("answer_text") or ""
                    if isinstance(ans_text, str) and ans_text.strip().startswith("{"):
                        try:
                            parsed = json.loads(ans_text)
                            stats = parsed.get("stats") or parsed.get("typing_stats")
                            if stats and isinstance(stats, dict):
                                wpm = float(stats.get("wpm", 0.0))
                                accuracy = float(stats.get("accuracy", 0.0))
                                break
                        except Exception:
                            pass

            internet_marks = lead_obt + company_obt

            def get_grade(names: list[str]) -> str:
                for n in names:
                    if n.lower() in grades_by_subject:
                        return grades_by_subject[n.lower()]
                return "-"

            comp_grade = get_grade(["comprehension", "reading comprehension"])
            written_grade = get_grade(["written", "business writing"])
            grammar_grade = get_grade(["english grammar", "grammar"])
            aptitude_grade = get_grade(["aptitude", "logical reasoning"])
            industry_grade = get_grade(["industry awareness", "general awareness"])

            results.append(
                {
                    "name": user.username or "",
                    "mobile": user.mobile or "",
                    "comprehension": comp_grade,
                    "written": written_grade,
                    "grammar": grammar_grade,
                    "aptitude": aptitude_grade,
                    "industry_awareness": industry_grade,
                    "internet_marks": f"{internet_marks:.2f}",
                    "typing_wpm": f"{wpm:.2f}",
                    "typing_accuracy": f"{accuracy:.2f}",
                    "date": str(record.submitted_at or record.started_at or "")[:10],
                }
            )

        return results
    finally:
        db.close()
