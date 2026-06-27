from fastapi import APIRouter
from app.core.firebase import get_db

router = APIRouter()

@router.get("/health")
def health_check():
    """Basic health check endpoint"""
    db = get_db()
    db_status = "connected" if db else "not configured (mock mode)"
    
    return {
        "status": "ok",
        "service": "CityOS AI Backend",
        "database": db_status
    }
