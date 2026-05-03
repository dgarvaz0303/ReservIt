from fastapi import APIRouter, HTTPException, Depends
from app.supabase_client import supabase
from app.routes.auth.dependencies import get_current_user
from app.models.establecimiento import EstablecimientoCreate
from app.models.establecimiento import EstablecimientoUpdate
router = APIRouter(prefix="/api/establecimientos")

@router.get("/propietario")
def get_mis_establecimientos(current_user=Depends(get_current_user)):
    try:
        # 1. auth_id del token
        auth_id = current_user.id

        # 2. buscar usuario en tabla usuarios
        user_res = supabase.table("usuarios") \
            .select("*") \
            .eq("auth_id", auth_id) \
            .single() \
            .execute()

        if not user_res.data:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

        user_id = user_res.data["id"]

        # 3. obtener establecimientos
        res = supabase.table("establecimiento") \
            .select("*") \
            .eq("id_user", user_id) \
            .execute()

        return res.data or []  

    except Exception as e:
        print("ERROR:", e) 
        raise HTTPException(status_code=500, detail=str(e))
    
# GET todos
@router.get("")
def get_establecimientos():
    try:
        res = supabase.table("establecimiento").select("*").execute()
        return res.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/admin")
def get_establecimientos_admin():
    try:
        establecimientos = supabase.table("establecimiento").select("*").execute().data or []

        reservas = supabase.table("reserva").select("*").execute().data or []

        from datetime import datetime

        now = datetime.now()

        resultado = []

        for est in establecimientos:
            est_reservas = [r for r in reservas if r["id_establecimiento"] == est["id"]]

            activas = 0
            pasadas = 0
            usadas = 0

            for r in est_reservas:
                fecha_hora = datetime.fromisoformat(f"{r['fecha']}T{r['hora']}")

                if r["qr_usado"]:
                    usadas += 1
                else:
                    if fecha_hora >= now:
                        activas += 1
                    else:
                        pasadas += 1

            resultado.append({
                **est,
                "reservas_activas": activas,
                "reservas_pasadas": pasadas,
                "reservas_usadas": usadas,
                "reservas_total": len(est_reservas)
            })

        return resultado

    except Exception as e:
        print("ERROR ADMIN LOCALES:", e)
        raise HTTPException(status_code=500, detail=str(e))

