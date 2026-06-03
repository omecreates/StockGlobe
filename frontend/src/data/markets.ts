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
  { code: "FRA", name: "France", city: "Paris", index: "CAC 40", lat: 48.8566, lng: 2.3522, value: 7921.3, change: 0.45, confidence: 77, sentiment: "Neutral" },
  { code: "CAN", name: "Canada", city: "Toronto", index: "TSX", lat: 43.6510, lng: -79.3470, value: 23145.2, change: 0.88, confidence: 85, sentiment: "Bullish" },
  { code: "AUS", name: "Australia", city: "Sydney", index: "ASX 200", lat: -33.8688, lng: 151.2093, value: 7854.1, change: 0.12, confidence: 70, sentiment: "Neutral" },
  { code: "KOR", name: "South Korea", city: "Seoul", index: "KOSPI", lat: 37.5665, lng: 126.9780, value: 2785.4, change: -0.21, confidence: 68, sentiment: "Neutral" },
  { code: "BRA", name: "Brazil", city: "Sao Paulo", index: "Bovespa", lat: -23.5505, lng: -46.6333, value: 125432.1, change: -1.45, confidence: 60, sentiment: "Bearish" },
  { code: "ZAF", name: "South Africa", city: "Johannesburg", index: "JSE", lat: -26.2041, lng: 28.0473, value: 75432.8, change: 0.65, confidence: 74, sentiment: "Bullish" },
  { code: "CHE", name: "Switzerland", city: "Zurich", index: "SMI", lat: 47.3769, lng: 8.5417, value: 11432.9, change: 0.28, confidence: 82, sentiment: "Bullish" },
  { code: "HKG", name: "Hong Kong", city: "Hong Kong", index: "Hang Seng", lat: 22.3193, lng: 114.1694, value: 18452.3, change: -0.85, confidence: 66, sentiment: "Bearish" },
  { code: "ITA", name: "Italy", city: "Milan", index: "FTSE MIB", lat: 45.4642, lng: 9.1900, value: 34521.8, change: 0.55, confidence: 78, sentiment: "Neutral" },
  { code: "ESP", name: "Spain", city: "Madrid", index: "IBEX 35", lat: 40.4168, lng: -3.7038, value: 11245.6, change: 0.34, confidence: 76, sentiment: "Neutral" },
  { code: "NLD", name: "Netherlands", city: "Amsterdam", index: "AEX", lat: 52.3676, lng: 4.9041, value: 924.5, change: 0.72, confidence: 83, sentiment: "Bullish" },
  { code: "SWE", name: "Sweden", city: "Stockholm", index: "OMX 30", lat: 59.3293, lng: 18.0686, value: 2543.7, change: 0.41, confidence: 75, sentiment: "Neutral" }
];

export const ARC_PAIRS: Array<[string, string]> = [
  ["USA", "GBR"],
  ["USA", "JPN"],
  ["USA", "CAN"],
  ["GBR", "DEU"],
  ["DEU", "FRA"],
  ["FRA", "CHE"],
  ["CHE", "ITA"],
  ["DEU", "ARE"],
  ["ARE", "IND"],
  ["IND", "SGP"],
  ["SGP", "AUS"],
  ["AUS", "JPN"],
  ["SGP", "JPN"],
  ["JPN", "KOR"],
  ["JPN", "CHN"],
  ["CHN", "HKG"],
  ["CHN", "SGP"],
  ["USA", "BRA"],
  ["GBR", "ZAF"]
];
