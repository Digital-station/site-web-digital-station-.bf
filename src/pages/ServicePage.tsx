import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { useParams, Link, Navigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import {
  ArrowRight,
  CheckCircle2,
  Zap,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { SERVICES } from "../constants";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Import des sections spécifiques
import { GBPKnowledge } from "../components/sections/GBPKnowledge";
import { PPCKnowledge } from "../components/sections/PPCKnowledge";
import { AIReceptionistKnowledge } from "../components/sections/AIReceptionistKnowledge";
import { SEOKnowledge } from "../components/sections/SEOKnowledge";
import { SocialMediaKnowledge } from "../components/sections/SocialMediaKnowledge";
import { ContentMarketingKnowledge } from "../components/sections/ContentMarketingKnowledge";
import { CRMKnowledge } from "../components/sections/CRMKnowledge";
import { GlobalBrandingKnowledge } from "../components/sections/GlobalBrandingKnowledge";
import { MarketingFunnelKnowledge } from "../components/sections/MarketingFunnelKnowledge";
import KnowledgeConvergence from "../components/lightswind/knowledge-convergence";

gsap.registerPlugin(ScrollTrigger);

// Courbe d'easing "signature" — décélération douce, sensation premium
const EASE = [0.16, 1, 0.3, 1] as const;
const VIEWPORT = { once: true, margin: "-80px" as const };

// Configuration des sections par service
const KNOWLEDGE_COMPONENTS: Record<string, React.ReactNode> = {
  "gbp-optimization": <GBPKnowledge />,
  "ppc-advertising": <PPCKnowledge />,
  "ai-receptionist": <AIReceptionistKnowledge />,
  "seo-strategy": <SEOKnowledge />,
  "social-media": <SocialMediaKnowledge />,
  "content-marketing": <ContentMarketingKnowledge />,
  "crm-integrations": <CRMKnowledge />,
  "global-branding": <GlobalBrandingKnowledge />,
  "marketing-funnel": <MarketingFunnelKnowledge />,
};

interface ServicePageConfig {
  scopeTitle?: string;
  scopeIntro?: string;
  scopeItems?: { title: string; description: string }[];
  heroBadgeLabel?: string;
  heroTitlePrefix?: string;
  heroSubtitle?: string;
  heroDescription?: string;
  heroCtaLabel?: string;
  whyUsTitle?: string;
  whyUsIntro?: string;
  whyUsItems?: string[];
  featureCtaLabel?: string;
  ctaTitle?: string;
  ctaSubtitle?: string;
  ctaButtonLabel?: string;
}

export const ServicePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = SERVICES.find((s) => s.slug === slug);
  const containerRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);

  // Configuration avec valeurs par défaut
  const config: ServicePageConfig = {
    scopeTitle: (service as any)?.scopeTitle ?? "The Best Pro Logic.",
    scopeIntro:
      (service as any)?.scopeIntro ??
      "We don't believe in templates. We believe in frameworks.",
    scopeItems: (service as any)?.scopeItems
      ? (service as any).scopeItems
      : (service?.process.map((step: string) => ({
          title: step,
          description:
            "Rigorous execution at the granular level to ensure success.",
        })) ?? []),
    heroBadgeLabel:
      (service as any)?.heroBadgeLabel ??
      (slug === "marketing-funnel"
        ? "Bespoke Revenue Infrastructure"
        : "Service Deep-Dive"),
    heroTitlePrefix: (service as any)?.heroTitlePrefix ?? "Build",
    heroSubtitle:
      (service as any)?.heroSubtitle ??
      "We turn strategy into momentum with precision.",
    heroDescription: (service as any)?.heroDescription ?? service?.longDesc,
    heroCtaLabel: (service as any)?.heroCtaLabel ?? "Request Strategy Session",
    whyUsTitle: (service as any)?.whyUsTitle ?? "Why Choose Us",
    whyUsIntro:
      (service as any)?.whyUsIntro ??
      "Strategic advantages built into every engagement.",
    whyUsItems:
      (service as any)?.whyUsItems?.length > 0
        ? (service as any).whyUsItems
        : (service?.benefits ?? []),
    featureCtaLabel:
      (service as any)?.featureCtaLabel ?? "Explore Advanced Solutions",
    ctaTitle: (service as any)?.ctaTitle ?? "Let's Reach New Milestones",
    ctaSubtitle:
      (service as any)?.ctaSubtitle ??
      "We build with precision, clarity and measurable impact.",
    ctaButtonLabel: (service as any)?.ctaButtonLabel ?? "Contact Us",
  };

  useEffect(() => {
    if (!service || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // Parallax effect optimisé
      gsap.to(".parallax-bg", {
        yPercent: -15,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });

      // Animation des cartes de bénéfices
      gsap.fromTo(
        ".benefit-card",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".benefits-grid",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      );

      // Animation des items de processus
      gsap.fromTo(
        ".process-item",
        { x: -40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".process-list",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      );

      // Ligne de progression du processus, synchronisée au scroll
      gsap.fromTo(
        ".process-line-fill",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".process-list",
            start: "top 70%",
            end: "bottom 60%",
            scrub: 0.6,
          },
        },
      );
    }, containerRef);

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    return () => {
      ctx.revert();
      clearTimeout(timer);
    };
  }, [service]);

  if (!service) {
    return <Navigate to="/" replace />;
  }

  return (
    <div
      ref={containerRef}
      className="overflow-hidden bg-gradient-to-b from-brand-primary via-brand-primary to-brand-primary/95"
    >
      <Helmet>
        <title>{service.title} | Best Pro Digital</title>
        <meta name="description" content={service.desc} />
        <link
          rel="canonical"
          href={`https://bestprodigital.com/services/${service.slug}`}
        />
        <meta
          property="og:title"
          content={`${service.title} | Best Pro Digital`}
        />
        <meta property="og:description" content={service.desc} />
        <meta property="og:type" content="article" />
        <meta
          property="og:url"
          content={`https://bestprodigital.com/services/${service.slug}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {`{
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "${service.title}",
            "description": "${service.desc.replace(/"/g, '\\"')}",
            "provider": {
              "@type": "Organization",
              "name": "Best Pro Digital",
              "url": "https://bestprodigital.com"
            },
            "serviceType": "Digital Marketing",
            "areaServed": "Global"
          }`}
        </script>
      </Helmet>

      {/* Hero Section */}
      <HeroSection
        service={service}
        config={config}
        slug={slug}
        heroImageRef={heroImageRef}
      />

      {/* Benefits Section */}
      <BenefitsSection service={service} config={config} />

      {/* Features Section */}
      <FeaturesSection service={service} config={config} />

      {/* Knowledge Hub */}
      <div>{KNOWLEDGE_COMPONENTS[slug ?? ""]}</div>

      {/* Process Section */}
      <ProcessSection service={service} config={config} />

      {/* CTA Section */}
      <CTASection config={config} />
    </div>
  );
};

// ============ SHARED PRIMITIVES ============

/** Ligne de texte révélée par un masque (effet "rideau"), plus soigné qu'un simple fade. */
const RevealLine = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => (
  <span className={`block overflow-hidden ${className}`}>
    <motion.span
      className="block"
      initial={{ y: "115%" }}
      animate={{ y: "0%" }}
      transition={{ duration: 1, delay, ease: EASE }}
    >
      {children}
    </motion.span>
  </span>
);

/** CTA à effet magnétique : le bouton suit légèrement le curseur, puis revient avec un ressort. */
const MagneticLink = ({
  to,
  children,
  className = "",
  strength = 0.3,
}: {
  to: string;
  children: React.ReactNode;
  className?: string;
  strength?: number;
}) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 18, mass: 0.3 });
  const springY = useSpring(y, { stiffness: 200, damping: 18, mass: 0.3 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * strength);
    y.set((e.clientY - rect.top - rect.height / 2) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div style={{ x: springX, y: springY }} className="inline-block">
      <Link
        ref={ref}
        to={to}
        onMouseMove={handleMouseMove}
        onMouseLeave={reset}
        className={className}
      >
        {children}
      </Link>
    </motion.div>
  );
};

/** Halo qui suit le curseur à l'intérieur d'une carte — le parent doit avoir `group` + `relative`. */
const Spotlight = () => {
  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget.parentElement as HTMLElement | null;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  };
  return (
    <div
      onMouseMove={handleMove}
      className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      style={{
        background:
          "radial-gradient(380px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgba(255,255,255,0.06), transparent 70%)",
      }}
    />
  );
};

// ============ HERO SECTION ============
interface HeroSectionProps {
  service: any;
  config: ServicePageConfig;
  slug: string | undefined;
  heroImageRef: React.RefObject<HTMLDivElement>;
}

const HeroSection = ({
  service,
  config,
  slug,
  heroImageRef,
}: HeroSectionProps) => {
  const reduceMotion = useReducedMotion();
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 150, damping: 20 });
  const springRotateY = useSpring(rotateY, { stiffness: 150, damping: 20 });
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);

  const titleWords: string[] = service.title.split(" ");

  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion || !heroImageRef.current) return;
    const rect = heroImageRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;
    rotateY.set((relX - 0.5) * 10);
    rotateX.set((0.5 - relY) * 10);
    glowX.set(relX * 100);
    glowY.set(relY * 100);
  };

  const handleImageMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <section className="relative min-h-screen pt-32 pb-20 px-6 md:px-12 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          aria-hidden
          className="parallax-bg absolute top-0 left-0 text-[25vw] font-black opacity-[0.03] leading-none select-none tracking-tighter uppercase"
        >
          {titleWords[0]}
        </div>
        <motion.div
          className="absolute top-20 right-10 w-96 h-96 bg-brand-accent/10 rounded-full blur-3xl"
          animate={
            reduceMotion
              ? undefined
              : {
                  y: [0, 30, 0],
                  x: [0, -20, 0],
                }
          }
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Grille fine en arrière-plan pour ancrer la composition */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage:
              "radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent)",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-[1.3fr_1fr] gap-12 lg:gap-20 items-center">
        {/* Left Content */}
        <div className="space-y-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-accent/60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-accent" />
            </span>
            <Sparkles className="w-4 h-4 text-brand-accent" />
            <span className="text-[10px] font-mono font-bold tracking-[0.3em] text-white/60 uppercase">
              {config.heroBadgeLabel}
            </span>
          </motion.div>

          {/* Title */}
          <div className="space-y-4">
            <RevealLine
              delay={0.15}
              className="text-sm font-bold tracking-[0.3em] uppercase text-brand-accent"
            >
              {config.heroTitlePrefix}
            </RevealLine>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.85] text-white">
              {titleWords.map((word, i) => (
                <RevealLine
                  key={i}
                  delay={0.25 + i * 0.1}
                  className={
                    i === 1
                      ? `${service.accentColor} italic font-serif font-light`
                      : ""
                  }
                >
                  {word}
                </RevealLine>
              ))}
            </h1>
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-accent"
          >
            {config.heroSubtitle}
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6, ease: EASE }}
            className="text-lg md:text-xl text-neutral-300 leading-relaxed font-light max-w-2xl"
          >
            {config.heroDescription}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.6, ease: EASE }}
            className="flex flex-wrap items-center gap-4 pt-4"
          >
            <MagneticLink
              to="/contact"
              className="group relative inline-flex items-center gap-2 px-8 py-4 bg-brand-accent text-brand-primary font-bold rounded-full overflow-hidden transition-shadow duration-300 hover:shadow-lg hover:shadow-brand-accent/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
            >
              <span className="relative z-10">{config.heroCtaLabel}</span>
              <ArrowRight className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
              <motion.div
                className="absolute inset-0 bg-white"
                initial={{ x: "100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
              />
            </MagneticLink>

            {slug === "marketing-funnel" && (
              <motion.div
                whileHover={reduceMotion ? undefined : { scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex items-center gap-3 px-6 py-4 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-sm cursor-default hover:border-brand-accent/50 transition-colors duration-300"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-accent/60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-accent" />
                </span>
                <span className="text-[10px] font-mono font-bold tracking-widest text-white/60 uppercase">
                  Live Results Active
                </span>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Right Image */}
        <motion.div
          ref={heroImageRef}
          onMouseMove={handleImageMouseMove}
          onMouseLeave={handleImageMouseLeave}
          initial={{ opacity: 0, scale: 0.94, rotate: -3 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, duration: 1, ease: EASE }}
          style={{
            rotateX: springRotateX,
            rotateY: springRotateY,
            transformPerspective: 1000,
          }}
          className="relative aspect-square hidden lg:block [transform-style:preserve-3d]"
        >
          {/* Glow Effect suivant le curseur */}
          <motion.div
            className="absolute -inset-px rounded-3xl"
            style={{
              background: useTransform(
                [glowX, glowY],
                ([gx, gy]) =>
                  `radial-gradient(560px at ${gx}% ${gy}%, rgba(var(--brand-accent-rgb, 255,255,255), 0.12), transparent 75%)`,
              ),
            }}
          />

          {/* Image Container */}
          <div className="absolute inset-0 rounded-3xl border border-white/10 overflow-hidden group shadow-2xl">
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-full object-cover grayscale transition-all duration-700 ease-out group-hover:grayscale-0 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-primary via-brand-primary/10 to-transparent" />

            {/* Balayage lumineux au survol */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-out" />

            {/* Floating Badge */}
            <motion.div
              animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-8 left-8 right-8 text-center"
              style={{ transform: "translateZ(40px)" }}
            >
              <div
                className={`text-5xl font-black ${service.accentColor} mb-2 flex items-center justify-center gap-3`}
              >
                <TrendingUp className="w-12 h-12" />
                {service.metric}
              </div>
              <p className="text-xs text-white/40 uppercase tracking-widest font-bold">
                {service.metricLabel}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-white/40 uppercase tracking-widest font-bold">
          Scroll to explore
        </span>
        <motion.div
          animate={reduceMotion ? undefined : { y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-brand-accent" />
        </motion.div>
      </motion.div>
    </section>
  );
};

// ============ BENEFITS SECTION ============
interface BenefitsSectionProps {
  service: any;
  config: ServicePageConfig;
}

const BenefitsSection = ({ service, config }: BenefitsSectionProps) => {
  return (
    <section className="py-24 md:py-32 px-6 md:px-12 border-t border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-16 max-w-2xl"
        >
          <div className="flex items-center gap-4 mb-6">
            <div
              className={`flex items-center justify-center w-12 h-12 rounded-xl border border-white/10 bg-white/[0.03] ${service.accentColor}`}
            >
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white">
              {config.whyUsTitle}
            </h2>
          </div>
          <p className="text-neutral-400 text-lg leading-relaxed">
            {config.whyUsIntro}
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 gap-4 benefits-grid">
          {config.whyUsItems?.map((benefit: string, i: number) => (
            <motion.div
              key={i}
              whileHover={{ y: -3 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="benefit-card group relative p-6 md:p-8 rounded-2xl border border-white/5 bg-white/[0.01] backdrop-blur-sm hover:border-brand-accent/30 transition-colors duration-300"
            >
              <Spotlight />
              <div className="relative flex items-start gap-4">
                <div
                  className={`flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-lg bg-white/[0.04] border border-white/5 ${service.accentColor} transition-transform duration-300 group-hover:scale-110`}
                >
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <p className="text-lg md:text-xl text-white/90 font-medium leading-relaxed">
                  {benefit}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============ FEATURES SECTION ============
interface FeaturesSectionProps {
  service: any;
  config: ServicePageConfig;
}

const FeaturesSection = ({ service, config }: FeaturesSectionProps) => {
  return (
    <section className="py-24 md:py-32 px-6 md:px-12 bg-white/[0.02] border-y border-white/5 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute -top-1/2 -right-1/2 w-full h-full bg-brand-accent/5 rounded-full blur-3xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-8 leading-[1.1]">
              {service.featureTitle}
            </h2>
            <p className="text-neutral-400 text-lg md:text-xl leading-relaxed mb-8 font-light">
              {service.featureDesc}
            </p>
            <MagneticLink
              to="/contact"
              className="inline-flex items-center gap-3 text-brand-accent font-bold uppercase tracking-widest text-sm group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-accent rounded-sm"
            >
              {config.featureCtaLabel}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
            </MagneticLink>
          </motion.div>

          {/* Right Platforms */}
          {service.platforms ? (
            <div className="grid sm:grid-cols-2 gap-6">
              {service.platforms.map((platform: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VIEWPORT}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
                  whileHover={{ y: -8 }}
                  className="group relative p-6 md:p-8 rounded-2xl border border-white/5 bg-brand-surface/50 backdrop-blur-sm hover:border-brand-accent/50 transition-colors duration-300 cursor-default overflow-hidden"
                >
                  <Spotlight />
                  <div className="relative">
                    <div
                      className={`text-xs font-mono mb-4 uppercase tracking-[0.3em] ${platform.color}`}
                    >
                      {platform.name}
                    </div>
                    <h4 className="text-xl md:text-2xl font-black text-white uppercase mb-4 leading-tight">
                      {platform.name}
                      <span className="opacity-30 italic font-serif lowercase font-light ml-2">
                        Intelligence
                      </span>
                    </h4>
                    <p className="text-neutral-400 text-sm italic mb-6 leading-relaxed border-l-2 border-white/10 pl-4 group-hover:border-brand-accent/40 transition-colors duration-300">
                      {platform.insight}
                    </p>
                    <div className="space-y-2">
                      {platform.focus.map((f: string, fi: number) => (
                        <motion.div
                          key={fi}
                          initial={{ opacity: 0.6 }}
                          whileHover={{ opacity: 1, x: 4 }}
                          className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-white/60 transition-all"
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${platform.color}`}
                          />
                          {f}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FeatureCard
                title="99.9%"
                subtitle="Efficiency Rate"
                icon={<Zap className="w-6 h-6" />}
              />
              <FeatureCard title="Instant" subtitle="Scale" accent />
              <FeatureCard
                title="Enterprise"
                subtitle="Data Privacy"
                className="sm:col-span-2"
                hasCheckmark
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

