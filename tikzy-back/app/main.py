from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import Base, engine
from app.api.routes.companies import router as companies_router

# Importar modelos para que SQLAlchemy registre las tablas
from app.models.company import Company  # noqa: F401
from app.models.vehicle import Vehicle  # noqa: F401
from app.models.operator import Operator  # noqa: F401


Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Tikzy API",
    version="1.0.0",
    description="Backend para Tikzy - buses interurbanos",
)

# Ajusta estos orígenes según tu entorno
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8081",
    "http://127.0.0.1:8081",
    "*",  # útil en desarrollo con Expo; en producción mejor restringirlo
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "Tikzy API running",
        "status": "ok",
    }


@app.get("/health")
def health_check():
    return {
        "service": "tikzy-back",
        "healthy": True,
    }


app.include_router(companies_router)