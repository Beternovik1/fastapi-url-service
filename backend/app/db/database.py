from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

class Database:
    client: AsyncIOMotorClient = None

db = Database()

async def connect_to_mongo():
    """called when the api starts"""
    db.client = AsyncIOMotorClient(settings.MONGO_URL)
    print("Connected to MongoDB")

async def close_mongo_connection():
    """called whe the api stops"""
    if db.client:
        db.client.close()
        print("Disconnected from MongoDB")
    
async def get_database():
    """dependency for routes to access the db"""
    return db.client[settings.DB_NAME]