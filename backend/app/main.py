from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from app.core.config import settings
from app.core.exceptions import CityOSError
from app.api.v1.router import api_router
from app.middleware.core import RequestIDMiddleware, TimingMiddleware
from app.schemas.common import ApiResponse, ErrorDetail
from app.utils.logger import logger, request_id_var

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    logger.info("CityOS AI Backend Starting Up...")
    settings.validate_setup()
    yield
    # Shutdown logic
    logger.info("CityOS AI Backend Shutting Down...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="Backend API for CityOS AI - Smart City Operating System",
    version="1.0.0",
    lifespan=lifespan,
)

# Core Middleware
app.add_middleware(TimingMiddleware)
app.add_middleware(RequestIDMiddleware)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=".*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception Handlers
@app.exception_handler(CityOSError)
async def cityos_exception_handler(request: Request, exc: CityOSError):
    logger.error(f"CityOSError: {exc.message}", exc_info=exc)
    response = ApiResponse(
        success=False,
        request_id=request_id_var.get(),
        errors=[ErrorDetail(code=exc.__class__.__name__, message=exc.message, details=exc.details)]
    )
    return JSONResponse(status_code=exc.status_code, content=response.model_dump())

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.warn(f"Validation Error: {exc.errors()}")
    response = ApiResponse(
        success=False,
        request_id=request_id_var.get(),
        errors=[ErrorDetail(code="ValidationError", message="Invalid request parameters", details=exc.errors())]
    )
    return JSONResponse(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, content=response.model_dump())

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled Exception: {str(exc)}", exc_info=True)
    response = ApiResponse(
        success=False,
        request_id=request_id_var.get(),
        errors=[ErrorDetail(code="InternalServerError", message="An unexpected error occurred")]
    )
    return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content=response.model_dump())

# Include routers
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/health", response_model=ApiResponse[dict], tags=["System"])
def health_check():
    return ApiResponse(success=True, data={"status": "healthy", "version": app.version})

@app.get("/ready", response_model=ApiResponse[dict], tags=["System"])
def ready_check():
    # TODO: Add Firebase connectivity check here in Phase B
    return ApiResponse(success=True, data={"status": "ready"})

@app.get("/", include_in_schema=False)
def root():
    return {"message": "Welcome to CityOS AI Backend API"}

