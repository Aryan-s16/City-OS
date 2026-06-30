from typing import Dict, Any, Optional
from datetime import datetime
import uuid
from app.repositories.base import BaseRepository

class MissionRepository(BaseRepository):
    collection_name = "missions"

    def __init__(self, client):
        super().__init__(client)
    async def create(self, data: Dict[str, Any]) -> str:
        doc_id = data.get("id") or f"m-{uuid.uuid4().hex[:8]}"
        now = datetime.utcnow().isoformat()
        
        mission_data = {
            "id": doc_id,
            "state": "Draft",
            "progress": 0,
            "createdAt": now,
            "updatedAt": now,
            **data
        }
        
        await super().create(doc_id, mission_data)
        return doc_id

    async def update_state(self, mission_id: str, new_state: str, metadata: Optional[Dict[str, Any]] = None) -> None:
        """Helper to quickly update state and append to history using a Firestore Transaction."""
        if not self.db.db:
            return

        transaction = self.db.db.transaction()
        doc_ref = self.db.db.collection(self.collection_name).document(mission_id)

        from google.cloud import firestore
        
        @firestore.transactional
        def update_in_transaction(transaction, doc_ref):
            snapshot = doc_ref.get(transaction=transaction)
            if not snapshot.exists:
                raise ValueError(f"Mission {mission_id} not found")
            
            doc = snapshot.to_dict()
            history = doc.get("history", [])
            history.append({
                "from": doc.get("state"),
                "to": new_state,
                "timestamp": datetime.utcnow().isoformat(),
                "metadata": metadata or {}
            })
            
            transaction.update(doc_ref, {
                "state": new_state,
                "history": history,
                "updatedAt": datetime.utcnow().isoformat()
            })

        update_in_transaction(transaction, doc_ref)
