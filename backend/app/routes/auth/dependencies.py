from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.supabase_client import supabase

security = HTTPBearer()

<<<<<<< HEAD
def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials

=======
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    try:
        token = credentials.credentials

        
>>>>>>> origin/feature/gestionlocales
        user = supabase.auth.get_user(token)

        if not user or not user.user:
            raise HTTPException(status_code=401, detail="Token inválido")

<<<<<<< HEAD
        return user.user 

    except Exception:
        raise HTTPException(status_code=401, detail="No autenticado")
=======
        return user.user  

    except Exception as e:
        raise HTTPException(status_code=401, detail="No autorizado")
>>>>>>> origin/feature/gestionlocales
