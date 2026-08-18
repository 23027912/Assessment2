import { prisma } from "./prisma";

type TrackOptions = {
  route: string;
  method: string;
  clientId: string;
  feedId?: string | null;
};

/**
 * Records one row per API request (RequestLog) and bumps the cheap
 * per-route running total (RequestStat). RequestLog is what powers the
 * Assessment 3 dashboard metrics that need per-request detail: requests
 * per feed, requests per client, and unique client counts — none of which
 * a single route-level counter can answer on its own.
 */
export async function trackRequest({ route, method, clientId, feedId = null }: TrackOptions) {
  try {
    await Promise.all([
      prisma.requestLog.create({
        data: { route, method, clientId, feedId: feedId ?? undefined },
      }),
      prisma.requestStat.upsert({
        where: { route },
        update: { count: { increment: 1 } },
        create: { route, count: 1 },
      }),
    ]);
  } catch (err) {
    // Never let tracking failures break the actual API response
    console.error(`Failed to track request for ${method} ${route}:`, err);
  }
}

/**
 * Pulls a caller-supplied client id out of the X-Client-Id header. The
 * frontend generates and persists one in localStorage per browser (see
 * frontend/lib/clientId.ts) and sends it on every request. Falls back to
 * "unknown-client" for calls made without it (e.g. curl, JMeter, Playwright
 * server-side requests) so metrics still count them, just bucketed together.
 */
export function getClientId(req: Request): string {
  return req.headers.get("x-client-id")?.trim() || "unknown-client";
}
