import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";

import AppPage from "../pages/AppPage";

import ContractListPage from "../pages/ContractListPage";
import ContractDetailPage from "../pages/ContractDetailPage";
import AnalyticsDashboardPage from "../pages/AnalyticsDashboardPage";
import DraftGenerationPage from "../pages/DraftGenerationPage";

import ProtectedRoute from "./ProtectedRoute";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ============================================
            PUBLIC ROUTES
        ============================================ */}

        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* ============================================
            PROTECTED ROUTES
        ============================================ */}

        <Route element={<ProtectedRoute />}>
          {/* Main authenticated application shell */}
          <Route path="/app" element={<AppPage />}>
            {/* /app redirects to contracts for now */}
            <Route
              index
              element={<Navigate to="contracts" replace />}
            />

            {/* Contract repository */}
            <Route
              path="contracts"
              element={<ContractListPage />}
            />

            {/* Contract details */}
            <Route
              path="contracts/:id"
              element={<ContractDetailPage />}
            />

            {/* Analytics */}
            <Route
              path="analytics"
              element={<AnalyticsDashboardPage />}
            />

            {/* New contract / AI draft generation */}
            <Route
              path="drafts/new"
              element={<DraftGenerationPage />}
            />
          </Route>
        </Route>

        {/* ============================================
            OPTIONAL FALLBACK
        ============================================ */}

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}