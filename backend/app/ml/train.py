"""
Run this once to train the prediction model:
    python -m app.ml.train
"""
import yfinance as yf
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
import joblib
import os

TICKERS = ["NVDA", "TSLA", "AAPL", "META", "AMZN", "MSFT", "GOOGL"]
SAVE_DIR = os.path.join(os.path.dirname(__file__), "saved_models")
os.makedirs(SAVE_DIR, exist_ok=True)

def make_features(df: pd.DataFrame) -> pd.DataFrame:
    """Create technical indicator features from OHLCV data."""
    df = df.copy()
    df["returns_1d"] = df["Close"].pct_change(1)
    df["returns_5d"] = df["Close"].pct_change(5)
    df["returns_20d"] = df["Close"].pct_change(20)

    # Simple Moving Averages
    df["sma_10"] = df["Close"].rolling(10).mean()
    df["sma_30"] = df["Close"].rolling(30).mean()
    df["sma_ratio"] = df["sma_10"] / df["sma_30"]

    # Volatility
    df["volatility"] = df["returns_1d"].rolling(20).std()

    # RSI (14-period)
    delta = df["Close"].diff()
    gain = delta.clip(lower=0).rolling(14).mean()
    loss = (-delta.clip(upper=0)).rolling(14).mean()
    df["rsi"] = 100 - (100 / (1 + gain / (loss + 1e-10)))

    # Volume ratio
    df["vol_ratio"] = df["Volume"] / df["Volume"].rolling(20).mean()

    # Target: will price be higher in 30 days?
    df["target_direction"] = (df["Close"].shift(-30) > df["Close"]).astype(int)
    df["target_return"] = df["Close"].shift(-30) / df["Close"] - 1

    return df.dropna()

FEATURE_COLS = ["returns_1d","returns_5d","returns_20d","sma_ratio","volatility","rsi","vol_ratio"]

def train():
    all_data = []
    print("Downloading training data...")

    for ticker in TICKERS:
        print(f"  Fetching {ticker}...")
        stock = yf.Ticker(ticker)
        df = stock.history(period="5y")
        if df.empty:
            continue
        df = make_features(df)
        all_data.append(df)

    combined = pd.concat(all_data, ignore_index=True)
    X = combined[FEATURE_COLS]
    y_dir = combined["target_direction"]
    y_ret = combined["target_return"]

    print(f"Training on {len(X)} samples...")

    # Direction classifier (BUY / SELL / HOLD)
    direction_model = Pipeline([
        ("scaler", StandardScaler()),
        ("clf", RandomForestClassifier(n_estimators=200, max_depth=8, random_state=42, n_jobs=-1))
    ])
    direction_model.fit(X, y_dir)

    # Return magnitude regressor
    return_model = Pipeline([
        ("scaler", StandardScaler()),
        ("reg", GradientBoostingRegressor(n_estimators=200, max_depth=4, random_state=42))
    ])
    return_model.fit(X, y_ret)

    # Save models
    joblib.dump(direction_model, f"{SAVE_DIR}/direction_model.pkl")
    joblib.dump(return_model, f"{SAVE_DIR}/return_model.pkl")
    joblib.dump(FEATURE_COLS, f"{SAVE_DIR}/feature_cols.pkl")

    # Quick accuracy check
    from sklearn.model_selection import cross_val_score
    scores = cross_val_score(direction_model, X, y_dir, cv=5, scoring="accuracy")
    print(f"\n✅ Model trained! Direction accuracy: {scores.mean()*100:.1f}% ± {scores.std()*100:.1f}%")
    print(f"   Models saved to: {SAVE_DIR}/")

if __name__ == "__main__":
    train()