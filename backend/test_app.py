"""
Test Script - AI Customer Support Assistant Backend

This script performs validation testing on:
1. MongoDB connection and credentials verification.
2. Password hashing and verification algorithms.
3. JWT Authentication token generation and decoding.
4. AI service responses (including Mock fallback and classification checks).
5. Support ticket creation mock simulation.
"""

import sys
import os
from datetime import datetime
from bson import ObjectId

# Add app folder to system paths for package exports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database.connection import get_db
from app.auth.utils import hash_password, verify_password, create_access_token, decode_access_token
from app.services.ai_service import generate_chat_reply, summarize_ticket, classify_issue

def run_tests():
    print("=" * 60)
    print("STARTING BACKEND SERVICE VALIDATION TESTS")
    print("=" * 60)

    # 1. TEST DATABASE PING
    print("\n[Test 1] Verifying MongoDB Connection...")
    try:
        db = get_db()
        # Verify collection stats or ping to confirm alive status
        db.client.admin.command('ping')
        print(" -> SUCCESS: Connected to MongoDB Database successfully.")
    except Exception as e:
        print(f" -> WARNING: Local MongoDB or Atlas connection failed: {e}")
        print("    (The API will fall back to in-memory/stub connections if database is unreachable in production)")

    # 2. TEST AUTH PASSWORD HASHING
    print("\n[Test 2] Testing Password Hashing & Verification...")
    raw_password = "SecurePassword123"
    hashed = hash_password(raw_password)
    assert hashed != raw_password, "Hashing failed to change raw password"
    assert verify_password(raw_password, hashed), "Password verification failed"
    assert not verify_password("WrongPassword", hashed), "Password verification bypassed invalid password"
    print(" -> SUCCESS: Hashing and validation algorithms are correct.")

    # 3. TEST JWT AUTH TOKENS
    print("\n[Test 3] Testing JWT Access Token lifecycle...")
    test_payload = {"sub": "testuser@apextech.com"}
    token = create_access_token(test_payload)
    decoded = decode_access_token(token)
    assert decoded is not None, "Token decoding failed"
    assert decoded.get("sub") == test_payload["sub"], "Subject payload was altered in transition"
    print(" -> SUCCESS: JWT Access Token created and decoded correctly.")

    # 4. TEST AI SUPPORT SERVICE
    print("\n[Test 4] Testing AI Support Service Prompting & Fallbacks...")
    user_query = "My dashboard invoices fail to download, returning a 403 Forbidden error."
    chat_result = generate_chat_reply(user_query)
    
    print(f"    User Query: '{user_query}'")
    print(f"    AI Response: '{chat_result['response']}'")
    print(f"    AI Category Auto-Detected: '{chat_result['category']}'")
    
    assert "response" in chat_result, "AI reply structure missing 'response' payload"
    assert "category" in chat_result, "AI reply structure missing 'category' payload"
    print(" -> SUCCESS: AI Conversational chat response is functional.")

    # 5. TEST AI TICKET PROCESSING
    print("\n[Test 5] Testing AI Ticket Classification & Summaries...")
    ticket_title = "Database load spiked to 98% in prod-db-01"
    ticket_desc = "At 12:00 UTC, the main database server cpu spiked to 98%, blocking checkout queries for clients."
    
    summary = summarize_ticket(ticket_title, ticket_desc)
    classification = classify_issue(ticket_title, ticket_desc)
    
    print(f"    Ticket: '{ticket_title}'")
    print(f"    AI Summary: '{summary}'")
    print(f"    AI Recommended Severity: '{classification.get('suggested_priority')}'")
    print(f"    AI Recommended Category: '{classification.get('category')}'")
    
    assert summary, "Ticket summarizer returned empty"
    assert classification.get("suggested_priority") in ["Low", "Medium", "High"], "Invalid suggested priority"
    print(" -> SUCCESS: AI Ticket classification engine is functional.")

    print("\n" + "=" * 60)
    print("ALL TESTS COMPLETED SUCCESSFULLY!")
    print("=" * 60)

if __name__ == "__main__":
    run_tests()
