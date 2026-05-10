# Arquitectura

ReservIt sigue una arquitectura cliente-servidor sencilla.

```text
frontend/web       frontend/mobile
     |                    |
     | HTTP REST          | HTTP REST
     v                    v
          backend/app FastAPI
                 |
                 | Supabase Python client
                 v
        Supabase Auth + PostgreSQL
```

## Backend

El backend expone rutas REST desde `backend/app/main.py`. Cada dominio funcional tiene su router:

- `auth`: registro, login y validacion de tokens.
- `usuarios`: perfil, listado, roles y eliminacion.
- `establecimientos`: alta, consulta, edicion y borrado de locales.
- `reservas`: reservas de clientes, reservas por establecimiento y uso de QR.
- `disponibilidad`: capacidad disponible por dia y por franja.
- `zonas`: zonas de un establecimiento.
- `horarios`: horarios asociados a establecimientos.
- `geo`: busqueda de direcciones con Nominatim.

## Frontend web

La app web usa el App Router de Next.js en `frontend/web/src/app`. Las rutas estan agrupadas por contexto:

- `(auth)`: login y registro.
- `(main)`: pantallas autenticadas y experiencia principal.
- `administracion`: vistas de administracion.
- `locales`, `establecimientos`, `reservas`, `perfil`: modulos funcionales.

## Frontend mobile

La app mobile usa Expo Router en `frontend/mobile/app`. El grupo `(tabs)` contiene las pantallas principales y `(auth)` contiene autenticacion.

## Estado y autenticacion

El token de acceso de Supabase se guarda en el cliente y se envia al backend con:

```http
Authorization: Bearer <access_token>
```

El backend valida el token con `supabase.auth.get_user(token)` y despues consulta la tabla `usuarios` para obtener perfil y rol.
