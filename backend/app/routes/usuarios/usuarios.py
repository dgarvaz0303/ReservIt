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
def update_user(id: int, data: dict):
    try:
        response = supabase.table("usuarios")\
            .update(data)\
            .eq("id", id)\
            .execute()

        if not response.data:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

        return {
            "message": "Usuario actualizado correctamente",
            "data": response.data
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# DELETE usuario (ADMIN → eliminar)
@router.delete("/usuarios/{id}")
def delete_user(id: int):
    try:
        # comprobar si existe
        existing = supabase.table("usuarios")\
            .select("*")\
            .eq("id", id)\
            .execute()

        if not existing.data:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

        # eliminar usuario
        supabase.table("usuarios")\
            .delete()\
            .eq("id", id)\
            .execute()

        return {
            "message": f"Usuario {id} eliminado correctamente"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))