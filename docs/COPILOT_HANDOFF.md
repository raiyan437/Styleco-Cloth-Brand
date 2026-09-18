# Handoff — complete frontend demo

## Campaign banner sale CTA — 2026-09-18

The homepage campaign banner now reads “Explore Current Sale” and uses the
high-resolution local `current-sale-banner.png` editorial asset. Its Explore
Now link routes directly to `/sale`; supporting copy is unchanged.

## Category listing density — 2026-09-18

Category pages now show four product cards per row on desktop. Tablet and
mobile retain three and two columns respectively for readable card metadata.

## Product detail gallery scale — 2026-09-18

Desktop PDP galleries are capped to the viewport space below the site chrome,
and the product image uses contained fitting so the whole photo is visible
without an initial scroll. Mobile retains its responsive gallery behavior.

## Homepage carousel labels — 2026-09-18

The homepage carousels now read Current Sale, Best Sellers and Latest Products.
Their supporting eyebrow labels are Save on selected styles, Most loved right
now and New into the collection. Product data and carousel behavior are
unchanged.

## Sale-card spacing and directional color transition — 2026-09-17

Sale prices no longer determine the vertical position of carousel swatches.
Selecting a color to the right slides its image in from the right; selecting a
color to the left slides it in from the left. Reduced-motion preferences disable
the slide.

## Product-card spacing and color transition — 2026-09-17

Carousel swatches now sit directly beneath the product name without an empty
reserved line. Color changes keep the card stationary and fade the newly loaded
image into view; reduced-motion preferences disable that feedback.

## Catalog and mobile polish — 2026-09-17

Product-specific WebP photos now live under public/images/products/<slug>/, with 60 new images across 20 products. Five original products retain their original photos. The generation prompts and source paths are recorded in product-photo-manifest.json; prepare-product-photos.mjs slices the generated color sheets without upscaling. Mobile header exposes wishlist beside the bag. Wishlist summary is no longer styled as a badge. Product names flow naturally, sale prices stack neatly on the right in carousels, and swatches sit beneath names. Only the primary photo renders in cards, with stationary frames and reduced-motion support.

## Product image separation refinement — 2026-09-17

Product image frames and PDP gallery frames now use `--product-surface`
(`#eef0f0`) with a subtle border. Product images use `mix-blend-mode: multiply`
inside those frames so their warm background separates from the white page while
the photographed clothing remains natural. Card hover keeps the primary artwork
and scales it uniformly; the close-up secondary layer stays hidden to prevent a
doubled image.

## Topbar and shop drawer refinement — 2026-09-17

`Navigation` now derives wishlist and cart quantities from `useShopping()` and
renders conditional `.wishlist-count` and `.bag-count` badges at the top-right
of their icons. The previous inline cart zero is removed. The homepage Shop
drawer is now an opaque minimal panel with a small heading, plain category rows
and compact utility grid; the earlier dark intro, numbered links and sale promo
were removed. Reduced-motion and focus restoration remain covered by the
interaction suite.

## Homepage polish pass — 2026-09-17

The category label is now “Pants” while the existing `pant` route and asset
folder remain stable. Carousel product metadata has increased legibility,
carousel arrows now communicate hover and disabled states, category panels show
keyboard focus feedback, and mobile navigation controls use 44px hit areas.

## Category image clarity refinement — 2026-09-17

The category WebP assets were re-sharpened and the storefront now allows and
requests Next image quality 95. This prevents the category panels from being
silently reduced to the default quality 75 delivery. The category image `sizes`
hint is height-aware because the panels are tall and use `object-fit: cover`.

## Category image refresh — 2026-09-17

The five homepage category panels now use a cohesive editorial portrait set
inspired by the client Dribbble reference. Each optimized local WebP is stored
under `apps/storefront/public/images/categories/<category>/category.webp` and is
resolved by the mock catalog category fixture.

## Product card add-to-cart removal — 2026-09-17

The earlier ProductCard add-to-cart control has been removed at the latest
client request. Product cards now keep the product name, color swatches and
price presentation without a card-level cart button; product detail and
existing shopping flows remain the cart entry points.

## Product card add-to-cart refinement — 2026-09-17

Product cards now include a compact Add to cart button below the price, aligned
in the price column. Color swatches remain beneath the product name. The
selected color resolves its matching variant when in stock, and the button uses
the existing CommerceProvider service so stock limits, persistence and the bag
drawer remain shared with PDP checkout flows.

## Full category strip refinement — 2026-09-17

The homepage hero strip now uses five equal-width category cards for Shirt,
Katua, T-Shirt, Pants and Sleepwear. The Styleco essentials Shop Now panel was
removed from that strip while the separate campaign banner remains available
below the product sections.

## Default color selection refinement — 2026-09-17

Product cards and PDPs now initialize from `colorsOf(product)[0]`, with the
display variant used only as a fallback when no color is defined. This keeps the
first ordered color selected consistently while preserving stock validation.

## Sale and section rhythm refinement — 2026-09-17

