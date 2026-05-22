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
];
