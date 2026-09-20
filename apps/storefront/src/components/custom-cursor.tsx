"use client";

import { useEffect } from "react";

const INTERACTIVE_SELECTOR =
  'a, button, input, select, textarea, summary, [role="button"]';

export function CustomCursor() {
  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!finePointer.matches) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let targetX = -100;
    let targetY = -100;
    let ringX = -100;
    let ringY = -100;
    let frame = 0;
    let cursorVisible = false;
    let interactive = false;

    const position = (element: HTMLElement, x: number, y: number) => {
      const dialog = element.closest("dialog");
      if (dialog) {
        const rect = dialog.getBoundingClientRect();
        x -= rect.left;
        y -= rect.top;
      }
      element.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    };

    const layers = () =>
      Array.from(document.querySelectorAll<HTMLElement>(".custom-cursor"));

    const eachElement = (
      selector: string,
      callback: (element: HTMLElement) => void,
    ) => {
      layers().forEach((layer) => {
        const element = layer.querySelector<HTMLElement>(selector);
        if (element) callback(element);
      });
    };

    const syncLayers = () => {
      eachElement(".custom-cursor-dot", (dot) => {
        dot.dataset.visible = String(cursorVisible);
        position(dot, targetX, targetY);
      });
      eachElement(".custom-cursor-ring", (ring) => {
        ring.dataset.visible = String(cursorVisible);
        ring.dataset.interactive = String(interactive);
        position(ring, ringX, ringY);
      });
    };

    const animateRing = () => {
      const ease = reducedMotion ? 1 : 0.18;
      ringX += (targetX - ringX) * ease;
      ringY += (targetY - ringY) * ease;
      eachElement(".custom-cursor-ring", (ring) =>
        position(ring, ringX, ringY),
      );

      if (Math.abs(targetX - ringX) + Math.abs(targetY - ringY) > 0.2) {
        frame = requestAnimationFrame(animateRing);
      } else {
        frame = 0;
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      targetX = event.clientX;
      targetY = event.clientY;
      cursorVisible = true;
      eachElement(".custom-cursor-dot", (dot) => {
        position(dot, targetX, targetY);
        dot.dataset.visible = "true";
      });
      eachElement(".custom-cursor-ring", (ring) => {
        ring.dataset.visible = "true";
      });
      if (!frame) frame = requestAnimationFrame(animateRing);
    };

    const handlePointerOver = (event: PointerEvent) => {
      const target = event.target;
      const isInteractive =
        target instanceof Element &&
        Boolean(target.closest(INTERACTIVE_SELECTOR));
      interactive = isInteractive;
      eachElement(".custom-cursor-ring", (ring) => {
        ring.dataset.interactive = String(interactive);
      });
    };

    const hideCursor = () => {
      cursorVisible = false;
      eachElement(".custom-cursor-dot", (dot) => {
        dot.dataset.visible = "false";
      });
      eachElement(".custom-cursor-ring", (ring) => {
        ring.dataset.visible = "false";
      });
    };

    document.documentElement.classList.add("custom-cursor-enabled");
    const layerObserver = new MutationObserver(syncLayers);
    layerObserver.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    window.addEventListener("pointerover", handlePointerOver, {
      passive: true,
    });
    document.documentElement.addEventListener("mouseleave", hideCursor);
    window.addEventListener("blur", hideCursor);

    return () => {
      document.documentElement.classList.remove("custom-cursor-enabled");
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerover", handlePointerOver);
      document.documentElement.removeEventListener("mouseleave", hideCursor);
      window.removeEventListener("blur", hideCursor);
      layerObserver.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return <CustomCursorLayer />;
}

export function CustomCursorLayer() {
  return (
    <div className="custom-cursor" aria-hidden="true">
      <span className="custom-cursor-ring" />
      <span className="custom-cursor-dot" />
    </div>
  );
}
