from typing import Dict, Any
from datetime import datetime
from pydantic import BaseModel
from app.agents.state import GraphState

async def duplicate_node(state: GraphState) -> Dict[str, Any]:
    # Mock duplicate detection logic
    # In a real app, this would query Firestore for issues within 100m in the last 24h
    
    is_duplicate = False
    duplicate_of = None
    
    audit = {
        "agent": "Duplicate Detection",
        "action": "Checked for duplicates",
        "timestamp": datetime.utcnow().isoformat(),
        "reasoning": "Queried nearby recent issues in database.",
        "confidence": 0.95,
        "output": {"is_duplicate": is_duplicate}
    }
    
    return {
        "is_duplicate": is_duplicate,
        "duplicate_of": duplicate_of,
        "audit_log": [audit]
    }
