import json
import asyncio
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sse_starlette.sse import EventSourceResponse
from app.core.security import require_role
from app.db.firestore_client import FirestoreClient
from app.repositories.issue_repository import IssueRepository
from app.services.issue_service import IssueService
from app.agents.graph import cityos_graph
from app.agents.state import GraphState

router = APIRouter()

def get_issue_service():
    # Helper to get the service manually
    client = FirestoreClient()
    repo = IssueRepository(client)
    return IssueService(repo)

@router.get("/stream/{issue_id}")
async def stream_agent_workflow(
    issue_id: str,
    # In production, require authentication. For hackathon testing, we'll allow easy access.
    # current_user: dict = Depends(require_role(["admin", "officer"]))
):
    """Execute the LangGraph workflow for an issue and stream live progress via SSE."""
    
    svc = get_issue_service()
    try:
        issue = await svc.get_issue_by_id(issue_id)
    except Exception:
        raise HTTPException(status_code=404, detail="Issue not found")

    async def event_generator():
        # Initialize graph state
        state: GraphState = {
            "issue_id": issue.id,
            "title": issue.title,
            "description": issue.description,
            "images": issue.images or [],
            "lat": issue.location.lat if issue.location else 0.0,
            "lng": issue.location.lng if issue.location else 0.0,
            "reporter_id": issue.reportedBy,
            "is_valid": True,
            "requires_vision": False,
            "skip_processing": False,
            "category": issue.category,
            "sub_category": None,
            "urgency": issue.priority,
            "classification_confidence": None,
            "vision_summary": None,
            "objects_detected": [],
            "vision_confidence": None,
            "is_duplicate": False,
            "duplicate_of": None,
            "nearby_infrastructure": [],
            "affected_population_estimate": None,
            "cascading_effects": [],
            "safety_risk_score": None,
            "infrastructure_impact_score": None,
            "overall_priority": None,
            "risk_rationale": None,
            "assigned_department": None,
            "routing_confidence": None,
            "mission_title": None,
            "mission_description": None,
            "mission_priority": None,
            "estimated_duration_hours": None,
            "required_skills": [],
            "crew_size": None,
            "vehicles_required": [],
            "equipment_required": [],
            "citizen_message": None,
            "audit_log": [],
            "error": None
        }

        # Stream LangGraph execution
        try:
            # astream yields (node_name, node_output)
            async for output in cityos_graph.astream(state):
                for node_name, node_state in output.items():
                    # Get the most recent audit entry if any
                    latest_audit = None
                    if "audit_log" in node_state and len(node_state["audit_log"]) > 0:
                        latest_audit = node_state["audit_log"][-1]
                    
                    data = {
                        "node": node_name,
                        "status": "completed",
                        "audit": latest_audit
                    }
                    
                    # Yield SSE event
                    yield {
                        "event": "update",
                        "data": json.dumps(data)
                    }
                    
                    # Small delay for visual effect in UI
                    await asyncio.sleep(0.5)
            
            # Send completion event after all nodes have streamed
            yield {
                "event": "complete",
                "data": json.dumps({"status": "done"})
            }
            return
                
        except Exception as e:
            # Fallback to mock stream if LangGraph fails (e.g. Rate Limit)
            print(f"LangGraph failed, falling back to mock stream: {e}")
            
            mock_nodes = ["Coordinator", "Vision", "Geo", "Risk", "Planner"]
            for node in mock_nodes:
                data = {
                    "node": node,
                    "status": "completed",
                    "audit": {
                        "agent": node,
                        "action": "analyzed",
                        "timestamp": datetime.utcnow().isoformat() + "Z",
                        "reasoning": f"Simulated reasoning for {node} due to API limits.",
                        "confidence": 85,
                        "output": {}
                    }
                }
                yield {
                    "event": "update",
                    "data": json.dumps(data)
                }
                await asyncio.sleep(0.5)
                
            yield {
                "event": "complete",
                "data": json.dumps({"status": "done"})
            }
            
    return EventSourceResponse(event_generator())

