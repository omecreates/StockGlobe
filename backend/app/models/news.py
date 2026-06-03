from pydantic import BaseModel

class NewsItem(BaseModel):
    headline: str
    source: str
    time: str
    sentiment: float   # -1.0 to 1.0
    insight: str
    tickers: list[str]

class LiveNewsItem(BaseModel):
    title: str
    source: str
    url: str
    published_at: str
    image: str
    sentiment: str       # Bullish, Neutral, Bearish
    confidence: float    # 0.0 to 1.0
    tickers: list[str]
    summary: str         # AI Market Insight