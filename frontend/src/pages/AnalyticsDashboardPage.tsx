import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { ReactNode } from "react";
import { BarChart3 } from "lucide-react";
import { useAnalytics } from "../hooks/useAnalytics";
import UpcomingRenewalsCard from "../components/notifications/UpcomingRenewalsCard";

interface RiskDistributionEntry {
  level: string;
  count: number;
}

interface StatusBreakdownEntry {
  status: string;
  count: number;
}

const RISK_COLORS: Record<string, string> = {
  low: "var(--color-insert)",
  medium: "var(--color-gold)",
  high: "var(--color-redline)",
  not_analyzed: "var(--color-ink-soft)",
};

const STATUS_COLORS: Record<string, string> = {
  uploaded: "var(--color-ink-soft)",
  processing: "var(--color-gold)",
  extracted: "var(--color-insert)",
  failed: "var(--color-redline)",
};

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-ink/10 bg-white p-5">
      <h3 className="mb-4 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
        {title}
      </h3>

      {children}
    </div>
  );
}

/*
 * Recharts' Pie label callback is typed using PieLabelRenderProps,
 * which does not know about our custom data fields such as
 * `level`, `status`, and `count`.
 *
 * We therefore accept the Recharts value as unknown and narrow it
 * to our actual chart-data shape inside the renderer.
 */
function renderRiskLabel(entry: unknown): string {
  const item = entry as RiskDistributionEntry;

  return `${item.level}: ${item.count}`;
}

function renderStatusLabel(entry: unknown): string {
  const item = entry as StatusBreakdownEntry;

  return `${item.status}: ${item.count}`;
}

export default function AnalyticsDashboardPage() {
  const { data, isLoading, error } = useAnalytics();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-ink-soft">
        Loading analytics...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-redline">
        Couldn't load analytics.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      {/* Header */}
      <div className="mb-6 flex items-center gap-2">
        <BarChart3 size={18} className="text-ink-soft" />

        <h1 className="text-xl font-semibold text-ink">Analytics</h1>
      </div>

      <p className="mb-6 text-sm text-ink-soft">
        {data.total_contracts} contract
        {data.total_contracts !== 1 ? "s" : ""} in your portfolio.
      </p>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

        <UpcomingRenewalsCard />

        {/* Upload Volume */}
        <ChartCard title="Upload Volume Over Time">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data.volume_over_time}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-ink)"
                strokeOpacity={0.08}
              />

              <XAxis
                dataKey="month"
                tick={{
                  fontSize: 11,
                  fill: "var(--color-ink-soft)",
                }}
              />

              <YAxis
                allowDecimals={false}
                tick={{
                  fontSize: 11,
                  fill: "var(--color-ink-soft)",
                }}
              />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="count"
                stroke="var(--color-ink)"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Upcoming Expiry */}
        <ChartCard title="Upcoming Expiry Timeline">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.expiry_timeline}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-ink)"
                strokeOpacity={0.08}
              />

              <XAxis
                dataKey="month"
                tick={{
                  fontSize: 11,
                  fill: "var(--color-ink-soft)",
                }}
              />

              <YAxis
                allowDecimals={false}
                tick={{
                  fontSize: 11,
                  fill: "var(--color-ink-soft)",
                }}
              />

              <Tooltip />

              <Bar
                dataKey="count"
                fill="var(--color-gold)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Contract Value Distribution */}
        <ChartCard title="Contract Value Distribution">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.value_distribution} layout="vertical">
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-ink)"
                strokeOpacity={0.08}
              />

              <XAxis
                type="number"
                allowDecimals={false}
                tick={{
                  fontSize: 11,
                  fill: "var(--color-ink-soft)",
                }}
              />

              <YAxis
                dataKey="bucket"
                type="category"
                width={80}
                tick={{
                  fontSize: 11,
                  fill: "var(--color-ink-soft)",
                }}
              />

              <Tooltip />

              <Bar
                dataKey="count"
                fill="var(--color-insert)"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Risk Distribution */}
        <ChartCard title="Risk Distribution">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={data.risk_distribution}
                dataKey="count"
                nameKey="level"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={renderRiskLabel}
              >
                {data.risk_distribution.map((entry: RiskDistributionEntry) => (
                  <Cell
                    key={entry.level}
                    fill={RISK_COLORS[entry.level] ?? "var(--color-ink-soft)"}
                  />
                ))}
              </Pie>

              <Tooltip />

              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Contract Status */}
        <ChartCard title="Contract Status Breakdown">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={data.status_breakdown}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={renderStatusLabel}
              >
                {data.status_breakdown.map((entry: StatusBreakdownEntry) => (
                  <Cell
                    key={entry.status}
                    fill={
                      STATUS_COLORS[entry.status] ?? "var(--color-ink-soft)"
                    }
                  />
                ))}
              </Pie>

              <Tooltip />

              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Approval Pipeline */}
        <ChartCard title="Approval Pipeline">
          <div className="flex h-[220px] flex-col items-center justify-center text-center">
            <p className="text-xs text-ink-soft">
              Approval workflow stats will appear here once
              <br />
              workflow tracking is built in Phase 5.
            </p>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
