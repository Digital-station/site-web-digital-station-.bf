"use client";

import type { CSSProperties } from "react";
import dynamic from "next/dynamic";
import { ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Link } from "@/i18n/routing";
import { site, waHref } from "@/config/site.config";
import { Container } from "@/components/layout/Container";
import { WhatsAppIcon } from "@/components/ui/icons/WhatsApp";

/**
 * The woven-wave canvas is decorative and costs a canvas + rAF loop, so it is
 * split into its own chunk and never server-rendered.
 */
const Wavemesh = dynamic(
  () => import("@/components/decor/Wavemesh").then((m) => m.Wavemesh),
  { ssr: false },
);

/** Technologies we deploy. Proper nouns — deliberately not translated. */
const TECHNOLOGIES = [
  "Microsoft",
  "Odoo",
  "Oracle",
  "Autodesk",
  "Kaspersky",
  "AWS",
  "Salesforce",
] as const;

export function Hero() {
  const t = useTranslations("home.hero");
  const tc = useTranslations("common");
  const locale = useLocale();

  return (
    <section
      id="hero"
      className="relative pt-24 md:pt-40 lg:pt-48 pb-0 overflow-hidden lg:pl-16 min-h-[90vh] flex flex-col"
    >
      <Container className="flex-1 flex flex-col justify-center relative">
        {/* Woven-wave canvas backdrop */}
        <Wavemesh />

        <div
          aria-hidden="true"
          className="absolute -top-12 md:-top-20 left-4 text-[15vw] md:text-[240px] font-black opacity-[0.03] leading-none select-none tracking-tighter pointer-events-none uppercase"
        >
          {site.name}
        </div>

        <div className="relative z-10">
          <p className="enter [--enter-x:-50px] [--enter-delay:0.3s] text-brand-accent text-[11px] md:text-xs uppercase tracking-[0.3em] mb-6 md:mb-8 font-mono font-bold">
            {t("eyebrow")}
          </p>

          {/*
            `leading-[1.15]` and no `hyphens-auto`: 0.85 clipped the accents
            off capital É/À in the French headline, and 1.02 still let the È
            of "FRONTIÈRES" touch the R above it; automatic hyphenation broke
            the display words mid-syllable. `text-balance` keeps the lines
            even instead.
          */}
          <h1 className="text-5xl sm:text-6xl md:text-[104px] lg:text-[132px] font-black leading-[1.15] tracking-tighter uppercase mb-10 md:mb-12 text-balance break-words">
            <span className="block">
              <span className="enter [--enter-y:100px] block">
                {t("titleLine1")}
              </span>
            </span>
            <span className="block">
              {/*
                Forced line breaks, scoped to the widths where the fallback
                font and the webfont would otherwise wrap line 2 differently
                (fallback is wider, so on a slow connection the h1 paints
                with 5 lines and snaps to 4/3 when the font lands — a 52 px
                jump on phones, 143 px on desktop, measured as CLS 0.155).
                Where the two fonts already agree (640–1280 px, and English
                everywhere — its words are short) the spans flow naturally,
                so the design is untouched there. FR gets an explicit <br/>
                from its message string; EN has none to render.
              */}
              <span
                className={`enter [--enter-y:100px] [--enter-delay:0.1s] italic font-serif font-light lowercase pr-2 md:pr-4 opacity-80 ${
                  locale === "fr" ? "block sm:max-xl:inline-block" : "inline-block"
                }`}
              >
                {t("titleConnector")}
              </span>
              <span className="enter [--enter-y:100px] [--enter-delay:0.2s] inline-block">
                {t.rich("titleLine2", {
                  br: () => <br className="sm:hidden" />,
                })}
              </span>
            </span>
            <span className="block">
              <span className="enter [--enter-y:100px] [--enter-delay:0.3s] block text-brand-accent">
                {t("titleLine3")}
              </span>
            </span>
          </h1>

          <div className="enter [--enter-delay:1s] mb-12 md:mb-20">
            <div className="flex flex-wrap items-center gap-4 md:gap-6">
              {/* No prefetch: this link is in the initial viewport, so the
                  default viewport-prefetch would download the whole contact
                  route (form + validation, ~80 KB) on every home visit,
                  competing with the hero's own bytes. Below-fold contact
                  links still prefetch on approach. */}
              <Link
                href="/contact"
                prefetch={false}
                className="btn-primary group flex items-center gap-3 px-6 py-3 text-sm md:text-base md:px-8 md:py-4"
              >
                {t("cta")}
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>

              <a
                href={waHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline flex items-center gap-3 px-6 py-3 text-sm md:text-base md:px-8 md:py-4"
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
      </Container>

      {/*
        Technologies we deploy. Below `sm` the seven names sit in three
        EXPLICIT rows (2+2+3) instead of one wrapping flex row: the fallback
        font is wider than the webfont, so a wrapping row flips between 2
        and 3 rows when the font lands (and as the items stream in) — a
        52 px jump measured as CLS. Fixed rows can't rewrap; `min-h`
        reserves the full three-row height so late-streaming rows fill it
        instead of growing it. At `sm` and up the row wrappers dissolve
        (`contents`) and the seven items flow exactly as before — the two
        fonts already agree there. `text-xs` under 480 px keeps the widest
        fallback row inside a 360 px viewport.
      */}
      <div className="lg:pl-16 bg-brand-surface py-12 lg:py-16 border-t border-brand-border min-h-[270px] sm:min-h-0">
        <Container>
          <p className="text-[11px] md:text-xs uppercase tracking-wide text-brand-muted mb-8 font-black text-center lg:text-left">
            {t("partnersTitle")}
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center lg:justify-between items-center gap-8 md:gap-12 opacity-60 hover:opacity-90 transition-opacity duration-500">
            {[TECHNOLOGIES.slice(0, 2), TECHNOLOGIES.slice(2, 4), TECHNOLOGIES.slice(4)].map(
              (row) => (
                <div key={row.join("-")} className="flex justify-center gap-8 sm:contents">
                  {row.map((tech) => (
                    <div
                      key={tech}
                      className="text-sm max-[479px]:text-xs md:text-lg font-black uppercase tracking-tighter whitespace-nowrap"
                    >
                      {tech}
                    </div>
                  ))}
                </div>
              ),
            )}
          </div>
        </Container>
      </div>

      {/* Statement + the one remaining stat (10 service areas) */}
      <div className="border-t border-brand-border flex flex-col md:flex-row mt-auto w-full">
        <div className="md:w-1/2 md:border-r border-brand-border p-8 md:p-12 lg:p-20 flex flex-col justify-between gap-8 bg-brand-primary">
          <p className="text-lg md:text-2xl leading-relaxed text-brand-muted font-light max-w-lg">
            {t("statement")}
          </p>
        </div>

        <div className="md:w-1/2 grid grid-cols-2 bg-brand-accent-strong text-brand-on-accent">
          {/* Scroll reveals are `data-rv` (see RevealRoot): the old GSAP
              tween cost a ~110 KB dependency for a fade-up. */}
          <div
            data-rv
            className="border-r border-white/15 p-8 md:p-12 flex flex-col justify-center"
          >
            <span className="text-4xl md:text-5xl font-black mb-1">
              {t("statValue")}
            </span>
            <span className="text-[11px] md:text-xs uppercase tracking-wide font-black opacity-80">
              {t("statLabel")}
            </span>
          </div>
          <Link
            href="/contact"
            data-rv
            style={{ "--rv-delay": "0.15s" } as CSSProperties}
            className="p-8 md:p-12 flex flex-col justify-center group cursor-pointer relative overflow-hidden"
          >
            <div className="relative z-10 flex items-center justify-between gap-4">
              <span className="text-xl md:text-2xl font-black uppercase leading-tight italic text-balance">
                {t.rich("workWithUs", {
                  br: () => <br />,
                })}
              </span>
              <div className="w-11 h-11 md:w-12 md:h-12 rounded-full border-2 border-current flex items-center justify-center transition-transform group-hover:rotate-45 shrink-0">
                <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
              </div>
            </div>
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </Link>
        </div>
      </div>
    </section>
  );
}
