from typing import Generic, TypeVar, Optional, List, Dict, Any
from app.db.firestore_client import FirestoreClient

T = TypeVar("T")

class BaseRepository(Generic[T]):
    """Base repository interface for Firestore operations."""
    
    collection_name: str

    def __init__(self, db: FirestoreClient):
        self.db = db

    async def get_by_id(self, doc_id: str) -> Optional[Dict[str, Any]]:
        return await self.db.get_document(self.collection_name, doc_id)

    async def create(self, doc_id: str, data: Dict[str, Any]) -> str:
        return await self.db.create_document(self.collection_name, doc_id, data)

    async def update(self, doc_id: str, data: Dict[str, Any]) -> bool:
        return await self.db.update_document(self.collection_name, doc_id, data)

    async def list(self, filters: Optional[List[tuple]] = None, limit: int = 50) -> List[Dict[str, Any]]:
        return await self.db.query_collection(self.collection_name, filters, limit)
