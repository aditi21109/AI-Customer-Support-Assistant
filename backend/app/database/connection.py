import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "customer_support_db")

# Initialize PyMongo client
# In production, we'd add pooling and timeouts
client = MongoClient(MONGO_URI)
db = client[DB_NAME]

def get_db():
    """
    Returns the database instance.
    This provides access to the collection operations: insert, find, update, delete.
    """
    return db
