import { getClientId } from "./clientId";

// The backend lives in its own Next.js app. This resolves the base URL once
// so every component fetches through the same helper instead of hardcoding
// relative /api/... paths that don't exist in this app.
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://3.88.6.231:4080/";

export function apiUrl(path: string) {
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * fetch() wrapper that always points at the API app and always attaches
 * X-Client-Id, so every request is attributable to a client for the
 * observability/dashboard metrics without needing real auth.
 */
export function apiFetch(path: string, init: RequestInit = {}) {
  return fetch(apiUrl(path), {
    ...init,
    headers: {
      ...(init.headers ?? {}),
      "X-Client-Id": getClientId(),
    },
  });
}
