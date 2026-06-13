import { createFileRoute } from "@tanstack/react-router";
import { SmoothScrollProvider } from "@/components/layout/SmoothScrollProvider";
import { FloatingNav } from "@/components/layout/FloatingNav";
import { Footer } from "@/components/layout/Footer";
import { CursorGlow } from "@/components/layout/CursorGlow";
import { Hero } from "@/components/sections/Hero";
import { GlobalGlobeSection } from "@/components/sections/GlobalGlobeSection";
import { AIPredictionEngine } from "@/components/sections/AIPredictionEngine";
import { LiveAnalytics } from "@/components/sections/LiveAnalytics";
import { PortfolioIntelligence } from "@/components/sections/PortfolioIntelligence";
import { LiveNewsIntelligence } from "@/components/sections/LiveNewsIntelligence";
import { NewsSentiment } from "@/components/sections/NewsSentiment";
import { Top50Stocks } from "@/components/sections/Top50Stocks";
import { MarketMovers } from "@/components/sections/MarketMovers";
import { AIAssistantSection } from "@/components/sections/AIAssistantSection";
import { NeonButton } from "@/components/ui/NeonButton";
import { ArrowUpRight } from "lucide-react";

// Global state provider
import { AppProvider } from "@/store/appStore";

// Modals — mounted once at root level
import { DemoModal } from "@/components/modals/DemoModal";
import { RequestAccessModal } from "@/components/modals/RequestAccessModal";
import { AuthModal } from "@/components/modals/AuthModal";
import { PredictionDetailModal } from "@/components/modals/PredictionDetailModal";
import { MarketDetailModal } from "@/components/modals/MarketDetailModal";

// Toast notifications
import { ToastContainer } from "@/components/ui/ToastContainer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "StockGlobe — AI Stock Market Intelligence" },
      {
        name: "description",
        content:
          "StockGlobe is the AI intelligence layer for global markets. Predict every major asset on Earth in real time with full explainability.",
      },
      { property: "og:title", content: "StockGlobe — AI Stock Market Intelligence" },
      {
        property: "og:description",
        content:
          "Predict the markets before they move. A next-generation AI financial operating system.",
      },
      { name: "theme-color", content: "#0a0e1f" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <AppProvider>
      <SmoothScrollProvider>
        <CursorGlow />
        <FloatingNav />
        <main className="relative">
          <Hero />
          <GlobalGlobeSection />
          <AIPredictionEngine />
          <LiveAnalytics />
          <MarketMovers />
          <Top50Stocks />
          <PortfolioIntelligence />
          <LiveNewsIntelligence />
          <NewsSentiment />
          <AIAssistantSection />
          <CTA />
        </main>
        <Footer />

        {/* All modals — controlled by appStore */}
        <DemoModal />
        <RequestAccessModal />
        <AuthModal />
        <PredictionDetailModal />
        <MarketDetailModal />

        {/* Toast notifications */}
        <ToastContainer />
      </SmoothScrollProvider>
    </AppProvider>
  );
}

function CTA() {
  return (
    <section id="cta" className="relative px-6 py-32">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-white/10 p-12 text-center md:p-20">
        <div aria-hidden className="absolute inset-0 bg-secondary/50" />
        <div className="relative">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-foreground">
            Early access · Limited
          </div>
          <h2 className="mt-6 font-display text-4xl font-semibold leading-tight md:text-6xl">
            The market is a signal. <br />
            <span className="text-foreground font-semibold">We give you the receiver.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground">
            Join the firms already trading with StockGlobe. Onboard in under 5 minutes — bring your
            portfolio, leave with an edge.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <NeonButton>
              Request access <ArrowUpRight className="h-4 w-4" />
            </NeonButton>
            <NeonButton variant="ghost">Talk to research</NeonButton>
          </div>
        </div>
      </div>
    </section>
  );
}
