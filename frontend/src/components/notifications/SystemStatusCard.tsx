import {
  Server,
  Database,
  Cpu,
  AlertCircle,
} from "lucide-react";

import { useSystemStatus } from "../../hooks/useSystemStatus";

function StatusDot({
  ok,
}: {
  ok: boolean;
}) {
  return (
    <span
      className={`h-1.5 w-1.5 rounded-full ${
        ok
          ? "bg-[#2f9076]"
          : "bg-[#d24d4d]"
      }`}
    />
  );
}

export default function SystemStatusCard() {
  const {
    data,
    isLoading,
  } = useSystemStatus();

  const redisOk =
    data?.redis === "connected";

  const celeryOk =
    (data?.celery_worker_count ?? 0) > 0;

  const everythingHealthy =
    redisOk && celeryOk;

  return (
    <section className="overflow-hidden rounded-xl border border-[#e5e5e5] bg-white">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex items-start justify-between border-b border-[#ececec] px-5 py-4">
        <div className="flex items-start gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#e4e4e4] bg-[#fafafa] text-[#6f737b]">
            <Server
              size={14}
              strokeWidth={1.7}
            />
          </div>

          <div>
            <h3 className="text-[12px] font-semibold text-[#181a20]">
              System Status
            </h3>

            <p className="mt-0.5 text-[10px] text-[#92959b]">
              Background services supporting contract processing.
            </p>
          </div>
        </div>

        {!isLoading && (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-medium ${
              everythingHealthy
                ? "border-[#cfe5dd] bg-[#f0f8f5] text-[#28755f]"
                : "border-[#efcccc] bg-[#fff4f4] text-[#c94b4b]"
            }`}
          >
            <StatusDot ok={everythingHealthy} />

            {everythingHealthy
              ? "Operational"
              : "Attention"}
          </span>
        )}
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="p-5">
        {/* Loading */}

        {isLoading ? (
          <div className="flex min-h-[150px] flex-col items-center justify-center text-center">
            <div className="mb-3 h-5 w-5 animate-spin rounded-full border-2 border-[#dddddd] border-t-[#181a20]" />

            <p className="text-[11px] text-[#85888f]">
              Checking system health...
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* =================================================
                REDIS
            ================================================= */}

            <StatusRow
              icon={
                <Database
                  size={14}
                  strokeWidth={1.6}
                />
              }
              label="Redis"
              description="Task broker"
              ok={redisOk}
              status={
                redisOk
                  ? "Connected"
                  : "Disconnected"
              }
            />

            {/* =================================================
                CELERY
            ================================================= */}

            <StatusRow
              icon={
                <Cpu
                  size={14}
                  strokeWidth={1.6}
                />
              }
              label="Celery Worker"
              description="Background jobs"
              ok={celeryOk}
              status={
                celeryOk
                  ? `${
                      data?.celery_worker_count ?? 0
                    } active`
                  : "Not running"
              }
            />

            {/* =================================================
                WARNING
            ================================================= */}

            {!celeryOk && (
              <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-[#eadfbd] bg-[#fbf7eb] px-3.5 py-3">
                <AlertCircle
                  size={13}
                  strokeWidth={1.7}
                  className="mt-0.5 shrink-0 text-[#a6812d]"
                />

                <div>
                  <p className="text-[10px] font-medium text-[#7f672b]">
                    Background worker unavailable
                  </p>

                  <p className="mt-1 text-[9px] leading-4 text-[#917b47]">
                    Start the Celery worker to enable scheduled and background
                    contract processing.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/* ============================================================
   STATUS ROW
============================================================ */

interface StatusRowProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  ok: boolean;
  status: string;
}

function StatusRow({
  icon,
  label,
  description,
  ok,
  status,
}: StatusRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-[#e8e8e8] bg-[#fafafa] px-3.5 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#e3e3e3] bg-white text-[#7a7e86]">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-[#181a20]">
            {label}
          </p>

          <p className="mt-0.5 text-[9px] text-[#9699a0]">
            {description}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <StatusDot ok={ok} />

        <span
          className={`text-[10px] font-medium ${
            ok
              ? "text-[#28755f]"
              : "text-[#c94b4b]"
          }`}
        >
          {status}
        </span>
      </div>
    </div>
  );
}