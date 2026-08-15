import axiosInstance from "./axiosInstance";
import type { AnalyticsSummary } from "../types/analytics";

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const response = await axiosInstance.get<AnalyticsSummary>("/analytics/summary");
  return response.data;
}