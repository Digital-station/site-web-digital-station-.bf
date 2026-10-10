import type { CSSProperties } from "react";
import {
  Brain,
  Cpu,
  Globe,
  MapPin,
  ShieldCheck,
  Target,
  Users2,
  type LucideIcon,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/routing";
import { waHref } from "@/config/site.config";
import { SERVICES } from "@/content/services";
import { Container } from "@/components/layout/Container";
import { WhatsAppIcon } from "@/components/ui/icons/WhatsApp";
import { DirectorWord } from "./DirectorWord";
import { Process } from "./Process";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Timeline } from "./Timeline";
import { TrustDocSizes } from "./TrustDocuments";
// {import { TrustDocuments, type TrustDocSizes } from "./TrustDocuments" };

/* ── DATA (icons + keys only; all prose lives in messages) ── */

const VALUE_KEYS = [
  "excellence",
  "innovation",
  "partnership",
  "local",
] as const;
const VALUE_ICONS: LucideIcon[] = [ShieldCheck, Brain, Users2, Globe];

/**
 * The four disciplines that make up the team.
 *
 * These used to carry head-counts ("25+ Développeurs", "8+ Experts IA") and a
 * "50+ Experts dédiés" headline. None of those numbers could be sourced, so
 * only the discipline labels remain — the same keys, minus `.count`.
 */
const TEAM_DISCIPLINE_KEYS = [
  "developers",
  "consultants",
  "ai",
  "support",
] as const;
const TEAM_DISCIPLINE_ICONS: LucideIcon[] = [Cpu, Target, Brain, ShieldCheck];

const EXPERTISE_KEYS = [
  "webMobile",
  "cloud",
  "ai",
  "security",
  "consulting",
  "transformation",
  "data",
  "training",
] as const;

/**
 * Server component — every section below resolves its own translations with
 * `getTranslations` (next-intl/server) rather than the client `useTranslations`
 * hook, and the scroll reveals that used to run through GSAP/Motion now use
 * the `data-rv` + RevealRoot pattern the home page already ships (a ~500-byte
 * IntersectionObserver vs. pulling GSAP + ScrollTrigger into this page's
 * client bundle for what is entirely static text). The page that renders this
 * must wrap it in `<RevealRoot>` for the reveals to arm — see
 * app/[locale]/about/page.tsx.
 */
export async function AboutContent({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  trustDocSizes,
}: {
  trustDocSizes?: TrustDocSizes;
}) {
  return (
    <>
      <Hero />
      <Mission />
      <Values />
      {/*
      <Timeline />
      */}
      <TeamPreview />
      <DirectorWord />
      {/* <TrustDocuments sizes={trustDocSizes} /> */}
      <Process />
      <AboutCta />
    </>
  );
}

/* ─────────────────────────────── HERO ─────────────────────────────── */

