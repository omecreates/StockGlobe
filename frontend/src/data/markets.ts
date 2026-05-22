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
  sentiment: "Bullish" | "Bearish" | "Neutral";
};

export const MARKETS: Market[] = [
  { code: "USA", name: "United States", city: "New York", index: "S&P 500", lat: 40.7128, lng: -74.006, value: 5847.21, change: 1.24, confidence: 92, sentiment: "Bullish" },
  { code: "IND", name: "India", city: "Mumbai", index: "NIFTY 50", lat: 19.076, lng: 72.8777, value: 24932.5, change: 0.87, confidence: 88, sentiment: "Bullish" },
  { code: "JPN", name: "Japan", city: "Tokyo", index: "Nikkei 225", lat: 35.6762, lng: 139.6503, value: 38765.4, change: -0.42, confidence: 71, sentiment: "Neutral" },
  { code: "CHN", name: "China", city: "Shanghai", index: "SSE Composite", lat: 31.2304, lng: 121.4737, value: 3247.8, change: -1.18, confidence: 64, sentiment: "Bearish" },
  { code: "GBR", name: "United Kingdom", city: "London", index: "FTSE 100", lat: 51.5074, lng: -0.1278, value: 8214.3, change: 0.31, confidence: 79, sentiment: "Neutral" },
  { code: "DEU", name: "Germany", city: "Frankfurt", index: "DAX 40", lat: 50.1109, lng: 8.6821, value: 19478.6, change: 0.92, confidence: 84, sentiment: "Bullish" },
  { code: "ARE", name: "UAE", city: "Dubai", index: "DFM General", lat: 25.2048, lng: 55.2708, value: 4621.7, change: 1.56, confidence: 81, sentiment: "Bullish" },
  { code: "SGP", name: "Singapore", city: "Singapore", index: "STI", lat: 1.3521, lng: 103.8198, value: 3712.4, change: 0.58, confidence: 86, sentiment: "Bullish" },
];

export const ARC_PAIRS: Array<[string, string]> = [
  ["USA", "GBR"],
  ["USA", "JPN"],
  ["GBR", "DEU"],
  ["DEU", "ARE"],
  ["ARE", "IND"],
  ["IND", "SGP"],
  ["SGP", "JPN"],
  ["JPN", "CHN"],
  ["CHN", "SGP"],
];
