# Implementation plan

## Admin product and variant media workflow — complete (2026-09-20)

- [x] Make the Create variant action explicit in the new-product workspace.
- [x] Reveal a dedicated image workspace after each color variant is created.
- [x] Enforce one required and four maximum ordered images per variant, with
      precise readiness feedback for missing media.

## Admin per-size inventory — complete (2026-09-20)

- [x] Replace the color builder's shared starting stock with an independent
      stock input for every selected size.
- [x] Keep each quantity on its generated color/size `ProductVariant` record
      and preserve per-row editing in the variant matrix.
- [x] Verify storefront stock resolution remains keyed to the selected
      `variantId` and cover different size quantities in Admin E2E.

## Complete Admin product merchandising controls — complete (2026-09-20)

- [x] Add name, unique slug, category, detailed PDP copy, keywords, New state,
      release timing and SEO controls with an inline search preview.
- [x] Give every color an editable name/hex, dedicated product-card crop, live
      card preview and independently ordered one-to-four-image gallery.
- [x] Add image alt text, reorder, replacement and confirmed deletion controls.
- [x] Add size creation plus editable size, SKU, regular/original price, stock
      and variant deletion controls.
- [x] Add publishing-readiness validation, draft preview and Scheduled status.
- [x] Add product duplication and confirmed deletion with local data cleanup.
- [x] Update storefront image resolution, sale/New/search/PDP/SEO behavior and
      published/scheduled Admin catalog synchronization.
- [x] Cover product creation/publishing plus duplicate/delete lifecycle in E2E
      and run full project verification.

## Admin product gallery and variant creation — complete (2026-09-20)

- [x] Create blank Admin product drafts instead of cloning fixture products.
- [x] Add sequential, ordered product-gallery crop slots with one-image
      minimum, four-image maximum validation and visible variant media workspaces.
- [x] Add named color creation with a synchronized native picker and visible hex
      field, size selection, price, stock and SKU generation.
- [x] Keep generated size variants editable and removable in the matrix.
- [x] Bridge published browser Admin state into storefront listings, commerce,
      product cards and a static preview detail route.
- [x] Cover the full create → four uploads → variant → publish → storefront flow
      in Playwright and run project verification.

## Admin category image workspace parity — complete (2026-09-20)

- [x] Replace the category upload-only wrapper with the shared product-style
      `MediaCropper` workspace.
- [x] Show the current category image and crop selection immediately on detail
      routes, while retaining replacement and rendered-save behavior.
- [x] Remove the unused upload-only component and CSS.
- [x] Update Admin E2E coverage and rerun project verification.

## Admin overlay crop selection — complete (2026-09-20)

- [x] Replace image-under-frame dragging with a complete source-image view and
      movable fixed-ratio crop rectangle.
- [x] Dim excluded pixels, add pointer and keyboard movement, and retain a
      ratio-safe crop-size control.
- [x] Render saved crops through canvas into WebP images at every slot's target
      pixel dimensions.
- [x] Persist and preview the rendered result, and cover crop movement plus
      output dimensions in Admin E2E.

## Admin detail workspace refinement — complete (2026-09-20)

- [x] Keep category and product save actions in panel flow so they do not
      overlap editable fields.
- [x] Recompose product detail into a full-width copy/status editor followed
      by a desktop cropper/inventory split with a mobile one-column fallback.
- [x] Keep category imagery upload-only until selection, then use the target
      slot's cropper for the replacement image.
- [x] Verify both requested detail routes in the running browser and rerun
      format, lint, typecheck, unit, build and Playwright checks.

## Admin image preview fidelity — complete (2026-09-20)

- [x] Drive upload placeholders, crop viewports and saved previews from each
      storefront image slot's target ratio and pixel dimensions.
- [x] Keep fixture category media upload-only, then persist replacement media
      as an upload asset after the crop is saved.
- [x] Keep saved category previews visible with the saved crop and provide a
      Replace image action that reopens the slot-aware cropper.
- [x] Show saved-preview state in product and homepage cropper surfaces and
      cover category upload-to-preview behavior in Admin E2E.

## Admin visual system and interaction polish — complete (2026-09-20)

- [x] Align Admin typography, page headers, navigation, buttons, inputs,
      panels, cards, status badges, filters, pagination and save bars.
- [x] Polish Overview, Categories, Products, Orders, Settings, Activity Log,
      detail editors, login and fallback/loading surfaces with shared rules.
