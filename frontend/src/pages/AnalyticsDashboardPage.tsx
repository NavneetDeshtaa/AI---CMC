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

import {
  BarChart3,
  FileText,
  ShieldAlert,
  Activity,
} from "lucide-react";

import { useAnalytics } from "../hooks/useAnalytics";

import UpcomingRenewalsCard from "../components/notifications/UpcomingRenewalsCard";
import SystemStatusCard from "../components/notifications/SystemStatusCard";

interface RiskDistributionEntry {
  level: string;
  count: number;
}

interface StatusBreakdownEntry {
  status: string;
  count: number;
}

/* ============================================================
   COLORS
============================================================ */

const RISK_COLORS: Record<string, string> = {
  low: "#2f9076",
  medium: "#b8953f",
  high: "#d24d4d",
  not_analyzed: "#a0a3a9",
};

const STATUS_COLORS: Record<string, string> = {
  uploaded: "#8d9198",
  processing: "#b8953f",
  extracted: "#2f9076",
  failed: "#d24d4d",
};

/* ============================================================
   CHART CARD
============================================================ */

function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-[#e5e5e5] bg-white">
      <div className="border-b border-[#ececec] px-5 py-4">
        <h3 className="text-[12px] font-semibold text-[#181a20]">
          {title}
        </h3>

        {description && (
          <p className="mt-0.5 text-[10px] leading-4 text-[#92959b]">
            {description}
          </p>
        )}
      </div>

      <div className="p-5">
        {children}
      </div>
    </section>
  );
}

/* ============================================================
   STAT CARD
============================================================ */

