from fastapi import APIRouter, HTTPException, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase

# security
from slowapi import Limiter
from slowapi.util import get_remote_address
from fastapi import Request

# importing from my modules
from app.db.database import get_database
from app.models.url_model import UrlCreateRequest, UrlResponse, UrlInDB, UrlLookupRequest
from app.utils.keygen import create_unique_random_key

limiter = Limiter(key_func=get_remote_address)

router = APIRouter()

# endpoint 1: creating large to short url
@router.post("/shorten", response_model=UrlResponse)
@limiter.limit("5/minute")  # max 5 links per minute
async def create_short_url(
    request: Request, 
    payload: UrlCreateRequest, 
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    collection = db["urls"]

    # logic a: handle the Short ID
    if payload.custom_alias:
        # check if custom alias is taken
        existing = await collection.find_one({"short_id": payload.custom_alias})
        if existing:
            raise HTTPException(status_code=409, detail="Alias already taken")
        short_id = payload.custom_alias
    else:
        # logic b: generate Hash from the URL
        # We pass the URL string into the function now!
        short_id = create_unique_random_key(str(payload.long_url))

    # logic c: check for duplicates
    # Since hashes are deterministic, if 'google.com' already exists, 
    # we should just return the existing one instead of creating a duplicate.
    existing_url = await collection.find_one({"short_id": short_id})
    if existing_url:
        return existing_url

    # LOGIC D: Save to Mongo
    new_url = UrlInDB(
        short_id=short_id,
        long_url=str(payload.long_url)
    )

    await collection.insert_one(new_url.model_dump())

    return new_url

# endpoint 2: returieve original url
@router.post("/retrieve", response_model=UrlResponse)
async def get_original_url(
    payload: UrlLookupRequest, 
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    collection = db["urls"]
    
    # We now look inside the PAYLOAD for the ID
    document = await collection.find_one({"short_id": payload.short_id})
    
    if document is None:
        raise HTTPException(status_code=404, detail="Short URL not found")
        
    return document