- [x] Improve responsive behavior, keyboard-visible focus, reduced-motion
      handling and cropper/upload control alignment.
- [x] Remove the artificial route-entry delay while preserving hydration-safe
      browser persistence.
- [x] Correct dashboard order-status presentation and product category labels.
- [x] Verify format, lint, typecheck, unit tests, production build and the full
      16-test Playwright suite.

## Section-aware storefront imagery — complete (2026-09-20)

- [x] Add named media slots for each current storefront photo placement.
- [x] Expose homepage image slots inside Admin Settings without restoring a
      Homepage sidebar item or standalone Media Library.
- [x] Show each slot's frontend crop ratio and target pixel-size guidance.
- [x] Persist upload data and crop metadata in the browser demo snapshot and
      keep fixture files unchanged.
- [x] Verify upload/crop previews, responsive layout, accessibility, format,
      lint, typecheck, tests, build and Admin E2E.

## Admin list/detail refinement — complete (2026-09-20)

- [x] Remove the Homepage Admin route/navigation and standalone Media Library
      surface while keeping crop editing inside category/product workspaces.
- [x] Add confirmed category deletion with browser activity logging.
- [x] Split Products into a newest-first, 15-item paginated list and focused
      `/admin/products/[id]` editor for copy, image crop and variant stock.
- [x] Split Orders into a newest-first, 15-item paginated list and focused
      `/admin/orders/[id]` fulfilment editor.
- [x] Update the architecture, living requirements, handoff and Admin E2E
      coverage for the new navigation and detail-first flow.

## Styleco Admin frontend demo — complete (2026-09-20)

The previous Storefront-only/no-Admin scope is superseded for this increment.
The implementation remains one Next.js app under `apps/storefront`; no
`apps/admin` app and no `admin.styleco.com` deployment are planned.

- [x] Record the one-app `/admin` route-tree decision in the architecture,
      living requirements and handoff.
- [x] Move public routes into a route group without changing public URLs and
      keep the root document layout separate from the Storefront shell.
- [x] Add `/admin/login` and a centralized frontend-demo auth guard using the
      exact temporary credentials `admin` / `admin`.
- [x] Add the isolated Admin shell, responsive navigation, metadata, loading,
      error and not-found states; keep Storefront providers out of Admin.
- [x] Add browser-persisted mock Admin repositories/services for the initial
      homepage, categories, products/variants, media slots, settings, orders
      and activity demo data.
- [x] Add the dashboard, initial category/product management, variant matrix,
      cropper, orders, settings and activity-log screens. The initial
      Homepage editor and standalone Media Library are superseded by the
      list/detail refinement above.
- [x] Add reusable slot-aware image cropper previews for category, product and
      campaign/media artwork.
- [x] Support draft/published/archived labels, mock preview, resettable demo
      state, responsive layouts, keyboard access and noindex/no-follow Admin
      metadata. Do not rewrite source fixture files.
- [x] Verify public routes remain unchanged and Admin has no visible Storefront
      link; run formatting, lint, typecheck, unit tests, build and Playwright.

The completed implementation remains compatible with the GitHub Pages static
showcase. Production Admin security and persistence are deferred to the same
app deployed on server-capable Appwrite Sites with Appwrite Auth, TablesDB,
Storage and Functions.

## Storefront UX polish pass — complete (2026-09-19)

- [x] Improve product-card hierarchy and image loading transitions.
- [x] Add active navigation states and preserve mobile filter reachability.
- [x] Add product-aware bag confirmation with an Undo action.
- [x] Polish checkout progress, focus states, and empty-state actions.

## Primary surface palette refinement — complete (2026-09-19)

- [x] Restore the cursor to its original black-only styling.
- [x] Replace near-black primary surfaces with deep forest sage.
- [x] Give delivery and trust panels a soft sage-tinted surface.

## Product card stock cue removal — complete (2026-09-19)

- [x] Remove low-stock count messaging from every product card.
- [x] Keep out-of-stock presentation and inventory enforcement unchanged.

## Modal lifecycle motion — complete (2026-09-19)

- [x] Animate centered modal entry and exit with a coordinated backdrop.
- [x] Animate left and right drawer entry and exit from their originating edge.
- [x] Give the bag drawer a distinct right-origin spring motion.
- [x] Keep native dialog focus restoration and reduced-motion behavior intact.
- [x] Add tactile bag-trigger feedback and verify modal lifecycle behavior.
- [x] Close the bag immediately when navigating to the full cart route.
- [x] Preserve the scrollbar gutter while dialogs lock page scrolling.

