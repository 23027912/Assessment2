import { test, expect } from "@playwright/test";

// CLIENT USE CASE — drives a real browser against the RSS Client frontend,
// proving the UI actually renders live data from the backend rather than
// just being visually correct in isolation.
test.describe("RSS Client — viewing and publishing a feed", () => {
  test("loads the feeds page and shows the feed list", async ({ page }) => {
    await page.goto("/feeds");

    await expect(page.getByRole("heading", { name: "Feeds" })).toBeVisible();

    // Either real entries are present, or the explicit empty state is shown —
    // either way, the page must not be stuck loading or blank.
    const emptyState = page.getByText("No entries match");
    const anyFeedCard = page.locator("article").first();
    await expect(emptyState.or(anyFeedCard)).toBeVisible({ timeout: 10000 });
  });

  test("publishes a new feed entry through the UI and sees it appear", async ({ page }) => {
    await page.goto("/feeds");

    await page.getByRole("button", { name: /NEW WIRE ENTRY/i }).click();

    const uniqueTitle = `Playwright UI Test ${Date.now()}`;
    await page.getByPlaceholder("Title *").fill(uniqueTitle);
    await page.getByPlaceholder("Author *").fill("Playwright Browser Test");
    await page.getByPlaceholder("Content *").fill("Created via a real browser interaction.");

    await page.getByRole("button", { name: /PUBLISH ENTRY/i }).click();

    // The new entry should show up in the list without a manual page reload.
    await expect(page.getByText(uniqueTitle)).toBeVisible({ timeout: 10000 });

    // Clean up: delete the entry we just created.
    const card = page.locator("article", { hasText: uniqueTitle });
    page.once("dialog", (dialog) => dialog.accept());
    await card.getByRole("button", { name: /Delete/i }).click();
    await expect(page.getByText(uniqueTitle)).not.toBeVisible({ timeout: 10000 });
  });
});
