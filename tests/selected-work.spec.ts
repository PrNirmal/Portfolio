import { expect, test } from "@playwright/test";

test("keeps the pinned project when touch emulation changes at 1366 × 768", async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto("/");
  await expect(page.locator(".portfolio-intro")).toBeHidden();
  await page
    .getByRole("navigation", { name: "Main Navigation" })
    .getByRole("link", { name: "Work" })
    .click();

  const showcase = page.locator(".work-showcase");
  await expect
    .poll(() => showcase.evaluate((element) => Math.abs(element.getBoundingClientRect().top)))
    .toBeLessThanOrEqual(1);

  const projects = page.getByRole("navigation", { name: "Projects" });
  const second = projects.getByRole("button", { name: /^Show project 02/ });
  await second.press("Enter");
  await expect(second).toHaveAttribute("aria-current", "true");
  await expect(page.locator(".work-carousel")).toBeHidden();

  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 1 });
  await expect.poll(() => page.evaluate(() => matchMedia("(pointer: coarse)").matches)).toBe(true);
  await expect(second).toHaveAttribute("aria-current", "true");
  await expect(page.locator(".work-carousel")).toBeHidden();
  await expect(showcase.getByText("90° Straight View")).toBeInViewport();

  const third = projects.getByRole("button", { name: /^Show project 03/ });
  const bounds = (await third.boundingBox())!;
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 }],
  });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await expect(third).toHaveAttribute("aria-current", "true");
  await expect(showcase.getByText("Last project")).toBeInViewport();

  await cdp.send("Emulation.setTouchEmulationEnabled", { enabled: false });
  await expect.poll(() => page.evaluate(() => matchMedia("(pointer: fine)").matches)).toBe(true);
  await expect(third).toHaveAttribute("aria-current", "true");
  await expect(page.locator(".work-carousel")).toBeHidden();
});

test("uses the carousel at small viewport sizes and with reduced motion", async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("portfolio-intro-seen", "1"));
  await page.setViewportSize({ width: 1024, height: 600 });
  await page.goto("/");
  const showcase = page.locator(".work-showcase");
  const carousel = page.locator(".work-carousel");

  await expect(showcase).toBeVisible();
  await expect(carousel).toBeHidden();

  for (const viewport of [
    { width: 1024, height: 599 },
    { width: 1023, height: 600 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    await expect(carousel).toBeVisible();
    await expect(showcase).toBeHidden();
  }

  await page.setViewportSize({ width: 1366, height: 768 });
  await expect(showcase).toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(carousel).toBeVisible();
  await expect(showcase).toBeHidden();
  await carousel.getByRole("button", { name: "Next project" }).click();
  await expect(carousel.locator("article[data-active]").getByRole("heading")).toHaveText(
    "INTERVIEW ANALYSER",
  );
});
