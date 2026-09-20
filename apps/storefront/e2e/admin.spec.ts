import { expect, test, type Page } from "@playwright/test";

async function signIn(page: Page) {
  await page.goto("/admin/login");
  await page.getByLabel("Username").fill("admin");
  await page.getByRole("textbox", { name: /Password/ }).fill("admin");
  await page.getByRole("button", { name: "Enter admin studio" }).click();
  await expect(page).toHaveURL(/\/admin$/);
}

test.describe("admin studio", () => {
  test("requires login and keeps the storefront shell out of Admin", async ({
    page,
  }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);
    await expect(
      page.getByRole("heading", { name: "Sign in to continue" }),
    ).toBeVisible();

    await page.getByLabel("Username").fill("admin");
    await page.getByRole("textbox", { name: /Password/ }).fill("wrong");
    await page.getByRole("button", { name: "Enter admin studio" }).click();
    await expect(page.locator('p[role="alert"]')).toHaveText(
      "That username or password is not correct.",
    );

    await page.getByRole("textbox", { name: /Password/ }).fill("admin");
    await page.getByRole("button", { name: "Enter admin studio" }).click();
    await expect(
      page.getByRole("heading", { name: "Good morning, Admin." }),
    ).toBeVisible();
    await expect(page.locator(".site-header")).toHaveCount(0);
    await expect(page.locator(".site-footer")).toHaveCount(0);
  });

  test("uses the product-style cropper in category detail", async ({
    page,
  }) => {
    await signIn(page);
    await page.goto("/admin/categories");
    await expect(
      page.getByRole("heading", {
        name: "Give every collection its own frame.",
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Category panel" }),
    ).toHaveCount(0);
    await page.getByRole("link", { name: /^Shirt / }).click();
    await expect(page).toHaveURL(/\/admin\/categories\/[^/]+$/);
    await expect(
      page.getByRole("heading", { name: "Category panel" }),
    ).toBeVisible();
    await expect(
      page.locator(".admin-file-button").filter({ hasText: "Replace image" }),
    ).toBeVisible();
    await expect(
      page.getByRole("img", {
        name: /Full image with Category panel crop selection/,
      }),
    ).toBeVisible();

    await page.locator('input[type="file"]').setInputFiles({
      name: "category.png",
      mimeType: "image/png",
      buffer: Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
        "base64",
      ),
    });
    await expect(
      page.getByRole("heading", { name: "Category panel" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Make crop larger" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Save cropped image" }),
    ).toBeVisible();
    const cropSelection = page.getByLabel("Move Category panel crop selection");
    await expect(cropSelection).toBeVisible();
    const cropLeftBeforeMove = await cropSelection.evaluate(
      (element) => window.getComputedStyle(element).left,
    );
    await cropSelection.press("ArrowRight");
    const cropLeftAfterMove = await cropSelection.evaluate(
      (element) => window.getComputedStyle(element).left,
    );
    expect(cropLeftAfterMove).not.toBe(cropLeftBeforeMove);
    await page.getByRole("button", { name: "Save cropped image" }).click();
    await expect(
      page.getByText("Saved preview", { exact: true }),
    ).toBeVisible();
    await expect(page.getByText(/1200 × 1470 px/)).toBeVisible();
    await expect
      .poll(() =>
        page
          .locator(".admin-crop-source-image")
          .evaluate((image: HTMLImageElement) => [
            image.naturalWidth,
            image.naturalHeight,
          ]),
      )
      .toEqual([1200, 1470]);
    await expect(
      page.getByRole("heading", { name: "Category panel" }),
    ).toBeVisible();
  });

  test("uses the animated accessible dropdown controls", async ({ page }) => {
    await signIn(page);
    await page.goto("/admin/products");

    const categoryFilter = page.getByRole("button", {
      name: "Filter products by category",
    });
    await expect(categoryFilter).toHaveAttribute("aria-expanded", "false");
    await categoryFilter.click();
    await expect(categoryFilter).toHaveAttribute("aria-expanded", "true");
    await expect(
      page.getByRole("option", { name: "All categories" }),
    ).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(categoryFilter).toHaveAttribute("aria-expanded", "false");
  });

  test("exposes every homepage image slot with its target crop", async ({
    page,
  }) => {
    await signIn(page);
    await page.goto("/admin/settings");

    await expect(
      page.getByRole("heading", { name: "Shape every photo slot." }),
    ).toBeVisible();
    for (const label of [
      "Explore Current Sale",
      "Find your next favorite",
      "The Katua Collection",
      "Made for slow mornings",
      "Behind The Brand",
    ]) {
      await expect(page.getByRole("heading", { name: label })).toBeVisible();
    }
    await expect(page.getByText(/2400 × 1050 px/)).toBeVisible();
    await expect(page.getByText(/1800 × 1800 px/)).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Save cropped image" }),
    ).toHaveCount(5);
  });

  test("deletes a category with confirmation and keeps the editor usable", async ({
    page,
  }) => {
    await signIn(page);
    await page.goto("/admin/categories");
    await page.getByRole("link", { name: /^Shirt / }).click();
    page.once("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: "Delete" }).click();
    await expect(
      page.getByRole("heading", { name: "4 categories" }),
    ).toBeVisible();
    await expect(page.getByText("Katua", { exact: true })).toBeVisible();
  });

  test("uses paginated product and order list/detail flows", async ({
    page,
  }) => {
    await signIn(page);

    await page.goto("/admin/products");
    await expect(
      page.getByRole("heading", { name: "25 products" }),
    ).toBeVisible();
    await expect(page.getByText("Showing 1–15 of 25")).toBeVisible();
    await expect(page.locator('a[href^="/admin/products/"]')).toHaveCount(15);
    await expect(
      page.getByRole("heading", { name: "Sizes and stock" }),
    ).toHaveCount(0);
    await page.getByRole("link", { name: /Relaxed Oxford Shirt/ }).click();
    await expect(page).toHaveURL(/\/admin\/products\/shirt-1$/);
    await expect(
      page.getByRole("heading", { name: "Create a product variant" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "Stock by color and size",
      }),
    ).toBeVisible();
    await expect(page.getByLabel("URL slug")).toBeVisible();
    await expect(page.getByLabel("Material and details")).toBeVisible();
    await expect(page.getByLabel("SEO title")).toBeVisible();
    await expect(page.getByRole("button", { name: "Duplicate" })).toBeVisible();

    await page.goto("/admin/orders");
    await expect(page.getByText("Order detail")).toHaveCount(0);
    await page.getByRole("link", { name: /SC-1048/ }).click();
    await expect(page).toHaveURL(/\/admin\/orders\/SC-1048$/);
    await expect(page.getByText("Order detail")).toBeVisible();
  });

  test("creates a four-image color variant and publishes it to the storefront", async ({
    page,
  }) => {
    await signIn(page);
    await page.goto("/admin/products");
    await page.getByRole("button", { name: "New product" }).click();
    await expect(page).toHaveURL(/\/admin\/products\/product-/);

    await page.getByLabel("Product name").fill("Forest Studio Shirt");
    await page
      .getByLabel("Material and details")
      .fill("Soft washed cotton with reinforced seams.");
    await page
      .getByLabel("Fit and sizing")
      .fill("Relaxed through the body with a true-to-size shoulder.");
    await page
      .getByLabel("Care instructions")
      .fill("Machine wash cold and line dry.");
    await page.getByLabel("Search keywords").fill("green shirt, cotton");
    await page.getByLabel("SEO title").fill("Forest Studio Shirt | Styleco");
    await page
      .getByLabel("SEO description")
      .fill("A relaxed forest green cotton shirt from Styleco.");
    await page.getByRole("button", { name: "Save changes" }).click();

    const imageFile = {
      name: "product.png",
      mimeType: "image/png",
      buffer: Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
        "base64",
      ),
    };

    await page.getByRole("button", { name: "Product status" }).click();
    await page.getByRole("option", { name: "Published" }).click();
    await expect(page.getByText(/publishing requirement/)).toBeVisible();
    await page.getByLabel("Color name").fill("Forest Green");
    await page.getByLabel("Variant hex code").fill("#24513A");
    await page.getByLabel("Original price").fill("2990");
    await page.getByLabel("Starting stock for size S").fill("10");
    await page.getByLabel("Starting stock for size M").fill("4");
    await page.getByLabel("Starting stock for size L").fill("7");
    await page.getByLabel("Starting stock for size XL").fill("2");
    await page.getByRole("button", { name: "Create variant" }).click();

    const colorPanel = page
      .locator(".admin-color-media-panel")
      .filter({ hasText: "Forest Green" });
    await expect(
      page.getByText("Forest Green needs at least one product image."),
    ).toBeVisible();
    const cardCropper = colorPanel
      .locator(".admin-cropper")
      .filter({ hasText: "Forest Green product card" });
    await cardCropper.locator('input[type="file"]').setInputFiles(imageFile);
    await cardCropper
      .getByRole("button", { name: "Save cropped image" })
      .click();

    for (let index = 1; index <= 4; index += 1) {
      const title = `Gallery image ${index}${index === 1 ? " · primary" : ""}`;
      const cropper = colorPanel
        .locator(".admin-cropper")
        .filter({ hasText: title });
      await cropper.locator('input[type="file"]').setInputFiles(imageFile);
      await cropper.getByRole("button", { name: "Save cropped image" }).click();
      await expect(colorPanel.getByText(`${index} / 4 images`)).toBeVisible();
    }

    await colorPanel
      .getByLabel("Image 1 alt text")
      .fill("Forest green shirt front view");
    await expect(
      colorPanel.getByRole("button", {
        name: /Move Forest Green image 2 earlier/,
      }),
    ).toBeVisible();
    await expect(page.getByLabel("Forest Green hex code")).toHaveValue(
      "#24513A",
    );
    await expect(page.getByText("4 variants", { exact: true })).toBeVisible();
    await expect(page.getByLabel("Stock for Forest Green S")).toHaveValue("10");
    await expect(page.getByLabel("Stock for Forest Green M")).toHaveValue("4");
    await expect(page.getByLabel("Stock for Forest Green L")).toHaveValue("7");
    await expect(page.getByLabel("Stock for Forest Green XL")).toHaveValue("2");
    await expect(page.getByText("Ready to publish")).toBeVisible();

    await page.getByRole("button", { name: "Product status" }).click();
    await page.getByRole("option", { name: "Published" }).click();
    await expect(
      page.getByText(
        "Published changes are now available in the local storefront.",
      ),
    ).toBeVisible();

    await page.getByRole("link", { name: /Preview storefront/ }).click();
    await expect(page).toHaveURL(/\/products\/preview\?id=product-/);
    await expect(
      page.getByRole("heading", { name: "Forest Studio Shirt" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Select Forest Green" }),
    ).toBeVisible();
    await expect(page.getByText("01 / 04")).toBeVisible();
    await expect(page.getByText("৳2,490")).toBeVisible();
    await expect(page.getByText("৳2,990")).toBeVisible();
  });

  test("duplicates products as drafts and confirms product deletion", async ({
    page,
  }) => {
    await signIn(page);
    await page.goto("/admin/products/shirt-1");
    await page.getByRole("button", { name: "Duplicate" }).click();
    await expect(page).toHaveURL(/\/admin\/products\/product-/);
    await expect(
      page.getByRole("heading", { name: /Edit Relaxed Oxford Shirt copy/ }),
    ).toBeVisible();
    await expect(page.getByText("draft", { exact: true })).toBeVisible();

    page.once("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: "Delete product" }).click();
    await expect(page).toHaveURL(/\/admin\/products$/);
    await expect(
      page.getByRole("heading", { name: "25 products" }),
    ).toBeVisible();
  });

  test("does not expose an Admin link in the public storefront", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator('a[href^="/admin"]')).toHaveCount(0);
  });
});
