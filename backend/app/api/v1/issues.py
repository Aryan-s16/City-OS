from fastapi import APIRouter, Depends, Query
from typing import List, Optional
from app.schemas.issue import IssueCreate, IssueResponse, IssueUpdate
from app.schemas.common import ApiResponse
from app.core.security import get_current_user, require_role
from app.services.issue_service import IssueService
from app.dependencies.core import get_issue_service

router = APIRouter()

@router.post("/", response_model=ApiResponse[IssueResponse])
async def create_issue(
    issue: IssueCreate, 
    current_user: dict = Depends(get_current_user),
    service: IssueService = Depends(get_issue_service)
):
    """Create a new issue. Triggers AI classification in background via EventBus."""
    created_issue = await service.create_issue(issue, current_user)
    return ApiResponse(success=True, data=created_issue)

@router.get("/", response_model=ApiResponse[List[IssueResponse]])
async def get_issues(
    status: Optional[str] = None,
    category: Optional[str] = None,
    limit: int = Query(50, le=100),
    current_user: dict = Depends(get_current_user),
    service: IssueService = Depends(get_issue_service)
):
    """Get list of issues with optional filtering"""
    issues = await service.get_issues(status=status, limit=limit)
    return ApiResponse(success=True, data=issues)

@router.get("/{issue_id}", response_model=ApiResponse[IssueResponse])
async def get_issue(
    issue_id: str, 
    current_user: dict = Depends(get_current_user),
    service: IssueService = Depends(get_issue_service)
):
    """Get specific issue details"""
    issue = await service.get_issue_by_id(issue_id)
    return ApiResponse(success=True, data=issue)

@router.patch("/{issue_id}", response_model=ApiResponse[IssueResponse])
async def update_issue(
    issue_id: str, 
    issue_update: IssueUpdate,
    current_user: dict = Depends(require_role(["officer", "admin"])),
    service: IssueService = Depends(get_issue_service)
):
    """Update issue status/details. Triggers appropriate AI agents via EventBus."""
    updated_issue = await service.update_issue(issue_id, issue_update)
    return ApiResponse(success=True, data=updated_issue)

