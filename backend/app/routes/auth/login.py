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

        return {
            "message": "Login correcto",
            "access_token": response.session.access_token,
            "refresh_token": response.session.refresh_token,
            "user": response.user
        }

    except Exception as e:
        print("ERROR LOGIN:", e)
        raise HTTPException(status_code=500, detail=str(e))