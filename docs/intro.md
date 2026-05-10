---
sidebar_position: 1
slug: /
---

# ReservIt

ReservIt es una plataforma multiplataforma para la gestion de reservas en establecimientos. El sistema permite a los clientes consultar locales y realizar reservas, a los supervisores administrar sus establecimientos y a los administradores gestionar usuarios y recursos de la plataforma.

El proyecto esta organizado como un monorepo con tres piezas principales:

- **Backend**: API REST en FastAPI conectada a Supabase.
- **Frontend web**: aplicacion Next.js para clientes, supervisores y administradores.
- **Frontend mobile**: aplicacion Expo/React Native con navegacion mediante Expo Router.

Esta documentacion describe la arquitectura, configuracion, modelo funcional, API, clientes frontend, despliegue y mantenimiento del sistema. Su objetivo es que cualquier persona del equipo pueda entender como funciona ReservIt, ejecutarlo en local y realizar cambios con seguridad.

## Contenido principal

1. [Documentacion tecnica](./proyecto/documentacion-tecnica.md)
2. [Vision general](./proyecto/vision-general.md)
3. [Arquitectura](./proyecto/arquitectura.md)
4. [Configuracion](./proyecto/configuracion.md)
5. [API backend](./backend/api.md)
6. [Funcionamiento del backend](./mantenimiento/backend.md)
7. [Flujos principales](./mantenimiento/flujos.md)
8. [Usuarios de prueba](./proyecto/usuarios-prueba.md)
9. [Despliegue](./operacion/despliegue.md)
