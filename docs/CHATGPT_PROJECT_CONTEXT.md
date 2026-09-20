# Styleco — ChatGPT project context

> Copy this entire document into a new ChatGPT conversation when you want the
> assistant to understand the current Styleco project. This is a compact,
> copy-pasteable context pack built from the repository, its living requirements,
> architecture decisions, handoff notes, and a fresh validation run.

## 1. Role for the assistant receiving this context

You are continuing work on Styleco, a customer-facing clothing storefront demo.
Treat this document as project memory, but verify the actual files in the
workspace before making claims or edits. Code and the latest dated requirements
win over older summaries.

Work only on the user-requested increment. Do not advance AIDOS phases
automatically. The current approved scope includes the Storefront and a
frontend-demo Admin surface inside the same `apps/storefront` app. Do not
create a separate Admin application or subdomain. Verify the latest dated
requirements before changing scope.

Preserve existing user changes. The checkout may be dirty; do not run destructive
Git commands such as `git reset --hard`, `git checkout --`, or broad deletion.
Before changing code, inspect `git status`, the relevant current files, and the
latest sections of the living requirements. Keep the UI → services → repository
contracts → infrastructure boundary intact. Do not call Appwrite directly from
React components.

## 2. Project identity and current snapshot

- Project: Styleco
- Purpose: warm, editorial everyday-clothing storefront prototype for customer
  browsing and demo checkout
- Repository root in the current workspace: `D:\Others\VSCode\Styleco`
- Monorepo app: `apps/storefront`
- Snapshot date: 2026-09-20, Asia/Dhaka
- Git branch: `main`
- HEAD at snapshot: `e5eeca0` (`Prefix editorial assets for Pages`)
- Current AIDOS position: implementation and automated functional/browser QA for
  the interactive frontend demo are substantially complete; human visual review
  and iterative requirement refinement remain. This is not Design Freeze and is
  not a production release.

### Important working-tree warning

The snapshot is not a clean commit. Before adding this context file,
`git status --short` showed 81 entries: 75 modified/deleted tracked entries and
6 untracked entries. This context file is now an additional untracked entry.
The changes include storefront styling and interaction work, route and metadata
changes, E2E updates, asset migration/removal, and documentation edits. The
root `package-lock.json` is deleted; `pnpm-lock.yaml` is the canonical lockfile.
The untracked files include newer accessibility/interaction files such as:

- `apps/storefront/e2e/custom-cursor.spec.ts`
- `apps/storefront/src/app/global-error.tsx`
- `apps/storefront/src/app/icon.svg`
- `apps/storefront/src/components/catalog/recently-viewed.tsx`
- `apps/storefront/src/components/custom-cursor.tsx`
- `apps/storefront/src/components/ui/styled-select.tsx`

Do not assume HEAD alone represents the current product. Inspect the working tree
and preserve these changes.

## 3. Product and experience summary

Styleco is a storefront for considered everyday clothing: shirts, Katua, tees,
pants, and sleepwear. The intended experience is editorial but practical: warm
pearl surfaces, clear product imagery, restrained motion, compact controls,
strong mobile usability, and confidence-building checkout feedback.

The prototype deliberately uses local mock data and browser-local persistence.
It is designed to be reviewable without Appwrite, Docker, environment secrets,
external fonts, payment services, authentication, email, analytics, or a
production database.

Implemented customer journeys include:

- Browse the homepage category collage and editorial sections.
- Browse five data-driven collections, New Arrivals, Sale, and Search.
- Filter and sort listings by query, size, color, price ceiling, stock, sale, and
  sort order. Listing state is reflected in URL query parameters and survives
  browser history navigation.
- Open a product detail page, switch color imagery, choose size and quantity,
  inspect gallery/detail content, read the size guide, and see related/recently
  viewed products.
- Save products to a wishlist.
- Add a selected variant using Quick Add or the product page, then inspect the
  bag drawer or full cart.
- Apply the demo `STYLE10` coupon, choose standard or express delivery, complete
  the checkout form, simulate Cash on Delivery or card payment, and view an
  order confirmation.
- Visit account, login, register, contact, FAQ, shipping/returns, size guide,
  privacy, and terms surfaces. Account/auth/contact are visual/demo surfaces;
  they do not create accounts or send messages.
- Use responsive navigation, search suggestions, keyboard controls, touch
  carousels, focus states, reduced-motion behavior, loading states, 404, route
  error, and global error recovery.

