# Backend

El backend esta construido con FastAPI y usa Supabase como proveedor de autenticacion y base de datos.

## Entrada de la aplicacion

Archivo principal:

```text
backend/app/main.py
```

Comando de ejecucion:

```bash
cd backend
uvicorn app.main:app --reload
```

Por defecto, la documentacion automatica de FastAPI queda disponible en:

- `http://localhost:8000/docs`
- `http://localhost:8000/redoc`

## Middleware

La API tiene CORS abierto:

```python
allow_origins=["*"]
allow_credentials=True
allow_methods=["*"]
allow_headers=["*"]
```

Para produccion conviene limitar `allow_origins` a los dominios reales de la web y la app.
