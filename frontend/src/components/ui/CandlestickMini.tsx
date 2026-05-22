import { CANDLES } from "@/data/chartData";

export function CandlestickMini({ width = 220, height = 70 }: { width?: number; height?: number }) {
  const min = Math.min(...CANDLES.map((c) => c.l));
  const max = Math.max(...CANDLES.map((c) => c.h));
  const range = max - min || 1;
  const cw = width / CANDLES.length;
  const y = (v: number) => height - ((v - min) / range) * height;
  return (
    <svg width={width} height={height} className="overflow-visible">
      {CANDLES.map((c, i) => {
        const x = i * cw + cw / 2;
        const color = c.up ? "oklch(0.78 0.2 155)" : "oklch(0.68 0.24 25)";
        return (
          <g key={i} style={{ filter: `drop-shadow(0 0 3px ${color})` }}>
            <line x1={x} x2={x} y1={y(c.h)} y2={y(c.l)} stroke={color} strokeWidth={1} opacity={0.7} />
            <rect
              x={x - cw * 0.32}
              y={y(Math.max(c.o, c.c))}
              width={cw * 0.64}
              height={Math.max(1.5, Math.abs(y(c.o) - y(c.c)))}
              fill={color}
              rx={1}
            />
          </g>
        );
      })}
    </svg>
  );
}
