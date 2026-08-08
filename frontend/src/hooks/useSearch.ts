import { useMutation } from "@tanstack/react-query";
import { searchContracts } from "../api/contracts";

export function useSearch() {
  return useMutation({
    mutationFn: searchContracts,
  });
}