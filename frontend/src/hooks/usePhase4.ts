import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTemplates, generateDraft } from "../api/drafts";
import { getNotifications, markNotificationRead } from "../api/notifications";
import { getUpcomingObligations } from "../api/obligations";

export function useTemplates() {
  return useQuery({ queryKey: ["templates"], queryFn: getTemplates });
}

export function useGenerateDraft() {
  return useMutation({ mutationFn: generateDraft });
}

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    // Polls every 60s -- since notifications are created by a background
    // Celery job the frontend has no other way of knowing about, polling
    // is the simplest way to surface new ones without adding websockets.
    refetchInterval: 60_000,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useUpcomingObligations(days: number = 30) {
  return useQuery({
    queryKey: ["upcoming-obligations", days],
    queryFn: () => getUpcomingObligations(days),
  });
}