export default function RedlineHero() {
  return (
    <div className="bg-white border border-ink/10 rounded-xl shadow-[0_1px_2px_rgba(28,35,33,0.06),0_12px_32px_-8px_rgba(28,35,33,0.12)] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-ink/10 bg-ink/[0.02]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-redline/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-gold/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-insert/60" />
        </div>
        <span className="font-mono text-[11px] text-ink-soft">MSA_Acme_Corp.pdf — clause 4.2</span>
      </div>

      <div className="p-6 font-body text-[15px] leading-relaxed text-ink">
        <p className="mb-4 text-ink-soft text-xs font-mono uppercase tracking-wide">
          Section 4.2 — Payment Terms
        </p>
        <p>
          Payment shall be due within{" "}
          <span className="line-through decoration-redline decoration-2 text-redline/70">
            thirty (30)
          </span>{" "}
          <span className="bg-insert/10 text-insert font-medium px-1 rounded">
            sixty (60)
          </span>{" "}
          days of invoice receipt, payable in the currency specified in Exhibit A.
        </p>

        <div className="mt-5 flex items-start gap-2.5 bg-gold/[0.08] border border-gold/20 rounded-lg px-4 py-3">
          <span className="font-mono text-[10px] font-semibold text-gold bg-gold/15 rounded px-1.5 py-0.5 mt-0.5">
            AI
          </span>
          <p className="text-sm text-ink-soft">
            This change extends your payment window by 30 days — favours the vendor.
            Flagged for Finance review.
          </p>
        </div>
      </div>
    </div>
  );
}