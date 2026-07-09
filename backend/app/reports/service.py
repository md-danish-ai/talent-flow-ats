from datetime import datetime
from sqlalchemy.orm import Session
from app.reports.report_builder import build_report_data
from app.reports.pdf_service import build_report_html, generate_report_pdf


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
