from fastapi import APIRouter, HTTPException
from app.supabase_client import supabase
from app.models.zona import ZonaCreate

router = APIRouter(prefix="/api/zonas", tags=["zonas"])


# GET zonas por establecimiento
@router.get("/{establecimiento_id}")
def get_zonas(establecimiento_id: int):
    try:
        response = supabase.table("zonas") \
            .select("*") \
            .eq("establecimiento_id", establecimiento_id) \
            .execute()

        return response.data

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# CREAR zona
@router.post("")
def create_zona(zona: ZonaCreate):
    try:
        response = supabase.table("zonas") \
            .insert({
                "establecimiento_id": zona.establecimiento_id,
                "nombre": zona.nombre,
                "capacidad": zona.capacidad
            }) \
            .execute()

        return {
            "message": "Zona creada correctamente",
            "data": response.data
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ELIMINAR zona
@router.delete("/{zona_id}")
def delete_zona(zona_id: int):
    try:
        response = supabase.table("zonas") \
            .delete() \
            .eq("id", zona_id) \
            .execute()

        return {
            "message": "Zona eliminada correctamente"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 