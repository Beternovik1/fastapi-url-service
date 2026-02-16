from pydantic import BaseModel, HttpUrl, Field
from typing import Optional
from datetime import datetime

# incoming: what the user sends to create a link
class UrlCreateRequest(BaseModel):
    long_url: HttpUrl
    # optional custom alias
    custom_alias: Optional[str] = Field(None, min_length=3, max_length=15, pattern="^[a-zA-Z0-9-_]+$")

# database: what we actually save to mongo
class UrlInDB(BaseModel):
    short_id: str
    long_url: str
    date_created: datetime = Field(default_factory=datetime.utcnow)

# what we return to the user
class UrlResponse(BaseModel):
    short_id: str
    long_url: HttpUrl
    date_created: datetime

class UrlLookupRequest(BaseModel):
    short_id: str = Field(..., min_length=3, max_length=15, pattern="^[a-zA-Z0-9-_]+$")