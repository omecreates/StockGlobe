// src/components/modals/PredictionDetailModal.tsx
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, TrendingUp, TrendingDown, Minus, ExternalLink } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { useApp } from "@/store/appStore";
import { useApi } from "@/hooks/useApi";
import { marketApi } from "@/lib/apiClient";
import { SignalPill } from "@/components/ui/SignalPill";
import { ConfidenceMeter } from "@/components/ui/ConfidenceMeter";
import { ChartSkeleton } from "@/components/ui/Skeletons";

const SIGNAL_ICONS = {
  BUY: TrendingUp,
  SELL: TrendingDown,
  HOLD: Minus,
};

const SIGNAL_COLORS = {
  BUY: "var(--signal-buy)",
  SELL: "var(--signal-sell)",
  HOLD: "var(--signal-hold)",
};

const tooltipStyle = {
  background: "oklch(0.16 0.06 280 / 95%)",
  border: "1px solid oklch(1 0 0 / 10%)",
  borderRadius: 12,
  fontSize: 12,
  backdropFilter: "blur(8px)",
};

export function PredictionDetailModal() {
  const { state, closeAllModals } = useApp();
  const prediction = state.modals.predictionDetail;
  const open = prediction !== null;

  const { data: priceSeries, loading } = useApi(
    () =>
      prediction
        ? marketApi.priceSeries(prediction.ticker, 60)
        : Promise.resolve([]),
    [],
    [prediction?.ticker],
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

  if (!prediction) return null;

  const returnPct = ((prediction.target / prediction.current - 1) * 100).toFixed(1);
  const isPositive = prediction.direction === "BUY";
  const Icon = SIGNAL_ICONS[prediction.direction];
  const signalColor = SIGNAL_COLORS[prediction.direction];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-md"
            onClick={closeAllModals}
          />

          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4"
            style={{ pointerEvents: "none" }}
          >
            <div
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              style={{ pointerEvents: "auto" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="glass-strong rounded-3xl overflow-hidden">
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-start justify-between border-b border-white/5 px-6 py-5 backdrop-blur-xl bg-background/40">
                  <div className="flex items-center gap-4">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10"
                      style={{ background: `${signalColor}15` }}
                    >
                      <Icon className="h-6 w-6" style={{ color: signalColor }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display text-2xl font-semibold">
                          {prediction.ticker}
                        </span>
                        <SignalPill signal={prediction.direction} />
                      </div>
                      <div className="text-sm text-muted-foreground">{prediction.name}</div>
                    </div>
                  </div>
                  <button
                    onClick={closeAllModals}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-4 divide-x divide-white/5 border-b border-white/5">
                  {[
                    { label: "Current", value: `$${prediction.current.toFixed(2)}` },
                    { label: `Target · ${prediction.horizon}`, value: `$${prediction.target.toFixed(2)}`, highlight: true },
                    { label: "Expected", value: `${isPositive ? "+" : ""}${returnPct}%`, color: signalColor },
                    { label: "AI Confidence", value: `${prediction.confidence}%` },
                  ].map(({ label, value, highlight, color }) => (
                    <div key={label} className="px-5 py-4">
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                        {label}
                      </div>
                      <div
                        className={`mt-1 font-display text-xl font-semibold tabular-nums ${highlight ? "text-gradient" : ""}`}
                        style={color ? { color } : undefined}
                      >
                        {value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chart */}
                <div className="px-6 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      60-day price history + AI forecast
                    </div>
                    <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-sm bg-[color:var(--primary)]" />
                        Actual
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-sm bg-[color:var(--accent)]" />
                        Forecast
                      </span>
                    </div>
                  </div>

                  {loading ? (
                    <ChartSkeleton height={240} />
                  ) : (
                    <div className="h-[240px]">
                      <ResponsiveContainer>
                        <AreaChart
                          data={priceSeries}
                          margin={{ top: 10, right: 10, bottom: 0, left: -20 }}
                        >
                          <defs>
                            <linearGradient id="gP2" x1="0" x2="0" y1="0" y2="1">
                              <stop offset="0%" stopColor="oklch(0.82 0.17 200)" stopOpacity={0.5} />
                              <stop offset="100%" stopColor="oklch(0.82 0.17 200)" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="gF2" x1="0" x2="0" y1="0" y2="1">
                              <stop offset="0%" stopColor="oklch(0.62 0.24 295)" stopOpacity={0.4} />
                              <stop offset="100%" stopColor="oklch(0.62 0.24 295)" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid stroke="oklch(1 0 0 / 5%)" vertical={false} />
                          <XAxis
                            dataKey="label"
                            tick={{ fill: "oklch(0.65 0.03 250)", fontSize: 10 }}
                            axisLine={false}
                            tickLine={false}
                            interval={14}
                          />
                          <YAxis
                            tick={{ fill: "oklch(0.65 0.03 250)", fontSize: 10 }}
                            axisLine={false}
                            tickLine={false}
                            domain={["auto", "auto"]}
                          />
                          <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "oklch(0.65 0.03 250)" }} />
                          <ReferenceLine
                            y={prediction.current}
                            stroke="oklch(1 0 0 / 20%)"
                            strokeDasharray="4 4"
                            label={{ value: "Now", fill: "oklch(0.65 0.03 250)", fontSize: 10 }}
                          />
                          <Area
                            type="monotone"
                            dataKey="predicted"
                            stroke="oklch(0.62 0.24 295)"
                            strokeWidth={1.8}
                            fill="url(#gF2)"
                            strokeDasharray="5 4"
                          />
                          <Area
                            type="monotone"
                            dataKey="price"
                            stroke="oklch(0.82 0.17 200)"
                            strokeWidth={2}
                            fill="url(#gP2)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>

                {/* AI Reasoning + Confidence */}
                <div className="grid gap-4 px-6 py-6 md:grid-cols-[1fr_auto]">
                  <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
                      AI Reasoning
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {prediction.reason}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {["Momentum", "Volume", "Macro", "Earnings", "Sentiment"].map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md border border-white/10 bg-white/5 px-2 py-1 font-mono text-[10px] tracking-wider text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center gap-2">
                    <ConfidenceMeter value={prediction.confidence} size={100} />
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      Model confidence
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-white/5 px-6 py-4">
                  <div className="text-[10px] text-muted-foreground">
                    Not financial advice · {prediction.horizon} horizon · Powered by PredictaFi ML
                  </div>
                  <a
                    href={`https://finance.yahoo.com/quote/${prediction.ticker}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[10px] text-[color:var(--primary)] hover:underline"
                  >
                    Yahoo Finance
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
