/* eslint-disable prettier/prettier */
// src/components/sections/PortfolioIntelligence.tsx
// ─────────────────────────────────────────────────────────────────────────────
// REPLACES existing PortfolioIntelligence.tsx entirely.
// What's new:
//   • Live data from /api/portfolio
//   • "Apply" recommendation buttons with optimistic UI (immediate visual feedback)
//   • Toast notification on apply
//   • Applied state persists in session (stored in component state)
//   • Loading skeletons
//   • Preserves PieChart and all original animations
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { motion } from "framer-motion";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
} from "recharts";
import { Check, Zap, TrendingUp, ShieldCheck, BarChart3, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedStat } from "@/components/ui/AnimatedStat";
import { useApi } from "@/hooks/useApi";
import { marketApi } from "@/lib/apiClient";
import { useApp } from "@/store/appStore";
import type { PortfolioData } from "@/types";
import { cn } from "@/lib/utils";

const FALLBACK_PORTFOLIO: PortfolioData = {
  total_value: 284910,
  ytd_return: 12.4,
  risk_score: 4.2,
  allocation: [
    { name: "Equities",    value: 48, color: "oklch(0.82 0.17 200)" },
    { name: "AI / Tech",   value: 22, color: "oklch(0.62 0.24 295)" },
    { name: "Bonds",       value: 14, color: "oklch(0.7 0.28 340)" },
    { name: "Commodities", value: 9,  color: "oklch(0.78 0.2 155)" },
    { name: "Cash",        value: 7,  color: "oklch(0.82 0.16 90)" },
  ],
};

const RECOMMENDATIONS = [
  {
    id: "rec-1",
    icon: TrendingUp,
    title: "Increase NVDA exposure",
    description: "AI hardware supercycle entering Phase 2. Momentum and fundamentals aligned.",
    impact: "+2.8% expected alpha",
    color: "var(--signal-buy)",
  },
  {
    id: "rec-2",
    icon: ShieldCheck,
    title: "Hedge with TLT",
    description: "Rate sensitivity rising. 5% allocation to long bonds reduces VaR by 18%.",
    impact: "–18% VaR",
    color: "var(--primary)",
  },
  {
    id: "rec-3",
    icon: BarChart3,
    title: "Trim cash drag",
    description: "7% cash is 3.1% above optimal. Rotate into short-duration IG credit.",
    impact: "+0.4% yield pickup",
    color: "var(--signal-hold)",
  },
];

const tooltipStyle = {
  background: "oklch(0.16 0.06 280 / 95%)",
  border: "1px solid oklch(1 0 0 / 10%)",
  borderRadius: 12,
  fontSize: 12,
};

