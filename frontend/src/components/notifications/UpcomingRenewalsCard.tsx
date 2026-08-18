import { useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  CalendarClock,
} from "lucide-react";

import { useUpcomingObligations } from "../../hooks/useContractObligations";

export default function UpcomingRenewalsCard() {
  const navigate = useNavigate();

  const {
    data: items,
    isLoading,
  } = useUpcomingObligations(30);

  return (
    <section className="overflow-hidden rounded-xl border border-[#e5e5e5] bg-white">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex items-start justify-between border-b border-[#ececec] px-5 py-4">
        <div className="flex items-start gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#e4e4e4] bg-[#fafafa] text-[#6f737b]">
            <CalendarClock
              size={14}
              strokeWidth={1.7}
            />
          </div>

          <div>
            <h3 className="text-[12px] font-semibold text-[#181a20]">
              Upcoming Renewals
            </h3>

            <p className="mt-0.5 text-[10px] text-[#92959b]">
              Renewals and deadlines due within 30 days.
            </p>
          </div>
        </div>

        {!isLoading && items && items.length > 0 && (
          <span className="inline-flex min-w-[28px] items-center justify-center rounded-full bg-[#f1f2f2] px-2 py-1 text-[10px] font-semibold tabular-nums text-[#555961]">
            {items.length}
          </span>
        )}
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="p-5">
        {/* Loading */}

        {isLoading && (
          <div className="flex min-h-[150px] flex-col items-center justify-center text-center">
            <div className="mb-3 h-5 w-5 animate-spin rounded-full border-2 border-[#dddddd] border-t-[#181a20]" />

            <p className="text-[11px] text-[#85888f]">
              Loading upcoming renewals...
            </p>
          </div>
        )}

        {/* Empty */}

        {!isLoading &&
          (!items || items.length === 0) && (
            <div className="flex min-h-[150px] flex-col items-center justify-center text-center">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full border border-[#e3e3e3] bg-[#fafafa] text-[#7b7f87]">
                <CalendarClock
                  size={15}
                  strokeWidth={1.6}
                />
              </div>

              <p className="text-[12px] font-medium text-[#181a20]">
                No upcoming renewals
              </p>

              <p className="mt-1 text-[10px] leading-4 text-[#85888f]">
                Nothing is due within the next 30 days.
              </p>
            </div>
          )}

        {/* Renewals */}

        {!isLoading &&
          items &&
          items.length > 0 && (
            <div className="space-y-2">
              {items.slice(0, 5).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    navigate(
                      `/app/contracts/${item.contract_id}`,
                    )
                  }
                  className="group flex w-full items-center justify-between gap-4 rounded-lg border border-[#e8e8e8] bg-white px-3.5 py-3 text-left transition-colors hover:bg-[#fafafa]"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-semibold text-[#181a20]">
                      {item.title}
                    </p>

                    <p className="mt-1 text-[10px] text-[#8b8e95]">
                      Due {item.due_date}
                    </p>
                  </div>

                  <ArrowUpRight
                    size={13}
                    strokeWidth={1.7}
                    className="shrink-0 text-[#a0a3a9] transition-colors group-hover:text-[#181a20]"
                  />
                </button>
              ))}

              {items.length > 5 && (
                <p className="pt-1 text-center text-[10px] text-[#999ca2]">
                  +{items.length - 5} more upcoming
                </p>
              )}
            </div>
          )}
      </div>
    </section>
  );
}