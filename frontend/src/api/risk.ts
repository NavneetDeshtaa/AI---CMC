import axiosInstance from "./axiosInstance";
import type { RiskOverviewItem, RiskAssessment } from "../types/risk";

export async function getRiskOverview(): Promise<RiskOverviewItem[]> {
  const response = await axiosInstance.get<RiskOverviewItem[]>("/risk/overview");
  return response.data;
}

export async function getRisk(contractId: string): Promise<RiskAssessment> {
  const response = await axiosInstance.get<RiskAssessment>(`/contracts/${contractId}/risk`);
  return response.data;
}

export async function regenerateRisk(contractId: string): Promise<RiskAssessment> {
  const response = await axiosInstance.post<RiskAssessment>(`/contracts/${contractId}/risk/regenerate`);
  return response.data;
}