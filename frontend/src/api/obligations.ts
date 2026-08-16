import axiosInstance from "./axiosInstance";
import type { RenewalObligation } from "../types/tracking";

export async function getUpcomingObligations(days: number = 30): Promise<RenewalObligation[]> {
  const response = await axiosInstance.get<RenewalObligation[]>(`/obligations?days=${days}`);
  return response.data;
}

export async function getContractObligations(contractId: string): Promise<RenewalObligation[]> {
  const response = await axiosInstance.get<RenewalObligation[]>(`/contracts/${contractId}/obligations`);
  return response.data;
}

export async function regenerateObligations(contractId: string): Promise<RenewalObligation[]> {
  const response = await axiosInstance.post<RenewalObligation[]>(`/contracts/${contractId}/obligations/regenerate`);
  return response.data;
}

export async function completeObligation(contractId: string, obligationId: string): Promise<RenewalObligation> {
  const response = await axiosInstance.patch<RenewalObligation>(
    `/contracts/${contractId}/obligations/${obligationId}/complete`,
  );
  return response.data;
}