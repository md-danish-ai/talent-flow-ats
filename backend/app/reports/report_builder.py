"""
Report data aggregator — fetches all data needed for the report PDF
in one place and returns a flat dict that pdf_service can consume.
"""

from __future__ import annotations

import json
import math
from datetime import datetime

from sqlalchemy.orm import Session, aliased
from sqlalchemy import desc

from app.interview_attempts import repository as attempt_repo
from app.classifications.models import Classification
from app.evaluations.models import InterviewEvaluation
from app.users.models import User
from app.user_details.models import UserDetail


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------


def _get_answer(answers: list[dict], keywords: list[str]) -> str:
    """Return the user_answer of the first answer whose question_text contains any keyword."""
    for ans in answers:
        qt = (ans.get("question_text") or "").lower()
        if any(kw.lower() in qt for kw in keywords):
            return ans.get("user_answer") or ""
    return ""


def _parse_json_field(answers: list[dict], keywords: list[str]) -> list[dict]:
    """Parse a JSON-encoded answer (e.g. educational_qualification table rows)."""
    raw = _get_answer(answers, keywords)
    if not raw:
        return []
    try:
        parsed = json.loads(raw)
        if isinstance(parsed, list):
            return parsed
        # Sometimes wrapped in a dict
        for v in parsed.values():
            if isinstance(v, list):
                return v
    except Exception:
        pass
    return []


def _get_typing_stats(answers: list[dict]) -> dict | None:
    """Extract typing_stats from answers where it is embedded."""
    for ans in answers:
        ts = ans.get("typing_stats")
        if ts:
            return ts
    return None


def _get_evaluations(db: Session, user_id: int, attempt_id: int) -> list[dict]:
    """Fetch evaluations for this attempt with lead_name and result_name."""
    Lead = aliased(User)
    rows = (
        db.query(
            InterviewEvaluation.id,
            InterviewEvaluation.status,
            InterviewEvaluation.overall_grade,
            InterviewEvaluation.evaluation_data,
            InterviewEvaluation.comments,
            InterviewEvaluation.created_at,
            Lead.username.label("lead_name"),
            Classification.name.label("result_name"),
        )
        .join(Lead, Lead.id == InterviewEvaluation.project_lead_id)
        .outerjoin(
            Classification, Classification.id == InterviewEvaluation.final_result_id
        )
        .filter(
            InterviewEvaluation.user_id == user_id,
            InterviewEvaluation.attempt_id == attempt_id,
        )
        .order_by(desc(InterviewEvaluation.created_at))
        .all()
    )
    return [dict(r._asdict()) for r in rows]


def _distribute_columns(items: list[dict]) -> tuple[list[dict], list[dict]]:
    """Split a flat list into two equal columns (left, right)."""
    half = math.ceil(len(items) / 2)
    return items[:half], items[half:]


# ---------------------------------------------------------------------------
# Public function
# ---------------------------------------------------------------------------


