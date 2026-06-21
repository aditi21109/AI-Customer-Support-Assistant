from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from datetime import datetime
from app.database.connection import get_db
from app.models.schemas import ChatMessageRequest, ChatResponse
from app.auth.dependencies import get_current_user
from app.services.ai_service import generate_chat_reply

router = APIRouter(prefix="/chat", tags=["AI Chat Support"])

@router.post("", response_model=ChatResponse)
def submit_chat_message(
    payload: ChatMessageRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Submits a message to the support AI.
    Processes:
      1. Retrieves previous chats for history context (up to 5).
      2. Invokes the AI Service (Gemini API or mock handler).
      3. Saves the conversation log into the 'chats' collection in MongoDB.
    Returns: Complete details including response text and auto-detected category.
    """
    db = get_db()
    user_id_str = current_user["id"]
    
    # 1. Fetch user's message history to feed as context for LLM
    raw_history = list(db.chats.find({"user_id": user_id_str}).sort("timestamp", 1).limit(5))
    
    # Convert _id to string for safety in service usage
    history = []
    for chat in raw_history:
        chat["_id"] = str(chat["_id"])
        history.append(chat)
        
    # 2. Query LLM to receive support assistant reply and categorization
    ai_result = generate_chat_reply(payload.message, history=history)
    
    # 3. Store conversation history document
    chat_doc = {
        "user_id": user_id_str,
        "message": payload.message,
        "response": ai_result["response"],
        "category": ai_result["category"],
        "timestamp": datetime.utcnow()
    }
    
    result = db.chats.insert_one(chat_doc)
    
    # Structure returned response
    chat_doc["id"] = str(result.inserted_id)
    return chat_doc

@router.get("/history", response_model=List[ChatResponse])
def get_chat_history(current_user: dict = Depends(get_current_user)):
    """
    Fetches the history of support chats for the authenticated user.
    """
    db = get_db()
    user_id_str = current_user["id"]
    
    chats = list(db.chats.find({"user_id": user_id_str}).sort("timestamp", 1))
    
    # Convert MongoDB IDs for compliance with Pydantic schema
    formatted_chats = []
    for chat in chats:
        chat["id"] = str(chat["_id"])
        formatted_chats.append(chat)
        
    return formatted_chats
