const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://ledgrnowapi-production.up.railway.app";

export type ApiResult<T> = Promise<T>;

export function getToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("ledgrnow_token");
}

export function setToken(token: string) {
  window.localStorage.setItem("ledgrnow_token", token);
  // Also write to cookie so Next.js middleware can read it server-side
  document.cookie = `ledgrnow_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

export function clearToken() {
  window.localStorage.removeItem("ledgrnow_token");
  // Clear the cookie too
  document.cookie = "ledgrnow_token=; path=/; max-age=0; SameSite=Lax";
}

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string | null;
  currency?: string;
};

export async function api<T>(path: string, options: RequestInit = {}): ApiResult<T> {
  const token = getToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error?.message ?? "Request failed");
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const formatMoney = (value: number, currency = "INR") =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(value);