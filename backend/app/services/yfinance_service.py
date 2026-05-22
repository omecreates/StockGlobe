import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta

# Maps tickers to readable names
TICKER_NAMES = {
    "NVDA": "NVIDIA Corp",
    "TSLA": "Tesla Inc",
    "AAPL": "Apple Inc",
    "META": "Meta Platforms",
    "AMZN": "Amazon.com",
    "BABA": "Alibaba Group",
    "MSFT": "Microsoft Corp",
    "GOOGL": "Alphabet Inc",
    "SPY": "S&P 500 ETF",
}

def get_current_price(ticker: str) -> dict:
    """Fetch current price and basic info for a ticker."""
    stock = yf.Ticker(ticker)
    info = stock.info
    history = stock.history(period="2d")

    if history.empty:
        raise ValueError(f"No data for {ticker}")

    current = float(history["Close"].iloc[-1])
    prev = float(history["Close"].iloc[-2]) if len(history) > 1 else current
    change_pct = ((current - prev) / prev) * 100

    return {
        "ticker": ticker,
        "name": info.get("longName", TICKER_NAMES.get(ticker, ticker)),
        "current": round(current, 2),
        "change_pct": round(change_pct, 2),
    }

def get_price_history(ticker: str, days: int = 60) -> list[dict]:
    """Fetch historical OHLCV data as a list of dicts."""
    stock = yf.Ticker(ticker)
    end = datetime.today()
    start = end - timedelta(days=days * 2)  # get extra to ensure enough trading days
    df = stock.history(start=start, end=end)

    # Keep only the last `days` rows
    df = df.tail(days).reset_index()
    df.index = range(len(df))

    result = []
    for i, row in df.iterrows():
        result.append({
            "t": i,
            "label": row["Date"].strftime("%b %d"),
            "price": round(float(row["Close"]), 2),
            "volume": int(row["Volume"]),
            "open": round(float(row["Open"]), 2),
            "high": round(float(row["High"]), 2),
            "low": round(float(row["Low"]), 2),
        })
    return result

def get_market_indices() -> list[dict]:
    """Fetch global market index data."""
    index_map = [
        {"code": "USA",  "name": "United States", "city": "New York",   "index": "S&P 500",      "ticker": "^GSPC", "lat": 40.71, "lng": -74.01},
        {"code": "IND",  "name": "India",          "city": "Mumbai",     "index": "NIFTY 50",     "ticker": "^NSEI", "lat": 19.08, "lng": 72.88},
        {"code": "JPN",  "name": "Japan",          "city": "Tokyo",      "index": "Nikkei 225",   "ticker": "^N225", "lat": 35.68, "lng": 139.65},
        {"code": "GBR",  "name": "UK",             "city": "London",     "index": "FTSE 100",     "ticker": "^FTSE", "lat": 51.51, "lng": -0.13},
        {"code": "DEU",  "name": "Germany",        "city": "Frankfurt",  "index": "DAX 40",       "ticker": "^GDAXI","lat": 50.11, "lng": 8.68},
        {"code": "SGP",  "name": "Singapore",      "city": "Singapore",  "index": "STI",          "ticker": "^STI",  "lat": 1.35,  "lng": 103.82},
    ]

    results = []
    for m in index_map:
        try:
            stock = yf.Ticker(m["ticker"])
            hist = stock.history(period="5d")
            if hist.empty:
                continue
            current = float(hist["Close"].iloc[-1])
            prev = float(hist["Close"].iloc[-2]) if len(hist) > 1 else current
            change = round(((current - prev) / prev) * 100, 2)
            sentiment = "Bullish" if change > 0.5 else ("Bearish" if change < -0.5 else "Neutral")
            confidence = min(95, max(55, 75 + abs(change) * 5))
            results.append({**m, "value": round(current, 2), "change": change,
                            "confidence": round(confidence, 1), "sentiment": sentiment})
        except Exception:
            continue  # skip if data unavailable
    return results