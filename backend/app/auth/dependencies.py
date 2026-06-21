from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from bson import ObjectId
from app.database.connection import get_db
from app.auth.utils import decode_access_token

# Define the OAuth2 security scheme which extracts the Bearer token from headers
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme)):
    """
    FastAPI dependency injection to authenticate and authorize requests.
    Validates token, verifies user existence in MongoDB, and returns current user details.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception
        
    email: str = payload.get("sub")
    if email is None:
        raise credentials_exception
        
    db = get_db()
    # Find the user by their email address
    user = db.users.find_one({"email": email})
    if user is None:
        raise credentials_exception
        
    # Standardize MongoDB document structure by converting _id to id string
    user["id"] = str(user["_id"])
    return user
