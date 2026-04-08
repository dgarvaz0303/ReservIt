from fastapi import APIRouter, HTTPException
from app.supabase_client import supabase
from app.models.establecimiento import EstablecimientoCreate

router = APIRouter(prefix="/api/establecimientos")


# GET todos
@router.get("")
def get_establecimientos():
    try:
        res = supabase.table("establecimiento").select("*").execute()
        return res.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# GET por ID
@router.get("/{id}")
def get_establecimiento(id: int):
    try:
        res = supabase.table("establecimiento") \
            .select("*") \
            .eq("id", id) \
            .single() \
            .execute()

        return res.data

    except Exception:
        raise HTTPException(status_code=404, detail="No encontrado")


@router.post("")
def create_establecimiento(
    est: EstablecimientoCreate,
    current_user=Depends(get_current_user)
):
    try:
        # obtener auth_id del token
        auth_id = current_user.id

        # buscar usuario en tabla
        user_res = supabase.table("usuarios") \
            .select("*") \
            .eq("auth_id", auth_id) \
            .single() \
            .execute()

        if user_res.data is None:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

        user_id = user_res.data["id"]

        # insertar establecimiento
        res = supabase.table("establecimiento").insert({
            "nombre": est.nombre,
            "direccion": est.direccion,
            "tipo": est.tipo,
            "telefono": est.telefono,
            "capacidad": est.capacidad,
            "carta_url": est.carta_url,
            "id_user": user_id
        }).execute()

        return {
            "message": "Establecimiento creado correctamente",
            "data": res.data
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))