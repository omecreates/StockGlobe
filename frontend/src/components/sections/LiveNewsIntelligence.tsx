import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Search, 
  Clock, 
  Newspaper,
  Activity,
  AlertTriangle,
  BrainCircuit,
  ExternalLink
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";

// Types
interface LiveNewsItem {
  title: string;
  source: string;
  url: string;
  published_at: string;
  image: string;
  sentiment: "Bullish" | "Neutral" | "Bearish";
  confidence: number;
  tickers: string[];
  summary: string;
}

const CATEGORIES = ["All", "Stocks", "AI", "Technology", "Earnings", "Economy", "Crypto"];

const FALLBACK_NEWS: LiveNewsItem[] = [
  {
    title: "NVIDIA Smashes Revenue Records as AI Chip Demand Hits All-Time High",
    source: "Reuters",
    url: "#",
    published_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    image: "",
    sentiment: "Bullish",
    confidence: 94,
    tickers: ["NVDA", "AMD"],
    summary: "NVIDIA reported Q2 revenue of $30B, beating estimates by 12%. Data center segment alone grew 154% YoY driven by H100 and upcoming Blackwell GPU demand from hyperscalers.",
  },
  {
    title: "Federal Reserve Signals Rate Pause as Inflation Data Cools",
    source: "Bloomberg",
    url: "#",
    published_at: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
    image: "",
    sentiment: "Bullish",
    confidence: 78,
    tickers: ["SPY", "QQQ", "TLT"],
    summary: "Core PCE inflation fell to 2.6% in July, giving the Fed room to hold rates steady at the upcoming September meeting. Markets pricing in 75% probability of a pause.",
  },
  {
    title: "Apple Vision Pro 2 Launch Expected to Reignite Spatial Computing Wave",
    source: "TechCrunch",
    url: "#",
    published_at: new Date(Date.now() - 1000 * 60 * 80).toISOString(),
    image: "",
    sentiment: "Bullish",
    confidence: 82,
    tickers: ["AAPL"],
    summary: "Multiple supply chain sources confirm Apple Vision Pro 2 enters mass production this month. Analysts expect a $500 price cut vs the original, unlocking a mainstream consumer market.",
  },
  {
    title: "Tesla Robotaxi Delayed Again, Sending Shares Down 4% Pre-Market",
    source: "Wall Street Journal",
    url: "#",
    published_at: new Date(Date.now() - 1000 * 60 * 130).toISOString(),
    image: "",
    sentiment: "Bearish",
    confidence: 88,
    tickers: ["TSLA"],
    summary: "Tesla quietly pushed the Cybercab Robotaxi launch to Q3 2025 after regulatory hurdles in California and Texas. The delay raises concerns about Musk's timeline credibility with investors.",
  },
  {
    title: "Microsoft Azure AI Revenue Accelerates, Beating Estimates by 8%",
    source: "CNBC",
    url: "#",
    published_at: new Date(Date.now() - 1000 * 60 * 200).toISOString(),
    image: "",
    sentiment: "Bullish",
    confidence: 91,
    tickers: ["MSFT"],
    summary: "Microsoft reported Azure grew 29% YoY with AI services now contributing 7 points of growth. CEO Satya Nadella highlighted Copilot enterprise adoption surpassing 50,000 organisations.",
  },
  {
    title: "Intel Foundry Division Burns $2.8B in Q2, Restructuring Announced",
    source: "Financial Times",
    url: "#",
    published_at: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    image: "",
    sentiment: "Bearish",
    confidence: 86,
    tickers: ["INTC"],
    summary: "Intel's foundry segment reported a $2.8B operating loss in Q2, prompting the company to announce a 15,000-person layoff and suspension of dividend. TSMC and Samsung look set to gain share.",
  },
  {
    title: "Meta AI Studio Opens to All Developers, Sparking Competitive Moat Concerns for OpenAI",
    source: "The Verge",
    url: "#",
    published_at: new Date(Date.now() - 1000 * 60 * 380).toISOString(),
    image: "",
    sentiment: "Bullish",
    confidence: 75,
    tickers: ["META"],
    summary: "Meta opened its AI Studio platform to all developers globally, offering Llama 3.2 integration. With 3.2B daily active users as a distribution channel, analysts see a major ad revenue uplift ahead.",
  },
  {
    title: "Amazon AWS Launches Graviton 4 Chips, Undercutting NVIDIA on Cost-Per-Inference",
    source: "Reuters",
    url: "#",
    published_at: new Date(Date.now() - 1000 * 60 * 460).toISOString(),
    image: "",
    sentiment: "Neutral",
    confidence: 70,
    tickers: ["AMZN", "NVDA"],
    summary: "Amazon's new Graviton 4 chips claim a 40% better price-performance ratio for inference workloads vs NVIDIA's A100. The move could slow enterprise GPU adoption as cloud-native inference matures.",
  },
];

