import { defineConfig, devices } from "@playwright/test";

/**
 * Testes E2E em banco isolado (prisma/e2e.db) e porta 3100, sem interferir no banco de desenvolvimento.
 * O globalSetup recria o banco de teste (migrações + seed) antes da execução.
 */
const env = { DATABASE_URL: "file:./e2e.db", NEXT_DIST_DIR: ".next-e2e", ADMIN_EMAILS: "" };

export default defineConfig({
  testDir: "./e2e",
  timeout: 180_000,
  expect: { timeout: 20_000 },
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  globalSetup: "./e2e/global-setup.ts",
  use: { baseURL: "http://localhost:3100", trace: "retain-on-failure", locale: "pt-BR", timezoneId: "America/Sao_Paulo" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] }, testMatch: /mobile\.spec\.ts/ },
  ],
  webServer: {
    command: "npx next dev -p 3100",
    // /login não consulta o banco: o servidor sobe antes do globalSetup criar o banco de testes
    url: "http://localhost:3100/login",
    timeout: 240_000,
    reuseExistingServer: false,
    env,
  },
});
