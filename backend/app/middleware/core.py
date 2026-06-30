import time
import uuid
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request
from app.utils.logger import request_id_var, logger

class RequestIDMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
        request_id_var.set(request_id)
        
        # Attach to request state for use in routes if needed
        request.state.request_id = request_id
        
        response = await call_next(request)
        response.headers["X-Request-ID"] = request_id
        return response

class TimingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.perf_counter()
        
        response = await call_next(request)
        
        process_time = time.perf_counter() - start_time
        response.headers["X-Process-Time"] = str(process_time)
        logger.info(f"{request.method} {request.url.path} completed in {process_time:.4f}s")
        return response
