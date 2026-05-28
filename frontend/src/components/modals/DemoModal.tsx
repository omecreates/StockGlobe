/* eslint-disable prettier/prettier */
// src/components/modals/DemoModal.tsx
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Zap } from "lucide-react";
import { useApp } from "@/store/appStore";

export function DemoModal() {
  const { state, closeAllModals } = useApp();
  const open = state.modals.demo;

  // Lock body scroll when open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) closeAllModals();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, closeAllModals]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md"
            onClick={closeAllModals}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4"
            style={{ pointerEvents: "none" }}
          >
            <div
              className="relative w-full max-w-4xl"
              style={{ pointerEvents: "auto" }}
            >
              {/* Glow ring */}
              <div
                className="absolute -inset-px rounded-3xl opacity-60 animate-aurora"
                style={{
                  background: "var(--gradient-aurora)",
                  filter: "blur(8px)",
                }}
              />

              {/* Card */}
              <div className="relative glass-strong rounded-3xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
                      <Zap className="h-4 w-4 text-[color:var(--primary)]" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold font-display">
                        Neuralyx Platform Demo
                      </div>
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                        AI Market Intelligence · v4.2
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={closeAllModals}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Video container */}
                <div className="relative bg-black aspect-video">
                  {/* Replace src with your actual demo video URL */}
                  <iframe
                    className="absolute inset-0 h-full w-full"
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&controls=1&rel=0"
                    title="Neuralyx Demo"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />

                  {/* Scanline overlay for aesthetic */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-[0.03]"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(0deg, transparent, transparent 2px, black 2px, black 4px)",
                    }}
                  />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-white/5 px-6 py-4">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--signal-buy)] animate-pulse-glow" />
                    Live product · not pre-recorded
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-muted-foreground">Want early access?</div>
                    <button
                      onClick={() => {
                        closeAllModals();
                        setTimeout(() => {
                          document.getElementById("cta")?.scrollIntoView({ behavior: "smooth" });
                        }, 300);
                      }}
                      className="relative inline-flex items-center gap-1.5 overflow-hidden rounded-full px-3 py-1.5 text-xs font-medium text-background"
                    >
                      <span
                        aria-hidden
                        className="absolute inset-0 animate-aurora"
                        style={{ background: "var(--gradient-aurora)" }}
                      />
                      <span className="relative flex items-center gap-1.5">
                        <Play className="h-3 w-3" />
                        Request Access
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
