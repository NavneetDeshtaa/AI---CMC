export interface ContractTemplate {
  id: string;
  name: string;
  contract_type: string;
  description: string | null;
  clause_outline: string[];
}

export interface DraftGenerationRequest {
  template_id: string;
  customer_name: string;
  our_company_name: string;
  value: number | null;
  currency: string;
  duration_months: number;
  jurisdiction: string;
  additional_instructions: string | null;
}

export interface DraftGenerationResponse {
  id: string;
  file_name: string;
  status: string;
  source: string;
}