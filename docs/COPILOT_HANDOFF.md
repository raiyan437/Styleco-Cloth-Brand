# Handoff — complete frontend demo

## Admin product and variant media workflow — complete, 2026-09-20

The product editor now makes the workflow explicit: save product information,
create a color variant, set its independent size stock, then use the revealed
variant workspace to upload one required product image and up to four ordered
images. Empty products show where variant image uploads will appear, and the
readiness checklist names the exact variant missing its required image.

## Complete Admin product merchandising controls — complete, 2026-09-20

Product detail now controls general copy, unique slug, category, New status,
release/scheduling, material, fit, care, keywords and SEO with a search-result
preview. Publishing readiness lists every missing requirement and blocks an
incomplete Published or Scheduled transition while draft storefront preview
remains available.

Every color variant now owns an editable name/hex swatch, product-card crop,
live card preview and ordered one-to-four-image PDP gallery. Gallery images
support crop, alt text, reordering and deletion. The variant matrix supports
size, SKU, regular/original sale price and independent per-color/per-size stock
edits, while variants support adding missing sizes and confirmed deletion.
Product duplication creates a draft; confirmed deletion removes product, media
and curated homepage references.

The storefront resolves selected-color card crops and galleries, displays sale
pricing/New state, consumes search keywords and PDP details, and receives local
SEO metadata updates. Scheduled browser products become public when due.

## Admin product gallery and variant creation — complete, 2026-09-20

New Product now opens a clean draft with an explicit Create variant step. Each
created color variant reveals its own product-card crop and one-to-four ordered
gallery upload slots. The variant builder combines a named native color picker
and visible editable hex code with size selection, independent per-size stock,
price and optional SKU prefix; it creates the existing size-level variant rows,
which remain editable and removable.

Published browser-managed products are consumed by the local storefront through
the catalog service/provider bridge. Their gallery, color hex swatch, price and
stock appear in listings and in the static product preview route without making
the public Storefront depend directly on Admin infrastructure.

## Admin category image workspace parity — complete, 2026-09-20

Category detail now uses the same always-visible `MediaCropper` as product
detail. Opening a category immediately shows its current image beneath the
movable category-ratio selection, with crop sizing, Replace image and Save
cropped image controls in the same workspace. The obsolete upload-only category
component and styles were removed; category crops continue to save at
1200 × 1470 in browser demo state.

## Admin overlay crop selection — complete, 2026-09-20

Selecting an image now opens the full source photo with a movable,
section-ratio crop rectangle over it. The excluded area is dimmed, crop size
can be tightened, and pointer plus keyboard movement are supported. Saving
renders a real WebP crop at the configured slot dimensions, persists it in the
browser snapshot and uses that exact image for the saved preview.

## Admin detail workspace refinement — complete, 2026-09-20

The category and product detail workspaces no longer allow their save bars to
cover form fields. Product detail now presents the copy/status editor first,
then places image placement and the sizes/stock matrix side-by-side on
desktop, with a single-column mobile fallback. Category detail keeps a
compact upload-only image surface and opens its configured cropper after file
selection. Exact-route browser verification passed for `/admin/categories/shirt`
and `/admin/products/shirt-1`.

## Admin image preview fidelity — complete, 2026-09-20

All image surfaces now use the configured storefront slot dimensions for their
empty frame, crop viewport and saved preview. Category uploads remain
upload-only until selection, then persist as an upload asset and stay visible
as a saved, cropped preview with a Replace image action. Product and homepage
croppers show the same saved-preview state. The Admin E2E suite verifies the
category save-to-preview flow.

## Admin visual system and interaction polish — complete, 2026-09-20

The Admin surface now uses a consistent control-room system across Overview,
Categories, Products, Orders, Settings, Activity Log, detail editors, login
and fallback states. Typography, control heights, spacing, borders, shadows,
status badges, breadcrumbs, focus states, cropper controls and responsive
breakpoints were aligned. The workspace-check delay was removed without
introducing hydration mismatches; order statuses and product category labels
also now read correctly. Format, lint, typecheck, unit, production build and
the full 16-test Playwright suite pass.

## Section-aware storefront imagery — complete, 2026-09-20

