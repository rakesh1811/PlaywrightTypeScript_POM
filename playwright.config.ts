import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',          // where the test files live
  timeout: 60_000,             // max time for one test (60s, safer on a slower PC/network)
  expect: { timeout: 10_000 }, // max wait for each expect(...) check
  fullyParallel: true,         // run test files in parallel
  workers: 2,                  // how many browsers run at the same time
  retries: 1,                  // re-run a failed test once (helps with slow websites)
  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    baseURL: 'https://www.saucedemo.com', // loginPage.goto() opens this
    headless: true,                    // false = see the browser
    navigationTimeout: 45_000,         // max time for page.goto()
    actionTimeout: 15_000,             // max time for click / fill etc.
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },

  // Learning setup: only Chrome runs by default.
  // To also test Firefox / Safari (WebKit), remove the // in front of those lines,
  // or run: npx playwright test --project=firefox
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },

    // Slow-motion Chrome for watching / learning: visible browser, 1 second pause before every action
    {
      name: 'chromium-slow',
      use: {
        ...devices['Desktop Chrome'],
        headless: false,
        launchOptions: { slowMo: 1000 },   // 1000 ms = 1 second. Make it 2000 for even slower
      },
    },
    // { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    // { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
  ],
});
