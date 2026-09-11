'use client';

import { type ReactNode } from 'react';
import { MotionConfig } from 'motion/react';

/**
 * One place that teaches every Motion animation on the site to respect
 * `prefers-reduced-motion`.
 *
 * `reducedMotion="user"` makes Motion drop transform and layout animations for
 * visitors who asked for less motion, while still applying opacity and colour
 * changes — so an element that fades in from `opacity: 0` still ends up
 * visible instead of being stranded invisible, which is what a blanket
 * "disable all animation" would do.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
