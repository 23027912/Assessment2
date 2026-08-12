import { NextRequest, NextResponse } from "next/server";

// The frontend now runs as its own app on a different origin/port, so every
// /api/* route needs CORS headers. FRONTEND_ORIGIN should be set to wherever
// the frontend is served from (e.g. http://localhost:3000 in dev/Docker).
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:3000";

export function middleware(req: NextRequest) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": FRONTEND_ORIGIN,
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // Preflight requests are answered here directly, before hitting the route handler
  if (req.method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers: corsHeaders });
  }

  const res = NextResponse.next();
  Object.entries(corsHeaders).forEach(([key, value]) => res.headers.set(key, value));
  return res;
}

export const config = {
  matcher: "/api/:path*",
};
