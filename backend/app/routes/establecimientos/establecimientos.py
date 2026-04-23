from fastapi import APIRouter, HTTPException, Depends
from app.supabase_client import supabase
from app.routes.auth.dependencies import get_current_user
from app.models.establecimiento import EstablecimientoCreate

router = APIRouter(prefix="/api/establecimientos")

@router.get("/propietario")
def get_mis_establecimientos(current_user=Depends(get_current_user)):
    try:
        # 1. auth_id del token
        auth_id = current_user.id

        # 2. buscar usuario en tabla usuarios
        user_res = supabase.table("usuarios") \
            .select("*") \
            .eq("auth_id", auth_id) \
            .single() \
            .execute()

        if not user_res.data:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

        user_id = user_res.data["id"]

        # 3. obtener establecimientos
        res = supabase.table("establecimiento") \
            .select("*") \
            .eq("id_user", user_id) \
            .execute()

        return res.data or []  

    except Exception as e:
        print("ERROR:", e) 
        raise HTTPException(status_code=500, detail=str(e))
    
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

@router.delete("/{id}")
def delete_establecimiento(
    id: int,
    current_user=Depends(get_current_user)
):
    try:
        # auth del usuario
        auth_id = current_user.id

        # buscar usuario en tabla
        user_res = supabase.table("usuarios")\
            .select("*")\
            .eq("auth_id", auth_id)\
            .single()\
            .execute()

        if not user_res.data:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

        user_id = user_res.data["id"]

        # comprobar que el establecimiento es suyo
        est = supabase.table("establecimiento")\
            .select("*")\
            .eq("id", id)\
            .eq("id_user", user_id)\
            .single()\
            .execute()

        if not est.data:
            raise HTTPException(status_code=404, detail="No encontrado o no autorizado")

        # eliminar
        supabase.table("establecimiento")\
            .delete()\
            .eq("id", id)\
            .execute()

        return {"message": "Eliminado correctamente"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))