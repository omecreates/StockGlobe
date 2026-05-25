// src/components/sections/NewsSentiment.tsx
// ─────────────────────────────────────────────────────────────────────────────
// REPLACES existing NewsSentiment.tsx entirely.
// What's new:
//   • Live data from backend (RSS + TextBlob sentiment)
//   • Expandable articles (click card to expand insight)
//   • Ticker tag filter (click a ticker tag to filter cards)
//   • Animated sentiment bar (framer-motion width)
//   • Loading skeletons
//   • Error fallback to static data
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, RefreshCw, Newspaper } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { NewsCardSkeleton } from "@/components/ui/Skeletons";
import { useApi } from "@/hooks/useApi";
import { marketApi } from "@/lib/apiClient";
import { NEWS as FALLBACK } from "@/data/news";
import type { NewsItem } from "@/types";
import { cn } from "@/lib/utils";

// Sentiment score → label + color
function getSentimentMeta(score: number) {
  if (score >= 0.5) return { label: "Very Bullish", color: "var(--signal-buy)", bg: "var(--signal-buy)" };
  if (score >= 0.15) return { label: "Bullish",     color: "var(--signal-buy)", bg: "var(--signal-buy)" };
  if (score <= -0.5) return { label: "Very Bearish",color: "var(--signal-sell)",bg: "var(--signal-sell)" };
  if (score <= -0.15)return { label: "Bearish",     color: "var(--signal-sell)",bg: "var(--signal-sell)" };
  return { label: "Neutral", color: "var(--signal-hold)", bg: "var(--signal-hold)" };
}

function NewsCard({ item, index }: { item: NewsItem; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const meta = getSentimentMeta(item.sentiment);

  // Width for sentiment bar: map -1..1 → 0%..100%
  const barWidth = Math.round(((item.sentiment + 1) / 2) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: index * 0.06, duration: 0.45 }}
    >
      <GlassCard
        className="group cursor-pointer p-5 transition-all duration-300 hover:scale-[1.01]"
        onClick={() => setExpanded((v) => !v)}
      >
        {/* Top row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              {item.source}
            </span>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <span className="text-[10px] text-muted-foreground">{item.time}</span>
          </div>
          <span
            className="rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
            style={{
              color: meta.color,
              borderColor: `${meta.color}40`,
              background: `${meta.bg}10`,
            }}
          >
            {meta.label}
          </span>
        </div>

        {/* Headline */}
        <h3 className="mt-3 text-sm font-semibold leading-snug text-foreground group-hover:text-gradient transition-all">
          {item.headline}
        </h3>

        {/* Sentiment bar */}
        <div className="mt-3 space-y-1">
          <div className="flex items-center justify-between text-[9px] uppercase tracking-widest text-muted-foreground">
            <span>Sentiment</span>
            <span>{item.sentiment >= 0 ? "+" : ""}{item.sentiment.toFixed(2)}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/8">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${barWidth}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeOut", delay: index * 0.06 }}
              className="h-full rounded-full"
              style={{ background: meta.bg, opacity: 0.8 }}
            />
          </div>
        </div>

        {/* Expandable insight */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="mt-4 rounded-xl border border-white/8 bg-white/[0.03] p-3">
                <div className="text-[9px] uppercase tracking-widest text-muted-foreground mb-2">
                  AI Insight
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">{item.insight}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ticker tags + expand toggle */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {item.tickers.map((t: string) => (
              <span
                key={t}
                className="rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[9px] tracking-wider text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
            {expanded ? (
              <><ChevronUp className="h-3 w-3" /> Less</>
            ) : (
              <><ChevronDown className="h-3 w-3" /> Insight</>
            )}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

export function NewsSentiment() {
  const [tickerFilter, setTickerFilter] = useState<string>("ALL");
  const { data: news, loading, error, refetch } = useApi(
    () => marketApi.newsSentiment(8),
    FALLBACK as NewsItem[],
  );

  // Build unique ticker list from all news items
  const allTickers = useMemo(() => {
    const set = new Set<string>();
    news.forEach((n) => n.tickers.forEach((t) => set.add(t)));
    return ["ALL", ...Array.from(set).slice(0, 8)];
  }, [news]);

  const filtered = useMemo(
    () =>
      tickerFilter === "ALL"
        ? news
        : news.filter((n) => n.tickers.includes(tickerFilter)),
    [news, tickerFilter],
  );

  return (
    <section id="sentiment" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="News Sentiment Engine"
          title={<>Markets move on <span className="text-gradient">narrative.</span></>}
          description="Real-time NLP across 200+ financial sources. Every headline scored, every signal extracted."
        />

        {/* Controls */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
          {/* Ticker filter pills */}
          <div className="flex flex-wrap gap-1.5">
            {allTickers.map((t) => (
              <button
                key={t}
                onClick={() => setTickerFilter(t)}
                className={cn(
                  "rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] transition-all",
                  tickerFilter === t
                    ? "text-background"
                    : "border border-white/10 bg-white/[0.03] text-muted-foreground hover:text-foreground",
                )}
                style={
                  tickerFilter === t
                    ? { background: "var(--gradient-aurora)", backgroundSize: "200% 200%", animation: "aurora-shift 8s ease infinite" }
                    : undefined
                }
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={refetch}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
          >
            <RefreshCw className={cn("h-3 w-3", loading && "animate-spin")} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-[color:var(--signal-sell)]/20 bg-[color:var(--signal-sell)]/5 p-3 text-xs text-[color:var(--signal-sell)] text-center">
            Live feed unavailable — showing cached data.{" "}
            <button onClick={refetch} className="underline">Retry</button>
          </div>
        )}

        {/* Cards */}
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }, (_, i) => <NewsCardSkeleton key={i} />)
            : filtered.map((item, i) => (
                <NewsCard key={`${item.source}-${i}`} item={item} index={i} />
              ))}
        </div>

        {!loading && filtered.length === 0 && (
          <div className="mt-12 flex flex-col items-center gap-3 text-muted-foreground">
            <Newspaper className="h-8 w-8 opacity-30" />
            <p className="text-sm">No news for {tickerFilter} right now.</p>
          </div>
        )}

        <div className="mt-10 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--signal-buy)] animate-pulse-glow" />
          Live NLP · {news.length} articles scored
        </div>
      </div>
    </section>
  );
}
