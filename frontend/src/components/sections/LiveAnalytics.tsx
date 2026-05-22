/* eslint-disable prettier/prettier */

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { motion } from "framer-motion";

import { useApi } from "@/hooks/useApi";
import { api } from "@/lib/apiClient";

import { PRICE_SERIES as FALLBACK_PRICE_SERIES } from "@/data/chartData";

import { GlassCard } from "@/components/ui/GlassCard";
import { AnimatedStat } from "@/components/ui/AnimatedStat";
import { SectionHeading } from "@/components/ui/SectionHeading";

const STATS = [
  { label: "Forecast accuracy", value: 92.4, suffix: "%", decimals: 1 },
  { label: "Signals / day", value: 18420, suffix: "" },
  { label: "Assets covered", value: 47000, suffix: "+" },
  { label: "Avg latency", value: 38, suffix: "ms" },
];

export function LiveAnalytics() {
  const {
    data: priceSeries,
    loading,
    error,
  } = useApi(
    () => api.priceSeries(),
    FALLBACK_PRICE_SERIES
  );

  return (
    <section id="analytics" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Live Analytics"
          title={
            <>
              The terminal,{" "}
              <span className="text-gradient">
                reimagined.
              </span>
            </>
          }
          description="Every panel, every chart, every metric — animated in real time as the model sees the market evolve."
        />

        {loading && (
          <div className="mt-6 text-center text-sm text-muted-foreground animate-pulse">
            Fetching live analytics...
          </div>
        )}

        {error && (
          <div className="mt-6 text-center text-sm text-red-400">
            Failed to load analytics.
          </div>
        )}

        <div className="mt-12 grid gap-6 lg:grid-cols-[2fr_1fr]">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  SPX · 60D forecast band
                </div>

                <div className="mt-1 font-display text-2xl font-semibold tabular-nums">
                  5,847.21{" "}
                  <span className="text-[color:var(--signal-buy)] text-sm">
                    +1.24%
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-sm bg-[color:var(--primary)]" />
                  Actual
                </span>

                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-sm bg-[color:var(--accent)]" />
                  AI Forecast
                </span>
              </div>
            </div>

            <div className="mt-6 h-[300px] w-full">
              <ResponsiveContainer>
                <AreaChart
                  data={priceSeries}
                  margin={{
                    top: 10,
                    right: 10,
                    bottom: 0,
                    left: -20,
                  }}
                >
                  <defs>
                    <linearGradient id="gPrice" x1="0" x2="0" y1="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="oklch(0.82 0.17 200)"
                        stopOpacity={0.55}
                      />

                      <stop
                        offset="100%"
                        stopColor="oklch(0.82 0.17 200)"
                        stopOpacity={0}
                      />
                    </linearGradient>

                    <linearGradient id="gPred" x1="0" x2="0" y1="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="oklch(0.62 0.24 295)"
                        stopOpacity={0.45}
                      />

                      <stop
                        offset="100%"
                        stopColor="oklch(0.62 0.24 295)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    stroke="oklch(1 0 0 / 5%)"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="label"
                    tick={{
                      fill: "oklch(0.65 0.03 250)",
                      fontSize: 10,
                    }}
                    axisLine={false}
                    tickLine={false}
                    interval={9}
                  />

                  <YAxis
                    tick={{
                      fill: "oklch(0.65 0.03 250)",
                      fontSize: 10,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip
                    contentStyle={{
                      background: "oklch(0.16 0.035 265 / 90%)",
                      border: "1px solid oklch(1 0 0 / 10%)",
                      borderRadius: 10,
                      fontSize: 12,
                      backdropFilter: "blur(8px)",
                    }}
                    labelStyle={{
                      color: "oklch(0.65 0.03 250)",
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="predicted"
                    stroke="oklch(0.62 0.24 295)"
                    strokeWidth={2}
                    fill="url(#gPred)"
                    strokeDasharray="4 4"
                  />

                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="oklch(0.82 0.17 200)"
                    strokeWidth={2.2}
                    fill="url(#gPrice)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <div className="grid grid-cols-2 gap-4">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: i * 0.08,
                  duration: 0.5,
                }}
              >
                <GlassCard className="h-full p-5">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    {s.label}
                  </div>

                  <div className="mt-3 text-3xl font-semibold text-gradient">
                    <AnimatedStat
                      value={s.value}
                      suffix={s.suffix}
                      decimals={s.decimals ?? 0}
                    />
                  </div>

                  <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/8">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{
                        width: `${60 + i * 8}%`,
                      }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 1.2,
                        delay: 0.2,
                      }}
                      className="h-full rounded-full"
                      style={{
                        background:
                          "var(--gradient-aurora)",
                      }}
                    />
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}