from pydantic import BaseModel, HttpUrl

class EstablecimientoCreate(BaseModel):
    nombre: str
    direccion: str
    tipo: str
    telefono: str
    capacidad: int
    carta_url: str