# Architecture and decisions

## ADR-058 — explicit product variant media workflow — 2026-09-20

Admin product creation is intentionally staged: product copy is saved first,
then a color variant is created with its color identity, selected sizes,
per-size stock, price and SKU data. Creating the variant reveals its dedicated
media workspace. `Product.colorImages[colorName]` holds one-to-four ordered
product-detail images for that color, while the card crop remains a separate
derived storefront slot sourced from the variant's media. Publication readiness
validates the minimum image count per color and the existing storefront bridge
continues to consume the selected color's media.

## ADR-057 — per-size inventory quantities — 2026-09-20

Product inventory is represented at the existing `ProductVariant` level, where
each color/size combination owns its own `stock` quantity and derived
`inStock` flag. The Admin color builder now collects a separate quantity for
each selected size before creating those records; the variant matrix remains
the editing surface afterward. Storefront PDP availability, cart limits and
checkout totals continue to resolve stock by `variantId`, so one size or color
cannot consume or disable another. The browser snapshot remains the demo
adapter and future persistence stays behind the existing service/repository
boundary.

## ADR-056 — variant-first product merchandising — 2026-09-20

Product media is now variant-first: each color key owns a `colorCardImages`
card crop and ordered `colorImages` gallery, while `cardImage` and `images`
remain synchronized fallbacks for existing storefront consumers. Product-card
resolution prefers the selected color's card crop; PDP galleries continue to
resolve from the selected color. This makes the Admin color workspace map
directly to existing storefront swatches and gallery behavior.

The product contract also carries SEO title/description alongside its existing
slug, keywords, release date, New flag, detailed copy and variant pricing.
Scheduled is an Admin content state: the browser catalog service exposes a
scheduled product only after its saved release timestamp. Draft previews read
the complete Admin catalog, while normal storefront consumers receive only
published or due scheduled products.

The Admin performs publish-readiness validation before status transitions,
including unique slug, required PDP copy, one-to-four gallery images per color
variant and valid variant records; a dedicated card crop is optional because
the first variant image is a storefront fallback. Duplicate and delete remain
browser-demo service mutations with activity history; production persistence
still belongs behind the planned Appwrite repositories.

## ADR-055 — browser catalog bridge for Admin-created products — 2026-09-20

Product creation now produces an empty Admin-managed draft with no inherited
variants. The Admin first creates an explicit color variant with name, hex,
price, per-size stock, SKU prefix and selected sizes; that action reveals the
variant's media workspace. Each color variant then owns one-to-four rendered
1200 × 1600 gallery images, plus its optional card crop, before publication.
The color variant expands into the existing `ProductVariant` contract so
storefront swatch, price and inventory behavior needs no parallel model.

The local demo exposes published Admin catalog state to the storefront through
a client provider and browser-catalog service, preserving UI → service → browser
repository direction. Existing static products keep their canonical routes;
browser-created products use the static `/products/preview?id=…` route so the
GitHub Pages export does not depend on unknown dynamic paths. Production will
replace this local bridge with the planned Appwrite catalog repository.

## ADR-054 — category and product cropper parity — 2026-09-20

Category detail now mounts the shared `MediaCropper` directly, matching product
detail instead of wrapping it in a separate upload-only state. The category's
current fixture or saved image is the cropper source, so the full image,
slot-ratio selection overlay, replacement control and save action are available
as soon as the detail route opens. Saved output still uses the category slot's
1200 × 1470 dimensions and the existing Admin service/repository persistence
boundary.

This supersedes ADR-051 and ADR-052 only where they require category fixture
media to remain upload-only. Their layout, saved-preview and slot-size decisions
otherwise remain active.

## ADR-053 — full-image overlay cropping with rendered output — 2026-09-20

The shared Admin cropper displays the complete selected source image and
positions a normalized, fixed-aspect crop rectangle over it. The rectangle is
movable by pointer or keyboard, while a crop-size control changes its area
without changing the storefront slot ratio. The excluded source area is
visually dimmed so the resulting composition is explicit before saving.

