from fastapi import APIRouter
from datetime import datetime

router = APIRouter()

@router.get("/timeline")
async def get_replay_timeline():
    """Generates the chronological event timeline for City Replay™."""
    return [
        {
            "id": "e1",
            "timestamp": "2026-10-24T09:42:15Z",
            "actor": "Citizen",
            "action": "Issue Reported",
            "details": "Citizen uploaded a photo of a large pothole on Hospital Road.",
            "location": {"lat": 18.5204, "lng": 73.8567, "address": "Hospital Road"}
        },
        {
            "id": "e2",
            "timestamp": "2026-10-24T09:42:17Z",
            "actor": "Vision Agent",
            "action": "Analyzed Image",
            "details": "Detected severe asphalt degradation and water accumulation.",
            "confidence": 97
        },
        {
            "id": "e3",
            "timestamp": "2026-10-24T09:42:21Z",
            "actor": "Risk Agent",
            "action": "Priority Escalated",
            "details": "Marked CRITICAL due to ambulance route proximity and heavy rain forecast.",
            "confidence": 92
        },
        {
            "id": "e4",
            "timestamp": "2026-10-24T09:42:28Z",
            "actor": "Planning Agent",
            "action": "Mission Created",
            "details": "Merged with nearby water leak report to optimize repair crew deployment.",
        },
        {
            "id": "e5",
            "timestamp": "2026-10-24T14:15:00Z",
            "actor": "System",
            "action": "Repair Completed",
            "details": "Public Works & Water Supply department closed the work order."
        },
        {
            "id": "e6",
            "timestamp": "2026-10-24T15:30:00Z",
            "actor": "Citizen",
            "action": "Verification Upload",
            "details": "Nearby citizen verified the repair with a photo."
        },
        {
            "id": "e7",
            "timestamp": "2026-10-24T15:30:05Z",
            "actor": "Verification Agent",
            "action": "Repair Confirmed",
            "details": "Compared Before and After photos. Issue fully resolved.",
            "confidence": 99
        }
    ]
