# D4 — Initial design system

Status: complete, 2026-09-15. Selected direction: Editorial Pop. These tokens cover
the next storefront increment only; extend them when a demonstrated component need
exists. Canonical code values live in `src/app/globals.css`.

Updated 2026-09-16 for the requested storefront UI refinement; still not Design Freeze.

## Color

| Semantic token     | HEX       | Use                                                       |
| ------------------ | --------- | --------------------------------------------------------- |
| Background         | `#FCFBF8` | Main editorial canvas                                     |
| Foreground         | `#111111` | Primary text and dark controls                            |
| Surface            | `#FFFFFF` | Cards/overlays requiring separation                       |
| Muted surface      | `#F1EFEA` | Skeletons, quiet image backgrounds                        |
| Muted text         | `#625F59` | Supporting text; normal-sized text only                   |
| Border             | `#D8D4CC` | Rules and component boundaries                            |
| Primary            | `#111111` | Primary actions                                           |
| Primary foreground | `#FFFFFF` | Text/icons on primary                                     |
| Accent orange      | `#FF5A1F` | Warm campaign highlight                                   |
| Accent blue        | `#2457F5` | Cool campaign highlight and focus ring                    |
| Campaign lime      | `#D7F542` | Optional short-lived campaign surface; black content only |
| Destructive        | `#B42318` | Errors/destructive actions                                |
| Success            | `#157347` | Success and available state                               |

Accent surfaces pair with black only after contrast verification. Accent orange is
decorative or large-area emphasis; it is not default small text on white. Sale price
may use destructive; original price remains muted with a semantic deletion mark.

## Typography

Both families are SIL Open Font License fonts bundled locally from npm, so builds do
not call a font CDN.

- **Display:** Archivo Variable, 600–800, tight tracking. Use for hero and section
  headings; it supplies the strong editorial grotesk voice.
- **Body/UI:** DM Sans Variable, 400–700. Use for navigation, descriptions, prices,
  labels, and controls.

| Role                    | Token / scale                                 | Line height |
| ----------------------- | --------------------------------------------- | ----------- |
| Page heading            | `--type-page`: fluid 36–60px                  | 1.1         |
| Section heading         | `--type-section`: fluid 28–44px               | 1.12        |
| Body and form input     | `--type-body`: 16px                           | 1.6–1.75    |
| Product name/price      | `--type-product`: 15px; 14px in compact grids | 1.45–1.5    |
| Navigation and small UI | `--type-small`: 14px                          | 1.4–1.6     |
| Supporting caption      | `--type-caption`: 12px                        | 1.5–1.7     |
| Short uppercase label   | `--type-label`: 11px, 0.12em tracking         | 1.5         |

Campaign display typography remains intentionally larger. Body copy never uses the
small uppercase-label scale; mobile text inputs stay 16px.

Avoid all-caps paragraphs and excessive tight tracking. Product names remain body
size; price hierarchy comes from weight and color, not oversized type.

## Spacing and layout

Use a 4px base scale: `1` 4, `2` 8, `3` 12, `4` 16, `5` 20, `6` 24, `8` 32,
`10` 40, `12` 48, `16` 64, `20` 80, `24` 96, `32` 128px. Prefer these existing
Tailwind steps; do not add aliases without component evidence.

- Max content width: `1680px`.
- Page gutters: `20px` at 360–430; `32px` at 768; `48px` at 1024–1440;
  `64px` at 1920.
- Section rhythm: `--space-section`, fluid `48–80px`, replacing the initial 72–144px
  shell scale. Related heading and carousel content use 24px separation.
- Hero may be full bleed, but copy aligns to the site container. Product text measure
  should stay under 70 characters; hero supporting text under roughly 42 characters.

The code provides `site-container`, `section-space`, `text-display-xl`,
`text-display-lg`, `text-heading-section`, and `text-eyebrow` foundations.

## Radius and shadow

- Radius: `0` for campaign frames; `4px` for buttons and small controls;
  `10px` for category/product image frames; full circles only for icon buttons and
  swatches.
- Shadows: none by default. Use a single restrained overlay shadow
  (`0 12px 32px rgb(17 17 17 / 12%)`) only for menus/drawers floating above content.

## Product imagery

Use 4:5 containers, `object-fit: cover`, stable intrinsic dimensions, and a muted
surface while loading. Keep garment scale and focal height consistent within a row.
The optional secondary image cross-fades on fine-pointer hover/focus only; disable
the transition for reduced motion. Touch always receives a complete primary image.

