import { useRef, useState } from "react";
import {
  Check,
  FileText,
  Upload,
  X,
} from "lucide-react";

import { useUploadContract } from "../../hooks/useUploadContract";

interface UploadContractModalProps {
  open: boolean;
  onClose: () => void;
}

export default function UploadContractModal({
  open,
  onClose,
}: UploadContractModalProps) {
  const [file, setFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    mutate,
    isPending,
    error,
  } = useUploadContract();

  if (!open) return null;

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = () => {
    if (!file) return;

    mutate(file, {
      onSuccess: () => {
        setFile(null);
        onClose();
      },
    });
  };

  const handleClose = () => {
    if (isPending) return;

    setFile(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 px-4 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="upload-contract-title"
        className="w-full max-w-[520px] overflow-hidden rounded-xl border border-[#dfdfdf] bg-white shadow-[0_24px_70px_-20px_rgba(0,0,0,0.28)]"
      >
        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="flex items-start justify-between border-b border-[#ececec] px-6 py-5">
          <div>
            <h2
              id="upload-contract-title"
              className="text-[20px] font-semibold tracking-[-0.025em] text-[#181a20]"
            >
              Upload Contract
            </h2>

            <p className="mt-1 text-[12px] leading-5 text-[#7d8087]">
              Add an agreement to your workspace for contract analysis.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isPending}
            aria-label="Close upload dialog"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[#7a7e86] transition-colors hover:bg-[#f5f5f4] hover:text-[#181a20] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <X size={17} strokeWidth={1.7} />
          </button>
        </div>

        {/* =====================================================
            BODY
        ===================================================== */}

        <div className="px-6 py-6">
          {/* =================================================
              FILE UPLOAD AREA
          ================================================= */}

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isPending}
            className={`group w-full rounded-xl border border-dashed px-6 py-9 text-center transition-all ${
              file
                ? "border-[#b9d9ce] bg-[#f4faf7]"
                : "border-[#d8d8d8] bg-[#fafafa] hover:border-[#bfc1c5] hover:bg-[#f7f7f6]"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={handleFileChange}
            />

            {!file ? (
              <>
                <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-[#e0e0e0] bg-white text-[#686c74] transition-colors group-hover:text-[#181a20]">
                  <Upload
                    size={18}
                    strokeWidth={1.7}
                  />
                </div>

                <p className="text-[13px] font-semibold text-[#181a20]">
                  Choose a contract
                </p>

                <p className="mt-1 text-[11px] text-[#85888f]">
                  Click to browse files from your device
                </p>

                <div className="mt-4 flex items-center justify-center gap-2">
                  <FileType label="PDF" />
                  <FileType label="DOC" />
                  <FileType label="DOCX" />
                </div>
              </>
            ) : (
              <>
                <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-[#cfe5dd] bg-[#edf7f3] text-[#2f9076]">
                  <Check
                    size={18}
                    strokeWidth={2}
                  />
                </div>

                <p className="mx-auto max-w-[340px] truncate text-[13px] font-semibold text-[#181a20]">
                  {file.name}
                </p>

                <p className="mt-1 text-[11px] text-[#777b83]">
                  {formatFileSize(file.size)}
                </p>

                <div className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-medium text-[#2f9076]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#2f9076]" />
                  Ready to upload
                </div>

                <p className="mt-3 text-[10px] text-[#8f9298] transition-colors group-hover:text-[#555961]">
                  Click to choose another file
                </p>
              </>
            )}
          </button>

          {/* =================================================
              INFORMATION
          ================================================= */}

          <div className="mt-4 flex items-start gap-3 rounded-lg border border-[#e6e6e6] bg-[#fafafa] px-3.5 py-3">
            <FileText
              size={14}
              strokeWidth={1.6}
              className="mt-0.5 shrink-0 text-[#8b8e95]"
            />

            <p className="text-[11px] leading-[1.65] text-[#70747c]">
              Clause will extract metadata, identify key clauses, generate
              contract insights, and prepare the document for AI search.
            </p>
          </div>

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="mt-4 rounded-lg border border-[#efd0d0] bg-[#fff6f6] px-4 py-3">
              <p className="text-[11px] font-medium text-[#c94b4b]">
                Upload failed. Please try again.
              </p>
            </div>
          )}
        </div>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <div className="flex items-center justify-between border-t border-[#ececec] bg-white px-6 py-4">
          <p className="hidden text-[10px] text-[#9a9da3] sm:block">
            PDF, DOC and DOCX supported
          </p>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isPending}
              className="inline-flex h-9 items-center justify-center rounded-lg px-4 text-[12px] font-medium text-[#62666e] transition-colors hover:bg-[#f5f5f4] hover:text-[#181a20] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!file || isPending}
              className="inline-flex h-9 min-w-[104px] items-center justify-center gap-2 rounded-lg bg-[#191c24] px-4 text-[12px] font-medium text-white transition-colors hover:bg-[#292d36] disabled:cursor-not-allowed disabled:bg-[#d5d6d8] disabled:text-[#92959b]"
            >
              {isPending ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                  Uploading
                </>
              ) : (
                <>
                  <Upload
                    size={13}
                    strokeWidth={1.8}
                  />

                  Upload
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   FILE TYPE
============================================================ */

interface FileTypeProps {
  label: string;
}

function FileType({
  label,
}: FileTypeProps) {
  return (
    <span className="rounded-md border border-[#dddddd] bg-white px-2 py-1 text-[9px] font-semibold tracking-[0.04em] text-[#7c8087]">
      {label}
    </span>
  );
}

/* ============================================================
   FILE SIZE
============================================================ */

function formatFileSize(
  bytes: number,
): string {
  if (bytes === 0) {
    return "0 Bytes";
  }

  const units = [
    "Bytes",
    "KB",
    "MB",
    "GB",
  ];

  const index = Math.floor(
    Math.log(bytes) / Math.log(1024),
  );

  return `${parseFloat(
    (
      bytes /
      Math.pow(1024, index)
    ).toFixed(1),
  )} ${units[index]}`;
}