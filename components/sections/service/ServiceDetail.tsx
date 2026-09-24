"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Compass,
  Handshake,
  Sparkles,
  Users2,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/routing";
import { waHref } from "@/config/site.config";
import { Container } from "@/components/layout/Container";
import { WhatsAppIcon } from "@/components/ui/icons/WhatsApp";
import {
  EASE,
  MagneticLink,
  RevealLine,
  Spotlight,
  VIEWPORT,
} from "./primitives";
import { useServiceContent } from "@/lib/service-content";
import { usePauseOffscreen } from "@/lib/use-pause-offscreen";
import { SERVICES, type ServiceMeta } from "@/content/services";

/**
 * ~400 lines of SVG + SMIL, purely decorative, and it sits three screens down
 * the page. Its own chunk, client-only.
 */
const KnowledgeConvergence = dynamic(
  () =>
    import("@/components/lightswind/knowledge-convergence").then(
      (m) => m.KnowledgeConvergence,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[420px] md:min-h-[500px]" aria-hidden="true" />
    ),
  },
);

export function ServiceDetail({ service }: { service: ServiceMeta }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const content = useServiceContent(service.slug);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to(".parallax-bg", {
          y: 120,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
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
  }, [service.slug]);

  return (
    <div ref={containerRef} className="overflow-hidden lg:pl-16">
      <HeroSection service={service} content={content} />
      <OrientationStrip service={service} content={content} />
      <BenefitsSection service={service} content={content} />
      <FeaturesSection service={service} content={content} />
      <ScopeSection service={service} content={content} />
      <RelatedServices service={service} />
      <CtaSection content={content} />
    </div>
  );
}

/* ============================== HERO ============================== */

type SectionProps = {
  service: ServiceMeta;
  content: ReturnType<typeof useServiceContent>;
};

function HeroSection({ service, content }: SectionProps) {
  const reduceMotion = useReducedMotion();
  const heroImageRef = useRef<HTMLDivElement>(null);
  const sectionRef = usePauseOffscreen<HTMLElement>();
  const tn = useTranslations("nav");
  const tc = useTranslations("common");

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

  const titleWords = content.title.split(" ");

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
    <section
      ref={sectionRef}
      className="relative pt-32 pb-24 lg:pb-32 overflow-hidden"
    >
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
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage:
              "radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent)",
          }}
        />
      </div>

      <Container className="relative z-10">
        {/*
          A service page was reachable only from /services with no way back and
          no sense of place. The breadcrumb gives both, and feeds the
          BreadcrumbList JSON-LD the route already emits.
        */}
        <nav aria-label={tn("breadcrumbLabel")} className="mb-10">
          <ol className="flex flex-wrap items-center gap-1 text-[11px] md:text-xs uppercase tracking-wide font-bold text-brand-muted">
            <li>
              <Link
                href="/"
                className="inline-flex items-center min-h-11 px-2 -ml-2 hover:text-brand-accent transition-colors"
              >
                {tn("home")}
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
                {tn("services")}
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
                  {tc("whatsappCta")}
                </a>
              </div>

              <p className="mt-4 text-xs md:text-sm text-brand-muted font-light">
                {tc("promise")}
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

/* ========================= ORIENTATION STRIP ========================= */

/**
 * Three plain answers, immediately under the hero: who the service is for,
 * how an engagement starts, and what we commit to. Everything above used to
 * be atmosphere — a badge, a metric with no source, and a CTA.
 */
