from fastapi import APIRouter, Depends
from typing import List
from app.core.security import require_role

router = APIRouter()

# TODO: Define Agent schemas

@router.get("/status")
def get_agents_status(current_user: dict = Depends(require_role(["officer", "admin"]))):
    """Get real-time status of all AI agents"""
    # TODO: Fetch agent status from database/cache
    return [
        {"id": "classifier", "status": "active", "processedToday": 47},
        {"id": "prioritizer", "status": "active", "processedToday": 89},
        {"id": "predictor", "status": "processing", "processedToday": 12}
    ]

@router.post("/{agent_id}/trigger")
def trigger_agent(agent_id: str, payload: dict, current_user: dict = Depends(require_role(["admin"]))):
    """Manually trigger a specific AI agent workflow"""
    # TODO: AI_AGENT_HOOK — Execute specific agent logic
    return {"status": "triggered", "agent_id": agent_id}