The Admin now has named image-slot definitions for the storefront photography:
category panels, product cards, Explore Current Sale, Find your next favorite,
The Katua Collection, Made for slow mornings and Behind The Brand. Homepage
image controls belong under Admin Settings, preserving the removed Homepage
sidebar item and standalone Media Library decision. Each slot carries a target
ratio and pixel-size guide, and the shared cropper saves a live crop preview in
browser demo state. The upload/crop flow is covered by the Admin E2E suite, and
the full format, lint, typecheck, unit, build and browser checks pass.

## Admin list/detail refinement — complete, 2026-09-20

The Admin control room now keeps only Overview, Categories, Products, Orders,
Settings and Activity Log in its navigation. The Homepage editor and standalone
Media Library are removed from the Admin route surface; category and product
image cropping remains colocated with those editors.

Products are sorted newest first and paginated at 15 per page. Each product
opens `/admin/products/[id]` for copy, status, image placement and sizes/stock.
Orders use the same newest-first, 15-per-page list and open
`/admin/orders/[id]` for fulfilment updates. Category deletion is confirmed,
removes its local demo state and records an activity entry.

## Admin frontend demo — complete, architecture accepted — 2026-09-20

Admin is now an approved increment in the same `apps/storefront` Next.js app.
The active URLs are `/admin/login`, `/admin`, `/admin/categories`,
`/admin/products`, `/admin/products/[id]`, `/admin/orders`,
`/admin/orders/[id]`, `/admin/settings` and `/admin/activity-log`. The public Storefront URLs remain
unchanged and the Storefront contains no visible Admin link.

The Admin tree owns its shell, navigation, providers, loading/error/not-found
states and noindex/no-follow metadata. The demo login is username `admin`,
password `admin`; browser persistence is mock-only and does not rewrite source
fixtures or claim production security. The future production path is server
session authentication and role authorization through Appwrite in the same app
on Appwrite Sites. A separate `apps/admin` app and Admin subdomain are
superseded.

The frontend demo is complete: isolated route layouts, centralized demo guard,
browser-persisted Admin services/repositories, dashboard/content management,
media cropper/preview, orders/settings/activity screens, and responsive/
accessibility validation are all in place. No Appwrite SDK or production
backend is introduced in this increment.

## Storefront UX polish pass — 2026-09-19

The storefront now has clearer product-card hierarchy, active navigation
states, persistent mobile filter access, a product-aware bag confirmation with
Undo, a more scannable checkout progress rail, consistent sage focus states,
actionable empty states, and smoother product-image loading.

## Primary surface palette refinement — 2026-09-19

The cursor is back to its original black-only treatment. Primary buttons and
dark utility surfaces now use deep forest sage, while delivery/trust panels
use a soft sage tint for contrast and palette consistency.

## Product card stock cue removal — 2026-09-19

Product cards no longer show “Only N left” low-stock messaging. Out-of-stock
labels, stock validation, and the product-detail availability copy remain
available, so this is a presentation-only change.

## Modal lifecycle motion — 2026-09-19

All dialogs now animate in and out through the shared Dialog lifecycle. Centered
surfaces use a soft scale/translate transition with a coordinated backdrop;
left/right drawers animate from their edge, and the bag drawer has a distinct
right-origin spring effect tied to the bag interaction. Exit motion completes
before the native dialog closes, so focus restoration remains reliable.
The bag's “View your bag” navigation path closes immediately so the cart route
is not blocked by the outgoing native dialog. Scroll locking preserves the
scrollbar gutter, preventing page-width shifts during modal transitions.

## Search modal visual alignment — 2026-09-19

The search modal now matches the current storefront language: warm near-pearl
glass, rounded geometry, a pill-shaped search field, sage focus states,
terracotta utility accents, compact product result cards, and a tighter mobile
layout. Search behavior, local recent-search handling, and the existing
Navigation boundary remain unchanged.

## Storefront continuity and confidence pass — 2026-09-19

The latest increment adds browser-history restoration for listing state,
zoomable PDP imagery, recent and popular search suggestions, availability
states without low-stock urgency, checkout progress, delivery estimates,
mobile quick navigation, image delivery
tuning, a global recoverable error surface, and a clear action for recently
viewed products. Cart and wishlist persistence remain backed by the existing
versioned browser shopping-storage contract. The implementation remains
storefront-only and preserves the UI → services → repository boundaries.

## Storefront discovery and feedback pass — 2026-09-19

