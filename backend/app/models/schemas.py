from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

# --- AUTH SCHEMAS ---

class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=50, description="User's full name")
    email: EmailStr = Field(..., description="Unique email address")
    password: str = Field(..., min_length=6, description="Minimum 6 character password")

class UserLogin(BaseModel):
    email: EmailStr = Field(..., description="User email")
    password: str = Field(..., description="User password")

class UserResponse(BaseModel):
    id: str = Field(..., description="User ID string converted from MongoDB ObjectId")
    name: str
    email: EmailStr
    created_at: datetime

    class Config:
        json_schema_extra = {
            "example": {
                "id": "60d5ec49c9e83c31b8a53e6b",
                "name": "Jane Doe",
                "email": "jane@example.com",
                "created_at": "2026-06-21T12:00:00Z"
            }
        }

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    email: Optional[str] = None


# --- CHAT SCHEMAS ---

class ChatMessageRequest(BaseModel):
    message: str = Field(..., min_length=1, description="Message text sent by the user to the support assistant")

class ChatResponse(BaseModel):
    id: str = Field(..., description="Chat message log ID")
    user_id: str
    message: str
    response: str
    category: str
    timestamp: datetime


# --- TICKET SCHEMAS ---

class TicketCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=100)
    description: str = Field(..., min_length=10)
    priority: str = Field("Medium", description="Low, Medium, or High")

class TicketUpdate(BaseModel):
    status: Optional[str] = Field(None, description="Open, In Progress, or Resolved")
    priority: Optional[str] = Field(None, description="Low, Medium, or High")

class TicketResponse(BaseModel):
    id: str = Field(..., description="Ticket ID string converted from MongoDB ObjectId")
    user_id: str
    title: str
    description: str
    status: str
    priority: str
    created_at: datetime
