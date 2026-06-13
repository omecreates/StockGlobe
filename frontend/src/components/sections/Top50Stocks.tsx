/* eslint-disable prettier/prettier */
import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useApi } from "@/hooks/useApi";
import { marketApi } from "@/lib/apiClient";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { SignalPill } from "@/components/ui/SignalPill";
import { Cpu } from "lucide-react";

export function Top50Stocks() {
  const { data: predictions = [], loading } = useApi(() => marketApi.predictionsTop50(), []);
  const [showAll, setShowAll] = useState(false);
  
  const displayedPredictions = showAll ? predictions : predictions.slice(0, 5);
  
  return (
    <section id="top50" className="relative py-24 md:py-32 overflow-hidden">
      <AnimatedReveal className="mx-auto max-w-5xl px-6">
        <SectionHeading
          eyebrow="Market Breadth"
          title={<>The <span className="text-foreground font-semibold">Top 50</span> Global Assets.</>}
          description="Live AI predictions and signals across the 50 most actively traded global equities."
        />
        
        <div className="mt-20 relative">
          {loading ? (
            <div className="h-[500px] flex items-center justify-center text-muted-foreground animate-pulse">
              Initializing AI Engine across 50 markets...
            </div>
          ) : (
            <div className="relative flex flex-col gap-0 pb-[10vh]">
              {displayedPredictions.map((pred, i) => (
                <StackedCard 
                  key={pred.ticker} 
                  prediction={pred} 
                  index={i} 
                  total={displayedPredictions.length} 
                />
              ))}
              
              {!loading && predictions.length > 5 && (
                <div className="flex justify-center mt-12 z-50 relative pb-12">
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="rounded-full border border-white/10 bg-white/5 px-6 py-2 text-sm text-foreground hover:bg-white/10 transition-colors"
                  >
                    {showAll ? "Show Less" : `Show All ${predictions.length} Stocks`}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </AnimatedReveal>
    </section>
  );
}

function StackedCard({ prediction, index, total }: { prediction: any, index: number, total: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Measure how far we have scrolled past this card's sticky point
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start top", "bottom top"], 
  });
  
  // Transform values based on scroll progress
  // As we scroll past it (and the next card comes up), scale it down slightly
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -20]); // slight push up

  return (
    <div 
      className="sticky w-full transition-all"
      style={{
        top: `calc(6rem + ${index * 10}px)`, // slight offset for each card to see the stack
        zIndex: index,
        marginBottom: "2rem"
      }}
    >
      <motion.div
        ref={cardRef}
        style={{ scale, opacity, y }}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5, delay: 0.05 }}
        whileHover={{ scale: 1.02 }}
        className="w-full relative"
      >
        <GlassCard className="p-6 md:p-8 shadow-2xl border border-white/10 bg-card/95 backdrop-blur-3xl overflow-hidden group origin-top">
          
          {/* Subtle glow behind card */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-accent/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[inherit] -z-10" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* Left side: Ticker & Name */}
            <div className="flex items-center gap-6">
              <div className="w-12 text-center text-2xl font-black text-white/5 font-mono">
                #{index + 1}
              </div>
              <div>
                <div className="font-display text-2xl md:text-3xl font-bold flex items-center gap-3">
                  {prediction.ticker}
                  <SignalPill signal={prediction.direction} />
                </div>
                <div className="text-sm text-muted-foreground mt-1">{prediction.name}</div>
              </div>
            </div>

            {/* Right side: Data */}
            <div className="flex flex-wrap md:flex-nowrap items-center gap-6 md:gap-12 w-full md:w-auto">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Current Price</div>
                <div className="font-display text-xl font-semibold tabular-nums mt-1">
                  ${prediction.current.toFixed(2)}
                </div>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Target ({prediction.horizon})</div>
                <div className="font-display text-xl font-semibold tabular-nums mt-1">
                  ${prediction.target.toFixed(2)}
                </div>
              </div>

              <div className="flex flex-col items-end flex-grow md:flex-grow-0">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                  <Cpu className="h-3 w-3" /> AI Confidence
                </div>
                <div className="font-display text-2xl font-bold text-primary mt-1 tabular-nums">
                  {prediction.confidence}%
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/5 text-sm text-muted-foreground leading-relaxed flex gap-2">
            <span className="font-semibold text-foreground">AI Rationale:</span>
            {prediction.reason}
          </div>
          
        </GlassCard>
      </motion.div>
    </div>
  );
}
