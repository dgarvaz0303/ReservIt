from pydantic import BaseModel
from datetime import date, time

class ReservaCreate(BaseModel):
    fecha: date
    hora: time
    num_personas: int
    id_user: int
    id_establecimiento: int