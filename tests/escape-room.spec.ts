import { test, expect } from "@playwright/test";

test.describe.configure({ mode: "serial" });

// Unique identifiers so tests don't collide
const ROOM_TITLE = `Playwright Room ${Date.now()}`;
const PUZZLE_NAME = "Puzzle 1";
const PUZZLE_NAME_2 = "Puzzle 2";
const PUZZLE_ANSWER = "secret123";

test("1 - Create a new custom escape room", async ({ page }) => {
  await page.goto("/escape-room/create");

  await expect(page.getByRole("heading", { name: "Create Your Escape Room" }))
    .toBeVisible();

  // Title (use sibling selector because label isn't associated by for/id)
  await page.locator('label:has-text("Room Title") + input').fill(ROOM_TITLE);

  // Timer (label text exactly matches Time Limit (Seconds))
  await page.locator('label:has-text("Time Limit (Seconds)") + input').fill("300");

  // Click preview to open modal (force+position to be safe)
  const preview = page.locator('div[class*="previewStage"]');
  await preview.click({ position: { x: 200, y: 200 }, force: true });

  // Wait for modal header to show (ensures animation completed)
  await expect(page.getByRole("heading", { name: "Add Puzzle" })).toBeVisible();

  // Fill puzzle modal fields (use sibling selectors)
  await page.locator('label:has-text("Puzzle Name") + input').fill(PUZZLE_NAME);
  await page.locator('label:has-text("Instructions") + textarea').fill("Type the secret");
  await page.locator('label:has-text("Correct Solution") + textarea').fill(PUZZLE_ANSWER);

  // Add puzzle
  await page.getByRole("button", { name: "Add Puzzle" }).click();

  // Ensure hotspot appears (title uses puzzle.name)
  await expect(page.locator(`div[title="${PUZZLE_NAME}"]`)).toBeVisible({ timeout: 5000 });

  // Save the room — wait for network POST then wait for redirect
  const [saveResponse] = await Promise.all([
    page.waitForResponse(resp => resp.url().endsWith("/api/escape-rooms") && resp.request().method() === "POST", { timeout: 10000 }),
    page.getByRole("button", { name: /Save Room/i }).click()
  ]);
  expect(saveResponse.ok()).toBeTruthy();

  // After save we expect redirect to list
  await expect(page).toHaveURL(/\/escape-room$/, { timeout: 5000 });

  // Confirm the room shows on the list via its H3
  const roomCard = page.locator("div[class*='roomCard__']").filter({
  has: page.getByRole("heading", { name: ROOM_TITLE })
  });
  await expect(roomCard.first()).toBeVisible();

});

test("2 - Edit the room and add another puzzle", async ({ page }) => {
  await page.goto("/escape-room");

  // Select EXACT room card by CSS class & h3 text
  const roomCard = page.locator("div.EscapeRoomGame_roomCard__k2uOE").filter({
    has: page.locator("h3", { hasText: ROOM_TITLE })
  }).first();

  await expect(roomCard).toBeVisible();

  // Find the Edit button inside THIS card
  const editBtn = roomCard.locator("button", { hasText: "Edit" });
  await editBtn.click();

  await expect(page).toHaveURL(/escape-room\/create\?id=/);

  // Add second puzzle
  const preview = page.locator("div[class*='previewStage']");
  await preview.waitFor({ state: "visible" });

  // Cross-browser click
  await page.waitForTimeout(100);
  await page.evaluate(() => {
    const el = document.querySelector('div[class*="previewStage"]');
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.dispatchEvent(new MouseEvent("click", {
      clientX: r.left + r.width * 0.6,
      clientY: r.top + r.height * 0.4,
      bubbles: true,
    }));
  });

  await expect(page.getByRole("heading", { name: /add puzzle/i })).toBeVisible();

  // Use sibling selectors (like test 1)
  await page.locator('label:has-text("Puzzle Name") + input').fill(PUZZLE_NAME_2);
  await page.locator('label:has-text("Correct Solution") + textarea').fill("second_answer");
  await page.getByRole("button", { name: /add puzzle/i }).click();

  // Expect exactly 2 markers
  const markers = page.locator("div[title^='Puzzle']");
  await expect(markers).toHaveCount(2);

  // Save
  await page.getByRole("button", { name: /save room/i }).click();
  await expect(page).toHaveURL(/escape-room$/);
});


test("3 - Play the created room and win", async ({ page }) => {
  await page.goto("/escape-room");

  // Locate ONLY outer card
  const roomCard = page.locator("div.EscapeRoomGame_roomCard__k2uOE").filter({
    has: page.locator("h3", { hasText: ROOM_TITLE })
  }).first();

  await expect(roomCard).toBeVisible();
  await roomCard.click();

  // Wait for the start screen to appear
  await expect(page.getByRole("button", { name: /start game/i })).toBeVisible({ timeout: 5000 });

  // Now click start
  await page.getByRole("button", { name: /start game/i }).click();

  // Wait for the game container with HUD to appear
  await expect(page.locator(`text=Time: `)).toBeVisible({ timeout: 5000 });

  // Wait for hotspot by class
  const hotspotByClass = page.locator(`div[class*="hotspot"]`);
  await expect(hotspotByClass.first()).toBeVisible({ timeout: 5000 });

  // Click first hotspot
  await hotspotByClass.first().click();

  // Wait for modal to appear
  await expect(page.getByRole("heading", { name: /puzzle/i })).toBeVisible({ timeout: 5000 });

  // Fill answer
  await page.getByPlaceholder(/your answer/i).fill(PUZZLE_ANSWER);

  // Submit answer
  await page.getByRole("button", { name: /submit/i }).click();

  // Wait for modal to close (answer accepted)
  await page.waitForTimeout(300);

  // Click second hotspot
  const hotspots = page.locator(`div[class*="hotspot"]`);
  if (await hotspots.count() >= 2) {
    await hotspots.nth(1).click();
    
    // Wait for modal
    await expect(page.getByRole("heading", { name: /puzzle/i })).toBeVisible({ timeout: 5000 });
    
    // Fill second answer
    await page.getByPlaceholder(/your answer/i).fill("second_answer");
    
    // Submit
    await page.getByRole("button", { name: /submit/i }).click();
  }

  // Wait for win screen
  await expect(page.getByText(/escape successful/i)).toBeVisible({ timeout: 8000 });
});


test("4 - Delete the room", async ({ page }) => {
  await page.goto("/escape-room");

  // Find the card again - use the specific outer card class
  const roomCard = page.locator("div.EscapeRoomGame_roomCard__k2uOE").filter({
    has: page.locator("h3", { hasText: ROOM_TITLE })
  }).first();

  await expect(roomCard).toBeVisible({ timeout: 5000 });

  // Accept confirmation dialog
  page.once("dialog", dialog => dialog.accept());

  // Click delete button inside the card
  await roomCard.locator('button:has-text("Delete")').click({ force: true });

  // Wait for card to disappear
  await expect(page.locator("h3", { hasText: ROOM_TITLE })).toHaveCount(0, { timeout: 5000 });
});