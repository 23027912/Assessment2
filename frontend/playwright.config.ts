import { defineConfig, devices } from "@playwright/test";

// Assumes both apps are already running (e.g. `docker compose up`, or
// `npm run dev` in both api/ and frontend/) before tests are executed.
// FRONTEND_URL/API_URL let CI or a different machine override the defaults.
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const API_URL = process.env.API_URL || "http://localhost:4000";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  retries: 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: FRONTEND_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});

export { API_URL, FRONTEND_URL };