from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.firebase import get_auth

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Validate Firebase ID token and return user uid"""
    token = credentials.credentials
    auth_client = get_auth()
    
    if not auth_client:
        # Development bypass if firebase not configured
        return {"uid": "mock-user-123", "email": "mock@example.com", "role": "admin"}
        
    try:
        decoded_token = auth_client.verify_id_token(token)
        return decoded_token
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

def require_role(allowed_roles: list[str]):
    """Dependency to check if user has required role"""
    def role_checker(user: dict = Depends(get_current_user)):
        # TODO: In production, fetch role from Firestore users collection
        user_role = user.get("role", "citizen")
        if user_role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Operation not permitted. Required roles: {', '.join(allowed_roles)}"
            )
        return user
    return role_checker
