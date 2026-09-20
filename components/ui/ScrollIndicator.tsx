'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';

import { usePathname } from '@/i18n/routing';
import { prefersReducedMotion } from '@/lib/use-reduced-motion';

/**
 * Vertical scroll-progress rail on the right edge (desktop only).
 *
 * The dots jump to sections of the HOME page, so the rail only exists there.
 * The previous version rendered on every route with all four buttons disabled —
 * four dead controls in the tab order that did nothing when clicked.
 *
 * Note the plugin registration sits INSIDE the component rather than at module
 * scope. `gsap.registerPlugin(ScrollTrigger)` touches `document`, so running it
 * while the module is evaluated on the server crashes the render.
 */
export function ScrollIndicator() {
  const dotRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const t = useTranslations('scrollIndicator');

  const isHome = pathname === '/';

  useEffect(() => {
    if (!isHome) return;

    gsap.registerPlugin(ScrollTrigger);
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: 0,
        end: 'bottom bottom',
        onUpdate: (self) => {
          const dot = dotRef.current;
          const track = trackRef.current;
          if (!dot || !track) return;

          // 16 = the p-2 padding above the first mark and below the last one,
          // so the head lands exactly on the last dot rather than past it.
          const travel = Math.max(0, track.offsetHeight - dot.offsetHeight - 16);
          const y = self.progress * travel;

          // Reduced motion: move it, but without the easing tween.
          if (reduced) gsap.set(dot, { y });
          else gsap.to(dot, { y, duration: 0.3, ease: 'circ.out' });
        },
      });

      ScrollTrigger.refresh();
    });

    return () => ctx.revert();
  }, [isHome, pathname]);

  if (!isHome) return null;

  const sections = [
    { id: 'hero', label: t('beginning') },
    { id: 'services', label: t('capabilities') },
    { id: 'industries', label: t('successStories') },
    { id: 'cta', label: t('scaleNow') },
  ];

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  };

  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-center md:right-10">
      <div ref={trackRef} className="relative flex flex-col items-center">
        {sections.map((s, i) => (
          <div key={s.id} className="contents">
            {/* The visible mark stays 6 px; the padding gives it a real hit
                area without changing how the rail looks. */}
            <button
              type="button"
              onClick={() => scrollTo(s.id)}
              aria-label={s.label}
              className="group relative p-2.5 cursor-pointer rounded-sm focus-visible:ring-2 focus-visible:ring-brand-accent"
            >
              <span className="block w-1.5 h-1.5 bg-brand-border transition-colors group-hover:bg-brand-muted" />
              <span className="absolute right-10 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-brand-primary border-l-2 border-brand-accent text-[11px] font-black uppercase tracking-[0.2em] opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100 group-focus-visible:translate-x-0 transition-all duration-300 shadow-2xl whitespace-nowrap pointer-events-none rounded-sm backdrop-blur-md">
                {s.label}
              </span>
            </button>
            {/* Long segment sits between the 2nd and 3rd dots, as in the
                original design. */}
            {i === 1 && <div className="w-1.5 h-12 bg-brand-border opacity-50" />}
          </div>
        ))}

        <div
          ref={dotRef}
          aria-hidden="true"
          className="absolute top-2 left-1/2 -ml-[3px] w-1.5 h-1.5 bg-brand-accent z-10 pointer-events-none"
          style={{ boxShadow: '0 0 15px var(--ds-accent)' }}
        />
      </div>
    </div>
  );
}
