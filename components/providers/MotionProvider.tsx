'use client';

import { type ReactNode } from 'react';
import { MotionConfig } from 'motion/react';

/**
 * One place that teaches a Motion subtree to respect
 * `prefers-reduced-motion`.
 *
 * `reducedMotion="user"` makes Motion drop transform and layout animations for
 * visitors who asked for less motion, while still applying opacity and colour
 * changes — so an element that fades in from `opacity: 0` still ends up
 * visible instead of being stranded invisible, which is what a blanket
 * "disable all animation" would do.
 *
 * SCOPE — READ BEFORE MOVING THIS: this provider wraps each Motion subtree
 * individually (the dynamic home islands, the about/services/solutions
 * pages, the contact form) and must NEVER move back up to the locale
 * layout. `motion/react` ships as a single barrel file that the bundler
 * cannot tree-shake, so even this tiny config import would drag the whole
 * ~120 KB Motion runtime into EVERY page's initial bundle — including pages
 * that animate nothing above the fold.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
