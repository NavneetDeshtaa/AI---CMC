import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import ContractListPage from "../pages/ContractListPage";
import ContractDetailPage from "../pages/ContractDetailPage";
import ProtectedRoute from "./ProtectedRoute";
import AnalyticsDashboardPage from "../pages/AnalyticsDashboardPage";
import DraftGenerationPage from '../pages/DraftGenerationPage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/contracts" element={<ContractListPage />} />
          <Route path="/contracts/:id" element={<ContractDetailPage />} />
          <Route path="/analytics" element={<AnalyticsDashboardPage />} />
           <Route path="/drafts/new" element={<DraftGenerationPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}