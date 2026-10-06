'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Drives the `.parallax-bg` giant-title backdrop's scroll-scrubbed drift on
 * a service detail page. A continuous scroll-linked parallax, unlike the
 * one-time reveals elsewhere on this page (see `data-rv` / RevealRoot) — it
 * has to stay a GSAP ScrollTrigger, so it is isolated into this small
 * wrapper rather than making the whole (otherwise mostly static) page
 * client. `key={service.slug}` on the caller remounts this on navigation
 * between service pages, matching the old effect's `[service.slug]` dep.
 */
export function ServiceParallax({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.to('.parallax-bg', {
          y: 120,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
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
    <div ref={containerRef} className="overflow-hidden lg:pl-16">
      {children}
    </div>
  );
}
