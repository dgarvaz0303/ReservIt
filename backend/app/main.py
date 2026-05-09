from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# ROUTES
from app.routes import test
from app.routes.auth import register
from app.routes.auth import login
from app.routes.establecimientos import establecimientos
from app.routes.usuarios import usuarios
from app.routes.reservas import reservas
from app.routes.horarios import horarios
from app.routes.zonas import zonas
from app.routes.reservas import disponibilidad
from app.routes.geo import geo

app = FastAPI()

# =========================
# CORS
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# ROUTERS
# =========================

app.include_router(disponibilidad.router)
app.include_router(zonas.router)
app.include_router(horarios.router)
app.include_router(usuarios.router)
app.include_router(reservas.router)
app.include_router(establecimientos.router)
app.include_router(register.router)
app.include_router(test.router)
app.include_router(login.router)
app.include_router(geo.router)

# =========================
# ROOT
# =========================

@app.get("/")
def root():
    return {
        "message": "Backend funcionando"
    }