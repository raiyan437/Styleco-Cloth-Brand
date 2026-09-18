import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
const localRequire = createRequire(import.meta.url);
const sharp = createRequire(localRequire.resolve("next/package.json"))("sharp");

async function main() {
  const root = path.resolve(import.meta.dirname, "../../..");
  const manifest = JSON.parse(
    await fs.readFile(
      path.join(root, "docs/product-photo-manifest.json"),
      "utf8",
    ),
  );
  for (const item of manifest) {
    const colors = item.slug.includes("shirt")
      ? ["sky-blue", "white", "black"]
      : item.slug.includes("katua")
        ? ["ivory", "olive", "black"]
        : item.slug.includes("tee")
          ? ["forest", "white", "orange"]
          : /pant|trouser|chino/.test(item.slug)
            ? ["sand", "black", "olive"]
            : ["sky-blue", "ivory", "rose"];
    const directory = path.join(
      root,
      "apps/storefront/public/images/products",
      item.slug,
    );
    await fs.mkdir(directory, { recursive: true });
    const { width, height } = await sharp(item.source).metadata();
    for (let i = 0; i < 3; i++) {
      const left = Math.round((i * width) / 3);
      const panelWidth = Math.round(((i + 1) * width) / 3) - left;
      await sharp(item.source)
        .extract({ left, top: 0, width: panelWidth, height })
        .webp({ quality: 95 })
        .toFile(path.join(directory, colors[i] + ".webp"));
    }
    console.log(item.slug);
  }
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
