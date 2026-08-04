import axiosInstance from "./axiosInstance";
import type { AuthResponse } from "../types/user";

export async function signup(name: string, email: string, password: string): Promise<AuthResponse> {
  const response = await axiosInstance.post<AuthResponse>("/auth/signup", {
    name,
    email,
    password,
  });
  return response.data;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await axiosInstance.post<AuthResponse>("/auth/login", {
    email,
    password,
  });
  return response.data;
}