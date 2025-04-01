import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    actionTimeout: 40_000, // Timeout for each action
    trace: process.env.CI ? "off" : "retain-on-failure",
    video: process.env.CI ? "off" : "retain-on-failure",
    screenshot: "only-on-failure",

    ...devices["Desktop Chrome"],
    // deviceScaleFactor: undefined,
    // viewport: null,
    viewport: { width: 1920, height: 1080 },
    launchOptions: { args: ["--start-maximized"] },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
