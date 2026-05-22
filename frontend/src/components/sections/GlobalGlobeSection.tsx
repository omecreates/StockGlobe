/* eslint-disable prettier/prettier */
import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { MARKETS } from "@/data/markets";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

const Globe = lazy(() => import("@/components/globe/Globe").then((m) => ({ default: m.Globe })));

export function GlobalGlobeSection() {
  const [mount, setMount] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
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
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Global Market Intelligence"
          title={<>One planet. <span className="text-gradient">Every market.</span></>}
          description="A live, holographic view of global capital flows. Drag to rotate. Hover any hub to inspect index performance, AI confidence, and live sentiment."
        />

        <div className="relative mt-12 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          {/* Globe canvas */}
          <div className="relative h-[520px] w-full overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(ellipse_at_center,oklch(0.25_0.12_280),oklch(0.12_0.06_280))] md:h-[640px] glow-primary">
            <div aria-hidden className="pointer-events-none absolute inset-0 ring-grid opacity-20" />
            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />
            <div className="absolute left-4 top-4 z-10 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--signal-buy)] animate-pulse-glow" />
              Live · 8 markets · drag to rotate
            </div>
            <div className="absolute bottom-4 right-4 z-10 rounded-md border border-white/10 bg-black/30 px-2 py-1 font-mono text-[10px] text-muted-foreground backdrop-blur">
              NEURALYX · GEO-INTEL · v4.2
            </div>
            <div className="h-full w-full">
              {mount && (
                <Suspense fallback={null}>
                  <Globe />
                </Suspense>
              )}
            </div>
          </div>

          {/* HUD list */}
          <div className="flex flex-col gap-3">
            {MARKETS.map((m, i) => (
              <motion.div
                key={m.code}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
              >
                <GlassCard className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{m.code} · {m.city}</div>
                      <div className="mt-0.5 font-display text-sm font-semibold">{m.index}</div>
                    </div>
                    <div className={`font-display text-sm tabular-nums ${m.change >= 0 ? "text-[color:var(--signal-buy)]" : "text-[color:var(--signal-sell)]"}`}>
                      {m.change >= 0 ? "+" : ""}{m.change.toFixed(2)}%
                    </div>
                  </div>
                  <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/8">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${m.confidence}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 + 0.2, duration: 1 }}
                      className="h-full rounded-full"
                      style={{ background: "var(--gradient-aurora)" }}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>{m.sentiment}</span>
                    <span>AI {m.confidence}%</span>
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
