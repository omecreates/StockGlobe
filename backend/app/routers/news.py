from fastapi import APIRouter, Query
from app.services.sentiment_service import get_news_with_sentiment
from app.services.live_news_service import fetch_live_news
from app.models.news import NewsItem, LiveNewsItem

router = APIRouter()

@router.get("/news-sentiment", response_model=list[NewsItem])
def news_sentiment(limit: int = Query(default=6, ge=1, le=20)):
    """Returns recent financial news with AI sentiment scores."""
    return get_news_with_sentiment(limit=limit)

@router.get("/news/live", response_model=list[LiveNewsItem])
def live_news():
    """Returns live market news intelligence with AI insights."""
    return fetch_live_news()