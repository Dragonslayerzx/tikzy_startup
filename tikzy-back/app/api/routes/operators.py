from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.operator import Operator
from app.models.scheduled_trip import ScheduledTrip
from app.models.user import User

router = APIRouter(prefix="/operators", tags=["Operators"])


@router.get("/me/panel")
def get_operator_panel(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not current_user.is_operator:
      raise HTTPException(
          status_code=status.HTTP_403_FORBIDDEN,
          detail="Current user is not an operator",
      )

    operator = (
        db.query(Operator)
        .filter(Operator.email == current_user.email)
        .first()
    )

    if not operator:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Operator profile not found for current user",
        )

    assigned_trips = (
        db.query(ScheduledTrip)
        .options(
            joinedload(ScheduledTrip.route),
            joinedload(ScheduledTrip.vehicle),
        )
        .filter(ScheduledTrip.operator_id == operator.id)
        .filter(ScheduledTrip.status.in_(["scheduled", "boarding"]))
        .order_by(ScheduledTrip.travel_date.asc(), ScheduledTrip.departure_time.asc())
        .all()
    )

    return {
        "operator_id": operator.id,
        "operator_name": operator.full_name,
        "assigned_trips": [
            {
                "scheduled_trip_id": trip.id,
                "vehicle_id": trip.vehicle.id,
                "vehicle_internal_code": trip.vehicle.internal_code,
                "vehicle_plate_number": trip.vehicle.plate_number,
                "route_id": trip.route.id,
                "origin_city": trip.route.origin_city,
                "destination_city": trip.route.destination_city,
                "departure_time": trip.departure_time.strftime("%H:%M"),
                "arrival_time": trip.arrival_time.strftime("%H:%M"),
                "trip_status": trip.status,
            }
            for trip in assigned_trips
        ],
    }