interface FeatureCardProps {
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
  accent?: boolean;
  className?: string;
  hasCheckmark?: boolean;
}

const FeatureCard = ({
  title,
  subtitle,
  icon,
  accent,
  className = "",
  hasCheckmark,
}: FeatureCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={VIEWPORT}
    transition={{ duration: 0.6, ease: EASE }}
    whileHover={{ y: -4 }}
    className={`relative p-6 md:p-8 rounded-2xl border overflow-hidden group transition-colors duration-300 ${
      accent
        ? "bg-brand-accent text-brand-primary border-brand-accent"
        : "border-white/5 bg-white/[0.01] backdrop-blur-sm hover:border-brand-accent/30"
    } ${className}`}
  >
    {!accent && <Spotlight />}
    <div className="relative">
      {icon && (
        <div
          className={`inline-flex items-center justify-center w-11 h-11 rounded-xl mb-4 ${
            accent ? "bg-brand-primary/10" : "bg-white/[0.04] text-brand-accent"
          }`}
        >
          {icon}
        </div>
      )}
      <div
        className={`text-2xl md:text-3xl font-black uppercase mb-2 ${accent ? "" : "text-white"}`}
      >
        {title}
      </div>
      <div
        className={`text-xs md:text-sm uppercase tracking-widest font-bold ${
          accent ? "text-brand-primary/70" : "text-white/60"
        }`}
      >
        {subtitle}
      </div>
      {hasCheckmark && (
        <CheckCircle2
          className={`w-6 h-6 mt-4 ${accent ? "text-brand-primary" : "text-brand-accent"}`}
        />
      )}
    </div>
  </motion.div>
);

