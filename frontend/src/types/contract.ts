export interface ExtractedFields {
  parties: string[];
  effectiveDate: string;
  expiryDate: string;
  value: number;
  currency: string;
  governingLaw: string;
  renewalTerms: string;
  keyClauses: string[];
}

export type ContractStatus = "uploaded" | "processing" | "extracted" | "failed";

export interface Contract {
  id: string;
  fileName: string;
  uploadedBy: string;
  uploadedAt: string;
  status: ContractStatus;
  extractedFields: ExtractedFields | null;
}