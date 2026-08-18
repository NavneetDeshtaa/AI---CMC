import {
  Bell,
  Check,
  ListChecks,
  RefreshCw,
} from "lucide-react";

import {
  useContractObligations,
  useRegenerateObligations,
  useCompleteObligation,
} from "../../hooks/useContractObligations";

interface ObligationsPanelProps {
  contractId: string;
}

export default function ObligationsPanel({
  contractId,
}: ObligationsPanelProps) {
  const {
    data: items,
    isLoading,
    error,
  } = useContractObligations(contractId);

  const regenerate =
    useRegenerateObligations(contractId);

  const complete =
    useCompleteObligation(contractId);

  /* =========================================================
     LOADING
  ========================================================= */

  if (isLoading) {
    return (
      <div className="rounded-xl border border-[#e5e5e5] bg-white">
        <div className="flex min-h-[220px] flex-col items-center justify-center px-6 text-center">
          <div className="mb-3 h-5 w-5 animate-spin rounded-full border-2 border-[#dddddd] border-t-[#181a20]" />

          <p className="text-[12px] font-medium text-[#181a20]">
            Loading obligations
          </p>

          <p className="mt-1 text-[11px] text-[#85888f]">
            Extracting renewal and obligation data...
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error) {
    return (
      <div className="rounded-xl border border-[#e5e5e5] bg-white">
        <div className="flex min-h-[220px] flex-col items-center justify-center px-6 text-center">
          <ListChecks
            size={18}
            strokeWidth={1.6}
            className="mb-3 text-[#92959b]"
          />

          <p className="text-[12px] font-medium text-[#181a20]">
            Obligations unavailable
          </p>

          <p className="mt-1 max-w-sm text-[11px] leading-5 text-[#85888f]">
            Obligation extraction may still be in progress.
          </p>
        </div>
      </div>
    );
  }

  const active =
    (items ?? []).filter((item) => !item.is_completed);

  const completed =
    (items ?? []).filter((item) => item.is_completed);

  return (
    <div className="overflow-hidden rounded-xl border border-[#e5e5e5] bg-white">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex items-center justify-between border-b border-[#ececec] px-5 py-4">
        <div className="flex items-center gap-2.5">
          <ListChecks
            size={15}
            strokeWidth={1.7}
            className="text-[#686c74]"
          />

          <div>
            <h3 className="text-[12px] font-semibold text-[#181a20]">
              Renewals & Obligations
            </h3>

            <p className="mt-0.5 text-[10px] text-[#92959b]">
              Track key deadlines and contract duties.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => regenerate.mutate()}
          disabled={regenerate.isPending}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[10px] font-medium text-[#686c74] transition-colors hover:bg-[#f6f6f5] hover:text-[#181a20] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <RefreshCw
            size={11}
            strokeWidth={1.7}
            className={
              regenerate.isPending
                ? "animate-spin"
                : ""
            }
          />

          {regenerate.isPending
            ? "Regenerating..."
            : "Regenerate"}
        </button>
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="p-5">
        {!items || items.length === 0 ? (
          <div className="flex min-h-[150px] flex-col items-center justify-center text-center">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full border border-[#e3e3e3] bg-[#fafafa] text-[#777b83]">
              <ListChecks size={15} strokeWidth={1.6} />
            </div>

            <p className="text-[12px] font-medium text-[#181a20]">
              No obligations found
            </p>

            <p className="mt-1 max-w-sm text-[11px] leading-5 text-[#85888f]">
              No trackable renewals or obligations were identified in this contract.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* =================================================
                ACTIVE
            ================================================= */}

            {active.length > 0 && (
              <div className="space-y-2">
                {active.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 rounded-lg border border-[#e7e7e7] bg-[#fafafa] px-3.5 py-3"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        complete.mutate(item.id)
                      }
                      disabled={complete.isPending}
                      className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-[#cfd1d4] bg-white transition-colors hover:border-[#2f9076] disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Mark obligation complete"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[9px] font-medium capitalize ${
                            item.item_type === "renewal"
                              ? "border-[#eadfbd] bg-[#fbf7eb] text-[#8d7027]"
                              : "border-[#dfe2e4] bg-white text-[#6f737b]"
                          }`}
                        >
                          {item.item_type}
                        </span>

                        <p className="min-w-0 flex-1 truncate text-[12px] font-semibold text-[#181a20]">
                          {item.title}
                        </p>
                      </div>

                      {item.description && (
                        <p className="mt-1.5 text-[11px] leading-5 text-[#6f737b]">
                          {item.description}
                        </p>
                      )}

                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[9px] text-[#999ca2]">
                        <span>
                          Due {item.due_date}
                        </span>

                        {item.notice_period_days != null && (
                          <span className="inline-flex items-center gap-1">
                            <Bell
                              size={9}
                              strokeWidth={1.7}
                            />

                            {item.notice_period_days}d notice
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* =================================================
                COMPLETED
            ================================================= */}

            {completed.length > 0 && (
              <div className="border-t border-[#ededed] pt-4">
                <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#a0a3a9]">
                  Completed ({completed.length})
                </p>

                <div className="space-y-2">
                  {completed.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-2.5"
                    >
                      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[#edf7f3] text-[#2f9076]">
                        <Check
                          size={10}
                          strokeWidth={2}
                        />
                      </div>

                      <p className="truncate text-[11px] text-[#989ba1] line-through">
                        {item.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}