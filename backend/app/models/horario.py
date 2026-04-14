from pydantic import BaseModel
from datetime import time

class HorarioCreate(BaseModel):
    id_establecimiento: int
    dia_semana: int  # 0=lunes, 6=domingo
    hora_apertura: time
    hora_cierre: time