Save renders the selected source coordinates through a browser canvas into a
WebP data URL at the media slot's configured target width and height. The
rendered asset—not a CSS transform of the original—is persisted in the Admin
browser snapshot and used for saved previews. `AdminCrop.x` and `.y` now store
normalized source coordinates and `.zoom` stores the crop-area scale for
diagnostic metadata; the rendered output remains authoritative.

## ADR-051 — non-overlapping Admin detail workspaces — 2026-09-20

Detail-editor save bars remain in normal document flow rather than using the
shared sticky list-page treatment. This keeps the action row from obscuring
category status controls or product descriptions. Product detail uses a
full-width copy/status panel followed by a desktop two-column workspace for
the slot-aware cropper and variant inventory; the same regions become a
single column at mobile widths. Category imagery keeps its upload-only empty
state and opens the configured cropper only after file selection.

This is a presentation-only refinement. Admin services, browser persistence,
crop metadata and public Storefront routes remain unchanged.

## ADR-052 — slot-sized saved image previews — 2026-09-20

The shared Admin media controls derive the empty upload frame, crop viewport
and saved preview from `ADMIN_MEDIA_SLOTS`. Each surface therefore preserves
the storefront slot's aspect ratio and displays its target pixel dimensions.
Category detail keeps fixture media upload-only; after a replacement crop is
saved, the browser snapshot marks that asset as an upload and the detail page
renders the saved preview with its crop metadata. Homepage and product
croppers expose the same saved-preview state and replacement flow.

This keeps image placement behavior consistent without changing the Admin
service/repository boundary or making browser demo uploads part of Storefront
fixture data.

## ADR-050 — shared Admin visual system and hydration-safe workspace shell — 2026-09-20

The Admin route tree uses a single shared visual system in `admin.css` for
navigation, page headers, panels, controls, list rows, detail editors, cropper
surfaces, login and responsive states. The shell formats route breadcrumbs
centrally, while domain-specific status treatments remain distinct between
content and orders. Browser session/snapshot reads stay hydration-safe and no
long artificial timeout is used for route entry; browser-only reconciliation
is scheduled on the next animation frame before rendering persisted state.

This is a presentation and client-shell refinement only. It preserves the
existing Admin UI → services → browser repository boundary and does not change
public Storefront routes or production authentication decisions.

## ADR-049 — section-aware storefront image slots — 2026-09-20

Admin image management is organized around the storefront placement that will
render the image, not around a generic Media Library. Category and product
images remain in their detail editors. Homepage photography is exposed inside
Admin Settings because the Homepage navigation item was intentionally removed.

The current homepage slots are Explore Current Sale, Find your next favorite,
The Katua Collection, Made for slow mornings and Behind The Brand. Each slot
has a named Admin media slot with its own frontend aspect ratio and target
pixel-size guidance. The shared cropper uses that slot configuration for its
viewport, zoom/drag controls and saved crop preview. Browser demo persistence
stores the selected data URL and crop metadata in the Admin snapshot; it does
not rewrite public fixture files or make the server-rendered Storefront read
local Admin state. Production replacement uses Appwrite Storage behind the
existing Admin service/repository boundary.

This supersedes the earlier generic `campaign`-only description for homepage
editorial imagery while keeping the no-Homepage-navigation and no-Media-
Library decisions active.

## ADR-048 — Admin is list-first with focused catalog and order detail routes — 2026-09-20

The Admin navigation is intentionally focused on the operations needed for the
current demo: Overview, Categories, Products, Orders, Settings and Activity
Log. The Homepage editor and standalone Media Library are removed from the
Admin surface; storefront homepage data and reusable cropper code remain part
of the shared application where other Admin editors need them.

Products and orders use a list-first flow. Product browsing is sorted newest
first and renders 15 records per page; selecting a product opens
`/admin/products/[id]`, where product copy, status, image crop and variant
stock are edited together. Orders follow the same pattern with newest-first
listing, 15-record pagination and `/admin/orders/[id]` detail screens for
fulfilment updates. Category deletion is available from the category editor,
with a confirmation guard and an activity-log entry in the browser demo.

