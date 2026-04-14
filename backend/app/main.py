from fastapi import FastAPI
from app.routes import test
from app.routes.auth import register
from app.routes.auth import login
from app.routes.establecimientos import establecimientos
from app.routes.usuarios import usuarios
from app.routes.reservas import reservas
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()




app.include_router(usuarios.router)
app.include_router(reservas.router)
app.include_router(establecimientos.router)
app.include_router(register.router)
app.include_router(test.router)
app.include_router(login.router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
def root():
    return {"message": "Backend funcionando"}