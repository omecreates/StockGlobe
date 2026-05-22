export function Footer() {
  return (
    <footer className="relative mt-32 overflow-hidden border-t border-white/5">
      <div aria-hidden className="absolute inset-0 ring-grid opacity-30 animate-grid-shift" />
      <div aria-hidden className="absolute inset-x-0 -top-40 mx-auto h-[420px] w-[820px] rounded-full opacity-40 blur-3xl" style={{ background: "var(--gradient-aurora)" }} />
      <div className="relative mx-auto max-w-7xl px-6 pb-12 pt-24">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-7 w-7 items-center justify-center">
                <span className="absolute inset-0 rounded-md animate-aurora" style={{ background: "var(--gradient-aurora)" }} />
                <span className="absolute inset-[2px] rounded-[4px] bg-background" />
                <span className="relative font-display text-[11px] font-bold text-gradient">N</span>
              </span>
              <span className="font-display text-sm font-semibold tracking-[0.2em]">NEURALYX</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              The intelligence layer for global markets. Predict, position, perform — at machine speed.
            </p>
          </div>
          {[
            { title: "Product", items: ["Predictions", "Globe", "Analytics", "Portfolio AI"] },
            { title: "Company", items: ["About", "Research", "Careers", "Press"] },
            { title: "Resources", items: ["Docs", "API", "Disclosures", "Status"] },
          ].map((col) => (
            <div key={col.title}>
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {col.title}
              </div>
              <ul className="mt-4 space-y-2 text-sm">
                {col.items.map((it) => (
                  <li key={it}>
                    <a href="#" className="text-foreground/80 transition-colors hover:text-foreground">
                      {it}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/5 pt-6 text-xs text-muted-foreground md:flex-row">
          <div>© {new Date().getFullYear()} Neuralyx Systems. Not investment advice.</div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--signal-buy)] animate-pulse-glow" />
            All systems nominal · v4.2.1
          </div>
        </div>
      </div>
    </footer>
  );
}
