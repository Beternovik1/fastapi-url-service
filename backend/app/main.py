from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from motor.motor_asyncio import AsyncIOMotorDatabase

# security
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# Mis módulos
from app.core.config import settings
from app.db.database import connect_to_mongo, close_mongo_connection, get_database
from app.routers import url_router

# 1. Crear el Limiter
limiter = Limiter(key_func=get_remote_address)

# 2. CREAR LA APP (¡ESTO VA PRIMERO!)
app = FastAPI(title="TinyURL Clone API")

# 3. AHORA SÍ, configurar el Limiter en la App (porque app ya existe)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# --- CONFIGURACIÓN DE CORS ---
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- EVENTOS DE BASE DE DATOS ---
app.add_event_handler("startup", connect_to_mongo)
app.add_event_handler("shutdown", close_mongo_connection)

# --- RUTAS ---
app.include_router(url_router.router, prefix="/api/v1", tags=["URLs"])

# --- REDIRECCIÓN ---
@app.get("/{short_id}")
async def redirect_url(
    short_id: str, 
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    collection = db["urls"]
    url_doc = await collection.find_one({"short_id": short_id})

    if not url_doc:
        raise HTTPException(status_code=404, detail="URL not found")

    return RedirectResponse(url=url_doc["long_url"])

# Health Check
@app.get("/")
def health_check():
    return {"status": "ok", "app_name": settings.DB_NAME}