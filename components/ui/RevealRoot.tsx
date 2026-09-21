'use client';

import { useEffect, type ReactNode } from 'react';

import { prefersReducedMotion } from '@/lib/use-reduced-motion';

/**
 * Scroll-reveal root for `[data-rv]` descendants.
 *
 * A ~500-byte IntersectionObserver island that replaces the GSAP +
 * ScrollTrigger reveals the home page used to ship (~110 KB). Behaviour
 * matches the old `immediateRender: false` + `once: true` setup:
 *
 *   • Content ships VISIBLE in the server HTML. The hidden state only
 *     exists while <html> carries `.rv-armed` (see globals.css), which is
 *     added here, in an effect — so no-JS renders and reduced-motion
 *     visitors never see hidden content.
 *   • Each element reveals once, the first time it approaches the viewport
 *     (200 px of lookahead), then is unobserved.
 *   • Anything still hidden after 5 s is revealed anyway, so a missed
 *     callback (background tab, odd embed) can never strand content.
 *
 * Only mark BELOW-the-fold elements with `data-rv`: arming runs after
 * first paint, so an above-the-fold element would flash visible → hidden
 * → visible. Stagger siblings with `style={{ '--rv-delay': '0.1s' }}`.
 */
export function RevealRoot({ children }: { children: ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;
    const targets = Array.from(
      document.querySelectorAll('[data-rv]:not(.rv-in)'),
    );
    if (targets.length === 0) return;

    // No observer (ancient browser) or no motion wanted: leave everything
    // as shipped — visible.
    if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') {
      return;
    }

    root.classList.add('rv-armed');

    const reveal = (el: Element) => {
      el.classList.add('rv-in');
      // Once the reveal transition has run, drop the stagger delay so it
      // doesn't slow down later transitions on the same element (hovers).
      // See the .rv-done rule in globals.css.
      el.addEventListener(
        'transitionend',
        () => el.classList.add('rv-done'),
        { once: true },
      );
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          reveal(entry.target);
          io.unobserve(entry.target);
        }
      },
      // Fire once the element's top edge is ~80 px inside the viewport —
      // the same "just entered" point the old ScrollTrigger start used.
      { rootMargin: '0px 0px -80px 0px', threshold: 0 },
    );
    targets.forEach((el) => io.observe(el));

    // Failsafe: never leave content hidden.
    const failsafe = window.setTimeout(() => {
      targets.forEach(reveal);
      io.disconnect();
    }, 5000);

    return () => {
      window.clearTimeout(failsafe);
      io.disconnect();
      root.classList.remove('rv-armed');
    };
  }, []);

  return <>{children}</>;
}
