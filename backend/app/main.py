from fastapi import FastAPI
from app.routes import test
from app.routes.auth import register
app = FastAPI()



app.include_router(register.router)
app.include_router(test.router)

@app.get("/")
def root():
    return {"message": "Backend funcionando"}