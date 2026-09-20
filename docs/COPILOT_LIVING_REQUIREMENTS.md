# Living requirements

## Admin product and variant media workflow — 2026-09-20

Product creation is an explicit sequence: save product information, create at
least one named color variant, set independent stock for each selected size,
then upload that variant's images. The variant workspace must be visible after
the variant is created and must allow one required product image plus up to four
ordered images per color variant. Publication readiness must identify the exact
variant missing images or inventory data.

## Admin per-size inventory — 2026-09-20

Every product color/size combination is its own inventory record. Admin product
creation must collect stock independently for each selected size rather than
applying one shared quantity to a color. The variant matrix remains the source
of truth for later edits, so examples such as Blue/S = 10, Blue/L = 10,
Black/M = 10 and Black/XL = 10 must remain independent values. Storefront
availability, quantity limits and cart validation must continue to resolve the
selected variant's own stock.

## Complete Admin product merchandising controls — 2026-09-20

The Admin product detail workspace must control every product value consumed by
the current storefront: name, unique slug, category, description, material,
fit, care, search keywords, New Arrival state, release timing, SEO title and
description, publishing status, color-specific media, variant SKU/size/pricing/
stock and optional original sale pricing.

Each color variant owns its visible name, editable six-digit hex swatch,
optional dedicated product-card crop and ordered product-detail gallery. Every color
variant requires at least one and allows no more than four gallery images before
publication. Images support crop, replacement, alt text, reordering and
confirmed deletion. Color records support renaming, hex changes, size additions
and confirmed deletion; variant rows support size, SKU, regular price, optional
original price and independent stock editing.

The editor must show a live card preview and an explicit publishing-readiness
list. Draft preview remains available. Publishing is blocked until required
copy, unique routing, detailed PDP content, one or more valid variants and all
per-color media are complete. Future release dates can use Scheduled status;
scheduled products enter the same-origin storefront when their release time is
reached. Product duplication creates a draft, while product deletion requires
confirmation and removes related local media and homepage references.

These controls continue to use browser persistence for the frontend demo and
the existing UI → service → repository boundary for future Appwrite replacement.

## Admin product gallery and variant creation — 2026-09-20

Creating a product starts a clean draft rather than cloning an existing catalog
item. The Admin flow must make variant creation explicit: each color variant
gets its own image workspace after creation, with at least one and no more than
four saved product images. Every image uses the product-gallery overlay cropper
and its exact 1200 × 1600 output.

The same workspace must let an Admin create color variants by entering a
customer-facing color name, selecting a color with a native picker, seeing and
editing its six-digit hex value, choosing sizes, and setting price, stock and an
optional SKU prefix. The generated size records remain editable and removable.
The chosen hex value must drive storefront color swatches.

A draft cannot be published without four saved images and at least one variant.
Published Admin products and edits must be reflected by the same-origin local
storefront demo, including listing cards, product gallery, color swatches,
prices and inventory. Browser persistence remains a demo adapter; production
synchronization still belongs behind Appwrite repositories and storage.

## Admin category image workspace parity — 2026-09-20

Category detail must use the same always-visible image workspace as product
detail. The current category image is shown inside the full-source overlay
cropper immediately, with the slot-ratio selection, crop-size control,
Replace image action and Save cropped image flow available without first
choosing a replacement file. Saved category crops remain visible in this
workspace and continue to render at the category slot's configured dimensions.

This supersedes the earlier category upload-only and fixture-media empty-state
requirements. Product, homepage and persistence boundaries remain unchanged.

## Admin visual system and interaction polish — 2026-09-20

All Admin routes share one consistent Styleco control-room language: Archivo
display headings, DM Sans body copy, a fixed control height/radius system,
aligned form fields, predictable panel spacing, readable status badges,
keyboard-visible focus states, reduced-motion support and mobile-safe layouts.
Overview, list, detail, settings, activity, login and fallback surfaces must
use the same navigation, breadcrumb, button and card treatment. Admin status
labels must describe their domain accurately; commerce order statuses must not
be represented as content statuses.

## Admin detail workspace refinement — 2026-09-20

Category and product detail editors must keep save actions inside their owning
panel's flow so a save bar never covers an input, select or description field.
The product editor must present copy/status first, then place image placement
and variant inventory in a clear desktop split workspace; it must collapse to
one readable column on narrow screens. Category image editing remains an
upload-only surface until a file is selected, with the slot-aware cropper
opening for that upload.

## Admin image preview fidelity — 2026-09-20

Every Admin image upload surface must use the corresponding storefront slot's
aspect ratio and target pixel dimensions for its empty upload frame, cropper
viewport and saved preview. After a crop is saved, the uploaded asset must
remain visible as a saved preview in the same section; replacing it reopens
the slot-aware cropper. Fixture media remains an upload-only state in category
detail until an Admin replacement is saved.

## Admin overlay crop selection — 2026-09-20

After selecting an image, the Admin cropper must keep the complete source
photo visible and place a movable crop rectangle above it. The rectangle keeps
the target storefront slot's aspect ratio, dims the excluded image area and
supports pointer dragging plus keyboard movement. Crop size may be tightened
without changing the target ratio. Saving must render a real cropped image at
the slot's configured output dimensions and persist that rendered result for
the saved preview.

## Admin section-aware image editing — 2026-09-20

