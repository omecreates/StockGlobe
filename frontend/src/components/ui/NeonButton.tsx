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
        "group relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-all duration-300 cursor-pointer",
        variant === "primary"
          ? "text-background"
          : "text-foreground border border-white/15 hover:border-white/30 bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur",
        className,
      )}
      {...props}
    >
      {variant === "primary" && (
        <>
          <span
            aria-hidden
            className="absolute inset-0 rounded-full opacity-100 transition-opacity duration-300 animate-aurora"
            style={{ background: "var(--gradient-aurora)" }}
          />
          <span
            aria-hidden
            className="absolute -inset-px rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"
            style={{ background: "var(--gradient-aurora)" }}
          />
        </>
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  ),
);
NeonButton.displayName = "NeonButton";
