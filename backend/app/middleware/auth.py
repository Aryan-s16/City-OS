from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request
from app.core.exceptions import AuthenticationError

class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # TODO: Phase C / Production - Implement actual JWT or Firebase Auth token validation here
        # For Phase B, we skip strict validation to allow local dev/testing
        
        # Example structure:
        # auth_header = request.headers.get("Authorization")
        # if not auth_header and request.url.path.startswith("/api/v1/protected"):
        #     raise AuthenticationError("Missing token")
        
        response = await call_next(request)
        return response
