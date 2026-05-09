from pydantic import BaseModel, HttpUrl
from typing import Optional
from typing import List
class EstablecimientoCreate(BaseModel):
    nombre: str
    direccion: str
    tipo: str
    telefono: str
    imagen_url: Optional[str] = None
    carta_url: Optional[str] = None
    zonas: List[dict]
    horarios: List[dict]

class EstablecimientoUpdate(BaseModel):
    nombre: Optional[str] = None
    direccion: Optional[str] = None
    tipo: Optional[str] = None
    telefono: Optional[str] = None
    imagen_url: Optional[str] = None
    carta_url: Optional[str] = None
    zonas: Optional[List[dict]] = None
    horarios: Optional[List[dict]] = None