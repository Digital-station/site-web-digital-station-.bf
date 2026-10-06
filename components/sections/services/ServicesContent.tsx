import type { CSSProperties } from "react";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  BrainCircuit,
  Cpu,
  Plus,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/routing";
import { SERVICES } from "@/content/services";
import { Container } from "@/components/layout/Container";
import { PauseOffscreen } from "@/components/ui/PauseOffscreen";
import { getServiceIcon } from "@/lib/service-icons";
import { ServicesParallax } from "./ServicesParallax";

const PHILOSOPHY_KEYS = ["first", "second", "third"] as const;
const PHILOSOPHY_ICONS: Record<string, LucideIcon> = {
  first: BarChart3,
  second: Target,
  third: Cpu,
};

/**
 * Server component. The page's only continuous (scroll-scrubbed) animation —
 * the two `.bg-orb` blobs — lives in `ServicesParallax`, a thin client
 * wrapper; everything else is static content, with one-time scroll reveals
 * done through `data-rv` (see RevealRoot) instead of GSAP/Motion. The page
 * rendering this must wrap it in `<RevealRoot>` for those to arm — see
 * app/[locale]/services/page.tsx.
 */
export async function ServicesContent() {
  const t = await getTranslations("servicesPage");
  const ts = await getTranslations("services.items");

  return (
    <ServicesParallax>
      <div
        aria-hidden="true"
        className="bg-orb absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-brand-accent/10 rounded-full blur-[160px] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="bg-orb absolute bottom-0 left-[-10%] w-[50vw] h-[50vw] bg-brand-accent/5 rounded-full blur-[140px] pointer-events-none"
      />

      <Container className="relative z-10">
        <header className="mb-24 lg:mb-32">
          <div className="flex items-center gap-3 text-brand-accent mb-8">
            <div className="enter [--enter-x:-20px] [--enter-duration:0.6s] flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              <span className="text-[11px] md:text-xs font-black uppercase tracking-wide">
                {t("eyebrow")}
              </span>
            </div>
          </div>

          {/* 7vw only from `lg` up: at `md` (768px) it came to 54px, smaller
              than the 72px `sm` size below it. At 1024px 7vw is ~72px, so the
              size grows without a step. */}
          <h1 className="text-5xl sm:text-7xl lg:text-[7vw] font-black uppercase leading-[1.15] tracking-tighter text-balance break-words">
            <span className="enter [--enter-y:40px] block">
              {t("titleLine1")}
            </span>
            <span className="enter [--enter-y:40px] [--enter-delay:0.1s] block italic font-serif font-light text-brand-accent lowercase">
              {t("titleLine2")}
            </span>
            <span className="enter [--enter-y:40px] [--enter-delay:0.2s] block">
              {t("titleLine3")}
            </span>
          </h1>

          <div className="mt-10 md:mt-16 flex flex-col lg:flex-row gap-10 md:gap-12 items-start lg:items-end">
            <p className="enter [--enter-y:40px] [--enter-delay:0.3s] text-base md:text-xl lg:text-2xl text-brand-muted max-w-2xl font-light leading-relaxed">
              {t("intro")}
            </p>
            <div className="hidden lg:block h-px flex-grow bg-brand-border mb-6" />
            {/*
              One figure, not two. "20+ Entreprises accompagnées" was an
              unsourced client count; the number of expertise areas is simply
              the length of the catalogue.
            */}
            <div className="enter [--enter-y:40px] [--enter-delay:0.4s]">
              <div className="text-3xl md:text-4xl font-black">
                {t("stat2Value")}
              </div>
              <div className="text-[11px] md:text-xs uppercase font-black text-brand-muted tracking-wide mt-1">
                {t("stat2Label")}
              </div>
            </div>
          </div>
        </header>

        {/* Philosophy */}
        <section className="mb-24 lg:mb-32 grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {PHILOSOPHY_KEYS.map((key, i) => {
            const Icon = PHILOSOPHY_ICONS[key];
            return (
              <div
                key={key}
                data-rv
                style={{ "--rv-delay": `${i * 0.1}s` } as CSSProperties}
                className="p-8 md:p-10 bg-brand-surface border border-brand-border rounded-[2rem] md:rounded-[2.5rem] hover:border-brand-accent/40 transition-all flex flex-col justify-center group"
              >
                <div className="flex items-center gap-4 md:gap-6 mb-4 md:mb-6">
                  <Icon className="w-8 h-8 md:w-10 md:h-10 text-brand-accent shrink-0 group-hover:scale-110 transition-transform duration-500" />
                  {/* h2, not h3: nothing sits between these and the h1. */}
                  <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter leading-tight whitespace-normal">
                    {t(`philosophy.${key}.title`)}
                  </h2>
                </div>
                <p className="text-brand-muted text-xs md:text-sm leading-relaxed font-light">
                  {t(`philosophy.${key}.desc`)}
                </p>
              </div>
            );
          })}
        </section>

        {/*
          The numbered 01–10 card grid is gone.
          It duplicated, card for card, the "Comprendre nos métiers" index
          directly below it — the same ten titles, the same ten descriptions,
          twice on one page — while adding ~5200px of scroll. The index below
          is now the page's single service list, and every entry links to
          /services/<slug>.
        */}
        <section
          aria-labelledby="services-index-heading"
          className="border-t border-brand-border pt-24 lg:pt-32"
        >
          <header className="mb-16 md:mb-24">
            <div className="flex items-center gap-3 text-brand-accent mb-6">
              <BrainCircuit className="w-6 h-6" />
              <span className="text-[11px] md:text-xs font-black uppercase tracking-wide">
                {t("knowledgeEyebrow")}
              </span>
            </div>
            <h2
              id="services-index-heading"
              className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8 leading-[1.15] text-balance break-words"
            >
              {t("knowledgeTitleLead")}{" "}
              <span className="italic font-serif font-light lowercase text-brand-accent">
                {t("knowledgeTitleAccent")}
              </span>
            </h2>
            <p className="max-w-2xl text-brand-muted text-base md:text-lg font-light leading-relaxed">
              {t("knowledgeIntro")}
            </p>
          </header>

          <ul className="knowledge-grid grid sm:grid-cols-2 lg:grid-cols-3 gap-y-16 md:gap-y-20 gap-x-8 md:gap-x-12">
            {SERVICES.map((s, i) => {
              const Icon = getServiceIcon(s.slug);
              const benefits = ts.raw(`${s.slug}.benefits`) as string[];
              const title = ts(`${s.slug}.title`);
              return (
                <li
                  key={s.slug}
                  data-rv
                  style={{ "--rv-delay": `${i * 0.1}s` } as CSSProperties}
                  className="border-l border-brand-border pl-6 md:pl-8 group"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <Icon className="w-5 h-5 text-brand-accent shrink-0" />
                    <span className="font-mono text-[11px] md:text-xs text-brand-muted">
                      {s.num}
                    </span>
                  </div>

                  <h3 className="text-lg md:text-xl font-black uppercase tracking-tight leading-[1.15] mb-4 text-balance break-words">
                    {/*
                      `min-h-11` plus padding cancelled by an equal negative
                      margin: the ten index links are the only route into a
                      service page from here, and a single-line title is a
                      20px-tall tap target without it. The visual layout is
                      unchanged — only the hit area grows to the 44px floor.
                    */}
                    <Link
                      href={`/services/${s.slug}`}
                      className="inline-flex min-h-11 items-start gap-2 py-2.5 -my-2.5 hover:text-brand-accent transition-colors"
                    >
                      {title}
                      <ArrowUpRight className="w-4 h-4 mt-1 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </h3>

                  <p className="text-brand-muted text-xs md:text-sm leading-relaxed mb-6 font-light">
                    {ts(`${s.slug}.longDesc`)}
                  </p>

                  <ul className="space-y-3">
                    {benefits.map((b) => (
                      <li key={b} className="flex items-center gap-3">
                        <Plus className="w-3 h-3 text-brand-accent opacity-60 shrink-0" />
                        <span className="text-[11px] md:text-xs uppercase font-bold text-brand-muted tracking-wide font-mono">
                          {b}
                        </span>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Global scale */}
        <PauseOffscreen className="mt-24 lg:mt-32 bg-brand-surface border border-brand-border rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-16 lg:p-24 relative overflow-hidden group">
          <div className="relative z-10 grid lg:grid-cols-2 gap-16 md:gap-24 items-center">
            <div>
              <div className="flex items-center gap-3 text-brand-accent mb-8 md:mb-10">
                <Activity className="w-6 h-6" />
                <span className="text-[11px] md:text-xs font-black uppercase tracking-wide">
                  {t("scaleEyebrow")}
                </span>
              </div>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter mb-8 md:mb-12 leading-[1.15] text-balance break-words">
                {t("scaleTitleLead")}{" "}
                <span className="text-brand-accent italic font-serif lowercase">
                  {t("scaleTitleAccent")}
                </span>
              </h2>
              <p className="text-brand-muted text-lg md:text-xl leading-relaxed mb-10 md:mb-16 max-w-lg font-light">
                {t("scaleBody")}
              </p>

              <div className="grid sm:grid-cols-2 gap-8 md:gap-12">
                <div className="flex gap-6 items-start">
                  <ShieldCheck className="w-8 h-8 text-brand-accent flex-shrink-0" />
                  <div>
                    <h3 className="font-bold uppercase tracking-tight mb-2 text-balance">
                      {t("scalePoint1Title")}
                    </h3>
                    <p className="text-brand-muted text-xs md:text-sm leading-relaxed font-light">
                      {t("scalePoint1Desc")}
                    </p>
                  </div>
                </div>
                <div className="flex gap-6 items-start">
                  <Zap className="w-8 h-8 text-brand-accent flex-shrink-0" />
                  <div>
                    <h3 className="font-bold uppercase tracking-tight mb-2 text-balance">
                      {t("scalePoint2Title")}
                    </h3>
                    <p className="text-brand-muted text-xs md:text-sm leading-relaxed font-light">
                      {t("scalePoint2Desc")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative flex justify-center">
              <div className="aspect-square w-full max-w-sm md:max-w-lg bg-brand-surface-2 shadow-card rounded-full border border-brand-border relative flex items-center justify-center overflow-hidden">
                {/* CSS loops (globals.css), paused by `usePauseOffscreen`
                    (via the PauseOffscreen wrapper above) while this block
                    is off screen. */}
                <div className="w-[80%] h-[80%] border-2 border-dashed border-brand-accent/30 rounded-full motion-safe:animate-[turn_90s_linear_infinite_reverse,swell_5s_ease-in-out_infinite]" />
                <div className="absolute w-[95%] h-[95%] border border-brand-border rounded-full motion-safe:animate-[turn_40s_linear_infinite]" />
                <div className="absolute flex flex-col items-center text-center px-6">
                  <div
                    aria-hidden="true"
                    className="w-16 h-16 md:w-20 md:h-20 bg-brand-accent/20 rounded-full blur-2xl absolute"
                  />
                  <span className="text-[11px] md:text-xs font-black uppercase text-brand-accent tracking-wide mb-4 relative z-10">
                    {t("vizLabel")}
                  </span>
                  <span className="text-3xl md:text-4xl lg:text-5xl font-black italic relative z-10">
                    {t("vizValue")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </PauseOffscreen>

        {/* CTA */}
        <section className="mt-24 lg:mt-32 text-center">
          <h2 className="text-5xl md:text-7xl lg:text-[8vw] font-black uppercase tracking-tighter mb-16 md:mb-20 leading-[1.15] text-balance break-words">
            {t("ctaTitleLead")}{" "}
            <span className="text-brand-accent italic font-serif lowercase">
              {t("ctaTitleAccent")}
            </span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 md:gap-8 justify-center items-center">
            <Link
              href="/contact"
              className="group w-full sm:w-auto flex gap-6 md:gap-8 items-center justify-center bg-brand-accent-strong text-brand-on-accent px-8 md:px-16 py-6 md:py-8 text-xs md:text-sm font-black uppercase tracking-wide transition-all hover:scale-105 active:scale-95 rounded-full"
            >
              {t("ctaPrimary")}
              <ArrowUpRight className="w-6 h-6 group-hover:rotate-45 transition-transform" />
            </Link>
            <Link
              href="/solutions"
              className="group w-full sm:w-auto flex gap-4 items-center justify-center border border-brand-border px-8 md:px-16 py-6 md:py-8 text-xs md:text-sm font-black uppercase tracking-wide transition-all hover:bg-brand-accent-soft rounded-full"
            >
              {t("ctaSecondary")}
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            </Link>
          </div>
        </section>
      </Container>
    </ServicesParallax>
  );
}
