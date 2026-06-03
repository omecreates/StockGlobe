from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: str
    email: EmailStr
    name: str = ""
    plan: str = "free"
    createdAt: str = ""
    is_verified: bool = False
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

class WatchlistCreate(BaseModel):
    ticker: str

class WatchlistOut(BaseModel):
    id: str
    ticker: str
    created_at: datetime
    
    class Config:
        from_attributes = True
