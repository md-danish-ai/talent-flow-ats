import io
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.utils.dependencies import authenticate_user, require_roles
from app.utils.status_codes import StatusCode, ResponseMessage, api_response
from app.database.db import get_db
from app.reports.service import generate_report_pdf_file, get_report_user_list

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
            headers={
                "Content-Disposition": f'attachment; filename="{filename}"',
                "Access-Control-Expose-Headers": "Content-Disposition",
            },
        )
    except Exception as exc:
        raise HTTPException(
            status_code=StatusCode.INTERNAL_SERVER_ERROR,
            detail=f"PDF generation failed: {str(exc)}",
        )


@router.get(
    "/admin/results/get-all-reports",
    dependencies=[Depends(require_roles(["admin", "project_lead"]))],
    tags=["Reports"],
)
async def get_all_reports(
    search: str | None = Query(default=None),
    start_date: str | None = Query(default=None),
    end_date: str | None = Query(default=None),
    status: str | None = Query(default=None),
    completion_reason: str | None = Query(default=None),
    overall_grade: str | None = Query(default=None),
    project_lead_id: int | None = Query(default=None),
    department_id: int | None = Query(default=None),
    test_level_id: int | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10, ge=1, le=100),
):
    """List all non-software users with dept, exam level, and latest attempt info."""
    data = get_report_user_list(
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
    return api_response(StatusCode.OK, ResponseMessage.FETCHED("Report"), data=data)
