"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { usePreferences } from "./PreferencesProvider";

const PRIMARY_LINKS = [
  { href: "/", label: "Home" },
  { href: "/feeds", label: "Feeds" },
  { href: "/dashboard", label: "Dashboard" },
];

// These live inside the kebab/hamburger menus specifically, per the brief:
// "a hamburger menu or kebab menu for compact navigation, with options such
// as About and Settings."
const COMPACT_LINKS = [
  { href: "/about", label: "About" },
  { href: "/settings", label: "Settings" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [kebabOpen, setKebabOpen] = useState(false);
  const kebabRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { theme, toggleTheme } = usePreferences();

  // Close the kebab dropdown on outside click or Escape
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (kebabRef.current && !kebabRef.current.contains(e.target as Node)) {
        setKebabOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setKebabOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/90 backdrop-blur">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-baseline gap-2 shrink-0">
          <span className="font-mono text-signal text-sm tracking-[0.3em]">WIRE</span>
          <span className="hidden sm:inline text-xs text-muted font-mono">
            RSS Server &amp; Client — Assessment
          </span>
        </Link>

        {/* Desktop: primary links + always-visible kebab menu + theme toggle */}
        <div className="hidden sm:flex items-center gap-1">
          <nav aria-label="Primary" className="flex items-center gap-1">
            {PRIMARY_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`font-mono text-xs tracking-widest px-3 py-2 rounded-sm transition-colors ${
                  isActive(link.href)
                    ? "text-signal border border-signal"
                    : "text-muted border border-transparent hover:text-ink hover:border-border"
                }`}
              >
                {link.label.toUpperCase()}
              </Link>
            ))}
          </nav>

          {/* Compact menu — hamburger icon, always visible (not just on small screens) */}
          <div className="relative" ref={kebabRef}>
            <button
              onClick={() => setKebabOpen((o) => !o)}
              aria-label="More navigation options"
              aria-haspopup="menu"
              aria-expanded={kebabOpen}
              aria-controls="kebab-menu"
              className={`ml-1 w-9 h-9 flex flex-col items-center justify-center gap-[5px] rounded-sm border transition-colors ${
                kebabOpen
                  ? "border-signal"
                  : "border-border hover:border-ink"
              }`}
            >
              <span
                className={`block h-[2px] w-4 transition-transform duration-300 ${
                  kebabOpen ? "translate-y-[7px] rotate-45 bg-signal" : "bg-ink"
                }`}
              />
              <span
                className={`block h-[2px] w-4 transition-opacity duration-200 ${
                  kebabOpen ? "opacity-0" : "opacity-100 bg-ink"
                }`}
              />
              <span
                className={`block h-[2px] w-4 transition-transform duration-300 ${
                  kebabOpen ? "-translate-y-[7px] -rotate-45 bg-signal" : "bg-ink"
                }`}
              />
            </button>

            <div
              id="kebab-menu"
              className={`absolute right-0 mt-2 w-44 origin-top-right border border-border bg-surface rounded-sm shadow-lg overflow-hidden transition-all duration-150 ${
                kebabOpen
                  ? "opacity-100 scale-100 pointer-events-auto"
                  : "opacity-0 scale-95 pointer-events-none"
              }`}
            >
              {/* Header row is deliberately outside role="menu" below — ARIA's
                  menu role only permits menuitem/group as direct children, so
                  this plain header can't live inside that scope. */}
              <div className="flex items-center justify-between px-3 py-2 border-b border-border">
                <span className="font-mono text-[10px] tracking-widest text-muted">MENU</span>
                <button
                  onClick={() => setKebabOpen(false)}
                  aria-label="Close menu"
                  className="w-5 h-5 flex items-center justify-center rounded-sm text-muted hover:text-ink hover:bg-surface2"
                >
                  <span aria-hidden="true" className="text-sm leading-none">
                    ✕
                  </span>
                </button>
              </div>

              <div role="menu" aria-label="More">
                {COMPACT_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    role="menuitem"
                    onClick={() => setKebabOpen(false)}
                    className={`block font-mono text-xs tracking-widest px-4 py-3 ${
                      isActive(link.href)
                        ? "text-signal bg-surface2"
                        : "text-muted hover:text-ink hover:bg-surface2"
                    }`}
                  >
                    {link.label.toUpperCase()}
                  </Link>
                ))}
                <button
                  role="menuitem"
                  onClick={() => {
                    toggleTheme();
                    setKebabOpen(false);
                  }}
                  className="w-full text-left font-mono text-xs tracking-widest px-4 py-3 text-muted hover:text-ink hover:bg-surface2 border-t border-border"
                >
                  {theme === "dark" ? "☀ LIGHT MODE" : "☾ DARK MODE"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile: hamburger toggle (all links collapse in here below sm) */}
        <button
          className="sm:hidden relative w-9 h-9 flex flex-col items-center justify-center gap-[5px]"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
        >
          <span
            className={`block h-[2px] w-6 bg-ink transition-transform duration-300 ${
              mobileOpen ? "translate-y-[7px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-[2px] w-6 bg-ink transition-opacity duration-200 ${
              mobileOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`block h-[2px] w-6 bg-ink transition-transform duration-300 ${
              mobileOpen ? "-translate-y-[7px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile nav panel — hide/show via CSS grid-rows transition (no layout jump) */}
      <nav
        id="mobile-nav"
        aria-label="Mobile"
        className={`sm:hidden grid transition-[grid-template-rows] duration-300 ease-in-out border-border ${
          mobileOpen ? "grid-rows-[1fr] border-t" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="flex items-center justify-between px-6 pt-3">
            <span className="font-mono text-[10px] tracking-widest text-muted">MENU</span>
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="w-6 h-6 flex items-center justify-center rounded-sm text-muted hover:text-ink hover:bg-surface2"
            >
              <span aria-hidden="true" className="text-sm leading-none">
                ✕
              </span>
            </button>
          </div>
          <div className="flex flex-col px-6 pb-3 pt-1 gap-1">
            {[...PRIMARY_LINKS, ...COMPACT_LINKS].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`font-mono text-sm tracking-widest px-2 py-2 rounded-sm ${
                  isActive(link.href) ? "text-signal" : "text-muted hover:text-ink"
                }`}
              >
                {link.label.toUpperCase()}
              </Link>
            ))}
            <button
              onClick={toggleTheme}
              className="mt-1 font-mono text-sm px-2 py-2 text-left text-muted hover:text-ink"
            >
              {theme === "dark" ? "☀ SWITCH TO LIGHT" : "☾ SWITCH TO DARK"}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
