import os
import sys
import uuid
import datetime
import random
from typing import List, Dict, Any
import asyncio

# Ensure app is in path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.db.firestore_client import FirestoreClient
from app.core.config import settings

def get_timestamp_offset(hours: int = 0) -> str:
    dt = datetime.datetime.utcnow() + datetime.timedelta(hours=hours)
    return dt.isoformat() + "Z"

ISSUES: List[Dict[str, Any]] = [
    {
        "id": "i-1",
        "title": "Drainage failure",
        "description": "Computer vision detected a collapsed storm drain near a school zone; rising water level.",
        "category": "water",
        "priority": "critical",
        "status": "in_progress",
        "location": {
            "lat": 18.5034,
            "lng": 73.8114,
            "address": "Kothrud",
        },
        "tags": ["flood", "school-zone"],
        "reportedBy": "vision-agent",
        "reporterName": "Vision AI",
        "createdAt": get_timestamp_offset(-2),
        "updatedAt": get_timestamp_offset(-1),
        "aiSummary": "High risk of localized flooding due to drainage collapse.",
        "aiPriorityScore": 0.96,
        "views": 42,
        "upvotes": 12,
        "comments": 2
    },
    {
        "id": "i-2",
        "title": "Severe pothole cluster",
        "description": "Multiple large potholes reported on main arterial road causing severe traffic slowdowns.",
        "category": "road",
        "priority": "high",
        "status": "open",
        "location": {
            "lat": 18.5204,
            "lng": 73.8567,
            "address": "Shivaji Nagar",
        },
        "tags": ["traffic", "potholes"],
        "reportedBy": "citizen-123",
        "reporterName": "Rahul S.",
        "createdAt": get_timestamp_offset(-5),
        "updatedAt": get_timestamp_offset(-5),
        "aiSummary": "Road degradation impacting 500+ vehicles/hr.",
        "aiPriorityScore": 0.85,
        "views": 105,
        "upvotes": 45,
        "comments": 12
    },
    {
        "id": "i-3",
        "title": "Fallen tree blocking lane",
        "description": "Large branch fell during recent storm, blocking the left lane.",
        "category": "vegetation",
        "priority": "medium",
        "status": "resolved",
        "location": {
            "lat": 18.5362,
            "lng": 73.8969,
            "address": "Koregaon Park",
        },
        "tags": ["storm", "road-block"],
        "reportedBy": "citizen-456",
        "reporterName": "Priya M.",
        "createdAt": get_timestamp_offset(-48),
        "updatedAt": get_timestamp_offset(-24),
        "resolvedAt": get_timestamp_offset(-24),
        "aiSummary": "Resolved tree blockage in Koregaon Park.",
        "aiPriorityScore": 0.65,
        "views": 30,
        "upvotes": 5,
        "comments": 1
    },
]

async def seed():
    # Force emulator mode if not explicitly set
    os.environ["FIRESTORE_EMULATOR_HOST"] = os.environ.get("FIRESTORE_EMULATOR_HOST", "127.0.0.1:8080")
    
    # Optional: If the user provides real credentials, we won't override them if they removed the emulator host
    if settings.FIREBASE_CREDENTIALS_PATH:
        if "FIRESTORE_EMULATOR_HOST" in os.environ:
            del os.environ["FIRESTORE_EMULATOR_HOST"]
            
    print("Initializing Firestore Client...")
    db = FirestoreClient(project_id=settings.FIREBASE_PROJECT_ID or "demo-cityos")
    
    if not db.db:
        print("Failed to connect to Firestore. Ensure emulators are running or credentials are valid.")
        return

    print("Seeding Issues...")
    for issue in ISSUES:
        await db.create_document("issues", issue["id"], issue)
        print(f"  Created issue: {issue['id']}")

    print("Seeding complete!")

if __name__ == "__main__":
    asyncio.run(seed())
