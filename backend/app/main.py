from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import prediction
from app.routers import market_data
from app.routers import news
from app.routers import portfolio
from app.routers import auth
from app.routers import access

app = FastAPI(
    title="PredictaFi API",
    description="AI-powered stock market prediction API",
    version="1.0.0"
)

# CORS — allows your React frontend to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:8080",
        "http://localhost:8081",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Register all routers ─────────────────────────────────────────────────────
app.include_router(prediction.router, prefix="/api", tags=["Predictions"])
app.include_router(market_data.router, prefix="/api", tags=["Market Data"])
app.include_router(news.router, prefix="/api", tags=["News"])
app.include_router(portfolio.router, prefix="/api", tags=["Portfolio"])
app.include_router(auth.router, prefix="/api", tags=["Auth"])
app.include_router(access.router, prefix="/api", tags=["Access"])
@app.get("/")
def root():
    return {"status": "PredictaFi API running", "docs": "/docs"}
