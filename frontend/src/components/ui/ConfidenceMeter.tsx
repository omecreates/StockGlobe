export function ConfidenceMeter({ value, size = 88 }: { value: number; size?: number }) {
  const stroke = 6;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (value / 100) * c;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={`cm-${size}`} x1="0" x2="1">
            <stop offset="0%" stopColor="oklch(0.82 0.17 200)" />
            <stop offset="60%" stopColor="oklch(0.62 0.24 295)" />
            <stop offset="100%" stopColor="oklch(0.7 0.28 340)" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="oklch(1 0 0 / 8%)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={`url(#cm-${size})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${dash} ${c}`}
          style={{ filter: "drop-shadow(0 0 6px oklch(0.82 0.17 200 / 0.6))", transition: "stroke-dasharray 1s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-lg font-semibold">{value}</span>
        <span className="text-[9px] uppercase tracking-widest text-muted-foreground">conf</span>
      </div>
    </div>
  );
}
