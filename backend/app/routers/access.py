# backend/app/routers/access.py
# Handles the "Request Access" form submissions

from fastapi import APIRouter
from pydantic import BaseModel
import time

router = APIRouter()

# In-memory waitlist (replace with DB / email service in production)
WAITLIST: list[dict] = []

class AccessRequestPayload(BaseModel):
    name: str
    email: str
    company: str
    use_case: str

@router.post("/api/request-access")
def request_access(payload: AccessRequestPayload):
    # Check if already on waitlist
    existing = next((w for w in WAITLIST if w["email"] == payload.email.lower()), None)
    if existing:
        return {
            "message": "Already on waitlist",
            "position": WAITLIST.index(existing) + 1
        }

    # Add to waitlist
    WAITLIST.append({
        "name": payload.name,
        "email": payload.email.lower(),
        "company": payload.company,
        "use_case": payload.use_case,
        "submitted_at": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
    })

    position = len(WAITLIST)

    # TODO: Send confirmation email here (add SendGrid/Resend integration)
    # e.g. send_welcome_email(payload.email, payload.name, position)

    return {
        "message": "Successfully added to waitlist",
        "position": position
    }

@router.get("/api/waitlist-count")
def waitlist_count():
    """Admin endpoint — how many people have requested access"""
    return {"count": len(WAITLIST)}
