/* eslint-disable prettier/prettier */
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { ArrowLeft, TrendingUp, RefreshCw, BarChart2 } from "lucide-react";
import { AppProvider, useApp } from "@/store/appStore";
import { taApi, marketApi, TAResponse } from "@/lib/apiClient";
import { TAChart } from "@/components/TAChart";
import { TACard } from "@/components/TACard";
import { TAInsights } from "@/components/TAInsights";
import { motion } from "framer-motion";

export const Route = createFileRoute("/stock/$ticker")({
  component: () => (
    <AppProvider>
      <StockDetailsPage />
    </AppProvider>
  ),
});

function StockDetailsPage() {
  const { ticker } = Route.useParams();
  const { state } = useApp();
  const [loading, setLoading] = useState(true);
  const [taData, setTaData] = useState<TAResponse | null>(null);
  const [period, setPeriod] = useState("1y");
  const [quote, setQuote] = useState<{ name: string; current: number; change_pct: number } | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [ta, q] = await Promise.all([
        taApi.getAnalysis(ticker, period).catch(() => null),
        marketApi.quote(ticker).catch(() => null),
      ]);
      if (ta) setTaData(ta);
      if (q) setQuote(q);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [ticker, period]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const periods = [
    { label: "1M", value: "1mo" },
    { label: "3M", value: "3mo" },
    { label: "6M", value: "6mo" },
    { label: "1Y", value: "1y" },
    { label: "5Y", value: "5y" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-lg">{ticker.toUpperCase()}</span>
              {quote && (
                <span className="text-sm text-muted-foreground hidden sm:block">| {quote.name}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {quote && (
              <div className="flex items-center gap-2">
                <span className="font-mono font-semibold">${quote.current.toFixed(2)}</span>
                <span className={`text-xs font-mono px-2 py-0.5 rounded-sm ${quote.change_pct >= 0 ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"}`}>
                  {quote.change_pct >= 0 ? "+" : ""}{quote.change_pct.toFixed(2)}%
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <BarChart2 className="h-8 w-8 text-primary" />
              Technical Analysis
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Advanced charting and AI-powered insights
            </p>
          </motion.div>

          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg border border-border">
            {periods.map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  period === p.value
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/10"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <RefreshCw className="h-8 w-8 animate-spin mb-4 text-primary" />
            <p>Loading market data...</p>
          </div>
        ) : !taData ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <p>Failed to load data. Please try again.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }} 
                animate={{ opacity: 1, scale: 1 }}
                className="w-full"
              >
                <TAChart 
                  data={taData.data} 
                  support={taData.support} 
                  resistance={taData.resistance} 
                  ticker={taData.ticker} 
                />
              </motion.div>
            </div>
            
            <div className="space-y-6">
              <TACard recommendation={taData.recommendation} score={taData.sentiment_score} />
              <TAInsights insights={taData.insights} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
