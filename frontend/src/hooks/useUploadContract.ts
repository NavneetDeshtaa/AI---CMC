import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadContract } from "../api/contracts";

export function useUploadContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadContract(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
    },
  });
}