# Styleco

Customer storefront frontend demo, developed incrementally with AIDOS. The working
prototype is ready for design iteration; production services are not connected.

## Local setup

Install Node.js 24 LTS and pnpm 11.19.0, then from the repository root:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open http://localhost:3000. No Appwrite, Docker, environment file, external fonts,
or hosted service is required. Optionally copy `apps/storefront/.env.example` to
`apps/storefront/.env.local`. Keep `CATALOG_PROVIDER=mock`.

```sh
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm format:check
pnpm build
pnpm start
```

`pnpm start` serves a prior production build. Stop either server with Ctrl+C.
The package manager and lockfile pin the dependency resolution.

Browser tests use a local Google Chrome installation and start/reuse port 3000.
Screenshots and failure traces are written to `apps/storefront/test-results/`.

## Try the demo

Browse a category, filter/sort, open a product, choose an available color/size,
and add it to your wishlist or bag. Bag quantities respect mock stock. Apply
`STYLE10` for 10% off merchandise, then continue to checkout with example details.
Cash on Delivery simulates an order. Demo Card `4242 4242 4242 4242` succeeds;
`4000 0000 0000 0002` declines. No transaction occurs.

Bag and wishlist persist in this browser; the latest confirmation lasts for the
tab session. Login/register, contact, shipping promises, reviews and
legal copy are explicit demo surfaces. No account, email or real order is created.

The 25 products use six original generated local photographs, with category-level
image reuse, detail crops and illustrative color derivatives. See
[asset credits](apps/storefront/public/images/ASSET_CREDITS.md).

## Layout

```text
apps/storefront/
  src/app/                 Storefront routes, tokens and responsive styles
  src/components/          Navigation, catalog, shopping and information UI
  src/domain/              Backend-independent types
  src/repositories/        Data contracts
  src/services/            Application logic and server composition
  src/infrastructure/      Mock catalog, browser storage and Appwrite placeholder
  src/config/              Environment validation
  public/images/           Local generated photography and credits
  e2e/                     Desktop/mobile shopping and route checks
docs/                      AIDOS requirements, decisions, plan, handoff
```

Workspace globs support `packages/*` and future applications. No shared package
or Admin application is needed yet. Start with [the handoff](docs/COPILOT_HANDOFF.md).
For cloning, branching, validation, pushing and local Git recovery, see
[git.md](git.md).
