import io
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.utils.dependencies import authenticate_user, require_roles
from app.utils.status_codes import StatusCode
from app.database.db import get_db
from app.reports.service import generate_report_pdf_file

router = APIRouter(
    dependencies=[Depends(authenticate_user)],
)


@router.get(
    "/admin/results/report/{user_id}/{attempt_id}/pdf",
    dependencies=[Depends(require_roles(["admin", "project_lead"]))],
    tags=["Reports"],
)
async def download_report_pdf(
    user_id: int,
    attempt_id: int,
    db: Session = Depends(get_db),
):
    """Generate and stream a PDF report sheet for a candidate's attempt."""
    try:
        pdf_bytes, filename = generate_report_pdf_file(
            db, user_id=user_id, attempt_id=attempt_id
        )

        return StreamingResponse(
            io.BytesIO(pdf_bytes),
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={filename}"},
        )
    except Exception as exc:
        raise HTTPException(
            status_code=StatusCode.INTERNAL_SERVER_ERROR,
            detail=f"PDF generation failed: {str(exc)}",
        )
