"use client";
import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const CATEGORY_TRANSITION_MS = 420;
const CATEGORY_COPY_COUNT = 3;
const CATEGORY_MIDDLE_COPY = 1;

export function HorizontalCarousel({
  title,
  eyebrow,
  children,
  kind = "product",
  twoRows = false,
  infiniteFeatured = false,
  className = "",
  headerAction,
}: {
  title: string;
  eyebrow?: string;
  children: ReactNode;
  kind?: "category" | "product";
  twoRows?: boolean;
  infiniteFeatured?: boolean;
  className?: string;
  headerAction?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  const [ends, setEnds] = useState({ start: true, end: false });
  const [position, setPosition] = useState({ current: 0, total: 1 });
  const [activeIndex, setActiveIndex] = useState(0);
  const [categoryTransition, setCategoryTransition] = useState<{
    direction: -1 | 1;
    targetIndex: number;
  } | null>(null);
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollFrame = useRef<number | null>(null);
  const transitionFrame = useRef<number | null>(null);
  const categoryInitialized = useRef(false);
  const items = Children.toArray(children);
  const safeActiveIndex = items.length > 0 ? activeIndex % items.length : 0;

  useEffect(() => {
    const track = ref.current;
    if (!track) return;
    if (infiniteFeatured) return;
    const update = () => {
      const step = Math.max(1, track.clientWidth * 0.85);
      const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
      const total = Math.max(1, Math.ceil(maxScroll / step) + 1);
      setEnds({
        start: track.scrollLeft < 3,
        end: track.scrollLeft >= maxScroll - 3,
      });
      setPosition({
        current: Math.min(
          total - 1,
          Math.max(0, Math.round(track.scrollLeft / step)),
        ),
        total,
      });
    };
    update();
    track.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(track);
    return () => {
      track.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [infiniteFeatured]);

  useLayoutEffect(() => {
    if (!infiniteFeatured || categoryInitialized.current || !ref.current) {
      return;
    }
    if (items.length <= 1) {
      categoryInitialized.current = true;
      return;
    }
    const middleIndex = items.length * CATEGORY_MIDDLE_COPY;
    const middleCard = ref.current.children[middleIndex] as
      HTMLElement | undefined;
    if (!middleCard) return;
    const trackRect = ref.current.getBoundingClientRect();
    ref.current.scrollLeft = Math.max(
      0,
      middleCard.getBoundingClientRect().left - trackRect.left,
    );
    categoryInitialized.current = true;
    setActiveIndex(middleIndex);
  }, [infiniteFeatured, items.length]);

  useLayoutEffect(() => {
    if (!infiniteFeatured || !categoryTransition || !ref.current) return;
    const track = ref.current;
    const reducedMotion = matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const previousSnapType = track.style.scrollSnapType;
    const current = track.children[activeIndex] as HTMLElement | undefined;
    const incoming = track.children[categoryTransition.targetIndex] as
      HTMLElement | undefined;
    if (!current || !incoming) return;

    const trackRect = track.getBoundingClientRect();
    const incomingRect = incoming.getBoundingClientRect();
    const targetBeforeResize =
      track.scrollLeft + incomingRect.left - trackRect.left;
    const featured = current;
    const normal = Array.from(track.children).find(
      (element) =>
        element !== incoming &&
        !(element as HTMLElement).classList.contains("category-featured") &&
        !(element as HTMLElement).classList.contains("category-incoming"),
    ) as HTMLElement | undefined;
    const normalWidth = normal?.getBoundingClientRect().width;
    const featuredWidth = featured?.getBoundingClientRect().width;
    const outgoingShrink =
      normalWidth && featuredWidth ? featuredWidth - normalWidth : 0;
    const targetScroll = Math.max(
      0,
      targetBeforeResize -
        (categoryTransition.direction > 0 ? outgoingShrink : 0),
    );
    const incomingAnimation = reducedMotion
      ? null
      : incoming?.animate(
          [
            {
              opacity: 0.78,
              transform: "scale(0.96)",
              ...(normalWidth ? { flexBasis: `${normalWidth}px` } : {}),
            },
            {
              opacity: 1,
              transform: "scale(1)",
              ...(featuredWidth ? { flexBasis: `${featuredWidth}px` } : {}),
            },
          ],
          {
            duration: CATEGORY_TRANSITION_MS,
            easing: "cubic-bezier(.2,.7,.2,1)",
            fill: "both",
          },
        );
    const outgoingAnimation = reducedMotion
      ? null
      : normalWidth
        ? current.animate(
            [
              { flexBasis: `${featuredWidth ?? normalWidth}px` },
              { flexBasis: `${normalWidth}px` },
            ],
            {
              duration: CATEGORY_TRANSITION_MS,
              easing: "cubic-bezier(.2,.7,.2,1)",
              fill: "both",
            },
          )
        : null;
    const complete = () => {
      if (scrollFrame.current !== null) {
        cancelAnimationFrame(scrollFrame.current);
        scrollFrame.current = null;
      }
      if (transitionFrame.current !== null) {
        cancelAnimationFrame(transitionFrame.current);
        transitionFrame.current = null;
      }
      // Keep the scroll position on the incoming card. If the virtual copies
      // reach an edge, jump to the equivalent middle copy while its content is
      // identical, so the loop can continue without a visible reset.
      let settledIndex = categoryTransition.targetIndex;
      const incomingScreenLeft = incoming.getBoundingClientRect().left;
      const firstMiddleIndex = items.length * CATEGORY_MIDDLE_COPY;
      const lastMiddleIndex = firstMiddleIndex + items.length - 1;
      if (!reducedMotion && settledIndex < firstMiddleIndex) {
        settledIndex += items.length;
      }
      if (!reducedMotion && settledIndex > lastMiddleIndex) {
        settledIndex -= items.length;
      }
      if (!reducedMotion && settledIndex !== categoryTransition.targetIndex) {
        const equivalent = track.children[settledIndex] as
          HTMLElement | undefined;
        if (equivalent) {
          track.scrollLeft +=
            equivalent.getBoundingClientRect().left -
            incoming.getBoundingClientRect().left;
        }
      }
      setActiveIndex(settledIndex);
      setCategoryTransition(null);
      transitionTimer.current = null;
      // The old featured card shrinks as the incoming card becomes featured.
      // Compensate before the next paint so that the incoming card remains
      // locked to the first slot instead of producing a one-frame jump.
      transitionFrame.current = requestAnimationFrame(() => {
        const settled = track.children[settledIndex] as HTMLElement | undefined;
        if (settled) {
          track.scrollLeft +=
            settled.getBoundingClientRect().left - incomingScreenLeft;
        }
        transitionFrame.current = null;
      });
      track.style.scrollSnapType = previousSnapType;
    };

    if (reducedMotion) {
      track.scrollLeft = targetScroll;
      complete();
      return;
    }

    // Snap points are useful for touch scrolling, but they would quantize
    // each intermediate frame of the scripted category transition. Temporarily
    // disable snapping so the motion remains continuous.
    track.style.scrollSnapType = "none";
    const startScroll = track.scrollLeft;
    const startTime = performance.now();
    const animateScroll = (now: number) => {
      const progress = Math.min(1, (now - startTime) / CATEGORY_TRANSITION_MS);
      const eased = 1 - Math.pow(1 - progress, 3);
      track.scrollLeft = startScroll + (targetScroll - startScroll) * eased;
      if (progress < 1) {
        scrollFrame.current = requestAnimationFrame(animateScroll);
      } else {
        scrollFrame.current = null;
      }
    };
    scrollFrame.current = requestAnimationFrame(animateScroll);
    transitionTimer.current = setTimeout(complete, CATEGORY_TRANSITION_MS);
    return () => {
      if (transitionTimer.current) {
        clearTimeout(transitionTimer.current);
        transitionTimer.current = null;
      }
      if (transitionFrame.current !== null) {
        cancelAnimationFrame(transitionFrame.current);
        transitionFrame.current = null;
      }
      if (scrollFrame.current !== null) {
        cancelAnimationFrame(scrollFrame.current);
        scrollFrame.current = null;
      }
      track.style.scrollSnapType = previousSnapType;
      incomingAnimation?.cancel();
      outgoingAnimation?.cancel();
    };
  }, [activeIndex, categoryTransition, infiniteFeatured, items.length]);

  useEffect(
    () => () => {
      if (transitionTimer.current) clearTimeout(transitionTimer.current);
      if (transitionFrame.current !== null) {
        cancelAnimationFrame(transitionFrame.current);
      }
      if (scrollFrame.current !== null) {
        cancelAnimationFrame(scrollFrame.current);
      }
    },
    [],
  );

  function scroll(direction: number) {
    const track = ref.current;
    if (!track) return;
    if (infiniteFeatured && !categoryInitialized.current) return;
    if (infiniteFeatured && items.length > 1) {
      if (categoryTransition) return;
      const normalizedDirection = direction < 0 ? -1 : 1;
      let currentIndex = activeIndex;
      const nextIndex = currentIndex + normalizedDirection;
      const firstMiddleIndex = items.length * CATEGORY_MIDDLE_COPY;
      const lastCopyIndex = items.length * CATEGORY_COPY_COUNT - 1;
      if (nextIndex < 0 || nextIndex > lastCopyIndex) {
        const equivalentIndex =
          currentIndex +
          (normalizedDirection < 0 ? items.length : -items.length);
        const current = track.children[currentIndex] as HTMLElement | undefined;
        const equivalent = track.children[equivalentIndex] as
          HTMLElement | undefined;
        if (current && equivalent) {
          track.scrollLeft +=
            equivalent.getBoundingClientRect().left -
            current.getBoundingClientRect().left;
          currentIndex = equivalentIndex;
          setActiveIndex(equivalentIndex);
        } else {
          currentIndex = firstMiddleIndex;
          setActiveIndex(firstMiddleIndex);
        }
      }
      setCategoryTransition({
        direction: normalizedDirection,
        targetIndex: currentIndex + normalizedDirection,
      });
      return;
    }
    track.scrollBy({
      left: direction * track.clientWidth * 0.85,
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }

  const carouselPosition = infiniteFeatured
    ? { current: safeActiveIndex, total: Math.max(1, items.length) }
    : position;

  return (
    <section
      className={`carousel-section site-container ${className}`.trim()}
      aria-label={title}
      aria-roledescription="carousel"
    >
      <div className="section-heading">
        <div>
          {eyebrow && <p className="text-eyebrow">{eyebrow}</p>}
          <h2>
            {title}
            <span className="orange-period">.</span>
          </h2>
        </div>
        <div className="carousel-heading-actions">
          {headerAction}
          <div className="carousel-controls">
            <button
              type="button"
              className="icon-button circle-outline"
              aria-label={`Previous ${title}`}
              aria-controls={id}
              disabled={
                categoryTransition !== null || (!infiniteFeatured && ends.start)
              }
              onClick={() => scroll(-1)}
            >
              <ArrowLeft size={20} />
            </button>
            <button
              type="button"
              className="icon-button circle-outline"
              aria-label={`Next ${title}`}
              aria-controls={id}
              disabled={
                categoryTransition !== null || (!infiniteFeatured && ends.end)
              }
              onClick={() => scroll(1)}
            >
              <ArrowRight size={20} />
            </button>
            <span className="carousel-position" aria-live="polite">
              <span className="sr-only">Position </span>
              {carouselPosition.current + 1} / {carouselPosition.total}
            </span>
          </div>
        </div>
      </div>
      <div
        id={id}
        ref={ref}
        className={`carousel-track ${kind === "category" ? "category-track" : "product-track"} ${twoRows ? "product-track-two-rows" : ""}`}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label={`${title} scrollable collection`}
        aria-keyshortcuts="ArrowLeft ArrowRight"
        onKeyDown={(event) => {
          if (
            event.target === event.currentTarget &&
            (event.key === "ArrowLeft" || event.key === "ArrowRight")
          ) {
            event.preventDefault();
            scroll(event.key === "ArrowRight" ? 1 : -1);
          }
        }}
      >
        {infiniteFeatured
          ? Array.from({ length: CATEGORY_COPY_COUNT }, (_, copy) => copy)
              .flatMap((copy) =>
                items.map((child, logicalIndex) => ({
                  child,
                  copy,
                  logicalIndex,
                  virtualIndex: copy * items.length + logicalIndex,
                })),
              )
              .map(({ child, copy, logicalIndex, virtualIndex }) => {
                const renderedChild =
                  copy === 0 && logicalIndex === 0
                    ? (items[safeActiveIndex] ?? child)
                    : child;
                if (
                  !isValidElement<{
                    className?: string;
                  }>(renderedChild)
                ) {
                  return renderedChild;
                }
                const className = [
                  renderedChild.props.className,
                  virtualIndex === activeIndex ||
                  (copy === 0 && logicalIndex === 0)
                    ? "category-featured"
                    : "",
                  virtualIndex === categoryTransition?.targetIndex
                    ? "category-incoming"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ");
                return cloneElement(renderedChild, {
                  key: `${logicalIndex}-copy-${copy}`,
                  className,
                });
              })
          : items}
      </div>
    </section>
  );
}