## Search modal visual alignment — complete (2026-09-19)

- [x] Apply the current near-pearl glass shell and rounded modal geometry.
- [x] Restyle the search field as a focused pill control.
- [x] Convert search results to compact inset product cards.
- [x] Align suggestions, close control, icon accents, hover, and mobile states
      with the current storefront system.
- [x] Preserve existing search behavior and accessibility semantics.

## Storefront continuity and confidence pass — complete (2026-09-19)

- [x] Restore URL-synced filters and sorting on browser Back/Forward.
- [x] Confirm existing browser persistence for cart and wishlist state.
- [x] Add zoomable product imagery with accessible gallery navigation.
- [x] Add recent-search storage, popular search suggestions, and combobox
      semantics.
- [x] Add checkout section progress and clearer delivery estimates.
- [x] Show availability states without changing inventory contracts. The
      low-stock count presentation was later removed by ADR-043.
- [x] Add a mobile quick-navigation bar for the core shopping destinations.
- [x] Tune image quality, priority, and thumbnail sizing for the demo catalog.
- [x] Add a recoverable global error fallback.
- [x] Add a clear control to recently viewed products.
- [x] Verify the storefront through lint, typecheck, unit tests, build, and
      browser checks.

## Storefront discovery and feedback pass — complete (2026-09-19)

- [x] Persist listing search, filters, and sorting in the URL.
- [x] Add route/product-image loading skeletons.
- [x] Add delivery, returns, and secure-checkout trust messaging to product
      detail.
- [x] Add related products to product detail and cart.
- [x] Add guided search empty states with category and popular-term links.
- [x] Add carousel keyboard guidance and visible position indicators.
- [x] Add inline validation and clearer error summaries to checkout and demo
      forms.
- [x] Add client-only recently viewed products.
- [x] Verify the storefront through lint, typecheck, unit tests, build, and
      browser checks.

## Storefront usability polish pass — complete (2026-09-19)

- [x] Add scroll-aware depth to the sticky header.
- [x] Quiet category pills and add a subtle best-sellers surface rhythm.
- [x] Strengthen sale-price hierarchy and muted-text readability.
- [x] Add a sticky mobile filter/sort toolbar.
- [x] Improve empty-result copy and add contextual filter reset feedback.
- [x] Add a shared animated add-to-bag confirmation toast.
- [x] Verify the storefront through lint, typecheck, tests, build, and browser
      checks.

## Storefront visual refinement pass — complete (2026-09-19)

- [x] Improve category-label contrast with a dark translucent backing.
- [x] Add a translucent blurred sticky header.
- [x] Strengthen active filter, selected swatch, input-focus, and mobile-image
      surface states.
- [x] Warm secondary buttons and add the shipping-strip terracotta accent.
- [x] Keep blue-teal focus-only and limit terracotta to sale communication plus
      the shipping accent.
- [x] Update storefront documentation and verify the complete app checks.

## Storefront color system refinement — complete (2026-09-19)

- [x] Increase pearl canvas/card separation and add warm surface layers.
- [x] Replace legacy neon orange/lime/neutral overrides with terracotta and
      sage semantic states.
- [x] Warm borders, image surfaces, shadows, dialogs, footer, and form states.
- [x] Keep destructive, success, and focus colors distinct and accessible.

## Storefront motion pass — complete (2026-09-19)

- [x] Add cohesive page-entry and staggered card/panel reveals.
- [x] Add tactile hover/focus feedback for navigation, cards, images, controls,
      dialogs, and footer links.
- [x] Add reduced-motion fallbacks that remove decorative motion.
- [x] Verify motion changes through lint, typecheck, tests, and browser checks.

## Quick add modal chrome — complete (2026-09-19)

- [x] Remove the visible Quick Add product-title header and close icon.
- [x] Preserve an accessible dialog title and outside-click dismissal.

## Quick add polish — complete (2026-09-19)

- [x] Render Quick Add at document level to preserve the listing scroll position.
- [x] Add product imagery and a compact product summary to the modal.
- [x] Reduce modal spacing and dimensions for desktop and mobile.

## Homepage intro removal — complete (2026-09-19)

- [x] Remove the visible homepage intro and CTA above the category collage.
- [x] Restore a semantic screen-reader-only homepage heading.

