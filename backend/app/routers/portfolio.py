from fastapi import APIRouter

router = APIRouter()

@router.get("/portfolio")
def portfolio():
    """Returns mock portfolio allocation data (extend with real user portfolios later)."""
    return {
        "total_value": 284910,
        "ytd_return": 12.4,
        "risk_score": 4.2,
        "allocation": [
            {"name": "Equities",    "value": 48, "color": "oklch(0.82 0.17 200)"},
            {"name": "AI / Tech",   "value": 22, "color": "oklch(0.62 0.24 295)"},
            {"name": "Bonds",       "value": 14, "color": "oklch(0.7 0.28 340)"},
            {"name": "Commodities", "value": 9,  "color": "oklch(0.78 0.2 155)"},
            {"name": "Cash",        "value": 7,  "color": "oklch(0.82 0.16 90)"},
        ]
    }