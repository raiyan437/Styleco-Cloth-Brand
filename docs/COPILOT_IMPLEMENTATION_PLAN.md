# Implementation plan

## Category listing density — complete (2026-09-18)

- [x] Show four products per row in desktop category listings.
- [x] Preserve three-column tablet and two-column mobile breakpoints.
- [x] Add a responsive browser assertion for desktop grid density.

## Product detail gallery scale — complete (2026-09-18)

- [x] Cap the desktop gallery to the available viewport height.
- [x] Show the complete product photo with contained fitting.
- [x] Add a desktop PDP viewport regression assertion and preserve mobile sizing.

## Homepage carousel labels — complete (2026-09-18)

- [x] Rename the three homepage merchandising headings to Current Sale, Best
      Sellers and Latest Products.
- [x] Add concise supporting eyebrow copy above each heading.
- [x] Update the homepage browser assertions without changing data contracts.

## Sale-card spacing and directional color transition — complete (2026-09-17)

- [x] Keep discounted carousel prices from pushing color swatches away from the
      product name.
- [x] Slide newly loaded color images horizontally according to the selected
      swatch direction while keeping the card frame stationary.
- [x] Preserve reduced-motion behavior and verify the full responsive journey.

## Catalog and mobile polish — 2026-09-17

- [x] Generate distinct photography for the 20 previously duplicated products, three colors each.
- [x] Add mobile wishlist access and separate wishlist summary styling.
- [x] Align metadata and keep card frames stationary during image zoom.
- [x] Preserve minimal styling and run desktop/mobile shopping and responsive checks.

## Product image separation refinement — complete (2026-09-17)

- [x] Add a neutral product surface and subtle border to card and gallery image
      frames without changing the website canvas.
- [x] Blend the existing local product photography into the surface so warm
      image backgrounds remain visually distinct from the white page.

## Topbar and shop drawer refinement — complete (2026-09-17)

- [x] Derive live wishlist and cart counts from the shared browser shopping
      store and render conditional top-right badges.
- [x] Redesign the homepage Shop drawer as a minimal opaque panel with plain
      category rows and a compact utility grid while preserving focus and reduced motion.
- [x] Add interaction coverage for zero-state badges, live count updates and the
      redesigned drawer semantics.

## Client-priority reference redesign — 2026-09-17

The authoritative visual reference is Orix Creative's E-commerce clothing website:
https://dribbble.com/shots/24660604-E-commerce-clothing-website-Design.
The client explicitly prioritizes matching this design over the prior Editorial Pop
direction. This supersedes the no-hero decision, category carousel homepage,
two-row homepage product carousels, colored editorial panels, rounded image frames,
and wide desktop category navigation. Earlier records below are historical where
they conflict with this increment.

Current composition: compact Shop/Search navigation with centered Styleco wordmark;
three narrow category photo panels and one wider campaign panel; three curated
best sellers under Comfort every day; full-width photographic campaign; Highlights
from the first three Latest Products references; black delivery strip; seasonal
one-large/two-small photo mosaic; Behind The Brand; restrained neutral footer.
Highlights uses a split leading card on desktop. All five categories remain in the
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

## Phase 0 — Foundation (complete, 2026-09-15)

- [x] Inspect repository and report conflicts (empty directory, no existing Git).
- [x] Create pnpm workspace and Next.js/TypeScript/Tailwind storefront.
- [x] Configure lint, formatting, strict types, local environment example.
- [x] Establish domain types, repository/service boundary, mock adapters.
- [x] Reserve Appwrite infrastructure without requiring backend.
- [x] Create minimal shell and living AIDOS documentation.
- [x] Verify lint, typecheck, unit tests, formatting, production build and local runtime.
- [x] Phase 0 complete.

Verification: `pnpm lint`, `pnpm typecheck`, `pnpm test` (2 tests),
`pnpm format:check`, and `pnpm build` passed. `pnpm dev` served the home route
successfully. Browser smoke check: meaningful content, five categories, no page
errors, desktop/mobile screenshots reviewed, no horizontal overflow at 375px,
keyboard skip link reached `#main-content`. Full homepage QA remains future scope.

## Compressed AIDOS — Discovery through D4 (complete, 2026-09-15)

- [x] Discovery: inspect reference, current shell, data boundaries, navigation fit,
      responsive needs, and local/production asset strategy.
- [x] D1: create concise design brief.
- [x] D2: define navigation, fixed hierarchy, user journeys, interactions, states,
      and breakpoint-specific composition.
- [x] D3: compare Editorial Pop, Editorial Premium, and Modern Street; select
      Direction A — Editorial Pop.
- [x] D4: define initial colors, type, spacing/layout, radius, shadows, imagery,
      buttons, carousels, cards, and accessibility baseline.
- [x] Wire semantic color, font, layout, typography, focus, and reduced-motion tokens.
- [x] Verify formatting, lint, typecheck, unit tests, production build, and mobile/
      desktop shell rendering.
- [x] Discovery–D4 complete.

Verification: `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`
(2 tests), and `pnpm build` passed. Browser checks at 390×844 and 1440×1000
confirmed token fonts/colors, visible skip-link focus, no horizontal overflow, no
framework error overlay, and no console errors. Core text contrast ratios are 5.40:1
or higher on the background. This validates token wiring, not the future homepage.

## Previous recommendation (superseded by frontend demo request)

- [ ] AIDOS D5–D7 + Homepage Increment 1: Header, Hero and Best of the Week
      category carousel.

This separate increment was superseded; no Admin or backend work is authorized.

## Frontend Demo / Interactive Prototype — complete

