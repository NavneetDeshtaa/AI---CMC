import { useMutation } from "@tanstack/react-query";
import { searchContracts } from "../api/contracts";
import SearchBar from "../components/ui/SearchBar";
import SearchResults from "../components/ui/SearchResults";

export default function SearchPage() {
  const mutation = useMutation({
    mutationFn: searchContracts,
  });

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-xl font-semibold text-slate-800 mb-1">
        Search contracts
      </h1>
      <p className="text-sm text-slate-500 mb-6">
        Ask questions in plain language across all your contracts.
      </p>

      <SearchBar
        onSearch={(query) => mutation.mutate(query)}
        isSearching={mutation.isPending}
      />

      {mutation.isError && (
        <div className="mt-6 border border-red-200 bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3">
          Something went wrong running that search. Please try again.
        </div>
      )}

      {mutation.isSuccess && <SearchResults result={mutation.data} />}
    </div>
  );
}