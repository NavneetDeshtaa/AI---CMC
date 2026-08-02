import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="border-t border-ink/10 bg-paper">
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <p className="font-display text-lg font-semibold text-ink">Clause</p>
          <p className="text-sm text-ink-soft mt-1">Every clause, covered.</p>
        </div>

        <div className="flex items-center gap-6 text-sm text-ink-soft">
          <a href="#product" className="hover:text-ink transition-colors">Product</a>
          <a href="#features" className="hover:text-ink transition-colors">Features</a>
          <button onClick={() => navigate("/login")} className="hover:text-ink transition-colors">
            Log in
          </button>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 pb-8">
        <p className="text-xs text-ink-soft/70">
          © 2026 Clause. Built for legal and operations teams who read contracts for a living.
        </p>
      </div>
    </footer>
  );
}