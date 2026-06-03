import { cn } from "@/lib/utils";

export function SignalPill({ signal, className }: { signal: "BUY" | "SELL" | "HOLD"; className?: string }) {
  const color =
    signal === "BUY"
      ? "text-[color:var(--signal-buy)] border-[color:var(--signal-buy)]/30 bg-[color:var(--signal-buy)]/10"
      : signal === "SELL"
        ? "text-[color:var(--signal-sell)] border-[color:var(--signal-sell)]/30 bg-[color:var(--signal-sell)]/10"
        : "text-[color:var(--signal-hold)] border-[color:var(--signal-hold)]/30 bg-[color:var(--signal-hold)]/10";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[10px] font-medium tracking-wide",
        color,
        className,
      )}
    >
      {signal}
    </span>
  );
}