This supersedes the initial Admin scaffold's Homepage and Media Library
navigation and its inline Product/Order split-pane editors. The public
Storefront routes and its homepage remain unchanged.

## ADR-047 — GitHub Pages showcase now, Appwrite Sites production later — 2026-09-20

The current Styleco deployment remains a static GitHub Pages storefront
showcase. The Admin frontend demo is part of the same Next.js application and
is intentionally compatible with the local/static mock phase, but that static
artifact is not a production security boundary. The future production target
is the same application deployed to server-capable Appwrite Sites, with
Appwrite Auth, TablesDB, Storage and Functions introduced through the existing
service/repository boundaries. This supersedes any wording that treated a
separate Admin deployment or a frontend-only password as the production plan.

## ADR-046 — Storefront and Admin share one app with an isolated `/admin` tree — 2026-09-20

Styleco uses one Next.js app under `apps/storefront`. Public routes keep their
existing URLs inside the `(storefront)` route group. Admin routes live under
`/admin` in the same app, with an independent Admin layout, navigation,
providers, loading/error/not-found states and no visible link from the
storefront. The Admin route tree must not load the storefront header, footer,
CommerceProvider or custom cursor unnecessarily.

The active Admin URL set is `/admin/login`, `/admin`, `/admin/categories`,
`/admin/products`, `/admin/products/[id]`, `/admin/orders`,
`/admin/orders/[id]`, `/admin/settings` and `/admin/activity-log`. A route group such as
`admin/(protected)` may be used for implementation without changing these
public URLs. A separate `apps/admin` application and an `admin.styleco.com`
subdomain are explicitly superseded and must not be introduced.

The current Admin login is a frontend-only demo adapter with username `admin`
and password `admin`. Its session and content edits use browser persistence;
they do not rewrite source fixtures and do not claim production security.
Production authentication will use server-managed Appwrite Auth sessions and a
centralized authorization/role guard. Both surfaces preserve the boundary
`UI → service → repository → infrastructure`; Admin writes will go through
Admin services and repositories rather than directly from components.

Admin media editing uses reusable cropper slots whose aspect ratio matches the
frontend placement: category artwork, product card/gallery artwork and
campaign/editorial artwork each show a live preview before saving. Draft,
published and archived states, mock preview, responsive/accessibility behavior,
activity history and noindex/no-follow metadata are Admin requirements.

Historical ADRs and handoffs that say “no Admin” or describe a future
`apps/admin`/subdomain remain records of their earlier scope. This ADR is the
active decision for the current increment.

## ADR-045 — storefront UX polish stays presentation-first — 2026-09-19

The UX polish pass keeps navigation state derived from the App Router pathname,
keeps filter state in the existing URL-synced listing boundary, and keeps bag
feedback inside the existing CommerceProvider. Undo restores the pre-add
variant quantity through the current shopping service contract. No new data
source, repository, or infrastructure dependency is introduced.

## ADR-044 — replace black primary surfaces with forest sage — 2026-09-19

The custom cursor keeps its original black dot and ring. The shared primary
action tokens now use deep forest sage, with soft sage delivery/trust panels,
so dark controls no longer swallow the cursor. This is a presentation-only
token change; component behavior and service contracts remain unchanged.

## ADR-043 — remove low-stock urgency from product cards — 2026-09-19

The product-card presentation no longer renders low-stock counts such as
“Only 3 left”. This supersedes the earlier low-stock cue in the storefront
continuity pass. Inventory data, stock validation, and product-detail
availability messaging remain unchanged, so the UI → services → repository
contracts are not modified.

## ADR-042 — shared dialog lifecycle animation — 2026-09-19

