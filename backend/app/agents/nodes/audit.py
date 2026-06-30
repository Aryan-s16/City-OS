from typing import Dict, Any
from datetime import datetime
from app.agents.state import GraphState
from app.db.firestore_client import FirestoreClient
from app.repositories.issue_repository import IssueRepository

async def audit_node(state: GraphState) -> Dict[str, Any]:
    # Persist the final state to Firestore
    try:
        client = FirestoreClient()
        repo = IssueRepository(client)
        
        update_data = {
            "category": state.get("category"),
            "priority": state.get("overall_priority"),
            "aiSummary": state.get("vision_summary") or state.get("risk_rationale"),
            "confidence": state.get("classification_confidence", 0.0),
            "mission": {
                "title": state.get("mission_title"),
                "description": state.get("mission_description"),
                "crew": state.get("crew_size")
            }
        }
        
        # Clean up None values
        update_data = {k: v for k, v in update_data.items() if v is not None}
        
        await repo.update(state.get("issue_id"), update_data)
        status = "Complete & Persisted"
    except Exception as e:
        print(f"Error persisting state to Firestore: {e}")
        status = f"Complete (Failed to persist: {e})"

    audit = {
        "agent": "Audit Agent",
        "action": "Sealed record",
        "timestamp": datetime.utcnow().isoformat(),
        "reasoning": status,
        "confidence": 1.0,
        "output": {"status": status}
    }
    
    return {
        "audit_log": [audit]
    }

