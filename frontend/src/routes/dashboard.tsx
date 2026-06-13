/* eslint-disable prettier/prettier */
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Eye, Star, Zap, TrendingUp, TrendingDown,
  BarChart3, Newspaper, ArrowUpRight, LogOut, User, List,
} from "lucide-react";
import { AppProvider, useApp } from "@/store/appStore";
import { watchlistApi, marketApi, authApi } from "@/lib/apiClient";
import type { Prediction, NewsItem } from "@/types";
import type { WatchlistEntry } from "@/lib/apiClient";

export const Route = createFileRoute("/dashboard")({
  component: () => (
    <AppProvider>
      <DashboardPage />
    </AppProvider>
  ),
});

// ─── Top Navigation Bar ──────────────────────────────────────────────────────
function DashboardNav() {
  const { state, logout, addToast } = useApp();
  const navigate = useNavigate();

  function handleLogout() {
    authApi.logout();
    logout();
    addToast({ type: "info", title: "Signed out" });
    navigate({ to: "/" });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <TrendingUp className="h-3.5 w-3.5" />
            </span>
            <span className="font-display text-sm font-semibold tracking-widest">STOCKGLOBE</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {[
              { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
              { to: "/watchlist", label: "Watchlist", icon: Eye },
              { to: "/profile", label: "Profile", icon: User },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors [&.active]:text-foreground [&.active]:bg-white/5"
                activeProps={{ className: "active text-foreground bg-white/5" }}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground hidden sm:block">
            {state.user?.name ?? state.user?.email}
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
          >
            <LogOut className="h-3 w-3" />
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}

// ─── Dashboard Page ──────────────────────────────────────────────────────────
function DashboardPage() {
  const { state } = useApp();
  const navigate = useNavigate();

  const [watchlist, setWatchlist] = useState<WatchlistEntry[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!state.token) {
      navigate({ to: "/login" });
    }
  }, [state.token, navigate]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [wl, ins, preds, n] = await Promise.allSettled([
        watchlistApi.getAll(),
        watchlistApi.insights(),
        marketApi.predictions(),
        marketApi.newsSentiment(),
      ]);
      if (wl.status === "fulfilled") setWatchlist(wl.value);
      if (ins.status === "fulfilled") setInsights(ins.value.insights);
      if (preds.status === "fulfilled") setPredictions(preds.value);
      if (n.status === "fulfilled") setNews(n.value);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (state.token) fetchData();
  }, [state.token, fetchData]);

  if (!state.token) return null;

  const buySignals = predictions.filter((p) => p.direction === "BUY").length;
  const sellSignals = predictions.filter((p) => p.direction === "SELL").length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardNav />

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-semibold">
            Welcome back, {state.user?.name ?? "Trader"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here's your market intelligence overview
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4"
        >
          {[
            { label: "Watched Stocks", value: watchlist.length, icon: Eye, color: "text-blue-400" },
            { label: "Buy Signals", value: buySignals, icon: TrendingUp, color: "text-signal-buy" },
            { label: "Sell Signals", value: sellSignals, icon: TrendingDown, color: "text-signal-sell" },
            { label: "Predictions", value: predictions.length, icon: BarChart3, color: "text-purple-400" },
          ].map((stat, i) => (
            <div key={stat.label} className="glass rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">{stat.label}</span>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <span className="text-2xl font-semibold">{loading ? "—" : stat.value}</span>
            </div>
          ))}
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left column: Watchlist + Predictions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Watchlist */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-medium flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  Your Watchlist
                </h2>
                <Link
                  to="/watchlist"
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                >
                  View all <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-10 rounded-lg bg-white/5 animate-pulse" />
                  ))}
                </div>
              ) : watchlist.length === 0 ? (
                <div className="py-8 text-center">
                  <Eye className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No stocks in your watchlist yet</p>
                  <Link
                    to="/watchlist"
                    className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-white/5 border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Star className="h-3 w-3" /> Add stocks
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {watchlist.slice(0, 6).map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between rounded-lg bg-white/[0.03] px-4 py-3 hover:bg-white/[0.06] transition-colors"
                    >
                      <Link to={`/stock/${item.ticker}`} className="flex items-center gap-3 hover:text-primary transition-colors">
                        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-white/5 text-xs font-mono font-medium group-hover:bg-primary/20">
                          {item.ticker.slice(0, 2)}
                        </span>
                        <span className="text-sm font-medium font-mono">{item.ticker}</span>
                      </Link>
                      <span className="text-xs text-muted-foreground">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Top Predictions */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-xl p-6"
            >
              <h2 className="text-sm font-medium flex items-center gap-2 mb-4">
                <Zap className="h-4 w-4 text-yellow-400" />
                AI Predictions
              </h2>

              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 rounded-lg bg-white/5 animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {predictions.slice(0, 4).map((pred, i) => (
                    <motion.div
                      key={pred.ticker}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between rounded-lg bg-white/[0.03] px-4 py-3"
                    >
                      <Link to={`/stock/${pred.ticker}`} className="flex items-center gap-3 hover:text-primary transition-colors">
                        <span className="text-sm font-mono font-medium">{pred.ticker}</span>
                        <span className="text-xs text-muted-foreground">{pred.name}</span>
                      </Link>
                      <div className="flex items-center gap-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                          pred.direction === "BUY"
                            ? "bg-signal-buy/15 text-signal-buy"
                            : pred.direction === "SELL"
                              ? "bg-signal-sell/15 text-signal-sell"
                              : "bg-signal-hold/15 text-signal-hold"
                        }`}>
                          {pred.direction}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">
                          {pred.confidence}%
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Right column: Insights + News */}
          <div className="space-y-6">
            {/* AI Insights */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="glass rounded-xl p-6"
            >
              <h2 className="text-sm font-medium flex items-center gap-2 mb-4">
                <Zap className="h-4 w-4 text-cyan-400" />
                AI Watchlist Insights
              </h2>

              {loading ? (
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-12 rounded-lg bg-white/5 animate-pulse" />
                  ))}
                </div>
              ) : insights.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">
                  Add stocks to your watchlist to see AI insights.
                </p>
              ) : (
                <div className="space-y-3">
                  {insights.map((insight, i) => (
                    <div
                      key={i}
                      className="flex gap-3 rounded-lg bg-white/[0.03] px-4 py-3"
                    >
                      <Zap className="h-4 w-4 text-cyan-400 mt-0.5 shrink-0" />
                      <p className="text-sm text-muted-foreground leading-relaxed">{insight}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Recent News */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="glass rounded-xl p-6"
            >
              <h2 className="text-sm font-medium flex items-center gap-2 mb-4">
                <Newspaper className="h-4 w-4 text-orange-400" />
                Market News
              </h2>

              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-14 rounded-lg bg-white/5 animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {news.slice(0, 5).map((item, i) => (
                    <div
                      key={i}
                      className="rounded-lg bg-white/[0.03] px-4 py-3"
                    >
                      <p className="text-sm font-medium leading-snug line-clamp-2">
                        {item.headline}
                      </p>
                      <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{item.source}</span>
                        <span>·</span>
                        <span className={item.sentiment > 0 ? "text-signal-buy" : item.sentiment < 0 ? "text-signal-sell" : ""}>
                          {item.sentiment > 0 ? "Positive" : item.sentiment < 0 ? "Negative" : "Neutral"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
