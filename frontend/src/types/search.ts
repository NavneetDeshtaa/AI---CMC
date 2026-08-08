export interface SearchSource {
  contract_id: string;
  file_name: string;
  similarity: number | null;
}

export interface SearchResponse {
  answer: string;
  sources: SearchSource[];
}