def build_report_data(db: Session, user_id: int, attempt_id: int) -> dict:
    """
    Fetch and assemble all data needed for the report PDF.
    Returns a single flat dict consumed by pdf_service.build_report_html().
    """
    # 1. Core attempt detail (reuse existing repository function)
    detail = attempt_repo.get_admin_user_result_detail(
        user_id=user_id, attempt_id=attempt_id
    )

    answers: list[dict] = detail.get("answers", [])
    subject_results: list[dict] = detail.get("subject_results", [])
    user_info: dict = detail.get("user", {})
    attempt_info: dict = detail.get("attempt", {})

    # 2. All active subjects in DB
    all_subjects = (
        db.query(Classification)
        .filter(Classification.type == "subject", Classification.is_active)
        .all()
    )

    # 3. Evaluations (Round 2 results)
    evaluations = _get_evaluations(db, user_id, attempt_id)

    # 4. Personal fields
    gender = _get_answer(answers, ["gender"])
    dob = _get_answer(answers, ["date of birth", "dob"])
    address = _get_answer(answers, ["address", "current address", "permanent address"])
    arcgate = _get_answer(answers, ["worked in arcgate", "previously worked"])
    commitment = _get_answer(
        answers, ["1 year service commitment", "willing for 1 year"]
    )
    shift_time = _get_answer(answers, ["preferred shift time", "shift time"])
    joining = _get_answer(answers, ["joining date if selected", "joining date"])
    salary = _get_answer(answers, ["salary expected", "expected salary"])
    how_did_you_hear = _get_answer(
        answers, ["how did you hear about arcgate", "how did you hear"]
    )
    deposit = _get_answer(answers, ["security deposit"])

    # 5. Tabular fields
    education_rows = _parse_json_field(
        answers, ["educational qualification", "education"]
    )
    family_rows = _parse_json_field(answers, ["family detail", "family member"])
    work_exp_rows = _parse_json_field(answers, ["work experience", "experience"])

    # Override using actual data from user_details table if present
    ud = db.query(UserDetail).filter(UserDetail.user_id == user_id).first()
    if ud:
        pd_info = ud.personal_details or {}
        gender = pd_info.get("gender") or gender
        dob = pd_info.get("dob") or dob

        # Combine present address
        pres_addr = ", ".join(
            filter(
                None,
                [
                    pd_info.get("presentAddressLine1"),
                    pd_info.get("presentAddressLine2"),
                    pd_info.get("presentCity"),
                    pd_info.get("presentState"),
                    pd_info.get("presentPincode"),
                ],
            )
        )
        if pres_addr:
            address = pres_addr

        # Other details
        od_info = ud.other_details or {}
        commitment = od_info.get("serviceCommitment") or commitment
        shift_time = od_info.get("shiftTime") or shift_time
        joining = od_info.get("expectedJoiningDate") or joining
        salary = od_info.get("expectedSalary") or salary
        deposit = od_info.get("securityDeposit") or deposit

        # Source of information
        soi_info = ud.source_of_information or {}
        arcgate = soi_info.get("workedBefore") or arcgate

        sources = []
        src_dict = soi_info.get("source") or {}
        for src, val in src_dict.items():
            if val:
                sources.append(src.capitalize())
        if sources:
            how_did_you_hear = ", ".join(sources)

        # Tables
        if ud.education_details:
            education_rows = [
                {
                    "education": item.get("type", ""),
                    "details": item.get("details", ""),
                    "school": item.get("school", ""),
                    "board": item.get("board", ""),
                    "medium": item.get("medium", ""),
                    "year": item.get("year", "").replace("-", " - "),
                    "division": item.get("division", ""),
                    "percentage": item.get("percentage", ""),
                }
                for item in ud.education_details
                if item.get("school") or item.get("year") or item.get("percentage")
            ]

        if ud.family_details:
            relations = (
                db.query(Classification)
                .filter(Classification.type == "family_relation")
                .all()
            )
            relation_map = {r.code: r.name for r in relations}
            family_rows = []
            for item in ud.family_details:
                if not item.get("name"):
                    continue
                relation_code = item.get("relation", "")
                relation_label = item.get("relationLabel") or relation_map.get(
                    relation_code, relation_code
                )
                family_rows.append(
                    {
                        "relation": relation_label,
                        "name": item.get("name", ""),
                        "occupation": item.get("occupation", ""),
                        "dependent": item.get("dependent", ""),
                    }
                )

        if ud.work_experience_details:
            work_exp_rows = [
                {
                    "company": item.get("company", ""),
                    "designation": item.get("designation", ""),
                    "joinDate": item.get("joinDate", ""),
                    "leaveDate": item.get("leaveDate", "")
                    or item.get("relieveDate", ""),
                    "reason": item.get("reason", ""),
                    "salary": item.get("salary", ""),
                }
                for item in ud.work_experience_details
                if item.get("company")
            ]

    # 6. Typing stats
    typing_stats = _get_typing_stats(answers)
    wpm = f"{typing_stats['wpm']:.2f}" if typing_stats else "0.00"
    accuracy = f"{typing_stats['accuracy']:.2f}%" if typing_stats else "0.00%"
    errors = str(typing_stats.get("errors", 0)) if typing_stats else "0"

    # 7. Subject + IT skills combined list
    sr_map = {sr["section_name"]: sr for sr in subject_results}

    subject_items = []
    for subj in all_subjects:
        name = subj.name
        value = "-"
        if name in sr_map:
            res = sr_map[name]
            if name.lower() in ["lead generation", "company contact details"]:
                tot = int(res.get("total_marks", 0))
                obt = res.get("obtained_marks", 0)
                obt_str = str(int(obt)) if obt == int(obt) else f"{obt:.2f}"
                name = f"{name} (Out of {tot})"
                value = obt_str
            else:
                value = res.get("grade") or "-"
        subject_items.append({"name": name, "value": value})

    # Calculate Internet Test Marks (sum of Lead Generation and Company Contact Details)
    lead_total = 0
    lead_obt = 0
    company_total = 0
    company_obt = 0
    for s_name, res in sr_map.items():
        if s_name.lower() == "lead generation":
            lead_total = res.get("total_marks", 0)
            lead_obt = res.get("obtained_marks", 0)
        elif s_name.lower() == "company contact details":
            company_total = res.get("total_marks", 0)
            company_obt = res.get("obtained_marks", 0)

    internet_obt = lead_obt + company_obt
    internet_total = (
        int(lead_total + company_total) if (lead_total + company_total) > 0 else 100
    )
    if (lead_total + company_total) > 0:
        internet_obt_str = (
            str(int(internet_obt))
            if internet_obt == int(internet_obt)
            else f"{internet_obt:.2f}"
        )
    else:
        internet_obt_str = "-"

    it_items = [
        {"name": "Typing Speed (Words/Minute)", "value": wpm},
        {"name": "Typing Accuracy (%)", "value": accuracy},
        {"name": "Total Typing Errors", "value": errors},
        {
            "name": f"Internet Test Marks (Out of {internet_total})",
            "value": internet_obt_str,
        },
    ]
    left_col, right_col = _distribute_columns(subject_items + it_items)

    # 8. Evaluation / selection status
    latest_eval = next(
        (ev for ev in evaluations if ev["status"] == "completed"), None
    ) or (evaluations[0] if evaluations else None)

    selection_status = (latest_eval or {}).get("result_name") or ""
    is_selected = (
        "Yes"
        if "selected" in selection_status.lower()
        else ("No" if selection_status else "")
    )

    # 9. Find first submitted evaluation
    completed_evals = [ev for ev in evaluations if ev.get("status") == "completed"]
    first_eval = None
    if completed_evals:
        completed_evals_sorted = sorted(
            completed_evals, key=lambda x: x.get("created_at") or datetime.min
        )
        first_eval = completed_evals_sorted[0]
    elif evaluations:
        evaluations_sorted = sorted(
            evaluations, key=lambda x: x.get("created_at") or datetime.min
        )
        first_eval = evaluations_sorted[0]

    first_eval_formatted = None
    if first_eval:
        created_at_dt = first_eval.get("created_at")
        created_at_str = ""
        if isinstance(created_at_dt, datetime):
            created_at_str = created_at_dt.strftime("%d/%m/%Y")
        elif created_at_dt:
            created_at_str = str(created_at_dt)

        first_eval_formatted = {
            "id": first_eval.get("id"),
            "status": first_eval.get("status"),
            "overall_grade": first_eval.get("overall_grade") or "",
            "evaluation_data": first_eval.get("evaluation_data") or {},
            "comments": first_eval.get("comments") or "",
            "lead_name": first_eval.get("lead_name") or "",
            "result_name": first_eval.get("result_name") or "",
            "created_at": created_at_str,
        }

    today_str = datetime.now().strftime("%d/%m/%Y")

    return {
        # Meta
        "today": today_str,
        # User
        "username": user_info.get("username", ""),
        "mobile": user_info.get("mobile", ""),
        "email": user_info.get("email", "") or "",
        # Attempt
        "paper_name": attempt_info.get("paper_name", ""),
        "overall_grade": attempt_info.get("overall_grade", ""),
        "submitted_at": str(attempt_info.get("submitted_at", "")),
        # Personal details
        "gender": gender,
        "dob": dob,
        "address": address,
        "arcgate": arcgate,
        "commitment": commitment,
        "shift_time": shift_time,
        "joining": joining,
        "salary": salary,
        "deposit": deposit,
        "how_did_you_hear": how_did_you_hear,
        # Tables
        "education_rows": education_rows,
        "family_rows": family_rows,
        "work_exp_rows": work_exp_rows,
        # Subjects/IT skills columns
        "left_col": left_col,
        "right_col": right_col,
        # Result section
        "is_selected": is_selected,
        "selection_status": selection_status,
        "first_evaluation": first_eval_formatted,
    }