function OrientationStrip({ service }: SectionProps) {
  const d = useTranslations("servicePage.defaults");
  const tc = useTranslations("common");
  const ts = useTranslations("services.items");

  const cards = [
    {
      icon: Users2,
      title: d("forWhoTitle"),
      body: ts(`${service.slug}.audience`),
    },
    { icon: Compass, title: d("howToStartTitle"), body: d("howToStart") },
    { icon: Handshake, title: d("commitmentTitle"), body: tc("promise") },
  ];

  return (
    <section className="py-24 lg:py-32 border-t border-brand-border">
      <Container>
        <div className="grid gap-6 md:grid-cols-3">
          {cards.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-2xl border border-brand-border bg-brand-surface p-6 md:p-8"
            >
              <div className="flex items-center gap-3 mb-3">
                <Icon className="w-6 h-6 shrink-0 text-brand-accent" />
                <h2 className="text-lg md:text-xl font-black uppercase tracking-tight leading-[1.15] text-balance break-words">
                  {title}
                </h2>
              </div>
              <p className="text-brand-muted text-sm md:text-base leading-relaxed font-light">
                {body}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ============================ BENEFITS ============================ */

function BenefitsSection({ service, content }: SectionProps) {
  return (
    <section className="py-24 lg:py-32 border-t border-brand-border relative overflow-hidden">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-16 max-w-2xl"
        >
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-[1.15] text-balance break-words">
              {content.whyUsTitle}
            </h2>
          </div>
          <p className="text-brand-muted text-lg leading-relaxed">
            {content.whyUsIntro}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4 benefits-grid">
          {content.whyUsItems.map((benefit) => (
            <motion.div
              key={benefit}
              whileHover={{ y: -3 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="benefit-card group relative p-6 md:p-8 rounded-2xl border border-brand-border bg-brand-surface hover:border-brand-accent/40 transition-colors duration-300"
            >
              <Spotlight />
              <div className="relative flex items-start gap-4">
                <div
                  className={`flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-lg bg-brand-surface-2 border border-brand-border ${service.accentColor} transition-transform duration-300 group-hover:scale-110`}
                >
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <p className="text-lg md:text-xl font-medium leading-relaxed">
                  {benefit}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/*
          The four delivery steps used to be squeezed two-at-a-time into the
          features column beside a "+40 %" metric card. The metric is gone and
          all four steps get their own block, in order.
        */}
        <ProcessBlock service={service} content={content} />
      </Container>
    </section>
  );
}

function ProcessBlock({ service, content }: SectionProps) {
  const d = useTranslations("servicePage.defaults");

  return (
    <div className="mt-16 md:mt-20 border-t border-brand-border pt-12 md:pt-16">
      <p className="text-brand-accent text-[11px] md:text-xs uppercase tracking-wide font-mono font-bold mb-4">
        {d("processEyebrow")}
      </p>
      <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-[1.15] mb-8 text-balance break-words">
        {d("processTitle")}
      </h3>
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {content.process.map((step, i) => (
          <li
            key={step}
            className="relative rounded-2xl border border-brand-border bg-brand-surface p-5 md:p-6"
          >
            <span className="font-mono text-[11px] md:text-xs text-brand-muted block mb-3">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="flex items-start gap-3">
              <CheckCircle2
                className={`w-5 h-5 shrink-0 mt-0.5 ${service.accentColor}`}
              />
              <span className="text-sm md:text-base font-medium leading-snug">
                {step}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ============================ FEATURES ============================ */

function FeaturesSection({ content }: SectionProps) {
  const sectionRef = usePauseOffscreen<HTMLElement>();
  const showSideColumn = Boolean(content.platforms) || content.hasOwnWhyUsItems;

  return (
    <section
      ref={sectionRef}
      className="py-24 lg:py-32 bg-brand-surface border-y border-brand-border relative overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-brand-accent/5 rounded-full blur-3xl motion-safe:animate-[turn_24s_linear_infinite]" />
      </div>

      <Container className="relative z-10">
        {/*
          Services without platforms or authored whyUs items used to fill the
          right-hand column with `benefits` — the exact list the "Pourquoi nous
          choisir" section had just shown. Those pages now keep the text column
          alone instead of repeating it.
        */}
        <div
          className={
            showSideColumn
              ? "grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20 items-center"
              : "max-w-3xl"
          }
        >
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-8 leading-[1.15] text-balance break-words">
              {content.featureTitle}
            </h2>
            <p className="text-brand-muted text-lg md:text-xl leading-relaxed mb-8 font-light">
              {content.featureDesc}
            </p>
            {/* "Découvrir nos solutions" now goes to the solutions catalogue,
                not to the contact form. */}
            <MagneticLink
              href="/solutions"
              className="inline-flex items-center gap-3 text-brand-accent font-bold uppercase tracking-wide text-sm group min-h-11"
            >
              {content.featureCtaLabel}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
            </MagneticLink>
          </motion.div>

          {/*
            Only cloud-hebergement defines `platforms`. Where it is absent the
            column used to fall back to a metric card plus two of the four
            process steps; the steps now live in their own block above and the
            metric is gone, so the column simply collapses to one column.
          */}
          {content.platforms ? (
            <div className="grid sm:grid-cols-2 gap-6">
              {content.platforms.map((platform, i) => (
                <motion.div
                  key={platform.name}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VIEWPORT}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
                  whileHover={{ y: -8 }}
                  className="group relative p-6 md:p-8 rounded-2xl border border-brand-border bg-brand-primary/40 hover:border-brand-accent/50 transition-colors duration-300 overflow-hidden"
                >
                  <Spotlight />
                  <div className="relative">
                    <h3 className="text-lg md:text-xl font-black uppercase mb-4 leading-[1.15] text-balance break-words">
                      {platform.name}
                    </h3>
                    <p className="text-brand-muted text-sm italic mb-6 leading-relaxed border-l-2 border-brand-border pl-4 group-hover:border-brand-accent/40 transition-colors duration-300">
                      {platform.insight}
                    </p>
                    <div className="space-y-2">
                      {platform.focus.map((f) => (
                        <div
                          key={f}
                          className="flex items-center gap-2 text-[11px] md:text-xs uppercase font-bold tracking-wide text-brand-muted"
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${platform.color}`}
                          />
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : content.hasOwnWhyUsItems ? (
            <ul className="grid gap-4 sm:grid-cols-2">
              {content.benefits.map((b) => (
                <li
                  key={b}
                  className="rounded-2xl border border-brand-border bg-brand-primary/40 p-6 flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-brand-accent" />
                  <span className="text-sm md:text-base font-medium leading-snug">
                    {b}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </Container>
    </section>
  );
}

/* ============================== SCOPE ============================== */

function ScopeSection({ service, content }: SectionProps) {
  const sources = content.scopeItems.map((item, index) => ({
    id: `scope-${index}`,
    label: item.title,
    // `accentColor` is a text-* class; on an empty div it painted nothing.
    // `bg-current` turns that text colour into the dot's fill.
    icon: (
      <div
        className={`h-2.5 w-2.5 rounded-full bg-current ${service.accentColor} shadow-[0_0_12px_rgba(255,255,255,0.2)]`}
      />
    ),
  }));

  return (
    <section className="py-24 lg:py-32 border-t border-brand-border relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute left-1/2 top-1/2 h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-accent/10 blur-[140px]" />
      </div>

      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-12 max-w-3xl"
        >
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6 italic leading-[1.15] text-balance break-words">
            {content.scopeTitle}
          </h2>
          <p className="text-brand-muted text-lg font-light leading-relaxed">
            {content.scopeIntro}
          </p>
        </motion.div>

        {/* aria-hidden: the diagram only repeats text that is on the page
            already (the h1, and the scope list below or the process steps
            above), and it holds nothing focusable. */}
        <div
          aria-hidden="true"
          className="rounded-[2rem] border border-brand-border bg-brand-surface p-4 md:p-6 overflow-hidden"
        >
          <KnowledgeConvergence
            title={content.title}
            sources={sources}
            /* Was hardcoded to the old lime #C1FF72 — now the brand accent. */
            dotColor="#3B82F6"
            className="min-h-[420px] md:min-h-[500px]"
          />
        </div>

        {/* The scope descriptions are the substance; the visualisation above
            only shows the labels, so they are listed here too. Services
            without authored scope items fall back to their process steps,
            which the "Comment nous procédons" block already lists — for those
            the diagram stays and the repeated title-only list is skipped. */}
        {content.hasOwnScopeItems && (
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.scopeItems.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
                className="border-l-2 border-brand-border pl-5 hover:border-brand-accent transition-colors"
              >
                <h3 className="text-base font-bold uppercase tracking-tight mb-2 leading-[1.15] text-balance break-words">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-brand-muted text-sm leading-relaxed font-light">
                    {item.description}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}

/* ============================= RELATED ============================= */

/** How many other services each page links to. */
const RELATED_COUNT = 3;

/**
 * Links to the next three services in catalogue order, wrapping round at the
 * end. Taking them in order rather than by hand means every service page is
 * linked from exactly three others, and nothing needs updating when a service
 * is added.
 */
function RelatedServices({ service }: { service: ServiceMeta }) {
  const tn = useTranslations("nav");
  const ts = useTranslations("services.items");

  const start = SERVICES.findIndex((s) => s.slug === service.slug);
  const related = Array.from(
    { length: Math.min(RELATED_COUNT, SERVICES.length - 1) },
    (_, i) => SERVICES[(start + 1 + i) % SERVICES.length],
  );

  return (
    <section className="py-24 lg:py-32 border-t border-brand-border">
      <Container>
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-12 leading-[1.15] text-balance break-words">
          {tn("servicesEyebrow")}
        </h2>
        <ul className="grid gap-6 md:grid-cols-3">
          {related.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/services/${s.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-brand-border bg-brand-surface p-6 md:p-8 hover:border-brand-accent/40 transition-colors duration-300"
              >
                <span className="text-[11px] font-mono text-brand-accent mb-3">
                  {s.num}
                </span>
                <span className="text-lg md:text-xl font-black uppercase tracking-tight leading-[1.15] mb-3 text-balance break-words transition-colors group-hover:text-brand-accent">
                  {ts(`${s.slug}.title`)}
                </span>
                <span className="text-brand-muted text-sm leading-relaxed mb-6">
                  {ts(`${s.slug}.desc`)}
                </span>
                <ArrowRight
                  aria-hidden="true"
                  className="mt-auto w-5 h-5 text-brand-accent transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/* =============================== CTA =============================== */

function CtaSection({
  content,
}: {
  content: ReturnType<typeof useServiceContent>;
}) {
  const sectionRef = usePauseOffscreen<HTMLElement>();
  const tc = useTranslations("common");

  return (
    <section
      ref={sectionRef}
      className="py-24 lg:py-32 relative overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none motion-safe:animate-breathe"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-brand-accent/10 via-transparent to-brand-accent/10 blur-3xl" />
      </div>

      <Container className="relative z-10 max-w-4xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.8, ease: EASE }}
          className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter mb-8 italic leading-[1.15] text-balance break-words"
        >
          {content.ctaTitle}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VIEWPORT}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="text-brand-muted text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed"
        >
          {content.ctaSubtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ delay: 0.3, duration: 0.6, ease: EASE }}
        >
          <div className="flex flex-wrap items-center justify-center gap-4">
            <MagneticLink
              href="/contact"
              strength={0.25}
              className="group relative inline-flex items-center gap-3 px-10 py-5 md:px-14 md:py-6 bg-brand-accent-strong text-brand-on-accent font-bold text-lg md:text-xl rounded-full overflow-hidden transition-shadow duration-300 hover:shadow-2xl"
            >
              <span className="relative z-10">{content.ctaButtonLabel}</span>
              <ArrowUpRight className="w-6 h-6 relative z-10 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </MagneticLink>

            <a
              href={waHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline inline-flex items-center gap-3 px-10 py-5 md:px-12 md:py-6 text-base md:text-lg"
            >
              <WhatsAppIcon size={22} className="text-green-500" />
              {tc("whatsappCta")}
            </a>
          </div>
          {/* No promise line here: the footer directly below repeats it. */}
        </motion.div>
      </Container>
    </section>
  );
}
