# Frontend Web

La aplicacion web esta en:

```text
frontend/web
```

## Stack

- Next.js 16
- React 19
- Supabase JS
- qrcode.react
- jsPDF
- Tailwind CSS 4

## Comandos

```bash
cd frontend/web
npm install
npm run dev
```

La app se abre normalmente en:

```text
http://localhost:3000
```

## Variables

Crear `frontend/web/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=<url-del-proyecto-supabase>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key-publica>
```

## Rutas principales

| Ruta | Archivo | Proposito |
| --- | --- | --- |
| `/login` | `src/app/(auth)/login/page.js` | Inicio de sesion |
| `/register` | `src/app/(auth)/register/page.js` | Registro |
| `/` | `src/app/(main)/page.js` | Landing o inicio principal |
| `/establecimientos` | `src/app/(main)/establecimientos/page.js` | Listado de establecimientos |
| `/establecimientos/[id]` | `src/app/(main)/establecimientos/[id]/page.js` | Detalle publico |
| `/reservas` | `src/app/(main)/reservas/page.js` | Reservas del usuario |
| `/reservas/[id]` | `src/app/(main)/reservas/[id]/page.js` | Detalle de reserva |
| `/locales` | `src/app/(main)/locales/page.js` | Locales del supervisor |
| `/locales/crear-establecimiento` | `src/app/(main)/locales/crear-establecimiento/page.js` | Alta de establecimiento |
| `/administracion` | `src/app/(main)/administracion/page.js` | Panel admin |
| `/perfil` | `src/app/(main)/perfil/page.js` | Perfil |

## Componentes compartidos

- `src/components/navbar.js`
- `src/components/footer.js`
- `src/components/AppDownloadQR.js`

`AppDownloadQR` genera un QR con `qrcode.react` para descargar la build Android publicada en Expo.

## Autenticacion cliente

El helper `src/utils/auth.js` guarda el access token en `localStorage` bajo la clave `token`.

Funciones disponibles:

- `saveToken(token)`
- `getToken()`
- `isAuthenticated()`
- `logout()`
