import { test, expect } from '@playwright/test';

const ROOM_TITLE = `Playwright Test Room ${Date.now()}`;
const PUZZLE_NAME = 'Test Puzzle 1';
const PUZZLE_ANSWER = 'secret_code';

// 1. SERIAL MODE
// This is mandatory so Test 2 waits for Test 1 to finish saving.
test.describe.configure({ mode: 'serial' });

test.describe('Escape Room Flow', () => {

  test('should allow creating a new custom escape room', async ({ page }) => {
    // --- STEP 1: Go to Builder ---
    await page.goto('/escape-room/create');
    await expect(page.getByRole('heading', { name: 'Create Your Escape Room' })).toBeVisible();

    // Fill Title (Global Input)
    // We target the input that follows the "Room Title" label
    await page.locator('label:has-text("Room Title") + input').fill(ROOM_TITLE);

    // --- STEP 2: Open Modal ---
    // Click the background image (previewStage)
    const preview = page.locator('div[class*="previewStage"]');
    await preview.click({ position: { x: 200, y: 200 }, force: true }); 

    // --- STEP 3: Fill Modal (THE FIX) ---
    // We wait for the modal header to be visible to ensure animation is done
    await expect(page.getByRole('heading', { name: 'Add Puzzle' })).toBeVisible();

    // Instead of finding the "Modal Div", we find the inputs directly using their Labels.
    // This bypasses the "Strict Mode" error because there is only ONE input next to the label "Puzzle Name".

    // 1. Puzzle Name
    await page.locator('label:has-text("Puzzle Name") + input').fill(PUZZLE_NAME);
    
    // 2. Type (Select)
    await page.locator('label:has-text("Type") + select').selectOption('text');
    
    // 3. Instructions
    await page.locator('label:has-text("Instructions") + textarea').fill('What is the secret?');
    
    // 4. Solution
    await page.locator('label:has-text("Correct Solution") + textarea').fill(PUZZLE_ANSWER);

    // --- STEP 4: Add & Save ---
    // Click the Add Puzzle button
    await page.getByRole('button', { name: 'Add Puzzle' }).click();

    // Verify the hotspot pin appeared on the map
    await expect(page.locator(`div[title="${PUZZLE_NAME}"]`)).toBeVisible();

    // Save the room
    await page.getByRole('button', { name: /Save Room/i }).click();

    // Verify redirect
    await expect(page).toHaveURL(/\/escape-room$/);
    
    // Verify our new room is in the list
    await expect(page.getByText(ROOM_TITLE)).toBeVisible();
  });


  test('should allow playing the room and winning it', async ({ page }) => {
    await page.goto('/escape-room');

    // --- STEP 1: Find and Click Room ---
    // We look for the h3 containing the text, then click it.
    const roomTitle = page.locator('h3', { hasText: ROOM_TITLE }).first();
    await expect(roomTitle).toBeVisible({ timeout: 10000 }); // Wait for DB
    await roomTitle.click();

    // --- STEP 2: Start Game ---
    const startButton = page.getByRole('button', { name: /start game/i });
    await expect(startButton).toBeVisible();
    await startButton.click();

    // --- STEP 3: Click Puzzle Hotspot ---
    const hotspot = page.locator(`div[title="${PUZZLE_NAME}"]`);
    await expect(hotspot).toBeVisible();
    await hotspot.click();

    // --- STEP 4: Solve Puzzle ---
    await expect(page.getByText('What is the secret?')).toBeVisible();
    
    // Use placeholder targeting for the game input
    await page.getByPlaceholder('Your answer...').fill(PUZZLE_ANSWER);
    
    await page.getByRole('button', { name: 'Submit' }).click();

    // --- STEP 5: Verify Win ---
    await expect(page.getByText('ESCAPE SUCCESSFUL!')).toBeVisible();
  });

});