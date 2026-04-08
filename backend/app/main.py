from fastapi import FastAPI
from app.routes import test
from app.routes.auth import register
from app.routes.auth import login
from app.routes.establecimientos import establecimientos
app = FastAPI()



app.include_router(establecimientos.router)
app.include_router(register.router)
app.include_router(test.router)
app.include_router(login.router)

@app.get("/")
def root():
    return {"message": "Backend funcionando"}