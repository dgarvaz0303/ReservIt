# Funcionamiento del Backend

Esta seccion describe como esta organizado el codigo del backend y que responsabilidad tiene cada modulo. No pretende sustituir al codigo fuente, sino facilitar su mantenimiento.

:::info Como leer esta pagina
Cada modulo se explica desde el punto de vista de mantenimiento: responsabilidad, archivos afectados, tablas implicadas y puntos donde suelen aparecer errores.
:::

## Entrada de la aplicacion

Archivo principal:

```text
backend/app/main.py
```

Responsabilidades:

- Crear la instancia de FastAPI.
- Configurar CORS.
- Importar los routers de cada dominio funcional.
- Registrar las rutas de la API.
- Exponer la ruta raiz `GET /`.

Cuando se anade un nuevo modulo de rutas, debe importarse y registrarse en este archivo mediante `app.include_router(...)`.

:::tip Ampliar la API
Para anadir una nueva funcionalidad, crea primero el router en `backend/app/routes`, despues registralo en `main.py` y finalmente documenta el endpoint en `docs/backend/api.md`.
:::

## Cliente de Supabase

Archivo:

```text
backend/app/supabase_client.py
```

Responsabilidades:

- Leer la URL y clave de Supabase desde variables de entorno.
- Crear el cliente compartido de Supabase.
- Permitir que rutas y servicios consulten Auth y tablas de base de datos.

Si falla cualquier operacion con Supabase, este archivo y las variables `SUPABASE_URL` y `SUPABASE_KEY` son el primer punto que debe revisarse.

:::danger Claves de Supabase
No se debe usar una service role key en clientes web o mobile. Las claves con permisos elevados solo deben existir en entornos controlados del backend.
:::

## Autenticacion

Archivo:

```text
backend/app/routes/auth/dependencies.py
```

La funcion `get_current_user` protege rutas que necesitan usuario autenticado.

Flujo:

1. Lee el header `Authorization`.
2. Extrae el token Bearer.
3. Llama a `supabase.auth.get_user(token)`.
4. Devuelve el usuario de Supabase si el token es valido.
5. Lanza `401` si el token no existe, ha caducado o no es valido.

Uso habitual:

```python
def endpoint(current_user=Depends(get_current_user)):
    ...
```

<details>
  <summary>Que comprobar si una ruta protegida devuelve 401</summary>

  - El cliente esta enviando el header `Authorization`.
  - El valor empieza por `Bearer `.
  - El token no ha caducado.
  - El proyecto Supabase configurado en backend coincide con el usado en login.
  - El usuario existe en Supabase Auth.

</details>

## Modulo de auth

Archivos:

```text
backend/app/routes/auth/register.py
backend/app/routes/auth/login.py
```

### `register`

Responsabilidades:

- Crear el usuario en Supabase Auth.
- Insertar el perfil complementario en la tabla `usuarios`.
- Asignar el rol inicial `cliente`.

Tablas o servicios implicados:

- Supabase Auth.
- `usuarios`.

### `login`

Responsabilidades:

- Validar email y contrasena con Supabase Auth.
- Buscar el perfil interno en `usuarios`.
- Devolver access token, refresh token, nombre y rol.

Si el login funciona en Supabase pero no en la aplicacion, normalmente hay que revisar que exista una fila en `usuarios` con el `auth_id` correcto.

## Modulo de usuarios

Archivo:

```text
backend/app/routes/usuarios/usuarios.py
```

Responsabilidades principales:

- Obtener el perfil del usuario autenticado.
- Actualizar datos personales.
- Eliminar la cuenta propia.
- Listar usuarios.
- Consultar usuarios por `id` o `auth_id`.
- Cambiar el rol entre `cliente` y `supervisor`.
- Eliminar usuarios desde administracion.

Punto de mantenimiento importante:

- Las operaciones administrativas deben estar protegidas por autenticacion y comprobacion de rol antes de exponerse en produccion.