The shared Dialog component owns a short internal rendered/closing lifecycle.
When the public `open` prop becomes false, the native dialog remains open for
the exit duration, then closes and restores focus. This keeps all modal
surfaces consistent without duplicating animation logic in Search, Quick Add,
filters, the PDP gallery, checkout drawer, or size guide. Directional CSS is
selected by drawer side, with the bag drawer receiving its own class. No
service, repository, or infrastructure contract changes. The bag's navigation
link opts into immediate native-dialog closure because the destination route
must be interactive without waiting for the drawer exit duration. Scroll
locking also preserves the current scrollbar width in body padding so modal
transitions do not shift the underlying page.

## ADR-041 — search modal follows the storefront surface system — 2026-09-19

The search modal keeps the existing Navigation client boundary and search
behavior. Its visual alignment is implemented through a dedicated
`search-dialog` class in the shared reference stylesheet: near-pearl glass,
rounded search input, compact result cards, and responsive overrides. No new
search service, repository, or infrastructure contract is introduced.

## ADR-040 — storefront continuity and recovery affordances — 2026-09-19

Browser Back/Forward restoration is handled in the existing client listing
boundary with a `popstate` listener; URL writes continue to use
`history.replaceState` and do not create a service call. The existing
`shopping-storage` browser contract already persists cart and wishlist state,
so no duplicate persistence layer is introduced. Gallery zoom, search history,
mobile quick navigation, stock messaging, checkout progress, and error
fallbacks are presentation concerns. Product imagery continues to use
`next/image` and remains supplied by the catalog service. No Appwrite SDK calls,
repository changes, or external services are introduced.

## ADR-039 — discoverable listing state and storefront feedback — 2026-09-19

Listing filters and sorting synchronize through the browser URL using the
existing client listing boundary and `history.replaceState`; no new service or
repository contract is required. Loading skeletons are presentation-only.
Related products reuse the existing Commerce service result, while recently
viewed product ids use a versioned client-local storage key and resolve product
data through the existing product collection. Carousel position state remains
local to the presentation component, and inline validation stays in the form
boundaries before existing submit/checkout contracts are called. No Appwrite
SDK calls are introduced in components, and no storefront infrastructure
changes are required.

## ADR-038 — contextual storefront feedback and mobile controls — 2026-09-19

The navigation client component owns a small scroll threshold state so the
sticky header can add depth without changing layout. The existing Commerce
Provider owns a short-lived add-to-bag toast because all storefront purchase
flows already pass through its `addToBag` contract. Listing empty states accept
an optional client callback for clearing active filters, while mobile filter
and sort controls are kept in the existing listing toolbar and made sticky via
CSS. No service, repository, infrastructure, or Appwrite contracts change.

## ADR-037 — visual state contrast and accent discipline — 2026-09-19

The final visual refinement pass keeps `#F4F0E8` as the current canonical
canvas value and `#FFFDF8` as the opaque card surface, superseding the earlier
`#F7F4EE` wording in the historical pearl-white note. Image labels receive a
translucent dark backing, the sticky header receives a translucent blurred
surface, and active filters, selected swatches, warm secondary buttons, input
focus, shipping accents, and mobile image panes each use dedicated semantic
states. The blue-teal token is used for focus feedback only; terracotta is
reserved for sale communication plus the requested shipping-strip accent.

## ADR-036 — warm semantic storefront palette — 2026-09-19

The storefront color system is centralized in the global and reference roots.
Pearl canvas/card contrast is controlled by `--background`, `--surface`, and
`--surface-inset`; semantic sale, sage, success, destructive, and focus tokens
control state communication. Hard-coded cool gray surfaces and legacy accent
overrides are removed from the primary storefront presentation so the palette
stays cohesive across catalog, PDP, cart, checkout, dialogs, and footer.

## ADR-035 — cohesive motion layer with reduced-motion fallback — 2026-09-19

Motion is implemented as a shared CSS layer in `reference.css`, using existing
motion tokens plus spring/soft easing additions. It covers entrance reveals,
image depth, card lift, control feedback, modal entry, and footer interactions.
The layer is CSS-only to keep Server Components and service/repository
boundaries unchanged, and its final reduced-motion media query disables the
decorative movement.

