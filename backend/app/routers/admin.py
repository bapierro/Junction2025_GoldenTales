from __future__ import annotations

from typing import List, Optional

from fastapi import APIRouter, Depends, Header, HTTPException, Response, status
from sqlalchemy import select
from sqlmodel import Session

from ..database import get_session
from ..models import ModerationStatus, Report, Story
from ..schemas import ReportRead
from ..services.security import ensure_admin

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/reports", response_model=List[ReportRead])
def list_reports(
    admin_token: Optional[str] = Header(default=None, alias="x-admin-token"),
    session: Session = Depends(get_session),
) -> List[ReportRead]:
    ensure_admin(admin_token)
    reports = session.exec(select(Report).where(Report.handled.is_(False))).scalars().all()
    return [ReportRead.model_validate(report) for report in reports]


@router.patch("/reports/{report_id}", response_model=ReportRead)
def mark_report_handled(
    report_id: int,
    admin_token: Optional[str] = Header(default=None, alias="x-admin-token"),
    session: Session = Depends(get_session),
) -> ReportRead:
    ensure_admin(admin_token)
    report = session.get(Report, report_id)
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")
    report.handled = True
    session.add(report)
    session.commit()
    session.refresh(report)
    return ReportRead.model_validate(report)


@router.delete("/stories/{story_id}", status_code=status.HTTP_204_NO_CONTENT, response_class=Response)
def remove_story(
    story_id: int,
    admin_token: Optional[str] = Header(default=None, alias="x-admin-token"),
    session: Session = Depends(get_session),
) -> Response:
    ensure_admin(admin_token)
    story = session.get(Story, story_id)
    if not story:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Story not found")
    story.moderation_status = ModerationStatus.removed
    session.add(story)
    session.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
