# Documentacion Tecnica y de Mantenimiento

## Objetivo

El objetivo de esta documentacion es recoger la informacion tecnica necesaria para comprender, ejecutar, mantener y evolucionar ReservIt.

La documentacion esta orientada a tres perfiles principales:

- **Desarrollador**: instrucciones para instalar, ejecutar y mantener el proyecto.
- **Responsable tecnico**: vision clara de arquitectura, dependencias, despliegue y puntos sensibles.
- **Usuario de pruebas**: credenciales y flujos basicos para validar los roles disponibles.

## Alcance

ReservIt cubre el ciclo principal de reservas en establecimientos:

- Registro e inicio de sesion de usuarios.
- Gestion de perfiles.
- Consulta de establecimientos.
- Creacion y consulta de reservas.
- Validacion de reservas mediante QR.
- Gestion de establecimientos por parte de supervisores.
- Administracion de usuarios y locales.
- Cliente web y cliente movil.

## Tecnologias utilizadas

| Area | Tecnologia |
| --- | --- |
| Backend | FastAPI, Uvicorn, Pydantic |
| Autenticacion y base de datos | Supabase |
| Frontend web | Next.js, React |
| Frontend mobile | Expo, React Native, Expo Router |
| Documentacion | Docusaurus |

## Estructura documental

La documentacion se organiza en bloques:

- **Proyecto**: vision general, arquitectura, estructura y configuracion.
- **Backend**: API, autenticacion y modelos.
- **Frontend**: aplicacion web y aplicacion movil.
- **Mantenimiento**: funcionamiento interno, flujos principales y resolucion de incidencias.
- **Operacion**: desarrollo local, despliegue y checklist tecnico.

## Criterios de revision

Para una revision completa del sistema se recomienda comprobar:

1. Que el backend arranca correctamente y expone la documentacion OpenAPI.
2. Que la aplicacion web permite iniciar sesion con los roles de prueba.
3. Que el cliente movil se puede ejecutar con Expo.
4. Que las rutas principales de la API responden correctamente.
5. Que las credenciales sensibles estan configuradas mediante variables de entorno.
6. Que la documentacion Docusaurus se puede generar mediante build.

## Ejecucion de la documentacion

Desde la raiz del repositorio:

```bash
npm install
npm run docs:dev
```

Para generar la version estatica:

```bash
npm run docs:build
```
