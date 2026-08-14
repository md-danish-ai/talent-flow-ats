import json
import math
from sqlalchemy import case, desc, func

from app.database.db import SessionLocal
from app.users.models import User
from app.departments.models import Department
from app.classifications.models import Classification
from app.papers.models import Paper
from app.interview_attempts.models import InterviewRecord
from app.evaluations.models import InterviewEvaluation
from app.utils.enums import RoleType, EvaluationStatus


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
    and latest attempt info: status, overall_grade, assigned paper, interviewers.
    """
    db = SessionLocal()
    try:
        TestLevel = Classification

        # Base query — join dept + exam level directly (no lazy loading)
        users_query = (
            db.query(
                User,
                Department.name.label("dept_name"),
                TestLevel.name.label("level_name"),
            )
            .outerjoin(Department, Department.id == User.department_id)
            .outerjoin(TestLevel, TestLevel.id == User.test_level_id)
            .filter(User.role == RoleType.USER.value)
        )

        # Search by name / mobile / email
        if search:
            pattern = f"%{search.strip()}%"
            users_query = users_query.filter(
                (User.username.ilike(pattern))
                | (User.mobile.ilike(pattern))
                | (User.email.ilike(pattern))
            )

        # Department filter
        if department_id:
            users_query = users_query.filter(User.department_id == int(department_id))

        # Exam level filter
        if test_level_id:
            users_query = users_query.filter(User.test_level_id == int(test_level_id))

        total_items = users_query.count()
        total_pages = math.ceil(total_items / limit) if limit > 0 else 0

        user_rows = (
            users_query.order_by(User.id.desc())
            .limit(limit)
            .offset((page - 1) * limit)
            .all()
        )

        results: list[dict] = []

        for user, dept_name, level_name in user_rows:
            attempts_count = (
                db.query(InterviewRecord)
                .filter(InterviewRecord.user_id == user.id)
                .count()
            )

            # Latest attempt for this user
            latest_record = (
                db.query(InterviewRecord)
                .filter(InterviewRecord.user_id == user.id)
                .order_by(desc(InterviewRecord.id))
                .first()
            )

            latest_attempt = None
            if latest_record:
                # Filter by attempt status
                if status and status != "all" and latest_record.status != status:
                    continue
                if (
                    completion_reason
                    and completion_reason != "all"
                    and latest_record.completion_reason != completion_reason
                ):
                    continue
                if (
                    overall_grade
                    and overall_grade != "all"
                    and latest_record.overall_grade != overall_grade
                ):
                    continue

                # Date filter on latest attempt
                if start_date or end_date:
                    date_val = (
                        latest_record.submitted_at
                        if latest_record.status in ["submitted", "auto_submitted"]
                        else latest_record.started_at
                    )
                    if date_val:
                        date_str = str(date_val)[:10]  # YYYY-MM-DD
                        if start_date and date_str < start_date:
                            continue
                        if end_date and date_str > end_date:
                            continue
                    else:
                        if start_date or end_date:
                            continue

                # Paper info
                paper = (
                    db.query(Paper).filter(Paper.id == latest_record.paper_id).first()
                )

                # Project lead / interviewer filter
                if project_lead_id:
                    lead_ids = [
                        row[0]
                        for row in db.query(InterviewEvaluation.project_lead_id)
                        .filter(InterviewEvaluation.attempt_id == latest_record.id)
                        .all()
                    ]
                    if int(project_lead_id) not in lead_ids:
                        continue

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

                latest_attempt = {
                    "attempt_id": latest_record.id,
                    "paper_id": latest_record.paper_id,
                    "paper_name": paper.paper_name if paper else "N/A",
                    "status": latest_record.status,
                    "overall_grade": latest_record.overall_grade,
                    "interviewers": interviewers,
                }
            else:
                # Candidate has no attempt. If any attempt-specific filter is active, skip them.
                if (
                    (status and status != "all")
                    or (completion_reason and completion_reason != "all")
                    or (overall_grade and overall_grade != "all")
                    or start_date
                    or end_date
                    or project_lead_id
                ):
                    continue

            results.append(
                {
                    "user_id": user.id,
                    "username": user.username,
                    "mobile": user.mobile,
                    "department": dept_name,
                    "test_level": level_name,
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
