export type Market = {
  code: string;
  name: string;
  city: string;
  index: string;
  lat: number;
  lng: number;
  value: number;
  change: number;
  confidence: number;
  sentiment: "Bullish" | "Bearish" | "Neutral" | "Very Bullish" | "Very Bearish";
  volume: string;
  overview: string;
  topGainers: string[];
  topLosers: string[];
  trending: string[];
  aiSummary: string;
  news: string[];
};

export const MARKETS: Market[] = [
  { 
    code: "NYSE", name: "United States", city: "New York", index: "NYSE Composite", lat: 40.7128, lng: -74.006, 
    value: 18450.2, change: 1.2, confidence: 94, sentiment: "Bullish", volume: "4.2B",
    overview: "US equities extend gains on robust tech earnings.",
    topGainers: ["JPM", "XOM", "UNH"], topLosers: ["BA", "DIS"], trending: ["V", "PG"],
    aiSummary: "US markets are leading global momentum driven by strong corporate earnings and resilient consumer data.",
    news: ["NYSE sees highest volume day this month", "Financials lead the rally"]
  },
  { 
    code: "NASDAQ", name: "United States", city: "New York", index: "NASDAQ 100", lat: 40.7580, lng: -73.9855, 
    value: 20145.8, change: 2.1, confidence: 98, sentiment: "Very Bullish", volume: "6.8B",
    overview: "Tech sector surges following AI infrastructure announcements.",
    topGainers: ["NVDA", "MSFT", "META"], topLosers: ["INTC", "TSLA"], trending: ["AAPL", "GOOGL"],
    aiSummary: "AI-related tech stocks continue to see unprecedented inflows.",
    news: ["Tech giants announce new AI chips", "Semiconductors hit all-time highs"]
  },
  { 
    code: "LSE", name: "United Kingdom", city: "London", index: "FTSE 100", lat: 51.5074, lng: -0.1278, 
    value: 8214.3, change: 0.31, confidence: 79, sentiment: "Neutral", volume: "850M",
    overview: "UK markets steady as BoE signals potential rate hold.",
    topGainers: ["BP", "HSBA", "AZN"], topLosers: ["ULVR", "BATS"], trending: ["GSK", "RIO"],
    aiSummary: "European markets remain neutral despite volatility in currency markets.",
    news: ["BoE maintains rates", "Energy sector buoys FTSE"]
  },
  { 
    code: "FRA", name: "Germany", city: "Frankfurt", index: "DAX 40", lat: 50.1109, lng: 8.6821, 
    value: 19478.6, change: 0.92, confidence: 84, sentiment: "Bullish", volume: "920M",
    overview: "German industrials show unexpected strength in Q2.",
    topGainers: ["SAP", "SIE", "ALV"], topLosers: ["BAS", "BAYN"], trending: ["BMW", "DTE"],
    aiSummary: "Frankfurt benefits from improved export forecasts and tech sector spillover.",
    news: ["Auto exports beat estimates", "SAP hits new record"]
  },
  { 
    code: "TSE", name: "Japan", city: "Tokyo", index: "Nikkei 225", lat: 35.6762, lng: 139.6503, 
    value: 38765.4, change: -0.42, confidence: 71, sentiment: "Neutral", volume: "1.4B",
    overview: "Yen strength pressures export-heavy indices.",
    topGainers: ["9984", "8035", "6861"], topLosers: ["7203", "6758"], trending: ["9432", "8306"],
    aiSummary: "Asian markets show mixed sentiment as currency fluctuations impact forward guidance.",
    news: ["BoJ signals policy shift", "Tech hardware stocks slide"]
  },
  { 
    code: "SSE", name: "China", city: "Shanghai", index: "SSE Composite", lat: 31.2304, lng: 121.4737, 
    value: 3247.8, change: -1.18, confidence: 64, sentiment: "Bearish", volume: "32B",
    overview: "Property sector concerns drag down broader market.",
    topGainers: ["601318", "600519"], topLosers: ["600028", "601398"], trending: ["600036", "601166"],
    aiSummary: "Macro headwinds and real estate uncertainties continue to suppress Shanghai volumes.",
    news: ["New stimulus measures debated", "Manufacturing PMI dips"]
  },
  { 
    code: "HKEX", name: "Hong Kong", city: "Hong Kong", index: "Hang Seng", lat: 22.3193, lng: 114.1694, 
    value: 18452.3, change: -1.85, confidence: 55, sentiment: "Very Bearish", volume: "2.1B",
    overview: "Tech regulatory fears weigh on heavily weighted internet stocks.",
    topGainers: ["0005", "0388"], topLosers: ["0700", "9988"], trending: ["3690", "1299"],
    aiSummary: "Asian markets show weakening sentiment with Hong Kong leading the declines.",
    news: ["Tech stocks selloff intensifies", "Cross-border flows decrease"]
  },
  { 
    code: "SGX", name: "Singapore", city: "Singapore", index: "STI", lat: 1.3521, lng: 103.8198, 
    value: 3712.4, change: 0.58, confidence: 86, sentiment: "Bullish", volume: "450M",
    overview: "Financials boost STI amidst regional instability.",
    topGainers: ["D05", "O39", "U11"], topLosers: ["Z74", "C38U"], trending: ["V03", "BN4"],
    aiSummary: "Singapore serves as a safe haven hub capturing regional outflows.",
    news: ["Banks report record margins", "REITs stabilize"]
  },
  { 
    code: "BSE", name: "India", city: "Mumbai", index: "BSE SENSEX", lat: 19.076, lng: 72.8777, 
    value: 82432.5, change: 0.87, confidence: 88, sentiment: "Bullish", volume: "1.2B",
    overview: "Domestic consumption drives equities to fresh highs.",
    topGainers: ["RELIANCE", "TCS", "HDFCBANK"], topLosers: ["INFY", "ITC"], trending: ["ICICIBANK", "SBIN"],
    aiSummary: "India continues its structural bull run supported by strong domestic liquidity.",
    news: ["FDI inflows surge", "Retail participation hits new peak"]
  },
  { 
    code: "ASX", name: "Australia", city: "Sydney", index: "ASX 200", lat: -33.8688, lng: 151.2093, 
    value: 7854.1, change: -0.12, confidence: 70, sentiment: "Neutral", volume: "620M",
    overview: "Commodity price fluctuations leave the ASX flat.",
    topGainers: ["BHP", "CSL"], topLosers: ["CBA", "WBC"], trending: ["MQG", "WOW"],
    aiSummary: "Australian markets are tethered by mixed signals in global resource demand.",
    news: ["Iron ore prices dip", "Financial sector regulatory review"]
  },
  { 
    code: "TSX", name: "Canada", city: "Toronto", index: "TSX Composite", lat: 43.6510, lng: -79.3470, 
    value: 23145.2, change: 0.88, confidence: 85, sentiment: "Bullish", volume: "580M",
    overview: "Energy and banking sectors push Toronto higher.",
    topGainers: ["RY", "TD", "ENB"], topLosers: ["SHOP", "CNQ"], trending: ["BNS", "BMO"],
    aiSummary: "Canadian markets benefit from stabilized oil prices and strong banking fundamentals.",
    news: ["Energy sector rallies", "Bank earnings beat estimates"]
  },
  { 
    code: "PAR", name: "France", city: "Paris", index: "CAC 40", lat: 48.8566, lng: 2.3522, 
    value: 7921.3, change: 0.45, confidence: 77, sentiment: "Neutral", volume: "750M",
    overview: "Luxury brands offset industrial weakness.",
    topGainers: ["MC", "OR", "RMS"], topLosers: ["TTE", "SAN"], trending: ["AIR", "BNP"],
    aiSummary: "Paris remains stable as luxury sector resilience counterbalances macroeconomic fears.",
    news: ["LVMH reports strong Asia sales", "TotalEnergies updates guidance"]
  },
  { 
    code: "B3", name: "Brazil", city: "Sao Paulo", index: "Bovespa", lat: -23.5505, lng: -46.6333, 
    value: 125432.1, change: -1.45, confidence: 60, sentiment: "Bearish", volume: "1.1B",
    overview: "Fiscal policy concerns trigger a broad selloff.",
    topGainers: ["PETR4", "VALE3"], topLosers: ["ITUB4", "BBDC4"], trending: ["ABEV3", "BBAS3"],
    aiSummary: "Latin American hubs face pressure from rising domestic rates and political uncertainty.",
    news: ["Central bank signals tightening", "Commodity exports slow"]
  },
  { 
    code: "KRX", name: "South Korea", city: "Seoul", index: "KOSPI", lat: 37.5665, lng: 126.9780, 
    value: 2785.4, change: -0.21, confidence: 68, sentiment: "Neutral", volume: "890M",
    overview: "Tech supply chain worries constrain gains.",
    topGainers: ["005930", "000660"], topLosers: ["051910", "005380"], trending: ["035420", "035720"],
    aiSummary: "Seoul markets trade sideways as investors digest global tech demand outlook.",
    news: ["Memory chip prices stabilize", "Auto exports face headwinds"]
  }
];

export const ARC_PAIRS: Array<[string, string]> = [
  ["NYSE", "LSE"],
  ["NASDAQ", "LSE"],
  ["NYSE", "TSE"],
  ["NYSE", "TSX"],
  ["LSE", "FRA"],
  ["FRA", "PAR"],
  ["FRA", "SGX"],
  ["SGX", "BSE"],
  ["BSE", "SGX"],
  ["SGX", "ASX"],
  ["ASX", "TSE"],
  ["SGX", "TSE"],
  ["TSE", "KRX"],
  ["TSE", "SSE"],
  ["SSE", "HKEX"],
  ["SSE", "SGX"],
  ["NYSE", "B3"]
];
