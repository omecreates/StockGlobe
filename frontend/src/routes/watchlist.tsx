/* eslint-disable prettier/prettier */
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye, Plus, Trash2, Search, Zap, TrendingUp, TrendingDown,
  LayoutDashboard, User, LogOut, Star, ArrowUpDown, Loader2,
} from "lucide-react";
import { AppProvider, useApp } from "@/store/appStore";
import { watchlistApi, marketApi, authApi } from "@/lib/apiClient";
import type { Prediction } from "@/types";
import type { WatchlistEntry } from "@/lib/apiClient";

export const Route = createFileRoute("/watchlist")({
  component: () => (
    <AppProvider>
      <WatchlistPage />
    </AppProvider>
  ),
});

// ─── Nav Bar ─────────────────────────────────────────────────────────────────
function WatchlistNav() {
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

// ─── Watchlist Page ──────────────────────────────────────────────────────────
function WatchlistPage() {
  const { state, addToast } = useApp();
  const navigate = useNavigate();

  const [watchlist, setWatchlist] = useState<WatchlistEntry[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [ticker, setTicker] = useState("");
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortAsc, setSortAsc] = useState(true);
  const [searchFilter, setSearchFilter] = useState("");

  useEffect(() => {
    if (!state.token) navigate({ to: "/login" });
  }, [state.token, navigate]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [wl, ins, preds] = await Promise.allSettled([
        watchlistApi.getAll(),
        watchlistApi.insights(),
        marketApi.predictions(),
      ]);
      if (wl.status === "fulfilled") setWatchlist(wl.value);
      if (ins.status === "fulfilled") setInsights(ins.value.insights);
      if (preds.status === "fulfilled") setPredictions(preds.value);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (state.token) fetchData();
  }, [state.token, fetchData]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker.trim()) return;
    setAdding(true);
    try {
      const entry = await watchlistApi.add(ticker.trim().toUpperCase());
      setWatchlist((prev) => [...prev, entry]);
      setTicker("");
      addToast({ type: "success", title: `${entry.ticker} added to watchlist` });
      // Refresh insights
      watchlistApi.insights().then((r) => setInsights(r.insights)).catch(() => {});
    } catch (err: any) {
      addToast({ type: "error", title: "Failed to add", message: err.message });
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async (t: string) => {
    setRemoving(t);
    try {
      await watchlistApi.remove(t);
      setWatchlist((prev) => prev.filter((item) => item.ticker !== t));
      addToast({ type: "info", title: `${t} removed` });
      watchlistApi.insights().then((r) => setInsights(r.insights)).catch(() => {});
    } catch (err: any) {
      addToast({ type: "error", title: "Failed to remove", message: err.message });
    } finally {
      setRemoving(null);
    }
  };

  const getPrediction = (t: string) => predictions.find((p) => p.ticker === t);

  // Sorted + filtered watchlist
  const displayList = watchlist
    .filter((item) => searchFilter === "" || item.ticker.toLowerCase().includes(searchFilter.toLowerCase()))
    .sort((a, b) => sortAsc ? a.ticker.localeCompare(b.ticker) : b.ticker.localeCompare(a.ticker));

  if (!state.token) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <WatchlistNav />

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <Eye className="h-6 w-6 text-blue-400" />
            Watchlist
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track your favorite stocks and get AI-powered insights
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Main Column */}
          <div className="space-y-6">
            {/* Add Stock + Search */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-xl p-4"
            >
              <div className="flex flex-col sm:flex-row gap-3">
                <form onSubmit={handleAdd} className="flex gap-2 flex-1">
                  <div className="relative flex-1">
                    <Plus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={ticker}
                      onChange={(e) => setTicker(e.target.value)}
                      placeholder="Add ticker (e.g. AAPL)"
                      className="w-full rounded-lg border border-border bg-background pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring transition-all font-mono uppercase"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={adding || !ticker.trim()}
                    className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-all"
                  >
                    {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    Add
                  </button>
                </form>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Filter..."
                    className="w-full sm:w-40 rounded-lg border border-border bg-background pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  />
                </div>
              </div>
            </motion.div>

            {/* Table */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-xl overflow-hidden"
            >
              {/* Table Header */}
              <div className="flex items-center gap-4 px-6 py-3 border-b border-border text-xs text-muted-foreground font-medium">
                <button
                  onClick={() => setSortAsc(!sortAsc)}
                  className="flex items-center gap-1 hover:text-foreground transition-colors flex-1"
                >
                  Ticker <ArrowUpDown className="h-3 w-3" />
                </button>
                <span className="hidden sm:block w-24 text-right">Signal</span>
                <span className="hidden sm:block w-20 text-right">Confidence</span>
                <span className="w-20 text-right">Added</span>
                <span className="w-10" />
              </div>

              {loading ? (
                <div className="p-6 space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-12 rounded-lg bg-white/5 animate-pulse" />
                  ))}
                </div>
              ) : displayList.length === 0 ? (
                <div className="py-16 text-center">
                  <Star className="h-10 w-10 text-muted-foreground/20 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    {searchFilter ? "No matching stocks" : "Your watchlist is empty"}
                  </p>
                  {!searchFilter && (
                    <p className="text-xs text-muted-foreground/60 mt-1">
                      Add tickers above to start tracking
                    </p>
                  )}
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {displayList.map((item) => {
                    const pred = getPrediction(item.ticker);
                    return (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center gap-4 px-6 py-3.5 border-b border-border/50 hover:bg-white/[0.02] transition-colors"
                      >
                        {/* Ticker */}
                        <div className="flex items-center gap-3 flex-1">
                          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-white/5 text-xs font-mono font-semibold">
                            {item.ticker.slice(0, 2)}
                          </span>
                          <div>
                            <span className="text-sm font-mono font-medium">{item.ticker}</span>
                            {pred && (
                              <span className="block text-xs text-muted-foreground">{pred.name}</span>
                            )}
                          </div>
                        </div>

                        {/* Signal */}
                        <div className="hidden sm:block w-24 text-right">
                          {pred ? (
                            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                              pred.direction === "BUY"
                                ? "bg-signal-buy/15 text-signal-buy"
                                : pred.direction === "SELL"
                                  ? "bg-signal-sell/15 text-signal-sell"
                                  : "bg-signal-hold/15 text-signal-hold"
                            }`}>
                              {pred.direction}
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground/50">—</span>
                          )}
                        </div>

                        {/* Confidence */}
                        <div className="hidden sm:block w-20 text-right">
                          {pred ? (
                            <span className="text-xs font-mono text-muted-foreground">{pred.confidence}%</span>
                          ) : (
                            <span className="text-xs text-muted-foreground/50">—</span>
                          )}
                        </div>

                        {/* Date */}
                        <span className="w-20 text-right text-xs text-muted-foreground">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>

                        {/* Remove */}
                        <div className="w-10 flex justify-end">
                          <button
                            onClick={() => handleRemove(item.ticker)}
                            disabled={removing === item.ticker}
                            className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors disabled:opacity-50"
                          >
                            {removing === item.ticker ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </motion.div>
          </div>

          {/* Right Sidebar: AI Insights */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div className="glass rounded-xl p-6">
              <h2 className="text-sm font-medium flex items-center gap-2 mb-4">
                <Zap className="h-4 w-4 text-cyan-400" />
                AI Insights
              </h2>

              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-14 rounded-lg bg-white/5 animate-pulse" />
                  ))}
                </div>
              ) : insights.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">
                  Add stocks to see personalized AI insights.
                </p>
              ) : (
                <div className="space-y-3">
                  {insights.map((insight, i) => (
                    <div key={i} className="flex gap-3 rounded-lg bg-white/[0.03] px-4 py-3">
                      <Zap className="h-4 w-4 text-cyan-400 mt-0.5 shrink-0" />
                      <p className="text-sm text-muted-foreground leading-relaxed">{insight}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Summary Card */}
            <div className="glass rounded-xl p-6">
              <h2 className="text-sm font-medium mb-4">Watchlist Summary</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Total Stocks</span>
                  <span className="text-sm font-medium">{watchlist.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Buy Signals</span>
                  <span className="text-sm font-medium text-signal-buy">
                    {watchlist.filter((w) => getPrediction(w.ticker)?.direction === "BUY").length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Sell Signals</span>
                  <span className="text-sm font-medium text-signal-sell">
                    {watchlist.filter((w) => getPrediction(w.ticker)?.direction === "SELL").length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Hold Signals</span>
                  <span className="text-sm font-medium text-signal-hold">
                    {watchlist.filter((w) => getPrediction(w.ticker)?.direction === "HOLD").length}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
