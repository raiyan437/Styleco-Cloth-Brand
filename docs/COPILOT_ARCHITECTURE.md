# Architecture and decisions

## ADR-022 — homepage campaign sale destination — 2026-09-18

The homepage campaign banner owns the presentation copy “Explore Current Sale”
and points its existing Explore Now link to the `/sale` route. This is a
composition-only change; product data, services, repositories and routing
contracts remain unchanged.

## ADR-021 — responsive category grid density — 2026-09-18

The shared category/listing product grid uses four equal columns at desktop
widths, three at tablet widths and two on mobile. This is a presentation-only
change; listing queries, product-card contracts and filters remain unchanged.

## ADR-020 — viewport-aware PDP gallery — 2026-09-18

The product-detail gallery uses a desktop height cap based on the viewport
remaining below the header and breadcrumbs. Its image uses `contain` so the
complete local product photo remains visible when the capped frame is wider
than the source ratio. Mobile keeps its existing responsive aspect ratio.

## ADR-019 — homepage carousel labels — 2026-09-18

Homepage merchandising headings are presentation copy owned by the homepage
composition: Current Sale, Best Sellers and Latest Products. Supporting eyebrow
copy clarifies each collection without changing the existing sale filter or
curated section identifiers and service contracts.

## ADR-018 — sale metadata isolation and directional color slides — 2026-09-17

Carousel prices are positioned independently of the name and swatch flow, so a
second sale-price line cannot push the swatches away from the name. Product
cards still render one image element; its loaded color image receives a
directional horizontal keyframe based on the ordered color list. This keeps the
card frame stationary and avoids the old layered hover-image distortion.

## ADR-017 — compact swatches and loaded-image feedback — 2026-09-17

Carousel card metadata no longer reserves a second name line when it is not
needed, so color controls stay close to the product name. Product cards keep a
single image element and add a short opacity animation only after the selected
color image has loaded. This preserves the existing colorImages contract,
avoids layered image distortion, and respects the global reduced-motion rule.

## ADR-016 — product-specific media and stable card interactions — 2026-09-17

Supersedes ADR-013's category/color image reuse and the earlier two-layer hover treatment. The first product in each category retains its existing unique photo set; the other 20 products use 60 generated color photos in products/<product-slug>/<color>.webp. New products have one honest gallery photo per color rather than an unrelated shared detail photo. Existing Product.colorImages and service boundaries remain unchanged. Card hover uses one rendered image; the hidden secondary image request is removed. Wishlist summary uses its own class, avoiding header badge styles.

## ADR-015 — neutral product image surface (2026-09-17)

Product image frames use a local neutral surface token and a fine border while
the global page background remains white. The existing product photography is
blended into the frame with CSS rather than regenerated or duplicated, keeping
the change consistent across cards and galleries without changing image storage
or repository contracts.

## ADR-014 — shared topbar counts and editorial shop drawer (2026-09-17)

Navigation remains a client component over the existing `useShopping()` store;
it derives wishlist and cart quantities once per render and conditionally
renders top-right badges. This keeps persistence and cross-component updates in
the shopping service instead of duplicating state in the header. The cart's
zero state is intentionally icon-only.

The Shop control continues to use the shared accessible `Dialog` drawer, with
its content restyled as a minimal opaque panel. The earlier dark intro,
numbered visual indices and sale promo are superseded by plain category rows
and a compact utility grid. No new repository, API, or external dependency is
introduced.

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

## ADR-006 — frontend prototype expansion

The user now authorizes the complete interactive frontend before Design Freeze.
This supersedes ADR-002's empty catalog/deferred card behavior and ADR-004's deferred
route implementation. Earlier decisions remain a history of their original phases.
Keep existing domain/repository/service boundaries and extend catalog metadata,
stock quantities and listing queries. A small client store delegates persistence to
a browser adapter, and pure mock commerce functions calculate stock-limited cart,
coupon and totals. Server routes retrieve catalog/content through services and pass
serializable data to targeted interactive components. No additional workspace
packages, CMS framework, state library, or production service is necessary.

