# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import predictions, market_data, news, portfolio, auth, access

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
app.include_router(predictions.router, tags=["Predictions"])
app.include_router(market_data.router, tags=["Market Data"])
app.include_router(news.router,        tags=["News"])
app.include_router(portfolio.router,   tags=["Portfolio"])
app.include_router(auth.router,        tags=["Auth"])
app.include_router(access.router,      tags=["Access"])

@app.get("/")
def root():
    return {"status": "PredictaFi API running", "docs": "/docs"}
