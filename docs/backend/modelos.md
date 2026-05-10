# Modelos y Datos

Los modelos Pydantic viven en `backend/app/models`.

## Usuario

`UserCreate`

| Campo | Tipo | Reglas |
| --- | --- | --- |
| `nombre` | string | 2 a 50 caracteres |
| `nombre_user` | string | 3 a 30 caracteres |
| `email` | EmailStr | email valido |
| `telefono` | string | 9 a 15 digitos |
| `password` | string | minimo 6 caracteres, una mayuscula y un numero |

`UserUpdate` permite actualizar `nombre`, `nombre_user`, `email` y `telefono`.

## Establecimiento

`EstablecimientoCreate`

| Campo | Tipo |
| --- | --- |
| `nombre` | string |
| `direccion` | string |
| `tipo` | string |
| `telefono` | string |
| `imagen_url` | string opcional |
| `carta_url` | string opcional |
| `zonas` | lista de objetos |
| `horarios` | lista de objetos |

## Reserva

`ReservaCreate`

| Campo | Tipo |
| --- | --- |
| `fecha` | date |
| `hora` | time |
| `num_personas` | int |
| `id_user` | int |
| `id_establecimiento` | int |

En la ruta real de creacion, el backend obtiene `id_user` desde el token y espera en el body `establecimiento_id`, `zona_id`, `fecha`, `hora` y `num_personas`.

## Zona

`ZonaCreate`

| Campo | Tipo | Reglas |
| --- | --- | --- |
| `establecimiento_id` | int | requerido |
| `nombre` | string | 2 a 50 caracteres |
| `capacidad` | int | mayor que 0 |

## Horario

`HorarioCreate`

| Campo | Tipo | Nota |
| --- | --- | --- |
| `id_establecimiento` | int | requerido |
| `dia_semana` | int | 0=lunes, 6=domingo |
| `hora_apertura` | time | requerido |
| `hora_cierre` | time | requerido |
