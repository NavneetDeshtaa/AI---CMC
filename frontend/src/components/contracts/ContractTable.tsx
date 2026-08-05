import { useNavigate } from "react-router-dom";
import type { Contract } from "../../types/contract";

interface ContractTableProps {
  contracts: Contract[];
}

const statusStyles: Record<string, string> = {
  uploaded: "bg-slate-100 text-slate-700",
  processing: "bg-amber-100 text-amber-700",
  extracted: "bg-emerald-100 text-emerald-700",
  failed: "bg-red-100 text-red-700",
};

export default function ContractTable({ contracts }: ContractTableProps) {
  const navigate = useNavigate();

  if (contracts.length === 0) {
    return (
      <div className="text-center py-16 text-slate-500">
        No contracts uploaded yet. Upload one to get started.
      </div>
    );
  }

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b border-slate-200 text-left text-sm text-slate-500">
          <th className="py-3 px-4 font-medium">File Name</th>
          <th className="py-3 px-4 font-medium">Uploaded By</th>
          <th className="py-3 px-4 font-medium">Uploaded At</th>
          <th className="py-3 px-4 font-medium">Status</th>
        </tr>
      </thead>
      <tbody>
        {contracts.map((contract) => (
          <tr
            key={contract.id}
            onClick={() => navigate(`/contracts/${contract.id}`)}
            className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors"
          >
            <td className="py-3 px-4 text-sm font-medium text-slate-800">
              {contract.file_name}
            </td>
            <td className="py-3 px-4 text-sm text-slate-600">
              {new Date(contract.uploaded_at).toLocaleDateString()}
            </td>
            <td className="py-3 px-4">
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles[contract.status]}`}
              >
                {contract.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
