from app.repositories.base import BaseRepository
from app.schemas.issue import IssueResponse
from typing import Optional, List, Dict, Any

class IssueRepository(BaseRepository[IssueResponse]):
    collection_name = "issues"

    # We can add domain-specific queries here later if needed
    async def get_issues_by_status(self, status: str, limit: int = 50) -> List[Dict[str, Any]]:
        filters = [("status", "==", status)]
        return await self.list(filters=filters, limit=limit)
