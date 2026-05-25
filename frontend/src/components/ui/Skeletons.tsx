// src/components/ui/Skeletons.tsx
import { cn } from "@/lib/utils";

function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl bg-white/5",
        className,
      )}
    >
      <div
        className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite]"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(1 0 0 / 6%), transparent)",
        }}
      />
    </div>
  );
}

// Add shimmer keyframe to global styles (injected once)
if (typeof document !== "undefined") {
  const id = "predictafi-shimmer-style";
  if (!document.getElementById(id)) {
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `@keyframes shimmer { to { transform: translateX(200%); } }`;
    document.head.appendChild(style);
  }
}

export function PredictionCardSkeleton() {
  return (
    <div className="glass relative rounded-2xl p-6 overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Shimmer className="h-6 w-16" />
          <Shimmer className="h-3 w-24" />
        </div>
        <Shimmer className="h-6 w-14 rounded-full" />
      </div>
      <div className="mt-6 flex items-center justify-between">
        <div className="space-y-2">
          <Shimmer className="h-3 w-20" />
          <Shimmer className="h-8 w-28" />
          <Shimmer className="h-3 w-32" />
        </div>
        <Shimmer className="h-[88px] w-[88px] rounded-full" />
      </div>
      <div className="mt-5 border-t border-white/5 pt-4 space-y-1.5">
        <Shimmer className="h-3 w-full" />
        <Shimmer className="h-3 w-4/5" />
      </div>
    </div>
  );
}

export function MarketRowSkeleton() {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <Shimmer className="h-3 w-20" />
          <Shimmer className="h-4 w-28" />
        </div>
        <Shimmer className="h-5 w-12" />
      </div>
      <Shimmer className="mt-3 h-1 w-full rounded-full" />
      <div className="mt-2 flex justify-between">
        <Shimmer className="h-3 w-16" />
        <Shimmer className="h-3 w-12" />
      </div>
    </div>
  );
}

export function NewsCardSkeleton() {
  return (
    <div className="glass rounded-2xl p-5 space-y-3">
      <div className="flex justify-between">
        <Shimmer className="h-3 w-16" />
        <Shimmer className="h-3 w-10" />
      </div>
      <Shimmer className="h-5 w-full" />
      <Shimmer className="h-4 w-3/4" />
      <Shimmer className="h-1.5 w-full rounded-full" />
      <Shimmer className="h-12 w-full rounded-xl" />
      <div className="flex gap-1.5">
        <Shimmer className="h-5 w-12 rounded-md" />
        <Shimmer className="h-5 w-14 rounded-md" />
      </div>
    </div>
  );
}

export function ChartSkeleton({ height = 300 }: { height?: number }) {
  return (
    <div className="relative" style={{ height }}>
      <Shimmer className="h-full w-full rounded-xl" />
      {/* Fake chart bars hint */}
      <div className="absolute bottom-4 inset-x-4 flex items-end gap-1 opacity-30">
        {Array.from({ length: 30 }, (_, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm bg-white/20"
            style={{ height: `${20 + Math.sin(i * 0.5) * 40 + Math.random() * 20}%` }}
          />
        ))}
      </div>
    </div>
  );
}
