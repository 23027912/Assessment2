import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/count - operational metrics for the dashboard: request totals,
// requests per route/feed/client, unique client count, feed totals, and a
// feed status summary. Backed by RequestLog (per-request detail) and the
// Feed table itself, per the Assessment 3 observability requirements.
export async function GET() {
  try {
    const [
      totalRequests,
      byRoute,
      byFeedRaw,
      byClientRaw,
      uniqueClients,
      totalFeeds,
      byStatus,
      byCategory,
      byAuthor,
      latestFeed,
    ] = await Promise.all([
      prisma.requestLog.count(),

      prisma.requestLog.groupBy({
        by: ["route"],
        _count: { _all: true },
        orderBy: { _count: { route: "desc" } },
      }),

      prisma.requestLog.groupBy({
        by: ["feedId"],
        where: { feedId: { not: null } },
        _count: { _all: true },
        orderBy: { _count: { feedId: "desc" } },
        take: 10,
      }),

      prisma.requestLog.groupBy({
        by: ["clientId"],
        _count: { _all: true },
        orderBy: { _count: { clientId: "desc" } },
        take: 10,
      }),

      prisma.requestLog.findMany({
        distinct: ["clientId"],
        select: { clientId: true },
      }),

      prisma.feed.count(),

      prisma.feed.groupBy({
        by: ["status"],
        _count: { _all: true },
      }),

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

    // Attach feed titles to the per-feed request breakdown so the dashboard
    // doesn't have to do a second round trip just to label the chart.
    const feedIds = byFeedRaw.map((f) => f.feedId).filter((id): id is string => !!id);
    const feedTitles = feedIds.length
      ? await prisma.feed.findMany({
          where: { id: { in: feedIds } },
          select: { id: true, title: true },
        })
      : [];
    const titleById = new Map(feedTitles.map((f) => [f.id, f.title]));

    const requestsByFeed = byFeedRaw.map((f) => ({
      feedId: f.feedId as string,
      title: titleById.get(f.feedId as string) ?? "(deleted feed)",
      count: f._count._all,
    }));

    const requestsByClient = byClientRaw.map((c) => ({
      clientId: c.clientId,
      count: c._count._all,
    }));

    const statusSummary = { ACTIVE: 0, ERROR: 0, STALE: 0 } as Record<string, number>;
    byStatus.forEach((s) => {
      statusSummary[s.status] = s._count._all;
    });

    return NextResponse.json({
      success: true,
      generatedAt: new Date().toISOString(),
      requests: {
        total: totalRequests,
        byRoute: byRoute.map((r) => ({ route: r.route, count: r._count._all })),
        byFeed: requestsByFeed,
        byClient: requestsByClient,
      },
      clients: {
        unique: uniqueClients.length,
      },
      feeds: {
        total: totalFeeds,
        byStatus: statusSummary,
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
