from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.watchlist import Watchlist
from app.models.user import User
from app.schemas import WatchlistCreate, WatchlistOut
from app.routers.auth import get_current_user
from typing import List

router = APIRouter()

@router.get("/watchlist", response_model=List[WatchlistOut])
def get_watchlist(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    items = db.query(Watchlist).filter(Watchlist.user_id == current_user.id).all()
    return items

@router.post("/watchlist", response_model=WatchlistOut)
def add_to_watchlist(payload: WatchlistCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    existing = db.query(Watchlist).filter(Watchlist.user_id == current_user.id, Watchlist.ticker == payload.ticker).first()
    if existing:
        raise HTTPException(status_code=400, detail="Ticker already in watchlist")
    
    new_item = Watchlist(
        user_id=current_user.id,
        ticker=payload.ticker
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@router.delete("/watchlist/{ticker}")
def remove_from_watchlist(ticker: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    item = db.query(Watchlist).filter(Watchlist.user_id == current_user.id, Watchlist.ticker == ticker).first()
    if not item:
        raise HTTPException(status_code=404, detail="Ticker not found in watchlist")
    
    db.delete(item)
    db.commit()
    return {"message": "Removed from watchlist"}

@router.get("/watchlist/insights")
def get_watchlist_insights(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    items = db.query(Watchlist).filter(Watchlist.user_id == current_user.id).all()
    if not items:
        return {"insights": ["Your watchlist is empty. Add some stocks to see AI insights."]}
    
    # Mock AI insights for the demo
    tickers = [item.ticker for item in items]
    insights = [
        f"{len(tickers)} watched stocks currently have Buy signals.",
        f"{tickers[0]} sentiment increased 12% this week." if tickers else "",
        "Market volatility is up, consider holding cash positions."
    ]
    return {"insights": [insight for insight in insights if insight]}
