import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/store/appStore";

const SECTION_IDS = ["top", "globe", "predictions", "analytics", "portfolio", "sentiment"];

const LINKS = [
  { label: "Intelligence", id: "globe" },
  { label: "Predictions",  id: "predictions" },
  { label: "Analytics",    id: "analytics" },
  { label: "Portfolio",    id: "portfolio" },
  { label: "Sentiment",    id: "sentiment" },
];

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? "");
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const io = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { rootMargin: "-40% 0px -55% 0px" },
      );
      io.observe(el);
      observers.push(io);
    });
    return () => observers.forEach((io) => io.disconnect());
  }, [ids]);
  return active;
}

export function FloatingNav() {
  const { state, openRequestAccess, openAuth, logout, addToast } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeSection = useActiveSection(SECTION_IDS);

  const scrollTo = useCallback((id: string) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleLogout() {
    logout();
    addToast({ type: "info", title: "Signed out", message: "See you next time." });
  }

  const { user } = state;

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed left-1/2 top-4 z-50 w-[min(1180px,calc(100%-2rem))] -translate-x-1/2"
    >
      <div className={cn(
        "flex items-center justify-between rounded-full px-3 py-2 transition-all duration-500",
        scrolled ? "glass-strong shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)]" : "glass",
      )}>
        {/* Logo */}
        <button onClick={() => scrollTo("top")} className="group flex items-center gap-2 pl-2">
          <span className="relative flex h-7 w-7 items-center justify-center">
            <span className="absolute inset-0 rounded-md opacity-90 animate-aurora" style={{ background: "var(--gradient-aurora)" }} />
            <span className="absolute inset-[2px] rounded-[4px] bg-background" />
            <span className="relative font-display text-[11px] font-bold text-gradient">N</span>
          </span>
          <span className="font-display text-sm font-semibold tracking-[0.2em]">PREDICTAFI</span>
        </button>

        {/* Desktop nav links */}
        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              className={cn(
                "relative rounded-full px-3 py-1.5 text-xs transition-colors",
                activeSection === l.id
                  ? "text-foreground"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
              )}
            >
              {l.label}
              {activeSection === l.id && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-full bg-white/8"
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
            </button>
          ))}
        </nav>

        {/* Right side buttons */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 font-semibold text-[10px] uppercase">
                  {user.name?.[0] ?? user.email[0]}
                </div>
                <span>{user.name ?? user.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <LogOut className="h-3 w-3" />Sign out
              </button>
            </>
          ) : (
            <button
              onClick={() => openAuth("login")}
              className="hidden md:flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogIn className="h-3 w-3" />Sign in
            </button>
          )}

          <button
            onClick={openRequestAccess}
            className="relative inline-flex items-center gap-2 overflow-hidden rounded-full px-4 py-1.5 text-xs font-medium text-background"
          >
            <span aria-hidden className="absolute inset-0 animate-aurora" style={{ background: "var(--gradient-aurora)" }} />
            <span className="relative">Request Access</span>
          </button>

          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-muted-foreground md:hidden"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="mt-2 glass-strong rounded-2xl overflow-hidden md:hidden"
          >
            {LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className={cn(
                  "flex w-full items-center px-5 py-3.5 text-sm text-left transition-colors",
                  activeSection === l.id ? "text-foreground bg-white/5" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {l.label}
              </button>
            ))}
            <div className="border-t border-white/5 px-5 py-3 flex gap-2">
              <button
                onClick={() => { setMobileOpen(false); openAuth("login"); }}
                className="flex-1 rounded-full border border-white/10 bg-white/5 py-2 text-xs text-muted-foreground"
              >
                Sign in
              </button>
              <button
                onClick={() => { setMobileOpen(false); openRequestAccess(); }}
                className="relative flex-1 overflow-hidden rounded-full py-2 text-xs font-medium text-background"
              >
                <span aria-hidden className="absolute inset-0 animate-aurora" style={{ background: "var(--gradient-aurora)" }} />
                <span className="relative">Request Access</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