Storefront photography is managed by its frontend slot rather than by one
generic Media Library. Categories and product imagery remain inside their
category/product detail workspaces. Homepage photography is managed from the
existing Admin Settings route so the Admin sidebar does not regain a Homepage
editor or standalone Media Library item.

The Admin image controls must cover the current storefront photo slots:
category panels, product cards, Explore Current Sale, Find your next favorite,
The Katua Collection, Made for slow mornings and Behind The Brand. Each slot
has its own target aspect ratio and target pixel-size guidance. Uploading a
replacement opens the interactive crop preview for that target slot, allowing
dragging, zooming and a saved preview before the image is accepted.

The current Admin frontend demo continues to store uploaded image data and
crop state in the browser. It does not mutate committed fixture files or make
the public Storefront read local Admin state; production synchronization will
use the existing UI → services → repository → Appwrite Storage boundary.

## Admin catalog navigation refinement — 2026-09-20

The Admin surface is list-first for catalog and commerce work. Do not expose a
Homepage editor or standalone Media Library in the Admin navigation or route
surface. Category and product imagery remains edited inside the relevant
category/product workspace using the slot-aware cropper.

Products must be sorted newest first and paginated at 15 products per page.
Selecting a product opens a focused detail route containing its copy/status,
image placement and sizes/stock controls. Orders follow the same list/detail
pattern, are sorted newest first, and use 15 orders per page. Category deletion
must be confirmed, remove associated demo state and write an activity entry.

This supersedes the initial Admin demo navigation and inline split-pane
Product/Order editor requirements. The public Storefront homepage and routes
are unaffected.

## Admin frontend demo architecture — 2026-09-20

The Admin increment is now explicitly approved and supersedes earlier active
scope statements that limited the project to Storefront-only work. Build Admin
inside the existing `apps/storefront` Next.js app; do not create `apps/admin`,
an Admin subdomain, or a second deployment. Public storefront URLs must remain
unchanged. Use the `/admin` route tree with its own layout, sidebar/header,
providers, loading/error/not-found states and design language. The storefront
must not expose a visible Admin link, and Admin routes must not load storefront
chrome or commerce providers unnecessarily.

Required Admin URLs: `/admin/login`, `/admin`, `/admin/categories`,
`/admin/products`, `/admin/products/[id]`, `/admin/orders`,
`/admin/orders/[id]`, `/admin/settings` and `/admin/activity-log`. The current demo login is exactly
username `admin` and password `admin`; it is a temporary browser-side demo
adapter, not production authentication. The future production path is
server/session-based Appwrite Auth with centralized authorization and roles.

The current demo may persist Admin state in the browser, but must not mutate
mock fixture source files and does not need to update the Storefront's fixture
data. Keep backend-independent domain types shared where appropriate without
placing Admin form state in Storefront models. Keep the boundary
`Admin UI → Admin services → repositories → Appwrite` ready for the future
backend; no Appwrite SDK calls belong in components in this increment.

Admin controls cover Dashboard, Categories, Products and variant matrices,
Orders, Settings and Activity Log. Content
supports draft/published/archived status, safe editing, resettable demo state,
mock preview and responsive/accessibility-friendly controls. Category and
product image fields must use an interactive cropper whose viewport aspect
ratio matches the relevant frontend slot and displays the resulting crop in a
live preview before save. Campaign/media slots use the same pattern.

Every Admin route is `noindex, nofollow` and excluded from any sitemap. GitHub
Pages remains the current static storefront showcase. The same app will later
move to server-capable Appwrite Sites for production Auth, TablesDB, Storage
and Functions. This deployment distinction does not authorize Appwrite work
in the current frontend-demo increment.

## Storefront audit and control polish — 2026-09-19

- Cart, checkout and order confirmation images must resolve from the selected
  variant color when color-specific imagery exists, so the chosen color remains
  visually consistent after purchase.
- Search suggestions expose combobox/listbox semantics, keyboard arrow selection,
  and an active option state without changing the existing route behavior.
- Checkout and account controls remain accessible at mobile widths; the mobile
  quick-navigation dock must not obscure checkout or confirmation content.
- Closed select controls use the Styleco pearl/sage surface system with visible
  focus, hover and reduced-motion states. FAQ and product disclosure controls
  use the same animated disclosure language.
- Quick Add dialogs mount only for the active card so long catalog rails do not
  create a hidden dialog per product.
- Private/demo-only routes are marked noindex and public collection/info routes
  receive useful page descriptions. Placeholder social destinations are shown as
  coming soon rather than linking to generic external homepages.

This increment supersedes the audit recommendation to reduce homepage rail data:
the current living requirements intentionally keep the complete curated sale,
top-seller and latest-product orders. Performance work should preserve those
collections while reducing hidden UI work and keeping images lazy.

## Storefront UX polish pass — 2026-09-19

The storefront should keep product-card hierarchy consistent, expose active
navigation and filter states, provide a compact product-aware bag confirmation
with an undo action, make checkout progress scannable, use one sage focus
language, keep empty states actionable, and soften image loading transitions.
Mobile filters remain reachable while browsing without obscuring the content.

## Primary surface palette refinement — 2026-09-19

