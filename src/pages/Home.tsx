import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import {
  ArrowRight,
  Zap,
  Target,
  BarChart3,
  Globe2,
  Cpu,
  MessageSquare,
  Layers,
  Share2,
  Rocket,
  Filter,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { SERVICES } from "../constants";
import { FutureMarketing2026 } from "../components/sections/FutureMarketing2026";
import { IndustriesWeServe } from "../components/sections/IndustriesWeServe";
import { ToolsWeMaster } from "../components/sections/ToolsWeMaster";
import { Wavemesh } from "../components/decor/Wavemesh";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-line",
        {
          y: 100,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: "power4.out",
          clearProps: "all",
        },
      );

      gsap.fromTo(
        ".hero-accent-text",
        {
          x: -50,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          delay: 0.3,
          ease: "power2.out",
          clearProps: "all",
        },
      );

      // Scroll reveal for stats
      gsap.fromTo(
        ".stat-item",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          scrollTrigger: {
            trigger: ".stats-container",
            start: "top 95%",
            toggleActions: "play none none none",
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
  }, []);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative pt-24 md:pt-40 lg:pt-48 pb-0 overflow-hidden lg:pl-16 min-h-[90vh] flex flex-col"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex-1 flex flex-col justify-center relative w-full">
        {/* Wavemesh woven-wave backdrop (bottom-right; bottom-left on mobile) */}
        <Wavemesh />
        <div className="absolute -top-12 md:-top-20 left-4 text-[15vw] md:text-[240px] font-black opacity-[0.03] leading-none select-none tracking-tighter pointer-events-none uppercase">
          Digital station
        </div>

        <div className="relative z-10 text-white">
          <p className="hero-accent-text text-brand-accent text-[10px] md:text-xs uppercase tracking-[0.4em] mb-6 md:mb-8 font-mono font-bold">
            Société de services , d'expertise et d'ingénierie informatique
          </p>

          <h1
            ref={titleRef}
            className="text-5xl sm:text-6xl md:text-[110px] lg:text-[140px] font-black leading-[0.85] tracking-tighter uppercase mb-10 md:mb-12"
          >
            <div className="overflow-hidden">
              <div className="hero-line">Redefining</div>
            </div>
            <div className="overflow-hidden">
              <div className="hero-line italic font-serif font-light lowercase pr-2 md:pr-4 opacity-80 inline-block">
                the
              </div>
              <div className="hero-line inline-block">Digital</div>
            </div>
            <div className="overflow-hidden">
              <div className="hero-line text-brand-accent">Frontier</div>
            </div>
          </h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="flex flex-wrap gap-4 md:gap-6 mb-12 md:mb-20"
          >
            <Link
              to="/contact"
              aria-label="Contact us to start your project"
              className="btn-primary group flex items-center gap-3 px-6 py-3 text-sm md:text-base md:px-8 md:py-4"
            >
              Start Project{" "}
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="lg:pl-16 bg-brand-surface py-10 md:py-16 border-t border-brand-border">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-8 font-black text-center lg:text-left">
            Our Technology Partners
          </p>
          <div className="flex flex-wrap justify-center lg:justify-between items-center gap-8 md:gap-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
            {[
              "Microsoft",
              "Odoo",
              "Oracle",
              "autodesk",
              "Kaspersky",
              "AWS",
              "Salesforce",
            ].map((partner) => (
              <div
                key={partner}
                className="text-sm md:text-lg font-black uppercase tracking-tighter text-white whitespace-nowrap"
              >
                {partner}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-brand-border flex flex-col md:flex-row mt-auto w-full">
        <div className="md:w-1/2 border-r border-brand-border p-8 md:p-12 lg:p-20 flex flex-col justify-between gap-8 text-white bg-brand-primary">
          <p className="text-lg md:text-2xl leading-relaxed opacity-70 font-light max-w-lg">
            We consult, engineer, and design technology solutions to address
            business challenges with precision.
          </p>
        </div>

        <div className="stats-container md:w-1/2 grid grid-cols-2 bg-brand-accent text-brand-primary">
          <div className="stat-item border-r border-black/10 p-8 md:p-12 flex flex-col justify-center">
            <span className="text-4xl md:text-5xl font-black mb-1">+ 10</span>
            <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-black opacity-40">
              PÔLES D'EXPERTISE
            </span>
          </div>
          <Link
            to="/contact"
            className="stat-item p-8 md:p-12 flex flex-col justify-center group cursor-pointer relative overflow-hidden"
          >
            <div className="relative z-10 flex items-center justify-between">
              <span className="text-xl md:text-2xl font-black uppercase leading-tight italic">
                Work
                <br />
                With Us
              </span>
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-brand-primary flex items-center justify-center transition-transform group-hover:rotate-45">
                <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
              </div>
            </div>
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
          </Link>
        </div>
      </div>
    </section>
  );
};

const ServiceIcons: Record<string, any> = {
  "gbp-optimization": Globe2,
  "seo-strategy": Rocket,
  "content-marketing": MessageSquare,
  "social-media": Share2,
  "ppc-advertising": Zap,
  "ai-receptionist": Cpu,
  "crm-integrations": Layers,
  "global-branding": Target,
  "marketing-funnel": Filter,
};

const Services = () => {
  return (
    <section
      id="services"
      className="lg:pl-16 border-t border-brand-border overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {SERVICES.map((s, i) => {
            const Icon = ServiceIcons[s.slug] || Zap;
            return (
              <div
                key={i}
                className="home-service-card group p-6 sm:p-8 md:p-10 lg:p-16 border-r border-b border-brand-border hover:bg-white/[0.02] transition-all duration-500 relative h-full flex flex-col"
              >
                <Icon className="w-5 h-5 md:w-8 md:h-8 text-brand-accent mb-4 md:mb-8 opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                <span className="absolute top-4 right-6 sm:top-8 sm:right-8 md:top-10 md:right-10 font-mono text-[8px] md:text-xs opacity-20 text-white">
                  {s.num}
                </span>
                <div className="flex items-center justify-between gap-4 mb-2 sm:mb-0">
                  <h3 className="text-sm sm:text-base md:text-2xl font-black uppercase leading-tight text-white group-hover:text-brand-accent transition-colors line-clamp-2 sm:mb-4 md:mb-6">
                    {s.title}
                  </h3>
                  <Link
                    to={`/services/${s.slug}`}
                    aria-label={`Learn more about ${s.title}`}
                    className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 sm:hidden rounded-full border border-brand-accent flex items-center justify-center group cursor-pointer overflow-hidden shrink-0"
                  >
                    <div className="bg-brand-accent h-full w-full flex items-center justify-center transition-transform hover:scale-110">
                      <ArrowRight className="w-4 h-4 text-brand-primary" />
                    </div>
                  </Link>
                </div>
                <p className="hidden sm:block text-neutral-500 text-[10px] md:text-sm leading-relaxed mb-6 md:mb-12 flex-1 font-light line-clamp-3">
                  {s.desc}
                </p>
                <Link
                  to={`/services/${s.slug}`}
                  aria-label={`Learn more about ${s.title}`}
                  className="hidden sm:flex h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-full border border-brand-accent items-center justify-center group cursor-pointer overflow-hidden self-start mt-auto"
                >
                  <div className="bg-brand-accent h-full w-full flex items-center justify-center transition-transform hover:scale-110">
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-brand-primary" />
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const PortfolioPeek = () => {
  return (
    <section
      id="case-studies-peek"
      className="lg:pl-16 border-t border-brand-border overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-3">
          {[
            {
              name: "Verdia Energy",
              result: "4X Leads",
              img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2069",
            },
            {
              name: "Apex FinTech",
              result: "+$2M ARR",
              img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=2070",
            },
            {
              name: "Lumina SaaS",
              result: "-32% Customer Cost",
              img: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=2070",
            },
          ].map((item, i) => (
            <Link
              to="/case-studies"
              key={i}
              aria-label={`View ${item.name} detailed case study`}
              className={`portfolio-item group relative aspect-square sm:aspect-[4/5] overflow-hidden border-r border-brand-border ${i === 2 ? "col-span-2 lg:col-span-1 border-b" : "border-b"}`}
            >
              <img
                src={item.img}
                alt={`Digital marketing transformation for ${item.name}`}
                loading="lazy"
                width={800}
                height={1000}
                className="w-full h-full object-cover transition-all duration-700 lg:grayscale lg:opacity-60 lg:group-hover:grayscale-0 lg:group-hover:opacity-100"
              />
              <div className="absolute inset-0 lg:bg-brand-primary/40 lg:group-hover:bg-transparent transition-colors"></div>
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8 md:bottom-12 md:left-12 md:right-12 z-10 transition-transform transform translate-y-2 sm:translate-y-4 group-hover:translate-y-0 duration-500">
                <div className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-brand-accent mb-1 sm:mb-2">
                  Success Study
                </div>
                <h3 className="text-lg sm:text-3xl md:text-4xl font-black text-white uppercase leading-none mb-2 sm:mb-4">
                  {item.name}
                </h3>
                <div className="text-white/60 font-mono text-[8px] sm:text-xs md:text-sm">
                  {item.result}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTASection = () => {
  return (
    <section
      id="cta"
      className="lg:pl-16 py-16 md:py-32 lg:py-40 text-center relative overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-brand-accent/5 rounded-full blur-[120px]"></div>
      <div className="cta-content relative z-10 px-6">
        <h2 className="text-5xl md:text-8xl lg:text-[10vw] font-black italic uppercase leading-[0.85] tracking-tighter mb-10 md:mb-16 text-white">
          Let's <br /> <span className="text-brand-accent">work</span> together.
        </h2>
        <p className="text-neutral-500 text-lg md:text-xl max-w-xl mx-auto mb-12 md:mb-20 font-light leading-relaxed">
          Ready to start your project?
        </p>
        <Link
          to="/contact"
          className="btn-primary text-xl md:text-2xl px-10 py-5 md:px-16 md:py-8 inline-block tracking-tighter uppercase font-black"
        >
          Get Started Today
        </Link>
      </div>
    </section>
  );
};

export const Home = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate service cards in Home
      gsap.fromTo(
        ".home-service-card",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          scrollTrigger: {
            trigger: "#services",
            start: "top 95%",
            toggleActions: "play none none none",
          },
        },
      );

      // Portfolio items
      gsap.fromTo(
        ".portfolio-item",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          scrollTrigger: {
            trigger: "#case-studies-peek",
            start: "top 95%",
            toggleActions: "play none none none",
          },
        },
      );

      // CTA entrance
      gsap.fromTo(
        ".cta-content",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: "#cta",
            start: "top 95%",
            toggleActions: "play none none none",
          },
        },
      );
    }, containerRef);

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 800);

    return () => {
      ctx.revert();
      clearTimeout(timer);
    };
  }, []);

  return (
    <div ref={containerRef}>
      <Helmet>
        <title>GMB Rankup | Digital Marketing Excellence 2026</title>
        <meta
          name="description"
          content="Elevate your brand with GMB Rankup. Expert SEO, PPC, and AI-driven marketing strategies designed for the 2026 digital landscape."
        />
        <meta
          name="keywords"
          content="digital marketing, SEO, GMB optimization, AI marketing, branding, growth strategy"
        />
        <link rel="canonical" href="https://bestprodigital.com" />
        <meta
          property="og:title"
          content="Best Pro Digital | Premier GMB & Local SEO Agency"
        />
        <meta
          property="og:description"
          content="High-performance digital marketing specialized in GMB optimization and technical SEO."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://bestprodigital.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Best Pro Digital | Premier GMB & Local SEO Agency"
        />
        <meta
          name="twitter:description"
          content="High-performance digital marketing specialized in GMB optimization and technical SEO."
        />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Best Pro Digital",
              "alternateName": "GMB Rankup",
              "url": "https://bestprodigital.com",
              "logo": "https://bestprodigital.com/logo.png",
              "description": "Expert SEO, PPC, and AI-driven marketing strategies designed for the 2026 digital landscape.",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "Global"
              },
              "sameAs": [
                "https://facebook.com/bestprodigital",
                "https://twitter.com/bestprodigital",
                "https://instagram.com/bestprodigital",
                "https://linkedin.com/company/bestprodigital"
              ]
            }
          `}
        </script>
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Best Pro Digital",
              "image": "https://bestprodigital.com/og-image.jpg",
              "@id": "https://bestprodigital.com",
              "url": "https://bestprodigital.com",
              "telephone": "+18004769776",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Silicon Valley",
                "addressLocality": "San Jose",
                "addressRegion": "CA",
                "postalCode": "95113",
                "addressCountry": "US"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 37.3382,
                "longitude": -121.8863
              },
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday"
                ],
                "opens": "09:00",
                "closes": "18:00"
              },
              "priceRange": "$$$"
            }
          `}
        </script>
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [{
                "@type": "Question",
                "name": "What is the Best Pro Digital difference in 2026?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "In 2026, digital success is dictated by semantic authority and AI-driven behavior prediction. We leverage proprietary neuro-mapping and GMB dominance algorithms that traditional agencies haven't adapted to yet."
                }
              }, {
                "@type": "Question",
                "name": "How fast can I expect GMB Map Pack results?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "While standard SEO takes months, our hyper-local synchronization protocols often yield signal jumps within the first 45 days of deployment."
                }
              }]
            }
          `}
        </script>
      </Helmet>
      <Hero />
      <Services />
      <IndustriesWeServe />
      <ToolsWeMaster />
      {/* <PortfolioPeek /> I will add this later , when I have the portfolio ready */}
      <CTASection />
    </div>
  );
};