## ADR-034 — quiet quick add modal chrome — 2026-09-19

Quick Add hides the shared dialog header and close icon while retaining a
screen-reader-only title. The native dialog backdrop remains the dismissal
affordance, keeping the compact purchase flow visually quiet.

## ADR-033 — browse-preserving compact quick add — 2026-09-19

Quick Add uses the shared Dialog with a document-level portal because product
cards may be nested in horizontal overflow containers. This prevents native
modal promotion from repositioning the product listing. Its compact content
starts with the selected product image and summary, followed by variant choices.

## ADR-032 — category collage as homepage entry point — 2026-09-19

The homepage renders the Shop the collections category collage directly below
the sticky header. The temporary visible intro and Shop new arrivals CTA are
removed, while a screen-reader-only h1 remains for document semantics. This
supersedes the homepage-intro portion of ADR-031; quick add, cart feedback,
sticky navigation, filter chips and other UX decisions remain unchanged.

## ADR-031 — explicit quick add and browse-preserving cart feedback — 2026-09-19

ProductCard keeps its compact purchase affordance but routes it through a native
dialog that requires an available color and size before calling the existing
CommerceProvider contract. `addToBag` updates shared shopping state without
opening the bag drawer; the header remains the explicit drawer entry point and
quick add/product detail provide inline confirmation plus a View your bag action.
This prevents an arbitrary default size from being silently purchased and keeps
catalog browsing uninterrupted. The homepage intro, sticky header, mobile card
metadata reduction, active filter chips and customer-facing count/category copy
are presentation-layer changes and do not alter repository or service contracts.

## ADR-030 — pearl-white canvas and opaque card separation — 2026-09-19

The storefront canvas uses `#F7F4EE`, and the shared ProductCard shell uses the
opaque near-pearl `#FFFDF8` fill. The warmer color delta provides clear but soft
surface separation without introducing a grey panel or product-derived tint.
The carousel-specific card rule must use the same opaque fill rather than a
translucent override, and the decorative white highlight stays restrained so it
does not flatten the contrast. This supersedes ADR-026's transparent card-fill
choice; the shared shell geometry, border, shadow and crisp child content remain
in place.

## ADR-026 — clear glass material and crisp content — 2026-09-19

The ProductCard shell uses a translucent white background and a stronger backdrop
filter rather than a grey gradient. Decorative reflections remain on a noninteractive
pseudo-element below the card children. The shell uses one neutral material across
all products, while image, text and controls stay sharp above it. Card imagery returns
to normal blending on a translucent white inner pane; the PDP gallery keeps its
separate neutral multiply-blended presentation. Cursor color is a presentation token
change in CSS and does not alter pointer behavior.

## ADR-025 — shared glassmorphic ProductCard shell — 2026-09-19

Glass styling belongs to the shared ProductCard CSS rather than a homepage-only
wrapper, so homepage carousels, listings, wishlist and recommendations render the
same card. The existing semantic article and interactive markup remain unchanged.
The effect uses progressive CSS backdrop filtering with an opaque translucent
gradient fallback, avoiding a runtime dependency or additional client state.

## ADR-024 — progressive custom cursor and featured-card frame — 2026-09-19

The custom cursor is a small client-only presentation component mounted by the
root layout. It activates only when CSS and JavaScript both detect a fine pointer,
uses direct ref updates inside one animation frame loop, and does not enter the
accessibility tree. Interactive-target detection expands the trailing ring without
changing control semantics. Reduced motion positions the ring immediately.

The shared ProductCard renders category and existing rating data without changing
the Product contract. Homepage carousel width and card density are presentation
rules in `reference.css`: a 76rem frame and four cards on desktop, three on tablet,
with the existing touch carousel on mobile. The product-detail/cart contracts and
the no-card-level-cart-action decision remain unchanged.

## ADR-023 — GitHub Pages static export — 2026-09-18

