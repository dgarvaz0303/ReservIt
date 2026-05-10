# Funcionamiento del Frontend

ReservIt tiene dos clientes principales: web y mobile. Ambos consumen el backend y comparten los mismos conceptos funcionales: autenticacion, roles, establecimientos, reservas y perfil.

:::info Criterio de mantenimiento
El frontend debe validar formularios y mejorar la experiencia, pero las reglas definitivas deben mantenerse en el backend.
:::

## Frontend web

Ruta:

```text
frontend/web
```

La aplicacion usa Next.js con App Router. Las paginas estan en:

```text
frontend/web/src/app
```

## Grupos de rutas

### `(auth)`

Contiene las paginas de autenticacion:

- Login.
- Registro.

Estas pantallas se encargan de obtener el token de Supabase a traves del backend y guardarlo para futuras peticiones.

### `(main)`

Contiene las pantallas principales de la aplicacion:

- Inicio.
- Perfil.
- Reservas.
- Establecimientos.
- Locales del supervisor.
- Administracion.

## Gestion del token

Archivo:

```text
frontend/web/src/utils/auth.js
```

Funciones:

- `saveToken(token)`: guarda el access token en `localStorage`.
- `getToken()`: recupera el token.
- `isAuthenticated()`: comprueba si existe token guardado.
- `logout()`: elimina el token.

Cuando una peticion necesita usuario autenticado, debe enviar:

```http
Authorization: Bearer <token>
```

:::warning Almacenamiento del token
El token se guarda en `localStorage`. Si se cambia el mecanismo de autenticacion, hay que actualizar todos los puntos que usan `getToken()` y `logout()`.
:::

## Cliente Supabase web

Archivo:

```text
frontend/web/src/lib/supabase.js
```

Responsabilidad:

- Crear el cliente de Supabase para el frontend usando variables publicas de Next.js.

Variables necesarias:

```env
NEXT_PUBLIC_SUPABASE_URL=<url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

## Componentes compartidos

```text
frontend/web/src/components/navbar.js
frontend/web/src/components/footer.js
frontend/web/src/components/AppDownloadQR.js
```

`AppDownloadQR.js` genera un QR que apunta a la build Android publicada. Si cambia la build mobile, se debe actualizar la constante `apkUrl`.

<details>
  <summary>Como actualizar la URL de descarga mobile</summary>

  1. Generar o publicar una nueva build Android.
  2. Copiar la URL de descarga.
  3. Actualizar `apkUrl` en `frontend/web/src/components/AppDownloadQR.js`.
  4. Comprobar que el QR y el enlace `Descargar APK` apuntan a la nueva URL.

</details>

## Frontend mobile

Ruta:

```text
frontend/mobile
```

La aplicacion mobile usa Expo Router. Las rutas se definen por archivos dentro de:

```text
frontend/mobile/app
```

## Grupos principales

### `(auth)`

Pantallas de login y registro.

### `(tabs)`

Pantallas principales accesibles desde la navegacion inferior:

- Inicio.
- Establecimientos.
- Reservas.
- Mis establecimientos.
- Perfil.

## Estilos mobile

Los estilos estan separados en:

```text
frontend/mobile/themes
```

Esto permite mantener cada pantalla con su hoja de estilos correspondiente y reutilizar colores o constantes visuales.

## Configuracion mobile

Archivo:

```text
frontend/mobile/app.json
```

Contiene nombre de la app, iconos, scheme, configuracion Android, plugins de Expo y datos de EAS.

:::tip Cambios visuales
Antes de modificar estilos compartidos en `themes`, comprueba que no afecten a varias pantallas de forma indirecta.
:::
