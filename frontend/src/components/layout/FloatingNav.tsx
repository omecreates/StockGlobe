/* eslint-disable prettier/prettier */
// src/components/layout/FloatingNav.tsx
// ─────────────────────────────────────────────────────────────────────────────
// REPLACES the existing FloatingNav.tsx entirely.
// What's new vs original:
//   • Active section highlight (underline follows scroll position)
//   • Smooth scroll on nav link click (works with Lenis)
//   • "Request Access" button opens the modal (not a bare href="#cta")
//   • Login button appears when user is not authenticated
//   • User avatar + logout when authenticated
//   • Mobile hamburger menu (hidden on md+)
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/store/appStore";
import { useActiveSection, useScrollTo } from "@/hooks/useApi";
import { authApi } from "@/lib/apiClient";

const SECTION_IDS = ["top", "globe", "predictions", "analytics", "movers", "portfolio", "sentiment"];

const LINKS = [
  { label: "Intelligence", id: "globe" },
  { label: "Predictions", id: "predictions" },
  { label: "Analytics",   id: "analytics" },
  { label: "Market Movers", id: "movers" },
  { label: "Portfolio",   id: "portfolio" },
  { label: "Sentiment",   id: "sentiment" },
];

export function FloatingNav() {
  const { state, openRequestAccess, openAuth, logout, addToast } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeSection = useActiveSection(SECTION_IDS);
  const scrollTo = useScrollTo();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleNavClick(id: string) {
    setMobileOpen(false);
    scrollTo(id);
  }

  function handleLogout() {
    authApi.logout();
    logout();
    addToast({ type: "info", title: "Signed out", message: "See you next time." });
  }

  const { user } = state;

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed left-1/2 top-4 z-50 w-[min(1180px,calc(100%-2rem))] -translate-x-1/2"
      >
        <div
          className={cn(
            "flex items-center justify-between rounded-lg px-4 py-2 transition-all duration-300 border",
            scrolled ? "bg-card/80 backdrop-blur-md shadow-sm border-border" : "bg-transparent border-transparent",
          )}
        >
          {/* Logo */}
          <button
            onClick={() => handleNavClick("top")}
            className="group flex items-center gap-2 pl-2"
          >
            <span className="relative flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground">
              <span className="relative font-display text-[11px] font-bold">N</span>
            </span>
            <span className="font-display text-sm font-semibold tracking-[0.2em]">NEURALYX</span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => handleNavClick(l.id)}
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

          {/* Right side */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <div className="hidden md:flex items-center gap-1">
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/watchlist"
                    className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                  >
                    Watchlist
                  </Link>
                  <Link
                    to="/profile"
                    className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                  >
                    Profile
                  </Link>
                </div>
                <button
                  onClick={handleLogout}
                  className="hidden md:flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <LogOut className="h-3 w-3" />
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden md:flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <LogIn className="h-3 w-3" />
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="hidden md:inline-flex items-center justify-center rounded-md bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Register
                </Link>
              </>
            )}

            <button
              onClick={openRequestAccess}
              className="hidden md:inline-flex items-center justify-center rounded-md bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Request Access
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-muted-foreground md:hidden"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
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
                  onClick={() => handleNavClick(l.id)}
                  className={cn(
                    "flex w-full items-center px-5 py-3.5 text-sm text-left transition-colors",
                    activeSection === l.id
                      ? "text-foreground bg-white/5"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {l.label}
                </button>
              ))}
              <div className="border-t border-white/5 px-5 py-3 flex flex-col gap-2">
                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="flex w-full items-center px-2 py-2.5 text-sm text-muted-foreground hover:text-foreground"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/watchlist"
                      onClick={() => setMobileOpen(false)}
                      className="flex w-full items-center px-2 py-2.5 text-sm text-muted-foreground hover:text-foreground"
                    >
                      Watchlist
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setMobileOpen(false)}
                      className="flex w-full items-center px-2 py-2.5 text-sm text-muted-foreground hover:text-foreground"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => { setMobileOpen(false); handleLogout(); }}
                      className="flex-1 rounded-full border border-white/10 bg-white/5 py-2 text-xs text-muted-foreground mt-1"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <div className="flex gap-2">
                    <Link
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      className="flex-1 rounded-full border border-white/10 bg-white/5 py-2 text-xs text-muted-foreground text-center"
                    >
                      Sign in
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileOpen(false)}
                      className="flex-1 rounded-md bg-primary py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 text-center"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
