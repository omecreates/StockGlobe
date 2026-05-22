/* eslint-disable prettier/prettier */
export interface Prediction {
  ticker: string;
  name: string;
  direction: "BUY" | "SELL" | "HOLD";
  target: number;
  current: number;
  confidence: number;
  horizon: string;
  reason: string;
}

export interface PricePoint {
  t: number;
  label: string;
  price: number;
  predicted: number;
  volume: number;
}

export interface Market {
  code: string;
  name: string;
  city: string;
  index: string;
  lat: number;
  lng: number;
  value: number;
  change: number;
  confidence: number;
  sentiment: "Bullish" | "Bearish" | "Neutral";
}

export interface NewsItem {
  headline: string;
  source: string;
  time: string;
  sentiment: number;
  insight: string;
  tickers: string[];
}

export interface PortfolioData {
  total_value: number;
  ytd_return: number;
  risk_score: number;

  allocation: {
    name: string;
    value: number;
    color: string;
  }[];
}