// ============ PROCESS SECTION ============
interface ProcessSectionProps {
  service: any;
  config: ServicePageConfig;
}

const ProcessSection = ({ service, config }: ProcessSectionProps) => {
  const sources = (config.scopeItems ?? []).map((item, index) => ({
    id: `scope-${index}`,
    label: item.title,
    icon: (
      <div
        className={`h-2.5 w-2.5 rounded-full ${service.accentColor} shadow-[0_0_12px_rgba(255,255,255,0.2)]`}
      />
    ),
  }));

  return (
    <section className="py-24 md:py-32 px-6 md:px-12 border-t border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-accent/8 blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-12 max-w-3xl"
        >
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-6 italic leading-[1.1]">
            {config.scopeTitle}
          </h2>
          <p className="text-neutral-400 text-lg font-light leading-relaxed">
            {config.scopeIntro}
          </p>
        </motion.div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-4 md:p-6 backdrop-blur-sm overflow-hidden">
          <KnowledgeConvergence
            title={service.title}
            badgeText={config.heroBadgeLabel ?? "Service intelligence"}
            showBadge
            sources={sources}
            dotColor="#C1FF72"
            glowIntensity="high"
            theme="dark"
            className="min-h-[420px] md:min-h-[500px] text-white"
          />
        </div>
      </div>
    </section>
  );
};

