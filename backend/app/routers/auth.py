# backend/app/routers/auth.py
# Simple JWT auth — no database needed for demo
# Uses an in-memory user store. Replace with a real DB for production.

from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
import hashlib, secrets, time, json

router = APIRouter()
security = HTTPBearer(auto_error=False)

# ─── In-memory user store (replace with DB in production) ─────────────────────
USERS: dict[str, dict] = {}   # email -> user record
TOKENS: dict[str, str] = {}   # token -> email

# ─── Schemas ──────────────────────────────────────────────────────────────────

class LoginPayload(BaseModel):
    email: str
    password: str

class SignupPayload(BaseModel):
    name: str
    email: str
    password: str

class UserOut(BaseModel):
    id: str
    email: str
    name: str
    plan: str
    createdAt: str

class AuthResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

# ─── Helpers ──────────────────────────────────────────────────────────────────

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def make_token() -> str:
    return secrets.token_hex(32)

def make_user_id() -> str:
    return secrets.token_hex(8)

# ─── Routes ───────────────────────────────────────────────────────────────────

@router.post("/auth/signup", response_model=AuthResponse)
def signup(payload: SignupPayload):
    email = payload.email.lower().strip()

    if email in USERS:
        raise HTTPException(status_code=409, detail="Email already registered")

    user_id = make_user_id()
    user = {
        "id": user_id,
        "email": email,
        "name": payload.name,
        "plan": "free",
        "createdAt": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "password_hash": hash_password(payload.password),
    }
    USERS[email] = user

    token = make_token()
    TOKENS[token] = email

    return AuthResponse(
        access_token=token,
        token_type="bearer",
        user=UserOut(**{k: v for k, v in user.items() if k != "password_hash"}),
    )

@router.post("/auth/login", response_model=AuthResponse)
def login(payload: LoginPayload):
    email = payload.email.lower().strip()
    user = USERS.get(email)

    if not user or user["password_hash"] != hash_password(payload.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = make_token()
    TOKENS[token] = email

    return AuthResponse(
        access_token=token,
        token_type="bearer",
        user=UserOut(**{k: v for k, v in user.items() if k != "password_hash"}),
    )

@router.get("/auth/me", response_model=UserOut)
def get_me(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")

    email = TOKENS.get(credentials.credentials)
    if not email or email not in USERS:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user = USERS[email]
    return UserOut(**{k: v for k, v in user.items() if k != "password_hash"})
