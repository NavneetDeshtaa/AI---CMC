import axiosInstance from "./axiosInstance";
import type { SystemStatus } from "../types/system";
 
export async function getSystemStatus(): Promise<SystemStatus> {
  const response = await axiosInstance.get<SystemStatus>("/system/status");
  return response.data;
}