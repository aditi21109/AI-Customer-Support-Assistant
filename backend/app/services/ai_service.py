"""
AI Service - Gemini API Integration

WHAT IS AN LLM?
A Large Language Model (LLM) is a machine learning model trained on vast amounts of text
data. It understands and generates human-like text by predicting the next most likely word
given a prompt context.

WHAT IS PROMPT ENGINEERING?
Prompt engineering is the process of structuring instructions, rules, constraints, and
context for an LLM to elicit high-quality, targeted responses. By adjusting the role, style,
tone, and format instructions in the prompt, we guide the AI to behave like a polite, professional
customer support agent.

HOW API INTEGRATION WORKS:
The FastAPI backend makes HTTP requests to Google's Gemini servers via the google-generativeai SDK.
We authenticate using an API key, send a payload containing our prompts and conversation history,
and receive a JSON response containing the text completion.
"""

import os
import json
import logging
import google.generativeai as genai
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

# Configure Gemini SDK
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        # Using gemini-1.5-flash as it is fast and efficient for conversational workflows
        model = genai.GenerativeModel("gemini-1.5-flash")
        logger.info("Gemini API initialized successfully.")
    except Exception as e:
        logger.error(f"Error initializing Gemini SDK: {e}")
        model = None
else:
    logger.warning("GEMINI_API_KEY not found in environment. Running in Mock/Fallback mode.")
    model = None


def generate_chat_reply(message: str, history: list = None) -> dict:
    """
    Generates a helpful, polite customer support response.
    Also returns a classification category for the query.
    
    Returns:
        dict: {"response": str, "category": str}
    """
    # 1. Fallback / Mock behavior if API key is not configured
    if not model:
        return _mock_chat_reply(message)

    # 2. Build conversation history context
    history_context = ""
    if history:
        for chat in history[-5:]:  # Keep last 5 messages for context window efficiency
            history_context += f"Customer: {chat.get('message')}\nSupport Agent: {chat.get('response')}\n"

    # 3. Construct prompt engineering instruction
    system_prompt = (
        "You are an empathetic, highly skilled Customer Support Assistant for a modern software platform called 'ApexTech'.\n"
        "Instructions:\n"
        "- Reply to the customer's question in a professional, polite, and brief manner (under 3 sentences).\n"
        "- Do not make up answers. Suggest creating a support ticket if the issue requires manual database editing, refund approval, or account reset.\n"
        "- Provide your response in valid raw JSON format containing exactly two keys: 'reply' (your text response) and 'category' (classify the message into one of: 'Technical', 'Billing', 'Account', 'General'). Do not include any markdown styling like ```json.\n"
        f"\nConversation History Context:\n{history_context}"
        f"Customer's Message: {message}\n"
    )

    try:
        response = model.generate_content(system_prompt)
        text_response = response.text.strip()
        
        # Clean potential markdown wrappers
        if text_response.startswith("```"):
            text_response = text_response.split("```")[1]
            if text_response.startswith("json"):
                text_response = text_response[4:]
        
        data = json.loads(text_response.strip())
        return {
            "response": data.get("reply", "Thank you for contacting customer support. How can I help you today?"),
            "category": data.get("category", "General")
        }
    except Exception as e:
        logger.error(f"Gemini API chat error: {e}")
        # Default safety fallback if JSON parsing or API request fails
        return {
            "response": f"I received your message: '{message}'. How can I help assist you with this issue? Feel free to open a ticket if it is urgent.",
            "category": "General"
        }


def summarize_ticket(title: str, description: str) -> str:
    """
    Summarizes a complex ticket description into a one-sentence overview.
    """
    if not model:
        return f"Ticket Summary: User reports issue: '{title}' ({description[:40]}...)"

    prompt = (
        "You are a technical support coordinator. Read the following support ticket and write a one-sentence summary (under 20 words) "
        "highlighting the core issue.\n"
        f"Ticket Title: {title}\n"
        f"Ticket Description: {description}\n"
        "Summary:"
    )

    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        logger.error(f"Gemini API ticket summary error: {e}")
        return f"Summary: Customer requires help with: {title}"


