'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useTranslations } from 'next-intl';

import { BrandMark } from '@/components/ui/BrandMark';
import { prefersReducedMotion } from '@/lib/use-reduced-motion';

/**
 * Fixed decorative rail down the left edge (desktop only).
 *
 * Ported 1:1 from the Vite app. The year is computed at render time on the
 * client; because the whole rail is aria-hidden it never reaches assistive
 * tech, so a server/client year mismatch across midnight is harmless.
 */
export function LeftRail() {
  const logoRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('rail');

  useEffect(() => {
    // Reduced motion: jump straight to the resting state. `gsap.from` would
    // otherwise start the mark at scale 0 / opacity 0 and animate it in.
    if (prefersReducedMotion()) {
      gsap.set(logoRef.current, { scale: 1, opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from(logoRef.current, {
        scale: 0,
        opacity: 0,
        duration: 1,
        ease: 'power4.out',
        delay: 0.2,
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div
      aria-hidden="true"
      className="hidden lg:flex fixed left-0 top-0 bottom-0 w-16 border-r border-brand-border flex-col items-center justify-between py-12 z-50 bg-brand-primary"
    >
      <div
        ref={logoRef}
        className="flex flex-col items-center gap-2 hover:scale-110 transition-transform cursor-pointer"
      >
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
