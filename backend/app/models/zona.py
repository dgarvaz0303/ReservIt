from pydantic import BaseModel, Field

class ZonaCreate(BaseModel):
    establecimiento_id: int
    nombre: str = Field(..., min_length=2, max_length=50)
    capacidad: int = Field(..., gt=0)