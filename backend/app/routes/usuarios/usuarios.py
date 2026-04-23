from fastapi import APIRouter, HTTPException
from app.supabase_client import supabase

router = APIRouter(prefix="/api", tags=["usuarios"])


#  GET todos los usuarios (tabla admin)
@router.get("/usuarios")
def get_all_users():
    try:
        response = supabase.table("usuarios").select("*").execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# GET usuario por id
@router.get("/usuarios/{id}")
def get_user(id: int):
    try:
        response = supabase.table("usuarios")\
            .select("*")\
            .eq("id", id)\
            .single()\
            .execute()

        return response.data

    except Exception:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")


# GET usuario por auth_id (para login / roles)
@router.get("/usuarios/auth/{auth_id}")
def get_user_by_auth(auth_id: str):
    try:
        response = supabase.table("usuarios")\
            .select("*")\
            .eq("auth_id", auth_id)\
            .single()\
            .execute()

        return response.data

    except Exception:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")


# UPDATE usuario (perfil)
@router.put("/usuarios/{id}")
def update_user(id: int, data: UserUpdate):
    try:
        res = supabase.table("usuarios")\
            .update(data.dict())\
            .eq("id", id)\
            .execute()

        if not res.data:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

        return {
            "message": "Usuario actualizado",
            "data": res.data
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# DELETE CUENTA COMPLETA
# =========================
@router.delete("/usuarios/{id}")
def delete_user(id: int):
    try:
        # 1. Obtener usuario
        user = supabase.table("usuarios")\
            .select("*")\
            .eq("id", id)\
            .single()\
            .execute()

        if not user.data:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

        auth_id = user.data["auth_id"]

        # 2. Borrar tabla usuarios
        supabase.table("usuarios")\
            .delete()\
            .eq("id", id)\
            .execute()

        # 3. Borrar auth (NECESITA SERVICE ROLE KEY)
        supabase.auth.admin.delete_user(auth_id)

        return {
            "message": "Cuenta eliminada completamente"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))