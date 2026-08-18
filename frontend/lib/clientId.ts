const CLIENT_ID_KEY = "wire:clientId";

// A stable per-browser identifier, generated once and kept in localStorage.
// Sent as the X-Client-Id header on every API request so the backend can
// report "requests per client" and "unique client count" for the
// Assessment 3 dashboard, without requiring any real user accounts/login.
export function getClientId(): string {
  if (typeof window === "undefined") return "server";

  let id = window.localStorage.getItem(CLIENT_ID_KEY);
  if (!id) {
    id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `client-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(CLIENT_ID_KEY, id);
  }
  return id;
}