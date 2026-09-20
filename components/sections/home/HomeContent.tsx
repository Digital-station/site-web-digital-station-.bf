'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Hero } from './Hero';
import { HomeServices } from './HomeServices';
import { AudienceSegmentation } from './AudienceSegmentation';
import { ArchitectureDiagrams } from './ArchitectureDiagrams';
import { ProjectEstimator } from './ProjectEstimator';
import { CTASection } from './CTASection';

/**
 * Both of these sit well below the fold and are heavy (a twelve-item animated
 * carousel and a velocity-reactive logo marquee), so each gets its own chunk.
 * They still render on the server — the point is the JS payload, not the HTML.
 *
 * The `loading` placeholders reserve roughly the section's own height so the
 * page does not jump when the chunk lands.
 */
const IndustriesWeServe = dynamic(
  () =>
    import('@/components/sections/IndustriesWeServe').then(
      (m) => m.IndustriesWeServe,
    ),
  { loading: () => <SectionPlaceholder id="industries" /> },
);

const ToolsWeMaster = dynamic(
  () => import('@/components/sections/ToolsWeMaster').then((m) => m.ToolsWeMaster),
  { loading: () => <SectionPlaceholder id="tools" /> },
);

function SectionPlaceholder({ id }: { id: string }) {
  return (
    <section
      id={id}
      aria-hidden="true"
      className="lg:pl-16 border-t border-brand-border py-24 lg:py-32 min-h-[600px]"
    />
  );
}

/**
 * Client half of the home page.
 *
 * Owns the page-level scroll reveals. The targets are class names
 * (`.home-service-card`, `.cta-content`) that app/globals.css pre-sets
 * `will-change` for — keep the two in sync.
 */
export function HomeContent() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Under reduced motion no tween is created at all, so nothing can be
      // left parked at opacity 0 waiting for a ScrollTrigger that never fires.
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '.home-service-card',
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.1,
            clearProps: 'all',
            /*
              `immediateRender: false` is what makes this reveal fail SAFE.
              The `from` state (opacity 0) is not written until the trigger
              actually fires — so if it never fires (an anchor jump straight
              to #services, a restored scroll position, a refresh that lands
              past the start) the cards are simply already visible instead of
              stranded invisible. `once` then kills the trigger after it
              plays, so a later refresh cannot re-apply the `from` state.
            */
            immediateRender: false,
            scrollTrigger: {
              trigger: '#services',
              start: 'top bottom-=40',
              toggleActions: 'play none none none',
              once: true,
            },
          },
        );

        gsap.fromTo(
          '.cta-content',
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            clearProps: 'all',
            immediateRender: false,
            scrollTrigger: {
              trigger: '#cta',
              start: 'top bottom-=40',
              toggleActions: 'play none none none',
              once: true,
            },
          },
        );
      });

      return () => mm.revert();
    }, containerRef);

    const timer = setTimeout(() => ScrollTrigger.refresh(), 800);

    return () => {
      ctx.revert();
      clearTimeout(timer);
    };
  }, []);

  return (
    <div ref={containerRef}>
      <Hero />
      <AudienceSegmentation />
      <HomeServices />
      <ArchitectureDiagrams />
      <IndustriesWeServe />
      <ProjectEstimator />
      <ToolsWeMaster />
      <CTASection />
    </div>
  );
}
