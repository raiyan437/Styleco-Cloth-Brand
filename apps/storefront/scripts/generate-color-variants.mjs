import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";

const require = createRequire(import.meta.url);
const sharp = require(
  require.resolve("sharp", { paths: [require.resolve("next")] }),
);

const groups = {
  shirt: [
    { suffix: "1", saturation: 0.5, brightness: 1.08, hue: 0 },
    { suffix: "2", saturation: 0.55, brightness: 0.68, hue: 0 },
  ],
  katua: [
    { suffix: "1", saturation: 1.15, brightness: 0.88, hue: 35 },
    { suffix: "2", saturation: 0.55, brightness: 0.64, hue: 0 },
  ],
  tee: [
    { suffix: "1", saturation: 0.45, brightness: 1.1, hue: 0 },
    { suffix: "2", saturation: 1.2, brightness: 1.03, hue: -30 },
  ],
  pant: [
    { suffix: "1", saturation: 0.6, brightness: 0.65, hue: 0 },
    { suffix: "2", saturation: 0.85, brightness: 0.84, hue: 35 },
  ],
  sleepwear: [
    { suffix: "1", saturation: 0.48, brightness: 1.08, hue: 0 },
    { suffix: "2", saturation: 0.7, brightness: 1.03, hue: 325 },
  ],
};

await mkdir("public/images", { recursive: true });
for (const [group, variants] of Object.entries(groups)) {
  for (const variant of variants) {
    const options = {
      saturation: variant.saturation,
      brightness: variant.brightness,
      hue: variant.hue,
    };
    await sharp(`public/images/${group}.webp`)
      .modulate(options)
      .webp({ quality: 84 })
      .toFile(`public/images/${group}-color-${variant.suffix}.webp`);
    await sharp(`public/images/${group}-detail.webp`)
      .modulate(options)
      .webp({ quality: 82 })
      .toFile(`public/images/${group}-color-${variant.suffix}-detail.webp`);
  }
}
