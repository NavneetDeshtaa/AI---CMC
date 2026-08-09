export interface ImportantDate {
  label: string;
  date: string | null;
}

export interface ContractSummary {
  overview: string;
  key_obligations: string[];
  payment_terms: string;
  important_dates: ImportantDate[];
  risks_flagged: string[];
  generated_at: string;
}