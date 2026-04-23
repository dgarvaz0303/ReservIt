from fastapi import APIRouter, HTTPException
from app.supabase_client import supabase
from app.models.user import UserUpdate
from fastapi import Depends
from app.routes.auth.dependencies import get_current_user
router = APIRouter(prefix="/api", tags=["usuarios"])

@router.get("/usuarios/me")
def get_me(current_user=Depends(get_current_user)):
    try:
        
        auth_id = current_user.id
        
        res = supabase.table("usuarios") \
            .select("*") \
            .eq("auth_id", auth_id) \
            .single() \
            .execute()

        return res.data

    except Exception:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    

@router.put("/usuarios/me")
def update_me(data: UserUpdate, current_user=Depends(get_current_user)):
    try:
        auth_id = current_user.id

        update_data = data.dict(exclude_unset=True)

        res = supabase.table("usuarios") \
            .update(update_data) \
            .eq("auth_id", auth_id) \
            .execute()

        return {
            "message": "Perfil actualizado correctamente",
            "data": res.data
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    


@router.delete("/usuarios/me")
def delete_me(current_user=Depends(get_current_user)):
    try:
        auth_id = current_user.id

        # obtener usuario
        user = supabase.table("usuarios") \
            .select("*") \
            .eq("auth_id", auth_id) \
            .single() \
            .execute()

        if not user.data:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

        user_id = user.data["id"]

        # borrar usuario
        supabase.table("usuarios") \
            .delete() \
            .eq("id", user_id) \
            .execute()

        # borrar auth
        supabase.auth.admin.delete_user(auth_id)

        return {"message": "Cuenta eliminada"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

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
    
