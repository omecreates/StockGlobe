export type NewsItem = {
  source: string;
  time: string;
  headline: string;
  sentiment: number; // -1..1
  insight: string;
  tickers: string[];
};

export const NEWS: NewsItem[] = [
  { source: "Bloomberg", time: "2m ago", headline: "Fed signals patient stance as inflation cools to 2.4%", sentiment: 0.72, insight: "Risk-on rotation likely; growth & semis to outperform defensives.", tickers: ["SPY", "QQQ", "NVDA"] },
  { source: "Reuters", time: "11m ago", headline: "NVIDIA Blackwell shipments exceed Q3 guidance", sentiment: 0.91, insight: "Supply chain pressure resolving — upside to FY26 estimates.", tickers: ["NVDA", "TSM", "AVGO"] },
  { source: "FT", time: "24m ago", headline: "Eurozone PMI surprises to upside, manufacturing rebounds", sentiment: 0.55, insight: "DAX + Stoxx 600 cyclicals positioned for catch-up trade.", tickers: ["DAX", "EWG"] },
  { source: "WSJ", time: "38m ago", headline: "China property sector under renewed stress signals", sentiment: -0.68, insight: "Avoid HK-listed developers; CNH weakness probable.", tickers: ["BABA", "FXI"] },
  { source: "CNBC", time: "1h ago", headline: "Apple Vision Pro 2 production ramp begins in Q1", sentiment: 0.64, insight: "Services attach & ASP tailwinds — upgrade cycle 2H.", tickers: ["AAPL"] },
  { source: "Nikkei", time: "2h ago", headline: "Yen stabilizes after BOJ commentary on rates trajectory", sentiment: 0.18, insight: "Japan exporters neutral; banks slightly positive.", tickers: ["EWJ", "MUFG"] },
];
