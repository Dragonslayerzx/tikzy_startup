import { API_BASE_URL } from "@/src/config/api";

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit,
  token?: string | null
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    let message = `HTTP error ${response.status}`;

    try {
      const data = await response.json();
      message = data?.detail || JSON.stringify(data);
    } catch {
      const text = await response.text();
      if (text) message = text;
    }

    throw new Error(message);
  }

  return response.json() as Promise<T>;
}