The storefront now keeps listing search, filters, and sorting shareable in the
URL, shows product/image skeletons during loading, and provides clearer trust
messaging on product detail. Product detail and cart include related-product
rails; product detail also shows client-only recently viewed products after a
shopper visits more than one product. Search empty states include guided
suggestions, carousels expose keyboard guidance and position indicators, and
checkout/demo forms provide inline validation with accessible error feedback.
These changes preserve the storefront-only UI → services → repository
boundaries and require no new external dependency.

## Storefront usability polish pass — 2026-09-19

The latest polish pass adds scroll-aware header depth, quieter category pills,
stronger sale-price hierarchy, a subtle best-sellers surface, sticky mobile
listing controls, contextual empty states with filter reset, stronger subtle
text contrast, and a shared animated add-to-bag confirmation toast. These are
presentation and interaction improvements only; service/repository contracts
remain unchanged.

## Storefront visual refinement pass — 2026-09-19

The final color pass separates the pearl canvas from card and mobile image
surfaces, adds a translucent sticky header and backed category labels, and
gives filters, swatches, secondary buttons, and form fields clearer states.
Blue-teal is now focus-only, while terracotta is limited to sale communication
and the shipping-strip accent. The changes remain token-driven and preserve
the existing storefront-only contracts.

## Storefront color system refinement — 2026-09-19

The storefront now uses a warmer pearl canvas with clearer card separation,
terracotta sale accents, sage new/category accents, warmer image and dialog
surfaces, refined borders and shadows, and a dedicated blue-teal focus ring.
The palette is token-driven across the catalog, PDP, cart, checkout, and
editorial surfaces.

## Storefront motion pass — 2026-09-19

The storefront now has a cohesive motion layer: page-entry reveals, staggered
category/product cards, editorial image depth, tactile controls, modal entry,
and footer/link feedback. Reduced-motion users receive the same layout and
interaction affordances without decorative transforms or animations.

## Quick add modal chrome — 2026-09-19

Quick Add now has no visible product-title header or close icon. It keeps an
accessible hidden title and closes when the shopper clicks outside the modal.

## Quick add polish — 2026-09-19

Quick Add now renders through a document-level portal, so opening it preserves
the listing scroll position. The modal is compact and shows the selected image,
product summary, color, and size choices.

## Homepage intro removal — 2026-09-19

The homepage now starts directly with the category collage below the sticky
header. The visible intro and Shop new arrivals CTA were removed per the latest
client request; the screen-reader-only page heading remains.

## Storefront UX refinement — 2026-09-19

Product-card Quick add now opens a modal requiring an available color and size.
Successful additions stay in context with inline confirmation; the header Bag
control or the modal's View your bag action opens the bag drawer explicitly.
Navigation stays available while scrolling, mobile cards reduce secondary
review detail, and listing pages expose removable active filter chips. Count
labels and search category labels are customer-facing. Browser coverage
includes the new quick-add path and the updated non-blocking bag behavior.

## Pearl-white canvas and visible product cards — 2026-09-19

The storefront canvas is now a warmer pearl white (`#F7F4EE`). Product cards
use an opaque near-pearl surface (`#FFFDF8`) so they read as distinct cards
without becoming grey panels or picking up the page color. The carousel
override uses the same fill, and the white decorative highlight is softened to
preserve the separation. A subtle dark edge reinforces the card boundary.
Existing shadows, content hierarchy,
responsive behavior and commerce interactions are unchanged.

## Clear glass cards and black cursor — 2026-09-19

The client-provided floating-product reference now informs the shared card material.
Grey tinting has been removed from both the glass shell and card image pane. Cards
use one clear neutral 28% white surface, 30px backdrop blur, brighter edge
reflections and restrained depth. Product images remain sharp without contributing
their own color to the card shell; the PDP gallery is unchanged.
The desktop cursor dot, ring and expanded interactive state are now black.

## Glassmorphic product cards — 2026-09-19

The shared ProductCard now renders as a single 22px-radius iOS-inspired glass
surface. Its image and complete metadata block sit within that shell, backed by
layered translucent gradients, 18px backdrop blur, inner highlights and a soft
shadow. Wishlist and stock overlays use matching glass treatment. The change is
CSS-only and applies consistently to homepage rows, listings, wishlist and product
recommendations without altering commerce behavior.

## Reference cursor and featured-product treatment — 2026-09-19

