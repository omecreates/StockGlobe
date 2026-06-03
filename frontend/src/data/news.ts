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
  { source: "Bloomberg", time: "2h 15m ago", headline: "Microsoft expands Azure AI datacenters in Europe", sentiment: 0.85, insight: "Capex expansion signals robust AI enterprise demand.", tickers: ["MSFT"] },
  { source: "Reuters", time: "3h ago", headline: "Alphabet faces new DOJ scrutiny over Search dominance", sentiment: -0.52, insight: "Regulatory overhang increasing; short-term volatility expected.", tickers: ["GOOGL"] },
  { source: "WSJ", time: "3h 45m ago", headline: "JPMorgan reports record Q3 investment banking fees", sentiment: 0.78, insight: "Capital markets rebounding; positive read-through for financials.", tickers: ["JPM", "XLF"] },
  { source: "FT", time: "4h ago", headline: "OPEC+ signals production cuts extension into Q2", sentiment: 0.45, insight: "Brent crude floor established; energy sector supported.", tickers: ["XOM", "CVX", "XLE"] },
  { source: "CNBC", time: "5h ago", headline: "Salesforce raises full-year guidance on Data Cloud momentum", sentiment: 0.82, insight: "Enterprise software spending showing resilience.", tickers: ["CRM", "IGV"] },
  { source: "Reuters", time: "6h ago", headline: "Intel delays Ohio fab construction timeline by 6 months", sentiment: -0.75, insight: "Foundry execution risks materializing; market share loss continuing.", tickers: ["INTC", "AMD"] }
];
