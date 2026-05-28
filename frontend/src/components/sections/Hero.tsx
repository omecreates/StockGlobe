/* eslint-disable prettier/prettier */
// src/components/sections/Hero.tsx
// ─────────────────────────────────────────────────────────────────────────────
// REPLACES the existing Hero.tsx entirely.
// What's new vs original:
//   • "Launch Terminal" → smooth scrolls to #predictions
//   • "Watch the demo" → opens DemoModal
//   • "Request Access" (CTA section at bottom) → opens RequestAccessModal
//   • Floating ticker cards have real buy/sell colors from CSS variables
//   • All animations preserved exactly
// ─────────────────────────────────────────────────────────────────────────────

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Sparkles, TrendingUp, Play } from "lucide-react";
import { useRef } from "react";
import { NeonButton } from "@/components/ui/NeonButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { CandlestickMini } from "@/components/ui/CandlestickMini";
import { SignalPill } from "@/components/ui/SignalPill";
import { useApp } from "@/store/appStore";
import { useScrollTo } from "@/hooks/useApi";

const FLOATING = [
  { ticker: "NVDA", price: 142.34, change: 3.21, signal: "BUY" as const, x: "8%",  y: "18%", delay: 0 },
  { ticker: "AAPL", price: 228.55, change: 1.08, signal: "BUY" as const, x: "78%", y: "12%", delay: 0.4 },
  { ticker: "TSLA", price: 248.71, change: -0.62, signal: "HOLD" as const, x: "82%", y: "62%", delay: 0.8 },
  { ticker: "META", price: 564.2,  change: 2.15, signal: "BUY" as const, x: "5%",  y: "68%", delay: 1.2 },
];

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y       = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const { openDemo, openRequestAccess } = useApp();
  const scrollTo = useScrollTo();

  return (
    <section id="top" ref={ref} className="relative min-h-screen overflow-hidden pt-32 pb-24">
      <div aria-hidden className="absolute inset-0 ring-grid opacity-30" />
      <motion.div
        aria-hidden
        className="absolute left-1/2 top-1/3 -z-10 h-[700px] w-[1100px] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: "var(--gradient-aurora)", opacity: 0.25 }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div style={{ y, opacity }} className="relative mx-auto max-w-7xl px-6">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mx-auto flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-muted-foreground backdrop-blur"
        >
          <Sparkles className="h-3 w-3 text-[color:var(--primary)]" />
          Neural market intelligence · v4.2
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8 }}
          className="mx-auto mt-6 max-w-5xl text-center font-display text-5xl font-semibold leading-[1.02] tracking-tight md:text-7xl lg:text-[88px]"
        >
          Predict the markets <br className="hidden md:inline" />
          <span className="text-gradient animate-aurora">before they move.</span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.7 }}
          className="mx-auto mt-7 max-w-2xl text-center text-base text-muted-foreground md:text-lg"
        >
          Neuralyx fuses 14B parameters of macro intelligence with sub-second order flow
          signals to forecast every major asset on Earth — in real time, with full explainability.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.6 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          {/* PRIMARY: scroll to predictions */}
          <NeonButton onClick={() => scrollTo("predictions")}>
            Launch Terminal <ArrowUpRight className="h-4 w-4" />
          </NeonButton>

          {/* GHOST: open demo modal */}
          <NeonButton variant="ghost" onClick={openDemo}>
            <Play className="h-3.5 w-3.5" />
            Watch the demo
          </NeonButton>
        </motion.div>

        {/* Showcase card */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.9, duration: 0.9, ease: "easeOut" }}
          className="relative mx-auto mt-20 max-w-3xl"
        >
          <GlassCard className="p-5 md:p-7" glow="primary">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
                  <TrendingUp className="h-5 w-5 text-[color:var(--primary)]" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Live · S&P 500</div>
                  <div className="font-display text-2xl font-semibold tabular-nums">5,847.21</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">AI 24h Forecast</div>
                <div className="font-display text-2xl font-semibold tabular-nums text-[color:var(--signal-buy)]">+1.84%</div>
              </div>
            </div>
            <div className="mt-5 flex items-end justify-between gap-6">
              <CandlestickMini width={320} height={86} />
              <div className="flex flex-col items-end gap-2">
                <SignalPill signal="BUY" />
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Confidence 92%</div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Floating tickers */}
        {FLOATING.map((f) => (
          <motion.div
            key={f.ticker}
            className="absolute hidden md:block"
            style={{ left: f.x, top: f.y }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 + f.delay * 0.2, duration: 0.7 }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5 + f.delay, repeat: Infinity, ease: "easeInOut" }}
            >
              <GlassCard className="w-[180px] p-3">
                <div className="flex items-center justify-between">
                  <span className="font-display text-sm font-semibold">{f.ticker}</span>
                  <SignalPill signal={f.signal} />
                </div>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="font-display text-base tabular-nums">${f.price.toFixed(2)}</span>
                  <span
                    className="text-xs tabular-nums"
                    style={{ color: f.change >= 0 ? "var(--signal-buy)" : "var(--signal-sell)" }}
                  >
                    {f.change >= 0 ? "+" : ""}{f.change}%
                  </span>
                </div>
                <CandlestickMini width={150} height={36} />
              </GlassCard>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── CTA section at bottom of hero ────────────────────────── */}
      <motion.div
        id="cta"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="relative mx-auto mt-40 max-w-2xl px-6 text-center"
      >
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 backdrop-blur-sm">
          <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-4">
            Limited early access
          </div>
          <h2 className="font-display text-3xl font-semibold">
            Ready to predict <br />
            <span className="text-gradient">every market?</span>
          </h2>
          <p className="mt-4 text-sm text-muted-foreground">
            Join 500+ quant funds and asset managers already on the waitlist.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <NeonButton onClick={openRequestAccess}>
              Request Early Access <ArrowUpRight className="h-4 w-4" />
            </NeonButton>
            <NeonButton variant="ghost" onClick={openDemo}>
              <Play className="h-3.5 w-3.5" /> Watch demo
            </NeonButton>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
