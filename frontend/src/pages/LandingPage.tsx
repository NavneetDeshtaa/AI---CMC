import { useNavigate } from "react-router-dom";
import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";
import RedlineHero from "../components/landing/RedlineHero";

const featureGroups = [
  {
    title: "Understand every contract the moment it lands",
    description:
      "Upload contracts in any format. Clause reads them, extracts parties, dates, values, clauses, and renewal terms, and organizes everything in one searchable workspace.",
    items: ["Centralized Repository", "Automatic Data Extraction"],
  },
  {
    title: "Ask your contracts anything",
    description:
      'Skip the keyword search. Ask "which agreements have unlimited liability" or "what\'s expiring next month" and get real, cited answers — plus a plain-English summary of any contract\'s obligations and risks.',
    items: ["Natural Language Search", "AI Summarization"],
  },
  {
    title: "Know what's risky before it costs you",
    description:
      "A multi-agent risk pipeline flags missing clauses, unusual terms, and policy deviations — with a plain-English explanation of why each one matters, rolled up into a portfolio-wide dashboard.",
    items: ["Risk & Clause Analysis", "Analytics Dashboard"],
  },
  {
    title: "Draft, track, and never miss a renewal",
    description:
      "Generate new contracts from templates in minutes. Clause tracks every obligation and renewal deadline automatically, so nothing expires silently.",
    items: ["Draft Generator", "Renewal & Obligation Tracker"],
  },
  {
    title: "Approvals and redlines, without the email chain",
    description:
      "Route contracts through your real approval chain. Compare any two versions and get an AI explanation of what changed and who it favours.",
    items: ["Approval Workflow Automation", "Version Comparison & Redlining"],
  },
];

const steps = [
  { n: "01", label: "Upload", detail: "Drop in a contract, any format." },
  { n: "02", label: "Understand", detail: "AI extracts every key field." },
  { n: "03", label: "Ask", detail: "Query it in plain language." },
  { n: "04", label: "Flag", detail: "Risks surfaced automatically." },
  { n: "05", label: "Draft", detail: "Generate new contracts fast." },
  { n: "06", label: "Approve", detail: "Route, redline, and sign." },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-paper min-h-screen font-body text-ink">
      <Navbar />

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-24 grid md:grid-cols-2 gap-14 items-center">
        <div>
          <p className="font-mono text-xs text-gold uppercase tracking-widest mb-4">
            AI-Native Contract Intelligence
          </p>
          <h1 className="font-display text-5xl leading-[1.08] font-semibold text-ink mb-6">
            Every clause,
            <br />
            covered.
          </h1>
          <p className="text-lg text-ink-soft leading-relaxed mb-8 max-w-md">
            Clause reads, understands, and manages your contracts end to end —
            from the moment they're uploaded to the moment they renew.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/login")}
              className="bg-ink text-paper text-sm font-medium px-6 py-3 rounded-md hover:bg-ink/90 transition-colors"
            >
              Get Started
            </button>

            <a
              href="#how-it-works"
              className="text-sm font-medium text-ink-soft hover:text-ink transition-colors"
            >
              See how it works →
            </a>
          </div>
        </div>
        <RedlineHero />
      </section>

      {/* Problem statement */}
      <section id="product" className="border-y border-ink/10 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <p className="font-display text-2xl md:text-3xl text-ink leading-snug max-w-3xl mx-auto">
            Your contracts already know the answers. They're just buried in a
            hundred PDFs nobody has time to re-read.
          </p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="font-display text-3xl font-semibold text-ink mb-14 text-center">
          One workspace, the whole contract lifecycle
        </h2>

        <div className="space-y-14">
          {featureGroups.map((group, i) => (
            <div
              key={group.title}
              className={`grid md:grid-cols-5 gap-8 items-start ${
                i % 2 === 1 ? "md:[direction:rtl]" : ""
              }`}
            >
              <div className="md:col-span-2 md:[direction:ltr]">
                <h3 className="font-display text-xl font-semibold text-ink mb-3">
                  {group.title}
                </h3>
                <p className="text-ink-soft leading-relaxed">
                  {group.description}
                </p>
              </div>
              <div className="md:col-span-3 md:[direction:ltr] flex flex-wrap gap-3">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="text-sm font-medium bg-white border border-ink/10 text-ink px-4 py-2 rounded-full"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-ink text-paper">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <h2 className="font-display text-3xl font-semibold mb-14 text-center">
            How a contract moves through Clause
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
            {steps.map((step) => (
              <div key={step.n}>
                <p className="font-mono text-xs text-gold mb-3">{step.n}</p>
                <p className="font-display text-lg font-medium mb-1">
                  {step.label}
                </p>
                <p className="text-sm text-paper/60 leading-snug">
                  {step.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h2 className="font-display text-3xl font-semibold text-ink mb-4">
          Stop reading contracts line by line.
        </h2>
        <p className="text-ink-soft mb-8">Let Clause do the first pass.</p>
        <button
          onClick={() => navigate("/login")}
          className="bg-ink text-paper text-sm font-medium px-8 py-3.5 rounded-md hover:bg-ink/90 transition-colors"
        >
          Get Started
        </button>
      </section>

      <Footer />
    </div>
  );
}
