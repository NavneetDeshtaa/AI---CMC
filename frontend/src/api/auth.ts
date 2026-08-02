import axiosInstance from "./axiosInstance";
import type { AuthResponse } from "../types/user";

export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await axiosInstance.post<AuthResponse>("/auth/login", {
    email,
    password,
  });
  return response.data;
}

export function logout(): void {
  // token clearing handled by caller via tokenStorage
}