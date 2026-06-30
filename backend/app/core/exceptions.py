from typing import Any, Dict, Optional

class CityOSError(Exception):
    """Base exception for CityOS AI"""
    def __init__(self, message: str, status_code: int = 500, details: Optional[Dict[str, Any]] = None):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.details = details or {}

class NotFoundError(CityOSError):
    def __init__(self, message: str = "Resource not found", details: Optional[Dict[str, Any]] = None):
        super().__init__(message, status_code=404, details=details)

class ValidationError(CityOSError):
    def __init__(self, message: str = "Validation error", details: Optional[Dict[str, Any]] = None):
        super().__init__(message, status_code=422, details=details)

class AuthenticationError(CityOSError):
    def __init__(self, message: str = "Authentication required", details: Optional[Dict[str, Any]] = None):
        super().__init__(message, status_code=401, details=details)

class AuthorizationError(CityOSError):
    def __init__(self, message: str = "Permission denied", details: Optional[Dict[str, Any]] = None):
        super().__init__(message, status_code=403, details=details)

class DatabaseError(CityOSError):
    def __init__(self, message: str = "Database operation failed", details: Optional[Dict[str, Any]] = None):
        super().__init__(message, status_code=500, details=details)
