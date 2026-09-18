# Lessons

- Phase 0 began in an empty directory, not an existing Git checkout.
- Keep category names in fixtures behind repository contracts so UI can migrate to backend data.
- Merchandising labels do not imply algorithms: explicit positions preserve curated order.
- Avoid remote fonts/assets in the shell so local builds do not require asset services.
- Record checks honestly; a scaffold alone does not complete Phase 0.
- pnpm 11 requires an explicit decision on dependency build scripts; disabling the
  optional resolver script works with the provided platform binary and lint passes.
- ESLint's zero-warning check caught the anonymous PostCSS export; a named config
  resolved it without weakening lint rules.
- A 1680px centered canvas preserves editorial whitespace at 1920px without making
  copy and cards stretch indefinitely.
- Bundled OFL font packages give the intended typography while preserving offline
  runtime and avoiding font-provider requests during builds.
- Match combined size/color/stock filters against the same variant; independent
  product-level matches can advertise an unavailable combination.
- Browser captures must wait for hydration and below-fold image decoding. A full
  page screenshot alone neither loads lazy imagery nor proves interaction readiness.
- Keep integer money/stock calculations and browser persistence outside components;
  local demo totals remain deterministic and can later be replaced server-side.
- Keep optional color-specific imagery behind the Product contract; a card can fall
  back to its primary/secondary images while real SKU photography is still pending.
- For an editorial featured carousel, rotating the existing keyed links keeps the
  native scroll and destination semantics intact while allowing the active card to
  become first without adding duplicate content or an animation dependency.
- Keep short category card copy in the category data contract so merchandising can
  change labels without editing the homepage component; provide a readable fallback
  for categories introduced before their editorial copy is configured.
- Carousel content kind and row count are independent: a one-row product carousel
  must still size product cards explicitly instead of inheriting a category track.
- Keep compact color hit areas distinct. Overlapping invisible targets make a row
  look accessible while causing taps to activate the neighboring color.
- A keyed FLIP transition can animate a reordered featured carousel without cloning
  cards or adding an animation package: capture old rectangles before state changes,
  then animate each keyed element into its new position and scale.
- For a looping featured carousel, repeated virtual copies around a middle anchor
  avoid data reorders and per-click scroll resets. Re-center an equivalent copy only
  at an edge while preserving its viewport position.
- Native scroll snapping can quantize scripted intermediate frames and look like a
  flicker. Temporarily disable snap while requestAnimationFrame drives scroll and
  card-size interpolation, then restore it for normal touch/trackpad use.
- Animate the incoming card's flex-basis alongside the outgoing card's shrink so it
  grows into the featured slot during the same motion rather than resizing after
  arrival.
- Keep image-level feedback separate from layout-state classes. Replaying an image
  fade whenever a category becomes featured makes an otherwise stable asset flash.
- For a local catalog fixture, one product-only asset per category/color keeps
  the repository lightweight while preserving three real variant records and
  swatch-driven image resolution. Keep that sharing behind `Product.colorImages`
  so production can replace it with SKU-specific Appwrite Storage media.
