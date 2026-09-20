'use client';

import { type CSSProperties, type ReactNode, useRef } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'motion/react';

import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';

/** Signature easing — a soft decelerate that reads as premium. */
export const EASE = [0.16, 1, 0.3, 1] as const;
export const VIEWPORT = { once: true, margin: '-80px' as const };

/**
 * A line of text revealed behind a mask, rather than a plain fade.
 *
 * The slide is the CSS `.enter` animation (globals.css), not Motion: Motion's
 * `initial={{ y: '115%' }}` was written into the server HTML, so the page's
 * h1 stayed pushed out of its mask until hydration.
 *
 * Under `prefers-reduced-motion: reduce` the mask and the slide are both
 * dropped (`motion-safe:` and the `.enter` media query), so nothing can clip
 * an accent.
 *
 * When the mask IS applied it is grown by 0.12em top and bottom (cancelled by
 * an equal negative margin, so the layout is unchanged). Capital accents
 * (É, À) rise above the line box of a tight uppercase heading, and a bare
 * `overflow: hidden` box cut them off at the top. 0.12em covers that overflow
 * but is still well under the 15% the inner span is translated by, so the
 * text is still fully hidden before it slides up.
 */
export function RevealLine({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'block motion-safe:overflow-hidden motion-safe:py-[0.12em] motion-safe:-my-[0.12em]',
        className,
      )}
    >
      <span
        className="enter block [--enter-opacity:1] [--enter-y:115%]"
        style={{ '--enter-delay': `${delay}s` } as CSSProperties}
      >
        {children}
      </span>
    </span>
  );
}

/**
 * Magnetic CTA: the button drifts toward the cursor and springs back.
 * Disabled entirely under prefers-reduced-motion.
 */
export function MagneticLink({
  href,
  children,
  className,
  strength = 0.3,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 18, mass: 0.3 });
  const springY = useSpring(y, { stiffness: 200, damping: 18, mass: 0.3 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * strength);
    y.set((e.clientY - rect.top - rect.height / 2) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div style={{ x: springX, y: springY }} className="inline-block">
      <Link
        ref={ref}
        href={href}
        onMouseMove={handleMouseMove}
        onMouseLeave={reset}
        className={className}
      >
        {children}
      </Link>
    </motion.div>
  );
}

/** Cursor-following halo inside a card. Parent needs `group` + `relative`. */
export function Spotlight() {
  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget.parentElement;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--spot-x', `${e.clientX - rect.left}px`);
    el.style.setProperty('--spot-y', `${e.clientY - rect.top}px`);
  };

  return (
    <div
      onMouseMove={handleMove}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      style={{
        background:
          'radial-gradient(380px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgba(255,255,255,0.06), transparent 70%)',
      }}
    />
  );
}
