from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from datetime import datetime
from app.schemas.issue import IssueCreate, IssueResponse, IssueUpdate
from app.core.security import get_current_user, require_role

router = APIRouter()

@router.post("/", response_model=IssueResponse)
def create_issue(issue: IssueCreate, current_user: dict = Depends(get_current_user)):
    """Create a new issue. Triggers AI classification in background."""
    # TODO: Connect to Firestore
    # TODO: AI_AGENT_HOOK — Trigger Classifier & Prioritizer Agents
    
    return IssueResponse(
        id=f"issue-{int(datetime.now().timestamp())}",
        **issue.model_dump(),
        status="open",
        reportedBy=current_user["uid"],
        reporterName=current_user.get("name", "Citizen"),
        createdAt=datetime.now(),
        updatedAt=datetime.now()
    )

@router.get("/", response_model=List[IssueResponse])
def get_issues(
    status: Optional[str] = None,
    category: Optional[str] = None,
    limit: int = Query(50, le=100),
    current_user: dict = Depends(get_current_user)
):
    """Get list of issues with optional filtering"""
    # TODO: Fetch from Firestore
    return []

@router.get("/{issue_id}", response_model=IssueResponse)
def get_issue(issue_id: str, current_user: dict = Depends(get_current_user)):
    """Get specific issue details"""
    # TODO: Fetch from Firestore
    raise HTTPException(status_code=404, detail="Issue not found")

@router.patch("/{issue_id}", response_model=IssueResponse)
def update_issue(
    issue_id: str, 
    issue_update: IssueUpdate,
    current_user: dict = Depends(require_role(["officer", "admin"]))
):
    """Update issue status/details. Triggers appropriate AI agents."""
    # TODO: Update in Firestore
    # TODO: AI_AGENT_HOOK — Trigger Verifier Agent if status='resolved'
    raise HTTPException(status_code=404, detail="Issue not found")
