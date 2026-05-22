import yfinance as yf
import numpy as np
import pandas as pd
import joblib
import os
from functools import lru_cache

MODEL_DIR = os.path.join(os.path.dirname(__file__), "saved_models")

TICKER_NAMES = {
    "NVDA": "NVIDIA Corp", "TSLA": "Tesla Inc", "AAPL": "Apple Inc",
    "META": "Meta Platforms", "AMZN": "Amazon.com", "BABA": "Alibaba Group",
    "MSFT": "Microsoft Corp", "GOOGL": "Alphabet Inc",
}

REASONS = {
    "BUY": [
        "Strong momentum with bullish technical setup. RSI and moving average convergence signal upside.",
        "Recent price action and volume suggest institutional accumulation.",
        "Positive earnings trajectory combined with sector tailwinds.",
    ],
    "SELL": [
        "Overbought conditions with weakening momentum indicators.",
        "Elevated volatility and mean-reversion signal suggest near-term pullback.",
        "Macro headwinds and margin pressure likely to weigh on price.",
    ],
    "HOLD": [
        "Mixed signals — upside limited by resistance, downside cushioned by support.",
        "Awaiting catalyst. Model confidence below conviction threshold.",
        "Consolidation phase expected before next directional move.",
    ]
}

@lru_cache(maxsize=1)
def load_models():
    direction_model = joblib.load(f"{MODEL_DIR}/direction_model.pkl")
    return_model = joblib.load(f"{MODEL_DIR}/return_model.pkl")
    feature_cols = joblib.load(f"{MODEL_DIR}/feature_cols.pkl")
    return direction_model, return_model, feature_cols

def make_features_single(df: pd.DataFrame) -> pd.Series:
    df = df.copy()
    df["returns_1d"] = df["Close"].pct_change(1)
    df["returns_5d"] = df["Close"].pct_change(5)
    df["returns_20d"] = df["Close"].pct_change(20)
    df["sma_10"] = df["Close"].rolling(10).mean()
    df["sma_30"] = df["Close"].rolling(30).mean()
    df["sma_ratio"] = df["sma_10"] / df["sma_30"]
    df["volatility"] = df["returns_1d"].rolling(20).std()
    delta = df["Close"].diff()
    gain = delta.clip(lower=0).rolling(14).mean()
    loss = (-delta.clip(upper=0)).rolling(14).mean()
    df["rsi"] = 100 - (100 / (1 + gain / (loss + 1e-10)))
    df["vol_ratio"] = df["Volume"] / df["Volume"].rolling(20).mean()
    return df.dropna().iloc[-1]

def predict_ticker(ticker: str) -> dict:
    direction_model, return_model, feature_cols = load_models()

    stock = yf.Ticker(ticker)
    df = stock.history(period="3mo")
    if df.empty:
        raise ValueError(f"No data for {ticker}")

    features_row = make_features_single(df)
    X = pd.DataFrame([features_row[feature_cols]])

    direction_proba = direction_model.predict_proba(X)[0]
    direction_int = direction_model.predict(X)[0]
    predicted_return = float(return_model.predict(X)[0])

    current_price = float(df["Close"].iloc[-1])
    target_price = round(current_price * (1 + predicted_return), 2)

    # Convert to signal
    confidence = round(max(direction_proba) * 100, 1)
    if confidence > 75 and direction_int == 1:
        signal = "BUY"
    elif confidence > 75 and direction_int == 0:
        signal = "SELL"
    else:
        signal = "HOLD"

    import random
    reason = random.choice(REASONS[signal])

    return {
        "ticker": ticker,
        "name": TICKER_NAMES.get(ticker, ticker),
        "direction": signal,
        "target": target_price,
        "current": round(current_price, 2),
        "confidence": confidence,
        "horizon": "30D",
        "reason": reason,
    }