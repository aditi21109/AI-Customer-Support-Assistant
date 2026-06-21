import logging
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

# Import routers from app subfolders
from app.routes import auth, chat, tickets, user

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="AI Customer Support Assistant API",
    description="Backend service providing JWT Authentication, AI Support chat via Gemini, and Ticket management",
    version="1.0.0"
)

# CORS middleware configuration to connect with our React frontend (Vite)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact domains like ["http://localhost:5173", "https://yourfrontend.vercel.app"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers with prefixing
app.include_router(auth.router, prefix="/api")
app.include_router(chat.router, prefix="/api")
app.include_router(tickets.router, prefix="/api")
app.include_router(user.router, prefix="/api")

# --- GLOBAL ERROR HANDLING (STEP 7) ---

@app.exception_handler(StarletteHTTPException)
def http_exception_handler(request: Request, exc: StarletteHTTPException):
    """Intercepts and formats Starlette/FastAPI HTTPExceptions."""
    logger.error(f"HTTP Error: {exc.status_code} - {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"success": False, "error": exc.detail}
    )

@app.exception_handler(RequestValidationError)
def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Intercepts and formats input validation errors (Pydantic model violations)."""
    logger.error(f"Validation Error: {exc.errors()}")
    # Simplify validation error messages for the frontend client
    error_messages = [f"{'.'.join(str(p) for p in err['loc'])}: {err['msg']}" for err in exc.errors()]
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"success": False, "error": "Validation failed", "details": error_messages}
    )

@app.exception_handler(Exception)
def generic_exception_handler(request: Request, exc: Exception):
    """Intercepts and formats any unhandled internal server exceptions."""
    logger.error(f"Unhandled Server Error: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"success": False, "error": "An unexpected internal server error occurred."}
    )

@app.get("/")
def read_root():
    """Root route to check service health."""
    return {"message": "AI Customer Support Assistant API is running smoothly!"}
