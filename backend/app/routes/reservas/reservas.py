from fastapi import APIRouter, HTTPException
from app.supabase_client import supabase
from app.models.reserva import ReservaCreate
import uuid
from datetime import datetime

router = APIRouter(prefix="/api", tags=["reservas"])


# GET todas las reservas
@router.get("/reservas")
def get_all_reservas():
    try:
        response = supabase.table("reserva").select("*").execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# GET reservas por usuario
@router.get("/reservas/usuario/{id_user}")
def get_reservas_by_user(id_user: int):
    try:
        response = supabase.table("reserva")\
            .select("*")\
            .eq("id_user", id_user)\
            .execute()

        return response.data

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# GET reservas por establecimiento
@router.get("/reservas/establecimiento/{id_establecimiento}")
def get_reservas_by_establecimiento(id_establecimiento: int):
    try:
        response = supabase.table("reserva")\
            .select("*")\
            .eq("id_establecimiento", id_establecimiento)\
            .execute()

        return response.data

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# GET reserva individual
@router.get("/reservas/{id}")
def get_reserva(id: int):
    try:
        response = supabase.table("reserva")\
            .select("*")\
            .eq("id", id)\
            .single()\
            .execute()

        return response.data

    except Exception:
        raise HTTPException(status_code=404, detail="Reserva no encontrada")


# POST crear reserva
@router.post("/reservas")
def create_reserva(reserva: ReservaCreate):
    try:
        qr_token = str(uuid.uuid4())

        response = supabase.table("reserva").insert({
            "fecha": str(reserva.fecha),
            "hora": str(reserva.hora),
            "num_personas": reserva.num_personas,
            "id_user": reserva.id_user,
            "id_establecimiento": reserva.id_establecimiento,
            "qr_token": qr_token,
            "qr_usado": False,
            "qr_usado_en": None
        }).execute()

        return {
            "message": "Reserva creada",
            "qr_token": qr_token
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# DELETE reserva
@router.delete("/reservas/{id}")
def delete_reserva(id: int):
    try:
        # comprobar si existe
        existing = supabase.table("reserva")\
            .select("*")\
            .eq("id", id)\
            .execute()

        if not existing.data:
            raise HTTPException(status_code=404, detail="Reserva no encontrada")

        # eliminar
        supabase.table("reserva")\
            .delete()\
            .eq("id", id)\
            .execute()

        return {
            "message": f"Reserva {id} eliminada correctamente"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# USAR QR (check-in)
@router.post("/reservas/usar/{qr_token}")
def usar_qr(qr_token: str):
    try:
        response = supabase.table("reserva")\
            .select("*")\
            .eq("qr_token", qr_token)\
            .single()\
            .execute()

        reserva = response.data

        if not reserva:
            raise HTTPException(status_code=404, detail="QR no válido")

        if reserva["qr_usado"]:
            raise HTTPException(status_code=400, detail="QR ya usado")

        supabase.table("reserva")\
            .update({
                "qr_usado": True,
                "qr_usado_en": datetime.utcnow().isoformat()
            })\
            .eq("qr_token", qr_token)\
            .execute()

        return {"message": "Reserva validada"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))