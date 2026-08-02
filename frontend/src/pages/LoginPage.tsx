import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, ShieldCheck, Search, BrainCircuit } from "lucide-react";

import { login } from "../api/auth";
import { tokenStorage } from "../lib/tokenStorage";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      const { token } = await login(email, password);
      tokenStorage.set(token);
      navigate("/contracts");
    } catch {
      setError("Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* LEFT PANEL */}

        <div className="hidden lg:flex flex-col justify-between bg-slate-900 text-white p-14">
          <div>
            <div className="flex items-center gap-3 mb-12">
              <div className="h-12 w-12 rounded-xl bg-white text-slate-900 flex items-center justify-center">
                <FileText size={26} />
              </div>

              <div>
                <h1 className="text-2xl font-bold">ContractIQ</h1>

                <p className="text-slate-400 text-sm">
                  AI Contract Intelligence Platform
                </p>
              </div>
            </div>

            <h2 className="text-5xl font-bold leading-tight max-w-lg">
              Review contracts with enterprise AI.
            </h2>

            <p className="mt-6 text-slate-300 text-lg leading-8 max-w-xl">
              Upload contracts, extract key information, identify risks, perform
              semantic search and accelerate legal review with AI.
            </p>
          </div>

          <div className="space-y-5">
            <Feature
              icon={<BrainCircuit size={22} />}
              title="AI Extraction"
              text="Automatically extract parties, dates, values and obligations."
            />

            <Feature
              icon={<ShieldCheck size={22} />}
              title="Risk Detection"
              text="Identify risky clauses and compliance issues instantly."
            />

            <Feature
              icon={<Search size={22} />}
              title="Semantic Search"
              text="Search contracts using natural language."
            />
          </div>
        </div>

        {/* RIGHT PANEL */}

        <div className="flex items-center justify-center p-8">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-10 shadow-xl">
            <div className="mb-8">
              <div className="lg:hidden flex items-center gap-3 mb-8">
                <div className="h-10 w-10 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                  <FileText size={20} />
                </div>

                <div>
                  <h2 className="font-bold text-lg">ContractIQ</h2>

                  <p className="text-sm text-slate-500">
                    AI Contract Intelligence
                  </p>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-slate-900">
                Welcome back
              </h1>

              <p className="mt-2 text-slate-500">
                Sign in to continue to your workspace.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@company.com"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>

                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="flex h-12 w-full items-center justify-center rounded-xl bg-slate-900 font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="mt-8 border-t border-slate-200 pt-6 text-center">
              <p className="text-sm text-slate-500">
                Enterprise-grade AI for contract lifecycle management.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type FeatureProps = {
  icon: React.ReactNode;
  title: string;
  text: string;
};

function Feature({ icon, title, text }: FeatureProps) {
  return (
    <div className="flex items-start gap-4">
      <div className="rounded-lg bg-white/10 p-3">{icon}</div>

      <div>
        <h3 className="font-semibold">{title}</h3>

        <p className="mt-1 text-sm leading-6 text-slate-400">{text}</p>
      </div>
    </div>
  );
}
