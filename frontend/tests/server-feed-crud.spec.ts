import { test, expect } from "@playwright/test";
import { API_URL } from "../playwright.config";

// SERVER USE CASE — exercises the RSS Server's CRUD API directly (no
// browser), proving the backend works independently of the frontend.
// Uses Playwright's built-in `request` fixture, an HTTP client with no
// page/DOM involved.
test.describe("RSS Server — feed CRUD", () => {
  let createdId: string;

  test("creates a feed", async ({ request }) => {
    const res = await request.post(`${API_URL}/api/feeds`, {
      data: {
        title: "Playwright Test Feed",
        author: "Playwright Bot",
        content: "This entry was created by an automated end-to-end test.",
        category: "Testing",
        status: "ACTIVE",
      },
    });

    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.title).toBe("Playwright Test Feed");
    createdId = body.data.id;
  });

  test("reads the feed back", async ({ request }) => {
    const listRes = await request.post(`${API_URL}/api/feeds`, {
      data: {
        title: "Playwright Read Fixture",
        author: "Playwright Bot",
        content: "Fixture entry for the read test.",
      },
    });
    const { data } = await listRes.json();

    const getRes = await request.get(`${API_URL}/api/feeds/${data.id}`);
    expect(getRes.ok()).toBe(true);
    const body = await getRes.json();
    expect(body.data.id).toBe(data.id);
    expect(body.data.title).toBe("Playwright Read Fixture");

    await request.delete(`${API_URL}/api/feeds/${data.id}`);
  });

  test("updates a feed", async ({ request }) => {
    const createRes = await request.post(`${API_URL}/api/feeds`, {
      data: { title: "Before Update", author: "Playwright Bot", content: "Original content." },
    });
    const { data: created } = await createRes.json();

    const updateRes = await request.put(`${API_URL}/api/feeds/${created.id}`, {
      data: { title: "After Update", status: "STALE" },
    });
    expect(updateRes.ok()).toBe(true);
    const updated = await updateRes.json();
    expect(updated.data.title).toBe("After Update");
    expect(updated.data.status).toBe("STALE");

    await request.delete(`${API_URL}/api/feeds/${created.id}`);
  });

  test("deletes a feed", async ({ request }) => {
    const createRes = await request.post(`${API_URL}/api/feeds`, {
      data: { title: "To Be Deleted", author: "Playwright Bot", content: "Will be removed." },
    });
    const { data: created } = await createRes.json();

    const deleteRes = await request.delete(`${API_URL}/api/feeds/${created.id}`);
    expect(deleteRes.ok()).toBe(true);

    const getRes = await request.get(`${API_URL}/api/feeds/${created.id}`);
    expect(getRes.status()).toBe(404);
  });

  test.afterAll(async ({ request }) => {
    // Clean up the feed created in the first test, if it's still around.
    if (createdId) {
      await request.delete(`${API_URL}/api/feeds/${createdId}`).catch(() => {});
    }
  });
});