## Storefront UX refinement — complete (2026-09-19)

- [x] Add a Quick add modal with explicit color and size selection.
- [x] Keep add-to-bag feedback inline and make bag opening explicit.
- [x] Keep the category collage as the first visible homepage section.
- [x] Keep navigation sticky during long pages.
- [x] Reduce mobile card density and expose active filter chips.
- [x] Fix item-count grammar and humanize search-result category labels.
- [x] Cover the quick-add and browse-preserving bag behavior in browser tests.

## Pearl-white canvas and visible product cards — complete (2026-09-19)

- [x] Set the storefront canvas to the warmer pearl-white `#F7F4EE` token.
- [x] Use the opaque near-pearl `#FFFDF8` for product-card fills.
- [x] Reduce the white card highlight so the surface contrast remains visible.

## Reference product card layout — complete (2026-09-19)

- [x] Use a wide rounded image panel inside the glass card with contain-fit product
      imagery and the existing badges.
- [x] Move the existing wishlist control into the metadata row beside the existing
      category content.
- [x] Keep the existing name, rating, swatches, price, stock, navigation and
      responsive behavior while matching the reference hierarchy and spacing.
- [x] Keep one neutral glass material shared by every ProductCard.
- [x] Restore the taller product image panel, align swatches to the rating row,
      and add the existing CommerceProvider-backed Add to cart action beside price.
- [x] Fill the image pane without a visible white inset and shorten the Add to cart
      control while preserving its price alignment.

## Clear glass cards and black cursor — complete (2026-09-19)

- [x] Remove grey tint from card shells and product image panes.
- [x] Increase glass blur and edge reflections without blurring child content.
- [x] Restore normal product-image blending while preserving the PDP gallery.
- [x] Change the cursor dot, ring and expanded state to black.

## Glassmorphic product cards — complete (2026-09-19)

- [x] Wrap image and all metadata visually in one rounded glass card shell.
- [x] Add translucent layers, backdrop blur, inner highlights and soft depth.
- [x] Restyle image, wishlist and stock overlays to belong to the same material.
- [x] Preserve card interactions and add browser assertions for the glass shell.

## Reference cursor and featured-product treatment — complete (2026-09-19)

- [x] Add the reference-inspired dot and trailing ring cursor for fine pointers.
- [x] Expand the ring over interactive elements and preserve native touch input.
- [x] Add category/rating hierarchy and pill badges to shared product cards.
- [x] Give homepage product rows a 1216px, four-card desktop frame and responsive
      three-card/tablet and horizontal/mobile behavior.
- [x] Preserve wishlist, swatches, stock, product navigation and reduced motion.

## GitHub Pages demo deployment — complete (2026-09-18)

- [x] Configure an Actions-only Next.js static export for the repository path.
- [x] Generate all category, product and info dynamic routes at build time.
- [x] Keep search query filtering interactive on the exported `/search/` page.
- [x] Add the Pages artifact/deployment workflow and document the demo URL.
- [x] Verify the GitHub checkout installs from the frozen lockfile and builds.

## Campaign banner sale CTA — complete (2026-09-18)

- [x] Rename the homepage campaign banner heading to Explore Current Sale.
- [x] Replace the banner artwork with a high-resolution local sale editorial
      asset that preserves the neutral Styleco palette.
- [x] Route its existing Explore Now CTA to `/sale`.
- [x] Add a browser assertion for the heading and destination.

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

This remains the local frontend demo increment. No backend, Appwrite,
production authentication, deployment migration, newsletter or external
service integration is authorized. The Admin frontend-demo exception is tracked
in the dated section at the top of this plan.

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

This separate increment was superseded; its Storefront-only Admin exclusion is
historical. No Appwrite backend work is authorized by that historical record.

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

## Storefront-wide minimal surface pass — 2026-09-19

- [x] Apply the shared clear glass and soft-neutral material to product detail,
      cart, wishlist empty states, dialogs and the Shop drawer.
- [x] Reuse rounded controls, compact spacing, neutral borders and readable
      contrast across checkout, account, confirmation and listing controls.
- [x] Make the Shop and Bag drawers fixed floating windows with equal viewport
      gaps, four rounded corners and scrollable inner content without drag behavior.
- [x] Hide the Bag drawer's scrollbar chrome while preserving native content
      scrolling.
- [x] Preserve route markup, commerce behavior, service boundaries and current
      content while refining the visual system.
