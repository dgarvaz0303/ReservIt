from fastapi import APIRouter, HTTPException
from app.supabase_client import supabase
from app.models.horario import HorarioCreate

router = APIRouter(prefix="/api", tags=["horarios"])


# GET horarios por establecimiento
@router.get("/horarios/{id_establecimiento}")
def get_horarios(id_establecimiento: int):
    try:
        response = supabase.table("horarios")\
            .select("*")\
            .eq("id_establecimiento", id_establecimiento)\
            .execute()

        return response.data

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# GET horario por id
@router.get("/horario/{id}")
def get_horario(id: int):
    try:
        response = supabase.table("horarios")\
            .select("*")\
            .eq("id", id)\
            .single()\
            .execute()

        return response.data

    except Exception:
        raise HTTPException(status_code=404, detail="Horario no encontrado")


# POST crear horario
@router.post("/horarios")
def create_horario(horario: HorarioCreate):
    try:
        response = supabase.table("horarios").insert({
            "id_establecimiento": horario.id_establecimiento,
            "dia_semana": horario.dia_semana,
            "hora_apertura": str(horario.hora_apertura),
            "hora_cierre": str(horario.hora_cierre),
        }).execute()

        return {
            "message": "Horario creado correctamente",
            "data": response.data
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# PUT actualizar horario
@router.put("/horarios/{id}")
def update_horario(id: int, data: dict):
    try:
        response = supabase.table("horarios")\
            .update(data)\
            .eq("id", id)\
            .execute()

        if not response.data:
            raise HTTPException(status_code=404, detail="Horario no encontrado")

        return {
            "message": "Horario actualizado correctamente",
            "data": response.data
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# DELETE horario
@router.delete("/horarios/{id}")
def delete_horario(id: int):
    try:
        response = supabase.table("horarios")\
            .delete()\
            .eq("id", id)\
            .execute()

        if not response.data:
            raise HTTPException(status_code=404, detail="Horario no encontrado")

        return {"message": "Horario eliminado correctamente"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))