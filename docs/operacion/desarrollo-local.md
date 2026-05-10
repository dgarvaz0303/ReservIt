# Desarrollo Local

## Requisitos

- Python 3.11 o superior recomendado.
- Node.js compatible con Next.js 16 y Expo 54.
- npm.
- Cuenta y proyecto Supabase.

## Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API local:

```text
http://localhost:8000
```

## Web

```bash
cd frontend/web
npm install
npm run dev
```

Web local:

```text
http://localhost:3000
```

## Mobile

```bash
cd frontend/mobile
npm install
npm start
```

Para ejecutar en Android:

```bash
npm run android
```

## Documentacion Docusaurus

Desde la raiz:

```bash
npm install
npm run docs:dev
```

Documentacion local:

```text
http://localhost:3000
```

Si el frontend web ya ocupa el puerto 3000, Docusaurus ofrecera otro puerto o puede ejecutarse con:

```bash
npm run docs:dev -- --port 3001
```
