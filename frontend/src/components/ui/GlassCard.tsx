import { cn } from "@/lib/utils";
import { forwardRef, type HTMLAttributes } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: "none" | "primary" | "accent";
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, glow = "none", children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "glass relative rounded-2xl p-6 overflow-hidden",
        glow === "primary" && "glow-primary",
        glow === "accent" && "glow-accent",
        className,
      )}
      {...props}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-60"
        style={{
          background:
            "radial-gradient(120% 60% at 0% 0%, oklch(0.82 0.17 200 / 12%), transparent 50%), radial-gradient(120% 60% at 100% 100%, oklch(0.62 0.24 295 / 14%), transparent 50%)",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  ),
);
GlassCard.displayName = "GlassCard";
