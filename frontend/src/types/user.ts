export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "sales" | "manager" | "legal" | "finance" | "user";
}

export interface AuthResponse {
  token: string;
  user: User;
}