The mock storefront is exported with Next.js `output: "export"` only in the
GitHub Actions Pages build. The repository name supplies the `basePath`, local
public image URLs receive the same prefix, and `next/image` runs unoptimized so
the static artifact needs no image server. Category, product and info dynamic
routes provide `generateStaticParams`; search reads its query in the client so
the static `/search/` page remains interactive. A Pages workflow builds
`apps/storefront/out` and deploys it with the official Pages artifact/actions.
Local development keeps the normal server-rendered Next.js configuration.

## ADR-022 — homepage campaign sale destination — 2026-09-18

The homepage campaign banner owns the presentation copy “Explore Current Sale”,
uses the local `current-sale-banner.png` editorial asset, and points its
existing Explore Now link to the `/sale` route. This is a presentation-only
change; product data, services, repositories and routing contracts remain
unchanged.

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

## ADR-027 — transparent carousel canvas (2026-09-19)

The carousel section and product track explicitly use transparent backgrounds. The
glass shell is scoped within carousel cards with one neutral white tint, so the page
canvas stays white while card content remains sharp and visually layered.
Carousel cards use inset highlights instead of a diffuse outer shadow, preventing
shadow spill from tinting the transparent gaps.
This supersedes the earlier stronger repeated tint that read as a grey carousel band.

## ADR-028 — reference card controls and purchase row (2026-09-19)

The shared ProductCard keeps its existing content but follows the reference hierarchy:
the taller image panel comes first, the wishlist/category metadata sits below it,
swatches align beside rating, and price shares a row with a compact Add to cart button.
The button delegates to CommerceProvider, preserving the existing stock validation,
browser persistence and bag drawer behavior. This supersedes the later removal of the
card-level purchase control.

## ADR-029 — shared minimal storefront surfaces (2026-09-19)

The completed ProductCard is the visual reference for the remaining storefront:
clear neutral glass, soft borders, rounded corners, compact controls and generous
white canvas spacing. A final layer in `reference.css` scopes that material to
PDP buying panels, gallery controls, cart rows and summary, wishlist empty states,
dialogs, the Shop drawer, checkout, account and confirmation panels. This keeps
the existing component markup, service contracts and commerce state unchanged
while providing one visual system across routes. Responsive overrides stay in
the same layer so mobile controls remain readable. `Dialog` accepts an explicit
drawer side so navigation can open from the left while the bag remains on the
right without duplicating modal behavior. Drawer geometry stays fixed with a
viewport gap and rounded corners on every side; only the inner content scrolls,
and no drag interaction is introduced.

## ADR-030 — storefront audit follow-up controls (2026-09-19)

Variant-aware display imagery is resolved in `catalog-query.ts` and reused by
cart, checkout and confirmation UI. This keeps selected-color presentation in
the UI/service layer without moving repository or infrastructure concerns into
components. Quick Add remains a shared dialog implementation, but each card
mounts it only while active; the native dialog lifecycle still owns focus,
scroll-lock and exit animation.

Search suggestion semantics remain client-side because catalog search is already
client-side for the static storefront. Route metadata is enriched without
inventing a canonical deployment origin; canonical URL work remains deferred
until the public host is approved. Generic external social destinations are not
used as pretend brand links; they render as coming-soon text until real accounts
are supplied.

## ADR-031 — styled collection dropdowns and compact filter state (2026-09-20)

Collection controls use the reusable client-side StyledSelect component rather
than native select elements. It owns open state, outside-click dismissal,
keyboard selection, listbox semantics and the animated menu surface while the
listing component remains responsible for filter state and URL synchronization.
The Shop trigger intentionally has no route-derived active state because it opens
a drawer rather than representing a destination. Active filter chips remain in
the listing count row and use an overflow rail on narrow viewports so the toolbar
does not grow when filters are applied.

## ADR-032 — PDP quantity and gallery control finish (2026-09-20)

Product detail quantity actions keep their interaction styling inside circular
button hit areas, while the selected gallery thumbnail uses the existing sage
accent and neutral surface tokens. These are presentation-only refinements in
the shared CSS layer; ProductDetail state, commerce contracts and image
selection behavior remain unchanged.