Supersedes the previous next-task recommendation at the user's request.

- [x] Local catalog, original imagery, structured campaign content.
- [x] Homepage, responsive navigation, category/product carousels and footer.
- [x] Listings, filters/sort/search, PDP/gallery/stock variants and size guide.
- [x] Wishlist/cart persistence, coupon, checkout and demo confirmation.
- [x] Account surfaces, help/story/legal pages, loading/error/404 states.
- [x] Unit checks, formatting/lint/typecheck/build and real browser journey QA.
- [x] Complete; next: human visual review and iterative UI/requirement changes.

Verification: 13 unit tests, three main Playwright browser tests, lint, typecheck,
formatting and production build pass. Desktop/mobile visual review covers the five
main page types. Responsive sweep includes every requested width. Demo Card success
and decline, COD success, reload persistence, coupon and stock limits are verified.
The fourth browser test passes native touch swipe, keyboard carousel navigation,
reduced-motion behavior and drawer focus restoration.

## Homepage refinement — complete (2026-09-15)

- [x] Remove the rendered hero from the homepage while retaining structured future
      campaign content.
- [x] Rename the homepage category carousel from Best of the Week to Categories.
- [x] Add restrained rounded corners to category and product image frames.
- [x] Make product-card color swatches keyboard/touch clickable with color-keyed
      image derivatives and matching variant price/availability.
- [x] Recheck the homepage against the linked editorial reference and rerun browser
      journeys, responsive widths, formatting, lint, typecheck and unit tests.

## Homepage interaction refinement — complete (2026-09-15)

- [x] Remove the per-card arrow overlay from Categories while retaining accessible
      section controls.
- [x] Rotate category order on previous/next so the active category is first and
      slightly larger, with wraparound and native swipe/trackpad scrolling retained.
- [x] Tighten color swatch spacing, scale the selected color without a border, and
      animate color-image changes with reduced-motion support.
- [x] Update interaction tests and rerun formatting, lint, typecheck, unit tests,
      production build, and responsive browser journeys.

## Copy and footer refinement — complete (2026-09-16)

- [x] Add optional data-driven editorial labels for category cards with a safe
      storefront fallback.
- [x] Reduce the responsive footer wordmark scale while preserving the footer layout.
- [x] Run the local app and verify formatting, lint, typecheck, unit tests, build,
      and responsive browser journeys.

## Storefront UI refinement — complete (2026-09-16)

- [x] Remove newsletter and compact the shared footer.
- [x] Normalize type/spacing, readable mobile inputs and responsive commerce layouts.
- [x] Tighten color controls and synchronize PDP color/gallery selection.
- [x] Add reduced-motion-aware feedback and fix the mobile recommendation carousel.
- [x] Complete formatting, lint, typecheck, unit tests, production build and browser QA.
- [x] Complete this increment; remain in human visual review.

Verification: formatting, zero-warning lint, typecheck, 13 unit tests, production
build and all four Playwright tests pass. The responsive sweep checks 24 routes at
360/430/768/1024/1920px; shopping journeys capture Home, Category, PDP, Bag and
Checkout at 390px and 1440px. Reviewed screenshots and live mobile/desktop layouts.
New assertions cover newsletter removal, PDP color images, mobile recommendation
card size/row layout, touch selection and reduced-motion dialog/image behavior.

## Carousel and card refinement — complete (2026-09-16)

- [x] Animate category cards from their old positions and sizes into the new
      featured position when next/previous is selected.
- [x] Reduce product wishlist control prominence and remove redundant color-count copy.
- [x] Run final formatting, lint, typecheck, unit tests, production build and browser QA.

Verification: formatting, zero-warning lint, typecheck, 13 unit tests, production
build and all four Playwright tests pass. The category reorder assertion confirms
active card animations; the reduced-motion test confirms those animations are
disabled when requested. Card tests confirm the color-count label is removed and
wishlist controls remain usable.

## Category navigation refinement — complete (2026-09-16)

- [x] Auto-scroll the Categories track on previous/next controls.
- [x] Rotate the loop only after movement settles so the outgoing featured card
      never animates into the last slot.
- [x] Grow the incoming category toward featured size during the scroll.
- [x] Keep navigation seamless with repeated virtual copies, frame-synced movement,
      keyboard/touch support and reduced-motion behavior; hide the flashing native
      scrollbar while retaining snap scrolling outside arrow transitions.
- [x] Run formatting, lint, typecheck, unit tests, production build and browser QA.

Verification: targeted desktop/mobile shopping journeys and the touch/keyboard
interaction test pass with native category scrolling and no application errors.

## Product imagery refinement — complete (2026-09-17)

- [x] Generate and commit local product-only catalog imagery for the current
      category/color combinations.
- [x] Keep three color variants on every mock product and map each swatch to its
      matching image set through `Product.colorImages`.
- [x] Document the fixture sharing strategy and future Appwrite Storage handoff.
- [x] Run formatting, lint, typecheck, unit tests, production build and browser QA.

## Reference redesign verification — 2026-09-17

Verified lint, TypeScript, 13 unit tests, and production build. Browser coverage:
desktop/mobile full shopping journeys (1440/390), touch swatches, reduced-motion
and drawer focus; all routes and overflow checks at 360/430/768/1024/1920.
Desktop and mobile homepage screenshots reviewed. Updated obsolete category-carousel
and second-gallery-image expectations to match current UI and single-image-per-color
fixtures. Fixed tee asset lookup to use the existing t-shirt filenames.
Review artifacts: apps/storefront/test-results/home-1440.png and home-390.png.
Human comparison and matching final photography remain pending; no Design Freeze.
