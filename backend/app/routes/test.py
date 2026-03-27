from fastapi import APIRouter
from app.supabase_client import supabase

router = APIRouter(prefix="/api")

@router.get("/test")
def test_supabase():
    response = supabase.table("usuarios").select("*").execute()
    return response.data