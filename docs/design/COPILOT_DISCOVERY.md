# Styleco homepage discovery

Status: complete, 2026-09-15. Scope: decisions needed for D1–D4 only.

## Conclusions

- The first homepage must move shoppers from campaign interest to a category or
  product quickly. Its fixed hierarchy is announcement, global header, editorial
  hero, Categories, Latest Products, Top Sellers, unresolved campaign content,
  and footer.
- Categories remain Shirt, Katua, T-Shirt, Pant, and Sleepwear. They are repository
  data, never gender navigation or a UI enum.
- The existing homepage domain supports enabled, positioned, manually curated
  product collections. “Latest” and “Top Sellers” are merchandising labels, so no
  service or domain change is needed.
- Full category navigation fits comfortably only at wide desktop sizes. Narrower
  desktop uses direct New Arrivals and Sale links plus a Shop menu; mobile/tablet
  uses a drawer. Details are in D2.
- The provided [Dribbble reference](https://dribbble.com/shots/22073549-Clothing-Fashion-Landing-Page)
  was inspected on 2026-09-15. Its useful broad cues are oversized black grotesk
  type, a bright white canvas, unequal editorial image cards, vivid warm/cool color,
  compact product merchandising, and graphic campaign tiles. Styleco will not use
  its assets, copy, exact values, gender labels, or page composition.
- Direction A — Editorial Pop best balances distinction, youth, and scannable
  commerce. D3 records two related alternatives and the selection rationale.
- Mobile is a re-composition: condensed navigation, stacked hero copy/media,
  intentional carousel peeks, and persistent card information. It is not a scaled
  desktop canvas.

## Asset strategy

Development uses committed local placeholders or original generated demo imagery.
The storefront must run without a remote image provider. Production media will live
in Appwrite Storage and be mapped to the existing `ProductImage` domain shape.

| Asset              |             Quantity | Preferred master ratio           | Crop guidance                                                 |
| ------------------ | -------------------: | -------------------------------- | ------------------------------------------------------------- |
| Hero campaign      |                  1–2 | 4:5 portrait plus 16:9 safe crop | Keep subject clear of copy-safe edge; plan 4:5 mobile crop    |
| Category editorial |                    5 | 4:5                              | Full/three-quarter garment view; consistent focal height      |
| Product primary    |          Per product | 4:5                              | Centered garment/model, consistent scale, quiet background    |
| Product secondary  | Optional per product | 4:5                              | Same crop family; alternate pose/detail for hover and gallery |
| Campaign editorial |   As specified later | 3:2 and 1:1                      | Preserve text-safe variants; content is not finalized         |

Store source masters at sufficient resolution for a 1600px rendered long edge;
generate responsive derivatives later through the chosen Appwrite image workflow.
Alt text must describe the product or campaign purpose, not visual decoration.

## Open decisions for later design stages

Approved photography, campaign copy, locale/currency, final public route pattern,
wishlist behavior for signed-out shoppers, hero content schema, and D5–D9 artifact
definitions remain unresolved. They do not block the initial token system.
