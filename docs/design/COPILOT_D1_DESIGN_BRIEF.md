# D1 — Design brief

Status: complete, 2026-09-15. Current homepage review refinement removes the
rendered hero so category discovery leads the experience; the hero remains a future
campaign-content option.

## Purpose and audience

Styleco is a modern clothing storefront that helps shoppers discover a distinctive
edit and move confidently into categories and product details. Initial audience
assumption: mobile-heavy, style-aware shoppers arriving organically or from social
ads who value strong imagery, clear pricing, and quick paths to products.

## Brand and visual direction

Modern, editorial, fashionable, youthful, clean, confident, premium but accessible,
and visually distinctive. The primary reference is the
[Clothing Fashion Landing Page](https://dribbble.com/shots/22073549-Clothing-Fashion-Landing-Page),
used for broad language only: bold type, generous white space, asymmetric fashion
imagery, and energetic color. Styleco must feel authored rather than templated.

## Homepage objectives

- Establish the brand through the header, category imagery and curated product paths.
- Make Categories the main category discovery device.
- Present Latest Products and Top Sellers as explicit merchandising collections.
- Keep product photography dominant while making destination, price, state, and
  wishlist actions easy to understand.
- Support later campaign and product content from Admin without designing Admin now.

## Mobile, conversion, and accessibility

Compose first for 360–430px social traffic: direct hierarchy, useful carousel peeks,
comfortable touch controls, and no hover dependency. Conversion depends on obvious
links, concise copy, visible prices and availability, and continuity into future cart
and checkout. Target WCAG 2.2 AA fundamentals: semantic controls, keyboard access,
visible focus, sufficient contrast, reduced-motion respect, and meaningful media text.

## Constraints

Fixed homepage order; no gender sections; data-driven categories; local-first assets;
future Appwrite Storage; existing service/repository boundary; no autoplay; Next.js
Server Components by default; responsive references at 360, 390, 430, 768, 1024,
1440, and 1920px.

## Non-goals

Full homepage implementation, finalized campaign content, Admin, backend connection,
authentication, search behavior, wishlist persistence, cart/checkout, product detail,
marketing integrations, and Design Freeze.
