# Despliegue

## Backend

El backend incluye:

- `backend/runtime.txt`
- `backend/Procfile.txt`
- `backend/requirements.txt`

Comando esperado de arranque:

```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

Variables necesarias:

```env
SUPABASE_URL=<url-del-proyecto-supabase>
SUPABASE_KEY=<clave-configurada-para-backend>
```

## Web

La web se despliega como una aplicacion Next.js.

Build:

```bash
cd frontend/web
npm install
npm run build
npm run start
```

Variables necesarias:

```env
NEXT_PUBLIC_SUPABASE_URL=<url-del-proyecto-supabase>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key-publica>
```

## Mobile

La app mobile esta preparada para Expo y EAS.

Archivo de configuracion:

```text
frontend/mobile/eas.json
```

Comando habitual:

```bash
cd frontend/mobile
npx eas build -p android
```

## Documentacion

Build estatica de Docusaurus:

```bash
npm run docs:build
```

El resultado queda en:

```text
build/
```
