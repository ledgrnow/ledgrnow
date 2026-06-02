const API_URL ="https://ledgrnowapi-production.up.railway.app";

export type ApiResult<T> = Promise<T>;

export function getToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("ledgrnow_token");
}

export function setToken(token: string) {
  window.localStorage.setItem("ledgrnow_token", token);
}

export function clearToken() {
  window.localStorage.removeItem("ledgrnow_token");
}

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
