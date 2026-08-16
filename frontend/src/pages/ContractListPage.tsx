import { useState } from "react";
import {
  FileText,
  Upload,
  FolderOpen,
  Clock3,
  AlertTriangle,
  Search,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import { useContracts } from "../hooks/useContracts";
import ContractTable from "../components/contracts/ContractTable";
import UploadContractModal from "../components/contracts/UploadContractModal";
import AIContractSearchModal from "../components/ui/AIContractSearchModal";
import Navbar from "../components/landing/Navbar";

export default function ContractListPage() {
  const { data: contracts, isLoading, error } = useContracts();

  const [uploadOpen, setUploadOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const contractCount = contracts?.length ?? 0;

  return (
    <main className="min-h-full bg-paper px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <Navbar/>
        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink text-paper">
                <FolderOpen size={15} />
              </div>

              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-soft">
                Contract repository
              </span>
            </div>

            <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Contracts
            </h1>

            <p className="mt-2 text-sm leading-6 text-ink-soft">
              Manage, search, and analyze every agreement in your workspace.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setUploadOpen(true)}
            className="group inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-ink px-4 text-sm font-semibold text-paper transition-all duration-200 hover:-translate-y-0.5 hover:bg-ink/90 hover:shadow-lg"
          >
            <Upload
              size={15}
              className="transition-transform duration-200 group-hover:-translate-y-0.5"
            />

            Upload contract
          </button>
        </div>

        {/* =====================================================
            OVERVIEW STATS
        ===================================================== */}

        <div className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatCard
            icon={<FileText size={15} />}
            label="Total contracts"
            value={contractCount.toString()}
          />

          <StatCard
            icon={<Clock3 size={15} />}
            label="Renewals approaching"
            value="—"
            muted
          />

          <StatCard
            icon={<AlertTriangle size={15} />}
            label="Contracts requiring attention"
            value="—"
            muted
          />
        </div>

        {/* =====================================================
            AI SEARCH LAUNCHER
        ===================================================== */}

        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="group mb-8 block w-full text-left"
        >
          <div className="relative overflow-hidden rounded-xl border border-ink/10 bg-white p-5 shadow-[0_8px_30px_-24px_rgba(28,35,33,0.2)] transition-all duration-200 hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-[0_14px_40px_-24px_rgba(28,35,33,0.28)]">
            {/* Subtle background accent */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-insert/[0.05] blur-3xl" />

            <div className="relative flex items-center gap-4">
              {/* Search icon */}
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-paper text-ink transition-colors group-hover:bg-ink group-hover:text-paper">
                <Search size={19} />
              </div>

              {/* Search content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold text-ink">
                    Search your contracts
                  </h2>

                  <span className="inline-flex items-center gap-1 rounded-full bg-insert/[0.08] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-insert">
                    <Sparkles size={9} />
                    AI
                  </span>
                </div>

                <p className="mt-1 truncate text-xs text-ink-soft sm:text-sm">
                  Ask questions in plain language — “Which contracts expire
                  next month?”
                </p>
              </div>

              {/* Desktop action */}
              <div className="hidden shrink-0 items-center gap-2 text-xs font-semibold text-ink-soft transition-colors group-hover:text-ink sm:flex">
                Open search

                <ArrowRight
                  size={15}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </div>

              {/* Mobile action */}
              <ArrowRight
                size={16}
                className="shrink-0 text-ink-soft sm:hidden"
              />
            </div>
          </div>
        </button>

        {/* =====================================================
            TABLE HEADER
        ===================================================== */}

        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-ink">
              All contracts
            </h2>

            <p className="mt-0.5 text-xs text-ink-soft">
              {contractCount > 0
                ? `${contractCount} contract${
                    contractCount === 1 ? "" : "s"
                  } in your workspace`
                : "Your uploaded contracts will appear here"}
            </p>
          </div>

          <button
            type="button"
            className="hidden text-xs font-medium text-ink-soft transition-colors hover:text-ink sm:block"
          >
            Manage filters
          </button>
        </div>

        {/* =====================================================
            CONTRACT TABLE
        ===================================================== */}

        <section className="overflow-hidden rounded-xl border border-ink/10 bg-white shadow-[0_12px_40px_-30px_rgba(28,35,33,0.25)]">
          {/* Loading */}
          {isLoading && (
            <div className="flex min-h-[260px] flex-col items-center justify-center px-6 text-center">
              <div className="mb-4 h-7 w-7 animate-spin rounded-full border-2 border-ink/15 border-t-ink" />

              <p className="text-sm font-medium text-ink">
                Loading contracts
              </p>

              <p className="mt-1 text-xs text-ink-soft">
                Preparing your contract repository...
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex min-h-[260px] flex-col items-center justify-center px-6 text-center">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-redline/[0.08] text-redline">
                <AlertTriangle size={17} />
              </div>

              <p className="text-sm font-semibold text-ink">
                Unable to load contracts
              </p>

              <p className="mt-1 text-xs text-ink-soft">
                Something went wrong while loading your repository.
              </p>
            </div>
          )}

          {/* Empty state */}
          {contracts &&
            contracts.length === 0 &&
            !isLoading &&
            !error && (
              <div className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-paper text-ink">
                  <FileText size={21} />
                </div>

                <h3 className="text-sm font-semibold text-ink">
                  No contracts yet
                </h3>

                <p className="mt-1 max-w-sm text-xs leading-5 text-ink-soft">
                  Upload your first contract to start extracting data,
                  identifying risks, and searching your agreements with AI.
                </p>

                <button
                  type="button"
                  onClick={() => setUploadOpen(true)}
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-2 text-xs font-semibold text-paper transition-colors hover:bg-ink/90"
                >
                  <Upload size={14} />
                  Upload your first contract
                </button>
              </div>
            )}

          {/* Contracts */}
          {contracts && contracts.length > 0 && (
            <ContractTable contracts={contracts} />
          )}
        </section>

        {/* =====================================================
            FOOTNOTE
        ===================================================== */}

        <div className="mt-4 flex items-center justify-between">
          <p className="text-[10px] text-ink-soft/60">
            Contracts are securely stored in your workspace.
          </p>

          <p className="hidden font-mono text-[10px] text-ink-soft/50 sm:block">
            CLAUSE / REPOSITORY
          </p>
        </div>
      </div>

      {/* =====================================================
          UPLOAD MODAL
      ===================================================== */}

      <UploadContractModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
      />

      {/* =====================================================
          AI SEARCH MODAL
      ===================================================== */}

      <AIContractSearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </main>
  );
}

/* ============================================================
   STAT CARD
============================================================ */

type StatCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  muted?: boolean;
};

function StatCard({
  icon,
  label,
  value,
  muted = false,
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-ink/10 bg-white px-4 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-paper text-ink-soft">
            {icon}
          </div>

          <span className="text-xs font-medium text-ink-soft">
            {label}
          </span>
        </div>

        <span
          className={`font-display text-xl font-semibold ${
            muted ? "text-ink-soft/50" : "text-ink"
          }`}
        >
          {value}
        </span>
      </div>
    </div>
  );
}