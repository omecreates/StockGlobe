
import { motion } from "framer-motion";
import { useApi } from "@/hooks/useApi";
import { api } from "@/lib/apiClient";
import { PREDICTIONS as FALLBACK_PREDICTIONS, Prediction } from "@/data/predictions";

import { GlassCard } from "@/components/ui/GlassCard";
import { SignalPill } from "@/components/ui/SignalPill";
import { ConfidenceMeter } from "@/components/ui/ConfidenceMeter";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function AIPredictionEngine() {
  const {
    data: predictions,
    loading,
    error,
  } = useApi(() => api.predictions(), FALLBACK_PREDICTIONS);

  return (
    <section id="predictions" className="relative py-24 md:py-32">
      <NeuralBackground />

      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Prediction Engine"
          title={
            <>
              14B-parameter{" "}
              <span className="text-gradient">
                market cortex.
              </span>
            </>
          }
          description="Every ticker, scored continuously. Direction, target, horizon, and a transparent rationale — all explained."
        />

        {loading && (
          <div className="mt-6 text-center text-sm text-muted-foreground animate-pulse">
            Fetching live AI predictions...
          </div>
        )}

        {error && (
          <div className="mt-6 text-center text-sm text-red-400">
            Failed to load live predictions.
          </div>
        )}

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {predictions.map((p, i: number) => (
            <motion.div
              key={p.ticker}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              whileHover={{ y: -6 }}
            >
              <GlassCard className="h-full p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-display text-2xl font-semibold">
                      {p.ticker}
                    </div>

                    <div className="text-xs text-muted-foreground">
                      {p.name}
                    </div>
                  </div>

                  <SignalPill signal={p.direction} />
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      Target · {p.horizon}
                    </div>

                    <div className="mt-1 font-display text-3xl font-semibold tabular-nums text-gradient">
                      ${p.target.toFixed(2)}
                    </div>

                    <div className="mt-1 text-xs tabular-nums text-muted-foreground">
                      from ${p.current.toFixed(2)} (
                      {((p.target / p.current - 1) * 100).toFixed(1)}
                      %)
                    </div>
                  </div>

                  <ConfidenceMeter value={p.confidence} />
                </div>

                <div className="mt-5 border-t border-white/5 pt-4 text-xs leading-relaxed text-muted-foreground">
                  {p.reason}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function NeuralBackground() {
  const nodes = Array.from({ length: 18 }, (_, i) => ({
    cx: (i * 73) % 1000,
    cy: (i * 137) % 480,
    r: 2 + (i % 3),
  }));

  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.18]"
      preserveAspectRatio="none"
      viewBox="0 0 1000 480"
    >
      <defs>
        <linearGradient id="nn" x1="0" x2="1">
          <stop offset="0%" stopColor="oklch(0.82 0.17 200)" />
          <stop offset="100%" stopColor="oklch(0.62 0.24 295)" />
        </linearGradient>
      </defs>

      {nodes.flatMap((n, i) =>
        nodes
          .slice(i + 1)
          .map((m, j) =>
            Math.hypot(n.cx - m.cx, n.cy - m.cy) < 280 ? (
              <line
                key={`${i}-${j}`}
                x1={n.cx}
                y1={n.cy}
                x2={m.cx}
                y2={m.cy}
                stroke="url(#nn)"
                strokeWidth="0.6"
              />
            ) : null
          )
      )}

      {nodes.map((n, i) => (
        <circle key={i} cx={n.cx} cy={n.cy} r={n.r} fill="url(#nn)">
          <animate
            attributeName="opacity"
            values="0.4;1;0.4"
            dur={`${3 + (i % 4)}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </svg>
  );
}