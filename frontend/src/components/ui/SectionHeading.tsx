import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <div className={cn("inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground", align === "center" && "mx-auto")}>
          <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--primary)] animate-pulse-glow" />
          {eyebrow}
        </div>
      )}
      <h2 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
        {title}
      </h2>
      {description && <p className="mt-5 text-base text-muted-foreground md:text-lg">{description}</p>}
    </div>
  );
}
