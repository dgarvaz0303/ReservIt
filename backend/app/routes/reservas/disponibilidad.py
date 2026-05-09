import calendar
from fastapi import HTTPException
from fastapi import APIRouter, HTTPException, Query
from app.supabase_client import supabase

router = APIRouter(prefix="/api/disponibilidad", tags=["disponibilidad"])





@router.get("/mes")
def get_disponibilidad_mes(
    establecimiento_id: int,
    year: int,
    month: int,
):
    try:
        dias_mes = calendar.monthrange(year, month)[1]

        zonas = supabase.table("zonas") \
            .select("*") \
            .eq("establecimiento_id", establecimiento_id) \
            .execute().data or []

        horarios = supabase.table("horarios_establecimiento") \
            .select("*") \
            .eq("id_establecimiento", establecimiento_id) \
            .execute().data or []

        if not zonas or not horarios:
            return []

        resultado = []

        for dia in range(1, dias_mes + 1):
            fecha = f"{year}-{str(month).zfill(2)}-{str(dia).zfill(2)}"

            capacidad_total = 0
            ocupadas_total = 0

            for zona in zonas:
                zona_id = zona.get("id")
                capacidad = zona.get("capacidad") or 0

                capacidad_total += capacidad * len(horarios)

                reservas = supabase.table("reserva") \
                    .select("num_personas") \
                    .eq("id_establecimiento", establecimiento_id) \
                    .eq("zona_id", zona_id) \
                    .eq("fecha", fecha) \
                    .execute().data or []

                ocupadas = sum(
                    int(r.get("num_personas") or 0)
                    for r in reservas
                )

                ocupadas_total += ocupadas

            ocupacion = 0

            if capacidad_total > 0:
                ocupacion = ocupadas_total / capacidad_total

            resultado.append({
                "fecha": fecha,
                "ocupacion": round(ocupacion, 2)
            })

        return resultado

    except Exception as e:
        print("ERROR DISPONIBILIDAD MES:", e)
        raise HTTPException(status_code=500, detail=str(e))


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