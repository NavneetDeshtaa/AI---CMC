import { useState, useRef } from "react";
import { useUploadContract } from "../../hooks/useUploadContract";

interface UploadContractModalProps {
  open: boolean;
  onClose: () => void;
}

export default function UploadContractModal({ open, onClose }: UploadContractModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate, isPending, error } = useUploadContract();

  if (!open) return null;

  const handleSubmit = () => {
    if (!file) return;
    mutate(file, {
      onSuccess: () => {
        setFile(null);
        onClose();
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Upload Contract</h2>

        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:border-slate-400 transition-colors"
        >
          {file ? (
            <p className="text-sm text-slate-700 font-medium">{file.name}</p>
          ) : (
            <p className="text-sm text-slate-500">Click to select a PDF or Word file</p>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 mt-2">Upload failed. Please try again.</p>
        )}

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!file || isPending}
            className="px-4 py-2 text-sm bg-slate-800 text-white rounded-md hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isPending ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}