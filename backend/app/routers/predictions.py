from fastapi import APIRouter, HTTPException, Query
from app.ml.predictor import predict_ticker
from app.models.prediction import PredictionOut

router = APIRouter()

DEFAULT_TICKERS = ["NVDA", "TSLA", "AAPL", "META", "AMZN", "BABA"]

@router.get("/predictions", response_model=list[PredictionOut])
def get_predictions(
    tickers: str = Query(default=",".join(DEFAULT_TICKERS),
                         description="Comma-separated list of tickers")
):
    """
    Returns ML predictions for a list of stock tickers.
    Example: /api/predictions?tickers=NVDA,AAPL,TSLA
    """
    ticker_list = [t.strip().upper() for t in tickers.split(",")]
    results = []
    for ticker in ticker_list:
        try:
            results.append(predict_ticker(ticker))
        except Exception as e:
            # Don't fail all predictions if one ticker errors
            continue

    if not results:
        raise HTTPException(status_code=503, detail="Could not fetch any predictions")
    return results