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
        "relative rounded-xl border border-border bg-card p-6 overflow-hidden shadow-sm transition-colors",
        className,
      )}
      {...props}
    >
      <div className="relative">{children}</div>
    </div>
  ),
);
GlassCard.displayName = "GlassCard";
