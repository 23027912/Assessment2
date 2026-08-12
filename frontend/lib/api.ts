// The backend now lives in its own Next.js app. This resolves the base URL
// once so every component fetches through the same helper instead of
// hardcoding relative /api/... paths that no longer exist in this app.
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export function apiUrl(path: string) {
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