## Buttons

- **Primary:** black fill, white label, 4px corners; orange or blue only for a
  specific campaign. Hover lightens black subtly; focus uses the blue ring; disabled
  uses muted surface/text and removes pointer affordance.
- **Secondary:** transparent or white surface, 1px foreground border. Hover fills
  muted surface; same focus and disabled rules.
- **Text/link CTA:** label plus optional directional icon, underline or rule revealed
  without moving layout. Never rely on color alone.
- **Icon:** at least 44×44px, circular or 4px radius, visible accessible name. Hover
  uses muted surface; disabled state is both visual and semantic.

Minimum text-button height is 48px. Hover is an enhancement; default, focus, and
active states communicate the action on touch and keyboard.

## Carousels

- Gap: 16px mobile, 20px tablet, 24px desktop.
- Native horizontal scrolling, `scroll-snap-type: x mandatory`, card-aligned snap,
  `overscroll-behavior-inline: contain`, and no autoplay.
- Previous/next icon buttons are 48×48px, placed near the section heading on desktop,
  hidden only when direct swipe is the primary mobile control. Disable at true ends
  for finite product tracks; Categories wraps its data order so controls stay active.
- Keep 16–24% of the next category card or roughly 20–30% of the next product card
  visible on mobile. Desktop shows a clipped next edge or a deliberate unequal-card
  rhythm. Do not add fades that reduce image/name legibility.
- Categories uses a native horizontal track with a slightly wider featured first card;
  previous/next rotates the ordered items and wraps continuously. Pointer and touch
  scrolling remain native, with no autoplay.
- Product carousels use two rows with horizontal column flow; row reading order and
  DOM focus order must be verified during implementation.

## Product cards

1. 4:5 image area: NEW/sale badges top-left, wishlist button top-right, stock overlay
   or persistent text near the image edge.
2. Product name below, one or two lines maximum.
3. Current price, then struck original price when discounted.
4. Available color swatches or `+N` summary; swatches have accessible names.

Cards remain mostly white/transparent with no default shadow. The main product link
and wishlist button are separate interactive targets. A visible out-of-stock state
must preserve the product link and avoid image opacity that destroys recognition.

Color swatches are adjacent 24×32px buttons (28×44px with coarse pointers), with no
gap or overlapping hit areas. Their 14px dots grow to roughly 18px on selection.
PDP targets are 36×44px with 24px dots that enlarge on selection. This replaces the
previous 28px/44px-effective-target specification. The selected swatch has no extra border;
disabled colors are visibly unavailable. Selecting a swatch updates the active
variant and uses its optional color-keyed image set when available. A short image and
dot transition provides feedback, with reduced motion disabling nonessential motion.
Swatches must remain useful on touch and keyboard; color is never the only indicator
of availability.

## Category cards

Use 4:5 editorial media with varied desktop widths. Category name is a bold heading
below the image or on a solid protected label, never raw text over an unpredictable
photo. Apply the restrained small card radius (`10px`) to category and product image
frames; do not turn the card into an elevated solid rectangle. Optional eyebrow
supports campaign context; no product price/badge language.
Whole-card linking is allowed if controls are not nested. The next-card peek is part
of the category hierarchy, not a decorative crop.

## Accessibility baseline

Aim for WCAG 2.2 AA contrast. Use semantic links for destinations and buttons for
actions; retain visible 3px blue keyboard focus with offset. Utility buttons are
at least 44×44px; compact color targets use the dimensions above. Carousel buttons and drawer work from keyboard with useful names and
state. Provide image alt text, preserve content at 200% zoom, and avoid hover-only
information. Under `prefers-reduced-motion: reduce`, remove nonessential smooth
scrolling, image fades, and animated skeletons.

## Motion

`--motion-fast: 160ms`, `--motion-normal: 280ms`, and
`--ease-out: cubic-bezier(.2,.7,.2,1)` cover feedback. Use small arrow movements,
button press scale, wishlist feedback, color-dot scaling/image fades, accordion
indicators and short dialog/drawer entrance transitions. Product hover imagery is
limited to the image link so a swatch click cannot accidentally reveal its hover
image. No autoplay, scroll-triggered hidden content or animation dependency.
Reduced motion removes all CSS animation and transitions. Opening/closing controls
and restoring focus never wait for animation completion.