Desktop fine-pointer users now see an 8px warm accent cursor dot with a 40px
trailing ring; the ring expands over links and controls. Touch input keeps the
native behavior, and reduced motion removes the lag. Shared cards now expose their
category and existing rating/review data in a compact hierarchy with pill badges.
Homepage merchandising rows sit in a centered 1216px frame with four visible cards
at desktop widths and three at tablet widths, while mobile keeps horizontal swipe.
Wishlist, variant swatches and PDP-only cart entry are unchanged.

## GitHub Pages demo deployment — 2026-09-18

The repository now includes a GitHub Actions Pages workflow. A push to `main`
builds the storefront as a static export with the `/Styleco-Cloth-Brand/` base
path and deploys `apps/storefront/out` to:
<https://raiyan437.github.io/Styleco-Cloth-Brand/>.
Local development remains unchanged; no backend or external service is needed.

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

This remains the local frontend demo increment. No backend, Appwrite,
production authentication, deployment migration, newsletter or external
service integration is authorized. The Admin frontend-demo scope above is the
current approved exception.

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

The same app now also contains the isolated Admin studio at `/admin`. Admin has
frontend-demo login (`admin` / `admin`), overview, category, product list/detail,
variant/cropper, order list/detail, settings and activity-log screens. The
Homepage editor and standalone Media Library are no longer part of the Admin
route surface. Product and order lists are newest-first and paginated at 15
records. Admin state is browser-persisted and fixture-safe; it does not rewrite
the Storefront source fixtures. Public routes remain unchanged, and the
Storefront shell is not mounted under Admin.

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
Admin follows Admin UI → Admin services → browser repositories in this demo. No
SDK calls enter React components. No production database, deployment migration,
production authentication, payment, tracking or external runtime image/font
service was added.

## Validation

Dependency installation, formatting, zero-warning lint, typecheck, 13 Vitest tests
and production build pass. Twelve Playwright tests pass, including the three
Admin boundary/editor/cropper checks plus desktop and mobile
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

**Human visual review of the Storefront and Admin surfaces.** Review Admin
information hierarchy, image crop ratios, editing copy, mobile navigation and
the storefront/Admin boundary. Production Appwrite Auth, repositories and
server-side authorization remain later phases; do not advance automatically.

## Reference redesign verification — 2026-09-17

Verified lint, TypeScript, 13 unit tests, and production build. Browser coverage:
desktop/mobile full shopping journeys (1440/390), touch swatches, reduced-motion
and drawer focus; all routes and overflow checks at 360/430/768/1024/1920.
Desktop and mobile homepage screenshots reviewed. Updated obsolete category-carousel
and second-gallery-image expectations to match current UI and single-image-per-color
fixtures. Fixed tee asset lookup to use the existing t-shirt filenames.
Review artifacts: apps/storefront/test-results/home-1440.png and home-390.png.
Human comparison and matching final photography remain pending; no Design Freeze.

## Storefront-wide minimal surface pass — 2026-09-19

`apps/storefront/src/app/reference.css` now carries a final shared surface layer
for the rest of the storefront. Product detail uses a quiet gallery plus a clear
glass buying panel; cart rows, shipping notice and order summary are individual
rounded glass surfaces; wishlist empty state, search, drawer, checkout, account
and confirmation surfaces reuse the same neutral material and compact pill
controls. No route content or commerce behavior changed.

Native dialogs render above the page-level custom cursor, so each dialog now hosts
the same cursor layer inside its top-layer surface. The cursor remains visible and
expands over drawer controls just as it does on the page.

The Shop drawer is explicitly left-anchored; the Bag drawer remains right-anchored.
Both are fixed floating windows with a viewport gap and rounded corners on all
four sides. Their content can scroll, while the window itself remains fixed and
not draggable. The Bag drawer hides its scrollbar chrome while retaining content
scrolling. Both use the shared outside-click close behavior.

The local server remains `http://localhost:3000`. Recheck desktop and mobile
routes after the final lint, typecheck, unit test and build pass. Patch
`apps/storefront/next-env.d.ts` back to `.next/types/**/*.ts` if Next writes the
development type path during local verification.

## Storefront audit and dropdown polish — 2026-09-19

The current increment resolves variant-specific images through the catalog query
service so cart, checkout and order confirmation reflect the selected color. The
search dialog now exposes keyboard-complete combobox/listbox state. Checkout and
confirmation hide the mobile quick-navigation dock, and the mobile checkout
stepper exposes a swipe hint. Account tabs expose pressed state.