# GET por ID
@router.get("/{id}")
def get_establecimiento(id: int):
    try:
        # establecimiento
        est = supabase.table("establecimiento") \
            .select("*") \
            .eq("id", id) \
            .single() \
            .execute()

        if not est.data:
            raise HTTPException(status_code=404, detail="No encontrado")

        # zonas
        zonas = supabase.table("zonas") \
            .select("*") \
            .eq("establecimiento_id", id) \
            .execute()

        # horarios
        horarios = supabase.table("horarios_establecimiento") \
            .select("*") \
            .eq("id_establecimiento", id) \
            .execute()

        return {
            **est.data,
            "zonas": zonas.data or [],
            "horarios": horarios.data or []
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("")
def create_establecimiento(
    est: EstablecimientoCreate,
    current_user=Depends(get_current_user)
):
    try:
        auth_id = current_user.id

        #  Buscar usuario
        user_res = supabase.table("usuarios") \
            .select("*") \
            .eq("auth_id", auth_id) \
            .single() \
            .execute()

        if user_res.data is None:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

        user_id = user_res.data["id"]

        # Crear establecimiento 
        est_res = supabase.table("establecimiento").insert({
            "nombre": est.nombre,
            "direccion": est.direccion,
            "tipo": est.tipo,
            "telefono": est.telefono,
            "imagen_url": est.imagen_url,
            "carta_url": est.carta_url,
            "id_user": user_id
        }).execute()

        establecimiento_id = est_res.data[0]["id"]

        #  Crear zonas
        if est.zonas:
            for zona in est.zonas:
                supabase.table("zonas").insert({
                    "establecimiento_id": establecimiento_id,
                    "nombre": zona["nombre"],
                    "capacidad": zona["capacidad"]
                }).execute()

        # Crear horarios
        if est.horarios:
            for h in est.horarios:
                supabase.table("horarios_establecimiento").insert({
                    "id_establecimiento": establecimiento_id,
                    "dia_semana": h["dia_semana"],
                    "hora": h["hora"]
                }).execute()

        return {
            "message": "Establecimiento creado correctamente",
            "data": est_res.data
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
@router.delete("/{id}")
def delete_establecimiento(
    id: int,
    current_user=Depends(get_current_user)
):
    try:
        # auth del usuario
        auth_id = current_user.id

        # buscar usuario en tabla
        user_res = supabase.table("usuarios")\
            .select("*")\
            .eq("auth_id", auth_id)\
            .single()\
            .execute()

        if not user_res.data:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

        user_id = user_res.data["id"]

        # comprobar que el establecimiento es suyo
        est = supabase.table("establecimiento")\
            .select("*")\
            .eq("id", id)\
            .eq("id_user", user_id)\
            .single()\
            .execute()

        if not est.data:
            raise HTTPException(status_code=404, detail="No encontrado o no autorizado")

        # eliminar
        supabase.table("establecimiento")\
            .delete()\
            .eq("id", id)\
            .execute()

        return {"message": "Eliminado correctamente"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@router.put("/{id}")
def update_establecimiento(
    id: int,
    data: EstablecimientoUpdate,
    current_user=Depends(get_current_user)
):
    try:
        auth_id = current_user.id

        #  Usuario
        user_res = supabase.table("usuarios") \
            .select("*") \
            .eq("auth_id", auth_id) \
            .single() \
            .execute()

        if not user_res.data:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

        user_id = user_res.data["id"]

        #  Verificar propiedad
        est = supabase.table("establecimiento") \
            .select("*") \
            .eq("id", id) \
            .eq("id_user", user_id) \
            .single() \
            .execute()

        if not est.data:
            raise HTTPException(status_code=404, detail="No autorizado")

        # =========================
        #  UPDATE CAMPOS BASE
        # =========================
        update_data = data.dict(exclude_unset=True)

        zonas = update_data.pop("zonas", None)
        horarios = update_data.pop("horarios", None)

        if update_data:
            supabase.table("establecimiento") \
                .update(update_data) \
                .eq("id", id) \
                .execute()

        # =========================
        #  ZONAS (SAFE)
        # =========================
        if zonas is not None:

            zonas_actuales = supabase.table("zonas") \
                .select("*") \
                .eq("establecimiento_id", id) \
                .execute().data or []

            ids_actuales = [z["id"] for z in zonas_actuales]
            ids_front = [z.get("id") for z in zonas if z.get("id")]

            #  ELIMINAR SOLO LAS BORRADAS EN FRONT
            for z in zonas_actuales:
                if z["id"] not in ids_front:

                    # borrar reservas primero
                    supabase.table("reserva") \
                        .delete() \
                        .eq("zona_id", z["id"]) \
                        .execute()

                    # borrar zona
                    supabase.table("zonas") \
                        .delete() \
                        .eq("id", z["id"]) \
                        .execute()

            #  INSERTAR NUEVAS
            for z in zonas:
                if not z.get("id"):
                    supabase.table("zonas").insert({
                        "establecimiento_id": id,
                        "nombre": z["nombre"],
                        "capacidad": int(z["capacidad"])
                    }).execute()

        # =========================
        #  HORARIOS 
        # =========================
        if horarios is not None:

            horarios_actuales = supabase.table("horarios_establecimiento") \
                .select("*") \
                .eq("id_establecimiento", id) \
                .execute().data or []

            ids_actuales = [h["id"] for h in horarios_actuales]
            ids_front = [h.get("id") for h in horarios if h.get("id")]

            #  ELIMINAR LOS BORRADOS
            for h in horarios_actuales:
                if h["id"] not in ids_front:
                    supabase.table("horarios_establecimiento") \
                        .delete() \
                        .eq("id", h["id"]) \
                        .execute()

            #  INSERTAR NUEVOS
            for h in horarios:
                if not h.get("id"):
                    supabase.table("horarios_establecimiento").insert({
                        "id_establecimiento": id,
                        "dia_semana": int(h["dia_semana"]),
                        "hora": h["hora"]
                    }).execute()

        return {
            "message": "Establecimiento actualizado correctamente"
        }

    except Exception as e:
        print("ERROR UPDATE:", e)
        raise HTTPException(status_code=500, detail=str(e))