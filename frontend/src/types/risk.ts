export type RiskLevel = "low" | "medium" | "high";

export interface RiskOverviewItem {
  contract_id: string;
  risk_score: number;
  risk_level: RiskLevel;
}

export interface FlaggedClause {
  clause: string;
  issue: string;
  severity: RiskLevel;
}

export interface MissingClause {
  clause: string;
  why_it_matters: string;
}

export interface RiskAssessment {
  risk_score: number;
  risk_level: RiskLevel;
  flagged_clauses: FlaggedClause[];
  missing_clauses: MissingClause[];
  explanation: string;
  generated_at: string;
}