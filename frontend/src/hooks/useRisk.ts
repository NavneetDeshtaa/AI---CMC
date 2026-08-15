import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRiskOverview, getRisk, regenerateRisk } from "../api/risk";

/**
 * For the contract LIST/table. Fetches once, cheaply -- only returns
 * contracts that already have a cached RiskAssessment. Never triggers
 * generation, so opening the list page never fires off LLM calls.
 */
export function useRiskOverview() {
  return useQuery({
    queryKey: ["risk-overview"],
    queryFn: getRiskOverview,
  });
}

/**
 * For a single contract's DETAIL page. This one DOES trigger generation
 * on first call if no cached assessment exists yet (via the backend's
 * get_or_create_risk_assessment) -- appropriate here since the user has
 * explicitly opened this one specific contract.
 */
export function useRiskAssessment(contractId: string | undefined) {
  return useQuery({
    queryKey: ["risk", contractId],
    queryFn: () => getRisk(contractId as string),
    enabled: !!contractId,
  });
}

export function useRegenerateRisk(contractId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => regenerateRisk(contractId as string),
    onSuccess: (data) => {
      queryClient.setQueryData(["risk", contractId], data);
      // The list's overview cache may now be stale for this contract
      // (score/level could have changed) -- invalidate so it refetches
      // next time the list is viewed.
      queryClient.invalidateQueries({ queryKey: ["risk-overview"] });
    },
  });
}