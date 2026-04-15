from fastapi import APIRouter, HTTPException, Request
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


#  POST crear reserva (CORREGIDO)
@router.post("/reservas")
async def create_reserva(request: Request):
    try:
        body = await request.json()

        # token
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            raise HTTPException(status_code=401, detail="No autorizado")

        token = auth_header.replace("Bearer ", "")

        #  obtener usuario real
        user_response = supabase.auth.get_user(token)

        if user_response.user is None:
            raise HTTPException(status_code=401, detail="Usuario inválido")

        auth_id = user_response.user.id

        #  buscar en tabla usuarios
        db_user = supabase.table("usuarios")\
            .select("*")\
            .eq("auth_id", auth_id)\
            .execute()

        if not db_user.data:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

        usuario = db_user.data[0]

        # VALIDAR CAPACIDAD
        zona_res = supabase.table("zonas")\
            .select("*")\
            .eq("id", body["zona_id"])\
            .execute()

        if not zona_res.data:
            raise HTTPException(status_code=404, detail="Zona no encontrada")

        zona = zona_res.data[0]

        reservas_res = supabase.table("reserva")\
            .select("num_personas")\
            .eq("zona_id", body["zona_id"])\
            .eq("fecha", body["fecha"])\
            .eq("hora", body["hora"])\
            .execute()

        ocupadas = sum(r["num_personas"] for r in reservas_res.data)
        disponibles = zona["capacidad"] - ocupadas

        if body["num_personas"] > disponibles:
            raise HTTPException(
                status_code=400,
                detail=f"Solo quedan {disponibles} plazas disponibles"
            )

        #  generar QR
        qr_token = str(uuid.uuid4())

        # INSERT FINAL
        supabase.table("reserva").insert({
            "fecha": str(body["fecha"]),
            "hora": str(body["hora"]),
            "num_personas": body["num_personas"],
            "id_user": usuario["id"],  
            "id_establecimiento": body["establecimiento_id"],
            "zona_id": body["zona_id"],
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
        existing = supabase.table("reserva")\
            .select("*")\
            .eq("id", id)\
            .execute()

        if not existing.data:
            raise HTTPException(status_code=404, detail="Reserva no encontrada")

        supabase.table("reserva")\
            .delete()\
            .eq("id", id)\
            .execute()

        return {"message": f"Reserva {id} eliminada correctamente"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# USAR QR
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