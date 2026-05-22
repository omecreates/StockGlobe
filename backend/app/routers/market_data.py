from fastapi import APIRouter, Query, HTTPException
from app.services.yfinance_service import get_price_history, get_market_indices, get_current_price
from app.models.market import PricePoint, MarketOut

router = APIRouter()

@router.get("/price-series", response_model=list[PricePoint])
def price_series(
    ticker: str = Query(default="SPY", description="Stock ticker"),
    days: int = Query(default=60, ge=5, le=365)
):
    """
    Returns historical price data + a simple predicted trendline.
    Example: /api/price-series?ticker=SPY&days=60
    """
    try:
        data = get_price_history(ticker, days)
        # Add a simple predicted line (5% above trend — replace with real ML later)
        for i, point in enumerate(data):
            trend_factor = 1 + (i / len(data)) * 0.05
            point["predicted"] = round(point["price"] * trend_factor, 2)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/markets", response_model=list[MarketOut])
def markets():
    """Returns global market indices with live data."""
    try:
        return get_market_indices()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/quote/{ticker}")
def quote(ticker: str):
    """Returns current price for a single ticker."""
    try:
        return get_current_price(ticker.upper())
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))