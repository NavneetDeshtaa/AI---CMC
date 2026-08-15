export interface StatusCount {
  status: string;
  count: number;
}

export interface MonthCount {
  month: string;
  count: number;
}

export interface BucketCount {
  bucket: string;
  count: number;
}

export interface RiskLevelCount {
  level: string;
  count: number;
}

export interface AnalyticsSummary {
  total_contracts: number;
  status_breakdown: StatusCount[];
  volume_over_time: MonthCount[];
  expiry_timeline: MonthCount[];
  value_distribution: BucketCount[];
  risk_distribution: RiskLevelCount[];
}