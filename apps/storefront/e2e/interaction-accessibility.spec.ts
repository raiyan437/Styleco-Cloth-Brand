import { expect, test } from "@playwright/test";

test.use({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
  reducedMotion: "reduce",
});

test("touch swatches, reduced motion and drawer focus", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Save Relaxed Oxford Shirt to wishlist" }),
  ).toBeEnabled();
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await expect(skip).toHaveCSS("opacity", "1");
  await page.keyboard.press("Enter");
  for (const control of [
    page.getByRole("button", { name: "Open menu" }),
    page.getByRole("button", { name: "Search" }),
    page.locator(".bag-button"),
  ]) {
    await expect
      .poll(async () => (await control.boundingBox())?.width ?? 0)
      .toBeGreaterThanOrEqual(44);
  }
  const card = page.locator(".latest-products-carousel .product-card").first();
  const swatch = card.getByRole("button", {
    name: "View Relaxed Oxford Shirt in White",
  });
  await swatch.tap();
  await expect(swatch).toHaveAttribute("aria-pressed", "true");
  await expect(card.locator("img.product-image")).toHaveAttribute(
    "alt",
    /white/i,
  );
  await expect(card.locator("img.product-image")).toHaveCSS(
    "animation-name",
    "none",
  );
  const menu = page.getByRole("button", { name: "Open menu" });
  await menu.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Shop", exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Shop by category")).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCSS("animation-name", "none");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(menu).toBeFocused();
});

test("wishlist and bag counts update in the topbar", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.locator(".wishlist-count")).toHaveCount(0);
  await expect(page.locator(".bag-count")).toHaveCount(0);

  await page
    .getByRole("button", { name: "Save Relaxed Oxford Shirt to wishlist" })
    .click();
  await expect(page.locator(".wishlist-count")).toHaveText("1");
  await expect(
    page.getByRole("link", { name: "Wishlist, 1 saved items" }),
  ).toBeVisible();

  await page.goto("/products/relaxed-oxford-shirt");
  await page.getByRole("button", { name: "Size S", exact: true }).click();
  await page.getByRole("button", { name: "Add to Bag", exact: true }).click();
  await expect(page.locator(".bag-count")).toHaveText("1");
  await expect(page.locator(".bag-button")).toHaveAttribute(
    "aria-label",
    "Bag, 1 items",
  );
});
