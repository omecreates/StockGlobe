/* eslint-disable prettier/prettier */
import { Suspense, lazy, useEffect, useRef, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Brain, TrendingUp, TrendingDown, Activity, ActivitySquare } from "lucide-react";
import { MARKETS } from "@/data/markets";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedStat } from "@/components/ui/AnimatedStat";
import { MiniSparkline } from "@/components/ui/MiniSparkline";
import { useApp } from "@/store/appStore";
import type { Market } from "@/types";
import { cn } from "@/lib/utils";

const Globe = lazy(() => import("@/components/globe/Globe").then((m) => ({ default: m.Globe })));

// A simple static list of rotating AI insights for the dashboard
const AI_INSIGHTS = [
  "Global liquidity shifting from US tech to emerging market industrials. Momentum factor strengthening.",
  "European indices showing resilience despite ECB rate trajectory uncertainty.",
  "Asian markets processing stimulus impact; volatility expected in the near term.",
  "Cross-border capital flows indicate defensive positioning ahead of key macroeconomic prints.",
];

export function GlobalGlobeSection() {
  const [mount, setMount] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { openMarketDetail } = useApp();

  // Compute derived metrics
  const metrics = useMemo(() => {
    let bullish = 0;
    let bearish = 0;
    let totalConf = 0;
    let topGainer = MARKETS[0];
    let topLoser = MARKETS[0];

    MARKETS.forEach(m => {
      if (m.sentiment === "Bullish") bullish++;
      if (m.sentiment === "Bearish") bearish++;
      totalConf += m.confidence;
      if (m.change > topGainer.change) topGainer = m;
      if (m.change < topLoser.change) topLoser = m;
    });

    return {
      bullish,
      bearish,
      avgConf: totalConf / MARKETS.length,
      topGainer,
      topLoser
    };
  }, []);

  // Simple rotation for AI Insight
  const [insightIndex, setInsightIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setInsightIndex((i) => (i + 1) % AI_INSIGHTS.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setMount(true)),
      { rootMargin: "200px" },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <section id="globe" ref={ref} className="relative py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6">
        <SectionHeading
          eyebrow="Global Market Intelligence"
          title={<>One planet. <span className="text-foreground font-semibold">Every market.</span></>}
          description="A live, holographic view of global capital flows. Monitor worldwide momentum and AI confidence in real-time."
        />

        <div className="relative mt-12 grid gap-6 lg:grid-cols-[1.8fr_1fr]">
          {/* ── Main View (Left Column) ───────────────────────── */}
          <div className="flex flex-col gap-6">
            
            {/* Globe canvas */}
            <div className="relative h-[480px] w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm md:h-[560px]">
              <div className="absolute left-4 top-4 z-10 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--signal-buy)] animate-pulse-glow" />
                Live · {MARKETS.length} markets · drag to rotate
              </div>
              <div className="absolute bottom-4 right-4 z-10 rounded bg-background px-2 py-1 font-mono text-[10px] text-muted-foreground border border-border">
                PREDICTAFI · GEO-INTEL · v4.2
              </div>
              <div className="h-full w-full">
                {mount && (
                  <Suspense fallback={null}>
                    <Globe />
                  </Suspense>
                )}
              </div>
            </div>

            {/* Global Market Summary KPI Panel */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <GlassCard className="p-5 flex flex-col justify-between">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-3">
                  <TrendingUp className="h-3.5 w-3.5 text-[color:var(--signal-buy)]" />
                  Top Gainer
                </div>
                <div>
                  <div className="font-display text-xl font-semibold">{metrics.topGainer.code}</div>
                  <div className="text-sm font-semibold text-[color:var(--signal-buy)]">
                    +{metrics.topGainer.change.toFixed(2)}%
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-5 flex flex-col justify-between">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-3">
                  <TrendingDown className="h-3.5 w-3.5 text-[color:var(--signal-sell)]" />
                  Top Loser
                </div>
                <div>
                  <div className="font-display text-xl font-semibold">{metrics.topLoser.code}</div>
                  <div className="text-sm font-semibold text-[color:var(--signal-sell)]">
                    {metrics.topLoser.change.toFixed(2)}%
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-5 flex flex-col justify-between">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-3">
                  <Activity className="h-3.5 w-3.5 text-[color:var(--signal-hold)]" />
                  Market Breadth
                </div>
                <div className="flex items-end gap-3">
                  <div>
                    <div className="font-display text-xl font-semibold text-[color:var(--signal-buy)]">{metrics.bullish}</div>
                    <div className="text-[10px] text-muted-foreground">BULLISH</div>
                  </div>
                  <div className="pb-1 text-muted-foreground border-l border-border pl-3">
                    <div className="font-display text-xl font-semibold text-[color:var(--signal-sell)]">{metrics.bearish}</div>
                    <div className="text-[10px] text-muted-foreground">BEARISH</div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-5 flex flex-col justify-between">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-3">
                  <Brain className="h-3.5 w-3.5 text-[color:var(--primary)]" />
                  Avg Confidence
                </div>
                <div className="flex items-baseline gap-1">
                  <div className="font-display text-3xl font-semibold">
                    <AnimatedStat value={metrics.avgConf} decimals={0} />
                  </div>
                  <span className="text-sm text-muted-foreground">%</span>
                </div>
              </GlassCard>
            </div>
          </div>

          {/* ── Intelligence Feed (Right Column) ──────────────── */}
          <div className="flex flex-col gap-6">
            
            {/* Live AI Insights Panel */}
            <GlassCard className="p-5 shrink-0 bg-primary/5 border-primary/20">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="h-4 w-4 text-[color:var(--primary)]" />
                <div className="text-[10px] uppercase tracking-[0.2em] font-semibold text-primary">
                  Live AI Insight
                </div>
              </div>
              <motion.div
                key={insightIndex}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.5 }}
                className="text-sm leading-relaxed text-foreground"
              >
                {AI_INSIGHTS[insightIndex]}
              </motion.div>
            </GlassCard>

            {/* Watchlist Header */}
            <div className="flex items-center justify-between px-1">
              <div className="text-[10px] uppercase tracking-[0.2em] font-semibold text-muted-foreground">
                Global Watchlist
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {MARKETS.length} Indices
              </div>
            </div>

            {/* Scrollable Watchlist Container */}
            <div className="relative flex-1 min-h-[400px] max-h-[600px] overflow-hidden rounded-xl border border-border bg-card">
              <div className="absolute inset-0 overflow-y-auto p-3 flex flex-col gap-2 scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20 scrollbar-track-transparent">
                {MARKETS.map((m, i) => (
                  <motion.div
                    key={m.code}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (i % 8) * 0.05, duration: 0.4 }}
                  >
                    <div
                      className="group cursor-pointer rounded-lg border border-transparent p-3 transition-all duration-200 hover:border-border hover:bg-white/[0.03]"
                      onClick={() => openMarketDetail(m as Market)}
                    >
                      <div className="flex items-center justify-between">
                        {/* Left: Info */}
                        <div className="w-[40%]">
                          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                            {m.code} · {m.city}
                          </div>
                          <div className="font-display text-sm font-semibold truncate" title={m.index}>
                            {m.index}
                          </div>
                        </div>

                        {/* Middle: Sparkline */}
                        <div className="flex-1 flex justify-center opacity-70 transition-opacity group-hover:opacity-100">
                          <MiniSparkline change={m.change} />
                        </div>

                        {/* Right: Metrics */}
                        <div className="w-[30%] text-right flex flex-col items-end">
                          <div className={cn(
                            "font-display text-sm font-semibold tabular-nums",
                            m.change >= 0 ? "text-[color:var(--signal-buy)]" : "text-[color:var(--signal-sell)]"
                          )}>
                            {m.change >= 0 ? "+" : ""}{m.change.toFixed(2)}%
                          </div>
                          <div className="mt-1 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                            <span>AI {m.confidence}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              {/* Fade out bottom of scroll list */}
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-card to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
