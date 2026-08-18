import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/health - liveness + database connectivity check.
// Used by Docker HEALTHCHECK and by the RSS Client status ticker.
export async function GET() {
  const startedAt = Date.now();

  try {
    await prisma.$queryRaw`SELECT 1`;
    const latencyMs = Date.now() - startedAt;

    return NextResponse.json({
      status: "ok",
      database: "connected",
      latencyMs,
      uptimeSeconds: process.uptime(),
      timestamp: new Date().toISOString(),
    }, { status: 200 });
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json(
      {
        status: "error",
        database: "disconnected",
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
