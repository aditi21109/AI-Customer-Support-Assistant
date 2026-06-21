from fastapi import APIRouter, HTTPException, status, Depends
from datetime import datetime
from app.database.connection import get_db
from app.models.schemas import UserRegister, UserLogin, UserResponse, Token
from app.auth.utils import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user_data: UserRegister):
    """
    Registers a new user inside MongoDB database.
    Inputs: Name, email (validated format), and password (min length 6).
    Processes: 
      1. Checks if email is already in use.
      2. Hashes the password securely.
      3. Saves document to MongoDB.
    Returns: User details without password, and assigns stringified MongoDB _id as 'id'.
    """
    db = get_db()
    
    # Check if user already exists
    existing_user = db.users.find_one({"email": user_data.email.lower()})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists"
        )
    
    # Construct database document
    new_user = {
        "name": user_data.name,
        "email": user_data.email.lower(),
        "password": hash_password(user_data.password),
        "created_at": datetime.utcnow()
    }
    
    # Write to MongoDB
    result = db.users.insert_one(new_user)
    
    # Fetch inserted document to structure response
    new_user["id"] = str(result.inserted_id)
    return new_user

@router.post("/login", response_model=Token)
def login_user(credentials: UserLogin):
    """
    Validates user credentials and issues a JWT authorization token.
    Inputs: Email and password.
    Processes:
      1. Searches for user email in database.
      2. Compares credential password hash with stored hash.
      3. Creates JWT access token with user email subject.
    Returns: Access token and token type bearer.
    """
    db = get_db()
    
    user = db.users.find_one({"email": credentials.email.lower()})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
        
    if not verify_password(credentials.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
        
    # Generate token
    token_data = {"sub": user["email"]}
    access_token = create_access_token(data=token_data)
    
    return {"access_token": access_token, "token_type": "bearer"}
