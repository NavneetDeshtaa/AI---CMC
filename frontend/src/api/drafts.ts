import axiosInstance from "./axiosInstance";
import type { ContractTemplate, DraftGenerationRequest, DraftGenerationResponse } from "../types/drafts";

export async function getTemplates(): Promise<ContractTemplate[]> {
  const response = await axiosInstance.get<ContractTemplate[]>("/templates");
  return response.data;
}

export async function generateDraft(payload: DraftGenerationRequest): Promise<DraftGenerationResponse> {
  const response = await axiosInstance.post<DraftGenerationResponse>("/contracts/generate", payload);
  return response.data;
}