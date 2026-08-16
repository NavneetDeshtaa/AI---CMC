import { useNavigate } from "react-router-dom";
import { CalendarClock } from "lucide-react";
import { useUpcomingObligations } from "../../hooks/usePhase4";

export default function UpcomingRenewalsCard() {
  const navigate = useNavigate();
  const { data: items, isLoading } = useUpcomingObligations(30);

  return (
    <div className="rounded-xl border border-ink/10 bg-white p-5">
      <div className="mb-4 flex items-center gap-2">
        <CalendarClock size={14} className="text-ink-soft" />
        <h3 className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
          Renewing in 30 Days
        </h3>
      </div>

      {isLoading ? (
        <p className="text-xs text-ink-soft">Loading...</p>
      ) : !items || items.length === 0 ? (
        <p className="text-xs text-ink-soft">Nothing renewing in the next 30 days.</p>
      ) : (
        <>
          <p className="mb-3 text-2xl font-bold text-ink">{items.length}</p>
          <div className="space-y-2">
            {items.slice(0, 5).map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(`/contracts/${item.contract_id}`)}
                className="block w-full rounded-lg border border-ink/[0.07] px-3 py-2 text-left hover:bg-paper/60 transition-colors"
              >
                <p className="text-xs font-semibold text-ink">{item.title}</p>
                <p className="text-[10px] text-ink-soft">Due {item.due_date}</p>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}