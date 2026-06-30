from fastapi import Depends
from app.db.firestore_client import FirestoreClient
from app.repositories.issue_repository import IssueRepository
from app.services.issue_service import IssueService
from app.core.config import settings

# Global Firestore client instance (initialized dynamically or in lifespan)
_firestore_client = FirestoreClient(project_id=settings.FIREBASE_PROJECT_ID)

def get_firestore_client() -> FirestoreClient:
    """Dependency to get Firestore client."""
    return _firestore_client

def get_issue_repository(db: FirestoreClient = Depends(get_firestore_client)) -> IssueRepository:
    """Dependency to get IssueRepository."""
    return IssueRepository(db)

def get_issue_service(repo: IssueRepository = Depends(get_issue_repository)) -> IssueService:
    """Dependency to get IssueService."""
    return IssueService(repo)
