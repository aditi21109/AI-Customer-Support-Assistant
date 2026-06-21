from fastapi import APIRouter, Depends
from app.models.schemas import UserResponse
from app.auth.dependencies import get_current_user

router = APIRouter(prefix="/profile", tags=["User Profile"])

@router.get("", response_model=UserResponse)
def get_user_profile(current_user: dict = Depends(get_current_user)):
    """
    Returns the authenticated user's profile information.
    Authentication: Implicitly managed via get_current_user dependency.
    """
    # The dependency already attaches stringified 'id' and does database verification
    return current_user