## 4. Route map

Static and dynamic App Router routes currently include:

```text
/
/category/[slug]          five generated category routes
/products/[slug]          25 generated product routes
/new-arrivals
/sale
/search
/wishlist
/cart
/checkout
/order-confirmation
/account
/login
/register
/about
/contact
/faq
/shipping-returns
/size-guide
/privacy
/terms
/_not-found
```

The catch-all-looking `src/app/[page]/page.tsx` is intentionally constrained by
`generateStaticParams` and `dynamicParams = false`; it only renders the explicit
information pages listed above. Public collection and information pages have
useful descriptions. Private/demo-only surfaces are marked `noindex` where
required by the living requirements.

## 5. Technology and commands

- Node.js: 24 LTS, constrained by `>=24 <25`
- Package manager: pnpm `11.19.0`
- Framework: Next.js `16.3.5` App Router with React `19.3.0`
- Language: TypeScript `5.9.3`, strict mode, `noUncheckedIndexedAccess`
- Styling: Tailwind/PostCSS dependencies plus the project CSS layers in
  `src/app/globals.css`, `storefront.css`, and `reference.css`
- Forms/validation: React Hook Form and Zod
- Icons: lucide-react
- Unit tests: Vitest
- Browser tests: Playwright using installed Google Chrome
- Backend dependency present for future work: `node-appwrite`; it is not used by
  the mock runtime and the adapter remains a placeholder

From the repository root:

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm format:check
pnpm build
pnpm start
```

The local app runs at `http://localhost:3000`. Optional
`apps/storefront/.env.local` should keep `CATALOG_PROVIDER=mock`. The default
configuration works without an env file.

## 6. Fresh validation result for this snapshot

The following commands were run against the current working tree while writing
this context:

- `pnpm lint` — passed with zero warnings.
- `pnpm test` — passed: 2 Vitest files, 13 tests.
- `pnpm typecheck` — passed; Next route types generated successfully.
- `pnpm build` — passed; Next generated 51 static pages/routes successfully.
- `pnpm test:e2e --workers=1` — passed: 9 Playwright tests.

The browser suite covers desktop/mobile shopping flows, touch swatches,
reduced-motion behavior, drawer focus restoration, wishlist/bag counts, Quick
Add option requirements, keyboard search suggestions, custom cursor behavior,
all requested routes, and breakpoint/overflow checks. Automated browser checks
are not a substitute for exhaustive screen-reader, physical-device, or
cross-browser certification.

`pnpm format:check` is an available repository check; rerun it after any
documentation or source edits before declaring a change complete.

## 7. Architecture and dependency boundaries

The intended flow is:

```text
Next route/server component
  → shared UI/client component
  → application service
  → repository contract
  → mock or future infrastructure adapter
```

Important rules:

- Prefer Server Components. Use client components only for interaction/state.
- `src/services/container.ts` is server-only composition. It parses the
  environment and currently returns `CatalogService` and `HomepageService`
  backed by mock repositories.
- `src/domain/` contains backend-independent catalog, homepage, and commerce
  types.
- `src/repositories/` contains contracts only.
- `src/infrastructure/mock/` contains mock repositories and fixture data.
- `src/infrastructure/browser/` contains validated local/session storage.
- `src/services/` contains catalog querying, commerce calculations, checkout
  validation, homepage composition, and the lightweight client shopping store.
- UI components may use application services/hooks, but must not import or call
  Appwrite SDK APIs.
- There is no separate Admin app, production database, real production auth,
  real payment, email delivery, or authoritative server-side commerce validation
  yet. The approved Admin demo lives at `/admin`, uses browser mock persistence
  and `admin` / `admin`, and remains distinct from future Appwrite production
  authentication.

### Key files

```text
apps/storefront/src/app/                         routes, metadata, CSS entrypoints
apps/storefront/src/components/navigation.tsx    header, drawer, search, mobile nav
apps/storefront/src/components/catalog/          cards, listing, PDP, carousel, guide
apps/storefront/src/components/shopping/         bag, cart, checkout, confirmation
apps/storefront/src/components/ui/               dialog, styled select, shared states
apps/storefront/src/components/commerce-provider.tsx
                                                   client commerce context and bag drawer
apps/storefront/src/domain/                      backend-independent types
apps/storefront/src/services/container.ts        server composition root
apps/storefront/src/services/catalog-query.ts     filters, sorting, variant images, money
apps/storefront/src/services/mock-commerce.ts    stock, cart normalization, totals, coupon
apps/storefront/src/services/shopping-store.ts   shared client shopping state
apps/storefront/src/services/checkout-schema.ts  checkout validation and demo cards
apps/storefront/src/repositories/                catalog/homepage interfaces
apps/storefront/src/infrastructure/mock/         mock data and repository implementations
apps/storefront/src/infrastructure/browser/      localStorage/sessionStorage contracts
apps/storefront/public/images/                   local WebP/PNG imagery and credits
apps/storefront/e2e/                             Playwright journeys and QA coverage
```

