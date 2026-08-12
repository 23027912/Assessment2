import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export const dynamic = "force-dynamic";

// GET /api/count - reports request counts per route plus total feed count.
// Demonstrates server usage / operational monitoring for the assignment rubric.
export async function GET() {
  try {
    const [stats, totalFeeds] = await Promise.all([
      prisma.requestStat.findMany({ orderBy: { count: "desc" } }),
      prisma.feed.count(),
    ]);

    const totalRequests = stats.reduce((sum: number, s: any) => sum + s.count, 0);

    return NextResponse.json({
      success: true,
      totalRequests,
      totalFeeds,
      byRoute: stats,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
