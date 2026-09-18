import { test, expect, type Page } from "@playwright/test";

async function capture(page: Page, path: string) {
  await expect(page.locator("main:not([aria-busy]):visible")).toBeVisible();
  await expect(page.locator('main[aria-busy="true"]:visible')).toHaveCount(0);
  await page.evaluate(async () => {
    await document.fonts.ready;
    const images = Array.from(
      document.querySelectorAll<HTMLImageElement>("main img"),
    );
    for (const img of images) img.loading = "eager";
    await Promise.all(images.map((img) => img.decode().catch(() => {})));
  });
  await page.screenshot({ path, fullPage: true, caret: "initial" });
}

for (const viewport of [
  { width: 1440, height: 1000 },
  { width: 390, height: 844 },
]) {
  test(`shopping journey and visual QA at ${viewport.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    await page.goto("/");
    await expect(
      page.getByRole("link", { name: "Wishlist, 0 saved items" }),
    ).toBeVisible();
    await expect(page.locator(".hero")).toHaveCount(0);
    await expect(
      page.getByRole("link", { name: /Pants editorial collection/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Sleepwear editorial collection/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Styleco essentials" }),
    ).toHaveCount(0);
    await expect(page.locator("footer form")).toHaveCount(0);
    await expect(page.getByRole("contentinfo")).not.toContainText(
      /newsletter/i,
    );
    await expect(
      page.getByRole("heading", { name: "Best Sellers" }),
    ).toBeVisible();
    await expect(
      page.getByText("Save on selected styles", { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText("Most loved right now", { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText("New into the collection", { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /^Current Sale\.$/ }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /^Latest Products\.$/ }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Explore Current Sale" }),
    ).toBeVisible();
    await expect(
      page.locator(".luxury-banner").getByRole("link", {
        name: "Explore Now",
        exact: true,
      }),
    ).toHaveAttribute("href", "/sale");
    await expect(
      page.getByRole("button", {
        name: "Save Relaxed Oxford Shirt to wishlist",
      }),
    ).toBeEnabled();
    await capture(page, `test-results/home-${viewport.width}.png`);
    const firstCard = page
      .locator(".latest-products-carousel .product-card")
      .first();
    expect(
      (await firstCard.locator(".wishlist-button").boundingBox())!.width,
    ).toBeLessThan(44);
    const firstImage = firstCard.locator("img.product-image");
    const initialImage = await firstImage.getAttribute("src");
    if (viewport.width > 768) {
      await firstCard.scrollIntoViewIfNeeded();
      const before = await firstCard.boundingBox();
      await firstCard.locator(".product-image-link").hover();
      await expect
        .poll(async () =>
          firstImage.evaluate(
            (el) => new DOMMatrix(getComputedStyle(el).transform).a,
          ),
        )
        .toBeGreaterThan(1);
      expect(await firstCard.boundingBox()).toEqual(before);
      await expect(firstCard.locator(".product-image-secondary")).toHaveCount(
        0,
      );
      await page.getByRole("heading", { name: /^Latest Products\.$/ }).hover();
    }
    await expect(
      firstCard.getByRole("button", {
        name: "View Relaxed Oxford Shirt in Sky Blue",
      }),
    ).toHaveAttribute("aria-pressed", "true");
    const whiteSwatch = firstCard.getByRole("button", {
      name: "View Relaxed Oxford Shirt in White",
    });
    await whiteSwatch.click();
    await expect(whiteSwatch).toHaveClass(/selected/);
    await expect(whiteSwatch).toHaveAttribute("aria-pressed", "true");
    await expect(whiteSwatch).toHaveCSS("border-top-width", "0px");
    await expect
      .poll(() => firstImage.getAttribute("src"))
      .not.toBe(initialImage);
    await expect(firstImage).toHaveCSS("animation-name", "swatch-image-next");
    await firstCard
      .getByRole("button", {
        name: "View Relaxed Oxford Shirt in Sky Blue",
      })
      .click();
    await expect(firstImage).toHaveCSS(
      "animation-name",
      "swatch-image-previous",
    );
    await expect(page.getByText("3 colors", { exact: true })).toHaveCount(0);
    await page.locator(".fashion-panel").first().click();
    await expect(page).toHaveURL(/\/category\/shirt/);
    if (viewport.width >= 1024) {
      await expect
        .poll(() =>
          page
            .locator(".product-grid")
            .evaluate(
              (grid) =>
                getComputedStyle(grid).gridTemplateColumns.split(" ").length,
            ),
        )
        .toBe(4);
    }
    await capture(page, `test-results/category-${viewport.width}.png`);
    if (viewport.width < 768)
      await page.getByRole("button", { name: "Filters", exact: true }).click();
    const filter =
      viewport.width < 768
        ? page.getByRole("dialog")
        : page.locator(".desktop-filters");
    await filter.getByLabel("On sale").check();
    if (viewport.width < 768)
      await page.getByRole("button", { name: "Show 2 pieces" }).click();
    await expect(page.locator(".product-grid .product-card")).toHaveCount(2);
    if (viewport.width < 768)
      await page.getByRole("button", { name: /Filters/ }).click();
    await filter.getByRole("button", { name: "Clear all filters" }).click();
    if (viewport.width < 768)
      await page.getByRole("button", { name: "Show 5 pieces" }).click();
    await page.getByLabel("Sort by").selectOption("price-high");
    await expect(
      page.locator(".product-grid .product-name").first(),
    ).toHaveText("Studio Overshirt");
    await page
      .getByRole("link", { name: "Relaxed Oxford Shirt", exact: true })
      .click();
    await expect(page).toHaveURL(/\/products\/relaxed-oxford-shirt/);
    if (viewport.width >= 768) {
      await expect
        .poll(async () => {
          const box = await page.locator(".gallery-main").boundingBox();
          return box ? box.y + box.height : 0;
        })
        .toBeLessThan(viewport.height);
    }
    await expect(
      page.getByRole("button", { name: "Select Sky Blue", exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    await page.getByRole("button", { name: "Next product image" }).click();
    await expect(
      page.getByRole("button", { name: "Show image 2" }),
    ).toHaveAttribute("aria-pressed", "true");
    await page.getByRole("button", { name: "Size guide", exact: true }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    const galleryImage = page.locator(".gallery-main img");
    const blueImage = await galleryImage.getAttribute("src");
    await page
      .getByRole("button", { name: "Select White", exact: true })
      .click();
    await expect
      .poll(() => galleryImage.getAttribute("src"))
      .not.toBe(blueImage);
    await expect(
      page.getByRole("button", { name: "Show image 1" }),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(galleryImage).toHaveAttribute("alt", /white/i);
    await expect(
      page.getByRole("button", { name: "Size M — unavailable" }),
    ).toBeDisabled();
    await page
      .getByRole("button", { name: "Select Sky Blue", exact: true })
      .click();
    await expect(
      page.getByRole("button", { name: "Size L — unavailable" }),
    ).toBeDisabled();
    await page.getByRole("button", { name: "Size S", exact: true }).click();
    if (viewport.width < 768) {
      const related = page.getByRole("region", { name: "You may also like" });
      const card = related.locator(".product-card").first();
      // Product recommendations retain readable cards and horizontal overflow.
      expect((await card.boundingBox())!.width).toBeGreaterThan(180);
      const nextCard = related.locator(".product-card").nth(1);
      expect((await nextCard.boundingBox())!.y).toBe(
        (await card.boundingBox())!.y,
      );
      await expect(
        related.getByRole("button", { name: "Next You may also like" }),
      ).toBeEnabled();
    }
    await page
      .getByRole("button", { name: "Save Relaxed Oxford Shirt to wishlist" })
      .click();
    await capture(page, `test-results/product-${viewport.width}.png`);
    await page.getByRole("button", { name: "Add to Bag", exact: true }).click();
    await expect(page.getByRole("dialog", { name: "Your bag" })).toBeVisible();
    await expect(page.locator(".bag-count")).toHaveText("1");
    await expect(page.locator(".bag-button")).toHaveAttribute(
      "aria-label",
      "Bag, 1 items",
    );
    await page.getByRole("link", { name: "View your bag" }).click();
    await expect(page).toHaveURL(/\/cart/);
    await page
      .getByRole("button", { name: "Increase Relaxed Oxford Shirt" })
      .click();
    await page
      .getByRole("button", { name: "Increase Relaxed Oxford Shirt" })
      .click();
    await expect(
      page.getByRole("button", { name: "Increase Relaxed Oxford Shirt" }),
    ).toBeDisabled();
    await page
      .getByRole("button", { name: "Decrease Relaxed Oxford Shirt" })
      .click();
    await page.getByLabel("Have a little something extra?").fill("STYLE10");
    await page.getByRole("button", { name: "Apply", exact: true }).click();
    await expect(
      page.getByText("STYLE10 applied.", { exact: false }),
    ).toBeVisible();
    await page.reload();
    await expect(
      page.getByText("STYLE10", { exact: false }).first(),
    ).toBeVisible();
    await capture(page, `test-results/cart-${viewport.width}.png`);
    await page.getByRole("link", { name: "Continue to checkout" }).click();
    await page.getByRole("button", { name: "Place demo order" }).click();
    await expect(page.getByText("Enter a valid email address.")).toBeVisible();
    await page
      .getByLabel("Email address", { exact: true })
      .fill("alex@example.com");
    await page.getByLabel("Phone number", { exact: true }).fill("01712345678");
    await page.getByLabel("Full name", { exact: true }).fill("Alex Rahman");
    await page
      .getByLabel("Street address", { exact: true })
      .fill("House 12, Road 5, Dhanmondi");
    await page.getByLabel("City", { exact: true }).fill("Dhaka");
    await page.getByLabel("Postal code", { exact: true }).fill("1209");
    await page.getByRole("radio", { name: /Demo Card/ }).check();
    await page.getByLabel("Demo test card number").fill("4000 0000 0000 0002");
    await page.getByRole("button", { name: "Place demo order" }).click();
    await expect(
      page.getByRole("alert").filter({ hasText: "Demo card declined" }),
    ).toBeVisible();
    await page.getByLabel("Demo test card number").fill("4242 4242 4242 4242");
    if (viewport.width < 768)
      await page.getByRole("radio", { name: /Cash on Delivery/ }).check();
    await capture(page, `test-results/checkout-${viewport.width}.png`);
    await expect(page.locator("html")).toHaveJSProperty(
      "scrollWidth",
      viewport.width,
    );
    await page.getByRole("button", { name: "Place demo order" }).click();
    await expect(page).toHaveURL(/\/order-confirmation/);
    await expect(
      page.getByRole("heading", { name: "Good choices. Great taste." }),
    ).toBeVisible();
    await page.reload();
    await expect(page.getByText("Alex Rahman")).toBeVisible();
    await page.goto("/wishlist");
    await expect(page.locator(".product-card")).toHaveCount(1);
    await expect(page.locator(".wishlist-summary")).toBeVisible();
    await expect(page.locator(".wishlist-summary")).toHaveCSS(
      "position",
      "static",
    );
    await expect(page.locator(".wishlist-count")).toHaveText("1");
    await page
      .getByRole("button", {
        name: "Remove Relaxed Oxford Shirt from wishlist",
      })
      .click();
    await expect(page.getByText("Keep the good ones close.")).toBeVisible();
    await page.getByRole("button", { name: "Search", exact: true }).click();
    await page.getByRole("textbox", { name: "Search products" }).fill("katua");
    await expect(page.locator(".search-results>a")).toHaveCount(4);
    await page
      .getByRole("textbox", { name: "Search products" })
      .fill("no-such-style");
    await expect(
      page.getByText("No matches just yet.", { exact: false }),
    ).toBeVisible();
    await page.keyboard.press("Escape");
    if (viewport.width < 768) {
      await page.getByRole("button", { name: "Open menu" }).click();
      await page
        .getByRole("navigation", { name: "Shop menu" })
        .getByRole("link", { name: "Katua", exact: true })
        .click();
      await expect(page).toHaveURL(/\/category\/katua/);
    }
    expect(errors).toEqual([]);
  });
}

test("all routes and requested breakpoints", async ({ page }) => {
  test.setTimeout(180000);
  const routes = [
    "/",
    "/category/shirt",
    "/category/katua",
    "/category/t-shirt",
    "/category/pant",
    "/category/sleepwear",
    "/new-arrivals",
    "/sale",
    "/search?q=cotton",
    "/products/relaxed-oxford-shirt",
    "/products/classic-piped-sleep-set",
    "/cart",
    "/checkout",
    "/wishlist",
    "/login",
    "/register",
    "/account",
    "/about",
    "/contact",
    "/faq",
    "/shipping-returns",
    "/size-guide",
    "/privacy",
    "/terms",
  ];
  for (const route of routes) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("main:not([aria-busy]):visible")).toBeVisible();
  }
  for (const width of [360, 430, 768, 1024, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of routes) {
      await page.goto(route);
      await expect(page.locator("main:not([aria-busy]):visible")).toBeVisible();
      await expect
        .poll(() =>
          page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        )
        .toBe(true);
    }
  }
  // App Router streams the loading boundary with HTTP 200 before resolving notFound.
  const response = await page.goto("/products/not-a-product");
  expect([200, 404]).toContain(response?.status());
  await expect(page.getByRole("heading", { name: /This look/i })).toBeVisible();
  await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute(
    "content",
    /noindex/,
  );
});