def classify_issue(title: str, description: str) -> dict:
    """
    Classifies a ticket to recommend a priority and a department category.
    Returns:
        dict: {"category": str, "suggested_priority": str}
    """
    if not model:
        # Simplistic rule-based categorization
        desc_lower = description.lower() + " " + title.lower()
        priority = "Low"
        category = "General"
        
        if "down" in desc_lower or "crash" in desc_lower or "broken" in desc_lower:
            priority = "High"
            category = "Technical"
        elif "payment" in desc_lower or "billing" in desc_lower or "charge" in desc_lower or "invoice" in desc_lower:
            priority = "Medium"
            category = "Billing"
        elif "password" in desc_lower or "login" in desc_lower or "account" in desc_lower:
            priority = "Medium"
            category = "Account"
            
        return {"category": category, "suggested_priority": priority}

    prompt = (
        "You are a ticket sorting assistant. Classify the support ticket based on its severity and context.\n"
        "Analyze this ticket:\n"
        f"Title: {title}\n"
        f"Description: {description}\n\n"
        "Respond ONLY with a JSON block containing 'category' (choose from: Technical, Billing, Account, General) "
        "and 'suggested_priority' (choose from: Low, Medium, High). Do not include markdown code block syntax."
    )

    try:
        response = model.generate_content(prompt)
        text_response = response.text.strip()
        if text_response.startswith("```"):
            text_response = text_response.split("```")[1]
            if text_response.startswith("json"):
                text_response = text_response[4:]
        data = json.loads(text_response.strip())
        return {
            "category": data.get("category", "General"),
            "suggested_priority": data.get("suggested_priority", "Medium")
        }
    except Exception as e:
        logger.error(f"Gemini API ticket classification error: {e}")
        return {"category": "General", "suggested_priority": "Medium"}


# --- INTERNAL HELPERS FOR OFFLINE MOCK MODE ---

def _mock_chat_reply(message: str) -> dict:
    """Provides fallback rule-based answers when Gemini API is unconfigured."""
    msg = message.lower()
    
    # 1. Greetings & Salutations
    if msg.strip() in ["hi", "hello", "hey", "hey there", "greetings", "yo"]:
        return {
            "response": "Hello! Welcome to ApexTech Customer Support. How can I help you today?",
            "category": "General"
        }
    
    # 2. Profile pictures and custom images (user query check!)
    elif "picture" in msg or "photo" in msg or "avatar" in msg or "image" in msg or "profile pic" in msg:
        return {
            "response": "Currently, we only support name-based text avatars in user profiles. We plan to release custom profile pictures in our next release! You can view your current account details in the Profile tab.",
            "category": "Account"
        }
        
    # 3. Billing & Refund queries
    elif "billing" in msg or "payment" in msg or "price" in msg or "refund" in msg or "charge" in msg or "invoice" in msg:
        return {
            "response": "For your security, I cannot directly view or process billing details. Please navigate to the Tickets page and submit a Billing ticket so our finance team can review it.",
            "category": "Billing"
        }
        
    # 4. Account & Password credentials
    elif "password" in msg or "login" in msg or "username" in msg or "account" in msg or "email" in msg:
        return {
            "response": "You can view your security details in the Profile page. To reset your password or update credentials, please submit an Account ticket for support.",
            "category": "Account"
        }
        
    # 5. Technical glitches & Bug reports
    elif "bug" in msg or "error" in msg or "crash" in msg or "slow" in msg or "not working" in msg or "broken" in msg or "fail" in msg:
        return {
            "response": "That sounds like a technical glitch. I suggest creating a support ticket in our Ticket tab with detailed steps to reproduce it so our engineers can investigate.",
            "category": "Technical"
        }
        
    # 6. General gratitude
    elif "thanks" in msg or "thank you" in msg or "awesome" in msg or "great" in msg:
        return {
            "response": "You are very welcome! Let me know if you need help with anything else.",
            "category": "General"
        }
        
    # 7. Fallback greeting
    else:
        return {
            "response": "Hello! I am your AI Support Assistant. I can help answer common questions, or help you structure support tickets.",
            "category": "General"
        }
