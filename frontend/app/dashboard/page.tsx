"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { CountStats, HealthStatus } from "@/lib/types";

const STATUS_COLOR: Record<string, string> = {
  ACTIVE: "text-signal border-signal",
  ERROR: "text-alert border-alert",
  STALE: "text-muted border-muted",
};

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="border border-border bg-surface rounded-sm p-4">
      <p className="font-mono text-[11px] text-muted tracking-widest">{label}</p>
      <p className="font-sans text-3xl font-bold mt-1">{value}</p>
      {sub && <p className="text-xs text-muted mt-1">{sub}</p>}
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-border bg-surface rounded-sm p-4 flex flex-col gap-3">
      <p className="font-mono text-[11px] text-signal tracking-widest">{title}</p>
      {children}
    </div>
  );
}

export default function DashboardPage() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [stats, setStats] = useState<CountStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setError(null);
    try {
      const [h, c] = await Promise.all([
        apiFetch("/api/health").then((r) => r.json()),
        apiFetch("/api/count").then((r) => r.json()),
      ]);
      setHealth(h);
      if (!c.success) throw new Error(c.error || "Failed to load metrics");
      setStats(c);
    } catch (err: any) {
      // Surfaces a real failed-fetch state rather than silently showing
      // stale or empty data — required by the observability brief.
      setError(err.message ?? "Could not reach the RSS Server for metrics");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 8000);
    return () => clearInterval(interval);
  }, [load]);

  const isUp = health?.status === "ok";
  const statusCounts = stats?.feeds.byStatus ?? { ACTIVE: 0, ERROR: 0, STALE: 0 };
  const noFeeds = stats && stats.feeds.total === 0;
  const hasErrorFeeds = statusCounts.ERROR > 0;
  const hasStaleFeeds = statusCounts.STALE > 0;

  return (
    <main className="flex-1">
      <div className="max-w-5xl mx-auto px-6 pt-6 pb-2 w-full">
        <p className="font-mono text-xs text-signal tracking-[0.3em]">OBSERVABILITY</p>
        <h1 className="font-sans text-3xl sm:text-4xl font-bold mt-1 tracking-tight">Dashboard</h1>
        <p className="text-muted text-sm mt-1 max-w-xl">
          Live health, database and traffic metrics for the RSS Server, pulled from{" "}
          <code className="font-mono text-xs">/api/health</code> and{" "}
          <code className="font-mono text-xs">/api/count</code>. Refreshes every 8s.
        </p>
      </div>

      <div className="max-w-5xl mx-auto w-full px-6 py-8 flex flex-col gap-6">
        {/* Alert / warning banners for real failure states */}
        {error && (
          <div role="alert" className="border border-alert text-alert font-mono text-xs px-4 py-3 rounded-sm">
            ⚠ FAILED TO FETCH METRICS — {error}
          </div>
        )}
        {!error && health && !isUp && (
          <div role="alert" className="border border-alert text-alert font-mono text-xs px-4 py-3 rounded-sm">
            ⚠ SERVER REPORTED UNHEALTHY — database may be disconnected
          </div>
        )}
        {!error && noFeeds && (
          <div role="alert" className="border border-border text-muted font-mono text-xs px-4 py-3 rounded-sm">
            ⚠ NO FEEDS IN THE DATABASE — publish an entry or run the seed script
          </div>
        )}
        {!error && hasErrorFeeds && (
          <div role="alert" className="border border-alert text-alert font-mono text-xs px-4 py-3 rounded-sm">
            ⚠ {statusCounts.ERROR} FEED{statusCounts.ERROR === 1 ? "" : "S"} IN ERROR STATE
          </div>
        )}
        {!error && hasStaleFeeds && (
          <div role="alert" className="border border-border text-muted font-mono text-xs px-4 py-3 rounded-sm">
            ⚠ {statusCounts.STALE} STALE FEED{statusCounts.STALE === 1 ? "" : "S"} — no recent updates
          </div>
        )}

        {/* Top-level health + totals */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="border border-border bg-surface rounded-sm p-4">
            <p className="font-mono text-[11px] text-muted tracking-widest">SERVER</p>
            <p className={`font-sans text-2xl font-bold mt-1 ${isUp ? "text-signal" : "text-alert"}`}>
              {loading ? "…" : isUp ? "ONLINE" : "DOWN"}
            </p>
            <p className="text-xs text-muted mt-1">
              DB {health?.database ?? "unknown"} · {health?.latencyMs ?? "--"}ms
            </p>
          </div>
          <StatCard label="TOTAL REQUESTS" value={stats?.requests.total ?? "--"} />
          <StatCard label="UNIQUE CLIENTS" value={stats?.clients.unique ?? "--"} />
          <StatCard label="TOTAL FEEDS" value={stats?.feeds.total ?? "--"} />
        </div>

        {/* Feed status summary */}
        <Panel title="FEED STATUS SUMMARY">
          <div className="flex gap-3 flex-wrap">
            {(["ACTIVE", "ERROR", "STALE"] as const).map((s) => (
              <div
                key={s}
                className={`flex items-center gap-2 border rounded-sm px-3 py-2 font-mono text-xs ${STATUS_COLOR[s]}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {s} · {statusCounts[s] ?? 0}
              </div>
            ))}
          </div>
        </Panel>

        <div className="grid sm:grid-cols-2 gap-6">
          {/* Requests per route */}
          <Panel title="REQUESTS BY ROUTE">
            {stats?.requests.byRoute.length ? (
              <ul className="flex flex-col gap-1.5 text-sm">
                {stats.requests.byRoute.map((r) => (
                  <li key={r.route} className="flex justify-between border-b border-border/60 py-1">
                    <span className="font-mono text-xs text-muted">{r.route}</span>
                    <span className="font-mono text-xs text-ink">{r.count}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-muted font-mono">No requests logged yet.</p>
            )}
          </Panel>

          {/* Requests per client */}
          <Panel title="REQUESTS BY CLIENT (TOP 10)">
            {stats?.requests.byClient.length ? (
              <ul className="flex flex-col gap-1.5 text-sm">
                {stats.requests.byClient.map((c) => (
                  <li key={c.clientId} className="flex justify-between border-b border-border/60 py-1">
                    <span className="font-mono text-xs text-muted truncate max-w-[60%]">{c.clientId}</span>
                    <span className="font-mono text-xs text-ink">{c.count}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-muted font-mono">No client requests logged yet.</p>
            )}
          </Panel>
        </div>

        {/* Requests per feed */}
        <Panel title="REQUESTS BY FEED (TOP 10)">
          {stats?.requests.byFeed.length ? (
            <ul className="flex flex-col gap-1.5 text-sm">
              {stats.requests.byFeed.map((f) => (
                <li key={f.feedId} className="flex justify-between border-b border-border/60 py-1">
                  <span className="text-xs text-ink truncate max-w-[75%]">{f.title}</span>
                  <span className="font-mono text-xs text-muted">{f.count}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-muted font-mono">
              No per-feed requests yet — view an individual feed via GET /api/feeds/:id to populate this.
            </p>
          )}
        </Panel>
      </div>
    </main>
  );
}
