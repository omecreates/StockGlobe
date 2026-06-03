/* eslint-disable prettier/prettier */
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Sparkles, Play, ShieldCheck, Activity, Cpu } from "lucide-react";
import { useRef } from "react";
import { NeonButton } from "@/components/ui/NeonButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { MiniSparkline } from "@/components/ui/MiniSparkline";
import { SignalPill } from "@/components/ui/SignalPill";
import { useApp } from "@/store/appStore";
import { useScrollTo } from "@/hooks/useApi";

const STACK_CARDS = [
  { ticker: "NVDA", name: "NVIDIA Corp", price: 142.34, change: 3.21, signal: "BUY" as const, conf: 94 },
  { ticker: "AAPL", name: "Apple Inc", price: 228.55, change: 1.08, signal: "BUY" as const, conf: 87 },
  { ticker: "TSLA", name: "Tesla Inc", price: 248.71, change: -0.62, signal: "HOLD" as const, conf: 68 },
];

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const { openDemo, openRequestAccess } = useApp();
  const scrollTo = useScrollTo();

  return (
    <section id="top" ref={ref} className="relative min-h-screen overflow-hidden pt-32 pb-24 md:pt-40">
      <motion.div style={{ y, opacity }} className="relative mx-auto max-w-7xl px-6">
        
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-8 items-center">
          
          {/* ── Left Side: Content ────────────────────────────── */}
          <div className="flex flex-col items-start text-left">
            
            {/* Live Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-muted-foreground"
            >
              <span className="flex h-2 w-2">
                <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-[color:var(--signal-buy)] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[color:var(--signal-buy)]" />
              </span>
              Live · 24,000+ AI predictions active
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.8 }}
              className="mt-8 font-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl lg:text-[80px]"
            >
              Predict the markets <br />
              <span className="text-foreground">before they move.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg"
            >
              Neuralyx fuses 14B parameters of macro intelligence with sub-second order flow
              signals to forecast every major asset on Earth — in real time, with full explainability.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <NeonButton onClick={() => scrollTo("predictions")} className="px-6 py-3">
                Launch Terminal <ArrowUpRight className="h-4 w-4" />
              </NeonButton>
              <NeonButton variant="ghost" onClick={openDemo} className="px-6 py-3">
                <Play className="h-3.5 w-3.5" />
                Watch Demo
              </NeonButton>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="mt-16 flex items-center gap-6 border-t border-border pt-6 text-[11px] uppercase tracking-wider text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 opacity-70" />
                Trusted by 500+ quant funds
              </div>
              <div className="hidden md:flex items-center gap-2">
                <Activity className="h-4 w-4 opacity-70" />
                $4.2B Daily Volume Analyzed
              </div>
            </motion.div>

          </div>

          {/* ── Right Side: 3D Stacked Cards ──────────────────────── */}
          <div className="relative h-[400px] w-full md:h-[500px] perspective-1000">
            <div className="absolute inset-0 flex items-center justify-center transform-style-3d">
              {STACK_CARDS.map((card, i) => {
                // Calculate reverse index for z-index and scaling
                const reverseIndex = STACK_CARDS.length - 1 - i;
                
                return (
                  <motion.div
                    key={card.ticker}
                    className="absolute w-[320px] max-w-full"
                    initial={{ opacity: 0, y: 100, scale: 0.8 }}
                    animate={{ 
                      opacity: 1, 
                      y: reverseIndex * -30, 
                      scale: 1 - reverseIndex * 0.08,
                      rotateX: 10,
                      rotateZ: reverseIndex * -2,
                    }}
                    transition={{ 
                      delay: 0.5 + i * 0.15, 
                      duration: 0.8, 
                      type: "spring", 
                      stiffness: 100, 
                      damping: 20 
                    }}
                    whileHover={{
                      y: (reverseIndex * -30) - 20,
                      scale: (1 - reverseIndex * 0.08) + 0.02,
                      rotateX: 0,
                      rotateZ: 0,
                      transition: { duration: 0.3 }
                    }}
                    style={{
                      zIndex: i,
                      transformOrigin: "bottom center",
                    }}
                  >
                    {/* Add continuous float animation on top of the static positioning */}
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ 
                        duration: 6, 
                        repeat: Infinity, 
                        ease: "easeInOut",
                        delay: i * 1.2
                      }}
                    >
                      <GlassCard className="p-5 shadow-2xl border-white/10 bg-card/95 backdrop-blur-xl">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-display text-xl font-bold">{card.ticker}</div>
                            <div className="text-xs text-muted-foreground">{card.name}</div>
                          </div>
                          <SignalPill signal={card.signal} />
                        </div>
                        
                        <div className="mt-6 flex items-end justify-between">
                          <div>
                            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Current Price</div>
                            <div className="font-display text-2xl font-semibold tabular-nums">
                              ${card.price.toFixed(2)}
                            </div>
                            <div className={`text-xs tabular-nums font-semibold mt-0.5 ${card.change >= 0 ? "text-[color:var(--signal-buy)]" : "text-[color:var(--signal-sell)]"}`}>
                              {card.change >= 0 ? "+" : ""}{card.change}%
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end gap-2">
                            <MiniSparkline change={card.change} width={80} height={32} />
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                              <Cpu className="h-3 w-3" /> AI Conf {card.conf}%
                            </div>
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
            {/* Background glow behind stack */}
            <div className="absolute inset-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
          </div>

        </div>
      </motion.div>

      {/* ── CTA section at bottom of hero ────────────────────────── */}
      <motion.div
        id="cta"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="relative mx-auto mt-32 max-w-2xl px-6 text-center"
      >
        <div className="rounded-2xl border border-border bg-card p-10">
          <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-4">
            Limited early access
          </div>
          <h2 className="font-display text-3xl font-semibold">
            Ready to predict <br />
            <span className="text-foreground font-semibold">every market?</span>
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