## 8. Catalog and commerce data

The mock catalog in `src/infrastructure/mock/data.ts` contains:

- 5 categories: Shirt, Katua, T-Shirt, Pants, Sleepwear.
- 25 products: 5 products per category.
- 3 colorways per product.
- Sizes `S`, `M`, `L`, and `XL`.
- Integer minor-unit prices in BDT; use the `money()` service formatter rather
  than formatting amounts in UI components.
- Deterministic illustrative stock. Cart normalization never exceeds available
  stock, and unavailable variants remain unavailable.
- Sale products are represented by `originalPrice` above the current price.
- New products are flagged in the fixture data.
- Each product has description, material, fit, care, keywords, release date,
  rating, and review-count fixture content.
- Homepage `Latest Products` and `Top Sellers` each use 12 explicit ordered
  product references; `Current Sale` is derived from sale pricing.

Product imagery is local. `colorImages` maps a color name to its image set, so
the selected color remains visually consistent in product cards, the PDP, cart,
checkout, and confirmation. Some category/color fixture assets are shared by
multiple mock products; this is intentional demo media reuse, not a claim that
the final production catalog will share SKUs or imagery.

### Demo commerce rules

- Coupon: `STYLE10` gives 10% off merchandise.
- Standard shipping: BDT 80 (`8000` minor units) below a BDT 3,000 merchandise
  subtotal; free at or above that threshold.
- Express shipping: BDT 150 (`15000` minor units).
- Card `4242 4242 4242 4242` succeeds.
- Card `4000 0000 0000 0002` is accepted as the decline scenario.
- Other card values fail validation.
- Cash on Delivery simulates a successful order.
- Cart and wishlist use `localStorage` key `styleco-shopping-v1` with Zod
  decoding and a safe empty fallback.
- The latest order uses `sessionStorage` key `styleco-order-v1` with an in-memory
  fallback. It is not a server order.
- No money moves, card data is stored, email is sent, or real account is created.

## 9. Current design and UX rules

The current visual source of truth is the latest dated section of
`docs/COPILOT_LIVING_REQUIREMENTS.md`, supported by the latest ADRs in
`docs/COPILOT_ARCHITECTURE.md`. Broad current rules are:

- Warm pearl canvas: `#f4f0e8`.
- Near-pearl card surface: `#fffdf8`; raised surface `#ffffff`.
- Deep forest-sage primary surfaces: `#3f5b46` with darker hover/pressed states.
- Sage focus/interaction language; blue-teal focus accent is reserved for the
  visible keyboard focus hierarchy where the current CSS specifies it.
- Terracotta/orange is used selectively for sale/navigation utility accents, not
  as a general-purpose decorative color.
- Product cards share one continuous clear/neutral glass-inspired shell with
  contained image, metadata, badges, wishlist, color swatches, price, and a
  compact Quick Add control.
- Quick Add is a compact portal dialog. It requires an available color and size,
  does not create a hidden dialog for every card, preserves browsing position,
  and offers a direct View your bag action after success.
- Bag and Shop drawers are fixed rounded floating windows, left/right anchored
  respectively, outside-click closable, keyboard accessible, and scrollable
  without turning the window into a draggable panel.
- All dialogs animate entry and exit with native dialog semantics, focus
  restoration, scrollbar-gutter compensation, and reduced-motion fallbacks.
- Product image color changes use a directional or fade transition; reduced
  motion removes decorative movement.
- Product cards do not show low-stock urgency text. Out-of-stock behavior stays
  intact.
- Styled select controls and FAQ/product disclosures use the shared pearl/sage
  surface language, keyboard behavior, visible chevrons, and reduced-motion
  behavior.