Public category routes are `/category/[slug]`; product routes `/products/[slug]`.
Structured mock homepage content is returned by HomepageRepository. Local generated
fashion images are demo assets; color/fit details are illustrative, not real SKU
photography. Login/register remain explicitly visual-only. Order details use session
storage, cart/wishlist use versioned localStorage, and payment inputs are discarded.
React Hook Form with Zod handles checkout validation; Playwright supplies local
browser verification. Neither adds a production service dependency.

## ADR-007 — homepage refinement and color-aware cards (2026-09-15)

The current homepage omits the hero so category discovery becomes the first editorial
module. The former `best-of-week` section is now the data-driven `categories` section;
Latest Products and Top Sellers retain their explicit curated references. Product
cards are client-interactive only for swatch selection: the selected color resolves a
matching variant and optional `colorImages` set, while product links and wishlist
remain separate controls. Local demo product imagery is generated product-only
media; future SKU assets can populate the same optional field without changing UI
contracts.

## ADR-008 — featured looping category carousel and compact swatches (2026-09-15)

The transition implementation in this historical decision is superseded by ADR-012;
the featured-first category behavior and compact swatch decisions remain useful.
The Categories carousel keeps the existing native horizontal track for mouse,
trackpad, touch, and keyboard scrolling. Its heading controls use a small client
state index to rotate the data order, making the selected category the first,
slightly wider card and wrapping from the last category back to the first. The
per-card arrow overlay is intentionally omitted; the linked card and section
controls provide the interaction surface. Product swatches retain 44px effective
targets with tighter visual spacing, scale the selected dot instead of drawing a
selection border, and use a short image-change animation that honors reduced motion.

## ADR-009 — data-driven category labels and restrained footer mark (2026-09-16)

Category cards read an optional `editorialLabel` from the Category contract rather
than sharing generic copy. The mock adapter supplies short labels for the five
current categories, and the storefront has a plain fallback for future categories.
The footer keeps its existing semantic wordmark but uses a smaller responsive type
scale to preserve hierarchy around newsletter and navigation content.

## ADR-010 — shared UI refinement (2026-09-16)

Supersedes ADR-009's newsletter layout and ADR-008's blanket 44px swatch claim.
The newsletter is removed; footer statement and navigation share a responsive grid
with a small wordmark. Shared type, section-spacing and motion variables remain
in `globals.css`; component rules remain in `storefront.css`.

Compact card swatches have distinct 24×32px targets, enlarged to 28×44px on coarse
pointers, with no overlap. The dot grows on selection; keyboard focus remains
separate. PDP colors reuse the existing optional Product `colorImages` contract.
Gallery index resets in the color event handler; image data is derived during render.

Carousel content kind is separate from row count: category tracks use the featured
flex layout, product tracks use a responsive grid in either one or two rows. This
fixes mobile recommendations inheriting category sizing. CSS handles brief opacity
and transform feedback, with no motion library, delayed navigation or hidden content.
Reduced motion removes transitions/animations; dialog focus handling stays native.

## ADR-011 — category transition and quieter product controls (2026-09-16)

Category reordering still uses the same keyed data rotation. Before changing the
active index, the carousel records each category card's bounding rectangle; a client
FLIP animation then interpolates translation and scale into the new layout. This
keeps one DOM item per category, preserves links/native scrolling, and avoids a
carousel animation dependency. The browser's `matchMedia` reduced-motion check
skips the imperative animation when requested.

Product-card wishlist buttons use a 40px visual control to reduce image obstruction;
the PDP wishlist control remains the larger purchase utility. Color-count copy is
removed from cards; individual swatch buttons keep their labels and pressed state.

## ADR-012 — virtual-copy category navigation loop (2026-09-16)

Supersedes the transition and data-reorder portions of ADR-011 and the previous
implementation note. Categories render three repeated virtual copies
around a middle anchor. Arrow navigation advances the active virtual index while
keeping the existing DOM order, so no data reorder or `scrollLeft = 0` reset is
needed after each click. If an edge copy is reached, an equivalent middle copy is
re-centered while its content remains in the same viewport position.

