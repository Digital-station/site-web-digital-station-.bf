import type { ElementType, HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/utils';

/**
 * The ONE layout primitive.
 *
 * Every section in `components/sections/**` wraps its content in this so the
 * page has a single, consistent measure and gutter instead of the ad-hoc mix
 * of `max-w-7xl px-6 md:px-12`, `max-w-[1400px] px-6 lg:px-12` and
 * `md:px-8 lg:px-20` the sections used to each pick for themselves.
 *
 * The 64px LeftRail gutter is NOT part of this — sections keep their own
 * `lg:pl-16` so a full-bleed element (the tools marquee, the hero's stat
 * band) can opt out of the measure while still clearing the rail.
 *
 * Extra props (e.g. `data-rv` for scroll reveals) pass straight through to
 * the underlying element.
 */
export function Container({
  as: Tag = 'div',
  className,
  children,
  ...rest
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
} & HTMLAttributes<HTMLElement>) {
  return (
    <Tag className={cn('mx-auto w-full max-w-[1400px] px-6 lg:px-12', className)} {...rest}>
      {children}
    </Tag>
  );
}
