# Incidencias y Puntos de Revision

Esta guia resume que revisar cuando una parte de ReservIt no funciona correctamente.

:::tip Metodo recomendado
Empieza siempre por reproducir el error, revisar consola/logs y aislar si el fallo esta en frontend, backend, Supabase o datos.
:::

## El backend no arranca

Revisar:

- Que el entorno virtual esta activado.
- Que las dependencias de `backend/requirements.txt` estan instaladas.
- Que el comando se ejecuta desde `backend`.
- Que existe `backend/.env`.
- Que `SUPABASE_URL` y `SUPABASE_KEY` tienen valor.

Comando:

```bash
cd backend
uvicorn app.main:app --reload
```

:::warning Variables de entorno
Despues de cambiar variables `.env`, reinicia el servidor. FastAPI no recarga automaticamente todos los cambios de configuracion externa.
:::

## El login falla

Revisar:

- Que el usuario existe en Supabase Auth.
- Que existe una fila en `usuarios` con el `auth_id` correcto.
- Que la contrasena es correcta.
- Que el backend puede conectar con Supabase.
- Que el frontend esta enviando el body esperado.

Archivos relacionados:

```text
backend/app/routes/auth/login.py
frontend/web/src/utils/auth.js
```

<details>
  <summary>Prueba rapida del login</summary>

  1. Ejecutar backend.
  2. Abrir la documentacion OpenAPI en `/docs`.
  3. Probar `POST /api/login`.
  4. Comprobar si la respuesta incluye `access_token`.
  5. Usar ese token en una ruta protegida como `/api/usuarios/me`.

</details>

## El perfil no carga

Revisar:

- Que el frontend envia `Authorization: Bearer <token>`.
- Que el token no ha caducado.
- Que `get_current_user` valida el usuario.
- Que existe la fila correspondiente en `usuarios`.

Endpoint:

```http
GET /api/usuarios/me
```

## No aparecen establecimientos

Revisar:

- Tabla `establecimiento`.
- Tabla `zonas`, si falta la capacidad total.
- Que la ruta `GET /api/establecimientos` responde.
- Que el frontend usa la URL correcta del backend.

## No se puede crear una reserva

Revisar:

- Que el usuario esta autenticado.
- Que el body incluye `fecha`, `hora`, `num_personas`, `establecimiento_id` y `zona_id`.
- Que la zona existe.
- Que la zona tiene capacidad suficiente.
- Que el usuario no tiene otra reserva a la misma fecha y hora.

Endpoint:

```http
POST /api/reservas
```

:::info Dato clave
La capacidad se calcula por zona, fecha y hora. Si el usuario cambia solo la hora, el backend vuelve a calcular disponibilidad para esa nueva franja.
:::

## La disponibilidad aparece vacia

Revisar:

- Que el establecimiento tiene zonas.
- Que el establecimiento tiene horarios.
- Que se envia `establecimiento_id`.
- Que la fecha tiene formato `YYYY-MM-DD`.

Endpoint:

```http
GET /api/disponibilidad
```

## El QR no valida

Revisar:

- Que el `qr_token` pertenece a una reserva existente.
- Que `qr_usado` no esta ya en `True`.
- Que la ruta se esta llamando con metodo `POST`.

Endpoint:

```http
POST /api/reservas/usar/{qr_token}
```

:::warning QR de un solo uso
Una vez marcado `qr_usado` como `True`, la misma reserva no deberia volver a validarse.
:::

## La app web no conecta con Supabase

Revisar:

- Archivo `frontend/web/.env.local`.
- Variables `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Reiniciar el servidor de Next.js despues de cambiar variables.

## La app mobile no arranca

Revisar:

- Que las dependencias estan instaladas en `frontend/mobile`.
- Que Expo CLI puede iniciar el proyecto.
- Que `app.json` no contiene errores.
- Que la version de Node es compatible.

Comando:

```bash
cd frontend/mobile
npm start
```
