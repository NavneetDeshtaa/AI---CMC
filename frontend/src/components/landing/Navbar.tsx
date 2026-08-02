import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-40 bg-paper/90 backdrop-blur-sm border-b border-ink/10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
          className="font-display text-xl font-semibold text-ink tracking-tight"
        >
          Clause
        </button>

        <div className="hidden md:flex items-center gap-8 text-sm text-ink-soft font-medium">
          <a href="#product" className="hover:text-ink transition-colors">Product</a>
          <a href="#how-it-works" className="hover:text-ink transition-colors">How it works</a>
          <a href="#features" className="hover:text-ink transition-colors">Features</a>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/login")}
            className="text-sm font-medium text-ink-soft hover:text-ink transition-colors px-3 py-2"
          >
            Log in
          </button>
          <button
            onClick={() => navigate("/login")}
            className="text-sm font-medium bg-ink text-paper px-4 py-2 rounded-md hover:bg-ink/90 transition-colors"
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}