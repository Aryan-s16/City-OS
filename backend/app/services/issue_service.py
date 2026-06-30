from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid
from app.repositories.issue_repository import IssueRepository
from app.schemas.issue import IssueCreate, IssueUpdate, IssueResponse
from app.core.exceptions import NotFoundError

class IssueService:
    def __init__(self, issue_repo: IssueRepository):
        self.issue_repo = issue_repo

    async def create_issue(self, issue: IssueCreate, current_user: dict) -> IssueResponse:
        """Create a new issue, apply default values, and persist via repository."""
        doc_id = f"issue-{int(datetime.utcnow().timestamp())}-{uuid.uuid4().hex[:6]}"
        
        # Build document dict from schema
        data = issue.model_dump()
        data.update({
            "id": doc_id,
            "status": "open",
            "reportedBy": current_user.get("uid", "unknown"),
            "reporterName": current_user.get("name", "Citizen"),
            "tags": [],
            "upvotes": 0,
            "views": 0,
            "comments": 0,
            "createdAt": datetime.utcnow().isoformat() + "Z",
            "updatedAt": datetime.utcnow().isoformat() + "Z"
        })
        
        await self.issue_repo.create(doc_id, data)
        
        # TODO: Trigger EventBus(IssueCreated) for LangGraph in Phase C
        return IssueResponse(**data)

    async def get_issues(self, status: Optional[str] = None, limit: int = 50) -> List[IssueResponse]:
        """Fetch issues, optionally filtering by status."""
        if status:
            raw_issues = await self.issue_repo.get_issues_by_status(status, limit)
        else:
            raw_issues = await self.issue_repo.list(limit=limit)
            
        return [IssueResponse(**doc) for doc in raw_issues]

    async def get_issue_by_id(self, issue_id: str) -> IssueResponse:
        """Fetch a specific issue by ID."""
        doc = await self.issue_repo.get_by_id(issue_id)
        if not doc:
            raise NotFoundError(f"Issue with ID {issue_id} not found")
        return IssueResponse(**doc)

    async def update_issue(self, issue_id: str, update_data: IssueUpdate) -> IssueResponse:
        """Update an existing issue."""
        existing = await self.issue_repo.get_by_id(issue_id)
        if not existing:
            raise NotFoundError(f"Issue with ID {issue_id} not found")
            
        changes = update_data.model_dump(exclude_unset=True)
        changes["updatedAt"] = datetime.utcnow().isoformat() + "Z"
        
        if update_data.status == "resolved":
            changes["resolvedAt"] = datetime.utcnow().isoformat() + "Z"
            
        await self.issue_repo.update(issue_id, changes)
        
        # Fetch updated doc
        updated = await self.issue_repo.get_by_id(issue_id)
        
        # TODO: Trigger EventBus(IssueUpdated) for LangGraph in Phase C
        return IssueResponse(**updated)
