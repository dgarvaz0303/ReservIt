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
    
@router.get("/usuarios")
def get_all_users():
    try:
        response = supabase.table("usuarios") \
            .select("id, nombre, nombre_user, email, telefono, roll") \
            .neq("roll", "admin") \
            .execute()

        return response.data

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/usuarios/{id}/rol")
def update_user_role(id: int):
    try:
        # obtener usuario actual
        user = supabase.table("usuarios") \
            .select("*") \
            .eq("id", id) \
            .single() \
            .execute()

        if not user.data:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

        rol_actual = user.data["roll"]

        nuevo_rol = "supervisor" if rol_actual == "cliente" else "cliente"

        res = supabase.table("usuarios") \
            .update({"roll": nuevo_rol}) \
            .eq("id", id) \
            .execute()

        return {"message": "Rol actualizado", "data": res.data}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.delete("/usuarios/{id}")
def delete_user(id: int):
    try:
        user = supabase.table("usuarios") \
            .select("*") \
            .eq("id", id) \
            .single() \
            .execute()

        if not user.data:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

        auth_id = user.data["auth_id"]

        supabase.table("usuarios") \
            .delete() \
            .eq("id", id) \
            .execute()

        supabase.auth.admin.delete_user(auth_id)

        return {"message": "Usuario eliminado"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))