// ============ CTA SECTION ============
interface CTASectionProps {
  config: ServicePageConfig;
}

const CTASection = ({ config }: CTASectionProps) => {
  const reduceMotion = useReducedMotion();

  return (
    <section className="py-24 md:py-32 px-6 md:px-12 relative overflow-hidden">
      {/* Background Blur */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={reduceMotion ? undefined : { opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-brand-accent/10 via-transparent to-brand-accent/10 blur-3xl" />
      </motion.div>

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.8, ease: EASE }}
          className="text-5xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter text-white mb-8 italic leading-[0.9]"
        >
          {config.ctaTitle}
        </motion.h2>

        {config.ctaSubtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={VIEWPORT}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="text-neutral-400 text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            {config.ctaSubtitle}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ delay: 0.3, duration: 0.6, ease: EASE }}
        >
          <MagneticLink
            to="/contact"
            strength={0.25}
            className="group relative inline-flex items-center gap-3 px-10 py-5 md:px-16 md:py-6 bg-brand-accent text-brand-primary font-bold text-xl md:text-2xl rounded-full overflow-hidden transition-shadow duration-300 hover:shadow-2xl hover:shadow-brand-accent/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-accent"
          >
            <span className="relative z-10">{config.ctaButtonLabel}</span>
            <ArrowUpRight className="w-6 h-6 md:w-8 md:h-8 relative z-10 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            <motion.div
              className="absolute inset-0 bg-white"
              initial={{ x: "100%" }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
            />
          </MagneticLink>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicePage;
