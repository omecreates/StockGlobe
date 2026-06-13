import yfinance as yf
import pandas as pd
import numpy as np
from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any, Optional

router = APIRouter()

def calculate_rsi(prices: pd.Series, period: int = 14) -> pd.Series:
    delta = prices.diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
    rs = gain / loss
    return 100 - (100 / (1 + rs))

def calculate_macd(prices: pd.Series, fast: int = 12, slow: int = 26, signal: int = 9):
    ema_fast = prices.ewm(span=fast, adjust=False).mean()
    ema_slow = prices.ewm(span=slow, adjust=False).mean()
    macd_line = ema_fast - ema_slow
    signal_line = macd_line.ewm(span=signal, adjust=False).mean()
    histogram = macd_line - signal_line
    return macd_line, signal_line, histogram

def calculate_bollinger_bands(prices: pd.Series, period: int = 20, std_dev: int = 2):
    sma = prices.rolling(window=period).mean()
    std = prices.rolling(window=period).std()
    upper_band = sma + (std * std_dev)
    lower_band = sma - (std * std_dev)
    return sma, upper_band, lower_band

def find_support_resistance(highs: pd.Series, lows: pd.Series, window: int = 20):
    support = lows.rolling(window=window, center=True).min()
    resistance = highs.rolling(window=window, center=True).max()
    # Find unique levels roughly
    current_price = highs.iloc[-1]
    
    # Get last valid non-nan support/resistance
    supp_levels = support.dropna().unique()
    res_levels = resistance.dropna().unique()
    
    # Simple logic for closest levels
    supp_levels = [s for s in supp_levels if s < current_price]
    res_levels = [r for r in res_levels if r > current_price]
    
    supp = max(supp_levels) if supp_levels else 0
    res = min(res_levels) if res_levels else 0
    
    return float(supp), float(res)

def generate_insights(current_price: float, rsi: float, macd_hist: float, sma20: float, sma50: float, sma200: float) -> List[str]:
    insights = []
    sentiment_score = 0
    
    if pd.isna(rsi):
        pass
    elif rsi > 70:
        insights.append(f"RSI is at {rsi:.1f}, indicating overbought conditions. Price might consolidate or correct.")
        sentiment_score -= 1
    elif rsi < 30:
        insights.append(f"RSI is at {rsi:.1f}, indicating oversold conditions. A rebound might be possible.")
        sentiment_score += 1
    else:
        insights.append(f"RSI is at {rsi:.1f}, indicating neutral momentum.")
        
    if not pd.isna(macd_hist):
        if macd_hist > 0:
            insights.append("MACD shows bullish momentum.")
            sentiment_score += 1
        elif macd_hist < 0:
            insights.append("MACD shows bearish momentum.")
            sentiment_score -= 1
            
    if not pd.isna(sma200):
        if current_price > sma200:
            insights.append("Price is trading above the 200-day SMA, indicating a long-term uptrend.")
            sentiment_score += 1
        else:
            insights.append("Price is trading below the 200-day SMA, indicating a long-term downtrend.")
            sentiment_score -= 1
            
    if not pd.isna(sma20) and not pd.isna(sma50):
        if sma20 > sma50:
            insights.append("Short-term trend is bullish (SMA20 > SMA50).")
            sentiment_score += 1
        else:
            insights.append("Short-term trend is bearish (SMA20 < SMA50).")
            sentiment_score -= 1
            
    if sentiment_score >= 2:
        recommendation = "Buy"
    elif sentiment_score <= -2:
        recommendation = "Sell"
    else:
        recommendation = "Hold"
        
    return {
        "insights": insights,
        "recommendation": recommendation,
        "score": sentiment_score
    }

@router.get("/ta/{ticker}")
def get_technical_analysis(ticker: str, period: str = "1y"):
    try:
        stock = yf.Ticker(ticker)
        df = stock.history(period=period)
        
        if df.empty:
            raise HTTPException(status_code=404, detail=f"No data found for {ticker}")
            
        # Ensure index is datetime and sort
        df.index = pd.to_datetime(df.index)
        df = df.sort_index()
        
        close = df['Close']
        high = df['High']
        low = df['Low']
        
        # Calculate Indicators manually to avoid dependency issues
        df['SMA20'] = close.rolling(window=20).mean()
        df['SMA50'] = close.rolling(window=50).mean()
        df['SMA200'] = close.rolling(window=200).mean()
        
        df['EMA20'] = close.ewm(span=20, adjust=False).mean()
        df['EMA50'] = close.ewm(span=50, adjust=False).mean()
        
        df['RSI'] = calculate_rsi(close, 14)
        
        macd_line, signal_line, macd_hist = calculate_macd(close)
        df['MACD'] = macd_line
        df['MACD_Signal'] = signal_line
        df['MACD_Hist'] = macd_hist
        
        bb_sma, bb_upper, bb_lower = calculate_bollinger_bands(close, 20, 2)
        df['BB_SMA'] = bb_sma
        df['BB_Upper'] = bb_upper
        df['BB_Lower'] = bb_lower
        
        # Support/Resistance
        supp, res = find_support_resistance(high, low)
        
        # Latest values for insights
        latest = df.iloc[-1]
        
        insights_data = generate_insights(
            current_price=latest['Close'],
            rsi=latest['RSI'],
            macd_hist=latest['MACD_Hist'],
            sma20=latest['SMA20'],
            sma50=latest['SMA50'],
            sma200=latest['SMA200']
        )
        
        # Prepare response format suitable for lightweight-charts
        # Lightweight charts needs time format: 'yyyy-mm-dd'
        formatted_data = []
        for index, row in df.iterrows():
            formatted_data.append({
                "time": index.strftime('%Y-%m-%d'),
                "open": row.get('Open', 0),
                "high": row.get('High', 0),
                "low": row.get('Low', 0),
                "close": row.get('Close', 0),
                "volume": row.get('Volume', 0),
                "sma20": None if pd.isna(row.get('SMA20')) else row['SMA20'],
                "sma50": None if pd.isna(row.get('SMA50')) else row['SMA50'],
                "sma200": None if pd.isna(row.get('SMA200')) else row['SMA200'],
                "ema20": None if pd.isna(row.get('EMA20')) else row['EMA20'],
                "ema50": None if pd.isna(row.get('EMA50')) else row['EMA50'],
                "rsi": None if pd.isna(row.get('RSI')) else row['RSI'],
                "macd": None if pd.isna(row.get('MACD')) else row['MACD'],
                "macd_signal": None if pd.isna(row.get('MACD_Signal')) else row['MACD_Signal'],
                "macd_hist": None if pd.isna(row.get('MACD_Hist')) else row['MACD_Hist'],
                "bb_upper": None if pd.isna(row.get('BB_Upper')) else row['BB_Upper'],
                "bb_lower": None if pd.isna(row.get('BB_Lower')) else row['BB_Lower'],
                "bb_sma": None if pd.isna(row.get('BB_SMA')) else row['BB_SMA'],
            })
            
        return {
            "ticker": ticker.upper(),
            "data": formatted_data,
            "support": supp,
            "resistance": res,
            "insights": insights_data["insights"],
            "recommendation": insights_data["recommendation"],
            "sentiment_score": insights_data["score"]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
