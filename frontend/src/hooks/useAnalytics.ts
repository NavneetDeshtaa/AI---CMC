import { useQuery } from "@tanstack/react-query";
import { getAnalyticsSummary } from "../api/analytics";

export function useAnalytics() {
  return useQuery({
    queryKey: ["analytics-summary"],
    queryFn: getAnalyticsSummary,
  });
}