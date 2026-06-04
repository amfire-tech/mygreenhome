// Smooth-scroll engine powered by Lenis.
//
// This hook owns the Lenis instance but does NOT run its own rAF loop — the
// single source-of-truth loop lives in App.jsx, which calls
// `lenisRef.current.raf(time)` each frame and then reads `lenisRef.current.scroll`.
// Keeping everything on one frame avoids double-smoothing and jank.
//
// Scene/video progress is intentionally NOT computed here: it must be measured
// relative to the sticky stage's own height (the page also contains the pricing
// and CTA sections below), so App derives it from the stage container.

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function useScrollProgress() {
  const lenisRef = useRef(null);

  useEffect(() => {
    const reduced = prefersReducedMotion();

    const lenis = new Lenis({
      lerp: reduced ? 1 : 0.1, // reduced motion → effectively native scrolling
      duration: 1.1, // used by programmatic scrollTo (nav jumps)
      smoothWheel: !reduced,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
      syncTouch: false, // native momentum on touch — more reliable for scrubbing
    });
    lenisRef.current = lenis;

    // Dev-only handle for automated visual QA (scroll-driving in headless).
    // Stripped from production builds via dead-code elimination.
    if (import.meta.env.DEV) window.__lenis = lenis;

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return lenisRef;
}