async function Hero() {
  const t = await getTranslations("about.hero");

  const quickStats = [
    { icon: Cpu, value: `${SERVICES.length}`, label: t("statDomains") },
    { icon: MapPin, value: null, label: t("statLocal") },
  ];

  return (
    /* The hero's entrances are the CSS `.enter` animation (see globals.css):
       Motion's `initial` shipped the intro, CTAs and stats at opacity 0 in the
       server HTML, and the GSAP headline tween re-hid text already painted. */
    <section className="relative pt-32 md:pt-44 pb-24 lg:pb-32 overflow-hidden lg:pl-16 min-h-[80vh] flex flex-col">
      <div
        aria-hidden="true"
        className="absolute top-20 right-10 w-96 h-96 bg-brand-accent/10 rounded-full blur-3xl pointer-events-none"
      />

      <Container className="flex-1 flex flex-col justify-center relative">
        <div className="relative z-10">
          <div className="enter [--enter-x:-20px] [--enter-delay:0.2s] [--enter-duration:0.6s] flex items-center gap-3 mb-6 md:mb-8">
            <p className="text-brand-accent text-[11px] md:text-xs uppercase tracking-wide font-mono font-bold">
              {t("eyebrow")}
            </p>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-[104px] lg:text-[132px] font-black leading-[1.15] tracking-tighter uppercase mb-10 md:mb-14 text-balance break-words">
            <span className="block">
              <span className="enter [--enter-y:100px] block">
                {t("titleLine1")}
              </span>
            </span>
            <span className="block">
              <span className="enter [--enter-y:100px] [--enter-delay:0.1s] italic font-serif font-light lowercase pr-2 md:pr-4 opacity-80 inline-block">
                {t("titleLine2")}
              </span>
            </span>
            <span className="block">
              <span className="enter [--enter-y:100px] [--enter-delay:0.2s] block text-brand-accent">
                {t("titleLine3")}
              </span>
            </span>
          </h1>

          <p className="enter [--enter-y:20px] text-brand-muted text-base md:text-xl max-w-2xl font-light leading-relaxed mb-8 md:mb-12">
            {t("intro")}
          </p>

          <div className="enter [--enter-y:20px] [--enter-delay:1.3s] flex flex-wrap gap-4 md:gap-6">
            <Link
              href="/services"
              className="btn-primary group flex items-center gap-3 px-6 py-3 text-sm md:text-base md:px-8 md:py-4"
            >
              {t("ctaServices")}
            </Link>
            <Link
              href="/contact"
              className="btn-outline px-6 py-3 text-sm md:text-base md:px-8 md:py-4"
            >
              {t("ctaContact")}
            </Link>
          </div>

          <div className="enter [--enter-y:30px] [--enter-delay:1.5s] mt-16 md:mt-20 flex flex-wrap gap-8 md:gap-12">
            {quickStats.map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-brand-accent-soft flex items-center justify-center shrink-0">
                  <s.icon
                    className="w-5 h-5 text-brand-accent"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  {s.value && (
                    <div className="text-2xl font-black">{s.value}</div>
                  )}
                  <div className="text-[11px] md:text-xs uppercase tracking-wide text-brand-muted">
                    {s.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ───────────────────────────── MISSION ───────────────────────────── */

async function Mission() {
  const t = await getTranslations("about.mission");
  const expertises = EXPERTISE_KEYS.map((k) => t(`expertises.${k}`));

  return (
    <section className="lg:pl-16 border-t border-brand-border">
      <Container className="grid grid-cols-1 lg:grid-cols-2 px-0 lg:px-0">
        <div className="p-8 md:p-12 lg:p-20 lg:border-r border-brand-border flex flex-col justify-center">
          {/* Scroll reveals are `data-rv` (see RevealRoot): the old GSAP
              ScrollTrigger stagger (0.12s per element) cost a ~110 KB
              dependency for a fade-up, same reasoning as the home page. */}
          <p
            data-rv
            className="text-brand-accent text-[11px] md:text-xs uppercase tracking-wide mb-6 md:mb-8 font-mono font-bold"
          >
            {t("eyebrow")}
          </p>
          <h2
            data-rv
            style={{ "--rv-delay": "0.12s" } as CSSProperties}
            // lg:text-5xl, not 6xl: "TECHNOLOGIQUE" did not fit the half-width
            // column at 1440px and `break-words` split it mid-word.
            className="text-3xl md:text-5xl lg:text-5xl xl:text-6xl font-black uppercase tracking-tight leading-tight mb-6 md:mb-10 text-balance break-words"
          >
            {t.rich("title", {
              accent: (chunks) => (
                <span className="text-brand-accent italic font-serif font-light lowercase">
                  {chunks}
                </span>
              ),
            })}
          </h2>
          <p
            data-rv
            style={{ "--rv-delay": "0.24s" } as CSSProperties}
            className="text-brand-muted text-sm md:text-base leading-relaxed max-w-lg font-light"
          >
            {t("body1")}
          </p>
          <p
            data-rv
            style={{ "--rv-delay": "0.36s" } as CSSProperties}
            className="text-brand-muted text-sm md:text-base leading-relaxed max-w-lg font-light mt-4"
          >
            {t("body2")}
          </p>

          <div
            data-rv
            style={{ "--rv-delay": "0.48s" } as CSSProperties}
            className="mt-8 flex flex-wrap gap-2"
          >
            {expertises.slice(0, 5).map((exp) => (
              <span
                key={exp}
                className="px-3 py-1.5 text-[11px] uppercase tracking-wide font-bold border border-brand-border rounded-full text-brand-muted hover:border-brand-accent hover:text-brand-accent transition-colors"
              >
                {exp}
              </span>
            ))}
            <span className="px-3 py-1.5 text-[11px] uppercase tracking-wide font-bold border border-brand-accent/50 rounded-full text-brand-accent">
              {t("moreExpertises", { count: expertises.length - 5 })}
            </span>
          </div>
        </div>

        {/*
          One counter, not four. "Projets livrés (500+)", "Taux de satisfaction
          (98 %)" and the "24/7 Supervision & support" tile were all unsourced;
          the number of service areas is simply `SERVICES.length`.
        */}
        <div className="bg-brand-surface border-t lg:border-t-0 border-brand-border flex flex-col items-center justify-center text-center gap-4 p-12 md:p-20">
          <Cpu className="w-8 h-8 md:w-10 md:h-10 text-brand-accent/60 mb-2" />
          <span className="text-6xl md:text-8xl font-black tracking-tighter">
            {SERVICES.length}
          </span>
          <span className="text-[11px] md:text-xs uppercase tracking-wide text-brand-muted font-black">
            {t("statServices")}
          </span>
        </div>
      </Container>
    </section>
  );
}

/* ───────────────────────────── VALUES ───────────────────────────── */

async function Values() {
  const t = await getTranslations("about.values");

  return (
    <section className="lg:pl-16 border-t border-brand-border py-24 lg:py-32">
      <Container>
        <div className="mb-14 md:mb-20">
          <p className="text-brand-accent text-[11px] md:text-xs uppercase tracking-wide mb-6 font-mono font-bold flex items-center gap-2">
            {t("eyebrow")}
          </p>
          <h2 className="text-3xl md:text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-[1.15] text-balance break-words">
            {t.rich("title", {
              accent: (chunks) => (
                <span className="text-brand-accent italic font-serif font-light lowercase">
                  {chunks}
                </span>
              ),
            })}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-brand-border border border-brand-border">
          {VALUE_KEYS.map((key, i) => {
            const Icon = VALUE_ICONS[i];
            return (
              <div
                key={key}
                data-rv
                style={{ "--rv-delay": `${i * 0.08}s` } as CSSProperties}
                className="value-card group bg-brand-primary p-8 md:p-14 hover:bg-brand-accent-soft transition-colors duration-500 relative overflow-hidden grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4 md:gap-6"
              >
                <Icon className="w-8 h-8 md:w-10 md:h-10 text-brand-accent group-hover:scale-110 transition-transform duration-500" />
                <h3 className="text-xl md:text-3xl font-black uppercase tracking-normal mb-4 leading-tight text-balance break-words">
                  {t(`items.${key}.title`)}
                </h3>
                <p className="text-brand-muted text-sm md:text-base leading-relaxed font-light max-w-md md:col-span-2">
                  {t(`items.${key}.desc`)}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

/* ─────────────────────────── TEAM PREVIEW ─────────────────────────── */

async function TeamPreview() {
  const t = await getTranslations("about.team");

  return (
    /*
      The two columns used to animate in from `x: ±50`, which parked the left
      column's text at 62px on a 1440px viewport — under the 64px LeftRail —
      until the section scrolled into view, and pushed the right column 50px
      past the page edge in the meantime. They now rise on `y` instead (the
      RevealRoot default), so the resting and starting horizontal positions
      are the same one.
    */
    <section className="lg:pl-16 border-t border-brand-border py-24 lg:py-32 overflow-hidden">
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 md:gap-20 items-center">
          <div data-rv>
            <p className="text-brand-accent text-[11px] md:text-xs uppercase tracking-wide mb-6 font-mono font-bold flex items-center gap-2">
              {t("eyebrow")}
            </p>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-[1.15] mb-6 text-balance break-words">
              {t.rich("title", {
                accent: (chunks) => (
                  <span className="text-brand-accent italic font-serif font-light lowercase">
                    {chunks}
                  </span>
                ),
              })}
            </h2>
            <p className="text-brand-muted text-base md:text-lg leading-relaxed">
              {t("body")}
            </p>
          </div>

          {/*
            Disciplines, not head-counts. The four "25+ / 15+ / 8+ / 10+"
            cards, the "50+ Experts dédiés" ring and the "Certifié" /
            "Innovation" floating badges are gone — none of them could be
            sourced, and "Certifié" implied a vendor accreditation.
          */}
          <ul
            data-rv
            style={{ "--rv-delay": "0.2s" } as CSSProperties}
            className="grid grid-cols-2 gap-4"
          >
            {TEAM_DISCIPLINE_KEYS.map((key, i) => {
              const Icon = TEAM_DISCIPLINE_ICONS[i];
              return (
                <li
                  key={key}
                  className="bg-brand-surface border border-brand-border rounded-xl p-5 md:p-6 hover:border-brand-accent/50 transition-colors"
                >
                  <Icon className="w-6 h-6 text-brand-accent mb-3" />
                  <span className="block text-sm md:text-base font-bold uppercase tracking-tight text-balance">
                    {t(`stats.${key}.label`)}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </section>
  );
}

/* ─────────────────────────────── CTA ─────────────────────────────── */

async function AboutCta() {
  const t = await getTranslations("about.cta");
  const tc = await getTranslations("common");

  return (
    <section className="relative overflow-hidden lg:pl-16">
      <div className="bg-brand-accent-strong text-brand-on-accent py-24 lg:py-32 text-center relative">
        <div
          aria-hidden="true"
          className="absolute top-10 left-10 w-20 h-20 border border-white/20 rounded-full"
        />
        <div
          aria-hidden="true"
          className="absolute bottom-10 right-10 w-32 h-32 border border-white/20 rounded-full"
        />

        <Container className="relative z-10 max-w-5xl">
          <p
            data-rv
            className="text-[11px] md:text-xs uppercase tracking-wide mb-6 font-black opacity-90"
          >
            {t("eyebrow")}
          </p>
          <h2
            data-rv
            style={{ "--rv-delay": "0.1s" } as CSSProperties}
            className="text-4xl md:text-6xl lg:text-[7vw] font-black uppercase leading-[1.15] tracking-tighter mb-8 md:mb-12 text-balance break-words"
          >
            {t.rich("title", {
              br: () => <br className="hidden md:block" />,
              accent: (chunks) => (
                <span className="italic font-serif font-light lowercase">
                  {chunks}
                </span>
              ),
            })}
          </h2>
          <p
            data-rv
            style={{ "--rv-delay": "0.2s" } as CSSProperties}
            className="text-base md:text-lg font-light max-w-xl mx-auto mb-10 md:mb-14 opacity-90"
          >
            {t("body")}
          </p>
          <div
            data-rv
            style={{ "--rv-delay": "0.3s" } as CSSProperties}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 bg-brand-on-accent text-brand-accent-strong px-8 py-4 md:px-12 md:py-5 rounded-full font-black uppercase text-sm md:text-base tracking-tight hover:scale-105 active:scale-95 transition-transform"
            >
              {t("ctaPrimary")}
            </Link>
            <a
              href={waHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 border-2 border-current px-8 py-4 md:px-12 md:py-5 rounded-full font-black uppercase text-sm md:text-base tracking-tight hover:bg-brand-on-accent hover:text-brand-accent-strong transition-all"
            >
              <WhatsAppIcon size={20} />
              {tc("whatsappCta")}
            </a>
            <Link
              href="/services"
              className="inline-flex items-center gap-3 border-2 border-current px-8 py-4 md:px-12 md:py-5 rounded-full font-black uppercase text-sm md:text-base tracking-tight hover:bg-brand-on-accent hover:text-brand-accent-strong transition-all"
            >
              {t("ctaSecondary")}
            </Link>
          </div>

          {/* Full opacity: this sits on the saturated accent panel, where a
              90% white already costs contrast the palette had budgeted. */}
          <p className="mt-6 text-xs md:text-sm font-light">{tc("promise")}</p>
        </Container>
      </div>
    </section>
  );
}
