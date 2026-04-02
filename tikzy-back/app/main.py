from fastapi import FastAPI

from app.core.database import Base, engine
from app.api.routes.health import router as health_router
from app.api.routes.operators import router as operators_router
from app.api.routes.vehicles import router as vehicles_router

app = FastAPI(
    title="Tikzy Backend",
    version="1.0.0",
    description="Backend API for Tikzy transport platform"
)

# 🔥 THIS CREATES TABLES
Base.metadata.create_all(bind=engine)

app.include_router(health_router)
app.include_router(operators_router)
app.include_router(vehicles_router)


@app.get("/")
def root():
    return {"message": "Welcome to Tikzy Backend"}