The transition uses a requestAnimationFrame scroll interpolation and parallel
flex-basis/scale/opacity animations: the incoming card grows as it moves into the
first slot while the outgoing card shrinks in place. Scroll snapping is temporarily
disabled during those scripted frames (otherwise the browser quantizes intermediate
positions), then restored for normal mouse, trackpad, touch and keyboard scrolling.
The native scrollbar is hidden to prevent the thumb from flashing during movement.
Reduced-motion users settle the target copy immediately. Product carousels keep
their finite native-scroll behavior.

## ADR-013 — generated product-only color fixtures (2026-09-17)

Product-card imagery now resolves through the existing `Product.colorImages` field
to local generated WebP assets under `apps/storefront/public/images/products`.
These assets depict isolated garments on a light catalog background; category and
campaign photography remain separate and may include people. Each mock product
continues to expose three color variants, while the fixture shares one asset per
category/color combination to keep the repository lightweight. The repository and
service contracts are unchanged, so an Appwrite Storage adapter can provide
SKU-specific image sets later without component changes.

## ADR-001 — practical workspace (2026-09-15)

pnpm workspace with a single Next.js application under `apps/storefront`.
Keep domain/services local until another consumer exists; no empty shared packages,
Admin scaffolding, or build orchestrator. Workspace globs leave room for later reuse.
The inspected directory was empty, including hidden files, and not a Git repository.

## ADR-002 — data boundaries

Server UI → CatalogService/HomepageService → repository interfaces → mock adapters.
`services/container.ts` is the server-only composition point. Appwrite implementation
will replace adapters there, without changing UI contracts. SDK types stay outside
the domain. Installed `node-appwrite` is the server SDK; no active client yet.

Homepage sections carry enabled state and display position. Product references have
explicit positions; service restores their order independently of query order,
filters disabled sections, skips missing product references. Latest/Top Sellers
names carry no selection algorithm. Categories are adapter data, not a UI enum.

Product variants own price, optional original price, color/size, and stock state.
Money uses integer minor units plus currency. Image order defines primary/hover.
New is explicit; Sale can be derived from an eligible original price. Card behavior,
default variant selection, and wishlist are deferred. Mock products are intentionally
empty until content is approved; no invented prices or images.

## ADR-003 — local first

Default provider is mock with no environment setup. Zod validates provider selection;
selecting unfinished Appwrite fails explicitly. Appwrite config keys live in the
app-local `.env.example`; Next reads `.env.local` from that application directory.
Future Cloud/self-hosted connection changes stay in adapter configuration. No
credentials in client components or public environment variables.

## ADR-004 — framework and future routes

Next App Router and Server Components, Tailwind CSS, strict TypeScript, ESLint flat
config, Prettier, Vitest. Node 24 LTS/pnpm 11 pinned for reproducibility. System fonts
avoid network requirements during builds. Install shadcn/forms/browser tests when
there is a concrete use. Separate ESLint command follows [Next installation guidance](https://nextjs.org/docs/app/getting-started/installation).

Stable category/product slugs support future public routes. Final URL patterns and
canonical origin are deferred; do not invent category pages or deployment URLs.
App Router metadata is initialized; campaign/UTM/feed/tracking work remains future.
No change to the user's design direction; shell typography is provisional.

## ADR-005 — initial storefront design tokens (2026-09-15)

Direction A — Editorial Pop is the working direction through D4. Semantic CSS custom
properties are defined in `globals.css` and exposed through Tailwind v4 `@theme`;
small layout/type utilities cover the next increment. This keeps tokens close to the
only consumer and avoids a package or component library before reuse exists.

Archivo Variable (display) and DM Sans Variable (body/UI) are OFL fonts installed as
local npm assets. This replaces the provisional system-only stack without a font CDN
or build-time download. The shell lightly consumes the tokens as wiring proof; its
content and layout remain provisional. D4 is not Design Freeze.
