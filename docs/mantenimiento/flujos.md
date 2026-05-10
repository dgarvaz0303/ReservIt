import EndpointInspector from '@site/src/components/EndpointInspector';
import MaintenanceChecklist from '@site/src/components/MaintenanceChecklist';

# Flujos Principales del Sistema

Esta seccion describe los procesos funcionales mas importantes de ReservIt y los archivos que intervienen en cada uno.

<EndpointInspector />

:::info Objetivo
Los flujos estan documentados para localizar rapidamente que archivo tocar, que tablas intervienen y que comprobaciones deben mantenerse al modificar la funcionalidad.
:::

## Registro de usuario

Endpoint:

```http
POST /api/register
```

Archivo:

```text
backend/app/routes/auth/register.py
```

Flujo:

1. El cliente envia nombre, usuario, email, telefono y contrasena.
2. El backend valida el body con `UserCreate`.
3. Se crea el usuario en Supabase Auth.
4. Se inserta un registro en `usuarios` con el `auth_id` de Supabase.
5. Se asigna el rol `cliente`.

Si falla despues de crear el usuario en Auth, puede quedar un usuario sin perfil interno. En ese caso hay que revisar la tabla `usuarios`.

:::warning Sincronizacion Auth / usuarios
Supabase Auth y la tabla `usuarios` deben estar sincronizados mediante `auth_id`. Si una de las dos partes falta, el login o el perfil pueden fallar aunque las credenciales sean correctas.
:::

## Inicio de sesion

Endpoint:

```http
POST /api/login
```

Archivo:

```text
backend/app/routes/auth/login.py
```

Flujo:

1. El cliente envia email y contrasena.
2. Supabase valida las credenciales.
3. El backend obtiene el `auth_id`.
4. Se busca el usuario en la tabla `usuarios`.
5. Se devuelve token, refresh token, nombre y rol.
6. El frontend guarda el access token.

<details>
  <summary>Datos devueltos por el login</summary>

  - `access_token`: token usado en peticiones autenticadas.
  - `refresh_token`: token para renovar sesion.
  - `nombre`: nombre visible del usuario.
  - `rol`: rol usado para adaptar la interfaz.

</details>

## Crear establecimiento

Endpoint:

```http
POST /api/establecimientos
```

Archivo:

```text
backend/app/routes/establecimientos/establecimientos.py
```

Flujo:

1. El backend valida el token con `get_current_user`.
2. Busca el usuario interno mediante `auth_id`.
3. Inserta el establecimiento con `id_user`.
4. Inserta las zonas recibidas en el body.
5. Inserta los horarios recibidos en el body.

Tablas afectadas:

- `establecimiento`
- `zonas`
- `horarios_establecimiento`

:::tip Mantenimiento
Si se anaden nuevos campos al formulario de establecimiento, hay que actualizar el modelo Pydantic, el insert del backend y las pantallas web/mobile que envian los datos.
:::

## Actualizar establecimiento

Endpoint:

```http
PUT /api/establecimientos/{id}
```

Flujo:

1. Valida el usuario autenticado.
2. Comprueba que el establecimiento pertenece a ese usuario.
3. Actualiza campos base como nombre, direccion, tipo, telefono o imagen.
4. Compara las zonas actuales con las recibidas.
5. Borra zonas eliminadas desde el frontend.
6. Crea zonas nuevas.
7. Repite una logica similar para horarios.

Punto importante:

- Si se elimina una zona, tambien se eliminan las reservas asociadas a esa zona.

:::danger Impacto sobre reservas
No cambies la sincronizacion de zonas sin revisar reservas activas. Un borrado automatico puede afectar a clientes con reservas ya creadas.
:::

## Consultar disponibilidad

Endpoint:

```http
GET /api/disponibilidad?establecimiento_id=1&fecha=YYYY-MM-DD
```

Archivo:

```text
backend/app/routes/reservas/disponibilidad.py
```

Flujo:

1. Obtiene zonas del establecimiento.
2. Obtiene horarios del establecimiento.
3. Obtiene reservas existentes para la fecha.
4. Calcula plazas ocupadas por zona y hora.
5. Devuelve capacidad, ocupadas y disponibles.

<details>
  <summary>Campos devueltos por disponibilidad</summary>

  - `zona_id`: identificador de la zona.
  - `zona`: nombre de la zona.
  - `hora`: franja horaria.
  - `capacidad`: capacidad total de la zona.
  - `ocupadas`: plazas ya reservadas.
  - `disponibles`: plazas restantes.

</details>

## Crear reserva

Endpoint:

```http
POST /api/reservas
```

Archivo:

```text
backend/app/routes/reservas/reservas.py
```

Flujo:

1. Lee el body de la peticion.
2. Comprueba que existe header `Authorization`.
3. Valida el token con Supabase.
4. Busca el usuario interno en `usuarios`.
5. Comprueba que el usuario no tenga ya una reserva en la misma fecha y hora.
6. Busca la zona seleccionada.
7. Suma las personas ya reservadas para esa zona, fecha y hora.
8. Calcula plazas disponibles.
9. Si hay capacidad, genera un `qr_token`.
10. Inserta la reserva con `qr_usado` en `False`.

Reglas de negocio:

- Un usuario no puede reservar dos veces en la misma fecha y hora.
- No se permite superar la capacidad de la zona.
- Cada reserva genera un token QR unico.

:::warning Mantener estas reglas
Estas validaciones deben permanecer en backend aunque tambien existan controles visuales en frontend. El frontend mejora la experiencia, pero la API es la fuente de verdad.
:::

## Validar QR

Endpoint:

```http
POST /api/reservas/usar/{qr_token}
```

Flujo:

1. Busca una reserva por `qr_token`.
2. Si no existe, devuelve error.
3. Si el QR ya fue usado, devuelve error.
4. Marca `qr_usado` como `True`.
5. Guarda la fecha de uso en `qr_usado_en`.

## Cambiar rol de usuario

Endpoint:

```http
PUT /api/usuarios/{id}/rol
```

Flujo:

1. Busca el usuario por `id`.
2. Lee el rol actual.
3. Si es `cliente`, lo cambia a `supervisor`.
4. Si no es `cliente`, lo cambia a `cliente`.

Punto de seguridad:

- Esta operacion debe quedar limitada a usuarios administradores.

:::danger Ruta sensible
El cambio de rol modifica permisos funcionales. Debe protegerse con autenticacion y validacion explicita de rol `admin`.
:::

## Checklist de revision

Usa este checklist cuando se modifiquen endpoints, roles o reglas de reserva.

<MaintenanceChecklist />
