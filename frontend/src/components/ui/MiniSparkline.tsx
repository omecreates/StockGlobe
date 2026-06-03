import { useMemo } from "react";

interface MiniSparklineProps {
  change: number;
  width?: number;
  height?: number;
}

export function MiniSparkline({ change, width = 60, height = 24 }: MiniSparklineProps) {
  // Procedurally generate a realistic-looking sparkline based on the change.
  // If change > 0, the trend is generally upward. If < 0, downward.
  const points = useMemo(() => {
    const pts: [number, number][] = [];
    const steps = 12;
    let currentY = change > 0 ? height * 0.8 : height * 0.2;
    pts.push([0, currentY]);

    for (let i = 1; i <= steps; i++) {
      const x = (i / steps) * width;
      // Random walk biased by the change direction
      const stepChange = (Math.random() - 0.5) * (height * 0.4);
      const bias = change > 0 ? -(height * 0.1) : (height * 0.1); 
      currentY = Math.max(0, Math.min(height, currentY + stepChange + bias));
      
      // Ensure the final point respects the overall change direction visually
      if (i === steps) {
        currentY = change > 0 ? height * 0.1 : height * 0.9;
      }
      
      pts.push([x, currentY]);
    }
    return pts;
  }, [change, width, height]);

  const pathD = points
    .map((p, i) => (i === 0 ? `M ${p[0]},${p[1]}` : `L ${p[0]},${p[1]}`))
    .join(" ");

  const color = change >= 0 ? "var(--signal-buy)" : "var(--signal-sell)";

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`spark-grad-${change >= 0 ? "buy" : "sell"}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.2} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path
        d={`${pathD} L ${width},${height} L 0,${height} Z`}
        fill={`url(#spark-grad-${change >= 0 ? "buy" : "sell"})`}
        stroke="none"
      />
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
