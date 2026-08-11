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
    event: React.ChangeEvent<HTMLInputElement>
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/35 px-4 backdrop-blur-[2px]"
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
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-[0_30px_80px_-25px_rgba(28,35,33,0.3)]"
      >
        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="flex items-start justify-between border-b border-ink/10 px-6 py-5">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink text-paper">
                <Upload size={14} />
              </div>

              <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
                Contract repository
              </span>
            </div>

            <h2
              id="upload-contract-title"
              className="font-display text-xl font-semibold tracking-tight text-ink"
            >
              Upload a contract
            </h2>

            <p className="mt-1 text-xs leading-5 text-ink-soft">
              Add an agreement to your workspace for AI analysis.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isPending}
            aria-label="Close upload dialog"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-soft transition-colors hover:bg-paper hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={17} />
          </button>
        </div>

        {/* =====================================================
            BODY
        ===================================================== */}

        <div className="px-6 py-6">

          {/* Upload area */}

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isPending}
            className={`group w-full rounded-xl border border-dashed p-8 text-center transition-all ${
              file
                ? "border-insert/30 bg-insert/[0.035]"
                : "border-ink/15 bg-paper/40 hover:border-ink/30 hover:bg-paper/70"
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
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-ink-soft shadow-sm ring-1 ring-ink/10 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:text-ink">
                  <Upload size={19} />
                </div>

                <p className="text-sm font-semibold text-ink">
                  Choose a contract
                </p>

                <p className="mt-1 text-xs text-ink-soft">
                  Click to browse your files
                </p>

                <div className="mt-4 flex items-center justify-center gap-2">
                  <FileType label="PDF" />
                  <FileType label="DOC" />
                  <FileType label="DOCX" />
                </div>
              </>
            ) : (
              <>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-insert/[0.08] text-insert">
                  <Check size={20} />
                </div>

                <p className="mx-auto max-w-[300px] truncate text-sm font-semibold text-ink">
                  {file.name}
                </p>

                <p className="mt-1 text-xs text-ink-soft">
                  {formatFileSize(file.size)} · Ready for analysis
                </p>

                <span className="mt-4 inline-block text-[11px] font-semibold text-ink-soft transition-colors group-hover:text-ink">
                  Choose a different file
                </span>
              </>
            )}
          </button>

          {/* Information */}

          <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-ink/10 bg-paper/50 px-3.5 py-3">
            <FileText
              size={14}
              className="mt-0.5 shrink-0 text-ink-soft"
            />

            <p className="text-[11px] leading-5 text-ink-soft">
              After upload, Clause will extract key metadata, identify
              important clauses, and prepare the contract for AI-powered
              search and analysis.
            </p>
          </div>

          {/* Error */}

          {error && (
            <div className="mt-4 rounded-lg border border-redline/20 bg-redline/[0.06] px-4 py-3">
              <p className="text-xs font-medium text-redline">
                Upload failed. Please try again.
              </p>
            </div>
          )}

        </div>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <div className="flex items-center justify-between border-t border-ink/10 bg-paper/30 px-6 py-4">

          <p className="hidden text-[10px] text-ink-soft sm:block">
            Supported formats: PDF, DOC, DOCX
          </p>

          <div className="ml-auto flex items-center gap-2">

            <button
              type="button"
              onClick={handleClose}
              disabled={isPending}
              className="rounded-lg px-4 py-2 text-xs font-semibold text-ink-soft transition-colors hover:bg-paper hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!file || isPending}
              className="inline-flex min-w-[100px] items-center justify-center gap-2 rounded-lg bg-ink px-4 py-2 text-xs font-semibold text-paper transition-all hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isPending ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-paper/30 border-t-paper" />
                  Uploading
                </>
              ) : (
                <>
                  <Upload size={13} />
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
   FILE TYPE BADGE
============================================================ */

interface FileTypeProps {
  label: string;
}

function FileType({ label }: FileTypeProps) {
  return (
    <span className="rounded-md border border-ink/10 bg-white px-2 py-1 font-mono text-[9px] font-semibold text-ink-soft">
      {label}
    </span>
  );
}

/* ============================================================
   FILE SIZE
============================================================ */

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const units = ["Bytes", "KB", "MB", "GB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${parseFloat(
    (bytes / Math.pow(1024, index)).toFixed(1)
  )} ${units[index]}`;
}