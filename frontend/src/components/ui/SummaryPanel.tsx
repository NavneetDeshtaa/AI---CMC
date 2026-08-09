import { useSummary, useRegenerateSummary } from "../../hooks/useSummary";

interface SummaryPanelProps {
  contractId: string;
}

export default function SummaryPanel({ contractId }: SummaryPanelProps) {
  const { data: summary, isLoading, error } = useSummary(contractId);
  const regenerate = useRegenerateSummary(contractId);

  if (isLoading) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-center text-slate-500 text-sm">
        Generating summary...
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-center text-slate-500 text-sm">
        Summary not available yet -- extraction may still be in progress.
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">
          AI Summary
        </h3>
        <button
          onClick={() => regenerate.mutate()}
          disabled={regenerate.isPending}
          className="text-xs font-medium text-slate-500 hover:text-slate-800 disabled:text-slate-300 transition-colors"
        >
          {regenerate.isPending ? "Regenerating..." : "Regenerate"}
        </button>
      </div>

      <p className="text-sm text-slate-800 leading-relaxed">{summary.overview}</p>

      <div>
        <p className="text-xs font-medium text-slate-500 mb-2">Key Obligations</p>
        <ul className="space-y-1.5">
          {summary.key_obligations.map((obligation, i) => (
            <li key={i} className="text-sm text-slate-700 flex gap-2">
              <span className="text-slate-400">•</span>
              {obligation}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-xs font-medium text-slate-500 mb-1">Payment Terms</p>
        <p className="text-sm text-slate-800">{summary.payment_terms}</p>
      </div>

      {summary.important_dates.length > 0 && (
        <div>
          <p className="text-xs font-medium text-slate-500 mb-2">Important Dates</p>
          <div className="flex flex-wrap gap-2">
            {summary.important_dates.map((d, i) => (
              <span
                key={i}
                className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full"
              >
                {d.label}{d.date ? ` — ${d.date}` : ""}
              </span>
            ))}
          </div>
        </div>
      )}

      {summary.risks_flagged.length > 0 && (
        <div>
          <p className="text-xs font-medium text-red-600 mb-2">Risks Flagged</p>
          <ul className="space-y-1.5">
            {summary.risks_flagged.map((risk, i) => (
              <li key={i} className="text-sm text-red-700 bg-red-50 rounded-md px-3 py-2">
                {risk}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-xs text-slate-400 pt-1">
        Generated {new Date(summary.generated_at).toLocaleString()}
      </p>
    </div>
  );
}