The custom cursor remains black without a contrasting halo. Shared primary
actions and dark utility surfaces use a deep forest-sage palette instead of
near-black, while delivery and trust panels use a soft sage-tinted surface so
the cursor remains legible and the UI stays within the pearl, sage, and
terracotta system.

## Product card stock cue removal — 2026-09-19

Product cards should not show low-stock urgency such as “Only 3 left”. The
existing out-of-stock state and the underlying inventory rules remain intact;
this change only removes the promotional stock-count presentation from cards.

## Modal lifecycle motion — 2026-09-19

All storefront dialogs animate both entry and exit while preserving native
dialog semantics and focus restoration. Centered modals use a soft surface and
backdrop transition, left/right drawers travel from their originating edge,
and the bag drawer uses a distinct right-origin spring so it visually follows
the bag trigger. Reduced-motion users receive the same modal state changes
without decorative movement. Navigation from the bag to the full cart closes
the drawer immediately so the destination page is not left inert behind an
exiting native dialog. Opening and closing any dialog must preserve the page
layout by compensating for the removed scrollbar gutter.

## Search modal visual alignment — 2026-09-19

The search modal must use the same warm near-pearl glass surface, rounded
controls, muted borders, sage focus/interaction states, and terracotta utility
accents as the current product cards, PDP panels, and checkout surfaces. Search
results should read as compact product cards rather than legacy full-width list
rows, with the responsive layout preserving a focused, scannable discovery
flow.

## Storefront continuity and confidence pass — 2026-09-19

The storefront preserves catalog state through browser history navigation,
offers a zoomable product gallery, remembers recent search terms locally, and
provides guided search suggestions. Product cards preserve clear availability
states without low-stock urgency, checkout exposes a navigable four-step
overview and delivery estimates, and
mobile shoppers receive a persistent quick-navigation bar. Existing cart and
wishlist persistence through the browser shopping-storage contract remains the
source of truth. Image quality and priority settings are tuned for the current
demo imagery, and a global error fallback provides a recoverable failure state.

## Storefront discovery and feedback pass — 2026-09-19

The storefront listing state is shareable through URL query parameters for
search, size, color, price ceiling, stock, sale, and sort. Route loading states
use product-card and image skeletons. Product detail and cart surfaces expose
trust messaging and related products, while product detail also exposes a
client-only recently viewed rail. Search empty states provide suggested
categories and popular terms, carousels expose keyboard instructions and
position indicators, and storefront forms provide inline validation plus an
error summary where appropriate. These additions remain storefront-only and do
not change commerce service, repository, or infrastructure contracts.

## Storefront usability polish pass — 2026-09-19

The storefront keeps the established warm pearl palette while improving
hierarchy and feedback. The sticky header gains stronger depth only after the
shopper scrolls, product category pills become quieter, sale prices receive a
stronger terracotta hierarchy, and the best-sellers section gains a subtle
inset surface for long-page rhythm. Mobile listing controls remain available
through a sticky filter/sort toolbar. Empty result states provide contextual
copy and a filter reset when relevant, muted text uses the stronger accessible
subtle token, and successful bag additions show a brief shared confirmation
toast.

## Storefront visual refinement pass — 2026-09-19

The current storefront polish pass keeps the pearl canvas (`#F4F0E8`) and
near-pearl card surface (`#FFFDF8`) visibly distinct. Category labels use a
dark translucent backing for image contrast, the sticky header uses a light
blurred surface, active filters use sage state styling, and blue-teal is
reserved for focus feedback. Secondary buttons use a warmer cream surface,
form focus uses the blue-teal ring with a warm cream fill, selected swatches
show a clear double ring, the shipping strip has a restrained terracotta edge,
and mobile product image panes use the darker inset surface. Terracotta stays
limited to sale badges/prices/navigation and the shipping accent; general
decorative and utility states use sage, neutral, or primary colors.

## Storefront color system refinement — 2026-09-19

The storefront uses a warmer pearl canvas (`#F4F0E8`) with a distinct near-
pearl card surface (`#FFFDF8`), warmer inset/image surfaces, stronger border
hierarchy, terracotta sale states, sage new/category states, warm shadows, and
a dedicated blue-teal focus ring. Existing orange/blue/lime token names now
map to intentional colors instead of being overridden to neutral values.

## Storefront motion pass — 2026-09-19

The storefront uses restrained motion for page-entry reveals, product-card and
editorial-image hover states, navigation and control feedback, modal entry,
and footer/link interactions. Motion is decorative only and every animated
surface has a reduced-motion fallback that removes transforms, transitions,
and entrance animations.

## Quick add modal chrome — 2026-09-19

Quick Add does not show a visible product-title header or close icon. Its
accessible title remains available to assistive technology, and shoppers close
the modal by clicking outside its content area.

## Quick add polish — 2026-09-19

Quick Add opens from a document-level modal portal so activating it preserves
the shopper's browse position. The modal stays compact and includes the
selected product image, name, category, and price before the color and size
choices.

## Homepage intro removal — 2026-09-19

The homepage begins directly with the Shop the collections category collage.
The visible homepage value proposition and Shop new arrivals CTA are removed;
the semantic page heading remains screen-reader-only. This supersedes the
visible homepage intro portion of the storefront UX refinement below.

## Storefront UX refinement — 2026-09-19

