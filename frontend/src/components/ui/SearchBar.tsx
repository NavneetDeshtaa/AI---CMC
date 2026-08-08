import { useState } from "react";
import type { FormEvent } from "react";
import { useSearch } from "../../hooks/useSearch";
import SearchResults from "./SearchResults";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const search = useSearch();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      search.mutate(query.trim());
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Ask a question, e.g. "contracts expiring next month"'
          className="flex-1 border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={search.isPending || !query.trim()}
          className="px-5 py-2.5 rounded-lg bg-slate-800 text-white text-sm font-medium hover:bg-slate-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
        >
          {search.isPending ? "Searching..." : "Search"}
        </button>
      </form>

      {search.isError && (
        <div className="mt-6 border border-red-200 bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3">
          Something went wrong running that search. Please try again.
        </div>
      )}

      {search.isSuccess && <SearchResults result={search.data} />}
    </div>
  );
}