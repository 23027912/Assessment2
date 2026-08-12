import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/count - server usage and feed statistics.
// Reports request counts per route, total feed count, and a breakdown of
// feeds by category and author, for the operational monitoring endpoints
// required by the assignment rubric ("request counts, feed statistics or
// similar server usage information").
export async function GET() {
  try {
    const [requestStats, totalFeeds, byCategory, byAuthor, latestFeed] = await Promise.all([
      prisma.requestStat.findMany({ orderBy: { count: "desc" } }),
      prisma.feed.count(),
      prisma.feed.groupBy({
        by: ["category"],
        _count: { _all: true },
        orderBy: { _count: { category: "desc" } },
      }),
      prisma.feed.groupBy({
        by: ["author"],
        _count: { _all: true },
        orderBy: { _count: { author: "desc" } },
      }),
      prisma.feed.findFirst({
        orderBy: { publishedAt: "desc" },
        select: { id: true, title: true, publishedAt: true },
      }),
    ]);

    const totalRequests = requestStats.reduce((sum, s) => sum + s.count, 0);

    return NextResponse.json({
      success: true,
      generatedAt: new Date().toISOString(),
      requests: {
        total: totalRequests,
        byRoute: requestStats,
      },
      feeds: {
        total: totalFeeds,
        byCategory: byCategory.map((c) => ({
          category: c.category ?? "Uncategorised",
          count: c._count._all,
        })),
        byAuthor: byAuthor.map((a) => ({
          author: a.author,
          count: a._count._all,
        })),
        latest: latestFeed,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
