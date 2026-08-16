import { ListChecks, RefreshCw, RotateCw, Bell } from "lucide-react";
import {
  useContractObligations,
  useRegenerateObligations,
  useCompleteObligation,
} from "../../hooks/useContractObligations";

interface ObligationsPanelProps {
  contractId: string;
}

export default function ObligationsPanel({ contractId }: ObligationsPanelProps) {
  const { data: items, isLoading, error } = useContractObligations(contractId);
  const regenerate = useRegenerateObligations(contractId);
  const complete = useCompleteObligation(contractId);

  if (isLoading) {
    return (
      <div className="rounded-xl border border-ink/10 bg-paper/50 p-6 text-center text-xs text-ink-soft">
        Extracting renewals and obligations...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-ink/10 bg-paper/50 p-6 text-center text-xs text-ink-soft">
        Obligations not available yet -- extraction may still be in progress.
      </div>
    );
  }

  const active = (items ?? []).filter((i) => !i.is_completed);
  const completed = (items ?? []).filter((i) => i.is_completed);

  return (
    <div className="rounded-xl border border-ink/10 bg-white p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListChecks size={15} className="text-ink-soft" />
          <h3 className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
            Renewals &amp; Obligations
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

      {!items || items.length === 0 ? (
        <p className="text-xs text-ink-soft">
          No trackable renewals or obligations were found in this contract.
        </p>
      ) : (
        <>
          {active.length > 0 && (
            <div className="space-y-2">
              {active.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 rounded-lg border border-ink/[0.07] bg-paper/40 px-3.5 py-2.5"
                >
                  <button
                    onClick={() => complete.mutate(item.id)}
                    disabled={complete.isPending}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border border-ink/20 bg-white hover:border-ink/40 transition-colors"
                    aria-label="Mark complete"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[9px] font-semibold capitalize ${
                          item.item_type === "renewal"
                            ? "border-gold/20 bg-gold/[0.06] text-gold"
                            : "border-ink/10 bg-paper text-ink-soft"
                        }`}
                      >
                        {item.item_type}
                      </span>
                      <p className="truncate text-xs font-semibold text-ink">{item.title}</p>
                    </div>
                    {item.description && (
                      <p className="mt-1 text-xs text-ink-soft">{item.description}</p>
                    )}
                    <div className="mt-1.5 flex items-center gap-3 font-mono text-[9px] text-ink-soft/70">
                      <span>Due {item.due_date}</span>
                      {item.notice_period_days != null && (
                        <span className="inline-flex items-center gap-1">
                          <Bell size={9} />
                          {item.notice_period_days}d notice required
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {completed.length > 0 && (
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-soft/60">
                Completed ({completed.length})
              </p>
              <div className="space-y-1.5">
                {completed.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 px-1 opacity-50">
                    <RotateCw size={10} className="text-insert" />
                    <p className="truncate text-xs text-ink-soft line-through">{item.title}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}