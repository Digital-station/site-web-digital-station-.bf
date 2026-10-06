'use client';

import type { ElementType, ReactNode } from 'react';

import { usePauseOffscreen } from '@/lib/use-pause-offscreen';

/**
 * Thin client wrapper around `usePauseOffscreen` so a section that only
 * needs it to pause its own decorative CSS loops (`animate-drift`,
 * `animate-turn`, …) doesn't have to be a client component itself — the
 * section's actual content (translations, structure) can be server-rendered
 * and passed in as `children`.
 *
 * `as` defaults to `'section'`, matching every current call site.
 */
export function PauseOffscreen({
  as: Tag = 'section',
  className,
  children,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}) {
  const ref = usePauseOffscreen<HTMLElement>();
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
