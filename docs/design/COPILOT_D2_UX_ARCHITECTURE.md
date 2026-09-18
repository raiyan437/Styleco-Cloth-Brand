# D2 — UX architecture

Status: complete, 2026-09-15.

## Global navigation

The announcement bar sits above a global header. Navigation contains New Arrivals,
Shirt, Katua, T-Shirt, Pant, Sleepwear, and Sale. Utilities are Search, Wishlist,
Account, and Bag. Categories are populated from catalog data; New Arrivals and Sale
are merchandising destinations. No gender navigation.

- **≥1280px:** expose all shopping links in one row. Keep logo left; navigation near
  center; four labeled or clearly labelled icon utilities right.
- **1024–1279px:** show New Arrivals, a Shop menu containing all five categories, and
  Sale. Keep Search, Wishlist, Account, and Bag available without crowding.
- **768–1023px:** use the mobile/tablet header: menu trigger, logo, Search, and Bag.
  Drawer contains all shopping links plus Wishlist and Account.
- **360–767px:** compact header with menu, logo, and Bag; Search may remain an icon
  when space allows or lead the drawer. Use a modal navigation drawer with focus
  containment, close control, Escape support, and return focus.

The announcement bar may wrap to two short lines on mobile. It must never become a
marquee. Sticky header behavior is a later prototype decision.

## Homepage hierarchy

1. Announcement Bar
2. Header / Navigation
3. Categories — renamed from Best of the Week; category carousel
4. Latest Products — manually curated, two-row carousel
5. Top Sellers — manually curated, two-row carousel
6. Additional editorial/campaign content — content and structure unresolved
7. Footer

The previously documented homepage hero is retained only as structured future
campaign content; it is removed from the current rendered homepage so the catalog
discovery module leads the page.

## Primary journeys

- **A:** Homepage → Categories category card → Category page.
- **B:** Homepage → Latest Products product card → Product Detail.
- **C:** Homepage → Top Sellers product card → Product Detail.
- **D:** Facebook/Instagram ad → public Product or Campaign page → future product
  selection, Bag, and checkout flow. Public URLs, page metadata, and UTM parameters
  must survive later routing work; this phase adds no tracking.

The hero CTA should go to the featured category, collection, product, or campaign
specified by its future content record. Avoid dead or ambiguous “Explore” actions.

## Interaction architecture

### Carousels

Use native horizontal scrolling with CSS snap as the baseline. Touch swipe and
mouse/trackpad work directly; desktop previous/next buttons advance by a meaningful
group without autoplay. Buttons use semantic names, keyboard operation, and do not
trap focus. Product controls disable at true ends; Categories keeps its controls
active and rotates the ordered cards so the selected category becomes the slightly
larger first card, wrapping continuously. Partial next cards communicate overflow.
Visible scrollbars may be visually reduced but a usable scrolling path remains.

The two product sections share one carousel implementation configured as a two-row
grid with horizontal column flow. Categories uses the same control conventions but a
one-row, editorial-width category layout.

### Cards and controls

- A category card is one clear link with a readable category name independent of
  image contrast. It leads to that category's stable public destination.
- Product image/name area links to Product Detail. Current price is prominent;
  original price, badges, swatches, and stock are present only when applicable.
- Wishlist is a separate labelled button and must not trigger product navigation.
  Mobile shows all essential information without requiring hover.
- Secondary product imagery swaps on pointer hover only as enhancement. Keyboard,
  touch, and reduced-motion users retain the primary image and the full destination.
- CTA buttons/links state their destination or action. Focus styles remain visible
  across photography and colored surfaces.

## Loading, empty, and error states

- **Loading:** reserve media aspect ratios and use restrained neutral skeletons;
  avoid layout shift and pulsing when reduced motion is requested.
- **Empty:** an optional curated section with no valid products is omitted. Empty
  Categories shows a short catalog-unavailable message only if the category route is
  otherwise usable. Do not show a dead carousel shell.
- **Error:** preserve header, footer, and other independent sections. Replace only
  the affected section with concise recovery copy and optional retry where useful;
  log diagnostic context server-side later. Product/category destination errors use
  appropriate not-found behavior.

## Responsive composition

| Width           | Header                                | Categories                                                | Product carousels/cards                                    |
| --------------- | ------------------------------------- | --------------------------------------------------------- | ---------------------------------------------------------- |
| 360 / 390 / 430 | Compact header + drawer               | One large card at ~78–84vw plus next-card peek            | Two rows; ~68–74vw card width; persistent name/price/state |
| 768             | Tablet header + drawer                | ~1.8 cards visible                                        | Two rows; ~2.4 cards visible                               |
| 1024            | New + Shop + Sale compact nav         | ~2.4 cards visible                                        | Two rows; ~3.2 cards visible                               |
| 1440            | Full navigation                       | Featured first card, then medium cards; next edge visible | Two rows; ~4.2 cards visible                               |
| 1920            | Full navigation in centered max width | ~4 cards within max canvas, intentional crop rhythm       | Two rows; ~5 cards within max canvas                       |

At every width, keep touch targets at least 44×44px, prevent copy from overlaying an
uncontrolled image region, and preserve horizontal peeks without page-level overflow.
