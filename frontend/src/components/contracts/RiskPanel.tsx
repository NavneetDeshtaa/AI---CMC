import { ShieldAlert, ShieldCheck, RefreshCw, AlertTriangle, XCircle } from "lucide-react";
import { useRiskAssessment, useRegenerateRisk } from "../../hooks/useRisk";
import type { RiskLevel } from "../../types/risk";

interface RiskPanelProps {
  contractId: string;
}

const levelStyles: Record<RiskLevel, { container: string; icon: string }> = {
  low: { container: "border-insert/20 bg-insert/[0.06] text-insert", icon: "text-insert" },
  medium: { container: "border-gold/20 bg-gold/[0.06] text-gold", icon: "text-gold" },
  high: { container: "border-redline/20 bg-redline/[0.06] text-redline", icon: "text-redline" },
};

export default function RiskPanel({ contractId }: RiskPanelProps) {
  const { data: risk, isLoading, error } = useRiskAssessment(contractId);
  const regenerate = useRegenerateRisk(contractId);

  if (isLoading) {
    return (
      <div className="rounded-xl border border-ink/10 bg-paper/50 p-6 text-center text-xs text-ink-soft">
        Analyzing contract risk...
      </div>
    );
  }

  if (error || !risk) {
    return (
      <div className="rounded-xl border border-ink/10 bg-paper/50 p-6 text-center text-xs text-ink-soft">
        Risk analysis not available yet -- extraction may still be in progress.
      </div>
    );
  }

  const style = levelStyles[risk.risk_level];

  return (
    <div className="rounded-xl border border-ink/10 bg-white p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert size={15} className="text-ink-soft" />
          <h3 className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
            Risk Assessment
          </h3>
        </div>
        <button
          onClick={() => regenerate.mutate()}
          disabled={regenerate.isPending}
          className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-ink-soft hover:text-ink disabled:text-ink-soft/40 transition-colors"
        >
          <RefreshCw size={11} className={regenerate.isPending ? "animate-spin" : ""} />
          {regenerate.isPending ? "Regenerating..." : "Regenerate"}
        </button>
      </div>

      {/* Score */}
      <div className={`flex items-center gap-3 rounded-lg border px-4 py-3 ${style.container}`}>
        <span className="text-2xl font-bold">{risk.risk_score}</span>
        <div>
          <p className="text-xs font-semibold capitalize">{risk.risk_level} risk</p>
          <p className="text-[10px] opacity-70">out of 100</p>
        </div>
      </div>

      <p className="text-sm leading-relaxed text-ink">{risk.explanation}</p>

      {risk.flagged_clauses.length > 0 && (
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-soft">
            <AlertTriangle size={11} />
            Flagged Clauses
          </p>
          <div className="space-y-2">
            {risk.flagged_clauses.map((c, i) => (
              <div key={i} className="rounded-lg border border-ink/10 bg-paper/50 px-3.5 py-2.5">
                <p className="text-xs font-semibold text-ink">{c.clause}</p>
                <p className="mt-0.5 text-xs text-ink-soft">{c.issue}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {risk.missing_clauses.length > 0 && (
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-soft">
            <XCircle size={11} />
            Missing Clauses
          </p>
          <div className="space-y-2">
            {risk.missing_clauses.map((c, i) => (
              <div key={i} className="rounded-lg border border-redline/15 bg-redline/[0.04] px-3.5 py-2.5">
                <p className="text-xs font-semibold text-ink">{c.clause}</p>
                <p className="mt-0.5 text-xs text-ink-soft">{c.why_it_matters}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {risk.flagged_clauses.length === 0 && risk.missing_clauses.length === 0 && (
        <div className="flex items-center gap-2 rounded-lg border border-insert/20 bg-insert/[0.06] px-3.5 py-2.5 text-xs text-insert">
          <ShieldCheck size={13} />
          No issues found against baseline policy standards.
        </div>
      )}

      <p className="pt-1 font-mono text-[9px] text-ink-soft/60">
        Generated {new Date(risk.generated_at).toLocaleString()}
      </p>
    </div>
  );
}