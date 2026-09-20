import { expect, test } from "@playwright/test";

test.describe("custom cursor", () => {
  test.describe("fine pointer", () => {
    test.use({ viewport: { width: 1440, height: 900 }, hasTouch: false });

    test("follows the pointer and expands over controls", async ({ page }) => {
      await page.goto("/");
      const cursor = page.locator("body > .custom-cursor");
      const dot = cursor.locator(".custom-cursor-dot");
      const ring = cursor.locator(".custom-cursor-ring");

      await expect(cursor).toHaveCSS("display", "block");
      await expect(page.locator("html")).toHaveClass(/custom-cursor-enabled/);
      await page.mouse.move(320, 240);
      await expect(dot).toHaveAttribute("data-visible", "true");
      await expect(ring).toHaveAttribute("data-visible", "true");

      await page.getByRole("button", { name: "Search", exact: true }).hover();
      await expect(ring).toHaveAttribute("data-interactive", "true");
      await expect(ring).toHaveCSS("width", "56px");

      await page.getByRole("button", { name: /^Bag,/ }).click();
      const bagDialog = page.locator("dialog[open]");
      const bagRing = bagDialog.locator(".custom-cursor-ring");
      await expect(bagRing).toHaveAttribute("data-visible", "true");
      await bagDialog.evaluate(async (element) => {
        await Promise.all(
          element.getAnimations().map((animation) => animation.finished),
        );
      });
      const bagPlacement = await bagDialog.evaluate((element) => {
        const rect = element.getBoundingClientRect();
        return {
          top: rect.top,
          bottom: rect.bottom,
          left: rect.left,
          right: rect.right,
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight,
          },
        };
      });
      expect(bagPlacement.right).toBeLessThanOrEqual(
        bagPlacement.viewport.width - 15,
      );
      expect(bagPlacement.top).toBeGreaterThanOrEqual(15);
      expect(bagPlacement.bottom).toBeLessThanOrEqual(
        bagPlacement.viewport.height - 15,
      );
      const drawerOverflow = await bagDialog.evaluate(
        (element) => element.scrollWidth - element.clientWidth,
      );
      expect(drawerOverflow).toBeLessThanOrEqual(1);
      await bagDialog.getByRole("button").first().hover();
      await expect(bagRing).toHaveAttribute("data-interactive", "true");
      await expect(bagRing).toHaveCSS("width", "56px");
      await page.mouse.click(280, 360);
      await expect(page.locator("dialog[open]")).toHaveCount(0);

      await page.getByRole("button", { name: "Open menu" }).click();
      const menuDialog = page.locator("dialog[open]");
      const menuRing = menuDialog.locator(".custom-cursor-ring");
      await menuDialog.evaluate(async (element) => {
        await Promise.all(
          element.getAnimations().map((animation) => animation.finished),
        );
      });
      const menuPlacement = await menuDialog.evaluate((element) => {
        const rect = element.getBoundingClientRect();
        return {
          top: rect.top,
          bottom: rect.bottom,
          left: rect.left,
          right: rect.right,
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight,
          },
        };
      });
      expect(menuPlacement.left).toBeGreaterThanOrEqual(15);
      expect(menuPlacement.right).toBeLessThanOrEqual(
        menuPlacement.viewport.width - 15,
      );
      expect(menuPlacement.top).toBeGreaterThanOrEqual(15);
      expect(menuPlacement.bottom).toBeLessThanOrEqual(
        menuPlacement.viewport.height - 15,
      );
      await menuDialog.getByRole("button").first().hover();
      await expect(menuRing).toHaveAttribute("data-visible", "true");
      await expect(menuRing).toHaveAttribute("data-interactive", "true");
      await page.mouse.click(1200, 360);
      await expect(page.locator("dialog[open]")).toHaveCount(0);
    });
  });

  test.describe("touch pointer", () => {
    test.use({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
      isMobile: true,
    });

    test("keeps the custom cursor hidden", async ({ page }) => {
      await page.goto("/");
      await expect(page.locator("body > .custom-cursor")).toHaveCSS(
        "display",
        "none",
      );
      await expect(page.locator("html")).not.toHaveClass(
        /custom-cursor-enabled/,
      );
    });
  });
});
