import os
import httpx
from textblob import TextBlob
from datetime import datetime, timezone
import json
import time
from dotenv import load_dotenv

from app.models.news import LiveNewsItem
from app.services.sentiment_service import TICKER_KEYWORDS, get_tickers_in_headline

load_dotenv()

# Simple custom TTL Cache
_news_cache = {"data": None, "timestamp": 0}
CACHE_TTL = 300 # 5 minutes

FINNHUB_API_KEY = os.getenv("FINNHUB_API_KEY", "")
FINNHUB_URL = "https://finnhub.io/api/v1/news?category=general&minId=10"

# Mock Data for fallback
MOCK_NEWS_DATA = [
    {
        "category": "technology",
        "datetime": int(datetime.now().timestamp()) - 1000,
        "headline": "NVIDIA earnings optimism is driving positive sentiment across semiconductor stocks.",
        "id": 1,
        "image": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485",
        "related": "NVDA, AMD, INTC",
        "source": "TechCrunch",
        "summary": "Analysts predict a record-breaking quarter for NVIDIA as AI demand surges globally.",
        "url": "https://example.com/nvda-earnings"
    },
    {
        "category": "technology",
        "datetime": int(datetime.now().timestamp()) - 3600,
        "headline": "Tesla faces headwinds in European markets amid new regulations.",
        "id": 2,
        "image": "https://images.unsplash.com/photo-1560958089-b8a1929cea89",
        "related": "TSLA",
        "source": "Bloomberg",
        "summary": "European regulators introduce stricter compliance requirements for electric vehicles.",
        "url": "https://example.com/tsla-europe"
    },
    {
        "category": "business",
        "datetime": int(datetime.now().timestamp()) - 7200,
        "headline": "Apple announces revolutionary AI integration in upcoming iOS release.",
        "id": 3,
        "image": "https://images.unsplash.com/photo-1512054502232-10a0a035d672",
        "related": "AAPL",
        "source": "Reuters",
        "summary": "Apple Intelligence aims to completely overhaul the user experience on mobile devices.",
        "url": "https://example.com/aapl-ai"
    },
    {
        "category": "economy",
        "datetime": int(datetime.now().timestamp()) - 10800,
        "headline": "Fed signals potential rate cuts by end of Q3, markets rally.",
        "id": 4,
        "image": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3",
        "related": "",
        "source": "CNBC",
        "summary": "Federal Reserve officials indicate inflation is cooling faster than expected.",
        "url": "https://example.com/fed-rates"
    },
    {
        "category": "technology",
        "datetime": int(datetime.now().timestamp()) - 14400,
        "headline": "Microsoft Cloud growth slows, Azure margins remain strong.",
        "id": 5,
        "image": "https://images.unsplash.com/photo-1642104704074-907c0698cbd9",
        "related": "MSFT",
        "source": "Wall Street Journal",
        "summary": "Despite slower top-line growth, Microsoft maintains robust profitability in its cloud sector.",
        "url": "https://example.com/msft-cloud"
    },
    {
        "category": "retail",
        "datetime": int(datetime.now().timestamp()) - 18000,
        "headline": "Amazon expands drone delivery to three new states.",
        "id": 6,
        "image": "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2",
        "related": "AMZN",
        "source": "The Verge",
        "summary": "Prime Air drone delivery service continues its nationwide rollout.",
        "url": "https://example.com/amzn-drones"
    }
]

def analyze_sentiment(text: str):
    blob = TextBlob(text)
    score = blob.sentiment.polarity
    
    # Calculate confidence based on subjectivity and polarity magnitude
    subjectivity = blob.sentiment.subjectivity
    confidence = min(0.5 + (abs(score) * 0.5) + (subjectivity * 0.2), 0.99)
    
    if score > 0.2:
        sentiment = "Bullish"
    elif score < -0.2:
        sentiment = "Bearish"
    else:
        sentiment = "Neutral"
        
    return sentiment, round(confidence, 2), score

def generate_ai_insight(headline: str, summary: str, sentiment: str, score: float, tickers: list[str]) -> str:
    ticker_str = ", ".join(tickers) if tickers else "The broader market"
    if sentiment == "Bullish":
        return f"AI Market Insight: Strong positive momentum detected for {ticker_str}. Language suggests significant upside catalysts."
    elif sentiment == "Bearish":
        return f"AI Market Insight: Negative signals surrounding {ticker_str}. Sentiment score indicates potential downside risks or headwinds."
    else:
        return f"AI Market Insight: Neutral positioning on {ticker_str}. Monitoring for definitive directional catalysts."

def fetch_live_news() -> list[LiveNewsItem]:
    current_time = time.time()
    if _news_cache["data"] and (current_time - _news_cache["timestamp"] < CACHE_TTL):
        return _news_cache["data"]
        
    raw_news = []
    
    if FINNHUB_API_KEY:
        try:
            with httpx.Client(timeout=5.0) as client:
                response = client.get(f"{FINNHUB_URL}&token={FINNHUB_API_KEY}")
                if response.status_code == 200:
                    raw_news = response.json()[:20] # Get top 20 news
                else:
                    raw_news = MOCK_NEWS_DATA
        except Exception as e:
            raw_news = MOCK_NEWS_DATA
    else:
        raw_news = MOCK_NEWS_DATA
        
    processed_news = []
    
    for item in raw_news:
        headline = item.get("headline", "")
        summary = item.get("summary", "")
        combined_text = f"{headline} {summary}"
        
        sentiment_label, confidence, score = analyze_sentiment(combined_text)
        
        # Extract tickers
        related = item.get("related", "")
        tickers = []
        if related:
            tickers = [t.strip() for t in related.split(",") if t.strip()]
        
        # Fallback to headline extraction if none provided by API
        if not tickers:
            tickers = get_tickers_in_headline(headline)
            
        insight = generate_ai_insight(headline, summary, sentiment_label, score, tickers)
        
        # Parse timestamp
        timestamp = item.get("datetime")
        published_at = datetime.now(timezone.utc).isoformat()
        if timestamp:
            try:
                published_at = datetime.fromtimestamp(timestamp, tz=timezone.utc).isoformat()
            except:
                pass
                
        # Default placeholder image if missing
        image = item.get("image")
        if not image:
            image = "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3"
            
        processed_news.append(
            LiveNewsItem(
                title=headline,
                source=item.get("source", "Unknown"),
                url=item.get("url", "#"),
                published_at=published_at,
                image=image,
                sentiment=sentiment_label,
                confidence=confidence,
                tickers=tickers,
                summary=insight
            )
        )
        
    _news_cache["data"] = processed_news
    _news_cache["timestamp"] = current_time
    
    return processed_news
