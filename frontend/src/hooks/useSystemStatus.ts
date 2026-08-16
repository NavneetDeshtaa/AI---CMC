import { useQuery } from "@tanstack/react-query";
import { getSystemStatus } from "../api/system";
 
export function useSystemStatus() {
  return useQuery({
    queryKey: ["system-status"],
    queryFn: getSystemStatus,
    refetchInterval: 30_000, // recheck every 30s -- this is a live health signal, not static data
  });
}