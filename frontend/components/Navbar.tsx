"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { usePreferences } from "./PreferencesProvider";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/feeds", label: "Feeds" },
  { href: "/about", label: "About" },
  { href: "/settings", label: "Settings" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = usePreferences();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/90 backdrop-blur">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-baseline gap-2 shrink-0">
          <span className="font-mono text-signal text-sm tracking-[0.3em]">WIRE</span>
          <span className="hidden sm:inline text-xs text-muted font-mono">
            RSS Server &amp; Client — Assessment
          </span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden sm:flex items-center gap-1">
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`font-mono text-xs tracking-widest px-3 py-2 rounded-sm transition-colors ${
                  active
                    ? "text-signal border border-signal"
                    : "text-muted border border-transparent hover:text-ink hover:border-border"
                }`}
              >
                {link.label.toUpperCase()}
              </Link>
            );
          })}
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className="ml-2 font-mono text-xs px-3 py-2 border border-border rounded-sm text-muted hover:text-ink hover:border-signal"
          >
            {theme === "dark" ? "☀ LIGHT" : "☾ DARK"}
          </button>
        </nav>

        {/* Mobile: hamburger toggle */}
        <button
          className="sm:hidden relative w-9 h-9 flex flex-col items-center justify-center gap-[5px] group"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          <span
            className={`block h-[2px] w-6 bg-ink transition-transform duration-300 ${
              open ? "translate-y-[7px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-[2px] w-6 bg-ink transition-opacity duration-200 ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`block h-[2px] w-6 bg-ink transition-transform duration-300 ${
              open ? "-translate-y-[7px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile nav panel — hide/show via CSS grid-rows transition (no layout jump) */}
      <nav
        id="mobile-nav"
        aria-label="Mobile"
        className={`sm:hidden grid transition-[grid-template-rows] duration-300 ease-in-out border-border ${
          open ? "grid-rows-[1fr] border-t" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col px-6 py-3 gap-1">
            {LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`font-mono text-sm tracking-widest px-2 py-2 rounded-sm ${
                    active ? "text-signal" : "text-muted hover:text-ink"
                  }`}
                >
                  {link.label.toUpperCase()}
                </Link>
              );
            })}
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
