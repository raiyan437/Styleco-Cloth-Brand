import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
const require = createRequire(import.meta.url);
const sharp = require(
  require.resolve("sharp", { paths: [require.resolve("next")] }),
);
const inputs = {
  hero: "exec-ad7c51f6-2888-4480-8b51-6e7bbb4027b5.png",
  shirt: "exec-e9615450-c1a6-4d3e-9a47-8fee1fcacb4f.png",
  katua: "exec-b2f3e18d-eed7-423e-a6c8-b93e68bcf33a.png",
  tee: "exec-dae0752b-d5b2-45d5-80af-be71756bce83.png",
  pant: "exec-d9948866-e746-45da-bf65-21cc090be844.png",
  sleepwear: "exec-a1e0ef25-bef8-44f7-8cf9-acf749753b9e.png",
};
// One-time import utility. The generated source directory is supplied explicitly.
const source = process.argv[2];
if (!source)
  throw new Error("Pass the source directory containing the generated PNGs.");
await mkdir("public/images", { recursive: true });
for (const [name, file] of Object.entries(inputs)) {
  await sharp(`${source}/${file}`)
    .resize(1120, 1400, { fit: "cover" })
    .webp({ quality: 86 })
    .toFile(`public/images/${name}.webp`);
  if (name !== "hero") {
    const { width, height } = await sharp(`${source}/${file}`).metadata();
    await sharp(`${source}/${file}`)
      .extract({
        left: Math.round(width * 0.15),
        top: Math.round(height * 0.27),
        width: Math.round(width * 0.7),
        height: Math.round(height * 0.62),
      })
      .resize(800, 1000, { fit: "cover" })
      .webp({ quality: 84 })
      .toFile(`public/images/${name}-detail.webp`);
  }
}
