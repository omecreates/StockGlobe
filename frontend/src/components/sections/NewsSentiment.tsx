/* eslint-disable prettier/prettier */
import { motion } from "framer-motion";

import { useApi } from "@/hooks/useApi";
import { api } from "@/lib/apiClient";

import { NEWS as FALLBACK_NEWS } from "@/data/news";

import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

function sentimentColor(s: number) {
  if (s > 0.3) return "var(--signal-buy)";
  if (s < -0.3) return "var(--signal-sell)";
  return "var(--signal-hold)";
}

function sentimentLabel(s: number) {
  if (s > 0.3) return "Bullish";
  if (s < -0.3) return "Bearish";
  return "Neutral";
}

export function NewsSentiment() {
  const {
    data: news,
    loading,
    error,
  } = useApi(
    () => api.newsSentiment(),
    FALLBACK_NEWS
  );

  return (
    <section
      id="sentiment"
      className="relative py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="News Sentiment AI"
          title={
            <>
              Markets move on{" "}
              <span className="text-gradient">
                narrative.
              </span>
            </>
          }
          description="Every wire, filing, and post — read, scored, and explained the moment it lands. Tradeable insight from raw text."
        />

        {loading && (
          <div className="mt-6 text-center text-sm text-muted-foreground animate-pulse">
            Fetching live news sentiment...
          </div>
        )}

        {error && (
          <div className="mt-6 text-center text-sm text-red-400">
            Failed to load news sentiment.
          </div>
        )}

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {news.map((n, i) => {
            const pct = Math.round(
              ((n.sentiment + 1) / 2) * 100
            );

            const color = sentimentColor(n.sentiment);

            return (
              <motion.div
                key={n.headline}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{
                  once: true,
                  margin: "-60px",
                }}
                transition={{
                  delay: i * 0.07,
                  duration: 0.55,
                }}
                whileHover={{ y: -4 }}
              >
                <GlassCard className="h-full p-5">
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    <span>{n.source}</span>
                    <span>{n.time}</span>
                  </div>

                  <div className="mt-3 font-display text-base font-semibold leading-snug">
                    {n.headline}
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
                      <span>Sentiment</span>

                      <span style={{ color }}>
                        {sentimentLabel(n.sentiment)} · {pct}%
                      </span>
                    </div>

                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/8">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{
                          width: `${pct}%`,
                        }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 1,
                          delay: 0.15,
                        }}
                        className="h-full rounded-full"
                        style={{ background: color }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl border border-white/8 bg-white/[0.03] p-3 text-xs leading-relaxed text-muted-foreground">
                    <span className="font-medium text-foreground/90">
                      AI insight ·{" "}
                    </span>

                    {n.insight}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {n.tickers.map((t: string) => (
                      <span
                        key={t}
                        className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] tracking-wider"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}