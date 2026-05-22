import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Intelligence", href: "#globe" },
  { label: "Predictions", href: "#predictions" },
  { label: "Analytics", href: "#analytics" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Sentiment", href: "#sentiment" },
];

export function FloatingNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed left-1/2 top-4 z-50 w-[min(1180px,calc(100%-2rem))] -translate-x-1/2"
    >
      <div
        className={cn(
          "flex items-center justify-between rounded-full px-3 py-2 transition-all duration-500",
          scrolled ? "glass-strong shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)]" : "glass",
        )}
      >
        <a href="#top" className="group flex items-center gap-2 pl-2">
          <span className="relative flex h-7 w-7 items-center justify-center">
            <span className="absolute inset-0 rounded-md bg-[var(--gradient-aurora)] opacity-90 animate-aurora" style={{ background: "var(--gradient-aurora)" }} />
            <span className="absolute inset-[2px] rounded-[4px] bg-background" />
            <span className="relative font-display text-[11px] font-bold text-gradient">N</span>
          </span>
          <span className="font-display text-sm font-semibold tracking-[0.2em]">NEURALYX</span>
        </a>
        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href="#cta"
          className="relative inline-flex items-center gap-2 overflow-hidden rounded-full px-4 py-1.5 text-xs font-medium text-background"
        >
          <span aria-hidden className="absolute inset-0 animate-aurora" style={{ background: "var(--gradient-aurora)" }} />
          <span className="relative">Request Access</span>
        </a>
      </div>
    </motion.header>
  );
}
