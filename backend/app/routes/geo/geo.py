from fastapi import APIRouter
import requests

router = APIRouter(prefix="/geo")

@router.get("/buscar")
def buscar_direccion(q: str):
    url = "https://nominatim.openstreetmap.org/search"

    params = {
        "format": "json",
        "addressdetails": 1,
        "limit": 6,
        "countrycodes": "es",
        "bounded": 1,
        "viewbox": "-6.15,36.97,-6.00,36.88",
        "q": f"{q} Lebrija"
    }

    headers = {
        "User-Agent": "ReservItApp/1.0 (dgarvaz0303@g.educaand.es)"
    }

    res = requests.get(url, params=params, headers=headers)

    return res.json()