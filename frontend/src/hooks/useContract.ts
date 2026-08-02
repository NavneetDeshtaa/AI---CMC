import { useQuery } from "@tanstack/react-query";
import { getContract } from "../api/contracts";

export function useContract(id: string | undefined) {
  return useQuery({
    queryKey: ["contract", id],
    queryFn: () => getContract(id as string),
    enabled: !!id,
  });
}