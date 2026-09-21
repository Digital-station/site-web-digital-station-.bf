'use client';

import { useTranslations } from 'next-intl';

import { BrandMark } from '@/components/ui/BrandMark';

/**
 * Fixed decorative rail down the left edge (desktop only).
 *
 * Ported 1:1 from the Vite app. The year is computed at render time on the
 * client; because the whole rail is aria-hidden it never reaches assistive
 * tech, so a server/client year mismatch across midnight is harmless.
 *
 * The mark's entrance is the shared `.enter` CSS animation (see
 * globals.css) — the old GSAP tween cost a ~110 KB dependency for a
 * one-second scale-in. `.enter` is already disabled under
 * `prefers-reduced-motion`, so no JS check is needed.
 */
export function LeftRail() {
  const t = useTranslations('rail');

  return (
    <div
      aria-hidden="true"
      className="hidden lg:flex fixed left-0 top-0 bottom-0 w-16 border-r border-brand-border flex-col items-center justify-between py-12 z-50 bg-brand-primary"
    >
      <div className="enter [--enter-scale:0] [--enter-delay:0.2s] flex flex-col items-center gap-2 hover:scale-110 transition-transform cursor-pointer">
        <BrandMark variant="icon" height={32} />
      </div>
      {/* Pure ornament, aria-hidden with the rest of the rail — the one place
          the `ghost` tone is appropriate. */}
      <div className="rotate-[-90deg] whitespace-nowrap text-[11px] uppercase tracking-[0.3em] text-brand-ghost origin-center">
        {t('vertical', { year: new Date().getFullYear() })}
      </div>
      <div className="h-12 w-px bg-brand-border" />
    </div>
  );
}
