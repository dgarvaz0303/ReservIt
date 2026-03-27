from pydantic import BaseModel, EmailStr, Field, field_validator

class UserCreate(BaseModel):
    nombre: str = Field(..., min_length=2, max_length=50)
    nombre_user: str = Field(..., min_length=3, max_length=30)
    email: EmailStr
    telefono: str = Field(..., pattern="^[0-9]+$", min_length=9, max_length=15)
    password: str

    @field_validator("password")
    def validate_password(cls, value):
        if len(value) < 6:
            raise ValueError("La contraseña debe tener al menos 6 caracteres")
        if not any(c.isupper() for c in value):
            raise ValueError("Debe contener al menos una mayúscula")
        if not any(c.isdigit() for c in value):
            raise ValueError("Debe contener al menos un número")
        return value