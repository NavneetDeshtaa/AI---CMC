import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../api/auth";
import { tokenStorage } from "../lib/tokenStorage";

export default function SignupPage() {
  const [name, setName] = useState("");
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
      const { token } = await signup(name, email, password);
      tokenStorage.set(token);
      navigate("/contracts");
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Could not create account.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-sm border border-slate-200 rounded-lg p-8 w-full max-w-sm"
      >
        <h1 className="text-xl font-semibold text-slate-800 mb-1">Create account</h1>
        <p className="text-sm text-slate-500 mb-6">Contract Intelligence Platform</p>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-600 mt-3">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-6 bg-slate-800 text-white rounded-md py-2 text-sm font-medium hover:bg-slate-900 disabled:opacity-50 transition-colors"
        >
          {isLoading ? "Creating account..." : "Create account"}
        </button>

        <p className="text-xs text-slate-500 text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-slate-800 font-medium hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}