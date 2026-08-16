import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { FileSignature } from "lucide-react";
import { useTemplates, useGenerateDraft } from "../../hooks/usePhase4";

export default function DraftGenerationForm() {
  const navigate = useNavigate();
  const { data: templates, isLoading: templatesLoading } = useTemplates();
  const generate = useGenerateDraft();

  const [templateId, setTemplateId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [ourCompanyName, setOurCompanyName] = useState("");
  const [value, setValue] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [durationMonths, setDurationMonths] = useState("12");
  const [jurisdiction, setJurisdiction] = useState("");
  const [additionalInstructions, setAdditionalInstructions] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    generate.mutate(
      {
        template_id: templateId,
        customer_name: customerName,
        our_company_name: ourCompanyName || "Our Company",
        value: value ? Number(value) : null,
        currency,
        duration_months: Number(durationMonths) || 12,
        jurisdiction,
        additional_instructions: additionalInstructions || null,
      },
      {
        onSuccess: (data) => navigate(`/contracts/${data.id}`),
      },
    );
  }

  const inputClass =
    "w-full rounded-lg border border-ink/10 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-soft/50 focus:outline-none focus:ring-2 focus:ring-ink/20";
  const labelClass = "mb-1.5 block text-xs font-semibold text-ink-soft";

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-ink/10 bg-white p-6 space-y-5">
      <div className="flex items-center gap-2">
        <FileSignature size={16} className="text-ink-soft" />
        <h2 className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
          Generate Contract Draft
        </h2>
      </div>

      <div>
        <label className={labelClass}>Template</label>
        <select
          required
          value={templateId}
          onChange={(e) => setTemplateId(e.target.value)}
          className={inputClass}
        >
          <option value="" disabled>
            {templatesLoading ? "Loading templates..." : "Select a template"}
          </option>
          {templates?.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Our company name</label>
          <input
            required
            value={ourCompanyName}
            onChange={(e) => setOurCompanyName(e.target.value)}
            className={inputClass}
            placeholder="Clause Inc."
          />
        </div>
        <div>
          <label className={labelClass}>Customer name</label>
          <input
            required
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className={inputClass}
            placeholder="Acme Corp"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Contract value</label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className={inputClass}
            placeholder="75000"
          />
        </div>
        <div>
          <label className={labelClass}>Currency</label>
          <input
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className={inputClass}
            placeholder="USD"
          />
        </div>
        <div>
          <label className={labelClass}>Duration (months)</label>
          <input
            type="number"
            value={durationMonths}
            onChange={(e) => setDurationMonths(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Jurisdiction / Governing Law</label>
        <input
          required
          value={jurisdiction}
          onChange={(e) => setJurisdiction(e.target.value)}
          className={inputClass}
          placeholder="Delaware, USA"
        />
      </div>

      <div>
        <label className={labelClass}>Additional instructions (optional)</label>
        <textarea
          value={additionalInstructions}
          onChange={(e) => setAdditionalInstructions(e.target.value)}
          className={inputClass}
          rows={3}
          placeholder="Any specific terms to include..."
        />
      </div>

      {generate.isError && (
        <div className="rounded-lg border border-redline/20 bg-redline/[0.06] px-4 py-2.5 text-xs text-redline">
          Something went wrong generating the draft. Please try again.
        </div>
      )}

      <button
        type="submit"
        disabled={generate.isPending || !templateId}
        className="w-full rounded-lg bg-ink px-4 py-2.5 text-sm font-semibold text-white hover:bg-ink/90 disabled:bg-ink/30 disabled:cursor-not-allowed transition-colors"
      >
        {generate.isPending ? "Generating draft..." : "Generate Draft"}
      </button>
    </form>
  );
}