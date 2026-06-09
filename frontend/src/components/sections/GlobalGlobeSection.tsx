import React, { Suspense, lazy, useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, TrendingUp, TrendingDown, Activity, Globe2, ShieldAlert, BarChart3, Clock, X, ArrowRightLeft } from "lucide-react";
import { MARKETS, type Market } from "@/data/markets";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useGlobeStore } from "@/store/globeStore";
import { cn } from "@/lib/utils";

const Globe = lazy(() => import("@/components/globe/Globe").then((m) => ({ default: m.Globe })));

const AI_INSIGHTS = [
  "US markets are leading global momentum with tech sector driving massive inflows.",
  "Asian markets show weakening sentiment as regulatory concerns weigh on Hong Kong.",
  "European markets remain neutral despite volatility in currency markets.",
  "Capital flowing heavily from emerging markets into North American safe havens.",
  "Global risk index elevated due to sudden spikes in energy sector volatility."
];

export function GlobalGlobeSection() {
  const [mount, setMount] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { heatmapMode, setHeatmapMode, selectedMarkets, clearSelection } = useGlobeStore();
  const [insightIndex, setInsightIndex] = useState(0);
  const [timestamp, setTimestamp] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setInsightIndex((i) => (i + 1) % AI_INSIGHTS.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setTimestamp(new Date().toLocaleTimeString());
    const interval = setInterval(() => {
      setTimestamp(new Date().toLocaleTimeString());
    }, 1000);
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

  const selectedData = useMemo(() => 
    selectedMarkets.map(code => MARKETS.find(m => m.code === code)).filter(Boolean) as Market[], 
  [selectedMarkets]);

  return (
    <section id="globe" ref={ref} className="relative py-24 md:py-32 bg-background">
      <div className="mx-auto max-w-[1500px] px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <SectionHeading
            eyebrow="AI Command Center"
            title={<>Global <span className="text-primary font-semibold">Intelligence</span></>}
            description="Real-time Bloomberg-style terminal for global capital flows, sentiment, and AI market predictions."
          />
          <div className="flex items-center gap-4 bg-white/5 p-1 rounded-full border border-white/10">
            <button
              onClick={() => setHeatmapMode(false)}
              className={cn("px-4 py-1.5 rounded-full text-sm font-medium transition-all", !heatmapMode ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-foreground")}
            >
              <Globe2 className="w-4 h-4 inline-block mr-1.5" /> Photorealistic
            </button>
            <button
              onClick={() => setHeatmapMode(true)}
              className={cn("px-4 py-1.5 rounded-full text-sm font-medium transition-all", heatmapMode ? "bg-rose-500 text-white shadow-lg" : "text-muted-foreground hover:text-foreground")}
            >
              <Activity className="w-4 h-4 inline-block mr-1.5" /> Heatmap
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">
          {/* Left Column - Globe & Footer */}
          <div className="flex flex-col gap-6">
            <div className="relative h-[500px] md:h-[600px] w-full rounded-2xl border border-white/10 bg-card overflow-hidden shadow-2xl">
              {/* Globe Overlay HUD */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                <div className="flex items-center gap-2 bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-[10px] font-mono tracking-widest text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  SYSTEM ACTIVE
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4 z-10">
                <GlassCard className="p-4 bg-background/60 backdrop-blur-xl border-white/10 flex flex-col md:flex-row items-center gap-4">
                  <Brain className="w-8 h-8 text-primary opacity-50 shrink-0" />
                  <div className="flex-1">
                    <div className="text-[10px] uppercase tracking-widest text-primary font-semibold mb-1">AI Global Observation</div>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={insightIndex}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-sm font-medium text-foreground"
                      >
                        {AI_INSIGHTS[insightIndex]}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </GlassCard>
              </div>

              {/* 3D Canvas */}
              {mount && (
                <Suspense fallback={<div className="flex items-center justify-center h-full text-muted-foreground">Initializing Spatial Engine...</div>}>
                  <Globe />
                </Suspense>
              )}
            </div>

            {/* Real-time Footer Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <GlassCard className="p-4 bg-white/[0.02]">
                <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider mb-2"><Clock className="w-3 h-3" /> Updated</div>
                <div className="font-mono text-lg">{timestamp}</div>
              </GlassCard>
              <GlassCard className="p-4 bg-white/[0.02]">
                <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider mb-2"><Globe2 className="w-3 h-3" /> Global Status</div>
                <div className="font-semibold text-emerald-400">MARKETS OPEN</div>
              </GlassCard>
              <GlassCard className="p-4 bg-white/[0.02]">
                <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider mb-2"><ShieldAlert className="w-3 h-3" /> Risk Index</div>
                <div className="font-display text-xl text-yellow-400">Elevated</div>
              </GlassCard>
              <GlassCard className="p-4 bg-white/[0.02]">
                <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider mb-2"><Activity className="w-3 h-3" /> Fear / Greed</div>
                <div className="font-display text-xl text-emerald-400">Greed (74)</div>
              </GlassCard>
            </div>
          </div>

          {/* Right Column - Dynamic Side Panel */}
          <div className="relative flex flex-col h-full min-h-[600px]">
            <AnimatePresence mode="wait">
              {selectedData.length === 0 && (
                <motion.div key="dashboard" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6 h-full">
                  <DefaultDashboard />
                </motion.div>
              )}
              {selectedData.length === 1 && (
                <motion.div key="single" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full">
                  <SingleMarketPanel market={selectedData[0]} onClose={clearSelection} />
                </motion.div>
              )}
              {selectedData.length === 2 && (
                <motion.div key="compare" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full">
                  <ComparisonPanel m1={selectedData[0]} m2={selectedData[1]} onClose={clearSelection} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function DefaultDashboard() {
  return (
    <GlassCard className="flex-1 p-6 flex flex-col gap-6 bg-card/40 overflow-hidden">
      <div className="flex items-center gap-2 text-primary font-semibold uppercase tracking-widest text-xs border-b border-white/10 pb-4">
        <BarChart3 className="w-4 h-4" /> Regional Overview
      </div>
      
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Top Performing Regions</h4>
        {[
          { name: "North America", perf: "+1.8%", flow: "High Inflow" },
          { name: "Europe", perf: "+0.4%", flow: "Neutral" },
          { name: "Asia Pacific", perf: "-0.9%", flow: "Outflow" }
        ].map(r => (
          <div key={r.name} className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5">
            <span className="font-medium">{r.name}</span>
            <div className="text-right">
              <div className={r.perf.startsWith('+') ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>{r.perf}</div>
              <div className="text-[10px] text-muted-foreground uppercase">{r.flow}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-5 rounded-xl bg-gradient-to-br from-rose-500/10 to-orange-500/10 border border-rose-500/20">
        <h4 className="text-sm font-semibold text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-2"><ShieldAlert className="w-4 h-4"/> Key Risks Detected</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Volatility spike in Chinese real estate sector</li>
          <li>• Yield curve inversion persisting in US markets</li>
          <li>• Supply chain disruptions affecting Euro industrials</li>
        </ul>
      </div>

      <div className="flex-1 flex flex-col justify-end text-center p-6 border-t border-white/10 mt-6">
        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3 animate-pulse">
          <Globe2 className="w-6 h-6 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">Click any market hub on the globe to view detailed AI analysis.</p>
      </div>
    </GlassCard>
  );
}

function SingleMarketPanel({ market, onClose }: { market: Market, onClose: () => void }) {
  const isPositive = market.change >= 0;
  return (
    <GlassCard className="h-full flex flex-col bg-card/60 border-primary/20 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1" style={{ background: isPositive ? '#10b981' : '#f43f5e' }} />
      <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
        <X className="w-4 h-4 text-muted-foreground" />
      </button>

      <div className="p-6 border-b border-white/10">
        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1">{market.code} HUB</div>
        <h2 className="text-3xl font-display font-bold">{market.name}</h2>
        <div className="text-sm text-muted-foreground">{market.index} · {market.city}</div>
        
        <div className="flex items-end gap-4 mt-6">
          <div>
            <div className="text-[10px] uppercase text-muted-foreground tracking-wider mb-1">Index Value</div>
            <div className="text-4xl font-display font-semibold tabular-nums">{market.value.toLocaleString()}</div>
          </div>
          <div className={`pb-1 text-xl font-semibold flex items-center gap-1 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isPositive ? <TrendingUp className="w-5 h-5"/> : <TrendingDown className="w-5 h-5"/>}
            {isPositive ? "+" : ""}{market.change.toFixed(2)}%
          </div>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto custom-scrollbar space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
            <div className="text-[10px] uppercase text-muted-foreground tracking-wider mb-2 flex items-center gap-2"><Brain className="w-3 h-3 text-primary"/> AI Confidence</div>
            <div className="text-2xl font-bold">{market.confidence}%</div>
            <div className="w-full h-1 bg-white/10 rounded-full mt-2">
              <div className="h-full bg-primary rounded-full" style={{ width: `${market.confidence}%` }} />
            </div>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
            <div className="text-[10px] uppercase text-muted-foreground tracking-wider mb-2 flex items-center gap-2"><Activity className="w-3 h-3"/> Daily Volume</div>
            <div className="text-2xl font-bold">{market.volume}</div>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">AI Market Summary</h4>
          <p className="text-sm leading-relaxed bg-primary/5 border border-primary/10 p-4 rounded-xl text-primary-100">
            {market.aiSummary}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">Top Gainers</h4>
            <div className="space-y-1">
              {market.topGainers.map(t => <div key={t} className="text-sm px-2 py-1 bg-emerald-500/10 rounded text-emerald-200">{t}</div>)}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-2">Top Losers</h4>
            <div className="space-y-1">
              {market.topLosers.map(t => <div key={t} className="text-sm px-2 py-1 bg-rose-500/10 rounded text-rose-200">{t}</div>)}
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Latest Intelligence</h4>
          <ul className="space-y-3">
            {market.news.map((n, i) => (
              <li key={i} className="text-sm text-muted-foreground flex gap-3">
                <span className="text-primary mt-1">•</span> {n}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="p-4 border-t border-white/10 text-center text-xs text-muted-foreground bg-white/[0.01]">
        Select another market on the globe to compare.
      </div>
    </GlassCard>
  );
}

function ComparisonPanel({ m1, m2, onClose }: { m1: Market, m2: Market, onClose: () => void }) {
  return (
    <GlassCard className="h-full flex flex-col bg-card/60 border-white/20 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent" />
      <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors z-10">
        <X className="w-4 h-4 text-muted-foreground" />
      </button>

      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <div className="w-[45%]">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1">{m1.code}</div>
          <h2 className="text-xl font-display font-bold truncate">{m1.name}</h2>
        </div>
        <div className="w-[10%] flex justify-center">
          <ArrowRightLeft className="w-5 h-5 text-muted-foreground" />
        </div>
        <div className="w-[45%] text-right">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1">{m2.code}</div>
          <h2 className="text-xl font-display font-bold truncate">{m2.name}</h2>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto space-y-8">
        
        <CompareRow title="Index Performance">
          <div className={`text-2xl font-bold ${m1.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {m1.change >= 0 ? "+" : ""}{m1.change.toFixed(2)}%
          </div>
          <div className={`text-2xl font-bold ${m2.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {m2.change >= 0 ? "+" : ""}{m2.change.toFixed(2)}%
          </div>
        </CompareRow>

        <CompareRow title="AI Confidence">
          <div className="flex flex-col gap-1 items-start">
            <span className="text-xl font-bold">{m1.confidence}%</span>
            <div className="w-24 h-1 bg-white/10 rounded-full"><div className="h-full bg-primary rounded-full" style={{width: `${m1.confidence}%`}}/></div>
          </div>
          <div className="flex flex-col gap-1 items-end">
            <span className="text-xl font-bold">{m2.confidence}%</span>
            <div className="w-24 h-1 bg-white/10 rounded-full flex justify-end"><div className="h-full bg-primary rounded-full" style={{width: `${m2.confidence}%`}}/></div>
          </div>
        </CompareRow>

        <CompareRow title="Daily Volume">
          <div className="text-lg font-semibold">{m1.volume}</div>
          <div className="text-lg font-semibold">{m2.volume}</div>
        </CompareRow>

        <CompareRow title="Overall Sentiment">
          <div className="text-sm font-bold uppercase tracking-widest text-white">{m1.sentiment}</div>
          <div className="text-sm font-bold uppercase tracking-widest text-white">{m2.sentiment}</div>
        </CompareRow>

        <div>
          <h4 className="text-xs font-semibold text-center text-muted-foreground uppercase tracking-wider mb-4 border-b border-white/5 pb-2">AI Comparative Analysis</h4>
          <div className="grid grid-cols-2 gap-4">
            <p className="text-xs leading-relaxed text-muted-foreground bg-white/5 p-3 rounded-lg border border-white/5">
              {m1.aiSummary}
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground bg-white/5 p-3 rounded-lg border border-white/5 text-right">
              {m2.aiSummary}
            </p>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

function CompareRow({ title, children }: { title: string, children: React.ReactNode }) {
  const [left, right] = React.Children.toArray(children);
  return (
    <div>
      <h4 className="text-[10px] font-semibold text-center text-muted-foreground uppercase tracking-[0.2em] mb-3">{title}</h4>
      <div className="flex items-center justify-between">
        <div className="w-[45%]">{left}</div>
        <div className="w-[10%] h-8 border-x border-white/5" />
        <div className="w-[45%] text-right flex justify-end">{right}</div>
      </div>
    </div>
  );
}
