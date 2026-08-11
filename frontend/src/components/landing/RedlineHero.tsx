export default function RedlineHero() {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* =====================================================
          BACKGROUND GLOW
      ===================================================== */}

      <div className="absolute -inset-6 bg-brand/[0.04] blur-3xl rounded-full pointer-events-none" />

      {/* =====================================================
          MAIN APPLICATION WINDOW
      ===================================================== */}

      <div className="relative bg-white border border-border rounded-2xl shadow-elevated overflow-hidden">
        {/* ===================================================
            WINDOW HEADER
        =================================================== */}

        <div className="h-12 px-4 md:px-5 border-b border-border bg-surface-soft flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-danger/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-warning/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-success/70" />
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-ink-muted">
            <span>CLAUSE</span>
            <span className="text-border-strong">/</span>
            <span>CONTRACT INTELLIGENCE</span>
          </div>

          <div className="w-8 h-8 rounded-lg bg-brand-soft flex items-center justify-center">
            <span className="text-brand text-xs font-semibold">C</span>
          </div>
        </div>

        {/* ===================================================
            CONTRACT HEADER
        =================================================== */}

        <div className="px-5 md:px-7 pt-6 pb-5 border-b border-border">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-paper border border-border flex items-center justify-center shrink-0">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-5 h-5 text-ink"
                >
                  <path
                    d="M6 3.75A1.75 1.75 0 0 1 7.75 2h6.19c.46 0 .91.18 1.24.51l3.31 3.31c.33.33.51.78.51 1.24v13.19A1.75 1.75 0 0 1 17.25 22h-9.5A1.75 1.75 0 0 1 6 20.25V3.75Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M14 2.5V7h4.5M9 11h6M9 14.5h6M9 18h4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-ink-muted mb-1">
                  Master Service Agreement
                </p>

                <h3 className="text-base md:text-lg font-semibold tracking-tight">
                  Acme Corporation
                </h3>

                <p className="text-xs text-ink-muted mt-1">MSA_Acme_Corp.pdf</p>
              </div>
            </div>

            <span className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success-soft text-success text-[10px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-success" />
              Active
            </span>
          </div>
        </div>

        {/* ===================================================
            EXTRACTED CONTRACT DATA
        =================================================== */}

        <div className="px-5 md:px-7 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <DataPoint label="VALUE" value="$2.4M" />

            <DataPoint label="EFFECTIVE" value="Jan 12, 2026" />

            <DataPoint label="RENEWAL" value="Jan 12, 2027" />

            <DataPoint label="LAW" value="California" />
          </div>
        </div>

        {/* ===================================================
            AI ANALYSIS AREA
        =================================================== */}

        <div className="px-5 md:px-7 pb-6">
          <div className="rounded-xl border border-border overflow-hidden">
            {/* Analysis header */}

            <div className="px-4 py-3 bg-surface-soft border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-ai-soft flex items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-3.5 h-3.5 text-ai"
                  >
                    <path
                      d="M12 3v4M12 17v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M3 12h4M17 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>

                <span className="text-xs font-semibold">
                  Clause AI Analysis
                </span>
              </div>

              <span className="text-[9px] font-mono uppercase tracking-wider text-ai">
                Analyzed
              </span>
            </div>

            {/* Analysis content */}

            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-mono uppercase tracking-wider text-ink-muted">
                  Section 4.2 · Payment Terms
                </p>

                <span className="text-[9px] font-semibold text-warning bg-warning-soft px-2 py-1 rounded">
                  REVIEW
                </span>
              </div>

              <p className="text-xs md:text-sm text-ink-soft leading-relaxed">
                Payment shall be due within{" "}
                <span className="line-through text-danger decoration-2">
                  thirty (30)
                </span>{" "}
                <span className="bg-success-soft text-success font-semibold px-1.5 py-0.5 rounded">
                  sixty (60)
                </span>{" "}
                days of invoice receipt.
              </p>

              {/* AI insight */}

              <div className="mt-4 p-3 rounded-lg bg-ai-soft border border-ai/10">
                <div className="flex items-start gap-2.5">
                  <span className="shrink-0 mt-0.5 w-5 h-5 rounded-md bg-ai/10 flex items-center justify-center">
                    <span className="text-[9px] font-bold text-ai">AI</span>
                  </span>

                  <div>
                    <p className="text-[11px] font-semibold text-ink mb-1">
                      AI insight
                    </p>

                    <p className="text-[11px] leading-relaxed text-ink-soft">
                      The proposed change extends the payment window by 30 days
                      and may increase cash-flow exposure.
                    </p>

                    <button className="mt-2 text-[10px] font-semibold text-ai hover:text-ai-dark transition-colors">
                      View explanation →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================
            BOTTOM STATUS BAR
        =================================================== */}

        <div className="px-5 md:px-7 py-3 border-t border-border bg-surface-soft flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />

            <span className="text-[10px] text-ink-muted">
              AI review complete
            </span>
          </div>

          <span className="text-[10px] font-mono text-ink-muted">
            14 clauses analyzed
          </span>
        </div>
      </div>

      {/* =====================================================
          FLOATING AI SEARCH CARD
      ===================================================== */}

      <div className="hidden sm:block absolute -right-5 lg:-right-12 top-24 w-48 bg-white border border-border rounded-xl shadow-card p-3 animate-float">
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-6 h-6 rounded-md bg-ai-soft flex items-center justify-center">
            <span className="text-[9px] font-bold text-ai">AI</span>
          </div>

          <span className="text-[10px] font-semibold">Ask your contracts</span>
        </div>

        <div className="rounded-lg bg-paper border border-border px-3 py-2">
          <p className="text-[9px] text-ink-muted leading-relaxed">
            "Which agreements have unlimited liability?"
          </p>
        </div>

        <div className="flex items-center gap-1.5 mt-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-brand" />

          <span className="text-[9px] text-brand font-medium">
            18 contracts found
          </span>
        </div>
      </div>

      {/* =====================================================
          FLOATING RISK CARD
      ===================================================== */}

      <div className="hidden md:block absolute -left-8 lg:-left-14 bottom-10 w-44 bg-white border border-border rounded-xl shadow-card p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[9px] font-mono uppercase tracking-wider text-ink-muted">
            Portfolio Risk
          </span>

          <span className="text-[9px] text-danger font-semibold">
            18 flagged
          </span>
        </div>

        <div className="flex gap-1 h-1.5">
          <span className="w-[35%] rounded-full bg-danger" />
          <span className="w-[25%] rounded-full bg-warning" />
          <span className="flex-1 rounded-full bg-success" />
        </div>

        <p className="text-[9px] text-ink-muted mt-2">
          AI-detected risks across your contracts
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   SMALL DATA POINT COMPONENT
========================================================= */

function DataPoint({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-paper border border-border px-3 py-2.5">
      <p className="text-[9px] font-mono uppercase tracking-wider text-ink-muted mb-1">
        {label}
      </p>

      <p className="text-xs font-semibold text-ink truncate">{value}</p>
    </div>
  );
}
