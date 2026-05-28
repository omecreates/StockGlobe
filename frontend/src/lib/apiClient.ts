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
  const token = localStorage.getItem("neuralyx_token");
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
    apiFetch<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  signup: (payload: SignupPayload) =>
    apiFetch<AuthResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  me: () => apiFetch<User>("/auth/me"),

  logout: () => {
    localStorage.removeItem("neuralyx_token");
    localStorage.removeItem("neuralyx_user");
  },
};

// ─── Request Access API ────────────────────────────────────────────────────────

export interface AccessRequestPayload {
  name: string;
  email: string;
  company: string;
  use_case: string;
}

export const accessApi = {
  requestAccess: (payload: AccessRequestPayload) =>
    apiFetch<{ message: string; position: number }>("/api/request-access", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

export { ApiError };