Product-card Quick add opens an accessible modal requiring the shopper to choose
an available color and size before adding one variant. Adding an item does not
open the bag automatically; the shopper receives inline confirmation and can
open the bag explicitly. The product-detail flow keeps inline confirmation with
a direct View your bag action.

The header remains available while scrolling. The homepage collage remains the
first visible section.
Mobile product cards reduce secondary rating detail while preserving product
identity, color choice, wishlist and purchase access. Listing pages expose
active filter chips with per-filter removal and a nearby Clear all action.
Count labels and search-result category names use natural customer-facing copy.

## Pearl-white canvas and visible product cards — 2026-09-19

The storefront page canvas uses the warmer pearl-white color `#F7F4EE`.
Product cards use a near-pearl, opaque `#FFFDF8` surface so the card is clearly
but softly lighter than the canvas while remaining quiet and cohesive. The
card must not be exact transparent; its decorative white highlight is restrained
to preserve that separation, and a subtle dark edge reinforces the card boundary.
Existing rounded geometry, shadow, imagery and interaction behavior remain
unchanged. This supersedes the clear glass
shell's transparent-fill requirement while retaining its restrained layering
and shared ProductCard treatment.

## Clear glass cards and black cursor — 2026-09-19

Product cards use the client-provided floating-product glass reference as the
material target. This refines the earlier glass treatment: remove the grey-tinted
card and image fills, use a clear translucent white shell with stronger backdrop
blur and bright reflected edges, and keep product imagery and metadata sharp above
the effect. The product-detail gallery retains its neutral image surface. The
desktop custom cursor dot and trailing ring are black, including the expanded
interactive state.

## Glassmorphic product cards — 2026-09-19

All shared ProductCard instances use one continuous iOS-inspired glass surface.
The image, category, name, rating, color controls and price sit within the same
rounded card shell. The shell uses translucent layered fills, backdrop blur, a
fine light border, inner highlight and restrained depth shadow. Image, wishlist,
badges and stock overlays remain contained within the card. Preserve all existing
wishlist, color-image, stock, navigation, responsive and reduced-motion behavior.

## Reference cursor and featured-product treatment — 2026-09-19

The storefront uses the desktop cursor behavior and Featured Pieces product-card
composition from https://fashion-store-boutique.vercel.app/ as visual inspiration.
Fine-pointer devices show an 8px warm accent dot with a 40px trailing outline that
expands over interactive controls. Touch devices keep their native pointer, and
reduced-motion preferences remove the trailing interpolation.

Product cards retain Styleco's existing commerce behavior while adding compact
category and rating metadata, pill badges and a clearer name/price hierarchy.
Homepage product carousels use a centered 1216px desktop frame with four visible
cards and generous side gutters; tablet shows three cards and mobile remains a
horizontal touch carousel. This supersedes the earlier five-card homepage density.
No card-level Add to cart action is restored.

## GitHub Pages demo deployment — 2026-09-18

The storefront must be publishable as a static Next.js export from the `main`
branch to GitHub Pages at `/Styleco-Cloth-Brand/`. The export uses repository
path-aware links and local image URLs, generates all mock catalog and info
routes at build time, keeps search filtering client-side, and requires no
backend or external service.

## Campaign banner sale CTA — 2026-09-18

The homepage campaign banner is titled “Explore Current Sale”. Its existing
Explore Now CTA routes to `/sale`, so the campaign entry point opens the sale
listing directly. The banner uses a high-resolution local editorial sale asset
with a neutral Styleco-compatible palette and no embedded text.

## Category listing density — 2026-09-18

Desktop category listings show four product cards per row so the catalog is
more compact and scannable. Tablet keeps three columns and mobile keeps two
columns for readable product names and usable swatches.

## Product detail gallery scale — 2026-09-18

On desktop product-detail pages, the primary gallery fits within the available
viewport below the site chrome so the complete product photo is visible without
initial page scrolling. The image uses contained fitting inside the neutral
gallery surface; mobile retains its responsive gallery height and full-photo
visibility.

## Homepage carousel naming — 2026-09-18

The homepage carousel headings are “Current Sale”, “Best Sellers” and “Latest
Products”. Each heading has a short eyebrow above it that explains the section:
“Save on selected styles”, “Most loved right now” and “New into the collection”.
The underlying sale, curated top-seller and latest-product data contracts remain
unchanged.

## Sale-card spacing and directional color transition — 2026-09-17

Discounted carousel cards keep their swatches directly below the product name;
the stacked sale price must not add an empty vertical gap. Changing to a color
to the right slides its image in from the right, while changing to a color to
the left slides it in from the left. Reduced-motion preferences still disable
the transition.

## Product-card spacing and color transition — 2026-09-17

Carousel swatches sit immediately below the product name without reserving an
unused second line for one-line names. Selecting a color keeps the card frame
stationary and fades the newly loaded color image into place. The fade remains
disabled under reduced-motion preferences.

## Catalog and mobile polish — 2026-09-17

The accepted polish increment replaces category-shared photography with distinct images for all 25 products and their three colors, exposes the wishlist in the mobile header, aligns product names/prices/swatches, and reviews the complete demo shopping flow. Preserve the white canvas, minimal drawer, five desktop cards, first selected color, and stationary cards with subtle image-only zoom. No secondary card image overlay; reduced motion disables zoom.

## Product image separation refinement — 2026-09-17

