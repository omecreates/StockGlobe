from textblob import TextBlob
import feedparser
from datetime import datetime

RSS_FEEDS = [
    ("Reuters", "https://feeds.reuters.com/reuters/businessNews"),
    ("Yahoo Finance", "https://finance.yahoo.com/news/rssindex"),
    ("MarketWatch", "https://feeds.content.dowjones.io/public/rss/mw_realtimeheadlines"),
]

TICKER_KEYWORDS = {
    "AAPL": ["Apple", "iPhone", "iOS", "Tim Cook"],
    "NVDA": ["NVIDIA", "GPU", "AI chips", "Jensen Huang"],
    "TSLA": ["Tesla", "Elon Musk", "EV"],
    "META": ["Meta", "Facebook", "Instagram", "Zuckerberg"],
    "AMZN": ["Amazon", "AWS", "Bezos"],
    "MSFT": ["Microsoft", "Azure", "Satya Nadella"],
}

def get_tickers_in_headline(headline: str) -> list[str]:
    found = []
    for ticker, keywords in TICKER_KEYWORDS.items():
        if any(kw.lower() in headline.lower() for kw in keywords):
            found.append(ticker)
    return found

def get_news_with_sentiment(limit: int = 6) -> list[dict]:
    items = []
    for source_name, feed_url in RSS_FEEDS:
        try:
            feed = feedparser.parse(feed_url)
            for entry in feed.entries[:3]:
                headline = entry.get("title", "")
                if not headline:
                    continue
                blob = TextBlob(headline)
                sentiment_score = round(blob.sentiment.polarity, 3)
                insight = _generate_insight(headline, sentiment_score)
                tickers = get_tickers_in_headline(headline)

                items.append({
                    "headline": headline,
                    "source": source_name,
                    "time": _format_time(entry.get("published", "")),
                    "sentiment": sentiment_score,
                    "insight": insight,
                    "tickers": tickers if tickers else ["MARKET"],
                })
        except Exception:
            continue

    # Sort by absolute sentiment strength (most opinionated news first)
    items.sort(key=lambda x: abs(x["sentiment"]), reverse=True)
    return items[:limit]

def _generate_insight(headline: str, score: float) -> str:
    if score > 0.3:
        return f"Positive market narrative detected. Sentiment score {score:.2f} suggests bullish positioning opportunity."
    elif score < -0.3:
        return f"Negative signal in headline. Score {score:.2f} warrants caution; consider reducing exposure."
    else:
        return f"Neutral tone (score {score:.2f}). Monitor for follow-up catalysts before acting."

def _format_time(published: str) -> str:
    try:
        from email.utils import parsedate_to_datetime
        dt = parsedate_to_datetime(published)
        return dt.strftime("%H:%M UTC")
    except Exception:
        return "Live"