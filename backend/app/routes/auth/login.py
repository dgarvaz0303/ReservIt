from fastapi import APIRouter, HTTPException
from app.supabase_client import supabase
from app.models.user import UserLogin

router = APIRouter(prefix="/api")

@router.post("/login")
def login(user: UserLogin):
    try:
       
        response = supabase.auth.sign_in_with_password({
            "email": str(user.email),
            "password": user.password
        })

        if response.user is None:
            raise HTTPException(
                status_code=401,
                detail="Credenciales incorrectas"
            )

        user_id = response.user.id

        
        db_user = supabase.table("usuarios") \
            .select("*") \
            .eq("auth_id", user_id) \
            .execute()

        
        if not db_user.data or len(db_user.data) == 0:
            raise HTTPException(
                status_code=404,
                detail="Usuario no encontrado en tabla usuarios"
            )

        usuario = db_user.data[0]

        
        return {
            "message": "Login correcto",
            "access_token": response.session.access_token,
            "refresh_token": response.session.refresh_token,
            "nombre": usuario["nombre"],
            "rol": usuario["roll"]
        }

    except HTTPException as http_err:
        raise http_err

    except Exception as e:
        print("ERROR LOGIN:", e)
        raise HTTPException(
            status_code=500,
            detail="Error interno en login"
        )