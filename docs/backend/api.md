# API REST

Base local habitual:

```text
http://localhost:8000
```

## Salud

| Metodo | Ruta | Descripcion |
| --- | --- | --- |
| GET | `/` | Comprueba que el backend esta funcionando |
| GET | `/api/test` | Ruta de prueba si esta disponible en el router `test` |

## Auth

### POST `/api/register`

Crea usuario en Supabase Auth y perfil en `usuarios`.

```json
{
  "nombre": "Daniel",
  "nombre_user": "daniel",
  "email": "daniel@example.com",
  "telefono": "600000000",
  "password": "Password1"
}
```

### POST `/api/login`

Devuelve tokens y datos basicos de usuario.

```json
{
  "email": "daniel@example.com",
  "password": "Password1"
}
```

Respuesta:

```json
{
  "message": "Login correcto",
  "access_token": "...",
  "refresh_token": "...",
  "nombre": "Daniel",
  "rol": "cliente"
}
```

## Usuarios

| Metodo | Ruta | Auth | Descripcion |
| --- | --- | --- | --- |
| GET | `/api/usuarios/me` | Si | Perfil del usuario autenticado |
| PUT | `/api/usuarios/me` | Si | Actualiza perfil |
| DELETE | `/api/usuarios/me` | Si | Elimina cuenta y usuario Auth |
| GET | `/api/usuarios` | No en codigo actual | Lista usuarios no admin |
| GET | `/api/usuarios/{id}` | No en codigo actual | Usuario por id |
| GET | `/api/usuarios/auth/{auth_id}` | No en codigo actual | Usuario por auth id |
| PUT | `/api/usuarios/{id}/rol` | No en codigo actual | Alterna rol cliente/supervisor |
| DELETE | `/api/usuarios/{id}` | No en codigo actual | Elimina usuario |

## Establecimientos

| Metodo | Ruta | Auth | Descripcion |
| --- | --- | --- | --- |
| GET | `/api/establecimientos` | No | Lista establecimientos con capacidad total |
| GET | `/api/establecimientos/{id}` | No | Detalle con zonas y horarios |
| GET | `/api/establecimientos/propietario` | Si | Establecimientos del usuario autenticado |
| POST | `/api/establecimientos` | Si | Crea establecimiento, zonas y horarios |
| PUT | `/api/establecimientos/{id}` | Si | Actualiza establecimiento propio |
| DELETE | `/api/establecimientos/{id}` | Si | Borra establecimiento propio |
| GET | `/api/establecimientos/admin` | No en codigo actual | Lista con metricas de reservas |
| DELETE | `/api/establecimientos/admin/{id}` | Si admin | Borrado completo por admin |

Body de creacion:

```json
{
  "nombre": "Restaurante Centro",
  "direccion": "Calle Ejemplo 1",
  "tipo": "Restaurante",
  "telefono": "600000000",
  "imagen_url": "https://example.com/imagen.jpg",
  "carta_url": "https://example.com/carta.pdf",
  "zonas": [
    { "nombre": "Terraza", "capacidad": 20 }
  ],
  "horarios": [
    { "dia_semana": 0, "hora": "13:00" }
  ]
}
```

## Reservas

| Metodo | Ruta | Auth | Descripcion |
| --- | --- | --- | --- |
| GET | `/api/reservas` | No en codigo actual | Lista todas las reservas |
| GET | `/api/reservas/mis` | Si | Reservas del usuario autenticado |
| GET | `/api/reservas/{id}` | No en codigo actual | Detalle de reserva |
| POST | `/api/reservas` | Si | Crea reserva y genera QR |
| PUT | `/api/reservas/{id}` | No en codigo actual | Cambia hora y numero de personas |
| DELETE | `/api/reservas/{id}` | No en codigo actual | Elimina reserva |
| GET | `/api/reservas/establecimiento/{id_establecimiento}?fecha=YYYY-MM-DD` | No en codigo actual | Reservas de un local para una fecha |
| POST | `/api/reservas/usar/{qr_token}` | No en codigo actual | Marca una reserva como usada |

Body de creacion:

```json
{
  "fecha": "2026-05-10",
  "hora": "13:00",
  "num_personas": 4,
  "establecimiento_id": 1,
  "zona_id": 2
}
```

Reglas aplicadas:

- El usuario se resuelve desde el token.
- Un usuario no puede duplicar reserva en la misma fecha y hora.
- La reserva se rechaza si supera la capacidad disponible de la zona.
- Se genera `qr_token` con UUID.

## Disponibilidad

| Metodo | Ruta | Descripcion |
| --- | --- | --- |
| GET | `/api/disponibilidad?establecimiento_id=1&fecha=YYYY-MM-DD` | Disponibilidad por zona y hora |
| GET | `/api/disponibilidad/mes?establecimiento_id=1&year=2026&month=5` | Ocupacion diaria del mes |

## Zonas

| Metodo | Ruta | Descripcion |
| --- | --- | --- |
| GET | `/api/zonas/{establecimiento_id}` | Zonas de un establecimiento |
| POST | `/api/zonas` | Crea zona |
| DELETE | `/api/zonas/{zona_id}` | Elimina zona |

## Horarios

| Metodo | Ruta | Descripcion |
| --- | --- | --- |
| GET | `/api/horarios/{id_establecimiento}` | Horarios de establecimiento |
| GET | `/api/horario/{id}` | Horario por id |
| POST | `/api/horarios` | Crea horario |
| PUT | `/api/horarios/{id}` | Actualiza horario |
| DELETE | `/api/horarios/{id}` | Elimina horario |

## Geo

| Metodo | Ruta | Descripcion |
| --- | --- | --- |
| GET | `/geo/buscar?q=<direccion>` | Busca direcciones con Nominatim |

La busqueda esta limitada por `countrycodes=es`, `viewbox` de Lebrija y concatena `Lebrija` al texto buscado.
