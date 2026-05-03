from fastapi import APIRouter, HTTPException, Query
from app.supabase_client import supabase

router = APIRouter(prefix="/api/disponibilidad", tags=["disponibilidad"])


@router.get("")
def get_disponibilidad(
    establecimiento_id: int,
    fecha: str = Query(...),
):
    try:
        if not establecimiento_id:
            raise HTTPException(status_code=400, detail="establecimiento_id requerido")

        zonas = supabase.table("zonas") \
            .select("*") \
            .eq("establecimiento_id", establecimiento_id) \
            .execute().data or []

        if not zonas:
            return []

        horarios = supabase.table("horarios_establecimiento") \
            .select("*") \
            .eq("id_establecimiento", establecimiento_id) \
            .execute().data or []

        if not horarios:
            return []

        resultado = []

        for zona in zonas:
            zona_id = zona["id"]
            capacidad = zona["capacidad"] or 0

            for h in horarios:
                hora = str(h["hora"])[:8]  

                reservas = supabase.table("reserva") \
                    .select("num_personas") \
                    .eq("zona_id", zona_id) \
                    .eq("fecha", fecha) \
                    .eq("hora", hora) \
                    .execute().data or []

                ocupadas = sum(
                    int(r.get("num_personas") or 0) for r in reservas
                )

                disponibles = max(capacidad - ocupadas, 0)

                resultado.append({
                    "zona_id": zona_id,
                    "zona": zona["nombre"],
                    "hora": hora,
                    "capacidad": capacidad,
                    "ocupadas": ocupadas,
                    "disponibles": disponibles
                })

        return resultado

    except Exception as e:
        print("ERROR DISPONIBILIDAD:", e) 
        raise HTTPException(status_code=500, detail=str(e))