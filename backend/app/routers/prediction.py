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

TOP_50_TICKERS = [
    "AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "TSLA", "BABA", "V", "JNJ",
    "WMT", "JPM", "MA", "PG", "UNH", "DIS", "HD", "PYPL", "BAC", "VZ",
    "ADBE", "CMCSA", "NFLX", "KO", "NKE", "MRK", "PEP", "T", "PFE", "INTC",
    "CRM", "ABT", "ORCL", "ABBV", "CSCO", "TMO", "AVGO", "XOM", "ACN", "QCOM",
    "COST", "CVX", "LLY", "MCD", "DHR", "MDT", "NEE", "TXN", "HON", "UNP"
]

@router.get("/predictions/top50", response_model=list[PredictionOut])
def get_top50_predictions():
    """
    Returns ML predictions for 50 top stocks via batch processing.
    """
    from app.ml.predictor import predict_tickers_batch
    results = predict_tickers_batch(TOP_50_TICKERS)
    if not results:
        raise HTTPException(status_code=503, detail="Could not fetch Top 50 predictions")
    return results