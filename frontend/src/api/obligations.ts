import axiosInstance from "./axiosInstance";
import type { RenewalObligation } from "../types/tracking";

export async function getUpcomingObligations(days: number = 30): Promise<RenewalObligation[]> {
  const response = await axiosInstance.get<RenewalObligation[]>(`/obligations?days=${days}`);
  return response.data;
}