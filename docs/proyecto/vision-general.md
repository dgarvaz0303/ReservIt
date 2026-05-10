# Vision General

ReservIt permite consultar establecimientos, gestionar locales, crear reservas y validar entradas mediante QR.

## Roles

- **cliente**: consulta establecimientos, crea reservas, ve sus reservas y edita su perfil.
- **supervisor**: gestiona sus establecimientos, zonas, horarios y reservas asociadas.
- **admin**: administra usuarios y establecimientos desde la zona de administracion.

## Capacidades principales

- Registro e inicio de sesion con Supabase Auth.
- Perfil de usuario sincronizado con la tabla `usuarios`.
- CRUD de establecimientos.
- Gestion de zonas y capacidad por zona.
- Gestion de horarios por establecimiento.
- Creacion, modificacion y cancelacion de reservas.
- Validacion de reservas mediante token QR.
- Busqueda geografica con Nominatim limitada a Espana y zona de Lebrija.
- Aplicacion web y aplicacion movil sobre el mismo dominio funcional.

## Stack

| Capa | Tecnologia |
| --- | --- |
| API | FastAPI, Uvicorn, Pydantic |
| Datos y auth | Supabase |
| Web | Next.js, React, Supabase JS |
| Mobile | Expo, React Native, Expo Router |
| Documentacion | Docusaurus |
