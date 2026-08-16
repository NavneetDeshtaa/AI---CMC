import axiosInstance from "./axiosInstance";
import type { Notification } from "../types/tracking";

export async function getNotifications(): Promise<Notification[]> {
  const response = await axiosInstance.get<Notification[]>("/notifications");
  return response.data;
}

export async function markNotificationRead(id: string): Promise<Notification> {
  const response = await axiosInstance.patch<Notification>(`/notifications/${id}/read`);
  return response.data;
}