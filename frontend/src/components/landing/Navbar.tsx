import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NotificationBell from "../notifications/NotificationBell";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileOpen(false);

    // =====================================================
    // Already on landing page
    // =====================================================

    if (location.pathname === "/") {
      const element = document.getElementById(id);

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      return;
    }

    // =====================================================
    // Coming from another page
    // =====================================================

    navigate("/", {
      state: {
        scrollTo: id,
      },
    });
  };

  return (
    <nav className="sticky top-0 z-50 bg-paper/90 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-[72px] flex items-center justify-between">

          {/* =====================================================
              LOGO
          ===================================================== */}

          <button
            onClick={() => navigate("/")}
            className="group flex items-center gap-3 shrink-0"
            aria-label="Clause home"
          >
            <span className="relative w-8 h-8 flex items-center justify-center">
              <span className="absolute inset-0 rounded-[9px] bg-brand transition-transform duration-200 group-hover:rotate-3" />

              <span className="relative text-white font-semibold text-sm tracking-tight">
                C
              </span>
            </span>

            <span className="font-body text-[22px] font-semibold tracking-[-0.04em] text-ink">
              Clause
            </span>
          </button>

          {/* =====================================================
              DESKTOP NAVIGATION
          ===================================================== */}

          <div className="hidden lg:flex items-center gap-9 ml-12 mr-auto">

            <button
              onClick={() => scrollToSection("product")}
              className="group flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-ink transition-colors"
            >
              Product

              <span className="text-[10px] text-ink-muted transition-transform duration-200 group-hover:translate-y-0.5">
                ↓
              </span>
            </button>

            <button
              onClick={() => scrollToSection("features")}
              className="group flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-ink transition-colors"
            >
              Solutions

              <span className="text-[10px] text-ink-muted transition-transform duration-200 group-hover:translate-y-0.5">
                ↓
              </span>
            </button>

            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-sm font-medium text-ink-soft hover:text-ink transition-colors"
            >
              How it works
            </button>

            <button
              onClick={() => scrollToSection("features")}
              className="text-sm font-medium text-ink-soft hover:text-ink transition-colors"
            >
              Features
            </button>

            <NotificationBell/>

          </div>

          {/* =====================================================
              DESKTOP ACTIONS
          ===================================================== */}

          <div className="hidden md:flex items-center gap-3">

            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2.5 text-sm font-medium text-ink hover:text-brand transition-colors"
            >
              Log in
            </button>

            <button
              onClick={() => navigate("/login")}
              className="group inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
            >
              Get Started

              <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                →
              </span>
            </button>

          </div>

          {/* =====================================================
              MOBILE MENU BUTTON
          ===================================================== */}

          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-white transition-colors"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <div className="w-4 flex flex-col gap-1.5">

              <span
                className={`block h-px bg-ink transition-transform duration-200 ${
                  mobileOpen
                    ? "translate-y-[4px] rotate-45"
                    : ""
                }`}
              />

              <span
                className={`block h-px bg-ink transition-opacity duration-200 ${
                  mobileOpen ? "opacity-0" : ""
                }`}
              />

              <span
                className={`block h-px bg-ink transition-transform duration-200 ${
                  mobileOpen
                    ? "-translate-y-[4px] -rotate-45"
                    : ""
                }`}
              />

            </div>
          </button>

        </div>

        {/* =====================================================
            MOBILE NAVIGATION
        ===================================================== */}

        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            mobileOpen
              ? "max-h-[420px] opacity-100 pb-6"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="pt-3 border-t border-border">

            <div className="flex flex-col">

              <button
                onClick={() => scrollToSection("product")}
                className="flex items-center justify-between py-3.5 text-left text-sm font-medium text-ink"
              >
                Product

                <span className="text-ink-muted">
                  →
                </span>
              </button>

              <button
                onClick={() => scrollToSection("features")}
                className="flex items-center justify-between py-3.5 text-left text-sm font-medium text-ink"
              >
                Solutions

                <span className="text-ink-muted">
                  →
                </span>
              </button>

              <button
                onClick={() => scrollToSection("how-it-works")}
                className="flex items-center justify-between py-3.5 text-left text-sm font-medium text-ink"
              >
                How it works

                <span className="text-ink-muted">
                  →
                </span>
              </button>

              <button
                onClick={() => scrollToSection("features")}
                className="flex items-center justify-between py-3.5 text-left text-sm font-medium text-ink"
              >
                Features

                <span className="text-ink-muted">
                  →
                </span>
              </button>

            </div>

            {/* =================================================
                MOBILE ACTIONS
            ================================================= */}

            <div className="grid grid-cols-2 gap-3 mt-4 pt-5 border-t border-border">

              <button
                onClick={() => {
                  setMobileOpen(false);
                  navigate("/login");
                }}
                className="py-3 rounded-full border border-border text-sm font-semibold hover:border-ink/30 transition-colors"
              >
                Log in
              </button>

              <button
                onClick={() => {
                  setMobileOpen(false);
                  navigate("/login");
                }}
                className="py-3 rounded-full bg-brand text-white text-sm font-semibold hover:bg-brand-dark transition-colors"
              >
                Get Started
              </button>

            </div>

          </div>
        </div>

      </div>
    </nav>
  );
}