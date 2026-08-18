import { useNavigate } from "react-router-dom";
import { ArrowUpRight, FileText } from "lucide-react";

import type { Contract } from "../../types/contract";
import { useRiskOverview } from "../../hooks/useRisk";
import RiskBadge from "./RiskBadge";

interface ContractTableProps {
  contracts: Contract[];
}
const statusStyles: Record<
  string,
  {
    container: string;
    dot: string;
  }
> = {
  uploaded: {
    container: "border-ink/10 bg-paper text-ink-soft",
    dot: "bg-ink-soft",
  },

  processing: {
    container: "border-gold/20 bg-gold/[0.06] text-gold",
    dot: "bg-gold",
  },

  extracted: {
    container: "border-insert/20 bg-insert/[0.06] text-insert",
    dot: "bg-insert",
  },

  failed: {
    container: "border-redline/20 bg-redline/[0.06] text-redline",
    dot: "bg-redline",
  },
};

export default function ContractTable({ contracts }: ContractTableProps) {
  const navigate = useNavigate();

  // Fetched once for the whole table -- NOT per row. This is why
  // RiskBadge takes level/score as props instead of fetching itself:
  // one bulk query here beats N individual queries for N rows.
  const { data: riskOverview } = useRiskOverview();

  const riskByContractId = new Map(
    (riskOverview ?? []).map((r) => [r.contract_id, r]),
  );

  if (contracts.length === 0) {
    return (
      <div className="flex min-h-[280px] flex-col items-center justify-center px-6 text-center">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-paper text-ink-soft">
          <FileText size={19} />
        </div>

        <p className="text-sm font-semibold text-ink">
          No contracts uploaded yet
        </p>

        <p className="mt-1 max-w-sm text-xs leading-5 text-ink-soft">
          Upload a contract to start extracting metadata, generating summaries,
          and analyzing your agreements.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse">
        <thead>
          <tr className="border-b border-ink/10 bg-paper/50 text-left">
            <th className="px-5 py-3.5">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
                Contract
              </span>
            </th>

            <th className="px-5 py-3.5">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
                Uploaded
              </span>
            </th>

            <th className="px-5 py-3.5">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
                Status
              </span>
            </th>

            <th className="px-5 py-3.5">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
                Risk
              </span>
            </th>

            <th className="w-12 px-5 py-3.5">
              <span className="sr-only">Open</span>
            </th>
          </tr>
        </thead>

        <tbody>
          {contracts.map((contract) => {
            const status =
              statusStyles[contract.status.toLowerCase()] ??
              statusStyles.uploaded;

            const risk = riskByContractId.get(contract.id);

            const uploadedDate = new Date(
              contract.uploaded_at,
            ).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            });

            return (
              <tr
                key={contract.id}
                onClick={() => navigate(`/contracts/${contract.id}`)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    navigate(`/contracts/${contract.id}`);
                  }
                }}
                tabIndex={0}
                role="button"
                className="group cursor-pointer border-b border-ink/[0.07] transition-colors last:border-b-0 hover:bg-paper/60 focus:bg-paper/60 focus:outline-none"
              >
                {/* Contract name */}

                <td className="px-5 py-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-ink/10 bg-white text-ink-soft transition-colors group-hover:border-ink/15 group-hover:text-ink">
                      <FileText size={16} />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink">
                        {contract.file_name}
                      </p>

                      <p className="mt-0.5 max-w-[360px] truncate font-mono text-[9px] text-ink-soft/60">
                        {contract.id}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Uploaded */}

                <td className="px-5 py-4">
                  <span className="text-xs text-ink-soft">{uploadedDate}</span>
                </td>

                {/* Status */}

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[10px] font-semibold capitalize ${status.container}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
                    />

                    {contract.status}
                  </span>
                </td>

                {/* Risk */}

                <td className="px-5 py-4">
                  <RiskBadge
                    level={risk?.risk_level}
                    score={risk?.risk_score}
                  />
                </td>

                {/* Action */}

                <td className="px-5 py-4 text-right">
                  <div className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-ink-soft opacity-0 transition-all duration-200 group-hover:bg-white group-hover:text-ink group-hover:opacity-100">
                    <ArrowUpRight size={14} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
