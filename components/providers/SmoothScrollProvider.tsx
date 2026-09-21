'use client';

import { useEffect, type ReactNode } from 'react';

import { prefersReducedMotion } from '@/lib/use-reduced-motion';

/**
 * Lenis smooth scrolling, loaded lazily.
 *
 * The Lenis instance is created imperatively (a dynamic `import('lenis')`
 * once the browser is idle) rather than through `<ReactLenis>`, for two
 * reasons:
 *
 *   1. No wrapper swap, no remount. Resolving a lazily imported wrapper
 *      component would remount the entire page subtree — replaying every
 *      CSS entrance animation a second after load. An instance created in
 *      an effect touches nothing React renders.
 *   2. Lenis (~30 KB) stays out of the initial bundle entirely.
 *
 * Settings are the ones the previous build shipped, so the scroll feel is
 * unchanged.
 *
 * Lenis is skipped entirely for visitors who asked for reduced motion (it
 * hijacks the wheel and animates scroll position, which is exactly the
 * kind of motion that setting is about) and on coarse-pointer devices,
 * where Lenis only smooths wheel input that does not exist.
 *
 * NOTE: as in the original, Lenis is deliberately NOT wired into
 * ScrollTrigger.update(). The home page no longer uses ScrollTrigger at
 * all; on the pages that still do, GSAP reads native scroll position,
 * which is why a ScrollTrigger can occasionally fire at a slightly
 * unexpected offset.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (
      typeof window.matchMedia === 'function' &&
      !window.matchMedia('(pointer: fine)').matches
    ) {
      return;
    }

    let cancelled = false;
    let lenis: { raf: (time: number) => void; destroy: () => void } | null = null;
    let rafId = 0;

    const start = () => {
      import('lenis').then(({ default: Lenis }) => {
        if (cancelled) return;
        lenis = new Lenis({
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: 'vertical',
          gestureOrientation: 'vertical',
          smoothWheel: true,
          wheelMultiplier: 1,
          touchMultiplier: 2,
          infinite: false,
        });
        const loop = (time: number) => {
          lenis?.raf(time);
          if (!cancelled) rafId = requestAnimationFrame(loop);
        };
        rafId = requestAnimationFrame(loop);
      });
    };

    const ric = (
      window as typeof window & {
        requestIdleCallback?: (
          cb: () => void,
          opts?: { timeout: number },
        ) => number;
        cancelIdleCallback?: (id: number) => void;
      }
    ).requestIdleCallback;

    let idleId: number | null = null;
    let timeoutId: number | null = null;
    if (ric) {
      idleId = ric(start, { timeout: 2500 });
    } else {
      timeoutId = window.setTimeout(start, 1200);
    }

    return () => {
      cancelled = true;
      if (idleId !== null) {
        (
          window as typeof window & { cancelIdleCallback?: (id: number) => void }
        ).cancelIdleCallback?.(idleId);
      }
      if (timeoutId !== null) window.clearTimeout(timeoutId);
      if (rafId) cancelAnimationFrame(rafId);
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  return <>{children}</>;
}
