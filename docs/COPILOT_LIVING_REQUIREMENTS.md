# Living requirements

## Campaign banner sale CTA — 2026-09-18

The homepage campaign banner is titled “Explore Current Sale”. Its existing
Explore Now CTA routes to `/sale`, so the campaign entry point opens the sale
listing directly. The supporting copy and campaign imagery remain unchanged.

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

This remains the local frontend demo increment. No backend, Admin, deployment,
newsletter or external service integration is authorized.

## Active scope — Frontend Demo / Interactive Prototype

The new user brief supersedes the earlier homepage-only increment and D1–D4
non-goals for frontend implementation. Workflow now: REQUIREMENTS → COMPLETE
FRONTEND DEMO → HUMAN VISUAL REVIEW → ITERATIVE CHANGES → DESIGN FREEZE LATER →
BACKEND IMPLEMENTATION LATER. Earlier phase records remain historical.

Build the complete local customer journey: editorial homepage, five category
listings, New Arrivals, Sale, search, PDP/gallery/variants/size guide, persistent
wishlist/cart, mock coupon, validated checkout, demo order confirmation, account
surfaces, supporting pages and branded 404. No Admin, backend, database, production
auth/payment/tracking, or deployment. Use `/category/[slug]` consistently.

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

## Storefront scope

- Only Storefront; no Admin build or planning.
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
- Workspace supports `apps/storefront`, later `apps/admin`, and packages only when reuse justifies them.
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
- No full homepage, auth, cart, checkout, database creation, tracking, deployment, or Admin.

## Open inputs for later increments

D5–D9 artifact definitions; approved photography/assets; currency/locale and detailed
variant rules; campaign content; hero content schema; signed-out wishlist behavior;
final URL design. Do not guess business policies from mock fixtures.
