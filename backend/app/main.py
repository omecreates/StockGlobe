from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.predictions import router as predictions_router

app = FastAPI(
    title="Neuralyx API",
    description="AI-powered stock prediction backend",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    predictions_router,
    prefix="/api",
    tags=["Predictions"]
)

@app.get("/")
def root():
    return {
        "status": "Neuralyx backend running"
    }