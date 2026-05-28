/* eslint-disable prettier/prettier */
// src/components/sections/LiveAnalytics.tsx
// REPLACES existing LiveAnalytics.tsx
// What's new:
//   • Ticker selector (SPY, NVDA, AAPL, TSLA, META)
//   • Live price series from /api/price-series
//   • Days range selector (30 / 60 / 90)
//   • Loading skeleton for chart
//   • Stat cards (high, low, volume) from live data
//   • All original animations preserved

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedStat } from "@/components/ui/AnimatedStat";
import { ChartSkeleton } from "@/components/ui/Skeletons";
import { useApi } from "@/hooks/useApi";
import { marketApi } from "@/lib/apiClient";
import { cn } from "@/lib/utils";

const TICKERS = ["SPY", "NVDA", "AAPL", "TSLA", "META", "AMZN"];
const DAYS_OPTIONS = [
  { label: "30D", value: 30 },
  { label: "60D", value: 60 },
  { label: "90D", value: 90 },
];

const tooltipStyle = {
  background: "oklch(0.16 0.06 280 / 95%)",
  border: "1px solid oklch(1 0 0 / 10%)",
  borderRadius: 12,
  fontSize: 12,
  backdropFilter: "blur(8px)",
};

export function LiveAnalytics() {
  const [ticker, setTicker] = useState("SPY");
  const [days, setDays] = useState(60);

  const { data: series, loading } = useApi(
    () => marketApi.priceSeries(ticker, days),
    [],
    [ticker, days],
  );

  // Derive stats from live data
  const stats = useMemo(() => {
    if (!series.length) return { high: 0, low: 0, change: 0, volume: 0 };
    const prices = series.map((d) => d.price);
    const first = series[0].price;
    const last = series[series.length - 1].price;
    return {
      high: Math.max(...prices),
      low: Math.min(...prices),
      change: ((last - first) / first) * 100,
      volume: series.reduce((s, d) => s + (d.volume ?? 0), 0) / series.length,
    };
  }, [series]);

  return (
    <section id="analytics" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Live Analytics"
          title={<>Real-time data. <span className="text-gradient">AI overlay.</span></>}
          description="60 days of price history with Neuralyx AI forecast overlay. Select any ticker to inspect."
        />

        <div className="mt-14 space-y-5">
          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Ticker selector */}
            <div className="flex flex-wrap gap-1.5">
              {TICKERS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTicker(t)}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] transition-all",
                    ticker === t
                      ? "text-background"
                      : "border border-white/10 text-muted-foreground hover:text-foreground",
                  )}
                  style={
                    ticker === t
                      ? {
                          background: "var(--gradient-aurora)",
                          backgroundSize: "200% 200%",
                          animation: "aurora-shift 8s ease infinite",
                        }
                      : undefined
                  }
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Days selector */}
            <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1">
              {DAYS_OPTIONS.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setDays(d.value)}
                  className={cn(
                    "rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-widest transition-all",
                    days === d.value
                      ? "bg-white/10 text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { label: "Period High", value: stats.high, prefix: "$", decimals: 2 },
              { label: "Period Low",  value: stats.low,  prefix: "$", decimals: 2 },
              {
                label: "Period Return",
                value: Math.abs(stats.change),
                prefix: stats.change >= 0 ? "+": "-",
                suffix: "%",
                decimals: 2,
                color: stats.change >= 0 ? "var(--signal-buy)" : "var(--signal-sell)",
              },
              {
                label: "Avg Volume",
                value: stats.volume / 1_000_000,
                suffix: "M",
                decimals: 1,
              },
            ].map((s) => (
              <GlassCard key={s.label} className="p-4">
                <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {s.label}
                </div>
                <div
                  className="mt-1 font-display text-xl font-semibold tabular-nums"
                  style={s.color ? { color: s.color } : undefined}
                >
                  {s.prefix ?? ""}
                  {loading ? (
                    <span className="opacity-30">—</span>
                  ) : (
                    <AnimatedStat value={s.value} decimals={s.decimals} />
                  )}
                  {s.suffix ?? ""}
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Chart */}
          <GlassCard glow="primary" className="p-5 md:p-7">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {ticker} · {days}D Price History
                </div>
                {!loading && (
                  <div
                    className="text-xs font-semibold tabular-nums"
                    style={{
                      color:
                        stats.change >= 0
                          ? "var(--signal-buy)"
                          : "var(--signal-sell)",
                    }}
                  >
                    {stats.change >= 0 ? "+" : ""}
                    {stats.change.toFixed(2)}%
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-4 rounded-sm bg-[color:var(--primary)] opacity-70" />
                  Actual
                </span>
                <span className="flex items-center gap-1.5">
                  <span
                    className="h-2 w-4 rounded-sm bg-[color:var(--accent)] opacity-70"
                    style={{ backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 3px, oklch(0.16 0.06 280) 3px, oklch(0.16 0.06 280) 5px)" }}
                  />
                  AI Forecast
                </span>
              </div>
            </div>

            {loading ? (
              <ChartSkeleton height={320} />
            ) : (
              <motion.div
                key={`${ticker}-${days}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="h-[320px]"
              >
                <ResponsiveContainer>
                  <AreaChart
                    data={series}
                    margin={{ top: 10, right: 10, bottom: 0, left: -10 }}
                  >
                    <defs>
                      <linearGradient id="gPrice" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="oklch(0.82 0.17 200)" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="oklch(0.82 0.17 200)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gForecast" x1="0" x2="0" y1="0" y2="1">
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
                      interval={Math.floor(series.length / 8)}
                    />
                    <YAxis
                      tick={{ fill: "oklch(0.65 0.03 250)", fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      domain={["auto", "auto"]}
                    />
                    <Tooltip
                      contentStyle={tooltipStyle}
                      labelStyle={{ color: "oklch(0.65 0.03 250)" }}
                      formatter={(v: number) => [`$${v.toFixed(2)}`]}
                    />
                    <Area
                      type="monotone"
                      dataKey="predicted"
                      stroke="oklch(0.62 0.24 295)"
                      strokeWidth={1.5}
                      fill="url(#gForecast)"
                      strokeDasharray="5 4"
                    />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke="oklch(0.82 0.17 200)"
                      strokeWidth={2}
                      fill="url(#gPrice)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>
            )}
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
