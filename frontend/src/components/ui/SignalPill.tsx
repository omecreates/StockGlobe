import { cn } from "@/lib/utils";

export function SignalPill({ signal, className }: { signal: "BUY" | "SELL" | "HOLD"; className?: string }) {
  const color =
    signal === "BUY"
      ? "text-[color:var(--signal-buy)] border-[color:var(--signal-buy)]/40 bg-[color:var(--signal-buy)]/10"
      : signal === "SELL"
        ? "text-[color:var(--signal-sell)] border-[color:var(--signal-sell)]/40 bg-[color:var(--signal-sell)]/10"
        : "text-[color:var(--signal-hold)] border-[color:var(--signal-hold)]/40 bg-[color:var(--signal-hold)]/10";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em]",
        color,
        className,
      )}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inset-0 rounded-full bg-current opacity-60 animate-pulse-glow" />
        <span className="relative h-1.5 w-1.5 rounded-full bg-current" />
      </span>
      {signal}
    </span>
  );
}