- Mobile product purchase controls remain readable, with at least 44px hit areas
  for primary interactive controls. The mobile quick-navigation dock is hidden
  on PDP, cart, wishlist, account, auth, information, confirmation, and form
  routes so it cannot cover important content.
- Search suggestions expose combobox/listbox semantics, arrow-key selection,
  active option state, and a usable empty state.
- Forms use inline validation and error summaries where appropriate. Focus
  treatment must remain slim but clearly visible for keyboard users.
- Public pages should read like finished retail copy. Do not render words such
  as demo, mock, preview, prototype, simulated, or test environment in the
  customer-facing UI. Internal fixture/provider names may remain in code.

### Responsive expectations

- Category listings: 4 columns desktop, 3 tablet, 2 mobile.
- Homepage product rails: 4 visible cards on wide desktop, 3 on tablet, and a
  horizontal touch carousel on mobile.
- Homepage category collage is the first visible content; the visible hero/value
  proposition was intentionally removed, while the semantic page heading stays
  available to assistive technology.
- PDP desktop gallery fits below site chrome without requiring initial scrolling;
  mobile keeps full-photo visibility with responsive sizing.
- Checkout and cart stack below the current tablet breakpoint and must stay usable
  at narrow mobile widths.
- Test/review at the existing widths around 360, 390, 430, 768, 1024, 1440,
  and 1920 pixels when a visual change affects layout.

## 10. Static deployment

GitHub Actions deploys a static Next export from `main` to GitHub Pages:

```text
https://raiyan437.github.io/Styleco-Cloth-Brand/
```

The workflow is `.github/workflows/deploy-pages.yml`. GitHub Actions sets
`NEXT_PUBLIC_BASE_PATH` from the repository name, enables `output: "export"`,
uses `trailingSlash`, and makes Next images unoptimized for Pages. Local runs
remain at `/` without a base path. The build must stay backend-free and generate
all mock catalog/info routes at build time.

## 11. What is intentionally not finished

- Design Freeze has not happened.
- The current imagery is generated/local demo photography. Replace or curate it
  later as production media becomes available.
- Pricing, stock, delivery, coupons, ratings, reviews, and policies are
  illustrative.
- Server-side commerce authority, Appwrite catalog adapter, database, accounts,
  authentication, payment processing, order persistence, email, analytics,
  tracking, and production admin tooling are not implemented. The frontend-demo
  Admin increment is now approved and is being implemented inside the same app.
- Login/register/account/contact are presentation surfaces.
- Legal, return, shipping, social, and campaign copy needs production review.
- Automated Chrome/mobile-emulation QA is strong for this increment, but it is
  not full physical-device, screen-reader, or cross-browser certification.

## 12. Recommended next action

The next approved action is human visual review of the complete frontend demo:
review product imagery, campaign copy, spacing, content priority, desktop/mobile
purchase flow, and any remaining visual/accessibility issues. If that review
changes scope, update `docs/COPILOT_LIVING_REQUIREMENTS.md`, record superseded
decisions in `docs/COPILOT_ARCHITECTURE.md`, update the plan and handoff, then
implement only the requested increment.

Do not jump to Appwrite, production auth, payments, or deployment migration.
Admin frontend-demo work is explicitly approved, but must remain mock/browser
persisted until the Appwrite production increment is separately authorized.

## 13. Documentation/source-of-truth map

- `AGENTS.md` — repository working agreement and AIDOS guardrails.
- `apps/storefront/AGENTS.md` — local Next.js agent rules.
- `README.md` — setup, demo flow, layout, and deployment overview.
- `docs/COPILOT_LIVING_REQUIREMENTS.md` — living requirements; latest dated
  sections are authoritative over older requirements.
- `docs/COPILOT_ARCHITECTURE.md` — ADRs, boundaries, and superseded decisions.
- `docs/COPILOT_IMPLEMENTATION_PLAN.md` — increment and phase status.
- `docs/COPILOT_HANDOFF.md` — detailed handoff, validation, limitations, and
  historical pass notes.
- `docs/COPILOT_PROJECT_BRIEF.md` — original product/design framing.
- `docs/design/` — discovery and D1–D4 design artifacts.
- `git.md` — repository-specific Git/recovery guidance.
- `docs/CHATGPT_PROJECT_CONTEXT.md` — this copy-paste context pack.

When these documents disagree, prefer the actual source code for implemented
behavior, then the newest dated living requirement/ADR, then the handoff and
older historical notes. Update the documentation when a user-approved change
alters the project state.
