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
from app.routers import url_router  # Importamos el archivo url_router.py

# Uses the user's IP address to track how many requests they make
limiter = Limiter(key_func=get_remote_address)

# tell FastAPI to use the Limiter
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app = FastAPI(title="TinyURL Clone API")

# --- 1. CONFIGURACIÓN DE CORS (Para React) ---
origins = [
    "http://localhost:5173",  # Frontend Local
    "http://127.0.0.1:5173",
    "*"                       # Permitir todo (Docker/Dev)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 2. EVENTOS DE BASE DE DATOS ---
app.add_event_handler("startup", connect_to_mongo)
app.add_event_handler("shutdown", close_mongo_connection)

# --- 3. INCLUIR RUTAS (POST /shorten, POST /retrieve) ---
# Usamos url_router.router porque en url_router.py definiste "router = APIRouter()"
app.include_router(url_router.router, prefix="/api/v1", tags=["URLs"])

# --- 4. RUTA DE REDIRECCIÓN (GET /{short_id}) ---
@app.get("/{short_id}")
async def redirect_url(
    short_id: str, 
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    collection = db["urls"]
    
    # Buscamos el link usando el short_id
    url_doc = await collection.find_one({"short_id": short_id})

    # Si no existe, error 404
    if not url_doc:
        raise HTTPException(status_code=404, detail="URL not found")

    # Si existe, redirigimos a la URL larga original
    return RedirectResponse(url=url_doc["long_url"])

# Health Check (Opcional)
@app.get("/")
def health_check():
    return {"status": "ok", "app_name": settings.DB_NAME}