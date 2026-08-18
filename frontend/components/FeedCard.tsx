"use client";

import type { Feed } from "@/lib/types";

type Props = {
  feed: Feed;
  index: number;
  compact?: boolean;
  onEdit: (feed: Feed) => void;
  onDelete: (id: string) => void;
};

const STATUS_STYLE: Record<Feed["status"], string> = {
  ACTIVE: "text-signal border-signal",
  ERROR: "text-alert border-alert",
  STALE: "text-muted border-muted",
};

export default function FeedCard({ feed, index, compact = false, onEdit, onDelete }: Props) {
  const date = new Date(feed.publishedAt).toLocaleString("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <article className="group border border-border bg-surface hover:bg-surface2 transition-colors rounded-sm overflow-hidden flex flex-col sm:flex-row">
      {feed.imageUrl && !compact && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={feed.imageUrl}
          alt=""
          className="sm:w-40 w-full h-40 sm:h-auto object-cover border-b sm:border-b-0 sm:border-r border-border"
        />
      )}
      <div className={`flex-1 flex flex-col gap-2 min-w-0 ${compact ? "p-2.5" : "p-4"}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-[11px] text-signal tracking-widest">
              {String(index + 1).padStart(3, "0")} {feed.category ? `// ${feed.category.toUpperCase()}` : ""}
            </p>
            <h3 className="font-sans font-semibold text-lg leading-snug mt-1 truncate">
              {feed.title}
            </h3>
          </div>
          <div className="flex gap-2 shrink-0 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus-within:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(feed)}
              aria-label={`Edit "${feed.title}"`}
              className="font-mono text-[11px] px-2 py-1 border border-border rounded-sm hover:border-signal hover:text-signal focus:opacity-100"
            >
              EDIT
            </button>
            <button
              onClick={() => onDelete(feed.id)}
              aria-label={`Delete "${feed.title}"`}
              className="font-mono text-[11px] px-2 py-1 border border-border rounded-sm hover:border-alert hover:text-alert focus:opacity-100"
            >
              DELETE
            </button>
          </div>
        </div>

        {!compact && <p className="text-sm text-muted line-clamp-2">{feed.summary || feed.content}</p>}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 font-mono text-[11px] text-muted">
          <span
            className={`inline-flex items-center gap-1 border rounded-sm px-1.5 py-0.5 ${STATUS_STYLE[feed.status]}`}
          >
            <span className="w-1 h-1 rounded-full bg-current" />
            {feed.status}
          </span>
          <span>BY {feed.author.toUpperCase()}</span>
          <span>{date}</span>
          {feed.link && (
            <a
              href={feed.link}
              target="_blank"
              rel="noreferrer"
              className="text-signal hover:underline"
            >
              SOURCE ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
