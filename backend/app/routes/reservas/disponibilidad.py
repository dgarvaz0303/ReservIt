from fastapi import APIRouter, HTTPException, Query
from app.supabase_client import supabase

router = APIRouter(prefix="/api/disponibilidad", tags=["disponibilidad"])


@router.get("")
def get_disponibilidad(
    establecimiento_id: int,
    fecha: str = Query(...),
):
    try:
        # VALIDACIÓN BÁSICA
        if not establecimiento_id:
            raise HTTPException(status_code=400, detail="establecimiento_id requerido")

        # ZONAS
        zonas_res = supabase.table("zonas") \
            .select("*") \
            .eq("establecimiento_id", establecimiento_id) \
            .execute()

        zonas = zonas_res.data or []

        if not zonas:
            return []

        # HORARIOS (ordenados)
        horarios_res = supabase.table("horarios_establecimiento") \
            .select("*") \
            .eq("id_establecimiento", establecimiento_id) \
            .order("hora") \
            .execute()

        horarios = horarios_res.data or []

        if not horarios:
            return []

        resultado = []

        # LOOP PRINCIPAL
        for zona in zonas:
            zona_id = zona["id"]
            capacidad = zona["capacidad"]

            for h in horarios:
                hora = h["hora"]

                # RESERVAS DE ESA HORA
                reservas_res = supabase.table("reserva") \
                    .select("num_personas") \
                    .eq("zona_id", zona_id) \
                    .eq("fecha", fecha) \
                    .eq("hora", hora) \
                    .execute()

                reservas = reservas_res.data or []

                ocupadas = sum(r.get("num_personas", 0) for r in reservas)
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
        raise HTTPException(status_code=500, detail=str(e))