Homepage order now includes Sale above Best sellers. Sale derives its cards from
all discounted catalog products. The Highlights carousel is now labeled Latest
Products. Adjacent carousel, campaign, and delivery transitions use explicit
spacing so the added section does not create uneven gaps.

## Product card and delivery refinement — 2026-09-17

Shared product card image frames are slightly rounded with an 8px radius.
Homepage Best sellers and Highlights carousels now show five products initially
on desktop and tablet. The Best sellers Explore CTA was removed. Highlights has
extra bottom spacing before the centered single-line free standard delivery
message.

## Homepage carousel density refinement — 2026-09-17

Product image frames are shorter and the desktop Best sellers and Highlights
tracks show six products in the initial viewport. Tablet shows four and mobile
uses larger swipe cards. The Highlights split-card override was removed after
it caused the first two cards to render inconsistently; all Highlights cards now
use the standard product card treatment.

## Carousel and canvas refinement — 2026-09-17

The desktop content width is now 110rem with the existing responsive gutters,
reducing unused side space at wide breakpoints. Best sellers use the shared
horizontal carousel with all Top Sellers references. Highlights now uses all
Latest Products references through the same carousel, including arrow controls,
touch scrolling, keyboard scrolling and reduced-motion support. Product tracks
use a non-overlapping flex layout so swatch controls remain clickable while
cards scroll horizontally.

## Client-priority reference redesign — 2026-09-17

The authoritative visual reference is Orix Creative's E-commerce clothing website:
https://dribbble.com/shots/24660604-E-commerce-clothing-website-Design.
The client explicitly prioritizes matching this design over the prior Editorial Pop
direction. This supersedes the no-hero decision, category carousel homepage,
two-row homepage product carousels, colored editorial panels, rounded image frames,
and wide desktop category navigation. Earlier records below are historical where
they conflict with this increment.

Current composition: compact Shop/Search navigation with centered Styleco wordmark;
three narrow category photo panels and one wider campaign panel; Sale carousel;
Best sellers carousel; full-width photographic campaign; Latest Products carousel;
black delivery strip; seasonal one-large/two-small photo mosaic; Behind The Brand;
restrained neutral footer. All five categories remain in the
Shop drawer and footer. No gender split is introduced.

Use white/black surfaces, square imagery, compact typography and generous editorial
spacing. Mobile adapts the cropped desktop reference to stacked hero/mosaic panels
and horizontally scrollable products. Preserve functional wishlist, variant swatches,
search, cart and checkout, accessible controls, focus and reduced-motion behavior.
Keep Styleco branding, BDT and actual demo delivery terms. Retain original local
demo assets; the reference photography is not included. Exact photographic fidelity
and unseen portions of the cropped reference remain unresolved without supplied
assets/full designs. Do not claim pixel-identical completion or Design Freeze.

This remains the local frontend demo increment. No backend, Admin, deployment,
newsletter or external service integration is authorized.

## Current state

Phase 0 and Discovery–D4 are preserved. The user superseded the separate D5–D7
increment with a complete interactive frontend prototype. Editorial Pop remains
the design direction; the working demo is now the primary review artifact.
This is not Design Freeze or a production release.

Implemented: full homepage, five category listings, New Arrivals, Sale, search,
PDP/gallery/variants/size guide/reviews, wishlist, bag, coupon, checkout, confirmation,
account/login/register previews, seven supporting pages, loading/error/404 states.
All categories remain data-driven without gender navigation. Latest Products and
Top Sellers each use 12 explicit ordered references in two-row carousels.

Product cards now use generated, isolated product-only WebP imagery. Each mock
product keeps three color variants with primary and detail image pairs resolved
through `colorImages`; the local fixture shares each category/color pair across
that category to avoid duplicating demo media. Category/campaign imagery is
unchanged and remains allowed to include people.

The latest homepage refinement removes the rendered hero, renames the category
carousel to Categories, rounds category/product image frames by 10px, and makes
product-card color swatches update the selected variant and local color image. The
follow-up interaction refinement removes the per-card arrow overlay, loops category
order with a slightly larger featured first card, and tightens swatches with a
selected-scale and image-change micro-animation.
The latest copy refinement gives each category its own data-driven editorial label
and reduces the footer wordmark scale on desktop and mobile.

The current UI pass removes the newsletter, compacts the footer, shares readable
type/spacing tokens, and tightens card/PDP swatches. PDP images now follow color
selection. Related products use a single-row product carousel with readable mobile
cards. Buttons, galleries, selection, drawers and accordions have restrained CSS
feedback; reduced motion disables it. Cart/checkout stack below 1024px and mobile
PDP actions give the main purchase button its own row. All required checks pass.

The current carousel/card pass uses repeated virtual category copies around a middle
anchor. Next and previous use frame-synced track movement while the incoming card
grows and the outgoing card shrinks, then settle the active virtual copy without
reordering data or resetting the track. Snap is disabled only during those scripted
frames and the native scrollbar is hidden, preventing the previous flicker/jump while
normal touch and trackpad scrolling retain snap behavior. The outgoing featured card
never animates across to a trailing slot.
Product wishlist controls are 40px and the redundant numeric color-count text is
gone. Individual swatches remain named and pressed-state accessible. The final
verification for this pass is complete.

