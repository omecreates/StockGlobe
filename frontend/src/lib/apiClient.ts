/* eslint-disable prettier/prettier */
import {
  Prediction,
  PricePoint,
  Market,
  NewsItem,
  PortfolioData
} from "@/types/api";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}

export const api = {
  predictions: (tickers = "NVDA,TSLA,AAPL,META,AMZN,BABA") =>
    apiFetch<Prediction[]>(`/api/predictions?tickers=${tickers}`),

  priceSeries: (ticker = "SPY", days = 60) =>
    apiFetch<PricePoint[]>(`/api/price-series?ticker=${ticker}&days=${days}`),

  markets: () =>
    apiFetch<Market[]>("/api/markets"),

  newsSentiment: (limit = 6) =>
    apiFetch<NewsItem[]>(`/api/news-sentiment?limit=${limit}`),

  portfolio: () =>
    apiFetch<PortfolioData>("/api/portfolio"),
};