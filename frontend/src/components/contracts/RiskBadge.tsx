import type { RiskLevel } from "../../types/risk";

interface RiskBadgeProps {
  level: RiskLevel | undefined;
  score?: number;
}

const riskStyles: Record<
  RiskLevel,
  {
    container: string;
    dot: string;
  }
> = {
  low: {
    container:
      "border-[#cfe5dd] bg-[#f0f8f5] text-[#28755f]",
    dot: "bg-[#2f9076]",
  },

  medium: {
    container:
      "border-[#eadfbd] bg-[#fbf7eb] text-[#8d7027]",
    dot: "bg-[#b8953f]",
  },

  high: {
    container:
      "border-[#efcccc] bg-[#fff4f4] text-[#c94b4b]",
    dot: "bg-[#d24d4d]",
  },
};

export default function RiskBadge({
  level,
  score,
}: RiskBadgeProps) {
  /* =========================================================
     NOT ANALYZED
  ========================================================= */

  if (!level) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e0e0e0] bg-[#fafafa] px-2.5 py-1 text-[10px] font-medium text-[#8b8e95]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#b7b9bd]" />

        Not analyzed
      </span>
    );
  }

  const style = riskStyles[level];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium ${style.container}`}
    >
      {/* Risk indicator */}

      <span
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${style.dot}`}
      />

      {/* Risk level */}

      <span className="capitalize">
        {level} risk
      </span>

      {/* Score */}

      {score !== undefined && (
        <>
          <span className="opacity-40">·</span>

          <span className="tabular-nums">
            {score}
          </span>
        </>
      )}
    </span>
  );
}