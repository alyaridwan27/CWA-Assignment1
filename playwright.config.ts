import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false, // tests depend on each other (serial mode)
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }]],
  timeout: 2 * 60 * 1000, // 2 minutes per test (adjust if needed)
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'retain-on-failure',
    actionTimeout: 30_000,
    navigationTimeout: 60_000,
  },

  /* Start your Next dev server automatically before running tests
     - Uses the same dev command you used earlier
     - reuseExistingServer: true => if you already started the dev server manually, Playwright won't start another one
  */
  webServer: {
    command: 'dotenv -e .env -- next dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 120_000, // wait up to 120s for server to be ready
    env: {
      // ensure the env file is used; dotenv already loads it but set PORT explicitly
      PORT: '3000',
    },
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
