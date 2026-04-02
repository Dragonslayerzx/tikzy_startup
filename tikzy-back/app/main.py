from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import Base, engine

from app.api.routes.health import router as health_router
from app.api.routes.companies import router as companies_router
from app.api.routes.operators import router as operators_router
from app.api.routes.vehicles import router as vehicles_router
from app.api.routes.trips import router as trips_router
from app.api.routes.locations import router as locations_router

# Import all models so SQLAlchemy registers every table
from app.models import company, operator, vehicle, trip, vehicle_location  # noqa: F401

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Tikzy API",
    version="1.0.0",
    description="Backend para Tikzy - buses interurbanos",
)

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8081",
    "http://127.0.0.1:8081",
    "*",
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


app.include_router(health_router)
app.include_router(companies_router)
app.include_router(operators_router)
app.include_router(vehicles_router)
app.include_router(trips_router)
app.include_router(locations_router)