"use client";

import { usePreferences } from "@/components/PreferencesProvider";

export default function SettingsPage() {
  const { theme, setTheme, feedLayout, setFeedLayout, showTicker, setShowTicker } =
    usePreferences();

  return (
    <main className="flex-1">
      <div className="max-w-2xl mx-auto px-6 py-12 flex flex-col gap-8">
        <div>
          <p className="font-mono text-xs text-signal tracking-[0.3em]">SETTINGS</p>
          <h1 className="font-sans text-3xl sm:text-4xl font-bold mt-1 tracking-tight">
            Interface preferences
          </h1>
          <p className="text-muted text-sm mt-2">
            Choices here are saved to your browser's local storage and applied across every
            page automatically.
          </p>
        </div>

        {/* Theme */}
        <section className="border border-border bg-surface rounded-sm p-5">
          <h2 className="font-mono text-[11px] text-signal tracking-widest mb-1">THEME</h2>
          <p className="text-sm text-muted mb-4">Switch between light and dark mode.</p>
          <div role="radiogroup" aria-label="Theme" className="flex gap-3">
            {(["dark", "light"] as const).map((t) => (
              <button
                key={t}
                role="radio"
                aria-checked={theme === t}
                onClick={() => setTheme(t)}
                className={`font-mono text-xs tracking-widest px-4 py-2 rounded-sm border transition-colors ${
                  theme === t
                    ? "border-signal text-signal"
                    : "border-border text-muted hover:text-ink"
                }`}
              >
                {t === "dark" ? "☾ DARK" : "☀ LIGHT"}
              </button>
            ))}
          </div>
        </section>

        {/* Feed layout density */}
        <section className="border border-border bg-surface rounded-sm p-5">
          <h2 className="font-mono text-[11px] text-signal tracking-widest mb-1">FEED LAYOUT</h2>
          <p className="text-sm text-muted mb-4">
            Choose how much detail each entry shows on the Feeds page.
          </p>
          <div role="radiogroup" aria-label="Feed layout" className="flex gap-3">
            {(["comfortable", "compact"] as const).map((l) => (
              <button
                key={l}
                role="radio"
                aria-checked={feedLayout === l}
                onClick={() => setFeedLayout(l)}
                className={`font-mono text-xs tracking-widest px-4 py-2 rounded-sm border transition-colors ${
                  feedLayout === l
                    ? "border-signal text-signal"
                    : "border-border text-muted hover:text-ink"
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </section>

        {/* Status ticker visibility */}
        <section className="border border-border bg-surface rounded-sm p-5">
          <h2 className="font-mono text-[11px] text-signal tracking-widest mb-1">
            STATUS TICKER
          </h2>
          <p className="text-sm text-muted mb-4">
            Show or hide the live server health ticker at the top of the Feeds page.
          </p>
          <label className="flex items-center gap-3 cursor-pointer w-fit">
            <span className="font-mono text-xs text-muted">HIDE</span>
            <button
              role="switch"
              aria-checked={showTicker}
              onClick={() => setShowTicker(!showTicker)}
              className={`relative w-11 h-6 rounded-full transition-colors border border-border ${
                showTicker ? "bg-signal/30" : "bg-surface2"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 rounded-full bg-ink transition-transform ${
                  showTicker ? "translate-x-5" : "translate-x-0"
                }`}
                style={{ width: "18px", height: "18px" }}
              />
            </button>
            <span className="font-mono text-xs text-muted">SHOW</span>
          </label>
        </section>
      </div>
    </main>
  );
}
