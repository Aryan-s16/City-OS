from fastapi import APIRouter

router = APIRouter()

@router.get("/trust/{user_id}")
async def get_trust_score(user_id: str):
    """Returns the reputation and trust score for a citizen."""
    return {
        "userId": user_id,
        "score": 92,
        "verifiedReports": 14,
        "falseReports": 0,
        "helpfulComments": 45,
        "level": "Community Hero"
    }

@router.get("/discussions/summary")
async def get_discussion_summary():
    """Returns AI-summarized insights from community discussions."""
    return {
        "topics": [
            "Residents report worsening traffic on Hospital Road during evenings.",
            "Water accumulation observed after recent rainfall in Zone 3.",
            "School buses delayed due to ongoing streetlight maintenance."
        ],
        "sentiment": "concerned",
        "engagementLevel": "high"
    }

@router.post("/verify")
async def submit_verification():
    """Mock endpoint for citizens submitting verification photos."""
    return {"status": "success", "aiConfidenceMatch": 94, "trustEarned": 5}
