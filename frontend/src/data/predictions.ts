export type Prediction = {
  ticker: string;
  name: string;
  direction: "BUY" | "SELL" | "HOLD";
  target: number;
  current: number;
  confidence: number;
  horizon: string;
  reason: string;
};

export const PREDICTIONS: Prediction[] = [
  { ticker: "NVDA", name: "NVIDIA Corp", direction: "BUY", target: 168.4, current: 142.3, confidence: 94, horizon: "30D", reason: "AI infrastructure demand accelerating; supply constraints easing." },
  { ticker: "TSLA", name: "Tesla Inc", direction: "HOLD", target: 252.1, current: 248.7, confidence: 68, horizon: "30D", reason: "Robotaxi narrative balanced against margin compression." },
  { ticker: "AAPL", name: "Apple Inc", direction: "BUY", target: 245.8, current: 228.5, confidence: 87, horizon: "60D", reason: "Vision Pro 2 cycle + services growth re-acceleration." },
  { ticker: "META", name: "Meta Platforms", direction: "BUY", target: 612.5, current: 564.2, confidence: 91, horizon: "45D", reason: "Ad pricing strength; AI-assisted creative scaling." },
  { ticker: "AMZN", name: "Amazon.com", direction: "BUY", target: 232.7, current: 211.4, confidence: 85, horizon: "60D", reason: "AWS reacceleration and retail margin expansion." },
  { ticker: "BABA", name: "Alibaba Group", direction: "SELL", target: 78.2, current: 91.6, confidence: 73, horizon: "30D", reason: "Macro headwinds and regulatory overhang persist." },
  { ticker: "MSFT", name: "Microsoft Corp", direction: "BUY", target: 465.0, current: 415.3, confidence: 89, horizon: "60D", reason: "Azure AI growth outperforming consensus estimates." },
  { ticker: "GOOGL", name: "Alphabet Inc", direction: "HOLD", target: 175.5, current: 168.2, confidence: 65, horizon: "45D", reason: "Search dominance intact but increasing GenAI competition risks." },
  { ticker: "AMD", name: "Advanced Micro Devices", direction: "BUY", target: 185.0, current: 155.8, confidence: 82, horizon: "60D", reason: "MI300x market share gains in enterprise data centers." },
  { ticker: "JPM", name: "JPMorgan Chase", direction: "BUY", target: 230.5, current: 212.1, confidence: 78, horizon: "90D", reason: "Net interest income resilience and strong investment banking fees." },
  { ticker: "NFLX", name: "Netflix Inc", direction: "HOLD", target: 720.0, current: 698.5, confidence: 62, horizon: "30D", reason: "Subscriber growth pricing in; valuation fully stretched." },
  { ticker: "DIS", name: "Walt Disney Co", direction: "BUY", target: 115.0, current: 98.4, confidence: 75, horizon: "90D", reason: "Streaming profitability inflection and parks margin recovery." },
  { ticker: "V", name: "Visa Inc", direction: "BUY", target: 310.0, current: 285.6, confidence: 84, horizon: "60D", reason: "Cross-border volume recovery and secular shift to digital payments." },
  { ticker: "INTC", name: "Intel Corp", direction: "SELL", target: 24.5, current: 31.2, confidence: 81, horizon: "30D", reason: "Foundry struggles and sustained loss of data center market share." },
  { ticker: "CRM", name: "Salesforce Inc", direction: "BUY", target: 325.0, current: 289.4, confidence: 79, horizon: "45D", reason: "Data Cloud adoption and margin expansion initiatives succeeding." },
  { ticker: "BAC", name: "Bank of America", direction: "HOLD", target: 42.5, current: 40.1, confidence: 58, horizon: "60D", reason: "Deposit cost pressures balancing out loan growth." },
  { ticker: "XOM", name: "Exxon Mobil Corp", direction: "BUY", target: 135.0, current: 118.5, confidence: 76, horizon: "90D", reason: "Pioneer acquisition synergies and sustained capital returns." },
  { ticker: "NKE", name: "NIKE Inc", direction: "SELL", target: 68.0, current: 82.5, confidence: 72, horizon: "60D", reason: "Inventory gluts and increasing competition in lifestyle segments." },
  { ticker: "UBER", name: "Uber Technologies", direction: "BUY", target: 95.0, current: 78.4, confidence: 83, horizon: "45D", reason: "Mobility frequency growth and robust delivery margins." },
  { ticker: "SNOW", name: "Snowflake Inc", direction: "HOLD", target: 145.0, current: 138.2, confidence: 64, horizon: "30D", reason: "Optimization headwinds stabilizing but valuation remains premium." }
];
