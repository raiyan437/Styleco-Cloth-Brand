# Styleco image credits

Original AI-generated editorial images, created with the built-in image generation
tool for the Styleco storefront. No Dribbble assets were copied. Category imagery
may include people; product-card imagery is intentionally product-only, with an
isolated garment on a light studio background like a catalog flat lay.

The current category panel refresh is stored folder-wise under
`public/images/categories/{shirt,katua,t-shirt,pant,sleepwear}/category.webp`.
These five portrait campaign images were generated as a cohesive editorial set
inspired by the composition and color-blocked fashion panels in the client
reference. They contain no text, logos or watermarks.

The `public/images/products` folder contains 15 optimized WebP assets plus
15 generated detail crops: one pair for each current category/color combination
(three colors per category). The five catalog products in a category share that
category/color pair, while every product still exposes its own three color
variants and `colorImages` mapping. This keeps the local fixture small while
exercising the same swatch and gallery contract that future SKU-specific Appwrite
Storage images will use.

All final WebP files are local under `public/images`. No external runtime image host.

## Prompt set

- Hero: South Asian adult model, vivid orange oversized overshirt, white tee and
  cream trousers, dynamic pose, sunlit cream studio, editorial 4:5 portrait.
- Shirt category panel: adult South Asian model, pale blue oversized cotton Oxford
  shirt and cream trousers, periwinkle studio, premium editorial texture, 4:5
  portrait.
- Katua category panel: adult South Asian model, ivory short cotton Katua with a
  mandarin collar and dark olive trousers, warm sand studio, 4:5 portrait.
- T-Shirt category panel: adult South Asian model, forest green heavyweight cotton
  T-shirt and taupe trousers, muted olive studio, 4:5 portrait.
- Pants category panel: waist-to-shoes crop, sand straight-leg cotton trousers and
  white sneakers, warm gray studio, 4:5 portrait.
- Sleepwear category panel: adult South Asian model, pale blue cotton pajama set
  with white piping, soft cream studio, 4:5 portrait.
- Product fixtures: isolated catalog garments (shirts, katua, tees, trousers and
  pajama sets) in the three fixture colors for each category, warm-white studio,
  soft shadow, portrait 4:5, no person, mannequin, hanger, props, text, logo or
  watermark. Detail crops are created locally with Sharp from those product-only
  sources.

All prompts requested realistic fashion photography with no text, logos or watermark.
The source PNGs are not required to run or build the storefront.
