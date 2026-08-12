/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["selector", '[data-theme="dark"]'],
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // These map to CSS custom properties defined in globals.css, so the
        // same class names (bg-bg, text-ink, border-border, ...) work in both
        // the light and dark theme — only the variable values change.
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        surface2: "var(--color-surface-2)",
        border: "var(--color-border)",
        ink: "var(--color-ink)",
        muted: "var(--color-muted)",
        signal: "var(--color-signal)",
        alert: "var(--color-alert)",
      },
      fontFamily: {
        mono: ["'IBM Plex Mono'", "ui-monospace", "monospace"],
        sans: ["'IBM Plex Sans'", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
