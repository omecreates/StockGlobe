export function Footer() {
  return (
    <footer className="relative mt-32 overflow-hidden border-t border-border bg-card">
      <div className="relative mx-auto max-w-7xl px-6 pb-12 pt-24">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground">
                <span className="relative font-display text-[11px] font-bold">S</span>
              </span>
              <span className="font-display text-sm font-semibold tracking-[0.2em]">STOCKGLOBE</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              AI-Powered Stock Market Intelligence Platform
            </p>
            <p className="mt-2 max-w-xs text-xs text-muted-foreground/80">
              Built and maintained by Shaheed Ali Khan, a Full-Stack Developer and AI Enthusiast from VIT Chennai.
            </p>
          </div>
          {[
            { 
              title: "Navigation", 
              items: [
                { label: "Home", href: "/" },
                { label: "Predictions", href: "#" },
                { label: "Analytics", href: "#" },
                { label: "Globe", href: "#" },
                { label: "Portfolio", href: "#" },
                { label: "About", href: "/about" },
              ] 
            },
            { 
              title: "Developer Links", 
              items: [
                { label: "About Me", href: "/about" },
                { label: "GitHub", href: "https://github.com/omecreates" },
                { label: "LinkedIn", href: "https://www.linkedin.com/in/pdshahidali/" },
                { label: "Personal Portfolio", href: "https://pdshaheedali.vercel.app/" },
                { label: "Contact", href: "mailto:phenomenalonep28@gmail.com" },
              ] 
            },
          ].map((col) => (
            <div key={col.title}>
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {col.title}
              </div>
              <ul className="mt-4 space-y-2 text-sm">
                {col.items.map((it) => (
                  <li key={it.label}>
                    <a href={it.href} className="text-foreground/80 transition-colors hover:text-foreground" target={it.href.startsWith("http") ? "_blank" : undefined} rel={it.href.startsWith("http") ? "noopener noreferrer" : undefined}>
                      {it.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/5 pt-6 text-xs text-muted-foreground md:flex-row">
          <div>© {new Date().getFullYear()} StockGlobe • Built by PD Shaheed Ali</div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--signal-buy)] animate-pulse-glow" />
            Currently improving AI features, authentication, and deployment.
          </div>
        </div>
      </div>
    </footer>
  );
}