:::warning Seguridad de administracion
Algunas rutas administrativas se apoyan en la logica de frontend o no declaran una comprobacion completa de rol en el backend. Antes de desplegar en produccion, la autorizacion debe aplicarse siempre en la API.
:::

## Modulo de establecimientos

Archivo:

```text
backend/app/routes/establecimientos/establecimientos.py
```

Responsabilidades principales:

- Listar establecimientos.
- Calcular capacidad total a partir de sus zonas.
- Consultar detalle de establecimiento con zonas y horarios.
- Crear establecimientos asociados al usuario autenticado.
- Crear zonas y horarios iniciales.
- Actualizar datos, zonas y horarios.
- Eliminar establecimientos propios.
- Eliminar establecimientos como administrador.

Tablas implicadas:

- `establecimiento`
- `zonas`
- `horarios_establecimiento`
- `reserva`
- `usuarios`

Punto delicado:

- Al actualizar zonas, si una zona desaparece del formulario, el backend borra sus reservas asociadas antes de eliminarla.

:::warning Borrado de zonas
Eliminar una zona puede borrar reservas asociadas. Antes de cambiar esta logica, revisa el impacto en historicos, informes y reservas activas.
:::

## Modulo de reservas

Archivo:

```text
backend/app/routes/reservas/reservas.py
```

Responsabilidades principales:

- Listar reservas.
- Obtener reservas del usuario autenticado.
- Consultar reservas de un establecimiento en una fecha.
- Consultar detalle de una reserva.
- Crear reservas.
- Actualizar hora y numero de personas.
- Eliminar reservas.
- Validar una reserva mediante QR.

Tablas implicadas:

- `reserva`
- `usuarios`
- `establecimiento`
- `zonas`

La creacion de una reserva es uno de los puntos mas importantes del backend porque aplica reglas de negocio: usuario autenticado, reserva no duplicada, capacidad disponible y generacion de `qr_token`.

<details>
  <summary>Reglas internas de creacion de reserva</summary>

  1. La reserva siempre se asocia al usuario obtenido desde el token.
  2. Se impide duplicar una reserva para el mismo usuario, fecha y hora.
  3. La capacidad disponible se calcula sumando `num_personas` de reservas existentes.
  4. El QR se genera con UUID y se almacena en `qr_token`.
  5. El estado inicial del QR es `qr_usado = False`.

</details>

## Modulo de disponibilidad

Archivo:

```text
backend/app/routes/reservas/disponibilidad.py
```

Responsabilidades:

- Calcular disponibilidad por fecha, zona y hora.
- Calcular ocupacion diaria de un mes.

Este modulo cruza datos de:

- Zonas del establecimiento.
- Horarios del establecimiento.
- Reservas existentes.

Si la disponibilidad aparece vacia, hay que comprobar que el establecimiento tenga zonas y horarios configurados.

:::tip Diagnostico rapido
Si `GET /api/disponibilidad` devuelve `[]`, comprueba primero zonas y horarios. Sin esos datos, el modulo no puede construir franjas disponibles.
:::

## Modulos de zonas y horarios

Archivos:

```text
backend/app/routes/zonas/zonas.py
backend/app/routes/horarios/horarios.py
```

Responsabilidades:

- Consultar, crear y eliminar zonas.
- Consultar, crear, actualizar y eliminar horarios.

Punto de revision:

- El codigo usa `horarios` en algunas rutas y `horarios_establecimiento` en otras. Conviene mantener un unico criterio de tabla para evitar errores de datos.

:::warning Consistencia de tablas
Antes de modificar horarios, revisa si la pantalla o endpoint usa `horarios` o `horarios_establecimiento`. Esta diferencia puede provocar que un cambio se guarde en una tabla pero se lea desde otra.
:::

## Modulo geo

Archivo:

```text
backend/app/routes/geo/geo.py
```

Responsabilidad:

- Buscar direcciones mediante Nominatim/OpenStreetMap.

La busqueda esta limitada a Espana y al entorno de Lebrija mediante parametros como `countrycodes`, `viewbox` y el texto adicional `Lebrija`.
