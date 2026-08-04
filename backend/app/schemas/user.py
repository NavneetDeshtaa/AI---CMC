import uuid
from pydantic import BaseModel, EmailStr
from app.models.user import UserRole


class UserSignup(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: uuid.UUID
    name: str
    email: EmailStr
    role: UserRole

    class Config:
        from_attributes = True


class AuthResponse(BaseModel):
    token: str
    user: UserOut