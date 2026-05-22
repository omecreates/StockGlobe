/* eslint-disable prettier/prettier */
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
} from "recharts";

import { motion } from "framer-motion";

import {
  Shield,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { useApi } from "@/hooks/useApi";
import { api } from "@/lib/apiClient";

import { ALLOCATION as FALLBACK_ALLOCATION } from "@/data/chartData";

import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

const RECS = [
  {
    icon: TrendingUp,
    title: "Rotate 6% from Bonds → AI/Tech",
    detail:
      "Expected +1.8% portfolio alpha over 60D.",
  },
  {
    icon: Shield,
    title: "Trim CHN exposure by 40%",
    detail:
      "Tail-risk score elevated to 7.4/10.",
  },
  {
    icon: Sparkles,
    title: "Open BUY · NVDA, META, AAPL",
    detail:
      "Cluster signal · 91% mean confidence.",
  },
];

export function PortfolioIntelligence() {
  const {
    data: portfolio,
    loading,
    error,
  } = useApi(
    () => api.portfolio(),
    {
      total_value: 284910,
      ytd_return: 12.4,
      risk_score: 4.2,
      allocation: FALLBACK_ALLOCATION,
    }
  );

  return (
    <section
      id="portfolio"
      className="relative py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Portfolio Intelligence"
          title={
            <>
              Your portfolio,{" "}
              <span className="text-gradient">
                continuously optimized.
              </span>
            </>
          }
          description="Neuralyx reads your positions, models risk in 11 dimensions, and proposes the smallest set of changes for the highest expected alpha."
        />

        {loading && (
          <div className="mt-6 text-center text-sm text-muted-foreground animate-pulse">
            Fetching portfolio intelligence...
          </div>
        )}

        {error && (
          <div className="mt-6 text-center text-sm text-red-400">
            Failed to load portfolio data.
          </div>
        )}

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <GlassCard className="p-6">
            <div className="grid grid-cols-[1fr_1fr] items-center gap-6">
              <div className="relative h-[280px]">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={portfolio.allocation}
                      dataKey="value"
                      innerRadius={70}
                      outerRadius={110}
                      stroke="none"
                      paddingAngle={2}
                    >
                      {portfolio.allocation.map(
                        (a, i) => (
                          <Cell
                            key={i}
                            fill={a.color}
                          />
                        )
                      )}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>

                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    Portfolio
                  </div>

                  <div className="font-display text-2xl font-semibold">
                    $
                    {portfolio.total_value.toLocaleString()}
                  </div>

                  <div className="mt-1 text-xs text-[color:var(--signal-buy)]">
                    +{portfolio.ytd_return}% YTD
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {portfolio.allocation.map(
                  (a, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 rounded-sm"
                          style={{
                            background: a.color,
                          }}
                        />

                        {a.name}
                      </span>

                      <span className="font-medium tabular-nums">
                        {a.value}%
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="mt-6 border-t border-white/5 pt-5">
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Risk score · 11-factor
              </div>

              <div className="mt-2 flex items-baseline justify-between">
                <div className="font-display text-2xl font-semibold">
                  {portfolio.risk_score}
                  <span className="text-sm text-muted-foreground">
                    {" "}
                    / 10
                  </span>
                </div>

                <div className="text-xs text-[color:var(--signal-hold)]">
                  Moderate
                </div>
              </div>

              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/8">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{
                    width: `${portfolio.risk_score * 10}%`,
                  }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2 }}
                  className="h-full rounded-full"
                  style={{
                    background:
                      "var(--gradient-aurora)",
                  }}
                />
              </div>
            </div>
          </GlassCard>

          <div className="flex flex-col gap-4">
            {RECS.map((r, i) => (
              <motion.div
                key={r.title}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{ once: true }}
                transition={{
                  delay: i * 0.1,
                  duration: 0.6,
                }}
                whileHover={{
                  x: 4,
                  scale: 1.01,
                }}
              >
                <GlassCard className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                      <r.icon className="h-5 w-5 text-[color:var(--primary)]" />
                    </div>

                    <div>
                      <div className="font-display text-base font-semibold">
                        {r.title}
                      </div>

                      <div className="mt-1 text-sm text-muted-foreground">
                        {r.detail}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}

            <button className="group relative mt-2 overflow-hidden rounded-2xl p-px">
              <span
                className="absolute inset-0 animate-aurora"
                style={{
                  background:
                    "var(--gradient-aurora)",
                }}
              />

              <span className="relative flex items-center justify-between rounded-2xl bg-background px-5 py-4 text-sm font-medium">
                Apply all recommendations

                <span className="text-gradient">
                  →
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}