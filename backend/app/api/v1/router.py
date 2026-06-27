from fastapi import APIRouter
from app.api.v1 import health, issues, agents, analyze, orchestration, mission_control, predictive, community, copilot, replay

api_router = APIRouter()

api_router.include_router(health.router, tags=["health"])
api_router.include_router(issues.router, prefix="/issues", tags=["issues"])
api_router.include_router(agents.router, prefix="/agents", tags=["agents"])
api_router.include_router(analyze.router, prefix="/analyze", tags=["analyze"])
api_router.include_router(orchestration.router, prefix="/orchestration", tags=["orchestration"])
api_router.include_router(mission_control.router, prefix="/mission-control", tags=["mission-control"])
api_router.include_router(predictive.router, prefix="/predictive", tags=["predictive"])
api_router.include_router(community.router, prefix="/community", tags=["community"])
api_router.include_router(copilot.router, prefix="/copilot", tags=["copilot"])
api_router.include_router(replay.router, prefix="/replay", tags=["replay"])
