from pydantic import BaseModel
from typing import Literal

class MarketOut(BaseModel):
    code: str
    name: str
    city: str
    index: str
    lat: float
    lng: float
    value: float
    change: float
    confidence: float
    sentiment: Literal["Bullish", "Bearish", "Neutral"]

class PricePoint(BaseModel):
    t: int
    label: str
    price: float
    predicted: float
    volume: int
    