Native select controls and FAQ/product disclosures now use the pearl/sage visual
language, focus/hover micro-interactions, disclosure animation and reduced-motion
fallback. Quick Add dialogs are mounted only while active. Generic social
homepage links are replaced with coming-soon labels, and route metadata now
distinguishes public collection pages from private/demo flows.

Verification complete: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`,
and `pnpm test:e2e --workers=1` pass. The final E2E suite reports 9 passing
tests across desktop/mobile journeys, interaction/accessibility coverage and
all requested routes/breakpoints.

## Carousel canvas refinement — 2026-09-19

The carousel section and horizontal product track are explicitly transparent. The
carousel card glass tint is reduced to 18%, with a 30% neutral inner image pane,
removing the grey row effect while retaining clear glass cards and sharp product
content. Carousel cards use inset highlights rather than a diffuse outer shadow, so
the gaps remain white and every card shares the same material color. Desktop and
mobile shopping journeys pass after the change; the local server is running at
`http://localhost:3000`.

## Reference card controls — 2026-09-19

The ProductCard now restores the previous taller image panel. Color swatches sit on
the right side of the rating row, and a compact Add to cart button is aligned with
the price beneath it. It adds one unit of the selected in-stock variant through the
existing CommerceProvider and opens the existing bag drawer; all other card content
and the neutral glass material are unchanged. The image now fills the pane without a
white inset border, and the cart button is capped at a compact width.

## Collection dropdown and filter toolbar refinement — 2026-09-20

The Shop trigger no longer receives a persistent active state after navigating
from the Shop drawer. Collection Color, Price range and Sort by controls now use
the shared StyledSelect component with a branded animated listbox, chevron,
outside-click close behavior and keyboard selection. Active filter chips stay
beside the result count in one compact row; the chip rail scrolls horizontally
when space is limited.

Verification complete: pnpm lint, pnpm typecheck, pnpm test, pnpm build, and
pnpm test:e2e --workers=1 pass. The local development server is running at
http://localhost:3000.

## Product detail control finish — 2026-09-20

The PDP quantity minus/plus buttons now use circular hit areas with a soft sage
hover/focus surface, removing the rectangular hover artifact and vertical shift.
The selected
gallery thumbnail now uses the sage accent ring and pearl surface instead of a
black border.

Verification complete: lint, typecheck, 13 unit tests, production build and all
9 Playwright tests pass. The local development server remains available at
http://localhost:3000.

## Storefront visual QA remediation — 2026-09-20

The mobile quick-navigation dock now remains on the homepage browsing surface
but is hidden on card-heavy collection/search routes and dense product, cart,
wishlist, account, auth, information and confirmation/form routes. This keeps
fixed navigation from covering product-card CTAs, form actions or footer copy.
Mobile product-card purchase actions stack into a readable full-width 44px Quick
add control. Wishlist controls, swatches, filters, sorting and search actions
now meet the 44px touch target baseline. Small dock and checkout guidance text
uses the shared type scale, dropdown menus use an opaque raised surface, and
footer status labels use AA-safe foreground contrast.

Shared product rating, swatch, carousel and styled-select semantics were cleaned
up for axe-compatible ARIA. Image quality values are now all accepted by the
Next image configuration, removing development console warnings.

Verification complete: lint, typecheck, 13 unit tests, production build, four
route-level axe checks with zero violations, browser checks at 360/390/1440px,
and all 9 Playwright tests pass.

## Form focus treatment refinement — 2026-09-20

All shared form controls now use a restrained focus state. Mouse focus uses a
neutral border with a subtle two-pixel ring; keyboard focus uses a two-pixel blue
outline and ring. This applies to field-label controls, checkout/contact fields,
coupon and collection search fields, native selects, styled comboboxes, and
checkbox/radio controls. The old thick green focus halo has been removed.

## Customer-facing copy polish — 2026-09-20

The storefront copy now presents Styleco as a finished clothing retailer. Demo,
preview, prototype, simulated-payment, placeholder-social and illustrative
language was removed from rendered product, account, information, checkout,
confirmation, policy and footer copy. Internal mock commerce and fixture names
were intentionally preserved because they are not customer-facing. This
supersedes the earlier coming-soon social-label treatment.
