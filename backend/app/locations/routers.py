from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.locations.models import State, District
from app.locations.schemas import (
    StateRead,
    DistrictRead,
    DistrictCreate,
    DistrictUpdate,
)
from app.utils.status_codes import api_response, StatusCode

router = APIRouter(prefix="/locations", tags=["locations"])


@router.get("/states", response_model=List[StateRead])
def get_states(db: Session = Depends(get_db)):
    """
    Get a list of all states ordered by name alphabetically.
    """
    states = db.query(State).order_by(State.name.asc()).all()
    return states


@router.get("/states/{state_id}/districts", response_model=List[DistrictRead])
def get_districts_by_state(state_id: int, db: Session = Depends(get_db)):
    """
    Get a list of districts for a specific state, ordered by name alphabetically.
    """
    # Verify state exists
    state = db.query(State).filter(State.id == state_id).first()
    if not state:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="State not found"
        )

    districts = (
        db.query(District)
        .filter(District.state_id == state_id)
        .order_by(District.name.asc())
        .all()
    )
    return districts


@router.post("/states/{state_id}/districts", response_model=dict)
def create_district(
    state_id: int, payload: DistrictCreate, db: Session = Depends(get_db)
):
    """
    Create a new district for a specific state.
    """
    state = db.query(State).filter(State.id == state_id).first()
    if not state:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="State not found"
        )

    district = District(state_id=state_id, name=payload.name)
    db.add(district)
    db.commit()
    db.refresh(district)

    return api_response(
        status_code=StatusCode.CREATED,
        message="District added successfully.",
        data=DistrictRead.model_validate(district).model_dump(),
    )


@router.put("/districts/{district_id}", response_model=dict)
def update_district(
    district_id: int, payload: DistrictUpdate, db: Session = Depends(get_db)
):
    """
    Update an existing district's name.
    """
    district = db.query(District).filter(District.id == district_id).first()
    if not district:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="District not found"
        )

    district.name = payload.name
    db.commit()
    db.refresh(district)

    return api_response(
        status_code=StatusCode.OK,
        message="District updated successfully.",
        data=DistrictRead.model_validate(district).model_dump(),
    )
