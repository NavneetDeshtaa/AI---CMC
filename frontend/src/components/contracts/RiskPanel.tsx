import {
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  ShieldAlert,
  XCircle,
} from "lucide-react";

import {
  useRiskAssessment,
  useRegenerateRisk,
} from "../../hooks/useRisk";

import type { RiskLevel } from "../../types/risk";

interface RiskPanelProps {
  contractId: string;
}

const levelStyles: Record<
  RiskLevel,
  {
    container: string;
    score: string;
    dot: string;
  }
> = {
  low: {
    container:
      "border-[#cfe5dd] bg-[#f0f8f5]",
    score: "text-[#28755f]",
    dot: "bg-[#2f9076]",
  },

  medium: {
    container:
      "border-[#eadfbd] bg-[#fbf7eb]",
    score: "text-[#8d7027]",
    dot: "bg-[#b8953f]",
  },

  high: {
    container:
      "border-[#efcccc] bg-[#fff4f4]",
    score: "text-[#c94b4b]",
    dot: "bg-[#d24d4d]",
  },
};

export default function RiskPanel({
  contractId,
}: RiskPanelProps) {
  const {
    data: risk,
    isLoading,
    error,
  } = useRiskAssessment(contractId);

  const regenerate =
    useRegenerateRisk(contractId);

  /* =========================================================
     LOADING
  ========================================================= */

  if (isLoading) {
    return (
      <div className="rounded-xl border border-[#e5e5e5] bg-white">
        <div className="flex min-h-[220px] flex-col items-center justify-center px-6 text-center">
          <div className="mb-3 h-5 w-5 animate-spin rounded-full border-2 border-[#dddddd] border-t-[#181a20]" />

          <p className="text-[12px] font-medium text-[#181a20]">
            Analyzing contract risk
          </p>

          <p className="mt-1 text-[11px] text-[#85888f]">
            Reviewing clauses against risk criteria...
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error || !risk) {
    return (
      <div className="rounded-xl border border-[#e5e5e5] bg-white">
        <div className="flex min-h-[220px] flex-col items-center justify-center px-6 text-center">
          <ShieldAlert
            size={18}
            strokeWidth={1.6}
            className="mb-3 text-[#92959b]"
          />

          <p className="text-[12px] font-medium text-[#181a20]">
            Risk analysis unavailable
          </p>

          <p className="mt-1 max-w-sm text-[11px] leading-5 text-[#85888f]">
            Risk analysis may still be processing for this contract.
          </p>
        </div>
      </div>
    );
  }

  const style =
    levelStyles[risk.risk_level];

  return (
    <div className="overflow-hidden rounded-xl border border-[#e5e5e5] bg-white">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex items-center justify-between border-b border-[#ececec] px-5 py-4">
        <div className="flex items-center gap-2.5">
          <ShieldAlert
            size={15}
            strokeWidth={1.7}
            className="text-[#686c74]"
          />

          <div>
            <h3 className="text-[12px] font-semibold text-[#181a20]">
              Risk Assessment
            </h3>

            <p className="mt-0.5 text-[10px] text-[#92959b]">
              AI-generated contract risk analysis.
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

      <div className="space-y-5 p-5">
        {/* =================================================
            SCORE
        ================================================= */}

        <div
          className={`flex items-center justify-between rounded-lg border px-4 py-3 ${style.container}`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`text-[26px] font-semibold tracking-[-0.04em] ${style.score}`}
            >
              {risk.risk_score}
            </span>

            <div>
              <div className="flex items-center gap-1.5">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${style.dot}`}
                />

                <p
                  className={`text-[11px] font-semibold capitalize ${style.score}`}
                >
                  {risk.risk_level} risk
                </p>
              </div>

              <p className="mt-0.5 text-[9px] text-[#9699a0]">
                Score out of 100
              </p>
            </div>
          </div>
        </div>

        {/* =================================================
            EXPLANATION
        ================================================= */}

        <div>
          <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#9da0a6]">
            Assessment
          </p>

          <p className="text-[12px] leading-5 text-[#4f535b]">
            {risk.explanation}
          </p>
        </div>

        {/* =================================================
            FLAGGED CLAUSES
        ================================================= */}

        {risk.flagged_clauses.length > 0 && (
          <div className="border-t border-[#ededed] pt-4">
            <div className="mb-3 flex items-center gap-2">
              <AlertTriangle
                size={13}
                strokeWidth={1.7}
                className="text-[#b8953f]"
              />

              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#9da0a6]">
                Flagged Clauses
              </p>
            </div>

            <div className="space-y-2">
              {risk.flagged_clauses.map(
                (clause, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-[#e7e7e7] bg-[#fafafa] px-3.5 py-3"
                  >
                    <p className="text-[11px] font-semibold text-[#181a20]">
                      {clause.clause}
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-[#6f737b]">
                      {clause.issue}
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>
        )}

        {/* =================================================
            MISSING CLAUSES
        ================================================= */}

        {risk.missing_clauses.length > 0 && (
          <div className="border-t border-[#ededed] pt-4">
            <div className="mb-3 flex items-center gap-2">
              <XCircle
                size={13}
                strokeWidth={1.7}
                className="text-[#d24d4d]"
              />

              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#9da0a6]">
                Missing Clauses
              </p>
            </div>

            <div className="space-y-2">
              {risk.missing_clauses.map(
                (clause, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-[#efd5d5] bg-[#fff8f8] px-3.5 py-3"
                  >
                    <p className="text-[11px] font-semibold text-[#181a20]">
                      {clause.clause}
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-[#6f737b]">
                      {clause.why_it_matters}
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>
        )}

        {/* =================================================
            NO ISSUES
        ================================================= */}

        {risk.flagged_clauses.length === 0 &&
          risk.missing_clauses.length === 0 && (
            <div className="flex items-start gap-2.5 rounded-lg border border-[#cfe5dd] bg-[#f0f8f5] px-3.5 py-3">
              <CheckCircle2
                size={14}
                strokeWidth={1.8}
                className="mt-0.5 shrink-0 text-[#2f9076]"
              />

              <p className="text-[11px] leading-5 text-[#28755f]">
                No issues found against baseline policy standards.
              </p>
            </div>
          )}

        {/* =================================================
            GENERATED TIME
        ================================================= */}

        <div className="border-t border-[#ededed] pt-3">
          <p className="text-[9px] text-[#a0a3a9]">
            Generated{" "}
            {new Date(
              risk.generated_at,
            ).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}