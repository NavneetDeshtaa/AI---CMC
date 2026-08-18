import { useState } from "react";

import {
  FileText,
  BarChart3,
  ClipboardCheck,
  Workflow,
  Plus,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
} from "lucide-react";

import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import NotificationBell from "../components/notifications/NotificationBell";
import { tokenStorage } from "../lib/tokenStorage";

const navigation = [
  {
    name: "All contracts",
    path: "/app/contracts",
    icon: FileText,
  },
  {
    name: "Insights",
    path: "/app/analytics",
    icon: BarChart3,
  },
  {
    name: "Obligations",
    path: "/app/obligations",
    icon: ClipboardCheck,
  },
  {
    name: "Workflow Designer",
    path: "/app/workflows",
    icon: Workflow,
  },
];

export default function AppPage() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    tokenStorage.clear();

    setSidebarOpen(false);

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-white text-[#17191f]">
      <div className="flex h-full w-full">
        {/* =====================================================
            DESKTOP SIDEBAR
        ===================================================== */}

        <aside className="hidden h-full w-[270px] shrink-0 flex-col border-r border-[#e7e7e7] bg-white lg:flex">
          <SidebarContent
            navigate={navigate}
            handleLogout={handleLogout}
          />
        </aside>

        {/* =====================================================
            MOBILE SIDEBAR
        ===================================================== */}

        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              aria-label="Close sidebar"
              onClick={() => setSidebarOpen(false)}
              className="absolute inset-0 bg-black/20"
            />

            <aside className="relative z-10 flex h-full w-[280px] flex-col bg-white shadow-xl">
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-md text-[#666a73] transition-colors hover:bg-[#f4f4f3] hover:text-[#17191f]"
                aria-label="Close sidebar"
              >
                <X size={18} />
              </button>

              <SidebarContent
                navigate={(path: string) => {
                  navigate(path);
                  setSidebarOpen(false);
                }}
                handleLogout={handleLogout}
              />
            </aside>
          </div>
        )}

        {/* =====================================================
            RIGHT SIDE
        ===================================================== */}

        <div className="flex min-w-0 flex-1 flex-col">
          {/* =================================================
              TOP NAVBAR
          ================================================= */}

          <header className="flex h-[76px] shrink-0 items-center justify-between border-b border-[#e7e7e7] bg-white px-5 sm:px-7 lg:px-9">
            {/* LEFT */}

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-md text-[#17191f] transition-colors hover:bg-[#f4f4f3] lg:hidden"
                aria-label="Open sidebar"
              >
                <Menu size={20} />
              </button>

              {/* Mobile brand */}

              <button
                type="button"
                onClick={() => navigate("/app/contracts")}
                className="font-serif text-xl font-semibold tracking-tight text-[#17191f] lg:hidden"
              >
                CLAUSE
              </button>

              {/* Desktop title */}

              <div className="hidden lg:block">
                <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#9a9ca3]">
                  Workspace
                </p>

                <p className="mt-1 text-[17px] font-medium tracking-[-0.02em] text-[#17191f]">
                  Contract Intelligence
                </p>
              </div>
            </div>

            {/* RIGHT */}

            <div className="flex items-center gap-3">
              {/* SEARCH */}

              <button
                type="button"
                className="hidden h-10 items-center gap-3 rounded-full border border-[#e3e3e3] bg-white px-4 text-sm text-[#555963] transition-colors hover:bg-[#f7f7f6] sm:flex"
              >
                <Search size={16} />

                <span>Search</span>

                <span className="ml-3 rounded-md border border-[#dddddd] bg-[#f7f7f6] px-1.5 py-0.5 text-[10px] text-[#979aa0]">
                  ⌘ K
                </span>
              </button>

              {/* NOTIFICATIONS */}

              <div className="flex h-10 items-center justify-center">
                <NotificationBell />
              </div>

              {/* ACCOUNT */}

              <div className="ml-1 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#17191f] text-[11px] font-semibold text-white">
                  ND
                </div>

                <div className="hidden xl:block">
                  <p className="text-xs font-semibold leading-none text-[#17191f]">
                    Account
                  </p>

                  <p className="mt-1 text-[10px] leading-none text-[#777b83]">
                    Workspace admin
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* =================================================
              PAGE CONTENT
          ================================================= */}

          <main className="min-h-0 flex-1 overflow-y-auto bg-white">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SIDEBAR
