# Autenticacion y Autorizacion

## Registro

`POST /api/register`

Flujo:

1. Crea usuario en Supabase Auth con email y password.
2. Inserta perfil en la tabla `usuarios`.
3. Asigna el rol inicial `cliente`.

## Login

`POST /api/login`

Flujo:

1. Valida credenciales con Supabase Auth.
2. Busca el perfil en `usuarios` mediante `auth_id`.
3. Devuelve access token, refresh token, nombre y rol.

## Proteccion de rutas

Las rutas protegidas usan `get_current_user` desde:

```text
backend/app/routes/auth/dependencies.py
```

El cliente debe enviar:

```http
Authorization: Bearer <access_token>
```

El backend valida el token con Supabase:

```python
supabase.auth.get_user(token)
```

## Roles

Los roles se guardan en la columna `roll` de la tabla `usuarios`.

Roles usados en el codigo:

- `cliente`
- `supervisor`
- `admin`

La promocion o degradacion entre `cliente` y `supervisor` se realiza con `PUT /api/usuarios/{id}/rol`.