Product cards and detail galleries keep the white page canvas but use a quiet
cool-neutral image surface with a fine border. The warm near-white backgrounds
in the local product photography blend into that surface so product silhouettes
remain distinct without replacing or tinting the website background.
Hover zoom keeps the primary product artwork stable and scales it uniformly;
the close-up secondary layer stays hidden so it cannot create a doubled image.

## Topbar and shop drawer refinement — 2026-09-17

Topbar wishlist and bag quantities are live, browser-persisted counts from the
shared shopping store. Neither utility shows a zero beside its icon; a compact
badge appears at the icon's top-right only when its count is greater than zero.
The homepage Shop control opens an opaque, minimal right-side drawer with a
small heading, plain category rows and a compact utility grid. This supersedes
the earlier dark intro, numbered links and sale promo treatment. The drawer
preserves keyboard focus and reduced-motion behavior.

## Homepage polish pass — 2026-09-17

The user-facing trouser category is labeled “Pants” while preserving the
existing `/category/pant` route and `pant` asset folder. Product carousel
metadata is readable at desktop and mobile sizes, carousel controls have clear
hover and disabled states, category cards have visible keyboard focus feedback,
and mobile navigation controls retain 44px touch targets.

## Category image clarity refinement — 2026-09-17

Category panel assets must render from the local sharpened WebP files at high
delivery quality. Next image quality 95 is explicitly allowed in the storefront
configuration so the panels do not fall back to the default quality 75 output.
The responsive `sizes` hint accounts for the tall `object-fit: cover` panels so
the browser selects an image tall enough for the panel instead of upscaling a
width-only thumbnail.

## Category image refresh — 2026-09-17

The homepage category strip uses a new cohesive set of editorial portrait images
inspired by the client-provided Dribbble reference. Assets are stored locally,
folder-wise under `apps/storefront/public/images/categories/` with one
`category.webp` per category: shirt, katua, t-shirt, pant and sleepwear. The
images are generated campaign assets with no copied Dribbble artwork, text,
logos or watermarks.

## Product card add-to-cart removal — 2026-09-17

This supersedes the earlier ProductCard add-to-cart refinement. Product cards
do not show an Add to cart button; product selection remains available through
the product detail and existing shopping flows.

## Product card add-to-cart refinement — 2026-09-17

Every ProductCard exposes a compact Add to cart button beneath its price,
aligned in the price column. The color swatches remain directly beneath the
product name. It adds one unit of the selected color's variant when that color
is in stock through the existing shopping service, opens the demo bag drawer,
and respects stock limits and browser persistence.

## Full category strip refinement — 2026-09-17

The homepage category strip renders all five categories—Shirt, Katua, T-Shirt,
Pants and Sleepwear—as equal-width cards. The former Styleco essentials campaign
panel and Shop Now CTA are removed from this strip. The five-card desktop strip
keeps the same full-width section geometry; mobile wraps the cards responsively.

## Default color selection refinement — 2026-09-17

Product cards and product detail pages always initialize the selected color from
the first color in the product's ordered color list. Stock availability may
disable that swatch for purchase, but it does not change the default visual
selection or gallery color. Users can still select another available color.

## Sale and section rhythm refinement — 2026-09-17

The homepage now places a Sale carousel above Best sellers, using every product
that has a discounted original price. The Latest Products collection is labeled
“Latest Products” in its carousel heading. Carousel sections use a consistent
vertical rhythm: compact spacing between adjacent carousels, balanced spacing
around the campaign banner, and the existing larger separation before delivery
messaging.

## Product card and delivery refinement — 2026-09-17

Product cards and their image frames use a restrained 8px radius across the
storefront. Homepage product carousels show five cards at desktop and tablet
breakpoints before scrolling. The Best sellers Explore button is removed. The
Highlights carousel has additional bottom spacing before delivery messaging,
and the free standard delivery message is centered as one line.

## Homepage carousel density refinement — 2026-09-17

Homepage product carousels use shorter product image frames and six visible
product cards at desktop widths before scrolling. Tablet uses a four-card view
and mobile keeps a touch-friendly horizontal card width. Best sellers and
Highlights use the same standard ProductCard layout; Highlights no longer has a
special split first card so its first and second cards remain consistent with
the rest of the collection.

## Carousel and canvas refinement — 2026-09-17

The storefront content canvas is widened so desktop layouts use more of the
available viewport and do not feel compressed into a narrow centered column.
Best sellers are rendered as a horizontal carousel using the complete curated
Top Sellers order. Highlights is the Latest Products collection, also rendered
as a horizontal carousel using its complete curated order. Both retain keyboard
arrow controls, touch/trackpad scrolling, accessible labels and reduced-motion
behavior. The first Highlights card keeps its editorial split treatment on
desktop while remaining a normal readable card on mobile.

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
service integration is authorized. The Admin frontend-demo scope is recorded
above and is the current exception to the older Storefront-only wording.

## Active scope — Frontend Demo / Interactive Prototype

The new user brief supersedes the earlier homepage-only increment and D1–D4
non-goals for frontend implementation. Workflow now: REQUIREMENTS → COMPLETE
FRONTEND DEMO → HUMAN VISUAL REVIEW → ITERATIVE CHANGES → DESIGN FREEZE LATER →
BACKEND IMPLEMENTATION LATER. Earlier phase records remain historical.

