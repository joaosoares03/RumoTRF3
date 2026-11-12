import { expect, test } from "@playwright/test";

test("login e menu mobile sem rolagem horizontal", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: /Bem-vindo/ })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  expect(overflow).toBe(false);
});