function StatCard({
  icon,
  label,
  value,
  description,
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-[#e5e5e5] bg-white px-5 py-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-medium text-[#85888f]">
            {label}
          </p>

          <p className="mt-1 text-[25px] font-semibold tracking-[-0.035em] text-[#181a20]">
            {value}
          </p>

          <p className="mt-1 text-[10px] text-[#9a9da3]">
            {description}
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#e4e4e4] bg-[#fafafa] text-[#70747c]">
          {icon}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   TOOLTIP
============================================================ */

function AnalyticsTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{
    value?: number | string;
    name?: string;
  }>;
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border border-[#dedede] bg-white px-3 py-2 shadow-lg">
      {label && (
        <p className="mb-1 text-[10px] font-medium text-[#7c8087]">
          {label}
        </p>
      )}

      {payload.map((item, index) => (
        <p
          key={index}
          className="text-[11px] font-semibold text-[#181a20]"
        >
          {item.name ?? "Count"}: {item.value}
        </p>
      ))}
    </div>
  );
}

/* ============================================================
   PAGE
============================================================ */

export default function AnalyticsDashboardPage() {
  const {
    data,
    isLoading,
    error,
  } = useAnalytics();

  /* =========================================================
     LOADING
  ========================================================= */

  if (isLoading) {
    return (
      <main className="min-h-full bg-white px-6 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[1380px]">
          <div className="flex min-h-[500px] flex-col items-center justify-center text-center">
            <div className="mb-4 h-6 w-6 animate-spin rounded-full border-2 border-[#dedede] border-t-[#181a20]" />

            <p className="text-[13px] font-medium text-[#181a20]">
              Loading analytics
            </p>

            <p className="mt-1 text-[11px] text-[#85888f]">
              Preparing your contract portfolio insights...
            </p>
          </div>
        </div>
      </main>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error || !data) {
    return (
      <main className="min-h-full bg-white px-6 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[1380px]">
          <div className="flex min-h-[500px] flex-col items-center justify-center text-center">
            <BarChart3
              size={20}
              strokeWidth={1.6}
              className="mb-3 text-[#92959b]"
            />

            <p className="text-[13px] font-medium text-[#181a20]">
              Analytics unavailable
            </p>

            <p className="mt-1 text-[11px] text-[#85888f]">
              We couldn't load portfolio analytics right now.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const highRiskCount =
    data.risk_distribution.find(
      (item: RiskDistributionEntry) =>
        item.level === "high",
    )?.count ?? 0;

  return (
    <main className="min-h-full bg-white px-6 py-7 sm:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-[1380px]">
        {/* =====================================================
            HEADER
        ===================================================== */}

        <header className="mb-7 border-b border-[#ececec] pb-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#e3e3e3] bg-[#fafafa] text-[#5f636b]">
              <BarChart3
                size={17}
                strokeWidth={1.7}
              />
            </div>

            <div>
              <h1 className="text-[28px] font-semibold tracking-[-0.035em] text-[#181a20] sm:text-[31px]">
                Insights
              </h1>

              <p className="mt-1 text-[12px] leading-5 text-[#777b83]">
                Monitor contract activity, risk, value, and upcoming deadlines
                across your workspace.
              </p>
            </div>
          </div>
        </header>

        {/* =====================================================
            TOP SUMMARY
        ===================================================== */}

        <section className="mb-8">
          <div className="grid gap-3 sm:grid-cols-2">
            <StatCard
              icon={
                <FileText
                  size={16}
                  strokeWidth={1.7}
                />
              }
              label="Total contracts"
              value={data.total_contracts}
              description="Across your workspace"
            />

            <StatCard
              icon={
                <ShieldAlert
                  size={16}
                  strokeWidth={1.7}
                />
              }
              label="High-risk contracts"
              value={highRiskCount}
              description="Require closer review"
            />
          </div>
        </section>

        {/* =====================================================
            OPERATIONAL OVERVIEW
        ===================================================== */}

        <section className="mb-8">
          <div className="mb-4">
            <h2 className="text-[15px] font-semibold tracking-[-0.015em] text-[#181a20]">
              Operational Overview
            </h2>

            <p className="mt-1 text-[11px] text-[#85888f]">
              Upcoming contract activity and background processing health.
            </p>
          </div>

          <div className="grid items-stretch gap-5 xl:grid-cols-2">
            <UpcomingRenewalsCard />

            <SystemStatusCard />
          </div>
        </section>

        {/* =====================================================
            PORTFOLIO ACTIVITY
        ===================================================== */}

        <section className="mb-8">
          <div className="mb-4">
            <h2 className="text-[15px] font-semibold tracking-[-0.015em] text-[#181a20]">
              Portfolio Activity
            </h2>

            <p className="mt-1 text-[11px] text-[#85888f]">
              Contract volume, upcoming expirations, and portfolio value.
            </p>
          </div>

          <div className="grid items-start gap-5 xl:grid-cols-2">
            {/* =================================================
                CONTRACT VOLUME
            ================================================= */}

            <ChartCard
              title="Contract Volume"
              description="Contracts added to the workspace over time."
            >
              <ResponsiveContainer
                width="100%"
                height={240}
              >
                <LineChart data={data.volume_over_time}>
                  <CartesianGrid
                    vertical={false}
                    stroke="#eeeeee"
                  />

                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 10,
                      fill: "#8b8e95",
                    }}
                    dy={8}
                  />

                  <YAxis
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                    width={28}
                    tick={{
                      fontSize: 10,
                      fill: "#8b8e95",
                    }}
                  />

                  <Tooltip content={<AnalyticsTooltip />} />

                  <Line
                    type="monotone"
                    dataKey="count"
                    name="Contracts"
                    stroke="#2f9076"
                    strokeWidth={2}
                    dot={{
                      r: 3,
                      fill: "#2f9076",
                      strokeWidth: 0,
                    }}
                    activeDot={{
                      r: 4,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* =================================================
                UPCOMING EXPIRIES
            ================================================= */}

            <ChartCard
              title="Upcoming Expiries"
              description="Contracts approaching expiration by month."
            >
              <ResponsiveContainer
                width="100%"
                height={240}
              >
                <BarChart data={data.expiry_timeline}>
                  <CartesianGrid
                    vertical={false}
                    stroke="#eeeeee"
                  />

                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 10,
                      fill: "#8b8e95",
                    }}
                    dy={8}
                  />

                  <YAxis
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                    width={28}
                    tick={{
                      fontSize: 10,
                      fill: "#8b8e95",
                    }}
                  />

                  <Tooltip content={<AnalyticsTooltip />} />

                  <Bar
                    dataKey="count"
                    name="Contracts"
                    fill="#b8953f"
                    radius={[5, 5, 0, 0]}
                    maxBarSize={42}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* =================================================
                VALUE DISTRIBUTION
            ================================================= */}

            <ChartCard
              title="Contract Value Distribution"
              description="Contracts grouped by commercial value."
            >
              <ResponsiveContainer
                width="100%"
                height={240}
              >
                <BarChart
                  data={data.value_distribution}
                  layout="vertical"
                  margin={{
                    left: 8,
                  }}
                >
                  <CartesianGrid
                    horizontal={false}
                    stroke="#eeeeee"
                  />

                  <XAxis
                    type="number"
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 10,
                      fill: "#8b8e95",
                    }}
                  />

                  <YAxis
                    dataKey="bucket"
                    type="category"
                    width={90}
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 10,
                      fill: "#6f737b",
                    }}
                  />

                  <Tooltip content={<AnalyticsTooltip />} />

                  <Bar
                    dataKey="count"
                    name="Contracts"
                    fill="#2f9076"
                    radius={[0, 5, 5, 0]}
                    maxBarSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* =================================================
                APPROVAL PIPELINE
            ================================================= */}

            <ChartCard
              title="Approval Pipeline"
              description="Workflow performance and approval activity."
            >
              <div className="flex h-[240px] flex-col items-center justify-center text-center">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-[#e3e3e3] bg-[#fafafa] text-[#777b83]">
                  <Activity
                    size={16}
                    strokeWidth={1.6}
                  />
                </div>

                <p className="text-[12px] font-medium text-[#181a20]">
                  No workflow data yet
                </p>

                <p className="mt-1 max-w-xs text-[10px] leading-5 text-[#85888f]">
                  Approval metrics will appear here once workflow tracking is
                  active.
                </p>
              </div>
            </ChartCard>
          </div>
        </section>

        {/* =====================================================
            PORTFOLIO BREAKDOWN
        ===================================================== */}

        <section>
          <div className="mb-4">
            <h2 className="text-[15px] font-semibold tracking-[-0.015em] text-[#181a20]">
              Portfolio Breakdown
            </h2>

            <p className="mt-1 text-[11px] text-[#85888f]">
              Distribution of contracts by risk and processing status.
            </p>
          </div>

          <div className="grid items-start gap-5 xl:grid-cols-2">
            {/* =================================================
                RISK
            ================================================= */}

            <ChartCard
              title="Risk Distribution"
              description="Portfolio exposure by risk level."
            >
              <ResponsiveContainer
                width="100%"
                height={260}
              >
                <PieChart>
                  <Pie
                    data={data.risk_distribution}
                    dataKey="count"
                    nameKey="level"
                    cx="50%"
                    cy="45%"
                    innerRadius={55}
                    outerRadius={82}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {data.risk_distribution.map(
                      (entry: RiskDistributionEntry) => (
                        <Cell
                          key={entry.level}
                          fill={
                            RISK_COLORS[entry.level] ??
                            "#a0a3a9"
                          }
                        />
                      ),
                    )}
                  </Pie>

                  <Tooltip content={<AnalyticsTooltip />} />

                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    iconSize={7}
                    formatter={(value) => (
                      <span className="capitalize text-[10px] text-[#6f737b]">
                        {String(value).replace("_", " ")}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* =================================================
                STATUS
            ================================================= */}

            <ChartCard
              title="Contract Status"
              description="Current processing state across the repository."
            >
              <ResponsiveContainer
                width="100%"
                height={260}
              >
                <PieChart>
                  <Pie
                    data={data.status_breakdown}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="45%"
                    innerRadius={55}
                    outerRadius={82}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {data.status_breakdown.map(
                      (entry: StatusBreakdownEntry) => (
                        <Cell
                          key={entry.status}
                          fill={
                            STATUS_COLORS[entry.status] ??
                            "#a0a3a9"
                          }
                        />
                      ),
                    )}
                  </Pie>

                  <Tooltip content={<AnalyticsTooltip />} />

                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    iconSize={7}
                    formatter={(value) => (
                      <span className="capitalize text-[10px] text-[#6f737b]">
                        {String(value).replace("_", " ")}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </section>
      </div>
    </main>
  );
}