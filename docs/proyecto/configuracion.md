# Configuracion

## Backend

Crear `backend/.env`:

```env
SUPABASE_URL=<url-del-proyecto-supabase>
SUPABASE_KEY=<anon-o-service-key-segun-entorno>
```

El cliente de Supabase se inicializa desde `backend/app/supabase_client.py`.

## Frontend web

Crear `frontend/web/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=<url-del-proyecto-supabase>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key-publica>
```

Estas variables se consumen en `frontend/web/src/lib/supabase.js`.

## Mobile

La configuracion nativa principal esta en `frontend/mobile/app.json`.

Datos relevantes:

- `scheme`: `mobile`
- Android package: `com.danieltfg.mobile`
- EAS project id: `b501ae60-ca57-4bf7-8b59-0ca1cf488bc3`

## Seguridad

No se deben versionar claves privadas ni service role keys. Para clientes web y mobile se debe usar una anon key publica con politicas RLS adecuadas en Supabase.
