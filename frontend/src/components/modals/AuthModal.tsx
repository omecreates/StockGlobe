/* eslint-disable prettier/prettier */
// src/components/modals/AuthModal.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Eye, EyeOff, LogIn, UserPlus } from "lucide-react";
import { useApp } from "@/store/appStore";
import { authApi } from "@/lib/apiClient";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 backdrop-blur outline-none transition-all focus:border-[color:var(--primary)]/60 focus:bg-white/[0.07] focus:ring-2 focus:ring-[color:var(--primary)]/20";

export function AuthModal() {
  const { state, closeAllModals, openAuth, login, addToast } = useApp();
  const mode = state.modals.auth;
  const open = mode !== null;

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setError("");
        setForm({ name: "", email: "", password: "" });
        setLoading(false);
        setShowPassword(false);
      }, 400);
    }
  }, [open]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open && !loading) closeAllModals();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, loading, closeAllModals]);

  async function handleSubmit() {
    if (!form.email || !form.password) {
      setError("All fields are required");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res =
        mode === "login"
          ? await authApi.login({ email: form.email, password: form.password })
          : await authApi.signup({ name: form.name, email: form.email, password: form.password });
      login(res.user, res.access_token);
      closeAllModals();
      addToast({
        type: "success",
        title: mode === "login" ? "Welcome back" : "Account created",
        message: `Logged in as ${res.user.email}`,
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSubmit();
  }

  const field = (
    key: keyof typeof form,
    label: string,
    placeholder: string,
    type = "text",
  ) => (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
        {label}
      </label>
      <div className="relative">
        <input
          type={type === "password" ? (showPassword ? "text" : "password") : type}
          className={cn(inputClass, type === "password" && "pr-10")}
          placeholder={placeholder}
          value={form[key]}
          disabled={loading}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          onKeyDown={handleKey}
        />
        {type === "password" && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md"
            onClick={() => !loading && closeAllModals()}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4"
            style={{ pointerEvents: "none" }}
          >
            <div className="relative w-full max-w-sm" style={{ pointerEvents: "auto" }}>
              {/* Subtle glow */}
              <div
                className="absolute -inset-px rounded-3xl opacity-30 animate-aurora"
                style={{ background: "var(--gradient-aurora)", filter: "blur(12px)" }}
              />

              <div className="relative glass-strong rounded-3xl overflow-hidden">
                {/* Tabs */}
                <div className="flex items-center border-b border-white/5">
                  {(["login", "signup"] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => { setError(""); openAuth(m); }}
                      disabled={loading}
                      className={cn(
                        "flex flex-1 items-center justify-center gap-2 py-4 text-xs font-semibold uppercase tracking-[0.15em] transition-all",
                        mode === m
                          ? "text-foreground border-b-2 border-[color:var(--primary)]"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {m === "login" ? (
                        <><LogIn className="h-3.5 w-3.5" />Sign In</>
                      ) : (
                        <><UserPlus className="h-3.5 w-3.5" />Create Account</>
                      )}
                    </button>
                  ))}
                  <button
                    onClick={() => !loading && closeAllModals()}
                    className="px-4 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Form */}
                <div className="p-6 space-y-4">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={mode}
                      initial={{ opacity: 0, x: mode === "signup" ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      {mode === "signup" &&
                        field("name", "Full name", "Your name")}
                      {field("email", "Email", "you@firm.com", "email")}
                      {field("password", "Password", "••••••••", "password")}

                      {error && (
                        <p className="text-[11px] text-[color:var(--signal-sell)] text-center">
                          {error}
                        </p>
                      )}

                      <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="group relative w-full overflow-hidden rounded-xl px-4 py-3 text-sm font-semibold text-background transition-all active:scale-[0.98] disabled:opacity-60"
                      >
                        <span
                          aria-hidden
                          className="absolute inset-0 animate-aurora"
                          style={{ background: "var(--gradient-aurora)" }}
                        />
                        <span className="relative flex items-center justify-center gap-2">
                          {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : mode === "login" ? (
                            "Sign In"
                          ) : (
                            "Create Account"
                          )}
                        </span>
                      </button>

                      {mode === "login" && (
                        <p className="text-center text-xs text-muted-foreground">
                          No account?{" "}
                          <button
                            onClick={() => openAuth("signup")}
                            className="text-[color:var(--primary)] hover:underline"
                          >
                            Sign up free
                          </button>
                        </p>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
