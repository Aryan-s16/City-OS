from typing import Dict, Any, List
from datetime import datetime
from app.repositories.mission_repository import MissionRepository
from app.core.events import event_bus

class MissionService:
    def __init__(self, repository: MissionRepository):
        self.repository = repository

    VALID_TRANSITIONS = {
        "Draft": ["Assigned"],
        "Assigned": ["Crew Dispatched"],
        "Crew Dispatched": ["In Progress"],
        "In Progress": ["Blocked", "Awaiting Verification", "Completed"],
        "Blocked": ["In Progress"],
        "Awaiting Verification": ["Verified", "In Progress"],
        "Completed": ["Verified"],
        "Verified": []
    }

    async def create_mission(self, data: Dict[str, Any]) -> str:
        # Create a new mission from an issue
        mission_id = await self.repository.create(data)
        
        # Publish event
        await event_bus.publish("MissionCreated", {"mission_id": mission_id, "data": data})
        return mission_id

    async def transition_state(self, mission_id: str, new_state: str, metadata: Dict[str, Any] = None) -> None:
        mission = await self.repository.get_by_id(mission_id)
        if not mission:
            raise ValueError(f"Mission {mission_id} not found")

        current_state = mission.get("state", "Draft")
        allowed = self.VALID_TRANSITIONS.get(current_state, [])
        
        if new_state not in allowed:
            raise ValueError(f"Invalid transition from {current_state} to {new_state}")

        await self.repository.update_state(mission_id, new_state, metadata)
        
        # Determine event to fire
        event_name = f"Mission{new_state.replace(' ', '')}"
        await event_bus.publish(event_name, {"mission_id": mission_id, "metadata": metadata})

    async def assign_mission(self, mission_id: str, crew_id: str = None, department_id: str = None) -> None:
        # Simple heuristic: if no crew, pick a random one based on category
        if not crew_id:
            crew_id = "c-1" # Mock assignment
            
        update_data = {
            "crew_id": crew_id,
            "department_id": department_id or "d-water",
            "crew_name": "Water · Crew 7" # Mock
        }
        
        await self.repository.update(mission_id, update_data)
        await self.transition_state(mission_id, "Assigned", update_data)
