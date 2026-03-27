from pydantic import BaseModel, EmailStr, Field

class UserCreate(BaseModel):
    nombre: str = Field(..., min_length=2, max_length=50)
    nombre_user: str = Field(..., min_length=3, max_length=30)
    email: EmailStr
    telefono: str = Field(..., pattern="^[0-9]+$", min_length=9, max_length=15)
    password: str = Field(
        ...,
        min_length=6,
        pattern=r"^(?=.*[A-Z])(?=.*\d).+$"
    )