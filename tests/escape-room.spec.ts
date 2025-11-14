import { test, expect } from '@playwright/test';

// --- Define the correct solutions here ---
const solution1 = `function messy(a, b) {
  if (a > b) {
    return a;
  } else {
    return b;
  }
}`;

const solution2 = `for (let i = 0; i <= 1000; i++) {
  console.log(i);
}`;

const solution3 = `function reverseString(str) {
  return str.split('').reverse().join('');
}`;
// ----------------------------------------

// Group tests for the Escape Room
test.describe('Escape Room Game', () => {
  // Test 1: The "Win" Scenario (Happy Path)
  test('should allow a user to play through and win the game', async ({
    page,
  }) => {
    // 1. Go to the escape room page
    await page.goto('/escape-room');

    // 2. Start the game
    await page.getByRole('button', { name: 'Start Timer' }).click();

    // 3. --- Solve Stage 1 ---
    await expect(page.getByText('Stage 1: The Messy Function')).toBeVisible();
    // --- THIS IS THE FIX ---
    await page
      .getByPlaceholder('Enter your code solution here')
      .fill(solution1);
    await page.getByRole('button', { name: 'Submit Answer' }).click();
    await expect(
      page.getByText('Correct! Moving to the next stage.')
    ).toBeVisible();

    // 4. --- Solve Stage 2 ---
    await expect(page.getByText('Stage 2: The Number Generator')).toBeVisible();
    // --- THIS IS THE FIX ---
    await page
      .getByPlaceholder('Enter your code solution here')
      .fill(solution2);
    await page.getByRole('button', { name: 'Submit Answer' }).click();
    await expect(
      page.getByText('Correct! Moving to the next stage.')
    ).toBeVisible();

    // 5. --- Solve Stage 3 ---
    await expect(page.getByText('Stage 3: The Data Scrambler')).toBeVisible();
    // --- THIS IS THE FIX ---
    await page
      .getByPlaceholder('Enter your code solution here')
      .fill(solution3);
    await page.getByRole('button', { name: 'Submit Answer' }).click();

    // 6. --- Check for Win Screen ---
    await expect(
      page.getByRole('heading', { name: 'You Escaped!' })
    ).toBeVisible();
    await expect(
      page.getByText('Congratulations, you solved all the puzzles with time to spare.')
    ).toBeVisible();
  });

  // Test 2: The "Fail" Scenario (Wrong Answer)
  test('should show an error message for an incorrect answer', async ({
    page,
  }) => {
    // 1. Go to the escape room page
    await page.goto('/escape-room');

    // 2. Start the game
    await page.getByRole('button', { name: 'Start Timer' }).click();

    // 3. --- Submit Wrong Answer for Stage 1 ---
    await expect(page.getByText('Stage 1: The Messy Function')).toBeVisible();
    // --- THIS IS THE FIX ---
    await page
      .getByPlaceholder('Enter your code solution here')
      .fill('This is the wrong answer');
    await page.getByRole('button', { name: 'Submit Answer' }).click();

    // 4. --- Check for Error Message ---
    await expect(page.getByText('Incorrect answer. Try again.')).toBeVisible();

    // 5. --- Ensure we are still on Stage 1 ---
    await expect(page.getByText('Stage 1: The Messy Function')).toBeVisible();
    await expect(
      page.getByText('Correct! Moving to the next stage.')
    ).not.toBeVisible();
  });
});