- [x] Run formatting, lint, typecheck, unit tests, production build and the full
      seven-test responsive browser suite.

Verification: `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`,
`pnpm build`, and `pnpm test:e2e --workers=1` pass. Live desktop verification
shows 16px gaps and 28px corners for both drawer directions; the mobile rules use
12px gaps and 24px corners.

## Storefront audit and dropdown polish — complete (2026-09-19)

- [x] Keep selected variant color imagery consistent in cart, checkout and order
      confirmation.
- [x] Add keyboard-complete search suggestion semantics and active option state.
- [x] Keep mobile navigation from obscuring checkout and confirmation content;
      add a mobile checkout-step scroll affordance.
- [x] Add accessible account tab state and enrich public/private route metadata.
- [x] Mount Quick Add only while active to avoid hidden modal overhead.
- [x] Replace generic social placeholder links with coming-soon labels.
- [x] Restyle native selects and FAQ/product disclosures with pearl/sage states,
      hover/focus feedback, opening motion, and reduced-motion fallbacks.
- [x] Run the final lint, typecheck, unit, build and E2E verification for this
      increment.

The complete homepage curated product rails remain unchanged because the living
requirements explicitly require the complete sale, top-seller and latest orders.
Verification: lint, typecheck, 13 unit tests, production build and all 9 Playwright
tests pass. The final browser suite covers desktop/mobile shopping journeys,
touch/reduced-motion interaction, keyboard search selection, route health and
requested responsive breakpoints.

## Collection dropdown and filter toolbar refinement — complete (2026-09-20)

- [x] Remove the route-derived Shop active state from the desktop and mobile
      navigation triggers.
- [x] Replace collection native selects with animated, keyboard-accessible styled
      dropdowns with visible chevrons and reduced-motion fallbacks.
- [x] Keep active filter chips beside the result count without expanding the
      mobile or desktop toolbar into an additional row.
- [x] Run lint, typecheck, unit tests, production build and the full E2E suite.

Verification: lint, typecheck, 13 unit tests, production build and all 9 Playwright
tests pass. Live browser checks cover the animated Sort by menu, compact mobile
filter state and neutral Shop trigger.

## Product detail control finish — complete (2026-09-20)

- [x] Remove the rectangular hover treatment and vertical hover shift from
      quantity minus/plus buttons.
- [x] Replace the black selected gallery thumbnail border with the sage/pearl
      treatment used by the rest of the storefront.
- [x] Run lint, typecheck, unit tests, production build and browser verification.

Verification: lint, typecheck, 13 unit tests, production build and the full
9-test Playwright suite pass.

## Storefront visual QA remediation — complete (2026-09-20)

- [x] Remove mobile dock overlap from collection/search cards and dense content,
      form, cart, account and information routes while preserving homepage quick
      navigation.
- [x] Make mobile Quick add, wishlist, swatch, filter, sort and search controls
      readable and touch-safe; preserve compact desktop card layout.
- [x] Improve small-text contrast and type scale, and use opaque dropdown menus.
- [x] Correct shared rating, carousel and styled-select ARIA semantics.
- [x] Align Next image quality configuration with every existing image quality
      value and update the touch-target E2E expectation.
- [x] Run lint, typecheck, unit tests, production build, axe checks and all
      Playwright journeys/responsive route checks.

Verification: lint, typecheck, 13 unit tests, production build, zero axe
violations on category/PDP/contact/checkout, and all 9 Playwright tests pass.

## Form focus treatment refinement — complete (2026-09-20)

- [x] Replace thick green focus halos on shared input, textarea, select and
      combobox controls with slim neutral/keyboard-visible focus states.
- [x] Cover search, coupon, collection-search, checkbox and radio controls.
- [x] Verify contact, search and collection controls in the local browser.

## Customer-facing copy polish — complete (2026-09-20)

- [x] Remove demo, preview, prototype, simulated-payment and placeholder social
      language from rendered storefront copy.
- [x] Rewrite product, account, information, policy, checkout and order
      confirmation copy for a finished clothing retail experience.
- [x] Update metadata, validation messages and affected browser assertions.
- [x] Run the final lint, typecheck, unit, build and browser verification for
      this increment.

Verification: lint, typecheck, 13 unit tests, production build, all 9 Playwright
tests, and live local route checks pass. Prettier still reports existing
workspace-wide formatting warnings in files outside this copy increment.
This increment supersedes the earlier plan item that used coming-soon social
labels.
