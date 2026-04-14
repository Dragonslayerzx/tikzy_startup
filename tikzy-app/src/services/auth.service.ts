import { apiFetch } from "@/src/services/api";

export type AuthUser = {
  id: number;
  full_name: string;
  email: string;
  phone?: string | null;
  is_active: boolean;
  is_operator: boolean;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
};

export type AuthResponse = {
  access_token: string;
  token_type: "bearer";
  user: AuthUser;
};

export type RegisterPayload = {
  full_name: string;
  email: string;
  phone?: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type UpdateMePayload = {
  full_name: string;
  phone?: string;
};

export async function registerUser(payload: RegisterPayload) {
  return apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function loginUser(payload: LoginPayload) {
  return apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getMe(token: string) {
  return apiFetch<AuthUser>("/auth/me", { method: "GET" }, token);
}

export async function updateMe(payload: UpdateMePayload, token: string) {
  return apiFetch<AuthUser>(
    "/users/me",
    {
      method: "PUT",
      body: JSON.stringify(payload),
    },
    token
  );
}