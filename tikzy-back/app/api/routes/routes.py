from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.route import Route
from app.schemas.route import RouteCreate, RouteResponse, RouteUpdate

router = APIRouter(prefix="/routes", tags=["Routes"])


@router.get("/", response_model=list[RouteResponse])
def get_routes(
    active_only: bool = Query(default=False),
    origin: str | None = Query(default=None),
    destination: str | None = Query(default=None),
    db: Session = Depends(get_db),
):
    query = db.query(Route)

    if active_only:
        query = query.filter(Route.is_active.is_(True))

    if origin:
        query = query.filter(Route.origin_city.ilike(f"%{origin.strip()}%"))

    if destination:
        query = query.filter(Route.destination_city.ilike(f"%{destination.strip()}%"))

    return query.order_by(Route.origin_city.asc(), Route.destination_city.asc()).all()


@router.get("/{route_id}", response_model=RouteResponse)
def get_route(route_id: int, db: Session = Depends(get_db)):
    route = db.query(Route).filter(Route.id == route_id).first()
    if not route:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Route not found",
        )
    return route


@router.post("/", response_model=RouteResponse, status_code=status.HTTP_201_CREATED)
def create_route(payload: RouteCreate, db: Session = Depends(get_db)):
    route = Route(**payload.model_dump())
    db.add(route)
    db.commit()
    db.refresh(route)
    return route


@router.put("/{route_id}", response_model=RouteResponse)
def update_route(route_id: int, payload: RouteUpdate, db: Session = Depends(get_db)):
    route = db.query(Route).filter(Route.id == route_id).first()
    if not route:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Route not found",
        )

    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(route, field, value)

    db.commit()
    db.refresh(route)
    return route


@router.delete("/{route_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_route(route_id: int, db: Session = Depends(get_db)):
    route = db.query(Route).filter(Route.id == route_id).first()
    if not route:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Route not found",
        )

    db.delete(route)
    db.commit()
    return None