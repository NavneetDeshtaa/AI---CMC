import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  RefreshCw,
  Sparkles,
} from "lucide-react";

import { useSummary, useRegenerateSummary } from "../../hooks/useSummary";

interface SummaryPanelProps {
  contractId: string;
}

export default function SummaryPanel({ contractId }: SummaryPanelProps) {
  const { data: summary, isLoading, error } = useSummary(contractId);

  const regenerate = useRegenerateSummary(contractId);

  /* ============================================================
     LOADING
  ============================================================ */

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-[0_8px_30px_-20px_rgba(28,35,33,0.25)]">
        <div className="flex items-center gap-3 border-b border-ink/[0.07] px-5 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/[0.1] text-gold">
            <Sparkles size={15} />
          </div>

          <div>
            <p className="text-xs font-semibold text-ink">AI Contract Brief</p>

            <p className="text-[10px] text-ink-soft/60">
              Analyzing contract contents
            </p>
          </div>
        </div>

        <div className="space-y-4 p-6">
          <div className="h-4 w-28 animate-pulse rounded bg-ink/[0.06]" />
          <div className="h-3 w-full animate-pulse rounded bg-ink/[0.05]" />
          <div className="h-3 w-5/6 animate-pulse rounded bg-ink/[0.05]" />
          <div className="h-20 animate-pulse rounded-xl bg-ink/[0.04]" />
        </div>
      </div>
    );
  }

  /* ============================================================
     ERROR / UNAVAILABLE
  ============================================================ */

  if (error || !summary) {
    return (
      <div className="rounded-2xl border border-ink/10 bg-white p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold/[0.08] text-gold">
            <Clock3 size={15} />
          </div>

          <div>
            <p className="text-sm font-semibold text-ink">
              Summary not available
            </p>

            <p className="mt-1 text-xs leading-5 text-ink-soft">
              Extraction may still be in progress. The AI briefing will become
              available once the contract has been processed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-[0_8px_30px_-20px_rgba(28,35,33,0.25)]">
      {/* ========================================================
          HEADER
      ======================================================== */}

      <div className="flex items-center justify-between border-b border-ink/[0.07] px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/[0.1] text-gold">
            <Sparkles size={15} />
          </div>

          <div>
            <p className="text-sm font-semibold text-ink">AI Contract Brief</p>

            <p className="text-[10px] text-ink-soft/60">
              Key insights generated from this contract
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => regenerate.mutate()}
          disabled={regenerate.isPending}
          className="group flex items-center gap-1.5 rounded-lg border border-ink/10 px-3 py-2 text-[11px] font-medium text-ink-soft transition-all hover:border-ink/20 hover:bg-paper hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            size={12}
            className={
              regenerate.isPending
                ? "animate-spin"
                : "transition-transform group-hover:rotate-45"
            }
          />

          {regenerate.isPending ? "Regenerating..." : "Regenerate"}
        </button>
      </div>

      {/* ========================================================
          OVERVIEW
      ======================================================== */}

      <div className="border-b border-ink/[0.07] px-5 py-6 sm:px-6">
        <div className="mb-3 flex items-center gap-2">
          <FileText size={13} className="text-ink-soft/60" />

          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-soft/60">
            Executive overview
          </p>
        </div>

        <p className="text-sm leading-7 text-ink sm:text-[15px]">
          {summary.overview}
        </p>
      </div>

      {/* ========================================================
          KEY OBLIGATIONS
      ======================================================== */}

      <div className="border-b border-ink/[0.07] px-5 py-6 sm:px-6">
        <SectionLabel
          icon={<CheckCircle2 size={13} />}
          label="Key obligations"
        />

        <ul className="mt-4 space-y-3">
          {summary.key_obligations.map((obligation, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-insert/[0.08] font-mono text-[9px] font-semibold text-insert">
                {index + 1}
              </span>

              <p className="text-sm leading-6 text-ink-soft">{obligation}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* ========================================================
          PAYMENT TERMS
      ======================================================== */}

      <div className="border-b border-ink/[0.07] px-5 py-6 sm:px-6">
        <SectionLabel icon={<FileText size={13} />} label="Payment terms" />

        <div className="mt-3 rounded-xl bg-paper px-4 py-4">
          <p className="text-sm leading-6 text-ink">{summary.payment_terms}</p>
        </div>
      </div>

      {/* ========================================================
          IMPORTANT DATES
      ======================================================== */}

      {summary.important_dates.length > 0 && (
        <div className="border-b border-ink/[0.07] px-5 py-6 sm:px-6">
          <SectionLabel
            icon={<CalendarDays size={13} />}
            label="Important dates"
          />

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {summary.important_dates.map((date, index) => (
              <div
                key={index}
                className="rounded-xl border border-ink/10 bg-white p-4"
              >
                <p className="text-[10px] font-medium uppercase tracking-wider text-ink-soft/60">
                  {date.label}
                </p>

                {date.date ? (
                  <p className="mt-1 font-display text-base font-semibold text-ink">
                    {date.date}
                  </p>
                ) : (
                  <p className="mt-1 text-sm text-ink-soft">
                    Date not specified
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          RISKS
      ======================================================== */}

      {summary.risks_flagged.length > 0 && (
        <div className="border-b border-redline/10 bg-redline/[0.025] px-5 py-6 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-redline/[0.08] text-redline">
              <AlertTriangle size={13} />
            </div>

            <div>
              <p className="text-xs font-semibold text-redline">
                Risks flagged
              </p>

              <p className="text-[10px] text-redline/60">Requires review</p>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {summary.risks_flagged.map((risk, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-xl border border-redline/10 bg-white px-4 py-3"
              >
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-redline" />

                <p className="text-sm leading-6 text-redline/80">{risk}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          FOOTER
      ======================================================== */}

      <div className="flex items-center justify-between px-5 py-4 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-insert" />

          <p className="text-[10px] text-ink-soft/60">AI-generated analysis</p>
        </div>

        <p className="text-[10px] text-ink-soft/50">
          Generated {new Date(summary.generated_at).toLocaleString()}
        </p>
      </div>
    </section>
  );
}

/* ==============================================================
   SECTION LABEL
============================================================== */

interface SectionLabelProps {
  icon: React.ReactNode;
  label: string;
}

function SectionLabel({ icon, label }: SectionLabelProps) {
  return (
    <div className="flex items-center gap-2 text-ink-soft">
      {icon}

      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em]">
        {label}
      </p>
    </div>
  );
}
