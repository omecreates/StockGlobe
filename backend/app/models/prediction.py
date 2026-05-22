from pydantic import BaseModel
from typing import Literal

class PredictionOut(BaseModel):
    ticker: str
    name: str
    direction: Literal["BUY", "SELL", "HOLD"]
    target: float
    current: float
    confidence: float   # 0–100
    horizon: str        # e.g. "30D"
    reason: str