'use client';

import { type ReactNode } from 'react';
import { ReactLenis } from 'lenis/react';

import { useReducedMotion } from '@/lib/use-reduced-motion';

/**
 * Lenis smooth scrolling.
 *
 * `<ReactLenis root>` owns the instance and its requestAnimationFrame loop with
 * a correct lifecycle under React 19 Strict Mode, which double-invokes effects
 * in development and would otherwise leave a second orphaned loop running.
 *
 * Settings are the ones the previous build shipped, so the scroll feel is
 * unchanged.
 *
 * Lenis is skipped entirely for visitors who asked for reduced motion: it
 * hijacks the wheel and animates scroll position, which is exactly the kind of
 * motion that setting is about. `useReducedMotion()` reports false on the
 * server and on the first client render so hydration matches, then flips — so
 * for those visitors the subtree re-mounts once, immediately after hydration,
 * before anything is interactive.
 *
 * NOTE: as in the original, Lenis is deliberately NOT wired into
 * ScrollTrigger.update(). GSAP reads native scroll position, which is why a
 * ScrollTrigger can occasionally fire at a slightly unexpected offset.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <ReactLenis
      root
      options={{
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}
