from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import asyncio

from app.db.firestore_client import FirestoreClient
from app.repositories.mission_repository import MissionRepository
from app.services.mission_service import MissionService
from app.models.mission import MissionCreate

router = APIRouter()

def get_mission_service() -> MissionService:
    client = FirestoreClient()
    repo = MissionRepository(client)
    return MissionService(repo)

class TransitionRequest(BaseModel):
    new_state: str
    metadata: Optional[Dict[str, Any]] = None

@router.post("")
async def create_mission(mission: MissionCreate):
    service = get_mission_service()
    mission_id = await service.create_mission(mission.model_dump())
    return {"id": mission_id, "status": "created"}

@router.post("/{mission_id}/transition")
async def transition_mission(mission_id: str, request: TransitionRequest):
    service = get_mission_service()
    try:
        await service.transition_state(mission_id, request.new_state, request.metadata)
        return {"status": "success", "new_state": request.new_state}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{mission_id}/assign")
async def assign_mission(mission_id: str, request: Dict[str, Any]):
    service = get_mission_service()
    try:
        await service.assign_mission(mission_id, request.get("crew_id"), request.get("department_id"))
        return {"status": "assigned"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

async def run_demo_lifecycle(mission_id: str):
    """Background task to advance a mission automatically through its lifecycle."""
    service = get_mission_service()
    try:
        states = ["Assigned", "Crew Dispatched", "In Progress", "Awaiting Verification", "Verified"]
        
        # We start by assigning if it's draft
        mission = await service.repository.get_by_id(mission_id)
        if mission and mission.get("state") == "Draft":
            await service.assign_mission(mission_id)
            await asyncio.sleep(3)
        
        # Now we walk through remaining states
        for state in ["Crew Dispatched", "In Progress", "Awaiting Verification", "Verified"]:
            await service.transition_state(mission_id, state)
            
            # If in progress, let's simulate progress updates
            if state == "In Progress":
                for prog in [25, 50, 75, 100]:
                    await service.repository.update(mission_id, {"progress": prog})
                    await asyncio.sleep(1.5)
            else:
                await asyncio.sleep(3)
                
    except Exception as e:
        print(f"Demo mode failed for {mission_id}: {e}")

@router.post("/demo/lifecycle/{mission_id}")
async def trigger_demo_lifecycle(mission_id: str, background_tasks: BackgroundTasks):
    background_tasks.add_task(run_demo_lifecycle, mission_id)
    return {"status": "demo_started"}
