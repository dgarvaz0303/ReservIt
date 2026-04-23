from fastapi import APIRouter, HTTPException, Request, Header
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

@router.get("/reservas/mis")
async def get_mis_reservas(authorization: str = Header(None, alias="Authorization")):
    try:
        if not authorization:
            raise HTTPException(status_code=401, detail="No autorizado")

        token = authorization.replace("Bearer ", "")

        user_response = supabase.auth.get_user(token)
        auth_id = user_response.user.id

        db_user = supabase.table("usuarios")\
            .select("*")\
            .eq("auth_id", auth_id)\
            .execute()

        if not db_user.data:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

        usuario = db_user.data[0]

        reservas = supabase.table("reserva")\
            .select("id, fecha, hora, id_establecimiento, zona_id")\
            .eq("id_user", usuario["id"])\
            .execute()

        resultado = []

        for r in reservas.data:

            est = supabase.table("establecimiento")\
                .select("nombre, imagen_url")\
                .eq("id", r["id_establecimiento"])\
                .execute()

            zona = supabase.table("zonas")\
                .select("nombre")\
                .eq("id", r["zona_id"])\
                .execute()

            est_data = est.data[0] if est.data else {}
            zona_data = zona.data[0] if zona.data else {}

            resultado.append({
                "id": r["id"],
                "fecha": r["fecha"],
                "hora": r["hora"],
                "establecimiento_nombre": est_data.get("nombre"),
                "imagen_url": est_data.get("imagen_url"),
                "zona": zona_data.get("nombre")
            })

        return resultado

    except Exception as e:
        print("ERROR:", str(e))
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
        r = supabase.table("reserva")\
            .select("*")\
            .eq("id", id)\
            .single()\
            .execute()

        if not r.data:
            raise HTTPException(status_code=404, detail="Reserva no encontrada")

        reserva = r.data

        est = supabase.table("establecimiento")\
            .select("nombre, imagen_url")\
            .eq("id", reserva["id_establecimiento"])\
            .single()\
            .execute()

        zona = supabase.table("zonas")\
            .select("nombre")\
            .eq("id", reserva["zona_id"])\
            .single()\
            .execute()

        user = supabase.table("usuarios")\
            .select("nombre")\
            .eq("id", reserva["id_user"])\
            .single()\
            .execute()

        return {
            **reserva,
            "establecimiento_nombre": est.data["nombre"],
            "imagen_url": est.data["imagen_url"],
            "zona": zona.data["nombre"],
            "nombre_usuario": user.data["nombre"]
        }

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
    


    
@router.put("/reservas/{id}")
async def update_reserva(id: int, request: Request):
    try:
        body = await request.json()

        res = supabase.table("reserva")\
            .select("*")\
            .eq("id", id)\
            .single()\
            .execute()

        if not res.data:
            raise HTTPException(status_code=404, detail="Reserva no encontrada")

        reserva = res.data

        nueva_hora = body["hora"]
        nuevas_personas = body["num_personas"]

        zona_res = supabase.table("zonas")\
            .select("*")\
            .eq("id", reserva["zona_id"])\
            .single()\
            .execute()

        zona = zona_res.data

        reservas_res = supabase.table("reserva")\
            .select("num_personas")\
            .eq("zona_id", reserva["zona_id"])\
            .eq("fecha", reserva["fecha"])\
            .eq("hora", nueva_hora)\
            .neq("id", id)\
            .execute()

        ocupadas = sum(r["num_personas"] for r in reservas_res.data)
        disponibles = zona["capacidad"] - ocupadas

        if nuevas_personas > disponibles:
            raise HTTPException(
                status_code=400,
                detail=f"Solo quedan {disponibles} plazas disponibles"
            )

        supabase.table("reserva")\
            .update({
                "hora": nueva_hora,
                "num_personas": nuevas_personas
            })\
            .eq("id", id)\
            .execute()

        return {"message": "Reserva actualizada"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



