from fastapi import APIRouter, Query
from app.services.sentiment_service import get_news_with_sentiment
from app.models.news import NewsItem

router = APIRouter()

@router.get("/news-sentiment", response_model=list[NewsItem])
def news_sentiment(limit: int = Query(default=6, ge=1, le=20)):
    """Returns recent financial news with AI sentiment scores."""
    return get_news_with_sentiment(limit=limit)