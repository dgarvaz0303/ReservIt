# Estructura del Repositorio

```text
ReservIt/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── supabase_client.py
│   │   ├── models/
│   │   └── routes/
│   ├── requirements.txt
│   ├── runtime.txt
│   └── Procfile.txt
├── frontend/
│   ├── web/
│   │   ├── src/app/
│   │   ├── src/components/
│   │   ├── src/styles/
│   │   └── package.json
│   └── mobile/
│       ├── app/
│       ├── components/
│       ├── themes/
│       └── package.json
├── docs/
├── docusaurus.config.js
├── sidebars.js
└── package.json
```

## Convenciones

- Las rutas FastAPI se registran en `backend/app/main.py`.
- Los modelos Pydantic viven en `backend/app/models`.
- Las pantallas web estan en `frontend/web/src/app`.
- Los estilos web se agrupan en `frontend/web/src/styles`.
- Las pantallas mobile se definen por archivo en `frontend/mobile/app`.
- Los estilos mobile se concentran en `frontend/mobile/themes`.
