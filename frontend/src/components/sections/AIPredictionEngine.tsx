/* eslint-disable prettier/prettier */
// src/components/sections/AIPredictionEngine.tsx
// ─────────────────────────────────────────────────────────────────────────────
// REPLACES existing AIPredictionEngine.tsx entirely.
// What's new:
//   • Live data from backend via useApi
//   • Loading skeletons shown while fetching
//   • Each card is clickable → opens PredictionDetailModal
//   • Error boundary with retry
//   • Ticker filter buttons (ALL / BUY / SELL / HOLD)
//   • Preserves all original animations and futuristic aesthetic
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Brain, RefreshCw, ChevronRight } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { SignalPill } from "@/components/ui/SignalPill";
import { ConfidenceMeter } from "@/components/ui/ConfidenceMeter";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PredictionCardSkeleton } from "@/components/ui/Skeletons";
import { useApi } from "@/hooks/useApi";
import { marketApi } from "@/lib/apiClient";
import { useApp } from "@/store/appStore";
import { PREDICTIONS as FALLBACK } from "@/data/predictions";
import type { Prediction, SignalDirection } from "@/types";
import { cn } from "@/lib/utils";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";

// Removed NeuralBackground

type FilterType = "ALL" | SignalDirection;
const FILTERS: FilterType[] = ["ALL", "BUY", "HOLD", "SELL"];

function PredictionCard({ p, index }: { p: Prediction; index: number }) {
  const { openPredictionDetail } = useApp();
  const isPositive = p.direction === "BUY";

  return (
    <motion.div
      key={p.ticker}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: index * 0.07, duration: 0.5 }}
    >
      <GlassCard
        className="group cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:border-primary/50"
        onClick={() => openPredictionDetail(p)}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-xl font-semibold">{p.ticker}</span>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <div className="mt-0.5 text-xs text-muted-foreground">{p.name}</div>
          </div>
          <SignalPill signal={p.direction} />
        </div>

        {/* Price + confidence */}
        <div className="mt-6 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Current
            </div>
            <div className="font-display text-2xl font-semibold tabular-nums">
              ${p.current.toFixed(2)}
            </div>
            <div className="mt-1 flex items-center gap-1.5">
              <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Target</div>
              <span
                className="font-mono text-xs font-semibold tabular-nums"
                style={{
                  color: isPositive ? "var(--signal-buy)" : p.direction === "SELL" ? "var(--signal-sell)" : "var(--signal-hold)",
                }}
              >
                ${p.target.toFixed(2)}
                <span className="ml-1 opacity-70">· {p.horizon}</span>
              </span>
            </div>
          </div>
          <ConfidenceMeter value={p.confidence} size={88} />
        </div>

        {/* AI reason */}
        <div className="mt-5 border-t border-white/5 pt-4">
          <div className="flex items-start gap-2">
            <Brain className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[color:var(--primary)]" />
            <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
              {p.reason}
            </p>
          </div>
        </div>

        {/* Hover hint */}
        <div className="mt-3 flex items-center justify-end gap-1 text-[10px] uppercase tracking-widest text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
          View detail <ChevronRight className="h-3 w-3" />
        </div>
      </GlassCard>
    </motion.div>
  );
}

export function AIPredictionEngine() {
  const [filter, setFilter] = useState<FilterType>("ALL");
  const { data: predictions, loading, error, refetch } = useApi(
    () => marketApi.predictions(),
    FALLBACK as Prediction[],
  );

  const filtered = useMemo(
    () => (filter === "ALL" ? predictions : predictions.filter((p) => p.direction === filter)),
    [predictions, filter],
  );

  return (
    <section id="predictions" className="relative py-24 md:py-32">

      <AnimatedReveal variant="fadeUp" className="relative mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="AI Prediction Engine"
          title={<>Markets predicted. <span className="text-foreground font-semibold">Risk quantified.</span></>}
          description="Every signal is explainable. Every confidence score is calibrated. No black boxes — just pure model intelligence."
        />

        {/* Filter tabs + refresh */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] transition-all",
                  filter === f
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-transparent text-muted-foreground hover:bg-secondary",
                )}
              >
                {f}
              </button>
            ))}
          </div>

          <button
            onClick={refetch}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
          >
            <RefreshCw className={cn("h-3 w-3", loading && "animate-spin")} />
            {loading ? "Fetching…" : "Refresh"}
          </button>
        </div>

        {/* Error state */}
        {error && (
          <div className="mt-8 rounded-2xl border border-[color:var(--signal-sell)]/20 bg-[color:var(--signal-sell)]/5 p-4 text-sm text-[color:var(--signal-sell)] text-center">
            Backend unavailable — showing cached predictions.{" "}
            <button onClick={refetch} className="underline">Retry</button>
          </div>
        )}

        {/* Grid */}
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }, (_, i) => <PredictionCardSkeleton key={i} />)
            : filtered.map((p, i) => <PredictionCard key={p.ticker} p={p} index={i} />)}
        </div>

        {/* Empty filter state */}
        {!loading && filtered.length === 0 && (
          <div className="mt-12 text-center text-sm text-muted-foreground">
            No {filter} signals right now. Try ALL or refresh.
          </div>
        )}

        {/* Live indicator */}
        <div className="mt-10 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--signal-buy)] animate-pulse-glow" />
          Live · Updated every 60s · {predictions.length} signals active
        </div>
      </AnimatedReveal>
    </section>
  );
}
