import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="border-t border-border bg-paper">
      <div className="max-w-7xl mx-auto px-6">

        {/* =====================================================
            MAIN FOOTER
        ===================================================== */}

        <div className="py-14 grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand */}

          <div className="md:col-span-2">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="group flex items-center gap-3"
            >
              <span className="w-8 h-8 rounded-[9px] bg-brand flex items-center justify-center transition-transform duration-200 group-hover:rotate-3">
                <span className="text-white text-sm font-semibold">
                  P
                </span>
              </span>

              <span className="text-[21px] font-semibold tracking-[-0.04em] text-ink">
                PACTUM
              </span>
            </button>

            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink-soft">
              AI-native contract intelligence for teams that need to
              understand, manage, and act on every agreement.
            </p>

            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
              Every clause, covered.
            </p>
          </div>

          {/* Product */}

          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-ink-muted mb-5">
              Product
            </p>

            <div className="flex flex-col gap-3.5 text-sm">
              <a
                href="#product"
                className="text-ink-soft hover:text-brand transition-colors"
              >
                Overview
              </a>

              <a
                href="#features"
                className="text-ink-soft hover:text-brand transition-colors"
              >
                Features
              </a>

              <a
                href="#how-it-works"
                className="text-ink-soft hover:text-brand transition-colors"
              >
                How it works
              </a>

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-left text-ink-soft hover:text-brand transition-colors"
              >
                Get started
              </button>
            </div>
          </div>

          {/* Platform */}

          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-ink-muted mb-5">
              Platform
            </p>

            <div className="flex flex-col gap-3.5 text-sm">
              <a
                href="#features"
                className="text-ink-soft hover:text-brand transition-colors"
              >
                AI Repository
              </a>

              <a
                href="#features"
                className="text-ink-soft hover:text-brand transition-colors"
              >
                Contract Analysis
              </a>

              <a
                href="#features"
                className="text-ink-soft hover:text-brand transition-colors"
              >
                Risk Intelligence
              </a>

              <a
                href="#features"
                className="text-ink-soft hover:text-brand transition-colors"
              >
                Workflow Automation
              </a>
            </div>
          </div>
        </div>

        {/* =====================================================
            BOTTOM BAR
        ===================================================== */}

        <div className="border-t border-border py-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">

          <p className="text-xs text-ink-muted">
            © 2026 Clause. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-xs text-ink-muted">
            <button
              type="button"
              className="hover:text-ink transition-colors"
            >
              Privacy
            </button>

            <button
              type="button"
              className="hover:text-ink transition-colors"
            >
              Terms
            </button>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="hover:text-ink transition-colors"
            >
              Log in
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}