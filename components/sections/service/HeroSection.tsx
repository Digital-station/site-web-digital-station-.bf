'use client';

import { useRef } from 'react';
import Image from 'next/image';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'motion/react';
import { ArrowRight, ChevronDown, ChevronRight, Sparkles } from 'lucide-react';

import { Link } from '@/i18n/routing';
import { waHref } from '@/config/site.config';
import { Container } from '@/components/layout/Container';
import { WhatsAppIcon } from '@/components/ui/icons/WhatsApp';
import { MagneticLink, RevealLine } from './primitives';
import { usePauseOffscreen } from '@/lib/use-pause-offscreen';
import type { ServiceContent } from '@/lib/service-content';
import type { ServiceMeta } from '@/content/services';

/**
 * Client component — split out of ServiceDetail because of genuine
 * interactivity (cursor-tracked 3D tilt on the hero image via
 * useMotionValue/useSpring), unlike the rest of that page, which is static
 * content with one-time scroll reveals (see `data-rv` / RevealRoot). Labels
 * and content are resolved server-side and passed in as props rather than
 * this component calling `useTranslations` itself.
 */
export function HeroSection({
  service,
  content,
  labels,
}: {
  service: ServiceMeta;
  content: ServiceContent;
  labels: {
    home: string;
    services: string;
    breadcrumbLabel: string;
    whatsappCta: string;
    promise: string;
  };
}) {
  const reduceMotion = useReducedMotion();
  const heroImageRef = useRef<HTMLDivElement>(null);
  const sectionRef = usePauseOffscreen<HTMLElement>();

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 150, damping: 20 });
  const springRotateY = useSpring(rotateY, { stiffness: 150, damping: 20 });
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);

  const glowBackground = useTransform(
    [glowX, glowY],
    ([gx, gy]) =>
      `radial-gradient(560px at ${gx}% ${gy}%, rgba(59,130,246,0.18), transparent 75%)`,
  );

  const titleWords = content.title.split(' ');

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion || !heroImageRef.current) return;
    const rect = heroImageRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;
    rotateY.set((relX - 0.5) * 10);
    rotateX.set((0.5 - relY) * 10);
    glowX.set(relX * 100);
    glowY.set(relY * 100);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <section ref={sectionRef} className="relative pt-32 pb-24 lg:pb-32 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          aria-hidden="true"
          className="parallax-bg absolute top-0 left-0 text-[25vw] font-black opacity-[0.03] leading-none select-none tracking-tighter uppercase"
        >
          {titleWords[0]}
        </div>
        {/* The drift and the scroll hint's bob are CSS loops (globals.css),
            paused by `usePauseOffscreen` once the hero is scrolled past. */}
        <div className="absolute top-20 right-10 w-96 h-96 bg-brand-accent/10 rounded-full blur-3xl motion-safe:animate-drift" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
            backgroundSize: '72px 72px',
            maskImage:
              'radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent)',
          }}
        />
      </div>

      <Container className="relative z-10">
        {/*
          A service page was reachable only from /services with no way back and
          no sense of place. The breadcrumb gives both, and feeds the
          BreadcrumbList JSON-LD the route already emits.
        */}
        <nav aria-label={labels.breadcrumbLabel} className="mb-10">
          <ol className="flex flex-wrap items-center gap-1 text-[11px] md:text-xs uppercase tracking-wide font-bold text-brand-muted">
            <li>
              <Link
                href="/"
                className="inline-flex items-center min-h-11 px-2 -ml-2 hover:text-brand-accent transition-colors"
              >
                {labels.home}
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="w-3 h-3 opacity-60" />
            </li>
            <li>
              <Link
                href="/services"
                className="inline-flex items-center min-h-11 px-2 hover:text-brand-accent transition-colors"
              >
                {labels.services}
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="w-3 h-3 opacity-60" />
            </li>
            <li aria-current="page" className="text-brand-text px-2">
              {content.title}
            </li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-12 lg:gap-20 items-center">
          {/* The hero's entrances are the CSS `.enter` animation (see
              globals.css), so the copy is painted from the server HTML instead
              of waiting for Motion to hydrate. */}
          <div className="space-y-8">
            <div className="enter [--enter-y:10px] [--enter-duration:0.6s] inline-flex items-center gap-3 px-4 py-2 rounded-full border border-brand-border bg-brand-surface">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-accent/60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-accent" />
              </span>
              <Sparkles className="w-4 h-4 text-brand-accent" />
              <span className="text-[11px] font-mono font-bold tracking-wide text-brand-muted uppercase">
                {content.heroBadgeLabel}
              </span>
            </div>

            {/*
              A "Construire" / "Build" line used to sit above every title,
              which read "Construire Support & infogérance" and the like. The
              title stands on its own.

              One <RevealLine> per WORD used to mean each word got its own
              `overflow: hidden` box — which sheared the accents off É and À
              in the French titles. Whole title, one mask, and `leading-[1.15]`
              so a capital accent never meets the line above.
            */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[1.15] text-balance break-words">
              <RevealLine delay={0.15}>{content.title}</RevealLine>
            </h1>

            <p className="enter [--enter-delay:0.6s] [--enter-duration:0.6s] text-sm font-semibold uppercase tracking-wide text-brand-accent">
              {content.heroSubtitle}
            </p>

            <p className="enter [--enter-y:10px] [--enter-delay:0.7s] [--enter-duration:0.6s] text-lg md:text-xl text-brand-muted leading-relaxed font-light max-w-2xl">
              {content.heroDescription}
            </p>

            <div className="enter [--enter-y:16px] [--enter-delay:0.85s] [--enter-duration:0.6s] pt-4">
              <div className="flex flex-wrap items-center gap-4">
                <MagneticLink
                  href="/contact"
                  className="group relative inline-flex items-center gap-2 px-8 py-4 bg-brand-accent-strong text-brand-on-accent font-bold rounded-full overflow-hidden transition-shadow duration-300 hover:shadow-lg"
                >
                  <span className="relative z-10">{content.heroCtaLabel}</span>
                  <ArrowRight className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
                </MagneticLink>

                <a
                  href={waHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline inline-flex items-center gap-3 px-8 py-4"
                >
                  <WhatsAppIcon size={20} className="text-green-500" />
                  {labels.whatsappCta}
                </a>
              </div>

              <p className="mt-4 text-xs md:text-sm text-brand-muted font-light">
                {labels.promise}
              </p>
            </div>
          </div>

          {/* Hero image with cursor-tracked 3D tilt. The entrance animates the
              individual `scale` / `rotate` properties, which compose with the
              tilt's inline `transform` instead of fighting it. */}
          <motion.div
            ref={heroImageRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              rotateX: springRotateX,
              rotateY: springRotateY,
              transformPerspective: 1000,
            }}
            className="enter [--enter-scale:0.94] [--enter-rotate:-3deg] [--enter-delay:0.3s] relative aspect-square hidden lg:block [transform-style:preserve-3d]"
          >
            <motion.div
              aria-hidden="true"
              className="absolute -inset-px rounded-3xl"
              style={{ background: glowBackground }}
            />

            <div className="absolute inset-0 rounded-3xl border border-brand-border overflow-hidden group shadow-card">
              <Image
                src={service.image}
                alt={content.title}
                fill
                sizes="(max-width: 1024px) 0px, 40vw"
                /* Likely the desktop LCP element. `fetchPriority`, not
                   `preload`: the image is `display: none` below `lg`, where a
                   preload would download it for nothing, while the default
                   lazy loading still skips it there. */
                fetchPriority="high"
                className="object-cover grayscale transition-all duration-700 ease-out group-hover:grayscale-0 group-hover:scale-105"
              />
              {/*
                The dark scrim used to be there to make a white "+40 % de
                conversions"-style metric caption readable. The metric card is
                gone (no source for any of those figures), so the photo can be
                shown plainly — only a light bottom scrim remains to seat it
                against the rounded frame.
              */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-out" />
            </div>
          </motion.div>
        </div>
      </Container>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <div className="motion-safe:animate-bob">
          <ChevronDown className="w-5 h-5 text-brand-accent" />
        </div>
      </motion.div>
    </section>
  );
}
