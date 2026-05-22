from pydantic import BaseModel

class NewsItem(BaseModel):
    headline: str
    source: str
    time: str
    sentiment: float   # -1.0 to 1.0
    insight: str
    tickers: list[str]