export function PortfolioIntelligence() {
  const { data: portfolio, loading } = useApi(
    () => marketApi.portfolio(),
    FALLBACK_PORTFOLIO,
  );
  const { addToast } = useApp();

  // Track which recommendations have been applied (optimistic UI)
  const [applied, setApplied] = useState<Set<string>>(new Set());
  const [applying, setApplying] = useState<string | null>(null);

  function handleApply(id: string, title: string) {
    if (applied.has(id)) return;
    setApplying(id);
    // Simulate async apply (replace with real API call if you build it)
    setTimeout(() => {
      setApplied((prev) => new Set([...prev, id]));
      setApplying(null);
      addToast({
        type: "success",
        title: "Recommendation applied",
        message: title,
      });
    }, 900);
  }

  return (
    <section id="portfolio" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Portfolio Intelligence"
          title={<>AI-optimised <span className="text-gradient">allocation.</span></>}
          description="Real-time portfolio analytics with AI-driven rebalancing recommendations. Know what to change — and why."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          {/* ── Left: Pie chart + stats ───────────────────────── */}
          <div className="space-y-4">
            <GlassCard glow="primary" className="p-6">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 text-center mb-6">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">AUM</div>
                  <div className="font-display text-xl font-semibold">
                    $<AnimatedStat value={portfolio.total_value / 1000} decimals={1} />K
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">YTD Return</div>
                  <div className="font-display text-xl font-semibold text-[color:var(--signal-buy)]">
                    +<AnimatedStat value={portfolio.ytd_return} decimals={1} />%
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Risk Score</div>
                  <div className="font-display text-xl font-semibold text-[color:var(--signal-hold)]">
                    <AnimatedStat value={portfolio.risk_score} decimals={1} />/10
                  </div>
                </div>
              </div>

              {/* Pie chart */}
              <div className="relative h-[200px]">
                {loading ? (
                  <div className="flex h-full items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={portfolio.allocation}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={3}
                        dataKey="value"
                        animationBegin={0}
                        animationDuration={900}
                      >
                        {portfolio.allocation.map((entry: { name: string; value: number; color: string }, i: number) => (
                          <Cell key={i} fill={entry.color} strokeWidth={0} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={tooltipStyle}
                        formatter={(value: number) => [`${value}%`, "Allocation"]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
                {/* Center label */}
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <div className="font-display text-sm font-semibold">Portfolio</div>
                  <div className="text-[10px] text-muted-foreground">Allocation</div>
                </div>
              </div>

              {/* Legend */}
              <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
                {portfolio.allocation.map((a: { name: string; value: number; color: string }) => (
                  <div key={a.name} className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 shrink-0 rounded-sm"
                      style={{ background: a.color }}
                    />
                    <span className="text-xs text-muted-foreground">{a.name}</span>
                    <span className="ml-auto font-mono text-xs text-foreground">{a.value}%</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* ── Right: Recommendations ────────────────────────── */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-6">
              <Zap className="h-4 w-4 text-[color:var(--primary)]" />
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                AI Recommendations · {RECOMMENDATIONS.length - applied.size} pending
              </div>
            </div>

            {RECOMMENDATIONS.map((rec, i) => {
              const isApplied = applied.has(rec.id);
              const isApplying = applying === rec.id;
              const Icon = rec.icon;

              return (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                >
                  <GlassCard
                    className={cn(
                      "p-5 transition-all duration-500",
                      isApplied && "opacity-60",
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div
                          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                          style={{ background: `${rec.color}15`, border: `1px solid ${rec.color}30` }}
                        >
                          <Icon className="h-4 w-4" style={{ color: rec.color }} />
                        </div>
                        <div>
                          <div className="text-sm font-semibold">{rec.title}</div>
                          <div className="mt-1 text-xs leading-relaxed text-muted-foreground">
                            {rec.description}
                          </div>
                          <div
                            className="mt-2 text-[10px] font-semibold uppercase tracking-widest"
                            style={{ color: rec.color }}
                          >
                            {rec.impact}
                          </div>
                        </div>
                      </div>

                      {/* Apply button */}
                      <button
                        onClick={() => handleApply(rec.id, rec.title)}
                        disabled={isApplied || isApplying}
                        className={cn(
                          "shrink-0 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] transition-all",
                          isApplied
                            ? "border border-[color:var(--signal-buy)]/30 bg-[color:var(--signal-buy)]/10 text-[color:var(--signal-buy)] cursor-default"
                            : "border border-white/10 bg-white/5 text-muted-foreground hover:text-foreground hover:border-white/20",
                        )}
                      >
                        {isApplying ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : isApplied ? (
                          <><Check className="h-3 w-3" /> Applied</>
                        ) : (
                          "Apply"
                        )}
                      </button>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}

            {/* Applied all success state */}
            {applied.size === RECOMMENDATIONS.length && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl border border-[color:var(--signal-buy)]/20 bg-[color:var(--signal-buy)]/5 p-4 text-center"
              >
                <Check className="mx-auto h-6 w-6 text-[color:var(--signal-buy)] mb-2" />
                <div className="text-sm font-semibold text-[color:var(--signal-buy)]">
                  All recommendations applied
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Portfolio rebalancing queued for next trading session.
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
