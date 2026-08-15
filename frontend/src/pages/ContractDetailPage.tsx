import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  FileText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { useContract } from "../hooks/useContract";
import ExtractedFieldsPanel from "../components/contracts/ExtractedFieldsPanel";
import SummaryPanel from "../components/ui/SummaryPanel";
import RiskPanel from "../components/contracts/RiskPanel";

export default function ContractDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: contract, isLoading, error } = useContract(id);

  /* =========================================================
     LOADING
  ========================================================= */

  if (isLoading) {
    return (
      <main className="min-h-full bg-paper px-5 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="flex min-h-[500px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 h-7 w-7 animate-spin rounded-full border-2 border-ink/15 border-t-ink" />

              <p className="text-sm font-medium text-ink">Loading contract</p>

              <p className="mt-1 text-xs text-ink-soft">
                Preparing contract intelligence...
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error || !contract) {
    return (
      <main className="min-h-full bg-paper px-5 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="flex min-h-[500px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-redline/[0.08] text-redline">
                <FileText size={18} />
              </div>

              <h1 className="text-sm font-semibold text-ink">
                Contract not found
              </h1>

              <p className="mt-1 text-xs text-ink-soft">
                The contract may have been removed or you may not have access to
                it.
              </p>

              <button
                type="button"
                onClick={() => navigate("/contracts")}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-2 text-xs font-semibold text-paper transition-colors hover:bg-ink/90"
              >
                <ArrowLeft size={13} />
                Back to contracts
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const uploadedDate = new Date(contract.uploaded_at).toLocaleDateString(
    undefined,
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
  );

  return (
    <main className="min-h-full bg-paper px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        {/* =====================================================
            BACK
        ===================================================== */}

        <button
          type="button"
          onClick={() => navigate("/contracts")}
          className="group mb-6 inline-flex items-center gap-2 text-xs font-medium text-ink-soft transition-colors hover:text-ink"
        >
          <ArrowLeft
            size={14}
            className="transition-transform duration-200 group-hover:-translate-x-0.5"
          />
          Back to contracts
        </button>

        {/* =====================================================
            CONTRACT HEADER
        ===================================================== */}

        <header className="mb-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            {/* Contract identity */}

            <div className="flex min-w-0 items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink text-paper">
                <FileText size={19} />
              </div>

              <div className="min-w-0">
                <div className="mb-2 flex items-center gap-2">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-soft">
                    Contract
                  </span>

                  <span className="h-1 w-1 rounded-full bg-ink/25" />

                  <span className="font-mono text-[10px] text-ink-soft/70">
                    {contract.id}
                  </span>
                </div>

                <h1 className="truncate font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                  {contract.file_name}
                </h1>

                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-ink-soft">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays size={13} />
                    Uploaded {uploadedDate}
                  </span>

                  <span className="hidden h-3 w-px bg-ink/10 sm:block" />

                  <span className="flex items-center gap-1.5">
                    <ShieldCheck size={13} />
                    AI analyzed
                  </span>
                </div>
              </div>
            </div>

            {/* Status */}

            <ContractStatus status={contract.status} />
          </div>
        </header>

        {/* =====================================================
            AI OVERVIEW STRIP
        ===================================================== */}

        <section className="mb-6 rounded-xl border border-gold/20 bg-gold/[0.045] px-5 py-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gold/10 text-gold">
              <Sparkles size={14} />
            </div>

            <div>
              <p className="text-xs font-semibold text-ink">
                Contract intelligence
              </p>

              <p className="mt-1 text-xs leading-5 text-ink-soft">
                Clause has extracted key information from this agreement. Review
                the structured fields and AI-generated summary below.
              </p>
            </div>
          </div>
        </section>


        {/* =====================================================
            CONTENT
        ===================================================== */}

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Extracted information */}

          <section>
            <div className="mb-3">
              <p className="text-sm font-semibold text-ink">
                Extracted information
              </p>

              <p className="mt-0.5 text-xs text-ink-soft">
                Key metadata identified from the contract.
              </p>
            </div>

            <ExtractedFieldsPanel
              fields={contract.extracted_fields}
              status={contract.status}
            />
          </section>

          {/* Summary */}

          <section>
            <div className="mb-3">
              <p className="text-sm font-semibold text-ink">AI summary</p>

              <p className="mt-0.5 text-xs text-ink-soft">
                A concise overview of the agreement.
              </p>
            </div>

            <SummaryPanel contractId={contract.id} />
          </section>

                           <div className="mt-6">
          <RiskPanel contractId={contract.id} />
        </div>
        </div>

        {/* =====================================================
            FUTURE CONTRACT INTELLIGENCE
        ===================================================== */}

        <section className="mt-8 border-t border-ink/10 pt-8">
          <div className="mb-4">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-soft">
              Contract intelligence
            </p>

            <p className="mt-1 text-xs text-ink-soft">
              Additional analysis will appear here as the contract is processed.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <FutureFeature
              title="Risk analysis"
              description="Identify unusual or risky clauses."
            />

            <FutureFeature
              title="Key obligations"
              description="Track commitments and responsibilities."
            />

            <FutureFeature
              title="Renewal tracking"
              description="Monitor expiration and notice periods."
            />

            <FutureFeature
              title="Version history"
              description="Compare contract revisions and redlines."
            />
          </div>
        </section>
      </div>
    </main>
  );
}

/* ============================================================
   STATUS
============================================================ */

type ContractStatusProps = {
  status: string;
};

function ContractStatus({ status }: ContractStatusProps) {
  const normalizedStatus = status.toLowerCase();

  const isReady =
    normalizedStatus === "completed" ||
    normalizedStatus === "processed" ||
    normalizedStatus === "active";

  const isFailed =
    normalizedStatus === "failed" || normalizedStatus === "error";

  return (
    <span
      className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold ${
        isFailed
          ? "border-redline/20 bg-redline/[0.06] text-redline"
          : isReady
            ? "border-insert/20 bg-insert/[0.06] text-insert"
            : "border-gold/20 bg-gold/[0.06] text-gold"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isFailed ? "bg-redline" : isReady ? "bg-insert" : "bg-gold"
        }`}
      />

      {status}
    </span>
  );
}

/* ============================================================
   FUTURE FEATURE CARD
============================================================ */

type FutureFeatureProps = {
  title: string;
  description: string;
};

function FutureFeature({ title, description }: FutureFeatureProps) {
  return (
    <div className="rounded-xl border border-ink/10 bg-white px-4 py-4">
      <p className="text-xs font-semibold text-ink">{title}</p>

      <p className="mt-1 text-[11px] leading-5 text-ink-soft">{description}</p>

      <span className="mt-3 inline-block font-mono text-[9px] uppercase tracking-wider text-ink-soft/50">
        Coming soon
      </span>
    </div>
  );
}
