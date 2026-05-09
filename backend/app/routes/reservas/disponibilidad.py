import calendar
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

        fecha_inicio = f"{year}-{str(month).zfill(2)}-01"
        fecha_fin = f"{year}-{str(month).zfill(2)}-{str(dias_mes).zfill(2)}"

        reservas = supabase.table("reserva") \
            .select("fecha, zona_id, num_personas") \
            .eq("id_establecimiento", establecimiento_id) \
            .gte("fecha", fecha_inicio) \
            .lte("fecha", fecha_fin) \
            .execute().data or []

        capacidad_total_dia = sum(
            int(z.get("capacidad") or 0) for z in zonas
        ) * len(horarios)

        resultado = []

        for dia in range(1, dias_mes + 1):
            fecha = f"{year}-{str(month).zfill(2)}-{str(dia).zfill(2)}"

            ocupadas_total = sum(
                int(r.get("num_personas") or 0)
                for r in reservas
                if r.get("fecha") == fecha
            )

            ocupacion = 0

            if capacidad_total_dia > 0:
                ocupacion = ocupadas_total / capacidad_total_dia

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
        zonas = supabase.table("zonas") \
            .select("*") \
            .eq("establecimiento_id", establecimiento_id) \
            .execute().data or []

        horarios = supabase.table("horarios_establecimiento") \
            .select("*") \
            .eq("id_establecimiento", establecimiento_id) \
            .execute().data or []

        reservas = supabase.table("reserva") \
            .select("zona_id, hora, num_personas") \
            .eq("id_establecimiento", establecimiento_id) \
            .eq("fecha", fecha) \
            .execute().data or []

        if not zonas or not horarios:
            return []

        resultado = []

        for zona in zonas:
            zona_id = zona["id"]
            capacidad = int(zona.get("capacidad") or 0)

            for h in horarios:
                hora = str(h["hora"])[:8]

                ocupadas = sum(
                    int(r.get("num_personas") or 0)
                    for r in reservas
                    if r.get("zona_id") == zona_id
                    and str(r.get("hora"))[:8] == hora
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