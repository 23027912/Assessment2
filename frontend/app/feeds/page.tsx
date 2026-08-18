"use client";

import { useCallback, useEffect, useState } from "react";
import StatusTicker from "@/components/StatusTicker";
import FeedForm from "@/components/FeedForm";
import FeedCard from "@/components/FeedCard";
import { usePreferences } from "@/components/PreferencesProvider";
import { apiFetch } from "@/lib/api";
import type { Feed, FeedInput } from "@/lib/types";

export default function FeedsPage() {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingFeed, setEditingFeed] = useState<Feed | null>(null);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const { feedLayout, showTicker } = usePreferences();

  const loadFeeds = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch("/api/feeds", { cache: "no-store" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to load feeds");
      setFeeds(json.data);
    } catch (err: any) {
      setError(err.message ?? "Could not reach the RSS Server");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFeeds();
  }, [loadFeeds]);

  async function handleCreateOrUpdate(input: FeedInput) {
    if (editingFeed) {
      const res = await apiFetch(`/api/feeds/${editingFeed.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        setError("Update failed");
        return;
      }
      setEditingFeed(null);
    } else {
      const res = await apiFetch("/api/feeds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        setError("Publish failed");
        return;
      }
      setFormOpen(false);
    }
    await loadFeeds();
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this entry from the wire?")) return;
    const res = await apiFetch(`/api/feeds/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setError("Delete failed");
      return;
    }
    await loadFeeds();
  }

  const visibleFeeds = feeds.filter((f) => {
    const q = search.toLowerCase();
    return (
      f.title.toLowerCase().includes(q) ||
      f.author.toLowerCase().includes(q) ||
      (f.category ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <main className="flex flex-col flex-1">
      <div className="max-w-5xl mx-auto px-6 pt-6 pb-2 w-full">
        <p className="font-mono text-xs text-signal tracking-[0.3em]">RSS SERVER // RSS CLIENT</p>
        <h1 className="font-sans text-3xl sm:text-4xl font-bold mt-1 tracking-tight">Feeds</h1>
        <p className="text-muted text-sm mt-1 max-w-xl">
          Live entries served from the Next.js + Prisma backend. Create, edit and remove
          entries below — every action calls the real CRUD API.
        </p>
      </div>

      {/* Hide/show behaviour driven by the Settings page preference */}
      {showTicker && <StatusTicker />}

      <div className="max-w-5xl mx-auto w-full px-6 py-8 flex flex-col gap-6 flex-1">
        {/* Hide/show block for the create/edit form */}
        <div>
          <button
            onClick={() => setFormOpen((o) => !o || !!editingFeed)}
            aria-expanded={formOpen || !!editingFeed}
            aria-controls="feed-form-panel"
            className="font-mono text-xs tracking-widest px-3 py-2 border border-border rounded-sm text-muted hover:text-ink hover:border-signal transition-colors"
          >
            {formOpen || editingFeed ? "▾ HIDE FORM" : "▸ NEW WIRE ENTRY"}
          </button>

          <div
            id="feed-form-panel"
            className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
              formOpen || editingFeed ? "grid-rows-[1fr] mt-3" : "grid-rows-[0fr]"
            }`}
          >
            <div className="overflow-hidden">
              <FeedForm
                editingFeed={editingFeed}
                onSubmit={handleCreateOrUpdate}
                onCancelEdit={() => {
                  setEditingFeed(null);
                  setFormOpen(false);
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 flex-wrap">
          <p className="font-mono text-xs tracking-widest text-muted">
            {loading
              ? "LOADING FEED..."
              : `${visibleFeeds.length} ENTR${visibleFeeds.length === 1 ? "Y" : "IES"} ON THE WIRE`}
          </p>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by title, author, category…"
            aria-label="Filter feed entries"
            className="bg-surface border border-border rounded-sm px-3 py-1.5 text-sm w-64 focus:outline-none focus:border-signal"
          />
        </div>

        {error && (
          <div role="alert" className="border border-alert text-alert font-mono text-xs px-3 py-2 rounded-sm">
            ERROR: {error}
          </div>
        )}

        <div className={`flex flex-col ${feedLayout === "compact" ? "gap-2" : "gap-3"}`}>
          {visibleFeeds.map((feed, i) => (
            <FeedCard
              key={feed.id}
              feed={feed}
              index={i}
              compact={feedLayout === "compact"}
              onEdit={(f) => {
                setEditingFeed(f);
                setFormOpen(true);
              }}
              onDelete={handleDelete}
            />
          ))}
          {!loading && visibleFeeds.length === 0 && (
            <p className="text-muted text-sm font-mono">No entries match. Try publishing one above.</p>
          )}
        </div>
      </div>
    </main>
  );
}
