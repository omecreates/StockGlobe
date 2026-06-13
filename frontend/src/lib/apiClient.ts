/* eslint-disable prettier/prettier */
import type {
  Prediction,
  PricePoint,
  Market,
  NewsItem,
  PortfolioData,
  User,
} from "@/types";

const BASE_URL = (import.meta.env.VITE_API_URL as string) || "http://localhost:8000";

// ─── Core fetch wrapper ───────────────────────────────────────────────────────

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem("predictafi_token");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options?.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new ApiError(res.status, body.detail ?? `HTTP ${res.status}`);
  }

  return res.json();
}

// ─── Market data ─────────────────────────────────────────────────────────────

export const marketApi = {
  predictions: (tickers = "NVDA,TSLA,AAPL,META,AMZN,BABA") =>
    apiFetch<Prediction[]>(`/api/predictions?tickers=${tickers}`),

  predictionsTop50: () =>
    apiFetch<Prediction[]>("/api/predictions/top50"),

  priceSeries: (ticker = "SPY", days = 60) =>
    apiFetch<PricePoint[]>(`/api/price-series?ticker=${ticker}&days=${days}`),

  markets: () => apiFetch<Market[]>("/api/markets"),

  newsSentiment: (limit = 6) =>
    apiFetch<NewsItem[]>(`/api/news-sentiment?limit=${limit}`),

  portfolio: () => apiFetch<PortfolioData>("/api/portfolio"),

  quote: (ticker: string) =>
    apiFetch<{ ticker: string; name: string; current: number; change_pct: number }>(
      `/api/quote/${ticker}`,
    ),
};

// ─── Auth API ─────────────────────────────────────────────────────────────────

interface LoginPayload {
  email: string;
  password: string;
}

interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export const authApi = {
  login: (payload: LoginPayload) =>
    apiFetch<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  signup: (payload: SignupPayload) =>
    apiFetch<AuthResponse>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  me: () => apiFetch<User>("/api/auth/me"),

  logout: () => {
    localStorage.removeItem("predictafi_token");
    localStorage.removeItem("predictafi_user");
  },
};

// ─── Request Access API ────────────────────────────────────────────────────────

export interface AccessRequestPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const accessApi = {
  requestAccess: (payload: AccessRequestPayload) =>
    apiFetch<{ message: string; position: number }>("/api/request-access", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

// ─── Watchlist API ────────────────────────────────────────────────────────────

export interface WatchlistEntry {
  id: string;
  ticker: string;
  created_at: string;
}

export const watchlistApi = {
  getAll: () => apiFetch<WatchlistEntry[]>("/api/watchlist"),

  add: (ticker: string) =>
    apiFetch<WatchlistEntry>("/api/watchlist", {
      method: "POST",
      body: JSON.stringify({ ticker }),
    }),

  remove: (ticker: string) =>
    apiFetch<{ message: string }>(`/api/watchlist/${ticker}`, {
      method: "DELETE",
    }),

  insights: () =>
    apiFetch<{ insights: string[] }>("/api/watchlist/insights"),
};

// ─── Technical Analysis API ─────────────────────────────────────────────────────

export interface TADataPoint {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  sma20: number | null;
  sma50: number | null;
  sma200: number | null;
  ema20: number | null;
  ema50: number | null;
  rsi: number | null;
  macd: number | null;
  macd_signal: number | null;
  macd_hist: number | null;
  bb_upper: number | null;
  bb_lower: number | null;
  bb_sma: number | null;
}

export interface TAResponse {
  ticker: string;
  data: TADataPoint[];
  support: number;
  resistance: number;
  insights: string[];
  recommendation: string;
  sentiment_score: number;
}

export const taApi = {
  getAnalysis: (ticker: string, period = "1y") =>
    apiFetch<TAResponse>(`/api/ta/${ticker}?period=${period}`),
};

export { ApiError };
