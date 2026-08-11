import { useNavigate } from "react-router-dom";

import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";
import RedlineHero from "../components/landing/RedlineHero";

const featureGroups = [
  {
    number: "01",
    eyebrow: "REPOSITORY",
    title: "Every contract, understood from the moment it lands.",
    description:
      "Upload contracts in any format and let Clause automatically extract parties, dates, values, clauses, renewal terms, and other critical metadata into one searchable workspace.",
    items: ["AI Contract Repository", "Automatic Data Extraction"],
  },
  {
    number: "02",
    eyebrow: "INTELLIGENCE",
    title: "Ask your contracts questions in plain English.",
    description:
      'Forget keyword hunting. Ask questions like "Which agreements expire next month?" or "Show contracts with unlimited liability." Clause finds the answer and cites the source.',
    items: ["Natural Language Search", "AI Summarization"],
  },
  {
    number: "03",
    eyebrow: "RISK",
    title: "See what could become a problem before it does.",
    description:
      "AI analyzes clauses, identifies unusual terms, missing protections, and policy deviations, then explains the potential business impact in plain English.",
    items: ["Risk & Clause Analysis", "AI Risk Insights"],
  },
  {
    number: "04",
    eyebrow: "WORKFLOW",
    title: "Move contracts forward without the email chain.",
    description:
      "Generate contracts from templates, route them through configurable approval stages, and keep every decision and version in one place.",
    items: ["Contract Drafting", "Approval Workflows"],
  },
  {
    number: "05",
    eyebrow: "LIFECYCLE",
    title: "Know what changed, what matters, and what's next.",
    description:
      "Compare versions, understand redlines, monitor obligations, and receive timely visibility into upcoming renewals and deadlines.",
    items: ["Version Comparison", "Renewal & Obligation Tracking"],
  },
];

