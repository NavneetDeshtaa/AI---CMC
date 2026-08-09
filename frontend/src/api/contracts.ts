import axiosInstance from "./axiosInstance";
import type { Contract} from "../types/contract";
import type { SearchResponse } from "../types/search";
import type { ContractSummary } from "../types/summary";

export async function getContracts(): Promise<Contract[]> {
  const response = await axiosInstance.get<Contract[]>("/contracts");
  return response.data;
}

export async function getContract(id: string): Promise<Contract> {
  const response = await axiosInstance.get<Contract>(`/contracts/${id}`);
  return response.data;
}

export async function uploadContract(file: File): Promise<Contract> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axiosInstance.post<Contract>("/contracts/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}


// Search API functions :
export async function searchContracts(query: string): Promise<SearchResponse> {
  const response = await axiosInstance.post<SearchResponse>("/search", { query });
  return response.data;
}


// Summary API functions :
export async function getSummary(contractId: string): Promise<ContractSummary> {
  const response = await axiosInstance.get<ContractSummary>(`/contracts/${contractId}/summary`);
  return response.data;
}
 
export async function regenerateSummary(contractId: string): Promise<ContractSummary> {
  const response = await axiosInstance.post<ContractSummary>(`/contracts/${contractId}/summary/regenerate`);
  return response.data;
}