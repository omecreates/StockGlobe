/* eslint-disable prettier/prettier */
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User as UserIcon, Mail, Shield, LogOut, Star, Calendar,
  Eye, TrendingUp, LayoutDashboard,
} from "lucide-react";
import { AppProvider, useApp } from "@/store/appStore";
import { watchlistApi, authApi } from "@/lib/apiClient";

export const Route = createFileRoute("/profile")({
  component: () => (
    <AppProvider>
      <ProfilePage />
    </AppProvider>
  ),
});

// ─── Nav Bar ─────────────────────────────────────────────────────────────────
function ProfileNav() {
  const { state, logout, addToast } = useApp();
  const navigate = useNavigate();

  function handleLogout() {
    authApi.logout();
    logout();
    addToast({ type: "info", title: "Signed out" });
    navigate({ to: "/" });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <TrendingUp className="h-3.5 w-3.5" />
            </span>
            <span className="font-display text-sm font-semibold tracking-widest">STOCKGLOBE</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {[
              { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
              { to: "/watchlist", label: "Watchlist", icon: Eye },
              { to: "/profile", label: "Profile", icon: UserIcon },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors [&.active]:text-foreground [&.active]:bg-white/5"
                activeProps={{ className: "active text-foreground bg-white/5" }}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
          >
            <LogOut className="h-3 w-3" />
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}

// ─── Profile Page ────────────────────────────────────────────────────────────
function ProfilePage() {
  const { state, logout, addToast } = useApp();
  const navigate = useNavigate();
  const [watchlistCount, setWatchlistCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!state.token) navigate({ to: "/login" });
  }, [state.token, navigate]);

  useEffect(() => {
    if (state.token) {
      watchlistApi
        .getAll()
        .then((wl) => setWatchlistCount(wl.length))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [state.token]);

  function handleLogout() {
    authApi.logout();
    logout();
    addToast({ type: "info", title: "Signed out", message: "See you next time." });
    navigate({ to: "/" });
  }

  if (!state.token) return null;

  const user = state.user;
  const initial = (user?.name?.[0] ?? user?.email?.[0] ?? "?").toUpperCase();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ProfileNav />

      <main className="mx-auto max-w-2xl px-4 py-12 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          {/* Profile Card */}
          <div className="glass rounded-2xl p-8">
            <div className="flex flex-col items-center text-center">
              {/* Avatar */}
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 text-3xl font-semibold mb-4">
                {initial}
              </div>
              <h1 className="text-xl font-semibold">{user?.name ?? "User"}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{user?.email}</p>

              {/* Plan Badge */}
              <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-wider">
                <Shield className="h-3 w-3 text-cyan-400" />
                {user?.plan ?? "free"} plan
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            {[
              {
                label: "Watched Stocks",
                value: loading ? "—" : watchlistCount,
                icon: Star,
                color: "text-yellow-500",
              },
              {
                label: "Plan",
                value: (user?.plan ?? "free").charAt(0).toUpperCase() + (user?.plan ?? "free").slice(1),
                icon: Shield,
                color: "text-cyan-400",
              },
              {
                label: "Member Since",
                value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "—",
                icon: Calendar,
                color: "text-purple-400",
              },
            ].map((stat) => (
              <div key={stat.label} className="glass rounded-xl p-4 text-center">
                <stat.icon className={`h-5 w-5 mx-auto mb-2 ${stat.color}`} />
                <p className="text-lg font-semibold">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Account Details */}
          <div className="glass rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-medium mb-4">Account Details</h2>
            {[
              { icon: UserIcon, label: "Full Name", value: user?.name ?? "—" },
              { icon: Mail, label: "Email", value: user?.email ?? "—" },
              { icon: Shield, label: "Account Status", value: "Verified" },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
                <row.icon className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">{row.label}</p>
                  <p className="text-sm">{row.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3.5 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign out of StockGlobe
          </button>
        </motion.div>
      </main>
    </div>
  );
}
