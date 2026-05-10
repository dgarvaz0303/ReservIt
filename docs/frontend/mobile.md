# Frontend Mobile

La aplicacion movil esta en:

```text
frontend/mobile
```

## Stack

- Expo 54
- React Native 0.81
- React 19
- Expo Router
- React Navigation
- Async Storage
- Expo Camera, Print, Sharing, Image Picker y Document Picker

## Comandos

```bash
cd frontend/mobile
npm install
npm start
```

Comandos utiles:

```bash
npm run android
npm run ios
npm run web
npm run lint
```

## Estructura

```text
frontend/mobile/
├── app/
│   ├── (auth)/
│   ├── (tabs)/
│   ├── _layout.tsx
│   └── modal.tsx
├── components/
├── constants/
├── hooks/
└── themes/
```

## Navegacion

Expo Router usa archivos como rutas:

- `(auth)/login.tsx`
- `(auth)/register.tsx`
- `(tabs)/index.tsx`
- `(tabs)/reservas.tsx`
- `(tabs)/reservas/[id].tsx`
- `(tabs)/perfil/index.tsx`
- `(tabs)/perfil/editar.tsx`
- `(tabs)/establecimientos/index.tsx`
- `(tabs)/establecimientos/[id].tsx`
- `(tabs)/mis-establecimientos/index.tsx`
- `(tabs)/mis-establecimientos/[id]/index.tsx`

## Configuracion nativa

Archivo:

```text
frontend/mobile/app.json
```

Valores relevantes:

- `scheme`: `mobile`
- `android.package`: `com.danieltfg.mobile`
- `web.output`: `static`
- `experiments.typedRoutes`: `true`
- `experiments.reactCompiler`: `true`

## Build Android

La web incluye un QR de descarga hacia una build Expo Android desde `frontend/web/src/components/AppDownloadQR.js`.