export function LiveNewsIntelligence() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: news = FALLBACK_NEWS, isLoading, isError } = useQuery<LiveNewsItem[]>({
    queryKey: ["liveNews"],
    queryFn: async () => {
      const res = await fetch("http://localhost:8000/api/news/live");
      if (!res.ok) throw new Error("Failed to fetch news");
      return res.json();
    },
    refetchInterval: 60000,
    placeholderData: FALLBACK_NEWS,
  });

  // Filter logic
  const filteredNews = useMemo(() => {
    return news.filter((item) => {
      const matchesSearch = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tickers.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = 
        activeCategory === "All" || 
        item.title.toLowerCase().includes(activeCategory.toLowerCase()) || 
        item.summary.toLowerCase().includes(activeCategory.toLowerCase());

      return matchesSearch && matchesCategory;
    });
  }, [news, searchQuery, activeCategory]);

  // Derived Trending stats
  const trendingStats = useMemo(() => {
    const tickerCounts: Record<string, number> = {};
    let bullishCount = 0;
    let bearishCount = 0;

    news.forEach(item => {
      item.tickers.forEach(t => {
        if (t !== "MARKET") {
          tickerCounts[t] = (tickerCounts[t] || 0) + 1;
        }
      });
      if (item.sentiment === "Bullish") bullishCount++;
      if (item.sentiment === "Bearish") bearishCount++;
    });

    const mostMentioned = Object.entries(tickerCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(entry => entry[0]);

    return { mostMentioned, bullishCount, bearishCount };
  }, [news]);

  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Breaking News Marquee */}
      {news.length > 0 && (
        <div className="absolute top-0 left-0 right-0 bg-primary/10 border-b border-primary/20 flex items-center overflow-hidden py-2 px-4 whitespace-nowrap">
          <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-widest mr-4 z-10 bg-[#0a0e1f] pr-4">
            <Activity size={14} className="animate-pulse" />
            Breaking
          </div>
          <motion.div 
            className="flex items-center gap-8 text-sm text-foreground/80"
            animate={{ x: ["0%", "-100%"] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            {[...news, ...news].slice(0, 8).map((item, i) => (
              <span key={i} className="flex items-center gap-2">
                <span className="text-white font-medium">{item.source}:</span> 
                {item.title}
              </span>
            ))}
          </motion.div>
        </div>
      )}

      <AnimatedReveal variant="fadeUp" className="mx-auto max-w-7xl relative z-10 pt-8">
        
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--signal-buy)]/30 bg-[color:var(--signal-buy)]/10 px-3 py-1 text-[10px] uppercase tracking-wider text-[color:var(--signal-buy)] mb-4">
            <Activity size={12} />
            Live Intel
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-tight text-white mb-4">
            Market News Intelligence
          </h2>
          <p className="text-muted-foreground max-w-2xl text-lg">
            Real-time financial news augmented with AI sentiment analysis and impact scoring.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_300px] gap-8">
          
          {/* Main Content Area */}
          <div className="space-y-6">
            
            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input 
                  type="text" 
                  placeholder="Search symbol or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-card/50 border border-white/10 rounded-full py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide mask-edges">
                {CATEGORIES.map(category => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                      activeCategory === category 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white border border-white/5'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* News Feed Grid */}
            {isLoading ? (
              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(n => (
                  <div key={n} className="rounded-2xl bg-card border border-white/5 h-[300px] animate-pulse">
                    <div className="w-full h-40 bg-white/5 rounded-t-2xl"></div>
                    <div className="p-5 space-y-3">
                      <div className="h-4 bg-white/5 rounded w-3/4"></div>
                      <div className="h-4 bg-white/5 rounded w-1/2"></div>
                      <div className="flex gap-2 mt-4">
                        <div className="h-6 w-16 bg-white/5 rounded-full"></div>
                        <div className="h-6 w-16 bg-white/5 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center text-red-400">
                <AlertTriangle className="mx-auto mb-4 opacity-50" size={32} />
                <p>Failed to load live news. Please try again later.</p>
              </div>
            ) : filteredNews.length === 0 ? (
              <div className="rounded-2xl border border-white/5 bg-white/5 p-12 text-center text-muted-foreground">
                <Search className="mx-auto mb-4 opacity-30" size={32} />
                <p>No news found for your search criteria.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredNews.map((item, idx) => (
                    <motion.div
                      key={`${item.title}-${idx}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                    >
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="block h-full group">
                        <Card className="h-full overflow-hidden border-white/10 bg-card/40 backdrop-blur-md hover:border-primary/30 transition-all hover:shadow-[0_0_30px_-10px_rgba(var(--primary),0.3)]">
                          {/* Image */}
                          <div className="relative h-48 overflow-hidden">
                            <img 
                              src={item.image} 
                              alt={item.title} 
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                              onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3'; }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e1f] to-transparent opacity-80" />
                            
                            {/* Sentiment Badge Over Image */}
                            <div className="absolute bottom-4 left-4 flex gap-2">
                              <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur-md border ${
                                item.sentiment === 'Bullish' ? 'bg-[color:var(--signal-buy)]/20 text-[color:var(--signal-buy)] border-[color:var(--signal-buy)]/30' :
                                item.sentiment === 'Bearish' ? 'bg-[color:var(--signal-sell)]/20 text-[color:var(--signal-sell)] border-[color:var(--signal-sell)]/30' :
                                'bg-white/10 text-white border-white/20'
                              }`}>
                                {item.sentiment === 'Bullish' ? <TrendingUp size={12} /> : item.sentiment === 'Bearish' ? <TrendingDown size={12} /> : <Minus size={12} />}
                                {item.sentiment} {(item.confidence * 100).toFixed(0)}%
                              </div>
                            </div>
                          </div>
                          
                          {/* Content */}
                          <div className="p-5 flex flex-col h-[calc(100%-12rem)] justify-between">
                            <div>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                                <span className="flex items-center gap-1"><Newspaper size={12} /> {item.source}</span>
                                <span className="flex items-center gap-1"><Clock size={12} /> {new Date(item.published_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                              <h3 className="font-semibold text-white leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                                {item.title}
                              </h3>
                              
                              <div className="mt-3 text-xs text-foreground/70 bg-white/5 border border-white/10 p-3 rounded-xl flex items-start gap-2">
                                <BrainCircuit className="text-primary mt-0.5 shrink-0" size={14} />
                                <span className="line-clamp-2">{item.summary}</span>
                              </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                              <div className="flex flex-wrap gap-1.5">
                                {item.tickers.slice(0,3).map(ticker => (
                                  <span key={ticker} className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-muted-foreground border border-white/10">
                                    ${ticker}
                                  </span>
                                ))}
                                {item.tickers.length > 3 && (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-muted-foreground border border-white/10">
                                    +{item.tickers.length - 3}
                                  </span>
                                )}
                              </div>
                              <ExternalLink size={14} className="text-muted-foreground group-hover:text-white transition-colors" />
                            </div>
                          </div>
                        </Card>
                      </a>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Trending Topics Panel */}
          <div className="space-y-6">
            <Card className="border-white/10 bg-card/40 backdrop-blur-md p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6 flex items-center gap-2">
                <Activity size={16} /> Trending Market Pulse
              </h3>
              
              {!isLoading && news.length > 0 && (
                <div className="space-y-8">
                  {/* Market Sentiment Overview */}
                  <div>
                    <h4 className="text-xs text-muted-foreground mb-3">Overall Sentiment Balance</h4>
                    <div className="flex w-full h-2 rounded-full overflow-hidden bg-white/5">
                      <div 
                        className="bg-[color:var(--signal-buy)] transition-all duration-1000" 
                        style={{ width: `${(trendingStats.bullishCount / news.length) * 100}%` }}
                      />
                      <div 
                        className="bg-[color:var(--signal-sell)] transition-all duration-1000" 
                        style={{ width: `${(trendingStats.bearishCount / news.length) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-xs">
                      <span className="text-[color:var(--signal-buy)] font-medium">Bullish</span>
                      <span className="text-[color:var(--signal-sell)] font-medium">Bearish</span>
                    </div>
                  </div>

                  {/* Most Mentioned */}
                  <div>
                    <h4 className="text-xs text-muted-foreground mb-3">Top Mentioned Tickers</h4>
                    <div className="flex flex-wrap gap-2">
                      {trendingStats.mostMentioned.map(ticker => (
                        <div key={ticker} className="px-3 py-1.5 rounded-lg border border-primary/20 bg-primary/10 text-primary text-xs font-mono font-medium flex items-center gap-2">
                          ${ticker}
                        </div>
                      ))}
                      {trendingStats.mostMentioned.length === 0 && (
                        <span className="text-xs text-muted-foreground">Gathering data...</span>
                      )}
                    </div>
                  </div>
                  
                  {/* AI Quick Take */}
                  <div className="rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 p-4">
                    <div className="flex items-center gap-2 text-primary font-medium text-xs mb-2">
                      <BrainCircuit size={14} /> AI Synthesis
                    </div>
                    <p className="text-xs text-foreground/80 leading-relaxed">
                      Market news flow is currently dominated by {trendingStats.mostMentioned.slice(0,2).join(" and ") || "broad macroeconomic updates"}. 
                      Overall tone appears {trendingStats.bullishCount > trendingStats.bearishCount ? 'bullish' : 'bearish'}.
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>

        </div>
      </AnimatedReveal>
    </section>
  );
}
