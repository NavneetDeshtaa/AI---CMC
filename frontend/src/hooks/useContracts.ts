import { useQuery } from "@tanstack/react-query";
import { getContracts } from "../api/contracts";

export function useContracts() {
  return useQuery({
    queryKey: ["contracts"],
    queryFn: getContracts,
  });
}