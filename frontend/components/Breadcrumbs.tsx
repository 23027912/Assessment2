"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LABELS: Record<string, string> = {
  feeds: "Feeds",
  about: "About",
  settings: "Settings",
  dashboard: "Dashboard",
};

export default function Breadcrumbs() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav aria-label="Breadcrumb" className="max-w-5xl mx-auto px-6 pt-4">
      <ol className="flex items-center gap-2 font-mono text-[11px] text-muted tracking-wider">
        <li>
          <Link href="/" className="hover:text-signal">
            Home
          </Link>
        </li>
        {segments.map((seg, i) => {
          const href = "/" + segments.slice(0, i + 1).join("/");
          const isLast = i === segments.length - 1;
          const label = LABELS[seg] ?? seg;
          return (
            <li key={href} className="flex items-center gap-2">
              <span aria-hidden="true">/</span>
              {isLast ? (
                <span className="text-signal" aria-current="page">
                  {label}
                </span>
              ) : (
                <Link href={href} className="hover:text-signal">
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
