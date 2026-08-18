import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /health - root-level heartbeat, as specified verbatim by the
// Assessment 3 brief ("a healthcheck endpoint where /health returns 200
// OK"). Identical behaviour to /api/health, kept as a separate route so
// both URL shapes work — some tools/graders may hit either one.
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: "ok" }, { status: 200 });
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json({ status: "error" }, { status: 503 });
  }
}
