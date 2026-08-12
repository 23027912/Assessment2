import { prisma } from "./prisma";

/**
 * Increments the persisted hit counter for a given route.
 * Called at the top of each API handler so /api/count can report
 * real server usage instead of an in-memory value that resets on restart.
 */
export async function trackRequest(route: string) {
  try {
    await prisma.requestStat.upsert({
      where: { route },
      update: { count: { increment: 1 } },
      create: { route, count: 1 },
    });
  } catch (err) {
    // Never let counter failures break the actual API response
    console.error(`Failed to track request for ${route}:`, err);
  }
}