## Run and explore

From the root: `pnpm install --frozen-lockfile`, then `pnpm dev`.
Open `http://localhost:3000`. No environment file or backend is required.
Keep `CATALOG_PROVIDER=mock`; the Appwrite adapter is still a placeholder.

Try Shirt → Relaxed Oxford Shirt → Sky Blue / S → wishlist → bag. Stock is three
for that variant. Apply `STYLE10`, then checkout with example Bangladesh contact
and address details. COD simulates success. Demo Card `4242 4242 4242 4242`
succeeds; `4000 0000 0000 0002` declines. No real order/payment/email occurs.

## Architecture and editing map

- `src/app`: server routes, metadata and responsive styles.
- `src/components`: shared navigation, catalog, shopping and informational UI.
- `src/infrastructure/mock/data.ts`: 25 products, five categories, curation and
  structured hero/campaign/promotion content. Each product has three color
  variants mapped to local product-only catalog imagery.
- `src/services/catalog-query.ts`: reusable local filters and sorting.
- `src/services/mock-commerce.ts`: integer paisa totals, stock limits and coupon.
- `src/services/shopping-store.ts`: lightweight shared client state.
- `src/infrastructure/browser/shopping-storage.ts`: validated versioned bag and
  wishlist localStorage; latest order sessionStorage with memory fallback.
- `public/images/ASSET_CREDITS.md`: original generated local image provenance;
  `public/images/products/` contains the 15 category/color product assets and
  their product-only detail crops.
- `e2e/`: browser journeys, responsive routes and interaction checks.

Catalog/content still follow UI → services → repository contracts → mock adapters.
No SDK calls enter React components. No Admin, database, deployment, authentication,
production payment, tracking or external runtime image/font service was added.

## Validation

Dependency installation, formatting, zero-warning lint, typecheck, 13 Vitest tests
and production build pass. The three main Playwright tests pass: desktop and mobile
shopping journeys plus routes/breakpoints. Chrome checks cover Home, Category, PDP,
Bag and Checkout at 1440×1000 and 390×844; screenshots were visually reviewed.
Additional widths: 360, 430, 768, 1024 and 1920. No global horizontal overflow was
detected. Journeys assert no console/runtime errors, filters and sorting, gallery,
stock restrictions, persisted wishlist/bag/coupon, validation, card decline, card/COD
success, confirmation reload, search and mobile navigation.
An additional passing touch/keyboard test verifies real emulated touch scrolling,
carousel arrow keys, reduced motion, visible skip-link focus and drawer focus
restoration. Four browser tests pass in total.

The UI refinement expands the breakpoint sweep to all 24 routes. New assertions
cover newsletter removal, PDP gallery color changes, readable single-row mobile
recommendations, touch swatches and reduced-motion image/dialog behavior. The clean
browser journeys report no application console or runtime errors. In the user's
Chrome profile, an extension injects `cz-shortcut-listen` on the body and can cause
a development hydration warning; this does not occur in the clean test browser.

Run `pnpm test:e2e` with Google Chrome installed. Screenshots are in
`apps/storefront/test-results/`; failed runs retain Playwright traces. Cold Next.js
compilation on this Windows filesystem can take several seconds. App Router's
streamed not-found response may be HTTP 200, with branded 404 UI and `noindex`.

## Demo limitations / review priorities

- Local generated photographs include one hero, one category family per category,
  and 15 product-only category/color assets with detail crops. Five mock products
  share each category/color pair; replace these with distinct SKU assets from
  Appwrite Storage later.
- Pricing, stock, delivery, coupons, ratings/reviews and policies are illustrative.
  Client calculations are not authoritative commerce validation.
- Wishlist/bag are browser-local. The latest order lasts for the tab session;
  browser storage restrictions reduce persistence to memory.
- Login/register are visual-only. Contact explicitly does not send;
  social destinations and legal/policy copy need production review.
- Browser QA used desktop Chrome and mobile emulation, not physical device or
  exhaustive screen-reader/cross-browser certification.

## Exact next task

**Human visual review of the complete frontend demo and iterative UI/requirement
changes.** Review imagery, campaign copy, spacing, mobile purchase flow and content
priority, then refine the living requirements. Design Freeze and backend work remain
later phases. Do not advance automatically.

## Reference redesign verification — 2026-09-17

Verified lint, TypeScript, 13 unit tests, and production build. Browser coverage:
desktop/mobile full shopping journeys (1440/390), touch swatches, reduced-motion
and drawer focus; all routes and overflow checks at 360/430/768/1024/1920.
Desktop and mobile homepage screenshots reviewed. Updated obsolete category-carousel
and second-gallery-image expectations to match current UI and single-image-per-color
fixtures. Fixed tee asset lookup to use the existing t-shirt filenames.
Review artifacts: apps/storefront/test-results/home-1440.png and home-390.png.
Human comparison and matching final photography remain pending; no Design Freeze.
