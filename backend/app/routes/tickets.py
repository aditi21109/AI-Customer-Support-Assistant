from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from datetime import datetime
from bson import ObjectId
from app.database.connection import get_db
from app.models.schemas import TicketCreate, TicketUpdate, TicketResponse
from app.auth.dependencies import get_current_user

router = APIRouter(prefix="/tickets", tags=["Ticket Management"])

@router.post("", response_model=TicketResponse, status_code=status.HTTP_201_CREATED)
def create_ticket(
    payload: TicketCreate,
    current_user: dict = Depends(get_current_user)
):
    """
    Submits a new support ticket to the system.
    Inputs: Title, description, and optional priority.
    Processes: Sets default status to 'Open' and maps it to the current user's profile.
    Returns: The created ticket with its assigned database ID.
    """
    db = get_db()
    user_id_str = current_user["id"]
    
    # Construct database ticket document
    new_ticket = {
        "user_id": user_id_str,
        "title": payload.title,
        "description": payload.description,
        "priority": payload.priority,
        "status": "Open",
        "created_at": datetime.utcnow()
    }
    
    result = db.tickets.insert_one(new_ticket)
    
    new_ticket["id"] = str(result.inserted_id)
    return new_ticket

@router.get("", response_model=List[TicketResponse])
def get_user_tickets(current_user: dict = Depends(get_current_user)):
    """
    Retrieves all support tickets submitted by the currently logged-in user.
    """
    db = get_db()
    user_id_str = current_user["id"]
    
    tickets = list(db.tickets.find({"user_id": user_id_str}).sort("created_at", -1))
    
    # Format MongoDB documents into standard Pydantic response models
    formatted_tickets = []
    for ticket in tickets:
        ticket["id"] = str(ticket["_id"])
        formatted_tickets.append(ticket)
        
    return formatted_tickets

@router.put("/{ticket_id}", response_model=TicketResponse)
def update_ticket(
    ticket_id: str,
    payload: TicketUpdate,
    current_user: dict = Depends(get_current_user)
):
    """
    Updates the state of an existing ticket.
    Inputs: Ticket ID in URL, and update body (status, priority).
    Processes: Updates attributes inside MongoDB.
    """
    db = get_db()
    user_id_str = current_user["id"]
    
    # Validate MongoDB ObjectId format
    if not ObjectId.is_valid(ticket_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid ticket ID format"
        )
        
    # Search for ticket, ensuring it belongs to current user
    ticket = db.tickets.find_one({"_id": ObjectId(ticket_id), "user_id": user_id_str})
    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found or unauthorized access"
        )
        
    # Build dynamic update fields dictionary
    update_data = {}
    if payload.status is not None:
        update_data["status"] = payload.status
    if payload.priority is not None:
        update_data["priority"] = payload.priority
        
    # Update if we have fields to edit
    if update_data:
        db.tickets.update_one({"_id": ObjectId(ticket_id)}, {"$set": update_data})
        
    # Reload ticket from DB to return complete, fresh fields
    updated_ticket = db.tickets.find_one({"_id": ObjectId(ticket_id)})
    updated_ticket["id"] = str(updated_ticket["_id"])
    
    return updated_ticket
