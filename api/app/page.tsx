// This is a standalone API service — there's no UI here, just a quick
// human-readable index of what's available. The frontend app talks to
// the /api/* routes below directly.
export default function ApiIndexPage() {
  const endpoints = [
    { method: "GET", path: "/api/feeds" },
    { method: "POST", path: "/api/feeds" },
    { method: "GET", path: "/api/feeds/:id" },
    { method: "PUT", path: "/api/feeds/:id" },
    { method: "DELETE", path: "/api/feeds/:id" },
    { method: "GET", path: "/api/health" },
    { method: "GET", path: "/api/count" },
  ];

  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "48px 24px" }}>
      <p style={{ color: "#6ee7a8", fontSize: 12, letterSpacing: 2 }}>RSS SERVER API</p>
      <h1 style={{ fontSize: 28, marginTop: 8 }}>This is the backend service.</h1>
      <p style={{ color: "#8b958f", fontSize: 14, marginTop: 8 }}>
        The frontend app runs separately and calls the endpoints below.
      </p>
      <ul style={{ marginTop: 24, listStyle: "none", padding: 0, fontSize: 14 }}>
        {endpoints.map((e) => (
          <li key={e.method + e.path} style={{ padding: "6px 0", borderBottom: "1px solid #2a322d" }}>
            <span style={{ color: "#6ee7a8", display: "inline-block", width: 60 }}>{e.method}</span>
            {e.path}
          </li>
        ))}
      </ul>
    </main>
  );
}
