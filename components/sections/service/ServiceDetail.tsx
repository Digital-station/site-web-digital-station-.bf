import type { CSSProperties } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Compass,
  Handshake,
  Users2,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/routing";
import { waHref } from "@/config/site.config";
import { Container } from "@/components/layout/Container";
import { PauseOffscreen } from "@/components/ui/PauseOffscreen";
import { WhatsAppIcon } from "@/components/ui/icons/WhatsApp";
import { MagneticLink, Spotlight } from "./primitives";
import { HeroSection } from "./HeroSection";
import { KnowledgeConvergenceLazy } from "./KnowledgeConvergenceLazy";
import { ServiceParallax } from "./ServiceParallax";
import { getServiceContent, type ServiceContent } from "@/lib/service-content";
import { SERVICES, type ServiceMeta } from "@/content/services";

/**
 * Server component. The page's one genuinely continuous (scroll-scrubbed)
 * animation — the giant title parallax — lives in `ServiceParallax`, a thin
 * client wrapper; the cursor-tracked hero tilt lives in `HeroSection`, its
 * own client component. Everything else below is static content, with
 * one-time scroll reveals done through `data-rv` (see RevealRoot) instead
 * of GSAP/Motion. The page rendering this must wrap it in `<RevealRoot>` —
 * see app/[locale]/services/[slug]/page.tsx.
 */
export async function ServiceDetail({ service }: { service: ServiceMeta }) {
  const content = await getServiceContent(service.slug);
  const tn = await getTranslations("nav");
  const tc = await getTranslations("common");

  return (
    <ServiceParallax key={service.slug}>
      <HeroSection
        service={service}
        content={content}
        labels={{
          home: tn("home"),
          services: tn("services"),
          breadcrumbLabel: tn("breadcrumbLabel"),
          whatsappCta: tc("whatsappCta"),
          promise: tc("promise"),
        }}
      />
      <OrientationStrip service={service} />
      <BenefitsSection service={service} content={content} />
      <FeaturesSection content={content} />
      <ScopeSection service={service} content={content} />
      <RelatedServices service={service} />
      <CtaSection content={content} />
    </ServiceParallax>
  );
}

/* ========================= ORIENTATION STRIP ========================= */

/**
 * Three plain answers, immediately under the hero: who the service is for,
 * how an engagement starts, and what we commit to. Everything above used to
 * be atmosphere — a badge, a metric with no source, and a CTA.
 */
async function OrientationStrip({ service }: { service: ServiceMeta }) {
  const d = await getTranslations("servicePage.defaults");
  const tc = await getTranslations("common");
  const ts = await getTranslations("services.items");

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

async function BenefitsSection({
  service,
  content,
}: {
  service: ServiceMeta;
  content: ServiceContent;
}) {
  return (
    <section className="py-24 lg:py-32 border-t border-brand-border relative overflow-hidden">
      <Container>
        <div data-rv className="mb-16 max-w-2xl">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-[1.15] text-balance break-words">
              {content.whyUsTitle}
            </h2>
          </div>
          <p className="text-brand-muted text-lg leading-relaxed">
            {content.whyUsIntro}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 benefits-grid">
          {content.whyUsItems.map((benefit) => (
            <div
              key={benefit}
              className="benefit-card group relative p-6 md:p-8 rounded-2xl border border-brand-border bg-brand-surface hover:border-brand-accent/40 hover:-translate-y-[3px] transition-[color,background-color,border-color,transform] duration-300"
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
            </div>
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

async function ProcessBlock({
  service,
  content,
}: {
  service: ServiceMeta;
  content: ServiceContent;
}) {
  const d = await getTranslations("servicePage.defaults");

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

async function FeaturesSection({ content }: { content: ServiceContent }) {
  const showSideColumn = Boolean(content.platforms) || content.hasOwnWhyUsItems;

  return (
    <PauseOffscreen className="py-24 lg:py-32 bg-brand-surface border-y border-brand-border relative overflow-hidden">
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
          <div data-rv>
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
          </div>

          {/*
            Only cloud-hebergement defines `platforms`. Where it is absent the
            column used to fall back to a metric card plus two of the four
            process steps; the steps now live in their own block above and the
            metric is gone, so the column simply collapses to one column.
          */}
          {content.platforms ? (
            <div className="grid sm:grid-cols-2 gap-6">
              {content.platforms.map((platform, i) => (
                <div
                  key={platform.name}
                  data-rv
                  style={{ "--rv-delay": `${i * 0.08}s` } as CSSProperties}
                  className="group relative p-6 md:p-8 rounded-2xl border border-brand-border bg-brand-primary/40 hover:border-brand-accent/50 hover:-translate-y-2 transition-[border-color,transform] duration-300 overflow-hidden"
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
                </div>
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
    </PauseOffscreen>
  );
}

/* ============================== SCOPE ============================== */

async function ScopeSection({
  service,
  content,
}: {
  service: ServiceMeta;
  content: ServiceContent;
}) {
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
        <div data-rv className="mb-12 max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6 italic leading-[1.15] text-balance break-words">
            {content.scopeTitle}
          </h2>
          <p className="text-brand-muted text-lg font-light leading-relaxed">
            {content.scopeIntro}
          </p>
        </div>

        {/* aria-hidden: the diagram only repeats text that is on the page
            already (the h1, and the scope list below or the process steps
            above), and it holds nothing focusable. */}
        <div
          aria-hidden="true"
          className="rounded-[2rem] border border-brand-border bg-brand-surface p-4 md:p-6 overflow-hidden"
        >
          <KnowledgeConvergenceLazy
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
              <div
                key={item.title}
                data-rv
                style={{ "--rv-delay": `${i * 0.06}s` } as CSSProperties}
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
              </div>
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
async function RelatedServices({ service }: { service: ServiceMeta }) {
  const tn = await getTranslations("nav");
  const ts = await getTranslations("services.items");

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

async function CtaSection({ content }: { content: ServiceContent }) {
  const tc = await getTranslations("common");

  return (
    <PauseOffscreen className="py-24 lg:py-32 relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none motion-safe:animate-breathe"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-brand-accent/10 via-transparent to-brand-accent/10 blur-3xl" />
      </div>

      <Container className="relative z-10 max-w-4xl text-center">
        <h2
          data-rv
          className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter mb-8 italic leading-[1.15] text-balance break-words"
        >
          {content.ctaTitle}
        </h2>

        <p
          data-rv
          style={{ "--rv-delay": "0.15s" } as CSSProperties}
          className="text-brand-muted text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed"
        >
          {content.ctaSubtitle}
        </p>

        <div data-rv style={{ "--rv-delay": "0.3s" } as CSSProperties}>
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
        </div>
      </Container>
    </PauseOffscreen>
  );
}