============================================================ */

type SidebarContentProps = {
  navigate: (path: string) => void;
  handleLogout: () => void;
};

function SidebarContent({
  navigate,
  handleLogout,
}: SidebarContentProps) {
  return (
    <>
      {/* =====================================================
          BRAND
      ===================================================== */}

      <div className="flex h-[76px] shrink-0 items-center border-b border-[#e7e7e7] px-6">
        <button
          type="button"
          onClick={() => navigate("/app/contracts")}
          className="flex items-center gap-3"
        >
          {/* Minimal symbol */}

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#17191f] text-xs font-semibold text-white">
            C
          </div>

          <div className="text-left">
            <p className="font-serif text-[18px] font-semibold tracking-[-0.025em] text-[#17191f]">
              CLAUSE
            </p>

            <p className="mt-0.5 text-[8px] font-semibold uppercase tracking-[0.2em] text-[#9a9ca3]">
              Intelligence
            </p>
          </div>
        </button>
      </div>

      {/* =====================================================
          SIDEBAR CONTENT
      ===================================================== */}

      <div className="flex min-h-0 flex-1 flex-col px-4 py-6">
        {/* WORKSPACE */}

        <p className="mb-4 px-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#a0a2a8]">
          Workspace
        </p>

        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  [
                    "group relative flex h-12 items-center gap-3 rounded-[10px] px-3 text-[14px] transition-all",

                    isActive
                      ? "bg-[#eceeef] font-medium text-[#17191f]"
                      : "font-normal text-[#31343b] hover:bg-[#f5f5f4]",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute -left-4 h-7 w-[3px] bg-[#2f9076]" />
                    )}

                    <Icon
                      size={18}
                      strokeWidth={1.7}
                      className={
                        isActive
                          ? "text-[#2f9076]"
                          : "text-[#464a52]"
                      }
                    />

                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* =================================================
            DIVIDER
        ================================================= */}

        <div className="my-7 border-t border-[#e8e8e8]" />

        {/* =================================================
            CREATE
        ================================================= */}

        <p className="mb-4 px-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#a0a2a8]">
          Create
        </p>

        <button
          type="button"
          onClick={() => navigate("/app/drafts/new")}
          className=" mt-3 flex h-10 w-full items-center gap-3 rounded-[10px] bg-[#171a22] px-4 text-left text-sm font-medium text-white transition-colors hover:bg-[#262a34]"
        >
          <Plus size={18} strokeWidth={1.8} />

          New Contract
        </button>

        {/* Push bottom nav down */}

        <div className="flex-1" />

        {/* =================================================
            BOTTOM NAV
        ================================================= */}

        <div className="border-t border-[#e8e8e8] pt-5">
          <NavLink
            to="/app/settings"
            className={({ isActive }) =>
              [
                "flex h-11 items-center gap-3 rounded-[10px] px-3 text-sm transition-colors",

                isActive
                  ? "bg-[#f0f0ef] font-medium text-[#17191f]"
                  : "text-[#4d5159] hover:bg-[#f5f5f4] hover:text-[#17191f]",
              ].join(" ")
            }
          >
            <Settings size={18} strokeWidth={1.7} />

            Settings
          </NavLink>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-1 flex h-11 w-full items-center gap-3 rounded-[10px] px-3 text-sm text-[#555963] transition-colors hover:bg-[#f5f5f4] hover:text-[#17191f]"
          >
            <LogOut size={18} strokeWidth={1.7} />

            Log out
          </button>
        </div>
      </div>
    </>
  );
}