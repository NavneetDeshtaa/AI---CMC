import { Server } from "lucide-react";
import { useSystemStatus } from "../../hooks/useSystemStatus";

function StatusDot({ ok }: { ok: boolean }) {
  return <span className={`h-2 w-2 rounded-full ${ok ? "bg-insert" : "bg-redline"}`} />;
}

export default function SystemStatusCard() {
  const { data, isLoading } = useSystemStatus();

  const redisOk = data?.redis === "connected";
  const celeryOk = (data?.celery_worker_count ?? 0) > 0;

  return (
    <div className="rounded-xl border border-ink/10 bg-white p-5">
      <div className="mb-4 flex items-center gap-2">
        <Server size={14} className="text-ink-soft" />
        <h3 className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
          System Status
        </h3>
      </div>

      {isLoading ? (
        <p className="text-xs text-ink-soft">Checking...</p>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-ink-soft">Redis</span>
            <div className="flex items-center gap-2">
              <StatusDot ok={redisOk} />
              <span className="text-xs font-medium text-ink">{redisOk ? "Connected" : "Disconnected"}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-ink-soft">Celery Worker</span>
            <div className="flex items-center gap-2">
              <StatusDot ok={celeryOk} />
              <span className="text-xs font-medium text-ink">
                {celeryOk ? `${data?.celery_worker_count} active` : "Not running"}
              </span>
            </div>
          </div>

          {!celeryOk && (
            <p className="pt-1 text-[10px] text-ink-soft">
              No worker responded -- make sure 'celery -A app.core.celery_app worker' is running.
            </p>
          )}
        </div>
      )}
    </div>
  );
}