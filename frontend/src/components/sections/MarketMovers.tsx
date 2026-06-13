/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { SignalPill } from "@/components/ui/SignalPill";
import { Brain, TrendingUp, TrendingDown, Activity, DollarSign, PieChart, Filter } from "lucide-react";
import { mockMarketMovers, type MarketMover } from "@/data/mockMarketMovers";
import { cn } from "@/lib/utils";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";

const FILTERS = ["All Stocks", "AI", "Technology", "Finance", "Healthcare", "Energy"];
const SORTS = ["Top Gainers", "Top Losers", "Highest AI Confidence", "Most Discussed"];

export function MarketMovers() {
  const [activeFilter, setActiveFilter] = useState("All Stocks");
  const [activeSort, setActiveSort] = useState("Top Gainers");
  const [activeIndex, setActiveIndex] = useState(0);
  const stackRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(activeIndex);
  const dataLenRef = useRef(0);
  const touchStartY = useRef<number | null>(null);

  // Keep refs in sync with state
  useEffect(() => { activeIndexRef.current = activeIndex; }, [activeIndex]);

  const filteredAndSortedData = useMemo(() => {
    let data = [...mockMarketMovers];
    
    // Filter
    if (activeFilter !== "All Stocks") {
      data = data.filter((d) => d.sector === activeFilter);
    }
    
    // Sort
    switch (activeSort) {
      case "Top Gainers":
        data.sort((a, b) => b.changePct - a.changePct);
        break;
      case "Top Losers":
        data.sort((a, b) => a.changePct - b.changePct);
        break;
      case "Highest AI Confidence":
        data.sort((a, b) => b.confidence - a.confidence);
        break;
      case "Most Discussed":
        data.sort((a, b) => b.sentimentScore - a.sentimentScore);
        break;
    }
    return data;
  }, [activeFilter, activeSort]);

  // Keep data length ref in sync
  useEffect(() => { dataLenRef.current = filteredAndSortedData.length; }, [filteredAndSortedData.length]);

  // Reset index when filter/sort changes
  useEffect(() => {
    setActiveIndex(0);
  }, [activeFilter, activeSort]);

  // Native wheel listener with { passive: false } so we can preventDefault
  useEffect(() => {
    const el = stackRef.current;
    if (!el) return;

    let lastWheelTime = 0;
    const THROTTLE_MS = 200;

    const handleWheel = (e: WheelEvent) => {
      const idx = activeIndexRef.current;
      const maxIdx = dataLenRef.current - 1;

      // At boundaries, let page scroll through
      if (e.deltaY > 0 && idx >= maxIdx) return;
      if (e.deltaY < 0 && idx <= 0) return;

      e.preventDefault();

      const now = Date.now();
      if (now - lastWheelTime < THROTTLE_MS) return;
      lastWheelTime = now;

      if (e.deltaY > 0) {
        setActiveIndex((prev) => Math.min(prev + 1, maxIdx));
      } else if (e.deltaY < 0) {
        setActiveIndex((prev) => Math.max(prev - 1, 0));
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  // Touch support for mobile swipe
  useEffect(() => {
    const el = stackRef.current;
    if (!el) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartY.current === null) return;
      const deltaY = touchStartY.current - e.changedTouches[0].clientY;
      touchStartY.current = null;

      if (Math.abs(deltaY) < 30) return;
      const maxIdx = dataLenRef.current - 1;

      if (deltaY > 0) {
        setActiveIndex((prev) => Math.min(prev + 1, maxIdx));
      } else {
        setActiveIndex((prev) => Math.max(prev - 1, 0));
      }
    };

    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  const activeStock = filteredAndSortedData[activeIndex];

  return (
    <section id="movers" className="relative py-24 md:py-32 overflow-hidden bg-background">
      <AnimatedReveal variant="fadeUp" className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Market Movers"
          title={<>The <span className="text-foreground font-semibold">Most Watched</span> Stocks.</>}
          description="Discover the market's most watched stocks through AI-powered insights and live performance tracking."
        />

        {/* Controls */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-4 z-10 relative">
          <div className="flex flex-wrap items-center gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-medium transition-colors border",
                  activeFilter === f
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-white/5 text-muted-foreground border-white/10 hover:text-foreground hover:bg-white/10"
                )}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 relative">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={activeSort}
              onChange={(e) => setActiveSort(e.target.value)}
              className="appearance-none bg-white/5 border border-white/10 rounded-lg px-4 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {SORTS.map((s) => (
                <option key={s} value={s} className="bg-card text-foreground">
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Layout: Cards & Summary */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Stacked Cards Area */}
          <div 
            ref={stackRef}
            className="lg:col-span-8 relative h-[450px] perspective-[1000px] flex justify-center cursor-pointer touch-none"
            onClick={() => setActiveIndex((prev) => (prev + 1) % filteredAndSortedData.length)}
          >
            {/* Card counter indicator */}
            <div className="absolute top-0 right-0 z-20 flex items-center gap-2 bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              <span className="font-mono text-xs text-muted-foreground">
                {activeIndex + 1} / {filteredAndSortedData.length}
              </span>
            </div>

            <AnimatePresence mode="popLayout">
              {filteredAndSortedData.map((stock, i) => {
                // Determine position relative to active index
                const offset = i - activeIndex;
                if (offset < 0 || offset > 4) return null; // Show only active and next 4

                const isFront = offset === 0;
                
                return (
                  <motion.div
                    key={stock.id}
                    layout
                    initial={{ opacity: 0, y: 100, scale: 0.8 }}
                    animate={{
                      opacity: 1 - offset * 0.15,
                      y: offset * 30,
                      scale: 1 - offset * 0.05,
                      zIndex: 10 - offset,
                    }}
                    exit={{ opacity: 0, y: -100, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    whileHover={isFront ? { scale: 1.02, y: -5 } : undefined}
                    className="absolute w-full max-w-[600px]"
                  >
                    <GlassCard className={cn(
                      "p-8 shadow-2xl border transition-all duration-500",
                      isFront ? "border-primary/30 bg-card/95 backdrop-blur-xl" : "border-white/10 bg-card/80 backdrop-blur-md",
                      "group overflow-hidden rounded-3xl"
                    )}>
                      {isFront && (
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-accent/10 blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500 rounded-[inherit] -z-10" />
                      )}

                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center font-display text-2xl font-bold text-foreground">
                            {stock.ticker.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-display text-2xl font-bold flex items-center gap-3">
                              {stock.ticker}
                              <SignalPill signal={stock.signal} />
                            </h3>
                            <p className="text-sm text-muted-foreground">{stock.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-display text-3xl font-bold tabular-nums">
                            ${stock.price.toFixed(2)}
                          </div>
                          <div className={cn(
                            "text-sm font-semibold flex items-center justify-end gap-1 mt-1",
                            stock.changePct >= 0 ? "text-emerald-500" : "text-rose-500"
                          )}>
                            {stock.changePct >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                            {stock.changePct > 0 ? "+" : ""}{stock.changePct.toFixed(2)}%
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-white/5 mb-6">
                        <div className="space-y-1">
                          <div className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                            <Brain className="h-3 w-3" /> Confidence
                          </div>
                          <div className="font-semibold text-primary">{stock.confidence}%</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                            <Activity className="h-3 w-3" /> Sentiment
                          </div>
                          <div className="font-semibold text-foreground">{stock.sentimentScore}/100</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                            <PieChart className="h-3 w-3" /> Sector
                          </div>
                          <div className="font-semibold text-foreground">{stock.sector}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                            <DollarSign className="h-3 w-3" /> Mkt Cap
                          </div>
                          <div className="font-semibold text-foreground">{stock.marketCap}</div>
                        </div>
                      </div>

                      <div className="h-24 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={stock.sparkline.map((val, idx) => ({ val, idx }))}>
                            <YAxis domain={['auto', 'auto']} hide />
                            <Line 
                              type="monotone" 
                              dataKey="val" 
                              stroke={stock.changePct >= 0 ? "#10b981" : "#f43f5e"} 
                              strokeWidth={3} 
                              dot={false}
                              isAnimationActive={isFront}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <div className="mt-4 text-center text-xs text-muted-foreground opacity-50">
                        {isFront ? "Scroll or click to cycle" : ""}
                      </div>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* AI Summary Panel */}
          <div className="lg:col-span-4 h-full">
            <AnimatePresence mode="wait">
              {activeStock && (
                <motion.div
                  key={activeStock.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  <GlassCard className="h-full p-8 border border-white/10 bg-card/60 backdrop-blur-xl flex flex-col justify-center rounded-3xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-10">
                      <Brain className="h-24 w-24" />
                    </div>
                    <h4 className="text-sm font-semibold tracking-widest uppercase text-primary mb-6 flex items-center gap-2">
                      <Brain className="h-4 w-4" /> AI Summary
                    </h4>
                    <p className="text-2xl font-display leading-relaxed text-foreground">
                      Why <span className="font-bold text-white">{activeStock.ticker}</span> is trending
                    </p>
                    <div className="mt-6 text-muted-foreground leading-loose text-lg">
                      {activeStock.reason}
                    </div>
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </AnimatedReveal>
    </section>
  );
}

