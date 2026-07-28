from datetime import datetime
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.reports.report_builder import build_report_data
from app.reports.pdf_service import build_report_html, generate_report_pdf
from app.utils.status_codes import StatusCode
from app.reports import repository


def generate_report_pdf_file(
    db: Session, user_id: int, attempt_id: int
) -> tuple[bytes, str]:
    """
    Fetch data, construct HTML report, convert to PDF, and generate output filename.
    Returns:
        tuple[bytes, str]: (pdf_bytes, filename)
    """
    data = build_report_data(db, user_id=user_id, attempt_id=attempt_id)
    html = build_report_html(data)
    pdf_bytes = generate_report_pdf(html)

    safe_name = data["username"].replace(" ", "_")
    formatted_date = datetime.now().strftime("%d-%b-%Y")
    filename = f"Report_{safe_name}_{formatted_date}.pdf"

    return pdf_bytes, filename


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
):
    try:
        return repository.get_report_user_list(
            search=search,
            start_date=start_date,
            end_date=end_date,
            status=status,
            completion_reason=completion_reason,
            overall_grade=overall_grade,
            project_lead_id=project_lead_id,
            department_id=department_id,
            test_level_id=test_level_id,
            page=page,
            limit=limit,
        )
    except HTTPException:
        raise
    except Exception as exception:
        raise HTTPException(
            status_code=StatusCode.INTERNAL_SERVER_ERROR, detail=str(exception)
        )
