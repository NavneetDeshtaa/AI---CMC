import { useState } from "react";
import { useContracts } from "../hooks/useContracts";
import ContractTable from "../components/contracts/ContractTable";
import UploadContractModal from "../components/contracts/UploadContractModal";
import SearchBar from "../components/ui/SearchBar";

export default function ContractListPage() {
  const { data: contracts, isLoading, error } = useContracts();
  const [uploadOpen, setUploadOpen] = useState(false);

  return (
    <div className="max-w-5xl mx-auto py-10 px-6 mb-3">
      <SearchBar/>
      <div className="flex items-center justify-between mb-6 mt-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">Contracts</h1>
          <p className="text-sm text-slate-500 mt-1">
            All contracts uploaded to your workspace
          </p>
        </div>
        <button
          onClick={() => setUploadOpen(true)}
          className="bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-slate-900 transition-colors"
        >
          Upload Contract
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        {isLoading && <div className="p-8 text-center text-slate-500 text-sm">Loading contracts...</div>}
        {error && <div className="p-8 text-center text-red-600 text-sm">Failed to load contracts.</div>}
        {contracts && <ContractTable contracts={contracts} />}
      </div>

      <UploadContractModal open={uploadOpen} onClose={() => setUploadOpen(false)} />
    </div>
  );
}