Build the complete local customer journey: editorial homepage, five category
listings, New Arrivals, Sale, search, PDP/gallery/variants/size guide, persistent
wishlist/cart, mock coupon, validated checkout, demo order confirmation, account
surfaces, supporting pages and branded 404. Admin is a separate frontend-demo
surface in the same app as defined by the dated Admin requirements above. No
backend, database, production auth/payment/tracking, or deployment migration is
authorized in this increment. Use `/category/[slug]` consistently.

Use 25 local mock products, BDT integer paisa, explicit per-variant stock, mock
ratings, local original demo imagery, and structured campaign content. Homepage
Latest Products and Top Sellers remain explicitly ordered curated references;
New Arrivals and listing Newest sorting are separate concepts. Two restrained
editorial campaign sections and the brand/footer treatment complete the homepage.

All mock commerce is non-authoritative. Centralized browser persistence backs
wishlist/cart; order confirmation is session-local. Demo coupon STYLE10 gives 10%
off merchandise. Standard delivery ৳80 (free at ৳3,000 merchandise subtotal),
Express ৳150. Checkout clearly labels simulation; card details are never persisted.
Login/register are visual review forms, without an authentication claim.

Verify real browsing, responsive layouts, state, filtering, cart stock limits and
checkout; human visual review is the next phase. D5–D9 documents are deferred.

## Current homepage refinement — 2026-09-15

The homepage hero is removed from the rendered storefront for this iteration. The
homepage order is now announcement → header/navigation → Categories → Latest Products
→ Top Sellers → additional editorial/campaign content → footer. The former “Best of
the Week” category carousel is renamed “Categories”; the section remains a horizontal
data-driven category carousel with the same navigation and swipe behavior.

Category images and product image areas use a restrained small radius to soften the
editorial grid. Product-card color swatches are semantic buttons: selecting a color
updates the card’s active price/availability and image when a color image set exists.
The Product model supports optional color-keyed image sets so real Appwrite Storage
assets can replace the local demo variants later. The category carousel now loops its
data order so the active category occupies the first, slightly larger card; heading
controls remain available for keyboard and pointer users, while the per-card arrow
overlay is removed. Swatches use compact spacing, scale the selected dot without a
selection border, and animate the active image change with reduced-motion support.

Baseline: 2026-09-15, user Phase 0 brief; clarified by the 2026-09-15 compressed
Discovery–D4 brief. Changes must be recorded here and important decision changes in
architecture. Historical phase restrictions below are superseded only as described
in the active frontend-demo scope above.

## Current copy and footer refinement — 2026-09-16

Category cards use an optional data-driven editorial label related to each category;
the UI falls back to a simple category shop label when a backend category has no
caption. The footer wordmark is intentionally reduced on desktop and mobile so it
supports the footer content without dominating the page.

## Current UI refinement — 2026-09-16

- Remove the newsletter globally, including its unused component and styling.
- Keep Editorial Pop; normalize typography, section spacing, form controls and
  responsive layouts across existing storefront routes. Body/input text is 16px;
  commerce labels and prices stay readable without competing with photography.
- Color controls sit directly beside each other. Selection enlarges the dot with
  no extra black selection border; retain accessible names, pressed state and focus.
  Card targets are 24×32px (28×44px on coarse pointers) without overlapping hit areas;
  PDP targets are 36×44px. This refines the earlier blanket 44px target guidance.
- Add short CSS feedback for buttons, wishlist, galleries, carousel changes,
  dialogs/drawers and accordions. Disable it under reduced motion. No autoplay,
  entrance effects that hide page content, or animation dependencies.
- PDP colors update their image gallery as well as the selected variant. Product
  recommendations use a readable single-row horizontal carousel on mobile.

## Current carousel/card refinement — 2026-09-16

- Category next/previous controls visibly animate the existing cards between their
  old and new positions and sizes so the incoming category grows into the featured
  first position. The transition remains keyboard and touch compatible and is
  skipped for reduced-motion users.
- Product-card wishlist controls are visually quieter at 40px while retaining a
  clear icon, accessible name, pressed state and focus ring.
- Product-card swatches show only the adjacent color controls; remove the redundant
  numeric color-count label.

## Current category navigation refinement — 2026-09-16

- Category previous/next controls must auto-scroll the horizontal track so the
  next or previous category visibly moves into the featured position.
- The loop renders repeated virtual copies around a middle anchor. Arrow
  transitions keep those copies in place instead of reordering data or resetting
  the track, so the outgoing card never travels into a trailing slot.
- While the incoming card moves into place, it grows gradually as the outgoing
  card shrinks. Scripted frames temporarily suspend snap quantization, then
  restore touch/trackpad snap behavior when the transition settles.
- Category image assets must remain visually stable during navigation; the
  featured-state change should not replay an image opacity animation.
- Hide the native scrollbar on carousel tracks; cards, clipping and controls make
  overflow discoverable without a scrollbar thumb flashing during transitions.

## Current product imagery refinement — 2026-09-17

- Product cards use local, generated product-only catalog imagery: isolated garments
  on a light studio background without people, mannequins, props, logos or text.
- Every mock product keeps three data-driven color variants. Selecting a swatch
  updates the active variant details and resolves the matching `colorImages` set,
  so the product image changes with the selected color.
