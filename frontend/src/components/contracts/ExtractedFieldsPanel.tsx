import { CalendarDays, FileText, Globe2, RefreshCw, Users } from "lucide-react";
import type { ExtractedFields } from "../../types/contract";

interface ExtractedFieldsPanelProps {
  fields: ExtractedFields | null;
  status: string;
}

export default function ExtractedFieldsPanel({
  fields,
  status,
}: ExtractedFieldsPanelProps) {
  /* =========================================================
     EXTRACTION NOT AVAILABLE
  ========================================================= */

  if (!fields) {
    const isProcessing = status === "processing";

    return (
      <div className="rounded-xl border border-ink/10 bg-white p-8">
        <div className="flex flex-col items-center justify-center text-center">

          <div
            className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${
              isProcessing
                ? "bg-gold/[0.08] text-gold"
                : "bg-paper text-ink-soft"
            }`}
          >
            {isProcessing ? (
              <RefreshCw size={18} className="animate-spin" />
            ) : (
              <FileText size={18} />
            )}
          </div>

          <p className="text-sm font-semibold text-ink">
            {isProcessing
              ? "Extraction in progress"
              : "No extracted information yet"}
          </p>

          <p className="mt-1 max-w-sm text-xs leading-5 text-ink-soft">
            {isProcessing
              ? "Clause is analyzing the contract and extracting structured information."
              : "Extraction has not started for this contract yet."}
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-ink/10 bg-white">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="border-b border-ink/10 px-5 py-4">
        <div className="flex items-center justify-between">

          <div>
            <p className="text-sm font-semibold text-ink">
              Extracted information
            </p>

            <p className="mt-0.5 text-xs text-ink-soft">
              Key metadata identified from the agreement.
            </p>
          </div>

          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-paper text-ink-soft">
            <FileText size={15} />
          </div>

        </div>
      </div>

      {/* =====================================================
          FIELDS
      ===================================================== */}

      <div className="grid grid-cols-1 divide-y divide-ink/[0.07] sm:grid-cols-2 sm:divide-x sm:divide-y-0">

        <Field
          icon={<Users size={14} />}
          label="Parties"
          value={fields.parties?.join(" & ") ?? "—"}
        />

        <Field
          icon={<Globe2 size={14} />}
          label="Governing law"
          value={fields.governing_law ?? "—"}
        />

        <Field
          icon={<CalendarDays size={14} />}
          label="Effective date"
          value={fields.effective_date ?? "—"}
        />

        <Field
          icon={<CalendarDays size={14} />}
          label="Expiry date"
          value={fields.expiry_date ?? "—"}
        />

        <Field
          icon={<FileText size={14} />}
          label="Contract value"
          value={
            fields.value
              ? `${fields.currency ?? ""} ${fields.value.toLocaleString()}`.trim()
              : "—"
          }
        />

        <Field
          icon={<RefreshCw size={14} />}
          label="Renewal terms"
          value={fields.renewal_terms ?? "—"}
        />

      </div>

      {/* =====================================================
          KEY CLAUSES
      ===================================================== */}

      <div className="border-t border-ink/10 px-5 py-5">

        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-ink">
              Key clauses
            </p>

            <p className="mt-0.5 text-[11px] text-ink-soft">
              Clauses identified during extraction
            </p>
          </div>

          <span className="font-mono text-[9px] uppercase tracking-wider text-ink-soft/60">
            {fields.key_clauses?.length ?? 0} detected
          </span>
        </div>

        {fields.key_clauses && fields.key_clauses.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {fields.key_clauses.map((clause) => (
              <span
                key={clause}
                className="rounded-md border border-ink/10 bg-paper px-2.5 py-1.5 text-[11px] font-medium text-ink-soft transition-colors hover:border-ink/20 hover:text-ink"
              >
                {clause}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-ink-soft">
            No key clauses were identified.
          </p>
        )}

      </div>
    </div>
  );
}

/* ============================================================
   FIELD
============================================================ */

interface FieldProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function Field({
  icon,
  label,
  value,
}: FieldProps) {
  return (
    <div className="group px-5 py-4 transition-colors hover:bg-paper/40">

      <div className="mb-2 flex items-center gap-2">

        <span className="text-ink-soft/70 transition-colors group-hover:text-ink-soft">
          {icon}
        </span>

        <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
          {label}
        </p>

      </div>

      <p
        className={`text-sm leading-5 ${
          value === "—"
            ? "text-ink-soft/40"
            : "font-medium text-ink"
        }`}
      >
        {value}
      </p>

    </div>
  );
}