import type { RiskLevel } from "../../types/risk";

interface RiskBadgeProps {
  level: RiskLevel | undefined;
  score?: number;
}

const riskStyles: Record<RiskLevel, { container: string; dot: string }> = {
  low: {
    container: "border-insert/20 bg-insert/[0.06] text-insert",
    dot: "bg-insert",
  },
  medium: {
    container: "border-gold/20 bg-gold/[0.06] text-gold",
    dot: "bg-gold",
  },
  high: {
    container: "border-redline/20 bg-redline/[0.06] text-redline",
    dot: "bg-redline",
  },
};

export default function RiskBadge({ level, score }: RiskBadgeProps) {
  if (!level) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-paper px-2.5 py-1 text-[10px] font-semibold text-ink-soft/60">
        <span className="h-1.5 w-1.5 rounded-full bg-ink-soft/40" />
        Not analyzed
      </span>
    );
  }

  const style = riskStyles[level];

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[10px] font-semibold capitalize ${style.container}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {level} risk{score !== undefined ? ` \u00b7 ${score}` : ""}
    </span>
  );
}