- The local fixture uses one generated asset per category/color combination and
  shares it across the five products in that category. This is a development-size
  optimization; production SKU-specific media will be stored in Appwrite Storage
  without changing the Product contract.

## Storefront scope (historical Storefront-only baseline; Admin decision above supersedes the Admin exclusion)

- Storefront public URLs and behavior remain stable while Admin is added under
  `/admin` in the same application. Do not create a separate Admin app or domain.
- Backend-driven categories, initially Shirt, Katua, T-Shirt, Pant, Sleepwear.
- No separate Men's/Women's sections. Current names exist only in mock fixtures.
- Homepage order: header/navigation → fashion panels → Sale → Best sellers → campaign banner → Latest Products → delivery strip → seasonal styles → brand/footer.
- Do not invent extra homepage sections.
- Categories is the editorial-image category carousel: horizontal, desktop arrows, mouse/trackpad, mobile swipe, responsive, category navigation.
- Example category paths: `/shirt`, `/katua`, `/t-shirt`, `/pant`, `/sleepwear`; final scalable routing may change.
- Sale immediately follows the fashion panels; Best sellers follows Sale; Latest Products follows the campaign banner.
- Both product sections: two-row horizontal carousel, previous/next controls on desktop, horizontal scrolling and mobile swipe, responsive, no autoplay.
- Both are manually curated ordered collections, with future selection/removal/reordering and section enable/disable. No creation-date or sales-ranking automation.
- Future shared ProductCard: primary/optional hover image, name, current/original discount price, color swatches, optional New/Sale badges, stock state, wishlist control, product link.
- Global shopping navigation: New Arrivals, the five data-driven categories, and Sale;
  utilities: Search, Wishlist, Account, and Bag. No gender navigation. Wide desktop
  exposes all links; narrower desktop consolidates categories under Shop; mobile and
  tablet use an accessible drawer.
- Hero content remains structured for a future campaign surface, but the hero is not
  rendered on the current homepage. Marketing copy is not frozen.
- Product cards must not hide essential information behind hover. Secondary hover
  images are optional enhancement; wishlist is a separate semantic control.
- Mobile-first reference widths: 360, 390, 430, 768, 1024, 1440, and 1920px.
- Loading reserves image geometry; empty curated sections are omitted; a section
  error should not take down independent homepage content.

## Technology and boundaries

- Next.js App Router, TypeScript, React, Tailwind, Lucide, Zod, pnpm.
- shadcn/ui where useful; React Hook Form when forms are introduced; Vitest now, React Testing Library where useful, Playwright E2E later.
- Server Components by default. UI → service → repository → Appwrite; mock adapter first.
- Appwrite long term: Authentication, TablesDB, Storage, Functions, optional Realtime, future Appwrite Sites or self-hosted hosting.
- Local future: Next.js + Docker/self-hosted Appwrite. Production future: Appwrite Cloud or self-hosted Appwrite on one VPS/server. Switch by configuration, not UI rewrites.
- Workspace uses one `apps/storefront` Next.js app for both public Storefront and
  `/admin`; introduce packages only when reuse justifies them. Any older
  `apps/admin` plan is superseded.
- Future marketing: public SEO product URLs, campaign landing pages, UTM preservation, Meta Pixel/CAPI, Open Graph/social sharing, product feeds. No integrations or marketing dependencies now.
- No dependence on Vercel, Supabase, Firebase, Cloudinary, Auth0, hosted PostgreSQL, or paid infrastructure.
- Development imagery is local/committed or original generated demo work. Do not use
  reference assets. Production product/campaign media will use Appwrite Storage.
- Initial visual direction is Direction A — Editorial Pop: soft white/black base,
  vivid orange and blue, optional lime, oversized grotesk display type, asymmetric
  editorial photography, and restrained commerce cards.
- Accessibility baseline: WCAG 2.2 AA fundamentals, semantic controls, keyboard
  carousel/drawer access, visible focus, 44px utility touch targets (compact color
  target dimensions above), reduced-motion support,
  sufficient contrast, meaningful alt text, and no hover-only interaction.

## Phase 0 acceptance

- Inspect existing files; preserve useful work and report conflicts.
- Configure workspace, Next/TS/Tailwind, lint/format, six AIDOS documents.
- Minimal Category, Product, ProductVariant, ProductImage, HomepageSection, CuratedProductReference types.
- Catalog/homepage repository and service boundaries, mock data, Appwrite placeholder and `.env.example`.
- Root layout, styles, homepage, placeholder header/main/footer only.
- Successful local runtime, lint, typecheck, build; complete Phase 0 only after checks pass.
- No new full homepage, production auth, database creation, tracking, deployment
  migration, or Appwrite integration is authorized here. The Admin frontend demo
  is the explicitly approved exception and must remain browser-persisted/mock.

## Open inputs for later increments

D5–D9 artifact definitions; approved photography/assets; currency/locale and detailed
variant rules; campaign content; hero content schema; signed-out wishlist behavior;
final URL design. Do not guess business policies from mock fixtures.

## Clear carousel canvas — 2026-09-19

- Carousel sections and their horizontal tracks remain transparent so the page canvas
  does not read as a grey panel behind the cards.
- Carousel product cards keep the clear glass treatment with one neutral white tint
  shared by every card. Their outer shadow must not spill into the gaps and create
  a grey band.
