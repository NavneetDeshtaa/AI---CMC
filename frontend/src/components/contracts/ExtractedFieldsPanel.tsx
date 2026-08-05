import type { ExtractedFields } from "../../types/contract";

interface ExtractedFieldsPanelProps {
  fields: ExtractedFields | null;
  status: string;
}

export default function ExtractedFieldsPanel({
  fields,
  status,
}: ExtractedFieldsPanelProps) {
  if (!fields) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-center text-slate-500 text-sm">
        {status === "processing"
          ? "Extraction in progress..."
          : "Extraction has not started for this contract yet."}
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-5">
      <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">
        Extracted Fields
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Parties" value={fields.parties?.join(" & ") ?? "—"} />
        <Field label="Governing Law" value={fields.governing_law ?? "—"} />
        <Field label="Effective Date" value={fields.effective_date ?? "—"} />
        <Field label="Expiry Date" value={fields.expiry_date ?? "—"} />
        <Field
          label="Contract Value"
          value={
            fields.value
              ? `${fields.currency} ${fields.value.toLocaleString()}`
              : "—"
          }
        />
        <Field label="Renewal Terms" value={fields.renewal_terms ?? "—"} />
      </div>

      <div>
        <p className="text-xs font-medium text-slate-500 mb-2">Key Clauses</p>
        <div className="flex flex-wrap gap-2">
          {(fields.key_clauses ?? []).map((clause) => (
            <span
              key={clause}
              className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full"
            >
              {clause}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-500 mb-1">{label}</p>
      <p className="text-sm text-slate-800">{value}</p>
    </div>
  );
}
