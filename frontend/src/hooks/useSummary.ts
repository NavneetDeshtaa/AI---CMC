import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSummary, regenerateSummary } from "../api/contracts";

export function useSummary(contractId: string | undefined) {
  return useQuery({
    queryKey: ["summary", contractId],
    queryFn: () => getSummary(contractId as string),
    enabled: !!contractId,
  });
}

export function useRegenerateSummary(contractId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => regenerateSummary(contractId as string),
    onSuccess: (data) => {
      // Update the cache directly rather than refetching -- we already
      // have the fresh summary from the response, no need for a second request.
      queryClient.setQueryData(["summary", contractId], data);
    },
  });
}