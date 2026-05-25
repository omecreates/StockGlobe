// src/components/modals/MarketDetailModal.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Opens when user clicks a market row in GlobalGlobeSection.
// Shows live price series chart + market metadata.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Globe, TrendingUp, TrendingDown } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, Tooltip,
} from "recharts";
import { useApp } from "@/store/appStore";
import { useApi } from "@/hooks/useApi";
import { marketApi } from "@/lib/apiClient";
import { ChartSkeleton } from "@/components/ui/Skeletons";

const tooltipStyle = {
  background: "oklch(0.16 0.06 280 / 95%)",
  border: "1px solid oklch(1 0 0 / 10%)",
  borderRadius: 12,
  fontSize: 12,
};

// Map market code → yfinance ticker for price data
const MARKET_TICKERS: Record<string, string> = {
  USA: "SPY",
  IND: "^NSEI",
  JPN: "^N225",
  GBR: "EWU",
  DEU: "EWG",
  SGP: "EWS",
  CHN: "FXI",
  BRA: "EWZ",
};

export function MarketDetailModal() {
  const { state, closeAllModals } = useApp();
  const market = state.modals.marketDetail;
  const open = market !== null;

  const ticker = market ? (MARKET_TICKERS[market.code] ?? "SPY") : "SPY";

  const { data: series, loading } = useApi(
    () => marketApi.priceSeries(ticker, 30),
    [],
    [ticker],
  );

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) closeAllModals();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, closeAllModals]);

  if (!market) return null;

  const isUp = market.change >= 0;
  const Icon = isUp ? TrendingUp : TrendingDown;
  const changeColor = isUp ? "var(--signal-buy)" : "var(--signal-sell)";

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md"
            onClick={closeAllModals}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4"
            style={{ pointerEvents: "none" }}
          >
            <div className="relative w-full max-w-lg" style={{ pointerEvents: "auto" }} onClick={(e) => e.stopPropagation()}>
              <div className="glass-strong rounded-3xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/5 px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 border border-white/10">
                      <Globe className="h-5 w-5 text-[color:var(--primary)]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display text-xl font-semibold">{market.city}</span>
                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground border border-white/10 rounded px-1.5 py-0.5">
                          {market.code}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">{market.index}</div>
                    </div>
                  </div>
                  <button
                    onClick={closeAllModals}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 divide-x divide-white/5 border-b border-white/5">
                  {[
                    { label: "Index Value", value: market.value.toLocaleString() },
                    { label: "24h Change", value: `${isUp ? "+" : ""}${market.change.toFixed(2)}%`, color: changeColor },
                    { label: "AI Confidence", value: `${market.confidence}%` },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="px-5 py-4">
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
                      <div
                        className="mt-1 font-display text-lg font-semibold tabular-nums"
                        style={color ? { color } : undefined}
                      >
                        {value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chart */}
                <div className="px-6 py-5">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      30-day performance
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Icon className="h-3.5 w-3.5" style={{ color: changeColor }} />
                      <span className="text-xs font-semibold tabular-nums" style={{ color: changeColor }}>
                        {isUp ? "+" : ""}{market.change.toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  {loading ? (
                    <ChartSkeleton height={160} />
                  ) : (
                    <div className="h-[160px]">
                      <ResponsiveContainer>
                        <AreaChart data={series} margin={{ top: 5, right: 5, bottom: 0, left: -30 }}>
                          <defs>
                            <linearGradient id="mgrd" x1="0" x2="0" y1="0" y2="1">
                              <stop offset="0%" stopColor={isUp ? "oklch(0.85 0.22 155)" : "oklch(0.72 0.27 20)"} stopOpacity={0.4} />
                              <stop offset="100%" stopColor={isUp ? "oklch(0.85 0.22 155)" : "oklch(0.72 0.27 20)"} stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid stroke="oklch(1 0 0 / 5%)" vertical={false} />
                          <XAxis dataKey="label" tick={{ fill: "oklch(0.65 0.03 250)", fontSize: 9 }} axisLine={false} tickLine={false} interval={9} />
                          <YAxis tick={{ fill: "oklch(0.65 0.03 250)", fontSize: 9 }} axisLine={false} tickLine={false} domain={["auto", "auto"]} />
                          <Tooltip contentStyle={tooltipStyle} />
                          <Area
                            type="monotone"
                            dataKey="price"
                            stroke={isUp ? "oklch(0.85 0.22 155)" : "oklch(0.72 0.27 20)"}
                            strokeWidth={2}
                            fill="url(#mgrd)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>

                {/* Sentiment */}
                <div className="border-t border-white/5 px-6 py-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-muted-foreground">AI Market Sentiment</div>
                    <span
                      className="font-semibold"
                      style={{ color: market.sentiment === "Bullish" ? "var(--signal-buy)" : market.sentiment === "Bearish" ? "var(--signal-sell)" : "var(--signal-hold)" }}
                    >
                      {market.sentiment}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/8">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${market.confidence}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ background: "var(--gradient-aurora)" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