- This supersedes the earlier product-derived image wash, which made cards reflect
  different colors.

## Reference card control layout — 2026-09-19

- Product cards use the previous taller product image height inside the rounded
  glass shell.
- Existing color swatches align on the right side of the rating row.
- A compact Add to cart button sits below the swatches beside the existing price and
  adds one unit of the selected in-stock variant through the shared commerce service.
- The image must fill the pane cleanly without a white inset border, and the cart
  control remains compact rather than spanning the full purchase row.
- This supersedes the later add-to-cart removal decision for ProductCard instances.

## Storefront-wide minimal surface pass — 2026-09-19

- The finished ProductCard establishes the shared visual language: white canvas,
  clear neutral glass, soft borders, rounded corners, compact pill controls and
  quiet spacing.
- Product detail, cart, checkout, wishlist, account, confirmation and dialog
  surfaces must reuse that language without changing their current content,
  commerce behavior or service boundaries.
- Product detail keeps the image gallery visually quiet and places the buying
  column in a clear translucent glass panel. Gallery controls, color choices,
  size choices and quantity controls remain legible above the material.
- Cart rows, shipping notice and order summary use separate low-contrast glass
  surfaces. Coupon and primary actions use compact rounded controls.
- The Shop drawer and search dialog use the same translucent material, soft
  border and restrained shadow. Drawer navigation remains keyboard accessible.
- The Shop drawer opens from the left and the Bag drawer opens from the right.
  Both preserve the cursor position, allow normal pointer interaction, and close
  when the user clicks outside the open drawer.
- Both drawers are fixed floating windows with an even viewport gap and rounded
  corners on all four sides. Their content may scroll, but the window itself is
  not draggable.
- The Bag drawer keeps its content scrollable while hiding the browser scrollbar
  chrome inside the floating window.
- Empty states, account panels, checkout forms and confirmation details may use
  the same material so route transitions feel consistent. Text hierarchy and
  existing functionality remain unchanged.
- Responsive behavior must preserve readable controls and card spacing at the
  existing mobile-first reference widths.

This supersedes the older flat neutral treatment for non-card commerce surfaces;
the ProductCard layout and content remain the reference baseline.

Top-layer dialogs such as the bag drawer must host the same visible black custom
cursor layer as the page, including its interactive hover expansion. This
supersedes the temporary native-cursor fallback used while the cursor layer was
behind the dialog top layer.

## Dropdown and filter toolbar refinement — 2026-09-20

- The Shop trigger is a neutral navigation action and must not remain highlighted
  after a Shop drawer link navigates to a collection route.
- Collection sort, color and price controls use the shared styled dropdown rather
  than browser-native select popups. Each trigger shows a visible chevron, and
  the menu uses the storefront surface, option states, opening/closing motion,
  keyboard navigation and reduced-motion behavior.
- Active filter chips stay in the same compact count row beside the result count.
  They may scroll horizontally on narrow screens, but must not create a second
  toolbar row or push the Sort by control into an expanded filter section.

## Product detail control finish — 2026-09-20

- Quantity decrement/increment actions remain circular within the rounded
  quantity control and use a restrained sage hover/focus state without a
  rectangular hover block or vertical hover shift.
- The selected product gallery thumbnail uses the sage accent and pearl surface
  rather than a black selection border.

## Storefront visual QA remediation — 2026-09-20

- The mobile quick-navigation dock remains available on browsing surfaces, but
  is hidden on product detail, cart, wishlist, account, auth, information and
  confirmation/form routes so fixed navigation cannot cover page content or
  primary actions.
- Mobile product-card purchase controls stack the price and Quick add action in
  a readable single column. The action remains a compact card control on wide
  layouts and has a clear 44px mobile hit area.
- Product wishlist controls, color swatches, collection filter/sort controls and
  search-dialog actions use at least 44px hit areas. Small navigation and
  checkout guidance text uses the shared caption/label scale rather than
  unreadable 9–10px text.
- Dropdown menus use an opaque raised surface so underlying page text cannot
  bleed through the option list. Footer status labels use the foreground color
  for AA contrast.
- Shared product ratings expose their accessible name through an image role,
  color swatches rely on their individual button names, carousel tracks expose a
  valid region role, and closed styled selects do not reference an unavailable
  ARIA controls target.

## Form focus treatment refinement — 2026-09-20

- Text inputs, textareas, native selects and styled comboboxes must use a slim,
  restrained focus treatment rather than a thick green halo or multi-pixel
  stacked border effect.
- Mouse focus uses a neutral border and subtle two-pixel shadow. Keyboard focus
  remains clearly visible with a two-pixel blue outline and matching soft ring.
- Search, coupon, collection-search, checkbox and radio controls follow the same
  focus hierarchy without changing their existing field dimensions or behavior.

## Customer-facing copy polish — 2026-09-20

- Storefront customer-facing copy must read as a finished clothing retail
  experience and must not expose demo, preview, prototype, mock, simulated or
  test-environment language.
- Product, account, contact, checkout, order confirmation, policy and footer
  copy should use clear retail language with confident, useful next steps.
- Internal fixture names, mock providers and implementation-only identifiers may
  remain unchanged when they are not rendered in the storefront UI.
- This supersedes the earlier decision to expose “coming soon” social labels;
  social destinations now use neutral names and a brand-level invitation.
