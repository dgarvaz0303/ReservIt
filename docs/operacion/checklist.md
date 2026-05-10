# Checklist Tecnico

## Antes de desarrollar

- Crear `.env` en `backend`.
- Crear `.env.local` en `frontend/web`.
- Instalar dependencias de backend, web y mobile.
- Comprobar que Supabase Auth esta habilitado.
- Verificar que las tablas esperadas existen en Supabase.

## Antes de desplegar

- Limitar CORS a dominios reales.
- Revisar que las rutas administrativas exigen rol `admin`.
- Activar politicas RLS en Supabase si se accede desde clientes.
- Evitar service role keys en aplicaciones cliente.
- Revisar logs de errores del backend.
- Ejecutar build de Next.js.
- Ejecutar lint de mobile.

## Riesgos conocidos a revisar

- Algunas rutas de administracion y consulta no declaran dependencia de autenticacion en el codigo actual.
- El backend usa nombres de tablas de horarios distintos en algunos puntos: `horarios` y `horarios_establecimiento`.
- El README actual contiene claves de ejemplo; conviene mover toda clave real a variables de entorno.
- `allow_origins=["*"]` es util en desarrollo, pero demasiado amplio para produccion.
