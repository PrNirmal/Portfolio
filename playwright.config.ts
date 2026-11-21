import { defineConfig } from "@playwright/test";

const baseURL = "http://127.0.0.1:4173";

export default defineConfig({
  testDir: "./tests",
  outputDir: "node_modules/.cache/playwright",
  use: { baseURL, browserName: "chromium", reducedMotion: "no-preference" },
  webServer: {
    command: "npm run dev -- --host 127.0.0.1 --port 4173 --strictPort",
    url: baseURL,
  },
});