const lifecycle = [
  {
    number: "01",
    label: "CREATE",
    description: "Generate from approved templates.",
  },
  {
    number: "02",
    label: "REVIEW",
    description: "AI understands every clause.",
  },
  {
    number: "03",
    label: "APPROVE",
    description: "Route through your teams.",
  },
  {
    number: "04",
    label: "SIGN",
    description: "Finalize the agreement.",
  },
  {
    number: "05",
    label: "EXECUTE",
    description: "Track what was agreed.",
  },
  {
    number: "06",
    label: "MONITOR",
    description: "Watch obligations and dates.",
  },
  {
    number: "07",
    label: "RENEW",
    description: "Never miss a renewal.",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-paper text-ink font-body overflow-hidden">
      {/* =====================================================
          ANNOUNCEMENT BAR
      ===================================================== */}

      <div className="hidden md:block bg-ink text-paper">
        <div className="max-w-7xl mx-auto px-6 h-10 flex items-center justify-center">
          <p className="text-xs tracking-wide text-paper/80">
            <span className="text-brand font-medium">
              Introducing Clause AI
            </span>
            <span className="mx-3 text-paper/30">|</span>
            Contract intelligence built into every stage of your workflow.
            <button
              onClick={() =>
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="ml-3 text-paper hover:text-brand transition-colors"
            >
              Explore →
            </button>
          </p>
        </div>
      </div>

      <Navbar />

      {/* =====================================================
          HERO
      ===================================================== */}

      <main>
        <section className="relative bg-paper">
          <div className="max-w-7xl mx-auto px-6 pt-20 md:pt-28 pb-20 md:pb-24">
            <div className="max-w-5xl mx-auto text-center">
              <p className="text-sm md:text-base font-medium tracking-wide text-brand mb-7">
                AI-Native Contract Intelligence
              </p>

              <h1 className="font-body font-semibold tracking-[-0.055em] text-5xl sm:text-6xl md:text-7xl lg:text-[84px] leading-[0.98] text-ink">
                Turn every contract into
                <br />
                <span className="font-editorial font-normal text-brand">
                  business intelligence.
                </span>
              </h1>

              <p className="max-w-2xl mx-auto mt-8 text-base md:text-lg text-ink-soft leading-relaxed">
                Clause reads, understands, analyzes, and manages your
                contracts — from first draft to final renewal. One intelligent
                layer across the entire contract lifecycle.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-9">
                <button
                  onClick={() => navigate("/login")}
                  className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-brand hover:bg-brand-dark text-white px-7 py-3.5 rounded-full text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 shadow-sm"
                >
                  Get Started
                  <span className="text-lg leading-none transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </button>

                <a
                  href="#how-it-works"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-full border border-ink/20 hover:border-ink/40 text-sm font-medium transition-colors"
                >
                  <span className="w-5 h-5 rounded-full border border-ink/30 flex items-center justify-center text-[9px]">
                    ▶
                  </span>
                  See how it works
                </a>
              </div>
            </div>

            {/* Product visualization */}
            <div className="mt-16 md:mt-20">
              <RedlineHero />
            </div>
          </div>
        </section>

        {/* =====================================================
            TRUST / PRODUCT STATEMENT
        ===================================================== */}

        <section className="border-y border-border bg-white">
          <div className="max-w-7xl mx-auto px-6 py-14 md:py-16">
            <div className="grid md:grid-cols-3 gap-10 md:gap-6 items-center">
              <div className="md:col-span-2">
                <p className="text-xs uppercase tracking-[0.18em] font-mono text-ink-muted mb-4">
                  Contract intelligence, without the manual work
                </p>

                <h2 className="max-w-3xl text-3xl md:text-4xl lg:text-[46px] leading-[1.05] font-semibold tracking-[-0.04em]">
                  Your contracts already contain the answers.
                  <span className="text-ink-muted">
                    {" "}
                    Clause makes them accessible.
                  </span>
                </h2>
              </div>

              <div className="md:border-l md:border-border md:pl-8">
                <p className="text-sm leading-relaxed text-ink-soft">
                  Stop searching through hundreds of PDFs, chasing approvals
                  over email, and discovering renewal dates too late.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            AI PRODUCT PREVIEW
        ===================================================== */}

        <section className="bg-paper py-24 md:py-32">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              <div className="lg:col-span-5">
                <p className="text-xs uppercase tracking-[0.18em] font-mono text-brand mb-5">
                  AI Contract Understanding
                </p>

                <h2 className="text-4xl md:text-5xl leading-[1.02] font-semibold tracking-[-0.045em]">
                  Don't just store contracts.
                  <br />
                  <span className="font-editorial font-normal text-brand">
                    Understand them.
                  </span>
                </h2>

                <p className="mt-6 text-base text-ink-soft leading-relaxed max-w-lg">
                  Clause turns unstructured agreements into structured,
                  searchable intelligence. Every important field, clause,
                  obligation, and risk becomes accessible to your team.
                </p>

                <div className="flex flex-wrap gap-2 mt-7">
                  {[
                    "Parties",
                    "Contract Value",
                    "Renewal Date",
                    "Clauses",
                    "Obligations",
                    "Governing Law",
                  ].map((item) => (
                    <span
                      key={item}
                      className="px-3 py-1.5 rounded-full bg-white border border-border text-xs font-medium text-ink-soft"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Fake product UI */}
              <div className="lg:col-span-7">
                <div className="bg-white rounded-2xl border border-border shadow-card overflow-hidden">
                  {/* Window header */}
                  <div className="h-12 border-b border-border px-5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-danger" />
                      <span className="w-2 h-2 rounded-full bg-warning" />
                      <span className="w-2 h-2 rounded-full bg-success" />
                    </div>

                    <div className="text-[11px] font-mono text-ink-muted">
                      CLAUSE / CONTRACT
                    </div>
                  </div>

                  <div className="p-6 md:p-8">
                    <div className="flex items-start justify-between gap-4 mb-8">
                      <div>
                        <p className="text-xs text-ink-muted mb-2">
                          MASTER SERVICE AGREEMENT
                        </p>
                        <h3 className="text-xl md:text-2xl font-semibold tracking-tight">
                          Acme Corporation
                        </h3>
                      </div>

                      <span className="shrink-0 px-2.5 py-1 rounded-full bg-success-soft text-success text-[11px] font-semibold">
                        Active
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-7 border-b border-border">
                      <div>
                        <p className="text-[11px] text-ink-muted mb-1">
                          CONTRACT VALUE
                        </p>
                        <p className="font-semibold">$2.4M</p>
                      </div>

                      <div>
                        <p className="text-[11px] text-ink-muted mb-1">
                          EFFECTIVE
                        </p>
                        <p className="font-semibold">Jan 12, 2026</p>
                      </div>

                      <div>
                        <p className="text-[11px] text-ink-muted mb-1">
                          RENEWAL
                        </p>
                        <p className="font-semibold">Jan 12, 2027</p>
                      </div>

                      <div>
                        <p className="text-[11px] text-ink-muted mb-1">
                          GOVERNING LAW
                        </p>
                        <p className="font-semibold">California</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-7 mt-7">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-xs font-semibold uppercase tracking-wider">
                            AI Risk Analysis
                          </p>

                          <span className="text-[10px] font-mono text-ai">
                            AI ANALYZED
                          </span>
                        </div>

                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between p-3 rounded-lg bg-danger-soft">
                            <span className="text-xs font-medium">
                              Unlimited liability
                            </span>
                            <span className="text-[10px] font-semibold text-danger">
                              HIGH RISK
                            </span>
                          </div>

                          <div className="flex items-center justify-between p-3 rounded-lg bg-warning-soft">
                            <span className="text-xs font-medium">
                              Auto-renewal
                            </span>
                            <span className="text-[10px] font-semibold text-warning">
                              REVIEW
                            </span>
                          </div>

                          <div className="flex items-center justify-between p-3 rounded-lg bg-success-soft">
                            <span className="text-xs font-medium">
                              Governing law
                            </span>
                            <span className="text-[10px] font-semibold text-success">
                              FOUND
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider mb-4">
                          AI Summary
                        </p>

                        <div className="p-4 rounded-lg bg-ai-soft border border-ai/10">
                          <div className="flex gap-2">
                            <span className="mt-1 w-2 h-2 rounded-full bg-ai shrink-0" />

                            <p className="text-xs leading-relaxed text-ink-soft">
                              This agreement contains a broad liability
                              provision that may expose the company to
                              uncapped damages. Consider reviewing the
                              limitation language before approval.
                            </p>
                          </div>

                          <button className="mt-4 text-[11px] font-semibold text-ai hover:text-ai-dark transition-colors">
                            View source clause →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            LIFECYCLE
        ===================================================== */}

        <section
          id="how-it-works"
          className="bg-ink text-paper py-24 md:py-32"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <p className="text-xs uppercase tracking-[0.18em] font-mono text-brand mb-5">
                One intelligent lifecycle
              </p>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-[-0.045em] leading-[1]">
                From first draft
                <br />
                <span className="font-editorial font-normal text-brand">
                  to final renewal.
                </span>
              </h2>

              <p className="mt-6 text-paper/60 leading-relaxed max-w-xl mx-auto">
                Clause connects every stage of the contract lifecycle so your
                teams always know what happened, what changed, and what needs
                attention next.
              </p>
            </div>

            {/* Lifecycle ring-inspired layout */}
            <div className="relative max-w-5xl mx-auto">
              <div className="hidden md:block absolute inset-x-16 top-1/2 h-px bg-paper/10" />

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-8 relative">
                {lifecycle.map((item, index) => (
                  <div
                    key={item.number}
                    className="relative group text-center"
                  >
                    <div className="mx-auto mb-5 w-16 h-16 rounded-full bg-paper/[0.06] border border-paper/10 flex items-center justify-center group-hover:border-brand/60 group-hover:bg-brand/10 transition-all duration-300">
                      <span className="font-mono text-[11px] text-brand">
                        {item.number}
                      </span>
                    </div>

                    <p className="font-mono text-xs tracking-[0.16em] text-paper mb-2">
                      {item.label}
                    </p>

                    <p className="text-xs text-paper/45 leading-relaxed">
                      {item.description}
                    </p>

                    {index < lifecycle.length - 1 && (
                      <span className="hidden lg:block absolute top-8 -right-5 text-paper/20">
                        →
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-16 flex justify-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-paper/10 bg-paper/[0.04]">
                <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                <span className="text-xs text-paper/70">
                  Clause AI works across every stage
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            FEATURES
        ===================================================== */}

        <section id="features" className="bg-white py-24 md:py-32">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-3xl mb-16">
              <p className="text-xs uppercase tracking-[0.18em] font-mono text-brand mb-5">
                Built for the entire contract lifecycle
              </p>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-[-0.045em] leading-[1]">
                One workspace.
                <br />
                <span className="font-editorial font-normal text-brand">
                  Every contract.
                </span>
              </h2>
            </div>

            <div className="divide-y divide-border border-y border-border">
              {featureGroups.map((group) => (
                <div
                  key={group.number}
                  className="grid lg:grid-cols-12 gap-8 lg:gap-16 py-12 md:py-16 group"
                >
                  <div className="lg:col-span-2">
                    <span className="font-mono text-xs text-ink-muted">
                      {group.number}
                    </span>

                    <p className="mt-3 text-[11px] font-semibold tracking-[0.18em] text-brand">
                      {group.eyebrow}
                    </p>
                  </div>

                  <div className="lg:col-span-5">
                    <h3 className="text-2xl md:text-3xl font-semibold tracking-[-0.035em] leading-tight group-hover:text-brand transition-colors duration-300">
                      {group.title}
                    </h3>
                  </div>

                  <div className="lg:col-span-5">
                    <p className="text-sm md:text-base text-ink-soft leading-relaxed">
                      {group.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-6">
                      {group.items.map((item) => (
                        <span
                          key={item}
                          className="px-3 py-1.5 rounded-full bg-paper border border-border text-xs font-medium"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            ANALYTICS / PORTFOLIO INTELLIGENCE
        ===================================================== */}

        <section className="bg-paper py-24 md:py-32">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] font-mono text-brand mb-5">
                  Portfolio Intelligence
                </p>

                <h2 className="text-4xl md:text-5xl font-semibold tracking-[-0.045em] leading-[1.02]">
                  See your entire contract portfolio at a glance.
                </h2>

                <p className="mt-6 text-ink-soft leading-relaxed max-w-lg">
                  Move beyond individual contracts. Understand contract
                  volume, financial exposure, upcoming expirations, approval
                  bottlenecks, and AI-detected risks across your organization.
                </p>

                <button
                  onClick={() => navigate("/login")}
                  className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand-dark transition-colors"
                >
                  Explore Clause →
                </button>
              </div>

              {/* Analytics visualization */}
              <div className="bg-white border border-border rounded-2xl p-6 md:p-8 shadow-soft">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-xs text-ink-muted uppercase tracking-wider">
                      Contract Portfolio
                    </p>
                    <p className="text-2xl font-semibold mt-1">
                      $48.6M
                    </p>
                  </div>

                  <span className="text-xs px-2.5 py-1 rounded-full bg-success-soft text-success font-semibold">
                    +12.4%
                  </span>
                </div>

                <div className="flex items-end gap-3 h-40">
                  {[38, 55, 46, 72, 64, 82, 68, 92, 76, 100, 84, 96].map(
                    (height, index) => (
                      <div
                        key={index}
                        className="flex-1 h-full flex items-end"
                      >
                        <div
                          className="w-full bg-brand/15 rounded-t-sm hover:bg-brand/40 transition-colors"
                          style={{ height: `${height}%` }}
                        />
                      </div>
                    )
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4 mt-7 pt-6 border-t border-border">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-ink-muted">
                      Active
                    </p>
                    <p className="text-lg font-semibold mt-1">1,284</p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-ink-muted">
                      Renewing
                    </p>
                    <p className="text-lg font-semibold mt-1">42</p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-ink-muted">
                      At Risk
                    </p>
                    <p className="text-lg font-semibold mt-1 text-danger">
                      18
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            FINAL CTA
        ===================================================== */}

        <section className="bg-ink text-paper">
          <div className="max-w-5xl mx-auto px-6 py-24 md:py-32 text-center">
            <p className="text-xs uppercase tracking-[0.18em] font-mono text-brand mb-6">
              Contract intelligence starts here
            </p>

            <h2 className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-[-0.05em] leading-[0.98]">
              Stop managing contracts.
              <br />
              <span className="font-editorial font-normal text-brand">
                Start understanding them.
              </span>
            </h2>

            <p className="max-w-xl mx-auto mt-7 text-paper/60 leading-relaxed">
              Bring your contracts, workflows, and legal intelligence into one
              place.
            </p>

            <button
              onClick={() => navigate("/login")}
              className="group mt-9 inline-flex items-center gap-3 bg-brand hover:bg-brand-dark text-white px-8 py-4 rounded-full text-sm font-semibold transition-all hover:-translate-y-0.5"
            >
              Get Started
              <span className="text-lg transition-transform group-hover:translate-x-1">
                →
              </span>
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}