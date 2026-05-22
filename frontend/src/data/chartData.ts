export const PRICE_SERIES = Array.from({ length: 60 }, (_, i) => {
  const t = i / 59;
  const base = 100 + Math.sin(i / 4) * 8 + i * 1.2;
  const noise = Math.sin(i * 1.7) * 3 + Math.cos(i * 0.6) * 2;
  return {
    t: i,
    label: `T-${60 - i}`,
    price: +(base + noise).toFixed(2),
    predicted: +(base + noise + 4 + t * 6).toFixed(2),
    volume: Math.round(40 + Math.abs(Math.sin(i / 3)) * 60),
  };
});

export const ALLOCATION = [
  { name: "Equities", value: 48, color: "oklch(0.82 0.17 200)" },
  { name: "AI / Tech", value: 22, color: "oklch(0.62 0.24 295)" },
  { name: "Bonds", value: 14, color: "oklch(0.7 0.28 340)" },
  { name: "Commodities", value: 9, color: "oklch(0.78 0.2 155)" },
  { name: "Cash", value: 7, color: "oklch(0.82 0.16 90)" },
];

export const CANDLES = Array.from({ length: 24 }, (_, i) => {
  const o = 100 + Math.sin(i / 2) * 10 + i * 0.6;
  const c = o + (Math.random() - 0.45) * 6;
  const h = Math.max(o, c) + Math.random() * 3;
  const l = Math.min(o, c) - Math.random() * 3;
  return { i, o, c, h, l, up: c >= o };
});
