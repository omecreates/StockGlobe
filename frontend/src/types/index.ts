// ─── Core domain types ────────────────────────────────────────────────────────
// These match the shapes in your existing data/ files exactly

export type SignalDirection = "BUY" | "SELL" | "HOLD";
export type MarketSentiment = "Bullish" | "Bearish" | "Neutral";

export interface Prediction {
  ticker: string;
  name: string;
  direction: SignalDirection;
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
  open?: number;
  high?: number;
  low?: number;
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
  sentiment: MarketSentiment;
}

export interface NewsItem {
  headline: string;
  source: string;
  time: string;
  sentiment: number;
  insight: string;
  tickers: string[];
}

export interface AllocationItem {
  name: string;
  value: number;
  color: string;
}

export interface PortfolioData {
  total_value: number;
  ytd_return: number;
  risk_score: number;
  allocation: AllocationItem[];
}

// ─── Auth types ───────────────────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  name: string;
  plan: "free" | "pro" | "enterprise";
  createdAt: string;
}

// ─── UI State types ───────────────────────────────────────────────────────────
export interface ToastConfig {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message?: string;
  duration?: number;
}

export interface ModalState {
  demo: boolean;
  requestAccess: boolean;
  auth: "login" | "signup" | null;
  predictionDetail: Prediction | null;
  marketDetail: Market | null;
}
