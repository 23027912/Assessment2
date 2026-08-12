"use client";

import { useEffect, useState } from "react";
import type { Feed, FeedInput } from "@/lib/types";

type Props = {
  editingFeed: Feed | null;
  onSubmit: (input: FeedInput) => Promise<void>;
  onCancelEdit: () => void;
};

const empty: FeedInput = {
  title: "",
  author: "",
  content: "",
  summary: "",
  imageUrl: "",
  link: "",
  category: "",
};

export default function FeedForm({ editingFeed, onSubmit, onCancelEdit }: Props) {
  const [form, setForm] = useState<FeedInput>(empty);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingFeed) {
      setForm({
        title: editingFeed.title,
        author: editingFeed.author,
        content: editingFeed.content,
        summary: editingFeed.summary ?? "",
        imageUrl: editingFeed.imageUrl ?? "",
        link: editingFeed.link ?? "",
        category: editingFeed.category ?? "",
      });
    } else {
      setForm(empty);
    }
  }, [editingFeed]);

  function update<K extends keyof FeedInput>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.author || !form.content) return;
    setSubmitting(true);
    try {
      await onSubmit(form);
      if (!editingFeed) setForm(empty);
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full bg-bg border border-border rounded-sm px-3 py-2 text-sm text-ink placeholder:text-muted/60 focus:outline-none focus:border-signal";

  return (
    <form onSubmit={handleSubmit} className="border border-border bg-surface rounded-sm p-4 flex flex-col gap-3">
      <p className="font-mono text-[11px] tracking-widest text-signal">
        {editingFeed ? "// EDIT ENTRY" : "// NEW WIRE ENTRY"}
      </p>

      <div className="grid sm:grid-cols-2 gap-3">
        <input
          className={inputClass}
          placeholder="Title *"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          required
        />
        <input
          className={inputClass}
          placeholder="Author *"
          value={form.author}
          onChange={(e) => update("author", e.target.value)}
          required
        />
      </div>

      <textarea
        className={inputClass + " min-h-[80px] resize-y"}
        placeholder="Content *"
        value={form.content}
        onChange={(e) => update("content", e.target.value)}
        required
      />

      <input
        className={inputClass}
        placeholder="Summary (optional)"
        value={form.summary}
        onChange={(e) => update("summary", e.target.value)}
      />

      <div className="grid sm:grid-cols-3 gap-3">
        <input
          className={inputClass}
          placeholder="Image URL"
          value={form.imageUrl}
          onChange={(e) => update("imageUrl", e.target.value)}
        />
        <input
          className={inputClass}
          placeholder="Source link"
          value={form.link}
          onChange={(e) => update("link", e.target.value)}
        />
        <input
          className={inputClass}
          placeholder="Category"
          value={form.category}
          onChange={(e) => update("category", e.target.value)}
        />
      </div>

      <div className="flex gap-2 justify-end">
        {editingFeed && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="font-mono text-xs px-4 py-2 border border-border rounded-sm text-muted hover:text-ink"
          >
            CANCEL
          </button>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="font-mono text-xs px-4 py-2 border border-signal text-signal rounded-sm hover:bg-signal hover:text-bg transition-colors disabled:opacity-50"
        >
          {submitting ? "SENDING..." : editingFeed ? "SAVE CHANGES" : "PUBLISH ENTRY"}
        </button>
      </div>
    </form>
  );
}
