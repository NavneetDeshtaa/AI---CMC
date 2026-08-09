import SearchBar from "../components/ui/SearchBar";

export default function SearchPage() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-xl font-semibold text-slate-800 mb-1">
        Search contracts
      </h1>
      <p className="text-sm text-slate-500 mb-6">
        Ask questions in plain language across all your contracts.
      </p>
      <SearchBar />
    </div>
  );
}