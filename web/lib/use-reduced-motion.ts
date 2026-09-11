'use client';

import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * WHICH HOOK TO USE
 *
 * - `prefersReducedMotion()` — inside effects and imperative code (GSAP setup,
 *   canvas loops, `scrollTo` behaviour). Reads matchMedia synchronously.
 * - `useReducedMotion()` (this file) — only when the value drives a RENDER SWAP,
 *   i.e. it decides which subtree mounts (see `ToolsWeMaster`, which swaps the
 *   marquee for static rows). It returns `false` on the server AND on the first
 *   client render so hydration matches, then flips in an effect.
 * - Motion props need neither. Keep `initial` constant on anything rendered on
 *   the server: `MotionProvider`'s `<MotionConfig reducedMotion="user">`
 *   already drops transform and layout animation for these visitors (opacity
 *   still fades). Branching `initial` on a hook breaks either way — THIS file's
 *   hook is still `false` when Motion reads `initial`, and Motion's own
 *   synchronous hook makes the client markup differ from the server's, which
 *   React reports as a hydration mismatch. `useReducedMotion` from
 *   `motion/react` is fine for elements that only mount after an interaction
 *   (see `ContactForm`) and for event handlers.
 */

/**
 * Synchronous check for code that runs inside effects (GSAP setup, canvas
 * loops). Returns false during SSR so markup never depends on it.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia(QUERY).matches;
}

/**
 * Reactive version for render-time decisions (e.g. skip mounting a decorative
 * component). Starts as `false` on the server and on first client render so
 * hydration matches; flips after mount if the visitor asked for less motion.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const mql = window.matchMedia(QUERY);
    const update = () => setReduced(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, []);

  return reduced;
}
