'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Drives the two `.bg-orb` background blobs' scroll-scrubbed drift on
 * /services. A continuous scroll-linked parallax, unlike the one-time
 * reveals elsewhere on this page (see `data-rv` / RevealRoot) — it has to
 * stay a GSAP ScrollTrigger, so it is isolated into this ~900-byte wrapper
 * rather than making the whole (otherwise static) page client.
 */
export function ServicesParallax({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.to('.bg-orb', {
          x: (i: number) => (i === 0 ? 100 : -100),
          y: (i: number) => (i === 0 ? 50 : -50),
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.5,
            invalidateOnRefresh: true,
          },
        });
      });

      return () => mm.revert();
    }, containerRef);

    const timer = setTimeout(() => ScrollTrigger.refresh(), 500);

    return () => {
      ctx.revert();
      clearTimeout(timer);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-brand-primary pt-24 md:pt-44 pb-24 lg:pb-32 lg:pl-16 relative overflow-hidden"
    >
      {children}
    </div>
  );
}
