from pydantic import BaseModel, ConfigDict


class DistrictRead(BaseModel):
    id: int
    state_id: int
    name: str

    model_config = ConfigDict(from_attributes=True)


class DistrictCreate(BaseModel):
    name: str


class DistrictUpdate(BaseModel):
    name: str


class StateRead(BaseModel):
    id: int
    name: str
    code: str

    model_config = ConfigDict(from_attributes=True)
