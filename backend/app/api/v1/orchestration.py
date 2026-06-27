from fastapi import APIRouter, Request
from sse_starlette.sse import EventSourceResponse
from pydantic import BaseModel
from typing import Optional, Dict, Any
import json
import asyncio
from app.agents.coordinator.graph import create_coordinator_graph

router = APIRouter()
graph = create_coordinator_graph()

class OrchestrationRequest(BaseModel):
    issue_id: str
    report_method: str
    title: str
    description: str
    category: str
    location: Optional[Dict[str, Any]] = None
    image_base64: Optional[str] = None

@router.post("/execute")
async def execute_agents(request: OrchestrationRequest):
    """
    Execute the multi-agent workflow via SSE stream.
    """
    initial_state = {
        "issue_id": request.issue_id,
        "report_method": request.report_method,
        "title": request.title,
        "description": request.description,
        "category": request.category,
        "location": request.location,
        "image_base64": request.image_base64,
        "current_agent": "Coordinator",
        "agent_states": {
            "vision": "pending",
            "duplicateCheck": "pending",
            "riskAssessment": "pending",
            "departmentRouting": "pending",
            "planning": "pending",
            "communication": "pending"
        },
        "status": "running",
        "errors": [],
        "logs": [],
        "timeline": [],
        "vision_result": None,
        "duplicate_result": None,
        "risk_result": None,
        "routing_result": None,
        "planning_result": None,
        "communication_result": None
    }
    
    async def event_generator():
        try:
            # Yield initial state
            yield {
                "event": "state",
                "data": json.dumps(initial_state)
            }
            
            # Artificial delay for demo visualization
            await asyncio.sleep(1.0)
            
            for output in graph.stream(initial_state):
                # output is a dict like {'vision': {'current_agent': ...}}
                for node_name, state in output.items():
                    # We only want to stream the updated state back to the client
                    # Clean up base64 so it doesn't bloat the SSE if we don't need it
                    clean_state = dict(state)
                    if "image_base64" in clean_state:
                        clean_state["image_base64"] = "[Omitted for transport]"
                        
                    yield {
                        "event": "state",
                        "data": json.dumps(clean_state)
                    }
                    # Give UI time to animate between agents
                    await asyncio.sleep(2.0)
                    
            # Final event
            yield {
                "event": "end",
                "data": "done"
            }
        except Exception as e:
            yield {
                "event": "error",
                "data": json.dumps({"error": str(e)})
            }
            
    return EventSourceResponse(event_generator())
