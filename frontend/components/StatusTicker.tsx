"use client";

import { useEffect, useState } from "react";
import type { HealthStatus, CountStats } from "@/lib/types";
import { apiUrl } from "@/lib/api";

// Signature element: a wire-service "signal" ticker showing live backend
// health and request-count telemetry, polled every 5s from the API app's
// /api/health and /api/count endpoints.
export default function StatusTicker() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [stats, setStats] = useState<CountStats | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const [h, c] = await Promise.all([
          fetch(apiUrl("/api/health")).then((r) => r.json()),
          fetch(apiUrl("/api/count")).then((r) => r.json()),
        ]);
        if (!cancelled) {
          setHealth(h);
          setStats(c);
        }
      } catch {
        if (!cancelled) setHealth({ status: "error", database: "disconnected", timestamp: new Date().toISOString() });
      }
    }

    poll();
    const interval = setInterval(poll, 5000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const isUp = health?.status === "ok";

  const items = [
    `SERVER ${isUp ? "ONLINE" : health ? "DOWN" : "CONNECTING"}`,
    `DB ${health?.database ?? "..."}`,
    `LATENCY ${health?.latencyMs !== undefined ? `${health.latencyMs}ms` : "--"}`,
    `UPTIME ${health?.uptimeSeconds !== undefined ? `${Math.floor(health.uptimeSeconds)}s` : "--"}`,
    `REQUESTS ${stats?.totalRequests ?? "--"}`,
    `FEEDS ${stats?.totalFeeds ?? "--"}`,
  ];

  const doubled = [...items, ...items];

  return (
    <div className="w-full overflow-hidden border-y border-border bg-surface">
      <div className="flex ticker-track whitespace-nowrap py-2">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center font-mono text-xs tracking-wider text-muted px-6">
            <span
              className={`inline-block w-1.5 h-1.5 rounded-full mr-2 ${
                isUp ? "bg-signal" : "bg-alert"
              }`}
            />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
