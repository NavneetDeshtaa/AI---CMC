import { useParams, useNavigate } from "react-router-dom";
import { useContract } from "../hooks/useContract";
import ExtractedFieldsPanel from "../components/contracts/ExtractedFieldsPanel";
import SummaryPanel from "../components/ui/SummaryPanel";

export default function ContractDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: contract, isLoading, error } = useContract(id);

  if (isLoading) {
    return <div className="max-w-4xl mx-auto py-10 px-6 text-sm text-slate-500">Loading...</div>;
  }

  if (error || !contract) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-6 text-sm text-red-600">
        Contract not found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <button
        onClick={() => navigate("/contracts")}
        className="text-sm text-slate-500 hover:text-slate-800 mb-4 transition-colors"
      >
        ← Back to contracts
      </button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">{contract.file_name}</h1>
          <p className="text-sm text-slate-500 mt-1">
            {new Date(contract.uploaded_at).toLocaleDateString()}
          </p>
        </div>
        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
          {contract.status}
        </span>
      </div>

      <ExtractedFieldsPanel fields={contract.extracted_fields} status={contract.status} />
       <div className="mt-6">
        <SummaryPanel contractId={contract.id} />
      </div>
    </div>
  );
}