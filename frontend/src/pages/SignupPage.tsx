import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight, LockKeyhole, ShieldCheck } from "lucide-react";

import { signup } from "../api/auth";
import { tokenStorage } from "../lib/tokenStorage";
import Navbar from "../components/landing/Navbar";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      const { token } = await signup(name, email, password);

      tokenStorage.set(token);

      navigate("/app/contracts");
    } catch (err: unknown) {
      const errorMessage =
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof err.response === "object" &&
        err.response !== null &&
        "data" in err.response &&
        typeof err.response.data === "object" &&
        err.response.data !== null &&
        "detail" in err.response.data &&
        typeof err.response.data.detail === "string"
          ? err.response.data.detail
          : "Could not create account.";

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-paper text-ink">
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-insert/[0.06] blur-3xl" />

        <div className="absolute -left-40 bottom-[-180px] h-[450px] w-[450px] rounded-full bg-gold/[0.05] blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(#1C2321 1px, transparent 1px), linear-gradient(90deg, #1C2321 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <div className="relative z-10">
        <Navbar />
      </div>

      {/* =====================================================
          SIGNUP
      ===================================================== */}

      <section className="relative z-10 flex min-h-[calc(100vh-4rem)] items-center justify-center px-5 py-8 sm:px-8">
        <div className="w-full max-w-[820px]">

          {/* CARD */}

          <div className="overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-[0_24px_70px_-30px_rgba(28,35,33,0.28)]">

            {/* Accent */}

            <div className="h-1 bg-ink" />

            <div className="grid lg:grid-cols-[0.85fr_1.15fr]">

              {/* =================================================
                  BRAND PANEL
              ================================================= */}

              <div className="hidden lg:flex flex-col justify-between border-r border-ink/10 bg-paper/45 p-10">

                <div>
                  <div className="mb-8 flex h-11 w-11 items-center justify-center rounded-xl bg-ink text-paper">
                    <LockKeyhole
                      size={19}
                      strokeWidth={1.8}
                    />
                  </div>

                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
                    Contract intelligence
                  </p>

                  <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-ink">
                    Build your
                    <br />
                    contract workspace.
                  </h2>

                  <p className="mt-4 max-w-[240px] text-sm leading-6 text-ink-soft">
                    Centralize your agreements, understand risk, and bring your
                    entire contract lifecycle into one intelligent workspace.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-ink-soft">
                  <ShieldCheck size={14} />
                  Secure enterprise workspace
                </div>
              </div>

              {/* =================================================
                  FORM
              ================================================= */}

              <div className="px-7 py-9 sm:px-12 sm:py-11">

                <div className="mx-auto max-w-[440px]">

                  {/* Header */}

                  <div className="mb-7">
                    <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-soft lg:hidden">
                      New workspace
                    </p>

                    <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                      Create your account.
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-ink-soft">
                      Start managing your contracts with Clause.
                    </p>
                  </div>

                  {/* FORM */}

                  <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                  >

                    {/* Name */}

                    <div>
                      <label
                        htmlFor="name"
                        className="mb-2 block text-xs font-semibold text-ink"
                      >
                        Full name
                      </label>

                      <input
                        id="name"
                        type="text"
                        required
                        autoComplete="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Smith"
                        className="h-12 w-full rounded-lg border border-ink/15 bg-white px-4 text-sm text-ink outline-none transition-all placeholder:text-ink-soft/50 hover:border-ink/25 focus:border-ink focus:ring-4 focus:ring-ink/[0.06]"
                      />
                    </div>

                    {/* Email */}

                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-xs font-semibold text-ink"
                      >
                        Work email
                      </label>

                      <input
                        id="email"
                        type="email"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="h-12 w-full rounded-lg border border-ink/15 bg-white px-4 text-sm text-ink outline-none transition-all placeholder:text-ink-soft/50 hover:border-ink/25 focus:border-ink focus:ring-4 focus:ring-ink/[0.06]"
                      />
                    </div>

                    {/* Password */}

                    <div>
                      <label
                        htmlFor="password"
                        className="mb-2 block text-xs font-semibold text-ink"
                      >
                        Password
                      </label>

                      <input
                        id="password"
                        type="password"
                        required
                        minLength={6}
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a password"
                        className="h-12 w-full rounded-lg border border-ink/15 bg-white px-4 text-sm text-ink outline-none transition-all placeholder:text-ink-soft/50 hover:border-ink/25 focus:border-ink focus:ring-4 focus:ring-ink/[0.06]"
                      />

                      <p className="mt-2 text-[10px] text-ink-soft/70">
                        Use at least 6 characters.
                      </p>
                    </div>

                    {/* Error */}

                    {error && (
                      <div
                        role="alert"
                        className="rounded-lg border border-redline/20 bg-redline/[0.06] px-4 py-3 text-xs font-medium text-redline"
                      >
                        {error}
                      </div>
                    )}

                    {/* Submit */}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="group mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-ink text-sm font-semibold text-paper transition-all duration-200 hover:-translate-y-0.5 hover:bg-ink/90 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                    >
                      {isLoading ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-paper/30 border-t-paper" />
                          Creating account...
                        </>
                      ) : (
                        <>
                          Create account

                          <ArrowRight
                            size={16}
                            className="transition-transform duration-200 group-hover:translate-x-1"
                          />
                        </>
                      )}
                    </button>
                  </form>

                  {/* LOGIN */}

                  <div className="mt-6 text-center">
                    <p className="text-xs text-ink-soft">
                      Already have an account?{" "}
                      <Link
                        to="/login"
                        className="font-semibold text-ink transition-colors hover:text-insert"
                      >
                        Sign in
                      </Link>
                    </p>
                  </div>

                  {/* SECURITY */}

                  <div className="mt-7 flex items-center justify-center gap-3 border-t border-ink/10 pt-5">
                    <div className="flex items-center gap-1.5 text-[10px] text-ink-soft">
                      <ShieldCheck size={13} />
                      Secure authentication
                    </div>

                    <span className="h-3 w-px bg-ink/10" />

                    <div className="flex items-center gap-1.5 text-[10px] text-ink-soft">
                      <LockKeyhole size={12} />
                      Private workspace
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* Footer */}

          <p className="mt-5 text-center text-[10px] text-ink-soft/60">
            © 2026 Clause · AI-native contract intelligence
          </p>

        </div>
      </section>
    </main>
  );
}