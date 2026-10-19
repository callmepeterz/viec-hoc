import { loadEnvConfig } from "@next/env";
import { defineConfig, devices } from "@playwright/test";

loadEnvConfig(process.cwd());

const missingCredentials = ["TEST_EMAIL_A", "TEST_PASSWORD_A"].filter(
  (name) => !process.env[name],
);

if (missingCredentials.length > 0) {
  throw new Error(
    `Thiếu biến môi trường kiểm thử: ${missingCredentials.join(", ")}. ` +
      "Hãy cấu hình trong .env.local trước khi chạy Playwright.",
  );
}

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
