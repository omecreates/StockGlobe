/* eslint-disable prettier/prettier */
export type MarketMover = {
  id: string;
  ticker: string;
  name: string;
  price: number;
  changePct: number;
  signal: "BUY" | "SELL" | "HOLD";
  confidence: number;
  sentimentScore: number;
  sector: "Technology" | "AI" | "Finance" | "Healthcare" | "Energy" | "Consumer" | "Industrial";
  marketCap: string;
  reason: string;
  sparkline: number[];
};

const SECTORS = ["Technology", "AI", "Finance", "Healthcare", "Energy", "Consumer", "Industrial"] as const;
const SIGNALS = ["BUY", "SELL", "HOLD"] as const;

function generateSparkline(startPrice: number, change: number): number[] {
  const points = 20;
  let current = startPrice - change;
  const step = change / points;
  const line = [];
  for (let i = 0; i < points; i++) {
    // Add some random noise
    current += step + (Math.random() - 0.5) * (Math.abs(change) * 0.2);
    line.push(current);
  }
  line.push(startPrice);
  return line;
}

function generateMockData(): MarketMover[] {
  const stocks = [
    { t: "NVDA", n: "NVIDIA Corp.", s: "AI" },
    { t: "AAPL", n: "Apple Inc.", s: "Technology" },
    { t: "MSFT", n: "Microsoft Corp.", s: "Technology" },
    { t: "GOOGL", n: "Alphabet Inc.", s: "Technology" },
    { t: "AMZN", n: "Amazon.com Inc.", s: "Consumer" },
    { t: "META", n: "Meta Platforms", s: "Technology" },
    { t: "TSLA", n: "Tesla Inc.", s: "Consumer" },
    { t: "BRK.B", n: "Berkshire Hathaway", s: "Finance" },
    { t: "LLY", n: "Eli Lilly", s: "Healthcare" },
    { t: "V", n: "Visa Inc.", s: "Finance" },
    { t: "XOM", n: "Exxon Mobil", s: "Energy" },
    { t: "JPM", n: "JPMorgan Chase", s: "Finance" },
    { t: "UNH", n: "UnitedHealth Group", s: "Healthcare" },
    { t: "MA", n: "Mastercard Inc.", s: "Finance" },
    { t: "PG", n: "Procter & Gamble", s: "Consumer" },
    { t: "JNJ", n: "Johnson & Johnson", s: "Healthcare" },
    { t: "HD", n: "Home Depot", s: "Consumer" },
    { t: "MRK", n: "Merck & Co.", s: "Healthcare" },
    { t: "CVX", n: "Chevron Corp.", s: "Energy" },
    { t: "ABBV", n: "AbbVie Inc.", s: "Healthcare" },
    { t: "COST", n: "Costco Wholesale", s: "Consumer" },
    { t: "PEP", n: "PepsiCo Inc.", s: "Consumer" },
    { t: "KO", n: "Coca-Cola Co.", s: "Consumer" },
    { t: "AVGO", n: "Broadcom Inc.", s: "Technology" },
    { t: "WMT", n: "Walmart Inc.", s: "Consumer" },
    { t: "MCD", n: "McDonald's Corp.", s: "Consumer" },
    { t: "TMO", n: "Thermo Fisher", s: "Healthcare" },
    { t: "CSCO", n: "Cisco Systems", s: "Technology" },
    { t: "ABT", n: "Abbott Laboratories", s: "Healthcare" },
    { t: "CRM", n: "Salesforce Inc.", s: "Technology" },
    { t: "INTC", n: "Intel Corp.", s: "Technology" },
    { t: "AMD", n: "Advanced Micro Devices", s: "AI" },
    { t: "QCOM", n: "Qualcomm Inc.", s: "Technology" },
    { t: "TXN", n: "Texas Instruments", s: "Technology" },
    { t: "IBM", n: "IBM Corp.", s: "Technology" },
    { t: "NFLX", n: "Netflix Inc.", s: "Technology" },
    { t: "DIS", n: "Walt Disney Co.", s: "Consumer" },
    { t: "PFE", n: "Pfizer Inc.", s: "Healthcare" },
    { t: "NKE", n: "NIKE Inc.", s: "Consumer" },
    { t: "BA", n: "Boeing Co.", s: "Industrial" },
    { t: "CAT", n: "Caterpillar Inc.", s: "Industrial" },
    { t: "HON", n: "Honeywell Intl.", s: "Industrial" },
    { t: "GE", n: "General Electric", s: "Industrial" },
    { t: "MMM", n: "3M Company", s: "Industrial" },
    { t: "RTX", n: "Raytheon Tech.", s: "Industrial" },
    { t: "LMT", n: "Lockheed Martin", s: "Industrial" },
    { t: "DE", n: "Deere & Company", s: "Industrial" },
    { t: "C", n: "Citigroup Inc.", s: "Finance" },
    { t: "BAC", n: "Bank of America", s: "Finance" },
    { t: "WFC", n: "Wells Fargo", s: "Finance" },
    { t: "GS", n: "Goldman Sachs", s: "Finance" },
    { t: "MS", n: "Morgan Stanley", s: "Finance" },
  ];

  return stocks.map((stock, i) => {
    const basePrice = 50 + Math.random() * 400;
    const isGain = Math.random() > 0.4;
    const changePct = isGain ? Math.random() * 8 : -Math.random() * 8;
    const changeAmt = basePrice * (changePct / 100);
    const confidence = 60 + Math.floor(Math.random() * 38);
    const sentimentScore = 30 + Math.floor(Math.random() * 65);
    const capValue = 10 + Math.floor(Math.random() * 2000);
    const marketCap = capValue > 1000 ? `$${(capValue / 1000).toFixed(1)}T` : `$${capValue}B`;
    
    let signal: "BUY" | "SELL" | "HOLD";
    if (confidence > 80 && changePct > 0) signal = "BUY";
    else if (confidence > 80 && changePct < -2) signal = "SELL";
    else signal = "HOLD";

    return {
      id: stock.t,
      ticker: stock.t,
      name: stock.n,
      price: basePrice,
      changePct: changePct,
      signal: signal,
      confidence: confidence,
      sentimentScore: sentimentScore,
      sector: stock.s as any,
      marketCap: marketCap,
      reason: `${stock.n} is trending due to ${isGain ? 'positive earnings sentiment and institutional inflows' : 'recent macroeconomic pressures and sector rotation'} in the ${stock.s} space.`,
      sparkline: generateSparkline(basePrice, changeAmt)
    };
  });
}

export const mockMarketMovers = generateMockData();
