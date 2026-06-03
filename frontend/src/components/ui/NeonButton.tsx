import { cn } from "@/lib/utils";
import { forwardRef, type ButtonHTMLAttributes } from "react";

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
}

export const NeonButton = forwardRef<HTMLButtonElement, NeonButtonProps>(
  ({ className, variant = "primary", children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:pointer-events-none",
        variant === "primary"
          ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
          : "bg-transparent border border-border text-foreground hover:bg-secondary",
        className,
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  ),
);
NeonButton.displayName = "NeonButton";
