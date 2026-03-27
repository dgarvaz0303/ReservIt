from fastapi import APIRouter, HTTPException
from app.supabase_client import supabase
from app.models.user import UserCreate

router = APIRouter(prefix="/api")

@router.post("/register")
def register(user: UserCreate):
    try:
        #Registrar en Supabase Auth
        auth_response = supabase.auth.sign_up({
            "email": str(user.email),
            "password": user.password
        })

        #comprobar si se creó correctamente
        if auth_response.user is None:
            raise HTTPException(
                status_code=400,
                detail="No se pudo registrar el usuario en Supabase Auth"
            )

        auth_id = auth_response.user.id

        #Insertar en tu tabla usuarios
        insert_response = supabase.table("usuarios").insert({
            "auth_id": auth_id,
            "nombre": user.nombre,
            "nombre_user": user.nombre_user,
            "email": user.email,
            "telefono": user.telefono,
            "roll": "cliente"
        }).execute()

        #comprobar error en inserción
        if insert_response.data is None:
            raise HTTPException(
                status_code=500,
                detail="Error al guardar datos del usuario"
            )

        return {
            "message": "Usuario registrado correctamente",
            "auth_id": auth_id
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))