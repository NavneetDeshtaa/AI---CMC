import axiosInstance from "./axiosInstance";
import type { Contract } from "../types/contract";

// ---- MOCK DATA (remove once backend endpoints exist) ----
const MOCK_CONTRACTS: Contract[] = [
  {
    id: "1",
    fileName: "MSA_Acme_Corp.pdf",
    uploadedBy: "Navneet",
    uploadedAt: "2026-07-20T10:30:00Z",
    status: "extracted",
    extractedFields: {
      parties: ["Acme Corp", "Your Company Pvt Ltd"],
      effectiveDate: "2026-01-01",
      expiryDate: "2027-01-01",
      value: 500000,
      currency: "INR",
      governingLaw: "Delhi, India",
      renewalTerms: "Auto-renews annually unless terminated with 60 days notice",
      keyClauses: ["Indemnification", "Limitation of Liability", "Confidentiality"],
    },
  },
  {
    id: "2",
    fileName: "Vendor_Agreement_TechSupply.pdf",
    uploadedBy: "Navneet",
    uploadedAt: "2026-07-22T14:15:00Z",
    status: "processing",
    extractedFields: null,
  },
  {
    id: "3",
    fileName: "NDA_StartupX.pdf",
    uploadedBy: "Navneet",
    uploadedAt: "2026-07-25T09:00:00Z",
    status: "uploaded",
    extractedFields: null,
  },
];

const MOCK_MODE = true;
// ---- END MOCK DATA ----

export async function getContracts(): Promise<Contract[]> {
  if (MOCK_MODE) {
    await new Promise((r) => setTimeout(r, 400));
    return MOCK_CONTRACTS;
  }
  const response = await axiosInstance.get<Contract[]>("/contracts");
  return response.data;
}

export async function getContract(id: string): Promise<Contract> {
  if (MOCK_MODE) {
    await new Promise((r) => setTimeout(r, 300));
    const contract = MOCK_CONTRACTS.find((c) => c.id === id);
    if (!contract) throw new Error("Contract not found");
    return contract;
  }
  const response = await axiosInstance.get<Contract>(`/contracts/${id}`);
  return response.data;
}

export async function uploadContract(file: File): Promise<Contract> {
  if (MOCK_MODE) {
    await new Promise((r) => setTimeout(r, 600));
    const newContract: Contract = {
      id: String(MOCK_CONTRACTS.length + 1),
      fileName: file.name,
      uploadedBy: "Navneet",
      uploadedAt: new Date().toISOString(),
      status: "uploaded",
      extractedFields: null,
    };
    MOCK_CONTRACTS.unshift(newContract);
    return newContract;
  }
  const formData = new FormData();
  formData.append("file", file);
  const response = await axiosInstance.post<Contract>("/contracts/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}