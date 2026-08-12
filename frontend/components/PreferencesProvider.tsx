"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
type FeedLayout = "comfortable" | "compact";

type Preferences = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  feedLayout: FeedLayout;
  setFeedLayout: (l: FeedLayout) => void;
  showTicker: boolean;
  setShowTicker: (v: boolean) => void;
};

const PreferencesContext = createContext<Preferences | undefined>(undefined);

const THEME_KEY = "wire:theme";
const LAYOUT_KEY = "wire:feedLayout";
const TICKER_KEY = "wire:showTicker";

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  // Defaults match the inline no-flash script in layout.tsx
  const [theme, setThemeState] = useState<Theme>("dark");
  const [feedLayout, setFeedLayoutState] = useState<FeedLayout>("comfortable");
  const [showTicker, setShowTickerState] = useState(true);

  // Read persisted values on mount (client only — avoids SSR/localStorage mismatch)
  useEffect(() => {
    const storedTheme = window.localStorage.getItem(THEME_KEY) as Theme | null;
    const storedLayout = window.localStorage.getItem(LAYOUT_KEY) as FeedLayout | null;
    const storedTicker = window.localStorage.getItem(TICKER_KEY);

    if (storedTheme) setThemeState(storedTheme);
    if (storedLayout) setFeedLayoutState(storedLayout);
    if (storedTicker !== null) setShowTickerState(storedTicker === "true");
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    window.localStorage.setItem(LAYOUT_KEY, feedLayout);
  }, [feedLayout]);

  useEffect(() => {
    window.localStorage.setItem(TICKER_KEY, String(showTicker));
  }, [showTicker]);

  const value: Preferences = {
    theme,
    setTheme: setThemeState,
    toggleTheme: () => setThemeState((t) => (t === "dark" ? "light" : "dark")),
    feedLayout,
    setFeedLayout: setFeedLayoutState,
    showTicker,
    setShowTicker: setShowTickerState,
  };

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error("usePreferences must be used within PreferencesProvider");
  return ctx;
}
